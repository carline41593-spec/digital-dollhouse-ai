// app/photoshoot/page.tsx
"use client";

import { useState } from "react";

export default function Photoshoot() {
  const [face, setFace] = useState<string | null>(null);
  const [prompt, setPrompt] = useState("");
  const [images, setImages] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

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
          resolve(canvas.toDataURL("image/jpeg", 0.7)); // 70% quality
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
          prompt: `Keep this exact person's face and identity. Only change: ${prompt.trim()}`,
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

  // rest of UI stays the same
  return (
    <div className="min-h-screen bg-black text-white p-10">
      <h1 className="text-8xl font-bold bg-gradient-to-r from-pink-500 to-orange-500 bg-clip-text text-transparent text-center mb-12">
        AI Photoshoot Lounge
      </h1>
      {/* ... rest of your UI from before ... */}
      <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12">
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
          {/* prompt + button same as before */}
        </div>
        {/* results grid same */}
      </div>
    </div>
  );
}
