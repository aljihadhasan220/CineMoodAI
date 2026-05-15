import { Film, Sparkles, TrendingUp, Cpu, Heart, Globe } from "lucide-react";
import { motion } from "motion/react";

export default function About() {
  const stats = [
    { label: "Movies Indexed", value: "20,000+", icon: Film },
    { label: "AI Suggestions", value: "1M+", icon: Sparkles },
    { label: "Global Users", value: "500K+", icon: Globe },
    { label: "Personal Lists", value: "2M+", icon: Heart },
  ];

  return (
    <div className="pt-32 pb-20">
      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 md:px-8 mb-32">
        <div className="flex flex-col items-center text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-brand-red p-3 rounded-2xl mb-8 shadow-2xl shadow-brand-red/30"
          >
            <Film className="w-8 h-8 text-white" />
          </motion.div>
          
          <h1 className="text-5xl md:text-8xl font-black tracking-tighter uppercase italic mb-8">
            REDEFINING <span className="text-brand-red">DISCOVERY</span>
          </h1>
          
          <p className="text-xl text-white/50 max-w-2xl leading-relaxed font-medium font-serif italic">
            "CineMoodAI isn't just a movie database; it's a bridge between human emotion and digital storytelling. We believe every mood has a masterpiece waiting to be found."
          </p>
        </div>
      </section>

      {/* Stats Bento */}
      <section className="max-w-7xl mx-auto px-4 md:px-8 mb-32">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {stats.map((stat, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="glass p-8 rounded-[2rem] border-white/5 flex flex-col items-center text-center group hover:border-brand-red/40 transition-all"
            >
              <stat.icon className="w-8 h-8 text-white/20 mb-4 group-hover:text-brand-red transition-colors" />
              <div className="text-3xl font-black mb-1">{stat.value}</div>
              <div className="text-[10px] font-black uppercase tracking-widest text-white/40">{stat.label}</div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Philosophy Section */}
      <section className="max-w-7xl mx-auto px-4 md:px-8 mb-32">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div className="glass rounded-[3rem] p-1 overflow-hidden">
            <img 
               src="https://images.unsplash.com/photo-1485846234645-a62644f84728?q=80&w=1000" 
               className="w-full h-full object-cover rounded-[2.9rem] grayscale hover:grayscale-0 transition-all duration-1000 scale-110"
            />
          </div>
          <div className="space-y-8">
             <div className="space-y-4">
               <h3 className="text-xs font-black text-brand-red uppercase tracking-widest">Our Technology</h3>
               <h2 className="text-4xl font-black tracking-tight uppercase italic leading-tight">AI THAT THINKS <br />LIKE A CINEPHILE</h2>
               <p className="text-white/60 leading-relaxed font-medium">
                 Unlike traditional algorithms that look at metadata alone, our Gemini-powered engine understands the nuance of emotion, color palettes, and pacing. When you say you want something "unsettling yet beautiful," we know exactly what that feels like.
               </p>
             </div>

             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                   <div className="w-10 h-1 bg-brand-red rounded-full" />
                   <h4 className="font-black text-sm uppercase">Hyper-Personalized</h4>
                   <p className="text-xs text-white/40">Recommendations that evolve with your taste and life experiences.</p>
                </div>
                <div className="space-y-2">
                   <div className="w-10 h-1 bg-brand-red rounded-full" />
                   <h4 className="font-black text-sm uppercase">Emotion First</h4>
                   <p className="text-xs text-white/40">Because movies are about how they make you feel, not just their genres.</p>
                </div>
             </div>
          </div>
        </div>
      </section>
      
      {/* Team CTA */}
      <section className="max-w-7xl mx-auto px-4 md:px-8">
         <div className="glass rounded-[3rem] p-12 md:p-20 border-brand-red/20 text-center relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-brand-red/10 via-transparent to-transparent opacity-50" />
            <div className="relative z-10">
               <h2 className="text-3xl md:text-5xl font-black mb-6 tracking-tighter uppercase italic">READY TO FIND YOUR NEXT <br />OBSESSION?</h2>
               <p className="text-white/40 mb-10 max-w-xl mx-auto">Join the premium community of movie lovers who refuse to settle for "average" recommendations.</p>
               <button className="bg-white text-black px-12 py-4 rounded-full font-black text-sm uppercase tracking-widest hover:bg-brand-red hover:text-white transition-all shadow-2xl">Start Exploring</button>
            </div>
         </div>
      </section>
    </div>
  );
}
