// api/news.js - Vercel serverless function
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
    // Use New York Times Archive API key
    const NY_TIMES_API_KEY = process.env.NY_TIMES_API_KEY || "";
    
    if (!NY_TIMES_API_KEY) {
      return res.status(500).json({ error: "New York Times API key not configured" });
    }
    
    // Generate a random date within the specified range (1895 to 1999)
    const randomYear = 1895 + Math.floor(Math.random() * (1999 - 1895 + 1));
    const randomMonth = Math.floor(Math.random() * 12) + 1;
    
    // Fetch news from New York Times Archive API
    const url = `https://api.nytimes.com/svc/archive/v1/${randomYear}/${randomMonth}.json?api-key=${NY_TIMES_API_KEY}`;
    
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
      return res.status(apiResponse.status).json({ error: `NYT Archive API request failed: ${errorText}` });
    }
    
    const data = await apiResponse.json();
    
    // Transform NYT data to match the expected format
    const transformedData = {
      status: "ok",
      articles: []
    };
    
    // Extract articles from NYT response
    if (data.response && data.response.docs && Array.isArray(data.response.docs)) {
      transformedData.articles = data.response.docs.map(doc => ({
        title: doc.headline ? doc.headline.main : "Untitled Article",
        description: doc.snippet || "No description available",
        pub_date: doc.pub_date || new Date().toISOString(),
        url: doc.web_url || "",
        // Include as much article content as possible
        content: [
          doc.lead_paragraph,
          doc.abstract,
          doc.snippet,
          doc.headline ? doc.headline.main : "",
          doc.byline ? doc.byline.original : ""
        ].filter(Boolean).join(". ") || "No content available"
      }));
    }
    
    return res.status(200).json(transformedData);
  } catch (e) {
    console.error("API Error:", e);
    return res.status(500).json({ error: String(e.message || e) });
  }
}