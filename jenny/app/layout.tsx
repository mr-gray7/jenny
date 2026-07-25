import type { Metadata, Viewport } from "next";
import { Inter, JetBrains_Mono, Playfair_Display } from "next/font/google";
import { config } from "@/content/config";
import "./globals.css";

/* Three voices:
   — Playfair Display for anything felt (titles, the emotional lines)
   — Inter for anything read (body, UI)
   — JetBrains Mono for anything measured (labels, the dashboard)
   The tension between the serif and the mono is the whole personality
   of the piece: a person who feels things, keeping a project plan. */

const display = Playfair_Display({
  variable: "--font-display",
  subsets: ["latin"],
  // Variable weight range — the display sizes want 400-500, the small
  // italic pull-quotes want the lighter end of it.
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
  display: "swap",
});

const sans = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
  display: "swap",
});

const mono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: config.meta.title,
  description: config.meta.description,
  // This is for one person. It should not be indexed, previewed in a
  // group chat, or found by anyone it isn't for.
  robots: { index: false, follow: false, nocache: true },
};

export const viewport: Viewport = {
  themeColor: "#05060a",
  colorScheme: "dark",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${display.variable} ${sans.variable} ${mono.variable} antialiased`}
    >
      <body>{children}</body>
    </html>
  );
}
