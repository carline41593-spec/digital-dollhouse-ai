// app/api/photoshoot/route.ts
import { NextResponse } from 'next/server';

export const maxDuration = 60;  // 60s for photoshoot processing

export async function POST(request: Request) {
  try {
    const { image_base64, prompt } = await request.json();
    if (!image_base64 || !prompt) {
      return NextResponse.json({ error: 'Missing image_base64 or prompt' }, { status: 400 });
    }

    const FIREWORKS_KEY = process.env.FIREWORKS_API_KEY;
    if (!FIREWORKS_KEY) {
      return NextResponse.json({ error: 'API key not set' }, { status: 500 });
    }

    // Enhance prompt for face likeness (Flux doesn't do true face-swap, but prompt engineering helps)
    const enhancedPrompt = `${prompt}, perfect likeness to the uploaded reference face, ultra-realistic portrait, 8k, professional studio lighting, high fashion details, sharp focus on facial features`;

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
      return NextResponse.json({ error: 'Fireworks API error', details: err }, { status: 502 });
    }

    const data = await res.json();
    const imageUrl = data.images?.[0]?.url;

    if (!imageUrl) {
      return NextResponse.json({ error: 'No image generated' }, { status: 500 });
    }

    // Return 4 variations (duplicate for grid; upgrade to multi-gen later)
    return NextResponse.json({
      images: [imageUrl, imageUrl, imageUrl, imageUrl],
    });
  } catch (error: any) {
    console.error('Photoshoot error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
