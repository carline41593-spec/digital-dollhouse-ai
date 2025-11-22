// app/photoshoot/page.tsx
"use client";

import { useState } from "react";

export default function Photoshoot() {
  const [face, setFace] = useState<string | null>(null);
  const [prompt, setPrompt] = useState("");
  const [images, setImages] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const handleUpload = (e: any) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setFace(reader.result as string);
      reader.readAsDataURL(file);
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
        body: JSON.stringify({
          image_base64: base64,
          prompt: `Keep this exact person's face, identity, and skin tone. Only change: ${prompt.trim()}`,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed");

      setImages(data.images || []);
    } catch (err: any) {
      alert("Error: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white p-10">
      <h1 className="text-8xl font-bold bg-gradient-to-r from-pink-500 to-orange-500 bg-clip-text text-transparent text-center mb-12">
        AI Photoshoot Lounge
      </h1>

      <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12">
        {/* Left */}
        <div className="space-y-8">
          {!face ? (
            <label className="block cursor-pointer">
              <div className="h-96 bg-gray-900 border-4 border-dashed border-purple-600 rounded-3xl flex items-center justify-center text-3xl">
                Upload Your Selfie (Required)
              </div>
              <input type="file" accept="image/*" onChange={handleUpload} className="hidden" />
            </label>
          ) : (
            <img src={face} alt="Your face" className="w-full rounded-3xl shadow-2xl" />
          )}

          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="e.g. blonde hair and blue eyes, cyberpunk style, luxury fashion model, beach sunset..."
            className="w-full h-40 p-6 text-xl bg-gray-900 rounded-3xl border border-purple-600 focus:border-pink-600 outline-none resize-none"
          />

          <button
            onClick={generate}
            disabled={loading || !face || !prompt}
            className="w-full py-8 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full text-3xl font-bold hover:scale-105 transition disabled:opacity-50"
          >
            {loading ? "Generating 4 Photos..." : "Generate Photoshoot"}
          </button>
        </div>

        {/* Right */}
        <div className="grid grid-cols-2 gap-6">
          {loading && <div className="col-span-2 text-center text-4xl animate-pulse">Creating your photos...</div>}
          {images.map((url, i) => (
            <div key={i} className="space-y-4">
              <img src={url} alt={`Result ${i + 1}`} className="w-full rounded-3xl shadow-2xl" />
              <a
                href={url}
                download={`digitaldc-photo-${i + 1}.jpg`}
                className="block text-center bg-gradient-to-r from-pink-600 to-purple-600 py-3 rounded-full font-bold"
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
