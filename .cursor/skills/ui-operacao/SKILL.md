---
name: ui-operacao
description: >-
  Define UI moderna e legível do backoffice de operação de benefícios (Financeiro →
  Benefícios): densidade operacional, só português, dados essenciais, filtros e
  ações em lote, tabela de beneficiários como superfície primária. Use when o
  pedido for tela, layout, CSS, protótipo, chrome da UI, filtros, bulk, pipeline
  Confirmar benefício/Flash/Boleto/Omie/Diretores/Banco, ou copy visível ao operador.
---

# UI da operação

Backoffice interno. Operador lê e age rápido. Não é marketing.

Contrato de comportamento: skill `product-engineer`. Otimização Flash/calendário: skill `otimizacao-operacional`. Densidade e chrome: [reference.md](reference.md).

## Habitat

- Entrada: **Financeiro → Benefícios**.
- Superfície primária: tabela **Beneficiários** (**uma linha por colaborador ativo a conferir** — ainda não na parcial Flash desta competência). Conferidos **saem** da listagem 1 e esperam no resumo Flash.
- Pipeline visível: **Confirmar benefício → Flash → Boleto → Omie → Diretores → Banco**. Nunca um passo chamado “Integração”. Contador amarelo de **a conferir** no passo 1 (badge, não parágrafo). Etapa 2 = **resumo** da parcial + **Confirmar envio ao Flash**. Sem **Baixar boleto**, sem espera de boleto, sem taxa-como-arquivo nesta etapa. Etapa 3 = **Boleto**: **espera do retorno deste pedido** (spinner) + **pré-visualização do boleto na etapa** (iframe) quando o retorno chega; taxa visível **dentro do mock** (campo **Taxa do provedor** `(R$ 1,00 + R$ 1,99) R$ 2,99` ao lado de valor/parcial) — sem faixa solta abaixo do iframe; **Baixar boleto** no cabeçalho e no chrome do iframe (ícones **Baixar** / **Abrir em outra aba**); **Atualizar retorno** (D29) se a espera falha, timeout ou a tela diverge — dispara a mesma `consultar_pedido` do poll (D28). Lista da parcial = o mesmo accordion da Flash (**Nesta parcial**), abaixo do iframe. Copy = a espera, não o nome do canal (consulta vs webhook). Sem “GET” no chrome. Taxa Flash no proto = **R$ 1,00** no retorno desta etapa (**PREMISSA**). Sem webhook inventado na UI.
- Omie no recorte 1 é mock, mas só lança o que o Flash confirmou na etapa 3 (subconjunto das **conferidas**, D20). Sem rótulo “recorte 2” na UI. Accordion por departamento: **uma linha por colaborador** (CLT: escolha + Multibenefícios discriminados, depois a soma; PJ: Flexível). Cabeçalho: pessoas · soma R$ — não conta depósitos Flash. Abaixo do accordion **Nesta parcial**, o boleto **recolhido** (mesmo componente de Diretores/Banco: competência · id da parcial · valor; ao abrir = iframe + taxa no slip + **Nesta parcial**). **Lançar no Omie** permanece. Diretores = **pagamento**, depois do Omie — não liberam o Flash. Copy da etapa 5: **O crédito no Flash aprovado. Favor verificar e aprovar o pagamento.** Título: **Pagamento de benefícios**. Boletos **recolhidos** (título: competência · id da parcial · valor); ao abrir = a mesma prévia da etapa 3 (iframe + taxa no slip + **Nesta parcial**). **Autorizar pagamento** permanece. Sem faixa de taxa duplicada. Sem linha de fórmula. `par-…` no título do recolhível e no campo Parcial do slip. Sem card **Histórico da esteira** sob o wizard (chrome fora — recorte de UI). Banco: um recolhível por boleto da parcial (mesma prévia; **Baixar** só no chrome do iframe, sem botão solto no cabeçalho); comprovantes com prévia (iframe) + ícones baixar/abrir; **Anexar comprovante**; **quem anexou** em cada item. Verde no wizard só sem pendência da competência — não é “passo já visitado”. **Confirmar benefício** com N **a conferir** não fica verde.
- **A conferir** nunca entra no payload das etapas 2–6. Fica na lista. Contador amarelo no passo 1.
- Flash (etapa 2) lista **como Omie**: departamentos recolhíveis; **uma linha por colaborador** que vai neste pedido (escolha + Multibenefícios discriminados, soma). **Resumo** da parcial; o grupo espera **Confirmar envio**. Só **conferidas** ainda não processadas no Flash nesta competência. Sem tabela residual de quem fica em Beneficiários. Já enviado nesta competência não reaparece.

## Regras

1. **Só português.** Chrome, botões, vazios, toasts, colunas: PT-BR. Sem Dashboard, Overview, Batch, Submit, Review, Users, Settings. Crédito congelado = **lote congelado**. Artefato interno dos diretores/banco = consolidado de pagamento (**contrato**, não chrome). Título da etapa 5 = **Pagamento de benefícios**.
2. **Densidade operacional.** Fonte ~13px, linhas compactas, filtros na mesma vista da tabela. Sem hero, sem card-por-pessoa como lista principal.
3. **Dado essencial.** Colunas: colaborador, departamento, regime, **Benefício / escolha**, dias úteis (só se a fórmula usa), valor, situação; **depois de Situação**, uma ação **Detalhes**. Situação = **a conferir** \| **conferida** (D23). Sem motivo vermelho, sem “planilha 22”, sem “no provedor a confirmar”. Entrevista **não** deu R$ → o PRD não inventa cifra (P01, P02, P05). O proto mostra a **semente da planilha** (`docs/proto-semente.md`, PREMISSA DE PROTÓTIPO — não fato do financeiro); “a informar” só em cadastro incompleto / valor ausente (valor, não situação). Ônibus: valor mensal **seed** (PREMISSA). Nomes Flash (P07) **não** entram na lista. Sem chips/badges no nome do benefício (`padrão`, `escolha`, `a confirmar`).
4. **Filtros + lote.** Colaborador, regime, **benefício** (padrão e/ou escolha; **adicional** = Multibenefícios + ônibus **ou** Multibenefícios + gasolina), departamentos. Sem “No fluxo”. Sem toggle **Cartão de ônibus**. Barra de lote **some se zero selecionado**; **Selecionar visíveis** à esquerda e **um** botão: **Marcar como conferidos** (title/subtítulo: **Marca conferido e abre o resumo Flash**). Conferir **abre o resumo Flash** daquela parcial (D24); **Confirmar envio ao Flash** dispara o provedor. Sem segundo botão na barra. Sem **Lançar no Omie** na barra (Omie é etapa 4 do wizard, recorte 2). Só com benefício preenchido (valor não é **a informar**).
5. **Cartão de ônibus é depósito Flash.** A **escolha** CLT é ônibus XOR auxílio gasolina — **os dois** vão ao Flash (com Multibenefícios). **D19:** premissa de recorte; o financeiro **não** disse Flash para ônibus. Não esconder ônibus. Sem copy “não é depósito no Flash”. Valor do ônibus: semente mensal em `proto-semente.md` (PREMISSA). **A conferir** só por cadastro/valor — não por P06.
6. **Dias úteis são calculados.** Meta da competência: calendário nacional, não campo digitável. Carga da planilha (arquivo ou imagem) **pré-preenche**; se vier coluna de dias, mostra divergência — não deixa a célula ganhar em silêncio. **Trazer da planilha** e **Gerar planilha** (exportação). Imagem é **adaptador** da mesma extração, não botão. O operador não escolhe como a planilha é processada. Sem botão de sync bidirecional no recorte 1.
7. **Uma linha por colaborador.** Coluna **Benefício / escolha** (título + subtexto, tipografia simples — sem chip azul/laranja):
   - **CLT:** título = **Auxílio gasolina** XOR **Cartão de ônibus** (a única escolha). Subtexto curto opcional **Multibenefícios padrão** — **sem cifra** e **sem** “a informar”. Coluna **Valor** = **um número**: Multibenefícios (diário × dias do calendário) **+** valor da escolha. Se qualquer peça estiver ausente, Valor da lista = **a informar**. Discriminado (Multibenefícios vs escolha vs total) **só no Detalhes** e na conferência Omie. Todo CLT tem Multibenefícios — isso **não** é a coluna primária e **não** é dropdown de tipo.
   - **PJ:** título = **Flexível**; valor = mensal fixo; sem subtexto.
   - **Omie e Flash:** mesma regra de uma linha; CLT mostra escolha + Multibenefícios com cifras e a soma; PJ só Flexível. Banco: um recolhível por boleto (prévia + lista da parcial); comprovantes com prévia; **Anexar comprovante**. Sem ids internos (`pag-…`, arquivo de boleto) na UI. `par-…` no título do recolhível do boleto e no campo Parcial do slip. Sem “recorte 2” na UI.
8. **Edição no Detalhe** (benefício da pessoa no mês). CLT: troca a **escolha** ônibus XOR auxílio gasolina (e a **faixa** se gasolina); ambos são depósito Flash. PJ: edita o **valor mensal** fixo. Multibenefícios CLT permanece **calculado**. Editar **não** marca conferida. **Conferir** (depois de preenchido) marca **conferida** e **abre o resumo Flash** daquela pessoa (D24). Title: **Marca conferido e abre o resumo Flash**. **Confirmar envio** dispara o provedor.

## Proibido

- Inglês no chrome.
- Esconder ônibus, inventar R$, pular conferência, ok de diretor no passo Flash, copy “não é depósito no Flash” / “ainda não sabemos se entra no Flash” na UI.
- Tratar Multibenefícios vs Auxílio gasolina como SKU Flash fechado; XOR comida vs combustível numa pessoa; promover “Alimentação e refeição” / “Auxílio Mobilidade” a rótulo primário; chip `padrão`/`escolha`/`a confirmar` na coluna de benefício; duas linhas de depósito por CLT na lista Beneficiários ou no accordion Omie.
- Recriar a planilha como grade editável de dias úteis.
- Botão “Sincronizar” bidirecional no recorte 1.

## Referência viva

`proto/backoffice/` — nomes e pipeline já combinados. Capturas: outro agente.
