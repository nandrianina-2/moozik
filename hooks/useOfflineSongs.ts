"use client";

import { useState, useEffect } from "react";

export interface OfflineSong {
  id:       string;
  title:    string;
  artist:   string;
  coverUrl?: string;
  duration: number;
  cachedUrl: string;
}

export function useOfflineSongs() {
  const [songs, setSongs] = useState<OfflineSong[]>([]);

  useEffect(() => {
    try {
      const raw = localStorage.getItem("offline-songs");
      if (raw) setSongs(JSON.parse(raw));
    } catch {}
  }, []);

  function isDownloaded(id: string) {
    return songs.some((s) => s.id === id);
  }

  async function removeSong(id: string) {
    try {
      const cache = await caches.open("moozik-offline-songs");
      await cache.delete(`/offline/${id}`);
    } catch {}
    const next = songs.filter((s) => s.id !== id);
    localStorage.setItem("offline-songs", JSON.stringify(next));
    setSongs(next);
  }

  return { songs, isDownloaded, removeSong };
}