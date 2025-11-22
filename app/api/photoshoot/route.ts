// app/api/photoshoot/route.ts (Replicate FLUX.1 [pro])
export const runtime = 'nodejs';
export const maxDuration = 60;
export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { image_base64, prompt } = await request.json();
    if (!image_base64 || !prompt) return NextResponse.json({ error: 'Missing face or prompt' }, { status: 400 });

    const TOKEN = process.env.REPLICATE_API_TOKEN;
    if (!TOKEN) return NextResponse.json({ error: 'REPLICATE_API_TOKEN missing' }, { status: 500 });

    // Create prediction (FLUX.1 [pro] for realism)
    const createRes = await fetch('https://api.replicate.com/v1/predictions', {
      method: 'POST',
      headers: {
        'Authorization': `Token ${TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        version: '07c541f6ca4b0e83c62e6d3b2b7e5b0e5e6f7g8h9i0j1k2l3m4n5o6p7q8r9s',  // FLUX.1 [pro] version ID (copy from replicate.com/black-forest-labs/flux-pro)
        input: {
          prompt: prompt + ', photorealistic, 8k, professional lighting, high detail',
          image: `data:image/jpeg;base64,${image_base64}`,  // Your reference face
          num_outputs: 4,
          width: 1024,
          height: 1024,
          num_inference_steps: 28,  // Pro mode for quality
          guidance_scale: 7.5,
        },
      }),
    });

    if (!createRes.ok) {
      const err = await createRes.text();
      return NextResponse.json({ error: 'Replicate failed', details: err }, { status: 502 });
    }

    const prediction = await createRes.json();
    let status = prediction;

    // Poll until done (5–15s)
    while (status.status === 'starting' || status.status === 'processing') {
      await new Promise(resolve => setTimeout(resolve, 2000));
      status = await (await fetch(`https://api.replicate.com/v1/predictions/${prediction.id}`, {
        headers: { 'Authorization': `Token ${TOKEN}` },
      })).json();
    }

    if (status.status === 'failed') return NextResponse.json({ error: 'Generation failed', details: status.error }, { status: 500 });

    return NextResponse.json({ images: status.output });  // Array of 4 URLs

  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
