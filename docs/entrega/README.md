# Entrega — colar no Google Docs

Arquivo a publicar: [`proposta-product-engineer.md`](proposta-product-engineer.md). Imagens em [`screenshots/`](screenshots/). **Capturas a inserir** — o operador tira as PNGs; os `![](screenshots/0N-….png)` da proposta são placeholder.

1. Abra o Google Docs **já usado** para a proposta (Arquivo → Abrir; não crie outro).
2. Cole o Markdown da proposta (Docs não resolve `![](screenshots/…)` sozinho).
3. Arraste cada PNG de `screenshots/` para o lugar da figura correspondente (`01` Beneficiários → `07` Banco).
4. Confira a caixa do topo e os captions; cifras nas telas **não** são da entrevista.
5. O link do proto no final é `URL_DO_REPO_ABERTO` até existir remote público — não invente URL.

## Captura — URLs demo

Servir `proto/backoffice/` em `127.0.0.1:8765`. Cada `?demo=` pinta `ciclo.parciais` + `passo` com a mesma parcial semente (vários departamentos, CLT e PJ; cifras de [`docs/proto-semente.md`](../proto-semente.md), não da entrevista). Giselle Pinto não entra na lista. Diego e Felipe ficam **a informar** / **a conferir**.

| Etapa | PNG | URL |
|---|---|---|
| Beneficiários | `screenshots/01-beneficiarios.png` | http://127.0.0.1:8765/index.html?demo=lista#/financeiro/beneficios |
| Detalhe | `screenshots/02-confirmar.png` | mesma URL; **Detalhes** em Ana Souza |
| Flash | `screenshots/03-flash-resumo.png` | http://127.0.0.1:8765/index.html?demo=flash#/financeiro/beneficios/flash |
| Boleto | `screenshots/04-boleto.png` | http://127.0.0.1:8765/index.html?demo=boleto#/financeiro/beneficios/retorno |
| Omie | `screenshots/05-omie.png` | http://127.0.0.1:8765/index.html?demo=omie#/financeiro/beneficios/omie |
| Diretores | `screenshots/06-diretores.png` | http://127.0.0.1:8765/index.html?demo=diretores#/financeiro/beneficios/diretores |
| Banco | `screenshots/07-banco.png` | http://127.0.0.1:8765/index.html?demo=banco#/financeiro/beneficios/banco |

`demo=boleto` já traz o retorno (iframe + taxa no slip + **Nesta parcial**), sem esperar o timer. Extra: `demo=boleto-falha` e `demo=boleto-espera` no mesmo hash `/retorno`.
