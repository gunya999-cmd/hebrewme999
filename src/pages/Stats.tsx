import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, BarChart3 } from "lucide-react";
import { motion } from "framer-motion";
import { SEED_VERBS } from "@/data/verbs";
import { BINYAN_NAMES, Binyan } from "@/types/verb";
import { useLearning } from "@/hooks/useLearning";

const SRS_LEVELS = [
  { level: 0, label: "Новый", color: "bg-muted" },
  { level: 1, label: "Ур. 1", color: "bg-primary/30" },
  { level: 2, label: "Ур. 2", color: "bg-primary/50" },
  { level: 3, label: "Ур. 3", color: "bg-success/40" },
  { level: 4, label: "Ур. 4", color: "bg-success/60" },
  { level: 5, label: "Выучен", color: "bg-success" },
];

export default function Stats() {
  const navigate = useNavigate();
  const { progress, learnedCount, masteredCount } = useLearning();

  const binyanStats = useMemo(() => {
    const allBinyanim = Object.keys(BINYAN_NAMES) as Binyan[];
    return allBinyanim.map((b) => {
      const verbs = SEED_VERBS.filter((v) => v.binyan === b);
      const learned = verbs.filter((v) => progress[v.id]?.level >= 1).length;
      const mastered = verbs.filter((v) => progress[v.id]?.level >= 5).length;
      return { binyan: b, name: BINYAN_NAMES[b], total: verbs.length, learned, mastered };
    });
  }, [progress]);

  const levelDistribution = useMemo(() => {
    return SRS_LEVELS.map((l) => {
      const count = l.level === 0
        ? SEED_VERBS.length - Object.values(progress).filter((p) => p.level >= 1).length
        : Object.values(progress).filter((p) => p.level === l.level).length;
      return { ...l, count };
    });
  }, [progress]);

  const totalErrors = useMemo(() => {
    return Object.values(progress).reduce((sum, p) => sum + p.wrongCount, 0);
  }, [progress]);

  const totalCorrect = useMemo(() => {
    return Object.values(progress).reduce((sum, p) => sum + p.correctCount, 0);
  }, [progress]);

  const accuracy = totalCorrect + totalErrors > 0 ? Math.round((totalCorrect / (totalCorrect + totalErrors)) * 100) : 0;

  return (
    <div className="min-h-screen bg-background pb-20 px-4 pt-8">
      <div className="flex items-center gap-3 mb-6">
        <button onClick={() => navigate("/")} className="text-muted-foreground">
          <ArrowLeft className="w-6 h-6" />
        </button>
        <h1 className="text-2xl font-black text-foreground">Статистика</h1>
      </div>

      {/* Overview */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
        className="bg-card border border-border rounded-2xl p-5 mb-4">
        <div className="flex items-center gap-2 mb-4">
          <BarChart3 className="w-5 h-5 text-primary" />
          <p className="text-sm font-semibold text-foreground">Общий прогресс</p>
        </div>
        <div className="grid grid-cols-4 gap-3">
          <div className="text-center">
            <p className="text-2xl font-black text-foreground">{SEED_VERBS.length}</p>
            <p className="text-xs text-muted-foreground">Всего</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-black text-primary">{learnedCount}</p>
            <p className="text-xs text-muted-foreground">Изучено</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-black text-success">{masteredCount}</p>
            <p className="text-xs text-muted-foreground">Выучено</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-black text-foreground">{accuracy}%</p>
            <p className="text-xs text-muted-foreground">Точность</p>
          </div>
        </div>
      </motion.div>

      {/* Level Distribution */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
        className="bg-card border border-border rounded-2xl p-5 mb-4">
        <p className="text-sm font-semibold text-foreground mb-3">Распределение по уровням SRS</p>
        <div className="space-y-2">
          {levelDistribution.map((l) => (
            <div key={l.level} className="flex items-center gap-3">
              <span className="text-xs font-bold text-muted-foreground w-16">{l.label}</span>
              <div className="flex-1 bg-muted rounded-full h-4 overflow-hidden">
                <div
                  className={`h-full rounded-full ${l.color} transition-all`}
                  style={{ width: `${SEED_VERBS.length > 0 ? (l.count / SEED_VERBS.length) * 100 : 0}%` }}
                />
              </div>
              <span className="text-xs font-bold text-foreground w-8 text-right">{l.count}</span>
            </div>
          ))}
        </div>
      </motion.div>

      {/* By Binyan */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
        className="bg-card border border-border rounded-2xl p-5 mb-4">
        <p className="text-sm font-semibold text-foreground mb-3">По биньянам</p>
        <div className="space-y-3">
          {binyanStats.map((bs) => (
            <div key={bs.binyan}>
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-2">
                  <span className="font-hebrew font-bold text-primary">{bs.binyan}</span>
                  <span className="text-xs text-muted-foreground">{bs.name}</span>
                </div>
                <span className="text-xs font-bold text-foreground">{bs.learned}/{bs.total}</span>
              </div>
              <div className="bg-muted rounded-full h-2.5 overflow-hidden">
                <div
                  className="h-full bg-primary rounded-full transition-all"
                  style={{ width: `${bs.total > 0 ? (bs.learned / bs.total) * 100 : 0}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Errors */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
        className="bg-card border border-border rounded-2xl p-5">
        <p className="text-sm font-semibold text-foreground mb-3">Ответы</p>
        <div className="grid grid-cols-3 gap-3 text-center">
          <div>
            <p className="text-2xl font-black text-success">{totalCorrect}</p>
            <p className="text-xs text-muted-foreground">Правильных</p>
          </div>
          <div>
            <p className="text-2xl font-black text-destructive">{totalErrors}</p>
            <p className="text-xs text-muted-foreground">Ошибок</p>
          </div>
          <div>
            <p className="text-2xl font-black text-foreground">{totalCorrect + totalErrors}</p>
            <p className="text-xs text-muted-foreground">Всего</p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
