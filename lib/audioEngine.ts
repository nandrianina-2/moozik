import { Howl } from "howler";
import { usePlayerStore } from "@/store/playerStore";

class AudioEngine {
  private howl: Howl | null = null;
  private progressInterval: ReturnType<typeof setInterval> | null = null;

  play(url: string) {
    this.destroy();

    const store = usePlayerStore.getState();
    store.setLoading(true);

    this.howl = new Howl({
      src: [url],
      html5: true,
      volume: store.isMuted ? 0 : store.volume,

      onload: () => {
        const duration = this.howl?.duration() ?? 0;
        usePlayerStore.getState().setDuration(duration);
        usePlayerStore.getState().setLoading(false);
      },

      onplay: () => {
        this.startProgress();
      },

      onpause: () => {
        this.stopProgress();
      },

      onstop: () => {
        this.stopProgress();
      },

      onend: () => {
        this.stopProgress();
        usePlayerStore.getState().playNext();
      },

      onloaderror: () => {
        usePlayerStore.getState().setLoading(false);
      },
    });

    this.howl.play();
  }

  pause() {
    this.howl?.pause();
  }

  resume() {
    this.howl?.play();
  }

  seek(seconds: number) {
    this.howl?.seek(seconds);
    usePlayerStore.getState().setProgress(seconds);
  }

  setVolume(v: number) {
    this.howl?.volume(v);
  }

  setMuted(muted: boolean) {
    this.howl?.mute(muted);
  }

  destroy() {
    this.stopProgress();
    this.howl?.unload();
    this.howl = null;
  }

  private startProgress() {
    this.stopProgress();
    this.progressInterval = setInterval(() => {
      if (!this.howl) return;
      const seek = this.howl.seek();
      if (typeof seek === "number") {
        usePlayerStore.getState().setProgress(seek);
      }
    }, 500);
  }

  private stopProgress() {
    if (this.progressInterval) {
      clearInterval(this.progressInterval);
      this.progressInterval = null;
    }
  }
}

// Singleton — initialisé uniquement côté client
let engine: AudioEngine | null = null;

export function getAudioEngine(): AudioEngine {
  if (typeof window === "undefined") {
    throw new Error("AudioEngine ne peut pas être utilisé côté serveur");
  }
  if (!engine) {
    engine = new AudioEngine();
  }
  return engine;
}