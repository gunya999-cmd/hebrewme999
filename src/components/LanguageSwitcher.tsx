import { useLocation } from "react-router-dom";
import { Globe2 } from "lucide-react";
import { languageNames, useLanguage, type AppLanguage } from "@/lib/i18n";

/** Available on every screen; explicitly LTR so the dropdown reads consistently. */
export default function LanguageSwitcher() {
  const { language, setLanguage, t } = useLanguage();
  const { pathname } = useLocation();
  const inVoiceDialogue = pathname === "/voice-dialogue";
  return (
    <div
      dir="ltr"
      className={"fixed right-3 z-[70] flex items-center gap-1.5 rounded-2xl border border-indigo-200 bg-white/95 px-2.5 py-2 text-slate-900 shadow-[0_6px_30px_rgba(30,41,59,0.18)] backdrop-blur-xl xl:bottom-auto xl:right-7 xl:top-7 " + (inVoiceDialogue ? "top-24" : "bottom-[calc(91px+env(safe-area-inset-bottom))]")}
    >
      <Globe2 aria-hidden="true" className="h-4 w-4 shrink-0 text-indigo-700" />
      <label htmlFor="app-language" className="sr-only">{t("Язык приложения")}</label>
      <select
        id="app-language"
        aria-label={t("Язык приложения")}
        value={language}
        onChange={event => setLanguage(event.target.value as AppLanguage)}
        className="min-h-8 max-w-[100px] cursor-pointer rounded-lg bg-transparent px-1 text-sm font-bold text-indigo-900 outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
      >
        {(Object.keys(languageNames) as AppLanguage[]).map(code => (
          <option key={code} value={code}>{languageNames[code]}</option>
        ))}
      </select>
    </div>
  );
}
