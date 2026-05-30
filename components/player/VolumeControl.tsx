"use client";

import { Volume2, VolumeX } from "lucide-react";
import { usePlayerStore } from "@/store/playerStore";

export function VolumeControl() {
  const { volume, isMuted, setVolume, toggleMute } = usePlayerStore();

  const displayed = isMuted ? 0 : volume;

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={toggleMute}
        className="text-white/30 hover:text-white/60 transition-colors"
      >
        {isMuted || volume === 0 ? <VolumeX size={16} /> : <Volume2 size={16} />}
      </button>
      <input
        type="range"
        min={0}
        max={1}
        step={0.01}
        value={displayed}
        onChange={(e) => setVolume(parseFloat(e.target.value))}
        className="w-20 h-1 accent-purple-500 cursor-pointer"
      />
    </div>
  );
}