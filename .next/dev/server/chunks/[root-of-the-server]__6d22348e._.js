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
let fetchFn = /*TURBOPACK member replacement*/ __turbopack_context__.g.fetch;
try {
    if (!fetchFn) {
        // Dynamically import node-fetch for server-side
        fetchFn = (...args)=>__turbopack_context__.A("[externals]/node-fetch [external] (node-fetch, esm_import, async loader)").then(({ default: fetch })=>fetch(...args));
    }
} catch (_) {}
async function handler(req, res) {
    try {
        // For NewsAPI free tier, we'll only fetch articles from the last week
        const NEWS_API_KEY = process.env.NEWS_API_KEY || "";
        if (!NEWS_API_KEY) {
            return res.status(500).json({
                error: "News API key not configured"
            });
        }
        // Calculate date range for last week
        const today = new Date();
        const oneWeekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
        const toDate = today.toISOString().split('T')[0];
        const fromDate = oneWeekAgo.toISOString().split('T')[0];
        // Fetch news from NewsAPI for the last week
        const url = `https://newsapi.org/v2/everything?q=usa&from=${fromDate}&to=${toDate}&sortBy=popularity&apiKey=${NEWS_API_KEY}&pageSize=20`;
        // Use dynamic import for node-fetch if needed
        const fetch = typeof fetchFn === 'function' && fetchFn.constructor.name === 'AsyncFunction' ? await fetchFn() : fetchFn;
        const apiResponse = await fetch(url);
        if (!apiResponse.ok) {
            const errorText = await apiResponse.text();
            return res.status(apiResponse.status).json({
                error: `News API request failed: ${errorText}`
            });
        }
        const data = await apiResponse.json();
        return res.status(200).json(data);
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