# Referência — UI da operação

Detalhe para quem for desenhar ou copiar tela. A skill cabe no SKILL.md; isto não se lê por padrão.

## Densidade

| Peça | Alvo |
|------|------|
| Corpo | 13px, line-height ~1.4 |
| Sidebar | ~196px, módulos + Financeiro aberto em Benefícios |
| Topbar | ~46px, migalha PT-BR |
| Tabela | uma linha por colaborador; checkbox à esquerda na lista |
| Filtros | uma faixa acima da tabela, não modal |
| Bulk | some se zero selecionado; **Selecionar visíveis** + **um** botão **Marcar como conferidos** (abre o resumo Flash). Sem Omie na barra |

Fundo cinza claro, superfície branca, acento só no CTA. Chips de situação — só estes: **a conferir**, **conferida**. Pipeline do ciclo não é chip da linha. Sem **a verificar**, **corrigida**, **conferida (automática)**, **no provedor a confirmar** ou passo Flash/Omie como situação.

## Colunas da tabela Beneficiários

Colaborador · Departamento · Regime · **Benefício / escolha** · Dias úteis · Valor · Situação · Ações (depois de Situação: um **Detalhes**).

- Lista: **uma linha por colaborador**. Depósitos Flash (Multibenefícios + gasolina **ou** ônibus, ou Flexível) continuam no pedido; não viram duas linhas na tabela.
- Benefício / escolha — tipografia simples, **sem chips** (`padrão`, `escolha`, `a confirmar`, hipótese Flash):
  - **CLT:** 1ª linha = **Auxílio gasolina** ou **Cartão de ônibus**. 2ª linha = `Multibenefícios padrão` (sem cifra; sem “a informar”).
  - **PJ:** só **Flexível** (sem 2ª linha). Valor da coluna = mensal fixo.
- Regime CLT/PJ: texto ou marca pequena na coluna Regime — nunca colado no nome do benefício.
- Dias úteis: inteiro do calendário na linha CLT (fórmula de Multibenefícios); vazio em PJ.
- Valor da coluna: **CLT** = soma Multibenefícios (diário × calendário) + escolha (gasolina ou ônibus). **Um número.** Se Multibenefícios ou a escolha estiver **a informar**, a lista mostra **a informar** — não a peça que sobrou. **PJ** = Flexível. Discriminado só no Detalhe (Multibenefícios, valor da escolha, total). Sem promover a semente a fato do financeiro.
- Ônibus e auxílio gasolina: **ambos** depósito Flash (XOR da escolha, D19). Não usar “não é depósito no Flash”. **A conferir** só por cadastro — não por P06.
- Detalhe: CLT troca escolha ônibus XOR gasolina (e faixa); ônibus = linha Flash com seed. PJ edita o valor mensal; Multibenefícios só calculado. Editar **não** confere. **Conferir** marca **conferida** e abre o resumo Flash (D24). Sem **conferida (com correção)**. Nomes Flash (P07) não entram na lista.

## Pipeline (rótulos)

Wizard persistente: **uma barra horizontal** `[ ‹ ] 1 … — 2 … [ › ]`. Chrome: **Ciclo do mês**, **Etapa**, **Anterior**/**Próxima** só no `aria-label` das setas. Sem Wizard/Step/Next. Sem subtítulo “atalho / Fechamento do mês / Etapa N de 6” abaixo da barra. Sem faixa meta (competência, corte, dias úteis, pendências, automatização) acima da tabela. Contador amarelo de **a conferir** no passo **Confirmar benefício**.

| Etapa | Rótulo | O que o operador faz |
|-------|--------|----------------------|
| 1 | Confirmar benefício | Lista **Beneficiários**: conferir 1-a-1 ou **Marcar como conferidos**. O clique **abre o resumo Flash** (D24). Sem tela `/confirma` à parte. |
| 2 | Flash | **Resumo** desta parcial. Accordion por departamento, **uma linha por colaborador**. O grupo espera **Confirmar envio ao Flash**. Só conferidas ainda não processadas nesta competência. Sem tabela de quem fica na lista Beneficiários. Sem **Baixar boleto**, sem espera, sem taxa-como-arquivo. |
| 3 | Boleto | **Espera do retorno deste pedido** (spinner). Com boleto: **pré-visualização na etapa** (iframe, taxa **dentro** do slip), depois o accordion **Nesta parcial**. Chrome do iframe: ícones **Baixar** e **Abrir em outra aba**. **Baixar boleto** no cabeçalho permanece. **Atualizar retorno** dispara a mesma consulta do pedido (D29) se a espera falha, timeout ou a tela diverge. Copy = a espera, não o nome do canal. Sem “GET” no chrome. Sem webhook inventado na UI. Taxa Flash proto = **R$ 1,00** no retorno (**PREMISSA**). Sem faixa de taxa abaixo do iframe. Sem linha de fórmula. H1 = **Boleto**. |
| 4 | Omie | Lançar por departamento. Segunda conferência: botões recolhíveis por departamento; ao abrir, **uma linha por colaborador** (CLT: escolha gasolina/ônibus + Multibenefícios discriminados, depois a soma; PJ: Flexível). Cabeçalho: pessoas · soma R$ (não conta depósitos Flash). Só itens confirmados no Flash (etapa 3). Departamento vazio soma zero. Abaixo do accordion **Nesta parcial**, boleto **recolhido** (mesmo componente de Diretores/Banco). **Lançar no Omie** permanece. Sem “recorte 2” na UI. |
| 5 | Diretores | Autorizar o pagamento (página do e-mail; não linha a linha). H1 **Diretores** acima da barra. Título do documento: **Pagamento de benefícios**. Abaixo: mês de competência e quantidade de colaboradores que serão pagos (esta parcial). Boletos **recolhidos** (competência · id · valor); ao abrir = mesma prévia da etapa 3. **Autorizar pagamento** permanece. Sem faixa de taxa duplicada. Sem linha de fórmula. Sem rótulo Consolidado de pagamento. |
| 6 | Banco | Pagar o boleto. Um recolhível por boleto da parcial (mesma prévia + lista). **Baixar** só no chrome do iframe — sem botão solto no cabeçalho. Comprovantes: prévia (iframe) + ícones baixar/abrir; **Anexar comprovante**; **quem anexou**. Sem copy de isolamento da camada do cliente. Sem “recorte 2”. |

Etapa atual = **azul**. **Verde (feito / ✓)** só quando a competência em vista **não tem pendência** (nenhum passo a ser feito) — não é “passo já visitado”. Com pendência (`a conferir`, Flash não enviado, espera de boleto, Omie, oks, comprovante): nenhuma aba verde; as outras ficam neutras (número, nunca ✓). Contador amarelo de **a conferir** no passo 1 permanece. Setas ‹ › inalteradas. **Sem** card **Histórico da esteira** sob a barra (chrome fora — recorte de UI, não “entrevista pediu o card”). D25 permanece no contrato (eventos `conferiu` / `anexou comprovante`, ator gravado); atribuição visível de comprovante = **Quem anexou** no arquivo, etapa Banco. Omie visível no wizard. Sem “recorte 2” na UI.

## Copy que não usar

Dashboard, Overview, Insights, Batch actions, Submit, Review, Integration, Payroll, Benefits hub, Users, Settings, Save changes, Export CSV / Import / OCR / Sync (use **Trazer da planilha**, **Gerar planilha** — imagem é adaptador, não botão), Skip, Approve (use **Conferir** / **Marcar como conferidos**). Crédito congelado = **lote congelado**. Artefato interno = consolidado de pagamento (**não** chrome). Título etapa 5 = **Pagamento de benefícios**. Sem **Preencher pela imagem**, sem **Enviar ao Flash** separado na barra, sem **Lançar no Omie** na lista, sem `pag-…` / arquivo de boleto na UI, sem “recorte 2”, sem “GET” no chrome (**Atualizar retorno**). `par-…` no título do recolhível do boleto e no campo Parcial do slip.

## Telas do proto

`#/financeiro/beneficios` = lista **Beneficiários** (H1; etapa 1 do wizard). Filtros: colaborador, regime, benefício (inclui adicional), departamentos. Wizard = barra de etapas, não o título. Competência: ‹ select › (julho / agosto / setembro). `/ciclo`; `/flash`; `/retorno` (Boleto); `/omie`; `/diretores` (H1 Diretores; documento **Pagamento de benefícios**); `/banco`. `/confirma` redireciona à lista.
