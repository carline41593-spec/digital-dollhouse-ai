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

  const handleUpload = (e: any) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setFaceImage(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const generate = async () => {
    if (!faceImage || !profession || !details) return;
    setLoading(true);
    setResults([]);

    const base64 = faceImage.split(",")[1];
    const prompt = `${profession}, ${type} photoshoot, ${details}, luxury setting, perfect face match`;

    const res = await fetch("/api/photoshoot", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ image_base64: base64, prompt }),
    });

    const data = await res.json();
    setResults(data.images);
    setLoading(false);
  };

  return (
    <div className="min-h-screen p-12 pl-96">
      <h1 className="text-6xl font-bold bg-gradient-to-r from-pink-400 to-yellow-400 bg-clip-text text-transparent mb-6">
        AI Photoshoot Lounge
      </h1>
      <p className="text-xl text-gray-400 mb-12">Upload your face → describe the vibe → get 4 perfect photos</p>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        <div className="space-y-8">
          <div className="glass p-10 text-center">
            {faceImage ? (
              <Image src={faceImage} alt="face" width={400} height={600} className="rounded-3xl" />
            ) : (
              <label className="cursor-pointer">
                <div className="h-96 bg-black/60 border-4 border-dashed border-pink-500/50 rounded-3xl flex items-center justify-center text-6xl text-gray-400">
                  Upload Your Face
                </div>
                <input type="file" accept="image/*" onChange={handleUpload} className="hidden" />
              </label>
            )}
          </div>

          <input className="input-dark" placeholder="Profession (e.g. Model, CEO, Astronaut)" value={profession} onChange={(e) => setProfession(e.target.value)} />
          <select className="input-dark" value={type} onChange={(e) => setType(e.target.value)}>
            <option>Editorial/Fashion</option>
            <option>Corporate</option>
            <option>Fitness</option>
            <option>Fantasy</option>
          </select>
          <textarea className="input-dark h-32" placeholder="e.g. on a yacht at sunset, neon Tokyo street..." value={details} onChange={(e) => setDetails(e.target.value)} />

          <button onClick={generate} disabled={loading} className="btn-pink">
            {loading ? "Generating 4 images... (20–30s)" : "Generate 4 Images"}
          </button>
        </div>

        <div className="grid grid-cols-2 gap-6">
          {loading && [...Array(4)].map((_, i) => (
            <div key={i} className="glass h-96 animate-pulse bg-pink-900/20 rounded-3xl" />
          ))}
          {results.map((url, i) => (
            <div key={i} className="glass p-4 rounded-3xl">
              <Image src={url} alt="result" width={600} height={800} className="rounded-2xl" />
              <a href={url} download={`dollhouse-${i}.png`} className="block mt-4 text-center text-gold font-bold">
                Download
              </a>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
