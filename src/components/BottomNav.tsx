import { useLanguage } from "@/lib/i18n";
import { BookOpen, Bot, Gamepad2, Home, Sparkles } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";

const tabs = [
  { path: "/", icon: Home, label: "Сегодня" },
  { path: "/dictionary", icon: BookOpen, label: "Глаголы" },
  { path: "/games/verb-drops", icon: Sparkles, label: "Практика" },
  { path: "/games", icon: Gamepad2, label: "Игры" },
  { path: "/ai-tutor", icon: Bot, label: "Ракель" },
];

function activeTab(path: string, tab: string): boolean {
  if (tab === "/") return path === "/";
  if (tab === "/dictionary") return path.startsWith("/dictionary") || path.startsWith("/verb/");
  if (tab === "/games/verb-drops") return path.startsWith("/games/verb-drops");
  if (tab === "/games") return path.startsWith("/games") && !path.startsWith("/games/verb-drops");
  if (tab === "/ai-tutor") return path === "/ai-tutor" || path === "/voice-dialogue";
  return path.startsWith(tab);
}

export default function BottomNav() {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const { pathname } = useLocation();
  return (
    <nav aria-label={t("Основная навигация")} className="pointer-events-none fixed inset-x-0 bottom-0 z-50 px-2 pb-[max(8px,env(safe-area-inset-bottom))] xl:inset-y-0 xl:left-0 xl:right-auto xl:flex xl:w-24 xl:items-center xl:px-3 xl:py-6">
      <div className="pointer-events-auto mx-auto flex min-h-[70px] max-w-2xl items-stretch justify-between rounded-[1.5rem] border border-slate-200/90 bg-white/95 p-1 shadow-[0_12px_36px_rgba(30,41,59,0.17)] backdrop-blur-xl xl:w-full xl:flex-col xl:gap-2 xl:p-2">
        <span aria-hidden="true" className="hidden h-12 items-center justify-center rounded-xl bg-indigo-700 text-xl font-extrabold text-white xl:flex">H</span>
        {tabs.map(tab => {
          const selected = activeTab(pathname, tab.path);
          return (
            <button
              type="button"
              key={tab.path}
              onClick={() => navigate(tab.path)}
              aria-current={selected ? "page" : undefined}
              className={"flex min-h-[60px] min-w-0 flex-1 flex-col items-center justify-center gap-1 rounded-xl px-0.5 py-2 text-center transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 xl:min-h-[68px] xl:flex-none " + (selected ? "bg-indigo-50 text-indigo-800" : "text-slate-600 hover:bg-slate-50 hover:text-slate-950")}
            >
              <tab.icon aria-hidden="true" className="h-5 w-5 shrink-0 sm:h-6 sm:w-6" />
              <span className="text-[10px] font-bold leading-tight sm:text-xs">{t(tab.label)}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
