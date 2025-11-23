// app/api/edit/route.ts
export const runtime = 'nodejs';
export const maxDuration = 60;
export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { image_base64, reference_base64, prompt } = await request.json();
    if (!image_base64 || !prompt) return NextResponse.json({ error: 'Main image + prompt required' }, { status: 400 });

    const TOKEN = process.env.FAL_KEY;
    if (!TOKEN) return NextResponse.json({ error: 'FAL_KEY missing' }, { status: 500 });

    const res = await fetch('https://fal.run/fal-ai/flux/dev/image-to-image', {
      method: 'POST',
      headers: {
        'Authorization': `Key ${TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        prompt: `Keep this exact person's face, identity, and skin tone. Only change: ${prompt}. Photorealistic, 8k, professional lighting.`,
        image_url: `data:image/jpeg;base64,${image_base64}`,
        image_size: 'square_hd',
        num_inference_steps: 28,
        num_images: 1,
        strength: 0.8,
      }),
    });

    if (!res.ok) {
      const err = await res.text();
      return NextResponse.json({ error: 'fal.ai failed', details: err }, { status: 502 });
    }

    const data = await res.json();
    const image_url = data.images?.[0] || data.image_url;

    return NextResponse.json({ image_url });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
