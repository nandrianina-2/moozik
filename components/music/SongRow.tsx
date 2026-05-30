"use client";

import Image from "next/image";
import { Play, Pause, Heart, MoreHorizontal, ListPlus } from "lucide-react";
import { usePlayerStore } from "@/store/playerStore";
import { formatDuration, formatCount, cn } from "@/lib/utils";
import type { Song } from "@/types";
import { useState } from "react";

interface SongRowProps {
  song: Song;
  queue?: Song[];
  index?: number;
  showIndex?: boolean;
  showAlbum?: boolean;
  showArtist?: boolean;
}

export function SongRow({
  song,
  queue,
  index,
  showIndex = true,
  showAlbum = false,
  showArtist = true,
}: SongRowProps) {
  const { currentSong, isPlaying, playSong, togglePlay } = usePlayerStore();
  const [liked, setLiked] = useState(song.isLiked ?? false);

  const isActive = currentSong?.id === song.id;

  function handlePlay() {
    if (isActive) {
      togglePlay();
    } else {
      playSong(song, queue ?? [song]);
      // Incrémenter le stream count
      fetch(`/api/songs/${song.id}/play`, { method: "POST" }).catch(() => {});
    }
  }

  async function handleLike(e: React.MouseEvent) {
    e.stopPropagation();
    setLiked((prev) => !prev);
    await fetch(`/api/songs/${song.id}/like`, { method: "POST" });
  }

  function handleAddToQueue(e: React.MouseEvent) {
    e.stopPropagation();
    usePlayerStore.getState().addToQueue(song);
  }

  return (
    <div
      onClick={handlePlay}
      className={cn(
        "flex items-center gap-3 px-3 py-2 rounded-lg cursor-pointer group",
        "transition-colors duration-100",
        isActive
          ? "bg-white/10"
          : "hover:bg-white/5"
      )}
    >
      {/* Index / Play button */}
      <div className="w-8 flex items-center justify-center flex-shrink-0">
        {isActive ? (
          <button className="text-purple-400">
            {isPlaying ? <Pause size={16} fill="currentColor" /> : <Play size={16} fill="currentColor" />}
          </button>
        ) : (
          <>
            {showIndex && (
              <span className="text-sm text-white/30 group-hover:hidden">
                {index !== undefined ? index + 1 : ""}
              </span>
            )}
            <Play
              size={16}
              className={cn(
                "text-white fill-white",
                showIndex ? "hidden group-hover:block" : "opacity-0 group-hover:opacity-100"
              )}
            />
          </>
        )}
      </div>

      {/* Cover */}
      <div className="w-10 h-10 rounded-md overflow-hidden bg-white/5 flex-shrink-0">
        {song.coverUrl ? (
          <Image
            src={song.coverUrl}
            alt={song.title}
            width={40}
            height={40}
            className="object-cover w-full h-full"
          />
        ) : (
          <div className="w-full h-full bg-white/10 flex items-center justify-center">
            <Play size={14} className="text-white/20" />
          </div>
        )}
      </div>

      {/* Titre + artiste */}
      <div className="flex-1 min-w-0">
        <p className={cn(
          "text-sm font-medium truncate",
          isActive ? "text-purple-400" : "text-white"
        )}>
          {song.title}
        </p>
        {showArtist && (
          <p className="text-xs text-white/40 truncate">
            {song.artist.name}
          </p>
        )}
      </div>

      {/* Streams */}
      <span className="hidden md:block text-xs text-white/30 tabular-nums w-12 text-right">
        {formatCount(song.streamCount)}
      </span>

      {/* Actions */}
      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
        <button
          onClick={handleLike}
          className={cn(
            "p-1.5 rounded-md transition-colors",
            liked ? "text-pink-500" : "text-white/30 hover:text-white/70"
          )}
        >
          <Heart size={15} fill={liked ? "currentColor" : "none"} />
        </button>
        <button
          onClick={handleAddToQueue}
          className="p-1.5 rounded-md text-white/30 hover:text-white/70 transition-colors"
          title="Ajouter à la file"
        >
          <ListPlus size={15} />
        </button>
      </div>

      {/* Durée */}
      <span className="text-xs text-white/30 tabular-nums w-10 text-right flex-shrink-0">
        {formatDuration(song.duration)}
      </span>
    </div>
  );
}