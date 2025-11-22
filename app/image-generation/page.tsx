// app/image-generation/page.tsx
"use client";

import { useState } from "react";

export default function ImageGeneration() {
  const [prompt, setPrompt] = useState("");
  const [image, setImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const generate = async () => {
    if (!prompt.trim()) return;
    setLoading(true);
    setImage(null);

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: prompt.trim() }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed");

      setImage(data.image_url);
    } catch (err: any) {
      alert("Error: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white p-10">
      <h1 className="text-8xl font-bold bg-gradient-to-r from-pink-500 to-orange-500 bg-clip-text text-transparent text-center mb-16">
        Image Generation
      </h1>

      <div className="max-w-4xl mx-auto space-y-12">
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Describe anything... e.g. cyberpunk city at night, luxury fashion dollhouse, anime character"
          className="w-full h-48 p-8 text-2xl bg-gray-900 rounded-3xl border border-purple-600 focus:border-pink-600 outline-none resize-none"
        />

        <button
          onClick={generate}
          disabled={loading || !prompt}
          className="w-full py-8 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full text-3xl font-bold hover:scale-105 transition disabled:opacity-50"
        >
          {loading ? "Generating..." : "Create Image"}
        </button>

        {loading && <div className="text-center text-3xl animate-pulse">Working on it...</div>}

        {image && (
          <div className="text-center space-y-8">
            <img src={image} alt="Generated" className="mx-auto max-w-3xl rounded-3xl shadow-2xl" />
            <a
              href={image}
              download="digitaldc-creation.jpg"
              className="inline-block px-12 py-6 bg-gradient-to-r from-pink-600 to-purple-600 rounded-full text-2xl font-bold"
            >
              Download Image
            </a>
          </div>
        )}
      </div>
    </div>
  );
}
