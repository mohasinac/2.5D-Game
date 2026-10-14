/* ══════════════════════════════════════════════════════════════════════════
   SIGNED SPIN AND SPIN-STEAL  (ledger N4)  —  pure, THREE-free.

   `spinDir` is stored on every bey, exposed by a getter, and read by nothing.
   Every counter-spin, spin-steal and left-spin case in the corpus is blocked
   on that one unused field.

   ───────────────────────────────────────────────────────────────────────────
   A CORPUS CLAIM THAT DOES NOT SURVIVE DERIVATION, and the right answer anyway

   CS12 Case 615 gates spin-steal to counter-spin encounters "because co-spin
   contacts produce lower friction (Δv_surface is smaller when both beys spin
   in the same direction)". The stated REASON is backwards.

   Take two discs touching, seen from above, A on the left and B on the right,
   rotation measured about +Y. At the contact, A's surface moves with
   −dir_A·ω_A·r_A along the shared tangent and B's with +dir_B·ω_B·r_B — the
   sign flips because the radius vector from B's centre to the contact points
   the other way. So the slip is

       Δv = −(dir_A·ω_A·r_A + dir_B·ω_B·r_B)

   and that is LARGEST when the two directions AGREE. It is the meshing-gears
   picture: two wheels turning the same way have their surfaces sweeping past
   each other at the contact; turning opposite ways, the surfaces travel
   together. Co-spin is the high-slip case, not the low one.

   THE CONCLUSION IS STILL CORRECT, because what distinguishes counter-spin is
   not how much the surfaces slip but WHICH WAY THE RESULTING TORQUE POINTS.
   Friction at the shared contact applies the same-signed angular impulse about
   +Y to BOTH tops — on A through a radius pointing one way, on B through a
   radius pointing the other, and the two sign flips cancel. Therefore:

     • co-spin      — both tops carry the same-signed spin, one shared negative
                      torque reduces BOTH. Everybody grinds down.
     • counter-spin — the two carry opposite-signed spin, so the same torque
                      drains one and FEEDS the other. That is spin-steal, and
                      it is a transfer rather than a loss.

   This module therefore keeps spin SIGNED and applies one impulse to both.
   The steal falls out; it is not a special case anyone has to branch on.

   Recorded rather than silently "fixed" because the plan's own rule for the
   corpus (Sec.K7) is to trust a derivation over a prose thesis, and to say so
   when they disagree.
   ══════════════════════════════════════════════════════════════════════════ */

/** A top reduced to what a spin exchange needs. Spin is SIGNED about +Y. */
export interface SpinBody {
  id: string;
  /** Signed angular velocity about +Y, rad/s. Negative is left-spin. */
  spin: number;
  /** Moment of inertia about the spin axis, g·cm². */
  inertiaSpin: number;
  /** Contact radius at which the rub happens, cm. */
  contactRadius: number;
}

export interface SpinExchange {
  a: string;
  b: string;
  /** Relative surface speed at the contact, cm/s. Co-spin makes this large. */
  slipSpeed: number;
  /** Signed angular impulse applied about +Y, g·cm²/s. */
  angularImpulse: number;
  /** Change in |spin| for each. Negative is a loss, positive a gain. */
  deltaMagA: number;
  deltaMagB: number;
  /** True when the two tops were turning opposite ways. */
  counterSpin: boolean;
}

/**
 * Slip speed at the contact, cm/s.
 *
 * Exported on its own because it is the quantity the corpus gets backwards,
 * and having it testable in isolation is what makes that checkable.
 */
export function contactSlipSpeed(a: SpinBody, b: SpinBody): number {
  return Math.abs(a.spin * a.contactRadius + b.spin * b.contactRadius);
}

/** Were these two turning opposite ways? Zero spin counts as neither. */
export function isCounterSpin(a: SpinBody, b: SpinBody): boolean {
  return a.spin * b.spin < 0;
}

/**
 * Exchange spin through friction at a contact.
 *
 * `normalImpulse` is the contact impulse from `resolveBeyPair`, and
 * `friction` the pair's effective coefficient. The friction impulse is
 * `μ · J_n`, capped so it cannot do more than eliminate the slip — without
 * that cap a hard hit between two slow tops would reverse both, which is not
 * friction, it is a collision with a wall.
 *
 * Mutates `a.spin` / `b.spin`.
 */
export function applySpinExchange(
  a: SpinBody,
  b: SpinBody,
  normalImpulse: number,
  friction: number,
): SpinExchange {
  const slipSigned = a.spin * a.contactRadius + b.spin * b.contactRadius;
  const slipSpeed  = Math.abs(slipSigned);
  const counter    = isCounterSpin(a, b);

  const beforeA = Math.abs(a.spin);
  const beforeB = Math.abs(b.spin);

  if (slipSpeed < 1e-9 || normalImpulse <= 0 || friction <= 0) {
    return {
      a: a.id, b: b.id, slipSpeed, angularImpulse: 0,
      deltaMagA: 0, deltaMagB: 0, counterSpin: counter,
    };
  }

  const invIa = a.inertiaSpin > 0 ? 1 / a.inertiaSpin : 0;
  const invIb = b.inertiaSpin > 0 ? 1 / b.inertiaSpin : 0;
  const denom = a.contactRadius * a.contactRadius * invIa
              + b.contactRadius * b.contactRadius * invIb;
  if (denom <= 0) {
    return {
      a: a.id, b: b.id, slipSpeed, angularImpulse: 0,
      deltaMagA: 0, deltaMagB: 0, counterSpin: counter,
    };
  }

  /* Coulomb cap: friction can remove the slip but never reverse it. Past that
     point the surfaces are rolling together and there is nothing left to rub. */
  const impulseToKillSlip = slipSpeed / denom;
  const coulomb = friction * normalImpulse;
  const magnitude = Math.min(coulomb, impulseToKillSlip);

  /* One signed impulse, applied to BOTH. This single line is what makes
     counter-spin a transfer and co-spin a shared loss. */
  const j = Math.sign(slipSigned) * magnitude;
  a.spin -= j * a.contactRadius * invIa;
  b.spin -= j * b.contactRadius * invIb;

  return {
    a: a.id, b: b.id,
    slipSpeed,
    angularImpulse: j,
    deltaMagA: Math.abs(a.spin) - beforeA,
    deltaMagB: Math.abs(b.spin) - beforeB,
    counterSpin: counter,
  };
}

/** Signed spin from a magnitude and a direction label. */
export function signedSpin(omega: number, dir: 'right' | 'left'): number {
  return dir === 'left' ? -Math.abs(omega) : Math.abs(omega);
}

/** Direction label back out of a signed spin. Zero reads as right. */
export function spinDirOf(spin: number): 'right' | 'left' {
  return spin < 0 ? 'left' : 'right';
}
