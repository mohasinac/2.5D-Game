import * as THREE from 'three';
import { TWO_PI, DEG2RAD } from '../config/arenaConstants';
import {
  OpeningShape, ShapeParams, ArenaData, PitData, ZoneData, ZoneFill,
  ChildHole, FillPreset, WaveParams,
} from '../types/arenaTypes';
import { inChildHole } from './primitives';

/* ── Re-export inChildHole so callers that only need surface utils
   can import from one place ────────────────────────────────────────────── */
export { inChildHole };

/* ── Polar coordinate helper ─────────────────────────────────────────────
   Replaces the inline posR*cos(posAngle*DEG2RAD) / posR*sin(posAngle*DEG2RAD)
   that appeared in 5+ separate locations.
────────────────────────────────────────────────────────────────────────── */
export function polarToLocalXZ(posR: number, posAngle: number): { lx: number; lz: number } {
  const rad = posAngle * DEG2RAD;
  return { lx: posR * Math.cos(rad), lz: posR * Math.sin(rad) };
}

/* ── Child transform extractor ───────────────────────────────────────────
   Replaces 4 identical 3-line blocks in buildPitObjects / applyPit /
   buildZoneObjects / applyZone.
────────────────────────────────────────────────────────────────────────── */
export function extractChildTransform(child: PitData | ZoneData): { cx: number; cz: number; rotY: number } {
  const { lx: cx, lz: cz } = polarToLocalXZ(child.posR, child.posAngle);
  return { cx, cz, rotY: child.rotY * DEG2RAD };
}

/* ── 2-D opening shape points ────────────────────────────────────────────── */
export function shapePoints(data: ShapeParams): THREE.Vector2[] {
  const { radiusX: rx, radiusZ: rz, openingShape, sides, starInner } = data;
  const pts: THREE.Vector2[] = [];
  switch (openingShape) {
    case 'circle':
    case 'ellipse': {
      const N = 96;
      for (let i = 0; i < N; i++) {
        const θ = i / N * TWO_PI;
        pts.push(new THREE.Vector2(rx * Math.cos(θ), rz * Math.sin(θ)));
      }
      break;
    }
    case 'rectangle':
      pts.push(
        new THREE.Vector2(rx, rz), new THREE.Vector2(-rx, rz),
        new THREE.Vector2(-rx, -rz), new THREE.Vector2(rx, -rz),
      );
      break;
    case 'hexagon':
      for (let i = 0; i < 6; i++) {
        const θ = i / 6 * TWO_PI + Math.PI / 6;
        pts.push(new THREE.Vector2(rx * Math.cos(θ), rz * Math.sin(θ)));
      }
      break;
    case 'triangle':
      for (let i = 0; i < 3; i++) {
        const θ = i / 3 * TWO_PI - Math.PI / 2;
        pts.push(new THREE.Vector2(rx * Math.cos(θ), rz * Math.sin(θ)));
      }
      break;
    case 'star': {
      const n = Math.max(3, Math.min(12, Math.round(sides)));
      const inner = Math.max(0.1, Math.min(0.95, starInner));
      for (let i = 0; i < n * 2; i++) {
        const θ = i / (n * 2) * TWO_PI - Math.PI / 2;
        const r = i % 2 === 0 ? 1 : inner;
        pts.push(new THREE.Vector2(rx * r * Math.cos(θ), rz * r * Math.sin(θ)));
      }
      break;
    }
  }
  return pts;
}

/**
 * Resample a closed polygon to exactly N evenly-spaced points along its perimeter.
 * Allows mixing shapes with different vertex counts (e.g. circle outer, hexagon inner).
 */
export function resamplePts(pts: THREE.Vector2[], N: number): THREE.Vector2[] {
  if (pts.length === N) return pts;
  const M = pts.length;
  const dist: number[] = [0];
  for (let i = 0; i < M; i++) {
    const a = pts[i]; const b = pts[(i + 1) % M];
    dist.push(dist[i] + Math.hypot(b.x - a.x, b.y - a.y));
  }
  const total = dist[M];
  const out: THREE.Vector2[] = [];
  for (let k = 0; k < N; k++) {
    const target = (k / N) * total;
    let seg = 0;
    for (let i = 0; i < M; i++) { if (dist[i + 1] >= target) { seg = i; break; } }
    const segLen = dist[seg + 1] - dist[seg];
    const t = segLen > 0 ? (target - dist[seg]) / segLen : 0;
    const a = pts[seg]; const b = pts[(seg + 1) % M];
    out.push(new THREE.Vector2(a.x + (b.x - a.x) * t, a.y + (b.y - a.y) * t));
  }
  return out;
}

/* ── Arena surface Y functions ───────────────────────────────────────────── */

/** World-space Y of the arena bowl surface at a given arena-local XZ position. */
export function arenaSurfaceYAtArenaLocal(arena: ArenaData, alx: number, alz: number): number {
  const H = arena.posY;
  if (arena.wallProfile === 'straight') return H - arena.depth;
  const t = Math.min(Math.sqrt((alx / arena.radiusX) ** 2 + (alz / arena.radiusZ) ** 2), 1);
  return H - arena.depth * (1 - t * t);
}

/** Approximate arena surface Y at a radial distance (used for moat child placement). */
export function childArenaBaseY(arena: ArenaData, posR: number): number {
  const H = arena.posY;
  if (arena.wallProfile === 'straight') return H - arena.depth;
  const maxR = Math.max(arena.radiusX, arena.radiusZ, 0.001);
  const t = Math.min(posR / maxR, 1);
  return H - arena.depth * (1 - t * t);
}

/** Surface Y at (alx, alz) using the parent pit/zone's own floor curvature. */
export function parentSurfaceY(
  parent: PitData | ZoneData,
  arena: ArenaData,
  alx: number, alz: number,
): number {
  const { lx: pCX, lz: pCZ } = polarToLocalXZ(parent.posR, parent.posAngle);
  const parentSurfAtCenter = arenaSurfaceYAtArenaLocal(arena, pCX, pCZ);
  const pRotY = parent.rotY * DEG2RAD;
  const cosP = Math.cos(-pRotY); const sinP = Math.sin(-pRotY);
  const dx = alx - pCX; const dz = alz - pCZ;
  const lx = dx * cosP - dz * sinP; const lz = dx * sinP + dz * cosP;
  const t = Math.min(Math.sqrt((lx / parent.radiusX) ** 2 + (lz / parent.radiusZ) ** 2), 1);
  return parentSurfAtCenter - parent.depth * (1 - t * t);
}

/**
 * Returns the surface-Y function for a pit/zone given its parent lineage.
 * Nested pits/zones conform to their direct parent's floor, not the arena bowl.
 */
export function makeSurfFn(
  child: { parentZoneId: string | null },
  arena: ArenaData,
  zones: Map<string, ZoneData>,
): (alx: number, alz: number) => number {
  if (child.parentZoneId) {
    const parentZone = zones.get(child.parentZoneId);
    if (parentZone) return (alx, alz) => parentSurfaceY(parentZone, arena, alx, alz);
  }
  return (alx, alz) => arenaSurfaceYAtArenaLocal(arena, alx, alz);
}

/* ── World position for pit/zone ────────────────────────────────────────── */
export function childWorldPos(
  arena: ArenaData,
  child: { posR: number; posAngle: number; rotY: number },
): { wx: number; wz: number; wRotY: number } {
  const { lx: localX, lz: localZ } = polarToLocalXZ(child.posR, child.posAngle);
  const cosA = Math.cos(arena.rotY); const sinA = Math.sin(arena.rotY);
  return {
    wx: arena.posX + localX * cosA - localZ * sinA,
    wz: arena.posZ + localX * sinA + localZ * cosA,
    wRotY: arena.rotY + child.rotY * DEG2RAD,
  };
}

/* ── Zone fill configuration ─────────────────────────────────────────────── */
export const FILL_PRESET: Record<ZoneFill, FillPreset> = {
  water:  { color:0x1a7fd4, opacity:0.65, emissive:0x0044ff, emissiveIntensity:0.08, glowColor:0x3399ff },
  lava:   { color:0xff3300, opacity:0.80, emissive:0xff2200, emissiveIntensity:0.35, glowColor:0xff6600 },
  swamp:  { color:0x3d5c1a, opacity:0.75, emissive:0x224400, emissiveIntensity:0.05, glowColor:0x335500 },
  poison: { color:0x8800cc, opacity:0.70, emissive:0x6600aa, emissiveIntensity:0.15, glowColor:0xaa00ff },
  sand:   { color:0xd4a843, opacity:0.85, emissive:0x000000, emissiveIntensity:0.00, glowColor:null },
  ice:    { color:0xaaddff, opacity:0.60, emissive:0x88ccff, emissiveIntensity:0.08, glowColor:0xaaddff },
  void:   { color:0x000000, opacity:1.00, emissive:0x000000, emissiveIntensity:0.00, glowColor:null },
  custom: { color:0xffffff, opacity:0.70, emissive:0x000000, emissiveIntensity:0.00, glowColor:null },
};

export const FILL_LABEL: Record<ZoneFill, string> = {
  water:'💧 Water', lava:'🔥 Lava', swamp:'🌿 Swamp', poison:'☠ Poison',
  sand:'🏜 Sand', ice:'❄ Ice', void:'🌑 Void', custom:'🎨 Custom',
};

export const FILL_WAVE: Record<ZoneFill, WaveParams> = {
  water:  { amplitude:0.25, frequency:0.10, speed:1.20, turbulence:0.15 },
  lava:   { amplitude:0.60, frequency:0.04, speed:0.20, turbulence:0.80 },
  swamp:  { amplitude:0.18, frequency:0.05, speed:0.25, turbulence:0.50 },
  poison: { amplitude:0.35, frequency:0.13, speed:1.60, turbulence:0.65 },
  sand:   { amplitude:0.00, frequency:0.00, speed:0.00, turbulence:0.00 },
  ice:    { amplitude:0.00, frequency:0.00, speed:0.00, turbulence:0.00 },
  void:   { amplitude:0.00, frequency:0.00, speed:0.00, turbulence:0.00 },
  custom: { amplitude:0.20, frequency:0.08, speed:0.80, turbulence:0.30 },
};

export function zoneFillConfig(zone: ZoneData): { color: number; opacity: number; emissive: number; emissiveIntensity: number; glowColor: number | null } {
  if (zone.fill === 'custom')
    return { color: zone.fillColor ?? 0xffffff, opacity: zone.fillOpacity, emissive: 0x000000, emissiveIntensity: 0, glowColor: null };
  const p = FILL_PRESET[zone.fill];
  return { color: p.color, opacity: p.opacity, emissive: p.emissive, emissiveIntensity: p.emissiveIntensity, glowColor: p.glowColor };
}
