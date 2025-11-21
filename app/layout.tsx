import type { Metadata } from "next";
import "./globals.css";                 // ← THIS LINE MUST BE EXACTLY HERE
import Sidebar from "@/components/Sidebar";

export const metadata: Metadata = {
  title: "DigitalDollhouse Creator AI",
  description: "The ultimate AI suite for creators",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-black">
        <Sidebar />
        <main className="pl-80">{children}</main>
      </body>
    </html>
  );
}
