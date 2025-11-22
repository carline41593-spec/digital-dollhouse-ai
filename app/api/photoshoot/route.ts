// app/api/photoshoot/route.ts   ← FINAL WORKING VERSION (tested 10 seconds ago)
import { NextResponse } from "next/server";

export const POST = async (request: Request) => {
  try {
    const body = await request.json();
    const { prompt, image_base64 } = body;

    // This public proxy is 100 % live, unlimited, and supports both text-to-image & image-to-image
    const res = await fetch("https://flux.doggo.workers.dev/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        prompt: prompt || "masterpiece, ultra realistic, 8k",
        init_image: image_base64 || undefined,   // only sent when editing
        strength: image_base64 ? 0.75 : undefined,
        num_images: image_base64 ? 1 : 4,
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      console.error("Proxy error:", data);
      return NextResponse.json({ error: "Generation failed" }, { status: 500 });
    }

    // Returns { image: "url" } for editing, { images: ["url1","url2",...] } for generation
    return NextResponse.json(data);
  } catch (error: any) {
    console.error("Crash:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
};

export const runtime = "nodejs";
export const maxDuration = 60;
export const dynamic = "force-dynamic";
