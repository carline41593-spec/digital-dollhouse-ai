'use client';

import { useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Volume2, Play, Pause, Download, Copy, Mic, Loader2, Trash2, Sparkles } from 'lucide-react';

export default function TextToSpeechClient() {
  const [text, setText] = useState('');
  const [voice, setVoice] = useState('alloy');
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);

  // Voice Cloning states
  const [clonedVoices, setClonedVoices] = useState<any[]>([]); // load from localStorage later
  const [audioSample, setAudioSample] = useState<File | null>(null);
  const [cloneName, setCloneName] = useState('');
  const [isCloning, setIsCloning] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const stockVoices = [
    { id: 'alloy', name: 'Alloy', accent: 'Neutral' },
    { id: 'echo', name: 'Echo', accent: 'Deep Male' },
    { id: 'fable', name: 'Fable', accent: 'Storyteller' },
    { id: 'onyx', name: 'Onyx', accent: 'Bold Male' },
    { id: 'nova', name: 'Nova', accent: 'Bright Female' },
    { id: 'shimmer', name: 'Shimmer', accent: 'Soft Female' },
  ];

  const generateSpeech = async () => {
    if (!text.trim()) return;
    setIsGenerating(true);
    try {
      const res = await fetch('/api/tts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text, voice_id: voice }),
      });
      const blob = await res.blob();
      setAudioUrl(URL.createObjectURL(blob));
    } catch (err) {
      alert('TTS failed — check your API key');
    } finally {
      setIsGenerating(false);
    }
  };

  const createClone = async () => {
    if (!audioSample || !cloneName) return;
    setIsCloning(true);
    const form = new FormData();
    form.append('file', audioSample);
    form.append('name', cloneName);

    try {
      const res = await fetch('/api/clone-voice', { method: 'POST', body: form });
      const data = await res.json();
      const newVoice = { id: data.voice_id, name: cloneName, cloned: true };
      const updated = [...clonedVoices, newVoice];
      setClonedVoices(updated);
      localStorage.setItem('clonedVoices', JSON.stringify(updated));
      setVoice(data.voice_id);
      setAudioSample(null);
      setCloneName('');
      setUploadProgress(0);
    } catch (err) {
      alert('Voice cloning failed');
    } finally {
      setIsCloning(false);
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: { 'audio/*': [] },
    maxFiles: 1,
    onDrop: (files) => setAudioSample(files[0]),
  });

  const playAudio = () => {
    if (!audioUrl) return;
    const audio = new Audio(audioUrl);
    audio.play();
    setIsPlaying(true);
    audio.onended = () => setIsPlaying(false);
  };

  const downloadAudio = () => {
    if (!audioUrl) return;
    const a = document.createElement('a');
    a.href = audioUrl;
    a.download = `dollhouse-${Date.now()}.mp3`;
    a.click();
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 py-10">
          <h1 className="text-7xl font-black bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-500 bg-clip-text text-transparent">
            Text-to-Speech
          </h1>
          <p className="text-2xl text-gray-400 mt-3">Ultra-realistic voices + instant voice cloning</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-12 grid lg:grid-cols-3 gap-12">
        {/* Left side */}
        <div className="lg:col-span-2 space-y-10">
          {/* Text input */}
          <div>
            <label className="text-lg text-gray-300">Your script</label>
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Paste or type anything..."
              className="mt-3 w-full h-96 bg-zinc-900 border border-zinc-800 rounded-2xl px-6 py-5 text-lg resize-none focus:border-purple-500 outline-none transition"
              maxLength={5000}
            />
            <div className="text-right text-sm text-gray-500 mt-2">{text.length}/5000</div>
          </div>

          {/* Stock voices */}
          <div>
            <h3 className="text-xl font-bold mb-4">Stock Voices</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {stockVoices.map((v) => (
                <button
                  key={v.id}
                  onClick={() => setVoice(v.id)}
                  className={`p-5 rounded-xl border transition ${
                    voice === v.id
                      ? 'bg-purple-600 border-purple-400 shadow-lg shadow-purple-600/30'
                      : 'bg-zinc-900 border-zinc-700 hover:border-zinc-500'
                  }`}
                >
                  <div className="font-semibold">{v.name}</div>
                  <div className="text-xs text-gray-400">{v.accent}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Cloned voices */}
          {clonedVoices.length > 0 && (
            <div>
              <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                <Sparkles className="w-6 h-6 text-purple-400" />
                Your Cloned Voices
              </h3>
              <div className="flex flex-wrap gap-4">
                {clonedVoices.map((v) => (
                  <button
                    key={v.id}
                    onClick={() => setVoice(v.id)}
                    className={`px-6 py-4 rounded-xl border flex items-center gap-3 transition ${
                      voice === v.id
                        ? 'bg-gradient-to-r from-purple-600 to-pink-600 border-purple-400'
                        : 'bg-zinc-900 border-zinc-700 hover:border-zinc-500'
                    }`}
                  >
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center font-bold">
                      {v.name[0]}
                    </div>
                    <div className="text-left">
                      <div className="font-semibold">{v.name}</div>
                      <div className="text-xs text-gray-400">Cloned</div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Voice Cloning Upload */}
          <div className="p-8 bg-gradient-to-br from-purple-900/20 via-pink-900/20 to-cyan-900/20 border border-purple-500/30 rounded-2xl">
            <h3 className="text-2xl font-bold mb-6 flex items-center gap-3">
              <Mic className="w-8 h-8" />
              Clone Any Voice (30 sec sample)
            </h3>

            {!audioSample ? (
              <div {...getRootProps()} className={`border-2 border-dashed rounded-xl p-16 text-center cursor-pointer transition ${isDragActive ? 'border-purple-500 bg-purple-900/20' : 'border-zinc-600'}`}>
                <input {...getInputProps()} />
                <Mic className="w-20 h-20 mx-auto mb-4 opacity-40" />
                <p className="text-xl">Drop a clean voice sample here</p>
                <p className="text-sm text-gray-500 mt-2">WAV/MP3 • 30+ seconds • No background noise</p>
              </div>
            ) : (
              <div className="space-y-6">
                <audio controls src={URL.createObjectURL(audioSample)} className="w-full" />
                <div className="flex gap-4">
                  <input
                    type="text"
                    placeholder="Name this voice (e.g. My Voice, Morgan Freeman)"
                    value={cloneName}
                    onChange={(e) => setCloneName(e.target.value)}
                    className="flex-1 bg-zinc-800 px-5 py-4 rounded-xl"
                  />
                  <button
                    onClick={createClone}
                    disabled={isCloning || !cloneName}
                    className="px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl font-bold disabled:opacity-50 flex items-center gap-3"
                  >
                    {isCloning ? <Loader2 className="animate-spin" /> : <Sparkles />}
                    {isCloning ? 'Cloning...' : 'Create Clone'}
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Generate button */}
          <button
            onClick={generateSpeech}
            disabled={isGenerating || !text}
            className="w-full py-6 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl font-black text-2xl flex items-center justify-center gap-4 disabled:opacity-50 hover:scale-105 transition"
          >
            {isGenerating ? <Loader2 className="animate-spin w-10 h-10" /> : <Volume2 className="w-10 h-10" />}
            {isGenerating ? 'Generating...' : 'Generate Speech'}
          </button>
        </div>

        {/* Right side - Player */}
        <div className="space-y-8">
          <div className="bg-zinc-900/50 backdrop-blur border border-zinc-800 rounded-3xl p-10">
            <h3 className="text-2xl font-bold mb-8">Preview</h3>
            {audioUrl ? (
              <>
                <audio controls src={audioUrl} className="w-full mb-6" />
                <div className="grid grid-cols-2 gap-4">
                  <button onClick={playAudio} className="py-4 bg-purple-600 rounded-xl font-bold flex items-center justify-center gap-3">
                    {isPlaying ? <Pause /> : <Play />} {isPlaying ? 'Playing' : 'Play'}
                  </button>
                  <button onClick={downloadAudio} className="py-4 bg-cyan-600 rounded-xl font-bold flex items-center justify-center gap-3">
                    <Download /> Download
                  </button>
                </div>
              </>
            ) : (
              <div className="text-center py-24 text-gray-500">
                <Volume2 className="w-20 h-20 mx-auto mb-4 opacity-30" />
                <p>Your audio appears here</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
