export interface ConjugationForm {
  hebrew: string;
  transcription: string;
  translation: string;
}

export interface PresentTense {
  ms: ConjugationForm;
  fs: ConjugationForm;
  mp: ConjugationForm;
  fp: ConjugationForm;
}

export interface PastFutureTense {
  ani: ConjugationForm;
  ata: ConjugationForm;
  at: ConjugationForm;
  hu: ConjugationForm;
  hi: ConjugationForm;
  anachnu: ConjugationForm;
  atem: ConjugationForm;
  aten: ConjugationForm;
  hem: ConjugationForm;
  hen: ConjugationForm;
}

export interface ImperativeTense {
  ms: ConjugationForm;
  fs: ConjugationForm;
  mp: ConjugationForm;
  fp: ConjugationForm;
}

export interface VerbConjugations {
  present: PresentTense;
  past: PastFutureTense;
  future: PastFutureTense;
  imperative: ImperativeTense;
}

export type Binyan = "פעל" | "נפעל" | "פיעל" | "הפעיל" | "התפעל";
export type Difficulty = "easy" | "medium" | "hard";

export interface Verb {
  id: string;
  infinitive_hebrew: string;
  transcription_ru: string;
  translation_ru: string;
  translation_source?: string;
  root: string;
  binyan: Binyan;
  difficulty: Difficulty;
  pealim_url?: string;
  pealim_url_status?: string;
  conjugations?: VerbConjugations;
}

export const BINYAN_NAMES: Record<Binyan, string> = {
  "פעל": "Пааль",
  "נפעל": "Нифаль",
  "פיעל": "Пиэль",
  "הפעיל": "Хифиль",
  "התפעל": "Хитпаэль",
};

export const PERSON_LABELS: Record<string, string> = {
  ms: "муж. ед.",
  fs: "жен. ед.",
  mp: "муж. мн.",
  fp: "жен. мн.",
  ani: "я",
  ata: "ты (м)",
  at: "ты (ж)",
  hu: "он",
  hi: "она",
  anachnu: "мы",
  atem: "вы (м)",
  aten: "вы (ж)",
  hem: "они (м)",
  hen: "они (ж)",
};

export const TENSE_LABELS: Record<string, string> = {
  present: "Настоящее",
  past: "Прошедшее",
  future: "Будущее",
  imperative: "Повелительное",
};

export interface LearningProgress {
  verbId: string;
  level: number; // 0-5
  nextReview: string; // ISO date
  lastReview?: string;
  correctCount: number;
  wrongCount: number;
}

export interface DailyStats {
  date: string;
  newLearned: number;
  reviewed: number;
  streak: number;
}
