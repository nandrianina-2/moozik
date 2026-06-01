"use client";

import { useState } from "react";
import { Search, Eye, EyeOff, Trash2, TrendingUp, Heart } from "lucide-react";
import { formatCount, cn } from "@/lib/utils";

interface SongRow {
  id: string;
  title: string;
  artist: string;
  streamCount: number;
  likesCount: number;
  isPublished: boolean;
  createdAt: string;
}

export function LibraryClient({ songs }: { songs: SongRow[] }) {
  const [query, setQuery] = useState("");
  const [list, setList] = useState(songs);

  const filtered = list.filter(
    (s) =>
      s.title.toLowerCase().includes(query.toLowerCase()) ||
      s.artist.toLowerCase().includes(query.toLowerCase())
  );

  async function handleTogglePublish(id: string, current: boolean) {
    await fetch(`/api/admin/songs/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isPublished: !current }),
    });
    setList((prev) =>
      prev.map((s) => (s.id === id ? { ...s, isPublished: !current } : s))
    );
  }

  async function handleDelete(id: string) {
    if (!confirm("Supprimer ce son définitivement ?")) return;
    await fetch(`/api/admin/songs/${id}`, { method: "DELETE" });
    setList((prev) => prev.filter((s) => s.id !== id));
  }

  return (
    <div className="px-4 md:px-6 py-6 space-y-4">
      <div className="relative">
        <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" />
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Rechercher un son..."
          className="w-full h-9 pl-9 pr-3 rounded-lg bg-white/5 border border-white/10 text-white text-sm placeholder:text-white/20 focus:outline-none focus:border-purple-500 transition-colors"
        />
      </div>

      <p className="text-xs text-white/30">{filtered.length} sons</p>

      <div className="bg-white/3 rounded-xl border border-white/5 overflow-hidden">
        {filtered.map((song) => (
          <div
            key={song.id}
            className={cn(
              "flex items-center gap-3 px-4 py-3 border-b border-white/5 last:border-0 hover:bg-white/3 transition-colors",
              !song.isPublished && "opacity-50"
            )}
          >
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white truncate">
                {song.title}
              </p>
              <p className="text-xs text-white/40">{song.artist} · {song.createdAt}</p>
            </div>

            <div className="hidden md:flex items-center gap-4 text-xs text-white/30">
              <span className="flex items-center gap-1">
                <TrendingUp size={12} className="text-purple-400" />
                {formatCount(song.streamCount)}
              </span>
              <span className="flex items-center gap-1">
                <Heart size={12} className="text-pink-400" />
                {formatCount(song.likesCount)}
              </span>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={() => handleTogglePublish(song.id, song.isPublished)}
                title={song.isPublished ? "Dépublier" : "Publier"}
                className={cn(
                  "p-1.5 rounded-lg transition-all",
                  song.isPublished
                    ? "text-green-400 hover:text-green-300 bg-green-400/10"
                    : "text-white/30 hover:text-white/60"
                )}
              >
                {song.isPublished ? <Eye size={15} /> : <EyeOff size={15} />}
              </button>

              <button
                onClick={() => handleDelete(song.id)}
                className="p-1.5 rounded-lg text-white/20 hover:text-red-400 hover:bg-red-400/10 transition-all"
                title="Supprimer"
              >
                <Trash2 size={15} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}