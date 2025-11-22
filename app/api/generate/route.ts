// app/api/generate/route.ts
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const { prompt } = await request.json();

  const res = await fetch('https://dollhouse-flux-backend.onrender.com/generate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ prompt }),
  });

  const data = await res.json();
  return NextResponse.json(data);
}

export const maxDuration = 60;  // ← this tells Vercel "allow 60 seconds"
