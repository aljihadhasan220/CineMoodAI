import { useSearchParams, Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { Sparkles, ArrowLeft, Star, Play, Info } from "lucide-react";
import { motion } from "motion/react";
import MovieCard from "@/src/components/Movie/MovieCard";

interface AIRecommendation {
  title: string;
  reason: string;
  description: string;
}

export default function AISearch() {
  const [searchParams] = useSearchParams();
  const query = searchParams.get("q") || "";
  const [loading, setLoading] = useState(true);
  const [result, setResult] = useState<{ recommendations: AIRecommendation[], overallReason: string } | null>(null);

  useEffect(() => {
    async function getRecommendations() {
      if (!query) return;
      setLoading(true);
      try {
        const response = await fetch("/api/ai/recommend", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ prompt: query })
        });
        const data = await response.json();
        setResult(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    getRecommendations();
  }, [query]);

  return (
    <div className="min-h-screen pt-24 pb-20 px-4 md:px-8 max-w-7xl mx-auto">
      <div className="mb-12">
        <Link to="/" className="inline-flex items-center gap-2 text-white/50 hover:text-white transition-colors mb-6 group">
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Back to Home
        </Link>
        
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <h1 className="text-3xl md:text-5xl font-black tracking-tight mb-3">
              AI Recommendations for: <span className="text-brand-red italic">"{query}"</span>
            </h1>
            <p className="text-white/60 text-lg">Our AI has analyzed thousands of movies to find these perfect matches for you.</p>
          </div>
          <div className="flex items-center gap-2 bg-brand-red/10 border border-brand-red/20 text-brand-red px-4 py-2 rounded-full font-bold text-sm">
            <Sparkles className="w-4 h-4" />
            AI Mode Active
          </div>
        </div>
      </div>

      {loading ? (
        <div className="space-y-12">
          <div className="h-20 bg-white/5 rounded-2xl animate-pulse" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="h-[400px] bg-white/5 rounded-3xl animate-pulse" />
            ))}
          </div>
        </div>
      ) : (
        <div className="space-y-16">
          {/* AI Insights Card */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass p-8 rounded-3xl border-brand-red/20 relative overflow-hidden"
          >
            <div className="relative z-10">
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <Info className="w-5 h-5 text-brand-red" />
                AI Analysis
              </h2>
              <p className="text-white/80 leading-relaxed text-lg italic">
                "{result?.overallReason}"
              </p>
            </div>
            <div className="absolute top-0 right-0 p-4 opacity-5">
              <Sparkles className="w-48 h-48" />
            </div>
          </motion.div>

          {/* Recommendations Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {result?.recommendations.map((rec, i) => (
               <motion.div 
                key={rec.title}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="group glass rounded-[2rem] overflow-hidden border-white/5 hover:border-brand-red/40 transition-all flex flex-col h-full"
              >
                <div className="relative aspect-video overflow-hidden">
                   <img 
                    src={`https://images.unsplash.com/photo-1542204111-970c922ed73c?q=80&w=800&auto=format`} 
                    alt={rec.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#050505] to-transparent" />
                  <div className="absolute top-4 left-4 glass px-3 py-1 rounded-full text-xs font-bold border-brand-red/30">
                    MATCH #0{i+1}
                  </div>
                </div>
                
                <div className="p-8 flex flex-col flex-1">
                  <h3 className="text-2xl font-black mb-3">{rec.title}</h3>
                  <div className="bg-brand-red/5 border border-brand-red/10 rounded-xl p-4 mb-6">
                    <p className="text-sm font-bold text-brand-red uppercase tracking-widest mb-1 flex items-center gap-2">
                      <Sparkles className="w-3 h-3" />
                      Why it matches
                    </p>
                    <p className="text-sm text-white/70 italic text-balance">{rec.reason}</p>
                  </div>
                  <p className="text-sm text-white/50 leading-relaxed mb-8 flex-1 line-clamp-3">
                    {rec.description}
                  </p>
                  
                  <div className="flex gap-3">
                    <button className="flex-1 bg-white text-black hover:bg-brand-red hover:text-white py-3 rounded-2xl font-bold transition-all flex items-center justify-center gap-2">
                      <Play className="w-4 h-4 fill-current" />
                      Trailer
                    </button>
                    <button className="flex-1 border border-white/10 hover:bg-white/5 py-3 rounded-2xl font-bold transition-all flex items-center justify-center gap-2">
                      <Info className="w-4 h-4" />
                      Details
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
