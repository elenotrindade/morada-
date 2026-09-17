# PRD-03 — Financeiro e governança

Status: vigente (contrato do desafio)
Fonte: [PRD-02](PRD-02-operacao-do-lote.md), [docs/discovery/fatos-hipoteses.md](../discovery/fatos-hipoteses.md)
Recorte: lote congelado, consolidado de pagamento e papéis no recorte 1; execução **Omie** (mock no recorte 1, porta no recorte 2) e aprovação estruturada depois. Pipeline: **Confirmar benefício** → **Flash** → **Boleto** → **Omie** → Diretores → Banco — nunca só “Integração”.

## 1. Problema

O Omie recebe 8 lançamentos agregados por departamento — isso é o trecho rápido. O frágil é a governança: dois diretores aprovam um e-mail com relatório exportado, sem garantia de que aquele arquivo é o mesmo conjunto que foi (ou será) digitado no Flash. Não há conciliação lote = provedor = ERP. Auditoria é a planilha e a caixa de entrada.

## 2. Usuários e trabalho a ser feito

| Papel | Trabalho a ser feito | Fora deste PRD |
|---|---|---|
| Operador financeiro | Ratear o lote em 8 departamentos; lançar conta a pagar; conciliar; **anexar comprovante do boleto** depois de autorizado a pagar | Digitar 73 linhas no ERP; escolher vendor do bucket |
| Diretor | Aprovar ou recusar o **pagamento** (consolidado identificável, não planilha mutável) | Operar o provedor; ver ou editar linha de crédito |
| Auditoria interna (futuro) | Reconstituir quem aprovou o quê, sobre quais linhas | Novo produto de BI |

## 3. Comportamento

### 3.1 Agregação departamental

Cada linha do lote carrega o departamento do colaborador (os 8 atuais). O consolidado de pagamento mostra **só** o que o Flash confirmou (subconjunto das **conferidas**, D20):

- total geral do principal;
- total por modalidade;
- total por departamento (os 8 lançamentos-espelho do Omie);
- taxa **visível** discriminada (não diluir Omie em Flash nem em Vendas). **Contrato** (fórmula — não é chrome):

| | Flash | Omie | visível (soma) |
|---|---|---|---|
| Fórmula | soma das `fee` de cada depósito, devolvida na confirmação (`totalFee`) **daquele pedido** | R$ 1,99 × N boletos **desta parcial** (liquidação Omie.CASH Completa) | Flash + Omie **por pedido** |
| Desta parcial (exemplo) | R$ 1,00 | R$ 1,99 | R$ 2,99 |

**Chrome:** a taxa vive **dentro do mock do boleto** (campo **Taxa do provedor**: `(R$ 1,00 + R$ 1,99) R$ 2,99` ao lado de valor/parcial). Sem faixa solta abaixo do iframe. Sem linha de fórmula. Sem parágrafo de fórmula. `par-…` no **título do recolhível** (competência · id · valor) e no campo **Parcial** do slip — não dump de arquivo consolidado. Mesma soma nas etapas que mostram o boleto. Fórmula vive nesta tabela (e em [flash.md](../integracoes/flash.md) / [omie.md](../integracoes/omie.md)).

Etiquetas: fórmula Flash = **fato da API** (`fee` / `totalFee` / `depositFees`; GET **não** executado). R$ 1,00 no proto = **PREMISSA DE PROTÓTIPO** (simula o retorno), não fato da entrevista. Omie R$ 1,99 = **fato da nota** Omie.CASH Completa (a API de contas a pagar **não** devolve taxa). Soma = **decisão de recorte**. P11: a entrevista **não perguntou** (1) se existe taxa na operação Morada, (2) quem paga, (3) se N boletos = N taxas. **H20** (hipótese sua) assume (1) e (3) = sim. Sem cifra de benefício inventada.

O sistema financeiro **não** recebe um lançamento por colaborador. Recorte posterior: a porta financeira inclui conta a pagar com rateio dos 8 totais + referência ao consolidado de pagamento.

Na etapa Omie o operador faz a **segunda conferência por departamento**: os 8 departamentos são botões recolhíveis (vazios somam zero e podem ficar fechados). Ao abrir, a lista **agrupa por colaborador** (uma linha por pessoa): CLT discrimina a escolha (auxílio gasolina ou cartão de ônibus) + Multibenefícios e mostra a soma; PJ mostra só Flexível. O cabeçalho conta pessoas e a soma em R$ — não o número de depósitos Flash. Só entram as conferidas que o Flash já confirmou na etapa 3 (D20). O ERP continua recebendo 8 lançamentos agregados, não um por colaborador; o botão de lançar no recorte 1 permanece mock. **Omie não aparece na barra de lote de Beneficiários** (D24): é etapa 4 do wizard, depois do boleto. Abaixo do accordion **Nesta parcial**, o boleto desta parcial aparece **recolhido** (competência · id da parcial · valor); ao abrir = a mesma prévia da etapa 3.

### 3.2 Aprovação de pagamento (não de crédito)

Fato: dois diretores, hoje e-mail, depois do lançamento no ERP, antes do banco (fato F26). Objeto = o que vai ao **banco**.

Recorte 1 (decisões D13 e D14): os dois aprovam o **mesmo** consolidado de **pagamento** (competência, id do lote, totais **só do que o Flash confirmou**, instrumento quando existir). Sem os dois, **não há pagamento**. Há execução no provedor: só linhas **conferidas** (D20), pelo financeiro, **sem** esperar diretor. **A conferir** não entra no consolidado.

Ainda não sabemos se os dois diretores são sempre necessários para pagar, se há suplente ou prazo (pendência P15).

O produto **emite** o consolidado de pagamento (identificador interno: competência, id do lote, totais **só do que o Flash confirmou**, instrumento) para o e-mail dos dois diretores **depois do Omie confirmado**, com um **link que abre a etapa 5** do wizard. A UI **não** mostra `pag-…`, nome de arquivo de boleto nem o rótulo **Consolidado de pagamento**. Título visível: **Pagamento de benefícios**. Abaixo: **mês de competência** e, ao lado, **quantidade de colaboradores que serão pagos** (esta parcial). Lá eles só clicam **Autorizar pagamento**. Os diretores conferem o boleto na mesma prévia da etapa 3, **recolhida** (competência · `par-…` · valor). Copy visível: **O crédito no Flash aprovado. Favor verificar e aprovar o pagamento.** Taxa = campo **Taxa do provedor** no slip; sem faixa duplicada; sem linha de fórmula.

Ordem no recorte 1: **Confirmar benefício** → **Flash** (payload = conferidas **desta parcial**, ainda não enviadas nesta competência; listagem como Omie, uma linha por colaborador **desta caminhada**) → **Boleto** (espera do retorno **desse** pedido + **Baixar boleto**) → **Omie** (só o que **esta parcial** confirmou no Flash, subconjunto das conferidas; mock — sem rótulo “recorte 2” na UI) → Diretores (e-mail → etapa 5, consolidado **desta parcial**) → Banco (um recolhível **por boleto** da competência). Não inverter o ok para antes do Flash.

**D22:** a competência **admite** várias parciais. Pedido, boleto, lançamento Omie, autorizações e comprovantes **acumulam** — não se sobrescreve a parcial anterior. 1 colaborador percorre o ciclo inteiro; N conferidas em lote = uma parcial de N (mesmo ciclo). A entrevista **não** disse “um pedido por competência”; P27 no inventário é CNPJ/unidades, não trava de pedido único. **P31:** não perguntamos se os dados da parcial mudam depois — pendência abaixo do recorte 1; D22 não vira fato. **H20 (hipótese sua, guia §04):** o caminho feliz **recomenda** conferir **todos** os que vão receber **antes** de Confirmar envio ao Flash (um pedido → um boleto → uma liquidação), para não somar taxa extra. O sistema **não** bloqueia parciais. **P11:** a entrevista **nem perguntou** se existe taxa.

Ordem futura (**Omie** automático + aprovação estruturada): o objeto dos diretores continua **pagamento**; o Flash já bateu com o lote conferido.

### 3.3 Boleto e pagamento

Provedor atual gera boleto na confirmação do pedido (pagamento por boleto). Esse instrumento é o que hoje “sobe” no Omie e vai ao banco após o ok dos diretores.

A ordem boleto × ERP × banco não foi desenhada com precisão; meio de pagamento além de boleto também não (pendência P16).

Comportamento: **cada parcial** guarda a referência do instrumento de pagamento devolvido na confirmação **daquele** pedido. **N pedidos = N instrumentos**; a taxa visível **soma por pedido** (H20: minimizar N é hipótese sua, não trava). Na etapa **Boleto** (etapa 3 — **não** na etapa Flash) o financeiro **espera o retorno** (taxa + boleto) **dessa** parcial **antes** de Omie — desenho de produto (D27), não invalidado. A porta que cobre a espera é `consultar_pedido`: poll **automático** (D28) e disparo **manual** do operador (D29) quando a espera falha, esgota (timeout) ou o estado do pedido no provedor **diverge** do que a tela mostra. Manual = a **mesma** porta e o **mesmo** pedido — não segunda integração, não webhook inventado. Chrome: **Atualizar retorno**. O manual Flash 2.0 não publica webhook (F49) — isso troca o **canal**, não a ideia. GET é o HTTP do adaptador atual (Buscar Pedido), **não** copy da UI. Quando o boleto existe, a conferência é **pré-visualização na etapa 3**, não outra aba; **Baixar boleto** no cabeçalho e no chrome do iframe. A taxa do retorno **vive no slip** (campo **Taxa do provedor**); o mesmo slip nas etapas que recolhem o boleto. Sem faixa solta. Sem linha de fórmula na tela. Parciais anteriores **permanecem**. Pagar o boleto sem os dois oks de **pagamento** sobre o consolidado **daquela** parcial é fora do processo interno. Executar o Flash sem esses oks **é** o recorte 1 (decisão D13).

### 3.3.1 Comprovante do boleto (depois de autorizado a pagar)

Pré-condição: os dois diretores **já autorizaram** o mesmo consolidado (etapa 5). Sem isso, não há anexo.

Gatilho: o financeiro pagou (ou está pagando) o boleto no banco e precisa deixar o comprovante conferível.

Comportamento (decisão D21):

O Banco confere boleto e comprovante na prévia; baixar fica no chrome do iframe.

1. Um **recolhível por boleto** da competência (título: competência · `par-…` · valor). Ao abrir = a mesma prévia da etapa 3 (iframe + taxa no slip + **Nesta parcial**). Não é um único “sumário do mês”. Sem botão **Baixar boleto** solto no cabeçalho da etapa.
2. **Baixar** só no chrome do iframe (ícones **Baixar** / **Abrir em outra aba**).
3. O operador **anexa comprovantes** (PDF ou imagem) — **vários** por fechamento/mês, não um só. Lista todos os anexados. Ações: **Anexar comprovante**, **abrir**, **onde** (bucket + caminho). Sem copy de isolamento da camada do cliente.
4. O produto **grava** cada objeto na porta **armazenamento de comprovantes** (`ArmazenamentoDeComprovantes`). Não escolhe vendor: Amazon S3 e DigitalOcean Spaces (compatível S3) são **adaptadores válidos** da mesma porta.
5. A conferência lê os objetos no **bucket de comprovantes**, não a caixa de entrada. Visível: nome, data, **Quem anexou**, **onde** (bucket + caminho). Ação **abrir**. Sem `pag-…` nem nome de arquivo de boleto. `par-…` no título do recolhível e no campo Parcial do slip.
6. Isolamento (F40 / D04): o objeto fica no bucket da observância interna, isolado da camada do cliente — não na caixa de entrada. Isso **não** é copy da etapa Banco.

O e-mail dos diretores continua só o canal do **ok de pagamento**. Não é o depósito do comprovante. Distinto de `anexar_documento_de_pagamento` na porta financeira (vínculo do boleto no lançamento ERP).

Exceção / pendência: prazo de `expirar` e qual adaptador ligar na implementação (P30). Sem conta de nuvem inventada neste contrato.

### 3.4 Conciliação

Uma competência só termina **conciliado** quando:

1. soma das linhas do lote congelado (principal) = soma dos depósitos efetivos no provedor **em todas as parciais**;
2. soma dos 8 lançamentos no sistema financeiro = principal (+ taxa, segundo a regra da taxa à parte — pendência P11);
3. cada instrumento de pagamento refere o pedido/consolidado **da sua parcial**; o Banco materializa o conjunto.

Divergência → não conciliado; estado **falhou** ou pendência de ajuste. Ninguém “fecha o mês” no produto sem essa prova.

### 3.5 Auditoria e papéis

Eventos mínimos (já no contrato; **não** inventar tipos novos): geração, congelamento, correção de linha, submissão, cada aprovação/recusa, início de execução, cada depósito aceito/recusado, confirmação, falha, reversão, conciliação.

**Eventos de auditoria (D25)** — só estas duas ações, com ator da porta **identidade interna** (`IdentidadeInterna`). A entrevista **não** pediu log nominativo: **hipótese H18** + **decisão D25**. Chrome **Histórico da esteira** (lista compacta sob o wizard em toda página) está **fora** — recorte de UI, não “entrevista pediu o card”. O toast não é a trilha; os eventos existem no contrato.

| Ação | O que grava | Superfície visível no recorte 1 |
|---|---|---|
| **Conferir** / **Marcar como conferidos** | ator (operador interno), quando, quais **beneficiários** da parcial (objeto, não o ator) | Nenhuma dump-list. Evento gravado (capacidade). Feedback imediato = toast. |
| **Anexar comprovante** | ator, quando, qual comprovante | **Quem anexou** em cada arquivo na etapa Banco. Sem segundo card de histórico. |

Eventos acumulam (várias parciais, vários comprovantes). Sem `par-…` na UI. Sem inventar linha do tempo nova.

Papéis:

| Papel | Pode | Não pode |
|---|---|---|
| Operador financeiro | Gerar, conferir, corrigir com motivo, disparar execução das **conferidas** (D20, D24 — **a conferir** fica na lista e não entra no pedido) | Aprovar pagamento no lugar do diretor |
| Diretor | Aprovar/recusar consolidado de **pagamento** | Editar linha; bloquear a execução no provedor |
| Identidade de sistema (Flash / Omie) | Chamar portas Flash e Omie em nome do lote | Misturar-se à camada do cliente |
| Colaborador | (depois) pedir endereço | Ver lote de outros, aprovar, executar |

Acesso ao provedor hoje é CPF de admin; identidade interna é e-mail `@morada`. O produto opera com identidade interna; credencial do provedor é segredo da porta, não da UI.

LGPD: CPF é dado do depósito no provedor atual. Mínimo necessário, trilha de quem visualizou, sem exportar lista completa para e-mail de aprovação (o consolidado de diretor é agregado; detalhe linha a linha fica no backoffice com papel de operador).

## 4. Jornadas

### 4.1 Pagamento no recorte 1 (e-mail + consolidado, depois do Flash)

1. Operador **confere** (1-a-1 ou **Marcar como conferidos**) — isso **abre o resumo Flash** da parcial (D20, D24), **sem** ok de diretor. **A conferir** permanece na lista. **Confirmar envio ao Flash** dispara o provedor. Omie **não** sai da barra de Beneficiários.
2. Etapa 3 **Boleto** espera o **retorno deste pedido** (taxa + boleto) antes de Omie — desenho de produto (D27). A porta que cobre a espera é `consultar_pedido`: poll automático (D28) e, se a espera falha, timeout ou a tela diverge do provedor, o operador clica **Atualizar retorno** (D29 — mesma porta, mesmo pedido). Pedido confirmado; boleto volta; o financeiro pode **Baixar boleto**. Taxa Flash no proto = **R$ 1,00** (**PREMISSA**). Copy = a espera, não o nome do canal. Sem **Baixar boleto** nem espera na etapa 2 (Flash = resumo + **Confirmar envio ao Flash**).
3. **Omie** (mock no recorte 1; sem rótulo “recorte 2” na UI) lança **só** o que o Flash confirmou. Sistema envia e-mail aos dois diretores com **link da etapa 5**.
4. Cada diretor abre a etapa 5. Título: **Pagamento de benefícios**. Abaixo: mês de competência e quantidade de colaboradores que serão pagos (esta parcial). Copy: **O crédito no Flash aprovado. Favor verificar e aprovar o pagamento.** Clica **Autorizar pagamento**. Taxa = campo **Taxa do provedor** no slip do boleto recolhido. Sem linha de fórmula. Sem faixa duplicada.
5. Banco. **Um recolhível por boleto** (competência · `par-…` · valor); ao abrir = prévia da etapa 3. **Baixar** só no chrome do iframe. **Vários comprovantes** do fechamento/mês: anexar, listar, **Quem anexou**, abrir, caminho/bucket. Totais de cada parcial = o que entrou no Omie daquela caminhada.

### 4.2 Diretor recusa o pagamento

1. Recusa cita o consolidado de pagamento.
2. Pedido confirmado no provedor **não** se desfaz (estorno pós-crédito — pendência P24). Lote não volta a conferência.
3. Pagamento no banco não segue. Ajuste é processo humano (novo instrumento, acordo, ou reversão explícita se ainda possível).
4. Ok antigo não vale para um consolidado novo (se o instrumento mudar).

### 4.3 Conciliação com taxa inesperada

1. Provedor confirma principal igual ao lote e `totalFee` Flash (e/ou tarifa Omie) não previstos na planilha antiga.
2. Lote não fica **conciliado** até a taxa visível (Flash + Omie) estar explícita (pendência P11: a entrevista **não perguntou** se existe taxa, quem paga, nem se N boletos = N taxas): ou entra no ERP como linha própria, ou é explicitamente zero.
3. Operador não “some” a taxa no departamento de vendas para fechar.

### 4.4 Depois: conta a pagar automática

1. Pedido confirmado no Flash (só conferidas) e Omie lançado sobre esse conjunto.
2. Porta financeira inclui 8 rateios + documento do boleto + id do consolidado de pagamento.
3. Pagamento no banco só com dois oks de diretor sobre esse documento. Conciliação fecha os três lados.

### 4.5 Conferência do comprovante

1. Diretores já autorizaram. Banco mostra **autorizado a pagar**.
2. Financeiro anexa um ou mais PDF/imagem. Porta grava. UI lista todos: nome, data, **Quem anexou**, **onde** (bucket de comprovantes + caminho). **Abrir** em cada um. Sem card **Histórico da esteira**.
3. Conferência posterior **abre** o mesmo objeto. Não procura na caixa de entrada.
4. Falha de gravar não inventa “anexo no e-mail” como substituto. Estado: sem comprovante, visível.

## 5. Critérios de aceite

- Dado lote com linhas **a conferir** e linhas **conferidas**, quando o consolidado de pagamento é emitido, então os 8 totais departamentais somam **só** o principal confirmado no Flash (subconjunto das conferidas). Departamentos vazios aparecem zero, não somem.
- Dado um consolidado de pagamento, quando o instrumento muda, então aquele consolidado fica inválido e um consolidado novo é exigido para pagar.
- Dado apenas um diretor ok, quando se tenta pagar no banco, então o pagamento é recusado. A execução no provedor **não** espera esse ok (decisão D13).
- Dado Omie confirmado, quando o e-mail sai, então os dois diretores recebem um link que abre a etapa 5 do wizard, cujo título visível é **Pagamento de benefícios**, com mês de competência e quantidade de colaboradores que serão pagos (esta parcial), e a ação visível é **Autorizar pagamento**. Sem `pag-…` nem nome de arquivo de boleto na UI. `par-…` só no bloco de taxa.
- Dado a etapa **Boleto** com retorno (e a etapa 5 Diretores), quando a taxa visível renderiza, então ela está **dentro do slip** (campo **Taxa do provedor**: exemplo `(R$ 1,00 + R$ 1,99) R$ 2,99`). Sem faixa solta, sem linha de fórmula, sem parágrafo de fórmula. Não aparece “a informar”; Omie não some dentro de Flash. A fórmula permanece na tabela de [§ 3.1](#31-agregacao-departamental) (contrato), não na tela.
- Dado o operador **Conferir** ou **Marcar como conferidos**, quando o ato completa, então o evento `conferiu` fica gravado com o **operador** (identidade interna), data/hora e os beneficiários da parcial — não o colaborador como ator. A UI **não** renderiza card **Histórico da esteira** sob o wizard.
- Dado **Anexar comprovante**, quando Banco renderiza, então cada arquivo mostra **Quem anexou** e quando; eventos acumulam. Sem dump-list sob o wizard.
- Dado e-mail de aprovação no recorte 1, quando o banco paga, então as duas aprovações de pagamento estão registradas contra o mesmo id de consolidado.
- Dado lote com ao menos uma linha **conferida** candidata a depósito, quando o operador dispara a execução, então a execução **não** é recusada por falta de ok de diretor nem por ainda existir **a conferir** na lista (D20: **a conferir** não entra no pedido).
- Dado pedido confirmado no provedor, quando a conciliação roda, então divergência de centavos impede o estado conciliado.
- Dado papel diretor, quando acessa o consolidado de pagamento, então não vê CPF lista completa — só agregados (detalhe é papel operador).
- Dado departamento com CLT que o Flash confirmou (Multibenefícios + escolha), quando o operador abre o departamento na etapa Omie, então vê **uma linha por colaborador**, com a escolha e o Multibenefícios discriminados e a soma em R$; o cabeçalho conta pessoas e a soma, não depósitos. PJ: uma linha Flexível. **A conferir** e o que não entrou no pedido não aparecem.
- Dado a porta **Omie**, quando a conta a pagar é lançada, então o lançamento é por departamento, nunca por colaborador, e só cobre o confirmado no Flash.
- Dado pagamento autorizado pelos dois diretores, quando o financeiro abre a etapa Banco, então vê **um recolhível por boleto** (competência · `par-…` · valor; ao abrir: iframe + taxa no slip + **Nesta parcial**), **Baixar** só no chrome do iframe, e **Anexar comprovante** (vários por fechamento/mês; nome, data, **Quem anexou**, onde; ação **abrir**). Sem card **Histórico da esteira**. Sem copy de isolamento da camada do cliente. Sem `pag-…` nem arquivo de boleto. Sem “recorte 2”.
- Dado uma parcial já confirmada no Flash, quando o operador inicia outra, então a primeira **não** perde pedido, boleto, lançamento, autorização nem comprovante. A segunda soma **outra** taxa visível (Flash daquele pedido + Omie R$ 1,99) — invariante N pedidos = N instrumentos; o sistema **permite** (D22) e **não** esconde o custo extra (H20).
- Dado colaborador desligado / inativo, quando Omie ou Flash renderiza, então essa pessoa **não** aparece — só quem anda no wizard entre as conferidas ativas.
- Dado pagamento autorizado pelos dois diretores, quando o financeiro anexa comprovantes do boleto, então cada objeto fica na porta **armazenamento de comprovantes** (nome, data, **onde** = bucket de comprovantes + caminho) e **abrir** devolve esse objeto — não um anexo de e-mail. Anexar de novo **acrescenta**; não substitui o anterior.
- Dado etapa Banco **sem** as duas autorizações, quando se tenta anexar comprovante, então o anexo é recusado.
- Dado o objeto gravado, quando a conferência consulta o comprovante, então o arquivo **não** trafega na camada do cliente (D04) e o contrato **não** escolhe Amazon S3 versus DigitalOcean Spaces — os dois são adaptadores da mesma porta.
- Dado a espera automática falhou, esgotou (timeout) ou o estado da tela diverge do pedido no provedor, quando o operador clica **Atualizar retorno** na etapa **Boleto**, então o sistema dispara `consultar_pedido` **do mesmo pedido** (não um segundo canal) e atualiza taxa e boleto. Omie permanece bloqueado até o retorno bater (D27).
- Dado a etapa **Flash** (etapa 2), quando renderiza, então **não** há **Baixar boleto**, nem espera do retorno, nem taxa apresentada como arquivo de boleto. **Confirmar envio ao Flash** é a ação.

### 5.1 Modos de falha cobertos aqui

| Modo | Como o PRD impede ou detecta | O que sobra para o SRD |
|------|------------------------------|------------------------|
| Valor errado | Riscar — dono: [PRD-02](PRD-02-operacao-do-lote.md) | — |
| Duplicidade | Riscar — dono: [PRD-02](PRD-02-operacao-do-lote.md) | chave `(competencia, colaborador, modalidade)` |
| Feriado | Riscar — dono: [PRD-02](PRD-02-operacao-do-lote.md) | porta `CalendarioOficial` |
| Desligado | Só conferidas ativas no consolidado / Omie / banco (D20) | `IdentidadeInterna` ativo na data (P10) |
| Divergência provedor vs ERP | D27: Omie só depois do retorno (taxa + boleto) da etapa **Boleto**. D28: poll `consultar_pedido`. D29: operador dispara a **mesma** consulta (**Atualizar retorno**) se a espera falha, timeout ou a tela não bate com o provedor. Conciliação de totais: lote = provedor = ERP; divergência impede **conciliado**. | SRD-00 invariante lote = verdade; SRD-01 `consultar_pedido`; SRD-02 conciliação |

## 6. Fora de escopo

- Workflow genérico de contas a pagar da empresa (só o lote de benefícios).
- Substituição do banco ou do Omie.
- Assinatura eletrônica jurídica específica (a necessidade é o invariante de dois aprovadores de **pagamento** sobre o consolidado vigente).
- Painéis para o conselho.

## 7. Premissas e pendências

| ID | Premissa adotada | Quem confirma |
|---|---|---|
| P11 | A entrevista **não perguntou** se há taxa. Aberto: (1) existe taxa Flash/Omie na operação Morada? (2) quem paga e se entra no ERP? (3) N boletos = N taxas? Fórmulas Flash `totalFee` + Omie R$ 1,99 = **fato de documentação do provedor**. Contrato = tabela Flash \| Omie \| visível **por pedido**. R$ 1,00 Flash no proto = PREMISSA DE PROTÓTIPO. H20 assume (1) e (3) = sim. | Notas oficiais + boleto real |
| P16 | Recorte 1 segue boleto se for o instrumento atual | Pedido atual |
| P15 | Dois diretores distintos para **pagar**; sem suplente até a pendência fechar | Diretoria |
| P27 | Um CNPJ / uma unidade ou várias (afeta região metropolitana e feriados) — **não** é “um pedido Flash por competência” | Cadastro Flash / nome do ERP (pendência P26) |
| P13 | Os 8 departamentos do consolidado; vazios somam zero | o financeiro |
| D13, D14 | Execução sem ok de diretor; diretores no pagamento; e-mail com link da etapa 5 | Grill Q5–Q6 |
| D20 | Consolidado / Omie / banco = só conferidas que o Flash confirmou | Invariante do lote |
| D22 | Várias parciais na competência **permanecem possíveis**; histórico acumula; Banco lista todas. Caminho feliz **recomenda** um envio (H20) — não trava. A entrevista não disse um tiro só | Recorte de operação |
| P31 | Não perguntamos se fechamento é parcial nem se os dados mudam depois. Abaixo do recorte 1 | Próxima conversa |
| D24 | Conferir abre o resumo Flash; Confirmar envio dispara o provedor. Omie não é ação de lote na lista | Recorte de chrome |
| D25 | Eventos `conferiu` e `anexou comprovante` existem (ator = identidade interna). Sem card dump-list sob o wizard (recorte de UI). Banco: **Quem anexou** no arquivo. Entrevista não pediu o card | Recorte de observabilidade / UI |
| D21 | Comprovantes do boleto no bucket via porta `ArmazenamentoDeComprovantes`; vários por mês; S3 e Spaces = adaptadores, sem escolha | Recorte Banco |
| D27 | Etapa **Boleto** = espera do retorno (taxa + boleto) antes de Omie | Desenho de produto |
| D28 | Canal da espera = `consultar_pedido` (poll automático). Não substitui D27 | Adaptação de porta |
| D29 | GET manual do operador na etapa 3 (**Atualizar retorno**) = a mesma `consultar_pedido` | Pedido de produto |
| P30 | Prazo de `expirar` e qual adaptador ligar ficam abertos | Jurídico / engenharia |

## 8. Sucesso

- 100% dos depósitos no provedor são linhas **conferidas** (D20). 100% dos pagamentos no banco têm consolidado de pagamento + dois oks de diretor sobre esses totais.
- 100% dos desembolsos conferidos apontam para um objeto no bucket de comprovantes (não só um PDF na caixa de entrada).
- 0 pagamento cujo total departamental divergiu do consolidado sem evento de ajuste.
- Tempo de Omie continua baixo (8 lançamentos); o ganho de governança é rastreabilidade, não velocidade do ERP.
- Tempo até conciliação fechada, medido a partir do 1º ciclo em que os três lados existem.
