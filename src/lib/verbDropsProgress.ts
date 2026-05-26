export interface VerbDropProgress {
  verbId: string;
  seen: number;
  correct: number;
  wrong: number;
  level: 0 | 1 | 2 | 3 | 4 | 5;
  lastSeenAt: string;
}

const STORAGE_KEY = "verbDropsProgress";

function isProgressRecord(value: unknown): value is Record<string, VerbDropProgress> {
  return Boolean(value && typeof value === "object" && !Array.isArray(value));
}

export function loadVerbDropsProgress(): Record<string, VerbDropProgress> {
  if (typeof window === "undefined") return {};

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw) as unknown;
    return isProgressRecord(parsed) ? parsed : {};
  } catch {
    return {};
  }
}

export function saveVerbDropsProgress(progress: Record<string, VerbDropProgress>): void {
  if (typeof window === "undefined") return;

  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
  } catch {
    // localStorage can be unavailable in private mode; progress is non-critical.
  }
}

export function markVerbDropAnswer(
  progress: Record<string, VerbDropProgress>,
  verbId: string,
  isCorrect: boolean
): Record<string, VerbDropProgress> {
  const current = progress[verbId] || {
    verbId,
    seen: 0,
    correct: 0,
    wrong: 0,
    level: 0 as const,
    lastSeenAt: new Date().toISOString(),
  };

  const nextLevel = isCorrect
    ? Math.min(5, current.level + 1)
    : Math.max(0, current.level - 1);

  const next: VerbDropProgress = {
    ...current,
    seen: current.seen + 1,
    correct: current.correct + (isCorrect ? 1 : 0),
    wrong: current.wrong + (isCorrect ? 0 : 1),
    level: nextLevel as VerbDropProgress["level"],
    lastSeenAt: new Date().toISOString(),
  };

  const updated = { ...progress, [verbId]: next };
  saveVerbDropsProgress(updated);
  return updated;
}

export function getWeakVerbIds(progress: Record<string, VerbDropProgress>): string[] {
  return Object.values(progress)
    .filter((item) => item.wrong > 0 && item.level < 4)
    .sort((a, b) => b.wrong - a.wrong || a.level - b.level)
    .map((item) => item.verbId);
}
