"use client";

import { CommentsSection } from "@/components/music/CommentsSection";
import { usePlayerStore } from "@/store/playerStore";

interface Props {
  songId: string;
}

export function CommentsPanel({ songId }: Props) {
  const { progress } = usePlayerStore();

  return (
    <CommentsSection
      songId={songId}
      currentTime={progress}
    />
  );
}