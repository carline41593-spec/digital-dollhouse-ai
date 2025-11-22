// app/image-generation/page.tsx
"use client";

import { useState } from "react";

export default function ImageGeneration() {
  const [prompt, setPrompt] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [loading, setLoading] = useState(false);

  const generate = async () => {
    if (!prompt.trim()) return;
    setLoading(true);
    setImageUrl("");

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
      });

      const data = await res.json();

      if (!res.ok || data.error) throw new Error(data.error || "Failed");

      // Handles fal.ai, Replicate, Fireworks — anything!
      let url = "";
      if (data.image_url) url = data.image_url;
      else if (Array.isArray(data.images) && data.images[0]) url = data.images[0];
      else if (data.output && data.output[0]) url = data.output[0];

      setImageUrl(url);
    } catch (err: any) {
      alert("Error: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white p-20">
      <h1 className="text-7xl font-bold bg-gradient-to-r from-pink-500 to-purple-500 bg-clip-text text-transparent mb-8">
        Image Generation
      </h1>

      <textarea
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        placeholder="Describe your dream dollhouse..."
        className="w-full h-48 p-6 bg-gray-900 rounded-3xl text-xl mb-8 border border-purple-500/30 focus:border-purple-400 outline-none"
      />

      <button
        onClick={generate}
        disabled={loading}
        className="px-16 py-6 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full text-2xl font-bold hover:scale-105 transition disabled:opacity-50"
      >
        {loading ? "Generating… (5–20s)" : "Generate Dollhouse"}
      </button>

      {imageUrl && (
        <div className="mt-16">
          <img src={imageUrl} alt="Your dollhouse" className="rounded-3xl shadow-2xl max-w-4xl" />
          <a href={imageUrl} download className="block mt-6 text-center text-purple-400 text-xl underline">
            Download Image
          </a>
        </div>
      )}
    </div>
  );
}
