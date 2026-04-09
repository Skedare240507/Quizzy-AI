"use client";

import { ScoreCircle } from "@/components/ScoreCircle";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { CheckCircle2, Home, RefreshCcw } from "lucide-react";
import Link from "next/link";

const mockReview = [
  { question: "What is capital of france?", answer: "Paris" },
  { question: "Which planet is known as the Red Planet?", answer: "Mars" },
  { question: "What is the largest ocean on Earth?", answer: "Pacific" },
];

export default function ResultsPage() {
  return (
    <div className="min-h-screen bg-background p-6 md:p-12 max-w-4xl mx-auto flex flex-col">
      <header className="mb-12">
        <Link href="/">
          <Button variant="outline" className="border-2 rounded-xl px-6 h-12 font-bold">
            <Home className="w-4 h-4 mr-2" />
            Home
          </Button>
        </Link>
      </header>

      <main className="flex-1 space-y-16">
        <section className="flex flex-col items-center">
          <ScoreCircle score={8} total={10} />
        </section>

        <section className="space-y-4">
          <h3 className="text-xl font-bold px-2 mb-6">Review Questions</h3>
          {mockReview.map((item, i) => (
            <Card key={i} className="p-6 border-2 shadow-none rounded-2xl bg-card/50">
              <div className="flex gap-4 items-start">
                <CheckCircle2 className="w-6 h-6 text-green-500 mt-1 shrink-0" />
                <div className="space-y-2">
                  <p className="text-lg font-semibold">{item.question}</p>
                  <div className="bg-secondary/40 px-4 py-2 rounded-xl inline-block border bg-green-500/5 border-green-500/10">
                    <p className="text-sm text-muted-foreground mr-2 inline">Review:</p>
                    <span className="font-bold text-green-600 dark:text-green-400">correct answer is {item.answer}</span>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </section>
      </main>

      <footer className="mt-16 flex justify-center pb-8">
        <Link href="/quiz">
          <Button className="h-16 px-12 rounded-2xl text-xl font-bold shadow-xl hover:scale-105 transition-transform">
            <RefreshCcw className="w-6 h-6 mr-3" />
            Retry Quiz
          </Button>
        </Link>
      </footer>
    </div>
  );
}
