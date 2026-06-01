"use client";

import { Sidebar } from "./Sidebar";
import { MobileNav } from "./MobileNav";
import { RightPanel } from "./RightPanel";
import { usePlayerStore } from "@/store/playerStore";
import { cn } from "@/lib/utils";

export function AppShell({ children }: { children: React.ReactNode }) {
  const { currentSong } = usePlayerStore();

  return (
    <div className="flex h-dvh bg-[#0a0a0a] text-white overflow-hidden">
      <Sidebar />

      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <div className={cn(
          "flex-1 overflow-y-auto",
          // Mobile : espace pour MiniPlayer + MobileNav
          currentSong ? "pb-[130px] md:pb-[72px]" : "pb-[65px] md:pb-0"
        )}>
          {children}
        </div>
      </main>

      <RightPanel />
      <MobileNav />
    </div>
  );
}