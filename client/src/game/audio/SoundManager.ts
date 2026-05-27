// SoundManager — lightweight Web Audio wrapper for in-game SFX.
// No external deps; uses tiny synthesized blips when no asset is provided so
// the system works out-of-the-box. Asset URLs can be registered per-event
// later (Phase 13 follow-up) and the manager will prefer them over synthesis.
//
// Persistence: master volume + muted flag stored in localStorage under the
// SAME keys as the player SettingsPage (beyblade_settings.masterVolume) so
// the sliders and in-game sound are always in sync.

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

// Shared localStorage key with player SettingsPage so sliders are always in sync.
const SETTINGS_STORAGE_KEY = "beyblade_settings";

// Legacy per-key storage (kept for backward compat read).
const STORAGE_KEY_VOL  = "beyblade.audio.volume";
const STORAGE_KEY_MUTE = "beyblade.audio.muted";

function readVolFromStorage(): number {
  try {
    // Prefer the shared settings object first.
    const raw = localStorage.getItem(SETTINGS_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as { masterVolume?: number };
      if (typeof parsed.masterVolume === "number") {
        return Math.max(0, Math.min(1, parsed.masterVolume / 100));
      }
    }
    // Fall back to legacy key.
    const v = localStorage.getItem(STORAGE_KEY_VOL);
    if (v != null) return Math.max(0, Math.min(1, parseFloat(v) || 0.6));
  } catch { /* ignore */ }
  return 0.6;
}

function readMuteFromStorage(): boolean {
  try {
    const m = localStorage.getItem(STORAGE_KEY_MUTE);
    return m === "1";
  } catch { return false; }
}

class SoundManagerImpl {
  private ctx: AudioContext | null = null;
  private master: GainNode | null = null;
  private _volume: number;
  private _muted: boolean;
  private assetUrls = new Map<SoundEventKey, string>();
  private bufferCache = new Map<string, AudioBuffer>();
  // True after the first user interaction that unlocked the AudioContext.
  private _unlocked = false;

  constructor() {
    this._volume = typeof window !== "undefined" ? readVolFromStorage() : 0.6;
    this._muted  = typeof window !== "undefined" ? readMuteFromStorage() : false;

    // Listen for SettingsPage writes so in-game volume stays in sync.
    if (typeof window !== "undefined") {
      window.addEventListener("storage", (e) => {
        if (e.key === SETTINGS_STORAGE_KEY && e.newValue) {
          try {
            const parsed = JSON.parse(e.newValue) as { masterVolume?: number; sfxVolume?: number };
            if (typeof parsed.masterVolume === "number") {
              this._volume = Math.max(0, Math.min(1, parsed.masterVolume / 100));
              if (this.master) this.master.gain.value = this._muted ? 0 : this._volume;
            }
          } catch { /* ignore */ }
        }
      });
    }
  }

  /** Call once on any user interaction (click/touch) to lift browser autoplay block. */
  unlock(): void {
    if (this._unlocked) return;
    const ctx = this.ensureCtx();
    if (ctx && ctx.state === "suspended") {
      ctx.resume().catch(() => {});
    }
    this._unlocked = true;
  }

  /** Lazily create the AudioContext; resume if suspended (browser autoplay policy). */
  private ensureCtx(): AudioContext | null {
    if (typeof window === "undefined") return null;
    if (!this.ctx) {
      const Ctor = (window as unknown as { AudioContext?: typeof AudioContext; webkitAudioContext?: typeof AudioContext }).AudioContext
                ?? (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
      if (!Ctor) return null;
      this.ctx   = new Ctor();
      this.master = this.ctx.createGain();
      this.master.gain.value = this._muted ? 0 : this._volume;
      this.master.connect(this.ctx.destination);
    }
    // Browsers suspend AudioContext until a user-gesture fires.
    // Resume on every play() call — a no-op if already running.
    if (this.ctx.state === "suspended") {
      this.ctx.resume().catch(() => {});
    }
    return this.ctx;
  }

  registerAssetUrl(event: SoundEventKey, url: string) { this.assetUrls.set(event, url); }

  get volume(): number { return this._volume; }
  setVolume(v: number) {
    this._volume = Math.max(0, Math.min(1, v));
    if (this.master) this.master.gain.value = this._muted ? 0 : this._volume;
    // Write to both storage keys so legacy code and SettingsPage stay in sync.
    try {
      localStorage.setItem(STORAGE_KEY_VOL, String(this._volume));
      const raw = localStorage.getItem(SETTINGS_STORAGE_KEY);
      const obj = raw ? JSON.parse(raw) as Record<string, unknown> : {};
      obj.masterVolume = Math.round(this._volume * 100);
      localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(obj));
    } catch { /* ignore */ }
  }

  get muted(): boolean { return this._muted; }
  setMuted(m: boolean) {
    this._muted = m;
    if (this.master) this.master.gain.value = m ? 0 : this._volume;
    try { localStorage.setItem(STORAGE_KEY_MUTE, m ? "1" : "0"); } catch { /* ignore */ }
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
    // If still suspended (user hasn't interacted yet), skip silently.
    if (ctx.state !== "running") return;
    const def = FALLBACK[event];
    const osc = ctx.createOscillator();
    const g   = ctx.createGain();
    osc.type = def.type ?? "sine";
    osc.frequency.value = def.freq;
    if (def.sweepTo) {
      osc.frequency.linearRampToValueAtTime(def.sweepTo, ctx.currentTime + def.durMs / 1000);
    }
    const peak = def.gain ?? 0.2;
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
    if (ctx.state !== "running") return;
    let buf = this.bufferCache.get(url);
    if (!buf) {
      const resp = await fetch(url);
      const arr  = await resp.arrayBuffer();
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
