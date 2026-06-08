import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Providers } from "@/components/Providers";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });

export const metadata: Metadata = {
  title:       { default: "Moozik", template: "%s — Moozik" },
  description: "Moozik streaming",
  manifest:    "/manifest.webmanifest",
  appleWebApp: {
    capable:       true,
    statusBarStyle: "black-translucent",
    title:         "Moozik",
  },
  other: {
    "mobile-web-app-capable": "yes",
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
      </head>
      <body className={`${inter.variable} font-sans bg-[#0a0a0a] text-white`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}