"use client";

import { Play, Shuffle } from "lucide-react";
import { usePlayerStore } from "@/store/playerStore";
import { Button } from "@/components/ui/Button";
import type { Song } from "@/types";

export function AlbumClient({ songs }: { songs: Song[] }) {
  const { playSong, toggleShuffle } = usePlayerStore();

  function playAll() {
    if (songs.length > 0) playSong(songs[0], songs);
  }

  function playShuffle() {
    const shuffled = [...songs].sort(() => Math.random() - 0.5);
    if (shuffled.length > 0) {
      playSong(shuffled[0], shuffled);
    }
  }

  return (
    <div className="flex items-center gap-3">
      <Button variant="primary" onClick={playAll}>
        <Play size={16} fill="white" /> Lire tout
      </Button>
      <Button variant="secondary" onClick={playShuffle}>
        <Shuffle size={15} /> Mélanger
      </Button>
    </div>
  );
}