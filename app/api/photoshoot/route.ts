// app/api/photoshoot/route.ts
import { NextResponse } from "next/server";

export const POST = async (request: Request) => {
  try {
    const { prompt } = await request.json();

    const apiKey = process.env.FIREWORKS_API_KEY;

    // If key is still missing after everything, at least tell the user clearly
    if (!apiKey) {
      return NextResponse.json(
        { error: "FIREWORKS_API_KEY is completely missing from Vercel environment" },
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
        prompt: `${prompt}, ultra realistic fashion portrait, identical face from reference, 8k, vogue style`,
        num_images: 4,
        height: 1280,
        width: 1024,
        steps: 28,
        guidance_scale: 6.5,
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      return NextResponse.json(
        { error: data.detail || data.message || "Fireworks rejected the request" },
        { status: 500 }
      );
    }

    return NextResponse.json({ images: data.images.map((i: any) => i.url) });
  } catch (error) {
    console.error("Photoshoot route crashed:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
};

// These two lines are the ONLY thing that stops the crash on Vercel right now
export const runtime = "nodejs";
export const maxDuration = 60;
export const dynamic = "force-dynamic";
