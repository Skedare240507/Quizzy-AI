"use client";

import { Sidebar } from "@/components/Sidebar";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ArrowRight, FileUp, Loader2, FileText, X, Sparkles, Wand2, Minus, Plus, ClipboardPaste } from "lucide-react";
import { useState, useRef, useCallback } from "react";
import { generateContent } from "@/app/actions";
import { motion, AnimatePresence } from "framer-motion";
import { ContactForm } from "@/components/ContactForm";
import { cn } from "@/lib/utils";
import Image from "next/image";

export default function Home() {
  const [selectedSize, setSelectedSize] = useState(10);
  const [mode, setMode] = useState<"quiz" | "flashcard">("quiz");
  const [notes, setNotes] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const removeFile = (e: React.MouseEvent) => {
    e.stopPropagation();
    setFile(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const onDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const onDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const droppedFile = e.dataTransfer.files[0];
      const validTypes = [".pdf", ".docx", ".txt"];
      const extension = "." + droppedFile.name.split(".").pop()?.toLowerCase();
      if (validTypes.includes(extension)) {
        setFile(droppedFile);
      } else {
        alert("Please drop a PDF, DOCX, or TXT file.");
      }
    }
  }, []);

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      setNotes(text);
    } catch (err) {
      alert("Please allow clipboard access or use Ctrl+V manually.");
    }
  };

  const handleSubmit = async () => {
    if (!notes.trim() && !file) {
      alert("Please provide some notes or upload a file first!");
      return;
    }
    setIsLoading(true);
    try {
      const formData = new FormData();
      formData.append("notes", notes);
      formData.append("mode", mode);
      formData.append("size", selectedSize.toString());
      if (file) formData.append("file", file);

      await generateContent(formData);
    } catch (error: any) {
      console.error("Generation failed:", error);
      alert(`Error: ${error.message || "Failed to generate. Please check your API key and connection."}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex h-screen bg-background overflow-hidden selection:bg-primary/20">
      <Sidebar className="hidden md:flex" />

      <main className="flex-1 flex flex-col items-center justify-center p-6 md:p-12 overflow-y-auto bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-primary/5 via-background to-background relative font-sans">

        <div className="absolute top-6 right-8 z-10 flex items-center gap-4">
          <ContactForm />
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="w-full max-w-4xl text-center mb-6 flex flex-col items-center"
        >
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="mb-8 w-40 sm:w-56 md:w-64 flex justify-center items-center"
          >
            <Image
              src="/logo.svg"
              alt="Logo"
              width={300}
              height={300}
              quality={100}
              priority
              className="object-contain drop-shadow-2xl w-full h-auto max-h-[160px]"
            />
          </motion.div>
          <h1 className="text-6xl md:text-7xl font-black mb-4 tracking-tighter bg-clip-text text-transparent bg-gradient-to-b from-foreground to-foreground/50">
            Quizzy AI
          </h1>
          <p className="text-lg text-muted-foreground font-medium max-w-xl mx-auto leading-relaxed opacity-80">
            Intelligent study material generation. One click, infinite learning.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.7 }}
          className="w-full max-w-5xl"
        >
          <Card className="w-full border-none shadow-[0_48px_80px_-16px_rgba(0,0,0,0.15)] p-6 md:p-10 bg-card/60 backdrop-blur-3xl rounded-[3rem] relative overflow-hidden ring-1 ring-border/50">

            {isLoading && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="absolute inset-0 bg-background/95 backdrop-blur-2xl z-50 flex items-center justify-center"
              >
                <div className="flex flex-col items-center gap-10">
                  <div className="relative">
                    <motion.div
                      animate={{ rotate: 360, scale: [1, 1.2, 1] }}
                      transition={{ rotate: { duration: 2, repeat: Infinity, ease: "linear" }, scale: { duration: 1.5, repeat: Infinity } }}
                      className="w-24 h-24 border-4 border-primary border-t-transparent rounded-full"
                    />
                    <Sparkles className="w-10 h-10 text-primary absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-pulse" />
                  </div>
                  <div className="text-center space-y-3">
                    <h3 className="font-black text-4xl tracking-tighter">Analyzing Core Text</h3>
                    <p className="text-muted-foreground font-bold flex items-center gap-2 justify-center italic opacity-60">
                      <Wand2 className="w-5 h-5" /> Shaping your session format...
                    </p>
                  </div>
                </div>
              </motion.div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-5 gap-10 items-stretch relative z-10">
              {/* Left side: Notes input (3/5) */}
              <div className="lg:col-span-3 flex flex-col gap-6">
                <div
                  className={cn(
                    "relative flex-1 min-h-[300px] transition-all duration-700 rounded-[2.5rem] group bg-secondary/10 hover:bg-secondary/20 ring-1 ring-border/50 shadow-inner",
                    isDragging && "bg-primary/5 ring-4 ring-primary/30"
                  )}
                  onDragOver={onDragOver}
                  onDragLeave={onDragLeave}
                  onDrop={onDrop}
                >
                  <div className="h-full flex flex-col p-8">
                    <div className="flex items-center justify-between mb-6 opacity-40">
                      <div className="flex items-center gap-3">
                        <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                        <span className="font-black text-[10px] uppercase tracking-[0.3em]">Knowledge Input</span>
                      </div>
                      <button
                        onClick={handlePaste}
                        className="flex items-center gap-2 px-3 py-1 bg-primary/10 rounded-full hover:bg-primary/20 transition-all font-black text-[9px] text-primary tracking-widest uppercase"
                      >
                        <ClipboardPaste className="w-3 h-3" />
                        Auto Paste
                      </button>
                    </div>

                    <Textarea
                      className="flex-1 bg-transparent border-none shadow-none focus-visible:ring-0 resize-none p-0 text-xl font-semibold placeholder:text-muted-foreground/30 leading-snug tracking-tight"
                      placeholder="Paste text or drag files here..."
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                    />

                    <div className="mt-6">
                      <AnimatePresence mode="wait">
                        {file ? (
                          <motion.div
                            initial={{ x: -20, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            className="flex items-center"
                          >
                            <div className="flex items-center gap-4 px-5 py-2.5 bg-primary text-primary-foreground rounded-2xl shadow-xl shadow-primary/30 group/file">
                              <FileText className="w-5 h-5" />
                              <span className="text-sm font-black max-w-[220px] truncate">{file.name}</span>
                              <button
                                onClick={removeFile}
                                className="ml-2 hover:bg-white/20 p-1.5 rounded-xl transition-all active:scale-90"
                              >
                                <X className="w-5 h-5" />
                              </button>
                            </div>
                          </motion.div>
                        ) : (
                          <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="flex items-center gap-6"
                          >
                            <input
                              type="file"
                              ref={fileInputRef}
                              onChange={handleFileChange}
                              className="hidden"
                              accept=".pdf,.docx,.txt"
                            />
                            <Button
                              variant="outline"
                              onClick={() => fileInputRef.current?.click()}
                              className="h-14 px-8 rounded-2xl border-2 border-primary/20 bg-background hover:bg-primary hover:text-primary-foreground transition-all font-black text-[10px] uppercase tracking-[0.2em] gap-3 shadow-xl hover:shadow-primary/20"
                            >
                              <FileUp className="w-5 h-5" />
                              Upload
                            </Button>
                            <p className="text-[9px] text-muted-foreground font-black uppercase tracking-[0.2em] opacity-30 hidden sm:block">PDF • DOCX • TXT</p>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right side: Session Settings (2/5) */}
              <div className="lg:col-span-2 flex flex-col justify-between py-2">
                <div className="space-y-8">
                  {/* Batch Size */}
                  <div className="space-y-4">
                    <p className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground/60">Batch Size</p>
                    <div className="p-6 rounded-[2rem] bg-secondary/40 border border-border/50 shadow-inner group/size">
                      <div className="flex items-center justify-between">
                        <button
                          onClick={() => setSelectedSize(Math.max(1, selectedSize - 1))}
                          suppressHydrationWarning
                          className="w-10 h-10 rounded-xl bg-background border-2 border-border/30 flex items-center justify-center hover:bg-primary hover:text-white transition-all active:scale-90 disabled:opacity-30"
                          disabled={selectedSize <= 1}
                        >
                          <Minus className="w-5 h-5" />
                        </button>
                        <div className="text-center">
                          <motion.span
                            key={selectedSize}
                            initial={{ scale: 0.8 }}
                            animate={{ scale: 1 }}
                            className="text-5xl font-black tracking-tight"
                          >
                            {selectedSize}
                          </motion.span>
                        </div>
                        <button
                          onClick={() => setSelectedSize(Math.min(10, selectedSize + 1))}
                          suppressHydrationWarning
                          className="w-10 h-10 rounded-xl bg-background border-2 border-border/30 flex items-center justify-center hover:bg-primary hover:text-white transition-all active:scale-90 disabled:opacity-30"
                          disabled={selectedSize >= 10}
                        >
                          <Plus className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <p className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground/60">Session Engine</p>
                    <div className="grid grid-cols-1 gap-3">
                      {[
                        { id: "quiz", label: "Dynamic Quiz" },
                        { id: "flashcard", label: "3D Flashcards" }
                      ].map((item) => (
                        <button
                          key={item.id}
                          onClick={() => setMode(item.id as any)}
                          className={cn(
                            "group flex flex-col items-start p-5 rounded-[2rem] border-2 transition-all relative overflow-hidden",
                            mode === item.id
                              ? "bg-primary text-primary-foreground border-primary shadow-xl shadow-primary/20 scale-[1.02] z-10"
                              : "bg-secondary/20 border-transparent hover:border-primary/20"
                          )}
                        >
                          <span className="font-black text-xl tracking-tighter">{item.label}</span>
                          {mode === item.id && (
                            <motion.div
                              layoutId="active-bg"
                              className="absolute inset-0 bg-gradient-to-tr from-white/10 to-transparent pointer-events-none"
                            />
                          )}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="mt-8">
                  <Button
                    onClick={handleSubmit}
                    disabled={(!notes.trim() && !file) || isLoading}
                    className="w-full h-20 rounded-[2.5rem] shadow-xl shadow-primary/30 text-2xl font-black gap-4 hover:translate-y-[-4px] active:translate-y-[2px] transition-all bg-primary"
                  >
                    <span>Unleash AI</span>
                    <ArrowRight className="w-6 h-6" />
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        </motion.div>
      </main>
    </div>
  );
}
