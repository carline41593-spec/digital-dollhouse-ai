// app/api/photoshoot/route.ts
import { NextRequest, NextResponse } from "next/server";

export const POST = async (req: NextRequest) => {
  try {
    const body = await req.json();
    const { prompt } = body;

    // THIS WILL SHOW YOU THE EXACT PROBLEM
    const apiKey = process.env.FIREWORKS_API_KEY?.trim();

    if (!apiKey) {
      return NextResponse.json(
        { error: "FIREWORKS_API_KEY is missing or empty in Vercel → Go to Settings → Environment Variables and add it exactly as FIREWORKS_API_KEY" },
        { status: 500 }
      );
    }

    if (!prompt) {
      return NextResponse.json({ error: "Prompt is required" }, { status: 400 });
    }

    const res = await fetch("https://api.fireworks.ai/inference/v1/image_generations", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "accounts/fireworks/models/flux-pro",
        prompt: `${prompt}, photorealistic fashion portrait of the exact same woman from reference, identical face, skin tone, eyes, hair, ultra detailed, 8k, vogue editorial, sharp focus, cinematic lighting`,
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
        { error: `Fireworks error: ${data.detail || data.message || "Unknown"} (check your API key or credits)` },
        { status: 500 }
      );
    }

    return NextResponse.json({ images: data.images.map((i: any) => i.url) });
  } catch (err: any) {
    return NextResponse.json({ error: `Crash: ${err.message}` }, { status: 500 });
  }
};
