// app/api/photoshoot/route.ts
export const runtime = 'nodejs';
export const maxDuration = 60;
export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { image_base64, prompt } = await request.json();
    if (!image_base64 || !prompt) {
      return NextResponse.json({ error: 'Missing face or prompt' }, { status: 400 });
    }

    const TOKEN = process.env.TOGETHER_API_KEY;
    if (!TOKEN) {
      return NextResponse.json({ error: 'TOGETHER_API_KEY missing' }, { status: 500 });
    }

    // FLUX.1 Kontext [dev] for image + text (your face + changes)
    const res = await fetch('https://api.together.xyz/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'black-forest-labs/FLUX.1-kontext-dev',
        messages: [
          {
            role: 'user',
            content: [
              { type: 'text', text: prompt + ', photorealistic, 8k, professional lighting, keep exact face features' },
              { type: 'image_url', image_url: { url: `data:image/jpeg;base64,${image_base64}` } }  // Your reference face
            ]
          }
        ],
        max_tokens: 512,
        temperature: 0.7,
        response_format: { type: 'image' },  // Outputs image URLs
      }),
    });

    if (!res.ok) {
      const err = await res.text();
      return NextResponse.json({ error: 'Generation failed', details: err }, { status: 502 });
    }

    const data = await res.json();
    const images = data.choices[0].message.content.parts.filter((part: any) => part.type === 'image_url').map((part: any) => part.image_url.url);

    return NextResponse.json({ images });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
