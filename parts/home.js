/* =========================================================
   SITE_DATA: tölur á forsíðu og í reiknivél.
   Raunverulegu tölurnar koma úr data/rates.json, sem GitHub Action
   (.github/workflows/update-rates.yml) uppfærir sjálfkrafa daglega.
   Gildin hér eru aðeins til vara ef skráin næst ekki.
   ========================================================= */
const SITE_DATA = {
  policyRate: { value: 8.00, date: "2026-10", todo: false },
  inflation:  { value: 5.9,  date: "2026-10", todo: false },
  calc: {
    amount: 50000000,
    years: 40,
    rateIndexed: { value: 4.5, todo: true },
    rateNominal: { value: 9.5, todo: true }
  }
};


const SECTIONS = [
 {key:"market", nav:"market", text:"cMarket"},
 {key:"loans", nav:"loans", text:"cLoans"},
 {key:"rent", nav:"rent", text:"cRent"},
 {key:"stats", nav:"stats", text:"cStats", title:"cStatsTitle"}
];
const TOPICS = [
 {icon:"first", path:"/fyrstu-kaup", q:"tFirstQ", label:{is:"Fyrstu kaup",en:"First-time buyers",pl:"Pierwszy zakup mieszkania"}},
 {icon:"pension", path:"/séreignasparnaður", q:"tPensionQ", label:{is:"Séreignasparnaður",en:"Private pension savings",pl:"Dobrowolne oszczędności emerytalne"}},
 {icon:"share", path:"/hlutdeildarlán", q:"tShareQ", label:{is:"Hlutdeildarlán",en:"Shared-equity loans",pl:"Kredyty partycypacyjne"}},
 {icon:"index", path:"/verðtrygging", q:"tIndexQ", label:{is:"Verðtrygging",en:"Indexation",pl:"Indeksacja"}}
];
const VIDEOS = [
 {id:"vloQpaGg3EQ", t:"v1"},
 {id:"1LVLf5sRKYk", t:"v2"},
 {id:"k1Ci-bpMI5U", t:"v3"},
 {id:"CKd66Uzx9kI", t:"v4"}
];

/* ---------- Chart data (from Styrmir's chart, HMS) ---------- */
// Heimild: "Samanburður"-blaðið í HMS-skjalinu (Kaupverð – 100 / Leiguverð – 100 dálkarnir),
// byggt á sameinuðum vísitölum HMS fyrir höfuðborgarsvæðið. Mánaðarlega frá jan. 2016 (=100).
// Sept. og okt. 2026 framreiknað með mánaðarbreytingum HMS: íbúðaverð +1,06% og +0,35%, leiguverð -0,92% og -0,23%.
const kaup = [
  ["2016-01",100],["2016-02",100.4],["2016-03",101.1],["2016-04",101.9],["2016-05",103.0],["2016-06",105.3],["2016-07",107.6],["2016-08",108.6],["2016-09",109.0],["2016-10",111.1],["2016-11",112.6],["2016-12",114.2],
  ["2017-01",116.3],["2017-02",119.1],["2017-03",122.3],["2017-04",125.0],["2017-05",127.3],["2017-06",127.6],["2017-07",128.0],["2017-08",129.3],["2017-09",130.3],["2017-10",130.6],["2017-11",129.6],["2017-12",129.9],
  ["2018-01",131.2],["2018-02",131.8],["2018-03",131.7],["2018-04",132.6],["2018-05",133.1],["2018-06",134.3],["2018-07",134.7],["2018-08",134.6],["2018-09",135.4],["2018-10",136.0],["2018-11",137.3],["2018-12",137.5],
  ["2019-01",138.0],["2019-02",136.6],["2019-03",137.4],["2019-04",137.9],["2019-05",138.3],["2019-06",138.5],["2019-07",138.6],["2019-08",139.4],["2019-09",140.2],["2019-10",140.9],["2019-11",140.6],["2019-12",140.7],
  ["2020-01",141.4],["2020-02",142.2],["2020-03",142.4],["2020-04",142.3],["2020-05",143.5],["2020-06",143.8],["2020-07",145.5],["2020-08",146.6],["2020-09",148.0],["2020-10",149.4],["2020-11",150.7],["2020-12",151.5],
  ["2021-01",151.7],["2021-02",152.6],["2021-03",157.7],["2021-04",161.9],["2021-05",164.4],["2021-06",166.8],["2021-07",167.9],["2021-08",170.6],["2021-09",172.7],["2021-10",175.0],["2021-11",176.2],["2021-12",179.5],
  ["2022-01",182.5],["2022-02",187.0],["2022-03",192.7],["2022-04",198.0],["2022-05",203.9],["2022-06",208.5],["2022-07",210.7],["2022-08",209.8],["2022-09",211.5],["2022-10",212.7],["2022-11",212.1],["2022-12",210.7],
  ["2023-01",209.7],["2023-02",210.2],["2023-03",213.4],["2023-04",215.0],["2023-05",216.5],["2023-06",214.1],["2023-07",212.4],["2023-08",213.9],["2023-09",216.9],["2023-10",219.0],["2023-11",219.2],["2023-12",220.2],
  ["2024-01",221.0],["2024-02",225.2],["2024-03",227.0],["2024-04",228.7],["2024-05",231.8],["2024-06",235.1],["2024-07",236.9],["2024-08",240.2],["2024-09",239.6],["2024-10",240],["2024-11",242.0],["2024-12",240.4],
  ["2025-01",244.0],["2025-02",244.2],["2025-03",245.1],["2025-04",246.2],["2025-05",245.1],["2025-06",246.2],["2025-07",246.9],["2025-08",245.5],["2025-09",249.3],["2025-10",249.3],["2025-11",248.4],["2025-12",245.5],
  ["2026-01",249.7],["2026-02",249.9],["2026-03",251.5],["2026-04",251.5],["2026-05",250.4],["2026-06",250.6],["2026-07",250.8],["2026-08",251.0],["2026-09",253.7],["2026-10",254.6]
];
const leiga = [
  ["2016-01",100],["2016-02",101.2],["2016-03",104.5],["2016-04",105.5],["2016-05",104.6],["2016-06",102.8],["2016-07",105.0],["2016-08",106.1],["2016-09",107.6],["2016-10",108.9],["2016-11",109.8],["2016-12",110.2],
  ["2017-01",111.6],["2017-02",112.4],["2017-03",115.4],["2017-04",119.2],["2017-05",119.3],["2017-06",116.9],["2017-07",117.5],["2017-08",120.5],["2017-09",122.5],["2017-10",120.3],["2017-11",122.5],["2017-12",123.1],
  ["2018-01",121.8],["2018-02",124.1],["2018-03",126.8],["2018-04",126.6],["2018-05",127.9],["2018-06",125.0],["2018-07",127.3],["2018-08",131.1],["2018-09",130.1],["2018-10",131.9],["2018-11",133.7],["2018-12",132.7],
  ["2019-01",132.9],["2019-02",133.6],["2019-03",134.0],["2019-04",133.7],["2019-05",134.2],["2019-06",134.5],["2019-07",134.4],["2019-08",135.9],["2019-09",136.9],["2019-10",136.5],["2019-11",136.4],["2019-12",138.5],
  ["2020-01",140.3],["2020-02",139.8],["2020-03",138.3],["2020-04",137.0],["2020-05",133.9],["2020-06",136.9],["2020-07",137.5],["2020-08",137.7],["2020-09",137.9],["2020-10",137.2],["2020-11",138.3],["2020-12",138.5],
  ["2021-01",137.5],["2021-02",135.5],["2021-03",137.5],["2021-04",138.3],["2021-05",138.5],["2021-06",138.0],["2021-07",139.8],["2021-08",142.5],["2021-09",141.3],["2021-10",141.3],["2021-11",143.0],["2021-12",144.0],
  ["2022-01",145.5],["2022-02",146.8],["2022-03",151.4],["2022-04",149.3],["2022-05",151.4],["2022-06",150.2],["2022-07",150.1],["2022-08",150.9],["2022-09",151.9],["2022-10",153.2],["2022-11",156.4],["2022-12",158.5],
  ["2023-01",157.4],["2023-02",160.5],["2023-03",161.8],["2023-04",159.7],["2023-05",165.3],["2023-06",169.8],["2023-07",170.1],["2023-08",172.6],["2023-09",174.0],["2023-10",176.2],["2023-11",177.9],["2023-12",174.5],
  ["2024-01",175.0],["2024-02",177.7],["2024-03",178.7],["2024-04",181.5],["2024-05",187.3],["2024-06",191.9],["2024-07",195.7],["2024-08",193.6],["2024-09",192.4],["2024-10",195.9],["2024-11",198.3],["2024-12",196.5],
  ["2025-01",196.0],["2025-02",198.0],["2025-03",198.8],["2025-04",201.5],["2025-05",203.8],["2025-06",203.0],["2025-07",205.8],["2025-08",206.4],["2025-09",206.6],["2025-10",208.9],["2025-11",209.4],["2025-12",206.4],
  ["2026-01",205.8],["2026-02",208.3],["2026-03",211.4],["2026-04",212.9],["2026-05",213.7],["2026-06",214.5],["2026-07",215.5],["2026-08",215.2],["2026-09",213.2],["2026-10",212.7]
];


/* ---------- Build: cards, topics, videos, footer ---------- */
let curVideo = 0;
const thumb = id => `<img src="https://i.ytimg.com/vi/${id}/hqdefault.jpg" alt="" loading="lazy" onerror="this.remove()">`;
function video(i, play){
  curVideo = i; const v = VIDEOS[i];
  const main = $("#vMain");
  if(play){
    ytPlay(main, v.id, t(v.t));
  } else {
    main.innerHTML = ytPoster(v.id, t(v.t)) + `<button class="v-btn" aria-label="${t("play")}: ${t(v.t)}"><span class="v-play">${ICONS.play}</span></button>`;
    main.querySelector(".v-btn").addEventListener("click", () => video(curVideo, true));
  }
  $("#vMainTitle").textContent = t(v.t);
  $("#vMainYt").href = "https://www.youtube.com/watch?v=" + v.id;
  $("#vList").innerHTML = VIDEOS.map((x,k) => `
    <li><button class="v-item" aria-current="${k===i}" data-k="${k}">
      <span class="v-thumb">${thumb(x.id)}<i>${ICONS.play}</i></span>
      <span><b>${t(x.t)}</b><small>${k===i ? t("nowShowing") : t("watch")}</small></span></button></li>`).join("");
  $$(".v-item").forEach(b => b.addEventListener("click", () => video(+b.dataset.k, true)));
}
function buildContent(){
  $("#cards").innerHTML = SECTIONS.map(s => {
    const n = NAV.find(x => x.key === s.nav);
    return `<a class="room" href="${url(n.path)}">
      <div class="card-ic">${ICONS[s.key]}</div>
      <h3>${s.title ? t(s.title) : n.label[lang]}</h3><p>${t(s.text)}</p>
      <span class="more">${t("more")} ${ICONS.arrow}</span></a>`;
  }).join("");
  const stop = (num, cls, href, icon, title, text) => `
    <li class="rv"><a class="stop ${cls}" href="${href}">
      <span class="stop-num">${num}</span>
      <span class="stop-card"><span class="topic-top"><span class="topic-ic">${icon}</span><span class="topic-go">${ICONS.arrow}</span></span>
      <h3>${title}</h3><p>${text}</p></span></a></li>`;
  $("#topics").innerHTML = TOPICS.map((tp,i) => stop(i+1, "", url(tp.path), ICONS[tp.icon], tp.label[lang], t(tp.q))).join("")
    + stop(ICONS.calc, "goal", "#reiknivel", ICONS.calc, t("goalTitle"), t("goalText"));
  video(curVideo, false);
}

/* ---------- Key figures ---------- */
function buildFigures(){
  const last = kaup.length - 1, prev = last - 12;
  const ch = (arr) => (arr[last][1] / arr[prev][1] - 1) * 100;
  const hc = ch(kaup), rc = ch(leiga);
  const arrow = v => `<span class="arrow ${v>0?'up':''}">${v>0?'▲':'▼'}</span>`;
  const figs = [
    {label:t("fPolicy"), value:pct(SITE_DATA.policyRate.value,2), sub:t("fPolicySub") + ", " + monthName(SITE_DATA.policyRate.date).toLowerCase(), todo:SITE_DATA.policyRate.todo},
    {label:t("fInfl"), value:pct(SITE_DATA.inflation.value), sub:t("fInflSub") + ", " + monthName(SITE_DATA.inflation.date).toLowerCase(), todo:SITE_DATA.inflation.todo},
    {label:t("fHouse"), value:(hc>0?"+":"") + pct(hc), sub:t("fChangeSub") + ", " + monthName(kaup[last][0]).toLowerCase(), extra:arrow(hc)},
    {label:t("fRent"), value:(rc>0?"+":"") + pct(rc), sub:t("fChangeSub") + ", " + monthName(leiga[last][0]).toLowerCase(), extra:arrow(rc)}
  ];
  $("#figGrid").innerHTML = figs.map(f => `
    <div class="fig"><div class="fig-label">${f.label}</div>
    <div class="fig-value">${f.value}${f.extra||""}${todoDot(f.todo)}</div>
    <div class="fig-sub">${f.sub}</div></div>`).join("");
}

/* ---------- Hero chart (Styrmir's chart code, adapted) ---------- */
const priceChart = (() => {
  const holder = $("#chartWrap"), svg = $("#chart"), tip = $("#chartTip");
  const series = [{key:"kaup", color:"#0061ff", data:kaup, on:true},{key:"leiga", color:"#ff0050", data:leiga, on:true}];
  let x, y, padT, plotH, lastW = 0;
  // Línurnar teiknast einu sinni, þegar nýjustu gögnin eru komin og línuritið sést á skjánum
  const still = matchMedia("(prefers-reduced-motion: reduce)").matches;
  let played = still, dataReady = false, inView = false, paths = [];
  function play(){
    if(played || !dataReady || !inView) return;
    played = true;
    paths.forEach(p => { p.getBoundingClientRect(); p.style.transition = "stroke-dashoffset 1.8s cubic-bezier(.4,0,.2,1) .15s"; p.style.strokeDashoffset = 0; });
    svg.classList.add("drawn");
  }
  new IntersectionObserver((es, ob) => { if(es[0].isIntersecting){ inView = true; ob.disconnect(); play(); } }, {threshold: .35}).observe(holder);
  if(still) svg.classList.add("drawn");
  function legend(){
    $("#chartLegend").innerHTML = series.map(s => `<button type="button" aria-pressed="${s.on}" data-k="${s.key}"><span class="key" style="background:${s.color}"></span>${t(s.key)}</button>`).join("");
    $$("#chartLegend button").forEach(b => b.addEventListener("click", () => {
      const s = series.find(s => s.key === b.dataset.k);
      if(series.filter(x => x.on).length === 1 && s.on) return;
      s.on = !s.on; b.setAttribute("aria-pressed", s.on); render(true);
    }));
  }
  function render(force){
    const W = Math.max(280, holder.clientWidth);
    if(!force && W === lastW) return; lastW = W;
    const H = W < 480 ? 210 : 300;
    const padL = 34, padR = 10, padB = 26; padT = 12;
    plotH = H - padT - padB;
    const plotW = W - padL - padR;
    svg.setAttribute("viewBox", `0 0 ${W} ${H}`); svg.setAttribute("height", H);
    svg.setAttribute("aria-label", t("chartTitle"));
    svg.replaceChildren(); paths = [];
    x = i => padL + (i/(kaup.length-1)) * plotW;
    const all = kaup.concat(leiga).map(d => d[1]);
    const dMin = Math.min(...all), dMax = Math.max(...all);
    const step = niceNum(niceNum(dMax - dMin, false) / 6, true);
    const yMin = Math.floor(dMin/step)*step, yMax = Math.ceil(dMax/step)*step;
    y = v => padT + plotH - ((v - yMin)/(yMax - yMin)) * plotH;
    for(let v = yMin; v <= yMax + 1e-9; v += step){
      el("line",{x1:padL,x2:W-padR,y1:y(v),y2:y(v),class:"gridline"},svg);
      el("text",{x:padL-7,y:y(v)+3.5,"text-anchor":"end",class:"axis-label"},svg).textContent = Math.round(v);
    }
    const yearStep = W < 380 ? 4 : (W < 520 ? 2 : 1);
    const baseY = padT + plotH; let yc = 0;
    kaup.forEach((d,i) => {
      if(d[0].slice(5,7) !== "01") return;
      el("line",{x1:x(i),x2:x(i),y1:baseY,y2:baseY+5,class:"tick"},svg);
      if(yc++ % yearStep === 0) el("text",{x:x(i),y:baseY+17,"text-anchor":"middle",class:"axis-label"},svg).textContent = d[0].slice(0,4);
    });
    series.forEach(s => {
      if(!s.on) return;
      const d = s.data.map((p,i) => (i?"L":"M") + x(i).toFixed(1) + "," + y(p[1]).toFixed(1)).join("");
      const path = el("path",{d, class:"series-line", stroke:s.color},svg);
      if(!played){
        const len = path.getTotalLength();
        path.style.strokeDasharray = len; path.style.strokeDashoffset = len;
        paths.push(path);
      }
      const li = s.data.length-1;
      el("circle",{cx:x(li),cy:y(s.data[li][1]),r:4,fill:s.color},svg);
      const chg = s.data[li][1] - s.data[0][1];
      const lab = el("text",{x:x(li)-8,y:y(s.data[li][1])-11,"text-anchor":"end",fill:s.color,"font-weight":"700","font-size":W<480?12:13.5,"font-family":"var(--font)",style:"paint-order:stroke;stroke:#f6faff;stroke-width:4px"},svg);
      lab.textContent = "+" + nf(chg,0) + "% " + t("sinceStart");
    });
    el("line",{id:"hoverLine",class:"hover-line",y1:padT,y2:padT+plotH,style:"display:none"},svg);
    series.forEach(s => el("circle",{id:"hd-"+s.key,r:4,stroke:s.color,class:"series-dot",style:"display:none"},svg));
  }
  function nearest(cx){
    const r = svg.getBoundingClientRect(), px = (cx - r.left) * (svg.viewBox.baseVal.width / r.width);
    let best = 0, bd = Infinity;
    kaup.forEach((d,i) => { const dd = Math.abs(x(i) - px); if(dd < bd){ bd = dd; best = i; } });
    return best;
  }
  function show(i){
    const hl = $("#hoverLine"); hl.setAttribute("x1", x(i)); hl.setAttribute("x2", x(i)); hl.style.display = "";
    let html = `<div class="t-date">${monthName(kaup[i][0])}</div>`;
    let top = Infinity;
    series.forEach(s => {
      const dot = $("#hd-"+s.key);
      if(!s.on){ dot.style.display = "none"; return; }
      html += `<div class="t-row"><span class="t-key" style="background:${s.color}"></span><span>${t(s.key)}</span><span class="t-val">${nf(s.data[i][1],1)}</span></div>`;
      dot.setAttribute("cx", x(i)); dot.setAttribute("cy", y(s.data[i][1])); dot.style.display = "";
      top = Math.min(top, y(s.data[i][1]));
    });
    tip.innerHTML = html; tip.classList.add("visible");
    const wr = holder.getBoundingClientRect(), sr = svg.getBoundingClientRect();
    const tw = tip.offsetWidth, th = tip.offsetHeight;
    let left = (sr.left - wr.left) + x(i) + 12;
    if(left + tw > wr.width) left = (sr.left - wr.left) + x(i) - tw - 12;
    let tp = top - th - 10; if(tp < 0) tp = 4;
    tip.style.transform = `translate(${left}px,${tp}px)`;
  }
  function hide(){
    tip.classList.remove("visible"); tip.style.transform = "translate(-9999px,-9999px)";
    const hl = $("#hoverLine"); if(hl) hl.style.display = "none";
    series.forEach(s => { const d = $("#hd-"+s.key); if(d) d.style.display = "none"; });
  }
  svg.addEventListener("mousemove", e => show(nearest(e.clientX)));
  svg.addEventListener("mouseleave", hide);
  svg.addEventListener("touchstart", e => show(nearest(e.touches[0].clientX)), {passive:true});
  svg.addEventListener("touchmove", e => show(nearest(e.touches[0].clientX)), {passive:true});
  svg.addEventListener("touchend", hide);
  new ResizeObserver(() => render()).observe(holder);
  setTimeout(() => { dataReady = true; play(); }, 2500); // til vara ef gögnin skila sér ekki
  return { refresh(){ legend(); render(true); }, ready(){ dataReady = true; play(); } };
})();

/* ---------- Loan calculator ---------- */
const calc = !document.getElementById("calcInputs") ? { refresh(){}, state:{} } : (() => {
  const S = {
    amount: SITE_DATA.calc.amount, years: SITE_DATA.calc.years,
    rIdx: SITE_DATA.calc.rateIndexed.value, rNom: SITE_DATA.calc.rateNominal.value,
    infl: SITE_DATA.inflation.value, view: "pay", real: true
  };
  const FIELDS = [
    {k:"amount", lab:"amount", min:5e6, max:150e6, step:1e6, unit:"cur", w:"w-amt", dec:0},
    {k:"years", lab:"years", min:5, max:40, step:1, unit:"yearsU", w:"w-sm", dec:0},
    {k:"rNom", lab:"rateNom", min:0, max:15, step:.05, unit:"%", w:"w-sm", dec:2, todo:()=>SITE_DATA.calc.rateNominal.todo},
    {k:"rIdx", lab:"rateIdx", min:0, max:10, step:.05, unit:"%", w:"w-sm", dec:2, cls:"idx", todo:()=>SITE_DATA.calc.rateIndexed.todo},
    {k:"infl", lab:"infl", min:0, max:15, step:.1, unit:"%", w:"w-sm", dec:1, cls:"idx", todo:()=>SITE_DATA.inflation.todo}
  ];
  let res;
  function compute(){
    const n = S.years * 12, L = S.amount;
    // Óverðtryggt, jafnar greiðslur
    const i = S.rNom / 100 / 12;
    const payN = i ? L * i / (1 - Math.pow(1 + i, -n)) : L / n;
    let balN = L, totN = 0; const nomPay = [], nomBal = [L];
    // Verðtryggt, jafnar greiðslur: höfuðstóll uppfærður mánaðarlega með verðbólgu
    const j = S.rIdx / 100 / 12, pm = Math.pow(1 + S.infl / 100, 1/12) - 1;
    let balI = L, totI = 0, firstI = 0; const idxPay = [], idxBal = [L];
    for(let m = 1; m <= n; m++){
      const iN = balN * i; balN -= (payN - iN); totN += payN;
      balI *= (1 + pm);
      const rem = n - m + 1;
      const pI = j ? balI * j / (1 - Math.pow(1 + j, -rem)) : balI / rem;
      if(m === 1) firstI = pI;
      balI -= (pI - balI * j); totI += pI;
      const dfl = S.real ? Math.pow(1 + pm, m) : 1;   // á verðlagi dagsins í dag
      if(m % 12 === 1){ nomPay.push(payN / dfl); idxPay.push(pI / dfl); }
      if(m % 12 === 0){ nomBal.push(Math.max(0, balN) / dfl); idxBal.push(Math.max(0, balI) / dfl); }
    }
    res = {payN, totN, firstI, totI, nomPay, idxPay, nomBal, idxBal, lastI: idxPay[idxPay.length-1]};
  }
  function inputs(){
    $("#calcInputs").innerHTML = FIELDS.map(f => `
      <div class="field ${f.cls||""}">
        <div class="field-top"><label for="in-${f.k}">${t(f.lab)} ${f.todo ? todoDot(f.todo()) : ""}</label>
          <div class="num ${f.w}"><input id="in-${f.k}" inputmode="decimal" autocomplete="off" data-k="${f.k}"><span>${f.unit === "%" ? "%" : t(f.unit)}</span></div></div>
        <input type="range" min="${f.min}" max="${f.max}" step="${f.step}" data-k="${f.k}" aria-label="${t(f.lab)}">
      </div>`).join("");
    FIELDS.forEach(f => {
      const num = $("#in-"+f.k), rng = $(`input[type=range][data-k="${f.k}"]`);
      const sync = () => {
        num.value = nf(S[f.k], f.dec); rng.value = S[f.k];
        rng.style.setProperty("--p", ((Math.min(f.max, Math.max(f.min, S[f.k])) - f.min) / (f.max - f.min) * 100) + "%");
      };
      f.sync = sync; sync();
      rng.addEventListener("input", () => { S[f.k] = +rng.value; num.value = nf(S[f.k], f.dec); rng.style.setProperty("--p", ((S[f.k]-f.min)/(f.max-f.min)*100)+"%"); update(); });
      num.addEventListener("change", () => {
        const raw = num.value.replace(/\s/g,"");
        const v = lang === "en" ? parseFloat(raw.replace(/,/g,"")) : parseFloat(raw.replace(/\./g,"").replace(",", "."));
        if(!isNaN(v)) S[f.k] = Math.min(f.max * (f.k==="amount"?10:1), Math.max(f.min, v));
        sync(); update();
      });
      num.addEventListener("keydown", e => { if(e.key === "Enter") num.blur(); });
    });
  }
  function results(){
    const box = (cls, name, first, total) => `
      <div class="res ${cls}"><div class="res-name">${name}</div>
      <div class="res-row res-big"><span>${t("first")}</span><b>${kr(first)}</b></div>
      <div class="res-row"><span>${t("total")}</span><b>${kr(total)}</b></div></div>`;
    $("#calcResults").innerHTML = box("", t("nom"), res.payN, res.totN) + box("idx", t("idx"), res.firstI, res.totI);
  }
  const holder = $("#calcWrap"), svg = $("#calcChart"), tip = $("#calcTip");
  let x, y, lastW = 0;
  function chart(force){
    const W = Math.max(280, holder.clientWidth);
    if(!force && W === lastW) return; lastW = W;
    const H = W < 480 ? 220 : 260, padL = 52, padR = 10, padT = 12, padB = 26;
    const plotW = W - padL - padR, plotH = H - padT - padB;
    svg.setAttribute("viewBox", `0 0 ${W} ${H}`); svg.setAttribute("height", H);
    svg.replaceChildren();
    const pay = S.view === "pay";
    const A = pay ? res.nomPay : res.nomBal, B = pay ? res.idxPay : res.idxBal;
    const len = A.length;
    x = k => padL + (len > 1 ? k/(len-1) : 0) * plotW;
    const max = Math.max(...A, ...B) || 1;
    const step = niceNum(max / 4, true), yMax = Math.ceil(max/step)*step;
    y = v => padT + plotH - (v / yMax) * plotH;
    const big = yMax >= 1e6;
    for(let v = 0; v <= yMax + 1e-6; v += step){
      el("line",{x1:padL,x2:W-padR,y1:y(v),y2:y(v),class:"gridline"},svg);
      el("text",{x:padL-7,y:y(v)+3.5,"text-anchor":"end",class:"axis-label"},svg).textContent = big ? nf(v/1e6, v/1e6 % 1 ? 1 : 0) + (lang==="is"?" m.":"M") : nf(v/1e3) + (lang==="is"?" þ.":"k");
    }
    const ys = len > 20 ? 10 : 5;
    for(let k = 0; k < len; k++){
      const yr = pay ? k + 1 : k;
      if(yr % ys === 0 || k === 0) el("text",{x:x(k),y:padT+plotH+17,"text-anchor":"middle",class:"axis-label"},svg).textContent = yr;
    }
    [[A,"#0061ff"],[B,"#ff0050"]].forEach(([d,c]) => {
      el("path",{d:d.map((v,k) => (k?"L":"M") + x(k).toFixed(1) + "," + y(v).toFixed(1)).join(""), class:"series-line", stroke:c},svg);
    });
    el("line",{id:"cHover",class:"hover-line",y1:padT,y2:padT+plotH,style:"display:none"},svg);
    el("circle",{id:"cdA",r:4,stroke:"#0061ff",class:"series-dot",style:"display:none"},svg);
    el("circle",{id:"cdB",r:4,stroke:"#ff0050",class:"series-dot",style:"display:none"},svg);
    svg.setAttribute("aria-label", t(pay ? "tabPay" : "tabBal"));
  }
  function show(cx){
    const pay = S.view === "pay", A = pay ? res.nomPay : res.nomBal, B = pay ? res.idxPay : res.idxBal;
    const r = svg.getBoundingClientRect(), px = (cx - r.left) * (svg.viewBox.baseVal.width / r.width);
    let k = 0, bd = Infinity; A.forEach((_,i) => { const d = Math.abs(x(i) - px); if(d < bd){ bd = d; k = i; } });
    const hl = $("#cHover"); hl.setAttribute("x1", x(k)); hl.setAttribute("x2", x(k)); hl.style.display = "";
    [["#cdA",A],["#cdB",B]].forEach(([id,d]) => { const c = $(id); c.setAttribute("cx", x(k)); c.setAttribute("cy", y(d[k])); c.style.display = ""; });
    tip.innerHTML = `<div class="t-date">${t("year")} ${pay ? k + 1 : k}</div>
      <div class="t-row"><span class="t-key" style="background:#0061ff"></span><span>${t("nom")}</span><span class="t-val">${kr(A[k])}</span></div>
      <div class="t-row"><span class="t-key" style="background:#ff0050"></span><span>${t("idx")}</span><span class="t-val">${kr(B[k])}</span></div>`;
    tip.classList.add("visible");
    const wr = holder.getBoundingClientRect(), sr = svg.getBoundingClientRect(), tw = tip.offsetWidth, th = tip.offsetHeight;
    let left = (sr.left - wr.left) + x(k) + 12; if(left + tw > wr.width) left = (sr.left - wr.left) + x(k) - tw - 12;
    let tp = Math.min(y(A[k]), y(B[k])) - th - 10; if(tp < 0) tp = 4;
    tip.style.transform = `translate(${left}px,${tp}px)`;
  }
  function hide(){ tip.classList.remove("visible"); tip.style.transform = "translate(-9999px,-9999px)"; ["#cHover","#cdA","#cdB"].forEach(id => { const e = $(id); if(e) e.style.display = "none"; }); }
  svg.addEventListener("mousemove", e => show(e.clientX));
  svg.addEventListener("mouseleave", hide);
  svg.addEventListener("touchstart", e => show(e.touches[0].clientX), {passive:true});
  svg.addEventListener("touchmove", e => show(e.touches[0].clientX), {passive:true});
  svg.addEventListener("touchend", hide);
  $("#realToggle").addEventListener("change", e => { S.real = e.target.checked; update(); });
  $$("#calcTabs button").forEach(b => b.addEventListener("click", () => {
    S.view = b.dataset.v; $$("#calcTabs button").forEach(x => x.setAttribute("aria-pressed", x === b)); chart(true);
  }));
  new ResizeObserver(() => chart()).observe(holder);
  function update(){ compute(); results(); chart(true); }
  return { refresh(){ inputs(); update(); }, state:S, get res(){ return res; } };
})();


/* ---------- Page hook ---------- */
onLang(() => { buildContent(); buildFigures(); priceChart.refresh(); calc.refresh(); });
startSite();

/* Nýjustu tölur úr data/rates.json */
fetch("data/rates.json", {cache: "no-cache"}).then(r => r.ok ? r.json() : null).then(d => {
  if(!d) return;
  const S = calc.state, init = {rNom: SITE_DATA.calc.rateNominal.value, rIdx: SITE_DATA.calc.rateIndexed.value, infl: SITE_DATA.inflation.value};
  if(d.policyRate) SITE_DATA.policyRate = {value: d.policyRate.value, date: (d.policyRate.effective || d.policyRate.updated || "").slice(0,7), todo: false};
  if(d.inflation) SITE_DATA.inflation = {value: d.inflation.value, date: d.inflation.period || (d.inflation.updated || "").slice(0,7), todo: false};
  if(d.mortgage){
    const est = d.mortgage.source === "áætlun";
    SITE_DATA.calc.rateNominal = {value: d.mortgage.nominal, todo: est};
    SITE_DATA.calc.rateIndexed = {value: d.mortgage.indexed, todo: est};
  }
  // Uppfæra reiknivélina nema notandinn sé byrjaður að breyta gildunum
  if(S.rNom === init.rNom) S.rNom = SITE_DATA.calc.rateNominal.value;
  if(S.rIdx === init.rIdx) S.rIdx = SITE_DATA.calc.rateIndexed.value;
  if(S.infl === init.infl) S.infl = SITE_DATA.inflation.value;
  buildFigures(); calc.refresh();
}).catch(() => {});

/* Íbúða- og leiguverð úr data/housing.json (uppfært sjálfkrafa daglega) */
fetch("data/housing.json", {cache: "no-cache"}).then(r => r.ok ? r.json() : null).then(d => {
  if(!d || !Array.isArray(d.kaup) || !Array.isArray(d.leiga)) return;
  // Sýna aðeins mánuði þar sem báðar vísitölur liggja fyrir
  const end = [d.kaup.at(-1)[0], d.leiga.at(-1)[0]].sort()[0];
  const upTo = a => a.filter(x => x[0] <= end);
  kaup.splice(0, kaup.length, ...upTo(d.kaup));
  leiga.splice(0, leiga.length, ...upTo(d.leiga));
  buildFigures(); priceChart.refresh();
}).catch(() => {}).finally(() => priceChart.ready());
