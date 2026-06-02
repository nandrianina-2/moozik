"use client";

import { useState } from "react";
import {
  Play, Shuffle, Share2, Check,
  Globe, Lock, ListMusic,
} from "lucide-react";
import { usePlayerStore } from "@/store/playerStore";
import { Button } from "@/components/ui/Button";
import { SongRow } from "@/components/music/SongRow";
import type { Song } from "@/types";
import { cn } from "@/lib/utils";

interface Props {
  songs: Song[];
  playlistId: string;
  playlistName: string;
  isPublic: boolean;
  isOwner: boolean;
}

export function PlaylistPageClient({
  songs,
  playlistId,
  playlistName,
  isPublic,
  isOwner,
}: Props) {
  const { playSong } = usePlayerStore();
  const [copied, setCopied] = useState(false);
  const [pub, setPub] = useState(isPublic);
  const [toggling, setToggling] = useState(false);

  function playAll() {
    if (songs.length > 0) playSong(songs[0], songs);
  }

  function playShuffle() {
    const shuffled = [...songs].sort(() => Math.random() - 0.5);
    if (shuffled.length > 0) playSong(shuffled[0], shuffled);
  }

  async function handleShare() {
    const url = `${window.location.origin}/playlists/${playlistId}`;
    if (navigator.share) {
      await navigator.share({ title: playlistName, url });
    } else {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }

  async function handleTogglePublic() {
    setToggling(true);
    await fetch(`/api/playlists/${playlistId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isPublic: !pub }),
    });
    setPub((p) => !p);
    setToggling(false);
  }

  return (
    <div>
      {/* Actions */}
      <div className="flex items-center gap-2 mb-6 flex-wrap">
        {songs.length > 0 && (
          <>
            <Button variant="primary" onClick={playAll}>
              <Play size={15} fill="white" /> Lire tout
            </Button>
            <Button variant="secondary" onClick={playShuffle}>
              <Shuffle size={15} /> Mélanger
            </Button>
          </>
        )}

        {/* Partager — seulement si publique */}
        {pub && (
          <Button variant="ghost" size="icon" onClick={handleShare} title="Copier le lien">
            {copied
              ? <Check size={16} className="text-green-400" />
              : <Share2 size={16} />}
          </Button>
        )}

        {/* Toggle public/privé — seulement si propriétaire */}
        {isOwner && (
          <button
            onClick={handleTogglePublic}
            disabled={toggling}
            className={cn(
              "flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium border transition-all",
              pub
                ? "bg-purple-500/10 border-purple-500/20 text-purple-400 hover:bg-purple-500/20"
                : "bg-white/5 border-white/10 text-white/40 hover:bg-white/8"
            )}
          >
            {pub ? <Globe size={13} /> : <Lock size={13} />}
            {pub ? "Publique" : "Privée"}
          </button>
        )}
      </div>

      {/* Sons */}
      {songs.length === 0 ? (
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
      )}
    </div>
  );
}