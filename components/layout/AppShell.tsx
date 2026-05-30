"use client";

import { Sidebar } from "./Sidebar";
import { MobileNav } from "./MobileNav";
import { RightPanel } from "./RightPanel";

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-dvh bg-[#0a0a0a] text-white overflow-hidden">
      {/* Sidebar gauche — masquée sur mobile */}
      <Sidebar />

      {/* Zone centrale */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <div className="flex-1 overflow-y-auto pb-24 md:pb-0">
          {children}
        </div>
      </main>

      {/* Panel droit — masqué sur mobile et tablette */}
      <RightPanel />

      {/* Nav mobile — visible uniquement sur mobile */}
      <MobileNav />
    </div>
  );
}