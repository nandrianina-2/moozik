"use client";

import { useEffect, useState, useCallback } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { ChevronLeft, ListMusic, MessageCircle, Info } from "lucide-react";
import { usePlayerStore } from "@/store/playerStore";
import { PlayerControls } from "./PlayerControls";
import { ProgressBar } from "./ProgressBar";
import { VolumeControl } from "./VolumeControl";
import { PlayerActions } from "./PlayerActions";
import { QueuePanel } from "./panels/QueuePanel";
import { CommentsPanel } from "./panels/CommentsPanel";
import { InfosPanel } from "./panels/InfosPanel";
import { FloatingComments } from "./FloatingComments";
import { cn } from "@/lib/utils";

type Panel = "infos" | "comments" | "queue";

export function FullPlayerPage() {
  const router = useRouter();
  const { currentSong } = usePlayerStore();
  const [activePanel, setActivePanel] = useState<Panel>("infos");

  useEffect(() => {
    if (!currentSong) router.push("/dashboard");
  }, [currentSong, router]);

  if (!currentSong) return null;

  const tabs: { id: Panel; icon: typeof Info; label: string }[] = [
    { id: "infos",    icon: Info,          label: "Infos" },
    { id: "comments", icon: MessageCircle, label: "Commentaires" },
    { id: "queue",    icon: ListMusic,     label: "File" },
  ];

  return (
    <div className="min-h-dvh bg-[#0d0d0d] overflow-x-hidden">

      {/* Fond flou */}
      {currentSong.coverUrl && (
        <div className="fixed inset-0 -z-10">
          <Image
            src={currentSong.coverUrl}
            alt=""
            fill
            className="object-cover scale-125 blur-3xl opacity-25"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#0d0d0d]/70 via-[#0d0d0d]/85 to-[#0d0d0d]" />
        </div>
      )}

      {/* ════════════════════════════════
          MOBILE  (< lg)
      ════════════════════════════════ */}
      <div className="lg:hidden flex flex-col min-h-dvh relative">

        {/* Header */}
        <div className="flex items-center justify-between px-5 pt-5 pb-2">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-1 text-white/50 hover:text-white transition-colors"
          >
            <ChevronLeft size={22} />
            <span className="text-sm font-medium">Retour</span>
          </button>
          <p className="text-xs font-medium text-white/30 uppercase tracking-widest">
            En cours
          </p>
          <div className="w-16" />
        </div>

        {/* Cover avec commentaires flottants */}
        <div className="relative flex justify-center px-8 py-4">
          <div className="relative w-full max-w-xs aspect-square rounded-2xl overflow-hidden shadow-2xl ring-1 ring-white/10">
            {currentSong.coverUrl ? (
              <Image
                src={currentSong.coverUrl}
                alt={currentSong.title}
                fill
                className="object-cover"
                priority
              />
            ) : (
              <div className="w-full h-full bg-white/5 flex items-center justify-center text-6xl">
                🎵
              </div>
            )}
            {/* Commentaires flottants par-dessus la cover */}
            <FloatingComments songId={currentSong.id} />
          </div>
        </div>

        {/* Titre + actions */}
        <div className="flex items-start justify-between gap-3 px-6 mb-4">
          <div className="min-w-0">
            <h1 className="text-xl font-bold text-white truncate leading-tight">
              {currentSong.title}
            </h1>
            <p className="text-sm text-white/50 mt-0.5">
              {currentSong.artist.name}
            </p>
          </div>
          <div className="flex-shrink-0 pt-0.5">
            <PlayerActions />
          </div>
        </div>

        {/* Progress */}
        <div className="px-6 mb-4">
          <ProgressBar />
        </div>

        {/* Contrôles */}
        <div className="flex justify-center mb-4">
          <PlayerControls />
        </div>

        {/* Volume */}
        <div className="flex justify-center px-6 mb-6">
          <VolumeControl />
        </div>

        {/* Tabs — sans "File" sur mobile (déjà dans right panel) */}
        <div className="flex gap-1 bg-white/5 rounded-xl p-1 mx-5 mb-4">
          {tabs
            .filter((t) => t.id !== "queue")
            .map(({ id, icon: Icon, label }) => (
              <button
                key={id}
                onClick={() => setActivePanel(id)}
                className={cn(
                  "flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium transition-all",
                  activePanel === id
                    ? "bg-white/10 text-white"
                    : "text-white/40 hover:text-white/60"
                )}
              >
                <Icon size={14} />
                {label}
              </button>
            ))}
        </div>

        {/* Panel */}
        <div className="flex-1 overflow-y-auto px-5 pb-10">
          {activePanel === "infos"    && <InfosPanel song={currentSong} />}
          {activePanel === "comments" && <CommentsPanel songId={currentSong.id} />}
        </div>
      </div>

      {/* ════════════════════════════════
          DESKTOP  (≥ lg)
      ════════════════════════════════ */}
      <div className="hidden lg:flex min-h-dvh">

        {/* Colonne gauche — Player */}
        <div className="w-[440px] flex-shrink-0 flex flex-col justify-between px-10 py-10 sticky top-0 h-dvh overflow-hidden">

          {/* Retour */}
          <button
            onClick={() => router.back()}
            className="flex items-center gap-1.5 text-white/40 hover:text-white transition-colors self-start"
          >
            <ChevronLeft size={20} />
            <span className="text-sm">Retour</span>
          </button>

          {/* Cover */}
          <div className="flex justify-center">
            <div className="relative w-72 h-72 rounded-2xl overflow-hidden shadow-2xl ring-1 ring-white/10">
              {currentSong.coverUrl ? (
                <Image
                  src={currentSong.coverUrl}
                  alt={currentSong.title}
                  fill
                  className="object-cover"
                  priority
                />
              ) : (
                <div className="w-full h-full bg-white/5 flex items-center justify-center text-7xl">
                  🎵
                </div>
              )}
            </div>
          </div>

          {/* Titre + actions */}
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0">
              <h1 className="text-2xl font-bold text-white truncate leading-tight">
                {currentSong.title}
              </h1>
              <p className="text-base text-white/50 mt-1">
                {currentSong.artist.name}
              </p>
            </div>
            <div className="flex-shrink-0 pt-1">
              <PlayerActions />
            </div>
          </div>

          {/* Progress + contrôles + volume */}
          <div className="space-y-5">
            <ProgressBar />
            <div className="flex justify-center">
              <PlayerControls />
            </div>
            <div className="flex justify-center">
              <VolumeControl />
            </div>
          </div>
        </div>

        {/* Séparateur */}
        <div className="w-px bg-white/5 my-10 flex-shrink-0" />

        {/* Colonne droite — Panels (sans onglet File sur desktop) */}
        <div className="flex-1 flex flex-col py-10 px-10 min-w-0 overflow-hidden">

          {/* Tabs — Infos + Commentaires seulement (File = right panel) */}
          <div className="flex gap-1 bg-white/5 rounded-xl p-1 mb-6">
            {tabs
              .filter((t) => t.id !== "queue")
              .map(({ id, icon: Icon, label }) => (
                <button
                  key={id}
                  onClick={() => setActivePanel(id)}
                  className={cn(
                    "flex-1 flex items-center justify-center gap-2 py-3 rounded-lg text-sm font-medium transition-all",
                    activePanel === id
                      ? "bg-white/10 text-white"
                      : "text-white/40 hover:text-white/70"
                  )}
                >
                  <Icon size={16} />
                  {label}
                </button>
              ))}
          </div>

          {/* Contenu */}
          <div className="flex-1 overflow-y-auto pr-1">
            {activePanel === "infos"    && <InfosPanel song={currentSong} />}
            {activePanel === "comments" && <CommentsPanel songId={currentSong.id} />}
          </div>
        </div>
      </div>
    </div>
  );
}