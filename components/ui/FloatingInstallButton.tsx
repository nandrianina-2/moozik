"use client";

import { useState, useEffect } from "react";
import { Download, X, WifiOff } from "lucide-react";
import { cn } from "@/lib/utils";

export function FloatingInstallButton() {
  const [prompt, setPrompt]       = useState<any>(null);
  const [visible, setVisible]     = useState(false);
  const [isOffline, setIsOffline] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);

  useEffect(() => {
    // Déjà installé comme PWA
    if (
      window.matchMedia("(display-mode: standalone)").matches ||
      (window.navigator as any).standalone === true
    ) {
      setIsStandalone(true);
      return;
    }

    function handlePrompt(e: Event) {
      e.preventDefault();
      setPrompt(e);
      setVisible(true);
    }

    function handleOnline()  { setIsOffline(false); }
    function handleOffline() { setIsOffline(true);  }

    window.addEventListener("beforeinstallprompt", handlePrompt);
    window.addEventListener("online",  handleOnline);
    window.addEventListener("offline", handleOffline);
    setIsOffline(!navigator.onLine);

    return () => {
      window.removeEventListener("beforeinstallprompt", handlePrompt);
      window.removeEventListener("online",  handleOnline);
      window.removeEventListener("offline", handleOffline);
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

  // Bannière offline
  if (isOffline) {
    return (
      <div className="fixed top-0 left-0 right-0 z-[100] flex items-center justify-center gap-2 px-4 py-2 bg-orange-500">
        <WifiOff size={14} className="text-white" />
        <p className="text-xs font-semibold text-white">
          Hors ligne — Sons téléchargés disponibles
        </p>
      </div>
    );
  }

  if (!visible || isStandalone) return null;

  return (
    <div className={cn(
      "fixed bottom-24 md:bottom-20 right-4 z-50",
      "flex items-center gap-3 px-4 py-3 rounded-2xl",
      "bg-[#1a1a1a] border border-white/10 shadow-2xl max-w-[300px]"
    )}>
      <div className="w-9 h-9 rounded-xl bg-purple-600 flex items-center justify-center flex-shrink-0">
        <Download size={16} className="text-white" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-white">Installer Moozik</p>
        <p className="text-xs text-white/40">Accès rapide + offline</p>
      </div>
      <div className="flex items-center gap-1.5 flex-shrink-0">
        <button
          onClick={handleInstall}
          className="px-3 py-1.5 rounded-lg bg-purple-600 text-xs font-medium text-white"
        >
          Installer
        </button>
        <button onClick={() => setVisible(false)} className="p-1.5 text-white/30">
          <X size={14} />
        </button>
      </div>
    </div>
  );
}