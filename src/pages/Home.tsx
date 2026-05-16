import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Hero from "@/src/components/Movie/Hero";
import MovieCard, { Movie } from "@/src/components/Movie/MovieCard";
import { Smile, Zap, Heart, Ghost, Rocket, Flame, ChevronRight, Sparkles, Film, Info } from "lucide-react";
import { motion } from "motion/react";

export default function Home() {
  const navigate = useNavigate();
  const [trending, setTrending] = useState<Movie[]>([]);
  const [popular, setPopular] = useState<Movie[]>([]);
  const [topRated, setTopRated] = useState<Movie[]>([]);
  const [upcoming, setUpcoming] = useState<Movie[]>([]);
  const [korean, setKorean] = useState<Movie[]>([]);
  const [anime, setAnime] = useState<Movie[]>([]);
  const [action, setAction] = useState<Movie[]>([]);
  const [sciFi, setSciFi] = useState<Movie[]>([]);
  const [ott, setOtt] = useState<Movie[]>([]);
  const [indian, setIndian] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const categories = ['trending', 'popular', 'top_rated', 'upcoming', 'korean', 'anime', 'action', 'sci_fi', 'ott', 'indian'];
        const results = await Promise.all(
          categories.map(cat => 
            fetch(`/api/movies/${cat}`)
              .then(res => res.ok ? res.json() : { results: [] })
              .catch(() => ({ results: [] }))
          )
        );
        
        setTrending(results[0]?.results || []);
        setPopular(results[1]?.results || []);
        setTopRated(results[2]?.results || []);
        setUpcoming(results[3]?.results || []);
        setKorean(results[4]?.results || []);
        setAnime(results[5]?.results || []);
        setAction(results[6]?.results || []);
        setSciFi(results[7]?.results || []);
        setOtt(results[8]?.results || []);
        setIndian(results[9]?.results || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  const moods = [
    { name: "Funny", id: "funny", icon: Smile, color: "text-yellow-400" },
    { name: "Mind-Blowing", id: "mind-blowing", icon: Zap, color: "text-blue-400" },
    { name: "Action", id: "action", icon: Flame, color: "text-orange-500" },
    { name: "Horror", id: "horror", icon: Ghost, color: "text-purple-400" },
    { name: "Sci-Fi", id: "sci_fi", icon: Rocket, color: "text-cyan-400" },
    { name: "Romantic", id: "romance", icon: Heart, color: "text-pink-400" },
    { name: "Thriller", id: "thriller", icon: Film, color: "text-zinc-400" },
    { name: "Emotional", id: "emotional", icon: Info, color: "text-blue-500" },
    { name: "Anime", id: "anime", icon: Sparkles, color: "text-rose-400" },
    { name: "K-Drama", id: "k-drama", icon: Heart, color: "text-emerald-400" },
    { name: "Adventure", id: "adventure", icon: Rocket, color: "text-amber-500" },
    { name: "Mystery", id: "mystery", icon: Film, color: "text-zinc-500" },
  ];

  const handleMoodClick = (moodId: string) => {
    navigate(`/categories/${moodId}`);
  };

  return (
    <div className="pb-20">
      <Hero />

      <main className="max-w-7xl mx-auto px-4 md:px-8 -mt-20 relative z-10">
        {/* Mood Selector and Top Rated Sidebar */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-24">
          {/* Mood Selector */}
          <div className="rounded-3xl glass p-8 border-white/5 shadow-xl flex flex-col h-full">
            <h3 className="text-[10px] font-black uppercase tracking-widest text-white/20 mb-6 flex items-center justify-between">
              Browse by Mood
              <Sparkles className="w-3 h-3 text-brand-red" />
            </h3>
            <div className="grid grid-cols-3 gap-3 flex-1">
              {moods.map((mood, idx) => (
                <motion.button 
                  key={mood.id} 
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: idx * 0.05 }}
                  onClick={() => handleMoodClick(mood.id)}
                  className="bg-white/5 border border-white/5 rounded-2xl p-4 flex flex-col items-center justify-center gap-2 hover:bg-brand-red/10 hover:border-brand-red/20 transition-all group active:scale-95 hover:shadow-[0_0_20px_rgba(229,9,20,0.1)]"
                >
                   <mood.icon className={`w-6 h-6 ${mood.color} opacity-40 group-hover:opacity-100 group-hover:scale-110 transition-all`} />
                   <span className="text-[9px] uppercase font-black tracking-widest opacity-30 group-hover:opacity-100 group-hover:text-white transition-all">{mood.name}</span>
                </motion.button>
              ))}
            </div>
          </div>

          {/* Top Rated Sidebar */}
          <div className="rounded-3xl glass overflow-hidden border-white/5 shadow-xl flex flex-col lg:col-span-2">
             <div className="p-8 border-b border-white/5 flex justify-between items-center bg-white/5">
                <h3 className="text-[10px] font-black uppercase tracking-widest text-white/30">Most Highly Rated</h3>
                <span 
                  onClick={() => navigate("/categories/top_rated")}
                  className="text-[9px] text-brand-red font-black cursor-pointer hover:opacity-80 tracking-widest"
                >
                  EXPLORE FULL LIST
                </span>
             </div>
             <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-8 flex-1">
                {topRated.slice(0, 6).map((m, i) => (
                  <div key={i} onClick={() => navigate(`/movie/${m.id}`)} className="flex gap-5 items-center group cursor-pointer hover:translate-x-2 transition-transform">
                    <div className="w-14 h-20 rounded-xl bg-white/5 overflow-hidden flex-shrink-0 group-hover:ring-2 ring-brand-red/30 transition-all shadow-xl">
                       <img 
                        src={`https://image.tmdb.org/t/p/w200${m.poster_path}`} 
                        className="w-full h-full object-cover transition-all duration-500 group-hover:scale-110" 
                        alt={m.title}
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1440404653325-ab127d49abc1?q=80&w=200";
                        }}
                      />
                    </div>
                    <div className="flex-1 overflow-hidden">
                      <div className="text-sm font-black truncate group-hover:text-brand-red transition-colors uppercase tracking-tight italic">{m.title}</div>
                      <div className="flex items-center gap-2 mt-1">
                        <div className="text-[10px] text-white/40 uppercase tracking-widest font-black">Score: {m.vote_average.toFixed(1)}</div>
                        <div className="h-1 w-1 rounded-full bg-white/10" />
                        <div className="text-[8px] bg-brand-red/10 text-brand-red px-1.5 py-0.5 rounded font-black">IMDb</div>
                      </div>
                    </div>
                  </div>
                ))}
             </div>
          </div>
        </div>

        {/* Dynamic Movie Sections */}
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={{
            hidden: { opacity: 0 },
            visible: {
              opacity: 1,
              transition: {
                staggerChildren: 0.2
              }
            }
          }}
          className="space-y-24"
        >
          <motion.div variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}>
            <MovieRow title="📺 Best on OTT (Streaming)" movies={ott} loading={loading} categoryId="ott" />
          </motion.div>
          <motion.div variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}>
            <MovieRow title="🇮🇳 Indian Cinema Gems" movies={indian} loading={loading} categoryId="indian" />
          </motion.div>
          <motion.div variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}>
            <MovieRow title="🔥 Trending This Week" movies={trending} loading={loading} categoryId="trending" />
          </motion.div>
          <motion.div variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}>
            <MovieRow title="🎬 Popular Worldwide" movies={popular} loading={loading} categoryId="popular" />
          </motion.div>
          <motion.div variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}>
            <MovieRow title="📅 Upcoming Releases" movies={upcoming} loading={loading} categoryId="upcoming" />
          </motion.div>
          <motion.div variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}>
            <MovieRow title="🍱 Anime Collection" movies={anime} loading={loading} categoryId="anime" />
          </motion.div>
          <motion.div variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}>
            <MovieRow title="🎎 Korean Drama Picks" movies={korean} loading={loading} categoryId="k-drama" />
          </motion.div>
          <motion.div variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}>
            <MovieRow title="💥 Action Packed" movies={action} loading={loading} categoryId="action" />
          </motion.div>
          <motion.div variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}>
            <MovieRow title="🚀 Sci-Fi Universe" movies={sciFi} loading={loading} categoryId="sci_fi" />
          </motion.div>
        </motion.div>
        
        {/* Load More Button Placeholder */}
        <div className="flex justify-center mt-12">
           <button 
            onClick={() => navigate("/categories")}
            className="glass border-white/5 px-12 py-4 rounded-full text-xs font-black uppercase tracking-widest hover:bg-white/5 transition-all text-white/40 hover:text-white"
           >
              Discover More
           </button>
        </div>
      </main>
    </div>
  );
}

function MovieRow({ title, movies, loading, categoryId }: { title: string; movies: Movie[]; loading: boolean; categoryId?: string }) {
  const navigate = useNavigate();
  return (
    <section className="mb-20">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-2xl font-black uppercase italic tracking-tight flex items-center gap-3">
          <div className="w-1.5 h-6 bg-brand-red rounded-full" />
          {title}
        </h2>
        <button 
          onClick={() => categoryId && navigate(`/categories/${categoryId}`)}
          className="text-[10px] text-white/30 font-black uppercase tracking-[0.2em] hover:text-brand-red transition-colors flex items-center gap-2 group"
        >
          Explore All <ChevronRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
        </button>
      </div>
      <div className="flex gap-6 overflow-x-auto pb-8 scrollbar-hide -mx-4 px-4 md:-mx-8 md:px-8 snap-x snap-mandatory">
        {loading ? Array(6).fill(0).map((_, i) => (
          <div key={i} className="min-w-[200px] md:min-w-[280px] snap-start">
            <SkeletonCard />
          </div>
        )) : movies.map((movie, index) => (
          <div key={movie.id} className="min-w-[200px] md:min-w-[280px] snap-start">
            <MovieCard movie={movie} index={index} />
          </div>
        ))}
      </div>
    </section>
  );
}

function SkeletonCard() {
  return (
    <div className="aspect-[2/3] bg-white/[0.03] rounded-2xl border border-white/5 animate-pulse" />
  );
}


