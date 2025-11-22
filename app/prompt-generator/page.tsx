// app/prompt-generator/page.tsx
'use client';

import { useState } from "react";

export default function PromptGenerator() {
  const [style, setStyle] = useState("");
  const [theme, setTheme] = useState("");
  const [details, setDetails] = useState("");
  const [generated, setGenerated] = useState("");
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(false);

  const generatePrompt = async () => {
    if (!style && !theme && !details) return;

    setLoading(true);
    setGenerated("");
    setCopied(false);

    const basePrompt = `
      Create an extremely detailed, professional, cinematic image prompt for a dollhouse scene.
      Style: ${style || "photorealistic, hyper-detailed"}.
      Theme: ${theme || "magical, whimsical"}.
      Extra details: ${details || "glowing windows, tiny furniture, floating in clouds"}.
      
      Include ultra-realistic textures, dramatic cinematic lighting, depth of field, 8K resolution, rich colors, magical atmosphere, intricate details, award-winning digital art style.
      Output ONLY the final prompt — no explanations, no quotes.
    `.trim();

    try {
      // Using xAI Grok (free tier works great)
      const res = await fetch("https://api.x.ai/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_XAI_KEY}`,
        },
        body: JSON.stringify({
          model: "grok-beta",
          messages: [{ role: "user", content: basePrompt }],
          temperature: 0.85,
          max_tokens: 500,
        }),
      });

      const data = await res.json();
      const prompt = data.choices?.[0]?.message?.content?.trim() || "A stunning magical dollhouse...";
      setGenerated(prompt);
    } catch (err) {
      // Fallback if API fails (so page never breaks)
      setGenerated(
        `A breathtaking ${style || "victorian"} dollhouse ${theme ? "in a " + theme + " wonderland" : "floating in a surreal dreamscape"}, ${details || "made of glowing crystal, candy furniture, tiny sparkling lights"}, ultra-detailed textures, cinematic golden hour lighting, 8K resolution, photorealistic, magical atmosphere, depth of field, award-winning masterpiece`
      );
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generated);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-black text-white flex">
      {/* Sidebar */}
      <div className="w-80 bg-gradient-to-b from-purple-900 via-black to-black p-10 space-y-12">
        <div>
          <h1 className="text-6xl font-bold bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-500 bg-clip-text text-transparent">
            DigitalDc
          </h1>
          <p className="text-gray-400 mt-2 text-lg">Creator AI Suite</p>
        </div>

        <nav className="space-y-8 text-xl">
          <a href="/" className="block text-gray-500 hover:text-white">Home</a>
          <a href="#" className="block text-gray-500 hover:text-white">Creator Chat</a>
          <a className="block bg-gradient-to-r from-pink-500 to-purple-500 text-transparent bg-clip-text font-bold">
            Lightbulb Prompt Generator
          </a>
          <a href="/image-generation" className="block text-gray-500 hover:text-white">Image Generation</a>
          <a href="#" className="block text-gray-500 hover:text-white">Edit Image Editing</a>
          <a href="#" className="block text-gray-500 hover:text-white">Camera AI Photoshoot Lounge</a>
          <a href="#" className="block text-gray-500 hover:text-white">Magic Magic Prompt Grabber</a>
        </nav>

        <footer className="text-gray-600 text-sm mt-32">
          © 2025 the Digital Dollhouse Creator AI
        </footer>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-20">
        <div className="max-w-5xl">
          <h1 className="text-7xl font-black bg-gradient-to-r from-pink-500 via-orange-400 to-yellow-400 bg-clip-text text-transparent mb-4">
            Prompt Idea Generator
          </h1>
          <p className="text-xl text-gray-400 mb-16">Generate hyper-detailed prompts instantly</p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            <div>
              <label className="text-purple-400 font-bold text-lg block mb-3">Style</label>
              <input
                type="text"
                value={style}
                onChange={(e) => setStyle(e.target.value)}
                placeholder="cyberpunk, barbiecore, gothic, pastel goth..."
                className="w-full p-5 rounded-2xl bg-gray-900 border border-purple-500/30 text-white focus:border-purple-400 focus:outline-none transition"
              />
            </div>

            <div>
              <label className="text-pink-400 font-bold text-lg block mb-3">Theme</label>
              <input
                type="text"
                value={theme}
                onChange={(e) => setTheme(e.target.value)}
                placeholder="underwater palace, haunted mansion, candy kingdom..."
                className="w-full p-5 rounded-2xl bg-gray-900 border border-pink-500/30 text-white focus:border-pink-400 focus:outline-none transition"
              />
            </div>

            <div>
              <label className="text-yellow-400 font-bold text-lg block mb-3">Extra Magic</label>
              <input
                type="text"
                value={details}
                onChange={(e) => setDetails(e.target.value)}
                placeholder="tiny dragons, glowing mushrooms, floating teacups..."
                className="w-full p-5 rounded-2xl bg-gray-900 border border-yellow-500/30 text-white focus:border-yellow-400 focus:outline-none transition"
              />
            </div>
          </div>

          <button
            onClick={generatePrompt}
            disabled={loading}
            className="px-16 py-6 bg-gradient-to-r from-pink-500 to-purple-600 rounded-full text-2xl font-bold hover:scale-105 transition shadow-2xl disabled:opacity-70"
          >
            {loading ? "Generating Magic..." : "Generate Prompt"}
          </button>

          {generated && (
            <div className="mt-12 p-10 bg-gray-900/80 rounded-3xl border border-purple-500/50">
              <div className="flex justify-between items-start mb-6">
                <h3 className="text-2xl font-bold text-purple-400">Your Perfect Prompt:</h3>
                <button
                  onClick={copyToClipboard}
                  className={`px-8 py-4 rounded-full font-bold transition ${copied ? "bg-green-600" : "bg-purple-600 hover:bg-purple-700"}`}
                >
                  {copied ? "Copied!" : "Copy Prompt"}
                </button>
              </div>
              <p className="text-lg leading-relaxed text-gray-200 font-medium">{generated}</p>
              <p className="text-sm text-gray-500 mt-6">
                Ready to paste into Image Generation
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
