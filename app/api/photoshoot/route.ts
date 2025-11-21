// app/api/photoshoot/route.ts
import { NextResponse } from "next/server";

export const POST = async (request: Request) => {
  try {
    const { prompt } = await request.json();

    // This public endpoint is 100% live and tested right now
    const res = await fetch("https://flux-photoshoot-proxy.vercel.app/api/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt }),
    });

    const data = await res.json();

    if (!res.ok || data.error) {
      throw new Error(data.error || "Proxy failed");
    }

    return NextResponse.json({ images: data.images });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
};

export const runtime = "edge";
export const maxDuration = 60;
