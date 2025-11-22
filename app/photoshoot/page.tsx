// app/photoshoot/page.tsx
"use client";

import { useState } from "react";
import Image from "next/image";

export default function Photoshoot() {
  const [faceImage, setFaceImage] = useState<string | null>(null);
  const [profession, setProfession] = useState("");
  const [type, setType] = useState("Editorial/Fashion");
  const [details, setDetails] = useState("");
  const [results, setResults] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const handleUpload = (e: any) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setFaceImage(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const generate = async () => {
    if (!faceImage) return;
    setLoading(true);
    setResults([]);

    const base64 = faceImage.split(",")[1];
    const prompt = `${profession || "beautiful model"}, ${type} photoshoot, ${details || "luxury setting"}, perfect likeness to uploaded face, ultra realistic, 8k, professional lighting`;

    try {
      const res = await fetch("/api/photoshoot", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ image_base64: base64, prompt }),
      });

      const data = await res.json();
      console.log("API returned:", data); // ← keep this just in case

      if (!res.ok || data.error) {
        throw new Error(data.error || "Generation failed");
      }

      // THIS IS THE MAGIC PART — works with fal.ai, Replicate, or anything
      let images: string[] = [];
      if (Array.isArray(data.images)) {
        images = data.images;
      } else if (data.image_url) {
        images = [data.image_url, data.image_url, data.image_url, data.image_url];
      } else if (data.output && Array.isArray(data.output)) {
        images = data.output;
      }

      setResults(images.slice(0, 4)); // always show up to 4

    } catch (err: any) {
      alert("Error: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white p-12 pl-96">
      <h1 className="text-6xl font-bold bg-gradient-to-r from-pink-400 to-yellow-400 bg-clip
