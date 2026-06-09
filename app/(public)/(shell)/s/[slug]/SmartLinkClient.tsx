"use client";

import { useState } from "react";
import { Play, Share2, Check, ListPlus, Heart } from "lucide-react";
import { usePlayerStore } from "@/store/playerStore";
import { Button } from "@/components/ui/Button";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { AddToPlaylistModal } from "@/components/modals/AddToPlaylistModal";
import type { Song } from "@/types";
import { cn } from "@/lib/utils";

export function SmartLinkClient({ song }: { song: Song }) {
  const { playSong, currentSong, isPlaying, togglePlay } = usePlayerStore();
  const { isLoggedIn }   = useCurrentUser();
  const [liked, setLiked]   = useState(false);
  const [copied, setCopied] = useState(false);
  const [showPlaylist, setShowPlaylist] = useState(false);

  const isActive = currentSong?.id === song.id;

  function handlePlay() {
    if (isActive) {
      togglePlay();
    } else {
      playSong(song, [song]);
      fetch(`/api/songs/${song.id}/play`, { method: "POST" }).catch(() => {});
    }
  }

  async function handleLike() {
    if (!isLoggedIn) return;
    const res  = await fetch(`/api/songs/${song.id}/like`, { method: "POST" });
    const data = await res.json();
    setLiked(data.liked);
  }

  async function handleShare() {
    const url = window.location.href;
    if (navigator.share) {
      await navigator.share({
        title: song.title,
        text:  `Écoute "${song.title}" par ${song.artist.name} sur Moozik`,
        url,
      });
    } else {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }

  return (
    <>
      <div className="space-y-3">
        {/* Bouton play principal */}
        <Button
          variant="primary"
          size="lg"
          className="w-full text-base"
          onClick={handlePlay}
        >
          {isActive && isPlaying ? (
            <>⏸ En cours de lecture</>
          ) : (
            <><Play size={18} fill="white" /> Écouter maintenant</>
          )}
        </Button>

        {/* Actions secondaires */}
        <div className="grid grid-cols-3 gap-2">
          <button
            onClick={handleLike}
            disabled={!isLoggedIn}
            className={cn(
              "flex flex-col items-center gap-1.5 p-3 rounded-xl border transition-all text-xs font-medium",
              liked
                ? "bg-pink-500/10 border-pink-500/20 text-pink-400"
                : "bg-white/5 border-white/10 text-white/50 hover:border-white/20 disabled:opacity-30"
            )}
          >
            <Heart size={18} fill={liked ? "currentColor" : "none"} />
            {liked ? "Aimé" : "Liker"}
          </button>

          <button
            onClick={() => setShowPlaylist(true)}
            disabled={!isLoggedIn}
            className="flex flex-col items-center gap-1.5 p-3 rounded-xl border bg-white/5 border-white/10 text-white/50 hover:border-white/20 transition-all text-xs font-medium disabled:opacity-30"
          >
            <ListPlus size={18} />
            Playlist
          </button>

          <button
            onClick={handleShare}
            className="flex flex-col items-center gap-1.5 p-3 rounded-xl border bg-white/5 border-white/10 text-white/50 hover:border-white/20 transition-all text-xs font-medium"
          >
            {copied
              ? <Check size={18} className="text-green-400" />
              : <Share2 size={18} />}
            {copied ? "Copié !" : "Partager"}
          </button>
        </div>
      </div>

      {showPlaylist && (
        <AddToPlaylistModal
          song={song}
          onClose={() => setShowPlaylist(false)}
        />
      )}
    </>
  );
}