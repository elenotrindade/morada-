# Operação de benefícios

Bounded context interno da Morada: elegibilidade, lote mensal e conciliação de créditos de benefício. Isolado da camada do cliente. Linguagem canônica; o vocabulário da sessão está em [`docs/discovery/glossario.md`](docs/discovery/glossario.md).

**Produto ↔ porta:** tabela canônica em [`docs/srd/SRD-01-contratos-de-capacidade.md`](docs/srd/SRD-01-contratos-de-capacidade.md#mapeamento-produto--porta) (identidade interna, calendário oficial, provedor de benefícios, sistema financeiro, planilha de controle, **armazenamento de comprovantes**). Identificadores PascalCase são face de contrato, não copy de tela. **Política de entrega** (espera progressiva + fila de não processados) não é sexta porta: aplica-se às duas portas que escrevem efeito; o operador acompanha na **Observância da integração** — [`docs/integracoes/`](docs/integracoes/) e [SRD-02](docs/srd/SRD-02-qualidade-risco-e-medicao.md). Carga da planilha: [`docs/prd/PRD-04-carga-da-planilha.md`](docs/prd/PRD-04-carga-da-planilha.md) (decisão D15). Comprovante do boleto: [PRD-03](docs/prd/PRD-03-financeiro-e-governanca.md) (decisão D21) e [docs/integracoes/comprovantes.md](docs/integracoes/comprovantes.md). Cifras do proto: [`docs/proto-semente.md`](docs/proto-semente.md) (PREMISSA DE PROTÓTIPO, não fato da entrevista). O que a entrevista confirma no backoffice vs palpite: [`docs/discovery/fontes-de-dados.md`](docs/discovery/fontes-de-dados.md) (pendência P18).

## Pessoas

**Colaborador**:
Pessoa elegível a benefício na competência (CLT ou PJ). Na lista Beneficiários: só **ativos na empresa**.
_Avoid_: funcionário, usuário, candidato; listar desligada como linha do lote

**Regime**:
Vínculo que seleciona a política: `CLT` ou `PJ`.
_Avoid_: modalidade de contratação

**Departamento**:
Unidade de rateio no sistema financeiro (hoje: oito).
_Avoid_: área, time, squad, nível de carga — não são sinônimos até o mapa (P18)

**Área**:
Atributo do backoffice (fato F38). Pode não ser o mesmo recorte do departamento de rateio.
_Avoid_: tratar área = departamento como fato

**Nível de carga**:
Atributo do backoffice (fato F38). Não é departamento. Não entra no cálculo de benefício até decisão em contrário.
_Avoid_: faixa, regime, unidade de rateio

**Perfil de identidade**:
O que a porta identidade interna devolve sobre a pessoa na Morada. Distinto de **perfil de benefício**. Entrevista confirma e-mail `@morada`, área, nível de carga — não regime, escolha de transporte nem faixa ([`fontes-de-dados.md`](docs/discovery/fontes-de-dados.md)).
_Avoid_: misturar com perfil de benefício; assumir CLT/PJ ou ônibus/carro no backoffice

**Financeiro**:
Papel interno que monta o ciclo, confere o lote e dispara a execução.
_Avoid_: admin do provedor

**Diretor**:
Um dos dois aprovadores do desembolso do ciclo.

## Política

**Política de benefícios**:
Regras e parâmetros vigentes (modalidades liberadas, fórmulas, tabela de faixas). Cifras vivem no cadastro versionado, não neste glossário.

**Elegibilidade**:
Direitos estáveis do colaborador: regime, escolha de transporte, faixa. Não é o valor da competência.

**Perfil de benefício**:
Elegibilidade materializada, com vigência. Cadastro-mestre da escrita no recorte (decisão D11, premissa reversível, não acordo da sala). Entrada do cálculo; não é o lote. Distinto de **perfil de identidade**.

**Escolha de transporte**:
Opção CLT na admissão: **auxílio gasolina XOR cartão de ônibus** (na sala: vale-combustível XOR cartão de ônibus). A pessoa **não** escolhe Multibenefícios. Atributo de elegibilidade. **D19:** os dois lados são depósitos Flash (premissa de recorte; o financeiro **não** disse o canal do ônibus).
_Avoid_: modalidade (para esta escolha), vale-transporte como fato da sala, XOR comida vs combustível

**Modalidade**:
Tipo de crédito no provedor. **Fato:** a Morada declara usar três das cinco do provedor atual. **Decisão D16 + D19:** os três *slots* são Multibenefícios + (gasolina \| ônibus) + Flexível PJ; ambos os lados da escolha são depósitos Flash. Se gasolina e VT estiverem habilitados no CNPJ, são **4 SKUs** — tensão com “usamos 3”; GET **não** rodou. **Hipótese (H16, P07) — contrato, não copy da lista:** equivalente de depósito (`name`/`benefitId`) a confirmar — Alimentação e refeição, Auxílio Mobilidade, Vale-transporte, Flexível.
_Avoid_: promover SKU Flash a regra; XOR comida vs combustível numa pessoa CLT; dizer que o GET já rodou

**Multibenefícios** (fato da sala; padrão CLT; um dos três *slots* — D16):
Carteira CLT **obrigatória** de alimentação e refeição. A pessoa não escolhe. Fórmula: valor diário × dias úteis nacionais da competência **antecipada**. **Não** é o cartão de marketing Flash “Multibenefícios” (carteira livre). Equivalente de depósito Flash: `name`/`benefitId` a confirmar (hipótese: **Alimentação e refeição**).
_Avoid_: usar o marketing Flash para este crédito; tratar como um lado da escolha de transporte

**Auxílio gasolina** (copy do operador; sala: vale-combustível / combustível; lado Flash da escolha — D16, D19):
Lado da escolha de transporte CLT, XOR cartão de ônibus. Valor fixo da faixa; não varia com dias úteis. Equivalente de depósito Flash: `name`/`benefitId` a confirmar (hipótese: **Auxílio Mobilidade** / combustível). A transcrição não disse “gasolina”; a sala disse vale-combustível.
_Avoid_: SKU Flash como copy primário; XOR com Multibenefícios

**Cartão de ônibus**:
Lado da escolha de transporte. **D19 (premissa de recorte, não GET):** depósito Flash, XOR gasolina. Equivalente `name`/`benefitId` a confirmar (hipótese Vale-transporte). Os três *slots* da empresa: Multi + (gasolina \| ônibus) + Flexível; 4 SKUs se gasolina e VT estiverem ambos no CNPJ. Não omitir a pessoa. Pode ficar **a conferir** por cadastro — não por P06.
_Avoid_: vale-transporte como fato da sala, omitir em silêncio, tratar ônibus como fora do Flash

**Flexível** (um dos três *slots* — D16):
Modalidade PJ, valor mensal fixo, sem escolha de transporte e sem variação por dias úteis. Equivalente de depósito Flash: `name`/`benefitId` a confirmar (hipótese: Saldo Flexível; site Flash: Multibenefícios = carteira livre — homônimo, não o crédito CLT da sala).
_Avoid_: benefício PJ; tratar a fala “Multibenefícios” da sala como este crédito

**Faixa de combustível**:
Um de `{5 km, 10 km, metropolitana}`, fixada na admissão até alteração de endereço aceita.
_Avoid_: km, região

**Dias úteis nacionais**:
Dias da competência que não são sábado, domingo nem feriado nacional. Entrada só de **Multibenefícios**. **Hoje** o financeiro preenche na planilha (fato F30); **no recorte 1** o calendário oficial calcula — a planilha não escreve esse número. Se a carga ler uma coluna de dias, **compara**; não sobrescreve o calendário em silêncio (decisão D15). Porta no contrato: `CalendarioOficial`.
_Avoid_: feriado municipal como fato; campo mensal digitável

## Ciclo

**Competência**:
Mês de referência que o lote **antecipa**: o crédito sai antes do mês começar. Premissa de política (decisão D10), não fato da sala.
_Avoid_: apuração, competência já ocorrida

**Data de corte**:
Instante em que se decide quem entra no lote. Premissa de política: cinco dias úteis antes do início da competência (decisão D10), a confirmar com o financeiro. Quem está ativo no corte leva o mês financiado.

**Planilha de controle**:
Artefato atual (sistema-sombra de **hoje**, fato F21). Recorte da **carga** (decisão D15): continua o hábito de preenchimento; o sistema **lê** (arquivo ou imagem) para pré-preencher. **Gerar planilha** devolve arquivo se ainda precisarem do Excel. Não é escritora de dias úteis — calendário oficial manda; divergência visível. D11 (perfil escreve) é o destino da escrita, **não** acordo da sala para matar o Excel. Porta: `PlanilhaDeControle`.
_Avoid_: lote, tratar a planilha gerada como cadastro-mestre, sync bidirecional no recorte 1, “IA” como quinto produto

**Lote**:
Conjunto da competência: linhas (colaborador × modalidade × valor) e totais por departamento. Depois de congelado (**lote congelado**), é a verdade do ciclo; provedor e sistema financeiro são projeções.
_Avoid_: recarga, planilha, pedido

**Congelamento**:
Proibição de recálculo silencioso. Não significa linhas imutáveis: correção na conferência é evento e invalida o consolidado de pagamento.

**Linha do lote**:
Um crédito previsto: um colaborador, uma modalidade, um valor na competência.

**Conferência**:
Revisão humana, pelo financeiro, das linhas do lote (crédito ao colaborador) antes de executar. Não é o ok dos diretores. Nome lógico do ato; na UI a etapa e a ação visível são **confirmar benefício**.
_Avoid_: aprovação, ok de diretor, confirma crédito

**Confirmar benefício**:
Copy da etapa 1 = lista Beneficiários. Ação: **Conferir** / **Marcar como conferidos**. O clique abre o resumo Flash (D24). **Confirmar envio** dispara o provedor.
_Avoid_: confirma crédito, confirmar crédito, segundo botão Enviar ao Flash na barra, Omie em lote

**Confiança** / **taxa de sucesso da automatização**:
Hipótese H11 / fala F45 — **fora da tela recorte 1**. Payload do wizard (D20): só **conferidas**. Conferir abre o resumo Flash (D24). **A conferir** fica na lista. O 95% da sala não é enum nem SLA.
_Avoid_: confiabilidade da API, execução automática sem revisão, pular conferência, 95% inventado, chip conferida (automática)

**Depósito**:
Crédito de uma modalidade para um colaborador no provedor, dentro de um pedido.
_Avoid_: lançamento, recarga

**Lote**:
Conjunto congelável da competência. **Um** lote. Execução em **parciais** (D22).

**Parcial**:
Recorte que percorre o ciclo inteiro. 1 pessoa ou N conferidas. Histórico acumula. Flash = esta caminhada. Banco lista todas. **D22:** possível. **H20 (hipótese sua):** caminho feliz = conferir quem vai receber **antes** de um envio, para não somar taxa extra. Não é fato da entrevista.

**Pedido no provedor**:
Agrupamento de depósitos de **uma parcial**. Vários na competência (D22).

**Execução**:
Envio ao provedor **só** das linhas **conferidas** (decisão D20). Conferir abre o resumo; **Confirmar envio** dispara (D24). **A conferir** não entra no pedido. Não espera ok de diretor (decisão D13).

**Espera do retorno**:
Depois do envio ao Flash, o financeiro espera **taxa + boleto** **antes** de Omie. Desenho da etapa **Boleto** (etapa 3, D27) — ideia do candidato, não invalidada. Webhook era o canal imaginado (H19). Fato da API (F49): o manual Flash 2.0 não publica webhook. Porta: `consultar_pedido` (poll D28 + manual D29, chrome **Atualizar retorno**). Chrome da espera: **espera do retorno deste pedido**. Etapa 2 = resumo Flash, sem boleto.
_Avoid_: escrever “sem webhook” como se o desenho tivesse sido recusado; inventar webhook no proto; colocar **Baixar boleto** na etapa Flash

**Reversão**:
Desfazer execução com trilha. Depois do crédito, não é automática.

## Governança

**Lançamento departamental**:
Registro no sistema financeiro agregado por departamento, não por colaborador.

**Consolidado de pagamento**:
Versão identificável e agregada (totais, competência, lote) enviada aos diretores por e-mail. Não é planilha solta. Não autoriza a execução no provedor.
_Avoid_: lista linha a linha de crédito para diretor

**Aprovação de pagamento**:
Dois diretores sobre o **mesmo** consolidado de pagamento (boleto/banco), depois da confirmação no provedor (decisões D13 e D14).
_Avoid_: aprovação do crédito, ok para executar o Flash

**Conciliação**:
Prova de que totais do lote = totais no provedor = totais no sistema financeiro para a mesma competência.

**Taxa visível**:
Flash (soma das taxas de cada depósito na confirmação **daquele pedido**) + Omie (R$ 1,99 × boletos **da parcial**). Tabela **Flash | Omie | visível**. N pedidos = N somas. R$ 1,00 Flash no proto = premissa de simulação (GET `depositFees` não executado). **P11:** a entrevista **não perguntou** se a taxa existe na operação Morada, quem paga, nem se N boletos = N taxas. **H20** assume que minimizar N evita taxa extra — hipótese sua, não do financeiro. Fórmulas = **fato de documentação do provedor**. Chrome: campo **Taxa do provedor** no slip — sem faixa solta, sem linha de fórmula.
_Avoid_: esconder Omie na coluna Flash; inventar %; tratar 0,00 como fato da entrevista; linha de fórmula na tela

**Eventos de auditoria (D25)**:
`conferiu` e `anexou comprovante` existem no contrato: ator = identidade interna, quando, objeto. Beneficiário não é quem conferiu. Chrome **Histórico da esteira** (lista compacta sob o wizard) está **fora** — recorte de UI, não “entrevista pediu o card”. Banco: **Quem anexou** em cada comprovante.
_Avoid_: dump-list sob o wizard; beneficiário como ator de conferiu; inventar linha do tempo nova

**Comprovante de pagamento**:
Arquivo do desembolso do boleto, depois dos dois oks de diretor. Conferência lê o objeto no bucket, não o e-mail. Entidade `ComprovanteDePagamento`. Porta: `ArmazenamentoDeComprovantes`.
_Avoid_: e-mail como depósito do arquivo; escolher S3 como entidade

**Armazenamento de comprovantes**:
Porta: gravar, ler, expirar. Destino lógico: **bucket de comprovantes**. Adaptadores válidos (sem escolha): Amazon S3 e DigitalOcean Spaces. Isolado da camada do cliente.
_Avoid_: “escolhemos AWS”; conta inventada

**Bucket de comprovantes**:
Onde o objeto vive (nome, data, caminho, id opaco). Não é vendor.

## Sistemas (instâncias, não entidades)

Mapeamento produto ↔ porta: [SRD-01](docs/srd/SRD-01-contratos-de-capacidade.md#mapeamento-produto--porta).

**Provedor de benefícios**:
Quem recebe depósitos e gera o instrumento de pagamento. Instância atual: Flash. No contrato: `ProvedorDeBeneficios`.
_Avoid_: Flash como entidade de produto

**Sistema financeiro**:
Onde o custo entra agregado e de onde sai o relatório aos diretores. Instância atual: hipótese Omie. No contrato: `SistemaFinanceiro`.
_Avoid_: OME, homem, RP

**Backoffice**:
Sistema interno (identidade `@morada`, área, nível de carga). Habitat da capacidade. Satisfaz a porta **identidade interna** (`IdentidadeInterna`); não é uma porta. Fatia de benefícios: dono da escrita do perfil no destino (decisão D11, sem acordo da sala); recorte 1 da carga lê a planilha (decisão D15); campos de elegibilidade ainda abertos (pendência P18). Inventário campo a campo: [`docs/discovery/fontes-de-dados.md`](docs/discovery/fontes-de-dados.md).
_Avoid_: morador, RP próprio

**Planilha de controle** (instância da porta):
Excel / ficheiro que o financeiro já preenche. No contrato: `PlanilhaDeControle`. Imagem da grade é adaptador de `ler_linhas`, não outro produto.
_Avoid_: FonteDeCarga como quinto produto; sync como recorte 1

**Armazenamento de comprovantes** (instância da porta):
Bucket de comprovantes. No contrato: `ArmazenamentoDeComprovantes`. Amazon S3 e DigitalOcean Spaces são adaptadores da mesma porta — o recorte não escolhe. Mapeamento: [`docs/integracoes/comprovantes.md`](docs/integracoes/comprovantes.md).
_Avoid_: AWS como entidade; anexo de e-mail como verdade

**Camada do cliente**:
Produtos que atendem o cliente da Morada. Esta operação não compartilha destino de falha com ela.

**Isolamento**:
Restrição: benefícios não degrada nem autentica via camada do cliente. O comprovante do boleto não vive nessa camada.
