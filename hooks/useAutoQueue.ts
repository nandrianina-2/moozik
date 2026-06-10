"use client";

import { useEffect, useRef } from "react";
import { usePlayerStore } from "@/store/playerStore";

export function useAutoQueue() {
  const { queue, currentSong, addToQueue } = usePlayerStore();
  const loading = useRef(false);

  useEffect(() => {
    // Si la queue est presque vide (≤ 2 sons) et qu'on écoute quelque chose
    if (!currentSong || queue.length > 2 || loading.current) return;

    loading.current = true;

    const exclude = [
      currentSong.id,
      ...queue.map((s) => s.id),
    ].join(",");

    fetch(`/api/recommendations?limit=5&exclude=${exclude}`)
      .then((r) => r.json())
      .then((data) => {
        (data.songs ?? []).forEach((song: any) => addToQueue(song));
      })
      .catch(() => {})
      .finally(() => { loading.current = false; });
  }, [queue.length, currentSong?.id]);
}