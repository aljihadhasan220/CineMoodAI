import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Layout/Navbar";
import Footer from "./components/Layout/Footer";
import Home from "./pages/Home";
import AISearch from "./pages/AISearch";
import MovieDetails from "./pages/MovieDetails";
import Watchlist from "./pages/Watchlist";
import Auth from "./pages/Auth";
import Categories from "./pages/Categories";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Privacy from "./pages/Privacy";
import Terms from "./pages/Terms";

export default function App() {
  return (
    <Router>
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/ai-search" element={<AISearch />} />
            <Route path="/movie/:id" element={<MovieDetails />} />
            <Route path="/watchlist" element={<Watchlist />} />
            <Route path="/login" element={<Auth />} />
            <Route path="/categories" element={<Categories />} />
            <Route path="/categories/:categoryId" element={<Categories />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/privacy" element={<Privacy />} />
            <Route path="/terms" element={<Terms />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}
