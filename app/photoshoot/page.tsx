// app/photoshoot/page.tsx   ← REPLACE YOUR ENTIRE FILE WITH THIS
"use client";

import { useState } from "react";

export default function Photoshoot() {
  const [faceImage, setFaceImage] = useState<string | null>(null);
  const [profession, setProfession] = useState("");
  const [type, setType] = useState("Editorial/Fashion");
  const [details, setDetails] = useState("");
  const [results, setResults] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const handleUpload = (e: any) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setFaceImage(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const generate = async () => {
    if (!faceImage) return;
    setLoading(true);
    setResults([]);

    const base64 = faceImage.split(",")[1];
    const prompt = `${profession || "beautiful model"}, ${type} photoshoot, ${details || "luxury setting"}, perfect likeness to uploaded face, ultra realistic, 8k, professional lighting, cinematic, high fashion`;

    try {
      const res = await fetch("/api/photoshoot", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ image_base64: base64, prompt }),
      });

      const data = await res.json();

      if (!res.ok || data.error) throw new Error(data.error || "Failed");

      // Handles fal.ai, Replicate, Fireworks — everything
      let urls: string[] = [];
      if (Array.isArray(data.images)) urls = data.images;
      else if (data.image_url) urls = [data.image_url, data.image_url, data.image_url, data.image_url];
      else if (data.output?.[0]) urls = Array.isArray(data.output) ? data.output : [data.output];

      setResults(urls.slice(0, 4));

    } catch (err: any) {
      alert("Generation failed: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white p-12 pl-96">
      <h1 className="text-6xl font-bold bg-gradient-to-r from-pink-400 to-yellow-400 bg-clip-text text-transparent mb-10">
        AI Photoshoot Lounge
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Left – Inputs */}
        <div className="space-y-8">
          {/* Face Upload */}
          <div className="bg-gray-900/50 backdrop-blur p-10 rounded-3xl text-center">
            {faceImage ? (
              <img src={faceImage} alt="Your face" className="rounded-3xl mx-auto max-h-96" />
            ) : (
              <label className="cursor-pointer">
                <div className="h-96 bg-black/60 border-4 border-dashed border-pink-500/50 rounded-3xl flex items-center justify-center text-4xl text-gray-400">
                  Upload Face Photo
                </div>
                <input type="file" accept="image/*" onChange={handleUpload} className="hidden" />
              </label>
            )}
          </div>

          <input
            className="w-full p-5 bg-gray-900 rounded-2xl border border-purple-500/30 focus:border-purple-400 outline-none text-xl"
            placeholder="Profession (e.g. CEO, Mermaid, Rockstar)"
            value={profession}
            onChange={(e) => setProfession(e.target.value)}
          />

          <select
            className="w-full p-5 bg-gray-900 rounded-2xl border border-purple-500/30 text-xl"
            value={type}
            onChange={(e) => setType(e.target.value)}
          >
            <option>Editorial/Fashion</option>
            <option>Corporate</option>
            <option>Fitness</option>
            <option>Fantasy</option>
            <option>Streetwear</option>
          </select>

          <textarea
            className="w-full h-32 p-5 bg-gray-900 rounded-2xl border border-purple-500/30 focus:border-purple-400 outline-none text-xl"
            placeholder="Extra scene details..."
            value={details}
            onChange={(e) => setDetails(e.target.value)}
          />

          <button
            onClick={generate}
            disabled={loading || !faceImage}
            className="w-full py-6 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full text-3xl font-bold hover:scale-105 transition disabled:opacity-50"
          >
            {loading ? "Generating Magic… (5–20s)" : "Generate Photoshoot"}
          </button>
        </div>

        {/* Right – Results Grid */}
        <div className="grid grid-cols-2 gap-8">
          {loading &&
            [...Array(4)].map((_, i) => (
              <div key={i} className="h-96 bg-gray-900/30 rounded-3xl animate-pulse" />
            ))}

          {results.map((url, i) => (
            <div key={i} className="space-y-4">
              {/* THIS IS THE FIX: regular <img> instead of Next/Image */}
              <img
                src={url}
                alt={`Photoshoot ${i + 1}`}
                className="w-full rounded-3xl shadow-2xl border border-purple-500/30"
                style={{ height: "600px", objectFit: "cover" }}
              />
              <a
                href={url}
                download={`digitaldc-photoshoot-${i + 1}.jpg`}
                className="block text-center bg-gradient-to-r from-pink-600 to-purple-600 text-white font-bold py-4 rounded-full hover:scale-105 transition"
              >
                Download Photo {i + 1}
              </a>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
