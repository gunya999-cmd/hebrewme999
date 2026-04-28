import { useState, useCallback } from "react";
import { LearningProgress, DailyStats } from "@/types/verb";

const STORAGE_KEY = "hebrew_learning_progress";
const STATS_KEY = "hebrew_daily_stats";

function loadProgress(): Record<string, LearningProgress> {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : {};
  } catch { return {}; }
}

function saveProgress(progress: Record<string, LearningProgress>) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
}

function loadStats(): DailyStats {
  try {
    const data = localStorage.getItem(STATS_KEY);
    if (data) {
      const stats = JSON.parse(data) as DailyStats;
      const today = new Date().toISOString().split("T")[0];
      if (stats.date === today) return stats;
      // New day — check streak
      const yesterday = new Date(Date.now() - 86400000).toISOString().split("T")[0];
      return {
        date: today,
        newLearned: 0,
        reviewed: 0,
        streak: stats.date === yesterday ? stats.streak + 1 : 0,
      };
    }
  } catch {}
  return { date: new Date().toISOString().split("T")[0], newLearned: 0, reviewed: 0, streak: 0 };
}

function saveStats(stats: DailyStats) {
  localStorage.setItem(STATS_KEY, JSON.stringify(stats));
}

export function useLearning() {
  const [progress, setProgress] = useState<Record<string, LearningProgress>>(loadProgress);
  const [stats, setStats] = useState<DailyStats>(loadStats);

  const markCorrect = useCallback((verbId: string) => {
    setProgress((prev) => {
      const existing = prev[verbId] || { verbId, level: 0, nextReview: "", correctCount: 0, wrongCount: 0 };
      const newLevel = Math.min(existing.level + 1, 5);
      const days = [1, 3, 7, 14, 30][newLevel - 1] || 1;
      const nextReview = new Date(Date.now() + days * 86400000).toISOString();
      const updated = { ...prev, [verbId]: { ...existing, level: newLevel, nextReview, lastReview: new Date().toISOString(), correctCount: existing.correctCount + 1 } };
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
      const existing = prev[verbId] || { verbId, level: 0, nextReview: "", correctCount: 0, wrongCount: 0 };
      const updated = { ...prev, [verbId]: { ...existing, level: Math.max(0, existing.level - 1), nextReview: new Date(Date.now() + 86400000).toISOString(), lastReview: new Date().toISOString(), wrongCount: existing.wrongCount + 1 } };
      saveProgress(updated);
      return updated;
    });
  }, []);

  const markLearned = useCallback((verbId: string) => {
    setProgress((prev) => {
      const existing = prev[verbId] || { verbId, level: 0, nextReview: "", correctCount: 0, wrongCount: 0 };
      const updated = { ...prev, [verbId]: { ...existing, level: 1, nextReview: new Date(Date.now() + 86400000).toISOString(), lastReview: new Date().toISOString() } };
      saveProgress(updated);
      return updated;
    });
    setStats((prev) => {
      const updated = { ...prev, newLearned: prev.newLearned + 1 };
      saveStats(updated);
      return updated;
    });
  }, []);

  const learnedCount = Object.values(progress).filter((p) => p.level >= 1).length;
  const masteredCount = Object.values(progress).filter((p) => p.level >= 5).length;

  return { progress, stats, markCorrect, markWrong, markLearned, learnedCount, masteredCount };
}
