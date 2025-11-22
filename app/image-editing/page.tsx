// app/image-editing/page.tsx
"use client";

import { useState } from "react";
import Image from "next/image";

export default function ImageMagicStudio() {
  const [original, setOriginal] = useState<string | null>(null);
  const [prompt, setPrompt] = useState("");
  const [results, setResults] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setOriginal(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const generate = async () => {
    if (!original || !prompt) return;
    setLoading(true);
    setResults([]);

    try {
      const res = await fetch("/api/photoshoot", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: `${prompt}, ultra realistic transformation of the uploaded image, keep exact same person and face, 8k masterpiece`,
        }),
      });

      const data = await res.json();
      if (data.images) setResults(data.images);
      else console.error("No images:", data);
    } catch (err) {
      console.error(err);
      alert("Error – check console (F12)");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white p-8 pl-96">
      {/* Header */}
      <h1 className="text-6xl md:text-8xl font-black bg-gradient-to-r from-pink-500 via-orange-400 to-yellow-400 bg-clip-text text-transparent mb-4">
        Image Magic Studio
      </h1>
      <p className="text-xl text-gray-400 mb-12">Upload + edit any image with AI</p>

      <div className="grid lg:grid-cols-2 gap-12 max-w-7xl mx-auto">
        {/* Left – Upload + Prompt */}
        <div className="space-y-8">
          {/* Upload Box */}
          <div className="bg-gradient-to-br from-pink-900/20 to-purple-900/20 border border-pink-500/30 rounded-3xl p-8 backdrop-blur-xl">
            {!original ? (
              <label className="block cursor-pointer">
                <div className="h-96 bg-black/40 border-4 border-dashed border-pink-500 rounded-3xl flex items-center justify-center text-4xl text-gray-500 hover:border-pink-400 transition">
                  ↑ Upload Image
                </div>
                <input type="file" accept="image/*" onChange={handleUpload} className="hidden" />
              </label>
            ) : (
              <div className="relative">
                <Image src={original} alt="Original" width={800} height={800} className="rounded-2xl w-full" />
                <button
                  onClick={() => setOriginal(null)}
                  className="absolute top-4 right-4 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-full text-sm"
                >
                  Remove
                </button>
              </div>
            )}
          </div>

          {/* Prompt Input */}
          <textarea
            className="w-full h-40 bg-black/60 border border-pink-500/40 rounded-3xl p-6 text-lg text-white placeholder-gray-500 focus:border-pink-400 focus:outline-none resize-none"
            placeholder="Describe your edit… (e.g. 'make her blonde with blue eyes', 'cyberpunk city background', 'vintage 90s fashion')"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
          />

          {/* Generate Button */}
          <button
            onClick={generate}
            disabled={loading || !original || !prompt}
            className="w-full py-6 bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 disabled:from-gray-700 disabled:to-gray-800 text-white text-2xl font-bold rounded-3xl transition shadow-lg shadow-pink-500/50"
          >
            {loading ? "Creating Magic… (15–25s)" : "Generate 4 Variations"}
          </button>
        </div>

        {/* Right – Results Grid */}
        <div className="grid grid-cols-2 gap-8">
          {loading &&
            [...Array(4)].map((_, i) => (
              <div key={i} className="h-96 bg-gradient-to-br from-pink-900/20 to-purple-900/20 rounded-3xl animate-pulse" />
            ))}

          {results.map((url, i) => (
            <div key={i} className="bg-gradient-to-br from-pink-900/20 to-purple-900/20 border border-pink-500/30 rounded-3xl p-4 backdrop-blur-xl">
              <Image src={url} alt="Result" width={600} height={800} className="rounded-2xl w-full" />
              <a
                href={url}
                download
                className="block mt-4 text-center bg-yellow-500 hover:bg-yellow-600 text-black font-bold py-3 rounded-full"
              >
                Download
              </a>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
