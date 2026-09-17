# PRD-01 — Política de benefícios

Status: vigente (contrato do desafio)
Fonte: [docs/discovery/fatos-hipoteses.md](../discovery/fatos-hipoteses.md)
Recorte: regras de elegibilidade no recorte 1; origem backoffice e endereço depois, com ponte explícita

## 1. Problema

A planilha guarda a política na cabeça de quem lança: regime, opção da admissão, faixa de km, valores. Sem perfil versionado, o Flash recebe um número digitado — não uma regra aplicada. Erro de modalidade (5 disponíveis, 3 usadas) e faixa defasada nascem aqui.

## 2. Usuários e trabalho a ser feito

| Papel | Trabalho a ser feito | Fora deste PRD |
|---|---|---|
| Financeiro / RH na admissão | Registrar regime, opção de transporte e faixa uma vez | Redigitar todo mês |
| Operador do lote | Confiar que o perfil vigente é o da política | Inventar valor |
| Colaborador | Escolher **ônibus XOR auxílio gasolina** na entrada (não escolhe Multibenefícios); avisar mudança de endereço | Calcular o próprio benefício |

## 3. Comportamento

### 3.1 Regra da entrevista (fato — copy do operador)

**CLT: Multibenefícios (padrão) + escolha única: cartão de ônibus ou auxílio gasolina. PJ: Flexível, sem essa escolha.**

A pessoa **não** escolhe o benefício de comida. Multibenefícios é padrão de todo CLT. A **única** escolha na admissão é **ônibus XOR auxílio gasolina** (na sala: vale-combustível). PJ não tem essa escolha.

Na transcrição (o financeiro 00:03:00, 00:05:24): «Já o multibenefícios ele é fixo, então ele não é opcional. Tudo CLT tem direito a esse benefício por dia útil.» «só o combustível que ele pode fazer opção entre o combustível ou o cartão de ônibus.» PJ: «não tem a modalidade de combustível, tem só essa modalidade flexível.»

**Multibenefícios na sala** = carteira CLT obrigatória de alimentação e refeição. **Não** é o cartão de marketing Flash chamado Multibenefícios (carteira livre). Sala ≠ site. Copy do operador usa a palavra da sala; o nome no provedor fica no contrato (P07), **não** na lista nem no Detalhe.

**F14 “usamos 3 de 5” — resposta de produto (D16 + D19):** os três *slots* que a operação usa são os da tabela abaixo (Multi + escolha XOR + Flexível PJ). F15 listou quatro nomes (incluindo ônibus): ônibus é tipo Flash no lado da **escolha**, não um 4º mistério de canal. Se gasolina **e** VT estiverem habilitados no CNPJ, são **4 SKUs**. GET **não** foi executado; `name`/`benefitId` continuam pendência P07. Canal do ônibus: **D19** (premissa de recorte; o financeiro **não** disse).

### 3.1.1 Equivalência sala → depósito Flash (decisão de mapeamento D16)

A entrevista fecha **quais recargas a operação usa**. Não fecha o identificador no provedor.

| Recarga da operação | Quem / quando | Base de cálculo | Equivalente de depósito Flash |
|---|---|---|---|
| **Multibenefícios** | CLT, sempre | valor diário × dias úteis da competência (calendário nacional) | `name`/`benefitId` a confirmar (hipótese: **Alimentação e refeição** / Vale-alimentação e refeição; sub-hipótese: dois `benefitId` Alimentação + Refeição) |
| **Auxílio gasolina** | CLT, se a escolha for gasolina | valor fixo da faixa; **não** varia com dias úteis. Sala: vale-combustível | `name`/`benefitId` a confirmar (hipótese: **Auxílio Mobilidade** / combustível) |
| **Cartão de ônibus** | CLT, se a escolha for ônibus (XOR gasolina) | valor mensal fixo (política não dita na entrevista) | `name`/`benefitId` a confirmar (hipótese: **Vale-transporte**; alternativa: Auxílio Mobilidade). **D19:** depósito Flash — premissa de recorte, não GET |
| **Flexível** | PJ, valor fixo, sem outra escolha | valor mensal fixo | `name`/`benefitId` a confirmar (hipótese: **Flexível** / Saldo Flexível; no site Flash, “Multibenefícios” é esta carteira livre) |

Os três *slots* da empresa: Multi + (gasolina \| ônibus) + Flexível. **Tensão 3 vs 4:** se gasolina e VT estiverem ambos habilitados no CNPJ, são 4 SKUs. Não fingir que o GET rodou. As outras habilitadas no CNPJ seguem desconhecidas (hipótese: **Cultura** e **Saúde** — não usamos, confirmar). O catálogo Flash tem **mais de cinco** nomes oficiais; os “cinco disponíveis” são hipótese de subconjunto do CNPJ. Ver [flash.md](../integracoes/flash.md).

Até o GET, a **lista Beneficiários** e o Detalhe mostram só a **regra da sala** (copy do operador). Equivalente Flash (`name`/`benefitId`, P07) **não** entra na UI — é hipótese de contrato, não chip **a confirmar**. As não recarregadas só são **bloqueadas** na geração depois da lista real. P07 pede identificadores, não “quais slots a operação usa”.

Cartão de ônibus: depósito Flash (D19). Pode ficar **a conferir** por cadastro incompleto ou valor ausente — **não** porque o canal era desconhecido (P06 fechada). Sem situação **a verificar**.

### 3.2 Regras CLT

1. Todo CLT ativo na data de corte recebe **Multibenefícios** (padrão). Equivalente Flash: `name`/`benefitId` a confirmar (hipótese: Alimentação e refeição — segunda linha).
2. Na admissão o CLT escolhe **exatamente uma** opção de transporte: **auxílio gasolina ou cartão de ônibus**. Não pode as duas. Não pode nenhuma? **PENDÊNCIA** — PREMISSA: a escolha é obrigatória; lote recusa CLT sem opção. Não escolhe Multibenefícios.
3. Se auxílio gasolina: a faixa é uma de `{5km, 10km, metropolitana}` segundo distância casa–trabalho na admissão. Valor da faixa é fixo até alteração de endereço aceita. Equivalente Flash: `name`/`benefitId` a confirmar (hipótese: Auxílio Mobilidade). O lote gera **duas** linhas (Multibenefícios padrão + Auxílio gasolina escolha) — não XOR comida vs combustível.
4. Se cartão de ônibus: depósito Flash (D19 — premissa de recorte; o financeiro **não** disse o canal). Equivalente Flash: `name`/`benefitId` a confirmar (hipótese: Vale-transporte). O lote gera **duas** linhas (Multibenefícios padrão + Cartão de ônibus escolha), como na gasolina. Valor mensal vive no cadastro; ausente → **a informar** / **a conferir** por cadastro — **não** por P06. Continua existindo a linha de **Multibenefícios**.

### 3.3 Regras PJ

1. Todo PJ ativo na data de corte recebe **Flexível** (equivalente Flash: `name`/`benefitId` a confirmar; hipótese: Saldo Flexível).
2. PJ **não** recebe auxílio gasolina / Auxílio Mobilidade, nem Multibenefícios CLT, nem a escolha ônibus XOR gasolina.
3. Valor Flexível não varia com dias úteis.

### 3.4 Valores (não inventar cifras)

Valores diário, de faixa, Flexível e cartão de ônibus ainda não foram informados (pendências P01, P02, P05; ônibus = mesma lacuna de cifra, canal fechado em D19). Premissa: vivem no cadastro versionado do perfil, com vigência. O motor só lê o valor vigente na data de corte. Este PRD não contém reais. Semente de ônibus só no proto ([proto-semente.md](../proto-semente.md)).

### 3.5 Origem do cadastro

Recorte 1 (ponte, decisões D11 e D15): o financeiro **pode** continuar preenchendo a planilha. O sistema **lê** (arquivo ou imagem — [PRD-04](PRD-04-carga-da-planilha.md)) para pré-preencher o perfil. O lote lê o perfil, não trata a planilha como verdade da competência. Dias úteis: calendário oficial; coluna de dias na planilha vira divergência visível, não escrita. Se ainda quiserem o artefato, o backoffice **gera** a planilha (exportação). D11 (perfil escreve) **não foi perguntado na sala**; D15 recusa fingir que o financeiro matou o Excel. Sync bidirecional fica para depois.

Depois: identidade, área, departamento e ativo/inativo vêm da porta de identidade interna (e-mail `@morada`). Escolha de transporte e faixa podem continuar no domínio de benefícios até o backoffice ter o campo (pendência P18).

### 3.5.1 Origem de cada campo

Tabela completa (fato vs palpite): [`fontes-de-dados.md`](../discovery/fontes-de-dados.md). Recorte 1 **não** inventa campo no backoffice.

| Campo | Recorte 1 lê de | Não assumir no backoffice |
|---|---|---|
| e-mail, área, nível de carga | identidade interna (fato F38) | — |
| nome, regime, departamento de rateio, escolha de transporte, valores | **Trazer da planilha** (F21, F22) | regime e ônibus/carro até P18 |
| faixa / endereço | planilha se a coluna existir (P17, P29); senão conferência | cadastro de RH já ter faixa |
| CPF | mapeamento no provedor + conferência (F36, F37) | identidade `@morada` guardar CPF |
| dias úteis | calendário oficial (compara coluna da planilha) | backoffice ou célula como verdade |
| ativo na data | conferência (premissa D10; P10) | flag visto no backoffice |
| oito departamentos | totais de rateio (F33, F34); linhas da planilha | área = os oito nomes oficiais |

Flash precisa de CPF + nome + modalidade + valor. Omie precisa só de departamento + totais.

### 3.6 Admissão e desligamento no meio do mês

Admissão e desligamento no meio do mês ainda não foram fechados (pendências P09, P10). Premissa do recorte 1:

- Incluir no lote quem está **ativo na data de corte**.
- Admissão após o corte → próximo lote.
- Desligamento antes do corte → fora do lote.
- Desligamento entre corte e crédito → operador exclui a linha na conferência (evento explícito).
- Desligamento após crédito → fora do recorte 1 (estorno, compensação ou folha — pendências P10 e P24).

Não há pró-rata automático no recorte 1. Se a Morada já paga proporcional, isso vira regra nova quando P09/P10 fecharem — não chute.

### 3.7 Alteração de endereço

Hoje: e-mail ao financeiro. Recorte 1: o operador atualiza faixa no perfil; vale a partir do **próximo** lote não congelado. Lote congelado não recalcula faixa.

Fora do recorte 1: solicitação estruturada do colaborador, com evidência de endereço e recálculo só da faixa (Multibenefícios inalterado).

## 4. Jornadas

### 4.1 Admissão CLT com auxílio gasolina

1. RH/financeiro registra regime CLT, escolha auxílio gasolina, faixa, departamento. Multibenefícios entra automático (padrão) — a pessoa não o escolhe.
2. Sistema grava perfil vigente e recusa salvar se faltar faixa ou se Multibenefícios estiver desligado.
3. No primeiro corte em que a pessoa está ativa, o lote gera duas linhas: **Multibenefícios** (padrão; valor diário × dias úteis) e **Auxílio gasolina** (escolha; fixo da faixa). Segunda linha de cada: equivalente Flash (Alimentação e refeição · Auxílio Mobilidade), **a confirmar** (P07 — identificador, não o tipo da recarga). Não XOR comida vs combustível.

### 4.2 Admissão CLT com ônibus

1. Perfil grava escolha ônibus. Multibenefícios continua padrão.
2. Lote gera **Multibenefícios** (padrão) e **Cartão de ônibus** (escolha) — depósito Flash (D19). Segunda linha: equivalente Flash (Vale-transporte), **a confirmar** (P07). Sem auxílio gasolina. Valor ausente no cadastro → “a informar”, **a conferir** por esse motivo — não por canal desconhecido.

### 4.3 Admissão PJ

1. Perfil regime PJ, modalidade Flexível, valor mensal do cadastro.
2. Sistema recusa auxílio gasolina, cartão de ônibus ou Multibenefícios CLT nesse perfil. PJ não tem a escolha de transporte.
3. Lote gera uma linha Flexível (equivalente Flash a confirmar; hipótese: Saldo Flexível).

### 4.4 Mudança de endereço (desvio)

1. Colaborador avisa (e-mail no recorte 1).
2. Operador troca a faixa. Se o lote do mês já está congelado, a mudança não o altera.
3. Próxima competência usa a nova faixa.

## 5. Critérios de aceite

- Dado um CLT ativo sem opção de transporte, quando se tenta gerar lote, então a linha fica em exceção e não segue para execução. Multibenefícios não é essa opção.
- Dado um CLT com auxílio gasolina, quando o lote é gerado, então existem exatamente as linhas **Multibenefícios** (padrão) e **Auxílio gasolina** (escolha) — e nenhuma outra modalidade de depósito. Equivalente Flash (P07) **não** aparece na lista nem no Detalhe. Não XOR comida vs combustível numa única linha.
- Dado um CLT ativo com perfil válido, quando o lote é gerado, então Multibenefícios usa os dias úteis da competência do calendário nacional — não um número digitado naquele mês.
- Dado um CLT com cartão de ônibus (D19: depósito Flash, premissa de recorte), quando o lote é gerado, então existem exatamente as linhas **Multibenefícios** (padrão) e **Cartão de ônibus** (escolha) — sem Auxílio gasolina. Equivalente Flash (P07) **não** aparece na lista nem no Detalhe. A linha **não** fica **a conferir** só porque o canal era desconhecido (P06 fechada).
- Dado um PJ, quando o lote é gerado, então existe só Flexível — sem escolha ônibus XOR auxílio gasolina.
- Dado qualquer colaborador, quando o lote é gerado, então a copy do operador segue a regra da sala (D16: os três *slots*; D19: ônibus = Flash). Equivalente de depósito Flash (P07) fica no contrato, **não** na UI, até o GET.
- Dado valor ausente no cadastro (diário, faixas ou Flexível — pendências P01, P02, P05), quando o lote é gerado, então a linha fica em exceção — o sistema não inventa cifra.
- Dado lote congelado, quando a faixa de endereço muda, então o lote congelado permanece intacto.
- Dado colaborador admitido após a data de corte (premissa sobre admissão no meio do mês, pendência P09), quando o lote da competência é gerado, então essa pessoa não entra.

## 6. Fora de escopo

- Cálculo de distância (km) automático por mapa. A faixa é atributo informado.
- Política de férias, atestado, home office reduzindo dias (não foi dito; seria PENDÊNCIA nova se surgir).
- Desconto legal de vale-transporte em folha.
- Marketplace das duas modalidades Flash não usadas.

## 7. Premissas e pendências

| ID | Premissa adotada | Quem confirma |
|---|---|---|
| P09, P10 | Elegíveis = ativos na data de corte; sem pró-rata no recorte 1 (o lote antecipa o mês — decisão D10, a confirmar) | o financeiro / RH |
| D19 (P06 fechada) | Cartão de ônibus também é depósito Flash (XOR gasolina) para o ciclo depositar. O financeiro **não** disse o canal. Não é GET. Identificadores = P07. **A conferir** só por cadastro/valor — não por canal desconhecido | Recorte do candidato; GET confirma `benefitId` |
| P01, P02, P05 | Valores só no cadastro versionado (ônibus: mesma lacuna de cifra; seed só no proto) | Planilha vigente + política |
| P07 | GET ainda precisa dos `name`/`benefitId` dos slots (D16, incluindo ônibus) e das habilitadas e não recarregadas (hipótese Cultura, Saúde; 3 slots vs 4 SKUs). GET **não** foi executado. Até o GET, UI: regra da sala na primeira linha; equivalente Flash **a confirmar** na segunda. Bloquear as não recarregadas só depois da lista real. | o financeiro + `GET /benefits/v1/benefits` |
| P18 | Carga da planilha (PRD-04, D15) pré-preenche; daí o perfil escreve (D11, não perguntado na sala). Campos de elegibilidade no backoffice ainda abertos. Origem campo a campo: [fontes-de-dados.md](../discovery/fontes-de-dados.md) | quem avalia a dinâmica + RH |
| P23 | Recorte 1 não troca auxílio gasolina ↔ ônibus depois da admissão | RH |

## 8. Sucesso

- 100% das linhas executadas pertencem aos slots da política (D16: Multibenefícios + (gasolina \| ônibus) + Flexível). Equivalente Flash (`name`/`benefitId`) leva **a confirmar** até P07.
- 0 execução de Auxílio gasolina / Auxílio Mobilidade para PJ ou para CLT-ônibus; 0 execução de Cartão de ônibus para CLT-gasolina. A escolha XOR permanece no perfil.
- Divergência perfil × lote = 0 no caminho feliz; exceções só por cadastro incompleto (valores ainda não informados — P01, P02, P05, cifra de ônibus) ou evento de desligamento.
