# Log de pesquisa — Flash e Omie

Data: **2026-09-15**.  
Fontes de verdade (indicadas para este trabalho):

1. https://docs.api.flashapp.services/Geral/Introducao
2. https://developer.omie.com.br/

Nada abaixo inventa endpoint que não tenha aparecido em página fetchada ou no snippet oficial da busca.

## Flash

| # | O que | URL | Resultado | Confiança |
|---|---|---|---|---|
| 1 | Intro API 2.0 (canônica) | https://docs.api.flashapp.services/Geral/Introducao | Auth, colaboradores, benefícios (controle/pedido/disponibilização), suporte `api-suporte@flashapp.com.br`. Fetch da home raiz `docs.api.flashapp.services/` falhou. | alta no texto recuperado; links de nav não vieram no fetch |
| 2 | Criar pedido | https://docs.api.flashapp.services/Beneficios/CriarPedido | `POST /benefits/v1/orders`, `companyId`, status `requested` | alta |
| 3 | Adicionar depósito | https://docs.api.flashapp.services/Beneficios/AdicionarDeposito | 1 depósito por colaborador+benefício; centavos; mín. 200; campos e erros | alta |
| 4 | Cancelar depósito | https://docs.api.flashapp.services/Beneficios/CancelarDeposito | `.../deposits/{depositId}/cancel`; libera o par | alta |
| 5 | Confirmar pedido | https://docs.api.flashapp.services/Beneficios/ConfirmarPedido | `BILLET`/`BALANCE`; pedido imutável; `billId`; erros de data/feriado. Seção “Regras para a data de crédito” **sem corpo no fetch**. | alta no restante; baixa nas regras de data |
| 6 | Buscar pedido | https://docs.api.flashapp.services/Beneficios/BuscarPedido | Ciclo `requested`…`available`; inclui `confirmed` no guia | alta no guia; média no enum vs OpenAPI |
| 7 | Cancelar pedido | https://docs.api.flashapp.services/Beneficios/CancelarPedido | Motivo; `422` se `available`; boleto invalidado se `billed` | alta |
| 8 | Listar depósitos | https://docs.api.flashapp.services/Beneficios/ListarDepositosPorColaborador | Guia usa `/api/deposits/employees/{id}` | média (caminho diverge do OpenAPI) |
| 9 | OpenAPI benefícios | https://docs.api.flashapp.services/api/beneficios | Mesmas operações + `GET /benefits/v1/benefits`; listar depósitos em `/benefits/v1/orders/deposits/employees/{id}` | alta no que está na página |
| 10 | Schemas | https://docs.api.flashapp.services/api/~schemas | `CreateOrder`, depósito, `ConfirmOrder`, `GetBenefitsResponse`, status | alta |
| 11 | Colaboradores | https://docs.api.flashapp.services/Colaboradores/GerenciarColaboradores e `/api/colaboradores` | Status apto a benefício; header `x-flash-auth`; `GET /core/v1/employees` | alta |
| 12 | Empresas | https://docs.api.flashapp.services/api/empresas | `GET /core/v1/companies`; `x-flash-auth` | alta |
| 13 | Como gerar chave | slugs tentados: `/Geral/ComoGerarChave`, `/Geral/Autenticacao`, `/Geral/GerarChaveAPI`, `/Geral/ChaveDeAPI` | Fetch erro/404. Intro cita o bloco; **caminho de tela não recuperado**. | baixa |
| 14 | Listar benefícios (guia) | slugs `/Beneficios/ListarBeneficios`, `ListarBeneficiosDaEmpresa`, `BuscaBeneficios`, `Listar-Beneficios` | Erro. Operação só no OpenAPI + menção em Adicionar Depósito. | média (existe a operação; falta guia) |
| 15 | Cartão corporativo | `/api/cartao-corporativo`, `/CartaoCorporativo/*` | Outra API (`PIX`, `creditType`). Fora do recorte de benefícios. | alta de que não é este fluxo |
| 16 | Flash ↔ Omie nativo | https://faq.flashapp.com.br/.../como-configurar-a-integracao-do-flash-com-o-erp-omie-... | Flash **Despesas** (reembolso), não recarga de benefícios. | alta de que é outro produto |
| 17 | Catálogo de produto | https://flashapp.com.br/gestao-de-beneficios | Dez cartões: Multibenefícios (flexível), Vale-alimentação e refeição, Alimentação, Refeição, Saúde, Auxílio Mobilidade, Educação, Auxílio Home Office, Cultura, Vale-transporte. **Mais de cinco.** | alta no texto da página |
| 18 | Saldos do cartão | FAQ “onde aceita” + “saldo exclusivo e flexível” | Alimentação, Refeição, Mobilidade, Saldo Flexível + outros. VA/VR exclusivo = Lei 14.442/2022. | alta |
| 19 | Exemplo OpenAPI `benefitName` | api/beneficios depósito | **Vale Refeição** — string, não enum de 5. | alta |
| 20 | Retry / fila na doc Flash | páginas de benefícios fetchadas | **Não** há política de retry no manual. Espera progressiva + fila de não processados é contrato da Morada — [flash.md](flash.md) §10. | alta de que não veio da Flash |
| 21 | Taxa `fee` / `totalFee` | Adicionar Depósito, Confirmar Pedido, schemas | `fee` calculada automaticamente em centavos; `totalFee` na confirmação; `depositFees` no GET benefícios (propriedades não recuperadas). Exemplo schema `100` / `10000` **não** é percentual publicado. GET **não** executado → proto Flash **R$ 0,00** é **PREMISSA**, não fato da entrevista. | alta nos campos; baixa em % |

Buscas: `site:docs.api.flashapp.services` nas operações de Beneficios, Geral/auth, CriarPedido, ListarBeneficios.

Sandbox: **não encontrado** nas páginas acima.

## Omie

| # | O que | URL | Resultado | Confiança |
|---|---|---|---|---|
| 1 | Portal (canônica) | https://developer.omie.com.br/ | SOAP ou JSON; autenticação por chave do app; lista de APIs; webhooks | alta |
| 2 | Lista | https://developer.omie.com.br/service-list/ | “Contas a Pagar - Lançamentos” v1; Departamentos | alta |
| 3 | Quick Start | https://developer.omie.com.br/quick-start/ | Aponta GitHub de exemplos; raso | média (não aberto o repo) |
| 4 | My apps | https://developer.omie.com.br/my-apps/ | Tela de login/cadastro, sem spec | n/a |
| 5 | `/auth/` no portal | https://developer.omie.com.br/auth/ | 404 | — |
| 6 | Contas a pagar | https://app.omie.com.br/api/v1/financas/contapagar/ | `IncluirContaPagar`, `distribuicao` (`cCodDep`, `nValDep`, `nPerDep`) | alta |
| 7 | Departamentos | https://app.omie.com.br/api/v1/geral/departamentos/ | Listagem; método grafado `ListarDepatartamentos` na página | alta no conteúdo; grafia é da fonte |
| 8 | Chave | https://ajuda.omie.com.br/pt-BR/articles/499061-obtendo-a-chave-de-acesso-para-integracoes-de-api | `App Key` / `App Secret`; só admin | alta |
| 9 | Características API | https://ajuda.omie.com.br/pt-BR/articles/5412721-caracteristicas-e-recomendacoes-das-apis-do-omie | POST JSON `call`/`param`; sem GET; sem RESTFUL hoje | alta |
| 11 | Tarifas Omie.CASH | https://ajuda.omie.com.br/pt-BR/articles/6383302-tarifas-da-omie-cash-completa-e-simplificada | Liquidação de boleto emitido Completa: R$ 1,99. Pagamento de boletos Completa: gratuito. API contas a pagar sem campo de taxa. | alta no texto da ajuda |

Taxa visível da etapa Diretores (decisão; não diluir Omie em Flash):

| | Flash | Omie | visível (soma) |
|---|---|---|---|
| Fórmula | soma das `fee` na confirmação (`totalFee`) | R$ 1,99 × N boletos (liquidação Omie.CASH Completa) | Flash + Omie |
| Desta parcial (exemplo) | R$ 0,00 PREMISSA | R$ 1,99 fato da nota | R$ 1,99 |

## Perguntas abertas

- Como gerar e rotacionar a chave Flash (`x-flash-auth`) — página “Como gerar chave” não recuperada.
- Existe sandbox Flash? Credencial de sistema vs CPF de admin (pendência P19).
- Cartão de ônibus: **canal fechado em D19** (depósito Flash, premissa de recorte; o financeiro não disse). GET ainda precisa do `benefitId` (P07).
- Equivalente `name`/`benefitId` dos slots (D16 + D19) e das habilitadas e não recarregadas (pendência P07): GET **não** foi executado. Catálogo de produto tem **mais de cinco**; “cinco” da entrevista = hipótese de subconjunto do CNPJ. 3 *slots* vs 4 SKUs se gasolina e VT. Copy do operador = regra da sala.
- Qual path de listar depósitos está vigente.
- Status `confirmed` vs enum OpenAPI.
- Regras completas de `creditDate`.
- Qual meio a Morada usa hoje: `BILLET` vs `BALANCE` (pendência P16).
- Confirmar o nome Omie com o financeiro (pendência P26).
- Recorte 2: 8 títulos vs 1 título com `distribuicao` de 8 departamentos.
- Códigos Omie de fornecedor Flash, categoria, conta corrente, 8 departamentos — não pesquisar valores; descoberta futura.

## O que não foi feito

Cliente Omie, escolha de linguagem, cifras da política Morada, endpoints não publicados.

Política de entrega (espera progressiva + fila de não processados) **não** foi pesquisada na Flash: não está nas páginas fetchadas; é contrato interno ([flash.md](flash.md), [SRD-01](../srd/SRD-01-contratos-de-capacidade.md)).
