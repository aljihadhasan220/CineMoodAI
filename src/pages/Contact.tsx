import React, { useState } from "react";
import { Mail, MessageCircle, Twitter, Github, Send, Instagram, Loader2, CheckCircle, AlertCircle } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

export default function Contact() {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "Feature Request",
    message: ""
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) {
      return;
    }

    setStatus("loading");
    try {
      const response = await fetch("https://formspree.io/f/maqvggrr", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        setStatus("success");
        setFormData({ name: "", email: "", subject: "Feature Request", message: "" });
        setTimeout(() => setStatus("idle"), 5000);
      } else {
        throw new Error("Failed to send message");
      }
    } catch (err) {
      console.error("Formspree Error:", err);
      setStatus("error");
      setTimeout(() => setStatus("idle"), 5000);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  return (
    <div className="pt-32 pb-20 px-4 md:px-8 max-w-7xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-20">
        {/* Left Side: Info */}
        <motion.div 
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          className="space-y-12"
        >
          <div>
            <h1 className="text-[10px] font-black uppercase tracking-[0.4em] text-brand-red mb-4">Connect With Us</h1>
            <h2 className="text-5xl md:text-7xl font-black uppercase tracking-tighter italic leading-tight">GET IN <span className="text-brand-red">TOUCH</span></h2>
            <p className="text-white/40 text-lg mt-6 max-w-lg font-medium">
              Have a feature request? Reporting a bug? Or just want to talk about that 1970s Polish masterpiece you found? We're all ears.
            </p>
          </div>

          <div className="space-y-6">
            <ContactInfoItem icon={Mail} label="Email Us" value="hello@cinemood.ai" />
            <ContactInfoItem 
              icon={MessageCircle} 
              label="Join Telegram" 
              value="@moviewalla02" 
              link="https://t.me/moviewalla02"
              highlight 
            />
          </div>

          <div className="pt-10 border-t border-white/5">
             <p className="text-[10px] font-black uppercase tracking-widest text-white/20 mb-6">Follow our journey</p>
             <div className="flex gap-4">
                <SocialLink icon={Twitter} />
                <SocialLink icon={Instagram} />
                <SocialLink icon={Github} />
             </div>
          </div>
        </motion.div>

        {/* Right Side: Form */}
        <motion.div 
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          className="glass p-10 md:p-12 rounded-[3.5rem] border-white/5 shadow-2xl relative"
        >
           <div className="absolute top-0 right-0 p-8 opacity-5">
             <Send className="w-40 h-40" />
           </div>

           <form className="space-y-6 relative z-10" onSubmit={handleSubmit}>
             <AnimatePresence mode="wait">
               {status === "success" && (
                 <motion.div 
                   initial={{ opacity: 0, height: 0 }}
                   animate={{ opacity: 1, height: "auto" }}
                   exit={{ opacity: 0, height: 0 }}
                   className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 p-6 rounded-2xl flex items-center gap-4 mb-6"
                 >
                   <CheckCircle className="w-6 h-6 shrink-0" />
                   <p className="text-sm font-bold uppercase tracking-widest">Message sent successfully! We'll be in touch soon.</p>
                 </motion.div>
               )}
               {status === "error" && (
                 <motion.div 
                   initial={{ opacity: 0, height: 0 }}
                   animate={{ opacity: 1, height: "auto" }}
                   exit={{ opacity: 0, height: 0 }}
                   className="bg-brand-red/10 border border-brand-red/20 text-brand-red p-6 rounded-2xl flex items-center gap-4 mb-6"
                 >
                   <AlertCircle className="w-6 h-6 shrink-0" />
                   <p className="text-sm font-bold uppercase tracking-widest">Failed to send message. Please try again later.</p>
                 </motion.div>
               )}
             </AnimatePresence>

             <div className="grid grid-cols-2 gap-6">
               <div className="space-y-2">
                 <label className="text-[10px] font-black uppercase tracking-widest text-white/30 ml-2">Name</label>
                 <input 
                   required
                   name="name"
                   value={formData.name}
                   onChange={handleChange}
                   type="text" 
                   placeholder="John Wick" 
                   className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 outline-none focus:border-brand-red/50 transition-colors placeholder:text-white/10" 
                 />
               </div>
               <div className="space-y-2">
                 <label className="text-[10px] font-black uppercase tracking-widest text-white/30 ml-2">Email</label>
                 <input 
                   required
                   name="email"
                   value={formData.email}
                   onChange={handleChange}
                   type="email" 
                   placeholder="john@continental.com" 
                   className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 outline-none focus:border-brand-red/50 transition-colors placeholder:text-white/10" 
                 />
               </div>
             </div>

             <div className="space-y-2">
               <label className="text-[10px] font-black uppercase tracking-widest text-white/30 ml-2">Subject</label>
               <select 
                 name="subject"
                 value={formData.subject}
                 onChange={handleChange}
                 className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 outline-none focus:border-brand-red/50 transition-colors appearance-none"
               >
                 <option className="bg-zinc-950">Feature Request</option>
                 <option className="bg-zinc-950">Bug Report</option>
                 <option className="bg-zinc-950">Partnership</option>
                 <option className="bg-zinc-950">Other</option>
               </select>
             </div>

             <div className="space-y-2">
               <label className="text-[10px] font-black uppercase tracking-widest text-white/30 ml-2">Message</label>
               <textarea 
                 required
                 name="message"
                 value={formData.message}
                 onChange={handleChange}
                 rows={5} 
                 placeholder="What's on your mind?" 
                 className="w-full bg-white/5 border border-white/10 rounded-3xl px-6 py-4 outline-none focus:border-brand-red/50 transition-colors placeholder:text-white/10 resize-none" 
               />
             </div>

             <button 
               disabled={status === "loading"}
               className="w-full bg-white text-black disabled:opacity-50 disabled:cursor-not-allowed hover:bg-brand-red hover:text-white py-5 rounded-2xl font-black text-xs uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-3 group shadow-xl"
             >
               {status === "loading" ? (
                 <>
                   <Loader2 className="w-5 h-5 animate-spin" />
                   SENDING...
                 </>
               ) : (
                 <>
                   SEND MESSAGE
                   <Send className="w-4 h-4 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
                 </>
               )}
             </button>
           </form>
        </motion.div>
      </div>
    </div>
  );
}

function ContactInfoItem({ icon: Icon, label, value, highlight, link }: { icon: any, label: string, value: string, highlight?: boolean, link?: string }) {
  const Container = link ? "a" : "div";
  return (
    <Container 
      href={link} 
      target={link ? "_blank" : undefined}
      rel={link ? "noopener noreferrer" : undefined}
      className={`flex items-center gap-6 p-6 rounded-3xl border transition-all cursor-pointer ${highlight ? "bg-brand-red/10 border-brand-red/40 translate-x-4" : "glass border-white/5 hover:border-white/20"}`}
    >
      <div className={`p-4 rounded-2xl ${highlight ? "bg-brand-red text-white" : "bg-white/5 text-white/40"}`}>
        <Icon className="w-6 h-6" />
      </div>
      <div>
        <p className="text-[10px] font-black uppercase tracking-widest text-white/20 mb-1">{label}</p>
        <p className={`font-black uppercase tracking-tight text-xl ${highlight ? "text-brand-red" : "text-white"}`}>{value}</p>
      </div>
    </Container>
  );
}

function SocialLink({ icon: Icon }: { icon: any }) {
  return (
    <button className="w-12 h-12 rounded-2xl bg-white/5 hover:bg-brand-red hover:text-white flex items-center justify-center transition-all border border-white/5 hover:border-brand-red hover:-translate-y-1">
      <Icon className="w-5 h-5 transition-transform" />
    </button>
  );
}
