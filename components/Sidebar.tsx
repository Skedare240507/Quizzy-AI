"use client";

import { History, UserCircle, LayoutDashboard } from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";

const mockHistory = [
  "Quantum Computing Basics",
  "World War II Summary",
  "Photosynthesis Process",
  "React Hooks Guide",
];

export function Sidebar({ className }: { className?: string }) {
  const pathname = usePathname();

  return (
    <div className={cn("flex flex-col h-full bg-card border-r w-64 p-4", className)}>
      <div className="flex items-center gap-2 mb-8 px-2">
        <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
          <LayoutDashboard className="w-5 h-5 text-primary-foreground" />
        </div>
        <span className="font-bold text-xl">Quizzy AI</span>
      </div>

      <div className="flex-1 overflow-y-auto">
        <div className="flex items-center gap-2 mb-4 px-2 text-muted-foreground font-medium">
          <History className="w-4 h-4" />
          <span>History</span>
        </div>
        <div className="space-y-1">
          {mockHistory.map((item, i) => (
            <div
              key={i}
              className="px-3 py-2 text-sm rounded-md hover:bg-secondary cursor-pointer transition-colors truncate"
            >
              {item}
            </div>
          ))}
        </div>
      </div>

      <div className="mt-auto border-t pt-4">
        <div className="flex items-center gap-3 px-2 py-2 hover:bg-secondary rounded-md cursor-pointer transition-colors">
          <UserCircle className="w-6 h-6" />
          <span className="text-sm font-medium">Account</span>
        </div>
      </div>
    </div>
  );
}
