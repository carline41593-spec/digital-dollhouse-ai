// app/image-generation/page.tsx
"use client";

import { useState } from "react";
import Image from "next/image";

export default function ImageGeneration() {
  const [prompt, setPrompt] = useState("");
  const [images, setImages] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const generate = async () => {
    if (!prompt.trim()) return;
    setLoading(true);
    setImages([]);

    try {
      const res = await fetch("/api/photoshoot", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: prompt.trim() }), // no image → text-to-image
      });

      const data = await res.json();
      if (data.images) setImages(data.images);
    } catch (err) {
      alert("Error – check console");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white p-8 pl-96">
      <h1 className="text-6xl md:text-8xl font-black bg-gradient-to-r from-pink-500 via-purple-500 to-yellow-400 bg-clip-text text-transparent mb-4">
        Image Generation
      </h1>
      <p className="text-xl text-gray-400 mb-12">Type anything → get 4 masterpiece images</p>

      <div className="max-w-6xl mx-auto space-y-12">
        <div className="flex gap-6">
          <input
            type="text"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && generate()}
            placeholder="e.g. cyberpunk girl with neon hair, ultra realistic, 8k"
            className="flex-1 h-20 bg-black/60 border border-pink-500/40 rounded-3xl px-8 text-xl placeholder-gray-500 focus:border-pink-400 focus:outline-none"
          />
          <button
            onClick={generate}
            disabled={loading || !prompt}
            className="px-16 h-20 bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 disabled:opacity-50 text-2xl font-bold rounded-3xl transition shadow-lg shadow-pink-500/50"
          >
            {loading ? "Generating…" : "Generate 4 Images"}
          </button>
        </div>

        <div className="grid grid-cols-2 gap-8">
          {loading &&
            [...Array(4)].map((_, i) => (
              <div key={i} className="h-96 bg-gradient-to-br from-pink-900/20 to-purple-900/20 rounded-3xl animate-pulse" />
            ))}

          {images.map((url, i) => (
            <div key={i} className="bg-gradient-to-br from-pink-900/20 to-purple-900/20 border border-pink-500/30 rounded-3xl p-4 overflow-hidden">
              <Image src={url} alt="Generated" width={1024} height={1024} className="w-full rounded-2xl" />
              <a
                href={url}
                download
                className="block mt-4 text-center bg-yellow-500 hover:bg-yellow-600 text-black font-bold py-4 rounded-full text-lg"
              >
                Download #{i + 1}
              </a>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
