"use client";

import { ListMusic } from "lucide-react";

export function RightPanel() {
  return (
    <aside className="hidden xl:flex w-72 flex-col border-l border-white/5 bg-[#0d0d0d] flex-shrink-0">
      <div className="flex items-center gap-2 px-4 py-5 border-b border-white/5">
        <ListMusic size={16} className="text-white/40" />
        <span className="text-sm font-medium text-white/60">File d'attente</span>
      </div>

      {/* Queue vide pour l'instant — rempli au sprint 3 */}
      <div className="flex-1 flex flex-col items-center justify-center gap-3 text-center px-6">
        <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center">
          <ListMusic size={20} className="text-white/20" />
        </div>
        <p className="text-sm text-white/30">
          Lance une piste pour voir la file d'attente
        </p>
      </div>
    </aside>
  );
}