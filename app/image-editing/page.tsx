// app/image-editing/page.tsx
"use client";

import { useState } from "react";

export default function ImageEditing() {
  const [mainImage, setMainImage] = useState<string | null>(null);
  const [refImage, setRefImage] = useState<string | null>(null);
  const [prompt, setPrompt] = useState("");
  const [result, setResult] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Auto-compress any image to <1MB (fixes 413 error)
  const compressImage = (file: File): Promise<string> => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement("canvas");
          const MAX_WIDTH = 1024;
          let width = img.width;
          let height = img.height;

          if (width > MAX_WIDTH) {
            height = (MAX_WIDTH / width) * height;
            width = MAX_WIDTH;
          }

          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext("2d")!;
          ctx.drawImage(img, 0, 0, width, height);
          resolve(canvas.toDataURL("image/jpeg", 0.7)); // 70% quality = tiny + sharp
        };
        img.src = e.target?.result as string;
      };
      reader.readAsDataURL(file);
    });
  };

  const handleMain = async (e: any) => {
    const file = e.target.files?.[0];
    if (file) {
      const compressed = await compressImage(file);
      setMainImage(compressed);
    }
  };

  const handleRef = async (e: any) => {
    const file = e.target.files?.[0];
    if (file) {
      const compressed = await compressImage(file);
      setRefImage(compressed);
    }
  };

  const generate = async () => {
    if (!mainImage || !prompt.trim()) return;
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
          prompt: `Keep this exact person's face, identity, and skin tone. Only change: ${prompt.trim()}. Ultra photorealistic, 8k, professional lighting.`,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to generate");

      setResult(data.image_url);
    } catch (err: any) {
      alert("Error: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white p-12">
      <h1 className="text-8xl font-bold bg-gradient-to-r from-pink-500 to-orange-500 bg-clip-text text-transparent text-center mb-12">
        Image Magic Studio
      </h1>

      <div className="max-w-7xl mx-auto grid lg:grid-cols-3 gap-12">
        {/* Main Image */}
        <div className="space-y-6">
          <h3 className="text-3xl font-bold">Main Image (Your Face)</h3>
          {!mainImage ? (
            <label className="block cursor-pointer">
              <div className="h-96 bg-gray-900 border-4 border-dashed border-purple-600 rounded-3xl flex items-center justify-center text-2xl">
                Upload Your Photo
              </div>
              <input type="file" accept="image/*" onChange={handleMain} className="hidden" />
            </label>
          ) : (
            <img src={mainImage} alt="Main" className="w-full rounded-3xl shadow-2xl" />
          )}
        </div>

        {/* Prompt + Reference */}
        <div className="space-y-6">
          <h3 className="text-3xl font-bold">Style Reference (Optional)</h3>
          {!refImage ? (
            <label className="block cursor-pointer">
              <div className="h-64 bg-gray-900/50 border-4 border-dashed border-pink-600 rounded-3xl flex items-center justify-center text-xl">
                Upload Pose/Style Ref
              </div>
              <input type="file" accept="image/*" onChange={handleRef} className="hidden" />
            </label>
          ) : (
            <img src={refImage} alt="Ref" className="w-full rounded-3xl shadow-2xl" />
          )}

          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="e.g. cyberpunk neon hair, luxury fashion editorial, anime character, beach sunset..."
            className="w-full h-48 p-6 text-xl bg-gray-900 rounded-3xl border border-purple-600 focus:border-pink-600 outline-none resize-none"
          />

          <button
            onClick={generate}
            disabled={loading || !mainImage || !prompt}
            className="w-full py-8 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full text-3xl font-bold hover:scale-105 transition disabled:opacity-50"
          >
            {loading ? "Transforming..." : "Generate Edited Image"}
          </button>
        </div>

        {/* Result */}
        <div>
          <h3 className="text-3xl font-bold mb-6">Result</h3>
          {loading && (
            <div className="h-96 bg-gray-900/50 rounded-3xl animate-pulse flex items-center justify-center">
              <p className="text-3xl">Creating magic...</p>
            </div>
          )}
          {result && (
            <div className="space-y-6">
              <img src={result} alt="Edited" className="w-full rounded-3xl shadow-2xl" />
              <a
                href={result}
                download="digitaldc-edited.jpg"
                className="block text-center bg-gradient-to-r from-pink-600 to-purple-600 py-6 rounded-full text-2xl font-bold"
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
