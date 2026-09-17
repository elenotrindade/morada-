# Semente da planilha (protótipo)

**PREMISSA DE PROTÓTIPO / exemplo.** A entrevista **não** deu valores em R$. O financeiro **não** afirmou estas cifras. P01 (diário), P02 (faixas) e P05 (Flexível) continuam **pendência** no PRD. **Não** entra no PRD como política (D18).

Origem fictícia: colunas no estilo da planilha de controle (fato F22: a planilha **tem** diário CLT, fixo de combustível, mensal PJ — os números abaixo são seed, não a planilha vigente).

Código: `proto/backoffice/js/data.js` (`pessoas[].diarioCentavos` / `flexivelCentavos`, `SEMENTE.gasolinaCentavos`, `SEMENTE.onibusCentavos`). Contrato de carga: [PRD-04](prd/PRD-04-carga-da-planilha.md). Canal do ônibus = D19 (PREMISSA DE RECORTE, não entrevista).

## Diário Multibenefícios por pessoa (D18)

Um rate por CLT no proto. H01 (diário único na política) **não** fecha. Total = diário × dias úteis do **calendário**.

| Colaborador | Diário seed | × 21 (set/2026 cal.) | Nota |
|---|---|---|---|
| Ana Souza | R$ 42,00 | R$ 882,00 | Calendário manda. Cifra se a célula da planilha fosse 22 **não** entra na lista |
| Bruno Lima | R$ 35,00 | R$ 735,00 | |
| Diego Alves | R$ 40,00 | R$ 840,00 se o cadastro estivesse completo | UI setembro: **a informar** (cadastro incompleto) |
| Elena Rocha | R$ 38,00 | R$ 798,00 | |
| Giselle Pinto | R$ 45,00 | R$ 945,00 | Desligada; **não é linha de Beneficiários** |
| Hugo Martins | R$ 48,00 | R$ 1.008,00 | |
| Igor Castro | R$ 36,00 | R$ 756,00 | |
| Janaína Melo | R$ 50,00 | R$ 1.050,00 | |

## Outros parâmetros

| Parâmetro | Valor seed | Fórmula na UI |
|-----------|------------|---------------|
| Auxílio gasolina · 5 km | R$ 280,00 | faixa fixa; não usa dias úteis |
| Auxílio gasolina · 10 km | R$ 420,00 | faixa fixa |
| Auxílio gasolina · metropolitana | R$ 620,00 | faixa fixa |
| Flexível · Carla Dias | R$ 1.050,00 / mês | mensal fixo |
| Flexível · Felipe Nunes | R$ 980,00 / mês | UI setembro: **a informar** (valor ausente no cadastro) |
| Cartão de ônibus | R$ 198,00 / mês | mensal fixo; **PREMISSA DE PROTÓTIPO** (D19) — o financeiro **não** deu este valor |

Competência aberta do proto: **setembro/2026**. Calendário nacional no seed: **21** dias úteis.

## Linhas · setembro/2026

Lista Beneficiários = **só ativos**. Giselle Pinto **não aparece**. Toda linha começa **a conferir** até o operador confirmar (D23). Sem “planilha 22”, sem “dias divergem”, sem “no provedor a confirmar”, sem **conferida (automática)**. Dias úteis na coluna = calendário (**21**). “A informar” é valor.

| Colaborador | Benefício | Base (planilha-semente) | Dias cal. | Total linha | Situação no proto |
|---|---|---|---|---|---|
| Ana Souza | Multibenefícios | R$ 42,00 / dia | 21 | **R$ 882,00** | a conferir |
| Ana Souza | Auxílio gasolina | R$ 420,00 (10 km) | — | R$ 420,00 | a conferir |
| Bruno Lima | Multibenefícios | R$ 35,00 / dia | 21 | R$ 735,00 | a conferir |
| Bruno Lima | Auxílio gasolina | R$ 280,00 (5 km) | — | R$ 280,00 | a conferir |
| Carla Dias | Flexível | R$ 1.050,00 / mês | — | R$ 1.050,00 | a conferir |
| Diego Alves | Multibenefícios | R$ 40,00 / dia no seed; cadastro incompleto | 21 | **a informar** | a conferir |
| Diego Alves | Cartão de ônibus | R$ 198,00 / mês (seed) | — | R$ 198,00 | a conferir |
| Elena Rocha | Multibenefícios | R$ 38,00 / dia | 21 | R$ 798,00 | a conferir |
| Elena Rocha | Cartão de ônibus | R$ 198,00 / mês (seed) | — | R$ 198,00 | a conferir |
| Felipe Nunes | Flexível | R$ 980,00 / mês no seed; valor ausente | — | **a informar** | a conferir |
| Hugo Martins | Multibenefícios | R$ 48,00 / dia | 21 | R$ 1.008,00 | a conferir |
| Hugo Martins | Cartão de ônibus | R$ 198,00 / mês (seed) | — | R$ 198,00 | a conferir |
| Igor Castro | Multibenefícios | R$ 36,00 / dia | 21 | R$ 756,00 | a conferir |
| Igor Castro | Auxílio gasolina | R$ 280,00 (5 km) | — | R$ 280,00 | a conferir |
| Janaína Melo | Multibenefícios | R$ 50,00 / dia | 21 | R$ 1.050,00 | a conferir |
| Janaína Melo | Cartão de ônibus | R$ 198,00 / mês (seed) | — | R$ 198,00 | a conferir |

“A informar” só em cadastro incompleto (Diego · Multibenefícios) e valor ausente (Felipe · Flexível). Ônibus recebe R$ seed (PREMISSA D19), não entrevista. Conferir (1-a-1 ou **Marcar como conferidos**) abre o resumo Flash daquela parcial (D24). **Confirmar envio** dispara o provedor.

Na **lista** Beneficiários, coluna Valor do CLT é a **soma** Multibenefícios + escolha (um número). Diego = **a informar** (peça Multibenefícios ausente) — não R$ 198 do ônibus sozinho. Elena = R$ 798 + R$ 198 = **R$ 996,00**. PJ = só Flexível. Discriminado fica no Detalhe.

## Taxa (não é semente de benefício)

GET `depositFees` **não** executado. Flash **R$ 1,00** no proto = **PREMISSA DE PROTÓTIPO** (simula o retorno do pedido), não fato da entrevista.

| | Flash | Omie | visível (soma) |
|---|---|---|---|
| Fórmula | soma das `fee` de cada depósito na confirmação | R$ 1,99 × N boletos (liquidação Omie.CASH Completa) | Flash + Omie |
| Desta parcial (exemplo) | R$ 1,00 | R$ 1,99 | R$ 2,99 |

## Chrome da esteira

Verde (feito / ✓) = competência **sem pendência** (nenhum passo a ser feito). **Não** é “passo já visitado”. Com **a conferir**, Flash não enviado, espera de boleto, Omie, oks de diretor ou comprovante ausente: **nenhuma** aba verde. Etapa atual = azul. Contador amarelo de **a conferir** permanece em Confirmar benefício. Setas ‹ › inalteradas.

A espera da etapa Boleto no proto é **simulada** (timer = poll automático D28 + botão **Atualizar retorno** = GET manual D29, mesmo caminho). Cobre D27 (esperar o retorno) pelo canal `consultar_pedido`. **Não** há webhook fake. **Baixar boleto** e a taxa do retorno vivem na etapa 3 — não na etapa Flash.

Sessão do proto: **Operador interno** (`financeiro@morada`) — DECISÃO DE PROTÓTIPO, não fato de login. **Sem** card **Histórico da esteira** sob o wizard (chrome fora — recorte de UI). Banco: **Quem anexou** em cada comprovante. D25 = eventos no contrato, não dump-list.

Meses fechados no proto (julho 23 dias, agosto 21) recalculam Multibenefícios com o diário da pessoa × calendário da competência, inclusive Diego e Felipe (`forcarCalculo`).

## Recaptura

Lista: coluna Valor = soma CLT (não só a escolha). URLs de captura (servir `proto/backoffice` em `:8765`) em [`docs/entrega/README.md`](entrega/README.md):

- lista Beneficiários — `index.html?demo=lista#/financeiro/beneficios` (ativos **a conferir**, sem Giselle)
- Detalhe da escolha — mesma URL; **Detalhes** em Ana Souza (nota Vale-transporte, sem “não é depósito no Flash”)
- Flash / pedido — `index.html?demo=flash#/financeiro/beneficios/flash`: accordion **Nesta parcial** por departamento; uma linha por colaborador; só conferidas pendentes; **Confirmar envio ao Flash**; sem **Baixar boleto**, sem espera, sem taxa-como-arquivo
- Boleto (`/retorno`) — `index.html?demo=boleto#/financeiro/beneficios/retorno` (feliz, retorno já ok) ou `demo=boleto-falha` / `demo=boleto-espera`
- Omie — `index.html?demo=omie#/financeiro/beneficios/omie`: uma linha por colaborador; boleto recolhido aberto
- Diretores — `index.html?demo=diretores#/financeiro/beneficios/diretores`: copy **O crédito no Flash aprovado. Favor verificar e aprovar o pagamento.**
- Banco — `index.html?demo=banco#/financeiro/beneficios/banco`: boleto recolhido + comprovantes com prévia
