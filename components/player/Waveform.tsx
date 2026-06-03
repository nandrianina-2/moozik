"use client";

import { useEffect, useState } from "react";
import { usePlayerStore } from "@/store/playerStore";
import { getAudioEngine } from "@/lib/audioEngine";
import { cn } from "@/lib/utils";

interface Props {
  audioUrl: string;
  className?: string;
}

export function Waveform({ audioUrl, className }: Props) {
  const { progress, duration } = usePlayerStore();
  const [bars, setBars] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);

  // Génère les barres de la waveform
  useEffect(() => {
    let cancelled = false;
    async function generateWaveform() {
      setLoading(true);
      try {
        const ctx = new AudioContext();
        const res = await fetch(audioUrl);
        const buffer = await res.arrayBuffer();
        const decoded = await ctx.decodeAudioData(buffer);
        ctx.close();
        if (cancelled) return;
        const data = decoded.getChannelData(0);
        const samples = 80;
        const blockSize = Math.floor(data.length / samples);
        const generated: number[] = [];
        for (let i = 0; i < samples; i++) {
          let sum = 0;
          for (let j = 0; j < blockSize; j++) {
            sum += Math.abs(data[i * blockSize + j] ?? 0);
          }
          generated.push(sum / blockSize);
        }
        // Normalise entre 0.1 et 1
        const max = Math.max(...generated);
        setBars(generated.map((v) => Math.max(0.1, v / max)));
      } catch {
        // Fallback : barres aléatoires
        if (!cancelled) {
          setBars(Array.from({ length: 80 }, () =>
            0.1 + Math.random() * 0.9
          ));
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    generateWaveform();
    return () => { cancelled = true; };
  }, [audioUrl]);

  const percent = duration > 0 ? progress / duration : 0;

  function handleClick(e: React.MouseEvent<HTMLDivElement>) {
    if (!duration) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const ratio = (e.clientX - rect.left) / rect.width;
    getAudioEngine().seek(ratio * duration);
  }

  if (loading || bars.length === 0) {
    return (
      <div className={cn("flex items-center gap-0.5 h-12 cursor-pointer", className)}>
        {Array.from({ length: 80 }).map((_, i) => (
          <div
            key={i}
            className="flex-1 rounded-full bg-white/10 animate-pulse"
            style={{ height: `${10 + Math.random() * 60}%` }}
          />
        ))}
      </div>
    );
  }

  return (
    <div
      className={cn(
        "flex items-center gap-0.5 h-12 cursor-pointer group",
        className
      )}
      onClick={handleClick}
    >
      {bars.map((height, i) => {
        const barPercent = i / bars.length;
        const isPlayed = barPercent < percent;
        return (
          <div
            key={i}
            className={cn(
              "flex-1 rounded-full transition-colors duration-75",
              isPlayed
                ? "bg-purple-500 group-hover:bg-purple-400"
                : "bg-white/15 group-hover:bg-white/25"
            )}
            style={{ height: `${height * 100}%` }}
          />
        );
      })}
    </div>
  );
}