# PRD-04 — Carga da planilha de controle

Status: vigente (extensão honesta do recorte 1)
Fonte: [PRD-01](PRD-01-politica-de-beneficios.md), [PRD-02](PRD-02-operacao-do-lote.md), [docs/discovery/fatos-hipoteses.md](../discovery/fatos-hipoteses.md)
Recorte: **carga** planilha → sistema para pré-preencher. Não mata o Excel no dia 1. Dias úteis continuam do **calendário oficial**. Sync bidirecional = recorte posterior.

## Metadados

- Audiência: financeiro, diretoria, engenharia
- Relacionados: SRD-01 porta **planilha de controle** (`PlanilhaDeControle`); decisões D11 e D15
- Recorte 1 cobre: ler arquivo **ou** imagem (adaptador, sem botão próprio), comparar dias com o calendário, gerar arquivo de volta
- Recorte 1 **não** cobre: sincronizar os dois lados como escritores iguais

## Etiquetas desta especificação

| ID | Afirmação | Etiqueta | Fonte |
|----|-----------|----------|-------|
| E1 | Todo mês o ciclo é controlado numa planilha (pessoas, opção, dias úteis, valores) | fato | F21, F22 |
| E2 | Dias úteis são preenchidos **manualmente** na planilha, feriados nacionais | fato | F30 |
| E3 | A sala **não** foi perguntada se o financeiro abandona o Excel; D11 é premissa reversível, não acordo | fato | D11, grill Q3 |
| E4 | Perfil no backoffice é o cadastro-mestre da elegibilidade **quando** a escrita passar para o sistema | decisão | D11 |
| E5 | Recorte 1 da **carga**: a planilha continua o hábito de preenchimento; o sistema **lê** (arquivo ou imagem) e **opcionalmente devolve** arquivo. Não forçar abandonar o Excel no dia 1 | decisão | D15 |
| E6 | Dias úteis da competência vêm do calendário oficial; a planilha não sobrescreve esse inteiro em silêncio | decisão | PRD-02, `CalendarioOficial` |
| E7 | Sincronização bidirecional completa (dois escritores) reabre o sistema-sombra | hipótese | H03, H15 |
| E8 | Mapeamento estável das colunas da planilha vigente e qualidade mínima da imagem | pendência | P29, P17 |
| E9 | Cartão de ônibus na planilha vira linha de escolha Flash (D19), não canal desconhecido | decisão | D19 (P06 fechada) |

Toda regra abaixo lastreia fato/decisão ou declara premissa. Hipótese não vira regra silenciosa. **Não** fingir que o financeiro concordou em matar o Excel.

## Problema reformulado

- **Quem sofre:** o financeiro (hoje três pessoas) que já monta a planilha **e** ainda vai redigitar no Flash.
- **Quando:** no ciclo mensal, **antes** da conferência e da execução — na hora de nascer o lote.
- **Frequência:** uma competência por mês; a planilha já é preenchida (fato F21).
- **Impacto observável:** ou o recorte 1 exige cadastro-mestre no dia 1 (D11 puro, **não** combinado na sala) e o hábito quebra; ou o sistema ignora a planilha e a digitação continua em dois lugares.
- **O que isto não é:** não é “integrar Excel”. Não é matar a planilha. Não é o calendário deixar de calcular dias úteis. Não é o Flash deixar de ser o gargalo declarado (fato F29).

## Usuários e trabalho a ser feito

| Ator | Trabalho a ser feito | Fora deste PRD |
|------|----------------------|----------------|
| Financeiro | Continuar preenchendo a planilha se quiser; **Trazer da planilha** para pré-preencher Beneficiários (arquivo ou imagem — o operador não escolhe o adaptador); conferir divergências (sobretudo dias úteis vs calendário) | Digitar de novo no Flash no caminho feliz; autorizar pagamento |
| Diretoria | — | Operar carga ou linha de crédito |
| Colaborador | — | Enviar planilha ou print |
| Engenharia / backoffice | Satisfazer a porta **planilha de controle** (`PlanilhaDeControle`): ler linhas, gerar arquivo; sync só depois | Escolher motor de IA, formato de ficheiro, stack |

## Fora de escopo

- Sincronização bidirecional ao vivo (dois escritores). Recorte posterior, salvo a sala insistir nos dois botões como mock — neste contrato **não** há botão “Sincronizar” no recorte 1.
- Identidade interna como fonte mestra (isso continua **depois**; pendência P18).
- Omie, diretores, banco.
- Inventar R$ **como política** (P01, P02, P05). Cifras do protótipo são PREMISSA DE PROTÓTIPO em [proto-semente.md](../proto-semente.md), não fato do financeiro.
- Layout oficial da planilha. Valor de ônibus no PRD (semente só no proto).
- Stack, protocolo, banco, “a API”, vendor de visão computacional.

## Comportamento

### Regras

1. **Carga pré-preenche; não executa**
   - Gatilho: operador em Beneficiários aciona **Trazer da planilha**.
   - Comportamento: o sistema lê linhas na porta `PlanilhaDeControle` e materializa rascunho de perfil / linhas do lote **a conferir**. Arquivo tabular ou imagem da mesma grade são o **mesmo** `ler_linhas` — a imagem é **adaptador**, não um botão nem um quinto produto. O operador não escolhe como a planilha é processada. Não congela. Não dispara Flash. Não inventa cifra ausente — valor não lido ou ilegível = “a informar”.
   - Exceção: lote já em conferência ou além — carga recusa ou pede voltar a rascunho (evento). Não substitui lote congelado em silêncio.

2. **Dois meios, uma extração**
   - Gatilho: **Trazer da planilha** recebe ficheiro tabular **ou** imagem da planilha que o operador já preenche.
   - Comportamento: o mesmo contrato de extração (`ler_linhas`). Imagem é **adaptador** da porta **planilha de controle**, não CTA visível. Não existe botão **Preencher pela imagem**.
   - Exceção / pendência: qualidade da imagem e mapa de colunas (P29). Falha visível, não chute.

3. **Calendário manda em dias úteis**
   - Gatilho: a extração inclui coluna de dias úteis (fato F22: a planilha tem esse campo).
   - Comportamento: o motor **não** copia o inteiro da planilha para a competência. Compara com `CalendarioOficial`. Divergência aparece no **calendário da competência** (dois números), **não** como subtítulo vermelho nem situação da linha Beneficiários (D23). O operador aceita o calendário, ou registra ajuste justificado (feriado municipal — pendência P12) — nunca a célula ganha em silêncio.
   - Exceção: extração sem coluna de dias → só o calendário; sem flag de divergência de dias.

4. **Gerar planilha é só um sentido**
   - Gatilho: **Gerar planilha**.
   - Comportamento: o backoffice **devolve** um arquivo a partir do perfil/lote atual (decisão D11: exportação). Não escreve no ficheiro que o financeiro tem aberto. Não é sync.
   - Exceção: nenhuma cifra inventada no arquivo; “a informar” permanece.

5. **Sync bidirecional não é recorte 1**
   - Gatilho: pedido de “um botão que sincroniza sistema ↔ planilha”.
   - Comportamento: operação `sincronizar` existe no contrato da porta para não nascer outro nome depois. **Recorte 1 não a oferece na UI.** Dois escritores = risco de sistema-sombra de novo (hipótese H03).
   - Exceção: se a sala **insistir** nos dois sentidos no proto, os botões de carga + gerar permanecem mocks unidirecionais; “Sincronizar” continua fora.

6. **Ônibus e valores**
   - Gatilho: linha na planilha com cartão de ônibus ou valor vazio.
   - Comportamento: ônibus → linha de **escolha** = depósito Flash (D19), XOR auxílio gasolina. Valor lido da planilha; ausente → “a informar” e **a conferir** por cadastro — **não** por canal desconhecido (P06 fechada). Modalidade fora da regra da sala → exceção, não execução.

### Quando usar cada modo

| Modo | Quando | O que não faz |
|------|--------|----------------|
| **Trazer da planilha** | O financeiro já tem o ficheiro (ou um print) do mês e quer nascer o lote sem redigitar pessoas × modalidade. Arquivo ou imagem: o sistema escolhe o adaptador | Não atualiza o Excel aberto; não manda em dias úteis; não é o operador quem escolhe “arquivo vs imagem” |
| **Gerar planilha** | Ainda precisam do artefato (e-mail, arquivo morto, colega sem backoffice) | Não é a escritora; não sincroniza de volta |
| **Sincronizar** (depois) | Só se, depois de um ciclo medido, o Excel **tiver** de permanecer gémeo vivo | Recorte 1 recusa: dois escritores |

Recomendação deste contrato: recorte 1 = **Trazer da planilha** + **Gerar planilha**. Imagem e arquivo são o **mesmo** pré-preenchimento (adaptador). Conferência humana já existe (PRD-02) — é o sítio da revisão da leitura. Sem botão **Preencher pela imagem**.

### Jornadas

1. **Trazer da planilha** — financeiro; lote em rascunho ou competência ainda sem lote.
   1. Operador preenche a planilha como hoje (fato F21) — o recorte **não** pede para parar.
   2. Em Beneficiários, **Trazer da planilha**, escolhe o ficheiro (planilha ou print — o adaptador não é um segundo botão).
   3. Sistema lê linhas; mapeia colaborador, regime, departamento, modalidade, valores se presentes.
   4. Dias da planilha vs calendário: divergência visível.
   5. Tabela pré-preenchida, situação **a conferir**. Operador segue PRD-02.
   - Se falhar no meio: célula ilegível / coluna fora do mapa (P29) → linhas afetadas em exceção; as outras podem entrar. Não descarta o ficheiro inteiro em silêncio sem dizer o quê. Imagem desfocada, cortada ou com duas páginas: recusa com motivo ou lê o que for confiável. Sem completar célula “no palpite”.

2. **Gerar planilha** — depois de haver perfil/lote no sistema.
   1. **Gerar planilha**.
   2. Ficheiro descarregado reflete o que o sistema tem (incluindo dias do **calendário**, não a célula antiga).
   3. Se o operador editar esse ficheiro e quiser devolver: volta à jornada 1 (carga), não a um merge invisível.

3. **Falha: célula errada** — a extração lê o valor do vizinho (nome de um, valor de outro — risco já citado, fato F31).
   1. Linha nasce pré-preenchida.
   2. Conferência mostra origem “planilha” / “imagem”.
   3. Operador corrige com motivo. Não se executa no Flash sem isso. Carga **não** é atalho da conferência.

4. **Falha: dois escritores (só se sync existisse)** — sistema altera o lote; alguém altera a planilha aberta; o botão de sync “ganha” de um lado.
   1. Recorte 1 **não** oferece esse botão.
   2. Se um recorte futuro o ligar: conflito visível campo a campo; dias úteis **nunca** resolvem a favor da planilha sem flag; lote congelado não é alvo de sync.

### Estados visíveis ao operador

| Estado da carga | O que o financeiro vê |
|-----------------|------------------------|
| Sem carga nesta competência | Beneficiários vazios ou só identidade; CTAs **Trazer da planilha**, **Gerar planilha** |
| Pré-preenchido | Linhas a conferir; flags de leitura e de dias vs calendário |
| Divergência de dias | Chip/texto na linha de **Multibenefícios**: inteiro da planilha **e** inteiro do calendário; o cálculo usa o calendário |
| Leitura falhou | Motivo (célula, coluna, imagem); ação: corrigir na conferência ou mandar de novo |
| Planilha gerada | Toast + ficheiro; o Excel do financeiro **não** mudou sozinho |

Transição automática: nenhuma para congelar ou executar. Manual: conferir (PRD-02).

## Critérios de aceite

- [ ] Dado que o financeiro preenche a planilha todo mês (fato F21) e a sala não combinou matar o Excel (D11), quando o recorte 1 da carga opera, então o operador **pode** continuar preenchendo a planilha e **Trazer da planilha** pré-preenche o sistema (arquivo ou imagem, mesmo contrato).
- [ ] Dado um ficheiro ou uma imagem da mesma planilha, quando a extração corre, então as linhas resultantes obedecem ao mesmo contrato (`ler_linhas`); a imagem é adaptador, não outro produto nem botão **Preencher pela imagem**.
- [ ] Dado que a extração trouxe coluna de dias úteis, quando o lote é gerado, então os dias da competência são os do calendário oficial **e** a comparação vs planilha está no calendário da competência — a planilha não sobrescreve em silêncio e a lista **não** ganha situação “dias divergem” nem “planilha 22”.
- [ ] Dado valor ausente ou ilegível, quando a linha aparece, então o valor é “a informar” — nenhuma cifra inventada.
- [ ] Dado CLT com cartão de ônibus na planilha (D19), quando a carga corre, então a linha de **escolha** é depósito Flash (XOR gasolina), com valor lido ou “a informar”. A linha de **Multibenefícios** (padrão) continua. **Não** fica **a conferir** só porque o canal era desconhecido.
- [ ] Dado lote congelado, quando o operador tenta nova carga, então o sistema recusa substituir em silêncio.
- [ ] Dado **Gerar planilha**, quando o ficheiro é produzido, então ele reflete o sistema (dias = calendário) e **não** grava no Excel aberto do operador.
- [ ] Dado o recorte 1, quando a UI de Beneficiários é usada, então **não** existe ação de sincronizar os dois lados como escritores iguais e **não** existe botão **Preencher pela imagem**.
- [ ] Dado imagem desfocada ou grade ilegível, quando a extração falha, então o operador vê o motivo e nenhuma célula é preenchida “no palpite”.
- [ ] Dado nome de um com valor de outro na leitura (fato F31), quando a conferência abre, então a origem da carga é visível e a execução no Flash continua bloqueada até conferir (PRD-02).

## Modos de falha cobertos aqui

| Modo | Como o PRD impede ou detecta | O que sobra para o SRD |
|------|------------------------------|------------------------|
| Valor errado | Origem da carga visível; conferência; “a informar” se ilegível; sem cifra inventada | Invariante: carga não executa; idempotência da re-leitura |
| Célula errada / vizinho | Mesmo que F31: conferência obrigatória após carga | Flag de origem e de leitura (≠ D12) |
| Imagem ilegível | Recusa ou linhas em exceção com motivo; sem palpite | Adaptador de imagem devolve falha explícita |
| Duplicidade | Re-carga em rascunho substitui com evento; par colaborador+modalidade único (PRD-02) | Chave `(competencia, colaborador, modalidade)` |
| Feriado / dias | Calendário manda; divergência visível; municipal = P12 | Porta `CalendarioOficial` vs `ler_linhas` |
| Desligado | Carga pode trazer gente que a identidade já inativou → exceção na conferência (P10) | Cruzar com `IdentidadeInterna` quando a ponte existir |
| Dois escritores | Fora do recorte 1; `sincronizar` não na UI | Porta reserva a operação sem ligá-la |
| Divergência provedor vs ERP | Riscar — dono: [PRD-03](PRD-03-financeiro-e-governanca.md) | — |

## Sucesso

| Métrica | Como medir | Baseline | Limiar neste recorte |
|---------|------------|----------|----------------------|
| Tempo até lote pré-preenchido | da planilha pronta (hábito atual) até Beneficiários a conferir | a medir no 1º ciclo | menor que redigitar ~73 pessoas |
| Divergências de dias úteis visíveis | flags calendário vs planilha (hipótese H05) | a medir | 100% das diferenças de inteiro aparecem |
| Linhas executadas sem conferência após carga | contagem | — | **zero** |
| Re-leituras que inventam cifra | contagem | — | **zero** |
| Operador ainda preenche Excel no 1º ciclo | pergunta ao financeiro | fato: hoje sim | permitido (D15); não é falha |

## Pendências e premissas

| Item | Premissa adotada (se houver) | Quem precisa confirmar |
|------|------------------------------|------------------------|
| D11 | Perfil escreve **quando** a escrita estiver no sistema; gerada = exportação | Grill Q3 — **não** perguntado na sala |
| D15 | Recorte 1 = carga unidirecional; Excel permanece hábito | Este PRD (extensão honesta de D11) |
| P29 | Colunas ≈ o bloco F22 (departamento, nome, regime, dias, diário CLT, mensal PJ, combustível); endereço ambíguo (P17) | Planilha vigente do financeiro |
| D19 (P06 fechada) | Ônibus na planilha = depósito Flash (escolha XOR); valor ausente = a informar | Recorte; GET confirma `benefitId` |
| P12 | Divergência de dias: calendário nacional vs célula; municipal só com evento | Política |
| P18 | Carga não inventa que o backoffice já tem faixa/regime | quem avalia a dinâmica + RH |
| Proto semente | Cifras só no proto ([proto-semente.md](../proto-semente.md)); P01/P02/P05 seguem abertas neste PRD | — |
