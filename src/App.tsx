import { lazy, Suspense } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import BottomNav from "@/components/BottomNav";
import ErrorBoundary from "@/components/ErrorBoundary";

const Home = lazy(() => import("@/pages/Home"));
const Dictionary = lazy(() => import("@/pages/Dictionary"));
const VerbDetail = lazy(() => import("@/pages/VerbDetail"));
const Games = lazy(() => import("@/pages/Games"));
const GuessFormGame = lazy(() => import("@/pages/GuessFormGame"));
const WriteFormGame = lazy(() => import("@/pages/WriteFormGame"));
const GuessRootGame = lazy(() => import("@/pages/GuessRootGame"));
const GuessBinyanGame = lazy(() => import("@/pages/GuessBinyanGame"));
const PrepFillGame = lazy(() => import("@/pages/PrepFillGame"));
const ConjugationVoice = lazy(() => import("@/pages/ConjugationVoice"));
const VerbDropsGame = lazy(() => import("@/pages/VerbDropsGame"));
const AITutor = lazy(() => import("@/pages/AITutor"));
const VoiceDialogue = lazy(() => import("@/pages/VoiceDialogue"));
const Prepositions = lazy(() => import("@/pages/Prepositions"));
const PrepDetail = lazy(() => import("@/pages/PrepDetail"));
const About = lazy(() => import("@/pages/About"));
const Vocabulary = lazy(() => import("@/pages/Vocabulary"));
const NotFound = lazy(() => import("@/pages/NotFound"));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 5 * 60 * 1000,
    },
  },
});

function AppFallback() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-6">
      <div className="text-center">
        <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-4 border-primary/20 border-t-primary" />
        <p className="text-sm font-semibold text-muted-foreground">HebrewMe загружается…</p>
      </div>
    </div>
  );
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <ErrorBoundary>
        <div className="max-w-lg mx-auto relative">
          <Suspense fallback={<AppFallback />}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/dictionary" element={<Dictionary />} />
              <Route path="/verb/:id" element={<VerbDetail />} />
              <Route path="/games" element={<Games />} />
              <Route path="/games/guess-form" element={<GuessFormGame />} />
              <Route path="/games/write-form" element={<WriteFormGame />} />
              <Route path="/games/guess-root" element={<GuessRootGame />} />
              <Route path="/games/guess-binyan" element={<GuessBinyanGame />} />
              <Route path="/games/prep-fill" element={<PrepFillGame />} />
              <Route path="/games/conjugation-voice" element={<ConjugationVoice />} />
              <Route path="/games/verb-drops" element={<VerbDropsGame />} />
              <Route path="/ai-tutor" element={<AITutor />} />
              <Route path="/voice-dialogue" element={<VoiceDialogue />} />
              <Route path="/prepositions" element={<Prepositions />} />
              <Route path="/preposition/:id" element={<PrepDetail />} />
              <Route path="/vocabulary" element={<Vocabulary />} />
              <Route path="/about" element={<About />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
          <BottomNav />
        </div>
        </ErrorBoundary>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
