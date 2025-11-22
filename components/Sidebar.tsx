// components/Sidebar.tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { href: "/", label: "Home", icon: "Home" },
  { href: "/creator-chat", label: "Creator Chat", icon: "Chat" },
  { href: "/prompt-generator", label: "Prompt Generator", icon: "Lightbulb" },
  { href: "/image-generation", label: "Image Generation", icon: "Image" },
  { href: "/image-editing", label: "Image Editing", icon: "Edit" },
  { href: "/photoshoot", label: "AI Photoshoot Lounge", icon: "Camera" },
  { href: "/live-assistant", label: "Live Assistant", icon: "Mic" },
  { href: "/prompt-grabber", label: "Magic Prompt Grabber", icon: "Magic" },
  { href: "/library", label: "My Library", icon: "Folder" },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <div className="fixed inset-y-0 left-0 w-80 bg-black/90 backdrop-blur-2xl border-r border-pink-500/20 z-50 flex flex-col">
      {/* Logo – perfectly proportioned & centered */}
      <div className="px-10 pt-12 pb-10 text-center">
        <h1 className="text-6xl font-black tracking-tight leading-none bg-gradient-to-r from-pink-400 via-yellow-400 to-pink-400 bg-clip-text text-transparent">
          DigitalDollhouse
        </h1>
        <p className="text-pink-300 text-lg mt-3 tracking-wider font-light">
          Creator AI Suite
        </p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-6 py-8 space-y-2 overflow-y-auto">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`block px-6 py-4 rounded-2xl text-lg font-medium transition-all flex items-center ${
                isActive
                  ? "bg-gradient-to-r from-pink-500 to-pink-600 text-white shadow-lg shadow-pink-500/50"
                  : "text-gray-300 hover:bg-pink-900/40 hover:text-white"
              }`}
            >
              <span className="mr-4 text-2xl">{item.icon}</span>
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* Copyright – clean at the bottom */}
      <div className="absolute inset-x-0 bottom-6 text-center pointer-events-none px-6">
        <p className="text-yellow-400 text-xs opacity-70 tracking-wider">
          © 2025 the DigitalDollhouse Creator AI
        </p>
      </div>
    </div>
  );
}
