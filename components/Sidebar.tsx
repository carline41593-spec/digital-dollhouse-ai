"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { href: "/creator-chat", label: "Creator Chat" },
  { href: "/prompt-generator", label: "Prompt Generator" },
  { href: "/image-generator", label: "Image Generator" },
  { href: "/image-editing", label: "Image Editing" },
  { href: "/photoshoot", label: "AI Photoshoot" },
  { href: "/library", label: "My Library" },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <div className="fixed left-0 top-0 h-full w-64 bg-gradient-to-b from-black to-purple-900 p-6">
      <h1 className="text-3xl font-bold text-pink-400 mb-12">Dollhouse AI</h1>
      <nav className="space-y-4">
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={`block py-3 px-4 rounded-lg transition ${
              pathname === link.href
                ? "bg-pink-600 text-white"
                : "hover:bg-pink-800 text-gray-300"
            }`}
          >
            {link.label}
          </Link>
        ))}
      </nav>
    </div>
  );
}
