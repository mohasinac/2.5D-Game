import * as THREE from 'three';
import type { FeedbackTier } from './BattleGauges';

/* ══════════════════════════════════════════════════════════════════════════
   BATTLE AUDIO

   The project had NO audio at runtime. Two `new Audio(dataUrl)` lines existed
   in an admin preview screen and nothing else — no listener, no sound manager,
   no SFX on hit, burst, launch or ring-out.

   DRIVEN BY THE SAME TIER AS THE JUICE. `GameFeel` already decides whether a
   contact is small, medium or large from its impulse; sound reads that same
   decision rather than re-deriving one from the impulse itself. If it derived
   its own, the two would drift and a hit could shake the screen while playing
   the quiet sample.

   LIFECYCLE MATCHES THE RENDERER, NOT THE SCENE. The listener attaches to the
   camera, and `Sandbox` destroys and recreates its renderer and camera on every
   `setVisible` — the same reason the PMREM environment is per-mount. A listener
   held across a screen switch would be parented to a dead camera.

   AUTOPLAY IS A REAL CONSTRAINT: browsers refuse to start an AudioContext until
   the user has interacted. `unlock()` is called from the battle START button,
   which is a genuine click, so the first sound of a match is never the one that
   gets swallowed.
   ══════════════════════════════════════════════════════════════════════════ */

/** Logical sounds, matching the filenames the fetcher writes. */
export type SoundId =
  | 'hit-small' | 'hit-medium' | 'hit-large'
  | 'burst' | 'launch' | 'round-win';

const TIER_SOUND: Record<FeedbackTier, SoundId> = {
  small:  'hit-small',
  medium: 'hit-medium',
  large:  'hit-large',
};

/** Per-sound gain. Impacts carry; UI cues sit under them. */
const GAIN: Record<SoundId, number> = {
  'hit-small': 0.25, 'hit-medium': 0.45, 'hit-large': 0.7,
  burst: 0.8, launch: 0.5, 'round-win': 0.6,
};

/**
 * Minimum gap between two plays of the SAME sound, ms.
 *
 * Without it a multi-contact tick fires the same sample three times in three
 * milliseconds, which does not sound louder — it sounds like a glitch.
 */
const RETRIGGER_MS = 60;

export class SoundManager {
  private listener: THREE.AudioListener | null = null;
  private buffers = new Map<SoundId, AudioBuffer>();
  private lastPlayed = new Map<SoundId, number>();
  private _muted = false;
  private _loading = false;

  /** Attach to the live camera. Call from `mountRenderer`. */
  mount(camera: THREE.Camera): void {
    if (this.listener) this.unmount();
    this.listener = new THREE.AudioListener();
    camera.add(this.listener);
    void this._loadAll();
  }

  /** Detach and release. Call from `unmountRenderer`, BEFORE the camera goes. */
  unmount(): void {
    this.listener?.parent?.remove(this.listener);
    this.listener = null;
  }

  /**
   * Resume the AudioContext from a real user gesture.
   *
   * Browsers start it suspended, and a sound played while suspended is simply
   * lost — not queued — so the launch cue would vanish without this.
   */
  unlock(): void {
    const ctx = this.listener?.context;
    if (ctx && ctx.state === 'suspended') void ctx.resume();
  }

  setMuted(muted: boolean): void { this._muted = muted; }
  get muted(): boolean { return this._muted; }

  /** Play the sample for a feedback tier — the `GameFeel` join. */
  playTier(tier: FeedbackTier, nowMs: number): void {
    this.play(TIER_SOUND[tier], nowMs);
  }

  play(id: SoundId, nowMs: number): void {
    if (this._muted || !this.listener) return;
    const buf = this.buffers.get(id);
    if (!buf) return;

    const last = this.lastPlayed.get(id) ?? -Infinity;
    if (nowMs - last < RETRIGGER_MS) return;
    this.lastPlayed.set(id, nowMs);

    /* A fresh `Audio` per play: a `THREE.Audio` cannot be restarted while it
       is still sounding, so reusing one would cut the previous hit off mid
       sample — exactly wrong for a flurry of contacts. They are cheap and the
       buffer is shared. */
    const a = new THREE.Audio(this.listener);
    a.setBuffer(buf);
    a.setVolume(GAIN[id]);
    a.play();
  }

  private async _loadAll(): Promise<void> {
    if (this._loading || this.buffers.size > 0) return;
    this._loading = true;
    const loader = new THREE.AudioLoader();
    const ids: SoundId[] = ['hit-small', 'hit-medium', 'hit-large', 'burst', 'launch', 'round-win'];

    await Promise.all(ids.map(async (id) => {
      try {
        this.buffers.set(id, await loader.loadAsync(`/audio/${id}.ogg`));
      } catch {
        /* A missing sound must never break a battle — the game is silent for
           that cue and keeps playing, exactly as a missing prop keeps its
           grey box. */
      }
    }));
    this._loading = false;
  }

  dispose(): void {
    this.unmount();
    this.buffers.clear();
    this.lastPlayed.clear();
  }
}
