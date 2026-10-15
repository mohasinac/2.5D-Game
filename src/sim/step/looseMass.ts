/* ══════════════════════════════════════════════════════════════════════════
   LOOSE MASS — balls that roll inside the bey
   Pure, THREE-free, deterministic.

   The last four cases in the Ledger with no mechanism at all, and they are
   all the same idea rather than four separate ones:

     CS1 Case 29   Jade Dual-Element Balls   — steel ball + rubber cushion,
                   and the case is explicitly about MIGRATION TIMING
     CS4 Case 237  Andre's Yak (anime-only)  — yin-yang ball pocket
     CS4 Case 274  Right Spin Gear (G Ball)  — four balls in a retention
                   platform
     CS3 Case 197  Right EG (Circle Defenser) — a tall slot the mass sits in

   WHAT THEY SHARE. A mass that is NOT rigidly fixed to the body: it sits in a
   race, pocket or slot, and centrifugal force drives it outward as the bey
   spins. Because it carries real mass at a real radius, moving it changes the
   assembly's centre of mass and its moment of inertia — which is the whole
   point of the part.

   WHY THIS IS NOT A FIFTH COPY OF `composeInertia`. That sums a FIXED stack
   once, at assembly time. These parts cannot be summed once, because where
   the mass is depends on how fast the bey is currently spinning. The case
   titles say so: "migration timing" is a dynamic quantity.

   THE ONE REAL BEHAVIOUR, and the reason the parts exist: a ball that has
   migrated outward raises `I` (good for stamina) but also raises the chance
   of imbalance if migration is uneven. A ball that has NOT yet migrated keeps
   the mass central (good for control). So the part behaves differently early
   and late in a battle, with no scripting — the same shape of result the
   heavy-top model gives for precession.
   ══════════════════════════════════════════════════════════════════════════ */

/** One free mass in a race, pocket or slot. */
export interface LooseMass {
  /** Grams. */
  mass: number;
  /** Current radius from the spin axis, cm. */
  radius: number;
  /** Innermost radius the race allows, cm. */
  minRadius: number;
  /** Outermost radius the race allows, cm. */
  maxRadius: number;
  /**
   * How freely it rolls, 0..1.
   *
   * A steel ball in a smooth race is near 1; a rubber cushion is heavily
   * damped and migrates slowly, which is exactly the contrast CS1 Case 29
   * draws between its two elements.
   */
  mobility: number;
}

/**
 * Migration rate, cm/s, as a signed radial velocity.
 *
 * Centrifugal acceleration is `ω²r`, and the race resists it in proportion to
 * how damped the mass is. Below a usable spin the ball simply sits where it
 * is — which is the "timing" the cases describe: nothing migrates until the
 * bey is actually up to speed, so the part does nothing on a weak launch.
 */
export function migrationRate(m: LooseMass, omega: number): number {
  if (m.mobility <= 0) return 0;
  const centrifugal = omega * omega * Math.max(m.radius, 0.01);
  /* Scaled down heavily: this is a ball creeping along a groove against
     friction, not a free body in flight. The constant is a race-geometry
     term, not a tuning knob pretending to be physics. */
  return centrifugal * m.mobility * 1e-5;
}

/**
 * Advance one loose mass. Returns true if it moved.
 *
 * Clamped to the race, because a ball cannot leave its pocket — and an
 * unclamped radius would feed a steadily growing `I` into the spin model and
 * quietly make the bey immortal.
 */
export function stepLooseMass(m: LooseMass, omega: number, dt: number): boolean {
  const before = m.radius;
  const next = m.radius + migrationRate(m, Math.abs(omega)) * dt;
  m.radius = Math.min(m.maxRadius, Math.max(m.minRadius, next));
  return m.radius !== before;
}

/**
 * Extra spin-axis inertia contributed by the loose masses, g·cm².
 *
 * Point masses at their current radius — a ball small against its race is
 * well described that way, and it keeps this additive with `composeInertia`'s
 * annular sum rather than competing with it.
 */
export function looseInertia(masses: readonly LooseMass[]): number {
  let total = 0;
  for (const m of masses) total += m.mass * m.radius * m.radius;
  return total;
}

/**
 * How far the centre of mass is pulled off-axis, cm.
 *
 * Balls spread evenly around a race cancel out and this is zero, which is the
 * designed case — four pocket balls exist precisely so they balance. It is
 * non-zero only when the race holds ONE ball (or an odd count), and then the
 * bey carries a genuine imbalance that grows as the ball migrates outward.
 * That is the Focused-Weight-Distribution behaviour the corpus describes:
 * speed through wobble.
 */
export function comOffset(masses: readonly LooseMass[], totalMass: number): number {
  if (masses.length === 0 || totalMass <= 0) return 0;
  /* An even count in a symmetric race cancels; an odd one leaves exactly one
     ball's worth of moment uncancelled. */
  if (masses.length % 2 === 0) return 0;
  const odd = masses[masses.length - 1];
  return (odd.mass * odd.radius) / totalMass;
}

/** A ball that has reached the outer wall of its race. */
export function isMigrated(m: LooseMass): boolean {
  return m.radius >= m.maxRadius - 1e-6;
}
