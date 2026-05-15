import React from "react";
import { Star, Play, Plus, Clock, Calendar } from "lucide-react";
import { motion } from "motion/react";
import { Link } from "react-router-dom";

export interface Movie {
  id: number;
  title: string;
  poster_path: string;
  vote_average: number;
  release_date: string;
  overview?: string;
  backdrop_path?: string;
  omdb?: {
    imdbRating?: string;
    imdbVotes?: string;
    awards?: string;
    director?: string;
    rated?: string;
  };
  streaming?: {
    name: string;
    url: string;
    provider_id?: number;
  }[];
}

interface MovieCardProps {
  movie: Movie;
  index?: number;
  key?: React.Key;
}

export default function MovieCard({ movie, index = 0 }: MovieCardProps) {
  const [imgError, setImgError] = React.useState(false);

  const imageUrl = movie.poster_path && !imgError ? (movie.poster_path.startsWith("http") 
    ? movie.poster_path 
    : `https://image.tmdb.org/t/p/w500${movie.poster_path}`) : "https://images.unsplash.com/photo-1440404653325-ab127d49abc1?q=80&w=1000";

  const mainRating = movie.omdb?.imdbRating && movie.omdb.imdbRating !== "N/A" 
    ? movie.omdb.imdbRating 
    : movie.vote_average.toFixed(1);

  const isImdb = !!(movie.omdb?.imdbRating && movie.omdb.imdbRating !== "N/A");

  const matchScore = (movie as any).match_score;

  return (
    <Link to={`/movie/${movie.id}`} className="block group">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: (index % 5) * 0.05, duration: 0.4 }}
        whileHover={{ y: -5, transition: { duration: 0.2 } }}
        className="relative bg-zinc-900 rounded-xl overflow-hidden shadow-xl border border-white/5 hover:border-brand-red/30 transition-all cursor-pointer h-full"
      >
        {/* AI Match Badge */}
        {matchScore && (
          <div className="absolute top-3 left-3 z-20 bg-brand-red text-white text-[7px] font-black px-1.5 py-0.5 rounded shadow-lg">
            {matchScore}% MATCH
          </div>
        )}
        
        {/* Poster Image */}
        <div className="aspect-[2/3] overflow-hidden relative">
          <img 
            src={imageUrl} 
            alt={movie.title}
            loading="lazy"
            onError={() => setImgError(true)}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110 group-hover:brightness-[0.4]"
          />
        </div>

        {/* Ratings Badge */}
        <div className="absolute top-3 right-3 bg-black/60 backdrop-blur-md px-2 py-1 rounded-lg flex items-center gap-1 z-10 border border-white/10">
          <Star className="w-2.5 h-2.5 text-brand-red fill-brand-red" />
          <div className="flex flex-col items-center">
            <span className="text-[9px] font-black leading-none">{mainRating}</span>
            {isImdb && <span className="text-[6px] font-bold text-yellow-500 uppercase tracking-tighter opacity-80">IMDb</span>}
          </div>
        </div>

        {/* Hover Content */}
        <div className="absolute inset-0 p-5 flex flex-col justify-end opacity-0 group-hover:opacity-100 transition-all duration-300">
          <div className="space-y-4">
            <h3 className="text-lg font-black leading-tight tracking-tight uppercase">
              {movie.title}
            </h3>
            
            <div className="flex items-center gap-3 text-[9px] text-white/50 uppercase tracking-widest font-bold">
              <span>{movie.release_date ? new Date(movie.release_date).getFullYear() : "N/A"}</span>
              <span className="w-1 h-1 rounded-full bg-brand-red" />
              <span>{movie.vote_average > 7 ? "Highly Rated" : "Popular"}</span>
            </div>

            {movie.streaming && movie.streaming.length > 0 && (
              <div className="flex flex-wrap gap-1.5">
                {movie.streaming.slice(0, 3).map((s, i) => (
                  <span 
                    key={i} 
                    className="text-[7px] font-black px-1.5 py-0.5 rounded bg-white/10 text-white/80 border border-white/5 uppercase tracking-tighter"
                  >
                    {s.name}
                  </span>
                ))}
              </div>
            )}

            <div className="flex gap-2">
              <div className="flex-1 bg-white text-black py-2.5 rounded-lg flex items-center justify-center gap-2 text-[10px] font-black tracking-widest uppercase shadow-lg">
                <Play className="w-3 h-3 fill-current" />
                PLAY
              </div>
              <button 
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  const saved = localStorage.getItem("cinemood_watchlist");
                  const current = saved ? JSON.parse(saved) : [];
                  if (!current.find((m: any) => m.id === movie.id)) {
                    const updated = [...current, movie];
                    localStorage.setItem("cinemood_watchlist", JSON.stringify(updated));
                  }
                }}
                className="w-10 h-10 bg-white/10 hover:bg-brand-red rounded-lg flex items-center justify-center transition-all border border-white/10"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Info for Non-Hover / Mobile */}
        <div className="p-4 md:group-hover:opacity-0 transition-opacity">
          <h3 className="text-[11px] font-bold uppercase tracking-tight line-clamp-1 mb-1">{movie.title}</h3>
          <div className="flex items-center justify-between">
            <span className="text-[9px] text-white/30 font-bold">
              {movie.release_date ? new Date(movie.release_date).getFullYear() : "N/A"}
            </span>
          </div>
        </div>
      </motion.div>
    </Link>
  );
}
