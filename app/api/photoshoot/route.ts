// app/api/photoshoot/route.ts
import { NextRequest, NextResponse } from "next/server";

export const POST = async (req: NextRequest) => {
  try {
    const { image_base64, prompt } = await req.json();

    const apiKey = process.env.FIREWORKS_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: "FIREWORKS_API_KEY not set" }, { status: 500 });
    }

    // Enhanced prompt for face likeness using user description + scene
    const enhancedPrompt = `${prompt}, photorealistic portrait of a beautiful young woman with flawless skin, sharp features, confident expression, ultra-detailed face and eyes, professional editorial photography, 8k resolution, sharp focus, masterpiece, vogue style`;

    const response = await fetch("https://api.fireworks.ai/inference/v1/image_generations", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "accounts/fireworks/models/flux-pro-1-1-pro",
        prompt: enhancedPrompt,
        num_images: 4,
        width: 1024,
        height: 1024,
        steps: 28,
        guidance_scale: 7.5,
        seed: Math.floor(Math.random() * 999999),
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("Fireworks error:", data);
      return NextResponse.json({ error: data.detail || "Generation failed" }, { status: 500 });
    }

    const urls = data.images.map((img: any) => img.url);
    return NextResponse.json({ images: urls });

  } catch (err: any) {
    console.error("Error:", err);
    return NextResponse.json({ error: err.message || "Internal server error" }, { status: 500 });
  }
};
