// pages/api/news.js
import path from "path";

// Load environment variables
const envPath = path.join(process.cwd(), ".env.local");
require("dotenv").config({ path: envPath });

let fetchFn = global.fetch;
try { 
  if (!fetchFn) {
    // Dynamically import node-fetch for server-side
    fetchFn = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));
  }
} catch (_) {}

export default async function handler(req, res) {
  try {
    // For NewsAPI free tier, we'll only fetch articles from the last week
    const NEWS_API_KEY = process.env.NEWS_API_KEY || "";
    
    if (!NEWS_API_KEY) {
      return res.status(500).json({ error: "News API key not configured" });
    }
    
    // Calculate date range for last week
    const today = new Date();
    const oneWeekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
    
    const toDate = today.toISOString().split('T')[0];
    const fromDate = oneWeekAgo.toISOString().split('T')[0];
    
    // Fetch news from NewsAPI for the last week
    const url = `https://newsapi.org/v2/everything?q=usa&from=${fromDate}&to=${toDate}&sortBy=popularity&apiKey=${NEWS_API_KEY}&pageSize=20`;
    
    // Use dynamic import for node-fetch if needed
    const fetch = typeof fetchFn === 'function' && fetchFn.constructor.name === 'AsyncFunction' 
      ? await fetchFn() 
      : fetchFn;
      
    const apiResponse = await fetch(url);
    
    if (!apiResponse.ok) {
      const errorText = await apiResponse.text();
      return res.status(apiResponse.status).json({ error: `News API request failed: ${errorText}` });
    }
    
    const data = await apiResponse.json();
    return res.status(200).json(data);
  } catch (e) {
    console.error("API Error:", e);
    return res.status(500).json({ error: String(e.message || e) });
  }
}