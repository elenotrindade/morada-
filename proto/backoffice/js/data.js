/* Seed local — protótipo.
   Cifras em R$ NÃO são da entrevista (o financeiro não deu valores).
   PREMISSA DE PROTÓTIPO / exemplo da planilha: docs/proto-semente.md
   P01, P02, P05 seguem pendência no PRD. Ônibus = Flash (D19); valor mensal é semente. */
window.MORADA_PROTO = (() => {
  const DEPTS = [
    { id: "fin", nome: "Financeiro" },
    { id: "ven", nome: "Vendas" },
    { id: "mkt", nome: "Marketing" },
    { id: "eng", nome: "Engenharia" },
    { id: "prd", nome: "Produto" },
    { id: "pes", nome: "Pessoas" },
    { id: "scs", nome: "Sucesso do cliente" },
    { id: "ops", nome: "Operações" },
  ];

  /* Confirmar benefício → Flash → Boleto → Omie → Diretores → Banco. Omie = mock. */
  const PIPE = [
    { id: "confirma1", rotulo: "Confirmar benefício", detalhe: "Confirmar o benefício do lote", rota: "confirma" },
    { id: "flash", rotulo: "Flash", detalhe: "Enviar o pedido ao provedor", rota: "flash" },
    { id: "confirma2", rotulo: "Boleto", detalhe: "Retorno Flash do pedido enviado", rota: "retorno" },
    { id: "omie", rotulo: "Omie", detalhe: "Lançar por departamento", rota: "omie" },
    { id: "diretores", rotulo: "Diretores", detalhe: "Autorizar o pagamento", rota: "diretores" },
    { id: "banco", rotulo: "Banco", detalhe: "Pagar o boleto", rota: "banco" },
  ];

  /* Calendário nacional (P12): dia útil = não sábado, domingo nem feriado nacional.
     Facultativos (Carnaval, Corpus Christi) e municipais ficam de fora até a pendência fechar.
     Sexta-feira Santa entra (feriado nacional religioso). Consciência Negra nacional desde 2024. */
  const DIAS_SEMANA = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];

  function ymd(ano, mes, dia) {
    return `${ano}-${String(mes).padStart(2, "0")}-${String(dia).padStart(2, "0")}`;
  }

  function pascoa(ano) {
    const a = ano % 19;
    const b = Math.floor(ano / 100);
    const c = ano % 100;
    const d = Math.floor(b / 4);
    const e = b % 4;
    const f = Math.floor((b + 8) / 25);
    const g = Math.floor((b - f + 1) / 3);
    const h = (19 * a + b - d - g + 15) % 30;
    const i = Math.floor(c / 4);
    const k = c % 4;
    const l = (32 + 2 * e + 2 * i - h - k) % 7;
    const m = Math.floor((a + 11 * h + 22 * l) / 451);
    const mes = Math.floor((h + l - 7 * m + 114) / 31);
    const dia = ((h + l - 7 * m + 114) % 31) + 1;
    return { ano, mes, dia };
  }

  function feriadosNacionaisDoAno(ano) {
    const map = {};
    const add = (mes, dia, nome) => { map[ymd(ano, mes, dia)] = nome; };
    add(1, 1, "Confraternização Universal");
    add(4, 21, "Tiradentes");
    add(5, 1, "Dia do Trabalho");
    add(9, 7, "Independência");
    add(10, 12, "Nossa Senhora Aparecida");
    add(11, 2, "Finados");
    add(11, 15, "Proclamação da República");
    if (ano >= 2024) add(11, 20, "Consciência Negra");
    add(12, 25, "Natal");
    const p = pascoa(ano);
    const sexta = new Date(Date.UTC(p.ano, p.mes - 1, p.dia - 2));
    add(sexta.getUTCMonth() + 1, sexta.getUTCDate(), "Sexta-feira Santa");
    return map;
  }

  function calendarioNacional(ano, mes) {
    const feriados = feriadosNacionaisDoAno(ano);
    const ultimo = new Date(Date.UTC(ano, mes, 0)).getUTCDate();
    const dias = [];
    let diasUteis = 0;
    for (let dia = 1; dia <= ultimo; dia++) {
      const dow = new Date(Date.UTC(ano, mes - 1, dia)).getUTCDay();
      const weekend = dow === 0 || dow === 6;
      const nomeFeriado = feriados[ymd(ano, mes, dia)] || null;
      const util = !weekend && !nomeFeriado;
      if (util) diasUteis += 1;
      dias.push({ dia, dow, util, weekend, feriado: !!nomeFeriado, nomeFeriado });
    }
    return { ano, mes, dias, diasUteis, padInicio: dias[0].dow };
  }

  const calJul = calendarioNacional(2026, 7);
  const calAgo = calendarioNacional(2026, 8);
  const calSet = calendarioNacional(2026, 9);

  /* Lista navega competências. Só setembro/2026 está aberta; anteriores = só leitura. */
  const COMPETENCIAS = [
    { id: "2026-07", rotulo: "julho/2026", aberta: false, corte: "25/06/2026", credito: "01/07/2026", diasUteis: calJul.diasUteis, passo: 5 },
    { id: "2026-08", rotulo: "agosto/2026", aberta: false, corte: "25/07/2026", credito: "01/08/2026", diasUteis: calAgo.diasUteis, passo: 5 },
    { id: "2026-09", rotulo: "setembro/2026", aberta: true, corte: "25/08/2026", credito: "01/09/2026", diasUteis: calSet.diasUteis, passo: 0 },
  ];

  const ciclo = {
    competencia: "setembro/2026",
    corte: "25/08/2026",
    credito: "01/09/2026",
    diasUteis: calSet.diasUteis, /* calendário nacional da competência — não digitado */
    passo: 0,
    carga: null, /* { meio, nome, diasPlanilha } — mock de extração; calendário manda */
    /* D22: várias parciais na competência. Não sobrescrever pedido/boleto/Omie/oks/comprovantes. */
    parciais: [],
    parcialAtualId: null,
    comprovantesMes: [],
    trilha: [], /* D25: eventos conferiu | anexou comprovante (ator gravado). Sem card dump-list na UI. */
  };

  /* DECISÃO DE PROTÓTIPO: sessão atual = Operador interno. Não é fato de login da entrevista.
   * Ator de auditoria / Quem anexou lê a porta IdentidadeInterna (e-mail @morada). */
  const OPERADOR = { nome: "Operador interno", email: "financeiro@morada" };

  /* Taxas: docs/integracoes/flash.md + omie.md — não é semente de benefício (D18).
   * Flash: variável. Fórmula: totalFee = soma das fee de cada depósito (fato da API).
   *   GET depositFees não executado; sem % publicado.
   *   Proto simula totalFeeCentavos = 100 (R$ 1,00) no retorno do pedido → PREMISSA DE PROTÓTIPO, não fato da entrevista nem medição da API.
   * Omie: R$ 1,99 / boleto liquidado (fato da nota Omie.CASH Completa).
   * Taxa visível = Flash + Omie (decisão de recorte). Não esconder Omie dentro de Flash. */
  const OMIE_TAXA_BOLETO_CENTAVOS = 199;
  const FLASH_TAXA_PROTO_CENTAVOS = 100;

  function novaParcial(id, pessoaIds) {
    return {
      id,
      pessoaIds: (pessoaIds || []).slice(),
      pedidoProvedor: null,
      boleto: null,
      flashEspera: null,
      flashStatus: null,
      retornoConferido: false,
      lancamentoOmie: false,
      emailDiretores: null,
      autorizacoes: [],
      comprovantes: [],
      consolidadoPagamento: null,
      totalFeeCentavos: 0,
    };
  }

  /* diarioCentavos / flexivelCentavos: semente por pessoa (D18). Não é fato da entrevista. */
  const pessoas = [
    { id: "p1", nome: "Ana Souza", email: "ana.souza@morada", regime: "CLT", departamento: "fin", transporte: "gasolina", faixa: "10 km", ativa: true, diarioCentavos: 4200 },
    { id: "p2", nome: "Bruno Lima", email: "bruno.lima@morada", regime: "CLT", departamento: "ven", transporte: "gasolina", faixa: "5 km", ativa: true, diarioCentavos: 3500 },
    { id: "p3", nome: "Carla Dias", email: "carla.dias@morada", regime: "PJ", departamento: "mkt", transporte: null, faixa: null, ativa: true, flexivelCentavos: 105000 },
    { id: "p4", nome: "Diego Alves", email: "diego.alves@morada", regime: "CLT", departamento: "eng", transporte: "ônibus", faixa: null, ativa: true, diarioCentavos: 4000 },
    { id: "p5", nome: "Elena Rocha", email: "elena.rocha@morada", regime: "CLT", departamento: "prd", transporte: "ônibus", faixa: null, ativa: true, diarioCentavos: 3800 },
    { id: "p6", nome: "Felipe Nunes", email: "felipe.nunes@morada", regime: "PJ", departamento: "pes", transporte: null, faixa: null, ativa: true, flexivelCentavos: 98000 },
    { id: "p7", nome: "Giselle Pinto", email: "giselle.pinto@morada", regime: "CLT", departamento: "scs", transporte: "gasolina", faixa: "metropolitana", ativa: false, diarioCentavos: 4500 },
    { id: "p8", nome: "Hugo Martins", email: "hugo.martins@morada", regime: "CLT", departamento: "ops", transporte: "ônibus", faixa: null, ativa: true, diarioCentavos: 4800 },
    { id: "p9", nome: "Igor Castro", email: "igor.castro@morada", regime: "CLT", departamento: "ven", transporte: "gasolina", faixa: "5 km", ativa: true, diarioCentavos: 3600 },
    { id: "p10", nome: "Janaína Melo", email: "janaina.melo@morada", regime: "CLT", departamento: "mkt", transporte: "ônibus", faixa: null, ativa: true, diarioCentavos: 5000 },
  ];

  /* Copy da sala (fato). Hipótese Flash (P07) não vai na lista — só nota mutada no Detalhe.
     Seed: depósitos (CLT = Multibenefícios + escolha). UI da lista agrupa uma linha por colaborador. */
  const NOME_COMIDA = "Multibenefícios";
  const NOME_GASOLINA = "Auxílio gasolina";
  const NOME_ONIBUS = "Cartão de ônibus";
  const NOME_FLEXIVEL = "Flexível";
  const FLASH_COMIDA = "Alimentação e refeição";
  const FLASH_MOBILIDADE = "Auxílio Mobilidade";
  const FLASH_ONIBUS = "Vale-transporte";
  const FLASH_FLEXIVEL = "Flexível";
  const usaDiasUteis = (beneficio) => beneficio === NOME_COMIDA;

  /* PREMISSA DE PROTÓTIPO — planilha-semente. Não é fato do financeiro. docs/proto-semente.md
     Diário CLT e Flexível PJ: por pessoa (D18). Gasolina: faixa. Ônibus: mensal seed (D19). H01/P01/P05 seguem abertos no PRD. */
  const SEMENTE = {
    gasolinaCentavos: { "5 km": 28000, "10 km": 42000, metropolitana: 62000 },
    onibusCentavos: 19800,
  };

  function brl(centavos) {
    return (centavos / 100).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
  }

  const SIT = {
    A_CONFERIR: "a conferir",
    CONFERIDA: "conferida",
  };

  function valorDaLinha(l, p, diasUteis, { forcarCalculo } = {}) {
    if (l.valorAusente && !forcarCalculo) return { display: "a informar", centavos: null };
    if (l.beneficio === NOME_COMIDA) {
      const diario = p && p.diarioCentavos;
      if (diario == null) return { display: "a informar", centavos: null };
      const c = diario * diasUteis;
      return { display: brl(c), centavos: c };
    }
    if (l.beneficio === NOME_GASOLINA) {
      const c = p && (p.gasolinaCentavos != null ? p.gasolinaCentavos : SEMENTE.gasolinaCentavos[p.faixa]);
      if (c == null) return { display: "a informar", centavos: null };
      return { display: brl(c), centavos: c };
    }
    if (l.beneficio === NOME_FLEXIVEL) {
      const c = p && p.flexivelCentavos;
      if (c == null) return { display: "a informar", centavos: null };
      return { display: brl(c), centavos: c };
    }
    if (l.beneficio === NOME_ONIBUS) {
      const c = p && (p.onibusCentavos != null ? p.onibusCentavos : SEMENTE.onibusCentavos);
      if (c == null) return { display: "a informar", centavos: null };
      return { display: brl(c), centavos: c };
    }
    return { display: "a informar", centavos: null };
  }

  function comValor(l, diasUteis, opts) {
    const p = pessoas.find((x) => x.id === l.pessoaId);
    const v = valorDaLinha(l, p, diasUteis, opts);
    return { ...l, valor: v.display, valorCentavos: v.centavos };
  }

  /* Depósitos do ciclo (Flash = um por colaborador e modalidade). Lista UI agrupa por colaborador.
     CLT: Multibenefícios + escolha (gasolina XOR ônibus) — os dois lados são depósito Flash (D19).
     valorAusente: cadastro incompleto (Diego Multibenefícios, Felipe Flexível). Ônibus usa SEMENTE.onibusCentavos (PREMISSA, não entrevista). */
  const linhas = [
    { id: "n1", pessoaId: "p1", beneficio: NOME_COMIDA, papel: "padrão", hipoteseFlash: FLASH_COMIDA, diasUteis: calSet.diasUteis, situacao: SIT.A_CONFERIR, fluxo: "confirma", deposito: true },
    { id: "n2", pessoaId: "p1", beneficio: NOME_GASOLINA, papel: "escolha", hipoteseFlash: FLASH_MOBILIDADE, diasUteis: null, situacao: SIT.A_CONFERIR, fluxo: "confirma", deposito: true },
    { id: "n3", pessoaId: "p2", beneficio: NOME_COMIDA, papel: "padrão", hipoteseFlash: FLASH_COMIDA, diasUteis: calSet.diasUteis, situacao: SIT.A_CONFERIR, fluxo: "confirma", deposito: true },
    { id: "n4", pessoaId: "p2", beneficio: NOME_GASOLINA, papel: "escolha", hipoteseFlash: FLASH_MOBILIDADE, diasUteis: null, situacao: SIT.A_CONFERIR, fluxo: "confirma", deposito: true },
    { id: "n5", pessoaId: "p3", beneficio: NOME_FLEXIVEL, papel: "padrão", hipoteseFlash: FLASH_FLEXIVEL, diasUteis: null, situacao: SIT.A_CONFERIR, fluxo: "confirma", deposito: true },
    { id: "n6", pessoaId: "p4", beneficio: NOME_COMIDA, papel: "padrão", hipoteseFlash: FLASH_COMIDA, diasUteis: calSet.diasUteis, valorAusente: true, situacao: SIT.A_CONFERIR, fluxo: "confirma", deposito: true },
    { id: "n7", pessoaId: "p4", beneficio: NOME_ONIBUS, papel: "escolha", hipoteseFlash: FLASH_ONIBUS, diasUteis: null, situacao: SIT.A_CONFERIR, fluxo: "confirma", deposito: true, onibus: true },
    { id: "n8", pessoaId: "p5", beneficio: NOME_COMIDA, papel: "padrão", hipoteseFlash: FLASH_COMIDA, diasUteis: calSet.diasUteis, situacao: SIT.A_CONFERIR, fluxo: "confirma", deposito: true },
    { id: "n9", pessoaId: "p5", beneficio: NOME_ONIBUS, papel: "escolha", hipoteseFlash: FLASH_ONIBUS, diasUteis: null, situacao: SIT.A_CONFERIR, fluxo: "confirma", deposito: true, onibus: true },
    { id: "n10", pessoaId: "p6", beneficio: NOME_FLEXIVEL, papel: "padrão", hipoteseFlash: FLASH_FLEXIVEL, diasUteis: null, valorAusente: true, situacao: SIT.A_CONFERIR, fluxo: "confirma", deposito: true },
    { id: "n13", pessoaId: "p8", beneficio: NOME_COMIDA, papel: "padrão", hipoteseFlash: FLASH_COMIDA, diasUteis: calSet.diasUteis, situacao: SIT.A_CONFERIR, fluxo: "confirma", deposito: true },
    { id: "n14", pessoaId: "p8", beneficio: NOME_ONIBUS, papel: "escolha", hipoteseFlash: FLASH_ONIBUS, diasUteis: null, situacao: SIT.A_CONFERIR, fluxo: "confirma", deposito: true, onibus: true },
    { id: "n15", pessoaId: "p9", beneficio: NOME_COMIDA, papel: "padrão", hipoteseFlash: FLASH_COMIDA, diasUteis: calSet.diasUteis, situacao: SIT.A_CONFERIR, fluxo: "confirma", deposito: true },
    { id: "n16", pessoaId: "p9", beneficio: NOME_GASOLINA, papel: "escolha", hipoteseFlash: FLASH_MOBILIDADE, diasUteis: null, situacao: SIT.A_CONFERIR, fluxo: "confirma", deposito: true },
    { id: "n17", pessoaId: "p10", beneficio: NOME_COMIDA, papel: "padrão", hipoteseFlash: FLASH_COMIDA, diasUteis: calSet.diasUteis, situacao: SIT.A_CONFERIR, fluxo: "confirma", deposito: true },
    { id: "n18", pessoaId: "p10", beneficio: NOME_ONIBUS, papel: "escolha", hipoteseFlash: FLASH_ONIBUS, diasUteis: null, situacao: SIT.A_CONFERIR, fluxo: "confirma", deposito: true, onibus: true },
  ].map((l) => comValor(l, ciclo.diasUteis));

  return {
    DEPTS, PIPE, COMPETENCIAS, ciclo, pessoas, linhas, SEMENTE,
    NOME_COMIDA, NOME_GASOLINA, NOME_ONIBUS, NOME_FLEXIVEL,
    FLASH_COMIDA, FLASH_MOBILIDADE, FLASH_ONIBUS, FLASH_FLEXIVEL,
    usaDiasUteis, SIT, brl, valorDaLinha, novaParcial,
    DIAS_SEMANA, calendarioNacional, OMIE_TAXA_BOLETO_CENTAVOS, FLASH_TAXA_PROTO_CENTAVOS, OPERADOR,
  };
})();
