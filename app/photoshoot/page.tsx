"use client";
import { useState } from "react";
import Image from "next/image";

export default function Photoshoot() {
  const [faceImage, setFaceImage] = useState<string | null>(null);
  const [profession, setProfession] = useState("");
  const [type, setType] = useState("Editorial/Fashion");
  const [details, setDetails] = useState("");
  const [results, setResults] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

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
    setError("");
    setResults([]);

    try {
      const base64 = faceImage.split(",")[1];
      const prompt = `${profession || "beautiful model"}, ${type} photoshoot, ${details || "luxury setting"}, photorealistic, 8k, perfect likeness, professional lighting`;

      const res = await fetch("/api/photoshoot", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ image_base64: base64, prompt }),
      });

      const data = await res.json();
      console.log("API response:", data);   // ← this will show us exactly what’s wrong

      if (!res.ok || data.error) {
        throw new Error(data.error || "Generation failed");
      }

      setResults(data.images || []);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Something went wrong – check console");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen p-12 pl-96">
      <h1 className="text-6xl font-bold bg-gradient-to-r from-pink-400 to-yellow-400 bg-clip-text text-transparent mb-6">
        AI Photoshoot Lounge
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Left – inputs */}
        <div className="space-y-8">
          {/* Upload */}
          <div className="glass p-10 text-center">
            {faceImage ? (
              <Image src={faceImage} alt="face" width={500} height={700} className="rounded-3xl mx-auto" />
            ) : (
              <label className="cursor-pointer">
                <div className="h-96 bg-black/60 border-4 border-dashed border-pink-500/50 rounded-3xl flex items-center justify-center text-5xl text-gray-400">
                  Upload Face Photo
                </div>
                <input type="file" accept="image/*" onChange={handleUpload} className="hidden" />
              </label>
            )}
          </div>

          <input className="input-dark" placeholder="Profession (e.g. Model, CEO)" value={profession} onChange={(e) => setProfession(e.target.value)} />
          <select className="input-dark" value={type} onChange={(e) => setType(e.target.value)}>
            <option>Editorial/Fashion</option>
            <option>Corporate</option>
            <option>Fitness</option>
            <option>Fantasy</option>
            <option>Streetwear</option>
          </select>
          <textarea className="input-dark h-32" placeholder="Describe the scene..." value={details} onChange={(e) => setDetails(e.target.value)} />

          <button onClick={generate} disabled={loading || !faceImage} className="btn-pink">
            {loading ? "Generating 4 images… (15–25s)" : "Generate 4 Images"}
          </button>

          {error && <p className="text-red-400 text-xl">{error}</p>}
        </div>

        {/* Right – results */}
        <div className="grid grid-cols-2 gap-6">
          {loading && [...Array(4)].map((_, i) => (
            <div key={i} className="glass h-96 animate-pulse bg-pink-900/20 rounded-3xl" />
          ))}
          {results.map((url, i) => (
            <div key={i} className="glass p-4 rounded-3xl">
              <Image src={url} alt="result" width={600} height={800} className="rounded-2xl" />
              <a href={url} download className="block mt-4 text-center text-gold font-bold">Download</a>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
