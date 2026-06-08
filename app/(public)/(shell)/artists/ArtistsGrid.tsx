"use client";

import { useState, useDeferredValue } from "react";
import Image from "next/image";
import Link from "next/link";
import { Search } from "lucide-react";
import type { Artist } from "@/types";
import { cn } from "@/lib/utils";

export function ArtistsGrid({ artists }: { artists: Artist[] }) {
  const [query, setQuery] = useState("");
  const deferred = useDeferredValue(query);

  const filtered = deferred.trim()
    ? artists.filter(
        (a) =>
          a.name.toLowerCase().includes(deferred.toLowerCase()) ||
          a.genres.some((g) =>
            g.toLowerCase().includes(deferred.toLowerCase())
          )
      )
    : artists; // Tous les artistes quand pas de recherche

  return (
    <div>
      {/* Recherche */}
      <div className="relative mb-6">
        <Search
          size={16}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30"
        />
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={`Rechercher parmi ${artists.length} artistes...`}
          className="w-full h-10 pl-9 pr-4 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-white/20 text-sm focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-colors"
        />
      </div>

      <p className="text-xs text-white/30 mb-4">
        {filtered.length} artiste{filtered.length > 1 ? "s" : ""}
        {deferred && ` pour "${deferred}"`}
      </p>

      {filtered.length === 0 ? (
        <p className="text-white/30 text-sm text-center py-12">
          Aucun artiste trouvé
        </p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {filtered.map((artist) => (
            <Link
              key={artist.id}
              href={`/artists/${artist.id}`}
              className="flex flex-col items-center gap-3 p-4 rounded-2xl hover:bg-white/5 transition-all group"
            >
              <div className="relative w-full aspect-square rounded-full overflow-hidden bg-white/10 shadow-lg ring-2 ring-white/5 group-hover:ring-purple-500/30 transition-all">
                {artist.image ? (
                  <Image
                    src={artist.image}
                    alt={artist.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                    unoptimized
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-3xl font-bold text-white/20">
                    {artist.name[0]}
                  </div>
                )}
              </div>
              <div className="text-center w-full">
                <p className="text-sm font-semibold text-white truncate">
                  {artist.name}
                </p>
                {artist.isVerified && (
                  <p className="text-xs text-purple-400 mt-0.5">✓ Vérifié</p>
                )}
                {artist.genres.length > 0 && (
                  <p className="text-xs text-white/30 truncate mt-0.5">
                    {artist.genres.slice(0, 2).join(" · ")}
                  </p>
                )}
                <p className="text-xs text-white/20 mt-1">
                  {artist.followers.toLocaleString()} abonnés
                </p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}