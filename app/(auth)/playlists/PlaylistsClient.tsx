"use client";

import { useState, useEffect } from "react";
import { Header } from "@/components/layout/Header";
import { Button } from "@/components/ui/Button";
import { Plus, ListMusic, Trash2, Lock, Globe } from "lucide-react";
import { CreatePlaylistModal } from "@/components/modals/CreatePlaylistModal";
import Link from "next/link";
import { formatCount } from "@/lib/utils";

interface Playlist {
  id: string;
  name: string;
  description?: string;
  isPublic: boolean;
  songs: any[];
  createdAt: string;
}

export default function PlaylistsClient() {
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  async function fetchPlaylists() {
    const res = await fetch("/api/playlists");
    const data = await res.json();
    setPlaylists(data.playlists ?? []);
    setLoading(false);
  }

  useEffect(() => { fetchPlaylists(); }, []);

  async function handleDelete(id: string) {
    if (!confirm("Supprimer cette playlist ?")) return;
    await fetch(`/api/playlists/${id}`, { method: "DELETE" });
    setPlaylists((prev) => prev.filter((p) => p.id !== id));
  }

  return (
    <div className="pb-32">
      <Header title="Mes playlists" />

      <div className="px-4 md:px-6 py-6">
        <div className="flex items-center justify-between mb-6">
          <p className="text-sm text-white/40">
            {playlists.length} playlist{playlists.length !== 1 ? "s" : ""}
          </p>
          <Button
            variant="primary"
            size="sm"
            onClick={() => setShowModal(true)}
          >
            <Plus size={15} /> Nouvelle playlist
          </Button>
        </div>

        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-16 rounded-xl bg-white/5 animate-pulse" />
            ))}
          </div>
        ) : playlists.length === 0 ? (
          <div className="flex flex-col items-center gap-4 py-20 text-center">
            <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center">
              <ListMusic size={28} className="text-white/20" />
            </div>
            <div>
              <p className="text-white/50 text-sm font-medium">
                Aucune playlist
              </p>
              <p className="text-white/30 text-xs mt-1">
                Crée ta première playlist
              </p>
            </div>
            <Button
              variant="primary"
              size="sm"
              onClick={() => setShowModal(true)}
            >
              <Plus size={15} /> Créer une playlist
            </Button>
          </div>
        ) : (
          <div className="space-y-2">
            {playlists.map((playlist) => (
              <div
                key={playlist.id}
                className="flex items-center gap-3 p-3 rounded-xl bg-white/5 hover:bg-white/8 transition-colors group"
              >
                <div className="w-12 h-12 rounded-lg bg-purple-600/20 flex items-center justify-center flex-shrink-0">
                  <ListMusic size={20} className="text-purple-400" />
                </div>

                <Link
                  href={`/playlists/${playlist.id}`}
                  className="flex-1 min-w-0"
                >
                  <p className="text-sm font-medium text-white truncate">
                    {playlist.name}
                  </p>
                  <div className="flex items-center gap-2 mt-0.5">
                    {playlist.isPublic ? (
                      <Globe size={11} className="text-white/30" />
                    ) : (
                      <Lock size={11} className="text-white/30" />
                    )}
                    <p className="text-xs text-white/30">
                      {formatCount(playlist.songs.length)} son{playlist.songs.length !== 1 ? "s" : ""}
                    </p>
                  </div>
                </Link>

                <button
                  onClick={() => handleDelete(playlist.id)}
                  className="opacity-0 group-hover:opacity-100 p-2 rounded-lg text-white/30 hover:text-red-400 transition-all"
                >
                  <Trash2 size={15} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {showModal && (
        <CreatePlaylistModal
          onClose={() => setShowModal(false)}
          onCreate={(playlist) => {
            setPlaylists((prev) => [playlist, ...prev]);
            setShowModal(false);
          }}
        />
      )}
    </div>
  );
}