"use client";

import { useState, useEffect } from "react";
import { Download, X } from "lucide-react";
import { cn } from "@/lib/utils";

export function FloatingInstallButton() {
  const [prompt, setPrompt] = useState<any>(null);
  const [visible, setVisible] = useState(false);
  const [installed, setInstalled] = useState(false);

  useEffect(() => {
    function handlePrompt(e: Event) {
      e.preventDefault();
      setPrompt(e);
      setVisible(true);
    }

    function handleInstalled() {
      setInstalled(true);
      setVisible(false);
    }

    window.addEventListener("beforeinstallprompt", handlePrompt);
    window.addEventListener("appinstalled", handleInstalled);

    return () => {
      window.removeEventListener("beforeinstallprompt", handlePrompt);
      window.removeEventListener("appinstalled", handleInstalled);
    };
  }, []);

  async function handleInstall() {
    if (!prompt) return;
    prompt.prompt();
    const { outcome } = await prompt.userChoice;
    if (outcome === "accepted") {
      setVisible(false);
      setPrompt(null);
    }
  }

  if (!visible || installed) return null;

  return (
    <div className={cn(
      "fixed bottom-24 md:bottom-6 right-4 z-50",
      "flex items-center gap-3 px-4 py-3 rounded-2xl",
      "bg-[#1a1a1a] border border-white/10 shadow-2xl",
      "animate-in slide-in-from-bottom-4 duration-300"
    )}>
      <div className="w-9 h-9 rounded-xl bg-purple-600 flex items-center justify-center flex-shrink-0">
        <Download size={16} className="text-white" />
      </div>
      <div className="min-w-0">
        <p className="text-sm font-semibold text-white">Installer Moozik</p>
        <p className="text-xs text-white/40">Accès rapide depuis l'écran d'accueil</p>
      </div>
      <div className="flex items-center gap-2 ml-2">
        <button
          onClick={handleInstall}
          className="px-3 py-1.5 rounded-lg bg-purple-600 hover:bg-purple-500 text-xs font-medium text-white transition-colors"
        >
          Installer
        </button>
        <button
          onClick={() => setVisible(false)}
          className="p-1.5 rounded-lg text-white/30 hover:text-white/60 transition-colors"
        >
          <X size={14} />
        </button>
      </div>
    </div>
  );
}