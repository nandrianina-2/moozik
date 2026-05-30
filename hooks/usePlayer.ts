"use client";

import { useEffect, useRef } from "react";
import { usePlayerStore } from "@/store/playerStore";
import { getAudioEngine } from "@/lib/audioEngine";

export function usePlayer() {
  const store = usePlayerStore();
  const engineRef = useRef<ReturnType<typeof getAudioEngine> | null>(null);

  useEffect(() => {
    engineRef.current = getAudioEngine();
  }, []);

  useEffect(() => {
    if (!store.currentSong) return;
    engineRef.current?.play(store.currentSong.audioUrl);
  }, [store.currentSong?.id]);

  useEffect(() => {
    if (!engineRef.current) return;
    if (store.isPlaying) {
      engineRef.current.resume();
    } else {
      engineRef.current.pause();
    }
  }, [store.isPlaying]);

  useEffect(() => {
    engineRef.current?.setVolume(store.volume);
  }, [store.volume]);

  useEffect(() => {
    engineRef.current?.setMuted(store.isMuted);
  }, [store.isMuted]);

  function seek(seconds: number) {
    engineRef.current?.seek(seconds);
  }

  return { ...store, seek };
}