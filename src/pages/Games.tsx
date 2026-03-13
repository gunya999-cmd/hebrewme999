import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Brain, PenLine, Puzzle, Layers } from "lucide-react";

const games = [
  {
    id: "guess-form",
    title: "Угадай форму",
    desc: "Выбери правильную форму глагола",
    icon: Brain,
    color: "bg-primary/10 text-primary",
    path: "/games/guess-form",
  },
  {
    id: "write-form",
    title: "Напиши форму",
    desc: "Напиши форму глагола по заданию",
    icon: PenLine,
    color: "bg-success/10 text-success",
    path: "/games/guess-form",
  },
  {
    id: "guess-root",
    title: "Угадай корень",
    desc: "Определи корень глагола",
    icon: Puzzle,
    color: "bg-streak/10 text-streak",
    path: "/games/guess-form",
  },
  {
    id: "guess-binyan",
    title: "Угадай беньян",
    desc: "К какому беньяну относится глагол?",
    icon: Layers,
    color: "bg-destructive/10 text-destructive",
    path: "/games/guess-form",
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
