# Omie — mock / recorte 2

**Fora do recorte 1.** Não implementar cliente. Não escolher stack. Não inventar valores em reais.

O ERP falado na entrevista como OME / “homem” / RP é tratado aqui como **Omie** (hipótese do nome H09 / pendência P26). Recorte 1: o financeiro lança na mão os 8 totais iguais ao consolidado de pagamento, depois da Confirma de retorno do Flash.

Fonte de verdade do portal: [developer.omie.com.br](https://developer.omie.com.br/).  
Lista de módulos: [Lista de API's](https://developer.omie.com.br/service-list/).  
Contas a pagar (referência rasa): [IncluirContaPagar](https://app.omie.com.br/api/v1/financas/contapagar/).

## O que o recorte 2 faria (só isto)

1. **Uma conta a pagar** amarrada ao consolidado de pagamento da competência e ao instrumento do Flash (`billId` / boleto), não 73 linhas de colaborador.
2. **Rateio / distribuição por departamento** nos **8 departamentos** do lote (`distribuicao`: `cCodDep`, `cDesDep`, `nValDep`, `nPerDep`). A entrevista descreve 8 lançamentos; a API também permite um título com array de distribuição — o recorte 2 decide com o financeiro, sem chutar agora.
3. **Idempotência de aplicação** via `codigo_lancamento_integracao` (obrigatório na inclusão; mapa entre o lote interno e o título Omie).
4. **Conciliação** lote Flash = soma departamental Omie = boleto, só depois do pedido Flash conferido. Diretores continuam no **pagamento**, não neste lançamento.

## O que o portal diz (raso)

- APIs SOAP ou JSON; o portal pede a **chave de autenticação do aplicativo**.
- Lista inclui, em Finanças: **Contas a Pagar - Lançamentos** (cria/edita/consulta títulos a pagar, v1) e cadastro auxiliar **Departamentos**.
- Autenticação documentada na Ajuda (ligada ao portal): `app_key` + `app_secret`; só administrador obtém a chave. JSON: POST com `call` + `param`. GET é recusado.
- `IncluirContaPagar` em `https://app.omie.com.br/api/v1/financas/contapagar/`: `codigo_lancamento_integracao`, fornecedor, vencimento, `valor_documento`, categoria, previsão, conta corrente; campo opcional `distribuicao`.
- Departamentos: [ListarDepatartamentos](https://app.omie.com.br/api/v1/geral/departamentos/) (grafia do método na página oficial).
- Rateio na UI: [Distribuindo as Despesas por Departamentos](https://ajuda.omie.com.br/pt-BR/articles/6590614-distribuindo-as-despesas-por-departamentos).

Webhooks existem no portal. Recorte 2 de benefícios **não** depende deles neste mock.

## Tarifas publicadas (Omie.CASH)

**Fato da nota oficial, não da entrevista.** Fonte: [Tarifas da Omie.CASH: Completa e Simplificada](https://ajuda.omie.com.br/pt-BR/articles/6383302-tarifas-da-omie-cash-completa-e-simplificada). A API `IncluirContaPagar` **não** devolve campo de taxa.

| Caminho publicado | Tarifa |
|---|---|
| Liquidação de boleto **emitido** pela Omie.CASH Completa | **R$ 1,99** por boleto liquidado |
| Pagamento de boletos de cobrança / concessionárias / impostos (Completa) | **Gratuito** |
| Emissão / alteração de boleto Completa | Gratuita |

O boleto da operação Morada é o do **Flash**, não um boleto emitido pelo Omie. A tarifa de **liquidação R$ 1,99** é a cifra Omie publicada usada na **taxa visível** (**fato da nota**, não da entrevista). **P11:** a entrevista **não perguntou** se essa tarifa incide na operação Morada, quem paga, nem se N boletos = N taxas. **H20** assume N boletos = N × R$ 1,99 — hipótese sua. Pagamento Completa gratuito e o meio real continuam em P11 / P16.

**Taxa visível (decisão, PRD-03):** contrato = tabela **Flash | Omie | visível**. Chrome = campo **Taxa do provedor** no slip (exemplo `(R$ 1,00 + R$ 1,99) R$ 2,99`). Sem faixa solta. Sem linha de fórmula. Sem inventar % Flash. Sem esconder Omie na coluna Flash.

| | Flash | Omie | visível (soma) |
|---|---|---|---|
| Fórmula | soma das `fee` de cada depósito, devolvida na confirmação (`totalFee`) **daquele pedido** | R$ 1,99 × N boletos desta parcial (liquidação Omie.CASH Completa) | Flash + Omie **por pedido** |
| Desta parcial (exemplo) | R$ 1,00 | R$ 1,99 | R$ 2,99 |

Flash R$ 1,00 no proto = **PREMISSA DE PROTÓTIPO** (GET `depositFees` não executado), não fato da entrevista.

## Política de entrega (mesmo padrão; recorte 2)

O mock **não** implementa cliente. Quando a porta ligar, vale a **mesma política de entrega** do Flash ([flash.md](flash.md) §10; [SRD-01 §6.1](../srd/SRD-01-contratos-de-capacidade.md)): espera progressiva (exponencial com jitter) na falha transitória; recusa permanente de negócio **não** retenta; depois de N tentativas → **fila de não processados** (payload, etapa `incluir conta a pagar` / consultar, departamento ou consolidado, competência, erro). Operador vê e retenta na **Observância da integração** (copy: **Não processados**). Chave de idempotência (SRD-02): `(competencia, departamento, consolidado_id)` — retentar não cria 16 linhas onde cabem 8. Sem broker escolhido (SQS etc.). Códigos Omie ficam para a descoberta do recorte 2.

## O que isto não é

- Não é a integração nativa **Flash Despesas → Omie** (reembolso / prestação de contas). Isso é outro produto Flash. Benefícios da Morada passam pelo **nosso lote**, não por essa tela.
- Não é folha, não é substituir o banco, não é baixa automática no recorte 1.
- Não há implementação, payload de produção, nem mapeamento dos 8 códigos `cCodDep` da Morada — isso é descoberta do recorte 2.

## Páginas oficiais usadas

- https://developer.omie.com.br/
- https://developer.omie.com.br/service-list/
- https://developer.omie.com.br/quick-start/
- https://developer.omie.com.br/my-apps/ (login; não há spec pública na página)
- https://ajuda.omie.com.br/pt-BR/articles/499061-obtendo-a-chave-de-acesso-para-integracoes-de-api
- https://ajuda.omie.com.br/pt-BR/articles/5412721-caracteristicas-e-recomendacoes-das-apis-do-omie
- https://app.omie.com.br/api/v1/financas/contapagar/
- https://app.omie.com.br/api/v1/geral/departamentos/
- https://ajuda.omie.com.br/pt-BR/articles/6590614-distribuindo-as-despesas-por-departamentos
- https://ajuda.omie.com.br/pt-BR/articles/6383302-tarifas-da-omie-cash-completa-e-simplificada
