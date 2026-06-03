"use client";

import { useState, useEffect } from "react";
import { X, ArrowRight, Check, Music, Search, Radio, Heart } from "lucide-react";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";

const STEPS = [
  {
    icon: Music,
    color: "#a78bfa",
    glow: "#7c3aed",
    label: "Bienvenue",
    title: "Moozik t'attend.",
    desc: "La plateforme pensée pour la musique indépendante. Découvre des artistes, construis tes playlists et écoute sans limites.",
    action: null,
  },
  {
    icon: Search,
    color: "#34d399",
    glow: "#059669",
    label: "Exploration",
    title: "Cherche, trouve, écoute.",
    desc: "Recherche par titre, artiste ou genre. Lance n'importe quel son directement dans le lecteur intégré.",
    action: { label: "Ouvrir la recherche", href: "/search" },
  },
  {
    icon: Radio,
    color: "#f472b6",
    glow: "#db2777",
    label: "Radio",
    title: "Laisse-toi guider.",
    desc: "La radio intelligente apprend tes goûts et sélectionne des sons pour toi. Lance, relax, découvre.",
    action: { label: "Écouter la radio", href: "/radio" },
  },
  {
    icon: Heart,
    color: "#fb923c",
    glow: "#ea580c",
    label: "Bibliothèque",
    title: "Sauvegarde ce qui compte.",
    desc: "Like tes sons favoris, organise des playlists et retrouve tout dans ta bibliothèque personnelle.",
    action: null,
  },
];

export function OnboardingModal() {
  const [visible, setVisible] = useState(false);
  const [step, setStep] = useState(0);
  const [closing, setClosing] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const done = localStorage.getItem("onboarding-done");
    if (!done) {
      setTimeout(() => setVisible(true), 800);
    }
  }, []);

  function closeModal() {
    setClosing(true);
    localStorage.setItem("onboarding-done", "1");
    setTimeout(() => {
      setVisible(false);
      setClosing(false);
    }, 300);
  }

  function handleNext() {
    if (step < STEPS.length - 1) {
      setStep((s) => s + 1);
    } else {
      closeModal();
    }
  }

  function handleAction(href: string) {
    closeModal();
    router.push(href);
  }

  if (!visible) return null;

  const current = STEPS[step];
  const Icon = current.icon;
  const isLast = step === STEPS.length - 1;
  const progress = ((step + 1) / STEPS.length) * 100;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={closeModal}
      />

      {/* Card */}
      <div
        className={cn(
          "relative w-full max-w-[360px] overflow-hidden rounded-[20px] border border-white/[0.08] shadow-2xl",
          "transition-all duration-300",
          closing
            ? "opacity-0 scale-95 translate-y-2"
            : "opacity-100 scale-100 translate-y-0"
        )}
        style={{ background: "#0f0f14" }}
      >
        {/* Ambient glow */}
        <div
          className="pointer-events-none absolute -top-16 left-1/2 h-48 w-48 -translate-x-1/2 rounded-full blur-[60px]"
          style={{ background: current.glow, opacity: 0.3, transition: "background 0.5s ease" }}
        />

        {/* Progress bar */}
        <div className="h-[2px] w-full" style={{ background: "rgba(255,255,255,0.06)" }}>
          <div
            className="h-full transition-all duration-500 ease-[cubic-bezier(.4,0,.2,1)]"
            style={{ width: `${progress}%`, background: current.color }}
          />
        </div>

        {/* Close button */}
        <button
          onClick={closeModal}
          className="absolute right-3 top-3 z-10 flex h-7 w-7 items-center justify-center rounded-full border border-white/10 text-white/30 transition-all hover:bg-white/10 hover:text-white/80"
        >
          <X size={14} />
        </button>

        {/* Body */}
        <div className="relative z-10 px-7 pb-6 pt-8">
          {/* Icon */}
          <div
            className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl border transition-all duration-500"
            style={{
              background: `${current.color}14`,
              borderColor: `${current.color}33`,
            }}
          >
            <Icon
              size={24}
              strokeWidth={1.5}
              style={{ color: current.color, transition: "color 0.4s" }}
            />
          </div>

          {/* Step label */}
          <p className="mb-1 text-[11px] font-medium uppercase tracking-[0.1em] text-white/30">
            Étape {step + 1} / {STEPS.length} — {current.label}
          </p>

          {/* Title */}
          <h2 className="mb-2.5 text-[20px] font-bold leading-tight text-white">
            {current.title}
          </h2>

          {/* Description */}
          <p className="mb-5 text-[13.5px] leading-[1.7] text-white/45">
            {current.desc}
          </p>

          {/* Dot navigation */}
          <div className="mb-5 flex gap-1.5">
            {STEPS.map((_, i) => (
              <button
                key={i}
                onClick={() => setStep(i)}
                className="h-1 flex-1 rounded-full transition-all duration-300"
                style={{
                  background: i === step ? current.color : "rgba(255,255,255,0.12)",
                  opacity: i === step ? 1 : 0.6,
                }}
              />
            ))}
          </div>

          {/* Buttons */}
          <div className="flex flex-col gap-2">
            {current.action && (
              <button
                onClick={() => handleAction(current.action!.href)}
                className="flex w-full items-center justify-center gap-1.5 rounded-[12px] border border-white/10 bg-white/[0.04] px-4 py-[10px] text-[13.5px] text-white/55 transition-all hover:bg-white/[0.08] hover:text-white/80"
              >
                {current.action.label}
                <ArrowRight size={14} />
              </button>
            )}

            <button
              onClick={handleNext}
              className="flex w-full items-center justify-center gap-1.5 rounded-[12px] px-4 py-[11px] text-[14px] font-medium text-[#0f0f14] transition-all hover:brightness-110 hover:-translate-y-px active:scale-[0.98]"
              style={{ background: current.color, transition: "background 0.5s ease, filter 0.2s, transform 0.2s" }}
            >
              {isLast ? (
                <><Check size={14} strokeWidth={2.5} /> C&apos;est parti !</>
              ) : (
                <>Suivant <ArrowRight size={14} strokeWidth={2.5} /></>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}