const path = require("path");
const fs = require("fs");
require("dotenv").config({ path: path.join(__dirname, "../.env.local") });

let fetchFn = global.fetch;
try { if (!fetchFn) fetchFn = require("node-fetch"); } catch (_) {}
const fetch = fetchFn;

const express = require("express");
const app = express();
app.use(express.json({ limit: "2mb" }));

const NEWS_API_KEY = process.env.NEWS_API_KEY || "";

// Serve static files
app.use(express.static(path.join(__dirname, "../")));

// New endpoint to fetch recent news (last week)
app.get("/api/news", async (req, res) => {
  try {
    // For NewsAPI free tier, we'll only fetch articles from the last week
    if (!NEWS_API_KEY) return res.status(500).json({ error: "News API key not configured" });
    
    // Calculate date range for last week
    const today = new Date();
    const oneWeekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
    
    const toDate = today.toISOString().split('T')[0];
    const fromDate = oneWeekAgo.toISOString().split('T')[0];
    
    // Fetch news from NewsAPI for the last week
    const url = `https://newsapi.org/v2/everything?q=usa&from=${fromDate}&to=${toDate}&sortBy=popularity&apiKey=${NEWS_API_KEY}&pageSize=20`;
    const response = await fetch(url);
    
    if (!response.ok) {
      const errorText = await response.text();
      return res.status(response.status).json({ error: `News API request failed: ${errorText}` });
    }
    
    const data = await response.json();
    return res.json(data);
  } catch (e) {
    res.status(500).json({ error: String(e.message || e) });
  }
});

// Export the Express app as a Vercel serverless function
module.exports = (req, res) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.status(200).end();
    return;
  }
  
  // Set CORS headers for all responses
  res.setHeader('Access-Control-Allow-Origin', '*');
  
  return app(req, res);
};