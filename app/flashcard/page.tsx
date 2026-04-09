"use client";

import { Flashcard } from "@/components/Flashcard";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, LayoutGrid, Loader2 } from "lucide-react";
import { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { cn } from "@/lib/utils";

function FlashcardContent() {
  const searchParams = useSearchParams();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [flashcards, setFlashcards] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadFlashcards() {
      const id = searchParams.get("id");
      const dataRaw = searchParams.get("data");

      if (id) {
        const { getDbInternal } = await import("@/app/db-actions");
        const db = await getDbInternal();
        const session = db.history.find(s => s.id === id);
        if (session) {
          setFlashcards(session.data);
          setIsLoading(false);
          return;
        }
      }

      if (dataRaw) {
        try {
          const parsed = JSON.parse(decodeURIComponent(dataRaw));
          setFlashcards(parsed);
        } catch (e) {
          console.error("Failed to parse flashcard data", e);
        }
      }
      setIsLoading(false);
    }
    loadFlashcards();
  }, [searchParams]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-12 h-12 animate-spin text-primary" />
      </div>
    );
  }

  if (flashcards.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <h2 className="text-2xl font-bold">No flashcard data found</h2>
        <Link href="/">
          <Button>Go Back Home</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-6 md:p-12 flex flex-col max-w-5xl mx-auto">
      <header className="flex flex-col sm:flex-row items-center justify-between mb-8 sm:mb-16 gap-4">
        <div className="flex bg-secondary/30 p-1 rounded-2xl border-2 overflow-x-auto max-w-full no-scrollbar shadow-inner">
          <div className="flex gap-1 min-w-max">
            {flashcards.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentIndex(i)}
                className={cn(
                  "w-10 h-10 md:w-12 md:h-12 rounded-xl text-lg font-bold transition-all shrink-0",
                  currentIndex === i 
                    ? "bg-primary text-primary-foreground shadow-lg scale-110" 
                    : "hover:bg-secondary text-muted-foreground"
                )}
              >
                {i + 1}
              </button>
            ))}
          </div>
        </div>
        <Link href="/quiz">
          <Button variant="outline" className="border-2 rounded-xl hidden sm:flex hover:bg-secondary transition-all">
            <LayoutGrid className="w-4 h-4 mr-2" />
            Switch to Quiz
          </Button>
        </Link>
      </header>

      <main className="flex-1 flex items-center justify-center py-8">
        <Flashcard 
          key={currentIndex}
          front={flashcards[currentIndex].front} 
          back={flashcards[currentIndex].back} 
        />
      </main>

      <footer className="mt-12 flex justify-between items-center">
        <Button
          variant="outline"
          className="h-14 px-8 border-2 rounded-xl text-lg font-bold transition-all"
          disabled={currentIndex === 0}
          onClick={() => setCurrentIndex(currentIndex - 1)}
        >
          <ChevronLeft className="w-5 h-5 mr-2" />
          Previous
        </Button>

        <Button
          variant="default"
          className="h-14 px-8 border-2 rounded-xl text-lg font-bold shadow-lg shadow-primary/20 transition-all"
          disabled={currentIndex === flashcards.length - 1}
          onClick={() => setCurrentIndex(currentIndex + 1)}
        >
          Next
          <ChevronRight className="w-5 h-5 ml-2" />
        </Button>
      </footer>
    </div>
  );
}

export default function FlashcardPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><Loader2 className="w-12 h-12 animate-spin text-primary" /></div>}>
      <FlashcardContent />
    </Suspense>
  );
}
