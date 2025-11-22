'use client';

import { useState } from 'react';

export default function ImageGeneration() {
  const [prompt, setPrompt] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const generateImage = async () => {
    if (!prompt.trim()) return;

    setLoading(true);
    setError('');
    setImageUrl('');

    try {
      const res = await fetch('https://dollhouse-flux-backend.onrender.com/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt }),
      });

      const data = await res.json();

      if (data.image_url) {
        setImageUrl(data.image_url);
      } else {
        setError(data.error || 'No image generated');
      }
    } catch (err: any) {
      setError('Failed to reach backend — check console');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white flex">
      {/* Your beautiful sidebar here */}
      <div className="w-80 bg-gradient-to-b from-purple-900 via-black to-black p-10">
        <h1 className="text-6xl font-bold bg-gradient-to-r from-pink-500 to-purple-500 bg-clip-text text-transparent">
          DigitalDc
        </h1>
        <nav className="mt-20 space-y-6 text-xl">
          <a href="/prompt-generator" className="block text-gray-400">Prompt Generator</a>
          <a className="block text-purple-400 font-bold">Image Generation</a>
        </nav>
      </div>

      <div className="flex-1 p-20">
        <h1 className="text-6xl font-bold mb-10">Image Generation</h1>

        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Describe your dollhouse..."
          className="w-full h-40 p-6 bg-gray-900 rounded-xl text-lg"
        />

        <button
          onClick={generateImage}
          disabled={loading}
          className="mt-6 px-12 py-6 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full text-2xl font-bold"
        >
          {loading ? 'Generating... (20–60s)' : 'Generate Dollhouse'}
        </button>

        {error && <p className="mt-6 text-red-400">{error}</p>}

        {imageUrl && (
          <div className="mt-10">
            <img src={imageUrl} alt="Your dollhouse" className="rounded-2xl shadow-2xl max-w-4xl" />
          </div>
        )}
      </div>
    </div>
  );
}
