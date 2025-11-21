export default function ImageGenerator() {
  return (
    <div className="min-h-screen p-12 pl-96">
      <h1 className="text-5xl font-bold bg-gradient-to-r from-pink-400 to-yellow-400 bg-clip-text text-transparent mb-4">
        Image Generation Studio
      </h1>
      <p className="text-gray-400 text-lg mb-12 max-w-2xl">
        Create stunning, high-quality images from text descriptions using Flux Pro. Describe what you want to see, select an aspect ratio, and let the AI bring your vision to life.
      </p>

      <div className="glass p-10 max-w-4xl">
        <label className="block text-gold mb-4 text-xl">Prompt</label>
        <textarea
          placeholder="e.g., A cinematic shot of a luxury Barbie penthouse at golden hour..."
          className="input-dark h-48 resize-none"
        />

        <div className="mt-8">
          <label className="block text-gold mb-4 text-xl">Aspect Ratio</label>
          <select className="w-full px-6 py-5 bg-black/60 border border-pink-500/30 rounded-2xl text-white">
            <option>Square (1:1)</option>
            <option>Portrait (9:16)</option>
            <option>Landscape (16:9)</option>
          </select>
        </div>

        <button className="btn-pink mt-10">
          Generate Image
        </button>
      </div>
    </div>
  );
}
