#!/usr/bin/env node
/*
  Uppfærir data/rates.json með nýjustu tölum:
    - Stýrivextir (meginvextir) af forsíðu Seðlabanka Íslands
    - Verðbólga (12 mánaða breyting VNV) úr gagnagrunni Hagstofu Íslands,
      með forsíðu Seðlabankans til vara
    - Vextir íbúðalána í reiknivélinni: miðgildi stóru bankanna þriggja úr vaxtatöflu Aurbjargar
  Uppfærir líka data/housing.json:
    - Vísitölur íbúðaverðs og leiguverðs (HMS). Nýr mánuður er framreiknaður með mánaðarbreytingu
      sem HMS birtir og staðfestur með tólf mánaða breytingunni sem HMS birtir líka.

  Keyrt daglega af .github/workflows/update-rates.yml. Engin aukasöfn, Node 20+.
  Prófun án nets:  node scripts/update-rates.mjs --fixtures scripts/fixtures
*/
import { readFile, writeFile, appendFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import path from "node:path";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const DATA = path.join(ROOT, "data", "rates.json");
const HOUSING = path.join(ROOT, "data", "housing.json");
const args = process.argv.slice(2);
const FIX = args.includes("--fixtures") ? path.resolve(args[args.indexOf("--fixtures") + 1]) : null;
const DRY = args.includes("--dry");

const SEDLABANKI = "https://www.sedlabanki.is/";
const HAGSTOFA = "https://px.hagstofa.is/pxis/api/v1/is/Efnahagur/visitolur/1_vnv/1_vnv/VIS01000.px";
const MORTGAGE_MAX_AGE_DAYS = 45;
const AURBJORG = "https://aurbjorg.is/husnaedislan";
const HMS_SEARCH = "https://hms.is/api/algolia/search/";
const BIG3 = ["Landsbankinn", "Íslandsbanki", "Arion"];

const warnings = [];
const notes = [];
const today = new Date().toISOString().slice(0, 10);

/* ---------- hjálparföll ---------- */
const sleep = ms => new Promise(r => setTimeout(r, ms));
async function get(url, opts = {}, tries = 3){
  if(FIX) return fixture(url, opts);
  let last;
  for(let i = 0; i < tries; i++){
    try{
      const r = await fetch(url, { ...opts, headers: { "user-agent": "husnaedi.is rates updater (github action)", ...(opts.headers||{}) }, signal: AbortSignal.timeout(20000) });
      if(r.status === 429 || r.status >= 500) throw new Error("HTTP " + r.status);
      if(!r.ok) throw new Error("HTTP " + r.status);
      return r;
    }catch(e){ last = e; await sleep(15000 * (i + 1)); }
  }
  throw last;
}
async function fixture(url, opts){
  const name = url.includes("sedlabanki") ? "sedlabanki.html"
    : url.includes("aurbjorg") ? "aurbjorg.html"
    : url.includes("hms.is") ? (decodeURIComponent(url).includes("leiguverðs") ? "hms-leiga.json" : "hms-ibud.json")
    : (opts.method === "POST" ? "hagstofa-data.json" : "hagstofa-meta.json");
  const body = await readFile(path.join(FIX, name), "utf8").catch(() => null);
  if(body === null) throw new Error("fixture vantar: " + name);
  return new Response(body, { status: 200 });
}
const num = s => parseFloat(String(s).replace(/\s/g, "").replace(",", "."));
const MONTHS = ["janúar","febrúar","mars","apríl","maí","júní","júlí","ágúst","september","október","nóvember","desember"];
function isDate(s){ // "7. október 2026" -> "2026-10-07"
  const m = String(s).toLowerCase().match(/(\d{1,2})\.\s*([a-záéíóúýþæöð]+)\s+(\d{4})/);
  if(!m) return null;
  const mi = MONTHS.indexOf(m[2]);
  return mi < 0 ? null : `${m[3]}-${String(mi + 1).padStart(2, "0")}-${m[1].padStart(2, "0")}`;
}
const stripTags = h => h.replace(/<[^>]+>/g, " ").replace(/&nbsp;/g, " ").replace(/\s+/g, " ").trim();
const daysBetween = (a, b) => Math.round((new Date(b) - new Date(a)) / 864e5);

/* ---------- Seðlabanki: forsíðuspjöld (Meginvextir, Verðbólga) ---------- */
let sbHtml = null;
async function sedlabanki(){
  if(sbHtml === null) sbHtml = await (await get(SEDLABANKI)).text();
  return sbHtml;
}
function sbCard(html, label){
  // <h3 ...>Meginvextir</h3><h4 class="data-big-numbers" ...>8,00%</h4><p class="data-captions" ...>Tók gildi: ...</p>
  const re = new RegExp(">\\s*" + label + "\\s*</h3>\\s*<h4[^>]*>\\s*([\\d.,]+)\\s*%\\s*</h4>\\s*(?:<p[^>]*>([\\s\\S]*?)</p>)?", "i");
  const m = html.match(re);
  if(!m) return null;
  return { value: num(m[1]), caption: m[2] ? stripTags(m[2].replace(/<br\s*\/?>/gi, " | ")) : "" };
}
async function policyRate(){
  const card = sbCard(await sedlabanki(), "Meginvextir");
  if(!card || !(card.value > 0 && card.value < 30)) throw new Error("fann ekki meginvexti á forsíðu Seðlabankans");
  const eff = card.caption.match(/Tók gildi:\s*([^|]+)/i);
  const nxt = card.caption.match(/Næsta vaxtaákvörðun:\s*([^|]+)/i);
  return {
    value: card.value,
    effective: eff ? isDate(eff[1]) : null,
    nextDecision: nxt ? isDate(nxt[1]) : null,
    source: "Seðlabanki Íslands",
    sourceUrl: SEDLABANKI
  };
}

/* ---------- Hagstofa: 12 mánaða breyting vísitölu neysluverðs ---------- */
async function inflationHagstofa(){
  const meta = await (await get(HAGSTOFA)).json();
  const vars = meta.variables || [];
  const timeVar = vars.find(v => v.time) || vars.find(v => /mánuð/i.test(v.text));
  const idxVar = vars.find(v => v !== timeVar && v.valueTexts.some(t => /^vísitala neysluverðs$/i.test(t.trim())));
  const itemVar = vars.find(v => v !== timeVar && v !== idxVar && v.valueTexts.some(t => /^ársbreyting, ?%$/i.test(t.trim())));
  if(!timeVar || !idxVar || !itemVar) throw new Error("breytur í töflu VIS01000 fundust ekki");
  const pick = (v, re) => v.values[v.valueTexts.findIndex(t => re.test(t.trim()))];
  const query = {
    query: [
      { code: timeVar.code, selection: { filter: "top", values: ["1"] } },
      { code: idxVar.code, selection: { filter: "item", values: [pick(idxVar, /^vísitala neysluverðs$/i)] } },
      { code: itemVar.code, selection: { filter: "item", values: [pick(itemVar, /^ársbreyting, ?%$/i)] } }
    ],
    response: { format: "json" }
  };
  await sleep(FIX ? 0 : 1500);
  const res = await (await get(HAGSTOFA, { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(query) })).json();
  const cols = res.columns || [];
  const ti = cols.findIndex(c => c.code === timeVar.code);
  const row = (res.data || [])[0];
  if(!row) throw new Error("engin gögn frá Hagstofu");
  const value = num(row.values[0]);
  const period = row.key[ti >= 0 ? ti : 0]; // t.d. "2026M10"
  if(!(value > -10 && value < 50) || !/^\d{4}M\d{2}$/.test(period)) throw new Error("óvænt svar frá Hagstofu");
  return { value: Math.round(value * 10) / 10, period: period.replace("M", "-"), source: "Hagstofa Íslands", sourceUrl: "https://px.hagstofa.is/pxis/pxweb/is/Efnahagur/Efnahagur__visitolur__1_vnv__1_vnv/VIS01000.px" };
}
async function inflationSedlabanki(){
  const card = sbCard(await sedlabanki(), "Verðbólga");
  if(!card || !(card.value > -10 && card.value < 50)) throw new Error("fann ekki verðbólgu á forsíðu Seðlabankans");
  return { value: card.value, period: null, source: "Seðlabanki Íslands", sourceUrl: SEDLABANKI };
}

/* ---------- Aurbjörg: vextir íbúðalána ---------- */
async function mortgageRates(){
  const html = (await (await get(AURBJORG)).text()).replace(/<script[\s\S]*?<\/script>/g, "");
  const rows = (html.match(/<tr[\s\S]*?<\/tr>/g) || []).map(tr => (tr.match(/<t[dh][\s\S]*?<\/t[dh]>/g) || []).map(stripTags));
  const head = rows.find(r => /Lánveitandi/i.test(r[0] || ""));
  if(!head) throw new Error("vaxtatafla Aurbjargar fannst ekki");
  const col = re => head.findIndex(h => re.test(h));
  const cNom = col(/^Óvt\.? breyt/i), cIdx = head.map((h, i) => /^Vt\./i.test(h) ? i : -1).filter(i => i > 0);
  if(cNom < 0 || !cIdx.length) throw new Error("dálkar í vaxtatöflu Aurbjargar breyttust");
  const pctOf = c => { const m = String(c || "").match(/(\d+,\d+)\s*%/); return m ? num(m[1]) : null; };
  const banks = {};
  for(const b of BIG3){
    const r = rows.find(r => (r[0] || "").startsWith(b));
    if(!r) throw new Error(b + " fannst ekki í vaxtatöflu Aurbjargar");
    const idx = cIdx.map(i => pctOf(r[i])).filter(v => v !== null);
    banks[b] = { nominal: pctOf(r[cNom]), indexed: idx.length ? Math.min(...idx) : null };
  }
  const median = a => { a = a.filter(v => v !== null && v > 0 && v < 30).sort((x, y) => x - y); if(!a.length) return null; const m = a.length >> 1; return a.length % 2 ? a[m] : Math.round((a[m - 1] + a[m]) / 2 * 100) / 100; };
  const nominal = median(Object.values(banks).map(b => b.nominal)), indexed = median(Object.values(banks).map(b => b.indexed));
  if(!nominal || !indexed) throw new Error("vantar vexti stóru bankanna");
  return { nominal, indexed, banks };
}

/* ---------- HMS: vísitölur íbúðaverðs og leiguverðs ---------- */
async function hmsReleases(kind){ // kind: "íbúðaverðs" eða "leiguverðs"
  const qs = new URLSearchParams({ pageSize: "30", page: "0", query: "Vísitala " + kind });
  const j = await (await get(HMS_SEARCH + "?" + qs)).json();
  const out = {};
  for(const h of (j.hits || [])){
    const title = String(h.title || "");
    if(!new RegExp("^Vísitala " + kind, "i").test(title)) continue;
    const mt = title.toLowerCase().match(/(hækkaði|lækkaði) um ([\d,]+) prósent.*?í (janúar|febrúar|mars|apríl|maí|júní|júlí|ágúst|september|október|nóvember|desember)(?:\s+(\d{4}))?/)
            || title.toLowerCase().match(/(stóð í stað)().*?í (janúar|febrúar|mars|apríl|maí|júní|júlí|ágúst|september|október|nóvember|desember)(?:\s+(\d{4}))?/);
    if(!mt) continue;
    const mi = MONTHS.indexOf(mt[3]) + 1;
    let year = mt[4] ? +mt[4] : null;
    if(!year){ // ártal vantar í titil: nota birtingardag
      const d = new Date((+h.date || 0) * (String(h.date).length > 11 ? 1 : 1000));
      if(isNaN(d)) continue;
      year = d.getUTCFullYear() - (mi > d.getUTCMonth() + 1 ? 1 : 0);
    }
    const sign = mt[1] === "lækkaði" ? -1 : 1;
    const pct = mt[1] === "stóð í stað" ? 0 : sign * num(mt[2]);
    const yy = String(h.text || "").match(/tólf mánuðum hefur vísitala[n]?(?: [^\s]+)? (hækkað|lækkað) um ([\d,]+)/i);
    const yoy = yy ? (yy[1].toLowerCase() === "lækkað" ? -1 : 1) * num(yy[2]) : null;
    const key = `${year}-${String(mi).padStart(2, "0")}`;
    if(!out[key]) out[key] = { pct, yoy, title };
  }
  return out;
}
const nextMonth = m => { const [y, mo] = m.split("-").map(Number); return mo === 12 ? `${y + 1}-01` : `${y}-${String(mo + 1).padStart(2, "0")}`; };
function extend(series, releases, label){
  let added = 0;
  for(;;){
    const last = series.at(-1), key = nextMonth(last[0]), r = releases[key];
    if(!r) break;
    const val = Math.round(last[1] * (1 + r.pct / 100) * 100) / 100;
    if(r.yoy !== null){
      const ago = series.find(x => x[0] === `${+key.slice(0, 4) - 1}${key.slice(4)}`);
      if(ago){
        const calcYoy = (val / ago[1] - 1) * 100;
        if(Math.abs(calcYoy - r.yoy) > 0.2){
          warnings.push(`${label} fyrir ${key} passar ekki: framreiknað ${calcYoy.toFixed(2)}% á 12 mánuðum en HMS segir ${r.yoy}%. Mánuðinum var ekki bætt við.`);
          break;
        }
      }
    }
    series.push([key, val]); added++;
    notes.push(`${label}: bætt við ${key} (${r.pct > 0 ? "+" : ""}${String(r.pct).replace(".", ",")}% milli mánaða${r.yoy !== null ? ", " + String(r.yoy).replace(".", ",") + "% á 12 mánuðum" : ""})`);
  }
  return added;
}

/* ---------- keyrsla ---------- */
const old = JSON.parse(await readFile(DATA, "utf8"));
const next = structuredClone(old);
let changed = false;
const same = (a, b) => JSON.stringify(a) === JSON.stringify(b);

try{
  const p = await policyRate();
  const prev = { value: old.policyRate?.value, effective: old.policyRate?.effective, nextDecision: old.policyRate?.nextDecision };
  if(!same(prev, { value: p.value, effective: p.effective, nextDecision: p.nextDecision })){
    next.policyRate = { ...p, updated: today };
    changed = true;
    notes.push(`Stýrivextir: ${old.policyRate?.value} → ${p.value}% (tók gildi ${p.effective})`);
  }
}catch(e){ warnings.push(`Stýrivextir voru ekki uppfærðir: ${e.message}. Síðasta gildi (${old.policyRate?.value}%) er notað áfram.`); }

try{
  let inf;
  try{ inf = await inflationHagstofa(); }
  catch(e){
    inf = await inflationSedlabanki();
    // Án mánaðar frá Hagstofu: halda síðasta mánuði ef talan er óbreytt
    inf.period = inf.value === old.inflation?.value ? old.inflation?.period : today.slice(0, 7);
    warnings.push(`Hagstofa svaraði ekki (${e.message}). Verðbólga var sótt af forsíðu Seðlabankans í staðinn.`);
  }
  if(inf.value !== old.inflation?.value || inf.period !== old.inflation?.period){
    next.inflation = { ...inf, updated: today };
    changed = true;
    notes.push(`Verðbólga: ${old.inflation?.value} → ${inf.value}% (${inf.period})`);
  }
}catch(e){ warnings.push(`Verðbólga var ekki uppfærð: ${e.message}. Síðasta gildi (${old.inflation?.value}%) er notað áfram.`); }

// Vextir íbúðalána: miðgildi stóru bankanna þriggja (Aurbjörg)
try{
  const r = await mortgageRates();
  const om = old.mortgage || {};
  if(r.nominal !== om.nominal || r.indexed !== om.indexed || om.source === "áætlun"){
    next.mortgage = {
      nominal: r.nominal, indexed: r.indexed, updated: today,
      source: "Vaxtatafla Aurbjargar, miðgildi Landsbankans, Íslandsbanka og Arion banka",
      sourceUrl: AURBJORG,
      banks: r.banks
    };
    changed = true;
    notes.push(`Vextir íbúðalána: óverðtryggt ${om.nominal} → ${r.nominal}%, verðtryggt ${om.indexed} → ${r.indexed}%`);
  }
}catch(e){
  const m = next.mortgage || {};
  const age = m.updated ? daysBetween(m.updated, today) : 9999;
  const msg = `Vextir íbúðalána voru ekki uppfærðir: ${e.message}.`;
  if(age > MORTGAGE_MAX_AGE_DAYS) warnings.push(`${msg} Þeir eru orðnir ${age} daga gamlir. Athugaðu vaxtatöflur bankanna og uppfærðu "mortgage" í data/rates.json.`);
  else warnings.push(`${msg} Síðustu gildi (${m.nominal}% og ${m.indexed}%) eru notuð áfram.`);
}

// Íbúða- og leiguverð (HMS)
let housingChanged = false, housing = null;
try{
  housing = JSON.parse(await readFile(HOUSING, "utf8"));
  for(const [kind, key, label] of [["íbúðaverðs", "kaup", "Íbúðaverð"], ["leiguverðs", "leiga", "Leiguverð"]]){
    try{
      const rel = await hmsReleases(kind);
      if(!Object.keys(rel).length) throw new Error("engar tilkynningar fundust");
      if(extend(housing[key], rel, label)) housingChanged = true;
      const behind = daysBetween(housing[key].at(-1)[0] + "-15", today);
      if(behind > 75) warnings.push(`${label} hefur ekki verið uppfært síðan ${housing[key].at(-1)[0]}. Athugaðu tilkynningar HMS.`);
    }catch(e){ warnings.push(`${label} var ekki uppfært: ${e.message}.`); }
  }
}catch(e){ warnings.push(`data/housing.json var ekki lesin: ${e.message}`); }

if(changed){ next.updated = today; if(!DRY) await writeFile(DATA, JSON.stringify(next, null, 2) + "\n"); }
if(housingChanged){
  housing.updated = today;
  const fmt = a => "[\n" + a.map(x => "    " + JSON.stringify(x)).join(",\n") + "\n  ]";
  const txt = `{\n  "updated": ${JSON.stringify(housing.updated)},\n  "source": ${JSON.stringify(housing.source)},\n  "note": ${JSON.stringify(housing.note)},\n  "kaup": ${fmt(housing.kaup)},\n  "leiga": ${fmt(housing.leiga)}\n}\n`;
  if(!DRY) await writeFile(HOUSING, txt);
  changed = true;
}

const summary = [
  changed ? "### Gögn uppfærð" : "### Engar breytingar",
  ...notes.map(n => "- " + n),
  ...(warnings.length ? ["", "### Athugasemdir", ...warnings.map(w => "- " + w)] : [])
].join("\n");
console.log(summary);
if(process.env.GITHUB_STEP_SUMMARY) await appendFile(process.env.GITHUB_STEP_SUMMARY, summary + "\n");
if(process.env.GITHUB_OUTPUT){
  await appendFile(process.env.GITHUB_OUTPUT, `changed=${changed}\n`);
  await appendFile(process.env.GITHUB_OUTPUT, `warnings<<EOF\n${warnings.map(w => "- " + w).join("\n")}\nEOF\n`);
}
if(DRY && changed) console.log(JSON.stringify(next, null, 2));
