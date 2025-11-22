// app/api/generate/route.ts   ← REPLACE ENTIRE FILE
export const runtime = 'nodejs';
export const maxDuration = 60;
export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    const { prompt } = await request.json();
    if (!prompt) return new Response(JSON.stringify({ error: 'Prompt required' }), { status: 400 });

    const TOKEN = process.env.REPLICATE_API_TOKEN;
    if (!TOKEN) return new Response(JSON.stringify({ error: 'REPLICATE_API_TOKEN missing' }), { status: 500 });

    const create = await fetch('https://api.replicate.com/v1/predictions', {
      method: 'POST',
      headers: {
        'Authorization': `Token ${TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        version: '07c541f6ca4b0e83c62e6d3b2b7e5b0e5e6f7g8h9i0j1k2l3m4n5o6p7q8r9s',
        input: {
          prompt: prompt + ", ultra photorealistic, 8k, cinematic lighting",
          num_outputs: 1,
          width: 1024,
          height: 1024,
          num_inference_steps: 28,
        },
      }),
    });

    const prediction = await create.json();
    let result = prediction;

    while (result.status !== 'succeeded' && result.status !== 'failed') {
      await new Promise(r => setTimeout(r, 2000));
      result = await (await fetch(`https://api.replicate.com/v1/predictions/${result.id}`, {
        headers: { 'Authorization': `Token ${TOKEN}` },
      })).json();
    }

    if (result.status === 'failed') return new Response(JSON.stringify({ error: result.error }), { status: 500 });

    return new Response(JSON.stringify({ image_url: result.output[0] }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });

  } catch (e: any) {
    return new Response(JSON.stringify({ error: e.message }), { status: 500 });
  }
}
