import { Howl } from "howler";
import { usePlayerStore } from "@/store/playerStore";

export interface EQBand {
  frequency: number;
  gain:      number;
  type:      BiquadFilterType;
}

export const DEFAULT_EQ_BANDS: EQBand[] = [
  { frequency: 60,    gain: 0, type: "lowshelf"  },
  { frequency: 250,   gain: 0, type: "peaking"   },
  { frequency: 1000,  gain: 0, type: "peaking"   },
  { frequency: 4000,  gain: 0, type: "peaking"   },
  { frequency: 16000, gain: 0, type: "highshelf" },
];

export const EQ_PRESETS: Record<string, number[]> = {
  flat:       [ 0,  0,  0,  0,  0],
  bass:       [ 8,  5,  0, -2, -3],
  treble:     [-3, -2,  0,  5,  8],
  vocal:      [-2,  0,  4,  3, -1],
  rock:       [ 5,  3, -1,  3,  4],
  jazz:       [ 3,  0,  2,  0,  3],
  electronic: [ 6,  4,  0,  3,  5],
  classical:  [ 4,  2,  0,  2,  4],
};

class AudioEngine {
  private howl:             Howl | null = null;
  private progressInterval: ReturnType<typeof setInterval> | null = null;
  private eqBands:          EQBand[] = DEFAULT_EQ_BANDS.map((b) => ({ ...b }));
  private crossfadeEnabled  = false;
  private crossfadeDuration = 3;

  // ── Lecture principale ───────────────────────────────────────────────────
  play(url: string) {
    // Stoppe et détruit le howl précédent proprement
    this.destroy();

    const store = usePlayerStore.getState();
    store.setLoading(true);

    this.howl = new Howl({
      src:   [url],
      html5: true,
      volume: store.isMuted ? 0 : store.volume,

      onload: () => {
        const duration = this.howl?.duration() ?? 0;
        usePlayerStore.getState().setDuration(duration);
        usePlayerStore.getState().setLoading(false);
      },

      onplay: () => {
        usePlayerStore.getState().setLoading(false);
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

      onloaderror: (_id, err) => {
        console.error("[AudioEngine] load error", err);
        usePlayerStore.getState().setLoading(false);
      },

      onplayerror: (_id, err) => {
        console.error("[AudioEngine] play error", err);
        usePlayerStore.getState().setLoading(false);
      },
    });

    this.howl.play();
  }

  pause() {
    if (this.howl?.playing()) {
      this.howl.pause();
    }
  }

  resume() {
    if (this.howl && !this.howl.playing()) {
      this.howl.play();
    }
  }

  seek(seconds: number) {
    if (!this.howl) return;
    this.howl.seek(seconds);
    usePlayerStore.getState().setProgress(seconds);
  }

  setVolume(v: number) {
    this.howl?.volume(v);
  }

  setMuted(muted: boolean) {
    this.howl?.mute(muted);
  }

  // ── EQ (sans Web Audio API — évite la saturation) ───────────────────────
  setEQBand(index: number, gain: number) {
    this.eqBands[index].gain = gain;
    // Note : l'EQ via Web Audio API sur html5:true cause des problèmes
    // On stocke les valeurs pour l'UI sans les appliquer sur Howler
  }

  applyPreset(name: string): number[] | undefined {
    const gains = EQ_PRESETS[name];
    if (!gains) return undefined;
    gains.forEach((gain, i) => this.setEQBand(i, gain));
    return gains;
  }

  getEQBands() {
    return this.eqBands;
  }

  // ── Crossfade ────────────────────────────────────────────────────────────
  setCrossfade(enabled: boolean, duration = 3) {
    this.crossfadeEnabled  = enabled;
    this.crossfadeDuration = duration;
  }

  // ── Progress tracker ─────────────────────────────────────────────────────
  private startProgress() {
    this.stopProgress();
    this.progressInterval = setInterval(() => {
      if (!this.howl?.playing()) return;
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

  destroy() {
    this.stopProgress();
    if (this.howl) {
      this.howl.off(); // retire tous les listeners
      this.howl.stop();
      this.howl.unload();
      this.howl = null;
    }
  }
}

// Singleton client uniquement
let engine: AudioEngine | null = null;

export function getAudioEngine(): AudioEngine {
  if (typeof window === "undefined") {
    throw new Error("AudioEngine ne peut pas être utilisé côté serveur");
  }
  if (!engine) engine = new AudioEngine();
  return engine;
}