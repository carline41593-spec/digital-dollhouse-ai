// app/api/generate/route.ts
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const { prompt } = await request.json();
  if (!prompt) return NextResponse.json({ error: 'Missing prompt' }, { status: 400 });

  try {
    const res = await fetch('https://dollhouse-flux-backend.onrender.com/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt }),
    });
    const data = await res.json();
    return NextResponse.json(data);
  } catch (err) {
    return NextResponse.json({ error: 'Timeout/failed' }, { status: 500 });
  }
}
