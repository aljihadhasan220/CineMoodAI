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

// Simple in-memory cache
const cache = new Map<string, { data: any; expiry: number }>();
let lastQuotaExceeded = 0;
const QUOTA_COOLDOWN = 30 * 60 * 1000; // 30 minutes cooldown after quota error

function getFromCache(key: string) {
  const cached = cache.get(key);
  if (cached && cached.expiry > Date.now()) {
    return cached.data;
  }
  return null;
}

function setToCache(key: string, data: any, ttlHours: number = 2) {
  cache.set(key, {
    data,
    expiry: Date.now() + ttlHours * 60 * 60 * 1000
  });
}

// OMDb Data Fetcher
async function fetchOMDbData(title: string, year?: string, imdbId?: string) {
  const cacheKey = `omdb_${imdbId || title}_${year}`;
  const cached = getFromCache(cacheKey);
  if (cached) return cached;

  const apiKey = process.env.OMDB_API_KEY;
  if (!apiKey || apiKey === "YOUR_OMDB_API_KEY") return null;

  try {
    let url = `https://www.omdbapi.com/?apikey=${apiKey}&`;
    if (imdbId) {
      url += `i=${imdbId}`;
    } else {
      url += `t=${encodeURIComponent(title)}`;
      if (year) {
        const date = new Date(year);
        const y = date.getFullYear();
        if (!isNaN(y)) url += `&y=${y}`;
      }
    }

    const response = await fetch(url);
    const data = await response.json();
    if (data.Response === "True") {
      const result = {
        imdbRating: data.imdbRating,
        imdbVotes: data.imdbVotes,
        awards: data.Awards,
        director: data.Director,
        writer: data.Writer,
        actors: data.Actors,
        boxOffice: data.BoxOffice,
        metascore: data.Metascore,
        rated: data.Rated,
        plot: data.Plot,
        runtime: data.Runtime
      };
      setToCache(cacheKey, result, 24); // Cache OMDb for 24h
      return result;
    }
  } catch (e) {
    console.error(`OMDb error for ${title}:`, e);
  }
  return null;
}

// Watchmode Data Fetcher
async function fetchWatchmodeData(tmdbId: number) {
  const cacheKey = `watchmode_${tmdbId}`;
  const cached = getFromCache(cacheKey);
  if (cached) return cached;

  const apiKey = process.env.WATCHMODE_API_KEY;
  if (!apiKey || apiKey === "YOUR_WATCHMODE_API_KEY") return null;

  try {
    const searchUrl = `https://api.watchmode.com/v1/search/?apiKey=${apiKey}&search_field=tmdb_movie_id&search_value=${tmdbId}`;
    const searchRes = await fetch(searchUrl);
    const searchData = await searchRes.json();
    
    if (searchData.title_results && searchData.title_results.length > 0) {
      const wmId = searchData.title_results[0].id;
      const sourcesUrl = `https://api.watchmode.com/v1/title/${wmId}/sources/?apiKey=${apiKey}&regions=US,IN`;
      const sourcesRes = await fetch(sourcesUrl);
      const sourcesData = await sourcesRes.json();
      
      if (Array.isArray(sourcesData)) {
        const streaming = sourcesData
          .filter(s => s.type === "sub")
          .map(s => ({
            name: s.name,
            url: s.web_url,
            format: s.format,
            provider_id: s.provider_id
          }));
        
        const result = streaming.length > 0 ? streaming : sourcesData.slice(0, 3).map(s => ({
          name: s.name,
          url: s.web_url,
          format: s.format,
          provider_id: s.provider_id,
          type: s.type
        }));
        
        setToCache(cacheKey, result, 12);
        return result;
      }
    }
  } catch (e) {
    console.error(`Watchmode error for TMDB ID ${tmdbId}:`, e);
  }
  return null;
}

// TasteDive Similarity Fetcher
async function fetchTasteDiveSimilar(title: string) {
  const cacheKey = `tastedive_${title}`;
  const cached = getFromCache(cacheKey);
  if (cached) return cached;

  const apiKey = process.env.TASTEDIVE_API_KEY;
  if (!apiKey || apiKey === "YOUR_TASTEDIVE_API_KEY") return [];

  try {
    const url = `https://tastedive.com/api/similar?q=${encodeURIComponent(title)}&type=movies&info=1&k=${apiKey}`;
    const response = await fetch(url);
    const data = await response.json();
    const result = data.Similar?.Results || [];
    setToCache(cacheKey, result, 24);
    return result;
  } catch (e) {
    console.error(`TasteDive error for ${title}:`, e);
    return [];
  }
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Health Check
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok" });
  });

  // Tonight's AI Selection Endpoint
  app.get("/api/movies/ai-pick", async (req, res) => {
    const cacheKey = "ai_pick_daily";
    const cached = getFromCache(cacheKey);
    if (cached) return res.json(cached);

    const apiKey = process.env.TMDB_API_KEY;
    if (!apiKey || apiKey === "YOUR_TMDB_API_KEY") {
      const result = { movie: getMockMovies("popular").results[0], reason: "A cinematic masterpiece that redefines its genre.", matchScore: 98 };
      return res.json(result);
    }

    try {
      const randomPage = Math.floor(Math.random() * 5) + 1;
      const url = `https://api.themoviedb.org/3/movie/top_rated?api_key=${apiKey}&page=${randomPage}`;
      const response = await fetch(url);
      const data = await response.json();
      
      if (!data.results || data.results.length === 0) throw new Error("No movies found");
      
      const randomIdx = Math.floor(Math.random() * data.results.length);
      const movie = data.results[randomIdx];
      
      const detailUrl = `https://api.themoviedb.org/3/movie/${movie.id}?api_key=${apiKey}&append_to_response=credits,videos`;
      const detailRes = await fetch(detailUrl);
      const movieDetails = await detailRes.json();

      if (movieDetails.imdb_id) {
        const omdb = await fetchOMDbData(movieDetails.title, movieDetails.release_date, movieDetails.imdb_id);
        if (omdb) movieDetails.omdb = omdb;
      }

      const streaming = await fetchWatchmodeData(movieDetails.id);
      if (streaming) movieDetails.streaming = streaming;

      const similar = await fetchTasteDiveSimilar(movieDetails.title);
      if (similar) movieDetails.tastedive_similar = similar;

      const reasons = [
        "A profound exploration of human connection wrapped in a stunning visual tapestry.",
        "A technical marvel that pushes the boundaries of experimental storytelling.",
        "A definitive entry in modern cinema that challenges perceptions and rewards deep attention.",
        "An atmospheric journey that lingers in the mind long after the credits roll.",
        "A masterclass in tension and narrative structure that feels both timely and timeless."
      ];

      const result = {
        movie: movieDetails,
        reason: reasons[Math.floor(Math.random() * reasons.length)],
        matchScore: Math.floor(Math.random() * 15) + 85 // 85-99%
      };

      setToCache(cacheKey, result, 4); // Refresh every 4 hours
      res.json(result);
    } catch (err) {
      console.error("AI Pick Error:", err);
      res.json({ movie: getMockMovies("popular").results[0], reason: "A cinematic masterpiece that redefines its genre." });
    }
  });

  // AI Recommendation Endpoint with Caching
  app.post("/api/ai/recommend", async (req, res) => {
    const fallbacks = {
      overallReason: "The AI is currently processing deep cinematic patterns. Here are some essentials while it recalibrates.",
      recommendations: [
        { title: "The Shawshank Redemption", id: 278, reason: "Universally acclaimed for its message of hope and resilience.", description: "Two imprisoned men bond over a number of years, finding solace and eventual redemption through acts of common decency.", matchScore: 99, poster_path: "/9cqYj7yL7igIl0Pbz9SNS69CqZ.jpg" },
        { title: "Inception", id: 27205, reason: "Perfect for those seeking an intellectual and visual thrill.", description: "A thief who steals corporate secrets through the use of dream-sharing technology is given the inverse task of planting an idea.", matchScore: 98, poster_path: "/o0I0Bh96S38S5S6v9h9IqvA6S5.jpg" },
        { title: "Parasite", id: 496243, reason: "A masterpiece of social commentary and suspense.", description: "Greed and class discrimination threaten the newly formed symbiotic relationship between the wealthy Park family and the destitute Kim clan.", matchScore: 97, poster_path: "/7IiTT0SBRU7LGr6Uqcoy9vZ6p9f.jpg" }
      ]
    };

    try {
      const { prompt } = req.body;
      if (!prompt) return res.status(400).json({ error: "Prompt is required" });

      const cacheKey = `recommend_${Buffer.from(prompt).toString('base64').slice(0, 50)}`;
      const cached = getFromCache(cacheKey);
      if (cached) return res.json(cached);

      // Check if we are recently blocked by quota
      const now = Date.now();
      if (now - lastQuotaExceeded < QUOTA_COOLDOWN) {
        console.warn(`[CineMoodAI] Quota Cooldown Active. Using fallback for: "${prompt}"`);
        return await handleFallbackSearch(prompt, res, "The AI is currently processing deep cinematic patterns. Here are some essentials based on your request while it recalibrates.", true);
      }

      console.log(`[CineMoodAI] Requesting AI recommendations for: "${prompt}"`);
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: `Recommendations for: "${prompt}"`,
        config: {
          systemInstruction: "You are CineMoodAI, an elite cinematic consultant. Based on the user's mood, theme, or specific request (which may include languages like Hindi, Malayalam, Tamil, etc.), curate a selection of 8 exceptional movies. For each, provide the precise title, a deep thematic 'reason' why it resonates with their request (Label this as 'Why This Matches Your Mood'), a short compelling description, and a 'matchScore' (0-100). If the user asks for a specific region or language, prioritize that (e.g., Bollywood for Hindi, Mollywood for Malayalam). Always return valid JSON.",
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
                    description: { type: Type.STRING },
                    matchScore: { type: Type.NUMBER }
                  },
                  required: ["title", "reason", "description", "matchScore"]
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
      
      let parsed;
      try {
        const jsonMatch = text.match(/\{[\s\S]*\}/);
        const jsonStr = jsonMatch ? jsonMatch[0] : text;
        parsed = JSON.parse(jsonStr);
      } catch (parseError) {
        console.error("JSON Parse Error:", parseError, "Original text:", text);
        throw new Error("AI returned invalid JSON");
      }
      
      const apiKey = process.env.TMDB_API_KEY;
      if (apiKey && apiKey !== "YOUR_TMDB_API_KEY") {
        const seenIds = new Set<number>();
        const enhancedRecommendations = await Promise.all(
          parsed.recommendations.map(async (rec: any) => {
            try {
              const searchUrl = `https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&query=${encodeURIComponent(rec.title)}`;
              const searchRes = await fetch(searchUrl);
              const searchData = await searchRes.json();
              
              let movieDetails = { ...rec };

              if (searchData.results && searchData.results.length > 0) {
                // Try to find the best match by title similarity if possible, otherwise first result
                const bestMatch = searchData.results[0];
                if (seenIds.has(bestMatch.id)) return null;
                seenIds.add(bestMatch.id);

                // Fetch full details to get genres, runtime, etc.
                const detailUrl = `https://api.themoviedb.org/3/movie/${bestMatch.id}?api_key=${apiKey}&append_to_response=credits,videos`;
                const detailRes = await fetch(detailUrl);
                const fullDetails = await detailRes.json();

                const director = fullDetails.credits?.crew?.find((c: any) => c.job === "Director")?.name;

                movieDetails = {
                  ...movieDetails,
                  id: fullDetails.id,
                  poster_path: fullDetails.poster_path,
                  backdrop_path: fullDetails.backdrop_path,
                  vote_average: fullDetails.vote_average,
                  release_date: fullDetails.release_date,
                  runtime: fullDetails.runtime,
                  genres: fullDetails.genres?.map((g: any) => g.name),
                  director: director,
                  cast: fullDetails.credits?.cast?.slice(0, 3).map((c: any) => c.name),
                  trailer: fullDetails.videos?.results?.find((v: any) => v.type === "Trailer")?.key
                };

                const omdb = await fetchOMDbData(fullDetails.title, fullDetails.release_date);
                if (omdb) {
                  movieDetails = { 
                    ...movieDetails, 
                    omdb,
                    director: movieDetails.director || omdb.director,
                    runtime: movieDetails.runtime || (omdb.runtime ? parseInt(omdb.runtime) : null)
                  };
                }

                const streaming = await fetchWatchmodeData(fullDetails.id);
                if (streaming) movieDetails = { ...movieDetails, streaming };
              }
              return movieDetails;
            } catch (e) {
              console.error(`Error fetching data for ${rec.title}:`, e);
            }
            return rec;
          })
        );
        parsed.recommendations = enhancedRecommendations.filter(rec => rec !== null);
      }

      setToCache(cacheKey, parsed, 12); // Cache recommendations for 12h
      res.json(parsed);
    } catch (error: any) {
      // Robust detection of Gemini Quota Errors
      const errorMsg = String(error).toLowerCase();
      const errorJson = JSON.stringify(error).toLowerCase();
      
      const isQuotaError = 
        error?.status === 429 || 
        error?.code === 429 ||
        errorMsg.includes("429") ||
        errorMsg.includes("resource_exhausted") ||
        errorMsg.includes("quota") ||
        errorJson.includes("429") ||
        errorJson.includes("quota");

      if (isQuotaError) {
        console.warn("[CineMoodAI] Rate Limit/Quota Reached. Switching to predictive fallback.");
        
        // Detect daily limit for longer cooldown
        if (errorJson.includes("perday") || errorMsg.includes("per day")) {
          console.warn("[CineMoodAI] Daily quota detected. Extending cooldown.");
          lastQuotaExceeded = Date.now() + (23 * 60 * 60 * 1000); // 23h cooldown
        } else {
          lastQuotaExceeded = Date.now();
        }
      } else {
        // Only log non-quota errors to reduce noise
        console.error("[CineMoodAI] Operational Error:", error);
      }

      // Use dynamic fallback for ANY AI failure to ensure consistent user experience
      return await handleFallbackSearch(req.body.prompt || "Movies", res, 
        isQuotaError 
          ? "We've hit high demand for AI insights. Switching to specialized cinematic search results for you."
          : "The AI is refining its cinematic intuition. Here are some curated matches for your request.",
        true
      );
    }
  });

  async function handleFallbackSearch(query: string, res: any, reason: string, isFallback: boolean = false) {
    const apiKey = process.env.TMDB_API_KEY;
    const fallbacks = {
      overallReason: reason,
      recommendations: [] as any[],
      isFallback
    };

    if (!apiKey || apiKey === "YOUR_TMDB_API_KEY") {
      // Ultimate hardcoded fallback if even TMDB fails or is not configured
      fallbacks.recommendations = [
        { id: 278, title: "The Shawshank Redemption", reason: "Universally acclaimed for its message of hope and resilience.", description: "Two imprisoned men bond over a number of years, finding solace and eventual redemption through acts of common decency.", matchScore: 99, poster_path: "/9cqYj7yL7igIl0Pbz9SNS69CqZ.jpg" },
        { id: 27205, title: "Inception", reason: "Perfect for those seeking an intellectual and visual thrill.", description: "A thief who steals corporate secrets through the use of dream-sharing technology is given the inverse task of planting an idea.", matchScore: 98, poster_path: "/o0I0Bh96S38S5S6v9h9IqvA6S5.jpg" },
        { id: 496243, title: "Parasite", reason: "A masterpiece of social commentary and suspense.", description: "Greed and class discrimination threaten the newly formed symbiotic relationship between the wealthy Park family and the destitute Kim clan.", matchScore: 97, poster_path: "/7IiTT0SBRU7LGr6Uqcoy9vZ6p9f.jpg" }
      ];
      return res.json(fallbacks);
    }

    try {
      const q = query.toLowerCase();
      let searchUrl = `https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&query=${encodeURIComponent(query)}`;
      
      // Keyword detections for smarter discovery in fallback mode
      if (q.includes("hindi") || q.includes("bollywood") || q.includes("indian")) {
        searchUrl = `https://api.themoviedb.org/3/discover/movie?api_key=${apiKey}&with_original_language=hi|te|ta|ml&sort_by=popularity.desc`;
      } else if (q.includes("korean") || q.includes("k-drama") || q.includes("kdrama")) {
        searchUrl = `https://api.themoviedb.org/3/discover/movie?api_key=${apiKey}&with_original_language=ko&sort_by=popularity.desc`;
      } else if (q.includes("anime") || q.includes("animation")) {
        searchUrl = `https://api.themoviedb.org/3/discover/movie?api_key=${apiKey}&with_genres=16&sort_by=vote_average.desc&vote_count.gte=500`;
      } else if (q.includes("horror") || q.includes("scary")) {
        searchUrl = `https://api.themoviedb.org/3/discover/movie?api_key=${apiKey}&with_genres=27&sort_by=popularity.desc`;
      } else if (q.includes("action") || q.includes("thriller")) {
        searchUrl = `https://api.themoviedb.org/3/discover/movie?api_key=${apiKey}&with_genres=28,53&sort_by=popularity.desc`;
      } else if (q.includes("sci-fi") || q.includes("science fiction") || q.includes("space")) {
        searchUrl = `https://api.themoviedb.org/3/discover/movie?api_key=${apiKey}&with_genres=878&sort_by=popularity.desc`;
      }

      const searchRes = await fetch(searchUrl);
      const searchData = await searchRes.json();

      if (searchData.results && searchData.results.length > 0) {
        const topResults = searchData.results.slice(0, 8);
        const enhanced = await Promise.all(topResults.map(async (movie: any) => {
          try {
            const detailUrl = `https://api.themoviedb.org/3/movie/${movie.id}?api_key=${apiKey}&append_to_response=credits,videos`;
            const detailRes = await fetch(detailUrl);
            const fullDetails = await detailRes.json();
            const director = fullDetails.credits?.crew?.find((c: any) => c.job === "Director")?.name;

            let movieDetails = {
              id: fullDetails.id,
              title: fullDetails.title,
              reason: `Highly rated ${fullDetails.genres?.[0]?.name || "cinematic"} experience matching your theme.`,
              description: fullDetails.overview,
              matchScore: Math.floor(Math.random() * 10) + 85,
              poster_path: fullDetails.poster_path,
              backdrop_path: fullDetails.backdrop_path,
              vote_average: fullDetails.vote_average,
              release_date: fullDetails.release_date,
              runtime: fullDetails.runtime,
              genres: fullDetails.genres?.map((g: any) => g.name),
              director: director,
              cast: fullDetails.credits?.cast?.slice(0, 3).map((c: any) => c.name),
              trailer: fullDetails.videos?.results?.find((v: any) => v.type === "Trailer")?.key
            };

            const omdb = await fetchOMDbData(fullDetails.title, fullDetails.release_date);
            if (omdb) {
              movieDetails = { ...movieDetails, omdb } as any;
            }
            return movieDetails;
          } catch (err) {
            return movie;
          }
        }));
        fallbacks.recommendations = enhanced.filter(m => m && m.title);
      }

      // If still empty, use trending
      if (fallbacks.recommendations.length === 0) {
        const trendUrl = `https://api.themoviedb.org/3/trending/movie/week?api_key=${apiKey}`;
        const trendRes = await fetch(trendUrl);
        const trendData = await trendRes.json();
        if (trendData.results) {
          fallbacks.recommendations = trendData.results.slice(0, 6).map((m: any) => ({
            ...m,
            reason: "A trending masterpiece recommended for its current cinematic impact.",
            matchScore: 88
          }));
        }
      }
    } catch (e) {
      console.error("Fallback search critical failure:", e);
    }
    return res.json(fallbacks);
  }

  // Movie Data Proxy with Caching
  app.get("/api/movies/:type", async (req, res) => {
    const { type } = req.params;
    const page = req.query.page || "1";
    const cacheKey = `movies_${type}_${page}`;
    const cached = getFromCache(cacheKey);
    if (cached) return res.json(cached);

    const apiKey = process.env.TMDB_API_KEY;
    
    try {
      if (!apiKey || apiKey === "YOUR_TMDB_API_KEY") {
        throw new Error("No TMDB Key");
      }
      
      let url = "";
      switch(type) {
        case "trending": url = `https://api.themoviedb.org/3/trending/movie/week?api_key=${apiKey}&page=${page}`; break;
        case "popular": url = `https://api.themoviedb.org/3/movie/popular?api_key=${apiKey}&page=${page}`; break;
        case "top_rated": url = `https://api.themoviedb.org/3/movie/top_rated?api_key=${apiKey}&page=${page}`; break;
        case "upcoming": url = `https://api.themoviedb.org/3/movie/upcoming?api_key=${apiKey}&page=${page}`; break;
        case "k-drama": 
        case "korean": url = `https://api.themoviedb.org/3/discover/movie?api_key=${apiKey}&with_original_language=ko&sort_by=popularity.desc&page=${page}`; break;
        case "anime": url = `https://api.themoviedb.org/3/discover/movie?api_key=${apiKey}&with_genres=16&with_keywords=210024|287501&sort_by=popularity.desc&page=${page}`; break;
        case "action": url = `https://api.themoviedb.org/3/discover/movie?api_key=${apiKey}&with_genres=28&sort_by=popularity.desc&page=${page}`; break;
        case "sci_fi": url = `https://api.themoviedb.org/3/discover/movie?api_key=${apiKey}&with_genres=878&sort_by=popularity.desc&page=${page}`; break;
        case "horror": url = `https://api.themoviedb.org/3/discover/movie?api_key=${apiKey}&with_genres=27&sort_by=popularity.desc&page=${page}`; break;
        case "romance": url = `https://api.themoviedb.org/3/discover/movie?api_key=${apiKey}&with_genres=10749&sort_by=popularity.desc&page=${page}`; break;
        case "comedy": url = `https://api.themoviedb.org/3/discover/movie?api_key=${apiKey}&with_genres=35&sort_by=popularity.desc&page=${page}`; break;
        case "thriller": url = `https://api.themoviedb.org/3/discover/movie?api_key=${apiKey}&with_genres=53&sort_by=popularity.desc&page=${page}`; break;
        case "ott": url = `https://api.themoviedb.org/3/discover/movie?api_key=${apiKey}&with_watch_providers=8|119|337|122|232|237&watch_region=IN&sort_by=popularity.desc&page=${page}`; break;
        case "indian": url = `https://api.themoviedb.org/3/discover/movie?api_key=${apiKey}&with_original_language=hi|te|ta|ml|kn&sort_by=popularity.desc&page=${page}`; break;
        case "hindi": url = `https://api.themoviedb.org/3/discover/movie?api_key=${apiKey}&with_original_language=hi&sort_by=popularity.desc&page=${page}`; break;
        case "funny": url = `https://api.themoviedb.org/3/discover/movie?api_key=${apiKey}&with_genres=35&sort_by=popularity.desc&page=${page}`; break;
        case "mind-blowing": 
        case "mind-bending": url = `https://api.themoviedb.org/3/discover/movie?api_key=${apiKey}&with_genres=878,9648&sort_by=popularity.desc&page=${page}`; break;
        case "emotional": 
        case "emotional-drama": url = `https://api.themoviedb.org/3/discover/movie?api_key=${apiKey}&with_genres=18&sort_by=popularity.desc&page=${page}`; break;
        case "adventure": url = `https://api.themoviedb.org/3/discover/movie?api_key=${apiKey}&with_genres=12&sort_by=popularity.desc&page=${page}`; break;
        case "mystery": url = `https://api.themoviedb.org/3/discover/movie?api_key=${apiKey}&with_genres=9648&sort_by=popularity.desc&page=${page}`; break;
        default: url = `https://api.themoviedb.org/3/movie/popular?api_key=${apiKey}&page=${page}`;
      }
      
      const response = await fetch(url);
      const data = await response.json();
      setToCache(cacheKey, data, 2); // Cache for 2 hours
      res.json(data);
    } catch (err) {
      res.json(getMockMovies(type));
    }
  });

  app.get("/api/movie/:id", async (req, res) => {
    const { id } = req.params;
    const apiKey = process.env.TMDB_API_KEY;
    try {
      if (!apiKey || apiKey === "YOUR_TMDB_API_KEY") throw new Error("No API Key");
      const url = `https://api.themoviedb.org/3/movie/${id}?api_key=${apiKey}&append_to_response=videos,credits,similar`;
      const response = await fetch(url);
      const data = await response.json();

      // Merge OMDb data using IMDb ID
      if (data.imdb_id) {
        const omdb = await fetchOMDbData(data.title, data.release_date, data.imdb_id);
        if (omdb) {
          data.omdb = omdb;
        }
      }

      // Add Watchmode (Streaming) data
      const streaming = await fetchWatchmodeData(parseInt(id));
      if (streaming) {
        data.streaming = streaming;
      }

      // Add TasteDive Recommendations
      const tdSimilar = await fetchTasteDiveSimilar(data.title);
      if (tdSimilar && tdSimilar.length > 0) {
        // Try to enrich TasteDive results with TMDB data (partially, or just titles)
        data.tastedive_similar = tdSimilar;
      }

      res.json(data);
    } catch (err) {
      // Return a mock movie detail for fallback
      res.json({
        id,
        title: "Interstellar",
        overview: "The adventures of a group of explorers who make use of a newly discovered wormhole to surpass the limitations on human space travel and conquer the vast distances involved in an interstellar voyage.",
        vote_average: 8.7,
        release_date: "2014-11-07",
        runtime: 169,
        genres: [{ name: "Adventure" }, { name: "Drama" }, { name: "Science Fiction" }],
        credits: {
          cast: [
            { name: "Matthew McConaughey", character: "Joseph Cooper" },
            { name: "Anne Hathaway", character: "Dr. Amelia Brand" },
            { name: "Jessica Chastain", character: "Murphy Cooper" }
          ]
        },
        videos: { results: [{ key: "zSWdZVtXT7E", site: "YouTube", type: "Trailer" }] },
        similar: { results: getMockMovies("popular").results }
      });
    }
  });

  // API 404 Handler (ensures /api/* always returns JSON)
  app.all("/api/*", (req, res) => {
    res.status(404).json({ error: `API route ${req.method} ${req.url} not found` });
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
    { id: 1, title: "Interstellar", vote_average: 8.7, release_date: "2014-11-07", poster_path: "/gEU2QniE6E77NI6lCU6MxlnoEG7.jpg", backdrop_path: images[0], overview: "The adventures of a group of explorers who make use of a newly discovered wormhole...", omdb: { imdbRating: "8.7", rated: "PG-13", director: "Christopher Nolan" } },
    { id: 2, title: "Inception", vote_average: 8.8, release_date: "2010-07-16", poster_path: "/o0I0Bh96S38S5S6v9h9IqvA6S5.jpg", backdrop_path: images[1], overview: "Cobb, a skilled thief who commits corporate espionage by infiltrating the subconscious...", omdb: { imdbRating: "8.8", rated: "PG-13", director: "Christopher Nolan" } },
    { id: 3, title: "The Parasite", vote_average: 8.5, release_date: "2019-05-30", poster_path: "/7IiTT0SBRU7LGr6Uqcoy9vZ6p9f.jpg", backdrop_path: images[2], overview: "Greed and class discrimination threaten the newly formed symbiotic relationship...", omdb: { imdbRating: "8.5", rated: "R", director: "Bong Joon-ho" } },
    { id: 4, title: "Kimi no Na wa.", vote_average: 8.5, release_date: "2016-08-26", poster_path: "/q719jsmZvkv6tUaURu9p9mSENS1.jpg", backdrop_path: images[3], overview: "High schoolers Mitsuha and Taki are complete strangers living separate lives...", omdb: { imdbRating: "8.4", rated: "PG-13", director: "Makoto Shinkai" } },
  ];
  if (type === "ott") {
    return { results: movies.map(m => ({ ...m, streaming: [{ name: "Netflix", url: "#" }, { name: "Prime Video", url: "#" }] })) };
  }
  return { results: movies };
}

startServer();
