// app/api/photoshoot/route.ts
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
        prompt: `${prompt}, ultra realistic transformation of the uploaded image, keep exact same face and person, 8k masterpiece, professional photography`,
        image: image_base64,
        strength: 0.8,
        num_images: 1,           // ← ONLY ONE IMAGE
        width: 1024,
        height: 1280,
        steps: 30,
        guidance_scale: 6.5,
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      return NextResponse.json({ error: data.detail || "Failed" }, { status: 500 });
    }

    return NextResponse.json({ image: data.images[0].url }); // ← return single URL
  } catch (error) {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
};

export const runtime = "nodejs";
export const maxDuration = 60;
export const dynamic = "force-dynamic";
