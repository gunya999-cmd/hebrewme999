import { Flame, Target, BookCheck, Sparkles, AlignJustify, Info, MessageCircle, Mic, GraduationCap } from "lucide-react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import ProgressCircle from "@/components/ProgressCircle";
import { useLearning } from "@/hooks/useLearning";
import { SEED_VERBS } from "@/data/verbs";

export default function Home() {
  const navigate = useNavigate();
  const { stats, learnedCount } = useLearning();
  const totalVerbs = SEED_VERBS.length;

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <div className="bg-primary px-6 pt-12 pb-8 rounded-b-[2rem]">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-black text-primary-foreground">Иврит Глаголы</h1>
            <p className="text-primary-foreground/70 text-sm font-medium">300 глаголов за 30 дней</p>
          </div>
          <div className="flex items-center gap-1 bg-primary-foreground/20 rounded-full px-3 py-1.5">
            <Flame className="w-5 h-5 text-streak" />
            <span className="text-primary-foreground font-bold text-lg">{stats.streak}</span>
          </div>
        </div>

        {/* Progress Circle */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
          className="flex justify-center"
        >
          <ProgressCircle current={learnedCount} total={totalVerbs} />
        </motion.div>
      </div>

      {/* Daily Stats */}
      <div className="px-6 -mt-4">
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="bg-card rounded-2xl shadow-lg p-5 grid grid-cols-3 gap-4"
        >
          <div className="text-center">
            <Sparkles className="w-5 h-5 mx-auto mb-1 text-primary" />
            <p className="text-2xl font-black text-foreground">{stats.newLearned}</p>
            <p className="text-xs text-muted-foreground font-medium">Новых</p>
          </div>
          <div className="text-center">
            <BookCheck className="w-5 h-5 mx-auto mb-1 text-success" />
            <p className="text-2xl font-black text-foreground">{stats.reviewed}</p>
            <p className="text-xs text-muted-foreground font-medium">Повторено</p>
          </div>
          <div className="text-center">
            <Target className="w-5 h-5 mx-auto mb-1 text-streak" />
            <p className="text-2xl font-black text-foreground">10</p>
            <p className="text-xs text-muted-foreground font-medium">Цель</p>
          </div>
        </motion.div>
      </div>

      {/* CTA Button */}
      <div className="px-6 mt-6">
        <motion.button
          whileTap={{ scale: 0.95 }}
          whileHover={{ scale: 1.02 }}
          onClick={() => navigate("/games/guess-form")}
          className="w-full bg-success text-success-foreground font-bold text-lg py-4 rounded-2xl shadow-lg shadow-success/30 active:shadow-md transition-shadow"
        >
          🎯 Начать урок
        </motion.button>
      </div>

      {/* Quick Actions */}
      <div className="px-6 mt-6 grid grid-cols-2 gap-3">
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate("/dictionary")}
          className="bg-card rounded-2xl p-4 shadow-sm text-left border border-border"
        >
          <BookCheck className="w-6 h-6 text-primary mb-2" />
          <p className="font-bold text-foreground text-sm">Словарь</p>
          <p className="text-xs text-muted-foreground">{totalVerbs} глаголов</p>
        </motion.button>
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate("/games")}
          className="bg-card rounded-2xl p-4 shadow-sm text-left border border-border"
        >
          <Sparkles className="w-6 h-6 text-streak mb-2" />
          <p className="font-bold text-foreground text-sm">Игры</p>
          <p className="text-xs text-muted-foreground">6 режимов</p>
        </motion.button>
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate("/prepositions")}
          className="bg-card rounded-2xl p-4 shadow-sm text-left border border-border"
        >
          <AlignJustify className="w-6 h-6 text-streak mb-2" />
          <p className="font-bold text-foreground text-sm">Предлоги</p>
          <p className="text-xs text-muted-foreground">20 предлогов</p>
        </motion.button>
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate("/ai-tutor")}
          className="bg-card rounded-2xl p-4 shadow-sm text-left border border-border"
        >
          <Mic className="w-6 h-6 text-primary mb-2" />
          <p className="font-bold text-foreground text-sm">AI Репетитор</p>
          <p className="text-xs text-muted-foreground">Мирьям — диалоги</p>
        </motion.button>
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate("/voice-dialogue")}
          className="bg-card rounded-2xl p-4 shadow-sm text-left border border-border"
        >
          <MessageCircle className="w-6 h-6 text-success mb-2" />
          <p className="font-bold text-foreground text-sm">Голосовой диалог</p>
          <p className="text-xs text-muted-foreground">Живое общение</p>
        </motion.button>
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate("/games/conjugation-voice")}
          className="bg-card rounded-2xl p-4 shadow-sm text-left border border-border"
        >
          <GraduationCap className="w-6 h-6 text-primary mb-2" />
          <p className="font-bold text-foreground text-sm">Спряжение голосом</p>
          <p className="text-xs text-muted-foreground">Тренажёр с Мирьям</p>
        </motion.button>
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate("/about")}
          className="bg-card rounded-2xl p-4 shadow-sm text-left border border-border col-span-2"
        >
          <Info className="w-6 h-6 text-primary mb-2" />
          <p className="font-bold text-foreground text-sm">О приложении</p>
          <p className="text-xs text-muted-foreground">Разработчики · Версия · Контакты</p>
        </motion.button>
      </div>
    </div>
  );
}
