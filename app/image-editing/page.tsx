const generate = async () => {
  if (!original || !prompt) return;
  setLoading(true);
  setResult(null);

  const base64 = original.split(",")[1];

  try {
    const res = await fetch("/api/photoshoot", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        image_base64: base64,
        prompt,
      }),
    });

    const data = await res.json();
    if (data.image) setResult(data.image);
  } finally {
    setLoading(false);
  }
};

// And in the JSX (replace the right column):
<div className="flex items-center justify-center">
  {loading && <div className="text-3xl text-pink-400">Creating magic…</div>}
  {result && (
    <div className="bg-gradient-to-br from-pink-900/20 to-purple-900/20 border border-pink-500/30 rounded-3xl p-8">
      <Image src={result} alt="Edited" width={800} height={1000} className="rounded-2xl" />
      <a href={result} download className="block mt-6 text-center bg-yellow-500 hover:bg-yellow-600 text-black font-bold py-4 rounded-full text-xl">
        Download Full Res
      </a>
    </div>
  )}
</div>
