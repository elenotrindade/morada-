---
name: otimizacao-operacional
description: >-
  Otimiza o tempo do financeiro na operação mensal de benefícios: calendário
  nacional automático de dias úteis, motor de cálculo e API Flash no recorte 1
  (Omie só depois). Use when o pedido for integração, Flash, Omie, planilha,
  dias úteis, calendário, gargalo operacional, recorte, ou parar a digitação
  / planilha do financeiro.
---

# Otimização operacional

Trabalho do financeiro, não throughput de API. Contrato: skill `product-engineer`. UI: skill `ui-operacao`.

Fontes: `docs/discovery/fatos-hipoteses.md` (F29, F30, D15), `docs/prd/PRD-02-operacao-do-lote.md`, `docs/prd/PRD-04-carga-da-planilha.md`, `docs/integracoes/`. APIs: [Flash 2.0](https://docs.api.flashapp.services/Geral/Introducao), [Omie](https://developer.omie.com.br/).

## Gargalo (fato)

Dois sumidouros de tempo, os dois manuais **hoje**:

1. **Flash** — pessoa × modalidade × valor no painel (F23, F29). É o gargalo declarado.
2. **Planilha de dias úteis** — o financeiro preenche todo mês feriados nacionais à mão porque Multibenefícios = valor diário × dias úteis (F09, F21, F30).

A planilha **é** escritora hoje. A solução **para a escrita de dias úteis** (calendário calcula). O hábito de preenchimento **pode** permanecer no recorte 1 (decisão D15): o sistema **lê** para pré-preencher; não fingir que o financeiro matou o Excel. Não reescrever a contagem manual (fato F30) como se já fosse automática.

## Recorte 1 (o que otimiza)

| Peça | Papel |
|------|--------|
| Calendário oficial | dias úteis da competência, calendário nacional (não digitados). Operador **não** preenche o mês **no sistema**. |
| Carga da planilha | `PlanilhaDeControle`: `ler_linhas` (arquivo ou imagem) pré-preenche; `gerar_arquivo` devolve Excel se ainda precisarem. Sem `sincronizar` no recorte 1. |
| Motor | Fórmulas do PRD-01/02 sobre perfil + calendário → lote. |
| Porta Flash | Pedido, depósitos, confirmação. Caminho feliz sem painel. |

Omie **não** é recorte 1 (8 lançamentos já são o trecho rápido). Mock / manual igual ao consolidado de pagamento.

Flash entra primeiro **porque come tempo**, não porque a API é mais bonita.

## Recorte 1 não é

- Identidade interna como fonte (divergência da planilha) — depois; ponte = carga unidirecional da planilha → pré-preencher → perfil escreve depois da conferência (D11 destino, D15 carga; premissa, não acordo da sala).
- Sync bidirecional sistema ↔ Excel (dois escritores). Cliente Omie, UI dos diretores, endereço self-service, feriado municipal (pendência P12), pró-rata (pendências P09/P10).

## Proibido

- Otimizar escondendo linhas de **ônibus** (D19: depósito Flash visível; XOR gasolina).
- Inventar R$, endpoint fora da doc oficial, ou “Integração” genérica.
- Adiar o calendário para “depois do Flash”: o motor do recorte 1 **já** usa calendário; a célula mensal não manda no sistema.
- Trava de diretor na execução Flash (decisões D13/D14: diretores no **pagamento**).
- Deixar a planilha **sobrescrever** dias úteis do calendário em silêncio.
- Trocar Flash ou Omie.

## Pipeline

**Confirmar benefício → Flash → Boleto → Omie → Diretores → Banco**

Pipeline no cabeçalho do ciclo, não como situação da linha.

## Situação da linha e trava do Flash

Enum (D23): **a conferir** \| **conferida**. Ônibus **não** é motivo de **a conferir** por canal desconhecido (P06 fechada / D19). Sem **conferida (automática)**, **com correção**, **no provedor a confirmar** ou divergência de calendário como situação.

**Taxa de sucesso da automatização** (H11 / F45) fica fora da tela recorte 1.

**D20:** o wizard só encaminha **conferidas**. **A conferir** fica na lista e não entra no Flash/Omie/diretores/banco. **D24:** conferir **abre o resumo Flash**; **Confirmar envio** dispara o provedor. **D26:** a parcial espera junta. Ônibus **é** candidato (D19). 95% da sala não é esta regra.

## Checagem

- [ ] Hoje manual (fato F30) vs solução calculada estão etiquetados, não misturados.
- [ ] Planilha **lida** ≠ escritora de dias úteis; planilha **gerada** ≠ sync bidirecional.
- [ ] Flash no recorte 1; Omie mock.
- [ ] Ônibus no pedido Flash (D19); visível; **a conferir** só por cadastro/valor, não por P06; não some.
- [ ] Flash só com linhas **conferidas** no pedido (D20); conferir abre o resumo (D24); **Confirmar envio** dispara; **a conferir** na lista.
