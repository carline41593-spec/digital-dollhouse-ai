// app/api/photoshoot/route.ts
export const runtime = 'nodejs';
export const maxDuration = 60;
export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { image_base64, prompt } = await request.json();
    if (!image_base64 || !prompt) return NextResponse.json({ error: 'Missing data' }, { status: 400 });

    const TOKEN = process.env.TOGETHER_API_KEY;
    if (!TOKEN) return NextResponse.json({ error: 'No API key' }, { status: 500 });

    const res = await fetch('https://api.together.xyz/v1/images/generations', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: "black-forest-labs/flux-dreambooth-lora",
        prompt: prompt + ", photorealistic, 8k, ultra detailed skin, professional studio lighting",
        init_image: `data:image/jpeg;base64,${image_base64}`,
        n: 4,
        width: 1024,
        height: 1024,
        steps: 28,
        guidance_scale: 7.5,
        response_format: "url"
      }),
    });

    if (!res.ok) {
      const err = await res.text();
      return NextResponse.json({ error: err }, { status: 502 });
    }

    const data = await res.json();
    return NextResponse.json({ images: data.data.map((i: any) => i.url) });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
