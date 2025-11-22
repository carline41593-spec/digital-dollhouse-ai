// app/api/photoshoot/route.ts
export const maxDuration = 60;        // ← Allows 60 seconds on Vercel Hobby
export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { image_base64, prompt } = await request.json();

    if (!image_base64 || !prompt) {
      return NextResponse.json({ error: 'Missing image or prompt' }, { status: 400 });
    }

    const FIREWORKS_KEY = process.env.FIREWORKS_API_KEY;
    if (!FIREWORKS_KEY) {
      return NextResponse.json({ error: 'API key missing' }, { status: 500 });
    }

    const enhancedPrompt = `${prompt}, perfect likeness to uploaded face photo, ultra realistic portrait, 8k resolution, professional studio lighting, sharp facial details, high fashion`;

    const res = await fetch('https://api.fireworks.ai/inference/v1/images/generations', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${FIREWORKS_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'flux-schnell',
        prompt: enhancedPrompt,
        width: 1024,
        height: 1024,
        steps: 4,
        output_format: 'png',
      }),
    });

    if (!res.ok) {
      const err = await res.text();
      console.error('Fireworks error:', err);
      return NextResponse.json({ error: 'Fireworks failed', details: err }, { status: 502 });
    }

    const data = await res.json();
    const imageUrl = data.images?.[0]?.url;

    if (!imageUrl) {
      return NextResponse.json({ error: 'No image generated' }, { status: 500 });
    }

    // Return 4 copies for your grid
    return NextResponse.json({
      images: [imageUrl, imageUrl, imageUrl, imageUrl],
    });

  } catch (error: any) {
    console.error('Photoshoot route error:', error);
    return NextResponse.json({ error: error.message || 'Server error' }, { status: 500 });
  }
}
