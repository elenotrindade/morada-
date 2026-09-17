# Lote congelado é a verdade do ciclo

O processo atual trata planilha, painel do provedor e lançamento no sistema financeiro como três escritos da mesma competência, sem artefato que prove igualdade. Decidimos que o **lote congelado** é a fonte da verdade da competência; `PedidoNoProvedor` e `LancamentoDepartamental` são projeções. Sem isso, integrar o provedor só acelera o erro da planilha. A alternativa (provedor como mestre depois da execução) foi rejeitada: o painel não carrega elegibilidade nem totais departamentais, e o financeiro precisa de um lote congelado antes do crédito.
