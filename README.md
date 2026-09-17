# Morada — contrato de operação de benefícios

Desafio de Product Engineering. Contratos sem stack. O protótipo em `proto/backoffice/` **ilustra** o comportamento; **não é a entrega**.

## Ver o protótipo

Na raiz do repositório:

```bash
python3 -m http.server 8765 --bind 127.0.0.1 --directory proto/backoffice
```

Abra [http://127.0.0.1:8765/](http://127.0.0.1:8765/) — a operação fica em `#/financeiro/beneficios`.

Estados de captura (um por linha):

```
http://127.0.0.1:8765/?demo=lista#/financeiro/beneficios
http://127.0.0.1:8765/?demo=flash#/financeiro/beneficios
http://127.0.0.1:8765/?demo=boleto#/financeiro/beneficios
http://127.0.0.1:8765/?demo=omie#/financeiro/beneficios
http://127.0.0.1:8765/?demo=diretores#/financeiro/beneficios
http://127.0.0.1:8765/?demo=banco#/financeiro/beneficios
```

## PRD e SRD

- **PRD** (`docs/prd/`): comportamento observável — regras, jornadas e critérios de aceite que o financeiro opera sem adivinhar.
- **SRD** (`docs/srd/`): capacidades, entidades, invariantes e portas. Sem stack (sem linguagem, banco ou protocolo).

A proposta de Product Engineer em [`docs/entrega/proposta-product-engineer.md`](docs/entrega/proposta-product-engineer.md) deriva desses contratos; os contratos não derivam da proposta.

## Mapa

- Skill de produto: `.cursor/skills/product-engineer/`
- Skill de UI: `.cursor/skills/ui-operacao/`
- Skill de otimização (Flash + calendário): `.cursor/skills/otimizacao-operacional/`
- Discovery: `docs/discovery/`
- Integrações (Flash primeiro, Omie mock/recorte 2): `docs/integracoes/`
- Semente do proto (PREMISSA, não fato da entrevista): `docs/proto-semente.md`
