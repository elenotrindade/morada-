# PRD-00 — Visão da operação de benefícios

Status: vigente (contrato do desafio)
Fonte: [docs/discovery/fatos-hipoteses.md](../discovery/fatos-hipoteses.md), [docs/discovery/glossario.md](../discovery/glossario.md)
Recorte: 1 = calendário nacional automático + carga unidirecional da planilha (pré-preencher, sem matar o Excel) + cálculo + conferência + execução no provedor (parciais **possíveis**, D22; caminho feliz **recomendado** H20 = conferir quem vai receber antes de um envio); o restante é fila

## 1. Problema

A dor não é “falta de API”. Todo mês, três pessoas do financeiro montam uma planilha-sombra, digitam ~73 colaboradores benefício a benefício no painel do Flash, depois lançam 8 totais no Omie e pedem ok por e-mail a dois diretores. O tempo está no painel. O risco está em nome, valor, modalidade e dias úteis digitados de novo. O desembolso é aprovado sem um lote travado que prove o que será creditado.

Quem: financeiro (operação), diretores (autorização do pagamento), colaborador só quando muda de endereço.
Quando: ciclo mensal, antes do crédito no cartão.
Frequência: uma competência por mês, com exceções de admissão, desligamento e endereço.
Impacto: retrabalho, crédito errado, atraso, e ausência de conciliação entre o que se planejou, o que o provedor recebeu e o que o ERP pagou.

## 2. Usuários e trabalho a ser feito

| Papel | Trabalho a ser feito | Fora deste PRD |
|---|---|---|
| Operador financeiro (3) | Fechar a competência sem redigitar elegibilidade; conferir exceções; disparar o pedido no provedor | Substituir o Flash |
| Diretor (2) | Autorizar um consolidado de pagamento identificável | Operar linha a linha |
| Colaborador | Manter endereço/faixa corretos quando muda de casa | Self-service no recorte 1 |
| Engenharia interna | Hospedar a capacidade no backoffice, isolada da camada do cliente | Expor isso em MIA/Sales/Iago |

## 3. Comportamento

1. Existe uma **capacidade interna de operação de benefícios** no backoffice, não um fluxo paralelo na camada do cliente.
2. A política (PRD-01) produz um **perfil de benefício** por colaborador ativo. **CLT: Multibenefícios (padrão) + escolha única ônibus ou auxílio gasolina. PJ: Flexível, sem essa escolha.** No recorte 1 da **carga** (PRD-04, decisão D15) o perfil pode nascer da planilha que o financeiro já preenche — o sistema lê; o Excel não é morto no dia 1.
3. Uma vez por competência o sistema gera um **lote** (PRD-02), congela, permite conferência e só então executa no provedor (**parciais possíveis**, D22). O caminho feliz **recomenda** conferir quem vai receber **antes** de **Confirmar envio ao Flash** (um pedido → um boleto — hipótese sua H20; a entrevista **não** disse isso nem perguntou se há taxa — P11). Dias úteis vêm do calendário, mesmo quando a planilha trouxe uma coluna de dias (compara, não sobrescreve).
4. O financeiro e a diretoria operam governança sobre o lote congelado e o consolidado de pagamento (PRD-03): totais por departamento, aprovação dupla, conciliação.
5. Flash e Omie permanecem; o produto não os substitui.
6. Incerteza da entrevista vira PREMISSA ou PENDÊNCIA — nunca valor inventado.

## 4. Jornadas

### 4.1 Operador fecha a competência (recorte 1)

1. No calendário de corte, abre a competência no backoffice.
2. Se ainda preenche a planilha, **Traz da planilha** (PRD-04) — pré-preenche; arquivo ou imagem são adaptador, não um segundo botão; não é sync.
3. O sistema monta o lote a partir dos perfis + calendário oficial.
4. Operador vê o lote **a conferir**. Desligada não entra na lista. Divergência de dias, se a carga leu coluna, aparece no **calendário da competência** — não como situação vermelha na tabela.
5. Confere o que está **a conferir**. **Conferir** abre o resumo Flash da parcial (D24). O Flash leva só **conferidas** (D20); o restante fica na lista. Caminho feliz (H20): conferir **quem vai receber** antes de **Confirmar envio ao Flash** (etapa 2). Parciais 1-a-1 **continuam possíveis** (D22).
6. Etapa **Boleto** (etapa 3): espera o retorno (taxa + boleto) **antes** de Omie (D27). Poll `consultar_pedido` (D28); se falhar, **Atualizar retorno** (D29).
7. Omie (mock no recorte 1) depois do boleto. Diretores aprovam o pagamento, não o crédito (D13). Consolidado de pagamento segue no e-mail.

### 4.2 Diretor autoriza o **pagamento**

1. Recebe o consolidado de pagamento (totais, competência, id do lote, instrumento) — não uma planilha solta.
2. Aprova ou recusa o **boleto/banco**. Recusa não desfaz o pedido confirmado e não devolve o lote à conferência.

### 4.3 Colaborador muda de endereço (depois do recorte 1)

1. Solicita alteração (hoje: e-mail).
2. Financeiro atualiza faixa. Próximo lote usa a nova faixa; o lote já congelado não muda.

Desvio: execução parcial no provedor → lote falhou ou revertido; linhas não creditadas não são “esquecidas”.

## 5. Critérios de aceite

- Dado um colaborador ativo com perfil válido, quando a competência é gerada, então o CLT tem **Multibenefícios** (padrão) mais a linha da escolha (ônibus ou auxílio gasolina), e o PJ tem só Flexível — e nenhuma modalidade das duas não usadas pela Morada.
- Dado o gargalo declarado, quando o recorte 1 está em uso, então o operador não redigita nome/valor/modalidade no painel do provedor para o caminho feliz.
- Dado que hoje o financeiro preenche dias úteis na planilha (fato F30), quando o lote da competência é gerado, então os dias úteis nacionais vêm do calendário oficial — o operador não os preenche naquele mês no sistema; se a carga leu a coluna, a comparação aparece no calendário da competência (PRD-04), não como situação da linha.
- Dado um lote em conferência, quando uma linha é corrigida, então a correção fica auditável e o total do lote congelado muda só por esse evento.
- Dado isolamento exigido por quem avalia a dinâmica, quando a capacidade opera, então ela não compartilha execução com a camada do cliente.
- Dado valor de benefício não informado na entrevista (diário, faixas, Flexível — pendências P01, P02, P05), quando o PRD é lido, então não há cifra inventada — só referência ao cadastro.

## 6. Fora de escopo

- Stack, nuvem, protocolo, protótipo, código.
- Substituir Flash ou Omie.
- Self-service de endereço no recorte 1.
- Automação do Omie antes do Flash fechar.
- Folha de pagamento, IR, desconto legal de vale-transporte (6%), ponto, férias detalhadas.
- Produtos de cliente (MIA, Sales, Iago).
- As duas modalidades Flash que a Morada não usa.

## 7. Premissas e pendências

IDs de pendência são os do discovery (`P01`…`P28`). Premissa abaixo é recorte reversível, **não** o mesmo `P`.

| Lacuna | Pendência | Premissa do recorte 1 | Onde fecha |
|---|---|---|---|
| Valores diários / faixas / PJ | P01, P02, P05 | Cadastro versionado; linha sem valor = exceção; nenhuma cifra neste contrato | PRD-01 |
| Data de corte | P08 | Cinco dias úteis antes do início da competência (o lote antecipa o mês — decisão D10); a confirmar com financeiro | PRD-02 |
| Admissão/desligamento no meio do mês | P09, P10 | Elegíveis = ativos na data de corte; sem pró-rata automático (antecipação, decisão D10, a confirmar) | PRD-01, PRD-02 |
| Cartão de ônibus no Flash | P06 fechada | **D19:** também é depósito Flash (XOR gasolina) para o ciclo depositar. O financeiro **não** disse. Não é GET. Identificadores = P07 | PRD-01 |
| Taxa Flash / Omie | P11 | A entrevista **não perguntou** se existe taxa na operação Morada, quem paga, nem se N boletos = N taxas. Visível no recorte = tabela Flash `totalFee` (variável; proto R$ 1,00 = PREMISSA) + Omie R$ 1,99 × boletos **por pedido** — **fato de documentação do provedor**, não da sala. H20 assume que fatiar soma taxa extra. | PRD-02, PRD-03 |
| Feriados municipais vs nacionais | P12 | Só nacionais + fins de semana (como o financeiro já conta hoje, fato F30) | PRD-02 |

## 8. Sucesso

Sinais do recorte 1, com baseline no **primeiro ciclo medido** (não meta inventada):

- Tempo de lançamento no provedor (do lote conferido até pedido confirmado).
- Taxa de erro por tipo: nome, valor, modalidade, dias.
- % linhas conferidas pelo operador vs ainda **a conferir** (recorte 1). Taxa “automática” = hipótese H11, não chip.
- Tempo até o crédito no cartão.
- Conciliação de totais lote = provedor (ERP entra no recorte seguinte).

Detalhe em [PRD-02](PRD-02-operacao-do-lote.md), [PRD-03](PRD-03-financeiro-e-governanca.md) e [SRD-02](../srd/SRD-02-qualidade-risco-e-medicao.md).
