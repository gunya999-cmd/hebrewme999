export interface VocabWord {
  id: string;
  hebrew: string;        // Hebrew text (with nikud where helpful)
  transcription: string; // Russian transliteration
  translation: string;   // Russian translation
  emoji: string;
  category: "greeting" | "wish" | "phrase" | "noun" | "adjective" | "verb" | "everyday";
}

export const VOCABULARY: VocabWord[] = [
  // Greetings & wishes
  { id: "v1",  hebrew: "שָׁלוֹם",          transcription: "шало́м",            translation: "Привет / Мир",          emoji: "👋", category: "greeting" },
  { id: "v2",  hebrew: "בְּרוּכִים הַבָּאִים", transcription: "бруxи́м ха-баи́м",   translation: "Добро пожаловать",      emoji: "🎉", category: "greeting" },
  { id: "v3",  hebrew: "בְּהַצְלָחָה",       transcription: "бэ-haцлаха́",       translation: "Удачи!",                emoji: "🍀", category: "wish" },
  { id: "v4",  hebrew: "נְסִיעָה טוֹבָה",     transcription: "нэсиа́ това́",      translation: "Счастливого пути",      emoji: "✈️", category: "wish" },
  { id: "v5",  hebrew: "בּוֹקֶר טוֹב",       transcription: "бо́кер тов",        translation: "Доброе утро",           emoji: "🌅", category: "greeting" },
  { id: "v6",  hebrew: "עֶרֶב טוֹב",        transcription: "э́рев тов",         translation: "Добрый вечер",          emoji: "🌆", category: "greeting" },
  { id: "v7",  hebrew: "לַיְלָה טוֹב",       transcription: "ла́йла тов",        translation: "Спокойной ночи",        emoji: "🌙", category: "greeting" },
  { id: "v8",  hebrew: "לְהִתְרָאוֹת",       transcription: "ле-хитрао́т",       translation: "До свидания",           emoji: "👋", category: "greeting" },
  { id: "v9",  hebrew: "תּוֹדָה",           transcription: "тода́",             translation: "Спасибо",               emoji: "🙏", category: "phrase" },
  { id: "v10", hebrew: "תּוֹדָה רַבָּה",     transcription: "тода́ раба́",        translation: "Большое спасибо",       emoji: "💖", category: "phrase" },
  { id: "v11", hebrew: "בְּבַקָּשָׁה",       transcription: "бэвакаша́",        translation: "Пожалуйста",            emoji: "🙌", category: "phrase" },
  { id: "v12", hebrew: "סְלִיחָה",          transcription: "слиха́",            translation: "Извините",              emoji: "🙇", category: "phrase" },
  { id: "v13", hebrew: "מַזָּל טוֹב",       transcription: "маза́ль тов",       translation: "Поздравляю!",           emoji: "🎊", category: "wish" },
  { id: "v14", hebrew: "בִּתֵּאָבוֹן",      transcription: "бэ-теаво́н",        translation: "Приятного аппетита",    emoji: "🍽️", category: "wish" },
  { id: "v15", hebrew: "רְפוּאָה שְׁלֵמָה",  transcription: "рэфуа́ шлема́",      translation: "Скорейшего выздоровления", emoji: "💊", category: "wish" },
  { id: "v16", hebrew: "שַׁבָּת שָׁלוֹם",    transcription: "шаба́т шало́м",      translation: "Мирной субботы",        emoji: "🕯️", category: "wish" },
  { id: "v17", hebrew: "חַג שָׂמֵחַ",       transcription: "хаг саме́ах",       translation: "С праздником!",         emoji: "🎁", category: "wish" },
  { id: "v18", hebrew: "כֵּן",             transcription: "кен",              translation: "Да",                    emoji: "✅", category: "phrase" },
  { id: "v19", hebrew: "לֹא",              transcription: "ло",               translation: "Нет",                   emoji: "❌", category: "phrase" },
  { id: "v20", hebrew: "אוּלַי",            transcription: "ула́й",             translation: "Может быть",            emoji: "🤔", category: "phrase" },

  // Everyday
  { id: "v21", hebrew: "מָה שְׁלוֹמְךָ?",   transcription: "ма шломxа́?",       translation: "Как дела? (м)",         emoji: "💬", category: "everyday" },
  { id: "v22", hebrew: "אֲנִי אוֹהֵב",      transcription: "ани́ охе́в",         translation: "Я люблю (м)",           emoji: "❤️", category: "everyday" },
  { id: "v23", hebrew: "אֲנִי רוֹצֶה",      transcription: "ани́ роцэ́",         translation: "Я хочу (м)",            emoji: "🙋", category: "everyday" },
  { id: "v24", hebrew: "אֲנִי מֵבִין",      transcription: "ани́ мэви́н",        translation: "Я понимаю (м)",         emoji: "💡", category: "everyday" },
  { id: "v25", hebrew: "אֲנִי לֹא יוֹדֵעַ",  transcription: "ани́ ло йодэ́а",     translation: "Я не знаю (м)",         emoji: "🤷", category: "everyday" },
  { id: "v26", hebrew: "אֵיפֹה?",          transcription: "э́йфо?",            translation: "Где?",                  emoji: "📍", category: "everyday" },
  { id: "v27", hebrew: "כַּמָּה זֶה עוֹלֶה?", transcription: "ка́ма зэ оле́?",    translation: "Сколько это стоит?",   emoji: "💰", category: "everyday" },
  { id: "v28", hebrew: "מַיִם",            transcription: "ма́им",             translation: "Вода",                  emoji: "💧", category: "noun" },
  { id: "v29", hebrew: "לֶחֶם",            transcription: "ле́хем",            translation: "Хлеб",                  emoji: "🍞", category: "noun" },
  { id: "v30", hebrew: "קָפֶה",            transcription: "кафэ́",             translation: "Кофе",                  emoji: "☕", category: "noun" },

  // Nouns
  { id: "v31", hebrew: "בַּיִת",           transcription: "ба́ит",             translation: "Дом",                   emoji: "🏠", category: "noun" },
  { id: "v32", hebrew: "מִשְׁפָּחָה",       transcription: "мишпаха́",          translation: "Семья",                 emoji: "👨‍👩‍👧", category: "noun" },
  { id: "v33", hebrew: "חָבֵר",            transcription: "хавэ́р",            translation: "Друг",                  emoji: "🤝", category: "noun" },
  { id: "v34", hebrew: "יֶלֶד",            transcription: "е́лед",             translation: "Ребёнок",               emoji: "🧒", category: "noun" },
  { id: "v35", hebrew: "שֶׁמֶשׁ",           transcription: "ше́меш",            translation: "Солнце",                emoji: "☀️", category: "noun" },
  { id: "v36", hebrew: "יָם",              transcription: "ям",               translation: "Море",                  emoji: "🌊", category: "noun" },
  { id: "v37", hebrew: "סֵפֶר",            transcription: "сэ́фер",            translation: "Книга",                 emoji: "📖", category: "noun" },
  { id: "v38", hebrew: "עִיר",             transcription: "ир",               translation: "Город",                 emoji: "🏙️", category: "noun" },
  { id: "v39", hebrew: "כֶּסֶף",            transcription: "кэ́сеф",            translation: "Деньги",                emoji: "💵", category: "noun" },
  { id: "v40", hebrew: "זְמַן",             transcription: "зма́н",             translation: "Время",                 emoji: "⏰", category: "noun" },

  // Adjectives
  { id: "v41", hebrew: "טוֹב",             transcription: "тов",              translation: "Хороший",               emoji: "👍", category: "adjective" },
  { id: "v42", hebrew: "יָפֶה",            transcription: "яфэ́",              translation: "Красивый",              emoji: "✨", category: "adjective" },
  { id: "v43", hebrew: "גָּדוֹל",           transcription: "гадо́ль",           translation: "Большой",               emoji: "🐘", category: "adjective" },
  { id: "v44", hebrew: "קָטָן",            transcription: "ката́н",            translation: "Маленький",             emoji: "🐭", category: "adjective" },
  { id: "v45", hebrew: "חָדָשׁ",            transcription: "хада́ш",            translation: "Новый",                 emoji: "🆕", category: "adjective" },
  { id: "v46", hebrew: "שָׂמֵחַ",           transcription: "саме́ах",           translation: "Радостный",             emoji: "😊", category: "adjective" },

  // Wishes
  { id: "v47", hebrew: "כָּל הַכָּבוֹד",     transcription: "коль ха-кавод",    translation: "Молодец! / Браво!",     emoji: "👏", category: "wish" },
  { id: "v48", hebrew: "יוֹם הוּלֶדֶת שָׂמֵחַ", transcription: "йом hуле́дэт саме́ах", translation: "С днём рождения",  emoji: "🎂", category: "wish" },
  { id: "v49", hebrew: "שָׁנָה טוֹבָה",      transcription: "шана́ това́",        translation: "С Новым годом",         emoji: "🎆", category: "wish" },
  { id: "v50", hebrew: "אֵין בְּעָיָה",     transcription: "эйн бэая́",         translation: "Нет проблем",           emoji: "👌", category: "phrase" },
];

export const VOCAB_CATEGORIES: Record<VocabWord["category"], string> = {
  greeting: "Приветствия",
  wish: "Пожелания",
  phrase: "Фразы",
  noun: "Существительные",
  adjective: "Прилагательные",
  verb: "Глаголы",
  everyday: "Повседневное",
};
