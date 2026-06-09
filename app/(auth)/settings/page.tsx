"use client";

import { useState, useEffect } from "react";
import { Header } from "@/components/layout/Header";
import { Button } from "@/components/ui/Button";
import {
  Moon, Sun, Globe, Volume2,
  Music2, Bell, Shield, Check,
} from "lucide-react";
import { cn } from "@/lib/utils";

type Theme    = "dark" | "light" | "system";
type Language = "fr" | "en" | "mg";
type Quality  = "normal" | "high" | "lossless";

interface Settings {
  theme:       Theme;
  language:    Language;
  quality:     Quality;
  autoplay:    boolean;
  showLyrics:  boolean;
  explicitContent: boolean;
}

const DEFAULT: Settings = {
  theme:       "dark",
  language:    "fr",
  quality:     "normal",
  autoplay:    true,
  showLyrics:  true,
  explicitContent: true,
};

export default function SettingsPage() {
  const [settings, setSettings] = useState<Settings>(DEFAULT);
  const [saved, setSaved]       = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem("moozik-settings");
      if (raw) setSettings({ ...DEFAULT, ...JSON.parse(raw) });
    } catch {}
  }, []);

  function update<K extends keyof Settings>(key: K, value: Settings[K]) {
    setSettings((prev) => ({ ...prev, [key]: value }));
  }

  function handleSave() {
    localStorage.setItem("moozik-settings", JSON.stringify(settings));
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  return (
    <div className="pb-32">
      <Header title="Paramètres" />

      <div className="px-4 md:px-6 py-6 max-w-xl space-y-6">

        {/* Apparence */}
        <section className="space-y-3">
          <h2 className="text-xs font-semibold text-white/40 uppercase tracking-wider flex items-center gap-2">
            <Moon size={13} /> Apparence
          </h2>

          <div className="space-y-2">
            <p className="text-sm font-medium text-white">Thème</p>
            <div className="grid grid-cols-3 gap-2">
              {([
                { id: "dark",   label: "Sombre",  icon: Moon },
                { id: "light",  label: "Clair",   icon: Sun },
                { id: "system", label: "Système", icon: Globe },
              ] as const).map(({ id, label, icon: Icon }) => (
                <button
                  key={id}
                  onClick={() => update("theme", id)}
                  className={cn(
                    "flex flex-col items-center gap-2 p-3 rounded-xl border transition-all text-sm font-medium",
                    settings.theme === id
                      ? "bg-purple-600 border-purple-600 text-white"
                      : "bg-white/5 border-white/10 text-white/50 hover:border-white/20"
                  )}
                >
                  <Icon size={16} />
                  {label}
                </button>
              ))}
            </div>
          </div>
        </section>

        <div className="h-px bg-white/5" />

        {/* Langue */}
        <section className="space-y-3">
          <h2 className="text-xs font-semibold text-white/40 uppercase tracking-wider flex items-center gap-2">
            <Globe size={13} /> Langue
          </h2>
          <div className="grid grid-cols-3 gap-2">
            {([
              { id: "fr", label: "Français",   flag: "🇫🇷" },
              { id: "en", label: "English",    flag: "🇬🇧" },
              { id: "mg", label: "Malagasy",   flag: "🇲🇬" },
            ] as const).map(({ id, label, flag }) => (
              <button
                key={id}
                onClick={() => update("language", id)}
                className={cn(
                  "flex flex-col items-center gap-1.5 p-3 rounded-xl border transition-all",
                  settings.language === id
                    ? "bg-purple-600 border-purple-600 text-white"
                    : "bg-white/5 border-white/10 text-white/50 hover:border-white/20"
                )}
              >
                <span className="text-xl">{flag}</span>
                <span className="text-xs font-medium">{label}</span>
              </button>
            ))}
          </div>
        </section>

        <div className="h-px bg-white/5" />

        {/* Audio */}
        <section className="space-y-3">
          <h2 className="text-xs font-semibold text-white/40 uppercase tracking-wider flex items-center gap-2">
            <Volume2 size={13} /> Audio
          </h2>

          <div className="space-y-2">
            <p className="text-sm font-medium text-white">Qualité de streaming</p>
            <div className="grid grid-cols-3 gap-2">
              {([
                { id: "normal",   label: "Normal",   sub: "128 kbps" },
                { id: "high",     label: "Haute",    sub: "320 kbps" },
                { id: "lossless", label: "Lossless", sub: "FLAC"     },
              ] as const).map(({ id, label, sub }) => (
                <button
                  key={id}
                  onClick={() => update("quality", id)}
                  className={cn(
                    "flex flex-col items-center gap-1 p-3 rounded-xl border transition-all",
                    settings.quality === id
                      ? "bg-purple-600 border-purple-600 text-white"
                      : "bg-white/5 border-white/10 text-white/50 hover:border-white/20",
                    (id === "high" || id === "lossless") && settings.quality !== id
                      ? "opacity-50 cursor-not-allowed"
                      : ""
                  )}
                  disabled={id === "lossless"}
                  title={id === "lossless" ? "Premium requis" : ""}
                >
                  <span className="text-sm font-medium">{label}</span>
                  <span className="text-[10px] opacity-60">{sub}</span>
                </button>
              ))}
            </div>
            <p className="text-xs text-white/25 pl-1">
              Haute qualité et Lossless nécessitent un abonnement Premium
            </p>
          </div>
        </section>

        <div className="h-px bg-white/5" />

        {/* Lecture */}
        <section className="space-y-3">
          <h2 className="text-xs font-semibold text-white/40 uppercase tracking-wider flex items-center gap-2">
            <Music2 size={13} /> Lecture
          </h2>

          {[
            {
              key:   "autoplay"   as const,
              label: "Lecture automatique",
              desc:  "Continue avec des sons similaires en fin de queue",
            },
            {
              key:   "showLyrics" as const,
              label: "Afficher les paroles",
              desc:  "Affiche les paroles synchronisées dans le lecteur",
            },
            {
              key:   "explicitContent" as const,
              label: "Contenu explicite",
              desc:  "Autorise les sons marqués comme explicites",
            },
          ].map(({ key, label, desc }) => (
            <div
              key={key}
              className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/5"
            >
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-white">{label}</p>
                <p className="text-xs text-white/40">{desc}</p>
              </div>
              <button
                onClick={() => update(key, !settings[key])}
                className={cn(
                  "relative w-10 h-5 rounded-full transition-colors flex-shrink-0 ml-4",
                  settings[key] ? "bg-purple-600" : "bg-white/20"
                )}
              >
                <span className={cn(
                  "absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white transition-transform",
                  settings[key] ? "translate-x-5" : "translate-x-0"
                )} />
              </button>
            </div>
          ))}
        </section>

        <div className="h-px bg-white/5" />

        {/* Confidentialité */}
        <section className="space-y-3">
          <h2 className="text-xs font-semibold text-white/40 uppercase tracking-wider flex items-center gap-2">
            <Shield size={13} /> Confidentialité
          </h2>
          <div className="p-4 rounded-xl bg-white/3 border border-white/5 space-y-3">
            {[
              "Historique d'écoute activé",
              "Données utilisées pour les recommandations",
              "Partage anonyme des statistiques",
            ].map((item) => (
              <div key={item} className="flex items-center gap-2 text-sm text-white/50">
                <Check size={14} className="text-green-400 flex-shrink-0" />
                {item}
              </div>
            ))}
          </div>
        </section>

        {/* Bouton sauvegarder */}
        <Button
          variant="primary"
          size="lg"
          className="w-full"
          onClick={handleSave}
        >
          {saved ? <><Check size={16} /> Paramètres sauvegardés</> : "Sauvegarder"}
        </Button>

      </div>
    </div>
  );
}