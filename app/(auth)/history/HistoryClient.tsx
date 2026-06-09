"use client";

import { useState, useEffect } from "react";
import { Header } from "@/components/layout/Header";
import { SongRow } from "@/components/music/SongRow";
import { Button } from "@/components/ui/Button";
import { History, Trash2 } from "lucide-react";
import type { Song } from "@/types";
import { formatDuration } from "@/lib/utils";

interface HistoryItem {
  historyId: string;
  playedAt: string;
  song: Song;
}

function groupByDate(items: HistoryItem[]) {
  const groups: Record<string, HistoryItem[]> = {};
  for (const item of items) {
    const date = new Date(item.playedAt);
    const today = new Date();
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);

    let label: string;
    if (date.toDateString() === today.toDateString()) {
      label = "Aujourd'hui";
    } else if (date.toDateString() === yesterday.toDateString()) {
      label = "Hier";
    } else {
      label = date.toLocaleDateString("fr-FR", {
        weekday: "long",
        day: "numeric",
        month: "long",
      });
    }

    if (!groups[label]) groups[label] = [];
    groups[label].push(item);
  }
  return groups;
}

export default function HistoryPage() {
  const [items, setItems] = useState<HistoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [clearing, setClearing] = useState(false);

  useEffect(() => {
    fetch("/api/users/history")
      .then((r) => r.json())
      .then((d) => {
        setItems(d.songs ?? []);
        setLoading(false);
      });
  }, []);

  async function handleClear() {
    if (!confirm("Effacer tout l'historique ?")) return;
    setClearing(true);
    await fetch("/api/users/history", { method: "DELETE" });
    setItems([]);
    setClearing(false);
  }

  const groups = groupByDate(items);
  const allSongs = items.map((i) => i.song);

  return (
    <div className="pb-32">
      <Header title="Historique" />

      <div className="px-4 md:px-6 py-6">

        {/* Header actions */}
        {items.length > 0 && (
          <div className="flex items-center justify-between mb-6">
            <p className="text-sm text-white/40">
              {items.length} son{items.length > 1 ? "s" : ""} écouté{items.length > 1 ? "s" : ""}
            </p>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleClear}
              loading={clearing}
              className="text-white/30 hover:text-red-400"
            >
              <Trash2 size={14} />
              Effacer
            </Button>
          </div>
        )}

        {loading ? (
          <div className="space-y-2">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="h-14 rounded-xl bg-white/5 animate-pulse" />
            ))}
          </div>
        ) : items.length === 0 ? (
          <div className="flex flex-col items-center gap-4 py-20 text-center">
            <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center">
              <History size={28} className="text-white/20" />
            </div>
            <div>
              <p className="text-white/50 text-sm font-medium">
                Aucun historique
              </p>
              <p className="text-white/30 text-xs mt-1">
                Les sons que tu écoutes apparaîtront ici
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {Object.entries(groups).map(([date, dateItems]) => (
              <section key={date}>
                <h2 className="text-xs font-semibold text-white/30 uppercase tracking-wider mb-3 capitalize">
                  {date}
                </h2>
                <div className="flex flex-col gap-1">
                  {dateItems.map((item) => (
                    <div key={item.historyId} className="flex items-center gap-2">
                      <div className="flex-1 min-w-0">
                        <SongRow
                          song={item.song}
                          queue={allSongs}
                          showIndex={false}
                        />
                      </div>
                      <span className="text-[10px] text-white/20 flex-shrink-0 pr-2">
                        {new Date(item.playedAt).toLocaleTimeString("fr-FR", {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                    </div>
                  ))}
                </div>
              </section>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}