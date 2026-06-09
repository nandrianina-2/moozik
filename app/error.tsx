"use client";

import { useEffect } from "react";
import { Music2, RefreshCw } from "lucide-react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Global error:", error);
  }, [error]);

  return (
    <div className="min-h-dvh bg-[#0a0a0a] flex flex-col items-center justify-center text-center px-6">
      <div className="w-20 h-20 rounded-2xl bg-red-500/20 flex items-center justify-center mb-6">
        <Music2 size={36} className="text-red-400" />
      </div>
      <h1 className="text-2xl font-bold text-white mb-2">
        Quelque chose s'est mal passé
      </h1>
      <p className="text-sm text-white/40 mb-8 max-w-xs">
        {error.message || "Une erreur inattendue est survenue."}
      </p>
      <button
        onClick={reset}
        className="flex items-center gap-2 px-6 py-3 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-medium text-sm transition-colors"
      >
        <RefreshCw size={16} />
        Réessayer
      </button>
    </div>
  );
}