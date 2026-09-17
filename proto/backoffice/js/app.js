(() => {
  const D = window.MORADA_PROTO;
  const SIT = D.SIT;
  const $app = document.getElementById("app");
  const selecionados = new Set();
  const filtros = { busca: "", regime: "", beneficio: "", departamento: "" };
  let competenciaId = "2026-09";
  let linhasPassado = [];
  let modal = null;
  let calAberto = false;
  let toastTimer = null;
  let esperaTimer = null;
  const abertosPorGrupo = { flash: new Set(), boleto: new Set(), omie: new Set(), banco: new Set() };
  let sumarioMesAberto = false;

  const pessoa = (id) => D.pessoas.find((p) => p.id === id);
  const deptNome = (id) => D.DEPTS.find((d) => d.id === id)?.nome || id;
  const slug = (s) => String(s).toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

  function compet() {
    return D.COMPETENCIAS.find((c) => c.id === competenciaId) || D.COMPETENCIAS[D.COMPETENCIAS.length - 1];
  }

  function mesAberto() {
    return !!compet().aberta;
  }

  function colaboradorAtivo(p) {
    return !!(p && p.ativa);
  }

  function linhasDoMes() {
    const src = mesAberto() ? D.linhas : linhasPassado;
    return src.filter((l) => colaboradorAtivo(pessoa(l.pessoaId)));
  }

  function todasParciais() {
    if (!Array.isArray(D.ciclo.parciais)) D.ciclo.parciais = [];
    return D.ciclo.parciais;
  }

  function parcialPorId(id) {
    return todasParciais().find((p) => p.id === id) || null;
  }

  function parcialAtual() {
    return parcialPorId(D.ciclo.parcialAtualId);
  }

  function linhasDaParcial(par) {
    if (!par) return [];
    const ids = new Set(par.pessoaIds);
    return linhasDoMes().filter((l) => ids.has(l.pessoaId) && l.deposito);
  }

  function parcialFlashOk(par) {
    return !!(par && (par.retornoConferido || par.flashEspera === "ok"));
  }

  function pessoaIdsEmPedido() {
    const ids = new Set();
    todasParciais().forEach((p) => {
      if (p.pedidoProvedor) p.pessoaIds.forEach((id) => ids.add(id));
    });
    return ids;
  }

  function conferidasLivresIds() {
    const ocupadas = pessoaIdsEmPedido();
    const ids = [];
    conferidas().forEach((l) => {
      if (ocupadas.has(l.pessoaId)) return;
      if (!ids.includes(l.pessoaId)) ids.push(l.pessoaId);
    });
    return ids;
  }

  function idsSelecionadosConferidos() {
    return [...selecionados].filter((id) => {
      const p = pessoa(id);
      if (!colaboradorAtivo(p)) return false;
      return linhasDaPessoa(id).some((l) => l.deposito && isConferida(l.situacao) && !jaNoPedidoFlash(l));
    });
  }

  function abrirParcial(pessoaIds) {
    const ids = [...new Set(pessoaIds || [])].filter((id) => colaboradorAtivo(pessoa(id)));
    if (!ids.length) return null;
    const cur = parcialAtual();
    if (cur && !cur.pedidoProvedor) {
      cur.pessoaIds = [...new Set([...cur.pessoaIds, ...ids])];
      return cur;
    }
    const par = D.novaParcial(`par-${todasParciais().length + 1}`, ids);
    todasParciais().push(par);
    D.ciclo.parcialAtualId = par.id;
    D.ciclo.passo = Math.max(D.ciclo.passo, 1);
    return par;
  }

  function setCompetencia(id) {
    const c = D.COMPETENCIAS.find((x) => x.id === id);
    if (!c || c.id === competenciaId) return;
    const atual = compet();
    if (atual.aberta) atual.passo = D.ciclo.passo;
    competenciaId = id;
    D.ciclo.competencia = c.rotulo;
    D.ciclo.corte = c.corte;
    D.ciclo.credito = c.credito;
    D.ciclo.diasUteis = c.diasUteis;
    D.ciclo.passo = c.passo;
    if (!c.aberta) {
      linhasPassado = D.linhas.map((l) => {
        const v = D.valorDaLinha(l, pessoa(l.pessoaId), c.diasUteis, { forcarCalculo: true });
        return {
          ...l,
          id: `${c.id}-${l.id}`,
          situacao: SIT.CONFERIDA,
          motivos: [],
          fluxo: "banco",
          diasUteis: D.usaDiasUteis(l.beneficio) ? c.diasUteis : null,
          diasUteisPlanilha: undefined,
          correcao: undefined,
          valor: v.display,
          valorCentavos: v.centavos,
        };
      });
    }
    selecionados.clear();
    modal = null;
  }

  function linhasComPessoa() {
    return linhasDoMes().map((l) => {
      const p = pessoa(l.pessoaId);
      return { ...l, colaborador: p.nome, email: p.email, regime: p.regime, departamento: p.departamento, deptNome: deptNome(p.departamento) };
    });
  }

  function ordenarPendencias(rows) {
    const pend = new Set(rows.filter((r) => r.situacao === SIT.A_CONFERIR).map((r) => r.pessoaId));
    return [...rows].sort((a, b) => (pend.has(a.pessoaId) ? 0 : 1) - (pend.has(b.pessoaId) ? 0 : 1));
  }

  function motivosDe(l) {
    return Array.isArray(l.motivos) ? l.motivos : [];
  }

  function temMotivo(l, m) {
    return motivosDe(l).includes(m);
  }

  function isConferida(sit) {
    return sit === SIT.CONFERIDA;
  }

  function cadastroIncompleto(l) {
    return !!l.valorAusente || displayValor(l) === "a informar";
  }

  function podeBulkConferir(l) {
    return l.situacao === SIT.A_CONFERIR && !pessoaIncompleta(l.pessoaId);
  }

  function displayValor(l) {
    return l.valor ?? "a informar";
  }

  function clsValor(l) {
    return displayValor(l) === "a informar" ? "num val-ph" : "num";
  }

  function pecaCentavos(l) {
    return typeof l?.valorCentavos === "number" ? l.valorCentavos : null;
  }

  function valorListaPessoa({ pj, flex, multi, escolha }) {
    if (pj) {
      const c = pecaCentavos(flex);
      return { display: c == null ? "a informar" : D.brl(c), centavos: c };
    }
    const m = pecaCentavos(multi);
    const e = pecaCentavos(escolha);
    if (m == null || e == null) return { display: "a informar", centavos: null };
    const c = m + e;
    return { display: D.brl(c), centavos: c };
  }

  function linhasDaPessoa(pessoaId) {
    return linhasDoMes().filter((l) => l.pessoaId === pessoaId);
  }

  function sitPior(sits) {
    if (sits.includes(SIT.A_CONFERIR)) return SIT.A_CONFERIR;
    return SIT.CONFERIDA;
  }

  function rowPessoa(pessoaId) {
    const p = pessoa(pessoaId);
    const lines = linhasDaPessoa(pessoaId);
    const multi = lines.find((l) => l.beneficio === D.NOME_COMIDA) || null;
    const flex = lines.find((l) => l.beneficio === D.NOME_FLEXIVEL) || null;
    const gas = lines.find((l) => l.beneficio === D.NOME_GASOLINA) || null;
    const oni = lines.find((l) => l.onibus || l.beneficio === D.NOME_ONIBUS) || null;
    const pj = p.regime === "PJ";
    const escolhaLinha = pj ? flex : (gas || oni);
    const beneficio = pj ? D.NOME_FLEXIVEL : (gas ? D.NOME_GASOLINA : D.NOME_ONIBUS);
    const situacao = sitPior(lines.map((l) => l.situacao));
    const listaValor = valorListaPessoa({ pj, flex, multi, escolha: escolhaLinha });
    return {
      id: pessoaId,
      pessoaId,
      colaborador: p.nome,
      email: p.email,
      regime: p.regime,
      departamento: p.departamento,
      deptNome: deptNome(p.departamento),
      beneficio,
      onibus: !pj && !!oni && !gas,
      situacao,
      fluxo: escolhaLinha?.fluxo || lines[0]?.fluxo,
      deposito: lines.some((l) => l.deposito),
      valor: listaValor.display,
      valorCentavos: listaValor.centavos,
      escolhaValor: escolhaLinha ? displayValor(escolhaLinha) : "a informar",
      escolhaValorCentavos: pecaCentavos(escolhaLinha),
      diasUteis: multi ? multi.diasUteis : null,
      diasUteisPlanilha: multi?.diasUteisPlanilha,
      ajusteDias: multi?.ajusteDias,
      observacoes: lines.find((l) => l.observacoes || l.correcao)?.observacoes
        || lines.find((l) => l.correcao)?.correcao,
      valorAusente: lines.some((l) => l.valorAusente),
      multiValor: multi ? displayValor(multi) : null,
      multiValorCentavos: pecaCentavos(multi),
      faixa: p.faixa,
      transporte: p.transporte,
    };
  }

  function naParcialFlash(pessoaId) {
    return todasParciais().some((p) => Array.isArray(p.pessoaIds) && p.pessoaIds.includes(pessoaId));
  }

  function rowsPessoa(modo) {
    const ids = [];
    linhasDoMes().forEach((l) => {
      if (!ids.includes(l.pessoaId)) ids.push(l.pessoaId);
    });
    const rows = ids.map(rowPessoa);
    if (modo === "lista") {
      return rows.filter((r) => r.situacao === SIT.A_CONFERIR && !naParcialFlash(r.pessoaId));
    }
    return rows;
  }

  function pessoaIncompleta(pessoaId) {
    return linhasDaPessoa(pessoaId).some(cadastroIncompleto);
  }

  function linhasConferiveisDaPessoa(pessoaId) {
    return linhasDaPessoa(pessoaId).filter((l) => podeBulkConferir(l));
  }

  function somaCentavos(rows) {
    return rows.reduce((acc, l) => acc + (typeof l.valorCentavos === "number" ? l.valorCentavos : 0), 0);
  }

  function txtSoma(rows) {
    const n = somaCentavos(rows);
    return n ? D.brl(n) : "a informar";
  }

  function clsSoma(txt) {
    return txt === "a informar" ? "val-ph" : "";
  }

  function depositos() {
    return linhasDoMes().filter((l) => l.deposito);
  }

  function flashConfirmado() {
    return parcialFlashOk(parcialAtual());
  }

  function jaNoPedidoFlash(l) {
    return l.fluxo === "flash" || l.fluxo === "omie" || l.fluxo === "banco";
  }

  function linhasFlashConfirmadas(par) {
    const alvo = par === undefined ? parcialAtual() : par;
    if (!parcialFlashOk(alvo)) return [];
    return linhasDaParcial(alvo).filter((l) => jaNoPedidoFlash(l) && isConferida(l.situacao));
  }

  function linhasFlashConfirmadasMes() {
    return todasParciais().flatMap((p) => linhasFlashConfirmadas(p));
  }

  function ordinalParcial(i) {
    return `${i + 1}ª parcial`;
  }

  function comprovantesDaParcial(par) {
    if (!par) return [];
    if (Array.isArray(par.comprovantes)) return par.comprovantes;
    if (par.comprovante) return [par.comprovante];
    return [];
  }

  function comprovantesDoMes() {
    if (!Array.isArray(D.ciclo.comprovantesMes)) D.ciclo.comprovantesMes = [];
    const out = [];
    D.ciclo.comprovantesMes.forEach((c, idx) => {
      out.push({ origem: "mes", par: null, c, idx });
    });
    todasParciais().forEach((p, i) => {
      comprovantesDaParcial(p).forEach((c, idx) => {
        out.push({ origem: "parcial", par: p, ordinal: ordinalParcial(i), c, idx });
      });
    });
    return out;
  }

  function taxaFlashCentavos(par) {
    return typeof par?.totalFeeCentavos === "number" ? par.totalFeeCentavos : 0;
  }

  function taxaOmieCentavos(par) {
    return par?.boleto ? D.OMIE_TAXA_BOLETO_CENTAVOS : 0;
  }

  function taxaVisivelCentavos(par) {
    return taxaFlashCentavos(par) + taxaOmieCentavos(par);
  }

  function blocoTaxa(par) {
    if (!par) return "";
    const flash = taxaFlashCentavos(par);
    const omie = taxaOmieCentavos(par);
    const visivel = taxaVisivelCentavos(par);
    if (visivel <= 0) return "";
    const id = escapeAttr(par.id || "—");
    return `
      <div class="taxa-bloco" aria-label="Taxa visível">
        <span class="taxa-id">${id}</span>
        <span class="taxa-sep" aria-hidden="true">·</span>
        <span class="taxa-parcelas">(${D.brl(flash)} + ${D.brl(omie)})</span>
        <span class="taxa-soma">${D.brl(visivel)}</span>
      </div>
    `;
  }

  function agoraPt() {
    return new Date().toLocaleString("pt-BR", {
      day: "2-digit", month: "2-digit", year: "numeric",
      hour: "2-digit", minute: "2-digit",
    });
  }

  function registrarEsteira(acao, detalhe) {
    /* D25: grava evento (ator interno). Sem renderizar card Histórico da esteira. */
    if (!Array.isArray(D.ciclo.trilha)) D.ciclo.trilha = [];
    D.ciclo.trilha.push({
      quando: agoraPt(),
      ator: D.OPERADOR.nome,
      acao,
      detalhe: detalhe || "",
    });
  }

  function nAConferir() {
    return rowsPessoa("lista").length;
  }

  function temPendenciaEsteira() {
    if (!mesAberto()) return false;
    if (nAConferir() > 0) return true;
    if (conferidasLivresIds().length) return true;
    const pars = todasParciais();
    if (!pars.length) return rowsPessoa().length > 0;
    for (const par of pars) {
      if (!par.pedidoProvedor) return true;
      if (!parcialFlashOk(par)) return true;
      if (!par.lancamentoOmie) return true;
      if ((par.autorizacoes || []).length < 2) return true;
    }
    if (comprovantesDoMes().length === 0) return true;
    return false;
  }

  function conferidas() {
    return depositos().filter((l) => isConferida(l.situacao));
  }

  function linhasFlashPendentes() {
    return conferidas().filter((l) => !jaNoPedidoFlash(l));
  }

  function linhasNestaParcial() {
    const par = parcialAtual();
    if (!par) return [];
    return linhasDaParcial(par).filter((l) => isConferida(l.situacao));
  }

  function podeEnviarFlash() {
    return mesAberto() && (idsSelecionadosConferidos().length > 0 || conferidasLivresIds().length > 0);
  }

  function nextLiberado(highlight) {
    const par = parcialAtual();
    if (highlight >= D.PIPE.length - 1) return false;
    if (highlight === 0) return !!par;
    if (highlight === 1) return !!(par && par.pedidoProvedor);
    if (highlight === 2) return parcialFlashOk(par);
    if (highlight === 3) return !!(par && par.lancamentoOmie);
    if (highlight === 4) return !!(par && par.autorizacoes.length >= 2);
    return true;
  }

  function gateFrase() {
    return podeEnviarFlash() ? "pode seguir" : "ainda não";
  }

  function passoIndex() {
    return mesAberto() ? D.ciclo.passo : compet().passo;
  }

  function toast(msg) {
    document.getElementById("toast")?.remove();
    const el = document.createElement("div");
    el.className = "toast";
    el.id = "toast";
    el.textContent = msg;
    document.body.appendChild(el);
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => el.remove(), 3200);
  }

  function parseHash() {
    const raw = (location.hash || "#/financeiro/beneficios").replace(/^#/, "") || "/";
    const parts = raw.split("/").filter(Boolean);
    if (parts.length === 0) return ["financeiro", "beneficios"];
    return parts;
  }

  function chipSit(r) {
    return `<span class="chip chip-${slug(r.situacao)}">${r.situacao}</span>`;
  }

  function chipRegime(reg) {
    return `<span class="regime-txt">${reg}</span>`;
  }

  function cellBeneficio(r) {
    if (r.regime === "PJ") {
      return `<span class="beneficio-nome">${D.NOME_FLEXIVEL}</span>`;
    }
    return `<span class="beneficio-nome">${r.beneficio}</span><div class="sub">Multibenefícios padrão</div>`;
  }

  function indiceWizard(rotaAtual) {
    const idx = D.PIPE.findIndex((s) => s.rota === rotaAtual);
    return idx >= 0 ? idx : passoIndex();
  }

  function hrefEtapa(i) {
    const s = D.PIPE[i];
    if (s.rota === "confirma") return "#/financeiro/beneficios";
    return `#/financeiro/beneficios/${s.rota}`;
  }

  function crumbsLista() {
    return `<a href="#/financeiro/beneficios">Financeiro</a> / <a href="#/financeiro/beneficios">Benefícios</a> / <b>Beneficiários</b>`;
  }

  function crumbsEtapa(rotulo) {
    return `<a href="#/financeiro/beneficios">Financeiro</a> / <a href="#/financeiro/beneficios">Benefícios</a> / <b>${rotulo}</b>`;
  }

  function pipeline(rotaAtual) {
    const highlight = indiceWizard(rotaAtual);
    const prev = highlight > 0 ? D.PIPE[highlight - 1] : null;
    const next = highlight < D.PIPE.length - 1 ? D.PIPE[highlight + 1] : null;
    const prevBtn = prev
      ? `<a class="ciclo-seta" href="${hrefEtapa(highlight - 1)}" title="Anterior" aria-label="Anterior: ${prev.rotulo}">‹</a>`
      : `<span class="ciclo-seta is-off" aria-disabled="true" title="Anterior">‹</span>`;

    const nextBtn = !next || !nextLiberado(highlight)
      ? `<span class="ciclo-seta is-off" aria-disabled="true" title="${next ? "Próxima · só conferidas avançam" : "Próxima"}">›</span>`
      : `<a class="ciclo-seta" href="${hrefEtapa(highlight + 1)}" title="Próxima" aria-label="Próxima: ${next.rotulo}">›</a>`;

    return `
      <nav class="ciclo-wizard" aria-label="Ciclo do mês">
        <div class="ciclo-bar">
          ${prevBtn}
          <ol class="ciclo-etapas">
            ${D.PIPE.map((s, i) => {
              const limpa = !temPendenciaEsteira();
              let cls = "futuro";
              if (i === highlight) cls = "atual";
              else if (limpa) cls = "feito";
              const n = cls === "feito" ? "✓" : String(i + 1);
              const nPend = nAConferir();
              const count = s.rota === "confirma" && nPend
                ? `<span class="ciclo-count" title="${nPend} a conferir">${nPend}</span>`
                : "";
              const aria = i === highlight ? ` aria-current="step"` : "";
              return `<li class="${cls}">
                <a href="${hrefEtapa(i)}"${aria}><span class="n">${n}</span><span class="rotulo">${s.rotulo}</span>${count}</a>
              </li>`;
            }).join("")}
          </ol>
          ${nextBtn}
        </div>
      </nav>
    `;
  }

  function shell(parts, crumbs, body) {
    const finOpen = parts[0] === "financeiro";
    return `
      <aside class="sidebar">
        <div class="brand">
          <div class="brand-mark">M</div>
          <div>
            <div class="brand-name">Morada</div>
            <div class="brand-sub">operação interna</div>
          </div>
        </div>
        <nav class="nav">
          <div class="nav-label">Módulos</div>
          <a href="#/pessoas" class="${parts[0] === "pessoas" ? "active" : ""}"><span class="ico">◉</span> Pessoas</a>
          <div class="nav-parent ${finOpen ? "open" : ""}"><span class="ico">▣</span> Financeiro <span class="nav-caret">▾</span></div>
          <div class="nav-sub">
            <a href="#/financeiro/beneficios" class="${finOpen ? "active" : ""}">Benefícios</a>
          </div>
        </nav>
        <div class="sidebar-foot">Operador interno · financeiro<br>identidade @morada</div>
      </aside>
      <section class="main">
        <header class="topbar">
          <div class="crumbs">${crumbs}</div>
          <div class="top-right">
            <span class="env">protótipo</span>
            <div class="user">
              <div class="avatar">OI</div>
              <div class="user-meta">
                <div class="name">Operador interno · financeiro</div>
                <div class="mail">financeiro@morada</div>
              </div>
            </div>
          </div>
        </header>
        <div class="content">${body}</div>
      </section>
      ${renderModal()}
    `;
  }

  function seletorCompetencia() {
    const list = D.COMPETENCIAS;
    const idx = list.findIndex((c) => c.id === competenciaId);
    const atual = compet();
    const ant = idx > 0 ? list[idx - 1] : null;
    const prox = idx < list.length - 1 ? list[idx + 1] : null;
    const aberto = calAberto ? "true" : "false";
    return `
      <div class="comp-nav" aria-label="Competência">
        <span class="comp-lbl">Competência</span>
        ${ant
          ? `<button type="button" class="ciclo-seta" data-act="comp-ant" title="Mês anterior: ${ant.rotulo}" aria-label="Mês anterior: ${ant.rotulo}">‹</button>`
          : `<span class="ciclo-seta is-off" aria-disabled="true" title="Mês anterior">‹</span>`}
        <div class="comp-sel">
          <button type="button" class="comp-atual" data-act="ver-calendario" aria-haspopup="dialog" aria-expanded="${aberto}" aria-controls="comp-popover" aria-label="Competência ${atual.rotulo}${atual.aberta ? "" : ", fechada"}" title="Abrir calendário de ${atual.rotulo}">
            <span class="comp-rotulo">${atual.rotulo}${atual.aberta ? "" : " · fechada"}</span>
            <span class="comp-caret" aria-hidden="true">▾</span>
          </button>
          ${calAberto ? renderCalendarioPopover() : ""}
        </div>
        ${prox
          ? `<button type="button" class="ciclo-seta" data-act="comp-prox" title="Próximo mês: ${prox.rotulo}" aria-label="Próximo mês: ${prox.rotulo}">›</button>`
          : `<span class="ciclo-seta is-off" aria-disabled="true" title="Próximo mês">›</span>`}
      </div>
    `;
  }

  function lista() {
    const base = rowsPessoa("lista");
    const shown = ordenarPendencias(filtrar(base));
    const aberto = mesAberto();
    const vazio = !shown.length
      ? `<p class="empty-inline">${base.length ? "Nenhum colaborador com estes filtros." : "Ninguém a conferir. Quem já foi conferido está no Flash desta competência."}</p>`
      : "";
    return `
      <div class="page-head page-head-lista">
        <h1>Beneficiários</h1>
        <div class="page-head-comp">
          ${seletorCompetencia()}
          ${iconesPlanilha(aberto)}
        </div>
      </div>
      ${pipeline("confirma")}
      ${barraFiltros()}
      ${barraLote(shown)}
      ${shown.length ? tabela(shown, { acoes: true, lote: aberto }) : vazio}
    `;
  }

  function confirma() {
    return lista();
  }

  const ICO = {
    trazer: `<svg class="ico" viewBox="0 0 16 16" aria-hidden="true" focusable="false"><path d="M13.2 6.15A5.4 5.4 0 0 0 4.35 4.7" fill="none" stroke="currentColor" stroke-width="1.3" stroke-linecap="round"/><path d="M13.45 2.85v3.35h-3.35" fill="none" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round"/><path d="M2.8 9.85A5.4 5.4 0 0 0 11.65 11.3" fill="none" stroke="currentColor" stroke-width="1.3" stroke-linecap="round"/><path d="M2.55 13.15V9.8h3.35" fill="none" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
    gerar: `<svg class="ico" viewBox="0 0 16 16" aria-hidden="true" focusable="false"><path d="M8 2.4v7.4" fill="none" stroke="currentColor" stroke-width="1.35" stroke-linecap="round"/><path d="M5.1 7.4 8 10.3 10.9 7.4" fill="none" stroke="currentColor" stroke-width="1.35" stroke-linecap="round" stroke-linejoin="round"/><path d="M2.8 11.4v1.8h10.4v-1.8" fill="none" stroke="currentColor" stroke-width="1.35" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
    baixar: `<svg class="ico" viewBox="0 0 16 16" aria-hidden="true" focusable="false"><path d="M8 2.4v7.4" fill="none" stroke="currentColor" stroke-width="1.35" stroke-linecap="round"/><path d="M5.1 7.4 8 10.3 10.9 7.4" fill="none" stroke="currentColor" stroke-width="1.35" stroke-linecap="round" stroke-linejoin="round"/><path d="M2.8 11.4v1.8h10.4v-1.8" fill="none" stroke="currentColor" stroke-width="1.35" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
    abrir: `<svg class="ico" viewBox="0 0 16 16" aria-hidden="true" focusable="false"><path d="M6.4 3.2H3.6A1.2 1.2 0 0 0 2.4 4.4v8a1.2 1.2 0 0 0 1.2 1.2h8a1.2 1.2 0 0 0 1.2-1.2V9.6" fill="none" stroke="currentColor" stroke-width="1.3" stroke-linecap="round"/><path d="M9.2 2.4h4.4V6.8" fill="none" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round"/><path d="M8.6 7.4 13.6 2.4" fill="none" stroke="currentColor" stroke-width="1.3" stroke-linecap="round"/></svg>`,
  };

  function iconePlanilha(act, label, svg, desligado) {
    const fechada = desligado ? " · competência fechada" : "";
    const tip = `${label}${fechada}`;
    return `
      <span class="icon-tip" data-tip="${tip}">
        <button class="icon-btn" type="button" data-act="${act}" aria-label="${tip}" ${desligado ? "disabled" : ""}>${svg}</button>
      </span>`;
  }

  function iconesPlanilha(aberto) {
    return `
      <div class="page-head-planilha" role="group" aria-label="Planilha de controle">
        ${iconePlanilha("trazer-planilha", "Trazer da planilha", ICO.trazer, !aberto)}
        ${iconePlanilha("planilha", "Gerar planilha", ICO.gerar, false)}
      </div>
    `;
  }

  function barraFiltros() {
    const beneficios = [
      { v: D.NOME_COMIDA, t: "Multibenefícios" },
      { v: D.NOME_GASOLINA, t: "Auxílio gasolina" },
      { v: D.NOME_ONIBUS, t: "Cartão de ônibus" },
      { v: D.NOME_FLEXIVEL, t: "Flexível" },
      { v: "adicional-onibus", t: "Adicional · Multibenefícios + ônibus" },
      { v: "adicional-gasolina", t: "Adicional · Multibenefícios + gasolina" },
    ];
    return `
      <form class="filtros" autocomplete="off" onsubmit="return false">
        <label>Colaborador
          <input type="search" name="busca" data-filtro="busca" placeholder="Nome" value="${escapeAttr(filtros.busca)}" />
        </label>
        <label>Regime
          <select data-filtro="regime">
            <option value="">Todos</option>
            <option value="CLT" ${filtros.regime === "CLT" ? "selected" : ""}>CLT</option>
            <option value="PJ" ${filtros.regime === "PJ" ? "selected" : ""}>PJ</option>
          </select>
        </label>
        <label>Benefício
          <select data-filtro="beneficio">
            <option value="">Todos</option>
            ${beneficios.map((b) => `<option value="${escapeAttr(b.v)}" ${filtros.beneficio === b.v ? "selected" : ""}>${b.t}</option>`).join("")}
          </select>
        </label>
        <label>Departamentos
          <select data-filtro="departamento">
            <option value="">Todos</option>
            ${D.DEPTS.map((d) => `<option value="${d.id}" ${filtros.departamento === d.id ? "selected" : ""}>${d.nome}</option>`).join("")}
          </select>
        </label>
      </form>
    `;
  }

  function barraLote(shown) {
    const n = [...selecionados].filter((id) => shown.some((r) => r.id === id)).length;
    if (n === 0) return "";
    const visiveis = shown.length;
    const allOn = visiveis > 0 && shown.every((r) => selecionados.has(r.id));
    return `
      <div class="bulk">
        <label class="chk"><input type="checkbox" data-act="sel-visiveis" ${allOn ? "checked" : ""} /> Selecionar visíveis</label>
        <div class="bulk-acoes">
          <span class="count">${n} selecionado(s)</span>
          <span class="bulk-flash" title="Marca conferido e abre o resumo Flash">Marca conferido e abre o resumo Flash</span>
          <button class="btn btn-sm btn-primary" data-act="lote-conferido" title="Marca conferido e abre o resumo Flash" ${mesAberto() ? "" : "disabled"}>Marcar como conferidos</button>
        </div>
      </div>
    `;
  }

  function ciclo() {
    const nPessoas = rowsPessoa().length;
    const nOnibus = rowsPessoa().filter((l) => l.onibus).length;
    const nPend = nAConferir();
    const nPar = todasParciais().length;
    const passo = D.PIPE[passoIndex()];
    return `
      <div class="page-head">
        <div>
          <h1>Ciclo do mês</h1>
          <p>${compet().rotulo} · Confirmar benefício → Flash → Boleto → Omie → Diretores → Banco. A lista de beneficiários é a tela principal.</p>
        </div>
        <div class="actions">
          <a class="btn" href="#/financeiro/beneficios">Beneficiários</a>
          <a class="btn btn-primary" href="${passo.rota === "confirma" ? "#/financeiro/beneficios" : `#/financeiro/beneficios/${passo.rota}`}">Abrir etapa</a>
        </div>
      </div>
      ${pipeline("ciclo")}
      <div class="kpis">
        <div class="kpi"><div class="lbl">Onde estamos</div><div class="val">${passo.rotulo}</div><div class="hint">etapa ${passoIndex() + 1} de 6</div></div>
        <div class="kpi"><div class="lbl">Colaboradores</div><div class="val">${nPessoas}</div><div class="hint">ativos na empresa · neste ciclo</div></div>
        <div class="kpi"><div class="lbl">Crédito</div><div class="val gate ${podeEnviarFlash() ? "gate-ok" : "gate-no"}">${gateFrase()}</div><div class="hint">${conferidas().length} conferida(s) · ${nPend} a conferir · ${nPar} parcial(is)</div></div>
        <div class="kpi"><div class="lbl">Cartão de ônibus</div><div class="val">${nOnibus}</div><div class="hint">escolha · depósito Flash</div></div>
      </div>
      <div class="totals">
        <div class="card">
          <h2>O que cada passo pede</h2>
          <div class="body">
            <div class="total-row"><span>1. Confirmar benefício</span><span>confirmar o benefício do lote</span></div>
            <div class="total-row"><span>2. Flash</span><span>enviar o pedido desta parcial</span></div>
            <div class="total-row"><span>3. Boleto</span><span>retorno Flash e boleto do pedido</span></div>
            <div class="total-row"><span>4. Omie</span><span>lançar por departamento</span></div>
            <div class="total-row"><span>5. Diretores</span><span>autorizar o pagamento, não a linha de crédito</span></div>
            <div class="total-row"><span>6. Banco</span><span>pagar · sumário de todas as parciais</span></div>
          </div>
        </div>
        <div class="card">
          <h2>Quem entra</h2>
          <div class="body">
            <div class="note">Beneficiários lista só colaboradores <b>ativos a conferir</b> — quem ainda não entrou na parcial Flash desta competência. Conferido some da primeira tabela e espera no resumo Flash. Confirmar envio dispara o provedor. Desligada, inativa ou após o corte não vira linha. A parcial caminha junta. Parciais anteriores não se apagam.</div>
            <div class="note">Escolha ônibus XOR auxílio gasolina — os dois lados são depósito Flash, com Multibenefícios.</div>
          </div>
        </div>
      </div>
    `;
  }

  function flash() {
    const par = parcialAtual();
    const envio = par && par.pedidoProvedor
      ? linhasDaParcial(par).filter((l) => isConferida(l.situacao))
      : linhasNestaParcial();
    const nPessoas = par ? par.pessoaIds.length : 0;
    const soma = envio.length ? txtSoma(envio) : "—";
    const enviado = !!(par && par.pedidoProvedor);
    const podeConfirmar = !!(par && !par.pedidoProvedor && envio.length && mesAberto());
    const vazio = !par
      ? `<p class="empty-inline">Marque como conferidos em Beneficiários — o clique abre o resumo desta parcial. Confirmar envio dispara o provedor. Pendentes ficam para a próxima.</p>`
      : (!envio.length ? `<p class="empty-inline">Nesta parcial não há conferidas ativas para o pedido.</p>` : "");
    const resumo = par && envio.length
      ? `<p class="parcial-meta"><b>Resumo desta parcial.</b> ${qtde(nPessoas, "pessoa", "pessoas")} · ${soma}. ${enviado ? "Pedido enviado — o grupo espera o retorno na etapa Boleto." : "O grupo espera Confirmar envio ao Flash."}</p>`
      : (par ? `<p class="parcial-meta">${qtde(nPessoas, "pessoa", "pessoas")} nesta caminhada. Já enviado nesta competência não reaparece.</p>` : "");
    return `
      <div class="page-head">
        <h1>Flash</h1>
        <div class="actions">
          <button class="btn btn-primary" data-act="confirmar-envio" ${podeConfirmar ? "" : "disabled"}>Confirmar envio ao Flash</button>
        </div>
      </div>
      ${pipeline("flash")}
      ${resumo}
      ${vazio}
      ${par && envio.length ? accordionDeptos(envio, { grupo: "flash", titulo: "Nesta parcial" }) : ""}
    `;
  }

  function pararEsperaRetorno() {
    if (esperaTimer) {
      clearTimeout(esperaTimer);
      esperaTimer = null;
    }
  }

  /* Mesmo caminho do poll (D28) e do botão Atualizar retorno (D29): consultar_pedido. */
  function aplicarRetornoConsulta(par) {
    if (!par?.pedidoProvedor) return false;
    const n = Math.max(1, todasParciais().filter((p) => p.pedidoProvedor).length);
    par.flashEspera = "ok";
    par.flashStatus = "billed";
    par.retornoConferido = true;
    par.totalFeeCentavos = D.FLASH_TAXA_PROTO_CENTAVOS;
    par.boleto = par.boleto || `boleto-set-2026-${n}`;
    D.ciclo.passo = Math.max(D.ciclo.passo, 2);
    return true;
  }

  function consultarPedidoAgora() {
    pararEsperaRetorno();
    const par = parcialAtual();
    if (!par?.pedidoProvedor) {
      toast("Ainda não há pedido nesta parcial.");
      return;
    }
    const jaOk = par.flashEspera === "ok" || par.retornoConferido;
    aplicarRetornoConsulta(par);
    toast(jaOk ? "Retorno atualizado." : "Retorno do Flash desta parcial. Boleto disponível.");
    paint();
  }

  function iniciarEsperaRetorno() {
    const par = parcialAtual();
    if (!par?.pedidoProvedor) return;
    if (par.flashEspera === "ok" || par.flashEspera === "falhou") return;
    par.flashEspera = "aguardando";
    if (esperaTimer) return;
    esperaTimer = setTimeout(() => {
      esperaTimer = null;
      consultarPedidoAgora();
    }, 2200);
  }

  function vencimentoBoletoMock() {
    const [ano, mes] = String(compet().id || "").split("-");
    if (!ano || !mes) return "—";
    return `20/${mes}/${ano}`;
  }

  function emissaoBoletoMock() {
    const [ano, mes] = String(compet().id || "").split("-");
    if (!ano || !mes) return "—";
    return `01/${mes}/${ano}`;
  }

  function linhaDigitavelMock(par) {
    const n = String(par?.pessoaIds?.length || 0).padStart(2, "0");
    const id = String(par?.id || "par-0").replace(/\D/g, "").padStart(4, "0");
    return `23790.12309 00000.00000${n} 00000.00${id} 8 00000000000000`;
  }

  function urlPreviewBoleto(par, linhas) {
    const qs = new URLSearchParams({
      valor: linhas.length ? txtSoma(linhas) : "—",
      competencia: compet().rotulo,
      parcial: par.id || "",
      pessoas: String(par.pessoaIds.length),
      vencimento: vencimentoBoletoMock(),
      documento: String(par.pessoaIds.length).padStart(8, "0"),
      emissao: emissaoBoletoMock(),
      linha: linhaDigitavelMock(par),
      flash: D.brl(taxaFlashCentavos(par)),
      omie: D.brl(taxaOmieCentavos(par)),
      visivel: D.brl(taxaVisivelCentavos(par)),
    });
    return `boleto-preview.html?${qs.toString()}`;
  }

  function toolbarArquivo({ baixarAct, baixarAttr, hrefAbrir, tipBaixar, tipAbrir }) {
    return `
      <div class="arq-toolbar" role="group" aria-label="Arquivo">
        <span class="icon-tip" data-tip="${escapeAttr(tipBaixar)}">
          <button class="icon-btn" type="button" data-act="${escapeAttr(baixarAct)}" ${baixarAttr || ""} aria-label="${escapeAttr(tipBaixar)}">${ICO.baixar}</button>
        </span>
        <span class="icon-tip" data-tip="${escapeAttr(tipAbrir)}">
          <a class="icon-btn" href="${escapeAttr(hrefAbrir)}" target="_blank" rel="noopener noreferrer" aria-label="${escapeAttr(tipAbrir)}">${ICO.abrir}</a>
        </span>
      </div>
    `;
  }

  function previewBoleto(par, linhas) {
    if (!par?.boleto) return "";
    const src = urlPreviewBoleto(par, linhas);
    return `
      <div class="boleto-frame">
        ${toolbarArquivo({
          baixarAct: "baixar-boleto",
          baixarAttr: `data-parcial="${escapeAttr(par.id)}"`,
          hrefAbrir: src,
          tipBaixar: "Baixar boleto",
          tipAbrir: "Abrir em outra aba",
        })}
        <iframe title="Pré-visualização do boleto" src="${escapeAttr(src)}"></iframe>
      </div>
    `;
  }

  function tituloBoletoParcial(par) {
    const linhas = linhasFlashConfirmadas(par);
    const valor = linhas.length ? txtSoma(linhas) : "—";
    return `${compet().rotulo} · ${par.id || "—"} · ${valor}`;
  }

  function corpoBoletoParcial(par, grupoLista) {
    if (!par?.boleto) return `<p class="empty-inline">Ainda sem boleto nesta parcial.</p>`;
    const envio = linhasFlashConfirmadas(par);
    return `
      ${previewBoleto(par, envio)}
      ${envio.length ? accordionDeptos(envio, { grupo: grupoLista, titulo: "Nesta parcial" }) : ""}
    `;
  }

  function listaBoletosRecolhidos(grupoToggle, filtro) {
    const lista = todasParciais().filter(filtro);
    if (!lista.length) return "";
    const abertos = grupoAbertos(grupoToggle);
    return `
      <div class="recolhivel-lista">
        ${lista.map((p) => {
          const aberto = abertos.has(p.id);
          const titulo = tituloBoletoParcial(p);
          const painelId = `${grupoToggle}-${p.id}`;
          const rotulo = aberto ? "Recolher boleto" : "Abrir boleto";
          return `
            <div class="dept-bloco${aberto ? " is-open" : ""}">
              <button type="button" class="dept-btn" data-act="recolhivel-toggle" data-grupo="${escapeAttr(grupoToggle)}" data-id="${escapeAttr(p.id)}" aria-expanded="${aberto ? "true" : "false"}" aria-controls="${painelId}" title="${escapeAttr(rotulo)}">
                <span class="dept-caret" aria-hidden="true">${aberto ? "▾" : "▸"}</span>
                <span class="dept-nome">${escapeHtml(titulo)}</span>
              </button>
              <div class="dept-painel recolhivel-painel" id="${painelId}" ${aberto ? "" : "hidden"}>
                ${aberto ? corpoBoletoParcial(p, `${grupoToggle}-lista-${p.id}`) : ""}
              </div>
            </div>
          `;
        }).join("")}
      </div>
    `;
  }

  function retorno() {
    const par = parcialAtual();
    const pedido = par?.pedidoProvedor;
    const espera = par?.flashEspera;
    const falhou = !!(pedido && espera === "falhou");
    const ok = !!(pedido && (espera === "ok" || par?.retornoConferido));
    if (pedido && !ok && !falhou) iniciarEsperaRetorno();
    const temBoleto = !!(ok && par?.boleto);
    const envio = temBoleto ? linhasFlashConfirmadas(par) : [];
    const titleAtualizar = "Consulta o pedido no provedor e atualiza taxa e boleto";
    const btnAtualizarCls = !ok && pedido ? "btn btn-primary" : "btn";
    return `
      <div class="page-head">
        <h1>Boleto</h1>
        <div class="actions">
          <button class="${btnAtualizarCls}" data-act="atualizar-retorno" ${pedido ? "" : "disabled"} title="${pedido ? titleAtualizar : "Confirmar envio ao Flash gera o pedido desta parcial"}">Atualizar retorno</button>
          <button class="btn" data-act="baixar-boleto" ${temBoleto ? "" : "disabled"} title="${temBoleto ? "Baixar boleto desta parcial" : "Boleto depois do retorno Flash"}">Baixar boleto</button>
          <button class="btn${ok ? " btn-primary" : ""}" data-act="ir-omie" ${ok ? "" : "disabled"} title="${ok ? "Seguir ao Omie com o que esta parcial confirmou" : "Aguardando o retorno deste pedido"}">Seguir ao Omie</button>
        </div>
      </div>
      ${pipeline("retorno")}
      ${temBoleto ? `
        ${previewBoleto(par, envio)}
        ${envio.length ? accordionDeptos(envio, { grupo: "boleto", titulo: "Nesta parcial" }) : ""}
      ` : `
      <div class="espera-flash${falhou ? " is-falhou" : ""}" aria-live="polite">
        ${!pedido ? `
          <div class="status">Ainda não há pedido nesta parcial</div>
          <div class="sub">Confirmar envio ao Flash na etapa 2 gera a espera desta parcial. Parciais anteriores permanecem no mês.</div>
        ` : falhou ? `
          <div class="status">Não foi possível obter o retorno</div>
          <div class="sub">A espera falhou ou o estado não bate com o pedido. Atualize o retorno — consulta o mesmo pedido, não um segundo canal.</div>
        ` : `
          <div class="spinner" aria-hidden="true"></div>
          <div class="status">Aguardando o retorno deste pedido</div>
          <div class="sub">Espera do retorno Flash desta parcial</div>
        `}
      </div>
      `}
    `;
  }

  function qtde(n, um, varios) {
    return `${n} ${n === 1 ? um : varios}`;
  }

  function ordemDeposito(l) {
    if (l.beneficio === D.NOME_COMIDA) return 0;
    if (l.beneficio === D.NOME_GASOLINA || l.beneficio === D.NOME_ONIBUS || l.onibus) return 1;
    if (l.beneficio === D.NOME_FLEXIVEL) return 2;
    return 3;
  }

  function linhasOmieDoDept(flashOk, deptId) {
    return flashOk
      .filter((l) => pessoa(l.pessoaId).departamento === deptId)
      .sort((a, b) => {
        const na = pessoa(a.pessoaId).nome.localeCompare(pessoa(b.pessoaId).nome, "pt-BR");
        if (na) return na;
        return ordemDeposito(a) - ordemDeposito(b);
      });
  }

  function pecaOmieTxt(l) {
    return l ? `${l.beneficio} ${displayValor(l)}` : null;
  }

  function rowOmiePessoa(pessoaId, pecas) {
    const p = pessoa(pessoaId);
    const multi = pecas.find((l) => l.beneficio === D.NOME_COMIDA) || null;
    const flex = pecas.find((l) => l.beneficio === D.NOME_FLEXIVEL) || null;
    const gas = pecas.find((l) => l.beneficio === D.NOME_GASOLINA) || null;
    const oni = pecas.find((l) => l.onibus || l.beneficio === D.NOME_ONIBUS) || null;
    if (p.regime === "PJ") {
      return {
        pessoaId,
        nome: p.nome,
        regime: p.regime,
        discriminado: D.NOME_FLEXIVEL,
        valor: flex ? displayValor(flex) : "a informar",
        valorCentavos: pecaCentavos(flex),
      };
    }
    const escolha = gas || oni;
    const usadas = [escolha, multi].filter(Boolean);
    const temInformar = usadas.some((l) => displayValor(l) === "a informar");
    const cents = usadas.map(pecaCentavos);
    const somaOk = !temInformar && cents.every((c) => c != null);
    const centavos = somaOk ? cents.reduce((a, c) => a + c, 0) : null;
    return {
      pessoaId,
      nome: p.nome,
      regime: p.regime,
      discriminado: [pecaOmieTxt(escolha), pecaOmieTxt(multi)].filter(Boolean).join(" + ") || "—",
      valor: somaOk ? D.brl(centavos) : "a informar",
      valorCentavos: centavos,
    };
  }

  function pessoasOmie(linhas) {
    const ids = [];
    linhas.forEach((l) => {
      if (!ids.includes(l.pessoaId)) ids.push(l.pessoaId);
    });
    return ids.map((id) => rowOmiePessoa(id, linhas.filter((l) => l.pessoaId === id)));
  }

  function painelOmieDept(pessoas) {
    if (!pessoas.length) {
      return `<p class="empty-inline">Sem pessoas neste departamento.</p>`;
    }
    return `
      <div class="table-wrap dept-linhas-wrap">
        <table class="dept-linhas">
          <colgroup>
            <col class="col-omie-pessoa" />
            <col class="col-omie-beneficio" />
            <col class="col-omie-valor" />
          </colgroup>
          <thead>
            <tr>
              <th>Colaborador</th>
              <th>Benefício</th>
              <th>Valor</th>
            </tr>
          </thead>
          <tbody>
            ${pessoas.map((r) => `<tr>
                <td>${r.nome}<div class="sub">${r.regime}</div></td>
                <td class="omie-disc">${r.discriminado}</td>
                <td class="${clsValor(r)} omie-soma">${displayValor(r)}</td>
              </tr>`).join("")}
          </tbody>
        </table>
      </div>
    `;
  }

  function grupoAbertos(grupo) {
    if (!abertosPorGrupo[grupo]) abertosPorGrupo[grupo] = new Set();
    return abertosPorGrupo[grupo];
  }

  function accordionDeptos(linhasFonte, { grupo, titulo, envelopar = true }) {
    const abertos = grupoAbertos(grupo);
    const blocos = D.DEPTS.map((d) => {
      const linhas = linhasOmieDoDept(linhasFonte, d.id);
      const pessoas = pessoasOmie(linhas);
      const aberto = abertos.has(d.id);
      const temValor = linhas.some((l) => typeof l.valorCentavos === "number");
      const somaTxt = linhas.length
        ? (temValor ? D.brl(somaCentavos(linhas)) : "a informar")
        : D.brl(0);
      const somaCls = linhas.length ? clsSoma(somaTxt) : "zero";
      return { d, linhas, pessoas, nPessoas: pessoas.length, aberto, somaTxt, somaCls };
    }).filter((b) => b.nPessoas > 0);
    const somaGeral = linhasFonte.length ? txtSoma(linhasFonte) : "—";
    const lista = blocos.length ? `
      <div class="dept-lista">
        ${blocos.map(({ d, linhas, pessoas, nPessoas, aberto, somaTxt, somaCls }) => {
          const painelId = `${grupo}-dept-${d.id}`;
          const rotulo = aberto ? `Recolher ${d.nome}` : `Abrir ${d.nome}`;
          return `
            <div class="dept-bloco${aberto ? " is-open" : ""}">
              <button type="button" class="dept-btn" data-act="dept-toggle" data-grupo="${grupo}" data-dept="${d.id}" aria-expanded="${aberto ? "true" : "false"}" aria-controls="${painelId}" title="${rotulo}">
                <span class="dept-caret" aria-hidden="true">${aberto ? "▾" : "▸"}</span>
                <span class="dept-nome">${d.nome}</span>
                <span class="dept-meta">${qtde(nPessoas, "pessoa", "pessoas")} ·</span>
                <span class="dept-soma ${somaCls}">${somaTxt}</span>
              </button>
              <div class="dept-painel" id="${painelId}" ${aberto ? "" : "hidden"}>
                ${painelOmieDept(pessoas)}
              </div>
            </div>
          `;
        }).join("")}
        <div class="total-row dept-soma-geral"><span class="${clsSoma(somaGeral)}">${somaGeral}</span></div>
      </div>
    ` : `<p class="empty-inline">Ninguém nesta parcial.</p>`;
    if (!envelopar) return lista;
    return `
      <div class="card">
        <h2>${titulo}</h2>
        <div class="body">${lista}</div>
      </div>
    `;
  }

  function omie() {
    const par = parcialAtual();
    const flashOk = linhasFlashConfirmadas(par);
    const podeLancar = flashOk.length > 0 && !(par && par.lancamentoOmie);
    const email = par?.emailDiretores;
    return `
      <div class="page-head">
        <h1>Omie</h1>
        <div class="actions">
          <button class="btn btn-primary" data-act="confirmar-omie" ${podeLancar && mesAberto() ? "" : "disabled"} title="${podeLancar ? "Lança só esta parcial" : (par?.lancamentoOmie ? "Esta parcial já foi lançada" : "Nada confirmado no Flash nesta parcial")}">Lançar no Omie</button>
        </div>
      </div>
      ${pipeline("omie")}
      ${par ? `<p class="parcial-meta">${qtde(par.pessoaIds.length, "pessoa", "pessoas")} nesta parcial. Parciais anteriores não se apagam.</p>` : `<p class="empty-inline">Nenhuma parcial em curso. Envie conferidas ativas ao Flash primeiro.</p>`}
      ${par ? accordionDeptos(flashOk, { grupo: "omie", titulo: "Nesta parcial" }) : ""}
      ${par ? listaBoletosRecolhidos("omie-boleto", (p) => p.id === par.id && !!p.boleto) : ""}
      ${email ? `
        <div class="card email-card">
          <h2>E-mail enviado aos diretores</h2>
          <div class="body">
            <div class="email-meta">
              <div><b>Para</b> ${email.para.join(", ")}</div>
              <div><b>Assunto</b> ${escapeAttr(email.assunto)}</div>
              <div><b>Quando</b> ${escapeAttr(email.quando)}</div>
            </div>
            <p>O crédito no Flash aprovado. Favor verificar e aprovar o pagamento.</p>
            <a class="btn btn-primary" href="${email.href}">Abrir etapa 5 · Autorizar pagamento</a>
          </div>
        </div>
      ` : ""}
    `;
  }

  function diretores() {
    const par = parcialAtual();
    const oks = par?.autorizacoes || [];
    const flashOk = linhasFlashConfirmadas(par);
    const principal = flashOk.length ? txtSoma(flashOk) : "—";
    const nPessoas = par ? par.pessoaIds.length : 0;
    return `
      <div class="page-head">
        <h1>Diretores</h1>
        <div class="actions">
          <button class="btn btn-primary" data-act="autorizar" ${oks.length >= 2 || !par?.lancamentoOmie ? "disabled" : ""} title="${par?.lancamentoOmie ? "Autorizar o pagamento desta parcial" : "Depois do Omie"}">Autorizar pagamento</button>
        </div>
      </div>
      ${pipeline("diretores")}
      <div class="doc">
        <div class="doc-head">
          <h2>Pagamento de benefícios</h2>
          <div class="pagto-meta">
            <div><b>mês de competência</b> ${D.ciclo.competencia}</div>
            <div><b>quantidade de colaboradores que serão pagos</b> ${nPessoas} (esta parcial)</div>
          </div>
        </div>
        <div class="doc-body">
          <p>O crédito no Flash aprovado. Favor verificar e aprovar o pagamento.</p>
          <div class="kpis">
            <div class="kpi"><div class="lbl">Principal</div><div class="val ${clsSoma(principal)}">${principal}</div><div class="hint">esta parcial</div></div>
            <div class="kpi"><div class="lbl">Autorizações</div><div class="val">${oks.length}/2</div><div class="hint">${oks.length >= 2 ? "autorizado" : "faltam diretores"}</div></div>
          </div>
          ${oks.length ? `<div class="note">${oks.map((o) => `${o.quando} · ${o.ator} autorizou`).join(" · ")}</div>` : ""}
          ${listaBoletosRecolhidos("diretores-boleto", (p) => !!(p.boleto && p.lancamentoOmie)) || `<p class="empty-inline">Ainda sem boleto nesta etapa. Depois do Omie, o boleto aparece recolhido para conferência.</p>`}
        </div>
      </div>
    `;
  }

  function rotuloParcial(par, i) {
    const n = par.pessoaIds.length;
    const oks = (par.autorizacoes || []).length;
    const omie = par.lancamentoOmie ? "Omie lançado" : "Omie pendente";
    const nCmp = comprovantesDaParcial(par).length;
    const cmp = nCmp ? qtde(nCmp, "comprovante", "comprovantes") : "sem comprovante";
    return `${ordinalParcial(i)} · ${qtde(n, "colaborador", "colaboradores")} · ${omie} · ${oks}/2 autorizações · ${cmp}`;
  }

  function listaParciaisMes() {
    const lista = todasParciais();
    if (!lista.length) {
      return `<p class="empty-inline">Ainda sem parciais neste mês.</p>`;
    }
    return `
      <div class="card">
        <h2>Parciais do mês</h2>
        <div class="body parciais-lista">
          ${lista.map((p, i) => `
            <div class="parcial-row${p.id === D.ciclo.parcialAtualId ? " is-atual" : ""}">
              <div class="parcial-txt">${rotuloParcial(p, i)}</div>
              <div class="parcial-acoes">
                <button class="btn btn-sm" type="button" data-act="baixar-boleto" data-parcial="${p.id}" ${p.boleto ? "" : "disabled"}>Baixar boleto</button>
                <button class="btn btn-sm" type="button" data-act="anexar-comprovante" data-parcial="${p.id}" ${(p.autorizacoes || []).length >= 2 ? "" : "disabled"}>Anexar comprovante</button>
              </div>
            </div>
          `).join("")}
        </div>
      </div>
    `;
  }

  function urlPreviewComprovante(c) {
    if (c?.objectUrl) return c.objectUrl;
    const qs = new URLSearchParams({
      nome: c?.nome || "",
      data: c?.data || "",
      ator: c?.ator || D.OPERADOR.nome,
      bucket: c?.bucket || "",
      caminho: c?.caminho || "",
    });
    return `comprovante-preview.html?${qs.toString()}`;
  }

  function chaveComprovante(item) {
    const { origem, par, idx, c } = item;
    return c.idOpaco || `${origem}-${par?.id || "mes"}-${idx}`;
  }

  function itemComprovante(item) {
    const { c, origem, par, ordinal, idx } = item;
    const parAttr = origem === "parcial" && par ? `data-parcial="${escapeAttr(par.id)}"` : `data-mes="1"`;
    const rotulo = origem === "parcial" ? ordinal : "fechamento do mês";
    const id = chaveComprovante(item);
    const aberto = grupoAbertos("banco-cmp").has(id);
    const painelId = `cmp-${id}`;
    const src = urlPreviewComprovante(c);
    const titulo = `${c.nome || "comprovante"} · ${c.data || ""}`.trim();
    const rotuloBtn = aberto ? "Recolher comprovante" : "Abrir comprovante";
    return `
      <li class="comprovante-item dept-bloco${aberto ? " is-open" : ""}">
        <button type="button" class="dept-btn" data-act="recolhivel-toggle" data-grupo="banco-cmp" data-id="${escapeAttr(id)}" aria-expanded="${aberto ? "true" : "false"}" aria-controls="${painelId}" title="${escapeAttr(rotuloBtn)}">
          <span class="dept-caret" aria-hidden="true">${aberto ? "▾" : "▸"}</span>
          <span class="dept-nome">${escapeHtml(titulo)}</span>
        </button>
        <div class="dept-painel recolhivel-painel" id="${painelId}" ${aberto ? "" : "hidden"}>
          ${aberto ? `
            <dl class="detalhe-dl comprovante-dl">
              <div><dt>Quem anexou</dt><dd>${escapeHtml(c.ator || D.OPERADOR.nome)}</dd></div>
              <div><dt>Parcial</dt><dd>${escapeHtml(rotulo)}</dd></div>
              <div><dt>Onde</dt><dd>
                <div>${escapeHtml(c.bucket)}</div>
                <div class="path">${escapeHtml(c.caminho)}</div>
              </dd></div>
            </dl>
            <div class="boleto-frame">
              ${toolbarArquivo({
                baixarAct: "baixar-comprovante",
                baixarAttr: `${parAttr} data-idx="${idx}"`,
                hrefAbrir: src,
                tipBaixar: "Baixar comprovante",
                tipAbrir: "Abrir em outra aba",
              })}
              <iframe title="Pré-visualização do comprovante" src="${escapeAttr(src)}"></iframe>
            </div>
          ` : ""}
        </div>
      </li>
    `;
  }

  function blocoComprovantesMes() {
    const podeMes = todasParciais().some((p) => (p.autorizacoes || []).length >= 2);
    const lista = comprovantesDoMes();
    const itens = lista.length
      ? `<ul class="comprovante-lista">${lista.map(itemComprovante).join("")}</ul>`
      : `<p class="empty-inline">Nenhum comprovante anexado neste fechamento. Anexe PDF ou imagem — pode haver vários.</p>`;
    return `
      <div class="comprovante">
        <div class="comprovante-head">
          <h2>Comprovantes do mês</h2>
          <button class="btn btn-primary" type="button" data-act="anexar-comprovante" data-mes="1" ${podeMes ? "" : "disabled"}>Anexar comprovante</button>
        </div>
        <div class="body">${itens}</div>
      </div>
    `;
  }

  function sumarioMesParciais() {
    const lista = todasParciais();
    const rotulo = sumarioMesAberto ? "Recolher sumário do mês" : "Abrir sumário do mês";
    const interno = lista.length
      ? lista.map((p, i) => `
          <div class="parcial-sumario">
            <h3>${ordinalParcial(i)} · ${qtde(p.pessoaIds.length, "colaborador", "colaboradores")}</h3>
            ${accordionDeptos(linhasFlashConfirmadas(p), { grupo: `banco-${p.id}`, envelopar: false })}
          </div>
        `).join("")
      : `<p class="empty-inline">Ainda sem parciais neste mês.</p>`;
    return `
      <div class="card sumario-mes${sumarioMesAberto ? " is-open" : ""}">
        <button type="button" class="sumario-mes-btn" data-act="sumario-mes-toggle" aria-expanded="${sumarioMesAberto ? "true" : "false"}" aria-controls="sumario-mes-painel" title="${rotulo}">
          <span class="dept-caret" aria-hidden="true">${sumarioMesAberto ? "▾" : "▸"}</span>
          <span class="dept-nome">Sumário do mês com todas as parciais</span>
          <span class="dept-meta">${qtde(lista.length, "parcial", "parciais")}</span>
        </button>
        <div class="sumario-mes-painel" id="sumario-mes-painel" ${sumarioMesAberto ? "" : "hidden"}>
          ${interno}
        </div>
      </div>
    `;
  }

  function banco() {
    const boletos = listaBoletosRecolhidos("banco-boleto", (p) => !!p.boleto);
    return `
      <div class="page-head">
        <h1>Banco</h1>
      </div>
      ${pipeline("banco")}
      ${boletos || `<p class="empty-inline">Ainda sem boleto neste mês.</p>`}
      ${blocoComprovantesMes()}
    `;
  }

  function pessoas() {
    return `
      <div class="page-head">
        <div>
          <h1>Pessoas</h1>
          <p>O perfil escreve a elegibilidade depois da conferência. CLT não escolhe Multibenefícios — só ônibus ou auxílio gasolina. PJ: Flexível, sem essa escolha. Trazer da planilha pré-preenche — não mata o Excel no dia 1.</p>
        </div>
        <div class="actions">
          <button class="btn" data-act="planilha">Gerar planilha</button>
        </div>
      </div>
      <div class="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Colaborador</th>
              <th>Regime</th>
              <th>Departamento</th>
                <th>Escolha de transporte</th>
              <th>Faixa</th>
              <th>No corte</th>
            </tr>
          </thead>
          <tbody>
            ${D.pessoas.map((p) => `
              <tr>
                <td>${p.nome}<div class="sub">${p.email}</div></td>
                <td>${p.regime}</td>
                <td>${deptNome(p.departamento)}</td>
                <td>${p.transporte === "ônibus" ? "cartão de ônibus" : (p.transporte === "gasolina" ? "auxílio gasolina" : "—")}${p.regime === "PJ" ? `<div class="sub">sem escolha · Flexível</div>` : (p.transporte ? `<div class="sub">escolha · Multibenefícios é padrão</div>` : "")}</td>
                <td>${p.faixa || "—"}</td>
                <td>${p.ativa ? "ativa" : "desligada"}</td>
              </tr>
            `).join("")}
          </tbody>
        </table>
      </div>
    `;
  }

  function matchBeneficio(r) {
    const f = filtros.beneficio;
    if (!f) return true;
    const padrao = r.regime === "CLT";
    const escolha = r.beneficio;
    if (f === D.NOME_COMIDA) return padrao;
    if (f === "adicional-onibus") return padrao && !!r.onibus;
    if (f === "adicional-gasolina") return padrao && escolha === D.NOME_GASOLINA;
    if (f === D.NOME_ONIBUS) return !!r.onibus || escolha === D.NOME_ONIBUS;
    if (f === D.NOME_GASOLINA) return escolha === D.NOME_GASOLINA;
    if (f === D.NOME_FLEXIVEL) return escolha === D.NOME_FLEXIVEL;
    return escolha === f;
  }

  function filtrar(rows) {
    const q = filtros.busca.trim().toLowerCase();
    return rows.filter((r) => {
      if (q && !r.colaborador.toLowerCase().includes(q) && !r.email.toLowerCase().includes(q)) return false;
      if (filtros.regime && r.regime !== filtros.regime) return false;
      if (!matchBeneficio(r)) return false;
      if (filtros.departamento && r.departamento !== filtros.departamento) return false;
      return true;
    });
  }

  function tabela(rows, { acoes, lote }) {
    const allOn = lote && rows.length > 0 && rows.every((r) => selecionados.has(r.id));
    return `
      <div class="table-wrap">
        <table>
          <colgroup>
            ${lote ? `<col class="col-check" />` : ""}
            <col class="col-pessoa" />
            <col class="col-regime" />
            <col class="col-beneficio" />
            <col class="col-dias" />
            <col class="col-valor" />
            <col class="col-dept" />
            <col class="col-sit" />
            ${acoes ? `<col class="col-acoes" />` : ""}
          </colgroup>
          <thead>
            <tr>
              ${lote ? `<th class="check"><input type="checkbox" data-act="sel-visiveis" aria-label="Marcar todos" title="Marcar todos" ${allOn ? "checked" : ""} /></th>` : ""}
              <th>Colaborador</th>
              <th>Regime</th>
              <th>Benefício / escolha</th>
              <th>Dias úteis</th>
              <th>Valor</th>
              <th>Departamento</th>
              <th class="sit">Situação</th>
              ${acoes ? `<th class="acoes">Ações</th>` : ""}
            </tr>
          </thead>
          <tbody>
            ${rows.map((r) => {
              const onibus = !!r.onibus;
              const excecao = r.situacao === SIT.A_CONFERIR;
              const dias = r.regime === "CLT" && r.diasUteis != null ? r.diasUteis : "—";
              const checked = selecionados.has(r.id);
              const btns = acoes ? `
                <div class="row-actions">
                  <button class="btn btn-sm" data-act="detalhe" data-line="${r.id}">Detalhes</button>
                </div>` : "";
              return `<tr class="${onibus ? "row-onibus" : ""} ${excecao ? "row-excecao" : ""} ${checked ? "row-sel" : ""}">
                ${lote ? `<td class="check"><input type="checkbox" data-act="sel-linha" data-line="${r.id}" ${checked ? "checked" : ""} /></td>` : ""}
                <td>${r.colaborador}<div class="sub">${r.email}</div></td>
                <td>${chipRegime(r.regime)}</td>
                <td class="beneficio">${cellBeneficio(r)}</td>
                <td class="num">${dias}</td>
                <td class="${clsValor(r)}">${displayValor(r)}</td>
                <td>${r.deptNome}</td>
                <td class="sit">${chipSit(r)}</td>
                ${acoes ? `<td class="acoes">${btns}</td>` : ""}
              </tr>`;
            }).join("")}
          </tbody>
        </table>
      </div>
    `;
  }

  function fmtInputCentavos(c) {
    return (c / 100).toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  }

  function parseBrl(s) {
    const t = String(s ?? "").trim().replace(/R\$\s?/g, "").replace(/\s/g, "").replace(/\./g, "").replace(",", ".");
    if (!t) return null;
    const n = Number(t);
    if (!Number.isFinite(n) || n < 0) return null;
    return Math.round(n * 100);
  }

  function seedEscolhaCentavos(transporte, faixa) {
    if (transporte === "ônibus") return D.SEMENTE.onibusCentavos;
    if (transporte === "gasolina") return D.SEMENTE.gasolinaCentavos[faixa] ?? null;
    return null;
  }

  function syncValorEscolhaFromEscolha() {
    const input = document.getElementById("valor-escolha");
    if (!input || input.dataset.regime === "PJ") return;
    const transporte = document.querySelector("input[name='escolha-trans']:checked")?.value;
    const faixa = document.getElementById("faixa-gasolina")?.value || "";
    const c = seedEscolhaCentavos(transporte, faixa);
    input.value = c != null ? fmtInputCentavos(c) : "";
    syncTotalDetalhe();
  }

  function syncMultiFromDias() {
    const out = document.getElementById("multi-valor");
    const diasEl = document.getElementById("dias-uteis");
    if (!out || !diasEl) return;
    const diario = Number(out.dataset.diarioCentavos);
    const dias = parseInt(diasEl.value, 10);
    if (!Number.isFinite(diario) || !Number.isFinite(dias) || dias <= 0) {
      if (out.dataset.ausente === "1") {
        out.textContent = "a informar";
        out.dataset.centavos = "";
      }
      syncTotalDetalhe();
      return;
    }
    if (out.dataset.ausente === "1") {
      syncTotalDetalhe();
      return;
    }
    const c = diario * dias;
    out.textContent = D.brl(c);
    out.dataset.centavos = String(c);
    syncTotalDetalhe();
  }

  function syncTotalDetalhe() {
    const out = document.getElementById("total-valor");
    if (!out) return;
    const multiEl = document.getElementById("multi-valor");
    const multiC = multiEl?.dataset.centavos !== "" && Number.isFinite(Number(multiEl?.dataset.centavos))
      ? Number(multiEl.dataset.centavos)
      : null;
    const escolhaC = parseBrl(document.getElementById("valor-escolha")?.value ?? "");
    if (multiC == null || escolhaC == null) {
      out.textContent = "a informar";
      out.classList.add("val-ph");
      return;
    }
    out.textContent = D.brl(multiC + escolhaC);
    out.classList.remove("val-ph");
  }

  function diasPlanilhaCompetencia() {
    const daLinha = linhasDoMes().map((l) => l.diasUteisPlanilha).find((n) => n != null);
    if (daLinha != null) return daLinha;
    if (!mesAberto()) return null;
    return D.ciclo.carga?.diasPlanilha ?? null;
  }

  function renderCalendarioPopover() {
    const c = compet();
    const list = D.COMPETENCIAS;
    const idx = list.findIndex((x) => x.id === c.id);
    const ant = idx > 0 ? list[idx - 1] : null;
    const prox = idx < list.length - 1 ? list[idx + 1] : null;
    const [ano, mes] = c.id.split("-").map(Number);
    const cal = D.calendarioNacional(ano, mes);
    const planilha = diasPlanilhaCompetencia();
    const diverge = planilha != null && planilha !== cal.diasUteis;
    const feriados = cal.dias.filter((d) => d.nomeFeriado);
    const vazios = Array.from({ length: cal.padInicio }, () => `<span class="cal-dia is-vazio" aria-hidden="true"></span>`);
    const celulas = cal.dias.map((d) => {
      const cls = d.util ? "is-util" : "is-mutado";
      const extra = d.feriado ? " is-feriado" : d.weekend ? " is-fim-semana" : "";
      const titulo = d.nomeFeriado ? `${d.dia} · ${d.nomeFeriado}` : `${d.dia}`;
      const aria = d.util
        ? `${d.dia}, dia útil`
        : d.nomeFeriado
          ? `${d.dia}, feriado nacional, ${d.nomeFeriado}`
          : `${d.dia}, ${d.weekend ? "fim de semana" : "não útil"}`;
      return `<span class="cal-dia ${cls}${extra}" title="${escapeAttr(titulo)}" aria-label="${escapeAttr(aria)}">${d.dia}</span>`;
    });
    const meses = list.map((x) => {
      const on = x.id === c.id;
      const nome = x.rotulo.replace(/\/\d+$/, "");
      return `<button type="button" class="comp-mes${on ? " is-on" : ""}${x.aberta ? "" : " is-fechada"}" role="option" aria-selected="${on ? "true" : "false"}" data-act="cal-sel" data-comp="${x.id}" title="${x.rotulo}${x.aberta ? "" : " · fechada"}">${nome}</button>`;
    }).join("");
    return `
      <div class="comp-popover" id="comp-popover" role="dialog" aria-label="Calendário da competência ${c.rotulo}">
        <div class="comp-pop-nav">
          ${ant
            ? `<button type="button" class="ciclo-seta" data-act="cal-ant" title="Mês anterior: ${ant.rotulo}" aria-label="Mês anterior: ${ant.rotulo}">‹</button>`
            : `<span class="ciclo-seta is-off" aria-disabled="true" title="Mês anterior">‹</span>`}
          <strong id="cal-titulo">${c.rotulo}</strong>
          ${prox
            ? `<button type="button" class="ciclo-seta" data-act="cal-prox" title="Próximo mês: ${prox.rotulo}" aria-label="Próximo mês: ${prox.rotulo}">›</button>`
            : `<span class="ciclo-seta is-off" aria-disabled="true" title="Próximo mês">›</span>`}
        </div>
        <div class="comp-meses" role="listbox" aria-label="Competências">
          ${meses}
        </div>
        <p class="cal-resumo">${cal.diasUteis} dias úteis · calendário nacional</p>
        ${diverge ? `<p class="cal-divergencia"><span>planilha: ${planilha}</span> vs <span>calendário: ${cal.diasUteis}</span></p>` : ""}
        <div class="cal-grid" role="grid" aria-readonly="true" aria-label="Dias do mês">
          ${D.DIAS_SEMANA.map((n) => `<span class="cal-dow" role="columnheader">${n}</span>`).join("")}
          ${vazios.join("")}
          ${celulas.join("")}
        </div>
        ${feriados.length ? `<p class="cal-feriados">${feriados.map((d) => `${d.dia} · ${d.nomeFeriado}`).join(" · ")}</p>` : ""}
      </div>
    `;
  }

  function renderModal() {
    if (!modal) return "";
    const pessoaId = typeof modal === "string" ? modal : modal.pessoaId;
    const r = rowPessoa(pessoaId);
    const p = pessoa(pessoaId);
    if (!p || !r) return "";
    const clt = p.regime === "CLT";
    const cal = clt ? (r.diasUteis ?? D.ciclo.diasUteis) : null;
    const aberto = mesAberto();
    const valorSeed = clt
      ? (r.escolhaValorCentavos != null ? r.escolhaValorCentavos : seedEscolhaCentavos(p.transporte, p.faixa))
      : (r.valorAusente ? null : p.flexivelCentavos);
    const valorInput = valorSeed != null ? escapeAttr(fmtInputCentavos(valorSeed)) : "";
    const escolhaEditor = clt ? `
              <div class="escolha-edit" role="radiogroup" aria-label="Escolha de transporte">
                <label><input type="radio" name="escolha-trans" value="gasolina" ${p.transporte === "gasolina" ? "checked" : ""} ${aberto ? "" : "disabled"} /> Auxílio gasolina</label>
                <label><input type="radio" name="escolha-trans" value="ônibus" ${p.transporte === "ônibus" ? "checked" : ""} ${aberto ? "" : "disabled"} /> Cartão de ônibus</label>
              </div>
            ` : `${D.NOME_FLEXIVEL}`;
    const valorEditor = `
              <div class="valor-escolha-row">
                ${clt ? `<span class="faixa-bloco">
                  <select id="faixa-gasolina" aria-label="Faixa do auxílio gasolina" ${aberto ? "" : "disabled"}>
                    <option value="">Faixa</option>
                    ${Object.keys(D.SEMENTE.gasolinaCentavos).map((f) => `<option value="${escapeAttr(f)}" ${p.faixa === f ? "selected" : ""}>${f}</option>`).join("")}
                  </select>
                </span>` : ""}
                <input id="valor-escolha" class="campo-num" type="text" inputmode="decimal" placeholder="0,00" value="${valorInput}" data-regime="${p.regime}" ${aberto ? "" : "disabled"} />
              </div>
            `;
    const obs = r.observacoes || "";
    return `
      <div class="modal-bg">
        <div class="modal modal-detalhe" role="dialog" aria-labelledby="detalhe-titulo">
          <h3 id="detalhe-titulo">Detalhe do fechamento de benefício em ${compet().rotulo}</h3>
          <div class="body">
            <dl class="detalhe-dl">
              <div><dt>Colaborador</dt><dd>${p.nome}<div class="sub">${p.email}</div></dd></div>
              <div><dt>Regime</dt><dd>${p.regime} · ${deptNome(p.departamento)}</dd></div>
              <div><dt>Benefício / escolha</dt><dd>${escolhaEditor}</dd></div>
              ${clt ? `<div><dt>Multibenefícios</dt><dd><span id="multi-valor" class="${r.multiValorCentavos == null ? "val-ph" : ""}" data-diario-centavos="${p.diarioCentavos ?? ""}" data-centavos="${r.multiValorCentavos ?? ""}" data-ausente="${r.multiValorCentavos == null ? "1" : "0"}">${r.multiValor ?? "a informar"}</span></dd></div>` : ""}
              ${clt ? `<div><dt>Dias úteis · calendário</dt><dd><input id="dias-uteis" class="campo-num" type="number" inputmode="numeric" min="1" max="31" value="${cal ?? ""}" ${aberto ? "" : "disabled"} /></dd></div>` : ""}
              <div><dt>Valor da escolha</dt><dd>${valorEditor}</dd></div>
              ${clt ? `<div><dt>Total</dt><dd><span id="total-valor" class="${r.valorCentavos == null ? "val-ph" : ""}">${r.valor}</span></dd></div>` : ""}
              <div><dt>Situação</dt><dd>${chipSit(r)}</dd></div>
            </dl>
            <div class="obs-bloco">
              <label for="observacoes">Observações</label>
              <textarea id="observacoes" rows="3" placeholder="Opcional" ${aberto ? "" : "disabled"}>${escapeAttr(obs)}</textarea>
            </div>
          </div>
          <div class="foot">
            <button class="btn" data-act="fechar-modal">Fechar</button>
            <button class="btn btn-primary" data-act="conferir-detalhe" data-line="${pessoaId}" title="Marca conferido e abre o resumo Flash" ${!aberto ? "disabled" : ""}>Conferir</button>
          </div>
          ${aberto ? `<p class="detalhe-hint">Editar não confere. Fechar guarda a edição e a linha permanece <b>a conferir</b> até Conferir.</p>` : ""}
        </div>
      </div>
    `;
  }

  function escapeAttr(s) {
    return String(s ?? "").replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;");
  }

  function escapeHtml(s) {
    return String(s ?? "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  }

  function pedirArquivo(accept, onFile) {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = accept;
    input.addEventListener("change", () => {
      const f = input.files && input.files[0];
      if (f) onFile(f);
    });
    input.click();
  }

  function pdfBoletoMock(par) {
    const alvo = par || parcialAtual() || {};
    const pedido = alvo.pedidoProvedor || "pedido";
    const boleto = alvo.boleto || "boleto";
    const linhas = linhasFlashConfirmadas(alvo).length ? linhasFlashConfirmadas(alvo) : linhasDaParcial(alvo);
    const valor = linhas.length ? txtSoma(linhas) : "—";
    const linhasTxt = [
      "Morada · boleto de benefícios",
      compet().rotulo,
      `Pedido ${pedido}`,
      `Boleto ${boleto}`,
      `Principal ${valor}`,
      "Mock do protótipo — não é boleto bancário.",
    ];
    const esc = (s) => String(s).replace(/\\/g, "\\\\").replace(/\(/g, "\\(").replace(/\)/g, "\\)");
    const stream = linhasTxt.map((l, i) => `BT /F1 12 Tf 72 ${720 - i * 22} Td (${esc(l)}) Tj ET`).join("\n");
    const body = [
      "1 0 obj << /Type /Catalog /Pages 2 0 R >> endobj",
      "2 0 obj << /Type /Pages /Kids [3 0 R] /Count 1 >> endobj",
      "3 0 obj << /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Contents 4 0 R /Resources << /Font << /F1 5 0 R >> >> >> endobj",
      `4 0 obj << /Length ${stream.length} >> stream\n${stream}\nendstream endobj`,
      "5 0 obj << /Type /Font /Subtype /Type1 /BaseFont /Helvetica >> endobj",
    ].join("\n");
    return `%PDF-1.4\n${body}\ntrailer << /Root 1 0 R >>\n%%EOF`;
  }

  function baixarBoletoMock(par) {
    const alvo = par || parcialAtual();
    if (!alvo?.boleto) {
      toast("Ainda sem boleto nesta parcial.");
      return;
    }
    const blob = new Blob([pdfBoletoMock(alvo)], { type: "application/pdf" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `${alvo.boleto}.pdf`;
    a.click();
    URL.revokeObjectURL(a.href);
    toast("Boleto baixado (mock).");
  }

  function acharComprovante(t) {
    const idx = Number(t.dataset.idx);
    if (t.dataset.mes === "1") return (D.ciclo.comprovantesMes || [])[idx] || null;
    const par = parcialPorId(t.dataset.parcial) || parcialAtual();
    return comprovantesDaParcial(par)[idx] || null;
  }

  function pdfComprovanteMock(c) {
    const linhasTxt = [
      "Morada · comprovante de pagamento",
      c?.nome || "comprovante",
      c?.data || "",
      `Quem anexou ${c?.ator || D.OPERADOR.nome}`,
      c?.bucket || "",
      c?.caminho || "",
      "Mock do protótipo — não é comprovante bancário.",
    ];
    const esc = (s) => String(s).replace(/\\/g, "\\\\").replace(/\(/g, "\\(").replace(/\)/g, "\\)");
    const stream = linhasTxt.map((l, i) => `BT /F1 12 Tf 72 ${720 - i * 22} Td (${esc(l)}) Tj ET`).join("\n");
    const body = [
      "1 0 obj << /Type /Catalog /Pages 2 0 R >> endobj",
      "2 0 obj << /Type /Pages /Kids [3 0 R] /Count 1 >> endobj",
      "3 0 obj << /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Contents 4 0 R /Resources << /Font << /F1 5 0 R >> >> >> endobj",
      `4 0 obj << /Length ${stream.length} >> stream\n${stream}\nendstream endobj`,
      "5 0 obj << /Type /Font /Subtype /Type1 /BaseFont /Helvetica >> endobj",
    ].join("\n");
    return `%PDF-1.4\n${body}\ntrailer << /Root 1 0 R >>\n%%EOF`;
  }

  function baixarComprovanteMock(c) {
    if (!c) {
      toast("Comprovante não encontrado.");
      return;
    }
    if (c.objectUrl) {
      const a = document.createElement("a");
      a.href = c.objectUrl;
      a.download = c.nome || "comprovante";
      a.click();
      toast("Comprovante baixado.");
      return;
    }
    const blob = new Blob([pdfComprovanteMock(c)], { type: "application/pdf" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = c.nome || "comprovante.pdf";
    a.click();
    URL.revokeObjectURL(a.href);
    toast("Comprovante baixado (mock).");
  }

  function aplicarCarga(meio, nome) {
    D.ciclo.carga = { meio, nome };
  }

  /* Captura: ?demo=lista|flash|boleto|omie|diretores|banco (também boleto-falha|boleto-espera).
     Mesma parcial semente (vários depts, CLT+PJ, cifras de proto-semente). Não é entrevista. */
  const DEMO_PARCIAL_IDS = ["p1", "p2", "p3", "p5", "p8", "p9", "p10"];
  let demoAplicado = null;

  function parseDemo() {
    const q = location.search;
    if (q.indexOf("demo=") === -1) return null;
    if (q.indexOf("demo=boleto-falha") !== -1) return "boleto-falha";
    if (q.indexOf("demo=boleto-espera") !== -1) return "boleto-espera";
    if (q.indexOf("demo=boleto") !== -1) return "boleto";
    if (q.indexOf("demo=omie") !== -1) return "omie";
    if (q.indexOf("demo=diretores") !== -1) return "diretores";
    if (q.indexOf("demo=banco") !== -1) return "banco";
    if (q.indexOf("demo=flash") !== -1) return "flash";
    if (q.indexOf("demo=lista") !== -1) return "lista";
    return null;
  }

  function resetCicloDemo() {
    D.ciclo.parciais = [];
    D.ciclo.parcialAtualId = null;
    D.ciclo.comprovantesMes = [];
    D.ciclo.trilha = [];
    D.ciclo.passo = 0;
    D.ciclo.carga = null;
    D.linhas.forEach((l) => {
      l.situacao = SIT.A_CONFERIR;
      l.fluxo = "confirma";
      delete l.parcialId;
      l.motivos = [];
    });
    Object.keys(abertosPorGrupo).forEach((g) => abertosPorGrupo[g].clear());
    sumarioMesAberto = false;
  }

  function conferirDemoPessoas(ids) {
    const set = new Set(ids);
    D.linhas.forEach((l) => {
      if (!set.has(l.pessoaId) || l.valorAusente) return;
      const p = pessoa(l.pessoaId);
      if (!colaboradorAtivo(p) || !l.deposito) return;
      l.situacao = SIT.CONFERIDA;
      l.motivos = [];
    });
  }

  function abrirAccordionDemo(par) {
    const depts = new Set();
    (par?.pessoaIds || []).forEach((id) => {
      const p = pessoa(id);
      if (p?.departamento) depts.add(p.departamento);
    });
    ["flash", "boleto", "omie"].forEach((g) => {
      const set = grupoAbertos(g);
      depts.forEach((d) => set.add(d));
    });
    if (par?.id) {
      grupoAbertos("omie-boleto").add(par.id);
      grupoAbertos("diretores-boleto").add(par.id);
      grupoAbertos("banco-boleto").add(par.id);
      const listaGrupo = `omie-boleto-lista-${par.id}`;
      depts.forEach((d) => grupoAbertos(listaGrupo).add(d));
      [`diretores-boleto-lista-${par.id}`, `banco-boleto-lista-${par.id}`].forEach((g) => {
        depts.forEach((d) => grupoAbertos(g).add(d));
      });
    }
    comprovantesDaParcial(par).forEach((c, idx) => {
      grupoAbertos("banco-cmp").add(c.idOpaco || `parcial-${par.id}-${idx}`);
    });
  }

  function marcarParcialEnviada(par) {
    par.pedidoProvedor = par.pedidoProvedor || "pedido-set-2026-1";
    par.consolidadoPagamento = par.consolidadoPagamento || "pag-2026-09-1";
    linhasDaParcial(par).forEach((l) => {
      if (l.deposito && isConferida(l.situacao)) {
        l.fluxo = "flash";
        l.parcialId = par.id;
      }
    });
  }

  function aplicarDemo() {
    const modo = parseDemo();
    if (!modo || demoAplicado === modo) return;
    demoAplicado = modo;
    resetCicloDemo();
    if (modo === "lista") {
      D.ciclo.passo = 0;
      return;
    }

    conferirDemoPessoas(DEMO_PARCIAL_IDS);
    const par = abrirParcial(DEMO_PARCIAL_IDS);
    if (!par) return;

    if (modo === "flash") {
      D.ciclo.passo = 1;
      abrirAccordionDemo(par);
      return;
    }

    marcarParcialEnviada(par);
    D.ciclo.passo = 2;

    if (modo === "boleto-falha") {
      par.boleto = null;
      par.totalFeeCentavos = 0;
      par.flashEspera = "falhou";
      par.flashStatus = null;
      par.retornoConferido = false;
      return;
    }
    if (modo === "boleto-espera") {
      par.boleto = null;
      par.totalFeeCentavos = 0;
      par.flashEspera = "aguardando";
      par.flashStatus = null;
      par.retornoConferido = false;
      return;
    }

    par.boleto = "boleto-set-2026-1";
    par.totalFeeCentavos = D.FLASH_TAXA_PROTO_CENTAVOS;
    par.flashEspera = "ok";
    par.flashStatus = "billed";
    par.retornoConferido = true;

    if (modo === "boleto") {
      abrirAccordionDemo(par);
      return;
    }

    D.ciclo.passo = 3;
    if (modo === "omie") {
      abrirAccordionDemo(par);
      return;
    }

    par.lancamentoOmie = true;
    par.emailDiretores = {
      para: ["diretor.a@morada", "diretor.b@morada"],
      assunto: `Autorizar pagamento · ${D.ciclo.competencia}`,
      quando: "agora",
      href: "#/financeiro/beneficios/diretores",
    };
    D.ciclo.passo = 4;
    if (modo === "diretores") {
      abrirAccordionDemo(par);
      return;
    }

    par.autorizacoes = [
      { ator: "diretor.a@morada", quando: "15/09/2026" },
      { ator: "diretor.b@morada", quando: "15/09/2026" },
    ];
    par.comprovantes = [
      {
        nome: "comprovante-banco.pdf",
        data: "15/09/2026",
        ator: D.OPERADOR.nome,
        bucket: "bucket de comprovantes",
        caminho: "morada/beneficios/2026-09/comprovante-banco.pdf",
        idOpaco: "obj-cmp-7k2n9q",
      },
      {
        nome: "comprovante-ted.png",
        data: "16/09/2026",
        ator: D.OPERADOR.nome,
        bucket: "bucket de comprovantes",
        caminho: "morada/beneficios/2026-09/comprovante-ted.png",
        idOpaco: "obj-cmp-8m3p1r",
      },
    ];
    D.ciclo.passo = 5;
    abrirAccordionDemo(par);
  }

  function paint() {
    aplicarDemo();
    const parts = parseHash();
    let crumbs = crumbsLista();
    let body = lista();

    if (parts[0] === "pessoas") {
      crumbs = `<b>Pessoas</b>`;
      body = pessoas();
    } else if (parts[0] === "financeiro") {
      const view = parts[2];
      if (view === "ciclo") {
        crumbs = crumbsEtapa("Ciclo do mês");
        body = ciclo();
      } else if (view === "confirma") {
        crumbs = crumbsLista();
        body = confirma();
      } else if (view === "flash" || view === "integracao-provedor") {
        crumbs = crumbsEtapa("Flash");
        body = flash();
      } else if (view === "retorno") {
        crumbs = crumbsEtapa("Boleto");
        body = retorno();
      } else if (view === "omie" || view === "integracao-financeiro") {
        crumbs = crumbsEtapa("Omie");
        body = omie();
      } else if (view === "diretores") {
        crumbs = crumbsEtapa("Diretores");
        body = diretores();
      } else if (view === "banco") {
        crumbs = crumbsEtapa("Banco");
        body = banco();
      } else {
        crumbs = crumbsLista();
        body = lista();
      }
    }
    $app.innerHTML = shell(parts, crumbs, body);
  }

  function findLine(id) {
    return linhasDoMes().find((l) => l.id === id);
  }

  function linhasSelecionadas() {
    return linhasDoMes().filter((l) => selecionados.has(l.pessoaId));
  }

  function conferirLinha(line) {
    if (!mesAberto() || !line || !podeBulkConferir(line)) return false;
    line.situacao = SIT.CONFERIDA;
    line.motivos = [];
    return true;
  }

  function idsProntosParaFlash(pessoaIds) {
    return [...new Set(pessoaIds || [])].filter((id) => {
      if (!colaboradorAtivo(pessoa(id))) return false;
      if (pessoaIncompleta(id)) return false;
      return linhasDaPessoa(id).some((l) => l.deposito && isConferida(l.situacao) && !jaNoPedidoFlash(l));
    });
  }

  function marcarEEnviar(ids, rotulo) {
    if (!mesAberto()) {
      toast("Competência fechada. Só leitura.");
      return;
    }
    const alvo = [...new Set(ids || [])].filter((id) => colaboradorAtivo(pessoa(id)));
    let puladas = 0;
    alvo.forEach((pid) => {
      const conferiveis = linhasConferiveisDaPessoa(pid);
      if (!conferiveis.length) {
        const ja = linhasDaPessoa(pid).some((l) => l.deposito && isConferida(l.situacao));
        if (!ja) puladas += 1;
        return;
      }
      conferiveis.forEach((line) => conferirLinha(line));
    });
    const destino = idsProntosParaFlash(alvo);
    if (!destino.length) {
      toast(puladas
        ? "Nada a enviar: preencha o benefício. A conferir não entra no Flash."
        : "Nada conferido pendente. A conferir permanece na lista.");
      paint();
      return;
    }
    const par = abrirParcial(destino);
    selecionados.clear();
    modal = null;
    const nomes = par.pessoaIds.map((id) => pessoa(id)?.nome).filter(Boolean).join(", ");
    registrarEsteira("conferiu", nomes);
    const quem = rotulo || `${par.pessoaIds.length} colaborador(es)`;
    toast(`${quem} · conferido(s). Grupo no resumo Flash — Confirmar envio dispara o provedor.`);
    location.hash = "#/financeiro/beneficios/flash";
  }

  function lerEdicaoDetalhe(p) {
    const observacoes = document.getElementById("observacoes")?.value?.trim() || "";
    const diasRaw = parseInt(document.getElementById("dias-uteis")?.value, 10);
    const diasUteis = Number.isFinite(diasRaw) && diasRaw > 0 ? diasRaw : null;
    const valorCentavos = parseBrl(document.getElementById("valor-escolha")?.value ?? "");
    if (p.regime === "PJ") {
      return { observacoes, diasUteis: null, valorCentavos, transporte: null, faixa: null };
    }
    const transporte = document.querySelector("input[name='escolha-trans']:checked")?.value || p.transporte;
    const faixa = document.getElementById("faixa-gasolina")?.value || "";
    return { observacoes, diasUteis, valorCentavos, transporte, faixa: faixa || null };
  }

  function edicaoMudou(p, edit) {
    const r = rowPessoa(p.id);
    if (p.regime === "PJ") {
      if (edit.valorCentavos == null) return false;
      if (r.valorAusente) return true;
      return edit.valorCentavos !== p.flexivelCentavos;
    }
    if (edit.transporte !== p.transporte) return true;
    if (edit.transporte === "gasolina" && edit.faixa !== (p.faixa || null)) return true;
    const diasAtual = r.diasUteis ?? compet().diasUteis;
    if (edit.diasUteis != null && edit.diasUteis !== diasAtual) return true;
    if (edit.valorCentavos != null && edit.valorCentavos !== r.escolhaValorCentavos) return true;
    return false;
  }

  function aplicarValorEscolha(p, escolha, edit) {
    if (edit.valorCentavos == null || !escolha) return;
    escolha.valorAusente = false;
    escolha.valorCentavos = edit.valorCentavos;
    escolha.valor = D.brl(edit.valorCentavos);
    if (edit.transporte === "ônibus") {
      p.onibusCentavos = edit.valorCentavos !== D.SEMENTE.onibusCentavos ? edit.valorCentavos : null;
      p.gasolinaCentavos = null;
    } else if (edit.transporte === "gasolina") {
      const seed = D.SEMENTE.gasolinaCentavos[edit.faixa];
      p.gasolinaCentavos = seed != null && edit.valorCentavos !== seed ? edit.valorCentavos : null;
      p.onibusCentavos = null;
    }
  }

  function aplicarEdicaoPessoa(p, edit) {
    const lines = linhasDaPessoa(p.id);
    const diasCal = compet().diasUteis;
    if (p.regime === "PJ") {
      const flex = lines.find((l) => l.beneficio === D.NOME_FLEXIVEL);
      if (edit.valorCentavos != null) {
        p.flexivelCentavos = edit.valorCentavos;
        flex.valorAusente = false;
      }
      const v = D.valorDaLinha(flex, p, diasCal);
      flex.valor = v.display;
      flex.valorCentavos = v.centavos;
      flex.observacoes = edit.observacoes || undefined;
      flex.motivos = [];
      return;
    }
    p.transporte = edit.transporte;
    p.faixa = edit.transporte === "gasolina" ? edit.faixa : null;
    const escolha = lines.find((l) => l.beneficio !== D.NOME_COMIDA);
    const multi = lines.find((l) => l.beneficio === D.NOME_COMIDA);
    const dias = edit.diasUteis != null ? edit.diasUteis : (multi?.diasUteis ?? diasCal);
    if (multi) {
      multi.diasUteis = dias;
      if (dias !== diasCal) multi.ajusteDias = String(dias);
      else delete multi.ajusteDias;
      const vm = D.valorDaLinha(multi, p, dias);
      multi.valor = vm.display;
      multi.valorCentavos = vm.centavos;
    }
    if (edit.transporte === "ônibus") {
      escolha.beneficio = D.NOME_ONIBUS;
      escolha.papel = "escolha";
      escolha.hipoteseFlash = D.FLASH_ONIBUS;
      escolha.diasUteis = null;
      escolha.onibus = true;
      escolha.deposito = !!p.ativa;
      escolha.valorAusente = false;
    } else {
      escolha.beneficio = D.NOME_GASOLINA;
      escolha.papel = "escolha";
      escolha.hipoteseFlash = D.FLASH_MOBILIDADE;
      escolha.diasUteis = null;
      escolha.onibus = false;
      escolha.deposito = !!p.ativa;
      escolha.valorAusente = false;
    }
    aplicarValorEscolha(p, escolha, edit);
    if (edit.valorCentavos == null) {
      const ve = D.valorDaLinha(escolha, p, dias);
      escolha.valor = ve.display;
      escolha.valorCentavos = ve.centavos;
    }
    escolha.observacoes = edit.observacoes || undefined;
    escolha.motivos = [];
    if (multi) {
      multi.observacoes = edit.observacoes || undefined;
    }
  }

  function persistirEdicaoDetalhe(pessoaId) {
    if (!mesAberto() || !pessoaId) return true;
    const p = pessoa(pessoaId);
    if (!p) return true;
    const edit = lerEdicaoDetalhe(p);
    if (p.regime === "CLT" && edit.transporte === "gasolina" && !edit.faixa) {
      toast("Escolha a faixa do auxílio gasolina.");
      return false;
    }
    if (edicaoMudou(p, edit)) aplicarEdicaoPessoa(p, edit);
    linhasDaPessoa(pessoaId).forEach((l) => {
      if (edit.observacoes) l.observacoes = edit.observacoes;
      else delete l.observacoes;
    });
    return true;
  }

  function fecharDetalhe({ persistir } = {}) {
    const pessoaId = typeof modal === "string" ? modal : modal?.pessoaId;
    if (persistir && pessoaId && !persistirEdicaoDetalhe(pessoaId)) return;
    modal = null;
    paint();
  }

  $app.addEventListener("change", (e) => {
    if (e.target.name === "escolha-trans" || e.target.id === "faixa-gasolina") {
      syncValorEscolhaFromEscolha();
      return;
    }
    const t = e.target.closest("[data-filtro]");
    if (!t) return;
    const key = t.dataset.filtro;
    filtros[key] = t.value;
    paint();
  });

  $app.addEventListener("input", (e) => {
    if (e.target.id === "dias-uteis") {
      syncMultiFromDias();
      return;
    }
    if (e.target.id === "valor-escolha") {
      syncTotalDetalhe();
      return;
    }
    const t = e.target.closest("[data-filtro='busca']");
    if (!t) return;
    filtros.busca = t.value;
    paint();
    const again = $app.querySelector("[data-filtro='busca']");
    if (again) {
      again.focus();
      const len = again.value.length;
      again.setSelectionRange(len, len);
    }
  });

  function fecharCalendario() {
    if (!calAberto) return false;
    calAberto = false;
    paint();
    $app.querySelector(".comp-atual")?.focus();
    return true;
  }

  function irCompetencia(delta) {
    const list = D.COMPETENCIAS;
    const idx = list.findIndex((c) => c.id === competenciaId);
    const next = list[idx + delta];
    if (!next) return;
    setCompetencia(next.id);
    location.hash = "#/financeiro/beneficios";
    paint();
  }

  $app.addEventListener("click", (e) => {
    if (e.target.closest(".escolha-edit")) {
      queueMicrotask(syncValorEscolhaFromEscolha);
    }
    if (e.target.classList.contains("modal-bg")) {
      fecharDetalhe({ persistir: true });
      return;
    }
    if (calAberto && !e.target.closest(".comp-nav")) {
      calAberto = false;
      paint();
      return;
    }
    const t = e.target.closest("[data-act]");
    if (!t) return;
    const act = t.dataset.act;
    const lineId = t.dataset.line;

    if (act === "comp-ant" || act === "cal-ant") {
      irCompetencia(-1);
      return;
    }
    if (act === "comp-prox" || act === "cal-prox") {
      irCompetencia(1);
      return;
    }
    if (act === "cal-sel") {
      if (t.dataset.comp) setCompetencia(t.dataset.comp);
      location.hash = "#/financeiro/beneficios";
      paint();
      return;
    }

    if (act === "ver-calendario") {
      calAberto = !calAberto;
      paint();
      $app.querySelector(".comp-atual")?.focus();
      return;
    }

    if (act === "sel-linha" && lineId) {
      if (t.checked) selecionados.add(lineId);
      else selecionados.delete(lineId);
      paint();
      return;
    }
    if (act === "sel-visiveis") {
      const shown = filtrar(rowsPessoa("lista"));
      if (t.checked) shown.forEach((r) => selecionados.add(r.id));
      else shown.forEach((r) => selecionados.delete(r.id));
      paint();
      return;
    }
    if (act === "lote-confirmar" || act === "lote-conferido") {
      marcarEEnviar([...selecionados]);
      return;
    }
    if (act === "detalhe" && lineId) {
      if (!pessoa(lineId)) return;
      modal = lineId;
      paint();
      return;
    }
    if (act === "conferir-detalhe" && lineId) {
      if (!mesAberto()) {
        toast("Competência fechada. Só leitura.");
        return;
      }
      const p = pessoa(lineId);
      if (!p) return;
      const edit = lerEdicaoDetalhe(p);
      if (p.regime === "CLT" && edit.transporte === "gasolina" && !edit.faixa) {
        toast("Escolha a faixa do auxílio gasolina.");
        return;
      }
      if (edit.valorCentavos == null) {
        toast("Informe o valor da escolha.");
        return;
      }
      if (edicaoMudou(p, edit)) aplicarEdicaoPessoa(p, edit);
      linhasDaPessoa(lineId).forEach((l) => {
        if (edit.observacoes) l.observacoes = edit.observacoes;
      });
      if (pessoaIncompleta(lineId)) {
        toast("Cadastro incompleto: não dá para conferir sem completar.");
        paint();
        return;
      }
      marcarEEnviar([lineId], p.nome);
      return;
    }
    if (act === "fechar-modal") {
      fecharDetalhe({ persistir: true });
      return;
    }
    if (act === "enviar-flash") {
      if (!mesAberto()) {
        toast("Competência fechada. Só leitura.");
        return;
      }
      const ids = idsSelecionadosConferidos().length ? idsSelecionadosConferidos() : conferidasLivresIds();
      if (!ids.length) {
        toast("Nada conferido para o pedido. A conferir permanece na lista.");
        return;
      }
      abrirParcial(ids);
      location.hash = "#/financeiro/beneficios/flash";
      return;
    }
    if (act === "confirmar-envio") {
      const par = parcialAtual();
      const envio = linhasNestaParcial().filter((l) => !jaNoPedidoFlash(l));
      if (!par || !envio.length) {
        toast("Nada conferido pendente nesta parcial. A conferir permanece na lista.");
        return;
      }
      const n = todasParciais().filter((p) => p.pedidoProvedor).length + 1;
      par.pedidoProvedor = `pedido-set-2026-${n}`;
      par.boleto = null;
      par.consolidadoPagamento = `pag-2026-09-${n}`;
      par.totalFeeCentavos = 0;
      par.flashEspera = "aguardando";
      par.flashStatus = null;
      par.retornoConferido = false;
      D.ciclo.passo = Math.max(D.ciclo.passo, 2);
      envio.forEach((l) => {
        l.fluxo = "flash";
        l.parcialId = par.id;
      });
      toast(`${qtde(par.pessoaIds.length, "colaborador", "colaboradores")} enviados. Etapa Boleto espera o retorno desta parcial.`);
      location.hash = "#/financeiro/beneficios/retorno";
      return;
    }
    if (act === "atualizar-retorno") {
      consultarPedidoAgora();
      return;
    }
    if (act === "dept-toggle" || act === "omie-dept") {
      const id = t.dataset.dept;
      const grupo = t.dataset.grupo || "omie";
      if (!id) return;
      const abertos = grupoAbertos(grupo);
      if (abertos.has(id)) abertos.delete(id);
      else abertos.add(id);
      paint();
      $app.querySelector(`[data-act="dept-toggle"][data-grupo="${grupo}"][data-dept="${id}"]`)?.focus();
      return;
    }
    if (act === "sumario-mes-toggle") {
      sumarioMesAberto = !sumarioMesAberto;
      paint();
      $app.querySelector(`[data-act="sumario-mes-toggle"]`)?.focus();
      return;
    }
    if (act === "recolhivel-toggle") {
      const grupo = t.dataset.grupo;
      const id = t.dataset.id;
      if (!grupo || !id) return;
      const abertos = grupoAbertos(grupo);
      if (abertos.has(id)) abertos.delete(id);
      else abertos.add(id);
      paint();
      $app.querySelector(`[data-act="recolhivel-toggle"][data-grupo="${grupo}"][data-id="${id}"]`)?.focus();
      return;
    }
    if (act === "ir-omie") {
      if (!flashConfirmado()) {
        toast("Ainda não. Aguardando o retorno deste pedido Flash.");
        return;
      }
      D.ciclo.passo = Math.max(D.ciclo.passo, 3);
      location.hash = "#/financeiro/beneficios/omie";
      return;
    }
    if (act === "confirmar-omie") {
      const par = parcialAtual();
      const flashOk = linhasFlashConfirmadas(par);
      if (!flashOk.length) {
        toast("Omie só lança o que esta parcial confirmou no Flash.");
        return;
      }
      par.lancamentoOmie = true;
      par.emailDiretores = {
        para: ["diretor.a@morada", "diretor.b@morada"],
        assunto: `Autorizar pagamento · ${D.ciclo.competencia}`,
        quando: "agora",
        href: "#/financeiro/beneficios/diretores",
      };
      D.ciclo.passo = Math.max(D.ciclo.passo, 4);
      toast("Omie desta parcial. E-mail aos dois diretores com o link da etapa 5. Parciais anteriores permanecem.");
      paint();
      return;
    }
    if (act === "autorizar") {
      const par = parcialAtual();
      if (!par?.lancamentoOmie) {
        toast("Autorizar pagamento só depois do Omie desta parcial.");
        return;
      }
      const n = par.autorizacoes.length;
      const ator = n === 0 ? "diretor.a@morada" : "diretor.b@morada";
      par.autorizacoes.push({ ator, quando: "agora" });
      if (par.autorizacoes.length >= 2) {
        D.ciclo.passo = 5;
        toast("Pagamento desta parcial autorizado. Não altera o pedido confirmado no Flash. Banco lista todas as parciais do mês.");
        location.hash = "#/financeiro/beneficios/banco";
        return;
      }
      toast("Primeira autorização desta parcial. Falta a segunda. Não trava o crédito no Flash.");
      paint();
      return;
    }
    if (act === "baixar-boleto") {
      baixarBoletoMock(parcialPorId(t.dataset.parcial) || parcialAtual());
      return;
    }
    if (act === "baixar-comprovante") {
      baixarComprovanteMock(acharComprovante(t));
      return;
    }
    if (act === "anexar-comprovante") {
      const noMes = t.dataset.mes === "1";
      const par = noMes ? null : (parcialPorId(t.dataset.parcial) || parcialAtual());
      const autorizado = noMes
        ? todasParciais().some((p) => (p.autorizacoes || []).length >= 2)
        : !!(par && par.autorizacoes.length >= 2);
      if (!autorizado) {
        toast("Anexar comprovante só depois de autorizado a pagar.");
        return;
      }
      pedirArquivo("application/pdf,image/*,.pdf,.png,.jpg,.jpeg,.webp", (f) => {
        const nome = f.name || "comprovante.pdf";
        const n = comprovantesDoMes().length + 1;
        const item = {
          nome,
          data: new Date().toLocaleDateString("pt-BR"),
          ator: D.OPERADOR.nome,
          bucket: "bucket de comprovantes",
          caminho: `morada/beneficios/2026-09/${nome.replace(/\s+/g, "-")}`,
          idOpaco: "obj-cmp-" + Math.random().toString(36).slice(2, 8),
          objectUrl: URL.createObjectURL(f),
        };
        if (noMes) {
          if (!Array.isArray(D.ciclo.comprovantesMes)) D.ciclo.comprovantesMes = [];
          D.ciclo.comprovantesMes.push(item);
        } else {
          if (!Array.isArray(par.comprovantes)) par.comprovantes = comprovantesDaParcial(par).slice();
          par.comprovantes.push(item);
        }
        registrarEsteira("anexou comprovante", nome);
        toast(`${qtde(n, "comprovante", "comprovantes")} no bucket de comprovantes.`);
        paint();
      });
      return;
    }
    if (act === "abrir-comprovante") {
      e.preventDefault();
      const idx = Number(t.dataset.idx);
      let c = null;
      if (t.dataset.mes === "1") {
        c = (D.ciclo.comprovantesMes || [])[idx];
      } else {
        const par = parcialPorId(t.dataset.parcial) || parcialAtual();
        c = comprovantesDaParcial(par)[idx];
      }
      if (!c) return;
      if (c.objectUrl) {
        window.open(c.objectUrl, "_blank", "noopener");
        return;
      }
      const blob = new Blob(
        [`${c.nome}\n${c.bucket}\n${c.caminho}`],
        { type: "text/plain;charset=utf-8" }
      );
      const url = URL.createObjectURL(blob);
      window.open(url, "_blank", "noopener");
      setTimeout(() => URL.revokeObjectURL(url), 30_000);
      return;
    }
    if (act === "trazer-planilha") {
      pedirArquivo(".xlsx,.xls,.csv,.ods,image/*,.png,.jpg,.jpeg,.webp,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", (f) => {
        const img = /^image\//.test(f.type) || /\.(png|jpe?g|webp|gif)$/i.test(f.name);
        aplicarCarga(img ? "imagem" : "arquivo", f.name);
        toast(img
          ? "Pré-preenchido pela imagem da planilha (adaptador). Dias úteis vêm do calendário."
          : "Pré-preenchido a partir do arquivo. Dias úteis vêm do calendário. Não sincroniza o Excel aberto.");
        paint();
      });
      return;
    }
    if (act === "planilha") {
      const rows = filtrar(rowsPessoa("lista"));
      const csv = ["colaborador;regime;benefício;multibenefícios;dias úteis;valor;departamento;situação"].concat(
        rows.map((r) => [r.colaborador, r.regime, r.beneficio, r.multiValor ?? "", r.diasUteis ?? "", r.valor, r.deptNome, r.situacao].join(";"))
      ).join("\n");
      const blob = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8" });
      const a = document.createElement("a");
      a.href = URL.createObjectURL(blob);
      a.download = "beneficios-setembro-2026.csv";
      a.click();
      URL.revokeObjectURL(a.href);
      toast("Planilha gerada a partir desta tela. Não grava no Excel que está aberto.");
    }
  });

  window.addEventListener("keydown", (e) => {
    if (e.key !== "Escape") return;
    if (calAberto) {
      e.preventDefault();
      fecharCalendario();
      return;
    }
    if (modal) {
      e.preventDefault();
      fecharDetalhe({ persistir: true });
    }
  });

  window.addEventListener("hashchange", () => {
    const pessoaId = typeof modal === "string" ? modal : modal?.pessoaId;
    if (pessoaId) persistirEdicaoDetalhe(pessoaId);
    modal = null;
    calAberto = false;
    paint();
  });

  if (!location.hash) location.hash = "#/financeiro/beneficios";
  paint();
})();
