// app/api/photoshoot/route.ts
export const runtime = 'nodejs';
export const maxDuration = 60;
export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  const { image_base64, prompt } = await req.json();
  if (!image_base64 || !prompt) return NextResponse.json({ error: "Missing data" }, { status: 400 });

  const res = await fetch("https://api.together.xyz/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.TOGETHER_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "black-forest-labs/FLUX.1-kontext-dev",
      messages: [
        {
          role: "user",
          content: [
            { type: "text", text: `${prompt}, photorealistic, 8k, professional studio lighting, ultra detailed skin, sharp focus, keep exact same face identity and features` },
            { type: "image_url", image_url: { url: `data:image/jpeg;base64,${image_base64}` } }
          ]
        }
      ],
      max_tokens: 512,
      temperature: 0.7,
      n: 4,                         // ← 4 images at once
      response_format: { type: "image" }
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    return NextResponse.json({ error: err }, { status: 502 });
  }

  const data = await res.json();
  const images = data.choices.flatMap((c: any) =>
    c.message.content.filter((p: any) => p.type === "image_url").map((p: any) => p.image_url.url)
  );

  return NextResponse.json({ images });
}
