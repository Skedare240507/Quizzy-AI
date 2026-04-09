"use client";

import { Sidebar } from "@/components/Sidebar";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ArrowRight, FileUp, Loader2, FileText } from "lucide-react";
import { useState, useRef } from "react";
import { generateContent } from "@/app/actions";

export default function Home() {
  const [selectedSize] = useState(10); // Forced to 10 as per rules
  const [mode, setMode] = useState<"quiz" | "flashcard">("quiz");
  const [notes, setNotes] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = async () => {
    if (!notes.trim() && !file) return;
    setIsLoading(true);
    try {
      const formData = new FormData();
      formData.append("notes", notes);
      formData.append("mode", mode);
      if (file) formData.append("file", file);
      
      await generateContent(formData);
    } catch (error) {
      console.error("Generation failed:", error);
      alert("Failed to generate. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      <Sidebar className="hidden md:flex" />

      <main className="flex-1 flex flex-col items-center justify-center p-6 md:p-12 overflow-y-auto">
        <div className="w-full max-w-4xl text-center mb-12">
          <h1 className="text-5xl md:text-6xl font-black mb-2 tracking-tight">
            Quizzy AI
          </h1>
          <p className="text-xl text-muted-foreground font-medium">
            Learn any topic with fun
          </p>
        </div>

        <Card className="w-full max-w-3xl border-2 shadow-none p-6 md:p-8 bg-card rounded-[2rem] relative">
          {isLoading && (
            <div className="absolute inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center rounded-[2rem]">
              <div className="flex flex-col items-center gap-4">
                <Loader2 className="w-12 h-12 text-primary animate-spin" />
                <p className="font-bold text-xl">Generating with AI...</p>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch">
            {/* Left side: Input area */}
            <div className="flex flex-col gap-4">
              <div className="relative group flex-1">
                <div className="absolute inset-0 border-2 border-dashed border-muted-foreground/20 rounded-2xl group-hover:border-primary/30 transition-colors pointer-events-none" />
                <div className="bg-secondary/10 rounded-2xl h-[280px] flex flex-col items-stretch p-4">
                  <Textarea 
                    className="flex-1 bg-transparent border-none shadow-none focus-visible:ring-0 resize-none p-2 text-lg" 
                    placeholder="Paste your notes here..."
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                  />
                  <div className="mt-2 flex items-center justify-between px-2 pb-2">
                    <input 
                      type="file" 
                      ref={fileInputRef}
                      onChange={handleFileChange}
                      className="hidden"
                      accept=".pdf,.docx,.txt"
                    />
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="gap-2 text-muted-foreground hover:text-primary"
                      onClick={() => fileInputRef.current?.click()}
                    >
                      <FileUp className="w-4 h-4" />
                      {file ? file.name : "Upload PDF/DOCX"}
                    </Button>
                    {file && (
                      <div className="flex items-center gap-1 text-xs text-primary font-bold">
                        <FileText className="w-3 h-3" />
                        READY
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Right side: Controls */}
            <div className="flex flex-col justify-between py-2">
              <div className="space-y-6">
                <div className="space-y-3">
                  <p className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Quiz Size</p>
                  <div className="flex gap-3">
                    {[8, 10, 12].map((size) => (
                      <Button
                        key={size}
                        variant={size === 10 ? "default" : "outline"}
                        disabled={size !== 10}
                        className="flex-1 h-12 rounded-xl text-lg font-bold border-2"
                      >
                        {size}
                      </Button>
                    ))}
                  </div>
                  <p className="text-[10px] text-muted-foreground text-center">Locked to 10 for consistency</p>
                </div>

                <div className="space-y-4">
                  <p className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Select Mode</p>
                  <div className="grid grid-cols-2 gap-3">
                    <Button
                      variant={mode === "quiz" ? "default" : "outline"}
                      className="h-14 rounded-xl text-lg font-bold border-2"
                      onClick={() => setMode("quiz")}
                    >
                      Quiz
                    </Button>
                    <Button
                      variant={mode === "flashcard" ? "default" : "outline"}
                      className="h-14 rounded-xl text-lg font-bold border-2"
                      onClick={() => setMode("flashcard")}
                    >
                      Flash card
                    </Button>
                  </div>
                </div>
              </div>

              <div className="flex justify-end mt-8">
                <Button 
                  onClick={handleSubmit}
                  disabled={(!notes.trim() && !file) || isLoading}
                  className="w-16 h-16 rounded-full shadow-lg hover:scale-105 transition-transform"
                >
                  <ArrowRight className="w-8 h-8" />
                </Button>
              </div>
            </div>
          </div>
        </Card>
      </main>
    </div>
  );
}
