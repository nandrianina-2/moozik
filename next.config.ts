import type { NextConfig } from "next";

const withPWA = require("next-pwa")({
  dest: "public",
  disable: process.env.NODE_ENV === "development",
  register: true,
  skipWaiting: true,
  runtimeCaching: [
    // Assets statiques Next.js
    {
      urlPattern: /^https:\/\/.*\/_next\/static\/.*/i,
      handler: "CacheFirst",
      options: {
        cacheName: "next-static",
        expiration: { maxEntries: 200, maxAgeSeconds: 60 * 60 * 24 * 30 },
      },
    },
    // Pages HTML (navigation offline)
    {
      urlPattern: /\/(.*)/,
      handler: "NetworkFirst",
      options: {
        cacheName: "pages-cache",
        networkTimeoutSeconds: 10,
        expiration: { maxEntries: 50, maxAgeSeconds: 60 * 60 * 24 },
      },
    },
    // Cloudinary — images/covers (ton règle existant)
    {
      urlPattern: /^https:\/\/res\.cloudinary\.com\/.*/i,
      handler: "CacheFirst",
      options: {
        cacheName: "cloudinary-images",
        expiration: { maxEntries: 100, maxAgeSeconds: 60 * 60 * 24 * 30 },
      },
    },
    // Audio Cloudinary — fichiers mp3/wav/etc.
    {
      urlPattern: /^https:\/\/res\.cloudinary\.com\/.*\.(mp3|wav|ogg|flac|m4a)$/i,
      handler: "CacheFirst",
      options: {
        cacheName: "audio-cache",
        rangeRequests: true, // ← obligatoire pour le seek audio
        expiration: { maxEntries: 100, maxAgeSeconds: 60 * 60 * 24 * 30 },
      },
    },
    // API routes internes
    {
      urlPattern: /\/api\/.*/i,
      handler: "NetworkFirst",
      options: {
        cacheName: "api-cache",
        networkTimeoutSeconds: 10,
        expiration: { maxEntries: 100, maxAgeSeconds: 60 * 60 },
      },
    },
    // Ton ancienne règle api.moozik.com (garde-la si tu l'utilises)
    {
      urlPattern: /^https:\/\/api\.moozik\.com\/.*$/i,
      handler: "NetworkFirst",
      options: { cacheName: "api-cache", expiration: { maxEntries: 50 } },
    },
  ],
});

const nextConfig: NextConfig = {
  turbopack: {},
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "res.cloudinary.com" },
      { protocol: "https", hostname: "lh3.googleusercontent.com" },
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "avatars.githubusercontent.com" },
      { protocol: "https", hostname: "**" },
    ],
  },
  experimental: {
    serverActions: { bodySizeLimit: "2mb" },
  },
};

module.exports = withPWA(nextConfig);