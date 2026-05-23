import { useState, useCallback, useEffect } from "react";
import { LearningProgress, DailyStats } from "@/types/verb";

const STORAGE_KEY = "hebrew_learning_progress";
const STATS_KEY = "hebrew_daily_stats";

function todayIso(): string {
  return new Date().toISOString().split("T")[0];
}

function safeGetItem(key: string): string | null {
  try {
    return window.localStorage.getItem(key);
  } catch (error) {
    console.warn(`Failed to read ${key}`, error);
    return null;
  }
}

function safeSetItem(key: string, value: string) {
  try {
    window.localStorage.setItem(key, value);
  } catch (error) {
    console.warn(`Failed to save ${key}`, error);
  }
}

function loadProgress(): Record<string, LearningProgress> {
  try {
    const data = safeGetItem(STORAGE_KEY);
    return data ? JSON.parse(data) : {};
  } catch (error) {
    console.warn("Failed to parse learning progress", error);
    return {};
  }
}

function saveProgress(progress: Record<string, LearningProgress>) {
  safeSetItem(STORAGE_KEY, JSON.stringify(progress));
}

function loadStats(): DailyStats {
  const today = todayIso();
  try {
    const data = safeGetItem(STATS_KEY);
    if (data) {
      const stats = JSON.parse(data) as DailyStats;
      if (stats.date === today) return stats;
      const yesterday = new Date(Date.now() - 86400000).toISOString().split("T")[0];
      return {
        date: today,
        newLearned: 0,
        reviewed: 0,
        streak: stats.date === yesterday ? stats.streak : 0,
      };
    }
  } catch (error) {
    console.warn("Failed to parse daily stats", error);
  }
  return { date: today, newLearned: 0, reviewed: 0, streak: 0 };
}

function saveStats(stats: DailyStats) {
  safeSetItem(STATS_KEY, JSON.stringify(stats));
}

export function useLearning() {
  const [progress, setProgress] = useState<Record<string, LearningProgress>>(loadProgress);
  const [stats, setStats] = useState<DailyStats>(loadStats);

  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY) setProgress(loadProgress());
      if (e.key === STATS_KEY) setStats(loadStats());
    };
    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  const markCorrect = useCallback((verbId: string) => {
    setProgress((prev) => {
      const existing = prev[verbId] || { verbId, level: 0, nextReview: "", correctCount: 0, wrongCount: 0 };
      const newLevel = Math.min(existing.level + 1, 5);
      const days = [1, 3, 7, 14, 30][newLevel - 1] || 1;
      const nextReview = new Date(Date.now() + days * 86400000).toISOString();
      const updated = {
        ...prev,
        [verbId]: {
          ...existing,
          level: newLevel,
          nextReview,
          lastReview: new Date().toISOString(),
          correctCount: existing.correctCount + 1,
        },
      };
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
      const updated = {
        ...prev,
        [verbId]: {
          ...existing,
          level: Math.max(0, existing.level - 1),
          nextReview: new Date(Date.now() + 86400000).toISOString(),
          lastReview: new Date().toISOString(),
          wrongCount: existing.wrongCount + 1,
        },
      };
      saveProgress(updated);
      return updated;
    });
  }, []);

  const markLearned = useCallback((verbId: string) => {
    const wasAlreadyLearned = (progress[verbId]?.level || 0) >= 1;
    setProgress((prev) => {
      const existing = prev[verbId] || { verbId, level: 0, nextReview: "", correctCount: 0, wrongCount: 0 };
      const updated = {
        ...prev,
        [verbId]: {
          ...existing,
          level: Math.max(existing.level, 1),
          nextReview: new Date(Date.now() + 86400000).toISOString(),
          lastReview: new Date().toISOString(),
        },
      };
      saveProgress(updated);
      return updated;
    });
    if (!wasAlreadyLearned) {
      setStats((prev) => {
        const updated = { ...prev, newLearned: prev.newLearned + 1 };
        saveStats(updated);
        return updated;
      });
    }
  }, [progress]);

  const learnedCount = Object.values(progress).filter((p) => p.level >= 1).length;
  const masteredCount = Object.values(progress).filter((p) => p.level >= 5).length;

  return { progress, stats, markCorrect, markWrong, markLearned, learnedCount, masteredCount };
}
