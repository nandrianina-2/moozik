import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import type { Song, RepeatMode } from "@/types";

interface PlayerState {
  currentSong: Song | null;
  queue: Song[];
  originalQueue: Song[];
  isPlaying: boolean;
  isLoading: boolean;
  isLiked: boolean;
  volume: number;
  isMuted: boolean;
  progress: number;
  duration: number;
  shuffle: boolean;
  repeat: RepeatMode;
  crossfade: boolean;
  crossfadeDuration: number;
  
  setCrossfade: (enabled: boolean, duration?: number) => void;
  playSong: (song: Song, queue?: Song[]) => void;
  togglePlay: () => void;
  playNext: () => void;
  playPrev: () => void;
  setProgress: (p: number) => void;
  setDuration: (d: number) => void;
  setVolume: (v: number) => void;
  toggleMute: () => void;
  toggleShuffle: () => void;
  toggleRepeat: () => void;
  setLiked: (v: boolean) => void;
  addToQueue: (song: Song) => void;
  removeFromQueue: (id: string) => void;
  clearQueue: () => void;
  setLoading: (v: boolean) => void;
}

export const usePlayerStore = create<PlayerState>()(
  immer((set, get) => ({
    currentSong: null,
    queue: [],
    originalQueue: [],
    isPlaying: false,
    isLoading: false,
    isLiked: false,
    volume: 0.8,
    isMuted: false,
    progress: 0,
    duration: 0,
    shuffle: false,
    repeat: "off",
    crossfade: true,
    crossfadeDuration: 3,

    playSong: (song, queue) =>
      set((s) => {
        s.currentSong = song;
        s.isPlaying = true;
        s.progress = 0;
        s.isLiked = song.isLiked ?? false;
        if (queue) {
          s.originalQueue = queue;
          s.queue = queue.filter((q) => q.id !== song.id);
        }
      }),

    togglePlay: () =>
      set((s) => { s.isPlaying = !s.isPlaying; }),

    playNext: () => {
      const { queue, repeat, originalQueue } = get();
      if (repeat === "one") {
        set((s) => { s.progress = 0; s.isPlaying = true; });
        return;
      }
      if (queue.length === 0) {
        if (repeat === "all" && originalQueue.length > 0) {
          set((s) => {
            s.currentSong = originalQueue[0];
            s.isLiked = originalQueue[0].isLiked ?? false;
            s.queue = originalQueue.slice(1);
            s.progress = 0;
          });
        }
        return;
      }
      set((s) => {
        s.currentSong = s.queue[0];
        s.isLiked = s.queue[0].isLiked ?? false;
        s.queue = s.queue.slice(1);
        s.progress = 0;
        s.isPlaying = true;
      });
    },

    playPrev: () => {
      const { progress, originalQueue, currentSong } = get();
      if (progress > 3) {
        set((s) => { s.progress = 0; });
        return;
      }
      if (!currentSong || originalQueue.length === 0) return;
      const idx = originalQueue.findIndex((s) => s.id === currentSong.id);
      if (idx > 0) {
        set((s) => {
          s.currentSong = originalQueue[idx - 1];
          s.isLiked = originalQueue[idx - 1].isLiked ?? false;
          s.progress = 0;
          s.isPlaying = true;
        });
      }
    },

    setProgress:  (p) => set((s) => { s.progress = p; }),
    setDuration:  (d) => set((s) => { s.duration = d; }),
    setLoading:   (v) => set((s) => { s.isLoading = v; }),
    setLiked:     (v) => set((s) => { s.isLiked = v; }),

    setVolume: (v) =>
      set((s) => { s.volume = v; s.isMuted = v === 0; }),

    toggleMute: () =>
      set((s) => { s.isMuted = !s.isMuted; }),

    toggleShuffle: () =>
      set((s) => {
        s.shuffle = !s.shuffle;
        if (s.shuffle) {
          s.queue = [...s.queue].sort(() => Math.random() - 0.5);
        } else {
          if (s.currentSong) {
            const idx = s.originalQueue.findIndex((q) => q.id === s.currentSong!.id);
            s.queue = s.originalQueue.slice(idx + 1);
          }
        }
      }),

    toggleRepeat: () =>
      set((s) => {
        const modes: RepeatMode[] = ["off", "all", "one"];
        const idx = modes.indexOf(s.repeat);
        s.repeat = modes[(idx + 1) % modes.length];
      }),

    addToQueue: (song) =>
      set((s) => {
        s.queue.push(song);
        s.originalQueue.push(song);
      }),

    removeFromQueue: (id) =>
      set((s) => { s.queue = s.queue.filter((q) => q.id !== id); }),

    clearQueue: () =>
      set((s) => { s.queue = []; s.originalQueue = []; }),

    setCrossfade: (enabled, duration = 3) =>
      set((s) => {
        s.crossfade         = enabled;
        s.crossfadeDuration = duration;
      }),

  }))


);