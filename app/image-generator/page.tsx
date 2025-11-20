"use client";
import { useState } from "react";

export default function ImageGenerator() {
  const [prompt, setPrompt] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [loading, setLoading] = useState(false);

  const generate = async () => {
    if (!prompt) return;
    setLoading(true);
    setImageUrl("");

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
      });

      const data = await res.json();
      setImageUrl(data.image_url);
    } catch (err) {
      alert("Error – check console");
      console.error(err);
    }
    setLoading(false);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-4xl font-bold mb-8">AI Image Generator</h1>

      <textarea
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        placeholder="Describe your dream dollhouse scene..."
        className="w-full h-32 p-4 rounded-lg bg-gray-900 text-white border border-pink-500 focus:outline-none focus:border-pink-300"
      />

      <button
        onClick={generate}
        disabled={loading}
        className="mt-6 px-8 py-4 bg-gradient-to-r from-pink-500 to-purple-600 rounded-full font-bold text-lg hover:from-pink-600 hover:to-purple-700 disabled:opacity-50"
      >
        {loading ? "Generating... (30–60s)" : "Generate Image"}
      </button>

      {imageUrl && (
        <div className="mt-12">
          <img
            src={imageUrl}
            alt="Generated"
            className="rounded-xl shadow-2xl max-w-full"
          />
          <div className="mt-6 text-center">
            <a
              href={imageUrl}
              download
              className="inline-block px-8 py-3 bg-pink-600 rounded-lg hover:bg-pink-700"
            >
              Download Image
            </a>
          </div>
        </div>
      )}
    </div>
  );
}
