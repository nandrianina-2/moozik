"use client";

import Image from "next/image";
import { usePlayerStore } from "@/store/playerStore";
import { usePlayer } from "@/hooks/usePlayer";
import { VolumeControl } from "./VolumeControl";
import { PlayerActions } from "./PlayerActions";
import { cn } from "@/lib/utils";
import { useRouter, usePathname } from "next/navigation";
import {
  Play, Pause, SkipBack, SkipForward,
  Shuffle, Repeat, Repeat1, ChevronUp,
} from "lucide-react";
import { getAudioEngine } from "@/lib/audioEngine";
import { formatDuration } from "@/lib/utils";

export function MiniPlayer() {
  usePlayer();
  const router = useRouter();
  const pathname = usePathname();
  const {
    currentSong, isPlaying, isLoading,
    progress, duration,
    shuffle, repeat,
    togglePlay, playNext, playPrev,
    toggleShuffle, toggleRepeat,
  } = usePlayerStore();

  if (!currentSong || pathname === "/player") return null;

  const percent = duration > 0 ? (progress / duration) * 100 : 0;

  function handleSeek(e: React.MouseEvent<HTMLDivElement>) {
    if (!duration) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const ratio = (e.clientX - rect.left) / rect.width;
    getAudioEngine().seek(ratio * duration);
  }

  return (
    <div className={cn(
      "fixed left-0 right-0 z-40",
      "bg-[#1a1a1a] border-t border-white/8",
      "bottom-[62px] md:bottom-0",
      "md:left-56 xl:left-64 xl:right-72",
    )}>
      {/* ── Progress bar fine tout en haut ── */}
      <div
        className="h-0.5 bg-white/10 cursor-pointer group"
        onClick={handleSeek}
      >
        <div
          className="h-full bg-purple-500 group-hover:bg-purple-400 transition-colors relative"
          style={{ width: `${percent}%` }}
        >
          <div className="absolute right-0 top-1/2 -translate-y-1/2 w-2.5 h-2.5 rounded-full bg-white opacity-0 group-hover:opacity-100 translate-x-1/2 transition-opacity" />
        </div>
      </div>

      {/* ── MOBILE ── */}
      <div className="md:hidden">
        <div
          className="flex items-center gap-3 px-3 py-2.5 hover:cursor-pointer"
          onClick={() => router.push("/player")}
        >
          {/* Cover */}
          <div className="w-11 h-11 rounded-lg overflow-hidden bg-white/5 flex-shrink-0 shadow-lg">
            {currentSong.coverUrl ? (
              <Image
                src={currentSong.coverUrl}
                alt={currentSong.title}
                width={44}
                height={44}
                className="object-cover w-full h-full"
              />
            ) : (
              <div className="w-full h-full bg-white/10" />
            )}
          </div>

          {/* Titre + artiste */}
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-white truncate">
              {currentSong.title}
            </p>
            <p className="text-xs text-white/50 truncate">
              {currentSong.artist.name}
            </p>
          </div>

          {/* Contrôles compacts — stop propagation */}
          <div
            className="flex items-center gap-1"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={playPrev}
              className="w-9 h-9 flex items-center justify-center text-white/60 hover:text-white active:scale-90 transition-all"
            >
              <SkipBack size={20} fill="currentColor" />
            </button>

            <button
              onClick={togglePlay}
              title="Play/Pause (Espace)"
              disabled={isLoading}
              className="w-10 h-10 rounded-full bg-white flex items-center justify-center active:scale-90 transition-transform disabled:opacity-50"
            >
              {isLoading ? (
                <span className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />
              ) : isPlaying ? (
                <Pause size={18} fill="black" className="text-black" />
              ) : (
                <Play size={18} fill="black" className="text-black ml-0.5" />
              )}
            </button>

            <button
              onClick={playNext}
              className="w-9 h-9 flex items-center justify-center text-white/60 hover:text-white active:scale-90 transition-all"
            >
              <SkipForward size={20} fill="currentColor" />
            </button>
          </div>
        </div>
      </div>

      {/* ── DESKTOP ── */}
      <div className="hidden md:flex items-center gap-4 px-4 py-2.5">

        {/* Cover + infos — cliquable vers /player */}
        <div
          className="flex items-center gap-3 min-w-0 cursor-pointer group"
          style={{ flex: "0 0 260px" }}
          onClick={() => router.push("/player")}
        >
          <div className="w-11 h-11 rounded-lg overflow-hidden bg-white/5 flex-shrink-0 relative shadow-lg">
            {currentSong.coverUrl ? (
              <Image
                src={currentSong.coverUrl}
                alt={currentSong.title}
                width={44}
                height={44}
                className="object-cover w-full h-full"
              />
            ) : (
              <div className="w-full h-full bg-white/10" />
            )}
            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-lg">
              <ChevronUp size={16} className="text-white" />
            </div>
          </div>
          <div className="min-w-0">
            <p className="text-sm font-semibold text-white truncate">
              {currentSong.title}
            </p>
            <p className="text-xs text-white/50 truncate">
              {currentSong.artist.name}
            </p>
          </div>
        </div>

        {/* Contrôles centrés */}
        <div className="flex-1 flex flex-col items-center gap-1.5">
          <div className="flex items-center gap-4">
            <button
              onClick={toggleShuffle}
              className={cn(
                "transition-colors",
                shuffle ? "text-purple-400" : "text-white/30 hover:text-white/60"
              )}
            >
              <Shuffle size={15} />
            </button>

            <button
              onClick={playPrev}
              className="text-white/60 hover:text-white transition-colors"
            >
              <SkipBack size={20} fill="currentColor" />
            </button>

            <button
              onClick={togglePlay}
              title="Play/Pause (Espace)"
              disabled={isLoading}
              className="w-9 h-9 rounded-full bg-white flex items-center justify-center hover:scale-105 active:scale-95 transition-transform disabled:opacity-50"
            >
              {isLoading ? (
                <span className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />
              ) : isPlaying ? (
                <Pause size={16} fill="black" className="text-black" />
              ) : (
                <Play size={16} fill="black" className="text-black ml-0.5" />
              )}
            </button>

            <button
              onClick={playNext}
              className="text-white/60 hover:text-white transition-colors"
            >
              <SkipForward size={20} fill="currentColor" />
            </button>

            <button
              onClick={toggleRepeat}
              className={cn(
                "transition-colors",
                repeat !== "off" ? "text-purple-400" : "text-white/30 hover:text-white/60"
              )}
            >
              {repeat === "one" ? <Repeat1 size={15} /> : <Repeat size={15} />}
            </button>
          </div>

          {/* Progress desktop avec timestamps */}
          <div className="flex items-center gap-2 w-full max-w-md">
            <span className="text-[10px] text-white/30 tabular-nums w-7 text-right">
              {formatDuration(progress)}
            </span>
            <div
              className="flex-1 h-1 bg-white/10 rounded-full cursor-pointer group/bar relative"
              onClick={handleSeek}
            >
              <div
                className="h-full bg-white rounded-full group-hover/bar:bg-purple-400 transition-colors relative"
                style={{ width: `${percent}%` }}
              >
                <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-white opacity-0 group-hover/bar:opacity-100 translate-x-1/2 transition-opacity" />
              </div>
            </div>
            <span className="text-[10px] text-white/30 tabular-nums w-7">
              {formatDuration(duration)}
            </span>
          </div>
        </div>

        {/* Actions + Volume droite */}
        <div
          className="flex items-center gap-3 justify-end"
          style={{ flex: "0 0 260px" }}
        >
          <PlayerActions />
          <div className="w-px h-4 bg-white/10" />
          <VolumeControl />
        </div>
      </div>
    </div>
  );
}