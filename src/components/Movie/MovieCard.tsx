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
}

interface MovieCardProps {
  movie: Movie;
  index?: number;
  key?: React.Key;
}

export default function MovieCard({ movie, index = 0 }: MovieCardProps) {
  const imageUrl = movie.poster_path.startsWith("http") 
    ? movie.poster_path 
    : `https://image.tmdb.org/t/p/w500${movie.poster_path}`;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      whileHover={{ scale: 1.05, transition: { duration: 0.2 } }}
      className="group relative bg-[#111] rounded-3xl overflow-hidden shadow-2xl border border-white/5 hover:border-brand-red/30 transition-all cursor-pointer"
    >
      {/* Poster Image */}
      <div className="aspect-[2/3] overflow-hidden">
        <img 
          src={imageUrl} 
          alt={movie.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110 group-hover:brightness-50"
        />
      </div>

      {/* Ratings Badge */}
      <div className="absolute top-3 right-3 glass px-3 py-1 rounded-full flex items-center gap-1 z-10 backdrop-blur-sm border-white/10">
        <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />
        <span className="text-xs font-bold">{movie.vote_average.toFixed(1)}</span>
      </div>

      {/* Hover Overlay Content */}
      <div className="absolute inset-0 p-6 flex flex-col justify-end opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none group-hover:pointer-events-auto bg-gradient-to-t from-black via-black/60 to-transparent">
        <h3 className="text-xl font-bold line-clamp-2 leading-tight mb-2 group-hover:translate-y-0 translate-y-4 transition-transform duration-300">
          {movie.title}
        </h3>
        
        <div className="flex items-center gap-3 text-xs text-white/50 mb-6 group-hover:translate-y-0 translate-y-4 transition-transform duration-300 delay-75 uppercase tracking-widest font-bold">
          <span className="flex items-center gap-1">
            <Calendar className="w-3 h-3" />
            {new Date(movie.release_date).getFullYear()}
          </span>
          <span className="flex items-center gap-1">
            <Clock className="w-3 h-3" />
            124m
          </span>
        </div>

        <div className="flex gap-2 group-hover:translate-y-0 translate-y-4 transition-transform duration-300 delay-100">
          <Link 
            to={`/movie/${movie.id}`}
            className="flex-1 bg-white text-black hover:bg-brand-red hover:text-white py-3 rounded-2xl flex items-center justify-center gap-2 transition-all text-sm font-black shadow-xl"
          >
            <Play className="w-4 h-4 fill-current" />
            PLAY
          </Link>
          <button className="w-12 h-12 bg-white/10 hover:bg-white/20 rounded-2xl flex items-center justify-center transition-colors border border-white/10">
            <Plus className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Mobile Title (visible when not legacy) */}
      <div className="p-3 md:group-hover:opacity-0 transition-opacity">
        <h3 className="text-sm font-semibold line-clamp-1 group-hover:hidden">{movie.title}</h3>
        <p className="text-[10px] text-white/50 mt-0.5 group-hover:hidden">{new Date(movie.release_date).getFullYear()}</p>
      </div>
    </motion.div>
  );
}
