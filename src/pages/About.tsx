import { useLanguage } from "@/lib/i18n";
import { ArrowLeft, BookOpen, Heart, UsersRound } from "lucide-react";
import { useNavigate } from "react-router-dom";

const creators = [
  { russian: "Георгий Гуревич", hebrew: "גאורגי גורביץ'", initial: "Г", english: "Georgy Gurevich" },
  { russian: "Людмила Гуревич", hebrew: "לודמילה גורביץ'", initial: "Л", english: "Lyudmila Gurevich" },
  { russian: "Михаил Гуревич", hebrew: "מיכאל גורביץ'", initial: "М", english: "Mikhail Gurevich" },
  { russian: "Никита Гуревич", hebrew: "ניקיטה גורביץ'", initial: "Н", english: "Nikita Gurevich" },
];

export default function About() {
  const { t, language } = useLanguage();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#f5f7fc] pb-28 text-slate-900">
      <div className="mx-auto max-w-5xl px-4 pt-6 sm:px-8 sm:pt-10">
        <nav aria-label={t("Навигация по разделу")} className="mb-6">
          <button
            type="button"
            onClick={() => navigate("/")}
            className="inline-flex min-h-11 items-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 text-sm font-bold text-slate-800 transition hover:border-indigo-300 hover:bg-indigo-50 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-indigo-300"
          >
            <ArrowLeft aria-hidden="true" className="h-4 w-4" />
            {t("На главную")}
          </button>
        </nav>

        <header className="overflow-hidden rounded-[2rem] bg-[#202750] px-6 py-8 text-white shadow-[0_18px_48px_rgba(27,37,79,0.15)] sm:px-10 sm:py-10">
          <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-xs font-bold text-indigo-100">
            <BookOpen aria-hidden="true" className="h-4 w-4" />
            {t("О приложении")}
          </span>
          <h1 className="mt-5 text-3xl font-extrabold leading-tight tracking-tight sm:text-4xl">
            {t("Создатели HebrewMe")}
          </h1>
          <p className="mt-3 max-w-xl text-base leading-relaxed text-indigo-100">
            {t("HebrewMe — семейный проект для изучения и практики иврита. Его создатели — семья Гуревич.")}
          </p>
          <span className="mt-6 inline-flex items-center gap-2 rounded-xl bg-white/10 px-4 py-2 text-sm font-bold text-white">
            <UsersRound aria-hidden="true" className="h-5 w-5 text-[#c8f96b]" />
            {t("Семья Гуревич")}
          </span>
        </header>

        <main className="mt-8" aria-labelledby="creators-heading">
          <div className="mb-4">
            <p className="text-xs font-extrabold uppercase tracking-[0.16em] text-indigo-700">{t("Наша команда")}</p>
            <h2 id="creators-heading" className="mt-1 text-2xl font-extrabold">{t("Создатели приложения")}</h2>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            {creators.map(creator => (
              <article
                key={language === "he" ? creator.hebrew : language === "en" ? creator.english : creator.russian}
                className="flex min-h-[116px] items-center gap-4 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm"
              >
                <span
                  aria-hidden="true"
                  className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-indigo-100 text-2xl font-extrabold text-indigo-800"
                >
                  {creator.initial}
                </span>
                <div className="min-w-0">
                  <h3 className="text-base font-extrabold leading-snug text-slate-950 sm:text-lg">
                    {creator.russian}
                  </h3>
                  <p dir={language === "he" ? "ltr" : "rtl"} lang={language === "he" ? "ru" : "he"} className="mt-1 w-fit max-w-full font-hebrew text-lg font-medium text-indigo-700">
                    {language === "he" ? creator.russian : creator.hebrew}
                  </p>
                </div>
              </article>
            ))}
          </div>
        </main>

        <footer className="mt-8 rounded-3xl border border-indigo-100 bg-white px-5 py-6 text-center">
          <p className="inline-flex items-center justify-center gap-2 text-sm font-semibold text-slate-700">
            <Heart aria-hidden="true" className="h-4 w-4 text-rose-600" />
            {t("Создано с любовью")}
          </p>
          <p className="mt-1 font-hebrew text-sm font-medium text-indigo-700" dir="rtl" lang="he">נוצר באהבה</p>
        </footer>
      </div>
    </div>
  );
}
