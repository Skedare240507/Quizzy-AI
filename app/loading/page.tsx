"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { Loader2 } from "lucide-react";

export default function LoadingPage() {
  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-6">
      <div className="w-full max-w-2xl space-y-8 flex flex-col items-center animate-in fade-in zoom-in duration-300">
        <div className="flex flex-col items-center gap-4 text-center">
          <div className="relative">
            <Loader2 className="w-16 h-16 text-primary animate-spin" />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-2 h-2 bg-primary rounded-full" />
            </div>
          </div>
          <h2 className="text-3xl font-black tracking-tight">Generating your AI Quiz...</h2>
          <p className="text-muted-foreground font-medium">Sit back while we process your notes.</p>
        </div>

        <div className="w-full space-y-4">
          <Skeleton className="h-48 w-full rounded-[2rem] border-2" />
          <div className="grid grid-cols-2 gap-4">
            <Skeleton className="h-20 w-full rounded-xl border-2" />
            <Skeleton className="h-20 w-full rounded-xl border-2" />
            <Skeleton className="h-20 w-full rounded-xl border-2" />
            <Skeleton className="h-20 w-full rounded-xl border-2" />
          </div>
        </div>
      </div>
    </div>
  );
}
