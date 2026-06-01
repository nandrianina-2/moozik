"use client";

import { useState } from "react";
import { Search, BadgeCheck, BadgeX } from "lucide-react";
import { formatCount, cn } from "@/lib/utils";

interface ArtistRow {
  id: string;
  name: string;
  slug: string;
  email: string;
  isVerified: boolean;
  followersCount: number;
  genres: string[];
}

export function ArtistsAdminClient({ artists }: { artists: ArtistRow[] }) {
  const [query, setQuery] = useState("");
  const [list, setList] = useState(artists);

  const filtered = list.filter(
    (a) =>
      a.name.toLowerCase().includes(query.toLowerCase()) ||
      a.email.toLowerCase().includes(query.toLowerCase())
  );

  async function handleToggleVerify(id: string, current: boolean) {
    await fetch(`/api/admin/artists/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isVerified: !current }),
    });
    setList((prev) =>
      prev.map((a) => (a.id === id ? { ...a, isVerified: !current } : a))
    );
  }

  return (
    <div className="px-4 md:px-6 py-6 space-y-4">
      <div className="relative">
        <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" />
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Rechercher un artiste..."
          className="w-full h-9 pl-9 pr-3 rounded-lg bg-white/5 border border-white/10 text-white text-sm placeholder:text-white/20 focus:outline-none focus:border-purple-500 transition-colors"
        />
      </div>

      <p className="text-xs text-white/30">{filtered.length} artistes</p>

      <div className="bg-white/3 rounded-xl border border-white/5 overflow-hidden">
        {filtered.map((artist) => (
          <div
            key={artist.id}
            className="flex items-center gap-3 px-4 py-3 border-b border-white/5 last:border-0 hover:bg-white/3 transition-colors"
          >
            <div className="w-9 h-9 rounded-full bg-purple-600/20 flex items-center justify-center flex-shrink-0 text-sm font-bold text-purple-400">
              {artist.name[0]?.toUpperCase()}
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <p className="text-sm font-medium text-white truncate">
                  {artist.name}
                </p>
                {artist.isVerified && (
                  <BadgeCheck size={14} className="text-purple-400 flex-shrink-0" />
                )}
              </div>
              <p className="text-xs text-white/40 truncate">{artist.email}</p>
            </div>

            <div className="hidden md:flex items-center gap-3 text-xs text-white/30">
              <span>{formatCount(artist.followersCount)} abonnés</span>
              {artist.genres.slice(0, 2).map((g) => (
                <span key={g} className="px-2 py-0.5 rounded-full bg-white/5 text-white/40">
                  {g}
                </span>
              ))}
            </div>

            <button
              onClick={() => handleToggleVerify(artist.id, artist.isVerified)}
              title={artist.isVerified ? "Retirer vérification" : "Vérifier"}
              className={cn(
                "p-1.5 rounded-lg transition-all",
                artist.isVerified
                  ? "text-purple-400 bg-purple-400/10 hover:text-purple-300"
                  : "text-white/20 hover:text-purple-400 hover:bg-purple-400/10"
              )}
            >
              {artist.isVerified
                ? <BadgeCheck size={16} />
                : <BadgeX size={16} />}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}