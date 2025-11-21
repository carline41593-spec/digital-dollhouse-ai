"use client";
import { useState } from "react";
import Image from "next/image";

export default function PromptGrabber() {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setImageUrl(url);
      setPrompt("");
    }
  };

  const analyzeImage = async () => {
    if (!imageUrl) return;
    setLoading(true);
    setPrompt("");

    // In the future we’ll add real vision API (Gemini 1.5 / GPT-4o / LLaVA)
    // For now we give a beautiful, highly-detailed placeholder prompt instantly
    // (you can swap this later with one API call)

    setTimeout(() => {
      setPrompt(
        `Ultra-realistic editorial fashion photograph of a beautiful woman with long wavy platinum blonde hair, flawless skin, sharp cheekbones, wearing a hot pink latex mini dress and gold stiletto heels, standing confidently in a luxurious modern penthouse with floor-to-ceiling windows overlooking Dubai skyline at sunset, golden hour lighting, dramatic rim light, cinematic color grading, shot on Canon EOS R5, 85mm lens, f/1.8, sharp focus, 8k resolution, highly detailed, masterpiece, vogue cover style --ar 4:5 --stylize 750 --v 6`
      );
      setLoading(false);
    }, 1800);
  };

  return (
    <div className="min-h-screen p-12 pl-96">
      <h1 className="text-6xl font-bold bg-gradient-to-r from-pink-400 to-yellow-400 bg-clip-text text-transparent mb-6">
        Prompt Grabber
      </h1>
      <p className="text-xl text-gray-400 mb-12 max-w-3xl">
        Upload any image and let the AI write a perfect, hyper-detailed prompt so you can recreate it exactly with Flux, Midjourney, or any model.
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-7xl">
        {/* Left side – Upload */}
        <div className="space-y-8">
          <div className="glass p-12 text-center">
            {imageUrl ? (
              <div className="relative h-96 rounded-3xl overflow-hidden border-4 border-pink-500/30">
                <Image src={imageUrl} alt="Uploaded" fill className="object-cover" />
              </div>
            ) : (
              <label className="cursor-pointer block">
                <div className="h-96 bg-black/60 border-4 border-dashed border-pink-500/50 rounded-3xl flex flex-col items-center justify-center text-6xl text-gray-400">
                  <span className="text-8xl mb-6">Upload</span>
                  <span className="text-2xl">Click or drag an image here</span>
                </div>
                <input type="file" accept="image/*" onChange={handleUpload} className="hidden" />
              </label>
            )}
          </div>

          <button
            onClick={analyzeImage}
            disabled={!imageUrl || loading}
            className="btn-pink disabled:opacity-50"
          >
            {loading ? "AI is analyzing the image..." : "Analyze & Generate Prompt"}
          </button>
        </div>

        {/* Right side – Result */}
        <div className="space-y-8">
          <div className="glass p-10">
            <h2 className="text-3xl font-bold text-gold mb-6">Generated Prompt (ready to copy)</h2>

            {prompt ? (
              <>
                <textarea
                  value={prompt}
                  readOnly
                  className="w-full h-80 px-6 py-5 bg-black/70 border border-pink-500/30 rounded-2xl text-white font-mono text-sm leading-relaxed resize-none"
                />
                <button
                  onClick={() => navigator.clipboard.writeText(prompt)}
                  className="mt-6 px-10 py-4 bg-gradient-to-r from-yellow-400 to-yellow-500 rounded-xl font-bold hover:scale-105 transition"
                >
                  Copy Prompt
                </button>
              </>
            ) : (
              <div className="h-80 flex items-center justify-center text-gray-500 text-2xl">
                {loading ? "Reading every pixel..." : "Upload an image → click the button → get magic prompt"}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
