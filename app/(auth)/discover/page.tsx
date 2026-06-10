"use client";

import { useState, useEffect, useCallback } from "react";
import { Header } from "@/components/layout/Header";
import { SongRow } from "@/components/music/SongRow";
import { usePlayerStore } from "@/store/playerStore";
import { Button } from "@/components/ui/Button";
import {
  Sparkles, RefreshCw, Play,
  Music2, TrendingUp, Compass,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { Song } from "@/types";

type Mode = "forYou" | "trending" | "discovery";

interface RecoSong extends Song {
  reason: string;
}

export default function DiscoverPage() {
  const [songs, setSongs]       = useState<RecoSong[]>([]);
  const [loading, setLoading]   = useState(true);
  const [mode, setMode]         = useState<Mode>("forYou");
  const [topGenres, setTopGenres] = useState<string[]>([]);
  const [hasHistory, setHasHistory] = useState(false);
  const [page, setPage]         = useState(0);
  const { playSong }            = usePlayerStore();

  const fetchReco = useCallback(async (currentMode: Mode, reset = false) => {
    setLoading(true);

    const exclude = reset ? [] : songs.map((s) => s.id);
    const limit   = 20;

    let url = `/api/recommendations?limit=${limit}`;
    if (exclude.length > 0) url += `&exclude=${exclude.join(",")}`;
    if (currentMode === "trending")  url += "&mode=trending";
    if (currentMode === "discovery") url += "&mode=discovery";

    const res  = await fetch(url);
    const data = await res.json();

    if (reset) {
      setSongs(data.songs ?? []);
    } else {
      setSongs((prev) => {
        const ids = new Set(prev.map((s) => s.id));
        const next = (data.songs ?? []).filter((s: RecoSong) => !ids.has(s.id));
        return [...prev, ...next];
      });
    }

    setTopGenres(data.topGenres ?? []);
    setHasHistory(data.hasHistory ?? false);
    setLoading(false);
  }, [songs]);

  useEffect(() => {
    fetchReco(mode, true);
  }, [mode]);

  function handlePlayAll() {
    if (songs.length > 0) playSong(songs[0], songs);
  }

  function handleShuffle() {
    const shuffled = [...songs].sort(() => Math.random() - 0.5);
    if (shuffled.length > 0) playSong(shuffled[0], shuffled);
  }

  const MODES: { id: Mode; icon: typeof Sparkles; label: string; desc: string }[] = [
    {
      id:    "forYou",
      icon:  Sparkles,
      label: "Pour toi",
      desc:  "Basé sur tes écoutes",
    },
    {
      id:    "trending",
      icon:  TrendingUp,
      label: "Tendances",
      desc:  "Les plus écoutés",
    },
    {
      id:    "discovery",
      icon:  Compass,
      label: "Découverte",
      desc:  "Sons peu connus",
    },
  ];

  return (
    <div className="pb-32">
      <Header title="Découverte" />

      <div className="px-4 md:px-6 py-6 space-y-6">

        {/* Hero */}
        <div className="rounded-2xl bg-gradient-to-br from-purple-900/40 to-pink-900/20 border border-white/5 p-5">
          <div className="flex items-start gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-purple-600/30 flex items-center justify-center flex-shrink-0">
              <Sparkles size={20} className="text-purple-400" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">
                {hasHistory ? "Recommandations personnalisées" : "Découvre Moozik"}
              </h2>
              {topGenres.length > 0 ? (
                <p className="text-xs text-white/40 mt-0.5">
                  Tes genres : {topGenres.slice(0, 4).join(" · ")}
                </p>
              ) : (
                <p className="text-xs text-white/40 mt-0.5">
                  Écoute plus de sons pour des recommandations personnalisées
                </p>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <Button variant="primary" size="sm" onClick={handlePlayAll}>
              <Play size={14} fill="white" /> Tout lire
            </Button>
            <Button variant="secondary" size="sm" onClick={handleShuffle}>
              Mélanger
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => fetchReco(mode, true)}
              loading={loading}
            >
              <RefreshCw size={14} />
              Actualiser
            </Button>
          </div>
        </div>

        {/* Modes */}
        <div className="flex gap-1 bg-white/5 rounded-xl p-1">
          {MODES.map(({ id, icon: Icon, label, desc }) => (
            <button
              key={id}
              onClick={() => setMode(id)}
              className={cn(
                "flex-1 flex flex-col items-center gap-1 py-3 rounded-lg transition-all",
                mode === id
                  ? "bg-white/10 text-white"
                  : "text-white/40 hover:text-white/70"
              )}
            >
              <Icon size={16} />
              <span className="text-xs font-medium">{label}</span>
              <span className="text-[10px] text-white/30 hidden sm:block">{desc}</span>
            </button>
          ))}
        </div>

        {/* Genres chips */}
        {topGenres.length > 0 && mode === "forYou" && (
          <div className="flex gap-2 flex-wrap">
            <span className="text-xs text-white/30 self-center">Tes genres :</span>
            {topGenres.map((g) => (
              <span
                key={g}
                className="px-2.5 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-xs text-purple-400"
              >
                {g}
              </span>
            ))}
          </div>
        )}

        {/* Liste songs */}
        {loading && songs.length === 0 ? (
          <div className="space-y-2">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="flex items-center gap-3 px-3 py-2">
                <div className="w-10 h-10 rounded-md bg-white/5 animate-pulse flex-shrink-0" />
                <div className="flex-1 space-y-1.5">
                  <div className="h-3.5 bg-white/5 animate-pulse rounded w-1/3" />
                  <div className="h-3 bg-white/5 animate-pulse rounded w-1/4" />
                </div>
              </div>
            ))}
          </div>
        ) : songs.length === 0 ? (
          <div className="flex flex-col items-center gap-4 py-16 text-center">
            <div className="w-14 h-14 rounded-full bg-white/5 flex items-center justify-center">
              <Music2 size={24} className="text-white/20" />
            </div>
            <p className="text-white/40 text-sm">
              Aucune recommandation — écoute des sons pour commencer
            </p>
          </div>
        ) : (
          <>
            <div className="flex flex-col gap-1">
              {songs.map((song, i) => (
                <div key={song.id} className="relative group">
                  <SongRow
                    song={song}
                    queue={songs}
                    index={i}
                    showIndex={false}
                  />
                  {/* Badge raison */}
                  <span className={cn(
                    "absolute right-20 top-1/2 -translate-y-1/2 text-[10px] px-1.5 py-0.5 rounded-full",
                    "opacity-0 group-hover:opacity-100 transition-opacity hidden md:block",
                    song.reason === "artist"    && "bg-purple-500/20 text-purple-400",
                    song.reason === "genre"     && "bg-blue-500/20 text-blue-400",
                    song.reason === "trending"  && "bg-orange-500/20 text-orange-400",
                    song.reason === "discovery" && "bg-green-500/20 text-green-400",
                  )}>
                    {song.reason === "artist"    && "Artiste suivi"}
                    {song.reason === "genre"     && "Ton genre"}
                    {song.reason === "trending"  && "Tendance"}
                    {song.reason === "discovery" && "Découverte"}
                  </span>
                </div>
              ))}
            </div>

            {/* Charger plus */}
            <Button
              variant="ghost"
              className="w-full"
              onClick={() => fetchReco(mode, false)}
              loading={loading}
            >
              Charger plus de sons
            </Button>
          </>
        )}

      </div>
    </div>
  );
}