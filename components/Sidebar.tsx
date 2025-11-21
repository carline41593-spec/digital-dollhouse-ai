"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { href: "/creator-chat", label: "Creator Chat", icon: "Chat" },
  { href: "/prompt-generator", label: "Prompt Generator", icon: "Lightbulb" },
  { href: "/image-generator", label: "Image Generation", icon: "Image" },
  { href: "/image-editing", label: "Image Editing", icon: "Edit" },
  { href: "/photoshoot", label: "AI Photoshoot Lounge", icon: "Camera" },
  { href: "/live-assistant", label: "Live Assistant", icon: "Mic" },
  { href: "/prompt-grabber", label: "Prompt Grabber", icon: "Magic" },
  { href: "/text-to-speech", label: "Text-to-Speech", icon: "Volume" },
  { href: "/library", label: "My Library", icon: "Folder" },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <div className="fixed left-0 top-0 h-screen w-80 bg-gradient-to-b from-black via-pink-900/20 to-black p-8 overflow-y-auto">
      <div className="mb-12">
        <h1 className="text-4xl font-black bg-gradient-to-r from-pink-400 to-yellow-400 bg-clip-text text-transparent">
          DigitalDollhouse
        </h1>
        <p className="text-pink-400 text-lg mt-2">Creator AI</p>
      </div>

      <nav className="space-y-3">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`flex items-center gap-5 px-6 py-5 rounded-2xl transition-all ${
              pathname === item.href
                ? "bg-gradient-to-r from-pink-600 to-pink-700 text-white shadow-lg shadow-pink-500/30"
                : "text-gray-400 hover:bg-white/5 hover:text-white"
            }`}
          >
            <span className="text-2xl">{item.icon}</span>
            <span className="font-medium text-lg">{item.label}</span>
          </Link>
        ))}
      </nav>

      <div className="absolute bottom-8 left-8 right-8 text-center">
        <p className="text-gold text-sm">© 2024 the DigitalDollhouse Creator AI</p>
      </div>
    </div>
  );
}
