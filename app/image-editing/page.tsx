// app/image-editing/page.tsx
"use client";

import { useState } from "react";

export default function ImageEditing() {
  const [prompt, setPrompt] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [loading, setLoading] = useState(false);

  const generate = async () => {
    if (!prompt.trim()) return;
    setLoading(true);
    setImageUrl("");

    try {
      const res = await fetch("/api/edit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed");

      setImageUrl(data.image_url);
    } catch (err: any) {
      alert("Error: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white p-20">
      <h1 className="text-8xl font-bold bg-gradient-to-r from-pink-500 to-orange-500 bg-clip-text text-transparent mb-4">
        Image Magic Studio
      </h1>
      <p className="text-2xl text-gray-400 mb-16">Upload + edit any image with AI</p>

      <div className="max-w-4xl mx-auto space-y-12">
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Describe what you want (e.g. a pink victorian dollhouse with glowing windows, cyberpunk city at night, luxury fashion photoshoot)"
          className="w-full h-48 p-8 bg-gray-900/80 rounded-3xl text-xl border border-purple-500/30 focus:border-pink-500 outline-none resize-none"
        />

        <button
          onClick={generate}
          disabled={loading}
          className="w-full py-8 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full text-3xl font-bold hover:scale-105 transition disabled:opacity-50"
        >
          {loading ? "Creating Magic… (5–15s)" : "Generate Image"}
        </button>

        {loading && (
          <div className="h-96 bg-gray-900/50 rounded-3xl animate-pulse flex items-center justify-center">
            <p className="text-3xl">Generating your masterpiece…</p>
          </div>
        )}

        {imageUrl && (
          <div className="space-y-6">
            <img src={imageUrl} alt="Generated" className="w-full rounded-3xl shadow-2xl" />
            <a
              href={imageUrl}
              download="digitaldc-magic.jpg"
              className="block text-center bg-gradient-to-r from-pink-600 to-purple-600 py-6 rounded-full text-2xl font-bold hover:scale-105 transition"
            >
              Download Image
            </a>
          </div>
        )}
      </div>
    </div>
  );
}
