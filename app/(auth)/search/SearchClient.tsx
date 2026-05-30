"use client";

import { useState, useDeferredValue } from "react";
import { Search } from "lucide-react";
import { SongRow } from "@/components/music/SongRow";
import Image from "next/image";
import Link from "next/link";
import type { Song, Artist } from "@/types";

interface Props {
  initialSongs: Song[];
  initialArtists: Artist[];
}

export function SearchClient({ initialSongs, initialArtists }: Props) {
  const [query, setQuery] = useState("");
  const deferred = useDeferredValue(query);

  const q = deferred.toLowerCase().trim();

  const filteredSongs = q
    ? initialSongs.filter(
        (s) =>
          s.title.toLowerCase().includes(q) ||
          s.artist.name.toLowerCase().includes(q) ||
          s.genres.some((g) => g.toLowerCase().includes(q))
      )
    : initialSongs;

  const filteredArtists = q
    ? initialArtists.filter(
        (a) =>
          a.name.toLowerCase().includes(q) ||
          a.genres.some((g) => g.toLowerCase().includes(q))
      )
    : initialArtists;

  return (
    <div className="space-y-8">
      {/* Barre de recherche */}
      <div className="relative">
        <Search
          size={18}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30"
        />
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Sons, artistes, genres..."
          autoFocus
          className="w-full h-11 pl-10 pr-4 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-white/20 text-sm focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-colors"
        />
      </div>

      {/* Artistes */}
      {filteredArtists.length > 0 && (
        <section>
          <h2 className="text-sm font-semibold text-white/50 uppercase tracking-wider mb-4">
            Artistes
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
            {filteredArtists.slice(0, 6).map((artist) => (
              <Link
                key={artist.id}
                href={`/artists/${artist.id}`}
                className="flex flex-col items-center gap-2 p-3 rounded-xl hover:bg-white/5 transition-colors group"
              >
                <div className="w-14 h-14 rounded-full overflow-hidden bg-white/10">
                  {artist.image ? (
                    <Image
                      src={artist.image}
                      alt={artist.name}
                      width={56}
                      height={56}
                      className="object-cover w-full h-full"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-white/20 font-bold">
                      {artist.name[0]}
                    </div>
                  )}
                </div>
                <p className="text-xs font-medium text-white truncate w-full text-center">
                  {artist.name}
                </p>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Sons */}
      <section>
        <h2 className="text-sm font-semibold text-white/50 uppercase tracking-wider mb-4">
          Sons {filteredSongs.length > 0 && `(${filteredSongs.length})`}
        </h2>
        {filteredSongs.length === 0 ? (
          <p className="text-white/30 text-sm py-8 text-center">
            Aucun résultat pour &quot;{query}&quot;
          </p>
        ) : (
          <div className="flex flex-col gap-1">
            {filteredSongs.map((song, i) => (
              <SongRow
                key={song.id}
                song={song}
                queue={filteredSongs}
                index={i}
                showIndex={false}
              />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}