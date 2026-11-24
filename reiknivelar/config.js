/* =========================================================
   Húsnæði.is: Sameiginlegar forsendur reiknivéla
   ---------------------------------------------------------
   Allir sjálfgefnir vextir, verðbólga, reglur Seðlabankans og
   kostnaðarliðir eru HÉR og hvergi annars staðar.
   Uppfærðu gildin og dagsetningarnar hér þegar eitthvað breytist.

   Ef reiknivélarnar eru hýstar á husnaedi.is eru vextir og verðbólga
   auk þess sótt sjálfkrafa úr /data/rates.json (uppfært daglega af
   GitHub sjálfvirkninni). Gildin hér eru þá aðeins varagildi.
   ========================================================= */
window.HCONFIG = {
  /* Sjálfgefnir vextir íbúðalána: miðgildi breytilegra vaxta Landsbankans,
     Íslandsbanka og Arion banka samkvæmt vaxtatöflu Aurbjargar. */
  rates: {
    nominal: 9.69,          // óverðtryggð lán, % á ári
    indexed: 4.55,          // verðtryggð lán, % á ári (raunvextir ofan á verðbætur)
    date: "2026-11-18",
    source: "Aurbjörg, miðgildi Landsbankans, Íslandsbanka og Arion banka",
    sourceUrl: "https://aurbjorg.is/husnaedislan"
  },

  /* Verðbólga: 12 mánaða breyting vísitölu neysluverðs */
  inflation: {
    value: 5.9,             // % á ári
    period: "2026-10",      // mælingarmánuður
    date: "2026-10-29",
    source: "Hagstofa Íslands, vísitala neysluverðs",
    sourceUrl: "https://hagstofa.is/talnaefni/efnahagur/verdlag/visitala-neysluverds/"
  },

  /* Reglur Seðlabanka Íslands (lánþegaskilyrði) */
  rules: {
    ltv:  { general: 80, firstTime: 90,
            source: "Reglur nr. 1131/2025 um hámark veðsetningarhlutfalls fasteignalána til neytenda",
            sourceUrl: "https://island.is/stjornartidindi/nr/0aa42d46-53a7-4e0c-b651-f6cadc070fd8" },
    dsti: { general: 35, firstTime: 40,
            // Við útreikning má miða við jafngreiðslulán til mest 40 ára (óverðtryggt)
            // eða 25 ára (verðtryggt), með vöxtum að lágmarki 5,5% / 3%.
            stress: { nominal: { minRate: 5.5, maxYears: 40 },
                      indexed: { minRate: 3.0, maxYears: 25 } },
            exemptionShare: 10,   // % lána sem lánveitandi má veita umfram hámark á ársfjórðungi
            source: "Reglur nr. 1300/2025 um hámark greiðslubyrðar fasteignalána í hlutfalli við tekjur neytenda",
            sourceUrl: "https://adverts.stjornartidindi.is/B_nr_1300_2025.pdf" },
    date: "2025-12-03"
  },

  /* Kostnaður við fasteignakaup */
  costs: {
    // LÖGBUNDINN kostnaður
    stampDuty: { individual: 0.8, firstTime: 0.4,   // % af fasteignamati
                 source: "Lög nr. 138/2013 um stimpilgjald, 5. gr.",
                 sourceUrl: "https://www.althingi.is/lagas/nuna/2013138.html" },
    registrationFee: { perDocument: 3800, documents: 3,   // kaupsamningur, afsal og veðskuldabréf
                 source: "Gjaldskrá sýslumanna",
                 sourceUrl: "https://island.is/en/o/district-commissioner/fee-schedule-district-commissioners" },
    // ÁÆTLAÐUR kostnaður (misjafn eftir banka og fasteignasölu)
    loanFee: { value: 65000, firstTimeNote: true,       // lántökugjald, t.d. Landsbankinn 59.900 kr., Arion 64.995 kr.
                 source: "Verðskrár Landsbankans og Arion banka" },
    creditCheck: { value: 12500,                         // greiðslumat hjóna/sambúðarfólks hjá Arion
                 source: "Verðskrá Arion banka" },
    brokerFee: { value: 70000, min: 52000, max: 118000,   // umsýslugjald kaupanda hjá fasteignasölu
                 source: "Gjaldskrár fasteignasala (t.d. Býr, Frón, Fermetri, Helgafell, Húsaskjól)" },
    date: "2026-11-24"
  },

  /* Hvaðan vextir og verðbólga eru sótt sjálfkrafa þegar síðan er á husnaedi.is */
  liveDataUrl: "../data/rates.json"
};
