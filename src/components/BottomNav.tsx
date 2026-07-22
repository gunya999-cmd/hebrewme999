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
    <nav className="pointer-events-none fixed inset-x-0 bottom-0 z-50 px-3 pb-[max(12px,env(safe-area-inset-bottom))] xl:inset-y-0 xl:left-0 xl:right-auto xl:flex xl:w-24 xl:items-center xl:px-3 xl:py-6">
      <div className="pointer-events-auto mx-auto flex h-16 max-w-xl items-center justify-around rounded-[1.6rem] border border-white/70 bg-white/92 shadow-2xl shadow-slate-900/10 backdrop-blur-xl md:h-20 md:max-w-2xl md:rounded-[2rem] md:px-3 xl:mx-0 xl:h-auto xl:w-full xl:flex-col xl:gap-2 xl:rounded-[2rem] xl:bg-slate-950/95 xl:p-2 xl:shadow-[0_24px_60px_rgba(15,23,42,0.28)]">
        <div className="hidden h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-500 to-cyan-300 text-xl font-black text-white xl:flex">
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
              className="relative flex min-w-0 flex-1 flex-col items-center justify-center gap-0.5 px-1 py-1 transition-colors md:gap-1 md:px-2 xl:h-16 xl:w-full xl:flex-none xl:rounded-2xl xl:px-2 xl:py-2"
            >
              {isActive && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute -top-2 left-1/2 h-1.5 w-9 -translate-x-1/2 rounded-full bg-primary shadow-lg shadow-primary/30 md:-top-2.5 md:w-11 xl:inset-y-2 xl:left-0 xl:top-auto xl:h-auto xl:w-1.5 xl:translate-x-0 xl:bg-cyan-300 xl:shadow-cyan-300/30"
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                />
              )}
              <tab.icon className={`h-5 w-5 transition-colors md:h-6 md:w-6 xl:h-6 xl:w-6 ${isActive ? "text-primary xl:text-cyan-200" : "text-muted-foreground xl:text-white/45"}`} />
              <span className={`text-[9px] font-black transition-colors md:text-[11px] xl:text-[10px] ${isActive ? "text-primary xl:text-white" : "text-muted-foreground xl:text-white/45"}`}>
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
