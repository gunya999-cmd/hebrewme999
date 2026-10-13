import { nextReview, type ReviewItem } from "./miriamCurriculum";
export type Attempt = { lessonId: string; at: number; userTurns: number };
export type Progress = { attempts: Attempt[]; reviews: ReviewItem[] };
const STORAGE_KEY = "miriam-learning-v1";
export function readProgress(): Progress {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || "null");
    if (saved && Array.isArray(saved.attempts) && Array.isArray(saved.reviews)) return saved;
  } catch { /* storage unavailable */ }
  return { attempts: [], reviews: [] };
}
export function saveAttempt(lessonId: string, userTurns: number, vocabulary: string[]): Progress {
  const current = readProgress();
  const reviews = [...current.reviews];
  for (const term of vocabulary) {
    if (!reviews.some(review => review.term === term)) {
      reviews.push({ term, repetitions: 0, intervalDays: 1, dueAt: Date.now() + 86400000 });
    }
  }
  const next = { attempts: [...current.attempts, { lessonId, userTurns, at: Date.now() }].slice(-100), reviews };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  return next;
}
export function reviewTerm(term: string, correct: boolean): Progress {
  const current = readProgress();
  const next = { ...current, reviews: current.reviews.map(review => review.term === term ? nextReview(review, correct) : review) };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  return next;
}
export function dueTerms(progress: Progress): ReviewItem[] {
  return progress.reviews.filter(review => review.dueAt <= Date.now());
}
