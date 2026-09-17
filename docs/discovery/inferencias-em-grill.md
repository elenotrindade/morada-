# Inferências em grill

Sessão **encerrada** (rodada 3). Revisão do que o contrato inferiu; fatos em [`fatos-hipoteses.md`](./fatos-hipoteses.md). Linguagem: [`CONTEXT.md`](../../CONTEXT.md).

## Encerramento

| ID | Tipo | Enunciado |
|---|---|---|
| D09 | DECISÃO | Grill: não omitir CLT-ônibus; não promover “ônibus fora do Flash” a invariante. **Canal supercedido por D19.** |
| D19 | DECISÃO DE RECORTE / PREMISSA | Cartão de ônibus também é depósito Flash (XOR gasolina) para o ciclo depositar. O financeiro **não** disse Flash para ônibus. Fecha P06 — **não** é GET. Identificadores = P07. |
| D10 | DECISÃO | Lote **antecipa** a competência. Cinco dias úteis antes + ativo no corte = premissa de política a confirmar com o financeiro. Multibenefícios = diário × dias úteis do mês financiado. |
| D11 | DECISÃO DE RECORTE | Perfil de benefício **escreve** (destino). Planilha, se útil, é **gerada** (exportação). Não perguntado na sala. |
| D15 | DECISÃO DE RECORTE | Recorte 1 da **carga**: planilha continua hábito; sistema **lê** (arquivo ou imagem); calendário manda em dias; **Gerar planilha** devolve arquivo. Sync bidirecional depois. Não fingir que o financeiro matou o Excel. |
| D12 | DECISÃO DE RECORTE — SUPERSEDEDA EM PARTE | Conferência não some; taxa automática = automática / ciclo. Trava “zero a conferir bloqueia o mês” cai → D20. |
| D20 | DECISÃO DE RECORTE / INVARIANTE | Wizard só encaminha **conferidas**. **A conferir** fica na lista e não entra no payload. |
| D21 | DECISÃO DE RECORTE | Comprovante do boleto no bucket (`ArmazenamentoDeComprovantes`). |
| D22 | DECISÃO DE RECORTE | Várias parciais na competência **permanecem possíveis**. 1-a-1 percorre o ciclo inteiro; lote é acelerador. Histórico acumula. **H20** (hipótese sua) recomenda um envio — não trava. |
| D23 | DECISÃO DE RECORTE | Situação = **a conferir** \| **conferida**. Entrevista: “um confere” / conferências (F45). Sem automática, correção, catálogo, divergência de calendário. |
| D24 | DECISÃO DE RECORTE | Dois tempos. **Conferir** / **Marcar como conferidos** abre o resumo Flash. **Confirmar envio ao Flash** dispara o provedor. Um botão na barra de Beneficiários. Sem Omie na lista. |
| D13 | DECISÃO DE RECORTE | Recorte 1 **não** move o ok de diretor para antes do Flash. Financeiro executa o payload conferido (D20). |
| D14 | DECISÃO DE RECORTE | Objeto dos diretores = **pagamento** (boleto/banco, consolidado de pagamento no e-mail). Objeto do financeiro = **lote de crédito conferido**. Diretor não opera linha. |
| D17 | DECISÃO DE COPY | Etapa 1 e ação visível: **confirmar benefício** (não “confirma crédito” / “confirmar crédito”). No domínio o objeto continua o **lote congelado** e o crédito ao colaborador; **conferência** é o nome lógico. |
| D18 | DECISÃO DE PROTÓTIPO | Semente de R$ **só** no proto + [`proto-semente.md`](../proto-semente.md). **Não** entra no PRD como política (P01/P02/P05 seguem pendência). Diário de Multibenefícios **varia por pessoa CLT** na semente; H01 (diário único) continua aberta no contrato. |

Pendências da sala (P01–P05, P07–P28, H01, F11, P20) continuam pendências — não rodada 4. **P06 fechada** em D19 (premissa de recorte, não GET).

---

Legenda: **FATO** · **HIPÓTESE** · **PREMISSA** / **DECISÃO DE RECORTE** · **PENDÊNCIA**. Sem cifra inventada.

## Assentado (detalhe)

Fatos da sala (F06–F42, D03–D08) não se relitigam.

### 1–2. Ônibus e antecipação — D09, D10, D19

**D19 (depois do grill):** cartão de ônibus também é depósito Flash, XOR auxílio gasolina, para o ciclo depositar. O financeiro **não** disse o canal; P06 fecha como premissa de recorte, **não** GET. D09 ainda vale: não omitir a pessoa. Ônibus **não** fica **a conferir** só por canal desconhecido. Antecipação (D10) é modelo de política; cinco dias úteis antes do mês, a confirmar.

### 3. Planilha não escreve a verdade — D11, com carga D15

Perfil no backoffice é a escrita **no destino**. Planilha gerada = exportação se o financeiro quiser o artefato. **Não foi perguntado**; o financeiro pode continuar no Excel. Recorte da **carga** (D15, depois do grill): o sistema **lê** a planilha que ela já preenche (arquivo ou imagem) para pré-preencher; não força abandonar o Excel no dia 1; calendário ainda manda em dias úteis. Campos de elegibilidade no backoffice ainda abertos (pendência P18). Inventário fato vs palpite: [`fontes-de-dados.md`](./fontes-de-dados.md).

### 4. Payload só conferidas — D20 (D12 em parte)

D12 (grill): conferência não some; taxa de automatização se mede à parte (**não** é chip **conferida (automática)**). A leitura “zero a conferir bloqueia o mês” **cai**. **D20:** o wizard só encaminha **conferidas**; **a conferir** fica na lista e não entra no pedido. **D24:** conferir **abre o resumo Flash**; **Confirmar envio** dispara o provedor. Cartão de ônibus **é** candidato (D19): se **a conferir**, não vai no payload.

### 5. Diretores no pagamento, não no crédito — D13, D14

F26: hoje o ok é o relatório do que vai ao **banco**. Recorte 1 **não** inverte: linhas **conferidas** (D20) → financeiro confirma o Flash; consolidado de pagamento identificável no e-mail dos diretores (link da etapa 5); não planilha solta. Recusa de diretor não desfaz pedido confirmado (estorno pós-crédito — pendência P24). Aprovação solta (hipótese H07) fica só no objeto pagamento (consolidado de pagamento travado no e-mail). Ok fora do e-mail (hipótese H08) não é recorte 1.

### Ainda abertas (fora do grill)

Duplicidade no pedido (pendência P20) no SRD-01 vs inventário; valor diário único (hipótese H01) na política vs perfil; escolha de transporte obrigatória vs opcional (fato F11).

### D17 — copy da etapa 1 (depois do encerramento)

Pedido de produto, não da sala: o chrome chama a etapa 1 e a ação **confirmar benefício**. “Confirma crédito” / “confirmar crédito” saem da UI e da copy do operador. O domínio não muda: **conferência** sobre o **lote congelado** (crédito ao colaborador). Cifras em R$ no proto são semente ([proto-semente.md](../proto-semente.md)), não fala do financeiro.

### D18 — semente proto-only, diário por pessoa

Grill Q1–Q2: cifras **não** vazam para o PRD. O proto usa um diário de Multibenefícios **por CLT** (e Flexível ligeiramente distinto por PJ) para a tabela parecer planilha real. Isso **não** fecha H01 nem P01. Gasolina continua por faixa. Cartão de ônibus no proto tem valor mensal seed (PREMISSA, D19) — não entrevista. O financeiro não deu estes R$.

### D19 — ônibus também é Flash (recorte)

Pedido de recorte, não da sala: assume-se depósito Flash no lado ônibus da escolha XOR para o ciclo poder depositar. Honestidade: o financeiro nomeou a escolha (F11) e o programa Flash (F06); **não** disse que ônibus entra no pedido. Identificadores (Vale-transporte vs Auxílio Mobilidade) ficam em P07. H02 (ônibus fora) fica supersedida.

## Linguagem fechada

1. **Escolha de transporte ≠ modalidade.**
2. **Antecipação ≠ apuração.**
3. **Perfil escreve** (destino, D11). Recorte 1 da carga **lê** a planilha (D15) sem matar o Excel. Planilha gerada é exportação. Sync bidirecional não é recorte 1.
4. **Taxa de sucesso da automatização** (H11 / F45) **não** é chip de tela no recorte 1. **D20** = só conferidas no payload. **D24** = conferir abre o resumo Flash; Confirmar envio dispara o provedor.
5. **Conferência** (financeiro) = lote de crédito. **Aprovação de pagamento** (diretores) = boleto/banco. Não são o mesmo ato.
6. **Lote congelado** = verdade do ciclo (ADR-0001).
7. **Confirmar benefício** (copy, D17) = etapa/ação. **Conferência** = ato de domínio sobre o crédito do lote.
8. **Semente de R$** (D18) = proto + `proto-semente.md`. Não é política. Diário no proto varia por pessoa; H01/P01 seguem abertos.
9. **Ônibus = Flash** (D19) = premissa de recorte. P06 fechada. Não é GET. Copy da sala permanece **cartão de ônibus**.
