"use client";

import { ScoreCircle } from "@/components/ScoreCircle";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { CheckCircle2, Home, RefreshCcw, Loader2, XCircle, AlertCircle } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useState, useEffect, Suspense } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

function ResultsContent() {
  const searchParams = useSearchParams();
  const [score, setScore] = useState(0);
  const [total, setTotal] = useState(10);
  const [review, setReview] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const s = searchParams.get("score");
    const t = searchParams.get("total");
    const r = searchParams.get("review");

    if (s) setScore(parseInt(s));
    if (t) setTotal(parseInt(t));
    if (r) {
      try {
        setReview(JSON.parse(decodeURIComponent(r)));
      } catch (e) {
        console.error("Failed to parse review data", e);
      }
    }
    setIsLoading(false);
  }, [searchParams]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-12 h-12 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-6 md:p-12 max-w-4xl mx-auto flex flex-col">
      <header className="mb-12">
        <Link href="/">
          <Button variant="outline" className="border-2 rounded-xl px-6 h-12 font-bold hover:bg-secondary transition-all">
            <Home className="w-4 h-4 mr-2" />
            Go Home
          </Button>
        </Link>
      </header>

      <main className="flex-1 space-y-16">
        <motion.section 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex flex-col items-center"
        >
          <ScoreCircle score={score} total={total} />
          <p className="mt-8 text-3xl font-black text-center tracking-tighter">
            {score === total ? "Perfect Session! 🏆" : score > total / 2 ? "Impressive Work! ✨" : "Good Attempt! 🚀"}
          </p>
          <p className="text-muted-foreground font-bold mt-2 opacity-60">You scored {score} out of {total} correctly.</p>
        </motion.section>

        <section className="space-y-8">
          <div className="flex items-center justify-between px-2">
            <h3 className="text-xs font-black uppercase tracking-[0.3em] text-muted-foreground/60">Performance Review</h3>
            <div className="flex gap-4">
               <div className="flex items-center gap-1.5">
                  <div className="w-2 h-2 rounded-full bg-green-500" />
                  <span className="text-[10px] font-black uppercase opacity-60">Correct</span>
               </div>
               <div className="flex items-center gap-1.5">
                  <div className="w-2 h-2 rounded-full bg-red-500" />
                  <span className="text-[10px] font-black uppercase opacity-60">Incorrect</span>
               </div>
            </div>
          </div>

          <div className="grid gap-6">
            {review.map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
              >
                <Card className={cn(
                  "p-8 border-none shadow-[0_8px_30px_rgb(0,0,0,0.04)] rounded-[2.5rem] bg-card/40 backdrop-blur-md relative overflow-hidden ring-1",
                  item.isCorrect ? "ring-green-500/20" : "ring-red-500/20"
                )}>
                  <div className="flex gap-6 items-start relative z-10">
                    <div className={cn(
                      "w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 shadow-lg",
                      item.isCorrect ? "bg-green-500/10 text-green-500 shadow-green-500/10" : "bg-red-500/10 text-red-500 shadow-red-500/10"
                    )}>
                      {item.isCorrect ? <CheckCircle2 className="w-6 h-6" /> : <XCircle className="w-6 h-6" />}
                    </div>
                    <div className="space-y-4 flex-1">
                      <p className="text-xl font-bold leading-tight tracking-tight">{item.question}</p>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-4">
                        <div className={cn(
                          "px-5 py-3 rounded-2xl border flex flex-col gap-1",
                          item.isCorrect ? "bg-green-500/5 border-green-500/10" : "bg-red-500/5 border-red-500/10"
                        )}>
                          <span className="text-[9px] font-black uppercase tracking-widest opacity-40">Your Answer</span>
                          <span className="font-bold text-sm">{item.userAnswer}</span>
                        </div>
                        
                        {!item.isCorrect && (
                          <div className="px-5 py-3 rounded-2xl bg-primary/5 border border-primary/10 flex flex-col gap-1">
                            <span className="text-[9px] font-black uppercase tracking-widest text-primary opacity-60">Correct Answer</span>
                            <span className="font-bold text-sm">{item.correctAnswer}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </section>
      </main>

      <footer className="mt-20 flex justify-center pb-12">
        <Link href="/">
          <Button className="h-20 px-14 rounded-[2.5rem] text-xl font-black shadow-[0_20px_50px_rgba(0,0,0,0.2)] shadow-primary/30 hover:translate-y-[-4px] transition-all active:translate-y-[2px] gap-4 bg-primary">
            <RefreshCcw className="w-6 h-6" />
            Create New Session
          </Button>
        </Link>
      </footer>
    </div>
  );
}

export default function ResultsPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><Loader2 className="w-12 h-12 animate-spin text-primary" /></div>}>
      <ResultsContent />
    </Suspense>
  );
}
