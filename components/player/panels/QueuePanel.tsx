"use client";

import { usePlayerStore } from "@/store/playerStore";
import { X, Music2 } from "lucide-react";
import { formatDuration } from "@/lib/utils";
import Image from "next/image";

export function QueuePanel() {
  const { queue, removeFromQueue, playSong } = usePlayerStore();

  if (queue.length === 0) {
    return (
      <div className="flex flex-col items-center gap-2 py-6 text-center">
        <Music2 size={24} className="text-white/20" />
        <p className="text-white/30 text-sm">File d&apos;attente vide</p>
      </div>
    );
  }

  return (
    <div className="space-y-1">
      <p className="text-xs text-white/30 mb-3">
        {queue.length} son{queue.length > 1 ? "s" : ""} à venir
      </p>
      {queue.map((song) => (
        <div
          key={song.id}
          className="flex items-center gap-2 p-2 rounded-lg hover:bg-white/5 group"
        >
          <div
            className="w-9 h-9 rounded-md overflow-hidden bg-white/10 flex-shrink-0 cursor-pointer"
            onClick={() => playSong(song, [song, ...queue])}
          >
            {song.coverUrl ? (
              <Image
                src={song.coverUrl}
                alt={song.title}
                width={36}
                height={36}
                className="object-cover w-full h-full"
              />
            ) : (
              <div className="w-full h-full bg-white/10" />
            )}
          </div>
          <div
            className="flex-1 min-w-0 cursor-pointer"
            onClick={() => playSong(song, [song, ...queue])}
          >
            <p className="text-sm text-white truncate">{song.title}</p>
            <p className="text-xs text-white/40 truncate">
              {song.artist.name}
            </p>
          </div>
          <span className="text-xs text-white/30 tabular-nums">
            {formatDuration(song.duration)}
          </span>
          <button
            onClick={() => removeFromQueue(song.id)}
            className="opacity-0 group-hover:opacity-100 p-1 rounded text-white/30 hover:text-white/70 transition-all"
          >
            <X size={14} />
          </button>
        </div>
      ))}
    </div>
  );
}