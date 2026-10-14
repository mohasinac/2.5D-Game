import type { Vec3 } from '../state';

/* ══════════════════════════════════════════════════════════════════════════
   LATERAL OBSTACLE COLLISION  —  pure, THREE-free, deterministic.

   Standing on top of an obstacle already works: `SpawnManager._resolveSurface`
   raycasts the scene and an obstacle's top face is just another surface under
   the bey's feet. What has never existed is the *side* of one. The Tower
   arena's central pillar — a `frustum` obstacle several times the bey's height
   — could be driven straight through; you only noticed it at all if you
   happened to pass over the top and land on it.

   WHY ANALYTIC AND NOT THE MESH
   A downward raycast answers "what is beneath me", which is the wrong question
   for a wall. Sideways sweeps against arbitrary triangle soup are both costlier
   and less stable than a closest-point test against the primitive the author
   actually placed, and the project has already committed to this split: a
   shipped `.glb` prop is drawn in place of the primitive, and `ObstacleData`
   says outright that "collision always uses the primitive either way". So a
   detailed boat model still collides as the box it was authored as, which is
   faster and — more importantly — predictable.

   The whole module is plain numbers so it can be unit-tested without a browser,
   a scene or a mesh, which is the entire point of `sim/`.
   ══════════════════════════════════════════════════════════════════════════ */

/** Horizontal footprint of an obstacle at one height. */
export type CrossSection =
  | { kind: 'circle'; r: number }
  /** Half-extents in the obstacle's own frame, before `rotYDeg`. */
  | { kind: 'box'; hx: number; hz: number };

/**
 * An obstacle reduced to what collision actually needs.
 *
 * Deliberately not `ObstacleData`: that type carries meshes, colours, STL blobs
 * and a surface-tile string, none of which belong in a physics step. Building
 * one of these is the caller's job (it owns the THREE types); resolving against
 * it is this module's.
 */
export interface ObstacleCollider {
  id: string;
  /** Centre of the primitive in world space — every obstacle shape is built
   *  origin-centred and then positioned, so `cy` is the middle, not the base. */
  cx: number; cy: number; cz: number;
  halfHeight: number;
  /** Yaw in degrees. Only meaningful for `box`; a circle is rotation-invariant. */
  rotYDeg: number;
  /** Footprint at the BOTTOM of the primitive. */
  bottom: CrossSection;
  /** Footprint at the TOP. A cylinder repeats `bottom`; a frustum narrows; a
   *  pyramid goes to zero. Interpolated linearly in between — which is exact
   *  for cones and frusta and correct for prisms. */
  top: CrossSection;
  /** Bounce factor from the obstacle's `ArenaMaterial`. */
  restitution: number;
  /** True for `sphere`, where the footprint is a circular arc in Y rather than
   *  a linear taper and must be computed from the radius. */
  spherical?: boolean;
}

/** Everything the resolver needs to know about the body doing the colliding. */
export interface ColliderBody {
  pos: Vec3;
  vel: Vec3;
  radius: number;
  /** Signed offset from `pos.y` to the tip — negative. */
  tipOffset: number;
  /** Signed offset from `pos.y` to the crown — positive. */
  topOffset: number;
}

/**
 * Contact tolerance. Below this penetration we leave the body alone: resolving
 * sub-millimetre overlaps every frame produces jitter, not accuracy, and 1 mm
 * is the project's stated minimum feature size anyway.
 */
export const OBSTACLE_CONTACT_EPS = 0.1;

/**
 * Clearance above an obstacle's top face within which lateral collision is
 * suppressed.
 *
 * Without it the side and the top fight each other. A bey resting on an
 * obstacle has its tip exactly at the top face, which is also — to the
 * floating-point digit — inside the side wall's vertical span. The surface
 * resolver would hold it up while this function shoved it sideways, and the
 * bey would crawl off the edge of anything it landed on.
 */
export const OBSTACLE_TOP_CLEARANCE = 0.5;

/** Lerp a footprint between bottom and top at normalised height `t` (0..1). */
export function crossSectionAt(o: ObstacleCollider, t: number): CrossSection {
  const u = t < 0 ? 0 : t > 1 ? 1 : t;
  if (o.spherical && o.bottom.kind === 'circle') {
    /* A sphere's widest point is its equator, not its base, so a linear taper
       would be wrong in both halves. dy is measured from the centre. */
    const R = o.bottom.r;
    const dy = (u - 0.5) * 2 * o.halfHeight;
    const inner = R * R - dy * dy;
    return { kind: 'circle', r: inner > 0 ? Math.sqrt(inner) : 0 };
  }
  if (o.bottom.kind === 'circle' && o.top.kind === 'circle') {
    return { kind: 'circle', r: o.bottom.r + (o.top.r - o.bottom.r) * u };
  }
  if (o.bottom.kind === 'box' && o.top.kind === 'box') {
    return {
      kind: 'box',
      hx: o.bottom.hx + (o.top.hx - o.bottom.hx) * u,
      hz: o.bottom.hz + (o.top.hz - o.bottom.hz) * u,
    };
  }
  // Mixed kinds are not produced by any shape; fall back to the base footprint.
  return o.bottom;
}

/**
 * Resolve one body against one obstacle's SIDES.
 *
 * Returns true if contact was resolved. Mutates `body.pos` / `body.vel` in
 * place, matching how `_resolveWalls` already works — `SpawnManager` points its
 * sim vectors at its own `Vector3`s, so writing through them updates what the
 * renderer reads with no copy.
 */
export function resolveObstacleSide(body: ColliderBody, o: ObstacleCollider): boolean {
  const obsBottom = o.cy - o.halfHeight;
  const obsTop    = o.cy + o.halfHeight;
  const tipY      = body.pos.y + body.tipOffset;
  const crownY    = body.pos.y + body.topOffset;

  /* Standing on it, or clear above it — the surface resolver owns this case. */
  if (tipY >= obsTop - OBSTACLE_TOP_CLEARANCE) return false;
  /* Entirely underneath it (a bey in the bowl below an overhanging prop). */
  if (crownY <= obsBottom) return false;

  /* Sample the footprint at the body's own mid-height rather than at the
     obstacle's. For a taper the two differ, and the half the bey is actually
     touching is the one that should push it. */
  const sampleY = Math.max(obsBottom, Math.min(obsTop, (tipY + crownY) * 0.5));
  const t  = o.halfHeight > 0 ? (sampleY - obsBottom) / (2 * o.halfHeight) : 0;
  const cs = crossSectionAt(o, t);

  const dx = body.pos.x - o.cx;
  const dz = body.pos.z - o.cz;

  let nx: number, nz: number, gap: number;

  if (cs.kind === 'circle') {
    const dist = Math.hypot(dx, dz);
    gap = dist - (cs.r + body.radius);
    if (gap > -OBSTACLE_CONTACT_EPS) return false;
    if (dist < 1e-6) {
      /* Dead centre: no outward direction exists. Pick +X rather than divide by
         zero and produce NaN, which would propagate into the position and kill
         the body permanently. */
      nx = 1; nz = 0;
    } else {
      nx = dx / dist; nz = dz / dist;
    }
  } else {
    /* Circle-vs-oriented-box: work in the box's frame, find the closest point
       on the rectangle, and push out along the vector to it. */
    const rad  = o.rotYDeg * Math.PI / 180;
    const cosR = Math.cos(rad), sinR = Math.sin(rad);
    // World -> local is a rotation by -rotY.
    const lx =  dx * cosR + dz * sinR;
    const lz = -dx * sinR + dz * cosR;

    const clx = Math.max(-cs.hx, Math.min(cs.hx, lx));
    const clz = Math.max(-cs.hz, Math.min(cs.hz, lz));
    let   ox  = lx - clx;
    let   oz  = lz - clz;
    let   d   = Math.hypot(ox, oz);

    if (d < 1e-6) {
      /* Centre is INSIDE the rectangle. The closest-point vector is degenerate,
         so eject along whichever face is nearest — the smallest penetration
         wins, which is what stops a body from being flung across the box. */
      const px = cs.hx - Math.abs(lx);
      const pz = cs.hz - Math.abs(lz);
      if (px < pz) { ox = Math.sign(lx) || 1; oz = 0; d = 1; gap = -(px + body.radius); }
      else         { ox = 0; oz = Math.sign(lz) || 1; d = 1; gap = -(pz + body.radius); }
    } else {
      gap = d - body.radius;
      if (gap > -OBSTACLE_CONTACT_EPS) return false;
    }

    const ulx = ox / d, ulz = oz / d;
    // Local -> world is a rotation by +rotY.
    nx = ulx * cosR - ulz * sinR;
    nz = ulx * sinR + ulz * cosR;
  }

  /* Reflect only the component moving INTO the surface. A body already sliding
     away must not be kicked again, or resting contact turns into a vibration. */
  const vn = body.vel.x * nx + body.vel.z * nz;
  if (vn < 0) {
    const r = o.restitution;
    body.vel.x -= (1 + r) * vn * nx;
    body.vel.z -= (1 + r) * vn * nz;
  }

  /* Depenetrate: gap is negative, n points outward, so subtracting moves out. */
  body.pos.x -= gap * nx;
  body.pos.z -= gap * nz;
  return true;
}

/**
 * Resolve a body against every obstacle, in iteration order.
 *
 * NOT sorted by penetration depth, and the distinction is worth stating because
 * it bounds what this is correct for. When two obstacles overlap, resolving one
 * can push the body deeper into the other, and a single sweep may leave a
 * residual overlap that the next tick finishes clearing. At 60 Hz against the
 * arrangements this project actually builds -- a ring of well-separated boats,
 * a central pillar, a scattering of blocks -- that settles invisibly.
 *
 * It would NOT be adequate for a dense pile of mutually overlapping obstacles;
 * that needs either depth-sorted resolution or an iterated solver. Nothing in
 * the arena editor produces one today, so the simple version ships and this
 * comment records the limit rather than a capability.
 *
 * Returns the ids that were touched, for impact reporting.
 */
export function resolveObstacles(body: ColliderBody, obstacles: Iterable<ObstacleCollider>): string[] {
  const hit: string[] = [];
  for (const o of obstacles) if (resolveObstacleSide(body, o)) hit.push(o.id);
  return hit;
}
