import type { Vec3 } from '../state';
import type { ColliderBody } from './obstacles';

/* ══════════════════════════════════════════════════════════════════════════
   U-CHANNEL RETENTION  —  pure, THREE-free, deterministic.

   A bridge deck can now hold the bey up, but nothing keeps it ON. Drive into a
   curve and it slides straight off the side, which makes every curved segment
   — and the whole `u_channel` cross-section, with its authored
   `hasLeftWall` / `hasRightWall` / `sideWallHeight` — decorative.

   This is NOT the same job as obstacle sides. An obstacle is a closed
   primitive with an inside and an outside, and the body is pushed OUT. A
   channel is an open corridor: the body is pushed IN, toward a centreline that
   curves, climbs and banks. The only thing that makes it tractable is that the
   bridge builder already samples that centreline as a chain of orthonormal
   poses, so "how far am I off the track, and which way is sideways here" is a
   lookup plus a dot product rather than a geometry problem.

   Deliberately plain numbers, like the rest of `sim/`, so the retention maths
   is testable without a scene.
   ══════════════════════════════════════════════════════════════════════════ */

/**
 * One bridge segment, reduced to a drivable corridor.
 *
 * `points[i]` is a centreline sample in world space and `rights[i]` is the
 * unit sideways vector at that sample (`dir × up`). They are parallel arrays
 * rather than a list of poses because that is what the caller already has and
 * what the inner loop wants — the forward and up vectors are not needed here.
 */
export interface ChannelSegment {
  id: string;
  points: Vec3[];
  rights: Vec3[];
  /** Half the deck width. The usable corridor is this minus the body radius. */
  halfWidth: number;
  /** How far above the deck the side walls reach. Beyond it the body is
   *  airborne over the rail and is no longer retained. */
  wallHeight: number;
  /**
   * How far the running surface sits BELOW the centreline.
   *
   * A `u_channel` dips by its `depth`, so the body rides that much under the
   * sampled path while still being squarely on the deck. Omitting this made
   * the vertical gate a coin flip: with the demo pier's `depth: 2` the body sat
   * exactly `CHANNEL_DECK_TOLERANCE` below the centreline, so whether it was
   * retained came down to float noise. A `flat` section has a drop of 0.
   */
  floorDrop: number;
  hasLeftWall: boolean;
  hasRightWall: boolean;
  restitution: number;
}

/**
 * Vertical tolerance for "is the body actually on this deck".
 *
 * A deck is a surface, not a volume, and the body's tip rests exactly on it —
 * so the test has to allow a little either way. Too tight and a bey riding the
 * deck is not retained at all; too loose and a bey in the bowl gets shoved
 * sideways by a bridge passing overhead.
 */
export const CHANNEL_DECK_TOLERANCE = 2;

/**
 * Extra reach beyond the deck edge within which retention still applies.
 *
 * WITHOUT A PROXIMITY TEST A DECK RETAINS BODIES THAT ARE NOWHERE NEAR IT.
 * Lateral offset alone says "you are 886 cm to the right of this centreline",
 * which is indistinguishable from "just past the rail" to a sign test — so a
 * distant segment would yank the bey sideways onto itself. The demo arena has
 * four piers at the SAME deck height, so a bey riding one was eligible to be
 * retained by all four.
 *
 * It also bounds the segment longitudinally: a body past the final sample is
 * far from it in XZ and so fails the same check, without needing the forward
 * vector stored.
 */
export const CHANNEL_EDGE_REACH = 6;

/** Squared XZ distance, which is all the nearest-sample search needs. */
function distSqXZ(a: Vec3, bx: number, bz: number): number {
  const dx = a.x - bx, dz = a.z - bz;
  return dx * dx + dz * dz;
}

/**
 * Index of the centreline sample nearest the body in XZ.
 *
 * Linear. A segment is ~24 samples and there are a handful of segments, so
 * this is a few hundred comparisons per tick — far cheaper than the raycast
 * the surface resolver already does, and not worth an acceleration structure
 * until segment counts grow by an order of magnitude.
 */
export function nearestSampleIndex(seg: ChannelSegment, x: number, z: number): number {
  let best = -1, bestD = Infinity;
  for (let i = 0; i < seg.points.length; i++) {
    const d = distSqXZ(seg.points[i], x, z);
    if (d < bestD) { bestD = d; best = i; }
  }
  return best;
}

/**
 * Keep a body inside one segment's side walls.
 *
 * Returns true if it was pushed back in. Mutates `body.pos` / `body.vel`, the
 * same contract as `resolveObstacleSide`.
 */
export function resolveChannel(body: ColliderBody, seg: ChannelSegment): boolean {
  if (seg.points.length === 0) return false;
  if (!seg.hasLeftWall && !seg.hasRightWall) return false;

  const i = nearestSampleIndex(seg, body.pos.x, body.pos.z);
  if (i < 0) return false;

  const p = seg.points[i];
  const r = seg.rights[i];

  /* Is the body on THIS deck at all? Distance to the nearest sample covers
     both axes at once: a body far to the side fails it, and so does one past
     the end of the segment. The sample spacing is included because the nearest
     sample can legitimately be up to one step away along the track. */
  const spacing = seg.points.length > 1
    ? Math.hypot(seg.points[1].x - seg.points[0].x, seg.points[1].z - seg.points[0].z)
    : 0;
  const reach = seg.halfWidth + body.radius + spacing + CHANNEL_EDGE_REACH;
  if (distSqXZ(p, body.pos.x, body.pos.z) > reach * reach) return false;

  /* Only retain a body that is actually riding this deck. The tip is what
     rests on it, so the comparison is tip-to-deck, not centre-to-deck. */
  const tipY = body.pos.y + body.tipOffset;
  const dy   = tipY - p.y;
  if (dy < -(seg.floorDrop + CHANNEL_DECK_TOLERANCE)) return false;  // below the deck
  if (dy > seg.wallHeight)          return false;   // above the rails

  /* Signed sideways offset from the centreline. Positive is along `right`. */
  const lateral = (body.pos.x - p.x) * r.x + (body.pos.z - p.z) * r.z;
  const limit   = seg.halfWidth - body.radius;

  /* A deck narrower than the body cannot retain anything; treating `limit` as
     negative would push the body back and forth across the centreline every
     frame instead. */
  if (limit <= 0) return false;

  let nx: number, nz: number, push: number;
  if (lateral > limit && seg.hasRightWall) {
    push = lateral - limit;
    nx = -r.x; nz = -r.z;                 // shove back toward the centreline
  } else if (lateral < -limit && seg.hasLeftWall) {
    push = -limit - lateral;
    nx = r.x; nz = r.z;
  } else {
    return false;
  }

  body.pos.x += nx * push;
  body.pos.z += nz * push;

  /* Reflect only the component heading further out, for the same reason the
     obstacle resolver does: a body already returning to the centre must not be
     kicked again, or resting against a rail becomes a buzz. */
  const vn = body.vel.x * nx + body.vel.z * nz;
  if (vn < 0) {
    body.vel.x -= (1 + seg.restitution) * vn * nx;
    body.vel.z -= (1 + seg.restitution) * vn * nz;
  }
  return true;
}

/** Resolve against every segment; returns the ids that retained the body. */
export function resolveChannels(body: ColliderBody, segments: Iterable<ChannelSegment>): string[] {
  const hit: string[] = [];
  for (const s of segments) if (resolveChannel(body, s)) hit.push(s.id);
  return hit;
}
