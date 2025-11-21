// app/image-editing/page.tsx
"use client";

import { useState } from "react";
import Image from "next/image";

export default function ImageMagicStudio() {
  const [original, setOriginal] = useState<string | null>(null);
  const [prompt, setPrompt] = useState("");
  const [results, setResults] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const handleUpload = (e: any) => {
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
      const base64 = original.split(",")[1];

      const res = await fetch("/api/photoshoot", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: `${prompt}, transform the uploaded image exactly as described, keep the same person and face, ultra realistic, 8k, masterpiece`,
        }),
      });

      const data = await res.json();
      if (data.images) setResults(data.images);
    } catch (err) {
      alert("Error — check console");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen p-12 pl-96">
      <h1 className="text-7xl font-black bg-gradient-to-r from-pink-400 via-orange-400 to-yellow-400 bg-clip-text text-transparent mb-4">
        Image Magic Studio
      </h1>
      <p className="text-xl text-gray-400 mb-12">Upload + edit any image with AI</p>

      <div className="grid lg:grid-cols-2 gap-16">
        {/* Left Side */}
        <div className="space-y-10">
          {/* Upload */}
          <div className="glass p-12 text-center rounded-3xl">
            {original ? (
              <Image src={original} alt="original" width={800} height={800} className="rounded-2xl mx-auto" />
            ) : (
              <label className="cursor-pointer block">
                <div className="h-96 bg-black/50 border-4 border-dashed border-pink-500/50 rounded-3xl flex items-center justify-center text-5xl text-gray-500">
                  Upload Image
                </div>
                <input type="file" accept="image/*" onChange={handleUpload} className="hidden" />
              </label>
            )}
          </div>

          <textarea
            className="w-full h-40 input-dark rounded-3xl p-8 text-lg"
            placeholder="Describe the edit... (e.g. 'turn day into golden hour sunset', 'make her wear a red dress', 'add cyberpunk city background')"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
          />

          <button
            onClick={generate}
            disabled={loading || !original || !prompt}
            className="w-full btn-pink text-2xl py-6 rounded-3xl"
          >
            {loading ? "Working Magic… (15–25s)" : "Generate 4 Variations"}
          </button>
        </div>

        {/* Right Side – Results */}
        <div className="grid grid-cols-2 gap-8">
          {loading &&
            [...Array(4)].map((_, i) => (
              <div key={i} className="glass h-96 rounded-3xl animate-pulse bg-pink-900/20" />
            ))}

          {results.map((url, i) => (
            <div key={i} className="glass p-6 rounded-3xl">
              <Image src={url} alt="result" width={600} height={800} className="rounded-2xl" />
              <a href={url} download className="block mt-6 text-center text-gold font-bold text-lg">
                Download
              </a>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
