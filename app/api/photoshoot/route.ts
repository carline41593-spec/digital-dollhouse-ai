import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { image_base64, prompt } = await req.json();
  const FIREWORKS_KEY = process.env.FIREWORKS_API_KEY;

  const res = await fetch("https://api.fireworks.ai/inference/v1/image/flux-pro-ipadapter", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${FIREWORKS_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      image: image_base64,
      prompt: prompt + ", ultra-realistic, 8k, professional photography, perfect face match",
      num_images: 4,
      guidance_scale: 7.5,
      steps: 50,
    }),
  });

  const data = await res.json();
  return NextResponse.json({ images: data.images.map((i: any) => i.url) });
}
