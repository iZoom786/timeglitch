const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "../.env.local") });

let fetchFn = global.fetch;
try { if (!fetchFn) fetchFn = require("node-fetch"); } catch (_) {}
const fetch = fetchFn;

const NEWS_API_KEY = process.env.NEWS_API_KEY || "";

export default async function handler(request, response) {
  try {
    // For NewsAPI free tier, we'll only fetch articles from the last week
    if (!NEWS_API_KEY) {
      return response.status(500).json({ error: "News API key not configured" });
    }
    
    // Calculate date range for last week
    const today = new Date();
    const oneWeekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
    
    const toDate = today.toISOString().split('T')[0];
    const fromDate = oneWeekAgo.toISOString().split('T')[0];
    
    // Fetch news from NewsAPI for the last week
    const url = `https://newsapi.org/v2/everything?q=usa&from=${fromDate}&to=${toDate}&sortBy=popularity&apiKey=${NEWS_API_KEY}&pageSize=20`;
    const apiResponse = await fetch(url);
    
    if (!apiResponse.ok) {
      const errorText = await apiResponse.text();
      return response.status(apiResponse.status).json({ error: `News API request failed: ${errorText}` });
    }
    
    const data = await apiResponse.json();
    return response.json(data);
  } catch (e) {
    return response.status(500).json({ error: String(e.message || e) });
  }
}