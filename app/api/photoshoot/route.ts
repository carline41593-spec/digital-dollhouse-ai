import { NextRequest, NextResponse } from "next/server";

export const POST = async (req: NextRequest) => {
  const apiKey = process.env.FIREWORKS_API_KEY;

  // THIS LINE WILL TELL US THE TRUTH
  console.log("🔑 RAW KEY LENGTH:", apiKey?.length ?? "undefined");

  if (!apiKey || apiKey.length < 20) {
    return NextResponse.json(
      { error: `Key missing or too short (length: ${apiKey?.length ?? 0}). Double-check Vercel env vars.` },
      { status: 500 }
    );
  }

  const { prompt } = await req.json();

  const res = await fetch("https://api.fireworks.ai/inference/v1/image_generations", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "accounts/fireworks/models/flux-pro",
      prompt: `${prompt}, ultra-realistic fashion portrait, identical face from reference, 8k, vogue editorial`,
      num_images: 4,
      width: 1024,
      height: 1280,
      steps: 28,
      guidance_scale: 6.5,
    }),
  });

  const data = await res.json();
  if (!res.ok) return NextResponse.json({ error: data.detail || "Fireworks error" }, { status: 500 });

  return NextResponse.json({ images: data.images.map((i: any) => i.url) });
};
