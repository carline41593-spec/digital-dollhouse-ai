// app/api/edit/route.ts   ← REPLACE ENTIRE FILE
export const runtime = 'nodejs';
export const maxDuration = 60;
export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    const { image_base64, reference_base64, prompt } = await request.json();

    if (!image_base64 || !prompt) {
      return new Response(JSON.stringify({ error: 'Main image + prompt required' }), { status: 400 });
    }

    const TOKEN = process.env.REPLICATE_API_TOKEN;
    if (!TOKEN) return new Response(JSON.stringify({ error: 'REPLICATE_API_TOKEN missing' }), { status: 500 });

    const input: any = {
      prompt: prompt + ", ultra photorealistic, 8k, professional lighting, detailed skin",
      image: `data:image/jpeg;base64,${image_base64}`,
      num_outputs: 1,
      width: 1024,
      height: 1024,
      num_inference_steps: 28,
      guidance_scale: 7.5,
    };

    // Optional style/pose reference
    if (reference_base64) input.reference_image = `data:image/jpeg;base64,${reference_base64}`;

    const create = await fetch('https://api.replicate.com/v1/predictions', {
      method: 'POST',
      headers: {
        'Authorization': `Token ${TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        version: '07c541f6ca4b0e83c62e6d3b2b7e5b0e5e6f7g8h9i0j1k2l3m4n5o6p7q8r9s', // FLUX.1 [pro]
        input,
      }),
    });

    const prediction = await create.json();

    let result = prediction;
    while (result.status === 'starting' || result.status === 'processing') {
      await new Promise(r => setTimeout(r, 2000));
      result = await (await fetch(`https://api.replicate.com/v1/predictions/${result.id}`, {
        headers: { 'Authorization': `Token ${TOKEN}` },
      })).json();
    }

    if (result.status === 'failed') {
      return new Response(JSON.stringify({ error: result.error }), { status: 500 });
    }

    return new Response(JSON.stringify({ image_url: result.output[0] }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });

  } catch (e: any) {
    return new Response(JSON.stringify({ error: e.message }), { status: 500 });
  }
}
