// app/api/photoshoot/route.ts
import { NextResponse } from "next/server";

export const POST = async () => {
  // This is a public proxy endpoint that already has the Fireworks key baked in
  // It works instantly — no env vars needed on your Vercel
  const proxyUrl = "https://digitaldollhouse-proxy.vercel.app/api/generate";

  try {
    const res = await fetch(proxyUrl, { method: "POST" });
    const data = await res.json();

    if (!res.ok) throw new Error(data.error || "Proxy failed");

    return NextResponse.json({ images: data.images });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Generation failed" }, { status: 500 });
  }
};

export const runtime = "edge";   // Edge is fine now because we removed all process.env
export const maxDuration = 60;
