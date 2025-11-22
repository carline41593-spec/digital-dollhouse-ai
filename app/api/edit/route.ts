// app/api/edit/route.ts   ← REPLACE OR CREATE THIS FILE
export const runtime = 'nodejs';
export const maxDuration = 60;
export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    const { image_base64, reference_base64, prompt } = await request.json();

    if (!image_base64 || !prompt) {
      return new Response(JSON.stringify({ error: 'Main image and prompt required' }), { status: 400 });
    }

    const FAL_KEY = process.env.FAL_KEY;
    if (!FAL_KEY) return new Response(JSON.stringify({ error: 'FAL_KEY missing' }), { status: 500 });

    const body: any = {
      prompt: prompt + ", ultra realistic, 8k, cinematic lighting, detailed skin",
      image_url: `data:image/jpeg;base64,${image_base64}`,  // ← MAIN FACE
      image_size: 'square_hd',
      strength: 0.8,
      num_inference_steps: 8,
      num_images: 1,
    };

    // Optional reference image (for pose/style)
    if (reference_base64) {
      body.reference_image_url = `data:image/jpeg;base64,${reference_base64}`;
    }

    const res = await fetch('https://fal.run/fal-ai/flux/schnell', {
      method: 'POST',
      headers: {
        'Authorization': `Key ${FAL_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      const err = await res.text();
      return new Response(JSON.stringify({ error: 'Generation failed', details: err }), { status: 502 });
    }

    const data = await res.json();
    const resultUrl = data.images?.[0]?.url;

    if (!resultUrl) return new Response(JSON.stringify({ error: 'No image generated' }), { status: 500 });

    return new Response(JSON.stringify({ image_url: resultUrl }), {
      status: 200,
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
    });

  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}
