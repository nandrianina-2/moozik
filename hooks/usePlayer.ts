"use client";

import { useEffect, useRef } from "react";
import { usePlayerStore } from "@/store/playerStore";
import { getAudioEngine } from "@/lib/audioEngine";

export function usePlayer() {
  const {
    currentSong,
    isPlaying,
    volume,
    isMuted,
  } = usePlayerStore();

  const engineReady = useRef(false);
  const lastSongId  = useRef<string | null>(null);

  // Init engine une seule fois côté client
  useEffect(() => {
    engineReady.current = true;
  }, []);

  // Changement de son
  useEffect(() => {
    if (!engineReady.current || !currentSong) return;
    if (lastSongId.current === currentSong.id) return;

    lastSongId.current = currentSong.id;
    getAudioEngine().play(currentSong.audioUrl);
  }, [currentSong?.id]);

  // Play / Pause
  useEffect(() => {
    if (!engineReady.current || !currentSong) return;
    if (isPlaying) {
      getAudioEngine().resume();
    } else {
      getAudioEngine().pause();
    }
  }, [isPlaying]);

  // Volume
  useEffect(() => {
    if (!engineReady.current) return;
    getAudioEngine().setVolume(volume);
  }, [volume]);

  // Mute
  useEffect(() => {
    if (!engineReady.current) return;
    getAudioEngine().setMuted(isMuted);
  }, [isMuted]);
}