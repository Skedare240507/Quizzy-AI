"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription,
  DialogTrigger 
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useState } from "react";
import { Mail, MessageSquare, Send, CheckCircle2, Loader2, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { sendContactEmail } from "@/app/contact-action";

const formSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  subject: z.string().min(5, "Subject must be at least 5 characters"),
  message: z.string().min(10, "Message must be at least 10 characters"),
});

type FormValues = z.infer<typeof formSchema>;

export function ContactForm() {
  const [isOpen, setIsOpen] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: { name: "", email: "", subject: "", message: "" },
  });

  async function onSubmit(values: FormValues) {
    setIsLoading(true);
    try {
      const result = await sendContactEmail(values);
      if (result.success) {
        setIsSuccess(true);
        setTimeout(() => {
          setIsOpen(false);
          setIsSuccess(false);
          form.reset();
        }, 3000);
      } else {
        alert("Failed to send: " + result.error);
      }
    } catch (error) {
      alert("Something went wrong. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <button className="flex items-center gap-2 text-primary font-black text-[10px] uppercase tracking-[0.2em] hover:opacity-70 transition-opacity">
          <MessageSquare className="w-3.5 h-3.5" />
          Support & Feedback
        </button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px] p-0 overflow-hidden rounded-[2.5rem] bg-card/95 backdrop-blur-2xl border-none shadow-[0_32px_80px_-16px_rgba(0,0,0,0.3)]">
        <AnimatePresence mode="wait">
          {!isSuccess ? (
            <motion.div 
              key="form"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="p-8 pb-10"
            >
              <DialogHeader className="mb-8">
                <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary mb-4">
                   <Mail className="w-6 h-6" />
                </div>
                <DialogTitle className="text-3xl font-black tracking-tighter">Get in Touch</DialogTitle>
                <DialogDescription className="font-bold text-muted-foreground opacity-60">
                  Have a bug or a feature request? Let our team know.
                </DialogDescription>
              </DialogHeader>

              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-[10px] uppercase font-black tracking-widest opacity-40">Your Name</FormLabel>
                          <FormControl>
                            <Input placeholder="Sahil..." {...field} className="bg-secondary/40 border-none rounded-2xl h-12 font-bold px-4" />
                          </FormControl>
                          <FormMessage className="text-[10px]" />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-[10px] uppercase font-black tracking-widest opacity-40">Email Address</FormLabel>
                          <FormControl>
                            <Input placeholder="hello@site.com" {...field} className="bg-secondary/40 border-none rounded-2xl h-12 font-bold px-4" />
                          </FormControl>
                          <FormMessage className="text-[10px]" />
                        </FormItem>
                      )}
                    />
                  </div>
                  <FormField
                    control={form.control}
                    name="subject"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-[10px] uppercase font-black tracking-widest opacity-40">Subject</FormLabel>
                        <FormControl>
                          <Input placeholder="How can we help?" {...field} className="bg-secondary/40 border-none rounded-2xl h-12 font-bold px-4" />
                        </FormControl>
                        <FormMessage className="text-[10px]" />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="message"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-[10px] uppercase font-black tracking-widest opacity-40">Detailed Note</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Tell us everything..." 
                            className="bg-secondary/40 border-none rounded-[1.5rem] min-h-[120px] font-bold px-4 py-3 resize-none"
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage className="text-[10px]" />
                      </FormItem>
                    )}
                  />
                  <Button 
                    type="submit" 
                    className="w-full h-14 rounded-2xl shadow-xl shadow-primary/20 text-md font-black gap-3 mt-4" 
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      <>
                        <Send className="w-5 h-5" />
                        Dispatch Message
                      </>
                    )}
                  </Button>
                </form>
              </Form>
            </motion.div>
          ) : (
            <motion.div 
              key="success"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex flex-col items-center justify-center py-20 px-8 text-center"
            >
              <div className="relative mb-8">
                 <motion.div 
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", damping: 10, stiffness: 100 }}
                    className="w-24 h-24 rounded-full bg-green-500/10 flex items-center justify-center text-green-500"
                 >
                    <CheckCircle2 className="w-12 h-12" />
                 </motion.div>
                 {[...Array(6)].map((_, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0 }}
                      animate={{ 
                        opacity: [0, 1, 0],
                        x: Math.cos(i * 60 * Math.PI / 180) * 100,
                        y: Math.sin(i * 60 * Math.PI / 180) * 100,
                        scale: [0, 1, 0]
                      }}
                      transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.1 }}
                      className="absolute top-1/2 left-1/2 text-primary"
                    >
                      <Sparkles className="w-4 h-4" />
                    </motion.div>
                 ))}
              </div>
              <h3 className="text-3xl font-black tracking-tighter mb-2">Message Sent!</h3>
              <p className="font-bold text-muted-foreground opacity-60 max-w-[280px]">
                Thank you for reaching out. Our team will review your message immediately.
              </p>
              <motion.div 
                 initial={{ width: 0 }}
                 animate={{ width: "100%" }}
                 transition={{ duration: 3 }}
                 className="h-1 bg-green-500/30 w-full mt-10 rounded-full"
              />
            </motion.div>
          )}
        </AnimatePresence>
      </DialogContent>
    </Dialog>
  );
}
