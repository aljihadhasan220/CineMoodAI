import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search, Sparkles } from "lucide-react";
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

  const suggestions = [
    "Mind blowing sci-fi",
    "Sad romantic Korean movies",
    "Best thrillers with plot twists",
    "Movies like Interstellar"
  ];

  return (
    <div className="relative h-[85vh] flex flex-col items-center justify-center text-center px-4 overflow-hidden">
      {/* Dynamic Background */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/60 to-black" />
        <img 
          src="https://images.unsplash.com/photo-1626814026160-2237a95fc5a0?q=80&w=2000" 
          className="w-full h-full object-cover opacity-40 scale-105 animate-pulse-slow"
          alt="Hero background"
        />
        <div className="absolute inset-0 hero-gradient" />
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="max-w-4xl"
      >
        <span className="text-brand-red font-bold tracking-[0.3em] uppercase text-xs mb-4 block animate-float">
          AI-Powered Discovery
        </span>
        <h1 className="text-5xl md:text-8xl font-black mb-6 tracking-tighter text-shadow-glow leading-[1.1]">
          Find Your Next <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-white to-brand-red/50">
            Favorite Movie
          </span>
        </h1>
        <p className="text-white/60 text-lg md:text-xl max-w-2xl mx-auto mb-10 font-medium">
          The only AI movie recommender that understands your mood and taste. Just tell us what you're feeling.
        </p>

        {/* AI Search Bar */}
        <form 
          onSubmit={handleSearch}
          className="relative group max-w-2xl mx-auto w-full"
        >
          <div className="absolute -inset-1 bg-gradient-to-r from-brand-red to-purple-600 rounded-2xl blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200" />
          <div className="relative flex items-center bg-[#111] rounded-2xl p-2 border border-white/10 ring-1 ring-white/5 shadow-2xl">
            <div className="pl-4 flex-shrink-0">
              <Search className="w-5 h-5 text-white/40" />
            </div>
            <input 
              type="text" 
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="What do you want to watch tonight?"
              className="w-full bg-transparent border-none outline-none px-4 py-3 md:py-4 text-white placeholder:text-white/20 text-lg"
            />
            <button 
              type="submit"
              className="bg-brand-red hover:bg-red-700 text-white px-6 py-3 rounded-xl flex items-center gap-2 transition-all font-bold group"
            >
              <Sparkles className="w-4 h-4 group-hover:rotate-12 transition-transform" />
              Ask AI
            </button>
          </div>
        </form>

        <div className="mt-8 flex flex-wrap justify-center gap-3">
          {suggestions.map((s) => (
            <button
              key={s}
              onClick={() => navigate(`/ai-search?q=${encodeURIComponent(s)}`)}
              className="text-xs bg-white/5 hover:bg-white/10 border border-white/10 px-4 py-2 rounded-full transition-colors text-white/60 hover:text-white"
            >
              "{s}"
            </button>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
