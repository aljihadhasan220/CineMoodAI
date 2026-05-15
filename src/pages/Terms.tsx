import { FileText, CheckCircle, Scale, AlertTriangle } from "lucide-react";
import { motion } from "motion/react";

export default function Terms() {
  const points = [
    {
      title: "ACCEPTANCE OF TERMS",
      content: "By accessing CineMoodAI, you agree to these legal conditions. We provide a platform for discovery purposes only. We do not host any video content directly."
    },
    {
      title: "USER CONDUCT",
      content: "You agree not to use our AI recommendation system to generate harmful, illegal, or inappropriate content prompts. Abuse of the AI system may lead to immediate account termination."
    },
    {
      title: "INTELLECTUAL PROPERTY",
      content: "All trademarks, logos, and movie-related data from TMDB remain the property of their respective owners. CineMoodAI is for personal, non-commercial use only."
    },
    {
      title: "LIMITATION OF LIABILITY",
      content: "Recommendations are provided 'as is' via AI. We do not guarantee the accuracy of AI-generated reasons or descriptions. CineMoodAI is not responsible for your disappointment in a recommended film."
    }
  ];

  return (
    <div className="pt-32 pb-20 px-4 md:px-8 max-w-4xl mx-auto">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="mb-20 text-center"
      >
        <div className="inline-flex p-4 rounded-3xl bg-white/5 text-white/50 mb-8 border border-white/10">
           <FileText className="w-8 h-8" />
        </div>
        <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tighter italic mb-4">TERMS OF <span className="text-brand-red">SERVICE</span></h1>
        <p className="text-white/40 uppercase tracking-widest text-[10px] font-black italic shadow-inner">Protocol established: May 15, 2026</p>
      </motion.div>

      <div className="space-y-6">
        {points.map((point, i) => (
          <motion.div 
            key={i}
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.05 }}
            className="group glass p-10 rounded-[2.5rem] border-white/5 hover:border-white/10 transition-all flex gap-8 items-start"
          >
            <div className="p-3 bg-white/5 rounded-2xl text-white/20 group-hover:text-brand-red group-hover:bg-brand-red/10 transition-all">
               <CheckCircle className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-lg font-black mb-3 italic uppercase tracking-tighter transition-colors group-hover:text-white">{point.title}</h2>
              <p className="text-white/40 group-hover:text-white/60 leading-relaxed font-medium text-sm transition-colors">
                {point.content}
              </p>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="mt-20 p-10 glass rounded-[2.5rem] border-dashed border-white/10 text-center">
         <AlertTriangle className="w-8 h-8 text-yellow-500 mx-auto mb-4 opacity-50" />
         <p className="text-white/30 text-xs font-medium max-w-lg mx-auto">
           CineMoodAI reserves the right to modify these terms at any time. Continued use of the platform after changes constitutes acceptance of the new protocol.
         </p>
      </div>
    </div>
  );
}
