import { Heart, Search, Film } from "lucide-react";
import { Link } from "react-router-dom";

export default function Watchlist() {
  return (
    <div className="min-h-screen pt-32 pb-20 px-4 md:px-8 max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-12">
        <div>
          <h1 className="text-4xl md:text-6xl font-black tracking-tight mb-2">MY WATCHLIST</h1>
          <div className="h-1.5 w-24 bg-brand-red rounded-full" />
        </div>
        <div className="hidden md:flex items-center gap-2 text-white/30 font-bold uppercase tracking-widest text-xs">
          <Heart className="w-4 h-4 fill-brand-red text-brand-red" />
          4 Movies Saved
        </div>
      </div>

      <div className="flex flex-col items-center justify-center py-32 text-center">
        <div className="w-24 h-24 bg-white/5 rounded-full flex items-center justify-center mb-8 border border-white/5 animate-float">
          <Film className="w-10 h-10 text-white/20" />
        </div>
        <h2 className="text-2xl font-bold mb-4">Your watchlist is feeling lonely...</h2>
        <p className="text-white/40 max-w-md mb-10 leading-relaxed">
          Start exploring today and add some movies to your list. Our AI recommendations are a great place to start!
        </p>
        <Link 
          to="/ai-search" 
          className="bg-brand-red hover:bg-red-700 text-white px-8 py-4 rounded-2xl font-black flex items-center gap-3 shadow-xl shadow-brand-red/20 transition-all hover:scale-105"
        >
          <Search className="w-5 h-5" />
          START AI EXPLORER
        </Link>
      </div>

      {/* Recommended for watchlist */}
      <div className="mt-20 pt-16 border-t border-white/5">
        <h3 className="text-xl font-bold mb-8 uppercase tracking-widest flex items-center gap-3">
          <Heart className="w-4 h-4 text-brand-red" /> Suggested for you
        </h3>
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-6">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="aspect-[2/3] bg-white/5 rounded-2xl border border-white/5 animate-pulse" />
          ))}
        </div>
      </div>
    </div>
  );
}
