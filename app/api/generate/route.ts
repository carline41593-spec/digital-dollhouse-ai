// app/api/generate/route.ts
export const runtime = 'nodejs';
export const maxDuration = 60;
export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { prompt } = await request.json();
    if (!prompt) return NextResponse.json({ error: 'Prompt required' }, { status: 400 });

    const TOKEN = process.env.TOGETHER_API_KEY;
    if (!TOKEN) return NextResponse.json({ error: 'TOGETHER_API_KEY missing' }, { status: 500 });

    const res = await fetch('https://api.together.xyz/v1/images/generations', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'black-forest-labs/flux.1-dev',
        prompt: prompt + ', photorealistic, 8k, ultra detailed, cinematic lighting',
        n: 1,
        steps: 28,
        width: 1024,
        height: 1024,
        guidance_scale: 7.5,
        response_format: 'url',
      }),
    });

    if (!res.ok) {
      const err = await res.text();
      return NextResponse.json({ error: 'Generation failed', details: err }, { status: 502 });
    }

    const data = await res.json();
    const image_url = data.data[0].url;

    return NextResponse.json({ image_url });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
