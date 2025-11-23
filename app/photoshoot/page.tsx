// app/photoshoot/page.tsx
"use client";

import { useState } from "react";

export default function Photoshoot() {
  const [face, setFace] = useState<string | null>(null);
  const [prompt, setPrompt] = useState("");
  const [images, setImages] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  // Auto-compress to <1MB (prevents 413)
  const compressImage = (file: File): Promise<string> => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement("canvas");
          const MAX = 1024;
          let w = img.width;
          let h = img.height;
          if (w > MAX) { h = (MAX / w) * h; w = MAX; }
          canvas.width = w; canvas.height = h;
          const ctx = canvas.getContext("2d")!;
          ctx.drawImage(img, 0, 0, w, h);
          resolve(canvas.toDataURL("image/jpeg", 0.75));
        };
        img.src = e.target?.result as string;
      };
      reader.readAsDataURL(file);
    });
  };

  const handleUpload = async (e: any) => {
    const file = e.target.files?.[0];
    if (file) {
      const compressed = await compressImage(file);
      setFace(compressed);
      setImages([]); // reset previous results
    }
  };

  const generate = async () => {
    if (!face || !prompt.trim()) return;
    setLoading(true);
    setImages([]);

    const base64 = face.split(",")[1];

    try {
      const res = await fetch("/api/photoshoot", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ image_base64: base64, prompt: prompt.trim() }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed");

      setImages(data.images);
    } catch (err: any) {
      alert("Error: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <h1 className="text-8xl font-bold bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent text-center mb-12">
        AI Photoshoot Lounge
      </h1>

      <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12">
        {/* Left: Upload + Prompt */}
        <div className="space-y-8">
          {!face ? (
            <label className="block cursor-pointer">
              <div className="h-96 bg-gray-900 border-4 border-dashed border-purple-600 rounded-3xl flex items-center justify-center text-3xl">
                Upload Your Selfie
              </div>
              <input type="file" accept="image/*" onChange={handleUpload} className="hidden" />
            </label>
          ) : (
            <img src={face} alt="Your face" className="w-full rounded-3xl shadow-2xl" />
          )}

          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="e.g. blonde hair and blue eyes, cyberpunk queen, luxury fashion editorial..."
            className="w-full h-40 p-6 text-xl bg-gray-900 rounded-3xl border border-purple-600 focus:border-pink-600 outline-none resize-none"
          />

          <button
            onClick={generate}
            disabled={loading || !face || !prompt.trim()}
            className="w-full py-8 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full text-3xl font-bold hover:scale-105 transition disabled:opacity-50"
          >
            {loading ? "Generating 4 Realistic Photos..." : "Generate Photoshoot"}
          </button>
        </div>

        {/* Right: Results */}
        <div className="grid grid-cols-2 gap-6">
          {loading && (
            <div className="col-span-2 text-center text-4xl animate-pulse">Creating magic...</div>
          )}
          {images.map((url, i) => (
            <div key={i} className="space-y-4">
              <img src={url} alt={`Result ${i + 1}`} className="w-full rounded-3xl shadow-2xl" />
              <a
                href={url}
                download={`dc-realistic-${i + 1}.jpg`}
                className="block text-center bg-gradient-to-r from-pink-600 to-purple-600 py-4 rounded-full font-bold hover:scale-105 transition"
              >
                Download {i + 1}
              </a>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
