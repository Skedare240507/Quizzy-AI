"use client";

import { QuizQuestion } from "@/components/QuizQuestion";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { ChevronLeft, ChevronRight, Zap } from "lucide-react";
import { useState } from "react";
import Link from "next/link";

const mockQuizData = [
  {
    question: "What is the capital of France?",
    options: ["London", "Paris", "Berlin", "Madrid"],
  },
  {
    question: "Which planet is known as the Red Planet?",
    options: ["Venus", "Mars", "Jupiter", "Saturn"],
  },
  {
    question: "What is the largest ocean on Earth?",
    options: ["Atlantic", "Indian", "Arctic", "Pacific"],
  },
];

export default function QuizPage() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<number[]>(new Array(mockQuizData.length).fill(-1));

  const progress = ((currentIndex + 1) / mockQuizData.length) * 100;

  const handleSelect = (optionIndex: number) => {
    const newAnswers = [...answers];
    newAnswers[currentIndex] = optionIndex;
    setAnswers(newAnswers);
  };

  return (
    <div className="min-h-screen bg-background p-6 md:p-12 flex flex-col max-w-5xl mx-auto">
      <header className="flex items-center gap-6 mb-12">
        <div className="flex-1 space-y-2">
          <div className="flex justify-between text-sm font-bold uppercase tracking-wider text-muted-foreground">
            <span>Progress bar</span>
            <span>{currentIndex + 1} / {mockQuizData.length}</span>
          </div>
          <Progress value={progress} className="h-3 border" />
        </div>
        <Link href="/flashcard">
          <Button variant="outline" className="border-2 rounded-xl hidden sm:flex">
            <Zap className="w-4 h-4 mr-2" />
            Switch flash
          </Button>
        </Link>
      </header>

      <main className="flex-1 flex items-center justify-center">
        <QuizQuestion
          question={mockQuizData[currentIndex].question}
          options={mockQuizData[currentIndex].options}
          selectedIndex={answers[currentIndex]}
          onSelect={handleSelect}
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
          Previous
        </Button>

        {currentIndex === mockQuizData.length - 1 ? (
          <Link href="/results">
            <Button className="h-14 px-12 rounded-xl text-lg font-bold">
              Finish Quiz
            </Button>
          </Link>
        ) : (
          <Button
            variant="default"
            className="h-14 px-8 border-2 rounded-xl text-lg font-bold"
            onClick={() => setCurrentIndex(currentIndex + 1)}
          >
            Next
            <ChevronRight className="w-5 h-5 ml-2" />
          </Button>
        )}
      </footer>
    </div>
  );
}
