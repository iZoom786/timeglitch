module.exports = [
"[externals]/next/dist/compiled/@opentelemetry/api [external] (next/dist/compiled/@opentelemetry/api, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/@opentelemetry/api", () => require("next/dist/compiled/@opentelemetry/api"));

module.exports = mod;
}),
"[externals]/next/dist/compiled/next-server/pages-api-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/pages-api-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/pages-api-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/pages-api-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[externals]/path [external] (path, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("path", () => require("path"));

module.exports = mod;
}),
"[externals]/dotenv [external] (dotenv, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("dotenv", () => require("dotenv"));

module.exports = mod;
}),
"[project]/pages/api/news.js [api] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// pages/api/news.js
__turbopack_context__.s([
    "default",
    ()=>handler
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$path__$5b$external$5d$__$28$path$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/path [external] (path, cjs)");
;
// Load environment variables
const envPath = __TURBOPACK__imported__module__$5b$externals$5d2f$path__$5b$external$5d$__$28$path$2c$__cjs$29$__["default"].join(process.cwd(), ".env.local");
__turbopack_context__.r("[externals]/dotenv [external] (dotenv, cjs)").config({
    path: envPath
});
async function handler(req, res) {
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
            return res.status(500).json({
                error: "New York Times API key not configured"
            });
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
            const nodeFetch = await __turbopack_context__.A("[externals]/node-fetch [external] (node-fetch, esm_import, async loader)");
            fetchImpl = nodeFetch.default;
        }
        const apiResponse = await fetchImpl(url);
        if (!apiResponse.ok) {
            const errorText = await apiResponse.text();
            return res.status(apiResponse.status).json({
                error: `NYT Archive API request failed: ${errorText}`
            });
        }
        const data = await apiResponse.json();
        // Transform NYT data to match the expected format
        const transformedData = {
            status: "ok",
            articles: []
        };
        // Extract articles from NYT response
        if (data.response && data.response.docs && Array.isArray(data.response.docs)) {
            transformedData.articles = data.response.docs.map((doc)=>({
                    title: doc.headline ? doc.headline.main : "Untitled Article",
                    description: doc.snippet || "No description available",
                    pub_date: doc.pub_date || new Date().toISOString(),
                    url: doc.web_url || "",
                    // Include the full article content from the "main" section
                    content: doc.lead_paragraph || doc.abstract || doc.snippet || ""
                }));
        }
        return res.status(200).json(transformedData);
    } catch (e) {
        console.error("API Error:", e);
        return res.status(500).json({
            error: String(e.message || e)
        });
    }
}
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__6d22348e._.js.map