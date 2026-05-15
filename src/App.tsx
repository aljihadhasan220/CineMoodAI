import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Layout/Navbar";
import Footer from "./components/Layout/Footer";
import Home from "./pages/Home";
import AISearch from "./pages/AISearch";
import MovieDetails from "./pages/MovieDetails";
import Watchlist from "./pages/Watchlist";
import Auth from "./pages/Auth";

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
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}
