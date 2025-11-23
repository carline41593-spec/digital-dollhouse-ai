// app/api/edit/route.ts
export const runtime = 'nodejs';
export const maxDuration = 60;

import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  const { image_base64, prompt } = await req.json();
  if (!image_base64 || !prompt) return NextResponse.json({ error: "Missing data" }, { status: 400 });

  const res = await fetch("https://api.together.xyz/v1/images/generations", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.TOGETHER_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "black-forest-labs/FLUX.1-dev",
      prompt: `this exact person, ${prompt}, photorealistic, 8k, professional lighting, ultra detailed skin`,
      init_image: `data:image/jpeg;base64,${image_base64}`,
      strength: 0.82,
      steps: 30,
      n: 1,
      width: 1024,
      height: 1024,
      guidance_scale: 7.5,
      seed: 42,
      response_format: "url"
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    return NextResponse.json({ error: err }, { status: 502 });
  }

  const data = await res.json();
  return NextResponse.json({ image_url: data.data[0].url });
}
