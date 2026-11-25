<script>
/* =========================================================
   SITE_DATA: tölur sem þarf að halda við.
   todo:true = bráðabirgðatala. Gulur punktur birtist á síðunni
   þar til allar eru staðfestar og settar á false.
   ========================================================= */
const SITE_DATA = {
  policyRate: { value: 8.00, date: "2026-08", todo: true },   // Stýrivextir. Staðfest 19. ágúst 2026. Athuga nýrri vaxtaákvarðanir.
  inflation:  { value: 5.6,  date: "2026-08", todo: true },   // Verðbólga 12 mán. Staðfest fyrir ágúst 2026. Uppfæra með nýjustu mælingu Hagstofunnar.
  calc: {
    amount: 50000000,
    years: 40,
    rateIndexed: { value: 4.5, todo: true },                   // Sjálfgefnir vextir, verðtryggt lán
    rateNominal: { value: 9.5, todo: true }                    // Sjálfgefnir vextir, óverðtryggt lán
  }
};

const BASE = "https://www.husnaedi.is"; // undirsíður eru enn á Wix
const LANGS = ["is","en","pl"];
const PREFIX = {is:"", en:"/en", pl:"/pl"};
const LOCALE = {is:"is-IS", en:"en-GB", pl:"pl-PL"};

/* ---------- Text ---------- */
const T = {
 is:{
  skip:"Fara beint í efnið", menu:"Valmynd", navAll:"Allt um",
  heroTitle:"Skildu húsnæðismál betur",
  heroText:"Hvort sem þú ert að kaupa, leigja eða einfaldlega forvitin um markaðinn, hér eru áreiðanlegar og óháðar upplýsingar um íslensk húsnæðismál, settar fram á mannamáli.",
  heroCta:"Um Húsnæði.is", heroCalc:"Reikna lán",
  chartTitle:"Þróun íbúða- og leiguverðs á höfuðborgarsvæðinu frá 2016",
  chartIndex:"Vísitala, janúar 2016 = 100", chartSrc:"Gögn tekin frá HMS",
  kaup:"Kaupverð", leiga:"Leiguverð",
  months:["Janúar","Febrúar","Mars","Apríl","Maí","Júní","Júlí","Ágúst","September","Október","Nóvember","Desember"],
  fPolicy:"Stýrivextir", fPolicySub:"Seðlabanki Íslands",
  fInfl:"Verðbólga", fInflSub:"Síðustu 12 mánuði",
  fHouse:"Íbúðaverð", fRent:"Leiguverð", fChangeSub:"Breyting á 12 mánuðum, höfuðborgarsvæðið",
  todoTip:"Bráðabirgðatala, á eftir að staðfesta",
  introTitle:"Hvað viltu skilja betur?",
  intro1:"Húsnæðismál hafa verið í brennidepli síðasta áratuginn, bæði á Íslandi og erlendis. Það kemur ekki á óvart. Hjá flestum er stærsti hluti eigna bundinn í húsnæði og aðgengi að öruggu húsnæði tengist beint stöðugleika, fjárhagslegu öryggi og lífsgæðum.",
  intro2:"Þrátt fyrir mikilvægi húsnæðismála hefur mun meira verið skrifað um hlutabréfamarkaði en húsnæðismarkaði í almennri umræðu og fræðilegum skrifum. Markmiðið hér er að bæta úr því með því að safna óháðri og aðgengilegri þekkingu á einum stað fyrir fólk sem vill skilja húsnæðismarkaðinn betur: verð, framboð, leigu, lán og aðra þætti sem móta markaðinn.",
  more:"Nánar",
  cMarket:"Almenn og fræðileg skrif um húsnæðismarkaðinn, m.a. mánaðarskýrslur HMS",
  cLoans:"Húsnæðislán skiptast í grófum dráttum í verðtryggð eða óverðtryggð húsnæðislán",
  cRent:"Leigumarkaðurinn og það umhverfi sem þar er m.a. leigumarkaðskönnun",
  cStats:"Kaupverðsjá HMS og gögn frá Hagstofu Íslands og Þjóðskrá",
  cStatsTitle:"Hagtölur & mælaborð",
  topicsTitle:"Allt um húsnæðislán",
  topicsText:"Helstu efnissvæði vefsins. Hver flokkur safnar saman fræðslu, gögnum, lögum og heimildum um sitt efni.",
  tFirstQ:"Ertu að flytja að heiman?", tPensionQ:"Er hagstætt að nýta séreignarsparnað?", tIndexQ:"Hvað er verðtrygging?", tShareQ:"Borga þau sig fyrir fyrstu kaupendur?",
  videosTitle:"Lærðu um verðtryggingu húsnæðislána",
  v1:"Verðtrygging", v2:"Vextir", v3:"Peningar og verðbólga", v4:"Verðtryggð og óverðtryggð húsnæðislán - kostir og ókostir",
  play:"Spila myndband", openYt:"Opna á YouTube", moreVideos:"Fleiri myndbönd",
  calcTitle:"Húsnæðislánareiknivél",
  calcText:"Húsnæðis- og mannvirkjastofnun, bankar, sparisjóðir og lífeyrissjóðir bjóða margir hverjir upp á lánareiknivélar. Þar má slá inn forsendur lána: lánsupphæð, lánstíma, vexti og verðbólgu og fá niðurstöður, sem hægt er að nýta til að bera saman ólíka kosti.",
  calcMore:"Nánar",
  amount:"Lánsupphæð", years:"Lánstími", yearsU:"ár", rateIdx:"Vextir, verðtryggt", rateNom:"Vextir, óverðtryggt", infl:"Verðbólga á ári",
  idx:"Verðtryggt lán", nom:"Óverðtryggt lán", first:"Fyrsta greiðsla", total:"Samtals greitt", perMonth:"á mánuði",
  tabPay:"Mánaðarleg greiðsla", tabBal:"Eftirstöðvar", year:"Ár",
  calcNote:"Jafnar greiðslur. Reiknað er með sömu vöxtum og verðbólgu allan lánstímann, svo niðurstöðurnar eru nálgun en ekki lánstilboð.",
  realLabel:"Á verðlagi dagsins í dag", goalTitle:"Reiknaðu dæmið", goalText:"Berðu saman verðtryggt og óverðtryggt lán", sinceStart:"frá 2016", nowShowing:"Valið", watch:"Horfa",
  sponsor:"Styrkt af",
  fTopics:"Efni", fAbout:"Um vefinn", fText:"Áreiðanlegar og óháðar upplýsingar um íslensk húsnæðismál, settar fram á mannamáli.",
  cur:"kr.", mShort:"m.kr."
 },
 en:{
  skip:"Skip to content", menu:"Menu", navAll:"All about",
  heroTitle:"Understand housing better",
  heroText:"Whether you are buying, renting or simply curious about the market, here is reliable, independent information on Icelandic housing, explained in plain language.",
  heroCta:"About Húsnæði.is", heroCalc:"Calculate a loan",
  chartTitle:"Apartment and rent prices in the capital area since 2016",
  chartIndex:"Index, January 2016 = 100", chartSrc:"Data from HMS",
  kaup:"Purchase price", leiga:"Rent",
  months:["January","February","March","April","May","June","July","August","September","October","November","December"],
  fPolicy:"Policy rate", fPolicySub:"Central Bank of Iceland",
  fInfl:"Inflation", fInflSub:"Last 12 months",
  fHouse:"House prices", fRent:"Rents", fChangeSub:"12 month change, capital area",
  todoTip:"Provisional figure, to be confirmed",
  introTitle:"What would you like to understand better?",
  intro1:"Housing has been in the spotlight for the past decade, both in Iceland and abroad. That is no surprise. For most people the largest share of their assets is tied up in property, and access to secure housing is directly linked to stability, financial security and quality of life.",
  intro2:"Despite the importance of housing, far more has been written about stock markets than about housing markets, both in public debate and in academic writing. The aim here is to put that right by gathering independent, accessible knowledge in one place for people who want to understand the housing market better: prices, supply, rents, loans and the other factors that shape it.",
  more:"More",
  cMarket:"General and academic writing on the housing market, including HMS monthly reports",
  cLoans:"Mortgages fall broadly into indexed and non-indexed mortgages",
  cRent:"The rental market and its wider context, including the rental market survey",
  cStats:"HMS purchase price index and data from Statistics Iceland and National Register of Iceland",
  cStatsTitle:"Statistics & dashboards",
  topicsTitle:"All about mortgages",
  topicsText:"The site's main subject areas. Each category gathers together explanations, data, legislation and sources on its topic.",
  tFirstQ:"Moving out of your parents' home?", tPensionQ:"Is it worth using private pension savings?", tIndexQ:"What is indexation?", tShareQ:"Are they worth it for first-time buyers?",
  videosTitle:"Learn about mortgage indexation",
  v1:"Indexation", v2:"Interest rates", v3:"Money and inflation", v4:"Indexed and non-indexed mortgages – pros and cons",
  play:"Play video", openYt:"Open on YouTube", moreVideos:"More videos",
  calcTitle:"Mortgage calculator",
  calcText:"Húsnæðis- og mannvirkjastofnun, banks, savings banks and pension funds all offer loan calculators. You can enter the loan assumptions — amount, term, interest rate and inflation — and get results you can use to compare different options.",
  calcMore:"More",
  amount:"Loan amount", years:"Loan term", yearsU:"years", rateIdx:"Interest, indexed", rateNom:"Interest, nominal", infl:"Inflation per year",
  idx:"Indexed loan", nom:"Nominal loan", first:"First payment", total:"Total paid", perMonth:"per month",
  tabPay:"Monthly payment", tabBal:"Remaining balance", year:"Year",
  calcNote:"Equal payments. The same interest rate and inflation are assumed for the whole term, so the results are an estimate, not a loan offer.",
  realLabel:"In today's money", goalTitle:"Run the numbers", goalText:"Compare an indexed and a nominal loan", sinceStart:"since 2016", nowShowing:"Selected", watch:"Watch",
  sponsor:"Supported by",
  fTopics:"Topics", fAbout:"About", fText:"Reliable, independent information on Icelandic housing, explained in plain language.",
  cur:"ISK", mShort:"M ISK"
 },
 pl:{
  skip:"Przejdź do treści", menu:"Menu", navAll:"Wszystko:",
  heroTitle:"Zrozum lepiej sprawy mieszkaniowe",
  heroText:"Niezależnie od tego, czy kupujesz, wynajmujesz, czy po prostu interesuje Cię rynek — znajdziesz tu rzetelne i niezależne informacje o islandzkim rynku mieszkaniowym, podane zrozumiałym językiem.",
  heroCta:"O Húsnæði.is", heroCalc:"Oblicz kredyt",
  chartTitle:"Ceny mieszkań i najmu w regionie stołecznym od 2016 r.",
  chartIndex:"Indeks, styczeń 2016 = 100", chartSrc:"Dane: HMS",
  kaup:"Cena zakupu", leiga:"Czynsz najmu",
  months:["Styczeń","Luty","Marzec","Kwiecień","Maj","Czerwiec","Lipiec","Sierpień","Wrzesień","Październik","Listopad","Grudzień"],
  fPolicy:"Stopa referencyjna", fPolicySub:"Bank Centralny Islandii",
  fInfl:"Inflacja", fInflSub:"Ostatnie 12 miesięcy",
  fHouse:"Ceny mieszkań", fRent:"Czynsze", fChangeSub:"Zmiana w ciągu 12 miesięcy, region stołeczny",
  todoTip:"Wartość tymczasowa, do potwierdzenia",
  introTitle:"Co chcesz lepiej zrozumieć?",
  intro1:"Kwestie mieszkaniowe znajdują się w centrum uwagi od dekady, zarówno na Islandii, jak i za granicą. Nie jest to zaskakujące. U większości osób największa część majątku ulokowana jest w nieruchomości, a dostęp do bezpiecznego mieszkania wiąże się bezpośrednio ze stabilnością, bezpieczeństwem finansowym i jakością życia.",
  intro2:"Mimo wagi tego tematu w debacie publicznej i literaturze naukowej znacznie więcej pisze się o rynkach akcji niż o rynku mieszkaniowym. Celem tej strony jest zmiana tego stanu rzeczy poprzez zebranie w jednym miejscu niezależnej i przystępnej wiedzy dla osób, które chcą lepiej zrozumieć rynek mieszkaniowy: ceny, podaż, najem, kredyty i inne czynniki kształtujące rynek.",
  more:"Więcej",
  cMarket:"Ogólne i naukowe publikacje o rynku mieszkaniowym, m.in. raporty miesięczne HMS",
  cLoans:"Kredyty mieszkaniowe dzielą się zasadniczo na indeksowane inflacją i nieindeksowane",
  cRent:"Rynek najmu i jego otoczenie, m.in. badanie rynku najmu",
  cStats:"Indeks cen zakupu HMS oraz dane ze statystyk Islandii i Krajowego Rejestru Islandii",
  cStatsTitle:"Statystyki i pulpity",
  topicsTitle:"Wszystko o kredytach mieszkaniowych",
  topicsText:"Główne działy serwisu. Każda kategoria gromadzi wiedzę, dane, przepisy i źródła dotyczące swojego tematu.",
  tFirstQ:"Wyprowadzasz się z domu rodzinnego?", tPensionQ:"Czy warto wykorzystać dobrowolne oszczędności emerytalne?", tIndexQ:"Czym jest indeksacja?", tShareQ:"Czy opłacają się osobom kupującym pierwsze mieszkanie?",
  videosTitle:"Dowiedz się o indeksacji kredytów mieszkaniowych",
  v1:"Indeksacja", v2:"Oprocentowanie", v3:"Pieniądz i inflacja", v4:"Kredyty mieszkaniowe indeksowane i nieindeksowane – zalety i wady",
  play:"Odtwórz film", openYt:"Otwórz w YouTube", moreVideos:"Więcej filmów",
  calcTitle:"Kalkulator kredytu mieszkaniowego",
  calcText:"Húsnæðis- og mannvirkjastofnun, banki, kasy oszczędnościowe i fundusze emerytalne oferują kalkulatory kredytowe. Można w nich wprowadzić założenia kredytu: kwotę, okres spłaty, oprocentowanie i inflację, a następnie otrzymać wyniki pozwalające porównać różne warianty.",
  calcMore:"Więcej",
  amount:"Kwota kredytu", years:"Okres spłaty", yearsU:"lat", rateIdx:"Oprocentowanie, indeksowany", rateNom:"Oprocentowanie, nieindeksowany", infl:"Inflacja rocznie",
  idx:"Kredyt indeksowany", nom:"Kredyt nieindeksowany", first:"Pierwsza rata", total:"Łącznie spłacono", perMonth:"miesięcznie",
  tabPay:"Rata miesięczna", tabBal:"Pozostało do spłaty", year:"Rok",
  calcNote:"Raty równe. Zakładamy stałe oprocentowanie i inflację przez cały okres kredytu, więc wyniki są szacunkiem, a nie ofertą kredytową.",
  realLabel:"W dzisiejszych cenach", goalTitle:"Policz to", goalText:"Porównaj kredyt indeksowany i nieindeksowany", sinceStart:"od 2016", nowShowing:"Wybrany", watch:"Obejrzyj",
  sponsor:"Wspierane przez",
  fTopics:"Tematy", fAbout:"O serwisie", fText:"Rzetelne i niezależne informacje o islandzkim rynku mieszkaniowym, podane zrozumiałym językiem.",
  cur:"ISK", mShort:"mln ISK"
 }
};

/* ---------- Navigation (paths on the current site) ---------- */
const NAV = [
 {key:"market", path:"/húsnæðismarkaðurinn", label:{is:"Húsnæðismarkaðurinn",en:"The housing market",pl:"Rynek mieszkaniowy"}, kids:[
   ["/fræðileg-gögn",{is:"Fræðileg gögn",en:"Academic material",pl:"Materiały naukowe"}],
   ["/fjölmiðlaumfjöllun",{is:"Fjölmiðlaumfjöllun",en:"Media coverage",pl:"Publikacje w mediach"}],
   ["/hms-mánaðarskýrslur",{is:"HMS mánaðarskýrslur",en:"HMS monthly reports",pl:"Raporty miesięczne HMS"}],
   ["/ársskýrslur-íbúðalánasjóðs",{is:"Ársskýrslur Íbúðalánasjóðs",en:"Annual reports of Íbúðalánasjóður",pl:"Raporty roczne funduszu Íbúðalánasjóður"}],
   ["/lög-og-reglugerðir",{is:"Lög og reglugerðir",en:"Laws and regulations",pl:"Ustawy i rozporządzenia"}]]},
 {key:"loans", path:"/húsnæðislán", label:{is:"Húsnæðislán",en:"Mortgages",pl:"Kredyty mieszkaniowe"}, kids:[
   ["/fyrstu-kaup",{is:"Fyrstu kaup",en:"First-time buyers",pl:"Pierwszy zakup mieszkania"}],
   ["/hlutdeildarlán",{is:"Hlutdeildarlán",en:"Shared-equity loans",pl:"Kredyty partycypacyjne"}],
   ["/séreignasparnaður",{is:"Séreignarsparnaður",en:"Private pension savings",pl:"Dobrowolne oszczędności emerytalne"}],
   ["/verðtrygging",{is:"Verðtrygging",en:"Indexation",pl:"Indeksacja"}],
   ["/lánareiknar",{is:"Lánareiknar",en:"Loan calculators",pl:"Kalkulatory kredytowe"}],
   ["/copy-of-lög-og-reglugerðir",{is:"Lög og reglugerðir",en:"Laws and regulations",pl:"Ustawy i rozporządzenia"}]]},
 {key:"rent", path:"/leigumarkaðurinn", label:{is:"Leigumarkaðurinn",en:"The rental market",pl:"Rynek najmu"}, kids:[
   ["/fræðileg-gögn-1",{is:"Fræðileg gögn",en:"Academic material",pl:"Materiały naukowe"}],
   ["/fjölmiðlaumfjöllun-1",{is:"Fjölmiðlaumfjöllun",en:"Media coverage",pl:"Publikacje w mediach"}],
   ["/leigumarkaðskönnun",{is:"Leigumarkaðskönnun",en:"Rental market survey",pl:"Badanie rynku najmu"}],
   ["/airbnb",{is:"Airbnb",en:"Airbnb",pl:"Airbnb"}],
   ["/copy-of-hús-lög-og-reglugerðir",{is:"Lög og reglugerðir",en:"Laws and regulations",pl:"Ustawy i rozporządzenia"}]]},
 {key:"stats", path:"/hagtölur-og-mælaborð", label:{is:"Hagtölur og mælaborð",en:"Statistics and dashboards",pl:"Statystyki i pulpity"}},
 {key:"about", path:"/um-okkur", label:{is:"Um okkur",en:"About us",pl:"O nas"}}
];

const ICONS = {
 market:'<svg viewBox="0 0 32 32" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 15 16 5l12 10"/><path d="M7 13v14h18V13"/><path d="M11 23l4-4 3 3 4-5"/></svg>',
 loans:'<svg viewBox="0 0 32 32" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="8" width="26" height="16" rx="3"/><circle cx="16" cy="16" r="3.5"/><path d="M7 12v.01M25 20v.01"/></svg>',
 rent:'<svg viewBox="0 0 32 32" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="16" r="5.5"/><path d="M16.5 16H29M25 16v4M21 16v3"/></svg>',
 stats:'<svg viewBox="0 0 32 32" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 27h22"/><rect x="7" y="16" width="4" height="8" rx="1"/><rect x="14" y="10" width="4" height="14" rx="1"/><rect x="21" y="5" width="4" height="19" rx="1"/></svg>',
 first:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 11 12 4l9 7"/><path d="M5 9.5V20h14V9.5"/><path d="M10 20v-5h4v5"/></svg>',
 pension:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 10c0-3.3-3.1-6-7-6s-7 2.7-7 6c0 1.9 1 3.6 2.6 4.7L8 19h3v-2h2v2h3l.6-3.2c1.2-.6 2.1-1.4 2.6-2.3H21v-3z"/><path d="M15.5 9.5v.01"/></svg>',
 index:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 20h18"/><path d="M4 16l5-5 4 3 7-8"/><path d="M15 6h5v5"/></svg>',
 share:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 11 12 4l9 7"/><path d="M5 9.5V20h14V9.5"/><path d="M12 20v-9"/></svg>',
 calc:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="5" y="3" width="14" height="18" rx="2.5"/><path d="M8.5 7h7M8.5 11.5h.01M12 11.5h.01M15.5 11.5h.01M8.5 15h.01M12 15h.01M15.5 15h.01M8.5 18h.01M12 18h3.5"/></svg>',
 arrow:'<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 8h10M9 4l4 4-4 4"/></svg>',
 chev:'<svg viewBox="0 0 12 12" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M2.5 4.5 6 8l3.5-3.5"/></svg>',
 play:'<svg viewBox="0 0 24 24" fill="currentColor"><path d="M7 4.5v15l13-7.5z"/></svg>',
 yt:'<svg viewBox="0 0 28 20" fill="currentColor"><path d="M27.4 3.1A3.5 3.5 0 0 0 25 .6C22.8 0 14 0 14 0S5.2 0 3 .6A3.5 3.5 0 0 0 .6 3.1C0 5.3 0 10 0 10s0 4.7.6 6.9A3.5 3.5 0 0 0 3 19.4c2.2.6 11 .6 11 .6s8.8 0 11-.6a3.5 3.5 0 0 0 2.4-2.5c.6-2.2.6-6.9.6-6.9s0-4.7-.6-6.9z"/><path fill="#fff" d="m11.2 14.3 7.3-4.3-7.3-4.3z"/></svg>'
};

const SECTIONS = [
 {key:"market", nav:"market", text:"cMarket"},
 {key:"loans", nav:"loans", text:"cLoans"},
 {key:"rent", nav:"rent", text:"cRent"},
 {key:"stats", nav:"stats", text:"cStats", title:"cStatsTitle"}
];
const TOPICS = [
 {icon:"first", path:"/fyrstu-kaup", q:"tFirstQ", label:{is:"Fyrstu kaup",en:"First-time buyers",pl:"Pierwszy zakup mieszkania"}},
 {icon:"pension", path:"/séreignasparnaður", q:"tPensionQ", label:{is:"Séreignarsparnaður",en:"Private pension savings",pl:"Dobrowolne oszczędności emerytalne"}},
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
  ["2026-01",249.7],["2026-02",249.9],["2026-03",251.5],["2026-04",251.5],["2026-05",250.4],["2026-06",250.6],["2026-07",250.8],["2026-08",251.0]
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
  ["2026-01",205.8],["2026-02",208.3],["2026-03",211.4],["2026-04",212.9],["2026-05",213.7],["2026-06",214.5],["2026-07",215.5],["2026-08",215.2]
];

/* ---------- Helpers ---------- */
let lang = "is";
const $ = s => document.querySelector(s);
const $$ = s => [...document.querySelectorAll(s)];
const t = k => (T[lang][k] ?? T.is[k] ?? "");
const url = p => BASE + PREFIX[lang] + p;
// Number format by hand: some browsers ship without Icelandic locale data
const SEP = {is:[".",","], en:[",","."], pl:[" ",","]};
const nf = (v, d=0) => {
  const [g, dec] = SEP[lang], neg = v < 0;
  let [i, f] = Math.abs(v).toFixed(d).split(".");
  i = i.replace(/\B(?=(\d{3})+(?!\d))/g, (lang === "pl" && i.length <= 4) ? "" : g);
  return (neg ? "−" : "") + i + (f ? dec + f : "");
};
const kr = v => nf(Math.round(v)) + " " + t("cur");
const pct = (v, d=1) => nf(v, d) + "%";
const monthName = key => { const [y,m] = key.split("-"); return t("months")[+m-1] + " " + y; };
const store = { get(k){ try{ return localStorage.getItem(k); }catch(e){ return null; } }, set(k,v){ try{ localStorage.setItem(k,v); }catch(e){} } };
const ns = "http://www.w3.org/2000/svg";
const el = (tag, attrs={}, parent) => { const e = document.createElementNS(ns, tag); for(const k in attrs) e.setAttribute(k, attrs[k]); if(parent) parent.appendChild(e); return e; };
function niceNum(range, round){
  const exponent = Math.floor(Math.log10(range));
  const fraction = range / Math.pow(10, exponent);
  let f;
  if(round){ f = fraction < 1.5 ? 1 : fraction < 3 ? 2 : fraction < 7 ? 5 : 10; }
  else { f = fraction <= 1 ? 1 : fraction <= 2 ? 2 : fraction <= 5 ? 5 : 10; }
  return f * Math.pow(10, exponent);
}
const todoDot = on => on ? `<span class="todo" title="${t("todoTip")}" aria-label="${t("todoTip")}"></span>` : "";

/* ---------- Build: nav ---------- */
function buildNav(){
  $("#navList").innerHTML = NAV.map(n => n.kids ? `
    <li class="nav-item">
      <button class="nav-link" aria-expanded="false">${n.label[lang]}${ICONS.chev}</button>
      <ul class="dropdown">
        <li><a class="dd-all" href="${url(n.path)}">${n.label[lang]}</a></li>
        ${n.kids.map(([p,l]) => `<li><a href="${url(p)}">${l[lang]}</a></li>`).join("")}
      </ul>
    </li>` : `<li class="nav-item"><a class="nav-link" href="${url(n.path)}">${n.label[lang]}</a></li>`).join("");
  $$("#navList .nav-item > button").forEach(b => b.addEventListener("click", e => {
    const li = b.parentElement, open = !li.classList.contains("open");
    $$("#navList .nav-item.open").forEach(x => { x.classList.remove("open"); x.firstElementChild.setAttribute("aria-expanded","false"); });
    li.classList.toggle("open", open); b.setAttribute("aria-expanded", open);
    e.stopPropagation();
  }));
  $("#mList").innerHTML = NAV.map((n,i) => `
    <li><div class="m-row"><a href="${url(n.path)}">${n.label[lang]}</a>${n.kids ? `<button class="m-toggle" aria-expanded="false" aria-controls="msub${i}" aria-label="${n.label[lang]}">${ICONS.chev}</button>` : ""}</div>
    ${n.kids ? `<ul class="m-sub" id="msub${i}">${n.kids.map(([p,l]) => `<li><a href="${url(p)}">${l[lang]}</a></li>`).join("")}</ul>` : ""}</li>`).join("");
  $$(".m-toggle").forEach(b => b.addEventListener("click", () => {
    const open = b.getAttribute("aria-expanded") !== "true";
    b.setAttribute("aria-expanded", open); $("#" + b.getAttribute("aria-controls")).classList.toggle("open", open);
  }));
}
document.addEventListener("click", () => $$("#navList .nav-item.open").forEach(x => { x.classList.remove("open"); x.firstElementChild.setAttribute("aria-expanded","false"); }));
document.addEventListener("keydown", e => { if(e.key === "Escape"){ document.body.click(); setMenu(false); } });

function setMenu(open){
  document.body.classList.toggle("menu-open", open);
  $("#menuBtn").setAttribute("aria-expanded", open);
}
$("#menuBtn").addEventListener("click", () => setMenu(!document.body.classList.contains("menu-open")));
$("#mPanel").addEventListener("click", e => { if(e.target.closest("a")) setMenu(false); });

/* ---------- Build: cards, topics, videos, footer ---------- */
let curVideo = 0;
const thumb = id => `<img src="https://i.ytimg.com/vi/${id}/hqdefault.jpg" alt="" loading="lazy" onerror="this.remove()">`;
function video(i, play){
  curVideo = i; const v = VIDEOS[i];
  const main = $("#vMain");
  if(play){
    const f = document.createElement("iframe");
    f.src = "https://www.youtube-nocookie.com/embed/" + v.id + "?autoplay=1&rel=0";
    f.allow = "accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture; fullscreen";
    f.allowFullscreen = true; f.title = t(v.t);
    main.replaceChildren(f);
  } else {
    main.innerHTML = thumb(v.id) + `<button class="v-btn" aria-label="${t("play")}: ${t(v.t)}"><span class="v-play">${ICONS.play}</span></button>`;
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
  const col = n => `<div><h4><a href="${url(n.path)}">${n.label[lang]}</a></h4><ul>${(n.kids||[]).map(([p,l]) => `<li><a href="${url(p)}">${l[lang]}</a></li>`).join("")}</ul></div>`;
  const stats = NAV.find(n => n.key==="stats"), about = NAV.find(n => n.key==="about");
  $("#footGrid").innerHTML = `
    <div class="foot-brand">${$(".brand").innerHTML.replace(/ ?logo-(pre|anim)/g,'').replace(/lgClip/g,'ftClip')}<p>${t("fText")}</p>
      <a class="yt" href="https://www.youtube.com/@husnaediIS" target="_blank" rel="noopener">${ICONS.yt} YouTube</a></div>
    ${col(NAV[0])}${col(NAV[1])}${col(NAV[2])}
    <div><h4>${t("fAbout")}</h4><ul><li><a href="${url(stats.path)}">${stats.label[lang]}</a></li><li><a href="${url(about.path)}">${about.label[lang]}</a></li><li><a href="#reiknivel">${t("calcTitle")}</a></li></ul></div>`;
  observeReveal();
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
    svg.replaceChildren();
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
      if(!render.drawn && !matchMedia("(prefers-reduced-motion: reduce)").matches){
        const len = path.getTotalLength();
        path.style.strokeDasharray = len; path.style.strokeDashoffset = len;
        path.getBoundingClientRect();
        path.style.transition = "stroke-dashoffset 1.6s cubic-bezier(.4,0,.2,1) .9s";
        path.style.strokeDashoffset = 0;
      }
      const li = s.data.length-1;
      el("circle",{cx:x(li),cy:y(s.data[li][1]),r:4,fill:s.color},svg);
      const chg = s.data[li][1] - s.data[0][1];
      const lab = el("text",{x:x(li)-8,y:y(s.data[li][1])-11,"text-anchor":"end",fill:s.color,"font-weight":"700","font-size":W<480?12:13.5,"font-family":"var(--font)",style:"paint-order:stroke;stroke:#f6faff;stroke-width:4px"},svg);
      lab.textContent = "+" + nf(chg,0) + "% " + t("sinceStart");
    });
    render.drawn = true;
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
  return { refresh(){ legend(); render(true); } };
})();

/* ---------- Loan calculator ---------- */
const calc = (() => {
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

/* ---------- Language ---------- */
function setLang(l){
  lang = LANGS.includes(l) ? l : "is";
  document.documentElement.lang = lang;
  $$("[data-t]").forEach(e => { e.textContent = t(e.dataset.t); });
  $$("[data-href]").forEach(a => a.href = url(a.dataset.href));
  $$("[data-lang-switch]").forEach(g => {
    g.innerHTML = LANGS.map(x => `<button type="button" lang="${x}" aria-pressed="${x===lang}">${x.toUpperCase()}</button>`).join("");
    g.querySelectorAll("button").forEach(b => b.addEventListener("click", () => { setLang(b.getAttribute("lang")); store.set("hlang", lang); }));
  });
  buildNav(); buildContent(); buildFigures(); priceChart.refresh(); calc.refresh();
}

/* ---------- Header behaviour, reveal, logo animation ---------- */
addEventListener("scroll", () => $(".site-head").classList.toggle("scrolled", scrollY > 8), {passive:true});
let io;
function observeReveal(){
  if(!("IntersectionObserver" in window)){ $$(".rv").forEach(e => e.classList.add("in")); return; }
  io = io || new IntersectionObserver(es => es.forEach(e => { if(e.isIntersecting){ e.target.classList.add("in"); io.unobserve(e.target); } }), {rootMargin:"0px 0px -8% 0px"});
  $$(".rv:not(.in)").forEach(e => io.observe(e));
}
(function logoIntro(){
  // Plays once per visit, and only once the page is actually on screen
  const logo = $(".brand .logo-svg");
  let seen = false; try{ seen = sessionStorage.getItem("hlogo") === "1"; }catch(e){}
  if(seen || matchMedia("(prefers-reduced-motion: reduce)").matches){ logo.classList.remove("logo-pre"); return; }
  const go = () => {
    if(document.visibilityState !== "visible") return;
    document.removeEventListener("visibilitychange", go);
    requestAnimationFrame(() => requestAnimationFrame(() => {
      logo.classList.add("logo-anim");
      logo.querySelector(".lg-t").addEventListener("animationend", () => {
        logo.classList.remove("logo-pre","logo-anim");
        try{ sessionStorage.setItem("hlogo","1"); }catch(e){}
      }, {once:true});
    }));
  };
  const start = () => { document.visibilityState === "visible" ? setTimeout(go, 250) : document.addEventListener("visibilitychange", go); };
  document.readyState === "complete" ? start() : addEventListener("load", start, {once:true});
})();
$("#year").textContent = new Date().getFullYear();
setLang(store.get("hlang") || "is");