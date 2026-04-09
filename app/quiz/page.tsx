"use client";

import { QuizQuestion } from "@/components/QuizQuestion";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { ChevronLeft, ChevronRight, Zap, Loader2 } from "lucide-react";
import { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";

function QuizContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [quizData, setQuizData] = useState<any[]>([]);
  const [answers, setAnswers] = useState<number[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadQuiz() {
      const id = searchParams.get("id");
      const dataRaw = searchParams.get("data");

      if (id) {
        const { getDbInternal } = await import("@/app/db-actions");
        const db = await getDbInternal();
        const session = db.history.find(s => s.id === id);
        if (session) {
          setQuizData(session.data);
          setAnswers(new Array(session.data.length).fill(-1));
          setIsLoading(false);
          return;
        }
      }

      if (dataRaw) {
        try {
          const parsed = JSON.parse(decodeURIComponent(dataRaw));
          setQuizData(parsed);
          setAnswers(new Array(parsed.length).fill(-1));
        } catch (e) {
          console.error("Failed to parse quiz data", e);
        }
      }
      setIsLoading(false);
    }
    loadQuiz();
  }, [searchParams]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-12 h-12 animate-spin text-primary" />
      </div>
    );
  }

  if (quizData.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <h2 className="text-2xl font-bold">No quiz data found</h2>
        <Link href="/">
          <Button>Go Back Home</Button>
        </Link>
      </div>
    );
  }

  const progress = ((currentIndex + 1) / quizData.length) * 100;

  const handleSelect = (optionIndex: number) => {
    const newAnswers = [...answers];
    newAnswers[currentIndex] = optionIndex;
    setAnswers(newAnswers);
  };

  const handleFinish = () => {
    let score = 0;
    const reviewData = quizData.map((q, i) => {
      const isCorrect = answers[i] === q.correctAnswer;
      if (isCorrect) score++;
      
      return {
        question: q.question,
        userAnswer: q.options[answers[i]],
        correctAnswer: q.options[q.correctAnswer],
        isCorrect: isCorrect
      };
    });
    
    const encodedReview = encodeURIComponent(JSON.stringify(reviewData));
    router.push(`/results?score=${score}&total=${quizData.length}&review=${encodedReview}`);
  };

  return (
    <div className="min-h-screen bg-background p-6 md:p-12 flex flex-col max-w-5xl mx-auto">
      <header className="flex items-center gap-6 mb-12">
        <div className="flex-1 space-y-2">
          <div className="flex justify-between text-sm font-bold uppercase tracking-wider text-muted-foreground">
            <span>Quiz Progress</span>
            <span>{currentIndex + 1} / {quizData.length}</span>
          </div>
          <Progress value={progress} className="h-3 border rounded-full" />
        </div>
        <Link href="/flashcard">
          <Button variant="outline" className="border-2 rounded-xl hidden sm:flex">
            <Zap className="w-4 h-4 mr-2" />
            Switch to Flashcards
          </Button>
        </Link>
      </header>

      <main className="flex-1 flex items-center justify-center">
        <QuizQuestion
          key={currentIndex}
          question={quizData[currentIndex].question}
          options={quizData[currentIndex].options}
          selectedIndex={answers[currentIndex]}
          onSelect={handleSelect}
        />
      </main>

      <footer className="mt-12 flex justify-between items-center">
        <Button
          variant="outline"
          className="h-14 px-8 border-2 rounded-xl text-lg font-bold hover:bg-secondary transition-all"
          disabled={currentIndex === 0}
          onClick={() => setCurrentIndex(currentIndex - 1)}
        >
          <ChevronLeft className="w-5 h-5 mr-2" />
          Previous
        </Button>

        {currentIndex === quizData.length - 1 ? (
          <Button 
            className="h-14 px-12 rounded-xl text-lg font-bold shadow-lg shadow-primary/20"
            onClick={handleFinish}
            disabled={answers.some(a => a === -1)}
          >
            Finish Quiz
          </Button>
        ) : (
          <Button
            variant="default"
            className="h-14 px-8 border-2 rounded-xl text-lg font-bold shadow-lg shadow-primary/20"
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

export default function QuizPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><Loader2 className="w-12 h-12 animate-spin text-primary" /></div>}>
      <QuizContent />
    </Suspense>
  );
}
