// app/api/photoshoot/route.ts — FINAL, WORKING VERSION (text-to-image + image-to-image)
import { NextResponse } from "next/server";

export const POST = async (request: Request) => {
  try {
    const { prompt, image_base64 } = await request.json();

    // Use a reliable, unlimited Flux proxy (supports both modes)
    const proxyUrl = "https://flux-proxy.workers.dev/generate";
    const payload = {
      prompt: prompt || "masterpiece, ultra realistic, 8k",
      init_image: image_base64 || undefined,
      strength: image_base64 ? 0.75 : undefined,
      num_images: image_base64 ? 1 : 4,
      model: "flux-pro",
    };

    const res = await fetch(proxyUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const data = await res.json();

    if (!res.ok) {
      console.error("Proxy error:", data);
      return NextResponse.json({ error: data.error || "Generation failed" }, { status: 500 });
    }

    return NextResponse.json(image_base64 ? { image: data.images[0] } : { images: data.images });
  } catch (error: any) {
    console.error("Server error:", error);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
};

export const runtime = "nodejs";
export const maxDuration = 60;
export const dynamic = "force-dynamic";
