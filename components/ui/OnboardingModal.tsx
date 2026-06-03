"use client";

import { useState, useEffect } from "react";
import { Music2, Search, Radio, X, ArrowRight, Check } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";

const STEPS = [
  {
    icon: "🎵",
    title: "Bienvenue sur Moozik !",
    desc:  "La plateforme de streaming musical indépendant. Découvre des artistes, crée tes playlists et écoute de la musique sans limites.",
    action: null,
  },
  {
    icon: "🔍",
    title: "Explore la musique",
    desc:  "Recherche des sons par titre, artiste ou genre. Clique sur n'importe quel son pour le lancer dans le lecteur.",
    action: { label: "Aller à la recherche", href: "/search" },
  },
  {
    icon: "📻",
    title: "Lance la Radio",
    desc:  "La radio intelligente sélectionne des sons selon tes goûts. Lance-la et laisse-toi surprendre.",
    action: { label: "Écouter la radio", href: "/radio" },
  },
  {
    icon: "❤️",
    title: "Like et sauvegarde",
    desc:  "Like tes sons favoris, ajoute-les à des playlists et retrouve-les dans ta bibliothèque.",
    action: null,
  },
];

export function OnboardingModal() {
  const [visible, setVisible] = useState(false);
  const [step, setStep] = useState(0);
  const router = useRouter();

  useEffect(() => {
    const done = localStorage.getItem("onboarding-done");
    if (!done) {
      setTimeout(() => setVisible(true), 1000);
    }
  }, []);

  function handleClose() {
    localStorage.setItem("onboarding-done", "1");
    setVisible(false);
  }

  function handleNext() {
    if (step < STEPS.length - 1) {
      setStep((s) => s + 1);
    } else {
      handleClose();
    }
  }

  function handleAction(href: string) {
    handleClose();
    router.push(href);
  }

  if (!visible) return null;

  const current = STEPS[step];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={handleClose}
      />

      <div className="relative w-full max-w-sm bg-[#1a1a1a] rounded-2xl border border-white/10 shadow-2xl overflow-hidden">
        {/* Progress bar */}
        <div className="h-1 bg-white/5">
          <div
            className="h-full bg-purple-500 transition-all duration-500"
            style={{ width: `${((step + 1) / STEPS.length) * 100}%` }}
          />
        </div>

        {/* Close */}
        <button
          onClick={handleClose}
          className="absolute top-3 right-3 p-1.5 rounded-lg text-white/30 hover:text-white hover:bg-white/10 transition-all z-10"
        >
          <X size={16} />
        </button>

        <div className="p-6 text-center">
          {/* Icon */}
          <div className="text-5xl mb-4">{current.icon}</div>

          {/* Titre */}
          <h2 className="text-lg font-bold text-white mb-2">
            {current.title}
          </h2>

          {/* Description */}
          <p className="text-sm text-white/50 leading-relaxed mb-6">
            {current.desc}
          </p>

          {/* Dots navigation */}
          <div className="flex items-center justify-center gap-1.5 mb-6">
            {STEPS.map((_, i) => (
              <button
                key={i}
                onClick={() => setStep(i)}
                className={cn(
                  "rounded-full transition-all",
                  i === step
                    ? "w-4 h-1.5 bg-purple-500"
                    : "w-1.5 h-1.5 bg-white/20 hover:bg-white/40"
                )}
              />
            ))}
          </div>

          {/* Boutons */}
          <div className="flex flex-col gap-2">
            {current.action && (
              <Button
                variant="secondary"
                className="w-full"
                onClick={() => handleAction(current.action!.href)}
              >
                {current.action.label}
                <ArrowRight size={15} />
              </Button>
            )}

            <Button
              variant="primary"
              className="w-full"
              onClick={handleNext}
            >
              {step === STEPS.length - 1 ? (
                <><Check size={15} /> C'est parti !</>
              ) : (
                <>Suivant <ArrowRight size={15} /></>
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}