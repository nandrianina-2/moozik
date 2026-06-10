"use client";

import dynamic from "next/dynamic";
import { useKeyboardShortcuts } from "@/hooks/useKeyboardShortcuts";
import { useAutoQueue }         from "@/hooks/useAutoQueue";

const MiniPlayer = dynamic(
  () => import("./MiniPlayer").then((m) => m.MiniPlayer),
  { ssr: false }
);

function PlayerHandlers() {
  useKeyboardShortcuts();
  useAutoQueue();
  return null;
}

export function PlayerProvider({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      <PlayerHandlers />
      <MiniPlayer />
    </>
  );
}