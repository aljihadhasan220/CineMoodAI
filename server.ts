import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY || "",
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    }
  }
});

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // AI Recommendation Endpoint
  app.post("/api/ai/recommend", async (req, res) => {
    try {
      const { prompt } = req.body;
      if (!prompt) return res.status(400).json({ error: "Prompt is required" });

      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: `Recommendations for: "${prompt}"`,
        config: {
          systemInstruction: "You are CineMoodAI, an expert movie recommendation engine. Based on the user's mood or request, suggest 6 highly relevant movies. For each movie, provide the title, why it specifically matches their mood (the 'reason'), and a concise plot description. Also provide an 'overallReason' summarizing why these movies were chosen. Always return valid JSON.",
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              recommendations: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    title: { type: Type.STRING },
                    reason: { type: Type.STRING },
                    description: { type: Type.STRING }
                  },
                  required: ["title", "reason", "description"]
                }
              },
              overallReason: { type: Type.STRING }
            },
            required: ["recommendations", "overallReason"]
          }
        }
      });

      const text = response.text;
      if (!text) throw new Error("Empty AI response");
      
      const parsed = JSON.parse(text);
      res.json(parsed);
    } catch (error: any) {
      console.error("AI Error:", error);
      
      // Fallback Recommendations
      const fallbacks = {
        overallReason: "Thinking of some timeless classics while the AI takes a moment to process your specific mood.",
        recommendations: [
          { title: "The Shawshank Redemption", reason: "Universally acclaimed for its message of hope and resilience.", description: "Two imprisoned men bond over a number of years, finding solace and eventual redemption through acts of common decency." },
          { title: "Inception", reason: "Perfect for those seeking an intellectual and visual thrill.", description: "A thief who steals corporate secrets through the use of dream-sharing technology is given the inverse task of planting an idea." },
          { title: "Parasite", reason: "A masterpiece of social commentary and suspense.", description: "Greed and class discrimination threaten the newly formed symbiotic relationship between the wealthy Park family and the destitute Kim clan." },
          { title: "Spirited Away", reason: "Wonderful for a sense of wonder and magical escapism.", description: "During her family's move to the suburbs, a sullen 10-year-old girl wanders into a world ruled by gods, witches, and spirits." },
          { title: "The Dark Knight", reason: "Ideal for a high-intensity, gritty cinematic experience.", description: "When the menace known as the Joker wreaks havoc and chaos on the people of Gotham, Batman must accept one of the greatest psychological and physical tests of his ability." },
          { title: "La La Land", reason: "A beautiful choice for music, romance, and artistic passion.", description: "While navigating their careers in Los Angeles, a pianist and an actress fall in love while attempting to reconcile their aspirations for the future." }
        ]
      };
      
      res.json(fallbacks);
    }
  });

  // Movie Data Proxy (Optional, if we want to hide TMDB key)
  app.get("/api/movies/:type", async (req, res) => {
    const { type } = req.params;
    const apiKey = process.env.TMDB_API_KEY;
    
    // In a real app, we'd fetch from TMDB here. 
    // Since we might not have a key, we'll return mock data if fetch fails or key missing.
    try {
      if (!apiKey || apiKey === "YOUR_TMDB_API_KEY") {
        throw new Error("No TMDB Key");
      }
      
      let url = "";
      switch(type) {
        case "trending": url = `https://api.themoviedb.org/3/trending/movie/week?api_key=${apiKey}`; break;
        case "popular": url = `https://api.themoviedb.org/3/movie/popular?api_key=${apiKey}`; break;
        case "top_rated": url = `https://api.themoviedb.org/3/movie/top_rated?api_key=${apiKey}`; break;
        default: url = `https://api.themoviedb.org/3/movie/popular?api_key=${apiKey}`;
      }
      
      const response = await fetch(url);
      const data = await response.json();
      res.json(data);
    } catch (err) {
      // Return beautiful mock data for CineMoodAI if TMDB is not available
      res.json(getMockMovies(type));
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

function getMockMovies(type: string) {
  const images = [
    "https://images.unsplash.com/photo-1536440136628-849c177e76a1?q=80&w=1000",
    "https://images.unsplash.com/photo-1485846234645-a62644f84728?q=80&w=1000",
    "https://images.unsplash.com/photo-1440404653325-ab127d49abc1?q=80&w=1000",
    "https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?q=80&w=1000"
  ];
  const movies = [
    { id: 1, title: "Interstellar", vote_average: 8.7, release_date: "2014-11-07", poster_path: "/gEU2QniE6E77NI6lCU6MxlnoEG7.jpg", backdrop_path: images[0], overview: "The adventures of a group of explorers who make use of a newly discovered wormhole..." },
    { id: 2, title: "Inception", vote_average: 8.8, release_date: "2010-07-16", poster_path: "/o0I0Bh96S38S5S6v9h9IqvA6S5.jpg", backdrop_path: images[1], overview: "Cobb, a skilled thief who commits corporate espionage by infiltrating the subconscious..." },
    { id: 3, title: "The Parasite", vote_average: 8.5, release_date: "2019-05-30", poster_path: "/7IiTT0SBRU7LGr6Uqcoy9vZ6p9f.jpg", backdrop_path: images[2], overview: "Greed and class discrimination threaten the newly formed symbiotic relationship..." },
    { id: 4, title: "Kimi no Na wa.", vote_average: 8.5, release_date: "2016-08-26", poster_path: "/q719jsmZvkv6tUaURu9p9mSENS1.jpg", backdrop_path: images[3], overview: "High schoolers Mitsuha and Taki are complete strangers living separate lives..." },
  ];
  return { results: movies };
}

startServer();
