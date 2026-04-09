"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, RefreshCw } from "lucide-react";

interface FlashcardProps {
  front: string;
  back: string;
}

export function Flashcard({ front, back }: FlashcardProps) {
  const [isFlipped, setIsFlipped] = useState(false);

  return (
    <div 
      className="perspective-1000 w-full max-w-2xl mx-auto h-[400px] cursor-pointer group"
      onClick={() => setIsFlipped(!isFlipped)}
    >
      <motion.div
        className="relative w-full h-full preserve-3d transition-all duration-700"
        initial={false}
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        transition={{ type: "spring", stiffness: 260, damping: 20 }}
      >
        {/* Front Side */}
        <Card className="absolute inset-0 w-full h-full backface-hidden flex flex-col items-center justify-center p-12 text-center bg-gradient-to-br from-card to-secondary/20 border-4 border-primary/10 rounded-[2.5rem] shadow-2xl group-hover:shadow-primary/5 transition-shadow overflow-hidden">
          <div className="absolute top-6 left-6 text-primary/20">
             <Sparkles className="w-8 h-8" />
          </div>
          
          <motion.p 
            className="text-3xl md:text-4xl font-black leading-tight bg-clip-text text-transparent bg-gradient-to-br from-foreground to-foreground/70"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            {front}
          </motion.p>
          
          <div className="mt-auto flex flex-col items-center gap-2">
            <div className="px-4 py-1.5 rounded-full bg-primary/10 text-primary text-[10px] font-black uppercase tracking-widest animate-pulse">
              Click to reveal answer
            </div>
            <RefreshCw className="w-5 h-5 text-muted-foreground/30" />
          </div>
        </Card>

        {/* Back Side */}
        <Card 
          className="absolute inset-0 w-full h-full backface-hidden flex flex-col items-center justify-center p-10 text-center bg-primary border-4 border-primary/20 rounded-[2.5rem] shadow-2xl overflow-hidden"
          style={{ transform: "rotateY(180deg)" }}
        >
          {/* Decorative background shape */}
          <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-white/5 rounded-full blur-3xl" />
          
          <motion.div 
            className="relative z-10 w-full"
            initial={{ opacity: 0 }}
            animate={{ opacity: isFlipped ? 1 : 0 }}
            transition={{ delay: 0.2 }}
          >
            <p className="text-xl md:text-2xl font-bold text-primary-foreground leading-relaxed">
              {back}
            </p>
          </motion.div>

          <div className="mt-auto z-10">
            <div className="px-4 py-1.5 rounded-full bg-white/10 text-white/80 text-[10px] font-black uppercase tracking-widest">
              Back to term
            </div>
          </div>
        </Card>
      </motion.div>
    </div>
  );
}
