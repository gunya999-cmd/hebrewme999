import { useState, useCallback } from "react";
import { LearningProgress, DailyStats } from "@/types/verb";
import { SEED_VERBS } from "@/data/verbs";

const STORAGE_KEY = "hebrew_learning_progress";
const STATS_KEY = "hebrew_daily_stats";

function loadProgress(): Record<string, LearningProgress> {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : {};
  } catch { return {}; }
}
function saveProgress(p: Record<string, LearningProgress>) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(p));
}
function loadStats(): DailyStats {
  try {
    const data = localStorage.getItem(STATS_KEY);
    if (data) {
      const s = JSON.parse(data) as DailyStats;
      const today = new Date().toISOString().split("T")[0];
      if (s.date === today) return s;
      const yesterday = new Date(Date.now() - 86400000).toISOString().split("T")[0];
      return { date: today, newLearned: 0, reviewed: 0, streak: s.date === yesterday ? s.streak + 1 : 1 };
    }
  } catch {}
  return { date: new Date().toISOString().split("T")[0], newLearned: 0, reviewed: 0, streak: 1 };
}
function saveStats(s: DailyStats) { localStorage.setItem(STATS_KEY, JSON.stringify(s)); }

const SRS_INTERVALS = [1, 3, 7, 14, 30];

export function useLearning() {
  const [progress, setProgress] = useState<Record<string, LearningProgress>>(loadProgress);
  const [stats, setStats] = useState<DailyStats>(loadStats);

  const markCorrect = useCallback((verbId: string) => {
    setProgress((prev) => {
      const ex = prev[verbId] || { verbId, level: 0, nextReview: "", correctCount: 0, wrongCount: 0 };
      const newLevel = Math.min(ex.level + 1, 5);
      const days = SRS_INTERVALS[newLevel - 1] || 1;
      const updated = { ...prev, [verbId]: { ...ex, level: newLevel, nextReview: new Date(Date.now() + days * 86400000).toISOString(), lastReview: new Date().toISOString(), correctCount: ex.correctCount + 1 } };
      saveProgress(updated);
      return updated;
    });
    setStats((prev) => {
      const updated = { ...prev, reviewed: prev.reviewed + 1 };
      saveStats(updated);
      return updated;
    });
  }, []);

  const markWrong = useCallback((verbId: string) => {
    setProgress((prev) => {
      const ex = prev[verbId] || { verbId, level: 0, nextReview: "", correctCount: 0, wrongCount: 0 };
      const updated = { ...prev, [verbId]: { ...ex, level: Math.max(0, ex.level - 1), nextReview: new Date(Date.now() + 86400000).toISOString(), lastReview: new Date().toISOString(), wrongCount: ex.wrongCount + 1 } };
      saveProgress(updated);
      return updated;
    });
  }, []);

  const markLearned = useCallback((verbId: string) => {
    setProgress((prev) => {
      const ex = prev[verbId] || { verbId, level: 0, nextReview: "", correctCount: 0, wrongCount: 0 };
      const updated = { ...prev, [verbId]: { ...ex, level: 1, nextReview: new Date(Date.now() + 86400000).toISOString(), lastReview: new Date().toISOString() } };
      saveProgress(updated);
      return updated;
    });
    setStats((prev) => { const u = { ...prev, newLearned: prev.newLearned + 1 }; saveStats(u); return u; });
  }, []);

  const getDueVerbs = useCallback(() => {
    const now = new Date().toISOString();
    const withConj = SEED_VERBS.filter((v) => v.conjugations);
    const due = withConj.filter((v) => {
      const p = progress[v.id];
      return !p || p.level === 0 || p.nextReview <= now;
    });
    return due.length >= 5 ? due : withConj;
  }, [progress]);

  const getDueCount = useCallback(() => {
    const now = new Date().toISOString();
    return SEED_VERBS.filter((v) => {
      const p = progress[v.id];
      return !p || p.level === 0 || p.nextReview <= now;
    }).length;
  }, [progress]);

  const learnedCount = Object.values(progress).filter((p) => p.level >= 1).length;
  const masteredCount = Object.values(progress).filter((p) => p.level >= 5).length;

  return { progress, stats, markCorrect, markWrong, markLearned, getDueVerbs, getDueCount, learnedCount, masteredCount };
}
