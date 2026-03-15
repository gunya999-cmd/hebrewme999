import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import BottomNav from "@/components/BottomNav";
import Home from "@/pages/Home";
import Dictionary from "@/pages/Dictionary";
import VerbDetail from "@/pages/VerbDetail";
import Games from "@/pages/Games";
import GuessFormGame from "@/pages/GuessFormGame";
import WriteFormGame from "@/pages/WriteFormGame";
import GuessRootGame from "@/pages/GuessRootGame";
import GuessBinyanGame from "@/pages/GuessBinyanGame";
import AITutor from "@/pages/AITutor";
import Stats from "@/pages/Stats";
import NotFound from "@/pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <div className="max-w-lg mx-auto relative">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/dictionary" element={<Dictionary />} />
            <Route path="/verb/:id" element={<VerbDetail />} />
            <Route path="/games" element={<Games />} />
            <Route path="/games/guess-form" element={<GuessFormGame />} />
            <Route path="/games/write-form" element={<WriteFormGame />} />
            <Route path="/games/guess-root" element={<GuessRootGame />} />
            <Route path="/games/guess-binyan" element={<GuessBinyanGame />} />
            <Route path="/ai-tutor" element={<AITutor />} />
            <Route path="/stats" element={<Stats />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
          <BottomNav />
        </div>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
