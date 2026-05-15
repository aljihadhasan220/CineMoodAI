import { useState } from "react";
import { LogIn, UserPlus, Mail, Lock, Film, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

export default function Auth() {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 pt-20">
      <div className="absolute inset-0 -z-10 bg-radial-gradient from-brand-red/10 to-transparent blur-3xl opacity-50" />
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass w-full max-w-md p-10 rounded-[2.5rem] border-brand-red/10 shadow-2xl relative overflow-hidden"
      >
        <div className="relative z-10">
          <div className="flex justify-center mb-8">
            <div className="bg-brand-red p-3 rounded-2xl shadow-xl shadow-brand-red/20 rotate-3">
              <Film className="w-8 h-8 text-white" />
            </div>
          </div>
          
          <h1 className="text-3xl font-black text-center mb-2">
            {isLogin ? "Welcome Back" : "Create Account"}
          </h1>
          <p className="text-white/40 text-center text-sm mb-10">
            {isLogin ? "Your personal cine-universe awaits." : "Join thousands of cinephiles today."}
          </p>

          <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
            {!isLogin && (
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <span className="text-white/20 text-xs font-bold uppercase">Name</span>
                </div>
                <input 
                  type="text" 
                  placeholder="John Doe"
                  className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-16 pr-4 text-white placeholder:text-white/10 focus:ring-1 focus:ring-brand-red focus:border-brand-red outline-none transition-all"
                />
              </div>
            )}
            
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-white/20">
                <Mail className="w-4 h-4" />
              </div>
              <input 
                type="email" 
                placeholder="Email Address"
                className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white placeholder:text-white/10 focus:ring-1 focus:ring-brand-red focus:border-brand-red outline-none transition-all"
              />
            </div>

            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-white/20">
                <Lock className="w-4 h-4" />
              </div>
              <input 
                type="password" 
                placeholder="Password"
                className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white placeholder:text-white/10 focus:ring-1 focus:ring-brand-red focus:border-brand-red outline-none transition-all"
              />
            </div>

            <button className="w-full bg-brand-red hover:bg-red-700 text-white py-4 rounded-2xl font-black flex items-center justify-center gap-3 shadow-xl shadow-brand-red/20 transition-all active:scale-95 mt-8">
              {isLogin ? <LogIn className="w-5 h-5" /> : <UserPlus className="w-5 h-5" />}
              {isLogin ? "SIGN IN" : "SIGN UP"}
            </button>
          </form>

          <div className="mt-10 text-center">
            <p className="text-white/30 text-sm">
              {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
              <button 
                onClick={() => setIsLogin(!isLogin)}
                className="text-brand-red font-black hover:underline ml-1"
              >
                {isLogin ? "Sign Up" : "Log In"}
              </button>
            </p>
          </div>
        </div>

        {/* Decorative elements */}
        <div className="absolute -bottom-10 -right-10 opacity-5 -rotate-12">
          <Sparkles className="w-64 h-64" />
        </div>
      </motion.div>
    </div>
  );
}
