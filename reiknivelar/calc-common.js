/* Húsnæði.is reiknivélar: sameiginlegur kóði (tungumál, talnasnið, útreikningar, línurit) */
(function(){
"use strict";
const C = window.HCONFIG;
const LANGS = ["is","en","pl"];
const LOCALE = { is:"is-IS", en:"en-GB", pl:"pl-PL" };
const FLAGS = {
  is:'<svg viewBox="0 0 25 18" preserveAspectRatio="xMidYMid slice"><rect width="25" height="18" fill="#02529C"/><path d="M0 9h25M9 0v18" stroke="#fff" stroke-width="4"/><path d="M0 9h25M9 0v18" stroke="#DC1E35" stroke-width="2"/></svg>',
  en:'<svg viewBox="0 0 60 30" preserveAspectRatio="xMidYMid slice"><clipPath id="ukc"><path d="M30 15h30v15zv15H0zH0V0zV0h30z"/></clipPath><rect width="60" height="30" fill="#012169"/><path d="M0 0l60 30M60 0L0 30" stroke="#fff" stroke-width="6"/><path d="M0 0l60 30M60 0L0 30" clip-path="url(#ukc)" stroke="#C8102E" stroke-width="4"/><path d="M30 0v30M0 15h60" stroke="#fff" stroke-width="10"/><path d="M30 0v30M0 15h60" stroke="#C8102E" stroke-width="6"/></svg>',
  pl:'<svg viewBox="0 0 16 10" preserveAspectRatio="xMidYMid slice"><rect width="16" height="10" fill="#fff"/><rect y="5" width="16" height="5" fill="#DC143C"/></svg>'
};
const LNAME = { is:"Íslenska", en:"English", pl:"Polski" };
const MONTHS = {
  is:["janúar","febrúar","mars","apríl","maí","júní","júlí","ágúst","september","október","nóvember","desember"],
  en:["January","February","March","April","May","June","July","August","September","October","November","December"],
  pl:["styczeń","luty","marzec","kwiecień","maj","czerwiec","lipiec","sierpień","wrzesień","październik","listopad","grudzień"]
};

/* Sameiginlegur texti fyrir allar reiknivélarnar */
const COMMON = {
  is:{ skip:"Fara beint í reiknivélina", kr:"kr.", krMonth:"kr. á mán.", years:"ár", pct:"%",
    reset:"Nota sjálfgefið", sources:"Heimildir og forsendur",
    defRates:"Sjálfgefnir vextir: {src}, {date}.", defInfl:"Sjálfgefin verðbólga: {src}, 12 mánaða breyting í {period} ({date}).",
    inflNote:"Verðbólguforsendan er ekki spá. Hún miðar við síðustu mælingu og helst óbreytt allan lánstímann. Vextir og verðbólga geta breyst mikið á lánstímanum.",
    disclaimer:"Niðurstöðurnar eru aðeins til viðmiðunar og eru ekki lánsloforð.",
    others:"Aðrar reiknivélar", c1:"Greiðslubyrði húsnæðisláns", c2:"Hámarkslán miðað við tekjur", c3:"Eiginfjárframlag",
    indexed:"Verðtryggt", nominal:"Óverðtryggt", annuity:"Jafnar greiðslur", equal:"Jafnar afborganir",
    yes:"Já", no:"Nei", year:"Ár", yearN:"Ár {n}", foot:"Húsnæði.is er óháður upplýsingavefur um húsnæðismál.",
    liveOk:"Tölur uppfærðar sjálfkrafa {date}." },
  en:{ skip:"Skip to the calculator", kr:"ISK", krMonth:"ISK/month", years:"years", pct:"%",
    reset:"Use default", sources:"Sources and assumptions",
    defRates:"Default interest rates: {src}, {date}.", defInfl:"Default inflation: {src}, 12 month change in {period} ({date}).",
    inflNote:"The inflation assumption is not a forecast. It uses the latest measurement and stays the same for the whole loan term. Interest rates and inflation can change a lot over a loan's life.",
    disclaimer:"The results are indicative only and are not a loan approval.",
    others:"Other calculators", c1:"Mortgage payments", c2:"Maximum loan based on income", c3:"Down payment",
    indexed:"Indexed", nominal:"Non indexed", annuity:"Equal payments", equal:"Equal principal",
    yes:"Yes", no:"No", year:"Year", yearN:"Year {n}", foot:"Húsnæði.is is an independent information site about housing.",
    liveOk:"Figures updated automatically {date}." },
  pl:{ skip:"Przejdź do kalkulatora", kr:"ISK", krMonth:"ISK/mies.", years:"lat", pct:"%",
    reset:"Użyj domyślnej", sources:"Źródła i założenia",
    defRates:"Domyślne oprocentowanie: {src}, {date}.", defInfl:"Domyślna inflacja: {src}, zmiana 12 miesięczna, {period} ({date}).",
    inflNote:"Założenie inflacji nie jest prognozą. Opiera się na ostatnim pomiarze i pozostaje stałe przez cały okres kredytu. Oprocentowanie i inflacja mogą się znacznie zmienić w trakcie spłaty.",
    disclaimer:"Wyniki mają charakter orientacyjny i nie stanowią przyrzeczenia kredytu.",
    others:"Inne kalkulatory", c1:"Rata kredytu mieszkaniowego", c2:"Maksymalny kredyt według dochodu", c3:"Wkład własny",
    indexed:"Indeksowany", nominal:"Nieindeksowany", annuity:"Raty równe", equal:"Raty malejące",
    yes:"Tak", no:"Nie", year:"Rok", yearN:"Rok {n}", foot:"Húsnæði.is to niezależny serwis informacyjny o mieszkalnictwie.",
    liveOk:"Dane zaktualizowane automatycznie {date}." }
};

const H = window.H = {};
H.C = C;
let lang = "is", DICT = COMMON, onLangCbs = [];
const store = { get(k){ try{ return localStorage.getItem(k); }catch(e){ return null; } }, set(k,v){ try{ localStorage.setItem(k,v); }catch(e){} } };

H.extend = function(page){ DICT = {}; LANGS.forEach(l => DICT[l] = Object.assign({}, COMMON[l], page[l] || {})); };
H.t = function(k, vars){
  let s = (DICT[lang] && DICT[lang][k]) ?? (DICT.is && DICT.is[k]) ?? k;
  if(vars) for(const v in vars) s = s.split("{"+v+"}").join(vars[v]);
  return s;
};
H.lang = () => lang;
H.onLang = cb => onLangCbs.push(cb);

/* ---------- Talnasnið ---------- */
// Eigið talnasnið (Intl styður ekki íslensku í öllum vöfrum): 45.000.000 og 9,69
const SEP = { is:[".", ","], en:[",", "."], pl:["\u00a0", ","] };
H.num = (v, d=0) => {
  if(!isFinite(v)) return "–";
  const neg = v < 0, f = Math.abs(v).toFixed(d).split(".");
  const [g, dec] = SEP[lang];
  const int = f[0].replace(/\B(?=(\d{3})+(?!\d))/g, g);
  return (neg && +f.join("") !== 0 ? "\u2212" : "") + int + (d ? dec + f[1] : "");
};
H.kr = v => H.num(Math.round(v)) + " " + H.t("kr");
H.krM = v => {   // stuttar tölur: 45,2 m.kr.
  const a = Math.abs(v);
  const unit = { is:["m.kr.","ma.kr."], en:["m ISK","bn ISK"], pl:["mln ISK","mld ISK"] }[lang];
  if(a >= 1e9) return H.num(v/1e9, 1) + " " + unit[1];
  if(a >= 1e6) return H.num(v/1e6, a >= 1e8 ? 0 : 1) + " " + unit[0];
  return H.kr(v);
};
H.pct = (v, d=1) => H.num(v, d) + " %";
H.date = iso => {
  if(!iso) return "";
  const [y,m,d] = iso.split("-").map(Number);
  if(!d) return MONTHS[lang][m-1] + " " + y;
  return lang === "en" ? `${d} ${MONTHS.en[m-1]} ${y}` : lang === "pl" ? `${d}.${String(m).padStart(2,"0")}.${y}` : `${d}. ${MONTHS.is[m-1]} ${y}`;
};
H.period = p => { const [y,m] = p.split("-").map(Number); return MONTHS[lang][m-1] + " " + y; };
H.parse = function(str){
  if(str == null) return NaN;
  let s = String(str).replace(/[\s ]/g, "").replace(/kr\.?|isk|%|ár|years|lat/gi, "");
  if(lang === "en"){ s = s.replace(/,/g, ""); }
  else {
    // íslenska og pólska: punktur er þúsundaskil, komma er tugabrot
    if(/,/.test(s)) s = s.replace(/\./g, "").replace(",", ".");
    else if(/\.\d{3}(\.|$)/.test(s)) s = s.replace(/\./g, "");
  }
  return s === "" ? NaN : Number(s);
};

/* ---------- Innsláttarreitir ----------
   <input data-kind="kr|pct|yr" data-min data-max> */
H.bindInput = function(el, onChange){
  const kind = el.dataset.kind;
  const min = el.dataset.min != null ? +el.dataset.min : -Infinity;
  const max = el.dataset.max != null ? +el.dataset.max : Infinity;
  el.setAttribute("inputmode", kind === "pct" ? "decimal" : "numeric");
  el.setAttribute("autocomplete", "off");
  const fmt = v => kind === "kr" ? H.num(v) : kind === "pct" ? H.num(v, Number.isInteger(v) ? 0 : Math.abs(Math.round(v*100) - Math.round(v*10)*10) < 1e-9 ? 1 : 2) : H.num(v, Number.isInteger(v) ? 0 : 1);
  const api = {
    value: +el.dataset.value || 0,
    set(v, silent){ api.value = v; el.value = fmt(v); el.removeAttribute("aria-invalid"); if(!silent) onChange && onChange(); },
    refresh(){ el.value = fmt(api.value); }
  };
  el.addEventListener("input", () => {
    const v = H.parse(el.value);
    if(isFinite(v) && v >= min && v <= max){ api.value = v; el.removeAttribute("aria-invalid"); onChange && onChange(); }
    else el.setAttribute("aria-invalid", "true");
  });
  el.addEventListener("blur", () => {
    let v = H.parse(el.value);
    if(!isFinite(v)) v = api.value;
    v = Math.min(max, Math.max(min, v));
    api.set(v);
  });
  el.addEventListener("focus", () => setTimeout(() => { try{ el.select(); }catch(e){} }, 0));
  api.set(api.value, true);
  H.onLang(() => api.refresh());
  return api;
};

/* Segmented val: <div class="seg" data-name> <button data-v> */
H.bindSeg = function(el, onChange){
  const btns = [...el.querySelectorAll("button")];
  const api = {
    value: (btns.find(b => b.getAttribute("aria-pressed") === "true") || btns[0]).dataset.v,
    set(v, silent){ api.value = v; btns.forEach(b => b.setAttribute("aria-pressed", String(b.dataset.v === v))); if(!silent) onChange && onChange(); }
  };
  btns.forEach(b => { b.type = "button"; b.addEventListener("click", () => api.set(b.dataset.v)); });
  api.set(api.value, true);
  return api;
};

/* ---------- Þýðingar í DOM ---------- */
function applyText(){
  document.documentElement.lang = lang;
  document.querySelectorAll("[data-t]").forEach(e => e.textContent = H.t(e.dataset.t));
  document.querySelectorAll("[data-th]").forEach(e => e.innerHTML = H.t(e.dataset.th));
  document.querySelectorAll("[data-tip]").forEach(e => { const p = e.querySelector(".tip-pop"); if(p) p.textContent = H.t(e.dataset.tip); e.setAttribute("aria-label", H.t("tipLabel") === "tipLabel" ? "?" : H.t("tipLabel")); });
  document.querySelectorAll("[data-ta]").forEach(e => e.setAttribute("aria-label", H.t(e.dataset.ta)));
  document.title = H.t("docTitle");
  const g = document.querySelector(".c-lang");
  if(g) g.querySelectorAll("button").forEach(b => b.setAttribute("aria-pressed", String(b.getAttribute("lang") === lang)));
}
H.setLang = function(l){ lang = LANGS.includes(l) ? l : "is"; store.set("hlang", lang); applyText(); onLangCbs.forEach(cb => cb()); };

/* ---------- Haus, fótur, útskýringar ---------- */
const LOGO = "<svg viewBox=\"0 0 1688 256\" fill-rule=\"evenodd\" role=\"img\" aria-label=\"H\u00fasn\u00e6\u00f0i.is\"><defs><clipPath id=\"cClipH\"><rect x=\"0\" y=\"0\" width=\"240\" height=\"256\"/></clipPath><clipPath id=\"cClipT\"><rect x=\"238\" y=\"0\" width=\"1450\" height=\"256\"/></clipPath></defs><g clip-path=\"url(#cClipH)\"><g class=\"lg-h\"><path fill=\"#0048EE\" d=\"M1.7 247.3C1.3 247.0 1.0 222.2 1.0 192.3L1.0 138.0L3.2 137.1C4.5 136.6 9.7 135.7 14.9 135.1C23.8 134.0 25.6 133.3 51.9 121.1C116.4 91.2 114.3 92.0 117.8 93.9C118.7 94.5 127.4 98.3 137.0 102.6C159.1 112.2 160.6 112.9 177.0 120.5C202.7 132.3 206.4 133.7 214.5 134.9C218.9 135.6 223.7 136.3 225.2 136.6L228.0 137.2L228.0 192.6L228.0 248.0L197.0 248.0L166.0 248.0L166.0 197.0L166.0 146.0L114.0 146.0L62.0 146.0L62.0 197.0L62.0 248.0L32.2 248.0C15.8 248.0 2.0 247.7 1.7 247.3ZM1.5 122.8C1.2 122.1 1.1 94.5 1.2 61.5L1.5 1.5L31.5 1.5L61.5 1.5L61.8 45.2C61.9 69.4 62.4 89.0 62.9 89.0C63.4 89.0 74.9 83.8 88.5 77.5C102.1 71.2 113.8 66.0 114.4 66.0C115.0 66.0 120.6 68.4 127.0 71.4C148.3 81.5 165.0 89.0 166.0 89.0C166.6 89.0 167.1 72.6 167.2 45.2L167.5 1.5L197.5 1.5L227.5 1.5L227.8 62.8L228.0 124.0L219.4 124.0C209.9 124.0 211.5 124.6 177.5 109.5C169.2 105.8 155.5 99.8 147.0 96.0C138.5 92.3 127.7 87.5 123.0 85.3L114.4 81.3L100.9 87.4C93.4 90.8 85.1 94.5 82.4 95.7C79.7 96.9 64.8 103.7 49.2 110.9L20.9 124.0L11.4 124.0C4.8 124.0 1.8 123.6 1.5 122.8Z\"/></g></g><g clip-path=\"url(#cClipT)\"><g class=\"lg-t\"><path fill=\"#0B0B0B\" d=\"M485.5 250.5C468.8 247.7 457.5 243.7 442.8 235.2C437.4 232.1 433.0 229.2 433.0 228.8C433.0 228.0 452.4 196.3 453.6 195.1C453.8 194.9 455.7 195.9 457.7 197.3C470.9 206.2 482.0 210.5 495.8 212.1C507.4 213.4 515.6 212.7 521.7 209.8C529.8 206.0 532.4 198.0 527.4 192.0C523.6 187.6 521.4 186.7 502.0 181.7C473.7 174.5 461.5 168.8 452.2 158.6C437.0 142.0 437.9 113.6 454.1 96.4C463.8 86.2 479.2 78.6 497.5 74.9C507.8 72.8 532.3 73.1 542.9 75.4C556.4 78.3 573.0 85.4 580.3 91.3L583.0 93.5L575.4 105.5C571.2 112.1 566.4 119.2 564.9 121.2L562.0 124.8L555.2 120.9C534.4 108.7 505.3 107.1 496.0 117.6C490.0 124.4 492.9 132.6 502.7 136.8C505.4 137.9 514.0 140.3 522.0 142.0C555.9 149.6 570.9 158.1 578.4 173.9C581.1 179.7 581.5 181.8 581.8 190.9C582.5 208.5 579.0 218.7 568.5 229.9C558.8 240.1 547.5 246.0 530.6 249.6C520.4 251.8 496.6 252.3 485.5 250.5ZM837.2 250.9C821.0 249.0 804.1 241.0 794.3 230.7C782.9 218.7 778.3 200.6 782.5 184.5C788.7 160.9 810.8 145.5 843.7 141.9C860.5 140.1 879.9 143.5 892.8 150.6C896.2 152.5 899.6 154.0 900.2 154.0C902.0 154.0 900.5 137.3 898.1 130.8C895.5 124.2 889.4 117.5 883.3 114.8C874.5 110.9 859.2 110.8 846.1 114.6C839.2 116.5 826.2 123.3 819.5 128.4L814.5 132.2L810.7 127.9C805.7 122.1 791.0 103.4 791.0 102.7C791.0 101.6 808.2 90.9 817.0 86.5C832.6 78.7 842.1 75.9 860.5 73.9C887.5 71.0 910.9 77.2 928.6 91.8L935.0 97.2L941.3 92.0C949.3 85.4 963.1 78.7 974.5 75.8C987.3 72.6 1009.9 72.6 1021.7 75.8C1054.3 84.6 1075.7 107.3 1082.1 140.0C1083.5 147.0 1083.9 172.7 1082.7 177.2L1082.0 180.0L1019.5 180.0C948.5 180.0 954.7 179.1 959.6 188.9C966.7 203.2 982.3 212.0 1000.2 212.0C1015.9 212.0 1029.6 207.6 1042.3 198.6C1045.9 196.1 1049.0 194.0 1049.2 194.0C1050.1 194.0 1072.5 221.1 1072.5 222.2C1072.5 224.4 1059.6 234.0 1050.0 238.9C1031.8 248.2 1021.6 250.5 998.5 250.5C982.0 250.5 979.7 250.3 970.5 247.7C954.6 243.4 940.4 235.3 928.7 224.1L924.9 220.5L921.5 224.2C913.9 232.4 901.2 240.7 890.0 244.9C874.8 250.5 854.2 252.9 837.2 250.9ZM1167.5 250.3C1159.8 249.2 1147.8 245.5 1140.4 242.0C1120.4 232.4 1106.2 217.3 1098.8 197.9C1095.6 189.8 1095.5 189.0 1095.5 174.0C1095.5 159.7 1095.7 157.9 1098.2 151.2C1103.8 135.9 1112.7 124.7 1127.0 115.1C1151.5 98.7 1184.5 95.5 1211.0 106.9C1215.9 109.0 1220.0 110.4 1220.0 110.0C1220.0 107.3 1204.0 86.2 1196.2 78.7L1192.2 74.8L1179.9 80.0C1165.7 86.0 1155.2 90.5 1142.7 96.2C1137.8 98.4 1133.8 100.0 1133.7 99.9C1133.5 99.7 1129.3 94.0 1124.2 87.2L1114.9 75.0L1125.2 70.2C1130.9 67.6 1141.2 63.0 1148.2 60.0C1155.2 57.0 1161.0 54.2 1161.0 53.8C1161.0 51.6 1153.1 50.5 1132.0 50.0L1109.5 49.5L1109.2 32.7L1109.0 16.0L1145.3 16.0L1181.7 16.0L1195.0 24.8L1208.3 33.7L1216.4 30.4C1248.9 17.3 1255.2 14.9 1255.7 15.4C1256.6 16.3 1262.1 44.2 1261.7 45.5C1261.4 46.1 1257.0 48.2 1251.8 50.0C1246.7 51.8 1240.5 54.1 1238.1 55.2L1233.8 57.0L1240.3 63.8C1263.6 87.9 1277.5 111.7 1283.1 136.9C1285.5 147.8 1285.6 167.0 1283.4 177.8C1276.1 213.2 1245.2 242.2 1207.0 249.4C1199.3 250.9 1175.6 251.4 1167.5 250.3ZM314.5 248.5C293.9 244.6 276.8 236.2 265.9 224.4C259.0 217.0 253.1 204.6 250.5 192.5C248.9 184.6 248.5 147.3 249.7 101.3L250.3 75.0L276.6 75.0L302.9 75.0L303.2 129.8L303.5 184.5L305.9 189.8C312.0 203.3 327.3 210.1 343.9 206.6C356.4 204.0 363.2 198.1 367.4 186.3C368.9 182.0 369.9 149.2 370.0 98.8L370.0 75.0L397.0 75.0L424.0 75.0L424.0 128.9C424.0 185.8 423.7 190.1 419.1 203.2C412.0 223.5 392.0 240.0 366.4 246.6C353.7 249.9 327.3 250.8 314.5 248.5ZM1300.0 163.0L1300.0 76.0L1326.5 76.0L1353.0 76.0L1353.0 163.0L1353.0 250.0L1326.5 250.0L1300.0 250.0L1300.0 163.0ZM596.5 246.9C595.8 245.8 597.8 78.5 598.6 76.2C598.9 75.2 604.6 75.0 624.7 75.2L650.5 75.5L650.8 86.3L651.1 97.0L658.3 90.8C665.9 84.3 677.2 78.3 687.5 75.5C696.6 73.0 713.9 72.5 723.0 74.4C740.8 78.1 756.4 89.6 763.3 104.0C769.7 117.5 770.0 120.9 770.0 188.1L770.0 248.0L743.5 248.0L717.1 248.0L716.8 191.2L716.5 134.5L713.8 129.4C707.6 117.7 695.0 112.3 680.1 115.0C665.7 117.6 656.7 125.1 652.3 138.1C650.7 143.0 650.5 148.1 650.3 190.5C650.2 216.4 650.1 239.9 650.0 242.8L650.0 248.0L623.6 248.0C605.8 248.0 596.9 247.6 596.5 246.9ZM879.7 213.8C888.1 210.9 895.9 204.1 899.5 196.4C902.4 190.3 902.1 189.1 896.7 184.3C883.5 172.8 861.8 169.1 846.4 175.9C838.6 179.4 833.0 187.5 833.0 195.4C833.0 201.4 838.3 209.5 844.2 212.6C853.6 217.5 868.0 218.0 879.7 213.8ZM1202.3 208.8C1210.4 205.0 1218.1 197.3 1221.5 189.7C1231.0 168.7 1219.7 143.2 1198.4 137.4C1189.3 135.0 1176.2 135.7 1168.8 139.2C1160.9 142.9 1154.6 149.0 1150.7 156.9C1147.8 162.9 1147.5 164.2 1147.5 173.0C1147.6 186.2 1150.1 192.2 1158.9 201.1C1167.9 210.1 1173.0 212.1 1186.5 211.7C1195.0 211.5 1197.4 211.1 1202.3 208.8ZM1032.4 145.1C1032.7 144.6 1032.1 141.3 1031.0 137.7C1025.7 120.5 1012.5 110.8 994.5 110.8C981.2 110.8 970.9 116.0 963.5 126.4C960.4 130.8 956.0 141.5 956.0 144.7C956.0 145.7 963.4 146.0 993.9 146.0C1015.4 146.0 1032.1 145.6 1032.4 145.1ZM1317.4 64.1C1310.5 61.6 1307.4 59.4 1303.4 54.2C1291.7 38.8 1297.2 17.0 1314.9 8.6C1331.2 0.9 1349.2 7.2 1356.3 22.9C1357.8 26.2 1358.4 29.6 1358.4 35.0C1358.5 41.6 1358.0 43.5 1355.1 49.4C1348.3 63.2 1332.3 69.5 1317.4 64.1ZM298.0 54.0C298.0 53.1 311.0 38.3 322.5 26.0C325.4 23.0 331.7 16.1 336.5 10.7L345.4 0.8L370.7 1.2C384.6 1.3 396.0 1.7 396.0 2.0C396.1 2.3 384.0 14.3 369.3 28.7L342.5 54.9L320.2 55.0C306.1 55.0 298.0 54.6 298.0 54.0Z\"/><path fill=\"#FF0050\" d=\"M1410.0 254.1C1399.9 251.9 1391.3 245.4 1386.9 236.5C1384.0 230.6 1383.8 229.5 1384.1 221.8C1384.6 212.2 1386.7 207.0 1393.2 200.3C1406.3 186.8 1430.1 188.6 1441.7 203.8C1450.7 215.7 1449.8 232.3 1439.5 243.8C1432.5 251.6 1419.6 256.1 1410.0 254.1Z\"/><path fill=\"#0048EE\" d=\"M1596.5 254.0C1578.1 252.3 1563.3 247.6 1547.3 238.2C1535.2 231.1 1535.7 232.6 1542.7 221.9C1546.0 216.7 1550.7 209.2 1553.0 205.2C1555.3 201.2 1557.6 197.7 1558.0 197.5C1558.4 197.2 1562.7 199.5 1567.4 202.4C1580.6 210.7 1592.5 214.0 1608.8 214.0C1620.7 214.0 1625.4 212.8 1629.7 208.5C1632.4 205.8 1633.0 204.5 1633.0 200.7C1633.0 191.9 1629.0 189.7 1602.6 183.5C1593.8 181.5 1584.4 178.9 1581.6 177.8C1560.0 169.4 1547.1 156.3 1544.0 140.1C1540.7 122.6 1545.7 107.2 1558.9 94.0C1568.1 84.8 1578.5 79.2 1593.5 75.4C1602.9 73.0 1604.6 72.9 1623.0 73.3C1640.1 73.6 1643.7 74.0 1652.5 76.4C1662.6 79.0 1678.1 86.0 1683.4 90.3L1686.3 92.6L1676.0 108.8C1670.4 117.7 1665.3 125.0 1664.8 125.0C1664.3 125.0 1661.3 123.7 1658.0 122.0C1629.4 107.6 1596.0 110.1 1596.0 126.8C1596.0 130.7 1599.1 134.4 1603.7 136.3C1605.8 137.1 1613.1 139.0 1620.0 140.5C1661.0 149.3 1676.5 158.1 1684.1 177.0C1686.8 183.8 1687.8 198.9 1686.0 207.3C1682.0 226.6 1665.8 243.0 1644.0 249.9C1631.5 253.8 1612.7 255.4 1596.5 254.0ZM1470.0 165.2L1470.0 79.3L1478.5 78.6C1483.2 78.2 1494.9 78.2 1504.5 78.6L1522.0 79.3L1521.8 164.9L1521.5 250.5L1495.8 250.8L1470.0 251.0L1470.0 165.2ZM1488.8 65.6C1479.7 63.1 1473.0 57.0 1469.5 48.2C1466.9 41.8 1467.8 30.7 1471.3 24.7C1476.3 16.2 1486.9 10.0 1496.4 10.0C1511.9 10.0 1525.0 22.9 1525.0 38.0C1525.0 48.3 1517.9 59.5 1508.7 63.8C1503.0 66.5 1494.6 67.3 1488.8 65.6Z\"/></g></g></svg>";
H.header = function(){
  const h = document.createElement("header");
  h.className = "c-head";
  h.innerHTML = `<div class="wrap"><a class="c-brand" href="../index.html" aria-label="Húsnæði.is">${H.logo || LOGO}</a><div class="c-lang" role="group" aria-label="Tungumál">${LANGS.map(l => `<button type="button" lang="${l}" title="${LNAME[l]}" aria-label="${LNAME[l]}"><span class="flag" aria-hidden="true">${FLAGS[l]}</span><span class="lcode">${l.toUpperCase()}</span></button>`).join("")}</div></div>`;
  document.body.prepend(h);
  const sk = document.createElement("a"); sk.className = "skip"; sk.href = "#main"; sk.dataset.t = "skip"; document.body.prepend(sk);
  h.querySelectorAll(".c-lang button").forEach(b => b.addEventListener("click", () => H.setLang(b.getAttribute("lang"))));
};
/* Heldur skýringunni innan skjásins (annars lendir hún utan við hægri brún í síma) */
function fit(b){
  const p = b.querySelector(".tip-pop"); if(!p) return;
  requestAnimationFrame(() => {
    p.style.setProperty("--tip-dx", "0px");
    const r = p.getBoundingClientRect(); if(!r.width) return;
    const vw = document.documentElement.clientWidth, m = 12;
    let dx = 0;
    if(r.right > vw - m) dx = vw - m - r.right;
    if(r.left + dx < m) dx = m - r.left;
    p.style.setProperty("--tip-dx", Math.round(dx) + "px");
  });
}
H.tips = function(){
  document.querySelectorAll("[data-tip]").forEach(b => {
    if(b.querySelector(".tip-pop")) return;
    b.type = "button"; b.classList.add("tip"); b.setAttribute("aria-expanded", "false");
    b.innerHTML = '?<span class="tip-pop" role="tooltip"></span>';
    b.addEventListener("click", e => { e.stopPropagation(); const open = b.getAttribute("aria-expanded") !== "true";
      document.querySelectorAll(".tip[aria-expanded=true]").forEach(x => x.setAttribute("aria-expanded","false"));
      b.setAttribute("aria-expanded", String(open)); if(open) fit(b); });
    b.addEventListener("mouseenter", () => fit(b));
  });
  document.addEventListener("click", () => document.querySelectorAll(".tip[aria-expanded=true]").forEach(x => x.setAttribute("aria-expanded","false")));
  document.addEventListener("keydown", e => { if(e.key === "Escape") document.querySelectorAll(".tip[aria-expanded=true]").forEach(x => x.setAttribute("aria-expanded","false")); });
};
H.others = function(current){
  const el = document.querySelector("[data-others]");
  if(!el) return;
  const items = [["c1","greidslubyrdi.html"],["c2","hamarkslan.html"],["c3","eiginfjarframlag.html"]].filter(x => x[0] !== current);
  el.innerHTML = `<p class="c-eyebrow" data-t="others">${H.t("others")}</p><div class="c-others">${items.map(([k,u]) => `<a href="${u}"><span data-t="${k}">${H.t(k)}</span><span aria-hidden="true">→</span></a>`).join("")}</div>`;
};

/* ---------- Lifandi gögn (á husnaedi.is) ---------- */
H.loadLive = function(cb){
  if(!C.liveDataUrl || location.protocol === "file:") return;
  fetch(C.liveDataUrl, {cache:"no-cache"}).then(r => r.ok ? r.json() : null).then(d => {
    if(!d) return;
    let changed = false;
    if(d.mortgage && isFinite(d.mortgage.nominal) && isFinite(d.mortgage.indexed)){
      C.rates.nominal = d.mortgage.nominal; C.rates.indexed = d.mortgage.indexed; C.rates.date = d.mortgage.updated || C.rates.date; changed = true;
    }
    if(d.inflation && isFinite(d.inflation.value)){
      C.inflation.value = d.inflation.value; C.inflation.period = d.inflation.period || C.inflation.period; C.inflation.date = d.inflation.updated || C.inflation.date; changed = true;
    }
    if(changed){ C.live = true; cb && cb(); }
  }).catch(() => {});
};

/* =========================================================
   ÚTREIKNINGAR
   Mánaðarlegar greiðslur. Verðtryggt lán: höfuðstóll hækkar
   mánaðarlega um (1+verðbólga)^(1/12) − 1 áður en greitt er,
   vextir (raunvextir) reiknast af verðbættum höfuðstól og
   jafngreiðslan er endurreiknuð á verðbættan höfuðstól fyrir
   eftirstandandi gjalddaga. Óverðtryggt lán: nafnvextir/12.
   Þetta er sama aðferð og bankarnir og HMS nota í reiknivélum sínum.
   ========================================================= */
H.monthlyInfl = inflPct => Math.pow(1 + inflPct/100, 1/12) - 1;
H.annuity = (P, r, n) => r === 0 ? P/n : P * r / (1 - Math.pow(1 + r, -n));
H.pvAnnuity = (pay, r, n) => r === 0 ? pay*n : pay * (1 - Math.pow(1 + r, -n)) / r;

H.schedule = function({P, years, ratePct, inflPct, indexed, method}){
  const n = Math.round(years * 12);
  const r = ratePct / 100 / 12;
  const im = H.monthlyInfl(inflPct);
  const ix = indexed ? im : 0;
  let bal = P, defl = 1;
  const months = [];
  let tPay = 0, tInt = 0, tIdx = 0, tPayReal = 0, tIntReal = 0, maxBal = P, maxBalK = 0;
  for(let k = 1; k <= n; k++){
    const idx = bal * ix;               // verðbætur mánaðarins
    bal += idx;
    const int = bal * r;
    const rem = n - k + 1;
    let prin, pay;
    if(method === "annuity"){ pay = H.annuity(bal, r, rem); prin = pay - int; }
    else { prin = bal / rem; pay = prin + int; }
    bal = Math.max(0, bal - prin);
    defl *= (1 + im);                   // til að sýna á föstu verðlagi (verðlag við lántöku)
    months.push({ k, pay, int, prin, idx, bal, defl });
    tPay += pay; tInt += int; tIdx += idx; tPayReal += pay/defl; tIntReal += int/defl;
    if(bal > maxBal){ maxBal = bal; maxBalK = k; }
  }
  return { n, months, first: months[0], tPay, tInt, tIdx, tPayReal, tIntReal, maxBal, maxBalK,
           // heildarkostnaður umfram lánsfjárhæð (vextir + verðbætur) í krónum hvers tíma
           tCost: tPay - P };
};

/* ---------- Línurit ----------
   H.chart(el, {points:[{x, a, b}], aLabel, bLabel, fmtA, fmtB, xLabel, tipRows(p)}) */
H.chart = function(el, o){
  el._chartOpts = o;
  if(!el._ro && "ResizeObserver" in window){
    let lastW = el.clientWidth;
    el._ro = new ResizeObserver(() => { if(Math.abs(el.clientWidth - lastW) > 8){ lastW = el.clientWidth; H.chart(el, el._chartOpts); } });
    el._ro.observe(el);
  }
  // Teiknað í raunstærð svo letrið haldist læsilegt í síma
  const W = Math.max(280, Math.round(el.clientWidth || 640)), small = W < 520;
  const Hh = small ? 230 : 300, padL = small ? 58 : 64, padR = small ? 46 : 64, padT = 14, padB = 34;
  const pts = o.points; if(!pts.length) return;
  const xs = pts.map(p => p.x), xMax = Math.max(...xs), xMin = Math.min(...xs);
  const nice = v => { if(v <= 0) return 1; const e = Math.pow(10, Math.floor(Math.log10(v))); const m = v/e; return (m <= 1 ? 1 : m <= 2 ? 2 : m <= 2.5 ? 2.5 : m <= 5 ? 5 : 10) * e; };
  const aMax = nice(Math.max(...pts.map(p => p.a)) * 1.08), bMax = nice(Math.max(...pts.map(p => p.b)) * 1.08);
  const X = x => padL + (x - xMin) / Math.max(1, xMax - xMin) * (W - padL - padR);
  const YA = v => padT + (1 - v / aMax) * (Hh - padT - padB);
  const YB = v => padT + (1 - v / bMax) * (Hh - padT - padB);
  let grid = "";
  for(let i = 0; i <= 4; i++){
    const y = padT + i/4 * (Hh - padT - padB);
    grid += `<line x1="${padL}" x2="${W-padR}" y1="${y}" y2="${y}" stroke="#e6edf7" stroke-width="1"/>`;
    grid += `<text class="ax" x="${padL-8}" y="${y+4}" text-anchor="end">${o.fmtA(aMax*(1-i/4))}</text>`;
    grid += `<text class="ax" x="${W-padR+8}" y="${y+4}" text-anchor="start">${o.fmtB(bMax*(1-i/4))}</text>`;
  }
  const step = xMax - xMin <= 10 ? (small ? 2 : 1) : xMax - xMin <= 25 ? 5 : 10;
  for(let x = Math.ceil(xMin/step)*step; x <= xMax; x += step)
    grid += `<text class="ax" x="${X(x)}" y="${Hh-padB+18}" text-anchor="middle">${x}</text>`;
  const area = `M${X(pts[0].x)},${YB(0)} ` + pts.map(p => `L${X(p.x).toFixed(1)},${YB(p.b).toFixed(1)}`).join(" ") + ` L${X(pts[pts.length-1].x)},${YB(0)} Z`;
  const lineB = pts.map((p,i) => `${i?"L":"M"}${X(p.x).toFixed(1)},${YB(p.b).toFixed(1)}`).join(" ");
  const lineA = pts.map((p,i) => `${i?"L":"M"}${X(p.x).toFixed(1)},${YA(p.a).toFixed(1)}`).join(" ");
  el.innerHTML = `<svg viewBox="0 0 ${W} ${Hh}" role="img" aria-label="${o.label || ""}">
    <defs><linearGradient id="gB" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#0061ff" stop-opacity=".22"/><stop offset="1" stop-color="#0061ff" stop-opacity=".03"/></linearGradient></defs>
    ${grid}
    <path d="${area}" fill="url(#gB)"/><path d="${lineB}" fill="none" stroke="#0061ff" stroke-width="2"/>
    <path d="${lineA}" fill="none" stroke="#ff0050" stroke-width="2.5" stroke-linejoin="round"/>
    <line class="cx" x1="0" x2="0" y1="${padT}" y2="${Hh-padB}" stroke="#0b0b0b" stroke-opacity=".25" stroke-dasharray="3 3" visibility="hidden"/>
    <circle class="ca" r="5" fill="#ff0050" stroke="#fff" stroke-width="2" visibility="hidden"/>
    <circle class="cb" r="5" fill="#0061ff" stroke="#fff" stroke-width="2" visibility="hidden"/>
    <text class="ax" x="${padL}" y="${Hh-2}" text-anchor="start">${o.xLabel || ""}</text>
  </svg><div class="chart-tip" aria-hidden="true"></div>`;
  const svg = el.querySelector("svg"), tip = el.querySelector(".chart-tip");
  const cx = svg.querySelector(".cx"), ca = svg.querySelector(".ca"), cb = svg.querySelector(".cb");
  const show = clientX => {
    const r = svg.getBoundingClientRect();
    const vx = (clientX - r.left) / r.width * W;
    let best = pts[0], bd = Infinity;
    pts.forEach(p => { const d = Math.abs(X(p.x) - vx); if(d < bd){ bd = d; best = p; } });
    const px = X(best.x);
    [cx].forEach(l => { l.setAttribute("x1", px); l.setAttribute("x2", px); l.setAttribute("visibility","visible"); });
    ca.setAttribute("cx", px); ca.setAttribute("cy", YA(best.a)); ca.setAttribute("visibility","visible");
    cb.setAttribute("cx", px); cb.setAttribute("cy", YB(best.b)); cb.setAttribute("visibility","visible");
    tip.innerHTML = o.tipHtml(best);
    tip.style.opacity = 1;
    const left = px / W * r.width, tw = tip.offsetWidth;
    // Birta skýringuna inni í línuritinu, hinum megin við bendilinn
    tip.style.left = (left > r.width/2 ? Math.max(0, left - tw - 14) : Math.min(r.width - tw, left + 14)) + "px";
  };
  const hide = () => { tip.style.opacity = 0; [cx,ca,cb].forEach(e => e.setAttribute("visibility","hidden")); };
  svg.addEventListener("pointermove", e => show(e.clientX));
  svg.addEventListener("pointerdown", e => show(e.clientX));
  svg.addEventListener("pointerleave", hide);
  el.tabIndex = 0;
  let ki = 0;
  el.onkeydown = e => {
    if(e.key !== "ArrowRight" && e.key !== "ArrowLeft") return;
    ki = Math.max(0, Math.min(pts.length-1, ki + (e.key === "ArrowRight" ? 1 : -1)));
    const r = svg.getBoundingClientRect(); show(r.left + X(pts[ki].x) / W * r.width); e.preventDefault();
  };
  el.onblur = hide;
};

/* ---------- Ræsing ---------- */
H.start = function(page, init){
  H.extend(page);
  H.header();
  const q = new URLSearchParams(location.search).get("lang");
  if(q && LANGS.includes(q)){ store.set("hlang", q); history.replaceState(null, "", location.pathname + location.hash); }
  lang = LANGS.includes(store.get("hlang")) ? store.get("hlang") : "is";
  init();
  H.tips();
  H.setLang(lang);
};
})();
