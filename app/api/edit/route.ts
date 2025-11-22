// app/api/edit/route.ts
export const runtime = 'nodejs';
export const maxDuration = 60;
export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    const { prompt } = await request.json();

    if (!prompt?.trim()) {
      return new Response(JSON.stringify({ error: 'Prompt required' }), { status: 400 });
    }

    const FAL_KEY = process.env.FAL_KEY;
    if (!FAL_KEY) {
      return new Response(JSON.stringify({ error: 'FAL_KEY missing' }), { status: 500 });
    }

    const res = await fetch('https://fal.run/fal-ai/flux/schnell', {
      method: 'POST',
      headers: {
        'Authorization': `Key ${FAL_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        prompt: prompt + ', ultra realistic, 8k, professional lighting, high detail',
        image_size: 'square_hd',
        num_inference_steps: 4,
        num_images: 1,
      }),
    });

    if (!res.ok) {
      const err = await res.text();
      return new Response(JSON.stringify({ error: 'fal.ai failed', details: err }), { status: 502 });
    }

    const data = await res.json();
    const imageUrl = data.images?.[0]?.url || data.image_url;

    if (!imageUrl) {
      return new Response(JSON.stringify({ error: 'No image generated' }), { status: 500 });
    }

    return new Response(JSON.stringify({ image_url: imageUrl }), {
      status: 200,
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
    });

  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}

export async function OPTIONS() {
  return new Response(null, { status: 204, headers: { 'Access-Control-Allow-Origin': '*' } });
}
