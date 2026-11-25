/* Húsnæði.is: sameiginlegur kóði (haus, valmynd, fótur, tungumál) */
const BASE = "https://www.husnaedi.is"; // undirsíður eru enn á Wix
const HOME = "index.html";
const LOCAL = {"/um-okkur": "um-okkur.html", "/": "index.html", "/húsnæðislán": "husnaedislan.html", "/fyrstu-kaup": "fyrstu-kaup.html", "/hlutdeildarlán": "hlutdeildarlan.html", "/séreignasparnaður": "sereignasparnadur.html", "/verðtrygging": "verdtrygging.html", "/lánareiknar": "lanareiknar.html", "/copy-of-lög-og-reglugerðir": "log-husnaedislan.html", "/húsnæðismarkaðurinn": "husnaedismarkadurinn.html", "/fræðileg-gögn": "fraedileg-gogn.html", "/fjölmiðlaumfjöllun": "fjolmidlaumfjollun.html", "/hms-mánaðarskýrslur": "hms-manadarskyrslur.html", "/ársskýrslur-íbúðalánasjóðs": "arsskyrslur-ils.html", "/lög-og-reglugerðir": "log-husnaedismarkadur.html", "/leigumarkaðurinn": "leigumarkadurinn.html", "/fræðileg-gögn-1": "fraedileg-gogn-leiga.html", "/fjölmiðlaumfjöllun-1": "fjolmidlaumfjollun-leiga.html", "/leigumarkaðskönnun": "leigumarkadskonnun.html", "/airbnb": "airbnb.html", "/copy-of-hús-lög-og-reglugerðir": "log-leigumarkadur.html", "/hagtölur-og-mælaborð": "hagtolur.html"};   // gamla slóðin á Wix -> ný síða
const PAGE = document.body.dataset.page || "home";
const LANGS = ["is","en","pl"];
const PREFIX = {is:"", en:"/en", pl:"/pl"};
const LOCALE = {is:"is-IS", en:"en-GB", pl:"pl-PL"};

/* ---------- Text ---------- */
const T = {
 is:{
  skip:"Fara beint í efnið", menu:"Valmynd", navAll:"Allt um",
  heroTitle:"Skildu húsnæðismál betur",
  heroText:"Hvort sem þú ert að kaupa, leigja eða vilt einfaldlega vita meira um markaðinn, hér eru áreiðanlegar og óháðar upplýsingar um íslensk húsnæðismál, settar fram á mannamáli.",
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
  tFirstQ:"Ertu að flytja að heiman?", tPensionQ:"Er hagstætt að nýta séreignasparnað?", tIndexQ:"Hvað er verðtrygging?", tShareQ:"Borga þau sig fyrir fyrstu kaupendur?",
  videosTitle:"Lærðu um verðtryggingu húsnæðislána",
  v1:"Verðtrygging", v2:"Vextir", v3:"Peningar og verðbólga", v4:"Verðtryggð og óverðtryggð húsnæðislán: kostir og ókostir",
  play:"Spila myndband", openYt:"Opna á YouTube", moreVideos:"Fleiri myndbönd",
  calcTitle:"Reiknivélar Húsnæði.is",
  calcText:"Þrjár einfaldar reiknivélar sem hjálpa þér að átta þig á greiðslubyrðinni, hversu hátt lán þú getur fengið og hversu mikið eigið fé þú þarft.",
  calcMore:"Reiknivélar banka og HMS",
  calcQ:"Hvað viltu vita áður en þú kaupir?", q1:"Hvað kostar lánið á mánuði?", ex1:"Dæmi: 50 m.kr. verðtryggt lán til 30 ára", sub1:"fyrsta greiðsla á mánuði", cta1:"Reikna greiðslubyrði", q2:"Hversu mikið get ég fengið lánað?", ex2:"Dæmi: 700 þús. kr. útborguð laun, fyrstu kaup", sub2:"miðað við verðtryggt lán", cta2:"Reikna hámarkslán", q3:"Hversu mikið eigið fé þarf ég?", ex3:"Dæmi: 60 m.kr. íbúð, fyrstu kaup", sub3:"með stimpilgjaldi og kostnaði", cta3:"Reikna eigið fé",
  amount:"Lánsupphæð", years:"Lánstími", yearsU:"ár", rateIdx:"Vextir, verðtryggt", rateNom:"Vextir, óverðtryggt", infl:"Verðbólga á ári",
  idx:"Verðtryggt lán", nom:"Óverðtryggt lán", first:"Fyrsta greiðsla", total:"Samtals greitt", perMonth:"á mánuði",
  tabPay:"Mánaðarleg greiðsla", tabBal:"Eftirstöðvar", year:"Ár",
  calcNote:"Jafnar greiðslur. Reiknað er með sömu vöxtum og verðbólgu allan lánstímann, svo niðurstöðurnar eru nálgun en ekki lánstilboð.",
  realLabel:"Á verðlagi dagsins í dag", goalTitle:"Reiknaðu dæmið", goalText:"Berðu saman verðtryggt og óverðtryggt lán", sinceStart:"frá 2016", nowShowing:"Valið", watch:"Horfa",
  sponsor:"Styrkt af",
  fTopics:"Efni", fAbout:"Um vefinn", fText:"Áreiðanlegar og óháðar upplýsingar um íslensk húsnæðismál, settar fram á mannamáli.",
  searchPh:"Leita í heimildum", all:"Allt", sortDefault:"Sjálfgefin röð", sortNew:"Nýjast fyrst", sortOld:"Elst fyrst", open:"Opna", copyCite:"Afrita tilvísun", copied:"Afritað",
  restricted:"Takmarkaður aðgangur", missingDoc:"Skjal ekki aðgengilegt", missingShort:"Vantar", noLink:"Ekki á netinu", noResults:"Engar heimildir fundust.",
  nSources:"{n} heimildir", nSources1:"{n} heimild", nLaws:"{n} lög", nDocs:"{n} skjöl", nDocs1:"{n} skjal", nLinks:"{n} tenglar", nLinks1:"{n} tengill", lawRead:"Lesa lögin", lawHistory:"Ferill málsins á Alþingi",
  latestTitle:"Nýjast á þessu sviði", watchYt:"Horfa á YouTube", ownCalc:"Reiknivél Húsnæði.is", home:"Forsíða",
  missingNoteT:"Unnið að því að endurheimta skjöl", missingNote:"{n} skjöl af gamla vefnum eru ekki lengur aðgengileg og verða sett inn aftur.",
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
  v1:"Indexation", v2:"Interest rates", v3:"Money and inflation", v4:"Indexed and non-indexed mortgages: pros and cons",
  play:"Play video", openYt:"Open on YouTube", moreVideos:"More videos",
  calcTitle:"Húsnæði.is calculators",
  calcText:"Three simple calculators that help you understand your monthly payments, how much you can borrow and how much of your own money you need.",
  calcMore:"Bank and HMS calculators",
  calcQ:"What do you want to know before you buy?", q1:"What will the loan cost each month?", ex1:"Example: ISK 50m indexed loan over 30 years", sub1:"first monthly payment", cta1:"Calculate payments", q2:"How much can I borrow?", ex2:"Example: ISK 700k take home pay, first home", sub2:"with an indexed loan", cta2:"Calculate maximum loan", q3:"How much of my own money do I need?", ex3:"Example: ISK 60m apartment, first home", sub3:"including stamp duty and costs", cta3:"Calculate down payment",
  amount:"Loan amount", years:"Loan term", yearsU:"years", rateIdx:"Interest, indexed", rateNom:"Interest, nominal", infl:"Inflation per year",
  idx:"Indexed loan", nom:"Nominal loan", first:"First payment", total:"Total paid", perMonth:"per month",
  tabPay:"Monthly payment", tabBal:"Remaining balance", year:"Year",
  calcNote:"Equal payments. The same interest rate and inflation are assumed for the whole term, so the results are an estimate, not a loan offer.",
  realLabel:"In today's money", goalTitle:"Run the numbers", goalText:"Compare an indexed and a nominal loan", sinceStart:"since 2016", nowShowing:"Selected", watch:"Watch",
  sponsor:"Supported by",
  fTopics:"Topics", fAbout:"About", fText:"Reliable, independent information on Icelandic housing, explained in plain language.",
  searchPh:"Search sources", all:"All", sortDefault:"Default order", sortNew:"Newest first", sortOld:"Oldest first", open:"Open", copyCite:"Copy citation", copied:"Copied",
  restricted:"Restricted access", missingDoc:"Document unavailable", missingShort:"Missing", noLink:"Not online", noResults:"No sources found.",
  nSources:"{n} sources", nSources1:"{n} source", nLaws:"{n} acts", nLaws1:"{n} act", nDocs:"{n} documents", nDocs1:"{n} document", nLinks:"{n} links", nLinks1:"{n} link", lawRead:"Read the act", lawHistory:"Legislative history",
  latestTitle:"Latest in this area", watchYt:"Watch on YouTube", ownCalc:"Húsnæði.is calculator", home:"Home",
  missingNoteT:"Documents are being restored", missingNote:"{n} documents from the old site are no longer available and will be added again.",
  cur:"ISK", mShort:"M ISK"
 },
 pl:{
  skip:"Przejdź do treści", menu:"Menu", navAll:"Wszystko:",
  heroTitle:"Zrozum lepiej kwestie mieszkaniowe",
  heroText:"Niezależnie od tego, czy kupujesz, wynajmujesz, czy po prostu interesuje Cię rynek, znajdziesz tu rzetelne i niezależne informacje o islandzkim rynku mieszkaniowym, podane zrozumiałym językiem.",
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
  cStats:"Indeks cen zakupu HMS oraz dane Urzędu Statystycznego Islandii i Rejestru Krajowego Islandii",
  cStatsTitle:"Statystyki i pulpity",
  topicsTitle:"Wszystko o kredytach mieszkaniowych",
  topicsText:"Główne działy serwisu. Każda kategoria gromadzi wiedzę, dane, przepisy i źródła dotyczące swojego tematu.",
  tFirstQ:"Wyprowadzasz się z domu rodzinnego?", tPensionQ:"Czy warto wykorzystać dobrowolne oszczędności emerytalne?", tIndexQ:"Czym jest indeksacja?", tShareQ:"Czy opłacają się osobom kupującym pierwsze mieszkanie?",
  videosTitle:"Dowiedz się o indeksacji kredytów mieszkaniowych",
  v1:"Indeksacja", v2:"Oprocentowanie", v3:"Pieniądz i inflacja", v4:"Kredyty mieszkaniowe indeksowane i nieindeksowane: zalety i wady",
  play:"Odtwórz film", openYt:"Otwórz w YouTube", moreVideos:"Więcej filmów",
  calcTitle:"Kalkulatory Húsnæði.is",
  calcText:"Trzy proste kalkulatory, które pomogą Ci zrozumieć wysokość rat, ile możesz pożyczyć i ile środków własnych potrzebujesz.",
  calcMore:"Kalkulatory banków i HMS",
  calcQ:"Co chcesz wiedzieć przed zakupem?", q1:"Ile będzie kosztować kredyt miesięcznie?", ex1:"Przykład: kredyt indeksowany 50 mln ISK na 30 lat", sub1:"pierwsza rata miesięczna", cta1:"Oblicz ratę", q2:"Ile mogę pożyczyć?", ex2:"Przykład: 700 tys. ISK na rękę, pierwsze mieszkanie", sub2:"przy kredycie indeksowanym", cta2:"Oblicz maksymalny kredyt", q3:"Ile środków własnych potrzebuję?", ex3:"Przykład: mieszkanie za 60 mln ISK, pierwsze mieszkanie", sub3:"z opłatą skarbową i kosztami", cta3:"Oblicz wkład własny",
  amount:"Kwota kredytu", years:"Okres spłaty", yearsU:"lat", rateIdx:"Oprocentowanie kredytu indeksowanego", rateNom:"Oprocentowanie kredytu nieindeksowanego", infl:"Inflacja roczna",
  idx:"Kredyt indeksowany", nom:"Kredyt nieindeksowany", first:"Pierwsza rata", total:"Łączna kwota spłat", perMonth:"miesięcznie",
  tabPay:"Rata miesięczna", tabBal:"Pozostało do spłaty", year:"Rok",
  calcNote:"Raty równe. Zakładamy stałe oprocentowanie i inflację przez cały okres kredytu, więc wyniki są szacunkiem, a nie ofertą kredytową.",
  realLabel:"W dzisiejszych cenach", goalTitle:"Policz to", goalText:"Porównaj kredyt indeksowany i nieindeksowany", sinceStart:"od 2016", nowShowing:"Wybrany", watch:"Obejrzyj",
  sponsor:"Wspierane przez",
  fTopics:"Tematy", fAbout:"O serwisie", fText:"Rzetelne i niezależne informacje o islandzkim rynku mieszkaniowym, podane zrozumiałym językiem.",
  searchPh:"Szukaj w źródłach", all:"Wszystko", sortDefault:"Domyślna kolejność", sortNew:"Najnowsze najpierw", sortOld:"Najstarsze najpierw", open:"Otwórz", copyCite:"Kopiuj przypis", copied:"Skopiowano",
  restricted:"Dostęp ograniczony", missingDoc:"Dokument niedostępny", missingShort:"Brak", noLink:"Brak wersji online", noResults:"Nie znaleziono źródeł.",
  nSources:"Źródła: {n}", nLaws:"Ustawy: {n}", nDocs:"Dokumenty: {n}", nLinks:"Linki: {n}", lawRead:"Czytaj ustawę", lawHistory:"Przebieg prac w Althingu",
  latestTitle:"Najnowsze w tym dziale", watchYt:"Obejrzyj w YouTube", ownCalc:"Kalkulator Húsnæði.is", home:"Strona główna",
  missingNoteT:"Trwa przywracanie dokumentów", missingNote:"Dokumenty ze starej strony, które są obecnie niedostępne: {n}. Zostaną dodane ponownie.",
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
   ["/séreignasparnaður",{is:"Séreignasparnaður",en:"Private pension savings",pl:"Dobrowolne oszczędności emerytalne"}],
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

/* ---------- Helpers ---------- */
let lang = "is";
const $ = s => document.querySelector(s);
const $$ = s => [...document.querySelectorAll(s)];
const t = k => (T[lang][k] ?? T.is[k] ?? "");
const url = p => LOCAL[p] || (BASE + PREFIX[lang] + p);
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
      <button class="nav-link" aria-expanded="false"${PAGE==='sub-'+n.key?' aria-current="page"':''}>${n.label[lang]}${ICONS.chev}</button>
      <ul class="dropdown">
        <li><a class="dd-all" href="${url(n.path)}">${n.label[lang]}</a></li>
        ${n.kids.map(([p,l]) => `<li><a href="${url(p)}">${l[lang]}</a></li>`).join("")}
      </ul>
    </li>` : `<li class="nav-item"><a class="nav-link" href="${url(n.path)}"${PAGE===n.key||PAGE==='sub-'+n.key?' aria-current="page"':''}>${n.label[lang]}</a></li>`).join("");
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

if(PAGE !== "home") $(".brand").href = HOME;
else $(".brand").addEventListener("click", e => {
  // Logo á forsíðu: renna upp í hetjuhlutann
  e.preventDefault();
  window.scrollTo({top: 0, behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth"});
  if(location.hash) history.replaceState(null, "", location.pathname + location.search);
});

/* ---------- Footer ---------- */
function buildFooter(){
  const col = n => `<div><h4><a href="${url(n.path)}">${n.label[lang]}</a></h4><ul>${(n.kids||[]).map(([p,l]) => `<li><a href="${url(p)}">${l[lang]}</a></li>`).join("")}</ul></div>`;
  const stats = NAV.find(n => n.key==="stats"), about = NAV.find(n => n.key==="about");
  $("#footGrid").innerHTML = `
    <div class="foot-brand">${$(".brand").innerHTML.replace(/ ?logo-(pre|anim)/g,'').replace(/lgClip/g,'ftClip')}<p>${t("fText")}</p>
      <a class="yt" href="https://www.youtube.com/@husnaediIS" target="_blank" rel="noopener">${ICONS.yt} YouTube</a></div>
    ${col(NAV[0])}${col(NAV[1])}${col(NAV[2])}
    <div><h4>${t("fAbout")}</h4><ul><li><a href="${url(stats.path)}">${stats.label[lang]}</a></li><li><a href="${url(about.path)}">${about.label[lang]}</a></li><li><a href="${PAGE==='home'?'':HOME}#reiknivel">${t("calcTitle")}</a></li></ul></div>`;
  if(typeof footLogo === "function") setTimeout(footLogo, 0);
}

/* ---------- Language ---------- */
function setLang(l){
  lang = LANGS.includes(l) ? l : "is";
  document.documentElement.lang = lang;
  $$("[data-t]").forEach(e => { e.textContent = t(e.dataset.t); });
  $$("[data-tr]").forEach(e => { try{ const o = JSON.parse(e.dataset.tr); e.textContent = o[lang] || o.is; }catch(err){} });
  $$("[data-tc]").forEach(e => {
    const n = +e.dataset.n, one = lang === "is" ? (n % 10 === 1 && n % 100 !== 11) : n === 1;
    const k = one && T[lang][e.dataset.tc + "1"] ? e.dataset.tc + "1" : e.dataset.tc;
    e.textContent = t(k).replace("{n}", e.dataset.n);
  });
  $$("[data-ph]").forEach(e => { e.placeholder = t(e.dataset.ph); });
  if(document.body.dataset.title){ try{ const o = JSON.parse(document.body.dataset.title); document.title = (o[lang] || o.is) + " | Húsnæði.is"; }catch(err){} }
  $$("[data-href]").forEach(a => a.href = url(a.dataset.href));
  $$("[data-lang-switch]").forEach(g => {
    g.innerHTML = LANGS.map(x => `<button type="button" lang="${x}" aria-pressed="${x===lang}" aria-label="${LNAME[x]}" title="${LNAME[x]}"><span class="flag" aria-hidden="true">${FLAGS[x]}</span><span class="lcode">${x.toUpperCase()}</span></button>`).join("");
    g.querySelectorAll("button").forEach(b => b.addEventListener("click", () => { setLang(b.getAttribute("lang")); store.set("hlang", lang); }));
  });
  buildNav(); buildFooter();
  PAGE_HOOKS.forEach(fn => fn());
  observeReveal();
}
const PAGE_HOOKS = [];
/* Fánar fyrir tungumálaval */
const LNAME = {is:"Íslenska", en:"English", pl:"Polski"};
const FLAGS = {
  is:'<svg viewBox="0 0 25 18" preserveAspectRatio="xMidYMid slice"><rect width="25" height="18" fill="#02529C"/><path d="M0 9h25M9 0v18" stroke="#fff" stroke-width="4"/><path d="M0 9h25M9 0v18" stroke="#DC1E35" stroke-width="2"/></svg>',
  en:'<svg viewBox="0 0 60 30" preserveAspectRatio="xMidYMid slice"><clipPath id="ukc"><path d="M30 15h30v15zv15H0zH0V0zV0h30z"/></clipPath><rect width="60" height="30" fill="#012169"/><path d="M0 0l60 30M60 0L0 30" stroke="#fff" stroke-width="6"/><path d="M0 0l60 30M60 0L0 30" clip-path="url(#ukc)" stroke="#C8102E" stroke-width="4"/><path d="M30 0v30M0 15h60" stroke="#fff" stroke-width="10"/><path d="M30 0v30M0 15h60" stroke="#C8102E" stroke-width="6"/></svg>',
  pl:'<svg viewBox="0 0 16 10" preserveAspectRatio="xMidYMid slice"><rect width="16" height="10" fill="#fff"/><rect y="5" width="16" height="5" fill="#DC143C"/></svg>'
};
/* YouTube: plakat og spilari. Ef síðan leyfir ekki innfellda spilara (t.d. forskoðun) opnast myndbandið á YouTube. */
function ytPoster(id, title){
  return `<span class="v-cap" aria-hidden="true"><b>${title}</b></span><img src="https://i.ytimg.com/vi/${id}/hqdefault.jpg" alt="" loading="lazy" onerror="this.remove()">`;
}
function ytPlay(frame, id, title){
  const out = () => { frame.innerHTML = ytPoster(id, title) + `<a class="v-btn v-out" href="https://www.youtube.com/watch?v=${id}" target="_blank" rel="noopener"><span class="v-play">${ICONS.play}</span><span class="v-out-t">${t("watchYt")}</span></a>`; };
  if(window.__ytBlocked) return out();
  const f = document.createElement("iframe");
  f.src = "https://www.youtube-nocookie.com/embed/" + id + "?autoplay=1&rel=0";
  f.allow = "accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture; fullscreen";
  f.allowFullscreen = true; f.title = title;
  const onV = e => { if(String(e.blockedURI || "").includes("youtube")){ window.__ytBlocked = true; document.removeEventListener("securitypolicyviolation", onV); out(); } };
  document.addEventListener("securitypolicyviolation", onV);
  setTimeout(() => document.removeEventListener("securitypolicyviolation", onV), 5000);
  frame.replaceChildren(f);
}
function onLang(fn){ PAGE_HOOKS.push(fn); }
function startSite(){ setLang(store.get("hlang") || "is"); }

/* ---------- Header behaviour, reveal, logo animation ---------- */
addEventListener("scroll", () => $(".site-head").classList.toggle("scrolled", scrollY > 8), {passive:true});
let io;
function observeReveal(){
  if(!("IntersectionObserver" in window)){ $$(".rv").forEach(e => e.classList.add("in")); return; }
  io = io || new IntersectionObserver(es => es.forEach(e => { if(e.isIntersecting){ e.target.classList.add("in"); io.unobserve(e.target); } }), {rootMargin:"0px 0px -8% 0px"});
  $$(".rv:not(.in)").forEach(e => io.observe(e));
}
(function logoIntro(){
  // Plays on every page load, once the page is actually on screen
  const logo = $(".brand .logo-svg");
  if(matchMedia("(prefers-reduced-motion: reduce)").matches){ logo.classList.remove("logo-pre"); return; }
  const go = () => {
    if(document.visibilityState !== "visible") return;
    document.removeEventListener("visibilitychange", go);
    requestAnimationFrame(() => requestAnimationFrame(() => {
      logo.classList.add("logo-anim");
      logo.querySelector(".lg-t").addEventListener("animationend", () => {
        logo.classList.remove("logo-pre","logo-anim");
      }, {once:true});
    }));
  };
  // Start once the page has painted, not on window "load": on phones, images further down
  // can hold "load" back for several seconds and the logo would just pop in without animating.
  const start = () => { document.visibilityState === "visible" ? setTimeout(go, 150) : document.addEventListener("visibilitychange", go); };
  document.readyState === "loading" ? addEventListener("DOMContentLoaded", start, {once:true}) : start();
})();
$("#year").textContent = new Date().getFullYear();
/* Footer logo: same animation when the footer scrolls into view */
let footLogoDone = false;
function footLogo(){
  const fl = $(".foot-brand .logo-svg");
  if(!fl || footLogoDone || !("IntersectionObserver" in window) || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  fl.classList.add("logo-wait");
  const ob = new IntersectionObserver(es => {
    if(!es[0].isIntersecting) return;
    ob.disconnect();
    fl.classList.add("logo-anim");
    fl.querySelector(".lg-t").addEventListener("animationend", () => { fl.classList.remove("logo-wait","logo-anim"); footLogoDone = true; }, {once:true});
  }, {threshold:.6});
  ob.observe(fl);
}