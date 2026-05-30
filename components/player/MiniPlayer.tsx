"use client";

import Image from "next/image";
import { usePlayerStore } from "@/store/playerStore";
import { usePlayer } from "@/hooks/usePlayer";
import { PlayerControls } from "./PlayerControls";
import { ProgressBar } from "./ProgressBar";
import { VolumeControl } from "./VolumeControl";
import { PlayerActions } from "./PlayerActions";
import { cn } from "@/lib/utils";

export function MiniPlayer() {
  usePlayer();

  const { currentSong } = usePlayerStore();

  if (!currentSong) return null;

  return (
    <div className={cn(
      "fixed bottom-0 left-0 right-0 z-50",
      "bg-[#141414]/95 backdrop-blur-xl border-t border-white/5",
      "px-4 py-3",
      "md:left-56 xl:left-64 xl:right-72"
    )}>
      {/* Progress bar */}
      <div className="mb-3">
        <ProgressBar />
      </div>

      <div className="flex items-center gap-4">
        {/* Cover + infos */}
        <div className="flex items-center gap-3 min-w-0" style={{ flex: 1 }}>
          <div className="w-10 h-10 rounded-md overflow-hidden bg-white/5 flex-shrink-0">
            {currentSong.coverUrl ? (
              <Image
                src={currentSong.coverUrl}
                alt={currentSong.title}
                width={40}
                height={40}
                className="object-cover w-full h-full"
              />
            ) : (
              <div className="w-full h-full bg-white/10" />
            )}
          </div>
          <div className="min-w-0">
            <p className="text-sm font-medium text-white truncate">
              {currentSong.title}
            </p>
            <p className="text-xs text-white/40 truncate">
              {currentSong.artist.name}
            </p>
          </div>
        </div>

        {/* Contrôles centre */}
        <PlayerControls />

        {/* Actions + Volume — droite */}
        <div className="hidden md:flex items-center gap-3 justify-end" style={{ flex: 1 }}>
          <PlayerActions />
          <div className="w-px h-4 bg-white/10" />
          <VolumeControl />
        </div>

        {/* Actions mobile — uniquement like et playlist */}
        <div className="flex md:hidden items-center">
          <PlayerActions />
        </div>
      </div>
    </div>
  );
}