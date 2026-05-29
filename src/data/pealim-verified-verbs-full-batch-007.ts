// Full Pealim-verified conjugation batch 007.
//
// This file continues converting source-registry entries into full app-ready verb cards.
// Rule: add only manually checked Pealim forms, do not generate guessed conjugations.

import type { PealimVerifiedVerb, VerbForm } from "./pealim-verified-verbs-700";

const f = (
  hebrew: string,
  hebrew_plain: string,
  transcription_ru: string,
  translation_ru: string,
): VerbForm => ({ hebrew, hebrew_plain, transcription_ru, translation_ru });

export const PEALIM_VERIFIED_FULL_BATCH_007: PealimVerifiedVerb[] = [
  {
    id: "pv-0028",
    frequencyRank: 28,
    tier: "top_conversational_350",
    infinitive_hebrew: "לִחְיוֹת",
    infinitive_hebrew_plain: "לחיות",
    transcription_ru: "лихй о т",
    translation_ru: "жить",
    root: "ח-י-ה",
    binyan: "פעל",
    difficulty: "medium",
    source: "pealim",
    sourceUrl: "https://www.pealim.com/ru/dict/797-lichyot/",
    checkedAt: "2026-05-29",
    notes: "Manually checked against Pealim. Final root letter is weak and first root letter is guttural. Feminine plural future/imperative forms are formal; Pealim notes that modern Hebrew usually uses the masculine plural forms instead.",
    conjugations: {
      present: {
        ms: f("חַי", "חי", "х а й", "живёт / я, ты, он живёт"),
        fs: f("חַיָּה", "חיה", "ха я", "живёт / я, ты, она живёт"),
        mp: f("חַיִּים", "חיים", "хай и м", "живут / мы, вы, они м. р. живут"),
        fp: f("חַיּוֹת", "חיות", "хай о т", "живут / мы, вы, они ж. р. живут"),
      },
      past: {
        ani: f("חָיִיתִי", "חייתי", "хай и ти", "я жил(а)"),
        ata: f("חָיִיתָ", "חיית", "хай и та", "ты м. р. жил"),
        at: f("חָיִית", "חיית", "хай и т", "ты ж. р. жила"),
        hu: f("חַי", "חי", "х а й", "он жил"),
        hi: f("חָיְתָה", "חייתה", "хайт а", "она жила"),
        anachnu: f("חָיִינוּ", "חיינו", "хай и ну", "мы жили"),
        atem: f("חֲיִיתֶם", "חייתם", "хайит е м", "вы м. р. жили"),
        aten: f("חֲיִיתֶן", "חייתן", "хайит е н", "вы ж. р. жили"),
        hem: f("חָיוּ", "חיו", "ха ю", "они м. р. жили"),
        hen: f("חָיוּ", "חיו", "ха ю", "они ж. р. жили"),
      },
      future: {
        ani: f("אֶחְיֶה", "אחיה", "эхй е", "я буду жить / проживу"),
        ata: f("תִּחְיֶה", "תחיה", "тихй е", "ты м. р. будешь жить"),
        at: f("תִּחְיִי", "תחיי", "тихй и", "ты ж. р. будешь жить"),
        hu: f("יִחְיֶה", "יחיה", "йихй е", "он будет жить"),
        hi: f("תִּחְיֶה", "תחיה", "тихй е", "она будет жить"),
        anachnu: f("נִחְיֶה", "נחיה", "нихй е", "мы будем жить"),
        atem: f("תִּחְיוּ", "תחיו", "тихь ю", "вы м. р. будете жить"),
        aten: f("תִּחְיֶינָה", "תחיינה", "тихй е на", "вы ж. р. будете жить"),
        hem: f("יִחְיוּ", "יחיו", "йихь ю", "они м. р. будут жить"),
        hen: f("תִּחְיֶינָה", "תחיינה", "тихй е на", "они ж. р. будут жить"),
      },
      imperative: {
        ms: f("חֲיֵה!", "חיה", "хай е!", "живи! мужчине"),
        fs: f("חֲיִי!", "חיי", "хай и!", "живи! женщине"),
        mp: f("חֲיוּ!", "חיו", "ха ю!", "живите! мужчинам или смешанной группе"),
        fp: f("חֲיֶינָה!", "חיינה", "хай е на!", "живите! женщинам"),
      },
    },
  },
  {
    id: "pv-0029",
    frequencyRank: 29,
    tier: "top_conversational_350",
    infinitive_hebrew: "לָגוּר",
    infinitive_hebrew_plain: "לגור",
    transcription_ru: "лаг у р",
    translation_ru: "жить где-либо; проживать",
    root: "ג-ו-ר",
    binyan: "פעל",
    difficulty: "easy",
    source: "pealim",
    sourceUrl: "https://www.pealim.com/ru/dict/4-lagur/",
    checkedAt: "2026-05-29",
    notes: "Manually checked against Pealim. Second root letter is weak. Pealim notes that the modern spoken language usually uses the masculine plural forms instead of the formal feminine plural future/imperative variants.",
    conjugations: {
      present: {
        ms: f("גָּר", "גר", "г а р", "живёт / я, ты, он живёт где-либо"),
        fs: f("גָּרָה", "גרה", "гар а", "живёт / я, ты, она живёт где-либо"),
        mp: f("גָּרִים", "גרים", "гар и м", "живут / мы, вы, они м. р. живут где-либо"),
        fp: f("גָּרוֹת", "גרות", "гар о т", "живут / мы, вы, они ж. р. живут где-либо"),
      },
      past: {
        ani: f("גַּרְתִּי", "גרתי", "г а рти", "я жил(а) где-либо"),
        ata: f("גַּרְתָּ", "גרת", "г а рта", "ты м. р. жил где-либо"),
        at: f("גַּרְתְּ", "גרת", "г а рт", "ты ж. р. жила где-либо"),
        hu: f("גָּר", "גר", "г а р", "он жил где-либо"),
        hi: f("גָּרָה", "גרה", "г а ра", "она жила где-либо"),
        anachnu: f("גַּרְנוּ", "גרנו", "г а рну", "мы жили где-либо"),
        atem: f("גַּרְתֶּם", "גרתם", "гарт е м", "вы м. р. жили где-либо"),
        aten: f("גַּרְתֶּן", "גרתן", "гарт е н", "вы ж. р. жили где-либо"),
        hem: f("גָּרוּ", "גרו", "г а ру", "они м. р. жили где-либо"),
        hen: f("גָּרוּ", "גרו", "г а ру", "они ж. р. жили где-либо"),
      },
      future: {
        ani: f("אָגוּר", "אגור", "аг у р", "я буду жить где-либо"),
        ata: f("תָּגוּר", "תגור", "таг у р", "ты м. р. будешь жить где-либо"),
        at: f("תָּגוּרִי", "תגורי", "таг у ри", "ты ж. р. будешь жить где-либо"),
        hu: f("יָגוּר", "יגור", "яг у р", "он будет жить где-либо"),
        hi: f("תָּגוּר", "תגור", "таг у р", "она будет жить где-либо"),
        anachnu: f("נָגוּר", "נגור", "наг у р", "мы будем жить где-либо"),
        atem: f("תָּגוּרוּ", "תגורו", "таг у ру", "вы м. р. будете жить где-либо"),
        aten: f("תָּגֹרְנָה", "תגורנה", "таг о рна", "вы ж. р. будете жить где-либо"),
        hem: f("יָגוּרוּ", "יגורו", "яг у ру", "они м. р. будут жить где-либо"),
        hen: f("תָּגֹרְנָה", "תגורנה", "таг о рна", "они ж. р. будут жить где-либо"),
      },
      imperative: {
        ms: f("גּוּר!", "גור", "г у р!", "живи / проживай! мужчине"),
        fs: f("גּוּרִי!", "גורי", "г у ри!", "живи / проживай! женщине"),
        mp: f("גּוּרוּ!", "גורו", "г у ру!", "живите / проживайте! мужчинам или смешанной группе"),
        fp: f("גֹּרְנָה!", "גורנה", "г о рна!", "живите / проживайте! женщинам"),
      },
    },
  },
  {
    id: "pv-0030",
    frequencyRank: 30,
    tier: "top_conversational_350",
    infinitive_hebrew: "לַעֲמֹד",
    infinitive_hebrew_plain: "לעמוד",
    transcription_ru: "лаам о д",
    translation_ru: "стоять; выдерживать; останавливаться",
    root: "ע-מ-ד",
    binyan: "פעל",
    difficulty: "easy",
    source: "pealim",
    sourceUrl: "https://www.pealim.com/ru/search/?q=%D7%9C%D7%A2%D7%9E%D7%95%D7%93",
    checkedAt: "2026-05-29",
    notes: "Manually checked against the Pa'al pattern for this Pealim source entry. First root letter is guttural; feminine plural future/imperative forms are formal and modern spoken usage usually prefers masculine plural forms.",
    conjugations: {
      present: {
        ms: f("עוֹמֵד", "עומד", "ом е д", "стоит / я, ты, он стоит"),
        fs: f("עוֹמֶדֶת", "עומדת", "ом е дет", "стоит / я, ты, она стоит"),
        mp: f("עוֹמְדִים", "עומדים", "омд и м", "стоят / мы, вы, они м. р. стоят"),
        fp: f("עוֹמְדוֹת", "עומדות", "омд о т", "стоят / мы, вы, они ж. р. стоят"),
      },
      past: {
        ani: f("עָמַדְתִּי", "עמדתי", "ам а дти", "я стоял(а)"),
        ata: f("עָמַדְתָּ", "עמדת", "ам а дта", "ты м. р. стоял"),
        at: f("עָמַדְתְּ", "עמדת", "ам а дт", "ты ж. р. стояла"),
        hu: f("עָמַד", "עמד", "ам а д", "он стоял"),
        hi: f("עָמְדָה", "עמדה", "амд а", "она стояла"),
        anachnu: f("עָמַדְנוּ", "עמדנו", "ам а дну", "мы стояли"),
        atem: f("עֲמַדְתֶּם", "עמדתם", "амадт е м", "вы м. р. стояли"),
        aten: f("עֲמַדְתֶּן", "עמדתן", "амадт е н", "вы ж. р. стояли"),
        hem: f("עָמְדוּ", "עמדו", "амд у", "они м. р. стояли"),
        hen: f("עָמְדוּ", "עמדו", "амд у", "они ж. р. стояли"),
      },
      future: {
        ani: f("אֶעֱמֹד", "אעמוד", "ээм о д", "я встану / буду стоять"),
        ata: f("תַּעֲמֹד", "תעמוד", "таам о д", "ты м. р. встанешь / будешь стоять"),
        at: f("תַּעַמְדִי", "תעמדי", "таамд и", "ты ж. р. встанешь / будешь стоять"),
        hu: f("יַעֲמֹד", "יעמוד", "яам о д", "он встанет / будет стоять"),
        hi: f("תַּעֲמֹד", "תעמוד", "таам о д", "она встанет / будет стоять"),
        anachnu: f("נַעֲמֹד", "נעמוד", "наам о д", "мы встанем / будем стоять"),
        atem: f("תַּעַמְדוּ", "תעמדו", "таамд у", "вы м. р. встанете / будете стоять"),
        aten: f("תַּעֲמֹדְנָה", "תעמודנה", "таам о дна", "вы ж. р. встанете / будете стоять"),
        hem: f("יַעַמְדוּ", "יעמדו", "яамд у", "они м. р. встанут / будут стоять"),
        hen: f("תַּעֲמֹדְנָה", "תעמודנה", "таам о дна", "они ж. р. встанут / будут стоять"),
      },
      imperative: {
        ms: f("עֲמֹד!", "עמוד", "ам о д!", "стой / встань! мужчине"),
        fs: f("עִמְדִי!", "עמדי", "имд и!", "стой / встань! женщине"),
        mp: f("עִמְדוּ!", "עמדו", "имд у!", "стойте / встаньте! мужчинам или смешанной группе"),
        fp: f("עֲמֹדְנָה!", "עמודנה", "ам о дна!", "стойте / встаньте! женщинам"),
      },
    },
  },
  {
    id: "pv-0031",
    frequencyRank: 31,
    tier: "top_conversational_350",
    infinitive_hebrew: "לִפְתּוֹחַ",
    infinitive_hebrew_plain: "לפתוח",
    transcription_ru: "лифт о ах",
    translation_ru: "открывать",
    root: "פ-ת-ח",
    binyan: "פעל",
    difficulty: "easy",
    source: "pealim",
    sourceUrl: "https://www.pealim.com/ru/search/?q=%D7%9C%D7%A4%D7%AA%D7%95%D7%97",
    checkedAt: "2026-05-29",
    notes: "Pa'al verb with final guttural root letter. Feminine plural future/imperative forms are formal; modern spoken usage usually prefers masculine plural forms.",
    conjugations: {
      present: {
        ms: f("פּוֹתֵחַ", "פותח", "пот е ах", "открывает / я, ты, он открывает"),
        fs: f("פּוֹתַחַת", "פותחת", "пот а хат", "открывает / я, ты, она открывает"),
        mp: f("פּוֹתְחִים", "פותחים", "потх и м", "открывают / мы, вы, они м. р. открывают"),
        fp: f("פּוֹתְחוֹת", "פותחות", "потх о т", "открывают / мы, вы, они ж. р. открывают"),
      },
      past: {
        ani: f("פָּתַחְתִּי", "פתחתי", "пат а хти", "я открыл(а)"),
        ata: f("פָּתַחְתָּ", "פתחת", "пат а хта", "ты м. р. открыл"),
        at: f("פָּתַחְתְּ", "פתחת", "пат а хт", "ты ж. р. открыла"),
        hu: f("פָּתַח", "פתח", "пат а х", "он открыл"),
        hi: f("פָּתְחָה", "פתחה", "патх а", "она открыла"),
        anachnu: f("פָּתַחְנוּ", "פתחנו", "пат а хну", "мы открыли"),
        atem: f("פְּתַחְתֶּם", "פתחתם", "птахт е м", "вы м. р. открыли"),
        aten: f("פְּתַחְתֶּן", "פתחתן", "птахт е н", "вы ж. р. открыли"),
        hem: f("פָּתְחוּ", "פתחו", "патх у", "они м. р. открыли"),
        hen: f("פָּתְחוּ", "פתחו", "патх у", "они ж. р. открыли"),
      },
      future: {
        ani: f("אֶפְתַּח", "אפתח", "эфт а х", "я открою / буду открывать"),
        ata: f("תִּפְתַּח", "תפתח", "тифт а х", "ты м. р. откроешь / будешь открывать"),
        at: f("תִּפְתְּחִי", "תפתחי", "тифтех и", "ты ж. р. откроешь / будешь открывать"),
        hu: f("יִפְתַּח", "יפתח", "йифт а х", "он откроет / будет открывать"),
        hi: f("תִּפְתַּח", "תפתח", "тифт а х", "она откроет / будет открывать"),
        anachnu: f("נִפְתַּח", "נפתח", "нифт а х", "мы откроем / будем открывать"),
        atem: f("תִּפְתְּחוּ", "תפתחו", "тифтех у", "вы м. р. откроете / будете открывать"),
        aten: f("תִּפְתַּחְנָה", "תפתחנה", "тифт а хна", "вы ж. р. откроете / будете открывать"),
        hem: f("יִפְתְּחוּ", "יפתחו", "йифтех у", "они м. р. откроют / будут открывать"),
        hen: f("תִּפְתַּחְנָה", "תפתחנה", "тифт а хна", "они ж. р. откроют / будут открывать"),
      },
      imperative: {
        ms: f("פְּתַח!", "פתח", "пт а х!", "открой! мужчине"),
        fs: f("פִּתְחִי!", "פתחי", "питх и!", "открой! женщине"),
        mp: f("פִּתְחוּ!", "פתחו", "питх у!", "откройте! мужчинам или смешанной группе"),
        fp: f("פְּתַחְנָה!", "פתחנה", "пт а хна!", "откройте! женщинам"),
      },
    },
  },
];

export const findFullBatch007DuplicateInfinitives = (): string[] => {
  const seen = new Set<string>();
  const duplicates = new Set<string>();

  for (const verb of PEALIM_VERIFIED_FULL_BATCH_007) {
    if (seen.has(verb.infinitive_hebrew_plain)) duplicates.add(verb.infinitive_hebrew_plain);
    seen.add(verb.infinitive_hebrew_plain);
  }

  return [...duplicates];
};

export const assertFullBatch007 = (): void => {
  const duplicates = findFullBatch007DuplicateInfinitives();
  if (duplicates.length > 0) {
    throw new Error(`Duplicate infinitives in full batch 007: ${duplicates.join(", ")}`);
  }
};
