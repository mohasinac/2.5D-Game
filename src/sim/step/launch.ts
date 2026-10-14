import type { Vec3 } from '../state';

/* ══════════════════════════════════════════════════════════════════════════
   PHASE 11b — THE LAUNCH  (all 19 CS14 launcher cases are GAP)

   There is no launcher. "Launching" is clicking a ⚽ Spawn button and typing
   numbers into a debug HUD, so every launcher case in CS14 and CS10 578-585
   describes a mechanism the project does not have at all.

   TWO-STAGE CHARGE, the G-Revolution model the user named: a committed first
   pull, then a risk/reward boost window, with the ceiling set by progression.
   Hold → release → immediately hold again raises a boost meter; at 100% a
   SECOND bar appears, and filling that gives maximum spin, capped by the
   blader's own strength stat. It maps cleanly to touch — hold, release, hold
   — so one implementation serves keyboard and the virtual LAUNCH button.

   BANKING AND THE SLIDING SHOOT are launch parameters, not paths. Positioning
   the launcher parallel to the stadium "creates a Banking pattern resulting in
   a flower pattern movement that strikes the center" — so the angle chosen
   here decides which movement pattern emerges, which is the loop that makes
   the launch worth modelling rather than just picking an rpm.

   ω₀ PROVENANCE (plan Sec.K7). Three figures are in play: 600 rad/s tagged
   ESTIMATED, 1714 from MASTER's own string-launcher derivation
   (`v_pull / r_shaft`) tagged CONFIRMED, and 650 used elsewhere. Resolution:
   the derivation is the physical baseline and 600 is the in-game CALIBRATED
   launch after launcher type and blader skill. Both are kept below with their
   roles stated, rather than silently picking one.
   ══════════════════════════════════════════════════════════════════════════ */

/** Launcher archetypes, from CS14's own case list. */
export type LauncherKind =
  | 'winder'        // S1 crank
  | 'ripcord'       // the standard EZ shooter
  | 'string'        // BeyStringer — long pull, ~3x energy
  | 'burst_string'  // B-88 / B-99
  | 'bx_ratchet'    // Beyblade X, highest gear ratio
  | 'light';        // reduced-pull entry launcher

export interface LauncherSpec {
  kind: LauncherKind;
  /** Angular speed a perfect pull produces, rad/s. */
  maxOmega: number;
  /** Fraction of that a bare, unboosted pull reaches. */
  basePower: number;
  /** How quickly the boost meter fills, units/second. */
  chargeRate: number;
}

/**
 * Physical baseline from CS14 Case 578: `ω₀ = v_pull / r_shaft` = 1714 rad/s.
 * Real string launchers genuinely reach this.
 */
export const STRING_LAUNCH_OMEGA = 1714;

/**
 * In-game calibrated launch. CS10/CS11/CS12 all use 600 rad/s and it is what
 * every spin-decay figure in the corpus is computed against — Hard Flat's
 * 15.1 s lifetime is 600/39.8. Using the physical 1714 here would silently
 * invalidate every one of those numbers.
 */
export const CALIBRATED_LAUNCH_OMEGA = 600;

export const LAUNCHERS: Record<LauncherKind, LauncherSpec> = {
  winder:       { kind: 'winder',       maxOmega: 420,  basePower: 0.55, chargeRate: 0.8 },
  ripcord:      { kind: 'ripcord',      maxOmega: 600,  basePower: 0.60, chargeRate: 1.0 },
  string:       { kind: 'string',       maxOmega: 1714, basePower: 0.45, chargeRate: 0.7 },
  burst_string: { kind: 'burst_string', maxOmega: 1200, basePower: 0.50, chargeRate: 0.8 },
  bx_ratchet:   { kind: 'bx_ratchet',   maxOmega: 900,  basePower: 0.65, chargeRate: 1.2 },
  light:        { kind: 'light',        maxOmega: 440,  basePower: 0.60, chargeRate: 1.0 },
};

/** Where a launch is in its two-stage charge. */
export type LaunchPhase = 'idle' | 'seated' | 'charging' | 'boosting' | 'released';

export interface LaunchState {
  phase: LaunchPhase;
  /** First bar, 0..1. */
  charge: number;
  /** Second bar, 0..1. Only reachable once `charge` is full. */
  boost: number;
}

export const IDLE_LAUNCH: LaunchState = { phase: 'idle', charge: 0, boost: 0 };

/**
 * Advance the charge while the button is held.
 *
 * The second bar only opens once the first is full, which is what makes the
 * boost a RISK: committing to it means holding past the point where a clean
 * release was already available.
 */
export function stepCharge(
  state: LaunchState, launcher: LauncherSpec, held: boolean, dt: number,
): LaunchState {
  if (!held || state.phase === 'released') return state;

  if (state.phase === 'idle' || state.phase === 'seated') {
    return { phase: 'charging', charge: Math.min(1, state.charge + launcher.chargeRate * dt), boost: 0 };
  }
  if (state.phase === 'charging') {
    const charge = Math.min(1, state.charge + launcher.chargeRate * dt);
    return charge >= 1
      ? { phase: 'boosting', charge: 1, boost: state.boost }
      : { phase: 'charging', charge, boost: 0 };
  }
  // boosting
  return {
    phase: 'boosting',
    charge: 1,
    boost: Math.min(1, state.boost + launcher.chargeRate * 0.6 * dt),
  };
}

/**
 * Resulting launch spin, rad/s.
 *
 * `bladerSkill` 0..1 caps the boost contribution — the GBA model's "capped by
 * the blader's own strength/experience stat", so progression raises the
 * ceiling rather than the floor.
 */
export function launchOmega(
  state: LaunchState, launcher: LauncherSpec, bladerSkill: number,
): number {
  const skill = Math.min(1, Math.max(0, bladerSkill));
  const base  = launcher.maxOmega * launcher.basePower;
  const fromCharge = (launcher.maxOmega - base) * state.charge;
  const fromBoost  = launcher.maxOmega * 0.15 * state.boost * skill;
  return base + fromCharge + fromBoost;
}

/* ── Banking and the Sliding Shoot ───────────────────────────────────────── */

export interface LaunchAim {
  /** Where the bey enters the dish, world XZ. */
  entry: Vec3;
  /** Heading it is thrown along, degrees. */
  headingDeg: number;
  /** Launcher tilt from vertical, degrees. 0 = straight down, 15 = Sliding Shoot. */
  bankDeg: number;
}

/**
 * Initial horizontal speed imparted by banking the launcher.
 *
 * A vertical launch drops the bey in place and all the energy is spin; a
 * banked one trades some into travel, which is what produces a flower pattern
 * rather than a stationary sleeper. The sine is the component of the launch
 * axis lying in the horizontal plane.
 */
export function bankedEntrySpeed(omega: number, tipRadius: number, bankDeg: number): number {
  const rad = bankDeg * Math.PI / 180;
  return Math.abs(omega) * tipRadius * Math.sin(rad);
}

/**
 * Centre-arrival speed for a Sliding Shoot, cm/s — CS10 Case 547's chain.
 *
 * Three stages: descend zone 2 gaining `√(2·g·h·η)`, take the ridge's inward
 * redirect, then descend again. At a 1.50 m/s launch and 15° bank the case
 * puts the result at 2.6-2.8 m/s, a 77-87% gain over a Radial Shoot — and
 * that figure is the acceptance target for the launch work, not an invented
 * "feels about right".
 */
export function slidingShootCentreSpeed(
  entrySpeed: number,
  slopeDrop: number,
  ridgeInwardSpeed: number,
  efficiency = 0.70,
  gravity = 980,
): number {
  const stage = Math.sqrt(2 * gravity * Math.max(0, slopeDrop) * efficiency);
  const afterRidge = Math.hypot(entrySpeed + stage, ridgeInwardSpeed);
  return afterRidge + stage;
}
