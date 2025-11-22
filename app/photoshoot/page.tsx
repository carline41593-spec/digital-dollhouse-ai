// app/photoshoot/page.tsx
'use client';

import { useState } from "react";
import Image from "next/image";

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
    const prompt = `${profession || "beautiful model"}, ${type} photoshoot, ${details || "luxury studio"}, perfect likeness to uploaded face, ultra realistic, 8k, professional lighting`;

    try {
      const res = await fetch("/api/photoshoot", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ image_base64: base64, prompt }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed");

      setResults(data.images || []);
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
        {/* Left */}
        <div className="space-y-8">
          {/* Upload */}
          <div className="bg-gray-900/50 backdrop-blur p-10 rounded-3xl text-center">
            {faceImage ? (
              <Image src={faceImage} alt="face" width={500} height={700} className="rounded-3xl mx-auto" />
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
            placeholder="Profession (e.g. CEO, Mermaid)"
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
            placeholder="Extra details..."
            value={details}
            onChange={(e) => setDetails(e.target.value)}
          />

          <button
            onClick={generate}
            disabled={loading || !faceImage}
            className="w-full py-6 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full text-2xl font-bold hover:scale-105 transition disabled:opacity-50"
          >
            {loading ? "Generating 4 Images… (20–40s)" : "Generate Photoshoot"}
          </button>
        </div>

        {/* Right – Results */}
        <div className="grid grid-cols-2 gap-6">
          {loading &&
            [...Array(4)].map((_, i) => (
              <div key={i} className="h-96 bg-gray-900/50 rounded-3xl animate-pulse" />
            ))}
          {results.map((url, i) => (
            <div key={i} className="bg-gray-900/50 backdrop-blur rounded-3xl p-4">
              <Image src={url} alt="result" width={600} height={800} className="rounded-2xl w-full" />
              <a href={url} download className="block mt-4 text-center text-purple-400 font-bold">
                Download
              </a>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
