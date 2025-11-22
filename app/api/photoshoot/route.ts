// app/api/photoshoot/route.ts
export const runtime = 'nodejs';
export const maxDuration = 60;
export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { image_base64, prompt } = await request.json();
    if (!image_base64 || !prompt) return NextResponse.json({ error: 'Missing face or prompt' }, { status: 400 });

    const TOKEN = process.env.TOGETHER_API_KEY;
    if (!TOKEN) return NextResponse.json({ error: 'TOGETHER_API_KEY missing' }, { status: 500 });

    const res = await fetch('https://api.together.xyz/v1/images/generations', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'black-forest-labs/flux.1-dev', // High-res photoreal
        prompt: prompt + ', photorealistic, 8k, professional lighting, high detail',
        init_image: `data:image/jpeg;base64,${image_base64}`, // Your reference face
        n: 4, // 4 images
        steps: 28,
        width: 1024,
        height: 1024,
        response_format: 'url',
        guidance_scale: 7.5,
      }),
    });

    if (!res.ok) {
      const err = await res.text();
      console.error('Together AI error:', err);
      return NextResponse.json({ error: 'Generation failed', details: err }, { status: 502 });
    }

    const data = await res.json();
    const images = data.data?.map((img: any) => img.url) || [];

    return NextResponse.json({ images });

  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
