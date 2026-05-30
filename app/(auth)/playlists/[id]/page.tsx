"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { Header } from "@/components/layout/Header";
import { SongRow } from "@/components/music/SongRow";
import { Button } from "@/components/ui/Button";
import { Play, Shuffle, ListMusic, Lock, Globe } from "lucide-react";
import { usePlayerStore } from "@/store/playerStore";
import { formatDuration } from "@/lib/utils";
import type { Song } from "@/types";

interface PlaylistDetail {
  id: string;
  name: string;
  description?: string;
  isPublic: boolean;
  songs: Song[];
  createdAt: string;
}

export default function PlaylistDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [playlist, setPlaylist] = useState<PlaylistDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const { playSong } = usePlayerStore();

  useEffect(() => {
    fetch(`/api/playlists/${id}`)
      .then((r) => r.json())
      .then((d) => { setPlaylist(d.playlist); setLoading(false); });
  }, [id]);

  function playAll() {
    if (!playlist?.songs.length) return;
    playSong(playlist.songs[0], playlist.songs);
  }

  function playShuffle() {
    if (!playlist?.songs.length) return;
    const shuffled = [...playlist.songs].sort(() => Math.random() - 0.5);
    playSong(shuffled[0], shuffled);
  }

  const totalDuration = playlist?.songs.reduce((acc, s) => acc + s.duration, 0) ?? 0;

  if (loading) {
    return (
      <div className="pb-32">
        <Header title="Playlist" />
        <div className="px-4 md:px-6 py-6 space-y-3">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-14 rounded-xl bg-white/5 animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  if (!playlist) {
    return (
      <div className="pb-32">
        <Header title="Playlist" />
        <div className="px-4 md:px-6 py-20 text-center">
          <p className="text-white/40 text-sm">Playlist introuvable</p>
        </div>
      </div>
    );
  }

  return (
    <div className="pb-32">
      <Header title={playlist.name} />

      <div className="px-4 md:px-6 py-6">
        {/* Infos */}
        <div className="flex gap-5 items-end mb-6">
          <div className="w-32 h-32 rounded-xl bg-purple-600/20 flex items-center justify-center flex-shrink-0">
            <ListMusic size={40} className="text-purple-400" />
          </div>
          <div className="min-w-0 pb-1">
            <p className="text-xs text-white/40 uppercase tracking-wider mb-1">
              Playlist
            </p>
            <h1 className="text-2xl font-bold text-white truncate">
              {playlist.name}
            </h1>
            {playlist.description && (
              <p className="text-sm text-white/40 mt-1 line-clamp-2">
                {playlist.description}
              </p>
            )}
            <div className="flex items-center gap-2 mt-2">
              {playlist.isPublic ? (
                <Globe size={12} className="text-white/30" />
              ) : (
                <Lock size={12} className="text-white/30" />
              )}
              <p className="text-xs text-white/30">
                {playlist.songs.length} son{playlist.songs.length !== 1 ? "s" : ""}
                {totalDuration > 0 && ` · ${formatDuration(totalDuration)}`}
              </p>
            </div>
          </div>
        </div>

        {/* Actions */}
        {playlist.songs.length > 0 && (
          <div className="flex items-center gap-3 mb-6">
            <Button variant="primary" onClick={playAll}>
              <Play size={16} fill="white" /> Lire tout
            </Button>
            <Button variant="secondary" onClick={playShuffle}>
              <Shuffle size={15} /> Mélanger
            </Button>
          </div>
        )}

        {/* Sons */}
        {playlist.songs.length === 0 ? (
          <div className="flex flex-col items-center gap-3 py-16 text-center">
            <div className="w-14 h-14 rounded-full bg-white/5 flex items-center justify-center">
              <ListMusic size={24} className="text-white/20" />
            </div>
            <p className="text-white/40 text-sm">
              Cette playlist est vide — ajoute des sons depuis le lecteur
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-1">
            {playlist.songs.map((song, i) => (
              <SongRow
                key={song.id}
                song={song}
                queue={playlist.songs}
                index={i}
                showIndex
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}