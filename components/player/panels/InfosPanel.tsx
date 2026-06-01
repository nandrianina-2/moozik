"use client";

import { formatDuration, formatCount } from "@/lib/utils";
import type { Song } from "@/types";
import { Music2, Headphones, Heart, Calendar } from "lucide-react";

export function InfosPanel({ song }: { song: Song }) {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        {[
          { icon: Headphones, label: "Streams",  value: formatCount(song.streamCount) },
          { icon: Heart,      label: "Likes",    value: formatCount(song.likesCount) },
          { icon: Music2,     label: "Durée",    value: formatDuration(song.duration) },
          { icon: Calendar,   label: "Sortie",   value: new Date(song.releaseDate).toLocaleDateString("fr-FR") },
        ].map(({ icon: Icon, label, value }) => (
          <div
            key={label}
            className="bg-white/5 rounded-xl p-3"
          >
            <Icon size={14} className="text-purple-400 mb-1.5" />
            <p className="text-base font-bold text-white">{value}</p>
            <p className="text-[11px] text-white/40">{label}</p>
          </div>
        ))}
      </div>

      {/* Genres */}
      {song.genres.length > 0 && (
        <div>
          <p className="text-xs text-white/40 mb-2">Genres</p>
          <div className="flex flex-wrap gap-2">
            {song.genres.map((g) => (
              <span
                key={g}
                className="px-2.5 py-1 rounded-full bg-white/5 border border-white/10 text-xs text-white/50"
              >
                {g}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Paroles */}
      {song.lyrics && (
        <div>
          <p className="text-xs text-white/40 mb-2">Paroles</p>
          <p className="text-sm text-white/60 leading-relaxed whitespace-pre-line">
            {song.lyrics}
          </p>
        </div>
      )}
    </div>
  );
}