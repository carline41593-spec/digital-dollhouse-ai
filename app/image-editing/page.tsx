// app/image-editing/page.tsx
"use client";

import { useState } from "react";
import Image from "next/image";

export default function ImageMagicStudio() {
  const [original, setOriginal] = useState<string | null>(null);
  const [prompt, setPrompt] = useState("");
  const [result, setResult] = useState<string | null>(null);
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
    setResult(null);

    const base64 = original.split(",")[1];

    try {
      const res = await fetch("/api/photoshoot", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ image_base64: base64, prompt }),
      });

      const data = await res.json();
      console.log("API returned:", data);  // ← This will show us exactly what we got

      if (data.image) {
        setResult(data.image);
      } else {
        alert("No image returned. Check console (F12) for details.");
      }
    } catch (err) {
      alert("Network error – check console");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white p-8 pl-96">
      <h1 className="text-6xl md:text-8xl font-black bg-gradient-to-r from-pink-500 via-orange-400 to-yellow-400 bg-clip-text text-transparent mb-4">
        Image Magic Studio
      </h1>
      <p className="text-xl text-gray-400 mb-12">Upload + edit any image with AI</p>

      <div className="grid lg:grid-cols-2 gap-12 max-w-7xl mx-auto">
        <div className="space-y-8">
          <div className="bg-gradient-to-br from-pink-900/20 to-purple-900/20 border border-pink-500/30 rounded-3xl p-8">
            {!original ? (
              <label className="block cursor-pointer">
                <div className="h-96 bg-black/40 border-4 border-dashed border-pink-500 rounded-3xl flex items-center justify-center text-4xl text-gray-500">
                  Upload Image
                </div>
                <input type="file" accept="image/*" onChange={handleUpload} className="hidden" />
              </label>
            ) : (
              <Image src={original} alt="Original" width={800} height={800} className="rounded-2xl w-full" />
            )}
          </div>

          <textarea
            className="w-full h-40 bg-black/60 border border-pink-500/40 rounded-3xl p-6 text-lg placeholder-gray-500 focus:border-pink-400 focus:outline-none resize-none"
            placeholder="e.g. make her blonde, sunset lighting, add luxury car"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
          />

          <button
            onClick={generate}
            disabled={loading || !original || !prompt}
            className="w-full py-6 bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 disabled:opacity-50 text-white text-2xl font-bold rounded-3xl"
          >
            {loading ? "Generating… (12–18s)" : "Generate 1 Image"}
          </button>
        </div>

        <div className="flex items-center justify-center">
          {loading && <div className="text-4xl text-pink-400 animate-pulse">Creating magic…</div>}
          {result && (
            <div className="bg-gradient-to-br from-pink-900/20 to-purple-900/20 border border-pink-500/30 rounded-3xl p-8">
              <Image src={result} alt="Result" width={1024} height={1280} className="rounded-2xl w-full" />
              <a href={result} download className="block mt-8 text-center bg-yellow-500 hover:bg-yellow-600 text-black font-bold py-5 rounded-full text-xl">
                Download Full Resolution
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
