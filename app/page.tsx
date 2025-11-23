// app/page.tsx
import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center px-8">
      {/* Hero Logo */}
      <div className="mb-16 text-center">
        <h1 className="text-9xl md:text-[12rem] font-black bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-500 bg-clip-text text-transparent tracking-tighter">
          DigitalDc
        </h1>
        <p className="text-2xl md:text-4xl font-light text-gray-300 mt-6 tracking-wide">
          The Most Realistic AI Creator Suite in 2025
        </p>
      </div>

      {/* Feature Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl w-full mb-20">
        <Link href="/photoshoot" className="group">
          <div className="bg-gradient-to-br from-purple-900/50 to-pink-900/50 backdrop-blur-lg border border-purple-500/30 rounded-3xl p-10 text-center hover:scale-105 transition-all duration-300 shadow-2xl">
            <div className="text-6xl mb-6">Camera</div>
            <h3 className="text-3xl font-bold mb-3">AI Photoshoot Lounge</h3>
            <p className="text-gray-400">Upload your selfie → become anyone, anywhere. Your exact face preserved.</p>
          </div>
        </Link>

        <Link href="/image-editing" className="group">
          <div className="bg-gradient-to-br from-cyan-900/50 to-blue-900/50 backdrop-blur-lg border border-cyan-500/30 rounded-3xl p-10 text-center hover:scale-105 transition-all duration-300 shadow-2xl">
            <div className="text-6xl mb-6">Edit</div>
            <h3 className="text-3xl font-bold mb-3">Image Magic Studio</h3>
            <p className="text-gray-400">Edit any photo with perfect realism — change outfits, lighting, background.</p>
          </div>
        </Link>

        <Link href="/generate" className="group">
          <div className="bg-gradient-to-br from-green-900/50 to-teal-900/50 backdrop-blur-lg border border-green-500/30 rounded-3xl p-10 text-center hover:scale-105 transition-all duration-300 shadow-2xl">
            <div className="text-6xl mb-6">Sparkles</div>
            <h3 className="text-3xl font-bold mb-3">Text-to-Image</h3>
            <p className="text-gray-400">Generate anything from pure imagination — 8K photorealistic.</p>
          </div>
        </Link>
      </div>

      {/* Footer */}
      <div className="text-center text-gray-500 text-sm">
        <p>© 2025 DigitalDc Creator AI • Powered by FLUX.1 Kontext [dev] on Together AI</p>
        <p className="mt-2">Your face. Your rules. Infinite possibilities.</p>
      </div>
    </div>
  );
}
