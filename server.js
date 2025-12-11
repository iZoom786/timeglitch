const path = require("path");
const fs = require("fs");
const { spawn } = require("child_process");
require("dotenv").config({ path: path.join(__dirname, ".env.local") });

let fetchFn = global.fetch;
try { if (!fetchFn) fetchFn = require("node-fetch"); } catch (_) {}
const fetch = fetchFn;

const express = require("express");
const app = express();
app.use(express.json({ limit: "2mb" }));

const PORT = process.env.PORT ? Number(process.env.PORT) : 8000;
const SUPA_KEY = process.env.SUPADATA_API_KEY || process.env.SUPADATA_KEY || process.env.SUPADATA;
const NEWS_API_KEY = process.env.NEWS_API_KEY || ""; // Add NewsAPI key

function ensureDir(p) {
  if (!fs.existsSync(p)) fs.mkdirSync(p, { recursive: true });
}

ensureDir(path.join(__dirname, "audio"));
ensureDir(path.join(__dirname, "bin"));

app.use("/audio", express.static(path.join(__dirname, "audio")));
app.use(express.static(__dirname));

// New endpoint to fetch recent news (last week)
app.get("/api/news", async (req, res) => {
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
    
    const response = await fetch(url);
    
    if (!response.ok) {
      const errorText = await response.text();
      return res.status(response.status).json({ error: `NYT Archive API request failed: ${errorText}` });
    }
    
    const data = await response.json();
    
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
        // Include the full article content from the "main" section
        content: doc.lead_paragraph || doc.abstract || doc.snippet || ""
      }));
    }
    
    return res.json(transformedData);
  } catch (e) {
    res.status(500).json({ error: String(e.message || e) });
  }
});

// Existing endpoints for YouTube functionality (keeping them in case we want to use them later)
app.get("/api/video", async (req, res) => {
  try {
    const id = req.query.id || req.query.url;
    if (!id) return res.status(400).json({ error: "Missing id/url" });
    if (!SUPA_KEY) return res.status(500).json({ error: "Supadata key not configured" });
    const u = new URL("https://api.supadata.ai/v1/youtube/video");
    u.searchParams.set("id", id);
    const r = await fetch(u.toString(), { headers: { "x-api-key": SUPA_KEY } });
    const txt = await r.text();
    res.status(r.status).send(txt);
  } catch (e) { res.status(500).json({ error: String(e.message || e) }); }
});

app.get("/api/transcript", async (req, res) => {
  try {
    const url = req.query.url;
    if (!url) return res.status(400).json({ error: "Missing url" });
    if (!SUPA_KEY) return res.status(500).json({ error: "Supadata key not configured" });
    const u = new URL("https://api.supadata.ai/v1/transcript");
    u.searchParams.set("url", url);
    u.searchParams.set("text", "true");
    const r = await fetch(u.toString(), { headers: { "x-api-key": SUPA_KEY } });
    if (r.status === 202) {
      const j = await r.json();
      const jobId = j.jobId;
      let attempt = 0;
      while (attempt < 20) {
        await new Promise(r => setTimeout(r, Math.min(1000 * (attempt + 1), 5000)));
        const jr = await fetch(`https://api.supadata.ai/v1/transcript/${jobId}`, { headers: { "x-api-key": SUPA_KEY } });
        if (!jr.ok) return res.status(jr.status).send(await jr.text());
        const job = await jr.json();
        if (job.status === "completed") return res.json(job);
        if (job.status === "failed") return res.status(500).json({ error: job.error || "Transcript job failed" });
        attempt++;
      }
      return res.status(504).json({ error: "Transcript polling timeout" });
    } else {
      const txt = await r.text();
      return res.status(r.status).send(txt);
    }
  } catch (e) { res.status(500).json({ error: String(e.message || e) }); }
});

app.get("/api/audio", async (req, res) => {
  try {
    const url = req.query.url;
    if (!url) return res.status(400).json({ error: "Missing url" });
    const token = `${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
    const outTpl = path.join(__dirname, "audio", `${token}.%(ext)s`);

    const ytdlpExe = path.join(__dirname, "bin", process.platform === "win32" ? "yt-dlp.exe" : "yt-dlp");
    const ytdlpCmd = fs.existsSync(ytdlpExe) ? ytdlpExe : "yt-dlp";
    const args = [
      "-f", "bestaudio[ext=m4a]/bestaudio/best",
      "--extract-audio",
      "--audio-format", "mp3",
      "--audio-quality", "192K",
      "--force-ipv4",
      "--geo-bypass",
      "--youtube-skip-dash-manifest",
      "--retries", "10",
      "--fragment-retries", "10",
      "--http-chunk-size", "1048576",
      "--add-header", "Referer: https://www.youtube.com",
      "--user-agent", "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0 Safari/537.36",
      "--extractor-args", "youtube:player_client=android,lang=en",
      "-o", outTpl,
      url
    ];
    const ytdlp = spawn(ytdlpCmd, args, { stdio: "pipe" });

    let stderr = "";
    ytdlp.stderr.on("data", d => { stderr += d.toString(); });
    ytdlp.on("error", (err) => {
      return res.status(500).json({ error: `yt-dlp not available: ${String(err.message || err)}` });
    });
    ytdlp.on("close", (code) => {
      if (code !== 0) {
        return res.status(500).json({ error: stderr || `yt-dlp failed with code ${code}` });
      }
      const mp3Path = path.join(__dirname, "audio", `${token}.mp3`);
      if (!fs.existsSync(mp3Path)) {
        return res.status(500).json({ error: "Audio conversion failed (mp3 not found). Ensure ffmpeg is installed." });
      }
      const rel = `/audio/${path.basename(mp3Path)}`;
      return res.json({ audioUrl: rel });
    });
  } catch (e) { res.status(500).json({ error: String(e.message || e) }); }
});

async function embedBatch(texts) {
  const apiUrl = process.env.EMBEDDINGS_API_URL || "https://api.x.ai/v1/embeddings";
  const apiKey = process.env.EMBEDDINGS_API_KEY;
  const model = process.env.EMBEDDINGS_MODEL || "Llama-3.3-70B-Versatile";
  if (!apiKey) throw new Error("Embeddings API key not configured");
  const r = await fetch(apiUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${apiKey}` },
    body: JSON.stringify({ model, input: texts })
  });
  if (!r.ok) throw new Error(`Embeddings request failed (${r.status})`);
  const j = await r.json();
  const vectors = j.data?.map(d => d.embedding) || [];
  if (!vectors.length) throw new Error("No embeddings returned");
  const dim = Number(process.env.PINECONE_DIMENSIONS || 1024);
  if (Array.isArray(vectors[0]) && vectors[0].length !== dim) throw new Error(`Embedding dimension mismatch: got ${vectors[0].length}, expected ${dim}`);
  return vectors;
}

async function pineconeUpsert(vectors, namespace) {
  const host = process.env.PINECONE_HOST;
  const key = process.env.PINECONE_API_KEY;
  if (!host || !key) throw new Error("Pinecone host/api key not configured");
  const payload = { vectors, namespace: namespace || process.env.PINECONE_NAMESPACE || "default" };
  const r = await fetch(`${host}/vectors/upsert`, {
    method: "POST",
    headers: { "Content-Type": "application/json", "Api-Key": key },
    body: JSON.stringify(payload)
  });
  if (!r.ok) throw new Error(`Pinecone upsert failed (${r.status})`);
  return await r.json();
}

async function pineconeQuery(vector, topK, namespace) {
  const host = process.env.PINECONE_HOST;
  const key = process.env.PINECONE_API_KEY;
  if (!host || !key) throw new Error("Pinecone host/api key not configured");
  const payload = { topK: topK || 5, vector, includeMetadata: true, namespace: namespace || process.env.PINECONE_NAMESPACE || "default" };
  const r = await fetch(`${host}/query`, {
    method: "POST",
    headers: { "Content-Type": "application/json", "Api-Key": key },
    body: JSON.stringify(payload)
  });
  if (!r.ok) throw new Error(`Pinecone query failed (${r.status})`);
  return await r.json();
}

function chunkText(text, chunkSize) {
  const size = chunkSize || 1000;
  const chunks = [];
  let i = 0;
  while (i < text.length) {
    chunks.push(text.slice(i, i + size));
    i += size;
  }
  return chunks;
}

app.post("/api/index", async (req, res) => {
  try {
    const url = req.body?.url;
    if (!url) return res.status(400).json({ error: "Missing url" });
    const metaU = new URL("https://api.supadata.ai/v1/youtube/video");
    metaU.searchParams.set("id", url);
    const metaR = await fetch(metaU.toString(), { headers: { "x-api-key": SUPA_KEY } });
    if (!metaR.ok) return res.status(metaR.status).send(await metaR.text());
    const meta = await metaR.json();
    const trU = new URL("https://api.supadata.ai/v1/transcript");
    trU.searchParams.set("url", url);
    trU.searchParams.set("text", "true");
    const trR = await fetch(trU.toString(), { headers: { "x-api-key": SUPA_KEY } });
    let transcript;
    if (trR.status === 202) {
      const j = await trR.json();
      let attempt = 0; let result;
      while (attempt < 20) {
        await new Promise(r => setTimeout(r, Math.min(1000 * (attempt + 1), 5000)));
        const jr = await fetch(`https://api.supadata.ai/v1/transcript/${j.jobId}`, { headers: { "x-api-key": SUPA_KEY } });
        if (!jr.ok) return res.status(jr.status).send(await jr.text());
        result = await jr.json();
        if (result.status === "completed") break;
        if (result.status === "failed") return res.status(500).json({ error: result.error || "Transcript job failed" });
        attempt++;
      }
      transcript = result.content || "";
    } else {
      const t = await trR.json();
      transcript = t.content || "";
    }
    if (!transcript) return res.status(206).json({ error: "Transcript unavailable" });
    const chunks = chunkText(transcript, 1000);
    const embs = await embedBatch(chunks);
    const vectors = embs.map((v, i) => ({ id: `${meta.id || url}-${i}`, values: v, metadata: { url, title: meta.title || "", channel: meta.channel?.name || "", chunk: chunks[i], idx: i } }));
    const upsertRes = await pineconeUpsert(vectors, process.env.PINECONE_NAMESPACE || "youtube");
    return res.json({ indexed: vectors.length, upsert: upsertRes });
  } catch (e) { res.status(500).json({ error: String(e.message || e) }); }
});

app.get("/api/search", async (req, res) => {
  try {
    const q = req.query.q;
    if (!q) return res.status(400).json({ error: "Missing q" });
    const [emb] = await embedBatch([q]);
    const result = await pineconeQuery(emb, Number(req.query.topK) || 5, process.env.PINECONE_NAMESPACE || "youtube");
    return res.json(result);
  } catch (e) { res.status(500).json({ error: String(e.message || e) }); }
});

app.listen(PORT, () => {
  console.log(`Recent News Radio server running at http://localhost:${PORT}/`);
});