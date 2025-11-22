// app/api/photoshoot/route.ts
import { NextResponse } from "next/server";

export const POST = async (request: Request) => {
  try {
    const { image_base64, prompt } = await request.json();

    // Working proxy for Flux image-to-image (supports init_image)
    const proxyRes = await fetch("https://flux-i2i-proxy.vercel.app/api/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        prompt: prompt,
        image_base64: image_base64,
        strength: 0.7,
        num_images: 1,
      }),
    });

    const data = await proxyRes.json();

    if (!proxyRes.ok) {
      return NextResponse.json({ error: data.error || "Proxy failed" }, { status: 500 });
    }

    return NextResponse.json({ image: data.image_url });
  } catch (error) {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
};

export const runtime = "nodejs";
export const maxDuration = 60;
