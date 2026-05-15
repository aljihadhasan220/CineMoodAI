import { Heart, Search, Film, Trash2, ArrowRight, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import MovieCard from "@/src/components/Movie/MovieCard";

export default function Watchlist() {
  const [watchlist, setWatchlist] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const saved = localStorage.getItem("cinemood_watchlist");
    if (saved) {
      setWatchlist(JSON.parse(saved));
    }
    setLoading(false);
  }, []);

  const removeFromWatchlist = (id: number) => {
    const updated = watchlist.filter(m => m.id !== id);
    setWatchlist(updated);
    localStorage.setItem("cinemood_watchlist", JSON.stringify(updated));
  };

  return (
    <div className="min-h-screen pt-32 pb-20 px-4 md:px-8 max-w-7xl mx-auto">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row items-start md:items-end justify-between gap-6 mb-16"
      >
        <div>
          <h1 className="text-[10px] font-black uppercase tracking-[0.4em] text-brand-red mb-4">Personal Collection</h1>
          <h2 className="text-4xl md:text-6xl font-black tracking-tight italic uppercase">MY <span className="text-brand-red">WATCHLIST</span></h2>
          <div className="h-1.5 w-24 bg-brand-red rounded-full mt-4" />
        </div>
        
        {watchlist.length > 0 && (
          <div className="bg-white/5 border border-white/10 px-6 py-3 rounded-2xl flex items-center gap-3 backdrop-blur-xl">
            <Heart className="w-5 h-5 fill-brand-red text-brand-red" />
            <span className="text-xs font-black uppercase tracking-widest">{watchlist.length} Movies Saved</span>
          </div>
        )}
      </motion.div>

      {watchlist.length === 0 ? (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex flex-col items-center justify-center py-20 text-center glass rounded-[3rem] border-dashed border-white/10"
        >
          <div className="w-24 h-24 bg-white/5 rounded-full flex items-center justify-center mb-8 border border-white/5 animate-float shadow-2xl">
            <Film className="w-10 h-10 text-white/20" />
          </div>
          <h2 className="text-2xl font-black mb-4 uppercase italic">Your watchlist is empty</h2>
          <p className="text-white/40 max-w-md mb-10 leading-relaxed font-medium">
            Start exploring cinematic masterpieces and save them here. Our AI recommendations can help you find your next obsession.
          </p>
          <Link 
            to="/ai-search" 
            className="bg-brand-red hover:bg-red-700 text-white px-10 py-4 rounded-2xl font-black text-xs uppercase tracking-widest flex items-center gap-3 shadow-xl shadow-brand-red/30 transition-all hover:scale-105"
          >
            <Search className="w-4 h-4" />
            START AI EXPLORER
          </Link>
        </motion.div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-8">
          <AnimatePresence>
            {watchlist.map((movie, i) => (
              <motion.div 
                key={movie.id}
                layout
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.5 }}
                transition={{ duration: 0.3 }}
                className="relative group"
              >
                <MovieCard movie={movie} index={i} />
                <button 
                  onClick={() => removeFromWatchlist(movie.id)}
                  className="absolute top-4 left-4 w-10 h-10 bg-black/60 hover:bg-brand-red rounded-full flex items-center justify-center text-white/40 hover:text-white transition-all backdrop-blur-md opacity-0 group-hover:opacity-100 z-20 border border-white/10"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      {/* Recommended for watchlist */}
      <div className="mt-32 pt-16 border-t border-white/5">
        <div className="flex items-center justify-between mb-12">
          <h3 className="text-xl font-black uppercase tracking-widest flex items-center gap-3 italic">
            <Sparkles className="w-5 h-5 text-brand-red" /> Suggested For You
          </h3>
          <Link to="/ai-search" className="text-[10px] font-black text-white/30 hover:text-brand-red flex items-center gap-2 transition-colors uppercase tracking-widest">
            MORE PICKS
            <ArrowRight className="w-3 h-3" />
          </Link>
        </div>
        
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-6">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="aspect-[2/3] bg-white/5 rounded-[2rem] border border-white/5 animate-pulse" />
          ))}
        </div>
      </div>
    </div>
  );
}
