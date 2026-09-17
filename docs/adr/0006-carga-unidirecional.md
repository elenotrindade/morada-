# Carga unidirecional no recorte 1

A sala não combinou matar o Excel (D11 é premissa, não acordo). Forçar cadastro-mestre no dia 1 quebra o hábito que o financeiro já tem (fato F21) e não é o gargalo declarado (fato F29 = Flash).

**Decisão:** recorte 1 da carga = **unidirecional** planilha → sistema para pré-preencher (arquivo **ou** imagem da mesma grade). Calendário oficial manda em dias úteis; coluna de dias na planilha **compara**, não sobrescreve em silêncio. Botão **Gerar planilha** = sistema → arquivo, se ainda precisarem do Excel. Imagem é adaptador da porta **planilha de controle** (`PlanilhaDeControle`), não outro produto.

**Rejeitado neste recorte:** sincronização bidirecional (um botão que deixa sistema e planilha escritores iguais). Dois escritores reabrem o sistema-sombra (hipótese H03). A operação `sincronizar` existe no contrato da porta para não nascer outro nome depois; a UI do recorte 1 não a oferece.

Contrato: [PRD-04](../prd/PRD-04-carga-da-planilha.md), [SRD-01](../srd/SRD-01-contratos-de-capacidade.md#mapeamento-produto--porta). Destino da escrita do perfil: [ADR 0003](0003-perfil-escreve-planilha-exporta.md).
