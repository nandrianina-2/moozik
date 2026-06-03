import { Howl } from "howler";
import { usePlayerStore } from "@/store/playerStore";

// ── Types EQ ────────────────────────────────────────────────────────────────
export interface EQBand {
  frequency: number;
  gain:      number;
  type:      BiquadFilterType;
}

export const DEFAULT_EQ_BANDS: EQBand[] = [
  { frequency: 60,   gain: 0, type: "lowshelf" },
  { frequency: 250,  gain: 0, type: "peaking"  },
  { frequency: 1000, gain: 0, type: "peaking"  },
  { frequency: 4000, gain: 0, type: "peaking"  },
  { frequency: 16000,gain: 0, type: "highshelf" },
];

export const EQ_PRESETS: Record<string, number[]> = {
  flat:       [0,  0,  0,  0,  0],
  bass:       [8,  5,  0, -2, -3],
  treble:     [-3,-2,  0,  5,  8],
  vocal:      [-2, 0,  4,  3, -1],
  rock:       [5,  3, -1,  3,  4],
  jazz:       [3,  0,  2,  0,  3],
  electronic: [6,  4,  0,  3,  5],
  classical:  [4,  2,  0,  2,  4],
};

// ── AudioEngine ──────────────────────────────────────────────────────────────
class AudioEngine {
  private howl:             Howl | null = null;
  private prevHowl:         Howl | null = null;
  private progressInterval: ReturnType<typeof setInterval> | null = null;
  private audioCtx:         AudioContext | null = null;
  private gainNode:         GainNode | null = null;
  private eqNodes:          BiquadFilterNode[] = [];
  private eqBands:          EQBand[] = DEFAULT_EQ_BANDS.map((b) => ({ ...b }));
  private crossfadeDuration = 3; // secondes
  private crossfadeEnabled  = true;

  // ── Initialise Web Audio API ─────────────────────────────────────────────
  private initAudioCtx() {
    if (this.audioCtx) return;
    this.audioCtx = new AudioContext();
    this.gainNode = this.audioCtx.createGain();

    // Chaîne EQ → gain → sortie
    let prev: AudioNode = this.gainNode;
    this.eqNodes = this.eqBands.map((band) => {
      const node = this.audioCtx!.createBiquadFilter();
      node.type            = band.type;
      node.frequency.value = band.frequency;
      node.gain.value      = band.gain;
      node.connect(prev);
      prev = node;
      return node;
    });

    // Dernier nœud EQ → destination
    this.eqNodes[this.eqNodes.length - 1]
      .connect(this.audioCtx.destination);
  }

  // ── Lecture ──────────────────────────────────────────────────────────────
  play(url: string) {
    const store = usePlayerStore.getState();
    store.setLoading(true);

    // Crossfade : garde l'ancien howl et le fade out
    if (this.howl && this.crossfadeEnabled) {
      const old = this.howl;
      old.fade(old.volume(), 0, this.crossfadeDuration * 1000);
      setTimeout(() => { old.unload(); }, this.crossfadeDuration * 1000 + 100);
      this.prevHowl = old;
    } else {
      this.destroy(false);
    }

    this.howl = new Howl({
      src:   [url],
      html5: true,
      volume: store.isMuted ? 0 : store.volume,

      onload: () => {
        const duration = this.howl?.duration() ?? 0;
        usePlayerStore.getState().setDuration(duration);
        usePlayerStore.getState().setLoading(false);

        // Fade in si crossfade activé
        if (this.crossfadeEnabled && this.prevHowl) {
          this.howl?.volume(0);
          this.howl?.play();
          this.howl?.fade(0, store.isMuted ? 0 : store.volume,
            this.crossfadeDuration * 1000);
        } else {
          this.howl?.play();
        }
      },

      onplay:  () => { this.startProgress(); },
      onpause: () => { this.stopProgress(); },
      onstop:  () => { this.stopProgress(); },
      onend:   () => {
        this.stopProgress();
        usePlayerStore.getState().playNext();
      },
      onloaderror: () => {
        usePlayerStore.getState().setLoading(false);
      },
    });

    // Si pas de crossfade, on play directement au onload
    if (!this.crossfadeEnabled) {
      this.howl.load();
    }
  }

  pause()  { this.howl?.pause(); }
  resume() { this.howl?.play();  }

  seek(seconds: number) {
    this.howl?.seek(seconds);
    usePlayerStore.getState().setProgress(seconds);
  }

  setVolume(v: number) { this.howl?.volume(v); }
  setMuted(m: boolean) { this.howl?.mute(m);   }

  // ── Crossfade ────────────────────────────────────────────────────────────
  setCrossfade(enabled: boolean, duration = 3) {
    this.crossfadeEnabled  = enabled;
    this.crossfadeDuration = duration;
  }

  // ── EQ ───────────────────────────────────────────────────────────────────
  setEQBand(index: number, gain: number) {
    if (this.eqNodes[index]) {
      this.eqNodes[index].gain.value = gain;
    }
    this.eqBands[index].gain = gain;
  }

  applyPreset(name: string) {
    const gains = EQ_PRESETS[name];
    if (!gains) return;
    gains.forEach((gain, i) => this.setEQBand(i, gain));
    return gains;
  }

  getEQBands() { return this.eqBands; }

  // ── Progress ─────────────────────────────────────────────────────────────
  private startProgress() {
    this.stopProgress();
    this.progressInterval = setInterval(() => {
      if (!this.howl) return;
      const seek = this.howl.seek();
      if (typeof seek === "number") {
        usePlayerStore.getState().setProgress(seek);

        // Auto crossfade : démarre le suivant X secondes avant la fin
        const dur = this.howl.duration();
        if (
          this.crossfadeEnabled &&
          dur > 0 &&
          seek >= dur - this.crossfadeDuration - 0.5 &&
          seek < dur - this.crossfadeDuration
        ) {
          const { queue } = usePlayerStore.getState();
          if (queue.length > 0) {
            // Signal le store pour préparer le prochain sans couper l'actuel
            usePlayerStore.getState().setLoading(false);
          }
        }
      }
    }, 500);
  }

  private stopProgress() {
    if (this.progressInterval) {
      clearInterval(this.progressInterval);
      this.progressInterval = null;
    }
  }

  destroy(unloadHowl = true) {
    this.stopProgress();
    if (unloadHowl) {
      this.howl?.unload();
      this.howl = null;
    }
  }
}

// Singleton client
let engine: AudioEngine | null = null;

export function getAudioEngine(): AudioEngine {
  if (typeof window === "undefined") {
    throw new Error("AudioEngine ne peut pas être utilisé côté serveur");
  }
  if (!engine) engine = new AudioEngine();
  return engine;
}