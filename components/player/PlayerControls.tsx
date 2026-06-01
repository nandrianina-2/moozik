"use client";

import {
  Play, Pause, SkipBack, SkipForward,
  Shuffle, Repeat, Repeat1,
} from "lucide-react";
import { usePlayerStore } from "@/store/playerStore";
import { cn } from "@/lib/utils";

interface Props {
  compact?: boolean;
}

export function PlayerControls({ compact = false }: Props) {
  const {
    isPlaying, isLoading, shuffle, repeat,
    togglePlay, playNext, playPrev,
    toggleShuffle, toggleRepeat,
  } = usePlayerStore();

  return (
    <div className={cn("flex items-center", compact ? "gap-2" : "gap-4")}>
      {/* Shuffle — masqué en compact */}
      {!compact && (
        <button
          onClick={toggleShuffle}
          className={cn(
            "transition-colors",
            shuffle ? "text-purple-400" : "text-white/30 hover:text-white/60"
          )}
        >
          <Shuffle size={16} />
        </button>
      )}

      <button
        onClick={playPrev}
        className="text-white/60 hover:text-white transition-colors"
      >
        <SkipBack size={compact ? 18 : 20} fill="currentColor" />
      </button>

      <button
        onClick={togglePlay}
        disabled={isLoading}
        className={cn(
          "rounded-full bg-white flex items-center justify-center",
          "hover:scale-105 active:scale-95 transition-transform disabled:opacity-50",
          compact ? "w-8 h-8" : "w-9 h-9"
        )}
      >
        {isLoading ? (
          <span className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />
        ) : isPlaying ? (
          <Pause size={compact ? 14 : 16} fill="black" className="text-black" />
        ) : (
          <Play size={compact ? 14 : 16} fill="black" className="text-black ml-0.5" />
        )}
      </button>

      <button
        onClick={playNext}
        className="text-white/60 hover:text-white transition-colors"
      >
        <SkipForward size={compact ? 18 : 20} fill="currentColor" />
      </button>

      {/* Repeat — masqué en compact */}
      {!compact && (
        <button
          onClick={toggleRepeat}
          className={cn(
            "transition-colors",
            repeat !== "off" ? "text-purple-400" : "text-white/30 hover:text-white/60"
          )}
        >
          {repeat === "one" ? <Repeat1 size={16} /> : <Repeat size={16} />}
        </button>
      )}
    </div>
  );
}