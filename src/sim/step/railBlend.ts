import type { Vec3 } from '../state';

/* ══════════════════════════════════════════════════════════════════════════
   PHASE 8 — RAIL BLENDING, GRIP, AND THE TORNADO RIDGE

   Two jobs that are really one.

   THE BLEND (plan Sec.C2 and N2). Three things want to steer the bey: its own
   parts-driven pattern, the blader, and whatever rail it is riding. The design
   spine is that these COMPETE rather than override:

       desired = normalize(
           lerp(beyIntent, playerIntent, authority) × (1 − grip)
         + railIntent × grip )

   `controlAuthority` is the Gen-1-vs-Gen-3 dial — 1 means Tyson commands
   Dragoon, 0 means the parts decide and the player is a passenger. `grip` is
   how well the rail has hold, and crucially it CAN FAIL.

   THE RIDGE (CS10 Cases 545-547). That failure is the documented behaviour of
   the BB-10 Tornado Ridge, whose whole purpose per Beywiki is to let attack
   types "move around quickly without accidentally knocking themselves out" —
   a retainer you are still able to cross. The same source notes the ridge "is
   insubstantial because of its short height, and often Attack Types fail to
   grab the Tornado Ridge, which results in a loss of speed."

   So a slow bey slides past and loses speed instead of being snapped onto the
   rail, and a fast one crosses. Neither is a special case here; both come out
   of the impulse split below.
   ══════════════════════════════════════════════════════════════════════════ */

/** Normalised XZ, with a safe fallback so a zero vector cannot yield NaN. */
function unitXZ(x: number, z: number, fallback: Vec3): Vec3 {
  const len = Math.hypot(x, z);
  if (len < 1e-9) return fallback;
  return { x: x / len, y: 0, z: z / len };
}

/**
 * Blend the bey's own intent, the player's, and the rail's.
 *
 * `authority` 0..1 and `grip` 0..1. Both are clamped rather than trusted:
 * they arrive from stats and from `gripFactor`, and a value outside the range
 * would silently invert the blend.
 */
export function blendSteering(
  beyIntent: Vec3,
  playerIntent: Vec3,
  railIntent: Vec3,
  authority: number,
  grip: number,
): Vec3 {
  const a = Math.min(1, Math.max(0, authority));
  const g = Math.min(1, Math.max(0, grip));

  /* The player term is only as strong as the input actually given: a blader
     not touching the stick must not drag the bey toward the origin. */
  const playerMag = Math.hypot(playerIntent.x, playerIntent.z);
  const ax = beyIntent.x + (playerIntent.x - beyIntent.x) * a * Math.min(1, playerMag);
  const az = beyIntent.z + (playerIntent.z - beyIntent.z) * a * Math.min(1, playerMag);

  const x = ax * (1 - g) + railIntent.x * g;
  const z = az * (1 - g) + railIntent.z * g;
  return unitXZ(x, z, beyIntent);
}

/* ── The Tornado Ridge ──────────────────────────────────────────────────── */

/**
 * A ridge as physics sees it. Geometry comes from CS10 Case 545's five-zone
 * cross-section; this is the part the bey interacts with.
 */
export interface RidgeSpec {
  /** Radius at which the ridge sits, cm. */
  radius: number;
  /** Ridge height, cm. The MFB Attack Type's is ~3 mm at 170 mm scale. */
  height: number;
  /** Half-width of the ridge face, cm. With `height` this sets the face angle. */
  halfWidth: number;
  /** Restitution of the ridge material. */
  restitution: number;
}

/**
 * Face angle β of the ridge, radians: `β = atan(h / w_half)`.
 *
 * The single number that decides whether a ridge redirects or launches, and
 * the reason CS10 Case 546 concludes LOW AND SHARP BEATS TALL. An MFB ridge
 * (3 mm over 10 mm) sits at 16.7°, so cos β = 0.957 and almost all of the
 * impulse goes back toward the centre. A plastic-gen 10 mm ridge is at 45°,
 * wasting half the impulse lifting the bey — and popping it 156 mm into the
 * air against the MFB's 26 mm.
 */
export function ridgeFaceAngle(ridge: RidgeSpec): number {
  return Math.atan2(ridge.height, ridge.halfWidth);
}

export interface RidgeImpulseSplit {
  /** Component redirecting the bey back toward the centre. The useful part. */
  inward: number;
  /** Component lifting it over. Wasted, and the route to a self-knockout. */
  vertical: number;
  /** Face angle used, radians. */
  beta: number;
}

/**
 * Split a radial approach into redirect-versus-lift.
 *
 * `J_total = m·v_r·(1 + e)`, then `J_inward = J·cos β` and
 * `J_vertical = J·sin β` — CS10 Case 546 verbatim.
 */
export function ridgeImpulseSplit(
  mass: number,
  radialSpeed: number,
  ridge: RidgeSpec,
): RidgeImpulseSplit {
  const beta = ridgeFaceAngle(ridge);
  const total = mass * Math.abs(radialSpeed) * (1 + ridge.restitution);
  return {
    inward:   total * Math.cos(beta),
    vertical: total * Math.sin(beta),
    beta,
  };
}

/**
 * How well the ridge has hold of this bey, 0..1.
 *
 * THE FAILURE CASE IS THE POINT. A short ridge and a slow bey give a grip
 * near zero: the bey slides past, loses a little speed, and is NOT snapped
 * onto the rail — reproducing the documented "fails to grab the Tornado
 * Ridge" behaviour instead of hard-locking the path, which is what the old
 * speed-line code did.
 *
 * Three things feed it: whether the bey is near the ridge at all, whether its
 * contact lip is low enough to engage (Case 546's engagement window — a tall
 * Burst-era blade base rides straight over a 3 mm ridge), and whether it is
 * moving slowly enough radially to be turned rather than to cross.
 */
export function gripFactor(
  ridge: RidgeSpec,
  distanceFromRidge: number,
  contactLipHeight: number,
  radialSpeed: number,
  crossSpeed: number,
): number {
  /* Out of reach of the ridge entirely. */
  const reach = ridge.halfWidth * 2;
  if (Math.abs(distanceFromRidge) > reach) return 0;

  /* ENGAGEMENT WINDOW: a part engages only if its outer contact lip sits at
     or below the ridge crest. This is why Burst-era and Plastic-era beys ride
     the same dish differently, for free, once contact height comes from the
     spec rather than a shared constant. */
  if (contactLipHeight > ridge.height) return 0;

  /* Proximity falloff — strongest dead on the ridge line. */
  const near = 1 - Math.abs(distanceFromRidge) / reach;

  /* Too fast radially and it crosses instead of turning. */
  const speedFactor = crossSpeed > 0
    ? Math.min(1, Math.max(0, 1 - Math.abs(radialSpeed) / crossSpeed))
    : 1;

  return near * speedFactor;
}

/**
 * Speed above which a bey crosses the ridge instead of being turned by it.
 *
 * Derived rather than tuned: the bey crosses when its radial kinetic energy
 * exceeds the work needed to lift its mass over the crest, which is why a
 * taller ridge is harder to cross and a heavier bey needs more speed.
 */
export function ridgeCrossSpeed(ridge: RidgeSpec, gravity = 980): number {
  return Math.sqrt(2 * gravity * Math.max(0, ridge.height));
}

/** Tangential unit direction along a ridge at a bearing, for the rail intent. */
export function ridgeTangent(theta: number, clockwise: boolean): Vec3 {
  const s = clockwise ? -1 : 1;
  return { x: -Math.sin(theta) * s, y: 0, z: Math.cos(theta) * s };
}
