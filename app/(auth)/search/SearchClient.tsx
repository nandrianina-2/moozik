"use client";

import { useState, useEffect, useCallback } from "react";
import { Search, Loader2 } from "lucide-react";
import { SongRow } from "@/components/music/SongRow";
import Image from "next/image";
import Link from "next/link";
import type { Song, Artist } from "@/types";
import { cn } from "@/lib/utils";

interface Playlist {
  id: string;
  name: string;
  songsCount: number;
}

interface SearchResults {
  songs: Song[];
  artists: Artist[];
  playlists: Playlist[];
}

interface Props {
  initialSongs: Song[];
  initialArtists: Artist[];
}

type Filter = "all" | "songs" | "artists" | "playlists";

export function SearchClient({ initialSongs, initialArtists }: Props) {
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<Filter>("all");
  const [results, setResults] = useState<SearchResults>({
    songs: initialSongs,
    artists: initialArtists,
    playlists: [],
  });
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  const search = useCallback(async (q: string, f: Filter) => {
    if (q.trim().length < 2) {
      setResults({ songs: initialSongs, artists: initialArtists, playlists: [] });
      setSearched(false);
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(
        `/api/search?q=${encodeURIComponent(q)}&type=${f}`
      );
      const data = await res.json();
      setResults(data);
      setSearched(true);
    } finally {
      setLoading(false);
    }
  }, [initialSongs, initialArtists]);

  // Debounce 300ms
  useEffect(() => {
    const timer = setTimeout(() => search(query, filter), 300);
    return () => clearTimeout(timer);
  }, [query, filter, search]);

  const totalResults =
    results.songs.length + results.artists.length + results.playlists.length;

  const filters: { id: Filter; label: string }[] = [
    { id: "all",       label: "Tout" },
    { id: "songs",     label: "Sons" },
    { id: "artists",   label: "Artistes" },
    { id: "playlists", label: "Playlists" },
  ];

  return (
    <div className="space-y-6">

      {/* Barre de recherche */}
      <div className="relative">
        {loading ? (
          <Loader2
            size={17}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-purple-400 animate-spin"
          />
        ) : (
          <Search
            size={17}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30"
          />
        )}
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Sons, artistes, playlists..."
          autoFocus
          className="w-full h-11 pl-10 pr-4 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-white/20 text-sm focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-colors"
        />
        {query && (
          <button
            onClick={() => setQuery("")}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60 transition-colors text-lg leading-none"
          >
            ×
          </button>
        )}
      </div>

      {/* Filtres */}
      <div className="flex gap-1 bg-white/5 rounded-xl p-1">
        {filters.map(({ id, label }) => (
          <button
            key={id}
            onClick={() => setFilter(id)}
            className={cn(
              "flex-1 py-2 rounded-lg text-xs font-medium transition-all",
              filter === id
                ? "bg-white/10 text-white"
                : "text-white/40 hover:text-white/70"
            )}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Résultats */}
      {searched && query.length >= 2 && (
        <p className="text-xs text-white/30">
          {totalResults === 0
            ? `Aucun résultat pour "${query}"`
            : `${totalResults} résultat${totalResults > 1 ? "s" : ""} pour "${query}"`}
        </p>
      )}

      {/* Artistes */}
      {(filter === "all" || filter === "artists") &&
        results.artists.length > 0 && (
          <section>
            <h2 className="text-xs font-semibold text-white/40 uppercase tracking-wider mb-3">
              Artistes
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
              {results.artists.map((artist) => (
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
                  <div className="text-center w-full">
                    <p className="text-xs font-medium text-white truncate">
                      {artist.name}
                    </p>
                    {artist.isVerified && (
                      <p className="text-[10px] text-purple-400">✓ Vérifié</p>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

      {/* Playlists */}
      {(filter === "all" || filter === "playlists") &&
        results.playlists.length > 0 && (
          <section>
            <h2 className="text-xs font-semibold text-white/40 uppercase tracking-wider mb-3">
              Playlists
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {results.playlists.map((p) => (
                <Link
                  key={p.id}
                  href={`/playlists/${p.id}`}
                  className="flex items-center gap-3 p-3 rounded-xl bg-white/5 hover:bg-white/8 transition-colors"
                >
                  <div className="w-10 h-10 rounded-lg bg-purple-600/20 flex items-center justify-center flex-shrink-0">
                    <Search size={15} className="text-purple-400" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-white truncate">
                      {p.name}
                    </p>
                    <p className="text-xs text-white/40">
                      {p.songsCount} son{p.songsCount > 1 ? "s" : ""}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

      {/* Sons */}
      {(filter === "all" || filter === "songs") &&
        results.songs.length > 0 && (
          <section>
            <h2 className="text-xs font-semibold text-white/40 uppercase tracking-wider mb-3">
              Sons
            </h2>
            <div className="flex flex-col gap-1">
              {results.songs.map((song, i) => (
                <SongRow
                  key={song.id}
                  song={song}
                  queue={results.songs}
                  index={i}
                  showIndex={false}
                />
              ))}
            </div>
          </section>
        )}

      {/* Vide */}
      {searched && totalResults === 0 && query.length >= 2 && (
        <div className="flex flex-col items-center gap-3 py-16 text-center">
          <div className="w-14 h-14 rounded-full bg-white/5 flex items-center justify-center">
            <Search size={22} className="text-white/20" />
          </div>
          <div>
            <p className="text-white/50 text-sm font-medium">
              Aucun résultat
            </p>
            <p className="text-white/30 text-xs mt-1">
              Essaie un autre mot-clé
            </p>
          </div>
        </div>
      )}

    </div>
  );
}