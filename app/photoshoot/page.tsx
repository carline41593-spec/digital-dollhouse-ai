export default function Photoshoot() {
  return (
    <div className="min-h-screen p-12 pl-96">
      <h1 className="text-5xl font-bold bg-gradient-to-r from-pink-400 to-yellow-400 bg-clip-text text-transparent mb-6">
        AI Photoshoot Lounge
      </h1>
      <p className="text-gray-400 text-lg mb-12 max-w-3xl">
        Upload a photo and describe a scene. The AI will generate custom images of the person in that new setting. For best results, use a clear, forward-facing photo.
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Left Column */}
        <div className="space-y-8">
          <div className="glass p-10 text-center">
            <div className="w-64 h-64 mx-auto bg-black/60 border-2 border-dashed border-pink-500/50 rounded-3xl flex items-center justify-center text-6xl text-gray-600">
              Upload
            </div>
            <p className="mt-6 text-gray-400">Click to upload photo</p>
          </div>

          <div className="space-y-6">
            <div>
              <label className="text-gold text-xl">Profession</label>
              <input className="input-dark mt-3" placeholder="e.g., Astronaut, Chef, Musician" />
            </div>
            <div>
              <label className="text-gold text-xl">Photoshoot Type</label>
              <select className="input-dark mt-3">
                <option>Editorial/Fashion</option>
                <option>Corporate/Business</option>
                <option>Fitness</option>
                <option>Fantasy</option>
              </select>
            </div>
            <div>
              <label className="text-gold text-xl">Additional Details</label>
              <textarea className="input-dark mt-3 h-32" placeholder="e.g., on a neon-lit street in Tokyo, in a rustic kitchen..." />
            </div>
            <button className="btn-pink">Generate 4 Images</button>
          </div>
        </div>

        {/* Right Column */}
        <div className="glass p-16 text-center">
          <div className="text-6xl text-gray-700 mb-6">Person Icon</div>
          <p className="text-2xl text-gray-400">Your images will appear here</p>
          <p className="text-gray-500 mt-4">Upload a photo and fill out the details to get started.</p>
        </div>
      </div>
    </div>
  );
}
