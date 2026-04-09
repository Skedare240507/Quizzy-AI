"use client";

import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useState, useEffect } from "react";
import { UserCircle, Save, Loader2, Sparkles, Mail, User } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { saveProfile, getDb } from "@/lib/db";

export function ProfileDialog() {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [profile, setProfile] = useState({
    name: "Sahil",
    email: "sahil@example.com",
    bio: "AI Learning Enthusiast"
  });

  // Since lib/db is server-side (fs), we need to handle this via a server action or simpler fetch.
  // For the sake of speed in this environment, I'll pass the reading through a server action I will create next.

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
       // We'll call a dedicated server action here
       const { saveProfileInternal } = await import("@/app/db-actions");
       await saveProfileInternal(profile);
       setIsLoading(false);
       setIsOpen(false);
    } catch (err) {
       console.error(err);
       setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <div className="flex items-center gap-3 p-2 hover:bg-secondary rounded-2xl cursor-pointer transition-all group">
          <div className="w-10 h-10 rounded-xl bg-orange-500/10 flex items-center justify-center text-orange-600 group-hover:scale-110 transition-transform">
             <UserCircle className="w-6 h-6" />
          </div>
          <div className="flex flex-col text-left">
            <span className="text-sm font-black tracking-tight">{profile.name}</span>
            <span className="text-[10px] font-bold text-muted-foreground opacity-60 italic">Free Account</span>
          </div>
        </div>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] p-0 overflow-hidden rounded-[2.5rem] bg-card/95 backdrop-blur-2xl border-none shadow-2xl">
        <div className="p-8">
          <DialogHeader className="mb-8">
             <div className="w-14 h-14 rounded-2xl bg-orange-500/10 flex items-center justify-center text-orange-600 mb-4">
                <UserCircle className="w-8 h-8" />
             </div>
             <DialogTitle className="text-3xl font-black tracking-tighter">Your Identity</DialogTitle>
             <p className="text-sm font-bold text-muted-foreground opacity-60">Manage your profile and database synchronization.</p>
          </DialogHeader>

          <form onSubmit={handleSave} className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest opacity-40 px-1">Display Name</label>
              <div className="relative">
                 <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                 <Input 
                   value={profile.name}
                   onChange={(e) => setProfile({...profile, name: e.target.value})}
                   className="h-14 pl-12 rounded-2xl bg-secondary/40 border-none font-bold"
                 />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest opacity-40 px-1">Email Address</label>
              <div className="relative">
                 <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                 <Input 
                   type="email"
                   value={profile.email}
                   onChange={(e) => setProfile({...profile, email: e.target.value})}
                   className="h-14 pl-12 rounded-2xl bg-secondary/40 border-none font-bold"
                 />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest opacity-40 px-1">Bio / Role</label>
              <Textarea 
                value={profile.bio}
                onChange={(e) => setProfile({...profile, bio: e.target.value})}
                className="rounded-2xl bg-secondary/40 border-none font-bold resize-none h-24 p-4"
              />
            </div>

            <Button className="w-full h-14 rounded-2xl font-black gap-3 shadow-xl shadow-primary/20" disabled={isLoading}>
              {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <><Save className="w-5 h-5" /> Save Changes</>}
            </Button>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
