import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Hero from "@/src/components/Movie/Hero";
import MovieCard, { Movie } from "@/src/components/Movie/MovieCard";
import { Smile, Zap, Heart, Ghost, Rocket, Flame, MoreHorizontal, ChevronRight, Sparkles, Film, Info, Play, Plus } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

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

  // Tonight's AI Selection State
  const [aiPick, setAiPick] = useState<any>(null);
  const [aiLoading, setAiLoading] = useState(true);
  const [showAiReason, setShowAiReason] = useState(false);

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

    async function fetchAiPick() {
      setAiLoading(true);
      try {
        const res = await fetch("/api/movies/ai-pick");
        const data = await res.json();
        setAiPick(data);
      } catch (err) {
        console.error(err);
      } finally {
        setAiLoading(false);
      }
    }

    fetchData();
    fetchAiPick();
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
        {/* Clean Bento Grid Layout */}
        <div className="grid grid-cols-12 auto-rows-[120px] gap-4 mb-24">
          {/* Main Discovery */}
          <section 
            onClick={() => {
              const dune = popular.find(m => m.title.includes("Dune")) || trending[0];
              if (dune) navigate(`/movie/${dune.id}`);
            }}
            className="col-span-12 lg:col-span-8 row-span-4 rounded-3xl relative overflow-hidden glass border-white/5 shadow-2xl group cursor-pointer"
          >
             <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent z-10" />
             <div className="absolute inset-0 z-0">
               <img 
                src="https://images.unsplash.com/photo-1542204111-970c922ed73c?q=80&w=2500" 
                className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                alt="Featured movie"
               />
             </div>
             <div className="absolute bottom-10 left-10 z-20 max-w-md">
                <div className="flex gap-2 mb-4">
                  <span className="bg-brand-red text-[9px] px-2.5 py-1 rounded-md font-black uppercase tracking-widest shadow-lg shadow-brand-red/20">Featured</span>
                  <span className="bg-white/10 backdrop-blur-md text-[9px] px-2.5 py-1 rounded-md uppercase tracking-widest font-bold border border-white/10">Must Watch</span>
                </div>
                <h2 className="text-4xl md:text-5xl font-black mb-4 tracking-tight uppercase italic drop-shadow-lg leading-tight">DUNE: <br />PART TWO</h2>
                <p className="text-white/60 text-sm line-clamp-2 mb-8 leading-relaxed font-medium">Paul Atreides unites with Chani and the Fremen while on a warpath of revenge against the conspirators.</p>
                <div className="flex gap-3">
                  <button className="bg-white text-black px-6 py-2.5 rounded-full text-xs font-black shadow-xl hover:bg-brand-red hover:text-white transition-all">PLAY NOW</button>
                  <button className="bg-white/5 border border-white/10 backdrop-blur-md text-white px-6 py-2.5 rounded-full text-xs font-bold hover:bg-white/10 transition-all">+ WATCHLIST</button>
                </div>
             </div>
          </section>

          {/* AI Pickup Card */}
          <div className="col-span-12 md:col-span-6 lg:col-span-4 row-span-4 rounded-3xl glass p-8 flex flex-col justify-between border-white/5 shadow-xl relative overflow-hidden group">
            <div className="relative z-10 h-full flex flex-col">
              <div className="flex justify-between items-start mb-6">
                <h3 className="text-[10px] font-black uppercase tracking-widest text-white/30 flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-brand-red shadow-[0_0_8px_#E50914] animate-pulse" />
                  Tonight's AI Selection
                </h3>
                {aiPick?.matchScore && (
                  <div className="bg-brand-red/10 text-brand-red px-2 py-1 rounded text-[8px] font-black uppercase tracking-tighter border border-brand-red/20">
                    {aiPick.matchScore}% Match
                  </div>
                )}
              </div>
              
              {aiLoading ? (
                <div className="flex-1 flex flex-col justify-center py-6 gap-4">
                  <div className="h-10 w-3/4 bg-white/5 rounded-lg animate-pulse" />
                  <div className="h-4 w-full bg-white/5 rounded-lg animate-pulse" />
                  <div className="h-4 w-2/3 bg-white/5 rounded-lg animate-pulse" />
                </div>
              ) : aiPick ? (
                <div 
                  onClick={() => navigate(`/movie/${aiPick.movie.id}`)}
                  className="flex-1 flex flex-col justify-center py-4 cursor-pointer"
                >
                  <div className="text-2xl font-black uppercase italic tracking-tight text-white/90 mb-2 group-hover:text-brand-red transition-colors">
                    {aiPick.movie.title}
                  </div>
                  <div className="text-[9px] font-black text-white/40 uppercase tracking-widest mb-4 flex items-center gap-2">
                    {aiPick.movie.release_date?.split("-")[0]} • {aiPick.movie.runtime}m • {aiPick.movie.omdb?.imdbRating || aiPick.movie.vote_average.toFixed(1)} IMDb
                  </div>
                  <p className="text-xs text-white/60 leading-relaxed font-medium line-clamp-3 mb-6 italic">
                    "{aiPick.reason}"
                  </p>
                  
                  <div 
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowAiReason(!showAiReason);
                    }}
                    className="flex items-center gap-2 text-[8px] font-black uppercase tracking-widest text-brand-red cursor-pointer hover:opacity-80 transition-opacity mb-4"
                  >
                    <Info className="w-3 h-3" />
                    Why AI Picked This?
                  </div>

                  <AnimatePresence>
                    {showAiReason && (
                      <motion.div 
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden mb-4"
                      >
                        <p className="text-[10px] text-white/40 leading-relaxed border-l-2 border-brand-red/30 pl-3 py-1">
                          Our analysis of your cinematic footprint identifies deep thematic alignment with this film's narrative structure and visual vocabulary.
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : null}

              <div className="mt-auto pt-4 border-t border-white/5">
                {aiLoading ? (
                  <div className="h-16 w-full bg-white/5 rounded-2xl animate-pulse" />
                ) : aiPick ? (
                  <div 
                    onClick={() => navigate(`/movie/${aiPick.movie.id}`)}
                    className="bg-white/5 rounded-2xl p-4 flex gap-4 items-center border border-white/5 hover:bg-white/10 transition-all cursor-pointer group active:scale-95"
                  >
                    <div className="w-12 h-16 rounded-lg bg-zinc-800 overflow-hidden shadow-lg flex-shrink-0 border border-white/10">
                      <img 
                        src={`https://image.tmdb.org/t/p/w200${aiPick.movie.poster_path}`} 
                        className="w-full h-full object-cover grayscale brightness-75 group-hover:grayscale-0 group-hover:brightness-100 transition-all" 
                        alt={aiPick.movie.title}
                        onError={(e) => (e.currentTarget.src = "https://images.unsplash.com/photo-1485846234645-a62644f84728?q=80&w=200")}
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-black truncate uppercase tracking-tighter truncate">{aiPick.movie.title}</div>
                      <div className="text-[8px] text-white/30 font-black uppercase tracking-widest truncate">{aiPick.movie.omdb?.director || "Directed by A.I."}</div>
                    </div>
                    <div className="flex gap-2">
                       {aiPick.movie.videos?.results?.find((v: any) => v.type === "Trailer") && (
                         <button 
                           onClick={(e) => {
                             e.stopPropagation();
                             const trailer = aiPick.movie.videos.results.find((v: any) => v.type === "Trailer");
                             window.open(`https://www.youtube.com/watch?v=${trailer.key}`, "_blank");
                           }}
                           className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-white/20 transition-all border border-white/10"
                           title="Watch Trailer"
                         >
                            <Play className="w-3 h-3 fill-current" />
                         </button>
                       )}
                    </div>
                  </div>
                ) : null}
              </div>
            </div>
          </div>

          {/* Mood Selector */}
          <div className="col-span-12 md:col-span-6 lg:col-span-4 row-span-4 rounded-3xl glass p-6 border-white/5 shadow-xl flex flex-col">
            <h3 className="text-[10px] font-black uppercase tracking-widest text-white/20 mb-5 flex items-center justify-between">
              Select Mood
              <Sparkles className="w-3 h-3 text-brand-red" />
            </h3>
            <div className="grid grid-cols-3 gap-2 flex-1">
              {moods.map((mood, idx) => (
                <motion.button 
                  key={mood.id} 
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: idx * 0.05 }}
                  onClick={() => handleMoodClick(mood.id)}
                  className="bg-white/5 border border-white/5 rounded-2xl p-3 flex flex-col items-center justify-center gap-2 hover:bg-brand-red/10 hover:border-brand-red/20 transition-all group active:scale-95 hover:shadow-[0_0_20px_rgba(229,9,20,0.1)]"
                >
                   <mood.icon className={`w-5 h-5 ${mood.color} opacity-40 group-hover:opacity-100 group-hover:scale-110 transition-all`} />
                   <span className="text-[8px] uppercase font-black tracking-widest opacity-30 group-hover:opacity-100 group-hover:text-white transition-all">{mood.name}</span>
                </motion.button>
              ))}
            </div>
          </div>

          {/* Top Rated Sidebar */}
          <div className="col-span-12 lg:col-span-4 row-span-3 rounded-3xl glass overflow-hidden border-white/5 shadow-xl flex flex-col">
             <div className="p-6 border-b border-white/5 flex justify-between items-center bg-white/5">
                <h3 className="text-[10px] font-black uppercase tracking-widest text-white/30">Top Rated Hits</h3>
                <span className="text-[9px] text-brand-red font-black cursor-pointer hover:opacity-80">SEE ALL</span>
             </div>
             <div className="p-6 space-y-6 flex-1 overflow-y-auto scrollbar-hide">
                {topRated.slice(0, 4).map((m, i) => (
                  <div key={i} onClick={() => navigate(`/movie/${m.id}`)} className="flex gap-4 items-center group cursor-pointer hover:translate-x-1 transition-transform">
                    <div className="w-10 h-14 rounded-lg bg-white/5 overflow-hidden flex-shrink-0 group-hover:ring-1 ring-brand-red/30 transition-all shadow-md">
                       <img 
                        src={`https://image.tmdb.org/t/p/w200${m.poster_path}`} 
                        className="w-full h-full object-cover grayscale brightness-75 group-hover:grayscale-0 group-hover:brightness-100 transition-all" 
                        alt={m.title}
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1440404653325-ab127d49abc1?q=80&w=200";
                        }}
                      />
                    </div>
                    <div className="flex-1 overflow-hidden">
                      <div className="text-xs font-bold truncate group-hover:text-brand-red transition-colors uppercase tracking-tight">{m.title}</div>
                      <div className="text-[9px] text-white/30 uppercase tracking-widest font-bold mt-0.5">Rating: {m.vote_average.toFixed(1)}</div>
                    </div>
                  </div>
                ))}
             </div>
          </div>

          {/* Feature Card */}
          <div className="col-span-12 md:col-span-6 lg:col-span-4 row-span-4 rounded-3xl relative overflow-hidden group shadow-2xl border border-white/5">
            <div className="absolute inset-0 bg-gradient-to-br from-[#111] via-black to-black z-10" />
            <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&q=80&w=400')] bg-cover opacity-20 filter grayscale transition-transform duration-[3000ms] group-hover:scale-110" />
            <div className="absolute inset-0 flex flex-col justify-center items-center text-center p-8 z-20">
              <div className="text-brand-red mb-6 opacity-40 group-hover:scale-110 transition-transform">
                <Flame className="w-10 h-10" />
              </div>
              <h4 className="text-xl font-black uppercase tracking-widest mb-3 italic">Cinema Quiz</h4>
              <p className="text-[10px] text-white/30 mb-8 max-w-[180px] leading-relaxed uppercase font-bold tracking-widest italic">Prove your mastery of the silver screen</p>
              <button className="bg-white/5 border border-white/10 hover:bg-brand-red hover:text-white hover:border-brand-red text-white px-10 py-3 rounded-full text-[10px] font-black tracking-widest transition-all shadow-xl active:scale-95">
                START CHALLENGE
              </button>
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


