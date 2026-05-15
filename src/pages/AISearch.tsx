import { useSearchParams, Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { Sparkles, ArrowLeft, Star, Play, Info } from "lucide-react";
import { motion } from "motion/react";

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
        
        if (!response.ok) {
           throw new Error("API request failed");
        }
        
        const data = await response.json();
        
        // Validation to ensure data shape is correct
        if (data && Array.isArray(data.recommendations)) {
          setResult(data);
        } else {
          console.warn("Invalid data format received from AI", data);
          setResult({
            overallReason: "The AI was a bit shy this time. Here are some top picks instead.",
            recommendations: [] 
          });
        }
      } catch (err) {
        console.error("AI Search Error:", err);
        setResult({
          overallReason: "We hit a small snag connecting to the AI brain. Enjoy these community favorites while we clear things up.",
          recommendations: []
        });
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
          <div className="flex items-center gap-2 bg-brand-red/10 border border-brand-red/20 text-brand-red px-4 py-2 rounded-full font-bold text-sm shadow-lg shadow-brand-red/5">
            <Sparkles className="w-4 h-4" />
            AI Mode Active
          </div>
        </div>
      </div>

      {loading ? (
        <div className="space-y-12">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="h-24 bg-white/5 rounded-3xl animate-pulse flex items-center px-8"
          >
            <div className="flex items-center gap-4">
              <Sparkles className="w-6 h-6 text-brand-red animate-spin" />
              <div className="space-y-2">
                <div className="h-4 w-48 bg-white/10 rounded-full" />
                <div className="h-3 w-32 bg-white/5 rounded-full" />
              </div>
            </div>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="h-[500px] bg-white/5 rounded-[2.5rem] animate-pulse border border-white/5" />
            ))}
          </div>
        </div>
      ) : (
        <div className="space-y-16">
          {/* AI Insights Card */}
          {result?.overallReason && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass p-8 md:p-10 rounded-[2.5rem] border-brand-red/20 relative overflow-hidden shadow-2xl"
            >
              <div className="relative z-10 max-w-4xl">
                <h2 className="text-xs font-black uppercase tracking-[0.3em] text-brand-red mb-6 flex items-center gap-3">
                  <Info className="w-4 h-4" />
                  AI Analysis Report
                </h2>
                <p className="text-white/90 leading-relaxed text-xl md:text-2xl font-serif italic">
                  "{result.overallReason}"
                </p>
              </div>
              <div className="absolute top-0 right-0 p-4 opacity-[0.03]">
                <Sparkles className="w-64 h-64" />
              </div>
            </motion.div>
          )}

          {/* Recommendations Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {result?.recommendations && result.recommendations.length > 0 ? (
              result.recommendations.map((rec, i) => (
                 <motion.div 
                  key={`${rec.title}-${i}`}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: (i % 3) * 0.1 }}
                  className="group glass rounded-[2.5rem] overflow-hidden border-white/5 hover:border-brand-red/40 transition-all flex flex-col h-full shadow-xl"
                >
                  <div className="relative aspect-[16/10] overflow-hidden">
                     <img 
                      src={`https://images.unsplash.com/photo-1542204111-970c922ed73c?q=80&w=800&auto=format`} 
                      alt={rec.title}
                      className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110 grayscale opacity-40 group-hover:grayscale-0 group-hover:opacity-100"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#050505] to-transparent opacity-80" />
                    <div className="absolute top-6 left-6 glass px-4 py-1.5 rounded-full text-[10px] font-black tracking-widest border-brand-red/30 uppercase">
                      Recommendation 0{i+1}
                    </div>
                  </div>
                  
                  <div className="p-8 flex flex-col flex-1">
                    <h3 className="text-2xl font-black mb-4 tracking-tight uppercase italic">{rec.title}</h3>
                    <div className="bg-white/5 border border-white/10 rounded-[1.5rem] p-5 mb-6 relative overflow-hidden group/reason hover:bg-brand-red/5 transition-colors">
                      <div className="absolute top-0 left-0 w-1 h-full bg-brand-red/40" />
                      <p className="text-[10px] font-black text-brand-red uppercase tracking-[0.2em] mb-2 flex items-center gap-2">
                        <Sparkles className="w-3 h-3" />
                        AI Analysis
                      </p>
                      <p className="text-sm text-white/70 italic leading-relaxed">{rec.reason}</p>
                    </div>
                    <p className="text-sm text-white/40 leading-relaxed mb-8 flex-1 line-clamp-4 font-medium uppercase tracking-tight">
                      {rec.description}
                    </p>
                    
                    <div className="grid grid-cols-2 gap-3">
                      <button className="bg-white text-black hover:bg-brand-red hover:text-white h-12 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all flex items-center justify-center gap-2 shadow-lg">
                        <Play className="w-3 h-3 fill-current" />
                        WATCH NOW
                      </button>
                      <button className="border border-white/10 hover:bg-white/5 h-12 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all flex items-center justify-center gap-2">
                        <Info className="w-3 h-3" />
                        DETAILS
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))
            ) : (
              !loading && (
                <div className="col-span-full py-20 text-center glass rounded-3xl border-dashed border-white/10">
                  <p className="text-white/40 text-lg">No specific recommendations found. Try a different mood!</p>
                </div>
              )
            )}
          </div>
        </div>
      )}
    </div>
  );
}
