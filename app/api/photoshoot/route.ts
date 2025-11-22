// app/api/photoshoot/route.js (or .ts — works for both)
import { NextResponse } from 'next/server';

export const maxDuration = 60;  // Allow 60s for Flux (free plan safe)

export async function POST(request) {
  try {
    const { prompt, style } = await request.json();  // Adjust fields as needed (e.g., add pose, outfit)
    if (!prompt) {
      return NextResponse.json({ error: 'Missing prompt' }, { status: 400 });
    }

    // ← FIX: Use YOUR Render backend, not the broken proxy
    const res = await fetch('https://dollhouse-flux-backend.onrender.com/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        prompt: `${prompt}, ${style || 'photorealistic photoshoot, professional lighting, dynamic pose'}`  // Enhance for photoshoot
      }),
    });

    if (!res.ok) {
      const err = await res.text();
      console.error('Photoshoot backend error:', err);
      return NextResponse.json({ error: 'Flux failed', details: err }, { status: res.status });
    }

    const data = await res.json();
    if (!data.image_url) {
      return NextResponse.json({ error: 'No image generated' }, { status: 500 });
    }

    return NextResponse.json({ image_url: data.image_url });
  } catch (error) {
    console.error('Photoshoot route error:', error);
    return NextResponse.json({ error: 'Internal server error (check logs)' }, { status: 500 });
  }
}
