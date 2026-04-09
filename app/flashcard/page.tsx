"use client";

import { Flashcard } from "@/components/Flashcard";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, LayoutGrid } from "lucide-react";
import { useState } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";

const mockFlashcards = [
  { front: "Photosynthesis", back: "The process by which green plants and some other organisms use sunlight to synthesize foods from carbon dioxide and water." },
  { front: "Mitochondria", back: "An organelle found in large numbers in most cells, in which the biochemical processes of respiration and energy production occur." },
  { front: "DNA", back: "Deoxyribonucleic acid, a self-replicating material which is present in nearly all living organisms as the main constituent of chromosomes." },
  { front: "Atom", back: "The smallest constituent unit of ordinary matter that has the properties of a chemical element." },
  { front: "Entropy", back: "A thermodynamic quantity representing the unavailability of a system's thermal energy for conversion into mechanical work." },
  { front: "Gravity", back: "The force that attracts a body toward the center of the earth, or toward any other physical body having mass." },
  { front: "Evolution", back: "The process by which different kinds of living organisms are thought to have developed and diversified from earlier forms during the history of the earth." },
];

export default function FlashcardPage() {
  const [currentIndex, setCurrentIndex] = useState(0);

  return (
    <div className="min-h-screen bg-background p-6 md:p-12 flex flex-col max-w-5xl mx-auto">
      <header className="flex flex-col sm:flex-row items-center justify-between mb-8 sm:mb-16 gap-4">
        <div className="flex bg-secondary/30 p-1 rounded-2xl border-2 overflow-x-auto max-w-full no-scrollbar">
          <div className="flex gap-1 min-w-max">
            {mockFlashcards.map((_, i) => (
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
          <Button variant="outline" className="border-2 rounded-xl hidden sm:flex">
            <LayoutGrid className="w-4 h-4 mr-2" />
            Switch quiz
          </Button>
        </Link>
      </header>

      <main className="flex-1 flex items-center justify-center py-8">
        <Flashcard 
          key={currentIndex}
          front={mockFlashcards[currentIndex].front} 
          back={mockFlashcards[currentIndex].back} 
        />
      </main>

      <footer className="mt-12 flex justify-between items-center">
        <Button
          variant="outline"
          className="h-14 px-8 border-2 rounded-xl text-lg font-bold"
          disabled={currentIndex === 0}
          onClick={() => setCurrentIndex(currentIndex - 1)}
        >
          <ChevronLeft className="w-5 h-5 mr-2" />
          Prev
        </Button>

        <Button
          variant="default"
          className="h-14 px-8 border-2 rounded-xl text-lg font-bold"
          disabled={currentIndex === mockFlashcards.length - 1}
          onClick={() => setCurrentIndex(currentIndex + 1)}
        >
          Next
          <ChevronRight className="w-5 h-5 ml-2" />
        </Button>
      </footer>
    </div>
  );
}
