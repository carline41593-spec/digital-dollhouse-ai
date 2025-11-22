// app/api/photoshoot/route.ts   ← REPLACE ENTIRE FILE
export const runtime = 'nodejs';
export const maxDuration = 60;
export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    const { image_base64, prompt } = await request.json();

    if (!image_base64 || !prompt) {
      return new Response(JSON.stringify({ error: 'Missing face or prompt' }), { status: 400 });
    }

    const FAL_KEY = process.env.FAL_KEY;
    if (!FAL_KEY) {
      return new Response(JSON.stringify({ error: 'FAL_KEY missing' }), { status: 500 });
    }

    // THIS IS THE KEY: we send your uploaded face as image_url
    const res = await fetch('https://fal.run/fal-ai/flux/schnell', {
      method: 'POST',
      headers: {
        'Authorization': `Key ${FAL_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        prompt: prompt + ", ultra realistic, 8k, professional lighting, high fashion",
        image_url: `data:image/jpeg;base64,${image_base64}`,  // ← THIS USES YOUR FACE
        image_size: 'square_hd',
        strength: 0.75,           // 0.0 = keep original face 100%, 0.99 = more creative
        num_inference_steps: 6,
        num_images: 4,
      }),
    });

    if (!res.ok) {
      const err = await res.text();
      return new Response(JSON.stringify({ error: 'fal.ai failed', details: err }), { status: 502 });
    }

    const data = await res.json();
    const imageUrls = data.images?.map((img: any) => img.url) || [];

    return new Response(JSON.stringify({ images: imageUrls }), {
      status: 200,
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
    });

  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}
