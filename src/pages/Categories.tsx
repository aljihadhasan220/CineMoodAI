import { useState, useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { Film, TrendingUp, Sparkles, ChevronRight } from "lucide-react";
import { motion } from "motion/react";
import MovieCard from "@/src/components/Movie/MovieCard";

const CATEGORIES = [
  { id: "action", name: "Action", icon: "💥", color: "from-orange-600 to-red-600" },
  { id: "sci_fi", name: "Sci-Fi", icon: "🚀", color: "from-blue-600 to-indigo-600" },
  { id: "horror", name: "Horror", icon: "👻", color: "from-purple-900 to-black" },
  { id: "anime", name: "Anime", icon: "🍱", color: "from-pink-500 to-rose-500" },
  { id: "k-drama", name: "K-Drama", icon: "🎎", color: "from-emerald-500 to-teal-500" },
  { id: "romance", name: "Romance", icon: "💖", color: "from-red-400 to-pink-600" },
  { id: "comedy", name: "Comedy", icon: "😂", color: "from-yellow-400 to-orange-500" },
  { id: "thriller", name: "Thriller", icon: "🔪", color: "from-zinc-700 to-zinc-900" },
  { id: "ott", name: "Streaming", icon: "📺", color: "from-red-600 to-zinc-900" },
  { id: "indian", name: "Indian", icon: "🇮🇳", color: "from-orange-500 to-green-600" },
  { id: "hindi", name: "Hindi", icon: "🇮🇳", color: "from-orange-600 to-amber-600" },
  { id: "funny", name: "Funny", icon: "😂", color: "from-yellow-400 to-amber-600" },
  { id: "mind-blowing", name: "Mind-Blowing", icon: "🤯", color: "from-blue-400 to-indigo-600" },
  { id: "emotional", name: "Emotional", icon: "😢", color: "from-blue-600 to-cyan-500" },
  { id: "adventure", name: "Adventure", icon: "🤠", color: "from-green-600 to-yellow-600" },
  { id: "mystery", name: "Mystery", icon: "🔍", color: "from-zinc-800 to-black" },
];

export default function Categories() {
  const { categoryId } = useParams();
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState(categoryId || CATEGORIES[0].id);
  const [movies, setMovies] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    if (categoryId && categoryId !== selectedCategory) {
      setSelectedCategory(categoryId);
      setPage(1);
      setMovies([]);
    }
  }, [categoryId]);

  useEffect(() => {
    const fetchCategoryMovies = async (p: number) => {
      if (p === 1) setLoading(true);
      try {
        const res = await fetch(`/api/movies/${selectedCategory}?page=${p}`);
        const data = await res.json();
        const newMovies = data.results || [];
        
        // Add random AI match score to movies in categories
        const enrichedMovies = newMovies.map((m: any) => ({
          ...m,
          match_score: m.match_score || Math.floor(Math.random() * 20) + 75 // 75-95%
        }));

        setMovies(prev => {
          const combined = p === 1 ? enrichedMovies : [...prev, ...enrichedMovies];
          const seen = new Set();
          return combined.filter((m: any) => {
            if (seen.has(m.id)) return false;
            seen.add(m.id);
            return true;
          });
        });
        setHasMore(data.page < data.total_pages && data.page < 10); // Limit to 10 pages to avoid over-fetching
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchCategoryMovies(page);
  }, [selectedCategory, page]);

  // Infinite Scroll Observer
  useEffect(() => {
    if (loading || !hasMore) return;

    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        setPage(prev => prev + 1);
      }
    }, { threshold: 1.0 });

    const target = document.querySelector("#infinite-scroll-trigger");
    if (target) observer.observe(target);

    return () => observer.disconnect();
  }, [loading, hasMore]);

  const handleCategorySelect = (id: string) => {
    setSelectedCategory(id);
    setPage(1);
    setMovies([]);
    navigate(`/categories/${id}`);
  };

  return (
    <div className="pt-32 pb-20 px-4 md:px-8 max-w-7xl mx-auto">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-16"
      >
        <h1 className="text-[10px] font-black uppercase tracking-[0.3em] text-brand-red mb-4 flex items-center gap-3">
          <Film className="w-4 h-4" />
          Cinema Library
        </h1>
        <h2 className="text-4xl md:text-6xl font-black tracking-tight uppercase italic">
          Browse by <span className="text-brand-red">Genre</span>
        </h2>
      </motion.div>

      {/* Category Tabs */}
      <div className="flex flex-wrap gap-3 mb-16">
        {CATEGORIES.map((cat) => (
          <button
            key={cat.id}
            onClick={() => handleCategorySelect(cat.id)}
            className={`
              px-6 py-3 rounded-2xl text-xs font-black uppercase tracking-widest transition-all flex items-center gap-2 border
              ${selectedCategory === cat.id 
                ? "bg-brand-red border-brand-red text-white shadow-xl shadow-brand-red/20 scale-105" 
                : "glass border-white/5 text-white/40 hover:text-white hover:border-white/10"}
            `}
          >
            <span>{cat.icon}</span>
            {cat.name}
          </button>
        ))}
      </div>

      {/* Hero Category Banner */}
      <motion.div 
        key={selectedCategory}
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className={`h-[300px] mb-16 rounded-[2.5rem] relative overflow-hidden flex items-center p-12 bg-gradient-to-br ${CATEGORIES.find(c => c.id === selectedCategory)?.color}`}
      >
        <div className="absolute inset-0 bg-black/20" />
        <div className="relative z-10 max-w-xl">
           <h3 className="text-5xl md:text-7xl font-black uppercase tracking-tighter italic text-white drop-shadow-2xl">
             {CATEGORIES.find(c => c.id === selectedCategory)?.name}
           </h3>
           <p className="text-white/80 font-medium text-lg mt-4 max-w-md italic">
             Hand-picked cinematic excellence in the {CATEGORIES.find(c => c.id === selectedCategory)?.name.toLowerCase()} category.
           </p>
        </div>
        <div className="absolute right-12 bottom-12 opacity-10">
           <Sparkles className="w-64 h-64 text-white" />
        </div>
      </motion.div>

      {/* Movie Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
        {movies.map((movie: any, i) => (
          <div key={`${movie.id}-${i}`} className="relative group">
            {movie.match_score && (
              <div className="absolute top-4 left-4 z-20 bg-brand-red text-white text-[8px] font-black px-2 py-1 rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity">
                {movie.match_score}% AI MATCH
              </div>
            )}
            <MovieCard movie={movie} index={i} />
          </div>
        ))}
        
        {loading && [1, 2, 3, 4, 5].map(i => (
          <div key={`skeleton-${i}`} className="aspect-[2/3] bg-white/5 rounded-3xl animate-pulse" />
        ))}
      </div>

      {!loading && movies.length > 0 && hasMore && (
        <div id="infinite-scroll-trigger" className="h-20 w-full flex items-center justify-center">
          <div className="w-6 h-6 border-2 border-brand-red border-t-transparent rounded-full animate-spin" />
        </div>
      )}

      {!loading && movies.length === 0 && (
        <div className="text-center py-20 glass rounded-3xl border-dashed border-white/10">
          <p className="text-white/30 font-bold uppercase tracking-widest">No movies found in this genre yet.</p>
        </div>
      )}
    </div>
  );
}
