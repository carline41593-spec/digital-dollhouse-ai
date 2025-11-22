// app/image-editing/page.tsx   ← REPLACE ENTIRE FILE
"use client";

import { useState } from "react";

export default function ImageEditing() {
  const [mainImage, setMainImage] = useState<string | null>(null);
  const [refImage, setRefImage] = useState<string | null>(null);
  const [prompt, setPrompt] = useState("");
  const [result, setResult] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleMainUpload = (e: any) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setMainImage(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleRefUpload = (e: any) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setRefImage(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const generate = async () => {
    if (!mainImage || !prompt) return;
    setLoading(true);
    setResult(null);

    const mainBase64 = mainImage.split(",")[1];
    const refBase64 = refImage ? refImage.split(",")[1] : null;

    try {
      const res = await fetch("/api/edit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          image_base64: mainBase64,
          reference_base64: refBase64,
          prompt,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed");

      setResult(data.image_url);
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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 max-w-7xl mx-auto">
        {/* Left: Main Image */}
        <div className="space-y-6">
          <h3 className="text-2xl font-bold">Main Image (required)</h3>
          {!mainImage ? (
            <label className="block cursor-pointer">
              <div className="h-96 bg-gray-900/50 border-4 border-dashed border-purple-500 rounded-3xl flex items-center justify-center text-3xl">
                Upload Your Photo
              </div>
              <input type="file" accept="image/*" onChange={handleMainUpload} className="hidden" />
            </label>
          ) : (
            <img src={mainImage} alt="Main" className="w-full rounded-3xl shadow-2xl" />
          )}
        </div>

        {/* Middle: Reference Image + Prompt */}
        <div className="space-y-6">
          <h3 className="text-2xl font-bold">Reference Image (optional)</h3>
          {!refImage ? (
            <label className="block cursor-pointer">
              <div className="h-64 bg-gray-900/30 border-4 border-dashed border-pink-500/50 rounded-3xl flex items-center justify-center text-xl">
                Upload Style/Pose Reference
              </div>
              <input type="file" accept="image/*" onChange={handleRefUpload} className="hidden" />
            </label>
          ) : (
            <img src={refImage} alt="Ref" className="w-full rounded-3xl shadow-2xl" />
          )}

          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="What do you want to change? (e.g. cyberpunk hacker with neon hair, luxury fashion model, anime character)"
            className="w-full h-48 p-8 bg-gray-900/80 rounded-3xl text-xl border border-purple-500/30 focus:border-pink-500 outline-none resize-none"
          />

          <button
            onClick={generate}
            disabled={loading || !mainImage || !prompt}
            className="w-full py-8 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full text-3xl font-bold hover:scale-105 transition disabled:opacity-50"
          >
            {loading ? "Transforming…" : "Generate Magic"}
          </button>
        </div>

        {/* Right: Result */}
        <div>
          <h3 className="text-2xl font-bold mb-6">Result</h3>
          {loading && (
            <div className="h-96 bg-gray-900/50 rounded-3xl animate-pulse flex items-center justify-center">
              <p className="text-3xl">Creating your masterpiece…</p>
            </div>
          )}
          {result && (
            <div className="space-y-6">
              <img src={result} alt="Edited" className="w-full rounded-3xl shadow-2xl" />
              <a
                href={result}
                download="digitaldc-magic-edit.jpg"
                className="block text-center bg-gradient-to-r from-pink-600 to-purple-600 py-6 rounded-full text-2xl font-bold hover:scale-105 transition"
              >
                Download Result
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
