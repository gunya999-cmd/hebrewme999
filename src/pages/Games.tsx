import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Brain, PenLine, Puzzle, Layers, BookOpen } from "lucide-react";

const games = [
  {
    id: "guess-form",
    title: "Угадай форму",
    desc: "Выбери правильную форму глагола из 4 вариантов",
    icon: Brain,
    color: "bg-primary/10 text-primary",
    path: "/games/guess-form",
  },
  {
    id: "write-form",
    title: "Напиши форму",
    desc: "Напечатай форму глагола на иврите вручную",
    icon: PenLine,
    color: "bg-success/10 text-success",
    path: "/games/write-form",
  },
  {
    id: "guess-root",
    title: "Угадай корень",
    desc: "Определи трёхбуквенный корень глагола",
    icon: Puzzle,
    color: "bg-streak/10 text-streak",
    path: "/games/guess-root",
  },
  {
    id: "guess-binyan",
    title: "Угадай биньян",
    desc: "К какому биньяну относится глагол?",
    icon: Layers,
    color: "bg-destructive/10 text-destructive",
    path: "/games/guess-binyan",
  },
  {
    id: "prep-fill",
    title: "Вставь предлог",
    desc: "Вставь правильный предлог в предложение на иврите",
    icon: BookOpen,
    color: "bg-accent/20 text-accent-foreground",
    path: "/games/prep-fill",
  },
];

export default function Games() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background pb-20 px-4 pt-8">
      <h1 className="text-2xl font-black text-foreground mb-6">Игры</h1>
      <div className="grid grid-cols-2 gap-3">
        {games.map((game, i) => (
          <motion.button
            key={game.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate(game.path)}
            className="bg-card rounded-2xl p-4 text-left border border-border shadow-sm"
          >
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${game.color}`}>
              <game.icon className="w-5 h-5" />
            </div>
            <p className="font-bold text-foreground text-sm">{game.title}</p>
            <p className="text-xs text-muted-foreground mt-1">{game.desc}</p>
          </motion.button>
        ))}
      </div>
    </div>
  );
}