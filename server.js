import express from "express";
import cors from "cors";
import fetch from "node-fetch";

const app = express();
app.use(cors({ origin: "*" }));  // Allow Vercel origins
app.use(express.json());         // Parse JSON bodies
app.use(express.text({ type: "*/*" }));  // Fallback

const FIREWORKS_KEY = process.env.FIREWORKS_KEY;

// GET handler (fixes "Cannot GET" error)
app.get("/generate", (req, res) => {
  res.json({ message: "POST here for Flux images", example: { prompt: "test dollhouse" } });
});

app.post("/generate", async (req, res) => {
  try {
    const prompt = req.body?.prompt;
    if (!prompt) return res.status(400).json({ error: "Missing prompt" });

    if (!FIREWORKS_KEY) return res.status(500).json({ error: "API key missing" });

    const apiRes = await fetch("https://api.fireworks.ai/inference/v1/images/generations", {
      method: "POST",
      headers: { Authorization: `Bearer ${FIREWORKS_KEY}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "flux-schnell",  // Valid & fast (per Fireworks docs)
        prompt,
        width: 1024, height: 1024, steps: 20,  // Faster params
        output_format: "png"
      }),
    });

    if (!apiRes.ok) {
      const err = await apiRes.text();
      return res.status(502).json({ error: "Fireworks failed", details: err });
    }

    const data = await apiRes.json();
    if (!data?.images?.[0]?.url) return res.status(500).json({ error: "No image", data });

    res.json({ image_url: data.images[0].url });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, "0.0.0.0", () => console.log(`Backend on ${PORT}`));
