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
        <div className="grid grid-cols-12 auto-rows-[120px] gap-4 mb-20">
          
          {/* Main Discovery / Trending Feature */}
          <section className="col-span-12 lg:col-span-8 row-span-4 rounded-3xl relative overflow-hidden glass group border-white/10 shadow-2xl">
             <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent z-10" />
             <div className="absolute inset-0 z-0">
               <img 
                src="https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&q=80&w=1024" 
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                alt="Featured movie"
               />
             </div>
             <div className="absolute bottom-10 left-10 z-20 max-w-lg">
                <div className="flex gap-2 mb-4">
                  <span className="bg-brand-red text-[10px] px-3 py-1 rounded-md font-bold uppercase tracking-widest">Trending Now</span>
                  <span className="bg-white/10 backdrop-blur-md text-[10px] px-3 py-1 rounded-md uppercase tracking-widest font-bold">Sci-Fi • 2024</span>
                </div>
                <h2 className="text-4xl md:text-6xl font-black mb-4 tracking-tighter leading-tight italic">DUNES OF DESTINY</h2>
                <p className="text-white/60 text-sm md:text-base line-clamp-2 mb-8 leading-relaxed">The galactic war for the spice continues as ancient prophecies begin to unfold in the heart of the desert world.</p>
                <div className="flex gap-4">
                  <button className="bg-white text-black px-8 py-3 rounded-full text-sm font-bold hover:bg-brand-red hover:text-white transition-all shadow-xl">Watch Now</button>
                  <button className="glass px-8 py-3 rounded-full text-sm font-bold hover:bg-white/10 transition-all border-white/20">+ Watchlist</button>
                </div>
             </div>
          </section>

          {/* AI Pickup Card */}
          <div className="col-span-12 md:col-span-6 lg:col-span-4 row-span-4 rounded-3xl glass p-8 flex flex-col justify-between border-white/10 shadow-xl overflow-hidden relative group">
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-brand-red/10 blur-3xl rounded-full" />
            <h3 className="text-lg font-bold flex items-center gap-2 relative z-10">
              <span className="w-2.5 h-2.5 rounded-full bg-brand-red animate-pulse shadow-[0_0_10px_#E50914]"></span>
              AI Tonight's Pick
            </h3>
            
            <div className="flex-1 flex flex-col justify-center py-6 relative z-10">
              <div className="text-4xl font-serif italic text-white/90 mb-3 tracking-tight">"Mind-bending Reality"</div>
              <p className="text-sm text-white/40 leading-relaxed max-w-xs">Based on your mood: You seem to be looking for something that challenges your perspective today.</p>
            </div>

            <div className="bg-white/5 rounded-2xl p-4 flex gap-4 items-center border border-white/10 relative z-10 hover:bg-white/10 transition-colors cursor-pointer group/item">
              <div className="w-14 h-20 rounded bg-zinc-800 overflow-hidden shadow-lg">
                <img src="https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?q=80&w=200" className="w-full h-full object-cover group-hover/item:scale-110 transition-transform" />
              </div>
              <div className="flex-1">
                <div className="text-base font-bold">Inception</div>
                <div className="text-xs text-zinc-500">Christopher Nolan • 8.8 IMDb</div>
              </div>
              <ChevronRight className="w-5 h-5 text-zinc-600 group-hover/item:text-brand-red" />
            </div>
          </div>

          {/* Mood Selector Bento */}
          <div className="col-span-12 md:col-span-6 lg:col-span-4 row-span-2 rounded-3xl glass p-6 border-white/10 shadow-xl flex flex-col">
            <h3 className="text-xs font-bold uppercase tracking-widest text-white/30 mb-4">Mood Discovery</h3>
            <div className="grid grid-cols-4 gap-2 text-[10px] font-bold flex-1">
              {moods.map(mood => (
                <button key={mood.name} className="bg-white/5 border border-white/10 rounded-xl p-2 flex flex-col items-center justify-center gap-1 hover:bg-brand-red/20 hover:border-brand-red/30 transition-all group">
                   <mood.icon className={`w-4 h-4 ${mood.color} group-hover:scale-110 transition-transform`} />
                   <span className="text-[9px] line-clamp-1">{mood.name}</span>
                </button>
              ))}
              <button className="bg-white/5 border border-white/10 rounded-xl p-2 flex flex-col items-center justify-center gap-1 hover:bg-white/10 transition-all opacity-50">
                 <MoreHorizontal className="w-4 h-4" />
                 <span className="text-[9px]">More</span>
              </button>
            </div>
          </div>

          {/* Recent Releases / Grid Sidebar */}
          <div className="col-span-12 lg:col-span-4 row-span-4 rounded-3xl glass overflow-hidden border-white/10 shadow-xl">
             <div className="p-6 border-b border-white/5 flex justify-between items-center bg-white/5">
                <h3 className="text-xs font-bold uppercase tracking-widest text-white/50 italic">Recent Releases</h3>
                <span className="text-[10px] text-brand-red font-bold cursor-pointer hover:underline">SEE ALL</span>
             </div>
             <div className="p-6 space-y-6">
                {[
                  { title: "Furiosa: A Mad Max Saga", genre: "Action", year: "2024" },
                  { title: "Kingdom of Planet Apes", genre: "Sci-Fi", year: "2024" },
                  { title: "The Fall Guy", genre: "Comedy", year: "2024" }
                ].map((m, i) => (
                  <div key={i} className="flex gap-4 items-center group cursor-pointer">
                    <div className="w-12 h-16 rounded bg-zinc-800 overflow-hidden flex-shrink-0 shadow-lg group-hover:ring-2 ring-brand-red/50 transition-all">
                       <div className="w-full h-full bg-gradient-to-br from-zinc-700 to-zinc-900" />
                    </div>
                    <div className="flex-1 overflow-hidden">
                      <div className="text-sm font-bold line-clamp-1 group-hover:text-brand-red transition-colors uppercase tracking-tight">{m.title}</div>
                      <div className="text-[10px] text-white/40 uppercase tracking-widest font-semibold">{m.genre} • {m.year}</div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-zinc-700 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                  </div>
                ))}
             </div>
          </div>

          {/* Special Feature / Game */}
          <div className="col-span-12 md:col-span-6 lg:col-span-4 row-span-4 rounded-3xl relative overflow-hidden group shadow-2xl border border-white/5">
            <div className="absolute inset-0 bg-gradient-to-br from-red-900/60 via-black to-black z-10" />
            <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&q=80&w=400')] bg-cover opacity-60 backdrop-blur-sm transition-transform duration-1000 group-hover:scale-110" />
            <div className="absolute inset-0 flex flex-col justify-center items-center text-center p-8 z-20">
              <div className="text-brand-red mb-4 p-4 bg-brand-red/20 rounded-full animate-float">
                <Flame className="w-12 h-12" />
              </div>
              <h4 className="text-2xl font-black uppercase italic tracking-tighter mb-2">Movie Quiz</h4>
              <p className="text-xs text-white/60 mb-6 max-w-xs leading-relaxed font-medium">Test your cinema knowledge with our AI-powered challenger.</p>
              <button className="bg-brand-red text-white px-10 py-3 rounded-full text-xs font-black tracking-widest hover:bg-white hover:text-brand-red transition-all shadow-xl hover:shadow-brand-red/30 active:scale-95">
                PLAY NOW
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
