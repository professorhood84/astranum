import type { Metadata } from "next";
import { Space_Grotesk, Inter } from "next/font/google";
import Link from "next/link";
import { Analytics } from "@vercel/analytics/next";

import "./globals.css";

const display = Space_Grotesk({
  variable: "--font-display-stack",
  subsets: ["latin"],
});

const body = Inter({
  variable: "--font-sans-stack",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Astranum — Personalized Numerology & Astrology Readings",
  description:
    "One reading that combines your real birth chart, your numerology, and your Chinese zodiac — calculated from live planetary positions, not canned horoscopes.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className={`${display.variable} ${body.variable} font-sans antialiased`}>
        <header className="mx-auto flex max-w-5xl items-center justify-between px-6 pt-7">
          <Link href="/" className="flex items-center gap-3">
            <span className="text-2xl text-gold">✦</span>
            <span className="font-display text-lg uppercase tracking-[0.2em] text-white">
              Astranum
            </span>
          </Link>
          <nav className="flex gap-6 text-sm text-lilac">
            <Link href="/sky" className="hover:text-gold">
              Today&rsquo;s Sky
            </Link>
            <Link href="/reading" className="hover:text-gold">
              Your Reading
            </Link>
          </nav>
        </header>
        {children}
        <footer className="mx-auto max-w-5xl px-6 py-16 text-sm text-lilac/70">
          <p>
            Astranum — personalized numerology &amp; astrology readings. Positions
            are computed from the VSOP87/ELP ephemeris for the exact moment and
            place you were born.
          </p>
          <p className="mt-2">© {new Date().getFullYear()} Astranum</p>
        </footer>
        <Analytics />
      </body>
    </html>
  );
}
