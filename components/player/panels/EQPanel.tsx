"use client";

import { useState } from "react";
import { EQ_PRESETS, DEFAULT_EQ_BANDS } from "@/lib/audioEngine";
import { cn } from "@/lib/utils";

const BAND_LABELS  = ["60Hz", "250Hz", "1kHz", "4kHz", "16kHz"];
const PRESET_LABELS: Record<string, string> = {
  flat:       "Flat",
  bass:       "Bass Boost",
  treble:     "Treble",
  vocal:      "Vocal",
  rock:       "Rock",
  jazz:       "Jazz",
  electronic: "Electronic",
  classical:  "Classical",
};

export function EQPanel() {
  const [gains, setGains]           = useState<number[]>(DEFAULT_EQ_BANDS.map((b) => b.gain));
  const [activePreset, setActivePreset] = useState("flat");
  const [crossfade, setCrossfade]   = useState(false);
  const [crossfadeDur, setCrossfadeDur] = useState(3);

  function handleBandChange(index: number, value: number) {
    try {
      const { getAudioEngine } = require("@/lib/audioEngine");
      getAudioEngine().setEQBand(index, value);
    } catch {}
    setGains((prev) => {
      const next = [...prev];
      next[index] = value;
      return next;
    });
    setActivePreset("custom");
  }

  function handlePreset(name: string) {
    try {
      const { getAudioEngine } = require("@/lib/audioEngine");
      const newGains = getAudioEngine().applyPreset(name);
      if (newGains) setGains([...newGains]);
    } catch {
      const g = EQ_PRESETS[name];
      if (g) setGains([...g]);
    }
    setActivePreset(name);
  }

  function handleCrossfadeToggle() {
    const next = !crossfade;
    setCrossfade(next);
    try {
      const { getAudioEngine } = require("@/lib/audioEngine");
      getAudioEngine().setCrossfade(next, crossfadeDur);
    } catch {}
  }

  function handleCrossfadeDur(v: number) {
    setCrossfadeDur(v);
    try {
      const { getAudioEngine } = require("@/lib/audioEngine");
      getAudioEngine().setCrossfade(crossfade, v);
    } catch {}
  }

  return (
    <div className="space-y-5">

      {/* Presets */}
      <div className="space-y-2">
        <p className="text-xs font-semibold text-white/40 uppercase tracking-wider">
          Presets
        </p>
        <div className="flex flex-wrap gap-1.5">
          {Object.entries(PRESET_LABELS).map(([key, label]) => (
            <button
              key={key}
              onClick={() => handlePreset(key)}
              className={cn(
                "px-3 py-1.5 rounded-lg text-xs font-medium border transition-all",
                activePreset === key
                  ? "bg-purple-600 border-purple-600 text-white"
                  : "bg-white/5 border-white/10 text-white/50 hover:border-white/20"
              )}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Sliders EQ */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <p className="text-xs font-semibold text-white/40 uppercase tracking-wider">
            Égaliseur
          </p>
          <button
            onClick={() => handlePreset("flat")}
            className="text-xs text-white/30 hover:text-white/60 transition-colors"
          >
            Réinitialiser
          </button>
        </div>

        <div className="flex items-end gap-3 h-36 px-1">
          {BAND_LABELS.map((label, i) => (
            <div key={label} className="flex-1 flex flex-col items-center gap-1.5">
              <span className="text-[10px] text-white/40 tabular-nums">
                {gains[i] > 0 ? "+" : ""}{gains[i].toFixed(0)}
              </span>
              <div className="relative flex-1 w-full flex items-center justify-center">
                <input
                  type="range"
                  min={-12}
                  max={12}
                  step={0.5}
                  value={gains[i]}
                  onChange={(e) => handleBandChange(i, parseFloat(e.target.value))}
                  className="appearance-none cursor-pointer accent-purple-500"
                  style={{
                    writingMode: "vertical-lr" as any,
                    direction:   "rtl",
                    width:       "100%",
                    height:      "90px",
                  }}
                />
              </div>
              <span className="text-[9px] text-white/30 text-center">
                {label}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Crossfade */}
      <div className="space-y-3 pt-2 border-t border-white/5">
        <p className="text-xs font-semibold text-white/40 uppercase tracking-wider">
          Crossfade
        </p>

        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-white">Transition douce</p>
            <p className="text-xs text-white/40">Fondu entre les sons</p>
          </div>
          <button
            onClick={handleCrossfadeToggle}
            className={cn(
              "relative w-10 h-5 rounded-full transition-colors",
              crossfade ? "bg-purple-600" : "bg-white/20"
            )}
          >
            <span className={cn(
              "absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white transition-transform",
              crossfade ? "translate-x-5" : "translate-x-0"
            )} />
          </button>
        </div>

        {crossfade && (
          <div className="space-y-1.5">
            <div className="flex justify-between">
              <p className="text-xs text-white/50">Durée</p>
              <p className="text-xs text-purple-400 font-medium">{crossfadeDur}s</p>
            </div>
            <input
              type="range"
              min={1}
              max={8}
              step={1}
              value={crossfadeDur}
              onChange={(e) => handleCrossfadeDur(parseInt(e.target.value))}
              className="w-full accent-purple-500 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-white/20">
              <span>1s</span>
              <span>8s</span>
            </div>
          </div>
        )}
      </div>

    </div>
  );
}