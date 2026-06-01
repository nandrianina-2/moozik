"use client";

import { useState, useEffect } from "react";
import { X, ListMusic, Plus, Check, Globe, Lock } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";
import type { Song } from "@/types";

interface Playlist {
  id: string;
  name: string;
  songs: any[];
  isPublic: boolean;
}

interface Props {
  song: Song;
  onClose: () => void;
}

export function AddToPlaylistModal({ song, onClose }: Props) {
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState<string | null>(null);
  const [added, setAdded] = useState<Set<string>>(new Set());
  const [creating, setCreating] = useState(false);
  const [newName, setNewName] = useState("");
  const [isPublic, setIsPublic] = useState(false);
  const [createLoading, setCreateLoading] = useState(false);

  useEffect(() => {
    fetch("/api/playlists")
      .then((r) => r.json())
      .then((d) => {
        setPlaylists(d.playlists ?? []);
        setLoading(false);
      });
  }, []);

  async function handleAdd(playlistId: string) {
    setAdding(playlistId);
    const res = await fetch(`/api/playlists/${playlistId}/songs`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ songId: song.id }),
    });
    setAdding(null);
    if (res.ok) {
      setAdded((prev) => new Set(prev).add(playlistId));
    }
  }

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    if (!newName.trim()) return;
    setCreateLoading(true);

    const res = await fetch("/api/playlists", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: newName.trim(), isPublic }),
    });

    const data = await res.json();
    setCreateLoading(false);

    if (res.ok) {
      setPlaylists((prev) => [data, ...prev]);
      setNewName("");
      setIsPublic(false);
      setCreating(false);
      handleAdd(data.id);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      />

      <div className="relative w-full sm:max-w-sm bg-[#1c1c1c] rounded-t-2xl sm:rounded-2xl border border-white/10 shadow-2xl">
        {/* Handle mobile */}
        <div className="flex justify-center pt-3 pb-1 sm:hidden">
          <div className="w-10 h-1 rounded-full bg-white/20" />
        </div>

        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-white/5">
          <div className="min-w-0">
            <h2 className="text-sm font-semibold text-white">
              Ajouter à une playlist
            </h2>
            <p className="text-xs text-white/40 truncate mt-0.5">
              {song.title} — {song.artist.name}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-white/30 hover:text-white hover:bg-white/10 transition-all ml-2 flex-shrink-0"
          >
            <X size={16} />
          </button>
        </div>

        {/* Créer nouvelle playlist */}
        <div className="px-4 py-3 border-b border-white/5">
          {creating ? (
            <form onSubmit={handleCreate} className="space-y-3">
              <input
                autoFocus
                type="text"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                placeholder="Nom de la playlist"
                maxLength={100}
                className="w-full h-9 px-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder:text-white/20 text-sm focus:outline-none focus:border-purple-500 transition-colors"
              />

              {/* Toggle public/privé */}
              <button
                type="button"
                onClick={() => setIsPublic((prev) => !prev)}
                className={cn(
                  "flex items-center justify-between w-full px-3 py-2 rounded-lg border transition-all",
                  isPublic
                    ? "bg-purple-500/10 border-purple-500/30"
                    : "bg-white/5 border-white/10"
                )}
              >
                <div className="flex items-center gap-2">
                  {isPublic ? (
                    <Globe size={14} className="text-purple-400" />
                  ) : (
                    <Lock size={14} className="text-white/40" />
                  )}
                  <span className={cn(
                    "text-sm font-medium",
                    isPublic ? "text-purple-400" : "text-white/50"
                  )}>
                    {isPublic ? "Publique" : "Privée"}
                  </span>
                </div>
                <div className={cn(
                  "relative w-9 h-5 rounded-full transition-colors",
                  isPublic ? "bg-purple-600" : "bg-white/20"
                )}>
                  <span className={cn(
                    "absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white transition-transform",
                    isPublic ? "translate-x-4" : "translate-x-0"
                  )} />
                </div>
              </button>

              <p className="text-xs text-white/30 px-1">
                {isPublic
                  ? "Visible par tous les utilisateurs"
                  : "Visible uniquement par toi"}
              </p>

              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="flex-1"
                  onClick={() => { setCreating(false); setIsPublic(false); }}
                >
                  Annuler
                </Button>
                <Button
                  type="submit"
                  variant="primary"
                  size="sm"
                  className="flex-1"
                  loading={createLoading}
                  disabled={!newName.trim()}
                >
                  Créer et ajouter
                </Button>
              </div>
            </form>
          ) : (
            <button
              onClick={() => setCreating(true)}
              className="flex items-center gap-2.5 w-full text-left py-1.5 text-sm text-purple-400 hover:text-purple-300 transition-colors"
            >
              <div className="w-9 h-9 rounded-lg bg-purple-500/10 flex items-center justify-center flex-shrink-0">
                <Plus size={16} />
              </div>
              Nouvelle playlist
            </button>
          )}
        </div>

        {/* Liste playlists */}
        <div className="max-h-64 overflow-y-auto">
          {loading ? (
            <div className="space-y-2 p-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-12 rounded-xl bg-white/5 animate-pulse" />
              ))}
            </div>
          ) : playlists.length === 0 ? (
            <p className="text-white/30 text-sm text-center py-8">
              Aucune playlist — crée-en une ci-dessus
            </p>
          ) : (
            <div className="p-2">
              {playlists.map((playlist) => {
                const isAdded = added.has(playlist.id);
                const isAdding = adding === playlist.id;

                return (
                  <button
                    key={playlist.id}
                    onClick={() => !isAdded && handleAdd(playlist.id)}
                    disabled={isAdded || isAdding}
                    className={cn(
                      "flex items-center gap-3 w-full px-3 py-2.5 rounded-xl transition-all text-left",
                      isAdded
                        ? "opacity-50 cursor-default"
                        : "hover:bg-white/5 active:scale-[0.98]"
                    )}
                  >
                    {/* Icône */}
                    <div className="w-9 h-9 rounded-lg bg-purple-600/20 flex items-center justify-center flex-shrink-0">
                      <ListMusic size={16} className="text-purple-400" />
                    </div>

                    {/* Nom + visibilité */}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-white truncate">
                        {playlist.name}
                      </p>
                      <div className="flex items-center gap-1.5 mt-0.5">
                        {playlist.isPublic ? (
                          <Globe size={10} className="text-white/25" />
                        ) : (
                          <Lock size={10} className="text-white/25" />
                        )}
                        <p className="text-xs text-white/30">
                          {playlist.isPublic ? "Publique" : "Privée"} ·{" "}
                          {playlist.songs.length} son{playlist.songs.length !== 1 ? "s" : ""}
                        </p>
                      </div>
                    </div>

                    {/* État */}
                    <div className="flex-shrink-0 w-5 flex items-center justify-center">
                      {isAdding ? (
                        <span className="w-4 h-4 border-2 border-purple-400/30 border-t-purple-400 rounded-full animate-spin block" />
                      ) : isAdded ? (
                        <Check size={16} className="text-green-400" />
                      ) : null}
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-4 py-3 border-t border-white/5">
          <Button variant="ghost" className="w-full" onClick={onClose}>
            Fermer
          </Button>
        </div>
      </div>
    </div>
  );
}