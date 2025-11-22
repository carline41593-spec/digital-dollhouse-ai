// app/api/edit/route.ts
export const runtime = 'nodejs';
export const maxDuration = 60;
export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { image_base64, reference_base64, prompt } = await request.json();
    if (!image_base64 || !prompt) return NextResponse.json({ error: 'Missing data' }, { status: 400 });

    const TOKEN = process.env.TOGETHER_API_KEY;

    const res = await fetch('https://api.together.xyz/v1/images/generations', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: "black-forest-labs/FLUX.1-dev-lora",
        prompt: `this exact person, ${prompt}, photorealistic, 8k, ultra detailed, professional lighting`,
        init_image: `data:image/jpeg;base64,${image_base64}`,
        strength: 0.82,
        n: 1,
        steps: 28,
        width: 1024,
        height: 1024,
        guidance_scale: 7.5,
        response_format: "url"
      }),
    });

    if (!res.ok) {
      const err = await res.text();
      return NextResponse.json({ error: err }, { status: 502 });
    }

    const data = await res.json();
    return NextResponse.json({ image_url: data.data[0].url });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
