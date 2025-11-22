// app/api/generate/route.ts
import { NextResponse } from 'next/server';

export const maxDuration = 60;  // Extend timeout to 60s (Hobby safe)

export async function POST(request: Request) {
  try {
    const { prompt } = await request.json();
    if (!prompt) {
      return NextResponse.json({ error: 'Missing prompt' }, { status: 400 });
    }

    const FIREWORKS_KEY = process.env.FIREWORKS_API_KEY;  // Set in Vercel env
    if (!FIREWORKS_KEY) {
      return NextResponse.json({ error: 'API key not set' }, { status: 500 });
    }

    const res = await fetch('https://api.fireworks.ai/inference/v1/images/generations', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${FIREWORKS_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'flux-schnell',  // Fast & reliable
        prompt,
        width: 1024,
        height: 1024,
        steps: 4,
        output_format: 'png',
      }),
    });

    if (!res.ok) {
      const err = await res.text();
      return NextResponse.json({ error: 'Fireworks API error', details: err }, { status: 502 });
    }

    const data = await res.json();
    const imageUrl = data.images?.[0]?.url;

    if (!imageUrl) {
      return NextResponse.json({ error: 'No image generated' }, { status: 500 });
    }

    return NextResponse.json({ image_url: imageUrl });
  } catch (error: any) {
    console.error('Generate error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
