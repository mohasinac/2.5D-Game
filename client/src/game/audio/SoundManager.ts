// SoundManager — lightweight Web Audio wrapper for in-game SFX.
// No external deps; uses tiny synthesized blips when no asset is provided so
// the system works out-of-the-box. Asset URLs can be registered per-event
// later (Phase 13 follow-up) and the manager will prefer them over synthesis.
//
// Persistence: master volume + muted flag stored in localStorage.

export type SoundEventKey =
  | "collision"
  | "spin-out"
  | "special-move"
  | "combo"
  | "portal"
  | "pit-enter"
  | "switch-triggered"
  | "zone-enter"
  | "gravity-pulse"
  | "countdown-tick"
  | "countdown-go"
  | "victory"
  | "defeat"
  | "ui-click";

interface SoundDef {
  freq: number;       // Hz — synthesized fallback
  durMs: number;
  type?: OscillatorType;
  gain?: number;      // 0–1 peak
  sweepTo?: number;   // optional frequency sweep target
}

const FALLBACK: Record<SoundEventKey, SoundDef> = {
  "collision":         { freq: 220, durMs: 90,  type: "square",   gain: 0.25 },
  "spin-out":          { freq: 600, durMs: 350, type: "sawtooth", gain: 0.20, sweepTo: 80 },
  "special-move":      { freq: 880, durMs: 420, type: "triangle", gain: 0.30, sweepTo: 1760 },
  "combo":             { freq: 660, durMs: 220, type: "triangle", gain: 0.30 },
  "portal":            { freq: 1320, durMs: 180, type: "sine",    gain: 0.20, sweepTo: 660 },
  "pit-enter":         { freq: 120, durMs: 300, type: "sawtooth", gain: 0.25, sweepTo: 30 },
  "switch-triggered":  { freq: 1100, durMs: 90, type: "square",   gain: 0.18 },
  "zone-enter":        { freq: 440, durMs: 140, type: "sine",     gain: 0.18 },
  "gravity-pulse":     { freq: 60,  durMs: 500, type: "sine",     gain: 0.30, sweepTo: 30 },
  "countdown-tick":    { freq: 800, durMs: 80,  type: "square",   gain: 0.20 },
  "countdown-go":      { freq: 1200, durMs: 240, type: "square",  gain: 0.30 },
  "victory":           { freq: 880, durMs: 600, type: "triangle", gain: 0.30, sweepTo: 1760 },
  "defeat":            { freq: 220, durMs: 700, type: "sawtooth", gain: 0.30, sweepTo: 80 },
  "ui-click":          { freq: 1000, durMs: 40, type: "square",   gain: 0.10 },
};

const STORAGE_KEY_VOL = "beyblade.audio.volume";
const STORAGE_KEY_MUTE = "beyblade.audio.muted";

class SoundManagerImpl {
  private ctx: AudioContext | null = null;
  private master: GainNode | null = null;
  private _volume = 0.6;
  private _muted = false;
  private assetUrls = new Map<SoundEventKey, string>();
  private bufferCache = new Map<string, AudioBuffer>();

  constructor() {
    if (typeof window !== "undefined") {
      try {
        const v = window.localStorage.getItem(STORAGE_KEY_VOL);
        if (v != null) this._volume = Math.max(0, Math.min(1, parseFloat(v) || 0.6));
        const m = window.localStorage.getItem(STORAGE_KEY_MUTE);
        if (m === "1") this._muted = true;
      } catch { /* ignore */ }
    }
  }

  /** Lazily create the audio context on first user interaction (browser policy). */
  private ensureCtx(): AudioContext | null {
    if (typeof window === "undefined") return null;
    if (!this.ctx) {
      const Ctor = (window as any).AudioContext || (window as any).webkitAudioContext;
      if (!Ctor) return null;
      this.ctx = new Ctor();
      this.master = this.ctx!.createGain();
      this.master.gain.value = this._muted ? 0 : this._volume;
      this.master.connect(this.ctx!.destination);
    }
    return this.ctx;
  }

  registerAssetUrl(event: SoundEventKey, url: string) { this.assetUrls.set(event, url); }

  get volume(): number { return this._volume; }
  setVolume(v: number) {
    this._volume = Math.max(0, Math.min(1, v));
    if (this.master) this.master.gain.value = this._muted ? 0 : this._volume;
    try { window.localStorage.setItem(STORAGE_KEY_VOL, String(this._volume)); } catch { /* ignore */ }
  }

  get muted(): boolean { return this._muted; }
  setMuted(m: boolean) {
    this._muted = m;
    if (this.master) this.master.gain.value = m ? 0 : this._volume;
    try { window.localStorage.setItem(STORAGE_KEY_MUTE, m ? "1" : "0"); } catch { /* ignore */ }
  }

  play(event: SoundEventKey) {
    if (this._muted) return;
    const ctx = this.ensureCtx();
    if (!ctx || !this.master) return;

    const url = this.assetUrls.get(event);
    if (url) {
      this.playAsset(url).catch(() => this.playSynth(event));
    } else {
      this.playSynth(event);
    }
  }

  private playSynth(event: SoundEventKey) {
    const ctx = this.ctx!;
    const def = FALLBACK[event];
    const osc = ctx.createOscillator();
    const g = ctx.createGain();
    osc.type = def.type ?? "sine";
    osc.frequency.value = def.freq;
    if (def.sweepTo) {
      osc.frequency.linearRampToValueAtTime(def.sweepTo, ctx.currentTime + def.durMs / 1000);
    }
    const peak = (def.gain ?? 0.2);
    g.gain.value = 0;
    g.gain.linearRampToValueAtTime(peak, ctx.currentTime + 0.008);
    g.gain.linearRampToValueAtTime(0, ctx.currentTime + def.durMs / 1000);
    osc.connect(g);
    g.connect(this.master!);
    osc.start();
    osc.stop(ctx.currentTime + def.durMs / 1000 + 0.02);
  }

  private async playAsset(url: string) {
    const ctx = this.ctx!;
    let buf = this.bufferCache.get(url);
    if (!buf) {
      const resp = await fetch(url);
      const arr = await resp.arrayBuffer();
      buf = await ctx.decodeAudioData(arr);
      this.bufferCache.set(url, buf);
    }
    const src = ctx.createBufferSource();
    src.buffer = buf;
    src.connect(this.master!);
    src.start();
  }
}

export const SoundManager = new SoundManagerImpl();
