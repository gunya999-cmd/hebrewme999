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
    <nav className="fixed bottom-0 left-0 right-0 z-50 px-3 pb-3 pointer-events-none">
      <div className="pointer-events-auto mx-auto flex h-16 max-w-xl items-center justify-around rounded-[1.6rem] border border-white/70 bg-white/90 shadow-2xl shadow-slate-900/10 backdrop-blur-xl">
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
              className="relative flex min-w-0 flex-1 flex-col items-center justify-center gap-0.5 py-1 px-1 transition-colors"
            >
              {isActive && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute -top-2 left-1/2 h-1.5 w-9 -translate-x-1/2 rounded-full bg-primary shadow-lg shadow-primary/30"
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                />
              )}
              <tab.icon
                className={`w-5 h-5 transition-colors ${isActive ? "text-primary" : "text-muted-foreground"}`}
              />
              <span
                className={`text-[9px] font-black transition-colors ${isActive ? "text-primary" : "text-muted-foreground"}`}
              >
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
