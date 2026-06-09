"use client";

import { useState, useEffect } from "react";
import { Header } from "@/components/layout/Header";
import { SongRow } from "@/components/music/SongRow";
import { Heart } from "lucide-react";
import type { Song } from "@/types";

export const metadata = { title: "Favoris" };

export default function FavoritesPage() {
  const [songs, setSongs] = useState<Song[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/users/likes")
      .then((r) => r.json())
      .then((d) => {
        setSongs(d.songs ?? []);
        setLoading(false);
      });
  }, []);

  return (
    <div className="pb-32">
      <Header title="Favoris" />
      <div className="px-4 md:px-6 py-6">
        {loading ? (
          <div className="space-y-2">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-14 rounded-xl bg-white/5 animate-pulse" />
            ))}
          </div>
        ) : songs.length === 0 ? (
          <div className="flex flex-col items-center gap-4 py-20 text-center">
            <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center">
              <Heart size={28} className="text-white/20" />
            </div>
            <div>
              <p className="text-white/50 text-sm font-medium">
                Aucun favori pour l'instant
              </p>
              <p className="text-white/30 text-xs mt-1">
                Like des sons pour les retrouver ici
              </p>
            </div>
          </div>
        ) : (
          <div>
            <p className="text-sm text-white/40 mb-4">
              {songs.length} son{songs.length > 1 ? "s" : ""} aimé{songs.length > 1 ? "s" : ""}
            </p>
            <div className="flex flex-col gap-1">
              {songs.map((song, i) => (
                <SongRow
                  key={song.id}
                  song={song}
                  queue={songs}
                  index={i}
                  showIndex
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}