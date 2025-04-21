
// Improved Hero Section with gradients, floating objects, and CTA

import { Button } from "@/components/ui/button";
import { ThemeProvider } from "@/components/theme-provider";
import { ThemeToggle } from "@/components/theme-toggle";
import { useNavigate } from "react-router-dom";
import { StickyNote, Sparkles, Brain, Brush } from "lucide-react";

export default function Index() {
  const navigate = useNavigate();

  return (
    <ThemeProvider>
      <div className="min-h-screen flex flex-col">
        {/* Hero Section */}
        <section className="relative flex-1 flex flex-col items-center justify-center bg-gradient-to-tr from-primary/40 to-secondary/80 py-32 px-4 text-center overflow-hidden">
          {/* Theme toggle in the top right */}
          <div className="absolute top-4 right-4 z-10">
            <ThemeToggle />
          </div>
          {/* Decorative background gradients/animated blobs */}
          <div className="absolute -top-20 -left-20 w-60 h-60 bg-gradient-to-br from-primary via-emerald-200 to-secondary rounded-full blur-2xl opacity-40 animate-float-bubble" />
          <div className="absolute bottom-0 right-0 w-64 h-64 bg-gradient-to-tr from-accent/60 via-secondary to-primary/30 rounded-full blur-2xl opacity-30 animate-float-bubble" style={{ animationDelay: "0.75s" }} />
          <div className="absolute top-12 left-1/2 -translate-x-1/2 bg-gradient-to-r from-primary to-pink-300/40 rounded-full h-32 w-64 blur-2xl opacity-40 animate-float-bubble" style={{ animationDelay: "1.2s" }} />
          {/* Animated Icons */}
          <Sparkles className="absolute top-36 left-10 text-primary w-12 h-12 opacity-70 animate-pulse" />
          <Brain className="absolute top-56 right-14 text-pink-400 w-9 h-9 animate-float-bubble" />
          <Brush className="absolute bottom-24 left-20 text-primary w-8 h-8 animate-float-bubble" style={{ animationDelay: "0.25s" }} />

          <div className="max-w-3xl mx-auto relative z-10">
            <h1 className="text-6xl md:text-7xl font-extrabold text-gradient-primary mb-6 drop-shadow-lg">LucidNote</h1>
            <p className="text-2xl md:text-3xl mb-8 text-foreground/80 font-light tracking-tight">
              AI-Powered Notes & Creativity Platform
              <span className="block text-lg md:text-xl text-muted-foreground mt-2">Declutter your mind. Summarize, doodle, remember.</span>
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
              <div className="glass-morphism rounded-lg p-6 shadow-lg hover-scale">
                <h3 className="text-lg font-semibold mb-2 flex items-center"><StickyNote className="mr-2 text-primary" /> Smart Notes</h3>
                <p className="text-muted-foreground">Organize, edit & AI-summarize your thoughts in seconds.</p>
              </div>
              <div className="glass-morphism rounded-lg p-6 shadow-lg hover-scale">
                <h3 className="text-lg font-semibold mb-2 flex items-center"><Brain className="mr-2 text-pink-500" /> AI Summaries</h3>
                <p className="text-muted-foreground">Instantly generate concise highlights for long notes.</p>
              </div>
              <div className="glass-morphism rounded-lg p-6 shadow-lg hover-scale">
                <h3 className="text-lg font-semibold mb-2 flex items-center"><Brush className="mr-2 text-blue-400" /> Creative Canvas</h3>
                <p className="text-muted-foreground">Freehand draw, brainstorm, and visualize ideas anywhere.</p>
              </div>
            </div>
            <Button 
              size="lg" 
              className="text-lg px-8 py-6 shadow-md hover-scale"
              onClick={() => navigate('/auth')}
            >
              Get Started — It's Free
            </Button>
          </div>
        </section>
      </div>
    </ThemeProvider>
  );
}
