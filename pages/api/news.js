// pages/api/news.js
import path from "path";

// Load environment variables
const envPath = path.join(process.cwd(), ".env.local");
require("dotenv").config({ path: envPath });

export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  
  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }
  
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
    
    // Use native fetch if available, otherwise import node-fetch
    let fetchImpl;
    if (typeof fetch !== 'undefined') {
      fetchImpl = fetch;
    } else {
      const nodeFetch = await import('node-fetch');
      fetchImpl = nodeFetch.default;
    }
    
    const apiResponse = await fetchImpl(url);
    
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