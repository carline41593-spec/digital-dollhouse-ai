// app/api/edit/route.ts
export const runtime = 'nodejs';
export const maxDuration = 60;
export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { image_base64, reference_base64, prompt } = await request.json();
    if (!image_base64 || !prompt) {
      return NextResponse.json({ error: 'Main image + prompt required' }, { status: 400 });
    }

    const TOKEN = process.env.TOGETHER_API_KEY;
    if (!TOKEN) {
      return NextResponse.json({ error: 'TOGETHER_API_KEY missing' }, { status: 500 });
    }

    // Build content array for multimodal (main + optional reference + prompt)
    const content = [
      { type: 'text', text: prompt + ', photorealistic, 8k, keep exact face, ultra detailed' },
      { type: 'image_url', image_url: { url: `data:image/jpeg;base64,${image_base64}` } }  // Main reference
    ];

    if (reference_base64) {
      content.push({ type: 'image_url', image_url: { url: `data:image/jpeg;base64,${reference_base64}` } });  // Style/pose reference
    }

    const res = await fetch('https://api.together.xyz/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'black-forest-labs/FLUX.1-kontext-dev',
        messages: [{ role: 'user', content }],
        max_tokens: 512,
        temperature: 0.7,
        response_format: { type: 'image' },
      }),
    });

    if (!res.ok) {
      const err = await res.text();
      return NextResponse.json({ error: 'Generation failed', details: err }, { status: 502 });
    }

    const data = await res.json();
    const image_url = data.choices[0].message.content.parts[0].image_url.url;

    return NextResponse.json({ image_url });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
