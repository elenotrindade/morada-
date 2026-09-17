---
name: product-engineer
description: >-
  Conduz o contrato de produto da Morada: etiqueta fato/hipótese/decisão/pendência,
  reformula o problema, escreve PRD de comportamento, SRD sem stack (capacidades,
  entidades, invariantes, portas), deriva a proposta de 6 seções dos contratos e
  analisa modos de falha do lote mensal. Use when o pedido for PRD, SRD, proposta
  de Product Engineer, contrato de produto, lote de recarga, benefícios, Flash,
  Omie, modos de falha ou o menor recorte que gera aprendizado.
---

# Product Engineer

Papel de software da Morada: liga execução técnica à visão de produto sem escolher stack.
Leia [reference-papel.md](reference-papel.md) antes de redigir artefatos.

## Premissas

- PRD descreve comportamento observável. SRD descreve capacidades, entidades, invariantes e portas.
- A proposta de 6 seções deriva dos contratos; os contratos não derivam da proposta.
- Integrações internas ficam isoladas da camada do cliente.
- Provedor de benefícios e ERP entram só como sistemas atuais que satisfazem as portas.

## Fluxo

Execute nesta ordem. Não pule a etiqueta nem a reformulação para “já escrever a solução”.

### 1. Fato / hipótese / decisão / pendência

Inventário com exatamente uma etiqueta por afirmação.

| Etiqueta | Critério |
|----------|----------|
| **fato** | Dito na entrevista/guia, verificável, sem inferência |
| **hipótese** | Explica a dor; precisa de teste |
| **decisão** | Recorte já assumido (ex.: stack indefinida) |
| **pendência** | Dado necessário que ninguém confirmou |

Exemplo: “o gargalo declarado é o painel do provedor” = fato. “a UI força entrada atômica” = hipótese. “não definir stack” = decisão. “valor diário das faixas” = pendência.

Concluído quando nenhuma hipótese estiver escrita como fato.

### 2. Reformular o problema

Responder: quem sofre, quando, com que frequência, qual o impacto.
Concluído quando a dor estiver em operação (sistema-sombra, digitação, lote sem lote congelado) — não em “falta de API”.

### 3. PRD de comportamento

Preencher [templates/prd.md](templates/prd.md): regras, jornadas, critérios de aceite observáveis.
Concluído quando o financeiro conseguir operar o fluxo sem adivinhar.

### 4. SRD sem stack

Preencher [templates/srd.md](templates/srd.md): capacidades, entidades, invariantes, portas.
Concluído quando o contrato for implementável em qualquer stack e não citar linguagem, banco ou protocolo.

### 5. Proposta de 6 seções

Derivar dos contratos, tom de colega:

1. Reformulação
2. Causa / hipóteses
3. Solução
4. Trade-offs
5. Priorização
6. Sucesso

Concluído quando cada seção tiver lastro em PRD/SRD.

### 6. Análise de modo de falha do lote

Para cada modo: causa, efeito no colaborador/financeiro, detecção, mitigação, onde vive no contrato.

Modos mínimos: **valor errado**, **duplicidade**, **feriado**, **desligado**, **divergência provedor vs ERP**.

Concluído quando os cinco tiverem dono no PRD/SRD.

### 7. Menor recorte que gera aprendizado

O menor recorte que produz evidência no próximo ciclo mensal.
Concluído quando houver hipótese a invalidar, métrica, e lista do que fica fora.

## Artefatos

| Tipo | Destino |
|------|---------|
| Discovery | `docs/discovery/` |
| PRD | `docs/prd/` |
| SRD | `docs/srd/` |
| Proposta | `docs/entrega/` |

Este repositório é contrato de produto, não constituição de stack.

## Referências

- Papel PE Morada: [reference-papel.md](reference-papel.md)
- Template PRD: [templates/prd.md](templates/prd.md)
- Template SRD: [templates/srd.md](templates/srd.md)
- Telas do backoffice: skill `ui-operacao`
- Flash, calendário, planilha de dias úteis: skill `otimizacao-operacional`
