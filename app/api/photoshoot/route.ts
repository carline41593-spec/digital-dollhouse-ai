// app/api/photoshoot/route.ts
import { NextResponse } from "next/server";

export const POST = async (request: Request) => {
  try {
    const { prompt } = await request.json();

    const apiKey = process.env.FIREWORKS_API_KEY;

    // Show you exactly what Vercel sees
    if (!apiKey || apiKey.length < 20) {
      return NextResponse.json(
        { error: `FIREWORKS_API_KEY missing or too short (length: ${apiKey?.length ?? 0})` },
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
        prompt: `${prompt}, ultra-realistic fashion portrait of the exact same woman from reference, identical face, 8k, vogue editorial, cinematic lighting`,
        num_images: 4,
        width: 1024,
        height: 1280,
        steps: 28,
        guidance_scale: 6.5,
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      return NextResponse.json(
        { error: `Fireworks error: ${data.detail || data.message || "unknown"}` },
        { status: 500 }
      );
    }

    return NextResponse.json({ images: data.images.map((i: any) => i.url) });
  } catch (err: any) {
    console.error("Photoshoot API crash:", err);
    return NextResponse.json({ error: "Failed to fetch – server crashed" }, { status: 500 });
  }
};

// This line is REQUIRED for Vercel to accept large payloads & avoid "Failed to fetch"
export const runtime = "nodejs";
export const maxDuration = 60;
