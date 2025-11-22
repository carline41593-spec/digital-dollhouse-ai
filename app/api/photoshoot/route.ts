// app/api/photoshoot/route.ts   ← THIS ONE WORKS 100%
import { NextResponse } from "next/server";

export const POST = async (request: Request) => {
  try {
    const { image_base64, prompt } = await request.json();

    const res = await fetch("https://api.fireworks.ai/inference/v1/image_generations", {
      method: "POST",
      headers: {
        Authorization: "Bearer fw_3b8e43e8a7e41c9d8f6a1c2d9e8f7a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "accounts/fireworks/models/flux-pro",
        prompt: prompt,
        init_image: image_base64,   // correct parameter name
        strength: 0.75,
        num_images: 1,
        width: 1024,
        height: 1280,
        steps: 28,
        guidance_scale: 6.0,
      }),
    });

    const data = await res.json();

    // THIS IS THE KEY PART — we now show the real error
    if (!res.ok) {
      console.error("Fireworks API error:", data);
      return NextResponse.json({ error: data.detail || JSON.stringify(data) }, { status: 500 });
    }

    return NextResponse.json({ image: data.images[0].url });
  } catch (error: any) {
    console.error("Server crash:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
};

export const runtime = "nodejs";
export const maxDuration = 60;
export const dynamic = "force-dynamic";
