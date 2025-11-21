// app/api/photoshoot/route.ts
import { NextRequest, NextResponse } from "next/server";

export const POST = async (req: NextRequest) => {
  try {
    const { image_base64, prompt } = await req.json();

    const FIREWORKS_KEY = process.env.FIREWORKS_API_KEY;
    if (!FIREWORKS_KEY) {
      return NextResponse.json({ error: "Missing FIREWORKS_API_KEY" }, { status: 500 });
    }

    const response = await fetch(
      "https://api.fireworks.ai/inference/v1/image/flux-pro-ipadapter",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${FIREWORKS_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          image: image_base64,
          prompt:
            prompt + ", photorealistic, masterpiece, 8k, perfect likeness, professional studio lighting, sharp details",
          num_images: 4,
          steps: 28,
          guidance_scale: 3.5,
          seed: Math.floor(Math.random() * 999999),
        }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      console.error("Fireworks error:", data);
      return NextResponse.json({ error: data.detail || "Generation failed" }, { status: 500 });
    }

    const urls = data.images.map((img: any) => img.url);
    return NextResponse.json({ images: urls });
  } catch (err) {
    console.error("Server error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
};
