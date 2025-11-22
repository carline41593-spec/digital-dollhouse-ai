// app/api/generate/route.ts
export const maxDuration = 60;
export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { prompt } = await request.json();
    if (!prompt) return NextResponse.json({ error: 'Missing prompt' }, { status: 400 });

    const FAL_KEY = process.env.FAL_KEY;
    if (!FAL_KEY) return NextResponse.json({ error: 'API key missing' }, { status: 500 });

    const res = await fetch('https://fal.run/fal-ai/flux/schnell', {
      method: 'POST',
      headers: {
        'Authorization': `Key ${FAL_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        prompt,
        image_size: 'square_hd',
        num_inference_steps: 4,
        num_images: 1,
      }),
    });

    if (!res.ok) {
      const err = await res.text();
      return NextResponse.json({ error: 'fal.ai failed', details: err }, { status: 502 });
    }

    const data = await res.json();
    return NextResponse.json({ image_url: data.images?.[0] || data.image_url });

  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
