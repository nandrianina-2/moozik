import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Providers } from "@/components/Providers";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });

export const metadata: Metadata = {
  title:       { default: "Moozik", template: "%s — Moozik" },
  description: "Streaming musical indépendant — Découvre des artistes, crée tes playlists",
  manifest:    "/manifest.webmanifest",
  openGraph: {
    type:        "website",
    siteName:    "Moozik",
    title:       "Moozik — Streaming musical indépendant",
    description: "Découvre et écoute de la musique indépendante",
    images:      [{ url: "/icon-512.png", width: 512, height: 512 }],
  },
  twitter: {
    card:        "summary",
    title:       "Moozik",
    description: "Streaming musical indépendant",
    images:      ["/icon-512.png"],
  },
  appleWebApp: {
    capable:        true,
    statusBarStyle: "black-translucent",
    title:          "Moozik",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <head>
        <meta name="theme-color" content="#7c3aed" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <link rel="apple-touch-icon" href="/icon-192.png" />
        <link rel="manifest" href="/manifest.webmanifest" />
      </head>
      <body className={`${inter.variable} font-sans bg-[#0a0a0a] text-white`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}