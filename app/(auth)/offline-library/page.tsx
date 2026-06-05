"use client";

import { useOfflineSongs } from "@/hooks/useOfflineSongs";
import { Header } from "@/components/layout/Header";
import { usePlayerStore } from "@/store/playerStore";
import { WifiOff, Trash2, Play, Music2 } from "lucide-react";
import { formatDuration } from "@/lib/utils";
import type { Song } from "@/types";

export default function OfflineLibraryPage() {
  const { songs, removeSong } = useOfflineSongs();
  const { playSong } = usePlayerStore();

  async function handlePlay(song: typeof songs[0]) {
    try {
      const cache = await caches.open("moozik-offline-songs");
      const res   = await cache.match(`/offline/${song.id}`);
      if (!res) { alert("Son non disponible"); return; }

      const blob = await res.blob();
      const url  = URL.createObjectURL(blob);

      const songData: Song = {
        id:          song.id,
        title:       song.title,
        slug:        song.id,
        audioUrl:    url,
        coverUrl:    song.coverUrl,
        duration:    song.duration,
        genres:      [],
        streamCount: 0,
        likesCount:  0,
        isLiked:     false,
        releaseDate: new Date(),
        artist: {
          id: "", name: song.artist, slug: "",
          isVerified: false, userId: "", followers: 0, genres: [],
        },
      };

      playSong(songData, [songData]);
    } catch {
      alert("Erreur de lecture offline");
    }
  }

  return (
    <div className="pb-32">
      <Header title="Bibliothèque offline" />
      <div className="px-4 md:px-6 py-6">
        {songs.length === 0 ? (
          <div className="flex flex-col items-center gap-4 py-20 text-center">
            <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center">
              <WifiOff size={28} className="text-white/20" />
            </div>
            <div>
              <p className="text-white/50 text-sm font-medium">Aucun son téléchargé</p>
              <p className="text-white/30 text-xs mt-1">
                Télécharge des sons depuis le lecteur (Premium requis)
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-2">
            <p className="text-xs text-white/40 mb-4">
              {songs.length} son{songs.length > 1 ? "s" : ""} disponible{songs.length > 1 ? "s" : ""} offline
            </p>
            {songs.map((song) => (
              <div
                key={song.id}
                className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/5 group"
              >
                <div className="w-10 h-10 rounded-lg overflow-hidden bg-white/10 flex-shrink-0">
                  {song.coverUrl ? (
                    <img
                      src={song.coverUrl}
                      alt={song.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Music2 size={16} className="text-white/20" />
                    </div>
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-medium text-white truncate">
                      {song.title}
                    </p>
                    <span className="text-[10px] bg-green-500/20 text-green-400 px-1.5 py-0.5 rounded-full flex-shrink-0">
                      Offline
                    </span>
                  </div>
                  <p className="text-xs text-white/40">
                    {song.artist} · {formatDuration(song.duration)}
                  </p>
                </div>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => handlePlay(song)}
                    className="p-2 rounded-lg text-white/40 hover:text-white hover:bg-white/10 transition-all"
                  >
                    <Play size={15} />
                  </button>
                  <button
                    onClick={() => removeSong(song.id)}
                    className="p-2 rounded-lg text-white/20 hover:text-red-400 hover:bg-red-400/10 transition-all"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}