# SRD-00 — Modelo de domínio

Status: vigente
Linguagem: capacidades. Sistemas comerciais aparecem só como nota.
Proibido: linguagem, banco, nuvem, protocolo.

## 1. Capacidades

O núcleo deve ser capaz de:

- manter **PerfilDeBeneficio** vigente por colaborador;
- obter **dias úteis da competência** via porta **calendário oficial** (`CalendarioOficial`) (recorte 1: calculados, não digitados);
- **ler** a porta **planilha de controle** (`PlanilhaDeControle`) para pré-preencher (arquivo ou imagem — decisão D15); **gerar arquivo** se o Excel ainda for hábito; **não** sincronizar dois escritores no recorte 1;
- gerar **LoteMensal** a partir de perfis + calendário + política (carga da planilha alimenta rascunho, não substitui o calendário);
- congelar o lote e registrar **Conferencia**;
- emitir **ConsolidadoDePagamento** (agregado, para o e-mail dos diretores) e, se pedido, **exportação** da planilha via `gerar_arquivo` (projeção, não origem da verdade);
- executar o lote via porta **provedor de benefícios** (`ProvedorDeBeneficios`) com **somente** linhas **conferidas** (operador confirmou) — decisão D20; **a conferir** não entra no pedido — **sem** ok de diretor (diretores aprovam o pagamento, decisão D13);
- projetar lançamentos via porta **sistema financeiro** (`SistemaFinanceiro`);
- **gravar, ler e expirar** o comprovante do boleto via porta **armazenamento de comprovantes** (`ArmazenamentoDeComprovantes`) depois de autorizado a pagar — objeto no **bucket de comprovantes**, isolado da camada do cliente;
- reconciliar e reverter com trilha.

## 2. Entidades

| Entidade | Responsabilidade | Atributos de negócio (mínimos) |
|---|---|---|
| Colaborador | Quem recebe benefício | identidade interna, CPF no provedor (dado necessário), regime, departamento, ativo em |
| PerfilDeIdentidade | O que a porta identidade interna devolve | e-mail, área, nível de carga (fato F38); ativo, nome, departamento de rateio só se existirem (P18). Não é perfil de benefício |
| Departamento | Dimensão de rateio financeiro | nome; são 8 na operação atual |
| PoliticaDeBeneficios | Regras CLT/PJ, modalidades permitidas e parâmetros de valor | vigência; **CLT: Multibenefícios (padrão) + escolha ônibus XOR auxílio gasolina — ambos Flash (D19); PJ: Flexível**; três *slots* (D16); 4 SKUs se gasolina e VT no CNPJ; equivalente Flash `name`/`benefitId` **a confirmar** (P07, contrato — não copy da lista); valor diário de Multibenefícios, tabela de faixas, flexível, ônibus (cifras no cadastro, nunca inventadas) |
| PerfilDeBeneficio | Elegibilidade vigente | colaborador, regime, escolha de transporte, faixa de auxílio gasolina, vigência; override de valor só se a política não for única (valores ainda não informados — P01, P05) |
| EscolhaDeTransporte | Opção CLT na admissão | auxílio gasolina xor ônibus (a pessoa **não** escolhe Multibenefícios; cardinalidade “obrigatória vs no máximo uma” é premissa sobre a escolha na admissão, fato F11). **D19:** os dois lados são depósito Flash (premissa de recorte, não GET) |
| FaixaDeCombustivel | Tabela da política | `{5km, 10km, metropolitana}` → valor vigente |
| Competencia | Mês que o lote antecipa | ano-mês; corte cinco dias úteis antes é premissa (decisão D10) a confirmar; não é apuração |
| CalendarioDaCompetencia | Contagem de dias úteis | competência, dias úteis da competência, origem (oficial, recorte 1 — não célula da planilha) |
| CargaDaPlanilha | Extração que pré-preenche rascunho | competência, meio (arquivo \| imagem), ator, linhas lidas, falhas, divergências vs calendário; não é o lote |
| LoteMensal | Conjunto congelável de linhas | competência, estado, totais, confiança |
| ParcialDaCompetencia | Recorte de execução que percorre o ciclo inteiro | id (interno), competência, colaboradores ativos conferidos, pedido, boleto, lançamento, consolidado, autorizações, comprovantes (N). Várias por competência (D22). Não é segundo lote |
| LinhaDeLote | Crédito previsto ou exceção visível | colaborador, modalidade (incluindo escolha ônibus = Flash, D19), valor principal, dias úteis aplicados, departamento, situação, motivos, parcial_id quando enviada |
| ConsolidadoDePagamento | Visão imutável agregada para **pagamento** | id, totais por departamento, totais por modalidade, taxa do provedor, tarifa do sistema financeiro, taxa visível (soma), instrumento de pagamento quando existir, momento, lote_id |
| AprovacaoDePagamento | Voto de um diretor sobre o consolidado de pagamento | ator, consolidado_id, decisão, momento |
| PedidoNoProvedor | Projeção no provedor | referência externa, estado no provedor, data de crédito |
| DepositoNoProvedor | Projeção de uma linha | referência, valor principal, taxa, estado |
| LancamentoDepartamental | Projeção no ERP | departamento, valor, documento de pagamento, consolidado_id |
| EventoDeAuditoria | Fato imutável | ator (identidade interna), tipo, antes/depois de negócio, momento. **Tipos D25:** `conferiu`, `anexou comprovante` — existem no contrato; **não** prescrevem card dump-list na UI |
| ComprovanteDePagamento | Objeto do desembolso no bucket | consolidado_id (interno), nome, momento, **onde** (bucket de comprovantes + caminho), id opaco; vários por competência; não é o boleto do provedor nem anexo de e-mail |
| TaxaDeAutomatizacao | Fora do recorte 1 de tela (F45/H11) | 95% da sala não é situação **conferida (automática)** |

Valores monetários no domínio: **inteiros em centavos**.

## 3. Invariantes

1. Um `LoteMensal` por competência em estado não terminal. Novo rascunho só se o anterior foi cancelado/revertido/falhou de forma encerrada, ou ainda é rascunho.
2. Linha de **depósito** só usa modalidade da política (as declaradas da Morada). Modalidade bloqueada é inexequível.
3. CLT: **Multibenefícios** presente (padrão; equivalente Flash **a confirmar** no contrato, P07 — não na lista). Escolha de transporte: auxílio gasolina XOR ônibus (lei de elegibilidade — a pessoa **não** escolhe comida). Duas linhas sempre: Multibenefícios padrão + escolha (gasolina **ou** ônibus) — não XOR comida vs combustível. **D19:** ônibus é depósito Flash (premissa de recorte; o financeiro não disse). Não omitir CLT-ônibus. **A conferir** só por cadastro/valor/outro motivo — não por canal desconhecido (P06 fechada). Linha de ônibus entra na soma do principal quando tem valor.
4. PJ: só Flexível. Sem escolha ônibus XOR auxílio gasolina. Sem Multibenefícios CLT.
5. No máximo uma linha **executável** por `(competencia, colaborador, modalidade)`.
6. Soma das linhas executáveis = total do lote (principal). Soma dos 8 departamentos = mesmo total. Linha **a conferir** sem valor (cadastro) não soma.
7. Lote congelado (em conferência em diante, salvo retorno explícito a rascunho) não recalcula em silêncio.
8. Invariante de payload (D20): as etapas Flash → Banco só carregam linhas **conferidas** (operador confirmou, D23). **A conferir** permanece no lote e **não** entra no `PedidoNoProvedor`, na espera do retorno, no `LancamentoDepartamental` nem no `ConsolidadoDePagamento`.
9. Pedido confirmado no provedor atual é imutável no provedor; correção interna é reversão + novo fato, não editar o depósito já confirmado.
10. Lote congelado é a verdade; `PedidoNoProvedor`, `LancamentoDepartamental` e planilha **gerada** (`gerar_arquivo`) são projeções. Planilha **lida** (`ler_linhas`) é origem de carga, não verdade da competência.
11. Correção de linha após emitir consolidado de pagamento invalida o consolidado.
12. Identidade de operação é interna (e-mail corporativo). CPF não é login do backoffice.
13. Recorte 1: execução no provedor **não** espera diretor (decisão D13). Diretores aprovam **pagamento** (boleto/banco) sobre consolidado de pagamento identificável no e-mail (link da etapa 5), não planilha solta (decisão D14). Só linhas **conferidas** viram crédito no pedido (D20). Recusa de pagamento não desfaz pedido confirmado. Diretor não opera linha.
14. Recorte 1 da carga (decisão D15): `ler_linhas` pré-preenche rascunho; não executa; não sobrescreve dias úteis do calendário sem divergência visível. `sincronizar` não opera. Imagem é adaptador da mesma porta.
15. Recorte comprovante (decisão D21): `gravar` só depois dos dois oks de pagamento. Verdade do arquivo = objeto na porta `ArmazenamentoDeComprovantes`, não a caixa de entrada. Isolado da camada do cliente.
16. Recorte de parciais (decisão D22): a competência admite **N** `ParcialDaCompetencia`. Cada parcial é um `PedidoNoProvedor` + boleto + `LancamentoDepartamental` + `ConsolidadoDePagamento` + oks + comprovantes. **Não se sobrescreve** a anterior. 1 colaborador ativo conferido percorre o ciclo inteiro; N conferidas em lote = uma parcial de N (acelerador, não outro processo). Flash lista só quem entra **nesta** parcial. Banco materializa **todas**. A entrevista **não** disse um pedido por competência (**P31**: também não perguntou se os dados da parcial mudam depois). Chave `(competencia, colaborador, modalidade)` impede o mesmo par em duas parciais. Lista Beneficiários = só colaboradores **ativos na empresa**; desligada / inativa / após o corte não é linha do lote. **Invariante de instrumento:** N pedidos = N instrumentos de pagamento. A taxa visível **soma por pedido**. **Hipótese de produto H20** (guia: **hipótese sua**): minimizar N. O recorte **não** bloqueia N>1.
17. Recorte conferir → resumo Flash (decisão D24): o ato de **conferir** (1 colaborador no detalhe ou N em **Marcar como conferidos**) marca **conferida** e abre a `ParcialDaCompetencia` no resumo da etapa Flash. **Confirmar envio ao Flash** dispara `criar_pedido` no provedor. Não há segundo verbo de lote na lista Beneficiários nem “lançar no Omie” nessa barra. Omie é etapa 4 do wizard (mock no recorte 1; sem rótulo “recorte 2” na UI). D20 permanece: só conferidas entram no pedido.
18. Taxa visível = taxa do provedor (soma das taxas de cada depósito na confirmação **daquele pedido**) **+** tarifa publicada do sistema financeiro atual × boletos **daquela parcial**. As duas parcelas **não** se misturam. Principal do lote **não** dilui a taxa. N pedidos = N somas. Quem paga, se a taxa existe na operação Morada, e se fatiar gera N taxas = pendência P11 (a entrevista **não perguntou**). Proto: Flash **R$ 1,00** no retorno = premissa de simulação, não medição. **H20** assume que minimizar N evita taxa extra — hipótese sua, não fato da sala.
19. Auditoria nominativa (D25): cada `conferiu` e cada `anexou comprovante` guarda ator da porta `IdentidadeInterna`, momento e objeto (beneficiários da parcial **ou** comprovante). O operador da identidade interna é quem conferiu — não o colaborador beneficiário. Outros tipos de `EventoDeAuditoria` permanecem no contrato. A UI **não** exige dump-list **Histórico da esteira** sob o wizard (recorte de UI). Comprovante: **Quem anexou** no objeto da etapa Banco.
20. Recorte grupo espera (D26): a `ParcialDaCompetencia` **não parte no meio da etapa**. Quem passou da etapa N espera a ação da etapa N+1 com o mesmo conjunto. Outra parcial = outro grupo (D22).
21. Espera do retorno (D27): depois de `confirmar_pedido`, o financeiro **espera** taxa + boleto **antes** de lançar no sistema financeiro. Desenho da etapa **Boleto** (etapa 3, não da etapa Flash); não invalidado pelo fato de o provedor atual não publicar webhook (F49).
22. Canal da espera (D28): a operação que cobre D27 é `consultar_pedido`. Poll **automático** no recorte 1. Não é rejeição do desenho; é adaptação da porta `ProvedorDeBeneficios`.
23. Disparo manual (D29): o operador dispara a **mesma** `consultar_pedido` (mesmo pedido) na etapa Boleto quando a espera automática falha, esgota ou o estado da tela diverge do provedor. Chrome: **Atualizar retorno**. Não nasce porta extra.
24. Hipótese de produto (H20): o caminho feliz **recomenda** conferir o conjunto dos que vão receber **antes** de `confirmar_pedido`, para N=1 instrumento na competência. **Não** é invariante de bloqueio: D22 permanece (N>1 é executável). Motivo de minimizar N = taxa extra por pedido/boleto — **premissa do candidato** (guia: premissas adotou); a entrevista não perguntou se a taxa existe (P11). Fórmulas Flash soma das `fee` e Omie R$ 1,99 = fato de documentação do provedor atual.

## 4. Estados e transições — LoteMensal

Estados do lote, em português:

```
rascunho → em conferência → em execução → conciliado | falhou | revertido
```

Aprovação de pagamento (diretores) é trilha **paralela depois** da confirmação do pedido, não um estado entre conferência e execução.

Estados terminais: conciliado, falhou (se encerrado sem crédito útil e sem nova tentativa), revertido. Falhou pode reabrir para em conferência se o pedido no provedor foi desfeito.

| De | Para | Ator | Guarda |
|---|---|---|---|
| (novo) | rascunho | operador / sistema no corte | competência aberta; sem lote ativo conflitante |
| rascunho | rascunho | operador | regenerar **ou** `ler_linhas` (carga): substitui linhas com evento; divergência de dias visível |
| rascunho | em conferência | operador | toda linha ou em valor válido ou em exceção explícita; nenhuma linha “vazia” |
| em conferência | rascunho | operador | pedido de recálculo; descarta congelamento |
| em conferência | em execução | operador | ao menos uma linha **conferida** candidata a depósito; o pedido contém só essas (D20); **a conferir** permanece no lote; sem ok de diretor (pagamento fica depois) |
| em execução | conciliado | sistema | principal do lote = principal do provedor = ERP (quando a projeção ERP existir); senão recorte 1: lote = provedor e ERP marcado “manual conferido” |
| em execução | falhou | sistema | erro não compensado; pedido incompleto ou recusa do provedor após tentativa de compensação |
| em execução | revertido | operador + sistema | reversão explícita concluída |
| falhou | em conferência | operador | provedor sem pedido confirmado residual |

Não há salto rascunho → em execução. Não há guarda de diretor em em conferência → em execução.

**AprovacaoDePagamento** (depois do pedido confirmado / boleto): pendente → autorizado \| recusado. Dois diretores distintos sobre o mesmo consolidado de pagamento. Recusa não desfaz o pedido confirmado.

Estados auxiliares de **PedidoNoProvedor** (projeção, não o lote): criado → com depósitos → confirmado → creditado | cancelado. Confirmado implica imutabilidade no provedor atual.

Estados de **LinhaDeLote** na conferência (copy da tela, D23): `a conferir`, `conferida`. Linha excluída não vira depósito. Pipeline do ciclo não é estado da linha. **A informar** é valor, não estado.

## 5. Portas (visão)

Definidas em [SRD-01](SRD-01-contratos-de-capacidade.md#mapeamento-produto--porta) (tabela canônica produto ↔ porta): identidade interna, calendário oficial, provedor de benefícios, sistema financeiro, **planilha de controle**, **armazenamento de comprovantes**. Lote congelado, consolidado de pagamento e comprovante de pagamento são entidades, não portas. **Observância da integração** é superfície da política de entrega das duas portas que escrevem efeito — também não é porta.

O domínio não conhece painel ou e-mail como entidades. A **planilha de controle** entra pela porta `PlanilhaDeControle`: lida = carga (decisão D15, hábito de preenchimento permanece); gerada = projeção (decisão D11). Imagem da grade é adaptador, não entidade. E-mail é canal transitório da **aprovação de pagamento** (decisões D13 e D14) — **não** é o depósito do comprovante (D21). O comprovante entra pela porta `ArmazenamentoDeComprovantes` (bucket de comprovantes).

## 6. Qualidade

Idempotência, isolamento, LGPD e modos de falha: [SRD-02](SRD-02-qualidade-risco-e-medicao.md).

## 7. Fora do contrato

- Schema de persistência, IDs técnicos de fornecedor como modelo interno (só referências na projeção).
- UX do backoffice.
- Quantos pedidos físicos o provedor atual exige se Q12 revelar filiais.
