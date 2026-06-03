import Link from "next/link";
import { Music2, Home } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-dvh bg-[#0a0a0a] flex flex-col items-center justify-center text-center px-6">
      <div className="w-20 h-20 rounded-2xl bg-purple-600/20 flex items-center justify-center mb-6">
        <Music2 size={36} className="text-purple-400" />
      </div>
      <h1 className="text-6xl font-bold text-white mb-2">404</h1>
      <p className="text-lg text-white/50 mb-2">Page introuvable</p>
      <p className="text-sm text-white/30 mb-8 max-w-xs">
        Cette page n'existe pas ou a été supprimée.
      </p>
      <Link
        href="/dashboard"
        className="flex items-center gap-2 px-6 py-3 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-medium text-sm transition-colors"
      >
        <Home size={16} />
        Retour à l'accueil
      </Link>
    </div>
  );
}