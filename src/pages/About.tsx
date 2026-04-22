import { ArrowRight, Code2, Heart } from "lucide-react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

const developers = [
  { hebrew: "גאורגי גורביץ'", russian: "Георгий Гуревич" },
  { hebrew: "לודמילה גורביץ'", russian: "Людмила Гуревич" },
  { hebrew: "מיכאל גורביץ'", russian: "Михаил Гуревич" },
  { hebrew: "ניקיטה גורביץ'", russian: "Никита Гуревич" },
];

export default function About() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <div className="bg-primary px-6 pt-12 pb-8 rounded-b-[2rem]">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-1 text-primary-foreground/70 mb-4"
        >
          <ArrowRight className="w-5 h-5 rotate-180" />
          <span className="text-sm font-medium">Назад</span>
        </button>
        <h1 className="text-2xl font-black text-primary-foreground">מפתחים</h1>
        <p className="text-primary-foreground/70 text-sm font-medium mt-1">Разработчики приложения</p>
      </div>

      {/* Developers */}
      <div className="px-6 mt-6 space-y-3">
        {developers.map((dev, i) => (
          <motion.div
            key={dev.russian}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-card rounded-2xl p-5 shadow-sm border border-border flex items-center gap-4"
          >
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
              <Code2 className="w-6 h-6 text-primary" />
            </div>
            <div>
              <p className="font-hebrew text-xl font-bold text-foreground" dir="rtl">{dev.hebrew}</p>
              <p className="text-sm text-muted-foreground">{dev.russian}</p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Footer */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="px-6 mt-8 text-center"
      >
        <p className="text-muted-foreground text-sm flex items-center justify-center gap-1">
          נוצר באהבה <Heart className="w-4 h-4 text-destructive inline" /> Создано с любовью
        </p>
      </motion.div>
    </div>
  );
}