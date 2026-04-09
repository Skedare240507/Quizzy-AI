"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface FlashcardProps {
  front: string;
  back: string;
}

export function Flashcard({ front, back }: FlashcardProps) {
  const [isFlipped, setIsFlipped] = useState(false);

  return (
    <div
      className="relative w-full aspect-[4/3] md:aspect-[16/9] max-w-2xl mx-auto perspective-1000 cursor-pointer group"
      onClick={() => setIsFlipped(!isFlipped)}
    >
      <div
        className={cn(
          "relative w-full h-full transition-transform duration-500 preserve-3d",
          isFlipped && "rotate-y-180"
        )}
      >
        {/* Front */}
        <Card className="absolute inset-0 w-full h-full flex flex-col items-center justify-center p-8 text-center backface-hidden border-2 shadow-none">
          <p className="text-2xl font-medium mb-4">{front}</p>
          <p className="text-sm text-muted-foreground uppercase tracking-widest mt-auto">
            Tap to flip
          </p>
        </Card>

        {/* Back */}
        <Card className="absolute inset-0 w-full h-full flex flex-col items-center justify-center p-8 text-center backface-hidden rotate-y-180 border-2 shadow-none bg-secondary/30">
          <p className="text-2xl font-medium mb-4">{back}</p>
          <p className="text-sm text-muted-foreground uppercase tracking-widest mt-auto">
            Tap to flip
          </p>
        </Card>
      </div>
    </div>
  );
}
