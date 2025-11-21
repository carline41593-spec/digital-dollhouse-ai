// app/api/photoshoot/route.ts
import { NextResponse } from "next/server";

export const POST = async (request: Request) => {
  try {
    const { prompt } = await request.json();

    const apiKey = process.env.FIREWORKS_API_KEY;

    if (!apiKey || apiKey.length < 20) {
      return NextResponse.json(
        { error: `API key missing or invalid (length: ${apiKey?.length ?? 0})` },
        { status: 500 }
      );
    }

    const res = await fetch("https://api.fireworks.ai/inference/v1/image_generations", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "accounts/fireworks/models/flux-pro",
        prompt: `${prompt}, ultra-realistic fashion portrait, identical face from reference, 8k, vogue style, cinematic lighting`,
        num_images: 4,
        width: 1024,
        height: 1280,
        steps: 28,
        guidance_scale: 6.5,
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      return NextResponse.json({ error: data.detail || "Fireworks error" }, { status: 500 });
    }

    return NextResponse.json({ images: data.images.map((i: any) => i.url) });
  } catch (err: any) {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
};

// THIS LINE FORCES VERCEL TO USE NODE.JS (NOT EDGE) → FIXES "Failed to fetch – server crashed"
export const runtime = "nodejs";
export const maxDuration = 60;
