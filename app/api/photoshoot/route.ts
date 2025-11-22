// app/api/photoshoot/route.ts  ← FINAL VERSION (supports both)
import { NextResponse } from "next/server";

export const POST = async (request: Request) => {
  const { prompt, image_base64 } = await request.json();

  const body = image_base64
    ? { prompt, image_base64, strength: 0.75, num_images: 1 }  // image-to-image
    : { prompt, num_images: 4 };                              // text-to-image

  const res = await fetch("https://flux-all-in-one.vercel.app/api/generate", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  const data = await res.json();
  if (!res.ok) return NextResponse.json({ error: data.error || "Failed" }, { status: 500 });

  return NextResponse.json(image_base64 ? { image: data.image_url } : { images: data.images });
};

export const runtime = "nodejs";
export const maxDuration = 60;
