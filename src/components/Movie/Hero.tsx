import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search, Sparkles, TrendingUp } from "lucide-react";
import { motion } from "motion/react";

export default function Hero() {
  const [query, setQuery] = useState("");
  const navigate = useNavigate();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/ai-search?q=${encodeURIComponent(query)}`);
    }
  };

  return (
    <div className="relative h-[80vh] flex flex-col items-center justify-center text-center px-4 overflow-hidden">
      {/* Clean Cinematic Background */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/80 to-black" />
        <img 
          src="https://images.unsplash.com/photo-1626814026160-2237a95fc5a0?q=80&w=2000" 
          className="w-full h-full object-cover opacity-30 animate-pulse-slow"
          alt="Hero background"
        />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="max-w-4xl z-10"
      >
        <span className="text-brand-red font-bold tracking-[0.3em] uppercase text-[10px] mb-4 block">
          AI-Powered Discovery
        </span>
        <h1 className="text-5xl md:text-8xl font-black mb-8 tracking-tighter leading-none">
          Your Next Favorite <br />
          <span className="text-white/90">Movie Awaits</span>
        </h1>
        
        <p className="text-white/40 text-base md:text-lg max-w-xl mx-auto mb-10 font-medium leading-relaxed">
          The most intelligent way to find films that match your exact mood and taste.
        </p>

        {/* Minimal Search Bar */}
        <form 
          onSubmit={handleSearch}
          className="relative max-w-2xl mx-auto w-full group"
        >
          <div className="relative flex items-center bg-white/5 backdrop-blur-xl rounded-2xl p-2 border border-white/10 transition-all focus-within:border-brand-red/50 shadow-2xl">
            <div className="pl-4">
              <Search className="w-5 h-5 text-white/30" />
            </div>
            <input 
              type="text" 
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="What are you in the mood for?"
              className="w-full bg-transparent border-none outline-none px-4 py-4 text-white placeholder:text-white/20 text-lg font-medium"
            />
            <button 
              type="submit"
              className="bg-brand-red hover:bg-red-700 text-white px-8 py-4 rounded-xl flex items-center gap-2 transition-all font-bold shadow-lg shadow-brand-red/20 active:scale-95"
            >
              <Sparkles className="w-4 h-4" />
              <span className="hidden md:inline">Ask AI</span>
            </button>
          </div>
        </form>

        <div className="mt-8 flex flex-wrap justify-center gap-3">
          {["Mind-bending Sci-Fi", "Heartwarming Drama", "90s Thrillers"].map((s) => (
            <button
              key={s}
              onClick={() => navigate(`/ai-search?q=${encodeURIComponent(s)}`)}
              className="text-[10px] bg-white/5 hover:bg-white/10 border border-white/5 px-4 py-2 rounded-full transition-all text-white/40 hover:text-white uppercase tracking-widest font-bold"
            >
              {s}
            </button>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
