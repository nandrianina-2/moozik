"use client";

import dynamic from "next/dynamic";
import { useKeyboardShortcuts } from "@/hooks/useKeyboardShortcuts";

const MiniPlayer = dynamic(
  () => import("./MiniPlayer").then((m) => m.MiniPlayer),
  { ssr: false }
);

function KeyboardHandler() {
  useKeyboardShortcuts();
  return null;
}

export function PlayerProvider({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      <KeyboardHandler />
      <MiniPlayer />
    </>
  );
}