# Fatos, hipóteses, decisões e pendências

Inventário etiquetado da sessão de descoberta de 15 de setembro de 2026 e do guia do candidato. Fonte da evidência; não é proposta nem contrato de produto.

Nada neste arquivo inventa valor monetário de benefício. Os “R$ 100” ditos na sessão são gesto de digitação no painel, não política.

## Metadados

| Campo | Valor |
| --- | --- |
| Data | 2026-09-15 |
| Título da reunião | PE :: Eleno Trindade |
| Duração da transcrição | 00:18:58 (a sessão foi mais curta que os ~60 min do guia) |
| Fontes | Anotações e transcrição Gemini; guia do candidato |
| Candidato | Eleno Trindade |
| Fonte da dor | o financeiro |
| Liderança técnica | quem avalia a dinâmica |
| Moderação | Danubia Santana |
| Convidada no convite (sem fala útil na transcrição) | Hiorrana dos Santos Rocha |
| Material prévio | Guia enviado por Johana (Danubia, 00:00:39) |

## Convenção

| Etiqueta | Significa | Entra na proposta como |
| --- | --- | --- |
| **FATO** | Relatado ou observado na sessão, ou exigido pelo guia | Evidência |
| **HIPÓTESE** | Interpretação, causa possível ou palpite ainda não medido | Causa / validação |
| **DECISÃO** | Restrição ou recorte já assumido (guia, sala ou candidato) | Premissa explícita |
| **PENDÊNCIA** | Não foi dito, ficou ambíguo ou precisa de dado | Próximo passo |

Identificadores são estáveis (`F01`, `H01`, `D01`, `P01`). Timestamps apontam para a transcrição Gemini.

## Contagem

| Etiqueta | Quantidade |
| --- | --- |
| FATO | 49 |
| HIPÓTESE | 20 |
| DECISÃO | 28 |
| PENDÊNCIA | 30 |

---

## Processo seletivo e formato da entrega

- **F01 [FATO]** A dinâmica tem sessão de descoberta e proposta escrita em 24–48 h; não há apresentação oral; a avaliação é o documento. — *Guia, seções 02 e 04; Danubia 00:18:09.*
- **F02 [FATO]** A proposta deve ter seis seções: reformulação, causa/hipóteses, solução, trade-offs, priorização, como medir sucesso. — *Guia, seção 04.*
- **F03 [FATO]** O guia pede separar fatos de hipóteses, explicitar premissas e o que permanece desconhecido; não exige conhecer tecnologia interna nem escrever código. — *Guia, seções 04 e 05.*
- **F04 [FATO]** Danubia confirmou prazo de 24 a 48 horas (pode entregar antes; limite 48 h), compartilhamento da transcrição e avaliação por quem avalia a dinâmica. — *00:15:54, 00:18:09.*
- **F05 [FATO]** Eleno pediu gravação/transcrição Gemini; Danubia disse que a transcrição seria compartilhada. — *00:00:39, 00:02:08.*
- **F48 [FATO]** Na conversa falaram Danubia Santana (moderação), o financeiro, quem avalia a dinâmica e Eleno Trindade (candidato). A transcrição encerra em 00:18:58; Hiorrana dos Santos Rocha consta no convite sem fala. — *Notas Gemini + transcrição.*
- **D01 [DECISÃO]** Entrega escrita em até 48 h, sem apresentação, no tom de colega; stack não é requisito. — *Guia + Danubia.*
- **D02 [DECISÃO]** Quem avalia a entrega é quem avalia a dinâmica. — *Danubia 00:18:09.*

---

## Política de benefícios (CLT / PJ)

**Regra da entrevista (uma frase, fato F08–F13):** CLT: Multibenefícios (padrão) + escolha única: ônibus ou auxílio gasolina (sala: vale-combustível). PJ: Flexível, sem essa escolha. A pessoa **não** escolhe comida. Multibenefícios da sala ≠ Multibenefícios do site Flash (carteira livre). **Decisão D19 (recorte / premissa, não GET):** os dois lados da escolha são depósitos Flash. **D16:** os três *slots* do catálogo da empresa são Multibenefícios + (gasolina \| ônibus) + Flexível PJ; se gasolina e VT estiverem ambos habilitados no CNPJ, isso são 4 SKUs. `name`/`benefitId` = hipótese H16 / pendência P07 (GET ainda não executado).

- **F06 [FATO]** O programa de benefícios da Morada hoje é o Flash. — *o financeiro 00:02:08.*
- **F07 [FATO]** O programa distingue colaboradores CLT e prestadores PJ. — *o financeiro 00:02:08.*
- **F08 [FATO]** CLT recebe recarga mensal na modalidade que o financeiro chamou Multibenefícios (alimentação + refeição). — *o financeiro 00:03:00.* «Já o multibenefícios ele é fixo, então ele não é opcional.» Nome oficial Flash **não** foi dito; ver hipótese H16 e pendência P07. Copy do operador: **Multibenefícios** (padrão).
- **F09 [FATO]** Esse crédito CLT de alimentação + refeição é calculado por dias úteis: valor fixo por dia útil × dias úteis do mês. — *o financeiro 00:03:00, 00:13:31.*
- **F10 [FATO]** Esse crédito CLT de alimentação + refeição é obrigatório para todo CLT; não há opção de troca. — *o financeiro 00:03:00, 00:05:24.* A pessoa **não** escolhe o benefício de comida.
- **F11 [FATO]** Na admissão, o CLT escolhe vale-combustível **ou** cartão de ônibus. Só essa escolha é opcional. — *o financeiro 00:03:00, 00:05:24.* «só o combustível que ele pode fazer opção entre o combustível ou o cartão de ônibus.» Copy do operador para o lado combustível: **Auxílio gasolina** (a transcrição não disse “gasolina”).
- **F12 [FATO]** PJ recebe valor mensal fixo na modalidade Flash Flexível: sem variação mês a mês e sem combustível. — *o financeiro 00:03:00.* Sem a escolha ônibus XOR auxílio gasolina.
- **F13 [FATO]** O Flexível PJ também não tem opção de troca. — *o financeiro 00:05:24.*
- **F14 [FATO]** O Flash disponibiliza cinco modalidades; a Morada utiliza três. — *o financeiro 00:06:34.* **Resposta de produto (D16 + D19):** os três *slots* que uma operação acerta são Multibenefícios + (gasolina \| ônibus) + Flexível PJ. Se gasolina **e** vale-transporte estiverem habilitados no CNPJ, são **4 SKUs** — tensão honesta com “usamos 3”. GET **não** foi executado; `name`/`benefitId` = P07.
- **F15 [FATO]** No início da explicação, o financeiro falou em “quatro modalidades de recarga” entre CLT e PJ (Multibenefícios, combustível, ônibus, flexível). — *00:03:00.* **D16 + D19:** ônibus é tipo Flash no lado da **escolha** (XOR gasolina), não um 4º mistério de canal. A tensão F14/F15 (3 vs 4) não se fecha no GET: fecha-se em *slots* (3) vs SKUs no CNPJ (4 se gasolina e VT ativos).
- **F16 [FATO]** Vale-combustível CLT tem três faixas por distância residência–trabalho: 5 km, 10 km e região metropolitana. — *o financeiro 00:06:34.*
- **F17 [FATO]** A faixa/valor de combustível é definida na admissão e permanece a mesma nos meses seguintes, diferente do crédito CLT de alimentação + refeição (que varia com os dias úteis). — *o financeiro 00:06:34.*
- **F18 [FATO]** Exemplo dado na sala: quem mora a 7 km tem o valor definido na entrada e esse valor se repete todo mês. — *o financeiro 00:06:34.* Não informa qual faixa é a de 7 km nem o valor em reais.
- **F19 [FATO]** Quem muda de endereço e quer atualizar o combustível escreve para o financeiro por e-mail. — *o financeiro 00:09:12.*
- **F20 [FATO]** O endereço entra no processo de admissão; não há self-service descrito. — *Eleno resume; o financeiro confirma 00:09:12.*
- **H01 [HIPÓTESE]** O valor diário do crédito CLT de alimentação + refeição é único para todos os CLT (o financeiro falou “um valor fixo por dia útil”, no singular). — *Validar no valor diário (pendência P01).*
- **H02 [HIPÓTESE — SUPERSEDEDA por D19]** Cartão de ônibus *não* seria recarga Flash. **Fechada como premissa inversa:** assumimos que **é** depósito Flash para o ciclo depositar. O financeiro **não** disse Flash para ônibus; D19 não é GET. O que sobra é o *nome* no provedor (Auxílio Mobilidade vs Vale-transporte) — P07 / H16. — *F14 vs F15; D09 guardava o canal aberto; D19 fecha o canal por recorte.*
- **H16 [HIPÓTESE]** Equivalente de depósito Flash (`name`/`benefitId`) — **não** quais slots a operação usa (isso é D16). Multibenefícios da sala → hipótese **Alimentação e refeição** (produto: Vale-alimentação e refeição; sub-hipótese: dois `benefitId` — Alimentação + Refeição). Auxílio gasolina → hipótese **Auxílio Mobilidade** / combustível. Cartão de ônibus → hipótese **Vale-transporte** (alternativa: o mesmo Auxílio Mobilidade da gasolina). Flexível PJ → hipótese **Flexível** / Saldo Flexível. No site Flash, **Multibenefícios** é a carteira flexível — o contrário da fala da sala. As habilitadas e não recarregadas, hipoteticamente **Cultura** e **Saúde** (a conta 5−3 vs 5−4 depende de slot vs SKU). “Cinco disponíveis” = subconjunto habilitado no CNPJ. Uma pessoa CLT **não** é comida **ou** combustível: são duas linhas (padrão + escolha). GET **não** foi executado. — *Validar em P07. Fontes: [flash.md](../integracoes/flash.md).*

---

## Operação mensal (planilha, Flash, ERP, diretores)

- **F21 [FATO]** O ciclo é controlado numa planilha: listagem de pessoas, opção de benefício, dias úteis e valores (fixo vs variável). — *o financeiro 00:04:16, 00:13:31.*
- **F22 [FATO]** Campos confirmados na planilha: departamento, nome do colaborador, modalidade de contratação (CLT/PJ), dias úteis do mês, valor diário CLT, valor mensal PJ, valor fixo de combustível. — *o financeiro 00:13:31.* Endereço na planilha ficou ambíguo (P17).
- **F23 [FATO]** No painel Flash o lançamento é pessoa a pessoa e benefício a benefício: selecionar colaborador, selecionar modalidade, digitar valor. — *o financeiro 00:04:16, 00:07:55.*
- **F24 [FATO]** Os “R$ 100” (“multibenefícios R$ 100”, “Núbia combustível R$ 100”) ilustram o gesto de digitação. Não são valores da política. — *o financeiro 00:04:16.*
- **F25 [FATO]** Depois do Flash, o financeiro lança no ERP (falado como OME / “homem” / RP) **por departamento**, não por colaborador. — *o financeiro 00:05:24, 00:12:28.*
- **F26 [FATO]** Dois diretores aprovam via e-mail. O financeiro exporta do ERP um relatório do que vai ao banco (valor e a que se refere o pagamento) e envia aos diretores. — *o financeiro 00:05:24, 00:10:18.*
- **F27 [FATO]** Com a aprovação, o pagamento ocorre no banco e “é processado” no Flash. — *o financeiro 00:05:24.* A ordem boleto × ERP × banco × Flash não foi desenhada com precisão (P16).
- **F28 [FATO]** No Flash, quem tem perfil administrativo gera a recarga e o boleto; “a partir do momento que gera esse boleto… isso sobe dentro do OME… e isso vai para dentro do banco”. — *o financeiro 00:07:55.*
- **F29 [FATO]** O gargalo de tempo declarado é o lançamento no painel Flash, não o ERP. — *Eleno pergunta 00:07:55; o financeiro confirma.*
- **F30 [FATO]** Dias úteis são preenchidos **manualmente** todo mês, com base em feriados **nacionais**. — *o financeiro 00:13:31.*
- **F31 [FATO]** Riscos citados: nome de um com valor de outro; dias úteis errados; modalidade errada (cinco disponíveis, três usadas). — *o financeiro 00:06:34.* Frequência e custo não foram medidos (P22).
- **H03 [HIPÓTESE]** A planilha é um sistema-sombra **hoje**: a verdade operacional do mês vive nela, não no backoffice nem no provedor, e pode divergir da admissão. — *Inferência sobre F21–F22 vs F40–F41. Recorte D11 inverte a escrita no destino; D15 **não** mata o Excel no dia 1 (carga lê). A sala não foi perguntada.*
- **H04 [HIPÓTESE]** A UI do Flash força entrada atômica (colaborador + modalidade + valor) e não reusa elegibilidade já conhecida. — *Inferência sobre F23; causa prioritária a validar no painel/API.*
- **H05 [HIPÓTESE]** O cálculo manual de dias úteis é causa recorrente de erro, não só um risco teórico. — *o financeiro citou o risco; não mostrou incidente.*
- **H06 [HIPÓTESE]** Há escrita dupla (provedor linha a linha + ERP agregado) sem conciliação formal lote = provedor = ERP. — *Não foi descrita conferência cruzada.*
- **H07 [HIPÓTESE]** A aprovação por e-mail não trava um consolidado de pagamento: o lote pode mudar entre o relatório e o pagamento. — *Processo F26–F27 não menciona travamento. Recorte D13/D14 emite consolidado de pagamento; não trava a execução do Flash.*

---

## Volume, papéis e identidade

- **F32 [FATO]** São cerca de 73 colaboradores. — *o financeiro 00:12:28 (“não são os 73 funcionários… vai por departamento”).*
- **F33 [FATO]** Há oito departamentos; exemplos falados: financeiro, vendas, marketing. — *o financeiro 00:12:28.*
- **F34 [FATO]** No ERP são oito lançamentos agregados (um por departamento), não 73 linhas. — *o financeiro 00:12:28.*
- **F35 [FATO]** Três pessoas no financeiro usariam a solução; as três têm acesso administrativo no Flash. — *o financeiro 00:07:55, 00:11:22.*
- **F36 [FATO]** O painel Flash autentica por **CPF**; o CNPJ da Morada define quem é administrador (pode recarregar e gerar boleto). — *o financeiro 00:07:55.*
- **F37 [FATO]** Todos os colaboradores estão cadastrados no Flash. — *o financeiro 00:11:22.*
- **F38 [FATO]** O backoffice interno autentica por e-mail **@morada**, com área e nível de carga. — *quem avalia a dinâmica 00:17:11.* Contraste explícito com o CPF do Flash.
- **H08 [HIPÓTESE]** Os diretores aceitariam aprovar fora do e-mail (segunda via). — *Eleno 00:11:22; o financeiro responde “Sim” em 00:12:28, anuência breve, sem redesenho do processo.*

---

## Sistemas, isolamento e backoffice

- **F39 [FATO]** O Flash tem API; a Morada ainda não usa. Não há essa automação hoje. — *quem avalia a dinâmica 00:09:12.*
- **F40 [FATO]** Integrações internas seriam arquitetura própria, **completamente isolada da camada do cliente**. — *quem avalia a dinâmica 00:10:18.*
- **F41 [FATO]** Existe backoffice interno (o financeiro: “RP próprio” / “morador”; quem avalia a dinâmica: “mistura ali do backoffice”) com área e nível de carga. — *00:15:54, 00:17:11.*
- **F42 [FATO]** Quem avalia a dinâmica aceitou que a solução poderia fazer parte dessa estrutura de backoffice, sem nascer um sistema à parte. — *00:15:54.*
- **F43 [FATO]** Cultura da Morada: adepta a adotar soluções, automatizar o possível e usar ferramentas próprias; automação depende do nível de confiança da solução. — *quem avalia a dinâmica 00:14:44.*
- **F44 [FATO]** Eleno perguntou sobre usuário de sistema / compliance no Flash; quem avalia a dinâmica não detalhou política, só a ausência de automação e a existência da API. — *00:07:55–00:09:12.* Ver P19.
- **H09 [HIPÓTESE]** O ERP falado como OME / “homem” / RP é o **Omie**. — *Transcrição inconsistente; o plano do desafio adota Omie. Validar o nome canônico (P26).*
- **H10 [HIPÓTESE]** Departamento, área e nível de carga do backoffice já cobrem boa parte do que a planilha pede, então o cadastro operacional pode nascer dali. — *Eleno 00:17:11; quem avalia a dinâmica não confirmou o mapeamento campo a campo (P18). D11 não fecha P18.* Campo a campo: [`fontes-de-dados.md`](./fontes-de-dados.md).

---

## Proposta de confiança (95%) e recorte

- **F45 [FATO]** Eleno propôs, na sala: conferência dos dados processados no primeiro momento; se a confiabilidade passar de 95%, deixar automático, com possibilidade de reverter. — *00:14:44–00:15:54.*
- **F46 [FATO]** Quem avalia a dinâmica não recusou o limiar; ancorou a automação ao “nível de confiança do que a solução oferece”. — *00:14:44.*
- **F47 [FATO]** Eleno disse que atacaria primeiro o Flash (maior tempo), depois olharia documentação do Flash e do ERP. — *00:15:54.* Alinha-se a F29.
- **H11 [HIPÓTESE]** Humano no loop até evidência de acerto ≥ 95% das linhas, depois execução automática com reversão, é o rollout adequado. — *Fala na sala (F45); não é política da Morada. Grill Q4 (decisão D12) rejeita ler isso como execução automática que pula conferência.*
- **H12 [HIPÓTESE]** Dá para pré-preencher o ciclo a partir do contrato de adesão/admissão, com conferência antes de executar. — *Eleno 00:14:44; quem avalia a dinâmica condicionou à confiança.*
- **H13 [HIPÓTESE]** A dor raiz não é “falta de API”. É planilha como sistema-sombra + digitação atômica no provedor + lote financeiro sem lote congelado. A API Flash existe e não é usada (F39). — *Leitura do candidato a partir de F21–F29 e F39.*
- **H14 [HIPÓTESE]** Isolar a integração da camada do cliente evita impacto nos produtos de cliente (MIA, SALES, IAGO no guia). — *Extensão de F40; os nomes dos produtos não foram citados na sessão de benefícios.*
- **H15 [HIPÓTESE]** Carga unidirecional (arquivo ou imagem) + conferência já prevista no recorte 1 basta para o primeiro ciclo; sync bidirecional (dois escritores) não é necessário para validar Flash + calendário — e reabre o sistema-sombra (H03). — *Pedido de extração vs D11; ver decisão D15 e [PRD-04](../prd/PRD-04-carga-da-planilha.md).*
- **H17 [HIPÓTESE]** Anexar o comprovante do boleto no bucket (nome, data, **onde**) reduz retrabalho na conferência do desembolso, comparado a procurar o arquivo só no e-mail. — *Pedido de recorte Banco (D21); validar no 1º ciclo em que o objeto existir.*
- **H18 [HIPÓTESE]** Ver **quem conferiu** e **quem anexou comprovante** (ator interno, data, objeto) reduz caça no toast e na caixa de entrada. A entrevista **não** pediu log nominativo. Chrome dump-list **Histórico da esteira** sob o wizard está **fora** (recorte de UI). — *Pedido de recorte da esteira; card retirado; validar no 1º ciclo o que ainda falta ver.*

### Integração do provedor atual (não da entrevista)

Três afirmações distintas. Misturá-las (“decisão: sem webhook”) é **erro de etiqueta**: rejeita o canal e parece rejeitar o desenho.

- **F49 [FATO DE DOCUMENTAÇÃO FLASH — não da entrevista]** O manual da API Flash 2.0 **não publica** webhook, callback nem notificação push de status de pedido ou depósito. [Confirmar Pedido](https://docs.api.flashapp.services/Beneficios/ConfirmarPedido) manda acompanhar via **Buscar Pedido**. Fonte: [flash.md](../integracoes/flash.md). **Não** é fala do financeiro nem de quem avalia a dinâmica. **Não** invalida a espera do retorno (D27): restringe só o **canal** disponível no provedor atual.
- **H19 [HIPÓTESE DE CANAL — invalidada só como canal, F49]** O mecanismo imaginado para avisar que o retorno (taxa + boleto) chegou era **webhook**. Isso era o **canal**, não o desenho de produto. F49 invalida webhook **no Flash 2.0**. A espera do retorno (D27) permanece. Tratar “webhook” como atalho informal a apagar, ou escrever “sem webhook” como rejeição da ideia, é erro de etiqueta.
- **H20 [HIPÓTESE SUA — guia §04]** Conferir **todos** os beneficiários que vão receber (o conjunto do mês, ou o que vai nesta recarga) **antes** de **Confirmar envio ao Flash** produz **um** pedido → **um** boleto → **uma** liquidação Omie e **evita taxa extra por operação**. Cada parcial/pedido/boleto adicional soma outra parcela Flash (`totalFee` daquele pedido) + Omie R$ 1,99 × boleto. **Não** é fato da entrevista: a sala **não** disse “confirme todos e um boleto só”. O candidato **nem perguntou se existem taxas** (P11). **Não** mata D22: 1-a-1 / bulk **permanecem possíveis**. Caminho feliz **recomendado** para não pagar taxa extra. Guia: “identifique o que é **hipótese sua**”; “**premissas adotou**” = assumo que a taxa por pedido/boleto existe na operação Morada — isso é meu (candidato), não do financeiro. Fórmulas Flash soma das `fee` e Omie R$ 1,99 = **fato de documentação do provedor**, não da sala. Validar no 1º ciclo com P11.

---

## Decisões de recorte (além do formato)

- **D03 [DECISÃO]** Não definir stack. PRD descreve comportamento; SRD descreve capacidades, entidades, invariantes e portas. Flash e Omie entram como sistemas atuais que satisfazem portas, não como destino da proposta. — *Guia + premissa deste repositório.*
- **D04 [DECISÃO]** Integrações ficam isoladas da camada do cliente. — *quem avalia a dinâmica F40, assumido como restrição.*
- **D05 [DECISÃO]** A capacidade nova pode viver no backoffice existente (identidade @morada, área, nível de carga). — *quem avalia a dinâmica F42.*
- **D06 [DECISÃO]** Recorte do candidato: atacar primeiro o lançamento no provedor (Flash), não o ERP. — *Eleno F47 + gargalo F29.*
- **D07 [DECISÃO]** Conferência humana no recorte 1; 95% da sala não é SLA da Morada. Payload operacional: D20 (só conferidas avançam). — *F45–F46 + grill Q4; D12 supercedida em parte por D20.*
- **D08 [DECISÃO]** Discovery não fecha valores de benefício, faixas em reais nem taxas do provedor: pendência ou premissa explícita, nunca cifra inventada. Quais *slots* a operação usa está em D16; canal do ônibus está em D19 (P06 fechada); `name`/`benefitId` e as não recarregadas seguem P07. — *Este inventário; ver valores diário/faixas/Flexível/VT seed só no proto, identificadores Flash e taxa (P01–P05, P07, P11).*
- **D09 [DECISÃO]** Grill Q1: não promover “ônibus fora do Flash” a invariante nem omitir CLT-ônibus. **Canal supercedido por D19:** assumimos depósito Flash por recorte (o financeiro não disse). O que D09 ainda vale: a **escolha** ônibus XOR auxílio gasolina existe; conferência não omite a pessoa. Ônibus **não** fica **a conferir** só por canal desconhecido; pode ficar por cadastro ou outro motivo. — *Grill rodada 1, Q1; canal fechado em D19.*
- **D10 [DECISÃO]** O lote **antecipa** a competência: o dinheiro sai antes do mês. Premissa de **política** (não fato da sala), a confirmar com o financeiro: corte cinco dias úteis antes do início da competência; quem está ativo no corte leva o mês financiado, sem pró-rata automático. Multibenefícios = valor diário × dias úteis nacionais do mês que será creditado. — *Grill rodada 1, Q2.*
- **D11 [DECISÃO DE RECORTE]** O perfil de benefício no backoffice é o cadastro-mestre da elegibilidade (escrita). A planilha, se o financeiro ainda quiser o artefato, é **gerada** a partir do backoffice (exportação/visão, não escritora). Premissa reversível: **não foi perguntado na sala**; o financeiro pode continuar vivendo no Excel; quem avalia a dinâmica e o financeiro **não** concordaram com isso. Campos de elegibilidade no backoffice (pendência P18) seguem abertos. — *Grill rodada 2, Q3 (resposta livre).*
- **D12 [DECISÃO DE RECORTE — SUPERSEDEDA EM PARTE por D20]** Grill Q4: conferência não some; 95% da sala não é trava nem SLA; taxa de automatização = **conferida (automática)** / ciclo (**com correção** no denominador). A leitura “zero **a conferir** bloqueia o mês inteiro” **cai**. Payload e execução: **D20**. — *Grill rodada 2, Q4; recorte posterior D20.*
- **D13 [DECISÃO DE RECORTE]** Recorte 1 **não** move o ok dos diretores para antes de confirmar o Flash. O financeiro executa o provedor com o payload **conferido** (D20), **sem** esperar diretor. Diretores permanecem no **pagamento** (boleto/banco), com consolidado de pagamento identificável no e-mail — não uma planilha solta. — *Grill rodada 3, Q5.*
- **D14 [DECISÃO DE RECORTE]** Objeto do ok dos diretores = **pagamento**. Objeto do financeiro = **lote de crédito conferido**. Diretor não opera linha a linha. — *Grill rodada 3, Q6.*
- **D15 [DECISÃO DE RECORTE]** Recorte 1 da **carga** não força abandonar o Excel no dia 1. A planilha de controle **continua o hábito de preenchimento** (fato F21). O sistema **lê** para pré-preencher — ficheiro **ou** imagem da mesma grade (adaptador da porta `PlanilhaDeControle`, não outro produto). Dias úteis: calendário oficial manda; se a leitura trouxer coluna de dias, **compara** e mostra divergência — a planilha não sobrescreve o calendário em silêncio. **Gerar planilha** devolve arquivo (sistema → ficheiro) se ainda precisarem do Excel. Sincronização bidirecional (dois escritores) é recorte **posterior**. D11 continua o destino da escrita do perfil; D15 é o recorte de *como* a planilha entra. **Não** fingir que o financeiro concordou em matar o Excel. — *Extensão honesta de D11, depois do grill; [PRD-04](../prd/PRD-04-carga-da-planilha.md).*
- **D16 [DECISÃO DE MAPEAMENTO]** A regra da entrevista (F08–F13) fecha **quais slots a operação usa**, não o `name`/`benefitId` no CNPJ. Os três *slots* do catálogo da empresa: (1) **Multibenefícios** — CLT, sempre, dias úteis; (2) escolha CLT **Auxílio gasolina XOR Cartão de ônibus** — ambos depósitos Flash (D19); (3) **Flexível** — PJ, valor fixo. Uma pessoa CLT acerta dois depósitos: Multi + (gasolina \| ônibus). Ônibus é tipo Flash no lado da escolha, não um 4º mistério. **Tensão com F14 “usamos 3 de 5”:** os três *slots* são esses; se gasolina **e** VT estiverem habilitados no CNPJ, isso são **4 SKUs**. Não fingir que o GET rodou. As outras habilitadas e não recarregadas seguem desconhecidas (hipótese Cultura/Saúde; 5−3 vs 5−4 depende de contar slot ou SKU). GET ainda precisa dos identificadores (P07). **Não** é execução do GET. — *Derivada da regra F08–F13 + D19; tabela em [flash.md](../integracoes/flash.md).*
- **D17 [DECISÃO DE COPY]** A etapa 1 do ciclo e a ação visível ao operador são **confirmar benefício**. Não usar “confirma crédito” / “confirmar crédito” no chrome. O domínio permanece: **conferência** das linhas do **lote congelado** (crédito ao colaborador). — *Pedido de copy pós-grill; [inferencias-em-grill.md](./inferencias-em-grill.md).*
- **D18 [DECISÃO DE PROTÓTIPO]** Cifras da semente ficam no proto + [proto-semente.md](../proto-semente.md). **Não** são política no PRD (P01, P02, P05). Diário de Multibenefícios no proto **varia por pessoa**; H01 segue hipótese. Valor mensal de cartão de ônibus no proto é semente (PREMISSA), não entrevista. — *Grill Q1–Q2; não é fato do financeiro.*
- **D19 [DECISÃO DE RECORTE / PREMISSA]** Cartão de ônibus **também** é depósito Flash (mesmo canal do auxílio gasolina), XOR na escolha CLT, para o ciclo poder depositar. O financeiro **não** disse Flash para ônibus. Fecha **P06** por recorte — **não** é GET. Identificador `name`/`benefitId` segue P07 (hipótese: **Vale-transporte**; alternativa: **Auxílio Mobilidade**). Ônibus **não** fica **a conferir** só porque o canal era desconhecido; pode ficar por cadastro incompleto ou outro motivo. Supercede o canal aberto de D09. — *Pedido de recorte pós-grill; honestidade no discovery.*
- **D20 [DECISÃO DE RECORTE / INVARIANTE DO LOTE]** O wizard só encaminha às etapas seguintes as linhas **conferidas** (operador confirmou — D23). **A conferir** permanece na lista e **não** entra no pedido Flash, na espera do retorno daquele pedido, no Omie, nos diretores nem no banco. O ato que marca conferida **abre** a parcial no resumo Flash (D24); **Confirmar envio** dispara o provedor. — *Invariante de lote; não é fato da entrevista.*
- **D21 [DECISÃO DE RECORTE]** Depois dos dois oks de **pagamento**, o financeiro anexa o **comprovante do boleto** na etapa Banco. O objeto vive na porta **armazenamento de comprovantes** (`ArmazenamentoDeComprovantes`): gravar, ler, expirar. Hospedagem lógica = **bucket de comprovantes**. Sistemas atuais possíveis — **adaptadores, sem escolha neste recorte**: Amazon S3 e DigitalOcean Spaces (compatível S3). Sem conta de nuvem inventada. Isolado da camada do cliente (fato F40 / D04). O e-mail **não** é o lugar do arquivo. Distinto de `anexar_documento_de_pagamento` na porta financeira (boleto no lançamento ERP). — *Pedido de recorte pós-proto Banco; não é fato da entrevista.*
- **D22 [DECISÃO DE RECORTE]** A competência admite **várias parciais**. Cada uma percorre **Confirmar benefício → Flash → Boleto → Omie → Diretores → Banco**. **Fato:** o financeiro digitava pessoa a pessoa no painel (F23, F29). A entrevista **não** disse “um pedido por mês”. **Hipótese (tempo):** o gargalo é a digitação, não o número de pedidos (F29). **Hipótese sua H20 (taxa):** minimizar N pedidos/boletos evita taxa extra — **não** é fato da sala; **não** revoga parciais. **Decisão:** 1 colaborador ativo conferido = 1 parcial; N conferidas em lote = 1 parcial de N (acelerador do mesmo ciclo). Histórico **acumula**. Flash desta caminhada = só quem entra nela. Banco lista todas. Beneficiários = só **ativos na empresa**. Supercede a leitura “um pedido por competência” que o PRD-03 tinha colado em P27 (P27 real = CNPJ/unidades). — *Pedido de recorte pós-proto; não é fato da entrevista.*
- **D23 [DECISÃO DE RECORTE]** Enum de situação da linha = **`a conferir`** \| **`conferida`**. **Fato:** Eleno falou em “um confere”, conferências e confirmação dos dados (F45). O financeiro **não** nomeou estados. **Hipótese:** 95% → automático (F45/H11). **Decisão:** recorte 1 sem **conferida (automática)**; editar não confere; sem “no provedor a confirmar”, divergência de calendário ou correção como situação. “A informar” é valor. Supercede o zoo de quatro chips do recorte anterior. — *Pedido de recorte; fonte: transcrição 00:14:44.*
- **D24 [DECISÃO DE RECORTE / COPY DE LOTE]** Dois tempos, um grupo. **1.** **Marcar como conferidos** / **Conferir** marca **conferida**, tira da listagem 1 e **leva ao resumo Flash** (etapa 2). Title: **Marca conferido e abre o resumo Flash**. **2.** **Confirmar envio ao Flash** dispara o provedor. A barra de Beneficiários continua com **um** botão — o segundo clique vive na etapa Flash, não na lista. **Não** mostrar **Lançar no Omie** na barra. D20 permanece. A entrevista **não** descreveu os dois tempos (F23, F29). Supercede a leitura “conferir = envio no mesmo clique”. — *Pedido de recorte do caminho em grupo; não é fato da entrevista.*
- **D25 [DECISÃO DE RECORTE]** Eventos `conferiu` e `anexou comprovante` existem no contrato: ator = identidade interna, quando, objeto (beneficiários da parcial **ou** nome do comprovante). O beneficiário **não** é o ator de “conferiu”. Eventos acumulam. Outros tipos de auditoria do contrato **não** entram nesses dois tipos. A entrevista **não** pediu log nominativo (H18). Chrome **Histórico da esteira** (lista compacta sob o wizard) está **fora** — recorte de UI, não “entrevista pediu o card”. Atribuição visível de comprovante: **Quem anexou** em cada arquivo na etapa Banco. Proto: sessão = Operador interno (`financeiro@morada`) — **DECISÃO DE PROTÓTIPO**, não fato de login. — *Pedido de recorte da esteira; chrome do card retirado depois.*
- **D26 [DECISÃO DE RECORTE / INVARIANTE DE GRUPO]** A **parcial caminha junta**. Quem passou da etapa N **espera** a ação da etapa N+1 com o mesmo grupo. Não se parte a parcial no meio da etapa. Conferidos da etapa 1 ficam no resumo Flash até **Confirmar envio**; depois o grupo inteiro espera o retorno na etapa Boleto; Omie, diretores e banco operam esse mesmo conjunto. D22 (várias parciais no mês) permanece: outra parcial é outro grupo. — *Pedido de recorte do caminho em grupo; não é fato da entrevista.*
- **D27 [DECISÃO DE PRODUTO]** Depois de enviar ao Flash, o financeiro **espera o retorno** (taxa + boleto) **antes** de Omie. Esse é o desenho da etapa **Boleto**. Ideia do candidato; **não** foi invalidada por F49. Chrome: **espera do retorno deste pedido**. Grupo (D26): o mesmo conjunto espera junto. — *Desenho de comportamento; não é fato da entrevista.*
- **D28 [DECISÃO DE PORTA — não consulta de produto]** Como o provedor atual não oferece webhook (F49), a implementação da espera é **consulta do pedido** (`consultar_pedido`; hoje BuscarPedido / poll no `orderId`). Substitui só o **canal**. Não substitui a ideia de esperar o retorno (D27). Sem webhook inventado no proto. Recorte 1: o poll é **automático**. — *Adaptação da porta `ProvedorDeBeneficios`; não foi perguntado se a espera cai.*
- **D29 [DECISÃO DE PRODUTO]** Na etapa **Boleto** (etapa 3 — não na etapa Flash), o operador dispara **a mesma** `consultar_pedido` (mesmo pedido / `orderId`, mesma porta) quando a espera automática falha, esgota (timeout) ou o estado no provedor **diverge** do que a tela mostra. Não é segunda integração. Não inventa webhook. Chrome: **Atualizar retorno**. Docs podem dizer GET como o HTTP do adaptador Flash atual (Buscar Pedido). A observância pode disparar o mesmo verbo se o item estiver na fila; no recorte 1 o botão visível é o da etapa 3. D27 (esperar antes de Omie) permanece. D28 (poll automático) permanece. — *Pedido de produto; não é fato da entrevista.*

As anotações Gemini listam a automação integrada ao backoffice com conferência prévia em “Decisões”, mas o próprio resumo marca “precisa de mais conversa”. Por isso o desenho completo da solução **não** é decisão da sala — só as restrições D04–D07. D09–D14 são decisões do candidato no grill, não da entrevista. D15 estende D11 depois do grill (carga sem matar o Excel). D16 é mapeamento da regra já dita, não chamada de API. D17 é copy da etapa 1 (**confirmar benefício**), não da entrevista. D18 é semente do proto (R$ por pessoa, fora do PRD). D19 fecha P06 (ônibus = Flash) por recorte, não por fala do financeiro. D20 é invariante de payload (só conferidas avançam). D21 é o comprovante no bucket. D22 é parciais (**não** um pedido obrigatório; H20 só recomenda conferir o conjunto antes do envio). D23 é o enum **a conferir** / **conferida**. D24 é dois tempos (resumo Flash → Confirmar envio). D25 é a capacidade de eventos nominativos (`conferiu` / `anexou comprovante`) — **sem** o card dump-list sob o wizard. D26 é o grupo que espera junto. D27 é a espera do retorno (desenho da etapa Boleto). D28 é o canal `consultar_pedido` (poll automático). D29 é o disparo **manual** da mesma porta na etapa 3. F49 = fato da API (manual sem webhook). H19 = webhook era o canal imaginado, não a ideia a apagar. H20 = hipótese sua (guia §04): conferir todos os que vão receber antes de um envio evita taxa extra — **não** é fato da sala; P11 = a entrevista **nem perguntou** se existe taxa. Grill **encerrado** na rodada 3.

---

## Pendências

Itens que a entrevista não fechou. O plano de produto já antecipou vários; nenhum recebe valor chutado.

### Política e valores

- **P01 [PENDÊNCIA]** Valor diário do crédito CLT de alimentação + refeição (e se é o mesmo para todo CLT).
- **P02 [PENDÊNCIA]** Valor de cada faixa de combustível (5 km, 10 km, região metropolitana).
- **P03 [PENDÊNCIA]** Limites exatos das faixas (onde cai 7 km; inclusivo/exclusivo; unidade de medida).
- **P04 [PENDÊNCIA]** Como a distância é medida e qual o local de trabalho de referência (um endereço? vários?).
- **P05 [PENDÊNCIA]** Valor do Flexível PJ e se varia por pessoa ou é único para todos os PJ.
- **P06 [FECHADA — D19]** Cartão de ônibus: **premissa de recorte** = depósito Flash (XOR gasolina). Não é GET. O financeiro não disse o canal. Identificadores seguem P07. — *Era pendência de propósito (D09); fechada para o ciclo depositar.*
- **P07 [PENDÊNCIA]** GET ainda precisa (slots em D16; canal do ônibus em D19): `name`/`benefitId` de Multibenefícios, Auxílio gasolina, Cartão de ônibus e Flexível; quais das 5 habilitadas no CNPJ **não** são recarregadas (hipótese Cultura/Saúde — a conta 3 vs 4 SKUs não foi medida); alimentação e refeição é um `benefitId` ou dois; auxílio gasolina = Auxílio Mobilidade?; ônibus = Vale-transporte?; Flexível PJ = Saldo Flexível?. GET **não** foi executado. Até lá, UI: regra da sala na primeira linha; equivalente Flash **a confirmar** na segunda. Bloquear as não recarregadas só depois da lista real. Catálogo Flash > 5 nomes oficiais — ver [flash.md](../integracoes/flash.md).
- **P23 [PENDÊNCIA]** Depois da admissão, o CLT pode trocar auxílio gasolina ↔ ônibus? Ou só endereço/faixa via e-mail?

### Calendário e meio do mês

- **P08 [PENDÊNCIA]** Calendário real do corte (o dia em que montam, lançam, geram boleto, aprovam e pagam). O *modelo* antecipação + cinco dias úteis antes é decisão D10, a confirmar com o financeiro — não medido na sala.
- **P09 [PENDÊNCIA]** Confirmar com o financeiro a premissa D10: admissão após o corte cai só na competência seguinte (sem pró-rata). A sala não disse.
- **P10 [PENDÊNCIA]** Desligamento: D10 inclui ativos no corte; exclusão entre corte e crédito é evento de conferência. Estorno após crédito segue aberto (P24).
- **P12 [PENDÊNCIA]** Além dos feriados nacionais, entram estaduais/municipais? A sessão disse só nacionais (F30).

### Dinheiro, ERP e governança

- **P11 [PENDÊNCIA — guia: ponto pendente]** A entrevista **não perguntou** se há taxa. Três perguntas abertas, nenhuma fato da sala: (1) **existe** taxa Flash e/ou Omie na operação Morada de benefícios? (2) **quem paga** na Morada e se entra no ERP? (3) **fatiar** o mês em N pedidos/boletos gera **N taxas**? **Fato de documentação do provedor (não da entrevista):** Flash devolve `fee` / `totalFee` / `depositFees` (soma das `fee` **por pedido**; GET não executado). Omie.CASH Completa publica **R$ 1,99** por boleto liquidado (nota, não API de contas a pagar). **Decisão de UI:** soma Flash + Omie na tabela **Flash | Omie | visível**, **por pedido**. **PREMISSA DE PROTÓTIPO:** GET `depositFees` não executado → proto simula **R$ 1,00** Flash no retorno (**não** é fato da entrevista). **H20** (hipótese sua) assume (1) e (3) = sim — premissa do candidato porque a entrevista não perguntou.
- **P13 [PENDÊNCIA]** Lista completa dos oito departamentos (só três foram nomeados).
- **P14 [PENDÊNCIA]** Número exato de colaboradores e mix CLT/PJ (73 é ordem de grandeza).
- **P15 [PENDÊNCIA]** Quem são os dois diretores; aprovação paralela ou em série; o que acontece na recusa; há substituto.
- **P16 [PENDÊNCIA]** Ordem real: pedido Flash → depósitos → boleto → ERP → e-mail → banco → “processar no Flash”.
- **P22 [PENDÊNCIA]** Baseline: tempo de lançamento no Flash, taxa de erro, cycle time até o crédito — não medidos.
- **P26 [PENDÊNCIA]** Nome canônico do ERP (OME vs Omie) e do backoffice (“morador”).

### Dados, identidade e APIs

- **P17 [PENDÊNCIA]** A planilha guarda endereço? Eleno listou endereço; o financeiro confirmou o bloco com “isso” e detalhou outros campos.
- **P18 [PENDÊNCIA]** O backoffice já tem endereço, regime, modalidade e faixa, ou só e-mail / área / nível de carga? D11 escolhe o *dono* da escrita; D15 descreve a carga; nenhum dos dois inventa os campos. Inventário campo a campo (fato vs palpite): [`fontes-de-dados.md`](./fontes-de-dados.md).
- **P29 [PENDÊNCIA]** Mapeamento estável das colunas da planilha vigente (F22 lista um bloco; P17 endereço ambíguo) e qualidade mínima da imagem se o meio for captura. Sem esse mapa, a extração falha visível — não chute de célula.
- **P19 [PENDÊNCIA]** Compliance de usuário de sistema no Flash (pergunta feita, sem regra).
- **P20 [PENDÊNCIA]** Contrato real da API Flash: autenticação, um depósito por colaborador+modalidade, alteração após confirmação, estorno/reversão.
- **P21 [PENDÊNCIA]** O ERP atual expõe porta de contas a pagar com rateio por departamento? A sala não confirmou API.
- **P24 [PENDÊNCIA]** Reversão depois de executar no provedor: o Flash permite cancelar pedido confirmado?
- **P25 [PENDÊNCIA]** Tratamento de CPF no provedor vs e-mail interno (LGPD, papéis admin).
- **P27 [PENDÊNCIA]** Um CNPJ / uma unidade ou várias (afeta região metropolitana e feriados).
- **P28 [PENDÊNCIA]** Papel da Hiorrana na dinâmica (consta no convite, não na conversa).
- **P30 [PENDÊNCIA]** Prazo de expiração/retenção do comprovante (a porta tem `expirar`; o número é jurídico, no mesmo espírito de P25). Qual adaptador ligar na implementação (Amazon S3 vs DigitalOcean Spaces vs equivalente) — o recorte **desenha os dois** e não escolhe (D21).
- **P31 [PENDÊNCIA]** A entrevista **não** perguntou sobre **fechamentos parciais** nem se os dados de uma parcial **mudam depois** (valores, pessoas, departamentos). Prioridade **abaixo** do recorte 1. D22 (várias parciais) permanece **decisão de recorte**, não fato.

---

## O que este inventário recusa tratar como fato

1. **Qualquer valor em reais de benefício.** Só existe o exemplo de digitação F24.
2. **Capacidades da API Flash ou do ERP** além de “Flash tem API e não é usada” (F39). Detalhe de depósito, centavos ou pedido imutável é P20/P21, não fato da entrevista.
3. **O resumo Gemini como evidência superior à transcrição.** O resumo comprime e às vezes decide demais (“precisa de mais conversa”). Em conflito, vale a transcrição.
4. **Duração de 60 minutos como fato desta sessão.** O guia prevê ~60 min; a transcrição desta reunião encerra em 00:18:58 (F48). O guia continua válido como formato da dinâmica.
