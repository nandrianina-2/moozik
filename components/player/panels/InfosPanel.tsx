"use client";

import { formatDuration, formatCount } from "@/lib/utils";
import type { Song } from "@/types";
import { Music2, Headphones, Heart, Calendar, Sparkles } from "lucide-react";
import { useState, useEffect } from "react";
import { SongRow } from "@/components/music/SongRow";

export function InfosPanel({ song }: { song: Song }) {
  const [similar, setSimilar] = useState<Song[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetch(`/api/recommendations/similar?songId=${song.id}&limit=5`)
      .then((r) => r.json())
      .then((d) => { setSimilar(d.songs ?? []); setLoading(false); });
  }, [song.id]);

  return (
    <div className="space-y-5">
      {/* Stats */}
      <div className="grid grid-cols-2 gap-3">
        {[
          { icon: Headphones, label: "Streams",  value: formatCount(song.streamCount) },
          { icon: Heart,      label: "Likes",    value: formatCount(song.likesCount)  },
          { icon: Music2,     label: "Durée",    value: formatDuration(song.duration) },
          { icon: Calendar,   label: "Sortie",   value: new Date(song.releaseDate).toLocaleDateString("fr-FR") },
        ].map(({ icon: Icon, label, value }) => (
          <div key={label} className="bg-white/5 rounded-xl p-3">
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

      {/* Sons similaires */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <Sparkles size={13} className="text-purple-400" />
          <p className="text-xs font-semibold text-white/40 uppercase tracking-wider">
            Sons similaires
          </p>
        </div>
        {loading ? (
          <div className="space-y-2">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex gap-2">
                <div className="w-10 h-10 rounded-md bg-white/5 animate-pulse flex-shrink-0" />
                <div className="flex-1 space-y-1.5">
                  <div className="h-3 bg-white/5 animate-pulse rounded w-2/3" />
                  <div className="h-2.5 bg-white/5 animate-pulse rounded w-1/2" />
                </div>
              </div>
            ))}
          </div>
        ) : similar.length === 0 ? (
          <p className="text-xs text-white/30">Aucun son similaire trouvé</p>
        ) : (
          <div className="flex flex-col gap-1">
            {similar.map((s, i) => (
              <SongRow
                key={s.id}
                song={s}
                queue={similar}
                index={i}
                showIndex={false}
              />
            ))}
          </div>
        )}
      </div>

    </div>
  );
}