// app/api/photoshoot/route.ts
import { NextResponse } from 'next/server';

export const maxDuration = 60; // Allow 60s on free Vercel plan

export async function POST(request: Request) {
  try {
    const { image_base64, prompt } = await request.json();

    if (!image_base64 || !prompt) {
      return NextResponse.json({ error: "Missing image or prompt" }, { status: 400 });
    }

    // This uses YOUR working Render backend (not the dead proxy)
    const res = await fetch("https://dollhouse-flux-backend.onrender.com/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        prompt: `${prompt}, perfect likeness to reference photo, professional photoshoot, ultra-realistic, 8k, cinematic lighting, detailed face, high fashion`,
      }),
    });

    if (!res.ok) {
      const err = await res.text();
      console.error("Render backend error:", err);
      return NextResponse.json({ error: "Backend failed", details: err }, { status: 500 });
    }

    const data = await res.json();

    if (!data.image_url) {
      return NextResponse.json({ error: "No image returned" }, { status: 500 });
    }

    // Return 4 copies for your grid (you can enhance later with IP-adapter or ControlNet)
    const images = [data.image_url, data.image_url, data.image_url, data.image_url];

    return NextResponse.json({ images });

  } catch (error: any) {
    console.error("Photoshoot API error:", error);
    return NextResponse.json(
      { error: "Server error", details: error.message },
      { status: 500 }
    );
  }
}
