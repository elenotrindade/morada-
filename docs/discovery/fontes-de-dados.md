# Fontes de dados — o que o backoffice já tem vs palpite

Análise da pendência **P18**: quais dados de produto a entrevista **mostra** no backoffice, quais são **prováveis** por ser identidade de RH, e quais só apareceram na planilha, no Flash ou no e-mail. Não fecha P18. Não promove hipótese a fato. Sem cifra. Sem inspeção de tela (o backoffice **não** foi mostrado).

Linguagem: [`CONTEXT.md`](../../CONTEXT.md), [`glossario.md`](./glossario.md). Inventário: [`fatos-hipoteses.md`](./fatos-hipoteses.md). Grill: [`inferencias-em-grill.md`](./inferencias-em-grill.md). Porta: [`SRD-01`](../srd/SRD-01-contratos-de-capacidade.md#51-identidade-interna-identidadeinterna).

## Metadados

| Campo | Valor |
| --- | --- |
| Data | 2026-09-15 |
| Fecha | Não. Expande P18 e a hipótese H10. |
| O que a sala mostrou do backoffice | Login **e-mail `@morada`**, definições de **área** e **nível de carga**. Solução pode viver nessa estrutura (fatos F38, F41, F42). |
| O que a sala **não** mostrou | Regime, escolha de transporte, faixa, CPF, data de admissão, ativo, nome como campo do backoffice. Quem avalia a dinâmica **não** listou campos quando Eleno sugeriu puxar o backoffice para a planilha (H10). |

## Convenção desta tabela

| Coluna | Significa |
| --- | --- |
| **Dado** | Nome canônico do glossário (não copy da sala). |
| **Confirma (fato)** | Dito na entrevista, sem inferir sistema. |
| **Provável no backoffice (hipótese)** | Palpite de identidade de RH / folha / admissão. Precisa de inspeção. |
| **Só planilha / Flash / e-mail** | Onde vimos o dado **sem** o backoffice. |
| **Extração no recorte 1** | `identidade interna` · **Trazer da planilha** · **conferência** · calendário oficial. Não inventa campo. |
| **Confiança** | Quão seguros estamos de **ler este dado da fonte da coluna Extração** sem assumir campo invisível no backoffice. |

**Alta** = a entrevista nomeou o campo naquela fonte. **Média** = a fonte foi nomeada e o campo é típico dela, mas ninguém o listou. **Baixa** = só inferência, ou a fonte certa ainda é P18.

---

## O que é fato (não palpite)

- Existe **backoffice** interno; autentica por e-mail **`@morada`**; tem **área** e **nível de carga** (F38, F41).
- A capacidade nova **pode** viver nessa estrutura (F42, decisão D05).
- Admin do **Flash** é **CPF**, identidade **separada** (F36). Todo colaborador está cadastrado no Flash (F37).
- A **planilha** tem colaboradores, opção de benefício, dias úteis manuais, valores, departamento, nome, regime CLT/PJ (F21, F22, F30).
- Na **admissão**, CLT escolhe auxílio gasolina **XOR** ônibus (sala: vale-combustível XOR cartão de ônibus); o endereço entra aí (F11, F20). **Não** escolhe Multibenefícios. Alteração de endereço hoje é **e-mail** ao financeiro (F19). PJ: Flexível, sem essa escolha.
- São cerca de **73** pessoas e **oito departamentos** no rateio do sistema financeiro (F32, F33, F34).
- Eleno sugeriu puxar dados do backoffice para a planilha; quem avalia a dinâmica **não** enumerou esses campos (H10, P18).

## O que permanece palpite (P18)

O backoffice **não** foi mostrado a guardar **regime**, **escolha de transporte** nem **faixa**. Tratar CLT/PJ ou ônibus/carro como já existentes na identidade interna é **hipótese**, não fato. Até inspeção, esses campos entram por **Trazer da planilha**.

Área do backoffice **não** é o mesmo nome que departamento de rateio. Mapear os dois 1:1 é H10, não F38.

---

## Tabela por dado de produto

| Dado | Confirma (fato) | Provável no backoffice (hipótese + por quê) | Só planilha / Flash / e-mail | Extração no recorte 1 | Confiança |
| --- | --- | --- | --- | --- | --- |
| **Nome** | Planilha lista o nome do colaborador (F22). No Flash, o lançamento **seleciona colaborador** (F23) — há um identificador visível de pessoa. | Identidade de RH costuma ter nome de exibição junto do e-mail. Quem avalia a dinâmica **não** citou nome (H10). | Planilha (F22); seletor do Flash (F23). | **Trazer da planilha**; **conferência** contra o seletor do provedor se o nome divergir. Não assumir campo nome no backoffice. | **média** na planilha (campo dito); **baixa** no backoffice |
| **CPF** | Admin do Flash autentica por CPF (F36). Identidade interna **não** é CPF (F38). | Cadastro no provedor (F37) costuma ser documento da pessoa — típico de folha/provedor, **não** dito como campo do backoffice. | Flash (F36, F37). Planilha **não** listou CPF (F22). | **Conferência** / mapeamento colaborador interno ↔ colaborador no provedor. Sem CPF na planilha confirmada, não chutar célula (P29, P25). | **alta** de que login Flash ≠ e-mail; **baixa** de que o backoffice guarda CPF; **média** de que o provedor identifica a pessoa por documento |
| **E-mail** | Backoffice autentica por e-mail `@morada` (F38). | — (já é fato da identidade). | Não foi campo da planilha na fala F22. | **Identidade interna.** | **alta** |
| **Área** | Backoffice tem definições de área (F38, F41). | — (já é fato). Equivalência área = **departamento** de rateio **não** foi dita (H10). | Planilha tem **departamento** (F22), não a palavra “área”. | **Identidade interna** para área. Rateio Omie usa **departamento** — cruzar na **conferência** até P18 fechar o mapa. | **alta** de que área existe no backoffice; **baixa** de que área = departamento |
| **Departamento** | Oito unidades de rateio no sistema financeiro; exemplos: financeiro, vendas, marketing (F33, F34). Planilha tem departamento (F22). | Se área do backoffice for o mesmo recorte da folha, o rateio já nasceria da identidade (H10). RH/folha costuma ter lotação. Quem avalia a dinâmica não mapeou. Lista completa dos oito: pendência P13. | Planilha (F22); Omie (F25, F34). | **Trazer da planilha** para o lote. Identidade interna só depois do mapa área↔departamento. Omie: departamento + totais, não linha. | **alta** na planilha e no rateio; **média** de que o backoffice já devolve o mesmo recorte |
| **Ativo** | Premissa de política: ativo na data de corte entra no lote (D10) — **não** fato da sala. ~73 pessoas no discurso de volume (F32). | Sistema de identidade com e-mail corporativo costuma distinguir quem ainda é da casa (folha / desligamento). Ninguém descreveu flag ativo no backoffice. | Planilha é listagem de quem entra no ciclo (F21) — não foi dito “inativo”. | **Conferência** (excluir desligado — P10). `listar_ativos_na_data` é **contrato desejado**, não campo visto. Não assumir que a identidade já responde ativo na data. | **baixa** no backoffice; **média** de que a planilha do mês é o conjunto operacional de hoje |
| **Regime** (CLT / PJ) | Política distingue CLT e PJ (F07). Planilha tem modalidade de contratação CLT/PJ (F22). Admissão CLT escolhe transporte (F11). | Folha / tipo de contratação costuma viver no cadastro de RH. Grill: backoffice **não** foi mostrado a ter regime (P18). | Planilha (F22). | **Trazer da planilha** até inspeção. **Não** assumir CLT/PJ no backoffice. | **alta** na planilha; **baixa** no backoffice |
| **Data de admissão** | Há **admissão** como momento da escolha de transporte e do endereço (F11, F20). | Folha e cadastro de RH costumam ter data de entrada. Ninguém citou o campo nem no backoffice nem na planilha (F22 não lista). | Só o **processo** de admissão; sistema de registro não nomeado. | Não extrair no recorte 1. Corte usa **ativo** (premissa D10), não a data. Se aparecer na planilha (P29), **conferência** — não vira pró-rata (P09). | **baixa** |
| **Escolha de transporte** (ônibus XOR auxílio gasolina) | CLT escolhe na admissão: vale-combustível **XOR** cartão de ônibus (F11). Não escolhe Multibenefícios. **D19:** os dois lados são depósito Flash (premissa; o financeiro não disse o canal do ônibus). | Poderia ter sido gravado na admissão no backoffice. **Não** foi mostrado (P18, grill). | Planilha: “opção de benefício” (F21). Admissão (F11). | **Trazer da planilha**. **Não** assumir ônibus/carro no backoffice. | **alta** de que a escolha existe na admissão/planilha; **baixa** no backoffice |
| **Faixa de combustível** / endereço | Três faixas na admissão (F16, F17). Endereço entra na admissão (F20). Mudança: e-mail ao financeiro (F19). | Endereço de RH / admissão poderia estar no backoffice. P18 pergunta isso; a sala não abriu o cadastro. Endereço na planilha ficou ambíguo (P17). | Admissão (F20); e-mail (F19); planilha talvez (P17). | **Trazer da planilha** se a coluna existir e for lida com mapa (P29). Senão o operador informa na **conferência**. Sem mapa, sem palpite de km. | **baixa** no backoffice; **média** na admissão como origem de negócio; **baixa** na planilha (P17) |
| **Modalidade** (copy: Multibenefícios / Auxílio gasolina / Cartão de ônibus / Flexível; ônibus = Flash no lado da escolha, D19) | Morada usa três das cinco do Flash (F14). **D16:** três *slots* = Multi + (gasolina \| ônibus) + Flexível; 4 SKUs se gasolina e VT no CNPJ. Planilha: opção de benefício (F21). Painel: selecionar modalidade (F23). Equivalente `name`/`benefitId` = hipótese H16 até GET (P07). GET **não** foi executado. | Backoffice de RH não precisa guardar o nome do benefício do provedor — deriva de regime + escolha. Não foi citado no backoffice. | Planilha (F21); Flash (F14, F23). Catálogo de produto > 5 nomes. | **Trazer da planilha** (opção) + **política** (deriva). Flash recebe a modalidade já decidida, não a inventa. UI: regra da sala na 1ª linha; equivalente Flash **a confirmar** na 2ª. | **alta** de que a opção está na planilha e no painel; **baixa** no backoffice; **baixa** nos `benefitName` oficiais |
| **Valores** (diário, faixa, Flexível) | Planilha tem valor diário CLT, valor mensal PJ, valor fixo de combustível (F22). Números em reais **não** foram dados (F24 é gesto; D08). | Política versionada, não identidade. Backoffice de área/carga não implica tabela de faixas. | Planilha (F22). Flash recebe o número digitado (F23), não a regra. | **Trazer da planilha** para pré-preencher; cadastro versionado da política. Célula ausente = **a informar**. Sem cifra inventada (P01, P02, P05). | **alta** de que a planilha **tem** colunas de valor; **baixa** de que o backoffice as guarda; cifras em si = **pendência** |
| **Dias úteis nacionais** | Planilha: preenchimento **manual**, feriados nacionais (F30, F22). | Backoffice não foi citado como calendário. | Planilha (hoje). | Recorte 1: **calendário oficial** calcula. Se a carga ler a coluna, **compara** — não sobrescreve (D15). | **alta** de que hoje a planilha é a escritora; **alta** de que o recorte 1 **não** lê isso como verdade; **baixa** no backoffice |
| **Nível de carga** | Backoffice tem nível de carga (F38, F41). | — (já é fato). | Não aparece na planilha falada (F22) nem no Flash. | **Identidade interna**, só para **não** misturar com departamento. **Não** entra no cálculo de benefício até decisão em contrário (SRD-01). | **alta** de que existe; **alta** de que **não** alimenta o lote neste recorte |
| **Oito departamentos** | São oito no rateio; três nomes falados (F33, F34). | Área do backoffice poderia ser o mesmo recorte (H10). Lista canônica: P13. | Planilha (departamento); Omie (oito lançamentos). | Rateio: **departamento** da linha (planilha no recorte 1) → totais. Identidade interna não fecha os oito até o mapa. | **alta** de que o rateio é oito linhas; **baixa** de que o backoffice já expõe os oito nomes oficiais |

---

## Grafo de dependência

```
lote congelado
  └── perfil de benefício
        ├── perfil de identidade          (porta identidade interna)
        │     fato:     e-mail @morada, área, nível de carga
        │     hipótese: nome, ativo, departamento = área
        │     não assumir: regime, escolha de transporte, faixa, CPF, data de admissão
        ├── política de benefícios        (modalidades, fórmulas, tabela de faixas — cifras pendentes)
        └── carga da planilha             (se o backoffice não tiver o campo)
              regime, escolha de transporte, faixa, valores, departamento de rateio

provedor de benefícios (Flash)
  └── CPF (documento no provedor) + nome visível + modalidade + valor

sistema financeiro (Omie)
  └── departamento + totais
        (não colaborador, não CPF, não modalidade linha a linha)
```

Leitura: o lote congelado não nasce de uma planilha nem do Flash. Nasce de um **perfil de benefício**. Esse perfil precisa de **identidade interna** + **política**. O que a identidade **ainda não** mostrou (P18) entra pela **carga da planilha** até prova. O Flash não calcula elegibilidade: deposita. O Omie não vê pessoa: vê departamento.

---

## Recorte 1

**Ler** o que o backoffice já tem com confiança **alta**: e-mail `@morada`, **área**, **nível de carga** se a porta devolver (nível de carga **não** calcula benefício).

**Não assumir** regime CLT/PJ nem escolha ônibus/carro no backoffice até alguém **ver** o cadastro. Até lá: **Trazer da planilha**.

**Não assumir** CPF, faixa, endereço, data de admissão, ativo na data, nem área = departamento.

**Flash:** conferência garante CPF + nome + modalidade + valor **antes** de executar — o backoffice não substitui o cadastro do provedor.

**Omie (recorte 2 / mock):** só departamento + totais.

**Dias úteis:** calendário oficial, não célula, não backoffice.

Isto **não** mata o Excel (D15). **Não** finge que D11 fechou P18.

---

## Fato vs palpite (resumo)

| | Campos |
| --- | --- |
| **Fato no backoffice** | e-mail `@morada`, área, nível de carga; habitat da solução |
| **Fato na planilha** | nome, departamento, regime, opção de benefício, dias úteis manuais, colunas de valor |
| **Fato no Flash** | login admin por CPF; colaboradores cadastrados; lançamento pessoa × modalidade × valor |
| **Fato na admissão / e-mail** | escolha auxílio gasolina XOR ônibus (sala: vale-combustível XOR cartão de ônibus); Multibenefícios não é escolha; endereço na entrada; mudança de endereço por e-mail |
| **Fato de volume / rateio** | ~73 pessoas; oito departamentos no sistema financeiro |
| **Palpite (não ler como cadastro já pronto)** | nome, CPF, ativo, regime, data de admissão, ônibus/carro, faixa/endereço, modalidade Flash, valores, dias úteis, área = departamento — **no backoffice** |

Pendência que isto **não** fecha: **P18** (campos de elegibilidade no backoffice), **P17** (endereço na planilha), **P13** (nomes dos oito departamentos), **P25** (CPF vs e-mail), **P29** (mapa de colunas).
