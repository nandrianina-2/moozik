"use client";

import { Heart, ListPlus, Share2, Download } from "lucide-react";
import { useState } from "react";
import { usePlayerStore } from "@/store/playerStore";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { AddToPlaylistModal } from "@/components/modals/AddToPlaylistModal";
import { cn } from "@/lib/utils";

export function PlayerActions() {
  const { currentSong, isLiked, setLiked } = usePlayerStore();
  const { isLoggedIn, isPremium } = useCurrentUser();
  const [likeLoading, setLikeLoading] = useState(false);
  const [showPlaylistModal, setShowPlaylistModal] = useState(false);

  if (!currentSong) return null;

  async function handleLike() {
    if (!isLoggedIn || !currentSong) return;
    setLikeLoading(true);
    try {
      const res = await fetch(`/api/songs/${currentSong.id}/like`, {
        method: "POST",
      });
      const data = await res.json();
      setLiked(data.liked);
    } finally {
      setLikeLoading(false);
    }
  }

  async function handleShare() {
    const url = `${window.location.origin}/s/${currentSong!.slug}`;
    if (navigator.share) {
      await navigator.share({
        title: currentSong!.title,
        text: `Écoute "${currentSong!.title}" sur Moozik`,
        url,
      });
    } else {
      await navigator.clipboard.writeText(url);
    }
  }

  async function handleDownload() {
    if (!isPremium) {
      alert("Le téléchargement offline est réservé aux membres Premium.");
      return;
    }
    if (!currentSong) return;
    try {
      const res = await fetch(currentSong.audioUrl);
      const blob = await res.blob();
      const cache = await caches.open("moozik-offline-songs");
      await cache.put(
        `/offline/${currentSong.id}`,
        new Response(blob, { headers: { "Content-Type": "audio/mpeg" } })
      );
      const saved = JSON.parse(localStorage.getItem("offline-songs") ?? "[]");
      if (!saved.find((s: any) => s.id === currentSong.id)) {
        saved.push({
          id: currentSong.id,
          title: currentSong.title,
          artist: currentSong.artist.name,
          coverUrl: currentSong.coverUrl,
          duration: currentSong.duration,
        });
        localStorage.setItem("offline-songs", JSON.stringify(saved));
      }
      alert(`"${currentSong.title}" sauvegardé pour écoute offline.`);
    } catch {
      alert("Erreur lors du téléchargement.");
    }
  }

  return (
    <>
      <div className="flex items-center gap-1">
        {/* Like */}
        <button
          onClick={handleLike}
          disabled={likeLoading || !isLoggedIn}
          title={isLoggedIn ? "Ajouter aux favoris" : "Connecte-toi"}
          className={cn(
            "p-2 rounded-lg transition-all",
            isLiked
              ? "text-pink-500 hover:text-pink-400"
              : "text-white/30 hover:text-white/70",
            "disabled:opacity-30 disabled:cursor-not-allowed"
          )}
        >
          <Heart
            size={16}
            fill={isLiked ? "currentColor" : "none"}
            className={likeLoading ? "animate-pulse" : ""}
          />
        </button>

        {/* Playlist */}
        <button
          onClick={() => setShowPlaylistModal(true)}
          disabled={!isLoggedIn}
          title="Ajouter à une playlist"
          className="p-2 rounded-lg text-white/30 hover:text-white/70 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
        >
          <ListPlus size={16} />
        </button>

        {/* Share */}
        <button
          onClick={handleShare}
          title="Partager"
          className="p-2 rounded-lg text-white/30 hover:text-white/70 transition-all"
        >
          <Share2 size={16} />
        </button>

        {/* Download */}
        <button
          onClick={handleDownload}
          title={isPremium ? "Télécharger offline" : "Premium requis"}
          className={cn(
            "p-2 rounded-lg transition-all",
            isPremium
              ? "text-white/30 hover:text-white/70"
              : "text-white/15 cursor-not-allowed"
          )}
        >
          <Download size={16} />
        </button>
      </div>

      {showPlaylistModal && (
        <AddToPlaylistModal
          song={currentSong}
          onClose={() => setShowPlaylistModal(false)}
        />
      )}
    </>
  );
}