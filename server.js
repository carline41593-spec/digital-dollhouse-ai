import express from "express";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json({ limit: "10mb" }));

const FIREWORKS_KEY = process.env.FIREWORKS_KEY;

if (!FIREWORKS_KEY) console.error("FIREWORKS_KEY missing!");

app.get("/", (req, res) => res.json({ status: "alive" }));

app.post("/generate", async (req, res) => {
  try {
    const { prompt } = req.body;
    if (!prompt) return res.status(400).json({ error: "Missing prompt" });

    const response = await fetch("https://api.fireworks.ai/inference/v1/images/generations", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${FIREWORKS_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "flux-schnell",
        prompt,
        width: 1024,
        height: 1024,
        steps: 4,
        output_format: "png",
      }),
    });

    if (!response.ok) {
      const err = await response.text();
      return res.status(502).json({ error: "Fireworks error", details: err });
    }

    const data = await response.json();
    const imageUrl = data.images?.[0]?.url;

    if (!imageUrl) return res.status(500).json({ error: "No image" });

    res.json({ image_url: imageUrl });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => console.log(`Backend running on port ${PORT}`));
