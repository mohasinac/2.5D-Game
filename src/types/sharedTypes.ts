import * as THREE from 'three';

/* ══════════════════════════════════════════════════════════════════════════
   Shared types used by both arenaTypes and beybladeTypes.
   Kept here to prevent circular imports between the two domains.
   ══════════════════════════════════════════════════════════════════════════ */

/* ── Presentation overlay ─────────────────────────────────────────────── */

export interface PresentConfig {
  stlb64:  string | null;
  color:   number;
  scaleX:  number;
  scaleY:  number;
  scaleZ:  number;
  rotX:    number;   // degrees
  rotY:    number;
  rotZ:    number;
  offX:    number;   // cm offset relative to feature origin
  offY:    number;
  offZ:    number;
}

export function defaultPresentConfig(): PresentConfig {
  return {
    stlb64: null, color: 0xaaaaaa,
    scaleX: 1, scaleY: 1, scaleZ: 1,
    rotX: 0, rotY: 0, rotZ: 0,
    offX: 0, offY: 0, offZ: 0,
  };
}

/* ── Particle system ─────────────────────────────────────────────────── */

export type ParticlePreset =
  | 'none'
  | 'embers' | 'snow' | 'sparks' | 'dust' | 'bubbles' | 'void_motes'
  | 'rain' | 'fog' | 'ash' | 'leaves' | 'fireflies' | 'steam';

export interface ParticleConfig {
  preset:           ParticlePreset;
  mode:             'surface' | 'volume';
  density:          number;    // particles/cm² (surface) or particles/cm³ (volume)
  glowOnActivation: boolean;   // speed-line only: burst glow when target enters
  glowColor:        number;
}

export function defaultParticleConfig(): ParticleConfig {
  return {
    preset: 'none',
    mode: 'surface',
    density: 1,
    glowOnActivation: false,
    glowColor: 0x00e5ff,
  };
}

export interface ParticleSystem {
  points: THREE.Points;
  tick(dt: number): void;
  dispose(): void;
}

/* ── Weather ─────────────────────────────────────────────────────────── */

export type WeatherPreset =
  | 'none'
  | 'rain' | 'snow' | 'fog' | 'sandstorm' | 'ash' | 'mist';

export interface WeatherSystem {
  points: THREE.Points;
  windForce: THREE.Vector3;
  tick(dt: number): void;
  dispose(): void;
}

/* ── Stat modifiers (shared between arena speed-lines, jump-links, zones) ─ */

export interface BaseStatModifiers {
  spinRateMult:    number;
  staminaMult:     number;
  attackMult:      number;
  defenseMult:     number;
  weightMult:      number;
  burstResistMult: number;
}

export function defaultBaseStatModifiers(): BaseStatModifiers {
  return { spinRateMult: 1, staminaMult: 1, attackMult: 1, defenseMult: 1, weightMult: 1, burstResistMult: 1 };
}

// Multiplicative combination — 0.8 × 0.8 = 0.64, not 1.6.
export function combineStatMods(a: BaseStatModifiers, b: BaseStatModifiers): BaseStatModifiers {
  return {
    spinRateMult:    a.spinRateMult    * b.spinRateMult,
    staminaMult:     a.staminaMult     * b.staminaMult,
    attackMult:      a.attackMult      * b.attackMult,
    defenseMult:     a.defenseMult     * b.defenseMult,
    weightMult:      a.weightMult      * b.weightMult,
    burstResistMult: a.burstResistMult * b.burstResistMult,
  };
}
