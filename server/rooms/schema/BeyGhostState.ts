// Phase 27 Tiered AoI — BeyGhostState.
// Lightweight shadow schema synced at 10Hz for beyblades in the outer zone (60–100cm).
// Tier 0: dot only (minimap); Tier 1: faded sprite; Tier 2: full (≤60cm).

import { Schema, type } from "@colyseus/schema";

export class BeyGhostState extends Schema {
  /** Session ID of the owning beyblade (matches Beyblade.id key in beyblades map) */
  @type("string") id: string = "";

  /** Physics-space position in cm */
  @type("number") x_cm: number = 0;
  @type("number") y_cm: number = 0;

  /** Floor index (multi-floor arenas) */
  @type("int8") floorIndex: number = 0;

  /** Team identifier (for colour-coding on minimap) */
  @type("string") teamId: string = "";

  /**
   * AoI tier:
   *  2 = Full (≤60cm — full sprite, particles, spin ring)
   *  1 = Shadow (60–100cm — faded sprite, no FX)
   *  0 = Ghost/dot (>100cm — minimap dot only)
   */
  @type("uint8") tier: number = 2;

  /** Velocity in cm/s — used by client for smooth interpolation */
  @type("number") vx_cm: number = 0;
  @type("number") vy_cm: number = 0;

  /** Gyroscopic tilt angle (degrees, 0=upright) */
  @type("number") tiltAngle: number = 0;

  /** Spin as a percentage 0–100 (saves bits vs float32 spin/maxSpin) */
  @type("uint8") spin_pct: number = 0;

  /** Beyblade type for client colour mapping */
  @type("string") beyType: string = "balanced";

  /** Username label shown on minimap */
  @type("string") username: string = "";
}
