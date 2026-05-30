"use client";

import { useEffect } from "react";
import { Radio } from "lucide-react";
import { usePlayerStore } from "@/store/playerStore";
import { SongRow } from "@/components/music/SongRow";
import { Button } from "@/components/ui/Button";
import type { Song } from "@/types";

export function RadioClient({ songs }: { songs: Song[] }) {
  const { playSong, currentSong } = usePlayerStore();

  function startRadio() {
    if (songs.length > 0) {
      playSong(songs[0], songs);
    }
  }

  return (
    <div className="px-4 md:px-6 py-6 space-y-6">
      {/* Hero */}
      <div className="rounded-2xl bg-gradient-to-br from-purple-900/40 to-pink-900/20 border border-white/5 p-6 flex items-center gap-4">
        <div className="w-14 h-14 rounded-full bg-purple-600/30 flex items-center justify-center flex-shrink-0">
          <Radio size={26} className="text-purple-400" />
        </div>
        <div className="flex-1 min-w-0">
          <h2 className="text-lg font-bold text-white">Radio Moozik</h2>
          <p className="text-sm text-white/40">
            {songs.length} sons mélangés aléatoirement
          </p>
        </div>
        <Button variant="primary" onClick={startRadio}>
          Lancer
        </Button>
      </div>

      {/* Liste */}
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
  );
}