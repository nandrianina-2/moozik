"use client";

import Link from "next/link";
import { Music2, TrendingUp, Heart, Pencil } from "lucide-react";
import { formatCount } from "@/lib/utils";

interface SongItem {
  id: string;
  title: string;
  streamCount: number;
  likesCount: number;
  isPublished: boolean;
  createdAt: string;
}

export function SongsList({ songs }: { songs: SongItem[] }) {
  return (
    <div className="bg-white/3 rounded-xl border border-white/5 overflow-hidden">
      {songs.map((song) => (
        <div
          key={song.id}
          className="flex items-center gap-3 px-4 py-3 border-b border-white/5 last:border-0 hover:bg-white/3 transition-colors"
        >
          <div className="w-9 h-9 rounded-lg bg-purple-600/20 flex items-center justify-center flex-shrink-0">
            <Music2 size={15} className="text-purple-400" />
          </div>

          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-white truncate">
              {song.title}
            </p>
            <p className="text-xs text-white/30">{song.createdAt}</p>
          </div>

          <div className="flex items-center gap-3 text-xs text-white/30">
            <span className="hidden sm:flex items-center gap-1">
              <TrendingUp size={11} className="text-purple-400" />
              {formatCount(song.streamCount)}
            </span>
            <span className="hidden sm:flex items-center gap-1">
              <Heart size={11} className="text-pink-400" />
              {formatCount(song.likesCount)}
            </span>
            <span className={`px-2 py-0.5 rounded-full text-[10px] ${
              song.isPublished
                ? "bg-green-500/20 text-green-400"
                : "bg-white/10 text-white/30"
            }`}>
              {song.isPublished ? "Publié" : "Brouillon"}
            </span>
          </div>

          <Link
            href={`/studio/songs/${song.id}`}
            className="p-1.5 rounded-lg text-white/20 hover:text-purple-400 hover:bg-purple-400/10 transition-all"
            title="Modifier"
          >
            <Pencil size={14} />
          </Link>
        </div>
      ))}
    </div>
  );
}