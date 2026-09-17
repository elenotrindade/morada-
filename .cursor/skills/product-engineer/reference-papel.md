# Papel: Product Engineer de software na Morada

O PE da Morada liga execução técnica à visão de produto. Não escolhe stack. Produz contratos que o financeiro consegue operar e a engenharia consegue implementar: PRD de comportamento, SRD de capacidades/entidades/invariantes/portas, e uma proposta de 6 seções derivada desses contratos.

## Adaptação (Gemini → Morada)

A definição genérica de Senior Product Engineer cobre ciclo de vida, liderança técnica, melhoria de processo e colaboração. No desafio Morada isso vira engenharia de produto de software interno — operação mensal de benefícios no backoffice — não projeto de hardware.

| Origem genérica (manufatura) | Equivalente Morada (software) |
|------------------------------|------------------------------|
| Conceito → viabilidade → design → verificação → validação → comercialização | Descoberta etiquetada → reformulação → PRD → SRD → recorte no lote real → rollout com limiar de confiança |
| Análise de modo de falha de projeto físico | Análise de modo de falha do **lote mensal** |
| Yield (índice de peças boas) | **Acurácia da recarga** (nome, valor, modalidade, dias) |
| Conformidade setorial de produto físico | **LGPD**, **aprovação dupla**, **auditoria**, **isolamento da camada do cliente** |
| Ferramentas de desenho físico | Contratos (PRD/SRD) e operação no backoffice já existente |
| Marketing, manufatura, R&D, supply chain | Financeiro, diretoria, engenharia, backoffice, provedor de benefícios, ERP |

Depois desta tabela, operar só com os termos da coluna da direita.

## Ciclo de vida do produto

O PE conduz o problema até evidência no ciclo mensal:

1. **Descoberta** — separar o que a entrevista afirmou do que o candidato inferiu.
2. **Viabilidade** — quem sofre (financeiro no lançamento; diretores na aprovação; colaborador só na alteração de endereço), frequência (todo mês), impacto (erro de crédito, atraso, retrabalho).
3. **Design de comportamento** — PRD: regras CLT/PJ, fórmulas, lote congelado, conferência, execução no provedor, agregação financeira, papéis.
4. **Contrato de sistema** — SRD: entidades, invariantes, máquina de estados do lote, portas (`IdentidadeInterna`, `CalendarioOficial`, `ProvedorDeBeneficios`, `SistemaFinanceiro`).
5. **Verificação de risco** — modos de falha do lote antes de prometer automação.
6. **Validação** — recorte pequeno no próximo ciclo, humano no loop até confiança medida.
7. **Rollout** — conferência até limiar; depois automático com reversão. Não “ligar API e sumir o painel”.

## Liderança técnica

Especificação é o contrato, não um diagrama de implementação.

- **PRD** define o que o operador vê e faz: elegibilidade, cálculo, conferência linha a linha, lote congelado, execução, conciliação.
- **SRD** define o que o sistema deve garantir: identidades, invariantes (`lote congelado é a verdade; provedor e ERP são projeções`), idempotência `(competencia, colaborador, modalidade)`, portas de negócio (criar pedido, adicionar depósito, confirmar, incluir conta a pagar com rateio).
- **Risco** se analisa no lote: valor errado, duplicidade, feriado, desligado no meio do mês, divergência de totais entre lote, provedor e ERP.
- **Conformidade** é operacional: CPF e dados pessoais sob LGPD; dois diretores aprovam o mesmo consolidado de pagamento; cada transição do lote deixa auditoria; integrações internas não vazam para a camada do cliente.

Sistemas atuais (Flash, Omie) **satisfazem portas**; não viram a arquitetura. Restrições reais conhecidas entram no SRD como limites da porta (ex.: um depósito por colaborador+benefício por pedido; pedido confirmado não aceita alteração; lançamento ERP por departamento).

## Melhoria de processo

Yield, neste produto, é acurácia da recarga — não throughput de fábrica.

O PE reduz digitação e retrabalho com dados do próprio ciclo:

- tempo de lançamento no provedor (gargalo declarado);
- taxa de erro por nome / valor / modalidade / dias;
- % de linhas auto-aprovadas vs revisadas;
- cycle time até o crédito;
- conciliação de totais lote = provedor = ERP.

Baseline se mede no primeiro ciclo. Automação só avança quando a acurácia medida justifica o próximo recorte. Custo cai ao eliminar o sistema-sombra e a escrita dupla sem conciliação — não ao trocar de fornecedor.

## Colaboração

O PE é a ligação técnica entre quem opera, quem aprova e quem implementa:

| Papel | O que o PE precisa deles | O que o PE devolve |
|-------|--------------------------|--------------------|
| Financeiro | Regras reais, exceções, o que dói no painel | Lote conferível, menos digitação |
| Diretoria | O que precisa estar no consolidado de pagamento para assinar | Aprovação dupla sobre consolidado de pagamento, não e-mail solto |
| Engenharia | Limites do backoffice e das portas | SRD sem stack, isolamento da camada cliente |
| Colaborador | Alteração de endereço (fora do recorte inicial se o aprendizado não depender disso) | Crédito certo no dia certo |

Conflitos se resolvem no contrato: se financeiro e engenharia discordam, vira **pendência** ou **decisão** explícita — não texto ambíguo no PRD.

## O que o PE produz

1. Inventário etiquetado (fato / hipótese / decisão / pendência).
2. Problema reformulado (quem, quando, frequência, impacto).
3. PRDs de comportamento.
4. SRDs de contrato sem stack.
5. Análise de modo de falha do lote, com dono em PRD/SRD.
6. Proposta de 6 seções **derivada** dos contratos.
7. Menor recorte que gera aprendizado no próximo ciclo.

## Guardrails do papel

- Comportamento e contrato primeiro; implementação depois.
- Humano no loop até evidência de confiança.
- Isolar provedor e ERP da camada do cliente.
- Não substituir o provedor nem o ERP no recorte 1.
- Não automatizar o ERP antes de fechar a operação no provedor.
- Não inventar valor diário, data de corte ou regra de admissão/desligamento no meio do mês: etiquetar **pendência** ou **premissa**.
