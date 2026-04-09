"use client";

import { History, Search, PlusCircle, Clock, Zap } from "lucide-react";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";

import { ContactForm } from "./ContactForm";
import { ProfileDialog } from "./ProfileDialog";
import { getDbInternal } from "@/app/db-actions";

export function Sidebar({ className }: { className?: string }) {
  const [history, setHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const db = await getDbInternal();
        setHistory(db.history || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  return (
    <div className={cn("flex flex-col h-full bg-card/80 backdrop-blur-xl border-r border-border/50 w-72 p-6 transition-all", className)}>
      <div className="flex items-center gap-3 mb-10 px-2 group cursor-pointer">
        <div className="w-16 h-16 flex items-center justify-center group-hover:scale-110 transition-transform duration-500">
          <Image
            src="/logo.svg"
            alt="Quizzy Logo"
            width={80}
            height={80}
            className="object-contain w-full h-auto"
            priority
          />
        </div>
        <div className="flex flex-col text-left">
          <span className="font-black text-2xl tracking-tighter">Quizzy</span>
          <span className="text-[10px] font-black uppercase tracking-widest text-primary leading-none">Intelligence</span>
        </div>
      </div>

      <div className="space-y-6 flex-1 overflow-hidden flex flex-col">
        <div className="px-2">
          <div className="relative group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground transition-colors group-focus-within:text-primary" />
            <input
              placeholder="Search sessions..."
              className="w-full h-10 bg-secondary/30 rounded-xl pl-10 pr-4 text-xs font-bold focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all border border-transparent focus:border-primary/20"
            />
          </div>
        </div>

        <div className="flex-1 flex flex-col overflow-hidden">
          <div className="flex items-center justify-between mb-4 px-2">
            <div className="flex items-center gap-2 text-muted-foreground/60">
              <History className="w-4 h-4" />
              <span className="text-[10px] font-black uppercase tracking-widest">History Log</span>
            </div>
            <button className="p-1 hover:bg-secondary rounded-lg transition-colors">
              <PlusCircle className="w-4 h-4 text-muted-foreground/40" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto space-y-1 no-scrollbar pr-2 mr-[-8px]">
            {loading ? (
              <div className="p-4 text-center text-[10px] font-bold text-muted-foreground animate-pulse">Loading history...</div>
            ) : history.length === 0 ? (
              <div className="p-4 text-center text-[10px] font-bold text-muted-foreground opacity-40">No sessions yet.</div>
            ) : (
              history.map((item, i) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="group p-3 rounded-2xl hover:bg-secondary/50 cursor-pointer transition-all border border-transparent hover:border-border/50"
                  onClick={() => {
                    // In a real app, we'd navigate to the session
                    const target = item.type === "Quiz" ? "/quiz" : "/flashcard";
                    const encodedData = encodeURIComponent(JSON.stringify(item.data));
                    window.location.href = `${target}?data=${encodedData}`;
                  }}
                >
                  <div className="flex flex-col gap-1.5">
                    <span className="text-sm font-bold text-foreground/80 line-clamp-1 group-hover:text-primary transition-colors">
                      {item.title}
                    </span>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <Clock className="w-3 h-3 text-muted-foreground/40" />
                        <span className="text-[10px] font-bold text-muted-foreground/40 text-xs truncate max-w-[80px]">{item.date}</span>
                      </div>
                      <span className={cn(
                        "text-[9px] font-black px-2 py-0.5 rounded-full uppercase tracking-tighter",
                        item.type === "Quiz" ? "bg-primary/10 text-primary" : "bg-orange-500/10 text-orange-600"
                      )}>
                        {item.type}
                      </span>
                    </div>
                  </div>
                </motion.div>
              ))
            )}
          </div>
        </div>
      </div>

      <div className="mt-auto pt-6 border-t border-border/50 space-y-2">
        <ContactForm />

        <div className="p-4 bg-primary/5 rounded-[1.5rem] mb-4 border border-primary/10">
          <p className="text-[10px] font-black text-primary uppercase tracking-widest mb-1">Current Credits</p>
          <div className="flex items-end justify-between">
            <span className="text-2xl font-black">Unlimited</span>
            <span className="text-[10px] font-bold text-muted-foreground pb-1">BETA USAGE</span>
          </div>
        </div>

        <div className="px-2">
          <ProfileDialog />
        </div>
      </div>
    </div>
  );
}
