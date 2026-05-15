import { Shield, Lock, Eye, FileText } from "lucide-react";
import { motion } from "motion/react";

export default function Privacy() {
  const sections = [
    {
      title: "1. DATA COLLECTION",
      icon: Eye,
      content: "We collect minimal information necessary to deliver our AI services. This includes your watchlists, mood preferences, and interaction data with the recommendation engine to refine the AI model specifically for you."
    },
    {
      title: "2. NO THIRD-PARTY SHARING",
      icon: Shield,
      content: "Your movie taste is personal. We never sell your data to advertisers. Interaction logs are anonymized and used only for internal quality control and AI training."
    },
    {
      title: "3. SECURITY MEASURES",
      icon: Lock,
      content: "We implement industry-standard encryption for all data transmissions. Your account credentials and personal preferences are stored in high-security cloud environments."
    }
  ];

  return (
    <div className="pt-32 pb-20 px-4 md:px-8 max-w-4xl mx-auto">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-20 text-center"
      >
        <div className="inline-flex p-4 rounded-3xl bg-brand-red/10 text-brand-red mb-8">
           <Shield className="w-8 h-8" />
        </div>
        <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tighter italic mb-4">PRIVACY <span className="text-brand-red">POLICY</span></h1>
        <p className="text-white/40 uppercase tracking-widest text-[10px] font-black">Last updated: May 15, 2026</p>
      </motion.div>

      <div className="space-y-16">
        {sections.map((section, i) => (
          <motion.div 
            key={i}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
            className="glass p-10 rounded-[2.5rem] border-white/5 relative overflow-hidden"
          >
            <div className="relative z-10">
              <h2 className="text-xl font-black mb-6 flex items-center gap-3 italic">
                <section.icon className="w-5 h-5 text-brand-red" />
                {section.title}
              </h2>
              <p className="text-white/60 leading-relaxed font-medium">
                {section.content}
              </p>
            </div>
            <div className="absolute top-0 right-0 p-8 opacity-[0.02]">
               <FileText className="w-40 h-40" />
            </div>
          </motion.div>
        ))}

        <div className="prose prose-invert max-w-none text-white/40 text-sm leading-loose">
          <p>
            By using CineMoodAI, you acknowledge that our recommendation engine utilizes Google Gemini API. While we ensure your personal identity is never shared with the model, prompts sent to the AI (e.g., your mood descriptions) are processed in real-time to generate suggestions.
          </p>
          <p className="mt-8 pt-8 border-t border-white/5">
            If you have any questions about how we handle your data, please contact us at <span className="text-white font-bold">privacy@cinemood.ai</span>.
          </p>
        </div>
      </div>
    </div>
  );
}
