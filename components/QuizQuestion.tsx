"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface QuizQuestionProps {
  question: string;
  options: string[];
  selectedIndex?: number;
  onSelect: (index: number) => void;
}

export function QuizQuestion({
  question,
  options,
  selectedIndex,
  onSelect,
}: QuizQuestionProps) {
  const letters = ["A", "B", "C", "D"];

  return (
    <div className="w-full max-w-2xl mx-auto space-y-6">
      <Card className="p-8 min-h-[200px] flex items-center justify-center text-center shadow-none border-2">
        <h2 className="text-2xl font-semibold leading-tight">
          Q: {question}
        </h2>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {options.map((option, i) => (
          <Button
            key={i}
            variant="outline"
            className={cn(
              "h-20 text-lg justify-start px-6 border-2 transition-all hover:border-primary/50",
              selectedIndex === i && "border-primary bg-primary/5 ring-1 ring-primary"
            )}
            onClick={() => onSelect(i)}
          >
            <span className="font-bold mr-4">{letters[i]}.</span>
            {option}
          </Button>
        ))}
      </div>
    </div>
  );
}
