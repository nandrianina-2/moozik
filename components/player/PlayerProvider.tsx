"use client";

import dynamic from "next/dynamic";

const MiniPlayer = dynamic(
  () => import("./MiniPlayer").then((m) => m.MiniPlayer),
  { ssr: false }
);

export function PlayerProvider({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      <MiniPlayer />
    </>
  );
}