import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { kenneyHigh, kenneyPixel, kenneyMini } from "./fonts";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Tavern Dice Duel",
  description: "Medieval dice game with animated rolls and AI opponents",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`
        ${geistSans.variable}
        ${geistMono.variable}
        ${kenneyHigh.variable}
        ${kenneyPixel.variable}
        ${kenneyMini.variable}
        h-full antialiased
      `}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}