import { useParams, Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { Play, Plus, Share2, Star, Clock, Calendar, Film, ChevronRight, Sparkles } from "lucide-react";
import { motion } from "motion/react";
import MovieCard from "@/src/components/Movie/MovieCard";
import { cn } from "@/src/lib/utils";

export default function MovieDetails() {
  const { id } = useParams();
  const [movie, setMovie] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [inWatchlist, setInWatchlist] = useState(false);

  useEffect(() => {
    async function fetchMovie() {
      try {
        const res = await fetch(`/api/movie/${id}`);
        const data = await res.json();
        setMovie(data);
        
        // Check watchlist
        const saved = localStorage.getItem("cinemood_watchlist");
        if (saved) {
          const list = JSON.parse(saved);
          setInWatchlist(list.some((m: any) => m.id === parseInt(id || "0")));
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchMovie();
    window.scrollTo(0, 0);
  }, [id]);

  const toggleWatchlist = () => {
    const saved = localStorage.getItem("cinemood_watchlist");
    const list = saved ? JSON.parse(saved) : [];
    
    if (inWatchlist) {
      const updated = list.filter((m: any) => m.id !== movie.id);
      localStorage.setItem("cinemood_watchlist", JSON.stringify(updated));
      setInWatchlist(false);
    } else {
      list.push({
        id: movie.id,
        title: movie.title,
        poster_path: movie.poster_path,
        vote_average: movie.vote_average,
        release_date: movie.release_date
      });
      localStorage.setItem("cinemood_watchlist", JSON.stringify(list));
      setInWatchlist(true);
    }
  };

  if (loading) return <div className="h-screen bg-black flex items-center justify-center font-black text-4xl animate-pulse tracking-tighter">CINE<span className="text-brand-red">MOOD</span></div>;
  if (!movie) return <div className="h-screen bg-black flex items-center justify-center text-white/40 uppercase font-black tracking-widest text-xs">Analysis Failed • Movie Not Found</div>;

  const trailer = movie.videos?.results?.find((v: any) => v.type === "Trailer");

  return (
    <div className="relative pb-20">
      {/* Dynamic Hero Banner */}
      <div className="relative h-[75vh] w-full overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-[#050505]/60 to-transparent z-10" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#050505] via-transparent to-[#050505] z-10" />
        <motion.img 
          initial={{ scale: 1.2, opacity: 0 }}
          animate={{ scale: 1.05, opacity: 0.5 }}
          transition={{ duration: 2, ease: "easeOut" }}
          src={movie.backdrop_path ? `https://image.tmdb.org/t/p/original${movie.backdrop_path}` : "https://images.unsplash.com/photo-1536440136628-849c177e76a1?q=80&w=1000"} 
          alt={movie.title}
          className="w-full h-full object-cover grayscale brightness-75"
        />
        <div className="absolute inset-0 z-10 hero-gradient opacity-30" />
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-8 -mt-64 relative z-20">
        <div className="flex flex-col lg:flex-row gap-12">
          {/* Left: Poster */}
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            className="w-full max-w-[340px] hidden lg:block"
          >
            <div className="rounded-3xl overflow-hidden shadow-2xl border border-white/10 ring-4 ring-white/5 shadow-brand-red/10 aspect-[2/3]">
              <img 
                src={movie.poster_path ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` : "https://images.unsplash.com/photo-1440404653325-ab127d49abc1?q=80&w=1000"} 
                alt={movie.title}
                className="w-full h-full object-cover"
              />
            </div>
          </motion.div>

          {/* Right: Info */}
          <div className="flex-1 pt-10">
            <div className="flex flex-wrap items-center gap-3 mb-6">
               <div className="bg-brand-red/20 text-brand-red border border-brand-red/30 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
                  AI RECOMMENDATION
               </div>
              {movie.omdb?.imdbRating && movie.omdb.imdbRating !== "N/A" && (
                <div className="glass px-4 py-1.5 rounded-full text-xs font-bold flex items-center gap-2 border border-white/5 bg-yellow-500/10">
                  <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />
                  IMDb: {movie.omdb.imdbRating}
                </div>
              )}
              {movie.omdb?.metascore && movie.omdb.metascore !== "N/A" && (
                <div className={cn(
                  "glass px-4 py-1.5 rounded-full text-xs font-black border border-white/5",
                  parseInt(movie.omdb.metascore) >= 60 ? "text-green-500" : "text-yellow-500"
                )}>
                  {movie.omdb.metascore} METASCORE
                </div>
              )}
              {movie.runtime > 0 && (
                <div className="glass px-4 py-1.5 rounded-full text-xs font-bold flex items-center gap-2">
                  <Clock className="w-3 h-3" />
                  {movie.runtime} MIN
                </div>
              )}
              <div className="glass px-4 py-1.5 rounded-full text-xs font-bold flex items-center gap-2">
                <Calendar className="w-3 h-3" />
                {new Date(movie.release_date).getFullYear()}
              </div>
              {movie.omdb?.rated && movie.omdb.rated !== "N/A" && (
                <div className="glass px-4 py-1.5 rounded-full text-[10px] font-black border border-white/10 uppercase">
                  {movie.omdb.rated}
                </div>
              )}
            </div>

            <motion.h1 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-5xl md:text-7xl font-black mb-4 tracking-tighter uppercase italic"
            >
              {movie.title}
            </motion.h1>

            {movie.omdb?.awards && movie.omdb.awards !== "N/A" && (
              <p className="text-brand-red text-sm font-black uppercase tracking-widest mb-6 flex items-center gap-2">
                <Sparkles className="w-4 h-4" />
                {movie.omdb.awards}
              </p>
            )}

            <p className="text-white/60 text-lg md:text-xl leading-relaxed mb-10 max-w-3xl">
              {movie.overview}
            </p>

            {movie.streaming && movie.streaming.length > 0 && (
              <div className="mb-12">
                <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-white/30 mb-4">STREAMING ON</h3>
                <div className="flex flex-wrap gap-4">
                  {movie.streaming.map((s: any, i: number) => (
                    <a 
                      key={i}
                      href={s.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="glass hover:bg-white/5 px-4 py-3 rounded-xl flex items-center gap-3 border border-white/5 group transition-all"
                    >
                      <div className="w-8 h-8 rounded-lg bg-brand-red flex items-center justify-center text-[10px] font-black text-white shadow-lg shadow-brand-red/20 group-hover:scale-110 transition-transform">
                        {s.name.substring(0, 1)}
                      </div>
                      <div className="flex flex-col">
                        <span className="text-xs font-black uppercase leading-none mb-1">{s.name}</span>
                        <span className="text-[8px] font-bold text-white/30 uppercase tracking-tighter">WATCH NOW</span>
                      </div>
                    </a>
                  ))}
                </div>
              </div>
            )}

            <div className="flex flex-col sm:flex-row flex-wrap items-center gap-4 mb-16">
              {trailer && (
                <motion.a 
                  whileHover={{ scale: 1.05, boxShadow: "0 0 30px rgba(229, 9, 20, 0.4)" }}
                  whileTap={{ scale: 0.95 }}
                  href={`https://www.youtube.com/watch?v=${trailer.key}`} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="bg-brand-red text-white px-10 h-16 rounded-2xl font-black flex items-center justify-center gap-3 shadow-2xl shadow-brand-red/30 transition-all group w-full sm:w-auto min-w-[240px] uppercase tracking-[0.1em] text-sm"
                >
                  <Play className="w-5 h-5 fill-white" />
                  WATCH TRAILER
                </motion.a>
              )}
              
              <motion.button 
                whileHover={{ scale: 1.05, backgroundColor: "rgba(255, 255, 255, 0.1)" }}
                whileTap={{ scale: 0.95 }}
                onClick={toggleWatchlist}
                className={cn(
                  "px-8 h-16 rounded-2xl font-black flex items-center justify-center gap-3 border backdrop-blur-md transition-all uppercase tracking-[0.1em] text-sm w-full sm:w-auto min-w-[180px]",
                  inWatchlist 
                    ? "bg-brand-red/20 border-brand-red/40 text-brand-red shadow-lg shadow-brand-red/10" 
                    : "bg-white/5 border-white/10 text-white"
                )}
              >
                {inWatchlist ? <Star className="w-5 h-5 fill-brand-red" /> : <Plus className="w-5 h-5" />}
                {inWatchlist ? "SAVED" : "WATCHLIST"}
              </motion.button>
              
              <motion.button 
                whileHover={{ scale: 1.05, backgroundColor: "rgba(124, 58, 237, 0.2)", borderColor: "rgba(124, 58, 237, 0.4)" }}
                whileTap={{ scale: 0.95 }}
                className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 text-white flex items-center justify-center backdrop-blur-md transition-all group hidden sm:flex"
              >
                <Share2 className="w-5 h-5 group-hover:text-brand-red transition-colors" />
              </motion.button>
            </div>

            {/* Cast / Meta Section */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 pt-8 border-t border-white/5">
              <MetaItem label="DIRECTOR" value={movie.omdb?.director || movie.credits?.crew?.find((c: any) => c.job === "Director")?.name || "N/A"} />
              <MetaItem label="GENRES" value={movie.genres?.map((g: any) => g.name).join(", ") || "N/A"} />
              <MetaItem label="STARRING" value={movie.omdb?.actors || movie.credits?.cast?.slice(0, 3).map((c: any) => c.name).join(", ") || "N/A"} />
              <MetaItem label="BOX OFFICE" value={movie.omdb?.boxOffice && movie.omdb.boxOffice !== "N/A" ? movie.omdb.boxOffice : (movie.revenue > 0 ? `$${(movie.revenue / 1000000).toFixed(1)}M` : "N/A")} />
            </div>
          </div>
        </div>

        {/* Similar Movies Section (TMDB) */}
        {movie.similar?.results?.length > 0 && (
          <section className="mt-32">
            <div className="flex items-center justify-between mb-12">
              <div>
                <h2 className="text-3xl font-black tracking-tight mb-2 uppercase italic flex items-center gap-3">
                  <Film className="text-brand-red" /> More Like This
                </h2>
                <div className="h-1 w-20 bg-brand-red rounded-full" />
              </div>
              <Link to="/" className="text-white/40 hover:text-white flex items-center gap-2 group font-bold text-xs uppercase tracking-widest">
                BACK TO HOME
                <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-6">
              {movie.similar.results.slice(0, 5).map((m: any, index: number) => (
                <MovieCard key={m.id} movie={m} index={index} />
              ))}
            </div>
          </section>
        )}

        {/* TasteDive "If You Liked This" Section */}
        {movie.tastedive_similar?.length > 0 && (
          <section className="mt-32">
            <div className="flex items-center justify-between mb-12">
              <div>
                <h2 className="text-3xl font-black tracking-tight mb-2 uppercase italic flex items-center gap-3">
                  <Sparkles className="text-brand-red" /> If You Liked This
                </h2>
                <p className="text-[10px] font-black tracking-widest text-white/30 uppercase mt-2">AI-Powered Taste Matching</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {movie.tastedive_similar.slice(0, 4).map((m: any, i: number) => (
                <motion.div 
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="glass p-6 rounded-2xl border border-white/5 hover:border-brand-red/30 transition-all flex gap-6 group"
                >
                  <div className="w-24 h-32 rounded-xl bg-white/5 overflow-hidden flex-shrink-0 border border-white/5 relative">
                     <div className="absolute inset-0 flex items-center justify-center">
                        <Film className="w-8 h-8 text-white/10" />
                     </div>
                     <img 
                        src={`https://images.unsplash.com/photo-1485846234645-a62644f84728?q=80&w=200`} 
                        alt={m.Name}
                        className="w-full h-full object-cover grayscale opacity-40 group-hover:grayscale-0 group-hover:opacity-100 transition-all"
                     />
                  </div>
                  <div className="flex-1 flex flex-col">
                    <h4 className="text-lg font-black uppercase tracking-tight mb-2 group-hover:text-brand-red transition-colors">{m.Name}</h4>
                    <p className="text-xs text-white/40 leading-relaxed line-clamp-3 mb-4">{m.Teaser || "Analysis of cinematic patterns suggests this will match your specific taste profile."}</p>
                    <div className="mt-auto">
                      <button className="text-[9px] font-black uppercase tracking-widest text-brand-red flex items-center gap-2 hover:translate-x-1 transition-transform">
                        EXPLORE SIMILAR <ChevronRight className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}

function MetaItem({ label, value }: { label: string, value: string }) {
  return (
    <div>
      <p className="text-[10px] font-bold text-white/30 uppercase tracking-[0.2em] mb-1">{label}</p>
      <p className="font-semibold text-white/80">{value}</p>
    </div>
  );
}
