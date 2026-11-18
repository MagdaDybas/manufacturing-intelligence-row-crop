/**
 * Manufacturing Intelligence — Row Crop clickable prototype
 * Aligned to PEY Power BI structure (working hypothesis). Sample data only.
 */
(function () {
  /** Overview process strip (PEY KPIs view). Quality = overview-only. */
  const OVERVIEW_STAGES = [
    {
      id: "receiving",
      num: "01",
      label: "Receiving",
      status: "ok",
      statusLabel: "On plan",
      kpis: [
        { label: "Unloaded Weight (t)", value: "—" },
        { label: "Number of Arrivals", value: "—" },
      ],
      action: { route: "process", stage: "receiving", cta: "Open Receiving KPIs" },
    },
    {
      id: "drying",
      num: "02",
      label: "Drying",
      status: "warn",
      statusLabel: "Via C&P",
      kpis: [{ label: "No overview tiles", value: "See C&P" }],
      note: "PEY: no standalone Drying KPI dashboard — use Drying & Shelling C&P.",
      action: { route: "reports", cp: "drying-shelling", cta: "Open Drying & Shelling C&P" },
    },
    {
      id: "shelling",
      num: "03",
      label: "Shelling",
      status: "ok",
      statusLabel: "Stable",
      kpis: [
        { label: "Quantity", value: "—" },
        { label: "Number of Materials", value: "—" },
        { label: "Package Type", value: "—" },
        { label: "Average Time to Shell", value: "—" },
      ],
      action: { route: "process", stage: "shelling", cta: "Open Shelling KPIs" },
    },
    {
      id: "quality",
      num: "04",
      label: "Quality",
      status: "ok",
      statusLabel: "Overview only",
      kpis: [
        { label: "CS Produced (t)", value: "—" },
        { label: "DTS 1 (t)", value: "—" },
        { label: "DTS1 (%)", value: "—" },
      ],
      note: "No full Quality dashboard in current PEY Power BI set.",
      action: null,
    },
    {
      id: "sizing",
      num: "05",
      label: "Sizing",
      status: "ok",
      statusLabel: "Stable",
      kpis: [
        { label: "Sizing Orders", value: "—" },
        { label: "CS Produced (t)", value: "—" },
        { label: "DTS1 (t)", value: "—" },
        { label: "DTS1 %", value: "—" },
      ],
      action: { route: "process", stage: "sizing", cta: "Open Sizing KPIs" },
    },
    {
      id: "packaging",
      num: "06",
      label: "Packaging",
      status: "risk",
      statusLabel: "Watch",
      kpis: [
        { label: "Quantity", value: "—" },
        { label: "Avg Produced Orders", value: "—" },
        { label: "Avg Bags/Hour", value: "—" },
        { label: "Avg Bags/week", value: "—" },
      ],
      action: { route: "process", stage: "packaging", cta: "Open Packaging KPIs" },
    },
  ];

  /** Stages that have KPI dashboards (Process Dashboards nav). */
  const KPI_STAGES = [
    { id: "receiving", label: "Receiving", kpis: ["Unloaded Weight (t)", "Number of Arrivals"] },
    {
      id: "shelling",
      label: "Shelling",
      kpis: ["Quantity", "Number of Materials", "Package Type", "Average Time to Shell"],
    },
    { id: "sizing", label: "Sizing", kpis: ["Sizing Orders", "CS Produced (t)", "DTS1 (t)", "DTS1 %"] },
    {
      id: "packaging",
      label: "Packaging",
      kpis: ["Quantity", "Avg Produced Orders", "Avg Bags/Hour", "Avg Bags/week"],
    },
    { id: "bag-printing", label: "Bag Printing Line", kpis: ["Line output", "Print jobs", "Reprint rate"] },
  ];

  /** C&P reports that exist for PEY. */
  const CP_REPORTS = [
    { id: "drying-shelling", label: "Drying & Shelling C&P", stages: ["Drying", "Shelling"] },
    { id: "sizing", label: "Sizing C&P", stages: ["Sizing"] },
    { id: "packaging", label: "Packaging C&P", stages: ["Packaging"] },
  ];

  const APL_PAGES = [
    { id: "samples-ready", label: "Samples Ready to be Planted", blurb: "Inventory of samples waiting for the Automated Planting Line." },
    { id: "planting-by-day", label: "Planting By Day", blurb: "Daily planting volumes and progress on APL." },
    { id: "event-page", label: "Event Page", blurb: "Operational and system events affecting APL." },
    { id: "handling-unit-list", label: "Handling Unit List", blurb: "Handling units in scope for APL operations." },
    { id: "global-stops", label: "Global Stops", blurb: "Line stops and downtime affecting APL." },
    { id: "apl-vs-manual", label: "APL VS Manual", blurb: "Compare Automated Planting Line vs manual planting." },
  ];

  const REPORT_ROWS = [
    { lot: "PEY-DS-24081", plant: "Peyrehorade (PEY)", stage: "Drying", type: "Consumption", material: "Wet ear corn", qty: "42.6", uom: "t", period: "2026-11-10", product: "DKC 5092", campaign: "C2026V" },
    { lot: "PEY-DS-24082", plant: "Peyrehorade (PEY)", stage: "Shelling", type: "Production", material: "Shelled kernels", qty: "38.1", uom: "t", period: "2026-11-10", product: "DKC 5092", campaign: "C2026V" },
    { lot: "PEY-SZ-11802", plant: "Peyrehorade (PEY)", stage: "Sizing", type: "Production", material: "Sized seed", qty: "22.4", uom: "t", period: "2026-11-11", product: "DKC 4590", campaign: "C2026V" },
    { lot: "PEY-SZ-11803", plant: "Peyrehorade (PEY)", stage: "Sizing", type: "Consumption", material: "CS input", qty: "24.0", uom: "t", period: "2026-11-11", product: "DKC 4590", campaign: "C2026V" },
    { lot: "PEY-PK-33021", plant: "Peyrehorade (PEY)", stage: "Packaging", type: "Production", material: "Finished bags", qty: "12400", uom: "bags", period: "2026-11-11", product: "DKC 5092", campaign: "C2026V" },
    { lot: "PEY-PK-33022", plant: "Peyrehorade (PEY)", stage: "Packaging", type: "Consumption", material: "Sized seed", qty: "18.2", uom: "t", period: "2026-11-11", product: "DKC 5092", campaign: "C2026V" },
    { lot: "MKP-SZ-55101", plant: "MKP Seeds site", stage: "Sizing", type: "Production", material: "Sized seed", qty: "15.0", uom: "t", period: "2026-11-09", product: "DKC 3939", campaign: "C2025V" },
  ];

  const EXCEPTION_LOTS = [
    { lot: "PEY-SHL-24081", unit: "Sheller 2", metric: "Avg time to shell", actual: "48 min", plan: "35 min", impact: "High", owner: "Shift B" },
    { lot: "PEY-SHL-24084", unit: "Sheller 1", metric: "Avg time to shell", actual: "41 min", plan: "35 min", impact: "Medium", owner: "Shift A" },
    { lot: "PEY-SHL-24088", unit: "Sheller 2", metric: "Materials variance", actual: "3 types", plan: "2 types", impact: "High", owner: "Shift B" },
    { lot: "PEY-SHL-24091", unit: "Sheller 3", metric: "Quantity", actual: "12.1 t", plan: "14.0 t", impact: "Low", owner: "Shift C" },
  ];

  const MY_DASHBOARDS = [
    { id: "d1", name: "PEY shelling daily pulse", owner: "You", updated: "2026-11-14", scope: "Personal · PEY · Shelling" },
    { id: "d2", name: "PEY packaging exceptions", owner: "You", updated: "2026-11-10", scope: "Personal · PEY · Packaging" },
    { id: "d3", name: "APL samples ready — my view", owner: "You", updated: "2026-11-08", scope: "Personal · APL Tracking" },
  ];

  /** v1 prototype is locked to one site catalog (PEY). Other sites may differ — see notes. */
  const SITE_PROFILE = {
    id: "pey",
    label: "Peyrehorade (PEY)",
  };

  const DATE_OPTIONS = [
    { value: "today", label: "Today" },
    { value: "7d", label: "Last 7 days" },
    { value: "14d", label: "Last 14 days" },
    { value: "30d", label: "Last 30 days" },
    { value: "mtd", label: "Month to date" },
    { value: "qtd", label: "Quarter to date" },
    { value: "ytd", label: "Year to date" },
    { value: "season", label: "Current season (2026)" },
    { value: "custom", label: "Custom range…" },
  ];

  const CAMPAIGN_OPTIONS = [
    { value: "all", label: "All campaigns" },
    { value: "C2026V", label: "C2026V" },
    { value: "C2025V", label: "C2025V" },
    { value: "C2024V", label: "C2024V" },
    { value: "C2023V", label: "C2023V" },
    { value: "C2022V", label: "C2022V" },
    { value: "empty", label: "(Empty)" },
  ];

  const DATA_WEEK_OPTIONS = [
    { value: "all", label: "All weeks" },
    { value: "w46", label: "2026-W46" },
    { value: "w45", label: "2026-W45" },
    { value: "w44", label: "2026-W44" },
    { value: "w43", label: "2026-W43" },
  ];

  const RECEIVING_LANE_OPTIONS = [
    { value: "all", label: "All lanes" },
    { value: "lane-1", label: "Receiving Lane 1" },
    { value: "lane-2", label: "Receiving Lane 2" },
    { value: "lane-3", label: "Receiving Lane 3" },
  ];

  const ACTUAL_START_OPTIONS = [
    { value: "all", label: "All start times" },
    { value: "shift-a", label: "Today · Shift A" },
    { value: "shift-b", label: "Today · Shift B" },
    { value: "2026-11-16-06", label: "2026-11-16 06:00" },
    { value: "2026-11-15-14", label: "2026-11-15 14:00" },
  ];

  const BLEND_OPTIONS = [
    { value: "all", label: "All blends" },
    { value: "blend-a", label: "Blend A" },
    { value: "blend-b", label: "Blend B" },
    { value: "blend-c", label: "Blend C" },
  ];

  const PROCESS_ORDER_OPTIONS = [
    { value: "all", label: "All process orders" },
    { value: "po-100234", label: "100234" },
    { value: "po-100251", label: "100251" },
    { value: "po-100288", label: "100288" },
  ];

  const VARIETY_OPTIONS = [
    { value: "all", label: "All varieties" },
    { value: "dkc5092", label: "DKC 5092" },
    { value: "dkc4590", label: "DKC 4590" },
    { value: "dkc3939", label: "DKC 3939" },
  ];

  const BATCH_OPTIONS = [
    { value: "all", label: "All batches" },
    { value: "b-24081", label: "24081" },
    { value: "b-24082", label: "24082" },
    { value: "b-11802", label: "11802" },
  ];

  const MATERIAL_OPTIONS = [
    { value: "all", label: "All materials" },
    { value: "mat-wet", label: "Wet ear corn" },
    { value: "mat-shelled", label: "Shelled kernels" },
    { value: "mat-sized", label: "Sized seed" },
  ];

  const RESOURCES_OPTIONS = [
    { value: "all", label: "All resources" },
    { value: "res-sheller", label: "Sheller line" },
    { value: "res-dryer", label: "Dryer" },
    { value: "res-pack", label: "Packaging line" },
  ];

  const EQUIPMENT_OPTIONS = [
    { value: "all", label: "All equipment" },
    { value: "eq-s1", label: "Sheller 1" },
    { value: "eq-s2", label: "Sheller 2" },
    { value: "eq-p1", label: "Packager 1" },
  ];

  const STATUS_OPTIONS = [
    { value: "all", label: "All statuses" },
    { value: "open", label: "Open" },
    { value: "in-progress", label: "In progress" },
    { value: "closed", label: "Closed" },
  ];

  const ORDER_VARIETY_OPTIONS = [
    { value: "all", label: "All order varieties" },
    { value: "dkc5092", label: "DKC 5092" },
    { value: "dkc4590", label: "DKC 4590" },
  ];

  const ORDER_OPTIONS = [
    { value: "all", label: "All orders" },
    { value: "ord-8801", label: "8801" },
    { value: "ord-8802", label: "8802" },
    { value: "ord-8810", label: "8810" },
  ];

  function labelMap(options) {
    return Object.fromEntries(options.map((o) => [o.value, o.label]));
  }

  /** Field metadata for adaptive filter bar (PEY catalog). */
  const FILTER_FIELDS = {
    campaign: { label: "Campaign", options: CAMPAIGN_OPTIONS },
    date: { label: "Date range", options: DATE_OPTIONS },
    dataWeek: { label: "Date / Week", options: DATA_WEEK_OPTIONS },
    receivingLane: { label: "Receiving Lane", options: RECEIVING_LANE_OPTIONS },
    actualStart: { label: "Actual Start Time Local", options: ACTUAL_START_OPTIONS },
    blend: { label: "Blend", options: BLEND_OPTIONS },
    processOrder: { label: "Process Order", options: PROCESS_ORDER_OPTIONS },
    variety: { label: "Variety", options: VARIETY_OPTIONS },
    batch: { label: "Batch", options: BATCH_OPTIONS },
    material: { label: "Material #", options: MATERIAL_OPTIONS },
    resources: { label: "Resources", options: RESOURCES_OPTIONS },
    equipment: { label: "Equipment", options: EQUIPMENT_OPTIONS },
    status: { label: "Status", options: STATUS_OPTIONS },
    orderVariety: { label: "Order Variety", options: ORDER_VARIETY_OPTIONS },
    order: { label: "Order", options: ORDER_OPTIONS },
  };

  const FILTER_LABELS = Object.fromEntries(
    Object.entries(FILTER_FIELDS).map(([key, def]) => [key, labelMap(def.options)])
  );

  const state = {
    route: "overview",
    stage: "receiving",
    cp: "drying-shelling",
    aplPage: "samples-ready",
    reportType: "combined",
    reportState: "data",
    reportSearch: "",
    sortKey: "period",
    sortDir: "desc",
    showCols: { lot: true, plant: true, stage: true, type: true, material: true, qty: true, period: true, product: true, campaign: true },
    aiStep: "idle",
    navOpen: true,
  };

  const filters = {
    date: "30d",
    dateFrom: "2026-10-17",
    dateTo: "2026-11-16",
    campaign: "C2026V",
    dataWeek: "w46",
    receivingLane: "all",
    actualStart: "all",
    blend: "all",
    processOrder: "all",
    variety: "all",
    batch: "all",
    material: "all",
    resources: "all",
    equipment: "all",
    status: "all",
    orderVariety: "all",
    order: "all",
  };

  const FILTER_DEFAULTS = { ...filters };

  let openFilter = null;
  let toastTimer = null;
  let columnsOpen = false;

  const el = {
    app: document.getElementById("app"),
    main: document.getElementById("main"),
    breadcrumb: document.getElementById("breadcrumb"),
    appliedChips: document.getElementById("appliedChips"),
    stageNav: document.getElementById("stageNav"),
    cpNav: document.getElementById("cpNav"),
    aplNav: document.getElementById("aplNav"),
    toast: document.getElementById("toast"),
    cpModal: document.getElementById("cpModal"),
    notesDrawer: document.getElementById("notesDrawer"),
    notesBody: document.getElementById("notesBody"),
    cpTooltip: document.getElementById("cpTooltip"),
  };

  function showToast(msg) {
    clearTimeout(toastTimer);
    el.toast.hidden = false;
    el.toast.textContent = msg;
    toastTimer = setTimeout(() => {
      el.toast.hidden = true;
    }, 2800);
  }

  function kpiStage(id) {
    return KPI_STAGES.find((s) => s.id === id);
  }

  function cpReport(id) {
    return CP_REPORTS.find((r) => r.id === id);
  }

  function aplPage(id) {
    return APL_PAGES.find((p) => p.id === id);
  }

  /** PEY adaptive sets: Campaign + Date range almost everywhere; Receiving/Shelling use their own time dims. */
  function activeFilterKeys() {
    if (state.route === "overview") return ["campaign", "date"];
    if (state.route === "process" || state.route === "exception") {
      switch (state.stage) {
        case "receiving":
          return ["campaign", "dataWeek", "receivingLane"];
        case "shelling":
          return ["campaign", "actualStart", "blend"];
        case "sizing":
        case "packaging":
          return ["campaign", "date", "processOrder", "variety", "batch"];
        case "bag-printing":
          return ["campaign", "date", "orderVariety", "order"];
        default:
          return ["campaign", "date"];
      }
    }
    if (state.route === "reports") {
      const keys = ["campaign", "date", "processOrder", "variety", "batch", "material", "resources", "equipment"];
      if (state.cp === "packaging") keys.push("status");
      return keys;
    }
    return ["campaign", "date"];
  }

  function dateChipLabel() {
    if (filters.date === "custom") return `${filters.dateFrom} → ${filters.dateTo}`;
    return FILTER_LABELS.date[filters.date] || filters.date;
  }

  function fieldDisplayLabel(key) {
    if (key === "date") return dateChipLabel();
    return (FILTER_LABELS[key] && FILTER_LABELS[key][filters[key]]) || filters[key] || key;
  }

  function filterSummary() {
    return activeFilterKeys()
      .map((key) => fieldDisplayLabel(key))
      .join(" · ");
  }

  function optionsFor(key) {
    return FILTER_FIELDS[key]?.options || [];
  }

  function selectedLabel(key) {
    return fieldDisplayLabel(key);
  }

  function renderCombo(hostId, key, labelledBy) {
    const host = document.getElementById(hostId);
    if (!host) return;
    const opts = optionsFor(key);
    const expanded = openFilter === key;
    const label = selectedLabel(key);
    const selected = filters[key];
    host.innerHTML = `
      <button type="button" class="combo-trigger" id="trigger-${key}" aria-haspopup="listbox"
        aria-expanded="${expanded}" aria-controls="list-${key}"
        aria-labelledby="${labelledBy} trigger-${key}" data-combo-toggle="${key}">
        <span class="combo-value">${label}</span>
        <span class="combo-caret" aria-hidden="true">${expanded ? "▲" : "▼"}</span>
      </button>
      <ul class="combo-menu" id="list-${key}" role="listbox" aria-labelledby="${labelledBy}" ${expanded ? "" : "hidden"}>
        ${opts
          .map(
            (o) => `<li role="presentation"><button type="button" class="combo-option ${o.value === selected ? "is-selected" : ""}"
              role="option" aria-selected="${o.value === selected}" data-combo-pick="${key}" data-value="${o.value}">${o.label}</button></li>`
          )
          .join("")}
      </ul>`;
  }

  function syncFilterControls() {
    const keys = activeFilterKeys();
    const host = document.getElementById("filterFields");
    if (!host) return;

    host.innerHTML = keys
      .map((key) => {
        const def = FILTER_FIELDS[key];
        if (!def) return "";
        if (key === "date") {
          return `
            <div class="field">
              <span class="field-label" id="lbl-date">${def.label}</span>
              <div class="combo" id="combo-date" data-filter="date"></div>
            </div>
            <label class="field field-custom-dates" id="customDateFields" ${filters.date === "custom" ? "" : "hidden"}>
              <span class="field-label">From → To</span>
              <div class="date-pair">
                <input type="date" id="fDateFrom" aria-label="From date" />
                <input type="date" id="fDateTo" aria-label="To date" />
              </div>
            </label>`;
        }
        return `
          <div class="field">
            <span class="field-label" id="lbl-${key}">${def.label}</span>
            <div class="combo" id="combo-${key}" data-filter="${key}"></div>
          </div>`;
      })
      .join("");

    keys.forEach((key) => renderCombo(`combo-${key}`, key, `lbl-${key}`));

    const fromEl = document.getElementById("fDateFrom");
    const toEl = document.getElementById("fDateTo");
    if (fromEl) fromEl.value = filters.dateFrom;
    if (toEl) toEl.value = filters.dateTo;

    const hint = document.getElementById("filterHint");
    if (hint) {
      hint.textContent = `Site profile: ${SITE_PROFILE.label} (PEY catalog). Filters adapt per dashboard · ${filterSummary()}. Other sites may differ — validate.`;
    }
    if (el.cpTooltip) el.cpTooltip.hidden = true;
  }

  function renderChips() {
    const chips = [];
    activeFilterKeys().forEach((key) => {
      const value = filters[key];
      if (key === "date") {
        chips.push(
          `<span class="chip">${dateChipLabel()} <button type="button" class="chip-btn" data-clear-filter="date" aria-label="Clear date">×</button></span>`
        );
        return;
      }
      if (value === "all") return;
      const label = fieldDisplayLabel(key);
      chips.push(
        `<span class="chip">${FILTER_FIELDS[key]?.label || key}: ${label} <button type="button" class="chip-btn" data-clear-filter="${key}" aria-label="Clear ${key}">×</button></span>`
      );
    });
    el.appliedChips.innerHTML = chips.join("");
  }

  function applyFilterValue(key, value) {
    if (!(key in filters) && key !== "date") return;
    filters[key] = value;
    openFilter = null;
    render();
    showToast(`Filters updated · ${filterSummary()}`);
  }

  function setNavActive() {
    document.querySelectorAll(".nav-item").forEach((btn) => {
      const route = btn.getAttribute("data-route");
      const active =
        state.route === route ||
        (route === "process" && (state.route === "process" || state.route === "exception"));
      btn.classList.toggle("is-active", active);
      if (active) btn.setAttribute("aria-current", "page");
      else btn.removeAttribute("aria-current");
    });

    el.stageNav.hidden = !(state.route === "process" || state.route === "exception");
    el.cpNav.hidden = state.route !== "reports";
    el.aplNav.hidden = state.route !== "apl";

    document.querySelectorAll("#stageNav .nav-sub-item").forEach((btn) => {
      btn.classList.toggle("is-active", btn.getAttribute("data-stage") === state.stage);
    });
    document.querySelectorAll("#cpNav .nav-sub-item").forEach((btn) => {
      btn.classList.toggle("is-active", btn.getAttribute("data-cp") === state.cp);
    });
    document.querySelectorAll("#aplNav .nav-sub-item").forEach((btn) => {
      btn.classList.toggle("is-active", btn.getAttribute("data-apl") === state.aplPage);
    });

    el.app.dataset.route = state.route;
    el.app.classList.toggle("nav-collapsed", !state.navOpen);
    document.getElementById("navToggle")?.setAttribute("aria-expanded", String(state.navOpen));
  }

  function renderBreadcrumb() {
    const parts = [`<button type="button" data-route="overview">Row Crop</button>`];
    if (state.route === "overview") {
      parts.push(`<span class="sep">/</span><span>Overview (KPIs)</span>`);
    } else if (state.route === "process" || state.route === "exception") {
      parts.push(`<span class="sep">/</span><button type="button" data-route="process" data-stage="${state.stage}">Process Dashboards</button>`);
      parts.push(`<span class="sep">/</span><span>${kpiStage(state.stage)?.label || state.stage} KPIs</span>`);
      if (state.route === "exception") parts.push(`<span class="sep">/</span><span>Exception</span>`);
    } else if (state.route === "reports") {
      parts.push(`<span class="sep">/</span><button type="button" data-route="reports" data-cp="${state.cp}">Reports (C&amp;P)</button>`);
      parts.push(`<span class="sep">/</span><span>${cpReport(state.cp)?.label || state.cp}</span>`);
    } else if (state.route === "apl") {
      parts.push(`<span class="sep">/</span><button type="button" data-route="apl" data-apl="samples-ready">APL Tracking</button>`);
      parts.push(`<span class="sep">/</span><span>${aplPage(state.aplPage)?.label || state.aplPage}</span>`);
    } else if (state.route === "my-dashboards") {
      parts.push(`<span class="sep">/</span><span>My Dashboards</span>`);
    } else if (state.route === "ai") {
      parts.push(`<span class="sep">/</span><span>AI Assistant</span>`);
    }
    el.breadcrumb.innerHTML = parts.join("");
  }

  function navigate(route, opts = {}) {
    state.route = route;
    if (opts.stage) state.stage = opts.stage;
    if (opts.cp) state.cp = opts.cp;
    if (opts.apl) state.aplPage = opts.apl;
    if (opts.reportType) state.reportType = opts.reportType;
    if (opts.aiStep) state.aiStep = opts.aiStep;
    if (window.matchMedia("(max-width: 800px)").matches) state.navOpen = false;
    render();
    el.main.focus({ preventScroll: true });
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  /* ——— Views ——— */

  function viewOverview() {
    const columns = OVERVIEW_STAGES.map((s) => {
      const action = s.action
        ? `<button type="button" class="btn btn-ghost btn-sm" data-route="${s.action.route}" ${
            s.action.stage ? `data-stage="${s.action.stage}"` : ""
          } ${s.action.cp ? `data-cp="${s.action.cp}"` : ""}>${s.action.cta}</button>`
        : `<span class="badge badge-neutral">No full dashboard</span>`;
      return `
        <article class="overview-col">
          <header class="overview-col-head">
            <span class="overview-num">${s.num}</span>
            <div>
              <h3>${s.label}</h3>
              <span class="stage-status"><span class="status-dot ${s.status}" aria-hidden="true"></span>${s.statusLabel}</span>
            </div>
          </header>
          <ul class="overview-kpi-list">
            ${s.kpis.map((k) => `<li><span class="ok">${k.label}</span><strong>${k.value}</strong></li>`).join("")}
          </ul>
          ${s.note ? `<p class="panel-muted">${s.note}</p>` : ""}
          <div class="action-bar">${action}</div>
        </article>`;
    }).join("");

    return `
      <div class="resp-note">Narrow layout: primary nav collapses; overview columns scroll horizontally.</div>
      <div class="hypothesis-banner" role="note">
        <span aria-hidden="true">◇</span>
        <div>
          <strong>Updated from PEY Power BI:</strong> Overview mirrors Seeds Production KPIs strip.
          APL Tracking is a separate primary area. Quality is overview-only.
          <button type="button" class="btn btn-ghost btn-sm" id="openNotesInline">View assumptions</button>
        </div>
      </div>

      <div class="page-header">
        <div>
          <h1>Row Crop overview — Seeds Production KPIs</h1>
          <p class="page-lede">PEY-style process strip. Numbers hidden / sample placeholders. Campaign <strong>${FILTER_LABELS.campaign[filters.campaign]}</strong> · ${SITE_PROFILE.label}.</p>
        </div>
        <div class="meta-row">
          <span class="badge badge-ok">Data freshness · sample</span>
          <span class="badge badge-info">Site pattern: [PEY] Seeds Production</span>
          <button type="button" class="btn btn-secondary btn-sm" data-route="apl" data-apl="samples-ready">Open APL Tracking</button>
        </div>
      </div>

      <section class="panel" aria-labelledby="flowTitle">
        <div class="panel-header">
          <h2 id="flowTitle">Process KPIs (01–06)</h2>
          <span class="panel-muted">Bag Printing Line is a KPI page outside this strip — open via Process Dashboards</span>
        </div>
        <div class="panel-body overview-grid">
          ${columns}
        </div>
      </section>

      <div class="two-col">
        <section class="panel">
          <div class="panel-header"><h2>Where to go next</h2></div>
          <div class="panel-body" style="display:flex;flex-wrap:wrap;gap:8px">
            <button type="button" class="btn btn-secondary" data-route="process" data-stage="receiving">Receiving KPIs</button>
            <button type="button" class="btn btn-secondary" data-route="process" data-stage="shelling">Shelling KPIs</button>
            <button type="button" class="btn btn-secondary" data-route="reports" data-cp="drying-shelling">Drying &amp; Shelling C&amp;P</button>
            <button type="button" class="btn btn-secondary" data-route="reports" data-cp="sizing">Sizing C&amp;P</button>
            <button type="button" class="btn btn-secondary" data-route="reports" data-cp="packaging">Packaging C&amp;P</button>
            <button type="button" class="btn btn-secondary" data-route="process" data-stage="bag-printing">Bag Printing Line KPIs</button>
            <button type="button" class="btn btn-primary" data-route="apl" data-apl="samples-ready">APL Tracking</button>
          </div>
        </section>
        <section class="panel">
          <div class="panel-header"><h2>Content rules (PEY)</h2></div>
          <div class="panel-body">
            <ul style="margin:0;padding-left:18px;color:var(--ink-secondary);font-size:0.8125rem">
              <li>C&amp;P only: Drying &amp; Shelling, Sizing, Packaging</li>
              <li>Drying → primarily C&amp;P (no standalone Drying KPI page)</li>
              <li>Quality → overview metrics only (CS Produced, DTS 1, DTS1 %)</li>
              <li>Bag Printing Line → KPI page only</li>
              <li>APL Tracking → sibling workspace, not a process stage</li>
            </ul>
          </div>
        </section>
      </div>
    `;
  }

  function viewProcess() {
    const stage = kpiStage(state.stage);
    if (!stage) {
      return `<div class="panel"><div class="panel-body placeholder-stage"><h2>Unknown stage</h2>
        <button type="button" class="btn btn-primary" data-route="process" data-stage="receiving">Open Receiving</button></div></div>`;
    }

    const cpLink =
      state.stage === "sizing"
        ? `<button type="button" class="btn btn-secondary btn-sm" data-route="reports" data-cp="sizing">Sizing C&amp;P</button>`
        : state.stage === "packaging"
          ? `<button type="button" class="btn btn-secondary btn-sm" data-route="reports" data-cp="packaging">Packaging C&amp;P</button>`
          : state.stage === "shelling"
            ? `<button type="button" class="btn btn-secondary btn-sm" data-route="reports" data-cp="drying-shelling">Drying &amp; Shelling C&amp;P</button>`
            : "";

    return `
      <div class="page-header">
        <div>
          <h1>${stage.label} KPIs</h1>
          <p class="page-lede">Stage dashboard pattern aligned to [PEY] ${stage.label} KPI's. Top KPI tiles and charts belong to this page (not global nav). Sample placeholders — numbers not real.</p>
        </div>
        <div class="meta-row">
          <span class="badge badge-neutral">${SITE_PROFILE.label} · ${FILTER_LABELS.campaign[filters.campaign]}</span>
          <span class="badge badge-ok">Updated sample</span>
          ${cpLink}
        </div>
      </div>

      <div class="grid-kpi">
        ${stage.kpis
          .map(
            (label, i) => `
          <button type="button" class="kpi-card" data-route="${i === 0 && state.stage === "shelling" ? "exception" : "process"}" data-stage="${state.stage}">
            <div class="kpi-label"><span>${label}</span></div>
            <p class="kpi-value">—</p>
            <span class="kpi-delta flat">Sample · campaign ${FILTER_LABELS.campaign[filters.campaign]}</span>
          </button>`
          )
          .join("")}
      </div>

      <div class="two-col">
        <section class="panel">
          <div class="panel-header"><h2>Trend (sample)</h2></div>
          <div class="panel-body">
            <div class="chart-bars" role="img" aria-label="Sample trend chart">
              ${[70, 65, 78, 72, 68, 80, 74, 71, 69, 76, 73, 70]
                .map((h, i) => `<div class="chart-bar"><div class="bar" style="height:${h}%"></div><span>D${i + 1}</span></div>`)
                .join("")}
            </div>
          </div>
        </section>
        <section class="panel">
          <div class="panel-header"><h2>Exceptions</h2><span class="badge badge-warn">Sample</span></div>
          <div class="panel-body">
            <div class="signal-list">
              <button type="button" class="signal-item" data-route="exception" data-stage="shelling">
                <span class="status-dot warn" aria-hidden="true"></span>
                <div>
                  <p class="signal-title">${stage.label} performance watch</p>
                  <p class="signal-desc">Drill into affected lots / units (sample)</p>
                </div>
                <span class="badge badge-warn">Exception</span>
              </button>
            </div>
            ${
              state.stage === "shelling"
                ? `<div class="action-bar"><button type="button" class="btn btn-primary" data-route="exception">Open shelling exception</button></div>`
                : ""
            }
          </div>
        </section>
      </div>

      <section class="panel">
        <div class="panel-header"><h2>Operational table (concise)</h2></div>
        <div class="panel-body">
          <div class="table-wrap">
            <table class="data">
              <thead><tr><th>Lot</th><th>Unit</th><th>Metric</th><th>Actual</th><th>Plan</th><th>Impact</th></tr></thead>
              <tbody>
                ${EXCEPTION_LOTS.map(
                  (r) => `<tr>
                    <td class="cell-id">${r.lot}</td><td>${r.unit}</td><td>${r.metric}</td>
                    <td><span class="cell-warn">${r.actual}</span></td><td>${r.plan}</td>
                    <td><span class="badge badge-warn">${r.impact}</span></td>
                  </tr>`
                ).join("")}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    `;
  }

  function viewException() {
    return `
      <div class="page-header">
        <div>
          <h1>Shelling exception · performance deviation</h1>
          <p class="page-lede">Drill-down pattern from a stage KPI dashboard. Shelling filters stay in the top bar.</p>
        </div>
        <div class="meta-row">
          <span class="badge badge-warn">Open · High impact</span>
          <span class="badge badge-neutral">${SITE_PROFILE.label} · ${FILTER_LABELS.campaign[filters.campaign]}</span>
        </div>
      </div>
      <div class="impact-strip">
        <div class="impact-item"><div class="label">Affected lots</div><div class="value">4</div></div>
        <div class="impact-item"><div class="label">Primary unit</div><div class="value">Sheller 2</div></div>
        <div class="impact-item"><div class="label">Campaign</div><div class="value">${FILTER_LABELS.campaign[filters.campaign]}</div></div>
        <div class="impact-item"><div class="label">Site</div><div class="value">${SITE_PROFILE.label}</div></div>
      </div>
      <div class="two-col">
        <section class="panel">
          <div class="panel-header"><h2>Context</h2></div>
          <div class="panel-body">
            <p style="margin:0 0 10px;font-size:0.875rem;color:var(--ink-secondary)">Sample exception for Shelling KPI deviation. Next actions stay explicit.</p>
            <div class="action-bar">
              <button type="button" class="btn btn-primary" data-route="reports" data-cp="drying-shelling">View Drying &amp; Shelling C&amp;P</button>
              <button type="button" class="btn btn-secondary" id="shareIssue">Share issue link</button>
              <button type="button" class="btn btn-ghost" data-route="process" data-stage="shelling">Back to Shelling KPIs</button>
            </div>
          </div>
        </section>
        <section class="panel">
          <div class="panel-header"><h2>Next action</h2></div>
          <div class="panel-body">
            <ol style="margin:0;padding-left:18px;font-size:0.875rem;color:var(--ink-secondary)">
              <li>Confirm sheller timings for Shift B lots.</li>
              <li>Cross-check materials count vs plan.</li>
              <li>Open C&amp;P if consumption/production balance is needed.</li>
            </ol>
          </div>
        </section>
      </div>
      <section class="panel">
        <div class="panel-header"><h2>Affected records</h2></div>
        <div class="panel-body">
          <div class="table-wrap">
            <table class="data">
              <thead><tr><th>Lot</th><th>Unit</th><th>Metric</th><th>Actual</th><th>Plan</th><th>Impact</th><th>Owner</th></tr></thead>
              <tbody>
                ${EXCEPTION_LOTS.map(
                  (r) => `<tr>
                    <td class="cell-id">${r.lot}</td><td>${r.unit}</td><td>${r.metric}</td>
                    <td><span class="cell-warn">${r.actual}</span></td><td>${r.plan}</td>
                    <td><span class="badge badge-warn">${r.impact}</span></td><td>${r.owner}</td>
                  </tr>`
                ).join("")}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    `;
  }

  function filteredReports() {
    const cp = cpReport(state.cp);
    let rows = REPORT_ROWS.filter((r) => cp?.stages.includes(r.stage));
    if (state.reportType === "consumption") rows = rows.filter((r) => r.type === "Consumption");
    if (state.reportType === "production") rows = rows.filter((r) => r.type === "Production");
    // v1 site profile = PEY; other sites may ship different report rows later
    if (SITE_PROFILE.id === "pey") rows = rows.filter((r) => r.plant.includes("PEY"));
    if (filters.campaign !== "all" && filters.campaign !== "empty") {
      rows = rows.filter((r) => r.campaign === filters.campaign);
    }
    if (state.reportSearch.trim()) {
      const q = state.reportSearch.trim().toLowerCase();
      rows = rows.filter((r) => Object.values(r).join(" ").toLowerCase().includes(q));
    }
    rows.sort((a, b) => {
      const av = a[state.sortKey] || "";
      const bv = b[state.sortKey] || "";
      if (av < bv) return state.sortDir === "asc" ? -1 : 1;
      if (av > bv) return state.sortDir === "asc" ? 1 : -1;
      return 0;
    });
    return rows;
  }

  function viewReports() {
    const cp = cpReport(state.cp) || CP_REPORTS[0];
    const rows = filteredReports();
    const colKeys = Object.keys(state.showCols);

    let body = "";
    if (state.reportState === "loading") {
      body = `<div class="loading-state"><div class="spinner"></div><h3>Loading C&amp;P…</h3></div>`;
    } else if (state.reportState === "empty") {
      body = `<div class="empty-state"><h3>No rows for this filter set</h3>
        <button type="button" class="btn btn-secondary" id="resetReportEmpty">Reset report filters</button></div>`;
    } else if (state.reportState === "noaccess") {
      body = `<div class="no-access-state"><h3>No access to this C&amp;P scope</h3>
        <button type="button" class="btn btn-secondary" data-set-report-state="data">Simulate permitted view</button></div>`;
    } else {
      body = `<div class="table-wrap"><table class="data"><thead><tr>
        ${colKeys
          .filter((k) => state.showCols[k])
          .map((k) => {
            const labels = {
              lot: "Lot / ID",
              plant: "Plant",
              stage: "Stage",
              type: "Type",
              material: "Material",
              qty: "Quantity",
              period: "Date",
              product: "Product",
              campaign: "Campaign",
            };
            const sorted = state.sortKey === k ? (state.sortDir === "asc" ? " ▲" : " ▼") : "";
            return `<th><button type="button" data-sort="${k}">${labels[k]}${sorted}</button></th>`;
          })
          .join("")}
      </tr></thead><tbody>
        ${
          rows
            .map(
              (r) => `<tr>
            ${state.showCols.lot ? `<td class="cell-id">${r.lot}</td>` : ""}
            ${state.showCols.plant ? `<td>${r.plant}</td>` : ""}
            ${state.showCols.stage ? `<td>${r.stage}</td>` : ""}
            ${state.showCols.type ? `<td><span class="badge badge-neutral">${r.type}</span></td>` : ""}
            ${state.showCols.material ? `<td>${r.material}</td>` : ""}
            ${state.showCols.qty ? `<td>${r.qty} ${r.uom}</td>` : ""}
            ${state.showCols.period ? `<td>${r.period}</td>` : ""}
            ${state.showCols.product ? `<td>${r.product}</td>` : ""}
            ${state.showCols.campaign ? `<td>${r.campaign}</td>` : ""}
          </tr>`
            )
            .join("") || `<tr><td colspan="9">No matching rows.</td></tr>`
        }
      </tbody></table></div>`;
    }

    return `
      <div class="page-header">
        <div>
          <h1>${cp.label}</h1>
          <p class="page-lede">Consumption &amp; production table. PEY only publishes C&amp;P for Drying &amp; Shelling, Sizing, and Packaging.</p>
        </div>
        <div class="meta-row">
          <button type="button" class="btn btn-secondary btn-sm" data-set-report-state="loading">Simulate loading</button>
          <button type="button" class="btn btn-secondary btn-sm" data-set-report-state="empty">Simulate empty</button>
          <button type="button" class="btn btn-secondary btn-sm" data-set-report-state="noaccess">Simulate no access</button>
          <button type="button" class="btn btn-secondary btn-sm" data-set-report-state="data">Show data</button>
        </div>
      </div>

      <section class="panel">
        <div class="panel-body">
          <div class="report-type-tabs report-scope-tabs" role="tablist" aria-label="C&P report">
            ${CP_REPORTS.map(
              (r) =>
                `<button type="button" role="tab" data-route="reports" data-cp="${r.id}" class="${
                  state.cp === r.id ? "is-active" : ""
                }" aria-selected="${state.cp === r.id}">${r.label}</button>`
            ).join("")}
          </div>

          <div class="report-type-tabs" role="tablist" aria-label="Report type">
            <button type="button" role="tab" data-report-type="combined" class="${state.reportType === "combined" ? "is-active" : ""}" aria-selected="${state.reportType === "combined"}">Consumption &amp; production</button>
            <button type="button" role="tab" data-report-type="consumption" class="${state.reportType === "consumption" ? "is-active" : ""}" aria-selected="${state.reportType === "consumption"}">Consumption</button>
            <button type="button" role="tab" data-report-type="production" class="${state.reportType === "production" ? "is-active" : ""}" aria-selected="${state.reportType === "production"}">Production</button>
          </div>

          <p class="panel-muted" style="margin:0 0 12px">C&amp;P filters live in the top bar (7 fields; Packaging adds Status). Receiving, Shelling KPI-only, Bag Printing, and Quality have no C&amp;P in the PEY set.</p>

          <div class="table-toolbar">
            <input type="search" id="reportSearch" placeholder="Search lots, materials…" value="${state.reportSearch}" aria-label="Search report rows" />
            <div class="columns-menu">
              <button type="button" class="btn btn-secondary" id="toggleColumns" aria-expanded="${columnsOpen}">Columns</button>
              ${
                columnsOpen
                  ? `<div class="columns-panel">${colKeys
                      .map((k) => `<label><input type="checkbox" data-col="${k}" ${state.showCols[k] ? "checked" : ""}/> ${k}</label>`)
                      .join("")}</div>`
                  : ""
              }
            </div>
            <button type="button" class="btn btn-secondary" id="exportReport">Export CSV</button>
            <button type="button" class="btn btn-ghost" id="saveView">Save view</button>
            <span class="panel-muted">${state.reportState === "data" ? rows.length + " rows" : "—"}</span>
          </div>
          ${body}
        </div>
      </section>
    `;
  }

  function viewApl() {
    const page = aplPage(state.aplPage) || APL_PAGES[0];
    const cards = APL_PAGES.map(
      (p) => `
      <button type="button" class="dash-card" style="text-align:left;cursor:pointer;width:100%" data-route="apl" data-apl="${p.id}">
        <span class="badge ${p.id === state.aplPage ? "badge-info" : "badge-neutral"}">${p.id === state.aplPage ? "Current" : "APL"}</span>
        <h3>${p.label}</h3>
        <p>${p.blurb}</p>
      </button>`
    ).join("");

    return `
      <div class="page-header">
        <div>
          <h1>APL Tracking · ${page.label}</h1>
          <p class="page-lede"><strong>APL</strong> = Automated Planting Line. Sibling area to Seeds Production (as in Power BI), not a process stage and not a C&amp;P tab.</p>
        </div>
        <div class="meta-row">
          <span class="badge badge-info">Automated Planting Line</span>
          <span class="badge badge-neutral">${SITE_PROFILE.label} · ${FILTER_LABELS.campaign[filters.campaign]}</span>
        </div>
      </div>

      <div class="hypothesis-banner" role="note">
        <span aria-hidden="true">◇</span>
        <div>Pages mirror Power BI APL Tracking. Content below is structural placeholder until detailed APL screens are provided. Filters: Campaign + Date range (sample until APL slicers are confirmed).</div>
      </div>

      <div class="two-col">
        <section class="panel">
          <div class="panel-header"><h2>${page.label}</h2></div>
          <div class="panel-body">
            <p style="margin:0 0 12px;color:var(--ink-secondary)">${page.blurb}</p>
            <div class="grid-kpi" style="grid-template-columns:1fr 1fr">
              <div class="kpi-card" style="cursor:default"><div class="kpi-label">Sample KPI</div><p class="kpi-value">—</p></div>
              <div class="kpi-card" style="cursor:default"><div class="kpi-label">Sample KPI</div><p class="kpi-value">—</p></div>
            </div>
            <div class="table-wrap" style="margin-top:12px">
              <table class="data">
                <thead><tr><th>ID</th><th>Status</th><th>Updated</th><th>Owner</th></tr></thead>
                <tbody>
                  <tr><td class="cell-id">APL-SAMPLE-01</td><td><span class="badge badge-ok">Ready</span></td><td>2026-11-16</td><td>Shift A</td></tr>
                  <tr><td class="cell-id">APL-SAMPLE-02</td><td><span class="badge badge-warn">Hold</span></td><td>2026-11-16</td><td>Shift B</td></tr>
                  <tr><td class="cell-id">APL-SAMPLE-03</td><td><span class="badge badge-neutral">Queued</span></td><td>2026-11-15</td><td>Shift A</td></tr>
                </tbody>
              </table>
            </div>
          </div>
        </section>
        <section class="panel">
          <div class="panel-header"><h2>APL Tracking pages</h2></div>
          <div class="panel-body"><div class="dash-card-grid" style="grid-template-columns:1fr">${cards}</div></div>
        </section>
      </div>
    `;
  }

  function viewMyDashboards() {
    return `
      <div class="page-header">
        <div>
          <h1>My dashboards</h1>
          <p class="page-lede">Personal dashboards. Personal ≠ published.</p>
        </div>
        <button type="button" class="btn btn-primary" data-route="ai" data-ai-step="idle">Create with AI Assistant</button>
      </div>
      <div class="dash-card-grid">
        ${MY_DASHBOARDS.map(
          (d) => `<article class="dash-card">
            <span class="badge badge-neutral">Personal</span>
            <h3>${d.name}</h3>
            <p>${d.scope}<br/>Owner: ${d.owner} · Updated ${d.updated}</p>
            <div class="dash-actions">
              <button type="button" class="btn btn-primary btn-sm" data-open-dash="${d.id}">Open</button>
              <button type="button" class="btn btn-secondary btn-sm" data-edit-dash="${d.id}">Edit</button>
              <button type="button" class="btn btn-secondary btn-sm" data-dup-dash="${d.id}">Duplicate</button>
              <button type="button" class="btn btn-danger btn-sm" data-del-dash="${d.id}">Delete</button>
            </div>
          </article>`
        ).join("")}
      </div>
    `;
  }

  function viewAI() {
    const prompts = [
      "Compare shelling quantity across campaigns at PEY.",
      "Show packaging bags/hour vs plan for C2026V.",
      "Create a dashboard for APL samples ready at my plant.",
    ];
    let chat =
      state.aiStep === "idle"
        ? `<div class="bubble assistant">Ask about Seeds Production KPIs, C&amp;P, or APL Tracking. Critical plant KPIs stay in Overview / Process Dashboards without AI.</div>`
        : `<div class="bubble user">Create a dashboard for APL samples ready at my plant.</div>
           <div class="bubble assistant">Using scope: Row Crop · ${SITE_PROFILE.label} · ${FILTER_LABELS.campaign[filters.campaign]} · APL Tracking. Draft stays personal unless you publish later.</div>`;

    return `
      <div class="page-header">
        <div>
          <h1>AI Assistant</h1>
          <p class="page-lede">Accelerator for questions and personal dashboards — not the only path to KPIs or APL Tracking.</p>
        </div>
      </div>
      <div class="ai-layout">
        <section class="ai-chat">
          <div class="ai-chat-header">
            <h2>Conversation</h2>
            <div class="scope-bar">
              <span class="chip">Row Crop</span>
              <span class="chip">${SITE_PROFILE.label}</span>
              <span class="chip">${FILTER_LABELS.campaign[filters.campaign]}</span>
              <span class="chip">${dateChipLabel()}</span>
            </div>
          </div>
          <div class="chat-body">${chat}</div>
          <div class="prompts">
            ${prompts.map((p) => `<button type="button" class="prompt-chip" data-prompt="${encodeURIComponent(p)}">${p}</button>`).join("")}
          </div>
          <div class="chat-input-row">
            <label class="sr-only" for="aiInput">Message</label>
            <input id="aiInput" type="text" placeholder="Ask about manufacturing or APL data…" />
            <button type="button" class="btn btn-primary" id="aiSend">Send</button>
          </div>
          <p class="gov-note">AI-created dashboards stay personal by default.</p>
        </section>
        <section class="ai-preview">
          <div class="ai-preview-header">
            <h2>Generated dashboard preview</h2>
            <p class="panel-muted" style="margin:0">${state.aiStep === "idle" ? "Run a create-dashboard prompt" : "Draft · Personal only"}</p>
          </div>
          <div class="ai-preview-body">
            ${
              state.aiStep === "idle"
                ? `<div class="empty-state"><h3>No draft yet</h3><p>Try an APL or PEY campaign prompt.</p></div>`
                : `<div class="grid-kpi" style="grid-template-columns:1fr 1fr">
                    <div class="kpi-card" style="cursor:default"><div class="kpi-label">Samples ready</div><p class="kpi-value">—</p></div>
                    <div class="kpi-card" style="cursor:default"><div class="kpi-label">Queued</div><p class="kpi-value">—</p></div>
                  </div>
                  <div class="action-bar">
                    <button type="button" class="btn btn-primary" id="saveAiDash">Save to My dashboards</button>
                    <button type="button" class="btn btn-secondary" data-route="my-dashboards">Open My dashboards</button>
                    <button type="button" class="btn btn-ghost" id="resetAi">Clear draft</button>
                  </div>`
            }
          </div>
        </section>
      </div>
    `;
  }

  function notesHtml() {
    return `
      <h3>Proposed information architecture (updated)</h3>
      <ul>
        <li><strong>Overview</strong> — Seeds Production KPIs strip (01–06) + Quality overview metrics</li>
        <li><strong>Process Dashboards</strong> — Receiving, Shelling, Sizing, Packaging, Bag Printing Line (KPI pages)</li>
        <li><strong>Reports (C&amp;P)</strong> — only Drying &amp; Shelling, Sizing, Packaging</li>
        <li><strong>APL Tracking</strong> — Automated Planting Line (sibling area): Samples Ready…, Planting By Day, Event Page, HU List, Global Stops, APL VS Manual</li>
        <li><strong>My Dashboards</strong> / <strong>AI Assistant</strong></li>
      </ul>
      <h3>Filters (PEY catalog — adaptive bar)</h3>
      <ul>
        <li><strong>Carry across views:</strong> Campaign; Date range (start–end) on all views except Receiving &amp; Shelling KPIs</li>
        <li><strong>Receiving KPIs:</strong> Campaign, Date/Week, Receiving Lane</li>
        <li><strong>Shelling KPIs:</strong> Campaign, Actual Start Time Local, Blend</li>
        <li><strong>Sizing / Packaging KPIs:</strong> Campaign, Date range, Process Order, Variety, Batch</li>
        <li><strong>Bag Printing Line:</strong> Campaign, Date range, Order Variety, Order</li>
        <li><strong>C&amp;P (×2):</strong> Campaign, Date range, Process Order, Variety, Batch, Material #, Resources, Equipment</li>
        <li><strong>Packaging C&amp;P:</strong> same + Status</li>
        <li>Page-top KPI tiles (orders, bags printed, …) belong to the dashboard body — not global chrome</li>
      </ul>
      <h3>PEY facts locked with operator</h3>
      <ul>
        <li>APL = Automated Planting Line; Power BI name APL Tracking</li>
        <li>Quality = overview only (CS Produced, DTS 1, DTS1 %); no full dashboard</li>
        <li>Drying mainly via Drying &amp; Shelling C&amp;P; Shelling has its own KPI page</li>
        <li>Bag Printing Line = KPI only</li>
        <li>Campaign filter is first-class (e.g. C2026V)</li>
      </ul>
      <h3>Hypothesis — multi-site / multi-catalog</h3>
      <p style="font-size:0.8125rem;color:var(--ink-secondary)">
        <strong>v1 prototype uses one concrete site profile: ${SITE_PROFILE.label}.</strong>
        Other plants may need different dashboards, C&amp;P inventory, and filter fields.
        Do not treat the PEY set as universal. Product implication: IA + filter catalogs are
        <em>site-profile configuration</em>, not hard-coded globals. Validate with a second site before generalising.
      </p>
      <h3>Still to validate</h3>
      <ul>
        <li>Default landing: Overview vs plant vs APL</li>
        <li>Whether other sites share the same C&amp;P/KPI split and filter fields</li>
        <li>Detailed APL page layouts, KPIs, and slicers</li>
        <li>Metric glossary (DTS1, CS Produced, etc.)</li>
      </ul>
    `;
  }

  function render() {
    syncFilterControls();
    renderChips();
    setNavActive();
    renderBreadcrumb();

    let html = "";
    switch (state.route) {
      case "overview":
        html = viewOverview();
        break;
      case "process":
        html = viewProcess();
        break;
      case "exception":
        html = viewException();
        break;
      case "reports":
        html = viewReports();
        break;
      case "apl":
        html = viewApl();
        break;
      case "my-dashboards":
        html = viewMyDashboards();
        break;
      case "ai":
        html = viewAI();
        break;
      default:
        html = viewOverview();
    }
    el.main.innerHTML = html;
    el.notesBody.innerHTML = notesHtml();
  }

  /* ——— Events ——— */

  function onClick(e) {
    const comboPick = e.target.closest("[data-combo-pick]");
    if (comboPick) {
      e.preventDefault();
      e.stopPropagation();
      applyFilterValue(comboPick.getAttribute("data-combo-pick"), comboPick.getAttribute("data-value"));
      return;
    }

    const comboToggle = e.target.closest("[data-combo-toggle]");
    if (comboToggle) {
      e.preventDefault();
      e.stopPropagation();
      const key = comboToggle.getAttribute("data-combo-toggle");
      openFilter = openFilter === key ? null : key;
      if (el.cpTooltip) el.cpTooltip.hidden = true;
      syncFilterControls();
      renderChips();
      document.getElementById(`trigger-${key}`)?.focus();
      return;
    }

    if (openFilter && !e.target.closest(".combo")) {
      openFilter = null;
      syncFilterControls();
    }

    const t = e.target.closest(
      "[data-route], [data-close], [data-clear-filter], [data-report-type], [data-set-report-state], [data-sort], [data-prompt], [data-col], [data-open-dash], [data-edit-dash], [data-dup-dash], [data-del-dash], #navToggle, #resetFilters, #saveFilters, #areaCropProtection, #areaRowCrop, #helpBtn, #openNotesFromNav, #openNotesInline, #aiFab, #aiSend, #saveAiDash, #resetAi, #exportReport, #saveView, #toggleColumns, #shareIssue, #viewSource, #resetReportEmpty, #globalSearchBtn"
    );
    if (!t) return;

    if (t.id === "navToggle") {
      state.navOpen = !state.navOpen;
      setNavActive();
      return;
    }

    if (t.hasAttribute("data-close")) {
      const id = t.getAttribute("data-close");
      document.getElementById(id).hidden = true;
      if (id === "cpModal" && el.cpTooltip) el.cpTooltip.hidden = true;
      return;
    }

    if (t.id === "areaCropProtection") {
      if (el.cpTooltip) el.cpTooltip.hidden = true;
      el.cpModal.hidden = false;
      return;
    }
    if (t.id === "areaRowCrop") {
      if (el.cpTooltip) el.cpTooltip.hidden = true;
      showToast("Row Crop is the active business area.");
      return;
    }
    if (t.id === "helpBtn" || t.id === "openNotesFromNav" || t.id === "openNotesInline") {
      el.notesDrawer.hidden = false;
      return;
    }
    if (t.id === "aiFab") {
      navigate("ai");
      return;
    }

    if (t.id === "resetFilters") {
      Object.keys(FILTER_DEFAULTS).forEach((key) => {
        filters[key] = FILTER_DEFAULTS[key];
      });
      render();
      showToast(`Filters reset · ${SITE_PROFILE.label} · ${filterSummary()}`);
      return;
    }

    if (t.id === "saveFilters") {
      showToast(`Saved filter set (prototype): ${filterSummary()}`);
      return;
    }

    if (t.hasAttribute("data-clear-filter")) {
      const key = t.getAttribute("data-clear-filter");
      if (key === "date") {
        filters.date = FILTER_DEFAULTS.date;
        filters.dateFrom = FILTER_DEFAULTS.dateFrom;
        filters.dateTo = FILTER_DEFAULTS.dateTo;
      } else if (key === "campaign") {
        filters.campaign = "all";
      } else if (Object.prototype.hasOwnProperty.call(FILTER_DEFAULTS, key)) {
        filters[key] = "all";
      }
      render();
      return;
    }

    if (t.hasAttribute("data-route")) {
      const route = t.getAttribute("data-route");
      const opts = {};
      if (t.hasAttribute("data-stage")) opts.stage = t.getAttribute("data-stage");
      if (t.hasAttribute("data-cp")) opts.cp = t.getAttribute("data-cp");
      if (t.hasAttribute("data-apl")) opts.apl = t.getAttribute("data-apl");
      if (t.hasAttribute("data-report-type")) opts.reportType = t.getAttribute("data-report-type");
      if (t.hasAttribute("data-ai-step")) opts.aiStep = t.getAttribute("data-ai-step");
      if (route === "reports") state.reportState = "data";
      navigate(route, opts);
      return;
    }

    if (t.hasAttribute("data-report-type")) {
      state.reportType = t.getAttribute("data-report-type");
      state.reportState = "data";
      render();
      return;
    }

    if (t.hasAttribute("data-set-report-state")) {
      state.reportState = t.getAttribute("data-set-report-state");
      render();
      return;
    }

    if (t.id === "resetReportEmpty") {
      filters.campaign = "C2026V";
      state.reportSearch = "";
      state.reportState = "data";
      render();
      return;
    }

    if (t.hasAttribute("data-sort")) {
      const key = t.getAttribute("data-sort");
      if (state.sortKey === key) state.sortDir = state.sortDir === "asc" ? "desc" : "asc";
      else {
        state.sortKey = key;
        state.sortDir = "asc";
      }
      render();
      return;
    }

    if (t.id === "toggleColumns") {
      columnsOpen = !columnsOpen;
      render();
      return;
    }

    if (t.id === "exportReport") {
      showToast("Export started (prototype).");
      return;
    }
    if (t.id === "saveView") {
      showToast("Saved report view (personal, prototype).");
      return;
    }

    if (t.hasAttribute("data-prompt")) {
      const text = decodeURIComponent(t.getAttribute("data-prompt"));
      state.aiStep = text.toLowerCase().includes("dashboard") ? "preview" : "conversation";
      navigate("ai");
      showToast("Assistant response generated (sample).");
      return;
    }

    if (t.id === "aiSend") {
      const val = (document.getElementById("aiInput")?.value || "").trim();
      if (!val) return;
      state.aiStep = val.toLowerCase().includes("dashboard") ? "preview" : "conversation";
      render();
      showToast("Assistant response generated (sample).");
      return;
    }

    if (t.id === "saveAiDash") {
      showToast("Saved to My dashboards as personal (not published).");
      navigate("my-dashboards");
      return;
    }
    if (t.id === "resetAi") {
      state.aiStep = "idle";
      render();
      return;
    }

    if (t.hasAttribute("data-open-dash")) {
      showToast("Opening personal dashboard (prototype).");
      return;
    }
    if (t.hasAttribute("data-edit-dash")) {
      navigate("ai", { aiStep: "preview" });
      return;
    }
    if (t.hasAttribute("data-dup-dash")) {
      showToast("Dashboard duplicated.");
      return;
    }
    if (t.hasAttribute("data-del-dash")) {
      showToast("Delete confirmation would appear (prototype).");
      return;
    }
    if (t.id === "shareIssue") {
      showToast("Share link copied (prototype).");
      return;
    }
    if (t.id === "viewSource") {
      showToast("Source lineage panel (future).");
      return;
    }
    if (t.id === "globalSearchBtn") {
      showToast("Global search reserved in top bar (future).");
    }
  }

  function onChange(e) {
    const id = e.target.id;
    if (id === "fDateFrom") {
      filters.dateFrom = e.target.value;
      filters.date = "custom";
      openFilter = null;
      render();
      return;
    }
    if (id === "fDateTo") {
      filters.dateTo = e.target.value;
      filters.date = "custom";
      openFilter = null;
      render();
      return;
    }
    if (e.target.matches("[data-col]")) {
      state.showCols[e.target.getAttribute("data-col")] = e.target.checked;
    }
  }

  document.addEventListener("click", onClick);
  document.addEventListener("change", onChange);
  document.addEventListener("input", (e) => {
    if (e.target.id === "reportSearch") {
      state.reportSearch = e.target.value;
      if (state.route === "reports" && state.reportState === "data") {
        const active = document.activeElement === e.target;
        const pos = e.target.selectionStart;
        render();
        const again = document.getElementById("reportSearch");
        if (active && again) {
          again.focus();
          again.setSelectionRange(pos, pos);
        }
      }
    }
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      el.cpModal.hidden = true;
      el.notesDrawer.hidden = true;
      if (el.cpTooltip) el.cpTooltip.hidden = true;
      columnsOpen = false;
      if (openFilter) {
        const prev = openFilter;
        openFilter = null;
        syncFilterControls();
        document.getElementById(`trigger-${prev}`)?.focus();
      }
    }
  });

  const cpBtn = document.getElementById("areaCropProtection");
  cpBtn?.setAttribute(
    "title",
    "Crop Protection coming soon — separate data sources and workflows. Click for details."
  );

  render();
})();
