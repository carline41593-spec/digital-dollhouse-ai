// app/api/edit/route.ts
export const runtime = 'nodejs';
export const maxDuration = 60;
export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    const { image_base64, reference_base64, prompt } = await request.json();
    if (!image_base64 || !prompt) return new Response(JSON.stringify({ error: 'Main image + prompt required' }), { status: 400 });

    const TOKEN = process.env.TOGETHER_API_KEY;
    if (!TOKEN) return new Response(JSON.stringify({ error: 'TOGETHER_API_KEY missing' }), { status: 500 });

    const input: any = {
      model: 'black-forest-labs/flux.1-dev',
      prompt: prompt + ', photorealistic, 8k, professional lighting, ultra detailed',
      init_image: `data:image/jpeg;base64,${image_base64}`,
      n: 1,
      steps: 28,
      width: 1024,
      height: 1024,
      guidance_scale: 7.5,
      response_format: 'url',
    };

    if (reference_base64) input.reference_image = `data:image/jpeg;base64,${reference_base64}`;

    const res = await fetch('https://api.together.xyz/v1/images/generations', {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${TOKEN}`, 'Content-Type': 'application/json' },
      body: JSON.stringify(input),
    });

    if (!res.ok) {
      const err = await res.text();
      return new Response(JSON.stringify({ error: err }), { status: 502 });
    }

    const data = await res.json();
    const image_url = data.data[0].url;

    return new Response(JSON.stringify({ image_url }), { status: 200, headers: { 'Content-Type': 'application/json' } });
  } catch (e: any) {
    return new Response(JSON.stringify({ error: e.message }), { status: 500 });
  }
}
