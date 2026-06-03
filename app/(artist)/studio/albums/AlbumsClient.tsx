"use client";

import { useState } from "react";
import {
  Plus, Disc3, Trash2, Eye, EyeOff,
  X, Check, GripVertical, ChevronDown,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { cn, formatDuration } from "@/lib/utils";
import Image from "next/image";

interface AlbumRow {
  id: string;
  title: string;
  coverUrl?: string;
  songsCount: number;
  releaseDate: string;
  isPublished: boolean;
}

interface SongOption {
  id: string;
  title: string;
  duration: number;
  coverUrl?: string;
}

interface Props {
  albums: AlbumRow[];
  songs: SongOption[];
  artistId: string;
}

export function AlbumsClient({ albums: initial, songs, artistId }: Props) {
  const [albums, setAlbums] = useState(initial);
  const [showCreate, setShowCreate] = useState(false);
  const [title, setTitle] = useState("");
  const [selectedSongs, setSelectedSongs] = useState<string[]>([]);
  const [releaseDate, setReleaseDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [creating, setCreating] = useState(false);

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim() || selectedSongs.length === 0) return;
    setCreating(true);

    const res = await fetch("/api/albums", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, songs: selectedSongs, releaseDate }),
    });

    const data = await res.json();
    setCreating(false);

    if (res.ok) {
      setAlbums((prev) => [
        {
          id:          data.id,
          title:       title.trim(),
          songsCount:  selectedSongs.length,
          releaseDate: new Date(releaseDate).toLocaleDateString("fr-FR"),
          isPublished: true,
        },
        ...prev,
      ]);
      setTitle("");
      setSelectedSongs([]);
      setShowCreate(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Supprimer cet album ?")) return;
    await fetch(`/api/albums/${id}`, { method: "DELETE" });
    setAlbums((prev) => prev.filter((a) => a.id !== id));
  }

  async function handleTogglePublish(id: string, current: boolean) {
    await fetch(`/api/albums/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isPublished: !current }),
    });
    setAlbums((prev) =>
      prev.map((a) => a.id === id ? { ...a, isPublished: !current } : a)
    );
  }

  function toggleSong(id: string) {
    setSelectedSongs((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]
    );
  }

  return (
    <div className="px-4 md:px-6 py-6 space-y-6">

      {/* Header */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-white/40">
          {albums.length} album{albums.length > 1 ? "s" : ""}
        </p>
        <Button
          variant="primary"
          size="sm"
          onClick={() => setShowCreate((v) => !v)}
        >
          <Plus size={15} />
          Nouvel album
        </Button>
      </div>

      {/* Formulaire création */}
      {showCreate && (
        <div className="bg-white/5 rounded-2xl border border-white/10 p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-white">Créer un album</h3>
            <button
              onClick={() => setShowCreate(false)}
              className="text-white/30 hover:text-white transition-colors"
            >
              <X size={16} />
            </button>
          </div>

          <form onSubmit={handleCreate} className="space-y-4">
            {/* Titre */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-white/50 uppercase tracking-wider">
                Titre <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                maxLength={100}
                placeholder="Titre de l'album"
                className="w-full h-10 px-3 rounded-lg bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-purple-500 transition-colors"
              />
            </div>

            {/* Date */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-white/50 uppercase tracking-wider">
                Date de sortie
              </label>
              <input
                type="date"
                value={releaseDate}
                onChange={(e) => setReleaseDate(e.target.value)}
                className="w-full h-10 px-3 rounded-lg bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-purple-500 transition-colors [color-scheme:dark]"
              />
            </div>

            {/* Sélection sons */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-white/50 uppercase tracking-wider">
                Sons <span className="text-red-400">*</span>
                {selectedSongs.length > 0 && (
                  <span className="ml-2 text-purple-400 normal-case font-normal">
                    {selectedSongs.length} sélectionné{selectedSongs.length > 1 ? "s" : ""}
                  </span>
                )}
              </label>

              <div className="max-h-48 overflow-y-auto space-y-1 rounded-xl bg-white/3 border border-white/5 p-2">
                {songs.length === 0 ? (
                  <p className="text-white/30 text-xs text-center py-4">
                    Aucun son disponible — uploade d'abord des sons
                  </p>
                ) : (
                  songs.map((song) => {
                    const selected = selectedSongs.includes(song.id);
                    const order = selectedSongs.indexOf(song.id) + 1;

                    return (
                      <button
                        key={song.id}
                        type="button"
                        onClick={() => toggleSong(song.id)}
                        className={cn(
                          "flex items-center gap-3 w-full px-3 py-2 rounded-lg transition-all text-left",
                          selected
                            ? "bg-purple-500/10 border border-purple-500/20"
                            : "hover:bg-white/5"
                        )}
                      >
                        <div className={cn(
                          "w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 text-[10px] font-bold transition-colors",
                          selected
                            ? "bg-purple-600 border-purple-600 text-white"
                            : "border-white/20"
                        )}>
                          {selected ? order : ""}
                        </div>
                        <div className="w-8 h-8 rounded-md overflow-hidden bg-white/10 flex-shrink-0">
                          {song.coverUrl ? (
                            <Image
                              src={song.coverUrl}
                              alt={song.title}
                              width={32}
                              height={32}
                              className="object-cover w-full h-full"
                            />
                          ) : (
                            <div className="w-full h-full bg-white/10" />
                          )}
                        </div>
                        <p className="text-sm text-white flex-1 truncate">
                          {song.title}
                        </p>
                        <span className="text-xs text-white/30 flex-shrink-0">
                          {formatDuration(song.duration)}
                        </span>
                      </button>
                    );
                  })
                )}
              </div>
              <p className="text-xs text-white/25 pl-1">
                L'ordre de sélection = ordre dans l'album
              </p>
            </div>

            <div className="flex gap-3">
              <Button
                type="button"
                variant="ghost"
                className="flex-1"
                onClick={() => setShowCreate(false)}
              >
                Annuler
              </Button>
              <Button
                type="submit"
                variant="primary"
                className="flex-1"
                loading={creating}
                disabled={!title.trim() || selectedSongs.length === 0}
              >
                Créer l'album
              </Button>
            </div>
          </form>
        </div>
      )}

      {/* Liste albums */}
      {albums.length === 0 ? (
        <div className="flex flex-col items-center gap-4 py-16 text-center">
          <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center">
            <Disc3 size={28} className="text-white/20" />
          </div>
          <div>
            <p className="text-white/50 text-sm font-medium">Aucun album</p>
            <p className="text-white/30 text-xs mt-1">
              Crée ton premier album pour regrouper tes sons
            </p>
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          {albums.map((album) => (
            <div
              key={album.id}
              className={cn(
                "flex items-center gap-3 p-3 rounded-xl border transition-all",
                album.isPublished
                  ? "bg-white/5 border-white/5"
                  : "bg-white/3 border-white/5 opacity-60"
              )}
            >
              <div className="w-12 h-12 rounded-lg bg-purple-600/20 flex items-center justify-center flex-shrink-0">
                <Disc3 size={20} className="text-purple-400" />
              </div>

              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-white truncate">
                  {album.title}
                </p>
                <p className="text-xs text-white/40">
                  {album.songsCount} son{album.songsCount > 1 ? "s" : ""}
                  {" · "}
                  {album.releaseDate}
                </p>
              </div>

              <span className={cn(
                "text-[10px] px-2 py-0.5 rounded-full flex-shrink-0",
                album.isPublished
                  ? "bg-green-500/20 text-green-400"
                  : "bg-white/10 text-white/30"
              )}>
                {album.isPublished ? "Publié" : "Masqué"}
              </span>

              <div className="flex items-center gap-1 flex-shrink-0">
                <button
                  onClick={() => handleTogglePublish(album.id, album.isPublished)}
                  className={cn(
                    "p-1.5 rounded-lg transition-all",
                    album.isPublished
                      ? "text-green-400 hover:text-green-300 bg-green-400/10"
                      : "text-white/30 hover:text-white/60"
                  )}
                  title={album.isPublished ? "Dépublier" : "Publier"}
                >
                  {album.isPublished ? <Eye size={15} /> : <EyeOff size={15} />}
                </button>
                <button
                  onClick={() => handleDelete(album.id)}
                  className="p-1.5 rounded-lg text-white/20 hover:text-red-400 hover:bg-red-400/10 transition-all"
                  title="Supprimer"
                >
                  <Trash2 size={15} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}