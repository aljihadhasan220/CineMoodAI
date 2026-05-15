import { useParams, Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { Play, Plus, Share2, Star, Clock, Calendar, Film, ChevronRight } from "lucide-react";
import { motion } from "motion/react";
import { Movie } from "@/src/components/Movie/MovieCard";

export default function MovieDetails() {
  const { id } = useParams();
  const [movie, setMovie] = useState<Movie | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchMovie() {
      // For now, reuse the popular endpoint to find the movie or just mock it
      try {
        const res = await fetch(`/api/movies/popular`);
        const data = await res.json();
        const found = data.results.find((m: Movie) => m.id === Number(id));
        setMovie(found || data.results[0]);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchMovie();
    window.scrollTo(0, 0);
  }, [id]);

  if (loading) return <div className="h-screen flex items-center justify-center font-bold text-2xl animate-pulse">CINE<span className="text-brand-red">MOOD</span></div>;
  if (!movie) return <div className="h-screen flex items-center justify-center">Movie not found</div>;

  return (
    <div className="relative pb-20">
      {/* Dynamic Hero Banner */}
      <div className="relative h-[70vh] w-full overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-[#050505]/40 to-transparent z-10" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#050505] via-transparent to-[#050505] z-10" />
        <img 
          src={movie.backdrop_path?.startsWith("http") ? movie.backdrop_path : `https://image.tmdb.org/t/p/original${movie.backdrop_path}`} 
          alt={movie.title}
          className="w-full h-full object-cover scale-105 animate-pulse-slow opacity-60"
        />
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-8 -mt-64 relative z-20">
        <div className="flex flex-col lg:flex-row gap-12">
          {/* Left: Poster */}
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            className="w-full max-w-[340px] hidden lg:block"
          >
            <div className="rounded-3xl overflow-hidden shadow-2xl border border-white/10 ring-4 ring-white/5 shadow-brand-red/10">
              <img 
                src={movie.poster_path.startsWith("http") ? movie.poster_path : `https://image.tmdb.org/t/p/w500${movie.poster_path}`} 
                alt={movie.title}
                className="w-full object-cover"
              />
            </div>
          </motion.div>

          {/* Right: Info */}
          <div className="flex-1 pt-10">
            <div className="flex flex-wrap items-center gap-3 mb-6">
              <div className="bg-brand-red px-4 py-1.5 rounded-full text-xs font-black tracking-widest uppercase">
                Trending #1
              </div>
              <div className="glass px-4 py-1.5 rounded-full text-xs font-bold flex items-center gap-2">
                <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />
                {movie.vote_average.toFixed(1)} / 10
              </div>
              <div className="glass px-4 py-1.5 rounded-full text-xs font-bold flex items-center gap-2">
                <Clock className="w-3 h-3" />
                142 MIN
              </div>
            </div>

            <motion.h1 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-5xl md:text-7xl font-black mb-6 tracking-tighter"
            >
              {movie.title}
            </motion.h1>

            <p className="text-white/60 text-lg md:text-xl leading-relaxed mb-10 max-w-3xl">
              {movie.overview}
            </p>

            <div className="flex flex-wrap gap-4 mb-16">
              <button className="bg-brand-red hover:bg-red-700 text-white px-10 py-4 rounded-2xl font-black flex items-center gap-3 shadow-xl shadow-brand-red/30 transition-all hover:scale-105 active:scale-95 group">
                <Play className="w-6 h-6 fill-white" />
                WATCH TRAILER
              </button>
              <button className="glass hover:bg-white/10 px-8 py-4 rounded-2xl font-bold flex items-center gap-3 border border-white/10 transition-all">
                <Plus className="w-6 h-6" />
                WATCHLIST
              </button>
              <button className="glass hover:bg-white/10 w-16 h-16 rounded-2xl flex items-center justify-center transition-all">
                <Share2 className="w-6 h-6" />
              </button>
            </div>

            {/* Cast / Meta Section */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 pt-8 border-t border-white/5">
              <MetaItem label="RELEASE DATE" value={new Date(movie.release_date).toLocaleDateString()} />
              <MetaItem label="DIRECTOR" value="Christopher Nolan" />
              <MetaItem label="GENRES" value="Sci-Fi, Adventure" />
              <MetaItem label="BUDGET" value="$165 Million" />
            </div>
          </div>
        </div>

        {/* Similar Movies Section */}
        <section className="mt-32">
          <div className="flex items-center justify-between mb-12">
            <div>
              <h2 className="text-3xl font-black tracking-tight mb-2 uppercase italic flex items-center gap-3">
                <Film className="text-brand-red" /> More Like This
              </h2>
              <div className="h-1 w-20 bg-brand-red rounded-full" />
            </div>
            <button className="text-white/40 hover:text-white flex items-center gap-2 group font-bold">
              VIEW RECOMMENDATIONS
              <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-6">
            {/* We'll just show placeholders or popular movies as similar for now */}
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="aspect-[2/3] bg-white/5 rounded-2xl border border-white/5 animate-pulse" />
            ))}
          </div>
        </section>
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
