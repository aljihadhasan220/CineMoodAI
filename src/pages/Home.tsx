import React, { useState, useEffect } from "react";
import Hero from "@/src/components/Movie/Hero";
import MovieCard, { Movie } from "@/src/components/Movie/MovieCard";
import { Smile, Zap, Heart, Ghost, Rocket, Flame, MoreHorizontal, ChevronRight } from "lucide-react";
import { motion } from "motion/react";

export default function Home() {
  const [trending, setTrending] = useState<Movie[]>([]);
  const [popular, setPopular] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const [resT, resP] = await Promise.all([
          fetch("/api/movies/trending"),
          fetch("/api/movies/popular")
        ]);
        const dataT = await resT.json();
        const dataP = await resP.json();
        setTrending(dataT.results || []);
        setPopular(dataP.results || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const moods = [
    { name: "Funny", icon: Smile, color: "text-yellow-400", bg: "bg-yellow-400/10" },
    { name: "Mind-Blowing", icon: Zap, color: "text-blue-400", bg: "bg-blue-400/10" },
    { name: "Action", icon: Flame, color: "text-orange-500", bg: "bg-orange-500/10" },
    { name: "Horror", icon: Ghost, color: "text-purple-400", bg: "bg-purple-400/10" },
    { name: "Sci-Fi", icon: Rocket, color: "text-cyan-400", bg: "bg-cyan-400/10" },
    { name: "Romantic", icon: Heart, color: "text-pink-400", bg: "bg-pink-400/10" },
  ];

  return (
    <div className="pb-20">
      <Hero />

      <main className="max-w-7xl mx-auto px-4 md:px-8 -mt-10 relative z-10">
        {/* Bento Grid Layout */}
        <div className="grid grid-cols-12 auto-rows-[120px] gap-4 mb-24">
          
          {/* Main Discovery - Clean & Cinematic */}
          <section className="col-span-12 lg:col-span-8 row-span-4 rounded-3xl relative overflow-hidden glass border-white/5 shadow-2xl group">
             <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent z-10" />
             <div className="absolute inset-0 z-0">
               <img 
                src="https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&q=80&w=1024" 
                className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                alt="Featured movie"
               />
             </div>
             <div className="absolute bottom-10 left-10 z-20 max-w-md">
                <div className="flex gap-2 mb-4">
                  <span className="bg-brand-red text-[9px] px-2.5 py-1 rounded-md font-black uppercase tracking-widest">Featured</span>
                  <span className="bg-white/10 backdrop-blur-md text-[9px] px-2.5 py-1 rounded-md uppercase tracking-widest font-bold">2024 Picks</span>
                </div>
                <h2 className="text-4xl md:text-5xl font-black mb-4 tracking-tight">DUNE: PART TWO</h2>
                <p className="text-white/50 text-sm line-clamp-2 mb-8 leading-relaxed font-medium">Paul Atreides unites with Chani and the Fremen while on a warpath of revenge against the conspirators who destroyed his family.</p>
                <div className="flex gap-3">
                  <button className="bg-white text-black px-6 py-2.5 rounded-full text-xs font-black shadow-xl hover:scale-105 transition-all">PLAY NOW</button>
                  <button className="bg-white/5 border border-white/10 backdrop-blur-md text-white px-6 py-2.5 rounded-full text-xs font-bold hover:bg-white/10 transition-all">+ WATCHLIST</button>
                </div>
             </div>
          </section>

          {/* AI Pickup Card - Refined */}
          <div className="col-span-12 md:col-span-6 lg:col-span-4 row-span-4 rounded-3xl glass p-8 flex flex-col justify-between border-white/5 shadow-xl relative overflow-hidden">
            <div className="relative z-10">
              <h3 className="text-xs font-black uppercase tracking-widest text-white/30 mb-8 flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-brand-red" />
                Tonight's AI Selection
              </h3>
              
              <div className="flex-1 flex flex-col justify-center py-6">
                <div className="text-3xl font-serif italic text-white/90 mb-2 leading-tight">"Surreal & <br />Perspective Shifting"</div>
                <p className="text-xs text-white/40 leading-relaxed max-w-[200px]">Perfect for when you want a film that stays with you for days.</p>
              </div>
            </div>

            <div className="bg-white/5 rounded-2xl p-4 flex gap-4 items-center border border-white/5 hover:bg-white/10 transition-all cursor-pointer group">
              <div className="w-12 h-16 rounded-lg bg-zinc-800 overflow-hidden shadow-lg flex-shrink-0">
                <img src="https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?q=80&w=200" className="w-full h-full object-cover grayscale brightness-75 group-hover:grayscale-0 group-hover:brightness-100 transition-all" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-bold truncate">INCEPTION</div>
                <div className="text-[10px] text-white/30 font-bold uppercase tracking-widest">Nolan • 8.8 IMDb</div>
              </div>
              <ChevronRight className="w-4 h-4 text-white/20 group-hover:text-brand-red transition-colors" />
            </div>
          </div>

          {/* Clean Mood Selector */}
          <div className="col-span-12 md:col-span-6 lg:col-span-4 row-span-2 rounded-3xl glass p-6 border-white/5 shadow-xl">
            <h3 className="text-[10px] font-black uppercase tracking-widest text-white/20 mb-5">Select Mood</h3>
            <div className="grid grid-cols-4 gap-2">
              {moods.map(mood => (
                <button key={mood.name} className="bg-white/5 border border-white/5 rounded-xl p-3 flex flex-col items-center justify-center gap-2 hover:bg-brand-red/10 hover:border-brand-red/20 transition-all group">
                   <mood.icon className={`w-4 h-4 ${mood.color} opacity-60 group-hover:opacity-100 transition-opacity`} />
                   <span className="text-[9px] uppercase font-bold tracking-widest opacity-40 group-hover:opacity-100">{mood.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Refined Activity Sidebar */}
          <div className="col-span-12 lg:col-span-4 row-span-4 rounded-3xl glass overflow-hidden border-white/5 shadow-xl flex flex-col">
             <div className="p-6 border-b border-white/5 flex justify-between items-center bg-white/5">
                <h3 className="text-[10px] font-black uppercase tracking-widest text-white/30">Top Rated</h3>
                <span className="text-[9px] text-brand-red font-black cursor-pointer hover:opacity-80">SEE ALL</span>
             </div>
             <div className="p-6 space-y-6 flex-1">
                {[
                  { title: "Furiosa: Mad Max", genre: "Action", year: "2024" },
                  { title: "Inside Out 2", genre: "Anim", year: "2024" },
                  { title: "The Fall Guy", genre: "Comedy", year: "2024" }
                ].map((m, i) => (
                  <div key={i} className="flex gap-4 items-center group cursor-pointer">
                    <div className="w-10 h-14 rounded-lg bg-white/5 overflow-hidden flex-shrink-0 group-hover:ring-1 ring-brand-red/30 transition-all">
                       <div className="w-full h-full bg-gradient-to-br from-zinc-800 to-zinc-950" />
                    </div>
                    <div className="flex-1 overflow-hidden">
                      <div className="text-xs font-bold truncate group-hover:text-brand-red transition-colors uppercase tracking-tight">{m.title}</div>
                      <div className="text-[9px] text-white/30 uppercase tracking-widest font-bold">{m.genre} • {m.year}</div>
                    </div>
                  </div>
                ))}
             </div>
          </div>

          {/* Minimal Feature Card */}
          <div className="col-span-12 md:col-span-6 lg:col-span-4 row-span-4 rounded-3xl relative overflow-hidden group shadow-2xl border border-white/5">
            <div className="absolute inset-0 bg-gradient-to-br from-[#111] via-black to-black z-10" />
            <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&q=80&w=400')] bg-cover opacity-20 filter grayscale transition-transform duration-1000 group-hover:scale-105" />
            <div className="absolute inset-0 flex flex-col justify-center items-center text-center p-8 z-20">
              <div className="text-brand-red mb-6 opacity-40">
                <Flame className="w-10 h-10" />
              </div>
              <h4 className="text-xl font-black uppercase tracking-widest mb-3">Cinema Quiz</h4>
              <p className="text-[10px] text-white/30 mb-8 max-w-[180px] leading-relaxed uppercase font-bold tracking-widest">Prove your mastery of the silver screen</p>
              <button className="bg-white/5 border border-white/10 hover:bg-white/10 text-white px-10 py-3 rounded-full text-[10px] font-black tracking-widest transition-all">
                START CHALLENGE
              </button>
            </div>
          </div>
        </div>

        {/* Standard Rows Still Exist Below for infinite scrolling feel */}
        <MovieRow title="🔥 Trending This Week" movies={trending} loading={loading} />
      </main>
    </div>
  );
}

function MovieRow({ title, movies, loading }: { title: string, movies: Movie[], loading: boolean }) {
  return (
    <section className="mb-20">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-2xl font-bold">{title}</h2>
        <button className="text-sm text-brand-red font-semibold hover:underline">View All</button>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
        {loading ? Array(5).fill(0).map((_, i) => <SkeletonCard key={i} />) 
                 : movies.slice(0, 5).map((movie, index) => <MovieCard key={movie.id} movie={movie} index={index} />)}
      </div>
    </section>
  );
}

function SkeletonCard() {
  return (
    <div className="aspect-[2/3] bg-white/5 rounded-xl border border-white/5 animate-pulse" />
  );
}

function SparklesIcon() {
  return <div className="text-brand-red"><Zap size={24} fill="currentColor" /></div>;
}
