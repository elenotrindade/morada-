# Glossário — operação de benefícios Morada

Vocabulário da descoberta (entrevista 2026-09-15 e guia). Linguagem canônica do bounded context: [`CONTEXT.md`](../../CONTEXT.md). Em conflito de termo, vale o CONTEXT. Valores em reais **não** entram aqui como fato: não foram dados. Cifras do proto: [`proto-semente.md`](../proto-semente.md) (PREMISSA DE PROTÓTIPO).

Mapeamento produto ↔ porta (tabela canônica, uma só): [`SRD-01`](../srd/SRD-01-contratos-de-capacidade.md#mapeamento-produto--porta). Identificadores PascalCase são face de contrato para grep; **não** são copy de tela.

Ver o inventário etiquetado em [`fatos-hipoteses.md`](./fatos-hipoteses.md), o grill das inferências em [`inferencias-em-grill.md`](./inferencias-em-grill.md) e o que o backoffice já tem vs palpite em [`fontes-de-dados.md`](./fontes-de-dados.md) (pendência P18).

## Pessoas e papéis

**Colaborador**:
Pessoa elegível a benefício no ciclo (CLT ou PJ), cadastrada no provedor. Na lista Beneficiários: só **ativos na empresa** (ativos no corte).
_Evitar_: funcionário (exclui PJ), usuário (ambíguo com login), candidato (é o PE no processo seletivo); listar desligada como beneficiário.

**Regime**:
Vínculo que seleciona a política: `CLT` ou `PJ`.
_Evitar_: modalidade de contratação como nome canônico (na sala misturou com tipo de benefício).

**Departamento**:
Unidade de rateio no sistema financeiro. Hoje são oito (financeiro, vendas e marketing foram citados).
_Evitar_: área, time, squad — “área” no backoffice pode não ser o mesmo recorte do rateio.

**Área**:
Atributo do backoffice citado por quem avalia a dinâmica (e-mail `@morada`, área, nível de carga — fato F38). Hipótese de corresponder ao departamento de rateio (H10); a entrevista não mapeou campo a campo.
_Evitar_: tratar área = departamento como fato.

**Nível de carga**:
Atributo do backoffice (fato F38). Não é departamento. Não entra no cálculo de benefício até alguém decidir o contrário.
_Evitar_: usar como faixa, regime ou unidade de rateio.

**Perfil de identidade**:
O que a porta **identidade interna** devolve sobre a pessoa na Morada. Confirmado na entrevista: e-mail `@morada`, área, nível de carga. Distinto de **perfil de benefício** (elegibilidade: regime, escolha de transporte, faixa). Nome, ativo, CPF e equivalência área↔departamento são hipótese até inspeção. Tabela: [`fontes-de-dados.md`](./fontes-de-dados.md).
_Evitar_: misturar com perfil de benefício; assumir CLT/PJ ou ônibus/carro no backoffice.

**Financeiro**:
Papel que monta o ciclo, lança no provedor, gera boleto, lança no sistema financeiro e pede aprovação. Hoje: três pessoas com admin no provedor.
_Evitar_: admin Flash como sinônimo do papel interno (é identidade no provedor, não no backoffice).

**Diretor**:
Um dos dois aprovadores do pagamento do ciclo, hoje por e-mail sobre o relatório exportado do sistema financeiro.

**Administrador do provedor**:
Pessoa autorizada no CNPJ da Morada a recarregar e gerar boleto no provedor. Identidade atual: CPF, não e-mail @morada.

## Política de benefícios

**Política de benefícios**:
Regras que, dado regime, escolha de transporte e faixa, produzem as linhas do colaborador na competência. Ainda incompleta nos valores (pendências P01–P05, P07: diário, faixas, Flexível, `name`/`benefitId`). Canal do ônibus = D19 (P06 fechada).

**Elegibilidade**:
Conjunto estável de direitos do colaborador (regime, escolha de transporte, faixa). Não é o valor do mês: o valor pode mudar com dias úteis sem mudar a elegibilidade.

**Perfil de benefício**:
Elegibilidade materializada: colaborador + regime + escolha de transporte + faixa, se houver. Entrada do cálculo, não o lote. Distinto de **perfil de identidade**. No recorte (decisão D11): cadastro-mestre da escrita — premissa reversível, **não perguntada na sala**.

**Escolha de transporte**:
Opção CLT na admissão: **auxílio gasolina XOR cartão de ônibus** (na sala: vale-combustível XOR cartão de ônibus). A pessoa **não** escolhe Multibenefícios. Atributo de elegibilidade. **D19:** os dois lados são depósitos Flash (premissa de recorte; o financeiro **não** disse o canal do ônibus).
_Evitar_: chamar as duas opções de “modalidade”; vale-transporte como fato da sala; XOR comida vs combustível.

**Modalidade**:
Tipo de crédito no provedor. **Fato (F14):** a Morada declara três das cinco do Flash. **Decisão D16 + D19:** os três *slots* do catálogo da empresa são **Multibenefícios** (padrão CLT), escolha **Auxílio gasolina XOR Cartão de ônibus** (ambos Flash) e **Flexível** (PJ). Se gasolina **e** VT estiverem habilitados no CNPJ, são **4 SKUs** — tensão honesta com “usamos 3”; GET **não** rodou. **Hipótese (H16, P07) — segunda linha:** equivalente de depósito (`name`/`benefitId`) a confirmar — **Alimentação e refeição**, **Auxílio Mobilidade**, **Vale-transporte**, **Flexível**.
_Evitar_: promover SKU Flash a regra; tratar Multibenefícios da sala como a carteira livre do site; XOR comida vs combustível numa pessoa CLT; dizer que o GET já rodou; tratar ônibus como 4º mistério de canal.

**Multibenefícios** (fato da sala; padrão CLT; um dos três *slots* — D16):
Carteira CLT **obrigatória** de alimentação + refeição. A pessoa não escolhe. Fórmula falada: valor diário × dias úteis nacionais do mês. Valor diário não foi informado. **Não** é o cartão de marketing Flash “Multibenefícios” (carteira flexível / livre). Equivalente de depósito Flash: `name`/`benefitId` a confirmar (hipótese: **Alimentação e refeição**; produto: Vale-alimentação e refeição; sub-hipótese: dois `benefitId`).
_Evitar_: usar Multibenefícios da sala como `benefitName` Flash fechado; usar Multibenefícios do site neste crédito CLT.

**Auxílio gasolina** (copy do operador; na sala: vale-combustível / combustível; lado Flash da escolha — D16, D19):
Lado da escolha de transporte CLT, XOR cartão de ônibus. Valor fixo por faixa, independente de dias úteis. A transcrição não disse “gasolina”. Equivalente de depósito Flash: `name`/`benefitId` a confirmar (hipótese: **Auxílio Mobilidade** / combustível; FAQ Flash: Mobilidade inclui posto de gasolina).
_Evitar_: SKU Flash como rótulo primário; XOR com Multibenefícios.

**Cartão de ônibus**:
Escolha CLT na admissão, alternativa ao auxílio gasolina. **D19 (premissa de recorte, não GET):** também é depósito Flash. Equivalente de depósito: `name`/`benefitId` a confirmar (hipótese: **Vale-transporte**; alternativa: Auxílio Mobilidade). Copy da sala permanece **cartão de ônibus**. Os três *slots* da empresa: Multi + (gasolina \| ônibus) + Flexível; 4 SKUs no CNPJ se gasolina e VT estiverem ambos habilitados. Pode ficar **a conferir** por cadastro — **não** porque o canal era desconhecido (P06 fechada).
_Evitar_: vale-transporte como fato da entrevista; tratar ônibus como fora do Flash; omitir a pessoa; inventar cifra no PRD (seed só no proto).

**Flexível** (fato da sala: Flash Flexível; um dos três *slots* — D16):
Modalidade PJ, valor mensal fixo, **sem** a escolha ônibus XOR auxílio gasolina e sem variação por dias úteis. Valor não foi informado. Equivalente de depósito Flash: `name`/`benefitId` a confirmar (hipótese: **Saldo Flexível**). No site: **Multibenefícios** = saldo entre categorias habilitadas — homônimo da sala, não o crédito CLT.
_Evitar_: “benefício PJ” genérico; usar Multibenefícios da sala neste crédito.

**Faixa de combustível**:
Um de três degraus de distância residência–trabalho: 5 km, 10 km, região metropolitana. Definida na admissão; só muda se o colaborador pedir alteração de endereço ao financeiro.
_Evitar_: “km” solto, “região” solta. Os limites exatos (onde cai 7 km) são pendência.

**Valor diário**:
Parcela CLT de **Multibenefícios** por dia útil. Número desconhecido.

**Valor mensal fixo**:
Parcela que não depende de dias úteis: Flexível PJ, Auxílio gasolina CLT (depois de definida a faixa) e Cartão de ônibus CLT (semente no proto; valor de política = pendência como P01/P02/P05).

**Dias úteis nacionais**:
**Hoje (fato F30):** contagem **manual** na planilha, feriados nacionais. **Solução (recorte 1):** inteiro e lista de datas da porta de calendário oficial — o operador não preenche o mês no sistema. Se a carga ler a coluna de dias, **compara** e mostra divergência (decisão D15) — a célula não ganha em silêncio. Entrada da fórmula de **Multibenefícios**, não do auxílio gasolina.
_No contrato se chama_: porta **calendário oficial** (`CalendarioOficial`) — hoje o calendário nacional.
_Evitar_: calendário municipal como fato; tratar a célula da planilha como escritora depois do recorte 1.

**Calendário oficial**:
Porta que devolve os dias úteis nacionais da competência. O operador não preenche o mês. Hoje: calendário nacional (não há sistema nomeado na entrevista).
_No contrato se chama_: `CalendarioOficial`.
_Evitar_: campo digitável de dias úteis; feriado municipal como fato.

**Admissão**:
Momento em que o CLT escolhe auxílio gasolina ou ônibus (não escolhe Multibenefícios) e em que a faixa de combustível (e o endereço) é fixada.

**Alteração de endereço**:
Pedido do colaborador ao financeiro, hoje por e-mail, para recalcular a faixa de combustível. Não é self-service.

## Operação do ciclo

**Competência**:
Mês de referência que o lote antecipa (decisão D10): o crédito sai antes do mês. Premissa de política, não fato da sala.

**Data de corte**:
Instante em que se decide quem entra no lote. Premissa D10: cinco dias úteis antes do início da competência, a confirmar com o financeiro. Ativo no corte leva o mês financiado.

**Planilha de controle**:
Artefato atual onde o financeiro lista colaboradores, opções, dias úteis e valores antes de digitar no provedor. Sistema-sombra de **hoje** (fato F21). Recorte da **carga** (decisão D15): continua o hábito de preenchimento; o sistema **lê** (arquivo ou imagem da mesma grade) para pré-preencher. **Gerar planilha** devolve arquivo se ainda precisarem do Excel. Não escreve dias úteis — calendário compara. D11 (perfil escreve / planilha gerada) é destino da escrita, **não** acordo da sala para matar o Excel.
_No contrato se chama_: porta **planilha de controle** (`PlanilhaDeControle`).
_Evitar_: chamar a planilha de lote; tratar a exportação como mestra; sync bidirecional no recorte 1; “IA” ou `FonteDeCarga` como outro produto.

**Lote**:
Conjunto da competência: todas as linhas (colaborador × modalidade × valor) mais os totais por departamento. Depois de congelado (**lote congelado**), é a verdade do ciclo; provedor e sistema financeiro são projeções. **Um** lote por competência. **Não** é “um pedido Flash”: a execução parte em **parciais** (D22).
_No contrato se chama_: entidade `LoteMensal` (não é porta).
_Evitar_: recarga, planilha, pedido (pedido é o que vai ao provedor); tratar lote = um único tiro no Flash.

**Parcial**:
Recorte de execução do lote da competência que percorre o ciclo inteiro (**Confirmar benefício → Flash → Boleto → Omie → Diretores → Banco**). **1 colaborador** ativo conferido = 1 parcial; **N conferidas** em lote = 1 parcial de N (acelerador do mesmo ciclo). Várias parciais no mês; histórico **acumula**. Flash lista só quem entra **nesta**; Banco lista **todas**. **Não** é fato da entrevista (D22). **H20 (hipótese sua):** o caminho feliz **recomenda** conferir todos os que vão receber antes de um envio (um boleto); parciais **permanecem possíveis**. P11: a entrevista não perguntou se fatiar gera N taxas.
_No contrato se chama_: entidade `ParcialDaCompetencia`.
_Evitar_: segundo lote; “um pedido por competência” como fato; apagar a parcial anterior; tratar H20 como fato do financeiro.

**Congelamento**:
Proibição de recálculo silencioso após sair de rascunho. Não significa linhas imutáveis: correção na conferência é evento e invalida o consolidado de pagamento.

**Linha do lote**:
Um crédito previsto: um colaborador, uma modalidade, um valor na competência.

**Conferência**:
Revisão humana (ou assistida) das linhas do lote antes de executar. Papel do financeiro no recorte inicial.

**Confiança** / **taxa de sucesso da automatização**:
Fala da sala (F45): conferência no primeiro momento; 95% era **proposta** de deixar automático depois. **Não** é enum de tela. Recorte 1 (D23): só **a conferir** | **conferida**. D20 = só conferidas no payload.
_Evitar_: conferida (automática) como situação; 95% como meta inventada.

**Depósito**:
Crédito de uma modalidade para um colaborador no provedor, dentro de um pedido. É a unidade que hoje o financeiro digita à mão.
_Evitar_: lançamento (lançamento é no sistema financeiro), recarga genérica.

**Pedido no provedor**:
Agrupamento de depósitos enviados ao provedor **numa parcial**. Regras de um depósito por colaborador+modalidade, centavos e imutabilidade após confirmação **não** foram ditas na entrevista. Vários pedidos na mesma competência (D22); a entrevista não travou “um só”.

**Boleto de recarga**:
Documento gerado no provedor após os depósitos, que o financeiro associa ao pagamento e sobe ao sistema financeiro. Relação exata com o banco é pendência.

**Execução**:
Envio ao provedor **só** das linhas **conferidas** (operador confirmou). **D24, dois tempos:** conferir **abre** o resumo Flash; **Confirmar envio ao Flash** dispara o pedido. **A conferir** não entra no pedido (decisão D20). Não espera ok de diretor (decisão D13).

**Reversão**:
Desfazer execução no provedor e/ou no sistema financeiro quando o lote conferido estava errado ou a confiança falhou. Capacidade desejada pelo candidato; o provedor atual não foi confirmado como capaz disso.

## Financeiro e governança

**Lançamento departamental**:
Registro no sistema financeiro **agregado por departamento** (oito linhas), não por colaborador. Contrasta com o depósito, que é por colaborador e modalidade.

**Aprovação de pagamento**:
Dois diretores sobre o mesmo **consolidado de pagamento** (boleto/banco), depois da confirmação no provedor (decisões D13 e D14). Canal recorte 1: e-mail, não planilha solta. Diretor não opera linha.
_Evitar_: aprovação do crédito; ok para executar o Flash.

**Consolidado de pagamento**:
Entidade interna (`ConsolidadoDePagamento`): versão identificável e agregada do lote para o e-mail e a conciliação. **Não** é copy de tela. A etapa 5 mostra **Pagamento de benefícios**. `pag-…` e arquivo de boleto ficam no contrato, não na UI. `par-…` no título do recolhível do boleto e no campo Parcial do slip.
_No contrato se chama_: entidade `ConsolidadoDePagamento` (não é porta).
_Evitar_: rótulo **Consolidado de pagamento** no chrome; `pag-…` na UI.

**Conciliação**:
Prova de que totais do lote = totais no provedor = totais no sistema financeiro para a mesma competência.

**Comprovante de pagamento**:
Arquivo (PDF ou imagem) do desembolso do boleto, anexado pelo financeiro na etapa Banco **depois** dos dois oks de diretor. A conferência lê o objeto no **bucket de comprovantes**, não a caixa de entrada.
_No contrato se chama_: entidade `ComprovanteDePagamento`; porta **armazenamento de comprovantes** (`ArmazenamentoDeComprovantes`).
_Evitar_: tratar o e-mail como depósito do arquivo; misturar com o boleto do provedor; escolher Amazon S3 ou Spaces como entidade de produto.

**Armazenamento de comprovantes**:
Porta que grava, lê e expira o comprovante. Hospedagem lógica: **bucket de comprovantes**. Sistemas atuais possíveis (adaptadores, **sem escolha no recorte**): Amazon S3 e DigitalOcean Spaces (compatível S3). Isolado da camada do cliente (quem avalia a dinâmica, F40 / D04).
_No contrato se chama_: `ArmazenamentoDeComprovantes`.
_Evitar_: “escolhemos AWS”; conta de nuvem inventada; anexo de e-mail como verdade.

**Bucket de comprovantes**:
Destino lógico do objeto (nome, data, **onde** = bucket + caminho + id opaco). Não é vendor. Não é a camada do cliente.
_Evitar_: nome de conta S3; Spaces como porta.

## Sistemas (instâncias atuais, não o domínio)

**Provedor de benefícios**:
Sistema que recebe depósitos e gera o meio de pagamento da recarga. Instância atual: Flash. O domínio fala em provedor; Flash é adaptador.
_No contrato se chama_: porta **provedor de benefícios** (`ProvedorDeBeneficios`) — hoje o Flash.
_Evitar_: tratar “Flash” como entidade de produto nos SRDs.

**Sistema financeiro**:
ERP onde o financeiro lança o custo agregado e de onde sai o relatório para os diretores. Falado na sala como OME / RP; hipótese de nome: Omie.
_No contrato se chama_: porta **sistema financeiro** (`SistemaFinanceiro`) — hoje o Omie.
_Evitar_: Homem, RP próprio (RP próprio na sala também apontou o backoffice).

**Backoffice**:
Sistema interno já existente: identidade por e-mail `@morada`, área, nível de carga. Candidato a hospedar a operação de benefícios, com anuência de quem avalia a dinâmica. Adaptador da identidade interna, não uma porta. Campos confirmados vs palpite: [`fontes-de-dados.md`](./fontes-de-dados.md).
_No contrato a porta se chama_: **identidade interna** (`IdentidadeInterna`).
_Evitar_: RP, morador, “um ERPzinho” — falas da sala, não nomes de entidade.

**Planilha de controle** (porta):
O Excel que o financeiro já preenche. Recorte 1 **lê** (D15); **gera** arquivo se ainda for útil (D11). Imagem = adaptador, não outro produto.
_No contrato se chama_: `PlanilhaDeControle`.

**Armazenamento de comprovantes** (porta):
Bucket da observância interna para o comprovante do boleto. Recorte D21: gravar, ler, expirar. Adaptadores válidos **sem escolha**: Amazon S3 e DigitalOcean Spaces. Isolado da camada do cliente.
_No contrato se chama_: `ArmazenamentoDeComprovantes`.
_Evitar_: “escolhemos AWS”; conta inventada.

**Identidade interna**:
Login do backoffice (`@morada`). Distinta da identidade no provedor (CPF).
_No contrato se chama_: porta **identidade interna** (`IdentidadeInterna`) — hoje o backoffice.

**Camada do cliente**:
Sistemas que atendem o cliente da Morada (no guia: MIA, SALES, IAGO). Integrações de benefícios devem ficar **isoladas** dessa camada.

**Isolamento**:
Restrição arquitetural: a operação de benefícios não compartilha destino de falha com a camada do cliente.

**Espera progressiva**:
Intervalo crescente entre tentativas da mesma chamada de porta. Forma da política: **exponencial com jitter** (variação aleatória no intervalo). Não é produto de nuvem.
_No contrato se chama_: espera progressiva (política de entrega compartilhada de `ProvedorDeBeneficios` e `SistemaFinanceiro`). Em inglês de mercado: backoff.
_Evitar_: SQS; retry policy de infra como nome de produto; “ops console”.

**Fila de não processados**:
Itens que esgotaram a espera ou nasceram de recusa permanente (`400` de negócio). Guardam payload, etapa (`criar pedido` / `depósito` / `confirmar`), colaborador, competência, erro. Operador vê e retenta na observância da integração.
_No contrato se chama_: fila de não processados (política de entrega). Em inglês de mercado: DLQ — **não** é copy de tela.
_Evitar_: DLQ na UI; broker de fornecedor; misturar motivo de depósito com motivo de confirmar.

**Observância da integração**:
Superfície do operador sobre a fila de não processados (ver, filtrar, retentar). Não é porta. Não é consola de ops.
_No contrato se chama_: `ObservanciaDaIntegracao` (identificador de superfície, para grep). Copy da lista: **Não processados**.
_Evitar_: sexto produto; ops console; Dashboard de integração.

## Termos que a sala usou e não são canônicos

| Falado na sala | Usar no contrato |
| --- | --- |
| funcionário, usuário | colaborador |
| CRT (transcrição) | CLT |
| OME, homem, RP financeiro | sistema financeiro (instância: Omie, hipótese) |
| morador, RP próprio | backoffice |
| recarga (genérico) | depósito, lote ou boleto de recarga, conforme o ato |
| opção / tipo de vale | modalidade, ou escolha auxílio gasolina vs ônibus |
| Homem (ERP) | sistema financeiro |
| confiança / confiabilidade 95% | hipótese H11; D20 = só conferidas no payload; D23 = enum a conferir \| conferida; D24 = conferir abre resumo Flash |

## Identificadores do contrato (não são copy de tela)

Face de software das portas. Tabela canônica: [`SRD-01`](../srd/SRD-01-contratos-de-capacidade.md#mapeamento-produto--porta).

**IdentidadeInterna** — no produto se diz **identidade interna**. Hoje: backoffice. A saída é o **perfil de identidade** (não o perfil de benefício).

**CalendarioOficial** — no produto se diz **calendário oficial** (o operador lê **dias úteis nacionais**). Hoje: calendário nacional.

**ProvedorDeBeneficios** — no produto se diz **provedor de benefícios**. Hoje: Flash.

**SistemaFinanceiro** — no produto se diz **sistema financeiro**. Hoje: Omie.

**PlanilhaDeControle** — no produto se diz **planilha de controle**. Hoje: Excel / ficheiro (e imagem da grade como adaptador de `ler_linhas`). Operações: `ler_linhas`, `gerar_arquivo`, `sincronizar` (esta última fora do recorte 1).

**ArmazenamentoDeComprovantes** — no produto se diz **armazenamento de comprovantes**. Hoje: **bucket de comprovantes**. Adaptadores válidos (sem escolha): Amazon S3 e DigitalOcean Spaces. Operações: `gravar`, `ler`, `expirar`.

**ObservanciaDaIntegracao** — no produto se diz **Observância da integração**. Superfície da política de entrega; **não** é porta.

**LoteMensal** — no produto se diz **lote** / **lote congelado**. Entidade, não porta.

**ConsolidadoDePagamento** — entidade interna. No produto/contrato se diz **consolidado de pagamento**. **Não** é copy da etapa 5: a tela diz **Pagamento de benefícios**.

## Copy visível ao operador

Termos que a tela já usa. Não inventar segundo nome.

**Beneficiários**:
Tabela primária do backoffice: **uma linha por colaborador ativo a conferir** da competência (ainda não na parcial Flash). **Desligada, inativa ou após o corte não entra.** Barra de lote some se zero selecionado; um botão **Marcar como conferidos** (abre o resumo Flash). **Confirmar envio** dispara o provedor. Sem Omie na barra. Wizard Flash/Omie: só quem anda nesta parcial entre as conferidas ativas.

**Parcial** (copy de operação, D22):
Caminhada de 1 ou N conferidos pelo ciclo. Não é o lote. Banco: **um recolhível por boleto**.

**Regra visível (uma frase):** CLT: Multibenefícios (padrão) + escolha única ônibus ou auxílio gasolina. PJ: Flexível, sem essa escolha.

**Multibenefícios / Auxílio gasolina / Cartão de ônibus / Flexível**:
Rótulos da coluna Benefício. D16: os três *slots* Flash da empresa são Multibenefícios + (gasolina \| ônibus) + Flexível. CLT: título = escolha; subtexto **Multibenefícios padrão** (sem cifra). Equivalente hipotético no provedor (P07) **não** entra na lista nem no Detalhe. Ônibus: escolha visível **e** depósito Flash (D19); P06 fechada.

**Confirmar benefício**:
Etapa 1 do ciclo = a lista Beneficiários. Ação visível: **Conferir** (1-a-1) ou **Marcar como conferidos** (lote). Pares com **conferência** (nome lógico). **D24:** o clique **abre o resumo Flash**. **Confirmar envio ao Flash** (etapa 2) dispara o provedor. Não há tela `/confirma` nem segundo botão na barra.

**Situação da linha** (enum — D23):
`a conferir` · `conferida`. Nada além disso. Pipeline do ciclo não é situação. **A informar** é valor, não situação.

**A conferir**:
Ainda não confirmado pelo operador. Sem motivo vermelho na lista. A entrevista falou em **confere** / **conferências** / **confirmação dos dados** (F45) — não em “automática”, “correção” nem “no provedor a confirmar”.

**Conferida**:
Operador confirmou o benefício preenchido. Editar **não** marca conferida sozinho. Conferir abre o resumo Flash daquela pessoa/parcial (D24).

**A informar**:
Valor ainda não lido no cadastro. Distinto de situação.

**Gerar planilha**:
Exportação (sistema → arquivo). Não é sync. Não escreve no Excel aberto.

**Trazer da planilha**:
Carga por arquivo ou imagem. Pré-preenche. Calendário manda em dias úteis. Imagem é **adaptador** da mesma extração — não há botão **Preencher pela imagem**.

**Ciclo do mês**:
Percurso **Confirmar benefício → Flash → Boleto → Omie → Diretores → Banco**.

**Atualizar retorno**:
Ação da etapa **Boleto** (D29). Dispara a mesma `consultar_pedido` do poll (D28) quando a espera falha, timeout ou a tela diverge do provedor. Sem “GET” no chrome.

**Espera do retorno** (etapa **Boleto**, etapa 3, D27):
Depois de **Confirmar envio**, o grupo espera taxa + boleto **antes** de Omie. Copy: **espera do retorno deste pedido**. Webhook era o canal imaginado, não a copy. Canal atual: consulta do pedido (`consultar_pedido`) — poll automático (D28) e **Atualizar retorno** (D29) se a espera falha, timeout ou a tela diverge. GET é o HTTP do adaptador, não chrome. Etapa 2 (Flash) = resumo + **Confirmar envio**; sem **Baixar boleto** lá.

**Não processados**:
Lista na **Observância da integração**: itens da fila de não processados (etapa, colaborador, competência, erro). Daqui o operador retenta. Não é passo do pipeline.

**Pagamento de benefícios**:
Título da etapa 5 (abaixo do H1 **Diretores** e da barra). Abaixo: **mês de competência** e **quantidade de colaboradores que serão pagos** (esta parcial). Sem `pag-…`. Boleto recolhido: competência · `par-…` · valor.

**Taxa do provedor**:
Tabela **Flash | Omie | visível (soma)**. Fórmula Flash = soma das `fee` na confirmação (`totalFee`). Omie = R$ 1,99 × boletos da parcial (liquidação Omie.CASH Completa). Soma = decisão. Flash R$ 1,00 no proto = **PREMISSA DE PROTÓTIPO** (GET `depositFees` não executado). Chrome: campo **Taxa do provedor** no slip — sem faixa solta, sem linha de fórmula. Não é semente de benefício. Não esconder Omie na coluna Flash.

**Histórico da esteira** (chrome **fora**):
Lista compacta sob o wizard **não** entra na UI (recorte de UI — a entrevista **não** pediu o card). D25 permanece no contrato: eventos `conferiu` e `anexou comprovante` existem, ator = identidade interna. Beneficiário da parcial **não** é quem conferiu. Atribuição visível de comprovante: **Quem anexou** em cada arquivo na etapa Banco. H18.

**Anexar comprovante**:
Ação da etapa Banco depois de **autorizado a pagar**. **Vários** por fechamento/mês. PDF ou imagem. Lista todos. O objeto gravado mostra nome, data, **onde** (bucket de comprovantes + caminho). **Abrir** lê pela porta.

**Boleto recolhido** (etapas Omie, Diretores, Banco):
Título: competência · `par-…` · valor. Ao abrir = iframe + **Taxa do provedor** no slip + **Nesta parcial**. Banco: um recolhível por boleto; **Baixar** só no chrome do iframe. Sem “sumário do mês” como único recolhível.

**Bucket de comprovantes** (copy de **onde**):
Onde o arquivo vive. Não é e-mail. Isolado da camada cliente.

## Fora deste glossário de propósito

- Nomes de linguagem, banco, fila **de fornecedor**, HTTP, “a API”.
- Valores em reais **como fato da entrevista** (não existem). Cifras do proto: [`proto-semente.md`](../proto-semente.md).
- Estados do lote (`rascunho`, `aprovado`, etc.): isso é contrato de sistema (SRD), não vocabulário da entrevista.

Se um PRD ou SRD precisar de termo novo, acrescentar em [`CONTEXT.md`](../../CONTEXT.md) (e aqui, se for vocabulário da sessão) **antes** de espalhar sinônimo.