import { Link, useLocation } from "react-router-dom";
import { Search, Film, Heart, User, TrendingUp, Menu, X } from "lucide-react";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "@/src/lib/utils";

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "Home", path: "/", icon: Film },
    { name: "AI recommendations", path: "/ai-search", icon: Search },
    { name: "Trending", path: "/trending", icon: TrendingUp },
    { name: "Watchlist", path: "/watchlist", icon: Heart },
  ];

  return (
    <nav className={cn(
      "fixed top-0 left-0 w-full z-50 transition-all duration-300",
      isScrolled ? "bg-black/80 backdrop-blur-md py-3 border-b border-white/10" : "bg-transparent py-5"
    )}>
      <div className="max-w-7xl mx-auto px-4 md:px-8 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 group">
          <div className="bg-brand-red p-1.5 rounded-lg shadow-lg shadow-brand-red/20 group-hover:scale-110 transition-transform">
            <Film className="w-6 h-6 text-white" />
          </div>
          <span className="text-xl md:text-2xl font-bold tracking-tighter">
            CineMood<span className="text-brand-red">AI</span>
          </span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={cn(
                "text-sm font-medium transition-colors hover:text-brand-red",
                location.pathname === link.path ? "text-brand-red" : "text-white/70"
              )}
            >
              {link.name}
            </Link>
          ))}
          <button className="bg-white/10 hover:bg-white/20 p-2 rounded-full transition-colors">
            <User className="w-5 h-5" />
          </button>
        </div>

        {/* Mobile Menu Toggle */}
        <button 
          className="md:hidden text-white"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="md:hidden absolute top-full left-0 w-full bg-black/95 backdrop-blur-xl border-b border-white/10 p-4 space-y-4"
          >
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-3 text-lg font-medium py-2 border-b border-white/5 active:text-brand-red"
              >
                <link.icon className="w-5 h-5 text-brand-red" />
                {link.name}
              </Link>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
