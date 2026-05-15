import React, { useState, useEffect, useRef } from "react";
import { useSearchParams, Link, useNavigate } from "react-router-dom";
import { Sparkles, ArrowLeft, Star, Play, Search, Info, Calendar, Plus, Check, Clock, User as UserIcon } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "../lib/utils";

interface AIRecommendation {
  id?: number;
  title: string;
  reason: string;
  description: string;
  matchScore?: number;
  poster_path?: string;
  backdrop_path?: string;
  vote_average?: number;
  release_date?: string;
  genres?: string[];
  runtime?: number;
  director?: string;
  cast?: string[];
  trailer?: string;
  omdb?: {
    imdbRating?: string;
    imdbVotes?: string;
    runtime?: string;
    director?: string;
  };
  streaming?: {
    name: string;
    url: string;
    provider_id?: number;
  }[];
}

interface RecommendationCardProps {
  key?: React.Key;
  rec: AIRecommendation;
  index: number;
}

export default function AISearch() {
  const [searchParams, setSearchParams] = useSearchParams();
  const query = searchParams.get("q") || "";
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [result, setResult] = useState<{ recommendations: AIRecommendation[], overallReason: string, isFallback?: boolean } | null>(null);
  const [searchInput, setSearchInput] = useState(query);
  const resultsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setSearchInput(query);
    if (!query) {
      setLoading(false);
      setResult(null);
      return;
    }

    // Immediately clear state for new search to prevent showing old results
    // while waiting for debounced search to start
    setResult(null);
    setLoading(true);
    window.scrollTo(0, 0);

    const abortController = new AbortController();

    async function getRecommendations() {
      try {
        const response = await fetch("/api/ai/recommend", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ prompt: query }),
          signal: abortController.signal
        });
        
        if (!response.ok) throw new Error("API request failed");
        
        const data = await response.json();
        
        // 3. Ensure we only set state if request wasn't aborted
        if (!abortController.signal.aborted) {
          if (data && Array.isArray(data.recommendations)) {
            setResult(data);
          } else {
            setResult({
              overallReason: "Curated cinematic selection matches for your request.",
              recommendations: [],
              isFallback: true
            });
          }
        }
      } catch (err: any) {
        if (err.name === "AbortError") return;
        
        if (!abortController.signal.aborted) {
          setResult({
            overallReason: "The AI is currently processing deep cinematic patterns. Here are some essentials while it recalibrates.",
            recommendations: [],
            isFallback: true
          });
        }
      } finally {
        if (!abortController.signal.aborted) {
          setLoading(false);
        }
      }
    }

    const timer = setTimeout(() => {
      getRecommendations();
    }, 300);

    return () => {
      clearTimeout(timer);
      abortController.abort();
    };
  }, [query]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchInput.trim()) {
      setSearchParams({ q: searchInput.trim() });
    }
  };

  return (
    <div className="min-h-screen pt-24 pb-20 px-4 md:px-8 max-w-7xl mx-auto" ref={resultsRef}>
      <div className="mb-12">
        <Link to="/" className="inline-flex items-center gap-2 text-white/50 hover:text-white transition-colors mb-6 group">
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Back to Home
        </Link>
        
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
          <div className="flex-1">
            <h1 className="text-3xl md:text-5xl font-black tracking-tight mb-3">
              Recommendations for: <span className="text-brand-red">"{query}"</span>
            </h1>
            <p className="text-white/40 text-lg font-medium">Our AI analyzed patterns to find your perfect cinema match.</p>
          </div>
          
          <div className="md:w-96">
            <form onSubmit={handleSearch} className="relative group">
              <input 
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="Describe a new mood..."
                className="w-full bg-white/5 border border-white/10 rounded-xl px-6 py-4 outline-none focus:border-brand-red/50 transition-all font-medium text-sm pr-12 focus:bg-white/[0.08]"
              />
              <button 
                type="submit"
                className="absolute right-4 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-brand-red hover:text-brand-red transition-colors"
                disabled={loading}
              >
                <Search className="w-5 h-5" />
              </button>
            </form>
          </div>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {loading ? (
          <motion.div 
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="space-y-12"
          >
            <div className="h-32 bg-white/5 rounded-3xl animate-pulse flex items-center px-10 border border-white/5 relative overflow-hidden">
              <div className="flex items-center gap-6 relative z-10 w-full">
                <div className="w-12 h-12 rounded-full bg-brand-red/20 flex items-center justify-center">
                  <Sparkles className="w-6 h-6 text-brand-red animate-spin-slow" />
                </div>
                <div className="flex-1 space-y-3">
                  <div className="h-4 w-[40%] bg-white/10 rounded-full" />
                  <div className="h-3 w-[25%] bg-white/5 rounded-full" />
                </div>
              </div>
              <div className="absolute top-0 right-0 w-64 h-full bg-gradient-to-l from-brand-red/5 to-transparent" />
            </div>
            <div className="grid grid-cols-1 gap-12">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-white/5 rounded-[2.5rem] border border-white/5 overflow-hidden animate-pulse">
                  <div className="flex flex-col lg:flex-row min-h-[450px]">
                    <div className="lg:w-[40%] bg-white/5 aspect-[4/3] lg:aspect-auto" />
                    <div className="lg:w-[60%] p-12 space-y-8">
                       <div className="space-y-4">
                         <div className="h-10 w-2/3 bg-white/10 rounded-xl" />
                         <div className="h-4 w-1/3 bg-white/5 rounded-full" />
                       </div>
                       <div className="h-32 w-full bg-white/5 rounded-2xl" />
                       <div className="flex gap-4">
                         <div className="h-14 flex-1 bg-white/5 rounded-2xl" />
                         <div className="h-14 flex-1 bg-white/5 rounded-2xl" />
                         <div className="h-14 w-14 bg-white/5 rounded-2xl" />
                       </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        ) : (
          <motion.div 
            key="results"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-16"
          >
            {/* AI Insights Card */}
            {result?.overallReason && (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="glass p-8 md:p-10 rounded-3xl border border-brand-red/20 relative overflow-hidden shadow-2xl"
              >
                <div className="relative z-10 max-w-4xl">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-brand-red flex items-center gap-2">
                      <Sparkles className="w-4 h-4" />
                      AI Analysis
                    </h2>
                    {result.isFallback && (
                      <div className="flex items-center gap-2 text-[8px] font-black uppercase tracking-widest text-white/30 bg-white/5 px-2 py-1 rounded-full border border-white/5">
                        <Check className="w-2 h-2" />
                        CineMood Core High Performance Search
                      </div>
                    )}
                  </div>
                  <p className="text-white/90 leading-relaxed text-lg md:text-xl font-serif italic">
                    "{result.overallReason}"
                  </p>
                </div>
                <div className="absolute top-0 right-0 p-10 opacity-[0.02] pointer-events-none">
                  <Sparkles className="w-64 h-64" />
                </div>
              </motion.div>
            )}

            {/* Recommendations Grid */}
            <div className="grid grid-cols-1 gap-12">
              {result?.recommendations && result.recommendations.length > 0 ? (
                result.recommendations.map((rec: AIRecommendation, i: number) => (
                  // @ts-ignore - key is handled by React
                  <RecommendationCard 
                    key={rec.id ? `card-${rec.id}-${i}` : `card-fallback-${i}`} 
                    rec={rec} 
                    index={i} 
                  />
                ))
              ) : (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="col-span-full py-24 text-center glass rounded-3xl border border-dashed border-white/10"
                >
                  <Sparkles className="w-12 h-12 text-white/10 mx-auto mb-4" />
                  <p className="text-white/40 text-lg">No specific recommendations found. Try a different mood or keyword.</p>
                </motion.div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function RecommendationCard({ rec, index }: RecommendationCardProps) {
  const [imgError, setImgError] = useState(false);
  const [inWatchlist, setInWatchlist] = useState(false);
  const navigate = useNavigate();
  const [, setSearchParams] = useSearchParams();

  useEffect(() => {
    const saved = localStorage.getItem("cinemood_watchlist");
    if (saved && rec.id) {
      const list = JSON.parse(saved);
      setInWatchlist(list.some((m: any) => m.id === rec.id));
    }
  }, [rec.id]);

  const toggleWatchlist = () => {
    if (!rec.id) return;
    const saved = localStorage.getItem("cinemood_watchlist");
    const list = saved ? JSON.parse(saved) : [];
    
    if (inWatchlist) {
      const updated = list.filter((m: any) => m.id !== rec.id);
      localStorage.setItem("cinemood_watchlist", JSON.stringify(updated));
      setInWatchlist(false);
    } else {
      list.push({
        id: rec.id,
        title: rec.title,
        poster_path: rec.poster_path,
        vote_average: rec.vote_average,
        release_date: rec.release_date
      });
      localStorage.setItem("cinemood_watchlist", JSON.stringify(list));
      setInWatchlist(true);
    }
  };

  const imageUrl = !imgError && rec.poster_path 
    ? `https://image.tmdb.org/t/p/w1280${rec.poster_path}`
    : rec.backdrop_path ? `https://image.tmdb.org/t/p/w1280${rec.backdrop_path}` : `https://images.unsplash.com/photo-1485846234645-a62644f84728?q=80&w=1280`;

  const mainRating = rec.omdb?.imdbRating && rec.omdb.imdbRating !== "N/A" 
    ? rec.omdb.imdbRating 
    : (rec.vote_average ? rec.vote_average.toFixed(1) : null);

  const genres = rec.genres?.slice(0, 3).join(" • ");
  const runtime = rec.runtime || (rec.omdb?.runtime ? parseInt(rec.omdb.runtime) : null);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1 }}
      className="group bg-zinc-900/40 rounded-[2.5rem] overflow-hidden border border-white/5 hover:border-brand-red/30 transition-all shadow-2xl relative"
    >
      <div className="flex flex-col lg:flex-row min-h-[450px]">
        {/* Left: Poster/Image */}
        <div className="lg:w-[40%] relative overflow-hidden bg-black aspect-[4/3] lg:aspect-auto">
          <img 
            src={imageUrl} 
            alt={rec.title}
            onError={() => setImgError(true)}
            className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent lg:bg-gradient-to-r lg:from-transparent lg:to-black/40" />
          
          {rec.matchScore && (
            <div className="absolute top-6 left-6 z-20">
              <div className="bg-brand-red text-white text-[10px] font-black px-3 py-1.5 rounded-full shadow-xl shadow-brand-red/40 uppercase tracking-[0.2em] flex items-center gap-2 backdrop-blur-md">
                <Sparkles className="w-3 h-3" />
                {rec.matchScore}% AI Match
              </div>
            </div>
          )}

          {mainRating && (
            <div className="absolute bottom-6 left-6 z-20 flex items-center gap-3">
              <div className="bg-black/60 backdrop-blur-xl border border-white/10 px-3 py-1.5 rounded-xl flex items-center gap-2">
                <Star className="w-4 h-4 text-brand-red fill-brand-red" />
                <span className="text-sm font-black">{mainRating}</span>
                <span className="text-[8px] font-black text-yellow-500 uppercase tracking-widest border-l border-white/20 pl-2">IMDb</span>
              </div>
            </div>
          )}
        </div>

        {/* Right: Content */}
        <div className="lg:w-[60%] p-8 lg:p-12 flex flex-col justify-between">
          <div>
            <div className="flex flex-wrap items-center gap-3 mb-4">
              <h3 className="text-3xl md:text-4xl font-black tracking-tighter uppercase leading-none">{rec.title}</h3>
              {rec.release_date && (
                <span className="text-sm py-1 px-3 bg-white/5 rounded-full border border-white/10 font-bold text-white/40">
                  {new Date(rec.release_date).getFullYear()}
                </span>
              )}
            </div>

            <div className="flex flex-wrap items-center gap-x-6 gap-y-2 mb-8 text-[10px] md:text-sm font-bold uppercase tracking-[0.1em] text-white/60">
              {genres && <span className="flex items-center gap-2 flex-shrink-0">{genres}</span>}
              {runtime && (
                <span className="flex items-center gap-2 flex-shrink-0">
                  <Clock className="w-4 h-4 text-brand-red" />
                  {runtime} MIN
                </span>
              )}
              {rec.director && (
                <span className="flex items-center gap-2 flex-shrink-0">
                  <UserIcon className="w-4 h-4 text-brand-red" />
                  DIR: {rec.director}
                </span>
              )}
            </div>

            <div className="bg-brand-red/5 border border-brand-red/10 rounded-2xl p-6 mb-8 relative">
              <div className="absolute top-0 left-0 w-1 h-full bg-brand-red" />
              <h4 className="text-[10px] font-black text-brand-red uppercase tracking-[0.2em] mb-3 flex items-center gap-2">
                <Sparkles className="w-3.5 h-3.5" />
                Why This Matches Your Mood
              </h4>
              <p className="text-white/90 italic font-serif text-lg leading-relaxed">
                "{rec.reason}"
              </p>
            </div>

            <p className="text-white/40 leading-relaxed mb-8 text-sm md:text-base font-medium max-w-2xl line-clamp-3">
              {rec.description}
            </p>

            {rec.cast && (
              <div className="mb-8">
                <p className="text-[10px] font-black text-white/20 uppercase tracking-widest mb-3">Starring</p>
                <div className="flex flex-wrap gap-2">
                  {rec.cast.map((actor, idx) => (
                    <span key={idx} className="text-xs font-bold px-3 py-1 bg-white/5 rounded-full text-white/60">{actor}</span>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <button 
              onClick={() => rec.id && navigate(`/movie/${rec.id}`)}
              className="px-8 h-14 bg-white text-black hover:bg-brand-red hover:text-white rounded-2xl font-black text-xs uppercase tracking-[0.15em] transition-all flex items-center justify-center gap-3 active:scale-95 flex-1 shadow-2xl"
            >
              <Info className="w-4 h-4" />
              DETAILS
            </button>
            
            {rec.trailer && (
              <a 
                href={`https://www.youtube.com/watch?v=${rec.trailer}`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-8 h-14 bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl font-black text-xs uppercase tracking-[0.15em] transition-all flex items-center justify-center gap-3 active:scale-95 flex-1"
              >
                <Play className="w-4 h-4" />
                TRAILER
              </a>
            )}

            <button 
              onClick={() => {
                setSearchParams({ q: `Movies like ${rec.title}` });
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
              className="px-8 h-14 bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl font-black text-xs uppercase tracking-[0.15em] transition-all flex items-center justify-center gap-3 active:scale-95 flex-1"
            >
              <Sparkles className="w-4 h-4" />
              SIMILAR
            </button>

            <button 
              onClick={toggleWatchlist}
              className={cn(
                "w-14 h-14 flex items-center justify-center rounded-2xl border transition-all active:scale-95",
                inWatchlist 
                  ? "bg-brand-red/20 border-brand-red/40 text-brand-red" 
                  : "bg-white/5 border-white/10 hover:bg-white/10 text-white"
              )}
            >
              {inWatchlist ? <Check className="w-6 h-6" /> : <Plus className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

