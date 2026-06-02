"use client";

import { useEffect } from "react";
import { usePlayerStore } from "@/store/playerStore";
import { getAudioEngine } from "@/lib/audioEngine";

export function useKeyboardShortcuts() {
  const {
    isPlaying, togglePlay, playNext, playPrev,
    volume, setVolume, isMuted, toggleMute,
    shuffle, toggleShuffle, toggleRepeat,
    duration, progress,
  } = usePlayerStore();

  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      // Ignore si on est dans un input / textarea
      const target = e.target as HTMLElement;
      if (
        target.tagName === "INPUT" ||
        target.tagName === "TEXTAREA" ||
        target.isContentEditable
      ) return;

      switch (e.code) {
        // Espace — play/pause
        case "Space":
          e.preventDefault();
          togglePlay();
          break;

        // Flèche droite — +5s
        case "ArrowRight":
          e.preventDefault();
          if (duration > 0) {
            getAudioEngine().seek(Math.min(progress + 5, duration));
          }
          break;

        // Flèche gauche — -5s
        case "ArrowLeft":
          e.preventDefault();
          if (duration > 0) {
            getAudioEngine().seek(Math.max(progress - 5, 0));
          }
          break;

        // Flèche haut — volume +10%
        case "ArrowUp":
          e.preventDefault();
          setVolume(Math.min(volume + 0.1, 1));
          break;

        // Flèche bas — volume -10%
        case "ArrowDown":
          e.preventDefault();
          setVolume(Math.max(volume - 0.1, 0));
          break;

        // N — son suivant
        case "KeyN":
          playNext();
          break;

        // P — son précédent
        case "KeyP":
          playPrev();
          break;

        // M — mute/unmute
        case "KeyM":
          toggleMute();
          break;

        // S — shuffle
        case "KeyS":
          toggleShuffle();
          break;

        // R — repeat
        case "KeyR":
          toggleRepeat();
          break;

        // 0-9 — seek à X0% de la piste
        default:
          if (e.code.startsWith("Digit") && duration > 0) {
            const digit = parseInt(e.code.replace("Digit", ""));
            getAudioEngine().seek((digit / 10) * duration);
          }
      }
    }

    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [
    isPlaying, togglePlay, playNext, playPrev,
    volume, setVolume, isMuted, toggleMute,
    shuffle, toggleShuffle, toggleRepeat,
    duration, progress,
  ]);
}