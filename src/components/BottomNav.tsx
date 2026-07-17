import { Home, BookOpen, Gamepad2, Bot, Sparkles } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";

const tabs = [
  { path: "/", icon: Home, label: "Сегодня" },
  { path: "/dictionary", icon: BookOpen, label: "Глаголы" },
  { path: "/games/verb-drops", icon: Sparkles, label: "Глаголопад" },
  { path: "/games", icon: Gamepad2, label: "Игры" },
  { path: "/ai-tutor", icon: Bot, label: "Мирьям" },
];

export default function BottomNav() {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <nav className="pointer-events-none fixed inset-x-0 bottom-0 z-50 px-3 pb-3 lg:inset-y-0 lg:left-0 lg:right-auto lg:flex lg:w-24 lg:items-center lg:px-3 lg:py-6">
      <div className="pointer-events-auto mx-auto flex h-16 max-w-xl items-center justify-around rounded-[1.6rem] border border-white/70 bg-white/92 shadow-2xl shadow-slate-900/10 backdrop-blur-xl lg:mx-0 lg:h-auto lg:w-full lg:flex-col lg:gap-2 lg:rounded-[2rem] lg:bg-slate-950/95 lg:p-2 lg:shadow-[0_24px_60px_rgba(15,23,42,0.28)]">
        <div className="hidden h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-500 to-cyan-300 text-xl font-black text-white lg:flex">
          H
        </div>
        {tabs.map((tab) => {
          const isActive =
            tab.path === "/"
              ? location.pathname === "/"
              : tab.path === "/games"
                ? location.pathname === "/games"
                : location.pathname.startsWith(tab.path);

          return (
            <button
              key={tab.path}
              onClick={() => navigate(tab.path)}
              className="relative flex min-w-0 flex-1 flex-col items-center justify-center gap-0.5 px-1 py-1 transition-colors lg:h-16 lg:w-full lg:flex-none lg:rounded-2xl lg:px-2 lg:py-2"
            >
              {isActive && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute -top-2 left-1/2 h-1.5 w-9 -translate-x-1/2 rounded-full bg-primary shadow-lg shadow-primary/30 lg:inset-y-2 lg:left-0 lg:top-auto lg:h-auto lg:w-1.5 lg:translate-x-0 lg:bg-cyan-300 lg:shadow-cyan-300/30"
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                />
              )}
              <tab.icon className={`h-5 w-5 transition-colors lg:h-6 lg:w-6 ${isActive ? "text-primary lg:text-cyan-200" : "text-muted-foreground lg:text-white/45"}`} />
              <span className={`text-[9px] font-black transition-colors lg:text-[10px] ${isActive ? "text-primary lg:text-white" : "text-muted-foreground lg:text-white/45"}`}>
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
