// app/api/photoshoot/route.ts
export const maxDuration = 60;
export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { image_base64, prompt } = await request.json();
    if (!image_base64 || !prompt) return NextResponse.json({ error: 'Missing image or prompt' }, { status: 400 });

    const FAL_KEY = process.env.FAL_KEY;
    if (!FAL_KEY) return NextResponse.json({ error: 'API key missing' }, { status: 500 });

    const enhancedPrompt = `${prompt}, perfect likeness to uploaded face, ultra-realistic, 8k, professional lighting`;

    const res = await fetch('https://fal.run/fal-ai/flux/schnell', {
      method: 'POST',
      headers: {
        'Authorization': `Key ${FAL_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        prompt: enhancedPrompt,
        image_size: 'square_hd',  // 1024x1024
        num_inference_steps: 4,
        num_images: 4,  // Your 4-grid
      }),
    });

    if (!res.ok) {
      const err = await res.text();
      return NextResponse.json({ error: 'fal.ai failed', details: err }, { status: 502 });
    }

    const data = await res.json();
    return NextResponse.json({ images: data.images || [data.image_url] });  // Fallback if single

  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
