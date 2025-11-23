// app/image-editing/page.tsx
"use client";

import { useState } from "react";

export default function Edit() {
  const [image, setImage] = useState<string | null>(null);
  const [prompt, setPrompt] = useState("");
  const [result, setResult] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const compress = (file: File): Promise<string> =>
    new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement("canvas");
          const MAX = 1024;
          let w = img.width, h = img.height;
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

  const upload = async (e: any) => {
    const file = e.target.files?.[0];
    if (file) {
      const compressed = await compress(file);
      setImage(compressed);
      setResult(null);
    }
  };

  const generate = async () => {
    if (!image || !prompt) return;
    setLoading(true);
    setResult(null);

    const res = await fetch("/api/edit", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ image_base64: image.split(",")[1], prompt }),
    });

    const data = await res.json();
    if (!res.ok) return alert(data.error || "Failed");

    setResult(data.image_url);
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-black text-white p-12">
      <h1 className="text-8xl font-bold bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent text-center mb-12">
        Image Magic Studio
      </h1>

      <div className="max-w-6xl mx-auto grid lg:grid-cols-3 gap-12">
        <div className="space-y-8">
          {!image ? (
            <label className="block cursor-pointer">
              <div className="h-96 bg-gray-900 border-4 border-dashed border-purple-600 rounded-3xl flex items-center justify-center text-3xl">
                Upload Photo
              </div>
              <input type="file" accept="image/*" onChange={upload} className="hidden" />
            </label>
          ) : (
            <img src={image} alt="Original" className="w-full rounded-3xl shadow-2xl" />
          )}
        </div>

        <div className="space-y-8">
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="e.g. cyberpunk neon makeup, beach sunset..."
            className="w-full h-48 p-6 text-xl bg-gray-900 rounded-3xl border border-purple-600 focus:border-pink-600 outline-none resize-none"
          />
          <button
            onClick={generate}
            disabled={loading || !image || !prompt}
            className="w-full py-8 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full text-3xl font-bold hover:scale-105 transition disabled:opacity-50"
          >
            {loading ? "Transforming..." : "Generate Edit"}
          </button>
        </div>

        <div>
          {loading && <div className="h-96 bg-gray-900/50 rounded-3xl animate-pulse flex items-center justify-center text-4xl">Working...</div>}
          {result && (
            <div className="space-y-6">
              <img src={result} alt="Result" className="w-full rounded-3xl shadow-2xl" />
              <a href={result} download="dc-edit.jpg" className="block text-center bg-gradient-to-r from-pink-600 to-purple-600 py-6 rounded-full text-2xl font-bold">
                Download
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
