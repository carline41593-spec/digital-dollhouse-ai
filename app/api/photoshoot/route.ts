// app/api/photoshoot/route.ts
export const runtime = 'nodejs';
export const maxDuration = 60;
export const dynamic = 'force-dynamic';

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
      model: "black-forest-labs/FLUX.1-dev",           // ← this one fully supports init_image
      prompt: `this exact person, ${prompt}, photorealistic, 8k, ultra detailed skin, professional studio lighting, sharp focus`,
      init_image: `data:image/jpeg;base64,${image_base64}`,
      strength: 0.78,
      steps: 28,
      n: 4,
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
  const images = data.data.map((x: any) => x.url);

  return NextResponse.json({ images });
}
