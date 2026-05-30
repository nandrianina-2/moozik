"use client";

import { SessionProvider } from "next-auth/react";
import { PlayerProvider } from "./player/PlayerProvider";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <PlayerProvider>
        {children}
      </PlayerProvider>
    </SessionProvider>
  );
}