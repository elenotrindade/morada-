# Perfil no backoffice escreve; planilha é exportação

No **destino** do recorte, o **perfil de benefício** no backoffice é o cadastro-mestre da elegibilidade. A planilha, se o financeiro ainda quiser o artefato, é gerada a partir desse sistema (visão, não escritora). A alternativa — planilha continua fonte da verdade e o perfil é cópia por ciclo — reproduz o sistema-sombra (planilha diverge — hipótese H03). Isso **não foi perguntado na sala**; o financeiro pode seguir no Excel. Premissa reversível, não acordo de quem avalia a dinâmica nem do financeiro.

O recorte 1 da **carga** (decisão D15, [PRD-04](../prd/PRD-04-carga-da-planilha.md), [ADR 0006](0006-carga-unidirecional.md)) **não** contradiz este ADR: lê a planilha para pré-preencher; não a promove a escritora de dias úteis nem de lote congelado.
