// app/api/generate/route.ts  (text-only — no change needed, but here’s the working version)
export const runtime = 'nodejs';
export const maxDuration = 60;
export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { prompt } = await request.json();
    if (!prompt) return NextResponse.json({ error: 'No prompt' }, { status: 400 });

    const TOKEN = process.env.TOGETHER_API_KEY;
    const res = await fetch('https://api.together.xyz/v1/images/generations', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: "black-forest-labs/flux.1-dev",
        prompt: prompt + ", photorealistic, 8k",
        n: 1,
        width: 1024,
        height: 1024,
        steps: 28,
        response_format: "url"
      }),
    });

    const data = await res.json();
    return NextResponse.json({ image_url: data.data[0].url });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
