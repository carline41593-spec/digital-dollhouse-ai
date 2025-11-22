// app/api/photoshoot/route.ts   ← REPLACE YOUR ENTIRE FILE WITH THIS
export const runtime = 'nodejs';       // ← Critical for fal.ai CORS
export const maxDuration = 60;         // ← Keeps Vercel from killing it
export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { image_base64, prompt } = await request.json();

    if (!image_base64 || !prompt) {
      return NextResponse.json({ error: 'Missing image or prompt' }, { status: 400 });
    }

    const FAL_KEY = process.env.FAL_KEY;
    if (!FAL_KEY) {
      return NextResponse.json({ error: 'FAL_KEY not set in Vercel' }, { status: 500 });
    }

    const enhancedPrompt = `${prompt}, perfect likeness to uploaded face, ultra-realistic, 8k, professional studio lighting, high fashion, sharp details`;

    const res = await fetch('https://fal.run/fal-ai/flux/schnell', {
      method: 'POST',
      headers: {
        'Authorization': `Key ${FAL_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        prompt: enhancedPrompt,
        image_size: 'square_hd',
        num_inference_steps: 4,
        num_images: 4,
      }),
    });

    if (!res.ok) {
      const err = await res.text();
      console.error('fal.ai error:', err);
      return NextResponse.json({ error: 'Generation failed', details: err }, { status: 502 });
    }

    const data = await res.json();

    // fal.ai returns { images: [ { url: "..." }, ... ] }
    const imageUrls = data.images?.map((img: any) => img.url) || [];

    if (imageUrls.length === 0) {
      return NextResponse.json({ error: 'No images returned' }, { status: 500 });
    }

    // FINAL RESPONSE — THIS FIXES CORS AND MAKES IMAGES APPEAR IN YOUR APP
    return new Response(
      JSON.stringify({ images: imageUrls }),
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type',
        },
      }
    );

  } catch (error: any) {
    console.error('Photoshoot route crash:', error);
    return new Response(
      JSON.stringify({ error: error.message || 'Server error' }),
      { status: 500 }
    );
  }
}

// Handle preflight CORS request
export async function OPTIONS() {
  return new Response(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}
