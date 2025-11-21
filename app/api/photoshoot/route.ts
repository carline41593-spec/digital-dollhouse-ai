// app/api/photoshoot/route.ts
import { NextResponse } from "next/server";

export const POST = async (request: Request) => {
  try {
    const { prompt } = await request.json();

    const response = await fetch("https://api.fireworks.ai/inference/v1/image_generations", {
      method: "POST",
      headers: {
        "Authorization": "Bearer fw_3b8e43e8a7e41c9d8f6a1c2d9e8f7a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "accounts/fireworks/models/flux-pro",
        prompt: `${prompt}, ultra realistic fashion portrait of the exact same woman from reference, identical facial features, skin tone, eyes, hair, 8k, vogue editorial, cinematic lighting, masterpiece`,
        num_images: 4,
        height: 1280,
        width: 1024,
        steps: 28,
        guidance_scale: 6.5,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json({ error: data.detail || "Generation failed" }, { status: 500 });
    }

    return NextResponse.json({ images: data.images.map((img: any) => img.url) });
  } catch (error) {
    return NextResponse.json({ error: "Generation error" }, { status: 500 });
  }
};

export const runtime = "nodejs";
export const maxDuration = 60;
export const dynamic = "force-dynamic";
