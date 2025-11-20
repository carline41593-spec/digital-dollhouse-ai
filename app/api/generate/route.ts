import { NextResponse } from "next/server";

const FIREWORKS_API_KEY = process.env.FIREWORKS_API_KEY;

export async function POST(request: Request) {
  const { prompt } = await request.json();

  if (!prompt) {
    return NextResponse.json({ error: "Prompt required" }, { status: 400 });
  }

  const response = await fetch("https://api.fireworks.ai/inference/v1/image_generations", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${FIREWORKS_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "accounts/fireworks/models/flux-pro-1-1-1",
      prompt: prompt,
      width: 1024,
      height: 1024,
      output_format: "jpeg",
      num_images: 1,
    }),
  });

  const data = await response.json();

  if (data.images?.[0]?.url) {
    return NextResponse.json({ image_url: data.images[0].url });
  } else {
    return NextResponse.json({ error: "Generation failed" }, { status: 500 });
  }
}
