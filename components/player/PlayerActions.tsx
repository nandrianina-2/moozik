"use client";

import { Heart, ListPlus, Share2, Download } from "lucide-react";
import { useState } from "react";
import { usePlayerStore } from "@/store/playerStore";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { cn } from "@/lib/utils";

export function PlayerActions() {
  const { currentSong } = usePlayerStore();
  const { isLoggedIn, isPremium } = useCurrentUser();
  const [liked, setLiked] = useState(false);
  const [likeLoading, setLikeLoading] = useState(false);

  if (!currentSong) return null;

  async function handleLike() {
    if (!isLoggedIn || !currentSong) return;
    setLikeLoading(true);
    try {
      await fetch(`/api/songs/${currentSong.id}/like`, { method: "POST" });
      setLiked((prev) => !prev);
    } finally {
      setLikeLoading(false);
    }
  }

  function handleAddToPlaylist() {
    // Ouverture modal — sprint 4
    window.dispatchEvent(new CustomEvent("open-add-to-playlist", {
      detail: { song: currentSong },
    }));
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
      alert("Lien copié !");
    }
  }

  async function handleDownload() {
    if (!isPremium) {
      alert("Le téléchargement offline est réservé aux membres Premium.");
      return;
    }
    if (!currentSong) return;

    try {
      // Récupère le fichier audio
      const res = await fetch(currentSong.audioUrl);
      const blob = await res.blob();

      // Sauvegarde dans le cache du navigateur (Cache API)
      const cache = await caches.open("moozik-offline-songs");
      await cache.put(
        `/offline/${currentSong.id}`,
        new Response(blob, {
          headers: { "Content-Type": "audio/mpeg" },
        })
      );

      // Sauvegarde les métadonnées en localStorage
      const saved = JSON.parse(localStorage.getItem("offline-songs") ?? "[]");
      const exists = saved.find((s: any) => s.id === currentSong.id);
      if (!exists) {
        saved.push({
          id: currentSong.id,
          title: currentSong.title,
          artist: currentSong.artist.name,
          coverUrl: currentSong.coverUrl,
          slug: currentSong.slug,
          duration: currentSong.duration,
          cachedUrl: `/offline/${currentSong.id}`,
        });
        localStorage.setItem("offline-songs", JSON.stringify(saved));
      }

      alert(`"${currentSong.title}" sauvegardé pour écoute offline.`);
    } catch {
      alert("Erreur lors du téléchargement.");
    }
  }

  return (
    <div className="flex items-center gap-1">
      {/* Favori */}
      <button
        onClick={handleLike}
        disabled={likeLoading || !isLoggedIn}
        title={isLoggedIn ? "Ajouter aux favoris" : "Connecte-toi pour liker"}
        className={cn(
          "p-2 rounded-lg transition-all",
          liked
            ? "text-pink-500 hover:text-pink-400"
            : "text-white/30 hover:text-white/70",
          "disabled:opacity-30 disabled:cursor-not-allowed"
        )}
      >
        <Heart size={16} fill={liked ? "currentColor" : "none"} />
      </button>

      {/* Ajouter à une playlist */}
      <button
        onClick={handleAddToPlaylist}
        disabled={!isLoggedIn}
        title="Ajouter à une playlist"
        className="p-2 rounded-lg text-white/30 hover:text-white/70 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
      >
        <ListPlus size={16} />
      </button>

      {/* Partager */}
      <button
        onClick={handleShare}
        title="Partager"
        className="p-2 rounded-lg text-white/30 hover:text-white/70 transition-all"
      >
        <Share2 size={16} />
      </button>

      {/* Télécharger offline */}
      <button
        onClick={handleDownload}
        title={isPremium ? "Télécharger pour écoute offline" : "Premium requis"}
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
  );
}