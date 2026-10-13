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
export function writeProgress(progress: Progress): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
}
export function mergeProgress(local: Progress, remote: Progress): Progress {
  const attempts = new Map<string, Attempt>();
  for (const attempt of [...remote.attempts, ...local.attempts]) {
    const id = [attempt.lessonId, attempt.at, attempt.userTurns].join(":");
    attempts.set(id, attempt);
  }
  const reviews = new Map<string, ReviewItem>();
  for (const review of [...remote.reviews, ...local.reviews]) {
    const previous = reviews.get(review.term);
    if (!previous || review.dueAt > previous.dueAt) reviews.set(review.term, review);
  }
  return {
    attempts: [...attempts.values()].sort((a, b) => a.at - b.at).slice(-100),
    reviews: [...reviews.values()],
  };
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
