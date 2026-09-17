# Flash — fluxo de benefícios (recorte 1)

Fonte de verdade: [Manual de Integração da API Flash 2.0](https://docs.api.flashapp.services/Geral/Introducao).  
Dúvidas de API: `api-suporte@flashapp.com.br`. Dúvidas de produto: Central de Ajuda Flash (mesmo intro).

Isto não escolhe stack. Não substitui o Flash. O produto interno opera o lote; o Flash continua sendo quem credita o cartão.

## 1. O que o intro oficial cobre

O manual (API **2.0**) divide a integração em:

1. Métodos e processos de autenticação
2. Exemplos de requisições
3. **Gestão de colaboradores** — cadastro, convites, exclusão, consulta da base
4. **Gestão de benefícios** — controle, **pedido** e **disponibilização** para os colaboradores

Este documento destrincha o bloco de benefícios (pedido → depósito → confirmação → boleto/crédito). Colaboradores entram só no mapeamento identidade interna ↔ Flash.

## 2. Fluxo de negócio (pedido de benefícios)

Caminho oficial, em três passos de pedido, mais listagem de benefícios e consulta:

1. Listar benefícios da empresa → obter `benefitId` / `benefitName` das modalidades ativas.
2. **Criar pedido** vazio → guardar `orderId`. Status inicial: `requested`.
3. **Adicionar depósito** para cada par colaborador + benefício. Repetir. Valores em **centavos**.
4. Antes de confirmar: corrigir = **cancelar aquele depósito** e adicionar de novo. Ou cancelar o pedido inteiro.
5. **Confirmar pedido** (data de crédito + meio de pagamento). Depois disto, nenhum depósito entra ou sai.
6. Se o meio for boleto (`BILLET`), a confirmação devolve `billId` e o pedido vai a `billed`.
7. Acompanhar o andamento **depois** da confirmação: o manual manda **Buscar pedido** até `available` (saldo nos cartões). Fato de documentação (F49): o manual 2.0 **não publica webhook** — ver §4.9. Isso restringe o **canal**, não a espera.
8. No ciclo Morada o financeiro **espera o retorno** daquele `orderId` (etapa **Boleto**, etapa 3: taxa + boleto) **antes** de ir ao Omie (D27). A porta que cobre essa espera é `consultar_pedido`: poll automático (D28) e disparo manual **Atualizar retorno** (D29) — mesma porta, mesmo `orderId`. A etapa 2 (Flash) **não** espera boleto.

No ciclo Morada: o envio é o passo **Flash**; a espera do retorno é o passo **Boleto**. Ver [README](README.md).

Cartão corporativo (`/corporate-card/v1/...`) é **outra** API. Não misturar com benefícios.

## 3. Autenticação

O que as páginas oficiais de operação **de fato** mostram:

- Toda chamada documentada no bloco de benefícios e de colaboradores exige o header `x-flash-auth` (chave de API).
- Gestão de colaboradores: premissa “ter a chave de API (acesso programático) para enviar nos headers”.
- Host: `https://api.flashapp.services`.

O intro anuncia um bloco de “Métodos e processos de Autenticação”. A página dedicada de **como gerar a chave** não foi recuperável neste fetch (tentativas 404/erro; ver [pesquisa.md](pesquisa.md)). **Não inventar** o caminho de tela. Validar com o financeiro/admin Flash ou `api-suporte@flashapp.com.br`. Credencial fica na porta, não na UI (SRD-01, pendência P19).

## 4. Operações oficiais (benefícios)

Resumo do que está nas páginas ligadas ao intro. Não há cliente implementado aqui.

| Operação | Página | Método / caminho |
|---|---|---|
| Criar pedido | [Criar Pedido](https://docs.api.flashapp.services/Beneficios/CriarPedido) e [api/beneficios](https://docs.api.flashapp.services/api/beneficios) | `POST /benefits/v1/orders` |
| Listar benefícios | citado em [Adicionar Depósito](https://docs.api.flashapp.services/Beneficios/AdicionarDeposito); contrato OpenAPI em [api/beneficios](https://docs.api.flashapp.services/api/beneficios) | `GET /benefits/v1/benefits` (`companyId` obrigatório na query; `status`, `name` opcionais) |
| Adicionar depósito | [Adicionar Depósito](https://docs.api.flashapp.services/Beneficios/AdicionarDeposito) | `POST /benefits/v1/orders/{orderId}/deposits` |
| Cancelar depósito | [Cancelar Depósito](https://docs.api.flashapp.services/Beneficios/CancelarDeposito) | `POST /benefits/v1/orders/{orderId}/deposits/{depositId}/cancel` |
| Confirmar pedido | [Confirmar Pedido](https://docs.api.flashapp.services/Beneficios/ConfirmarPedido) | `POST /benefits/v1/orders/{orderId}/confirm` |
| Buscar pedido | [Buscar Pedido](https://docs.api.flashapp.services/Beneficios/BuscarPedido) | `GET /benefits/v1/orders/{orderId}` |
| Cancelar pedido | [Cancelar Pedido](https://docs.api.flashapp.services/Beneficios/CancelarPedido) | `POST /benefits/v1/orders/{orderId}/cancel` |
| Listar depósitos do colaborador | [Listar Depósitos por Colaborador](https://docs.api.flashapp.services/Beneficios/ListarDepositosPorColaborador) | ver nota de caminho abaixo |

Colaborador no Flash (mapeamento, não recarga): [Gerenciar colaboradores](https://docs.api.flashapp.services/Colaboradores/GerenciarColaboradores), [api/colaboradores](https://docs.api.flashapp.services/api/colaboradores) (`GET /core/v1/employees`, busca por `documentNumbers`, etc.). Empresa / `companyId`: [api/empresas](https://docs.api.flashapp.services/api/empresas).

### 4.1 Criar pedido

Corpo: `companyId`. Resposta `201`: `id` (= `orderId`), `status` sempre `requested`, `totalAmount` e `totalFee` começam em `0`.

Erros documentados: `400` `companyId` inválido; `403` sem permissão para a empresa.

### 4.2 Listar benefícios

`GET /benefits/v1/benefits` (`companyId` obrigatório; `status`, `name` opcionais). `benefitId` e `benefitName` do depósito **vêm daqui**. Resposta OpenAPI: `id`, `companyId`, `status` (`active` / `inactive`), `name`, descrições, `depositTimeUnit` (`month` / `day`), `depositFees`, `topupDepositEnabled`. Exemplo OpenAPI de `benefitName`: **Vale Refeição** — não é enum fechado de cinco strings.

A API **não** publica uma lista canônica de cinco nomes. Devolve o que o CNPJ tem habilitado. Guia dedicado “Listar benefícios” 404 neste fetch (ver [pesquisa.md](pesquisa.md)).

#### Nomes oficiais no produto (catálogo > 5)

Fonte de produto (empresa): [Gestão de benefícios](https://flashapp.com.br/gestao-de-beneficios). Cartões publicados, nesta ordem:

| Nome oficial no site | O que o texto diz |
|---|---|
| **Multibenefícios** | Saldo usado entre todas as categorias habilitadas (carteira **flexível**) |
| **Vale-alimentação e refeição** | Uso exclusivo em restaurantes, mercados, padarias, lanchonetes e delivery |
| **Alimentação** | Hipermercados, supermercados, mercearias; compatível PAT |
| **Refeição** | Restaurantes, lanchonetes, cafeterias, padarias, delivery; compatível PAT |
| **Saúde** | Farmácias, consultas, exames, terapias, práticas esportivas |
| **Auxílio Mobilidade** | Apps de corrida, estacionamento, pedágio, **combustível**, recarga de transporte público, aluguel de bicicletas |
| **Educação** | Creches, escolas, faculdades, cursos |
| **Auxílio Home Office** | Luz, água, internet, material de escritório |
| **Cultura** | Cinemas, shows, teatros, streamings |
| **Vale-transporte** | Autoatendimento de estações e catracas |

Central de Ajuda (saldos do cartão): [Onde aceita](https://faq.flashapp.com.br/kb/guide/pt-BR/onde-aceita-e-como-usar-o-meu-cartao-flash-e5yQA7tfeC/Steps/4198095) e [saldo exclusivo vs flexível](https://faq.flashapp.com.br/kb/guide/pt-BR/o-que-e-saldo-exclusivo-e-flexivel-do-seu-cartao-flash-G0nd1Ro1LV/Steps/4198168). Nomes de saldo: **Alimentação**, **Refeição**, **Mobilidade**, **Saldo Flexível**, mais Premiação, Home Office, Vale-transporte, Saúde, Cultura, Educação. VA/VR em saldo exclusivo é obrigação da Lei 14.442/2022.

Não inventar R$. Não tratar “Multibenefícios” do marketing como o crédito CLT da sala — no site, Multibenefícios **é** a carteira flexível. Copy do operador: **Multibenefícios** = padrão CLT.

#### Como o “cinco” da entrevista mapeia

**Fato (F14):** o financeiro disse cinco modalidades disponíveis, a Morada usa três. **Fato (F15):** no mesmo discurso listou quatro recargas (multibenefícios, combustível, ônibus, flexível).

**Decisão de mapeamento (D16 + D19), não execução de GET:** a regra da sala fecha **quais slots a operação usa**. Os dois lados da escolha CLT são depósitos Flash (D19 — o financeiro **não** disse o canal do ônibus; premissa de recorte para o ciclo depositar). F14 “usamos 3 de 5”: os três *slots* são Multibenefícios + (gasolina \| ônibus) + Flexível PJ. Se gasolina **e** VT estiverem habilitados no CNPJ, são **4 SKUs**. As outras habilitadas e não recarregadas seguem desconhecidas (hipótese Cultura/Saúde). **GET não foi executado.**

O catálogo Flash tem **mais de cinco** opções. Hipótese: os “cinco disponíveis” são o **subconjunto habilitado no CNPJ Morada**. GET (`GET /benefits/v1/benefits`) ainda precisa de `name`/`benefitId` — pendência P07. **GET não foi executado.**

**Regra da sala (fato, copy do operador — não é SKU):** CLT: Multibenefícios (padrão) + escolha única ônibus ou auxílio gasolina. PJ: Flexível, sem essa escolha.

#### Equivalência sala → depósito Flash (D16)

| Recarga da operação | Quem / quando | Base de cálculo | Equivalente de depósito Flash |
|---|---|---|---|
| **Multibenefícios** | CLT, sempre | valor diário × dias úteis | `name`/`benefitId` a confirmar (hipótese: **Alimentação e refeição** / Vale-alimentação e refeição; sub-hipótese: dois `benefitId` — **Alimentação** + **Refeição**) |
| **Auxílio gasolina** | CLT, se a escolha for gasolina (sala: vale-combustível) | valor fixo da faixa; não varia com dias úteis | `name`/`benefitId` a confirmar (hipótese: **Auxílio Mobilidade** / combustível) |
| **Cartão de ônibus** | CLT, se a escolha for ônibus (XOR gasolina) | valor mensal fixo (política não dita; seed só no proto) | `name`/`benefitId` a confirmar (hipótese: **Vale-transporte**; alternativa: Auxílio Mobilidade). **D19:** depósito Flash — premissa de recorte, não GET |
| **Flexível** | PJ, valor fixo, sem outra escolha | valor mensal fixo | `name`/`benefitId` a confirmar (hipótese: **Flexível** / Saldo Flexível; no site: Multibenefícios = carteira livre) |

Uma pessoa CLT **não** é “Multibenefícios **ou** Auxílio gasolina”. São duas linhas: padrão + escolha (gasolina **ou** ônibus). Ônibus **não** fica **a conferir** só porque o canal era desconhecido (P06 fechada).

**Tensão 3 vs 4:** os três *slots* que o catálogo da empresa opera são Multi + (gasolina \| ônibus) + Flexível. Se gasolina **e** VT estiverem habilitados no CNPJ, isso são **4 SKUs**. Não fingir que o GET rodou.

Se Alimentação e Refeição forem **dois** benefícios ativos **e** recarregados, a conta operacional cresce ainda mais — isso tensiona o “usamos três”. Manter honesto até o GET.

#### As 2 não recarregadas — não usamos, confirmar

No recorte de cinco habilitados no CNPJ (hipótese, para caber F14), as outras além dos slots da operação:

| Nome oficial hipotético | Status até confirmar |
|---|---|
| **Cultura** | não usamos — confirmar |
| **Saúde** | não usamos — confirmar |

Se o GET trouxer Educação, Home Office ou Premiação no lugar destas, a hipótese cai. Bloquear no lote só depois da lista real. **Vale-transporte** no GET **não** cai a hipótese: D19 já assume ônibus como depósito Flash; o GET só confirma o `benefitId`. Contar 5−3 (slots) vs 5−4 (SKUs se gasolina + VT) permanece aberto.

P07 pede identificadores — **não** “quais slots a operação usa” (isso é D16) nem o canal do ônibus (isso é D19). Até o GET o equivalente hipotético vive no **contrato**, não na lista Beneficiários nem no Detalhe — a UI não promove P07 a chip **a confirmar**.

### 4.3 Adicionar depósito

Um depósito = um colaborador + um benefício + um valor. Repetir para cada combinação.

Obrigatórios: `employeeId`, `employeeName`, `employeeDocument` (CPF só números), `benefitId`, `benefitName`, `amount` (centavos, mínimo **200** = R$ 2,00 — mínimo da API Flash, não valor da política Morada).

Opcional: `creditDate` neste depósito; se omitida, vale a da confirmação. Deve ser futura e dentro de 6 meses (texto da página de depósito).

Resposta `201`: guardar `id` (= `depositId`); `fee` calculada pela Flash; `status` = `created`.

**Restrição central:** não dá para dois depósitos do mesmo benefício para o mesmo colaborador no mesmo pedido. Correção = cancelar e adicionar de novo.

### 4.4 Cancelar depósito

Sem corpo. Libera o par colaborador+benefício naquele pedido; o valor sai do total. Erros: `404`; `422` se já disponibilizado ou transferido.

### 4.5 Confirmar pedido

Obrigatórios: `cnpj` (só números), `paymentMethod` (`BILLET` ou `BALANCE` / FlashCash), `adminEmail`, `creditDate`.

Opcionais: `name` (máx. 32), `description` (nota fiscal).

Depois da confirmação o pedido entra em processamento: **nenhum depósito pode ser adicionado ou removido**.

Resposta: `billed` + `billId` se boleto; `waiting_approval` se FlashCash. `totalAmount` e `totalFee` em centavos.

A seção “Regras para a data de crédito” existe na página; o fetch **não devolveu o corpo** dessa seção. O que está escrito na tabela de erros: `400` inclui data inválida, **fim de semana ou feriado**. Não inventar o restante.

### 4.6 Buscar pedido — ciclo de vida

| Status (guia Buscar Pedido) | Situação |
|---|---|
| `requested` | Aberto, aguardando depósitos |
| `confirmed` | Confirmado, em processamento |
| `billed` | Boleto gerado, aguardando pagamento |
| `waiting_approval` | FlashCash — aprovação no painel |
| `paid` | Pago, saldo sendo creditado |
| `available` | Saldo nos cartões |
| `canceled` | Cancelado |

O schema OpenAPI de `OrderResponse` lista `requested`, `billed`, `canceled`, `paid`, `available` (e `waiting_approval` em respostas de confirmação/busca). `confirmed` aparece no **guia** de buscar, não no enum do schema. Tratar como divergência da doc — validar no sandbox.

### 4.9 Webhooks — não publicados no manual (fato de canal, F49)

**Fato de documentação Flash (não da entrevista, não rejeição de produto):** a API Flash 2.0 **não documenta** webhook, callback nem notificação push para status de pedido ou depósito.

A **espera do retorno** (taxa + boleto antes de Omie) é desenho da etapa **Boleto** (etapa 3, D27) e **permanece**. Webhook era o canal imaginado (H19). Sem webhook no provedor atual, a porta `consultar_pedido` cobre a espera: poll automático (D28) e GET **manual** do operador (D29, chrome **Atualizar retorno**) quando a espera falha, timeout ou a tela diverge do pedido. Mesma porta, mesmo `orderId`. Não inventar endpoint de webhook no proto. Não colocar espera nem **Baixar boleto** na etapa Flash.

O que o manual manda fazer depois de confirmar:

> Acompanhe via Buscar Pedido. Quando o status for `available`, o saldo já está nos cartões dos colaboradores.

Fonte: [Confirmar Pedido](https://docs.api.flashapp.services/Beneficios/ConfirmarPedido). [Buscar Pedido](https://docs.api.flashapp.services/Beneficios/BuscarPedido) descreve `GET /benefits/v1/orders/{orderId}` como o jeito de **monitorar o andamento após a confirmação**.

Checagens nesta data (2026-09-15):

| Onde | Resultado |
|---|---|
| [Intro](https://docs.api.flashapp.services/Geral/Introducao) | Auth, colaboradores, benefícios. Sem webhook publicado. |
| [Confirmar Pedido](https://docs.api.flashapp.services/Beneficios/ConfirmarPedido) | Acompanhar via Buscar Pedido. |
| [Buscar Pedido](https://docs.api.flashapp.services/Beneficios/BuscarPedido) | Consulta do `orderId` (canal atual da espera). |
| [api/beneficios](https://docs.api.flashapp.services/api/beneficios) e [schemas](https://docs.api.flashapp.services/api/~schemas) | Sem recurso de inscrição/notificação. |
| `https://docs.api.flashapp.services/Geral/Webhooks` | Não recuperável (erro/404). |
| Busca `site:docs.api.flashapp.services webhook` | Sem página de webhook da Flash benefícios. |

Outros produtos com “Flash” no nome (Flash Payments, Flashnet) **não** são esta API.

**Canal atual da espera:** `GET /benefits/v1/orders/{orderId}` (**BuscarPedido**) no pedido **acabado de enviar** — isto é `consultar_pedido`, não um substituto da ideia de esperar. **Dois gatilhos, um GET:** (1) poll automático da etapa Boleto (D28); (2) o operador clica **Atualizar retorno** (D29) se a espera falha, timeout ou o estado da tela não bate com o provedor. GET é o HTTP do adaptador — **não** copy da UI. A etapa 3 do ciclo é a espera do retorno Flash **desse** `orderId` (copy: **espera do retorno deste pedido**). Não inventar endpoint de webhook. Não escutar pedido alheio. Não é segunda integração.

**Depois (passo Boleto · espera — etapa 3):** o financeiro permanece na etapa 3 até `consultar_pedido` devolver o estado daquele pedido (`billed` / `paid` / `available`, conforme o meio). **Baixar boleto** fica disponível quando o instrumento volta. A taxa (`totalFee`) **entra neste retorno**, não na etapa Flash. Só então o ciclo segue para **Omie**, e o Omie só prevê/lança o que este pedido confirmou. Se o poll falhar: o operador dispara o **mesmo** GET (**Atualizar retorno**).

### 4.7 Cancelar pedido

Corpo: `cancelReason`. Só **antes** do saldo disponibilizado. `422` se já `available`. Se estava `billed`, o boleto é invalidado. Se já pago, a própria página manda falar com o suporte Flash para estorno.

### 4.8 Listar depósitos por colaborador

Uso documentado: cancelamento preventivo (desligamento), auditoria, reconciliação valor creditado vs planejado.

Filtro `status=pending` (depósitos `SCHEDULED`). Paginação `page` / `limit`. `204` se não houver depósitos. Caminho antigo `/orders/deposits/pending/employee/{employeeId}` está obsoleto.

**Divergência de caminho (não escolher no escuro):**

- Guia: `GET /api/deposits/employees/{employeeId}`
- OpenAPI [api/beneficios](https://docs.api.flashapp.services/api/beneficios): `GET /benefits/v1/orders/deposits/employees/{employeeId}` (com `companyId` no corpo da spec — conferir no sandbox)

## 5. Restrições (o que o recorte 1 tem de respeitar)

1. **1 depósito por colaborador + benefício por pedido.** Segundo = `409`.
2. **Valores em centavos.** Abaixo de 200 a API recusa (`400`).
3. **Pedido confirmado imutável** para depósitos.
4. **Taxa (`fee` / `totalFee`) é da Flash**, não da fórmula Morada.

   **Fato da API (não da entrevista):** em [Adicionar Depósito](https://docs.api.flashapp.services/Beneficios/AdicionarDeposito) a resposta devolve `fee` — “taxa calculada automaticamente em centavos”. Em [Confirmar Pedido](https://docs.api.flashapp.services/Beneficios/ConfirmarPedido) a resposta devolve `totalFee` — “total de taxas em centavos”. O schema OpenAPI exemplifica `totalFee: 100` com `totalAmount: 10000`; isso é **exemplo de campo**, não percentual publicado. `GetBenefitsResponse` tem `depositFees` (array; propriedades não recuperadas neste fetch). GET **não** foi executado.

   **Fórmula (variável):** `totalFee` = soma das `fee` de cada depósito do pedido. Sem % no manual.

   **PREMISSA DE PROTÓTIPO:** GET `depositFees` **não** foi executado. O proto simula Flash **R$ 1,00** no retorno do pedido — isso **não** é fato da entrevista nem medição da API.

   Copy comercial de VT (“isenção de taxa de repasse”; Recarga Complementar R$ 5 + 15%) **não** substitui essa fórmula — é outro produto / marketing, não o `totalFee` da API de benefícios.

   Entrevista: **não perguntou** se existe taxa na operação Morada, quem paga, nem se N boletos = N taxas (**pendência P11**). **H20** (hipótese sua) assume que fatiar soma taxa extra. A fórmula da taxa visível é a tabela abaixo (contrato; **por pedido**; ver [omie.md](omie.md) e PRD-03). Chrome da UI: campo **Taxa do provedor** **dentro do slip** (exemplo `(R$ 1,00 + R$ 1,99) R$ 2,99`) — sem faixa solta, sem linha de fórmula. Omie **não** entra na coluna Flash.

| | Flash | Omie | visível (soma) |
|---|---|---|---|
| Fórmula | soma das `fee` de cada depósito, devolvida na confirmação (`totalFee`) **daquele pedido** | R$ 1,99 × N boletos **desta parcial** (liquidação Omie.CASH Completa) | Flash + Omie **por pedido** |
| Desta parcial (exemplo) | R$ 1,00 | R$ 1,99 | R$ 2,99 |
5. **Data de crédito** recusada em fim de semana/feriado (`400`).
6. **Cancelar pedido** recusado se já `available` (`422`). Estorno pós-crédito = suporte / processo humano (pendência P24).
7. **CPF só números** no depósito (pendência P25 / LGPD).
8. Confirmação exige CNPJ, meio de pagamento e e-mail de admin (pendência P16: qual meio a Morada usa hoje).
9. Benefício inativo ou de outra empresa = `400` no depósito.
10. Pedido já faturado não aceita mais depósitos (`422`).

## 6. Erros (só os publicados)

### Depósito

| Código | Causa publicada |
|---|---|
| `400` | Campo obrigatório ausente ou `amount` &lt; 200 |
| `400` | Benefício inativo ou de outra empresa |
| `404` | Pedido ou benefício não encontrado |
| `409` | Já existe depósito para este colaborador + benefício neste pedido |
| `422` | Pedido não aceita mais depósitos (já faturado) |

### Confirmação

| Código | Causa publicada |
|---|---|
| `400` | Campo obrigatório ausente, data inválida, fim de semana ou feriado |
| `422` | Pedido sem depósitos, já confirmado ou já disponibilizado |
| `404` | Pedido não encontrado |

### Cancelar depósito / pedido / buscar

`404` não encontrado; `403` sem permissão (buscar); `422` depósito já disponibilizado/transferido, ou pedido já `available`.

## 7. O que o financeiro confirma ANTES e DEPOIS

**Antes (passo Confirmar benefício / lista Beneficiários):** lote congelado; payload = só **conferidas** (D20); conferir abre o resumo (D24); **a conferir** fica na lista; mapeamento pessoa ↔ Flash, modalidade ↔ `benefitId` ativo, valor em centavos ≥ mínimo da API, cartão de ônibus **é** depósito (D19) — **a conferir** só por cadastro/valor/outro motivo, não por canal desconhecido —, um par colaborador+modalidade por linha. Sem ok de diretor.

**Envio (passo Flash · etapa 2):** resumo da parcial; **Confirmar envio ao Flash** dispara o pedido. Sem **Baixar boleto**, sem espera do retorno, sem taxa como arquivo.

**Depois (passo Boleto · etapa 3):** `orderId` **desse** pedido, estado via `consultar_pedido` (hoje BuscarPedido — GET automático D28 e manual D29; o provedor atual não publica webhook; F49 restringe o canal, não a espera D27), `billId` se boleto, **Baixar boleto**, `totalAmount` = soma das conferidas enviadas (inclui ônibus conferido), `totalFee` visível à parte **neste retorno**. Só então o ciclo segue para **Omie**, e o Omie só cobre o que este pedido confirmou.

## 8. Mapping colaborador / modalidade / valor

| Lote interno | Campo Flash | Fonte |
|---|---|---|
| Identidade Morada (e-mail `@morada`) | `employeeId` | Cadastro Flash / `GET /core/v1/employees` (todos já estão no Flash — fato F37) |
| Nome | `employeeName` | Flash / identidade |
| Documento | `employeeDocument` | CPF só números — **não** é o login interno |
| Modalidade da política (slots D16; ônibus = Flash D19; `name`/`benefitId` **a confirmar**, P07) | `benefitId` + `benefitName` | Listar benefícios no CNPJ; bloquear as não recarregadas depois do GET |
| Valor da linha | `amount` | Inteiro em centavos |
| Empresa | `companyId` / `cnpj` na confirmação | Cadastro Flash da Morada |
| Responsável | `adminEmail` | Admin Flash; três pessoas do financeiro têm painel (fato F35) — a API usa chave, não CPF da UI |

Falha de mapeamento = exceção de conferência, não chute de `employeeId` vizinho.

## 9. Idempotência

A API Flash **não documenta** header de idempotência. O que existe:

- Duplicata no mesmo pedido: `409` no par colaborador+benefício.
- O domínio (SRD-01) ainda recusa antes, chave `(competencia, colaborador, modalidade)`.
- `orderId` / `depositId` / `billId` são as referências para não criar segundo pedido da mesma competência (pendência P27).

Não inventar `Idempotency-Key`.

Retentativa da **política de entrega** (§10) **reusa** a chave do domínio: consultar `orderId` / `depositId` antes de repetir o POST. `409` amarra o par existente; não é segundo depósito.

## 10. Política de entrega (espera progressiva e fila de não processados)

Isto é política da Morada sobre as chamadas Flash — **não** está no manual do provedor e **não** escolhe broker (SQS etc.). A mesma política vale para o mock Omie no recorte 2. Contrato: [SRD-01 §6.1](../srd/SRD-01-contratos-de-capacidade.md) e [SRD-02 §3.1](../srd/SRD-02-qualidade-risco-e-medicao.md).

**Espera progressiva** (backoff no jargão; **não** é copy de tela): intervalo **exponencial com jitter** (variação aleatória no intervalo, para as tentativas não alinharem). Política, não vendor.

**Idempotência (SRD-02):** chave `(competencia, colaborador, modalidade)`. Toda retentativa consulta o efeito já gravado **antes** de repetir o POST. Sem isso, a retentativa vira duplicidade.

### 10.1 O que entra na espera (até N)

N a calibrar no 1º ciclo — **não** inventar o número aqui.

| Classe publicada | O que a política faz |
|---|---|
| `409` (par colaborador+benefício já no pedido) | **Consultar** depósitos do pedido. Se o par já existe, amarrar `depositId` à linha e seguir (sucesso idempotente). Se não amarrar, esperar e tentar de novo até N. **Não** POST cego. |
| `422` pedido já faturado / já confirmado | **Consultar** o pedido. Depósito **novo** em pedido imutável **não** entra — caminho da fila, motivo de **depósito**. Se a etapa era **confirmar** e o pedido já está `billed` / confirmado: sucesso da etapa (não segundo faturamento). Não dispara segundo `POST .../confirm`. |
| `5xx` | Espera progressiva; consultar; repetir o verbo **só** se a consulta mostrar que o efeito não ocorreu. |
| Timeout / sem resposta | Igual `5xx`. **Confirmar** é o caso perigoso: o pedido pode ter virado imutável do outro lado. Sempre consultar antes de confirmar de novo. |

### 10.2 O que **não** entra na espera

`400` de negócio — recusa permanente, **zero** espera, fila na hora:

- depósito: campo obrigatório ausente, `amount` < 200, benefício inativo ou de outra empresa;
- confirmação: campo ausente, data inválida, **fim de semana ou feriado**.

`403` / `404` estáveis (sem permissão, pedido inexistente) seguem a mesma regra: não são transitórios.

### 10.3 Onde a espera para e a fila começa

1. Primeira recusa permanente (`400` e equivalentes) → **fila de não processados** na hora. A automática nem começa.
2. Classe retentável → espera até **N**. Esgotou N sem efeito correlacionável à chave → a automática **para** → fila.
3. Depois disso, só o operador retenta, pela **Observância da integração** (copy da lista: **Não processados**). Não é consola de ops em inglês.

Cada item guarda: **payload** da chamada, **etapa** (`criar pedido` | `depósito` | `confirmar`), **colaborador** (vazio em criar pedido), **competência**, **erro** (código + texto publicado). Pedido confirmado é imutável — os motivos **não** se misturam:

| Etapa | Motivo típico na fila | O que **não** fazer |
|---|---|---|
| criar pedido | pedido não criado após N, ou `400` de `companyId` | montar depósitos sem `orderId` |
| depósito | `409` não amarrado; `5xx`/timeout esgotados; `422` em pedido já faturado; `400` de negócio | POST de depósito num pedido já confirmado, como se ainda fosse montagem |
| confirmar | timeout/`5xx` sem estado conhecido após N; `400` data/feriado | segundo `confirmar` às cegas; tratar falha de confirmar como se fosse falha de depósito |

O lote congelado **não** muda. Sem confirmar pedido incompleto em silêncio (PRD-02). Item na fila não concilia a competência.

Retentativa humana usa a **mesma** chave e a **mesma** consulta-antes-do-POST.

## 11. Conciliação com o lote

Uma competência não fica **conciliado** no Flash enquanto:

- soma das linhas do lote (principal) ≠ soma dos depósitos efetivos (`totalAmount`);
- taxa não estiver explícita (`totalFee` = soma das `fee` **por pedido**; pendência P11: a entrevista não perguntou se existe taxa, quem paga, nem se N boletos = N taxas);
- pedido não estiver identificável (`orderId`) e, no caminho boleto, sem `billId`;
- status não for o esperado para “creditou” (`available` no guia) se a conciliação exigir crédito, não só faturamento.

Listar depósitos por colaborador é o gancho oficial de “validar valores creditados versus planejados”.

## 12. O que falta validar

- Credenciais: como gerar/rotacionar `x-flash-auth`; usuário de sistema vs CPF de admin (pendência P19).
- Sandbox / empresa de teste: **não descrito** nas páginas fetchadas.
- Cartão de ônibus / VT: **canal fechado em D19** (depósito Flash, premissa de recorte). GET ainda precisa do `benefitId` (P07; hipótese Vale-transporte).
- **P07:** GET ainda precisa dos `name`/`benefitId` dos slots (D16: Multibenefícios, Auxílio gasolina, Cartão de ônibus, Flexível) e das habilitadas e não recarregadas (hipótese Cultura, Saúde; 3 slots vs 4 SKUs). GET **não** foi executado. Copy do operador continua a regra da sala. Equivalente Flash (P07) **não** entra na lista nem no Detalhe.
- Qual meio a Morada usa hoje: `BILLET` ou `BALANCE`; ordem boleto × banco × “processar no Flash” (pendência P16).
- Qual caminho de listar depósitos vale hoje.
- Se `confirmed` existe de verdade no status do pedido.
- Regras completas de `creditDate` (seção incompleta no fetch).
- `companyId` real da Morada e se o grupo tem mais de uma empresa.
- N da espera progressiva (calibra no 1º ciclo; política em §10, não no manual Flash).

## 13. Páginas oficiais usadas

- https://docs.api.flashapp.services/Geral/Introducao
- https://docs.api.flashapp.services/Beneficios/CriarPedido
- https://docs.api.flashapp.services/Beneficios/AdicionarDeposito
- https://docs.api.flashapp.services/Beneficios/CancelarDeposito
- https://docs.api.flashapp.services/Beneficios/ConfirmarPedido
- https://docs.api.flashapp.services/Beneficios/BuscarPedido
- https://docs.api.flashapp.services/Beneficios/CancelarPedido
- https://docs.api.flashapp.services/Beneficios/ListarDepositosPorColaborador
- https://docs.api.flashapp.services/api/beneficios
- https://docs.api.flashapp.services/Colaboradores/GerenciarColaboradores
- https://docs.api.flashapp.services/api/colaboradores
- https://docs.api.flashapp.services/api/empresas
- https://docs.api.flashapp.services/api/~schemas (schemas `CreateOrder`, `CreateOrderDeposit`, `ConfirmOrder`, `GetBenefitsResponse`, `OrderResponse`)
- https://flashapp.com.br/gestao-de-beneficios (catálogo de produto; mais de cinco nomes)
- https://faq.flashapp.com.br/kb/guide/pt-BR/onde-aceita-e-como-usar-o-meu-cartao-flash-e5yQA7tfeC/Steps/4198095
- https://faq.flashapp.com.br/kb/guide/pt-BR/o-que-e-saldo-exclusivo-e-flexivel-do-seu-cartao-flash-G0nd1Ro1LV/Steps/4198168
