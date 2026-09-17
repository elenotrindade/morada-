# SRD-XX — [título]

## Premissa do contrato

Este documento é **agnóstico de stack**. Descreve capacidades, entidades, invariantes e portas.
Não citar linguagem, framework, banco, fila, HTTP/REST, vendor de nuvem.

Sistemas atuais (provedor de benefícios, ERP, backoffice, calendário) aparecem só como **implementações conhecidas das portas**, com restrições reais já observadas.

## Capacidades

Cada capacidade é uma operação de negócio, não um endpoint.

| Capacidade | Ator | Pré-condição | Pós-condição | Falhas explícitas |
|------------|------|--------------|--------------|-------------------|
| | | | | |

Detalhar as que este SRD possui:

### [Nome da capacidade]

- Ator autorizado:
- Entrada de negócio:
- Efeito:
- Idempotência:
- Auditoria gerada:

## Entidades

| Entidade | Identidade | Atributos de negócio | Ciclo de vida |
|----------|------------|----------------------|---------------|
| Colaborador | | | |
| PerfilDeBeneficio | | | |
| LoteMensal | competência | | ver máquina abaixo |
| LinhaDoLote | colaborador + modalidade + competência | | |
| … | | | |

### Máquina de estados (quando a entidade for o lote)

`rascunho → em conferência → aguardando aprovação → aprovado → em execução → conciliado | falhou | revertido`

Para cada transição: quem dispara, o que congela, o que se torna imutável, o que a auditoria registra.

## Invariantes

Sempre verdade. Violação = defeito, não “caso especial”.

1. **[Nome]** — enunciado. Como detectar. O que o sistema recusa.
2. Lote congelado é a verdade; provedor e ERP são projeções.
3. Idempotência `(competencia, colaborador, modalidade)` — não há duas recargas efetivas no mesmo trio.
4. …

## Portas

Porta = fronteira de capacidade. Operações no vocabulário do domínio.

### IdentidadeInterna

- Operações: resolver colaborador, regime, departamento, e-mail interno, status.
- Restrições conhecidas do sistema atual (se houver): …

### CalendarioOficial

- Operações: dias úteis nacionais da competência; feriados considerados.
- Restrições conhecidas: …

### ProvedorDeBeneficios

- Operações de negócio: criar pedido, adicionar depósito, cancelar, confirmar.
- Restrições conhecidas do sistema atual (ex.: 1 depósito por colaborador+benefício por pedido; valor em centavos; pedido confirmado não aceita alteração).

### SistemaFinanceiro

- Operações de negócio: incluir conta a pagar com rateio por departamento; consultar lançamento; conciliar totais.
- Restrições conhecidas do sistema atual (ex.: lançamento agregado por departamento, não por colaborador).

## Consistência

- Fonte da verdade:
- Projeções:
- O que acontece se a porta aceitar e a outra rejeitar:
- Reversão: pré-condição, efeito, o que não se apaga (auditoria).

## Qualidade, risco e isolamento

- **LGPD:** quais dados pessoais cruzam quais portas; retenção; quem acessa CPF.
- **Aprovação dupla:** dois diretores sobre o mesmo consolidado de pagamento; o pagamento não avança sem isso.
- **Auditoria:** evento, ator, antes/depois, competência.
- **Isolamento da camada do cliente:** integrações internas não vazam para o produto do cliente.
- **SLAs de negócio:** (crédito no mês, tempo de conferência) — sem SLA de infra.

## Modos de falha (contrato)

| Modo | Invariante ou porta que segura | Detecção | Compensação |
|------|--------------------------------|----------|-------------|
| Valor errado | | | |
| Duplicidade | | | |
| Feriado | | | |
| Desligado | | | |
| Divergência provedor vs ERP | | | |

## Medição

Métricas que este contrato torna observáveis (acurácia da recarga, linhas revisadas, conciliação de totais). Sem telemetria de stack.
