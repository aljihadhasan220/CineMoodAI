import { Link } from "react-router-dom";
import { Film, Github, Twitter, MessageCircle, Mail } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-black border-t border-white/5 pt-20 pb-10">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          <div className="col-span-1 md:col-span-1">
            <Link to="/" className="flex items-center gap-2 mb-6 group">
              <div className="bg-brand-red p-1.5 rounded-lg">
                <Film className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-bold tracking-tighter">
                CineMood<span className="text-brand-red">AI</span>
              </span>
            </Link>
            <p className="text-white/40 text-sm leading-relaxed mb-8">
              Discover movies like never before. Our AI understands your mood and guides you to cinematic masterpieces tailored just for you.
            </p>
            <div className="flex items-center gap-4">
              <SocialIcon icon={Twitter} />
              <SocialIcon icon={Github} />
              <SocialIcon icon={MessageCircle} />
              <SocialIcon icon={Mail} />
            </div>
          </div>

          <div>
            <h4 className="font-bold mb-6 italic uppercase tracking-widest text-[10px] text-white/30">Explore</h4>
            <ul className="space-y-4 text-sm text-white/50 font-medium">
              <li><Link to="/" className="hover:text-brand-red transition-colors flex items-center gap-2">Trending Movies</Link></li>
              <li><Link to="/ai-search" className="hover:text-brand-red transition-colors flex items-center gap-2">AI Search</Link></li>
              <li><Link to="/watchlist" className="hover:text-brand-red transition-colors flex items-center gap-2">Personal Watchlist</Link></li>
              <li><Link to="/categories" className="hover:text-brand-red transition-colors flex items-center gap-2">Movie categories</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold mb-6 italic uppercase tracking-widest text-[10px] text-white/30">Support</h4>
            <ul className="space-y-4 text-sm text-white/50 font-medium">
              <li><Link to="/about" className="hover:text-brand-red transition-colors flex items-center gap-2">About CineMoodAI</Link></li>
              <li><Link to="/contact" className="hover:text-brand-red transition-colors flex items-center gap-2">Contact Us</Link></li>
              <li><Link to="/privacy" className="hover:text-brand-red transition-colors flex items-center gap-2">Privacy Policy</Link></li>
              <li><Link to="/terms" className="hover:text-brand-red transition-colors flex items-center gap-2">Terms of Service</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold mb-6">Community</h4>
            <div className="bg-white/5 rounded-2xl p-6 border border-white/5">
              <p className="text-xs text-white/40 mb-4 uppercase tracking-widest font-bold">Join our Telegram</p>
              <p className="text-sm mb-6 text-white/60 font-medium">Get daily movie picks and discuss with fellow cinephiles.</p>
              <a 
                href="https://t.me/moviewalla02" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2 shadow-lg shadow-blue-500/20"
              >
                <MessageCircle className="w-4 h-4 fill-white" />
                Join Telegram
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-white/5 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-white/30 uppercase tracking-widest font-bold">
          <p>© 2026 CINEMOOD AI. ALL RIGHTS RESERVED.</p>
          <div className="flex gap-8">
            <span>Made with ❤️ for movie lovers</span>
            <span>API powered by TMDB & Gemini</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

function SocialIcon({ icon: Icon }: { icon: any }) {
  return (
    <button className="w-10 h-10 rounded-full bg-white/5 hover:bg-brand-red hover:text-white flex items-center justify-center transition-all border border-white/5 hover:border-brand-red hover:-translate-y-1">
      <Icon className="w-5 h-5" />
    </button>
  );
}
