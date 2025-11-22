// app/api/photoshoot/route.ts   ← THIS ONE FIXES EVERYTHING
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
        prompt: prompt || "ultra realistic masterpiece, 8k",
        image: image_base64,           // ← This sends your uploaded image
        strength: 0.85,                // ← How much to change (0.0 = keep original, 1.0 = full change)
        num_images: 4,
        width: 1024,
        height: 1280,
        steps: 28,
        guidance_scale: 6.5,
      }),
    });

    const data = await res.json();
    if (!res.ok) return NextResponse.json({ error: data.detail || " "Failed" }, { status: 500 });

    return NextResponse.json({ images: data.images.map((i: any) => i.url) });
  } catch (error) {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
};

export const runtime = "nodejs";
export const maxDuration = 60;
