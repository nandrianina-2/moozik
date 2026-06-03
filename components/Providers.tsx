"use client";

import { SessionProvider } from "next-auth/react";
import { PlayerProvider } from "./player/PlayerProvider";
import { FloatingInstallButton } from "./ui/FloatingInstallButton";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <PlayerProvider>
        {children}
        <FloatingInstallButton />
      </PlayerProvider>
    </SessionProvider>
  );
}