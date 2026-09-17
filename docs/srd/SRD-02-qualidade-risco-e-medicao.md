# SRD-02 — Qualidade, risco e medição

Status: vigente
Complementa SRD-00 e SRD-01. Sem stack.
Portas nomeadas: [SRD-01, mapeamento produto ↔ porta](SRD-01-contratos-de-capacidade.md#mapeamento-produto--porta).

## 1. Capacidades

O sistema deve ser capaz de:

- isolar esta operação da camada do cliente;
- executar efeitos de depósito e de lançamento **no máximo uma vez** por chave de negócio;
- tratar o lote congelado como verdade e as portas como projeções (planilha **lida** é carga, não verdade);
- ler a planilha de controle para pré-preencher sem executar e sem calar divergência de dias;
- minimizar e proteger CPF e demais dados pessoais;
- degradar com estado explícito (falhou, revertido), não com silêncio;
- aplicar a **política de entrega** compartilhada (espera progressiva + fila de não processados) nas portas que escrevem efeito — sem sexta porta;
- deixar o operador ver e retentar a fila na **Observância da integração** (`ObservanciaDaIntegracao`);
- emitir as métricas do recorte.

## 2. Isolamento da camada do cliente

Fato da descoberta (quem avalia a dinâmica): integração interna é arquitetura própria, isolada da camada que atende incorporadoras e imobiliárias.

Invariantes:

- Falha, lentidão ou manutenção de benefícios **não** degradam MIA, Sales ou Iago.
- Identidade, credencial e dados de CPF desta operação não trafegam nos produtos de cliente.
- Backoffice interno é o habitat; não se publica portal de benefícios no produto de cliente no recorte 1.
- O comprovante do boleto vive no **bucket de comprovantes** (porta `ArmazenamentoDeComprovantes`), não na camada do cliente nem como verdade no e-mail.

## 3. Idempotência

Chave de efeito de depósito: `(competencia, colaborador, modalidade)`.

- Repetir `adicionar_deposito` com a mesma chave não cria segundo depósito no pedido (o provedor atual já recusa o par duplicado; o domínio **também** recusa antes).
- Regenerar rascunho não dispara provedor.
- Reprocessar em execução após interrupção retoma o que falta, não recomeça o que já tem referência.
- Chave de lançamento ERP: `(competencia, departamento, consolidado_id)`. Repetir não cria 16 linhas onde cabem 8.
- **Retentativa automática e retentativa humana** (fila de não processados) **reusam** a mesma chave. Consultar o efeito (`orderId` / `depositId` / referência de lançamento) **antes** de repetir o verbo. `409` no provedor atual é sinal para amarrar o depósito existente, não para repetir o depósito às cegas.

Confirmar pedido é efeito único por **pedido da parcial** (`pedido_id` / D22). Segunda confirmação do mesmo pedido é consulta, não novo faturamento. A competência admite vários pedidos; cada um confirma uma vez.

### 3.1 Espera progressiva e fila de não processados

Política única das portas `ProvedorDeBeneficios` e `SistemaFinanceiro`. Superfície: **Observância da integração**. Códigos do sistema atual: `docs/integracoes/flash.md` (recorte 1) e o mesmo padrão em `docs/integracoes/omie.md` (recorte 2 / mock). Não é broker.

**Espera progressiva:** intervalo **exponencial com jitter**. N tentativas a calibrar no 1º ciclo — este contrato não inventa N.

Invariantes:

1. Falha **transitória** (`5xx`, timeout; no Flash também `409` e `422` já faturado/confirmado, sempre via consulta) entra na espera. Falha **permanente** de negócio (`400` no provedor atual) **não** entra — vai à fila na hora.
2. Depois de N tentativas sem efeito correlacionável à chave, a automática **para** e o item entra na **fila de não processados**. Silêncio = defeito.
3. Cada item da fila guarda: payload, etapa (`criar pedido` | `depósito` | `confirmar` no provedor; no ERP, o verbo da porta), colaborador (vazio se a etapa for criar pedido), competência, erro, momento da primeira falha (para idade da fila).
4. Motivo de **depósito falhou** ≠ motivo de **confirmação falhou**. Pedido confirmado no provedor atual é imutável: retentar depósito como montagem, ou confirmar de novo um pedido já faturado, é o modo **duplicidade disfarçada de retentativa**.
5. Item na fila não confirma lote, não concilia e não altera o lote congelado.
6. Retentar pela observância é o mesmo caminho idempotente da automática — não um atalho que ignora a chave.

## 4. Consistência

**Lote congelado é a fonte da verdade.** Provedor e ERP são projeções.

| Situação | Verdade | Ação |
|---|---|---|
| Linha no lote, sem depósito | lote à frente | completar execução ou excluir linha com evento |
| Depósito sem linha | projeção órfã | cancelar depósito se ainda possível; senão falhou |
| Totais lote ≠ provedor | divergência | não conciliado |
| Totais lote ≠ ERP | divergência | não conciliado (quando a projeção ERP existir) |
| Consolidado ≠ lote atual | consolidado inválido | reemitir; aprovações antigas caducam |
| Dias na planilha lida ≠ calendário | calendário é verdade dos dias; flag visível | não gravar a célula como competência |
| Lote congelado vs nova carga | lote à frente | recusar `ler_linhas` até voltar a rascunho |

Não há “ajuste só no Flash” nem “ajuste só no Omie” como procedimento feliz.

## 5. LGPD e CPF

- CPF é exigência do depósito no provedor atual, não identificador do backoffice.
- Finalidade: executar e conciliar o benefício. Sem marketing, sem camada cliente.
- Consolidado de pagamento para diretor: agregados, sem lista de CPFs.
- Operador vê detalhe sob papel; exportações e **cargas** (arquivo ou imagem) são eventos de auditoria. Imagem da planilha pode conter nome e departamento — mesma finalidade da carga, sem camada cliente.
- Retenção: alinhar à necessidade fiscal/trabalhista — **PENDÊNCIA** jurídica (não chute de prazo neste SRD).
- Credencial administrativa do provedor (hoje CPF de três pessoas) não é o modelo de autorização do produto; o produto autoriza por papel interno.

## 6. SLAs de negócio (não de infra)

Premissas de serviço, a calibrar no 1º ciclo:

| Momento | Expectativa |
|---|---|
| Geração do lote no corte | no mesmo dia útil do corte, para os ~73 colaborador |
| Conferência recorte 1 | cabe em um turno do financeiro (baseline a medir) |
| Execução no provedor após aprovado | no mesmo dia útil da aprovação, se a data de crédito for válida |
| Crédito no cartão | na data de crédito confirmada; se o provedor atrasar, lote não mente conciliado |
| Falha de porta na execução | estado em execução ou falhou visível; sem pedido confirmado à revelia; transitório visível na espera, permanente ou esgotado na fila de não processados |

SLA de disponibilidade da camada cliente **não** se aplica a este bounded context — e vice-versa.

## 7. Modos de falha do lote

Análise no espírito de DFMEA, aplicada ao lote mensal.

| Modo | Gravidade | Detecção | Mitigação | Evidência |
|---|---|---|---|---|
| Valor errado (diário, faixa, PJ) | alta (crédito indevido) | exceção vs competência anterior; cadastro vazio | valores no cadastro (pendências P01, P02, P05); conferência; sem inventar cifra | taxa de correção de valor |
| Nome / pessoa errada | alta | mapeamento identidade ↔ provedor | recusar depósito sem mapeamento; nunca copiar linha vizinha | 0 depósito órfão de identidade |
| Modalidade errada (5 vs 3) | alta | política bloqueia as 2 | lista de benefícios permitidos na geração (pendência P07) | 0 execução fora das 3 |
| Dias úteis errados | média | calendário oficial vs planilha lida | hoje o financeiro preenche na mão (fato F30); recorte 1 calcula; carga **compara** no calendário da competência (D15) — a planilha não sobrescreve em silêncio; sem situação “dias divergem” na lista (D23); feriado municipal explícito (pendência P12) | divergência da contagem manual vs calendário (hipótese H05) |
| Célula errada na carga | alta | origem da extração visível na conferência | `ler_linhas` não executa; conferência obrigatória (PRD-04) | 0 execução sem conferência após carga |
| Imagem ilegível | média | falha explícita do adaptador | recusa ou linha em exceção; sem palpite | 0 célula inventada |
| Dois escritores (sync) | alta | recorte 1 não dispara `sincronizar` | D15: carga unidirecional + `gerar_arquivo` | 0 merge invisível no recorte 1 |
| Duplicidade colaborador+modalidade | alta | invariante + recusa do provedor | chave de idempotência (pendência P20) | 0 par duplicado no pedido |
| Retentativa que duplica efeito | alta (crédito ou lançamento em dobro) | chave + consulta antes do verbo | espera progressiva **não** é segundo efeito; `409` amarra o existente; confirmar sem resposta → consultar, não faturar de novo | 0 segundo depósito/lançamento da mesma chave |
| Confirmar de novo pedido já faturado | alta (imutabilidade do pedido) | `consultar_pedido` antes de `confirmar_pedido` | 422 já confirmado/faturado = sucesso da etapa confirmar, não item de depósito na fila | 0 segundo faturamento **por pedido** (várias parciais = vários pedidos, D22) |
| Depósito em pedido já confirmado | alta | etapa da fila distinta | item na fila com motivo **depósito em pedido imutável**; não misturar com falha de confirmar | 0 depósito adicionado após confirmado |
| Recusa permanente de negócio em loop de espera | média (esconde bug de cadastro/data) | recusa permanente fora da espera | fila na hora; observância | 0 espera em recusa permanente |
| Fila invisível / item sumido | alta (bug de integração sem dono) | idade da fila + listar não processados | observância obrigatória; lote não concilia com item aberto | 0 esgotamento sem item |
| Feriado municipal ignorado | baixa a média | pendência P12 | não esconder o nacional como se fosse municipal | ajuste justificado |
| Desligado no lote | alta | identidade `ativo na data` + conferência | premissa sobre desligamento no meio do mês (pendência P10); exclusão explícita | 0 crédito a inativo conhecido |
| Admissão após corte excluída indevidamente | média | pendência P09 | premissa consciente; lista “fora deste lote” visível | reclamações de admissão |
| Pedido confirmado incompleto | alta | contagem depósitos vs linhas aceitas | não confirmar se contagem divergir | 0 confirmação incompleta |
| Divergência provedor vs ERP | alta | conciliação de totais; `consultar_pedido` (poll D28 + manual D29) **antes** de Omie | lote como verdade; 8 rateios do consolidado; D27: Omie só depois do retorno | competência conciliado |
| Espera do retorno falha / tela ≠ provedor | alta (Omie sobre estado mentiroso) | etapa **Boleto**; operador dispara `consultar_pedido` (**Atualizar retorno**, D29) | mesma porta e mesmo pedido da espera (D28); não webhook; não segunda integração; não segue a Omie até o retorno bater | 0 Omie sem retorno conferido |
| Aprovação de consolidado velho | alta | id do consolidado na guarda | invalidar o consolidado após correção | 0 pagamento com consolidado caduco |
| Taxa omitida | média | pendência P11 (a entrevista **não perguntou** se existe taxa, quem paga, nem se N boletos = N taxas) | taxa à parte, **Flash vs Omie vs soma** discriminadas **por pedido**; H20 recomenda minimizar N sem bloquear D22 | conciliação inclui as duas parcelas de cada pedido |
| Trilha nominativa só no toast | média (caça o ator) | hipótese H18 | D25: eventos `conferiu` / `anexou comprovante` gravados; Banco mostra **Quem anexou** no arquivo; sem card dump-list sob o wizard | 0 anexo sem ator no comprovante |
| Falha no meio da lista de depósitos | alta | estado por linha | retomar; não confirmar | lote falhou ou completo |
| Reversão depois de creditado | alta | pendência P24 | não automatizar estorno no recorte 1 | evento humano |
| Vazamento para camada cliente | crítica | fronteira de isolamento | habitat = backoffice interno | incidente zero |
| E-mail de pagamento sem trava | alta (aprovação solta — hipótese H07) | pagar só com dois oks no consolidado de pagamento | recorte 1 emite consolidado no e-mail (decisões D13, D14); execução Flash não espera isso | trilha |
| Comprovante só no e-mail | média (conferência sem objeto — hipótese H17) | objeto na porta `ArmazenamentoDeComprovantes` | D21: gravar depois de autorizado a pagar; UI mostra **onde**; e-mail não é o depósito | 0 desembolso conferido sem referência de objeto |

## 8. Métricas

Baseline = primeiro ciclo instrumentado. Sem meta 95% inventada. Payload Flash = só **conferidas** (D20).

| Métrica | Como observar | Comparar com |
|---|---|---|
| Tempo de lançamento no provedor | momento conferido → pedido confirmado | ciclo atual (digitação painel) |
| Tempo total do ciclo | corte → crédito | ciclo atual |
| Conferidas pelo operador | linhas **conferida** / linhas do ciclo | recorte 1 (D23); H11 fora da tela |
| Tempo até o crédito | confirmação → disponível no cartão | provedor |
| Conciliação de totais | lote vs provedor vs ERP | 0 divergência em conciliado |
| Pagamentos bloqueados por consolidado caduco | contagem | deve ser >0 se o invariante funciona (bloqueio é sucesso) |
| Créditos a desligados | contagem | 0 conhecidos |
| Incidentes de isolamento | contagem | 0 |
| Taxa da fila de não processados | itens que entraram na fila / tentativas de efeito na porta (competência) | 1º ciclo; alta taxa = bug de integração ou N curto demais |
| Idade da fila | tempo desde a primeira falha do item mais velho (e p95 da fila aberta) | fila velha = observância sem dono |
| Recuperados na espera | efeitos que bateram depois de 2…N sem ir à fila | espera útil vs N inútil |

## 9. Fora do contrato

- Ferramenta de APM, formato de log, provedor de métricas.
- Broker de fila de fornecedor (SQS e equivalentes) e o valor numérico de N (calibra no 1º ciclo).
- Política jurídica fechada de retenção (PENDÊNCIA).
- Penetration test da camada cliente (outro contexto).
