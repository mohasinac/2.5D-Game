import * as THREE from 'three';
import { ArenaData, ArenaMaterial, ChildHole } from '../types/arenaTypes';
import {
  TWO_PI, STEP_RING_SEGS, STEP_SLOPE_FRAC,
  SPIRAL_SEGS_PER_TURN,
} from '../config/arenaConstants';
import { effectiveProfile, rampExistsAt } from './surfaceUtils';
import { inChildHole } from './primitives';

/* ══════════════════════════════════════════════════════════════════════════
   Floor Profile Builders — stepped terraces and spiral ledge.
   Called from arenaObjectBuilders when wallProfile includes 'step'/'spiral'.
   All geometry is in arena-local space (rim at baseY, floor at baseY-depth).
   mesh.position.y = arena.posY applied by caller.
   ══════════════════════════════════════════════════════════════════════════ */

/* ── Stepped bowl ────────────────────────────────────────────────────────── */

export function buildSteppedBowl(
  arena: ArenaData, baseY: number, holes: ChildHole[] = [],
): { geo: THREE.BufferGeometry; edgeGeo: THREE.BufferGeometry } {
  const {
    depth, radiusX, radiusZ, stepCount: N, stepStartDepth,
    stepRiserProfile, rampMode, rampAngle, rampWidth,
  } = arena;

  const floorY    = baseY - depth;
  const stepZoneD = depth - stepStartDepth;
  // Radial fraction where the step zone outer edge meets the smooth zone
  const tSS  = Math.sqrt(Math.max(0, 1 - stepStartDepth / depth));
  const flatFrac = 1 - STEP_SLOPE_FRAC;

  const yAt = (i: number): number => floorY + i * stepZoneD / N;
  const parabY = (t: number): number => baseY - depth * (1 - t * t);

  const xAt = (tr: number, a: number): number => radiusX * tr * Math.cos(a);
  const zAt = (tr: number, a: number): number => radiusZ * tr * Math.sin(a);

  const pos: number[] = [];
  const idx: number[] = [];
  const epos: number[] = [];
  const SEG = STEP_RING_SEGS;

  function emitQuad(
    t0: number, a0: number, t1: number, a1: number,
    t2: number, a2: number, t3: number, a3: number,
    y0: number, y1: number, y2: number, y3: number,
  ): void {
    const cx = (xAt(t0,a0) + xAt(t1,a1) + xAt(t2,a2) + xAt(t3,a3)) * 0.25;
    const cz = (zAt(t0,a0) + zAt(t1,a1) + zAt(t2,a2) + zAt(t3,a3)) * 0.25;
    if (holes.length > 0 && inChildHole(cx, cz, holes)) return;
    const v = pos.length / 3;
    pos.push(xAt(t0,a0), y0, zAt(t0,a0));
    pos.push(xAt(t1,a1), y1, zAt(t1,a1));
    pos.push(xAt(t2,a2), y2, zAt(t2,a2));
    pos.push(xAt(t3,a3), y3, zAt(t3,a3));
    idx.push(v, v+1, v+2, v+1, v+3, v+2);
  }

  // Rim edge
  for (let j = 0; j < SEG; j++) {
    const a0 = j / SEG * TWO_PI; const a1 = (j + 1) / SEG * TWO_PI;
    epos.push(xAt(1, a0), baseY, zAt(1, a0), xAt(1, a1), baseY, zAt(1, a1));
  }

  // Per-angular-segment emission
  for (let j = 0; j < SEG; j++) {
    const a0 = j / SEG * TWO_PI;
    const a1 = (j + 1) / SEG * TWO_PI;
    const aMid = (a0 + a1) * 0.5;

    const profile = effectiveProfile(arena,
      radiusX * 0.5 * Math.cos(aMid),
      radiusZ * 0.5 * Math.sin(aMid),
    );

    if (profile !== 'step') {
      // Smooth parabolic or straight column for this angular slice
      const RINGS = 24;
      for (let r = 0; r < RINGS; r++) {
        const ta = r / RINGS; const tb = (r + 1) / RINGS;
        const ya = profile === 'straight' ? floorY : parabY(ta);
        const yb = profile === 'straight' ? floorY : parabY(tb);
        emitQuad(ta, a0, ta, a1, tb, a0, tb, a1, ya, ya, yb, yb);
      }
      continue;
    }

    // ── Outer smooth zone (only when stepStartDepth > 0) ─────────────────
    if (stepStartDepth > 0 && tSS < 1) {
      const OUTER = Math.max(4, Math.round((1 - tSS) * 20));
      for (let r = 0; r < OUTER; r++) {
        const ta = tSS + (r / OUTER) * (1 - tSS);
        const tb = tSS + ((r + 1) / OUTER) * (1 - tSS);
        const ya = stepRiserProfile === 'straight' ? floorY : parabY(ta);
        const yb = stepRiserProfile === 'straight' ? floorY : parabY(tb);
        emitQuad(ta, a0, ta, a1, tb, a0, tb, a1, ya, ya, yb, yb);
      }
      // Edge at step zone outer boundary
      epos.push(
        xAt(tSS, a0), yAt(N), zAt(tSS, a0),
        xAt(tSS, a1), yAt(N), zAt(tSS, a1),
      );
    }

    // ── Step rings (i=0 is innermost/floor, i=N-1 is outermost/near-rim) ──
    for (let i = 0; i < N; i++) {
      const tStep_inner = i / N;
      const tStep_flat  = tStep_inner + flatFrac / N;
      const tStep_outer = (i + 1) / N;

      const t_inner = tStep_inner * tSS;
      const t_flat  = tStep_flat  * tSS;
      const t_outer = tStep_outer * tSS;

      const y_inner = yAt(i);

      const isRamp = rampExistsAt(aMid, i, rampMode, rampAngle, rampWidth);
      const y_riser_end = (isRamp || stepRiserProfile === 'straight')
        ? yAt(i + 1)
        : parabY(t_outer);

      // Flat terrace: t_inner → t_flat, all at y_inner
      emitQuad(t_inner, a0, t_inner, a1, t_flat, a0, t_flat, a1,
        y_inner, y_inner, y_inner, y_inner);

      // Riser: t_flat → t_outer, rising from y_inner to y_riser_end
      emitQuad(t_flat, a0, t_flat, a1, t_outer, a0, t_outer, a1,
        y_inner, y_inner, y_riser_end, y_riser_end);

      // Edge: outer rim of this terrace
      epos.push(
        xAt(t_outer, a0), y_inner, zAt(t_outer, a0),
        xAt(t_outer, a1), y_inner, zAt(t_outer, a1),
      );
    }
  }

  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
  geo.setIndex(idx);
  geo.computeVertexNormals();

  const edgeGeo = new THREE.BufferGeometry();
  edgeGeo.setAttribute('position', new THREE.Float32BufferAttribute(epos, 3));

  return { geo, edgeGeo };
}

/* ── Spiral ledge mesh ───────────────────────────────────────────────────── */

/**
 * Builds a single helical ledge strip for one helix (helixIndex out of totalHelices).
 * The ledge bottom rises linearly from the bowl floor to near the rim.
 * Returns a standalone Mesh positioned in arena-local space; caller applies world transform.
 */
export function buildSpiralLedgeMesh(
  arena: ArenaData, baseY: number, helixIndex: number, totalHelices: number,
  baseMaterial?: ArenaMaterial,
): THREE.Mesh {
  const {
    depth, radiusX, radiusZ, color,
    spiralTurns, spiralClockwise, spiralLedgeWidth, spiralLedgeHeight, spiralRadiusFrac,
  } = arena;

  const floorY = baseY - depth;
  const angleOffset = (helixIndex / totalHelices) * TWO_PI;
  const totalAngle  = spiralTurns * TWO_PI * (spiralClockwise ? 1 : -1);
  const SEGS = Math.ceil(spiralTurns * SPIRAL_SEGS_PER_TURN);

  const maxR = Math.max(radiusX, radiusZ, 0.001);
  const rOuter = spiralRadiusFrac;
  const rInner = Math.max(0, spiralRadiusFrac - spiralLedgeWidth / maxR);

  const pos: number[] = [];
  const idx: number[] = [];

  for (let s = 0; s <= SEGS; s++) {
    const frac  = s / SEGS;
    const theta = angleOffset + frac * totalAngle;
    const cosT  = Math.cos(theta); const sinT = Math.sin(theta);
    const yBot  = floorY + frac * Math.max(0, depth - spiralLedgeHeight);
    const yTop  = yBot + spiralLedgeHeight;

    // outer-bottom, inner-bottom, outer-top, inner-top
    pos.push(rOuter * radiusX * cosT, yBot, rOuter * radiusZ * sinT); // 0 outer-bot
    pos.push(rInner * radiusX * cosT, yBot, rInner * radiusZ * sinT); // 1 inner-bot
    pos.push(rOuter * radiusX * cosT, yTop, rOuter * radiusZ * sinT); // 2 outer-top
    pos.push(rInner * radiusX * cosT, yTop, rInner * radiusZ * sinT); // 3 inner-top

    if (s < SEGS) {
      const b = s * 4;
      const n = (s + 1) * 4;
      // Top face: outer-top[s], inner-top[s], outer-top[s+1], inner-top[s+1]
      idx.push(b+2, b+3, n+2,  b+3, n+3, n+2);
      // Bottom face (flipped): outer-bot[s], outer-bot[s+1], inner-bot[s]
      idx.push(b,   n,   b+1,  n,   n+1, b+1);
      // Outer wall: outer-bot[s], outer-top[s], outer-bot[s+1], outer-top[s+1]
      idx.push(b,   b+2, n,    b+2, n+2, n);
      // Inner wall (flipped): inner-bot[s], inner-bot[s+1], inner-top[s]
      idx.push(b+1, n+1, b+3,  n+1, n+3, b+3);
    }
  }

  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
  geo.setIndex(idx);
  geo.computeVertexNormals();

  const PBR = { abs: [0.65, 0.00], metal: [0.15, 0.88], stone: [0.90, 0.02] } as const;
  const [roughness, metalness] = baseMaterial ? PBR[baseMaterial] : [0.65, 0.08];
  const mat = new THREE.MeshStandardMaterial({
    color: new THREE.Color(color).lerp(new THREE.Color(0xffffff), 0.3),
    side: THREE.DoubleSide,
    roughness, metalness,
  });
  return new THREE.Mesh(geo, mat);
}
