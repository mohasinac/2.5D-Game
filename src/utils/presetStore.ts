import type { ArenaConfig } from './arenaPersistence';
import type { BeybladeBuildConfig } from '../types/beybladeTypes';
import type { ArenaPreset, BeyPreset } from '../types/presetTypes';
import type {
  ArenaSave, PitSave, ZoneSave, WallSave, BridgeSave, BridgeSegmentSave,
  SpeedLineSave, ObstacleSave, TrapSave, PortalSave, BaseFootingSave, RotationSave,
} from './arenaPersistence';
import {
  arenaToSave, wallToSave, bridgeToSave,
  speedLineToSave, obstacleToSave, trapToSave, portalToSave, footingToSave, rotationToSave,
} from './arenaPersistence';

// ── Storage keys ───────────────────────────────────────────────────────────

const ARENA_PRESETS_KEY = 'bey_arena_presets';
const BEY_PRESETS_KEY   = 'bey_bey_presets';

// ── ID generation ─────────────────────────────────────────────────────────

export function newPresetId(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
}

// ── Arena preset CRUD ─────────────────────────────────────────────────────

export function listArenaPresets(): ArenaPreset[] {
  try { return JSON.parse(localStorage.getItem(ARENA_PRESETS_KEY) ?? '[]') as ArenaPreset[]; }
  catch { return []; }
}

export function saveArenaPreset(p: ArenaPreset): void {
  const list = listArenaPresets();
  const idx = list.findIndex(x => x.id === p.id);
  if (idx >= 0) list[idx] = p; else list.push(p);
  localStorage.setItem(ARENA_PRESETS_KEY, JSON.stringify(list));
}

export function deleteArenaPreset(id: string): void {
  const list = listArenaPresets().filter(p => p.id !== id);
  localStorage.setItem(ARENA_PRESETS_KEY, JSON.stringify(list));
}

export function updateArenaPreset(id: string, patch: Partial<ArenaPreset>): void {
  const list = listArenaPresets();
  const idx = list.findIndex(p => p.id === id);
  if (idx < 0) return;
  list[idx] = { ...list[idx], ...patch };
  localStorage.setItem(ARENA_PRESETS_KEY, JSON.stringify(list));
}

// ── Bey preset CRUD ───────────────────────────────────────────────────────

export function listBeyPresets(): BeyPreset[] {
  try { return JSON.parse(localStorage.getItem(BEY_PRESETS_KEY) ?? '[]') as BeyPreset[]; }
  catch { return []; }
}

export function saveBeyPreset(p: BeyPreset): void {
  const list = listBeyPresets();
  const idx = list.findIndex(x => x.id === p.id);
  if (idx >= 0) list[idx] = p; else list.push(p);
  localStorage.setItem(BEY_PRESETS_KEY, JSON.stringify(list));
}

export function deleteBeyPreset(id: string): void {
  const list = listBeyPresets().filter(p => p.id !== id);
  localStorage.setItem(BEY_PRESETS_KEY, JSON.stringify(list));
}

export function updateBeyPreset(id: string, patch: Partial<BeyPreset>): void {
  const list = listBeyPresets();
  const idx = list.findIndex(p => p.id === id);
  if (idx < 0) return;
  list[idx] = { ...list[idx], ...patch };
  localStorage.setItem(BEY_PRESETS_KEY, JSON.stringify(list));
}

// ── Thumbnail generation ───────────────────────────────────────────────────

export function generateArenaThumb(config: ArenaConfig): string {
  const SIZE = 128;
  const canvas = document.createElement('canvas');
  canvas.width = canvas.height = SIZE;
  const ctx = canvas.getContext('2d')!;

  ctx.fillStyle = '#0a0a18';
  ctx.fillRect(0, 0, SIZE, SIZE);

  const SCALE = 200; // world units that map to full canvas
  const cx = SIZE / 2, cy = SIZE / 2;
  const toX = (wx: number) => cx + (wx / SCALE) * SIZE * 0.45;
  const toY = (wz: number) => cy + (wz / SCALE) * SIZE * 0.45;

  // Draw octagon outline
  ctx.strokeStyle = '#2a2a6a';
  ctx.lineWidth = 1;
  const OCT_R = SIZE * 0.45;
  ctx.beginPath();
  for (let i = 0; i < 8; i++) {
    const a = (Math.PI / 8) + i * (Math.PI / 4);
    const x = cx + OCT_R * Math.cos(a);
    const y = cy + OCT_R * Math.sin(a);
    i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
  }
  ctx.closePath();
  ctx.stroke();

  // Draw each arena as a filled ellipse
  for (const a of config.arenas) {
    const r = Math.max(a.radiusX ?? 30, 5);
    const rx = (a.radiusX / SCALE) * SIZE * 0.45;
    const rz = (a.radiusZ / SCALE) * SIZE * 0.45;
    const px = toX(a.posX);
    const py = toY(a.posZ);
    const col = '#' + (a.color >>> 0).toString(16).padStart(6, '0');
    ctx.beginPath();
    ctx.ellipse(px, py, Math.max(rx, 2), Math.max(rz, 2), 0, 0, Math.PI * 2);
    ctx.fillStyle = col + '88';
    ctx.fill();
    ctx.strokeStyle = col;
    ctx.lineWidth = 1;
    ctx.stroke();
  }

  // Draw bridges as lines (rough path indication)
  ctx.strokeStyle = '#ff6b3588';
  ctx.lineWidth = 1.5;
  for (const b of config.bridges) {
    if (!b.segments.length) continue;
    ctx.beginPath();
    let started = false;
    for (const seg of b.segments) {
      const ex = toX(seg.endX ?? 0);
      const ey = toY(seg.endZ ?? 0);
      if (!started) { ctx.moveTo(ex, ey); started = true; }
      else ctx.lineTo(ex, ey);
    }
    ctx.stroke();
  }

  // Draw obstacles as small squares
  ctx.fillStyle = '#aaaaaa66';
  for (const o of config.obstacles) {
    const px = toX(o.posX);
    const py = toY(o.posZ);
    ctx.fillRect(px - 2, py - 2, 4, 4);
  }

  return canvas.toDataURL('image/png');
}

export function generateBeyThumb(config: BeybladeBuildConfig): string {
  const SIZE = 128;
  const canvas = document.createElement('canvas');
  canvas.width = canvas.height = SIZE;
  const ctx = canvas.getContext('2d')!;

  ctx.fillStyle = '#0a0a18';
  ctx.fillRect(0, 0, SIZE, SIZE);

  const cx = SIZE / 2, cy = SIZE / 2;
  let yOffset = 0;
  const parts = [...config.parts].sort((a, b) => a.axisOffsetY - b.axisOffsetY);
  const maxR = Math.max(...parts.map(p => p.topRadiusX), 1);
  const scaleR = (SIZE * 0.44) / maxR;

  for (const part of parts) {
    const rx = part.topRadiusX * scaleR;
    const rz = part.bottomRadiusX * scaleR;
    const h = Math.max(part.height * 2, 3);
    const col = '#' + (part.color >>> 0).toString(16).padStart(6, '0');
    const y = cy + yOffset - h / 2;
    ctx.beginPath();
    ctx.ellipse(cx, y, rx, Math.max(rz * 0.3, 2), 0, 0, Math.PI * 2);
    ctx.fillStyle = col + 'aa';
    ctx.fill();
    ctx.strokeStyle = col;
    ctx.lineWidth = 1;
    ctx.stroke();
    yOffset += h * 0.5;
  }

  return canvas.toDataURL('image/png');
}

// ── ArenaConfig ID remapping ───────────────────────────────────────────────
// All IDs in the config are rewritten with a batchTag prefix so that importing
// into an existing scene never causes collisions.
// e.g. "arena-3" → "arena-{batchTag}-3"

function remapId(oldId: string, batchTag: string): string {
  // Handle already-remapped IDs (e.g. "arena-abc123-3") — don't double-remap
  const parts = oldId.split('-');
  if (parts.length === 2) return `${parts[0]}-${batchTag}-${parts[1]}`;
  return `${oldId}-${batchTag}`;
}

export function remapArenaConfigIds(config: ArenaConfig, batchTag: string): ArenaConfig {
  // Build old→new id map for every ID in the config
  const idMap = new Map<string, string>();

  function reg(id: string): string {
    if (!idMap.has(id)) idMap.set(id, remapId(id, batchTag));
    return idMap.get(id)!;
  }
  function get(id: string): string {
    return idMap.get(id) ?? id; // fallback to original if not registered (cross-scene refs)
  }
  function getOrNull(id: string | null): string | null {
    return id == null ? null : (idMap.get(id) ?? null);
  }

  // Pass 1: register all IDs
  for (const a of config.arenas) {
    reg(a.id);
    for (const p of a.pits) reg(p.id);
    for (const z of a.zones) { reg(z.id); regZoneIds(z); }
    for (const w of a.walls) { reg(w.id); for (const h of w.holes) reg(h.id); }
    for (const sl of a.speedLines) reg(sl.id);
  }
  for (const b of config.bridges) {
    reg(b.id);
    for (const s of b.segments) reg(s.id);
    for (const w of b.walls) { reg(w.id); for (const h of w.holes) reg(h.id); }
  }
  for (const w of config.baseWalls) { reg(w.id); for (const h of w.holes) reg(h.id); }
  for (const sl of config.speedLines) reg(sl.id);
  for (const o of config.obstacles) reg(o.id);
  for (const t of config.traps) {
    reg(t.id);
    for (const w of t.walls) { reg(w.id); for (const h of w.holes) reg(h.id); }
  }
  for (const p of config.portals) reg(p.id);
  for (const f of config.footings) reg(f.id);
  for (const r of config.rotations) reg(r.id);

  function regZoneIds(z: ZoneSave): void {
    for (const p of z.pits) reg(p.id);
    for (const cz of z.zones) { reg(cz.id); regZoneIds(cz); }
  }

  // Pass 2: rewrite all fields using idMap
  function remapWall(w: WallSave): WallSave {
    return { ...w, id: get(w.id), parentId: get(w.parentId),
      holes: w.holes.map(h => ({ ...h, id: get(h.id) })) };
  }

  function remapPit(p: PitSave): PitSave { return { ...p, id: get(p.id) }; }

  function remapZone(z: ZoneSave): ZoneSave {
    return {
      ...z,
      id: get(z.id),
      parentZoneId: getOrNull(z.parentZoneId),
      pits: z.pits.map(remapPit),
      zones: z.zones.map(remapZone),
    };
  }

  function remapSl(sl: SpeedLineSave): SpeedLineSave {
    return { ...sl, id: get(sl.id), parentArenaId: get(sl.parentArenaId),
      parentZoneId: getOrNull(sl.parentZoneId) };
  }

  function remapSeg(s: BridgeSegmentSave): BridgeSegmentSave { return { ...s, id: get(s.id) }; }

  function remapBridge(b: BridgeSave): BridgeSave {
    return {
      ...b,
      id: get(b.id),
      startRef: b.startRef ? { ...b.startRef, id: get(b.startRef.id) } : null,
      segments: b.segments.map(remapSeg),
      walls: b.walls.map(remapWall),
    };
  }

  function remapArena(a: ArenaSave): ArenaSave {
    return {
      ...a,
      id: get(a.id),
      pits: a.pits.map(remapPit),
      zones: a.zones.map(remapZone),
      walls: a.walls.map(remapWall),
      speedLines: a.speedLines.map(remapSl),
    };
  }

  function remapTrap(t: TrapSave): TrapSave {
    return {
      ...t,
      id: get(t.id),
      parentId: get(t.parentId),
      speedPathId: t.speedPathId ? getOrNull(t.speedPathId) : null,
      walls: t.walls.map(remapWall),
    };
  }

  function remapPortal(p: PortalSave): PortalSave {
    return {
      ...p,
      id: get(p.id),
      parentId: get(p.parentId),
      destPortalId: getOrNull(p.destPortalId),
    };
  }

  function remapRotation(r: RotationSave): RotationSave {
    return {
      ...r,
      id: get(r.id),
      memberIds: r.memberIds.map(mid => get(mid)),
      snapRules: r.snapRules.map(sr => ({ ...sr, id: get(sr.id), bridgeId: get(sr.bridgeId) })),
    };
  }

  function remapObstacle(o: ObstacleSave): ObstacleSave {
    return { ...o, id: get(o.id), speedPathId: getOrNull(o.speedPathId) };
  }

  function remapFooting(f: BaseFootingSave): BaseFootingSave {
    return { ...f, id: get(f.id) };
  }

  return {
    baseConfig: { ...config.baseConfig },
    arenas: config.arenas.map(remapArena),
    arenaSeq: config.arenaSeq,
    pitSeq: config.pitSeq,
    zoneSeq: config.zoneSeq,
    bridges: config.bridges.map(remapBridge),
    wallSeq: config.wallSeq,
    bridgeSeq: config.bridgeSeq,
    segmentSeq: config.segmentSeq,
    speedLineSeq: config.speedLineSeq,
    speedLines: config.speedLines.map(remapSl),
    baseWalls: config.baseWalls.map(remapWall),
    obstacles: config.obstacles.map(remapObstacle),
    obstacleSeq: config.obstacleSeq,
    traps: config.traps.map(remapTrap),
    trapSeq: config.trapSeq,
    portals: config.portals.map(remapPortal),
    portalSeq: config.portalSeq,
    rotations: config.rotations.map(remapRotation),
    rotationSeq: config.rotationSeq,
    footings: config.footings.map(remapFooting),
    footingSeq: config.footingSeq,
    jumpLinks: [],
    jumpLinkSeq: 0,
  };
}

// ── BeybladeBuildConfig ID remapping ──────────────────────────────────────

export function remapBeyConfigIds(config: BeybladeBuildConfig, batchTag: string): BeybladeBuildConfig {
  const idMap = new Map<string, string>();

  function reg(id: string): string {
    if (!idMap.has(id)) idMap.set(id, remapId(id, batchTag));
    return idMap.get(id)!;
  }
  function get(id: string): string { return idMap.get(id) ?? id; }

  for (const p of config.parts) { reg(p.id); for (const sid of p.sectorIds) reg(sid); }
  for (const s of config.sectors) reg(s.id);
  for (const g of config.groups) reg(g.id);

  return {
    axis: { ...config.axis },
    parts: config.parts.map(p => ({
      ...p,
      id: get(p.id),
      sectorIds: p.sectorIds.map(sid => get(sid)),
    })),
    sectors: config.sectors.map(s => ({ ...s, id: get(s.id) })),
    groups: config.groups.map(g => ({ ...g, id: get(g.id), childIds: g.childIds.map(cid => get(cid)) })),
    rootChildIds: config.rootChildIds.map(id => get(id)),
    partSeq: config.partSeq,
    sectorSeq: config.sectorSeq,
    groupSeq: config.groupSeq,
  };
}

// ── Partial ArenaConfig extraction from a set of checked node IDs ──────────

interface AllMaps {
  arenas: Map<string, import('../types/arenaTypes').ArenaData>;
  pits: Map<string, import('../types/arenaTypes').PitData>;
  zones: Map<string, import('../types/arenaTypes').ZoneData>;
  walls: Map<string, import('../types/arenaTypes').WallData>;
  bridges: Map<string, import('../types/arenaTypes').BridgeData>;
  segments: Map<string, import('../types/arenaTypes').BridgeSegmentData>;
  speedLines: Map<string, import('../types/arenaTypes').SpeedLineData>;
  obstacles: Map<string, import('../types/arenaTypes').ObstacleData>;
  traps: Map<string, import('../types/arenaTypes').TrapData>;
  portals: Map<string, import('../types/arenaTypes').PortalData>;
  rotations: Map<string, import('../types/arenaTypes').RotationData>;
  footings: Map<string, import('../types/arenaTypes').BaseFootingData>;
}

export function extractArenaConfig(
  checkedIds: string[],
  maps: AllMaps,
  baseConfig: ArenaConfig['baseConfig'],
): ArenaConfig {
  const checked = new Set(checkedIds);

  const arenaIds    = new Set<string>();
  const bridgeIds   = new Set<string>();
  const obstacleIds = new Set<string>();
  const trapIds     = new Set<string>();
  const portalIds   = new Set<string>();
  const footingIds  = new Set<string>();
  const rotationIds = new Set<string>();
  const baseWallIds = new Set<string>();

  for (const id of checked) {
    if (id.startsWith('arena-'))      arenaIds.add(id);
    else if (id.startsWith('bridge-'))   bridgeIds.add(id);
    else if (id.startsWith('obstacle-')) obstacleIds.add(id);
    else if (id.startsWith('trap-'))     trapIds.add(id);
    else if (id.startsWith('portal-'))   portalIds.add(id);
    else if (id.startsWith('footing-'))  footingIds.add(id);
    else if (id.startsWith('rot-'))      rotationIds.add(id);
    else if (id.startsWith('wall-')) {
      const wall = maps.walls.get(id);
      if (wall?.parentType === 'base') baseWallIds.add(id);
    }
  }

  // Resolve checkedIds to save objects
  const arenas: ArenaSave[] = [];
  for (const id of arenaIds) {
    const a = maps.arenas.get(id);
    if (!a) continue;
    const save = arenaToSave(id, a, maps.pits, maps.zones);
    save.walls = [...maps.walls.values()]
      .filter(w => w.parentType === 'arena' && w.parentId === id)
      .map(wallToSave);
    save.speedLines = [...maps.speedLines.values()]
      .filter(sl => sl.parentArenaId === id && sl.parentZoneId === null)
      .map(speedLineToSave);
    arenas.push(save);
  }

  const bridges: BridgeSave[] = [];
  for (const id of bridgeIds) {
    const b = maps.bridges.get(id);
    if (b) bridges.push(bridgeToSave(b, maps.segments, maps.walls));
  }

  const baseWalls: WallSave[] = [];
  for (const id of baseWallIds) {
    const w = maps.walls.get(id);
    if (w) baseWalls.push(wallToSave(w));
  }

  const obstacles: ObstacleSave[] = [];
  for (const id of obstacleIds) {
    const o = maps.obstacles.get(id);
    if (o) obstacles.push(obstacleToSave(o));
  }

  const traps: TrapSave[] = [];
  for (const id of trapIds) {
    const t = maps.traps.get(id);
    if (!t) continue;
    const ts = trapToSave(t);
    ts.walls = [...maps.walls.values()]
      .filter(w => w.parentType === 'trap' && w.parentId === t.id)
      .map(wallToSave);
    traps.push(ts);
  }

  const portals: PortalSave[] = [];
  for (const id of portalIds) {
    const p = maps.portals.get(id);
    if (p) portals.push(portalToSave(p));
  }

  const footings: BaseFootingSave[] = [];
  for (const id of footingIds) {
    const f = maps.footings.get(id);
    if (f) footings.push(footingToSave(f));
  }

  // Include rotations only if ALL their member IDs are in the full checked set
  const rotations: RotationSave[] = [];
  for (const id of rotationIds) {
    const r = maps.rotations.get(id);
    if (r && r.memberIds.every(mid => checked.has(mid))) {
      rotations.push(rotationToSave(r));
    }
  }

  // Compute sequence counters from what was extracted
  const allExtractedIds = [
    ...arenas.map(a => a.id),
    ...bridges.map(b => b.id),
    ...obstacles.map(o => o.id),
    ...traps.map(t => t.id),
    ...portals.map(p => p.id),
    ...footings.map(f => f.id),
    ...rotations.map(r => r.id),
    ...baseWalls.map(w => w.id),
  ];

  function maxSeq(ids: string[], prefix: string): number {
    let m = 0;
    for (const id of ids) {
      if (id.startsWith(prefix + '-')) {
        const n = parseInt(id.slice(prefix.length + 1));
        if (!isNaN(n)) m = Math.max(m, n);
      }
    }
    return m + 1;
  }

  return {
    baseConfig: { ...baseConfig },
    arenas,
    arenaSeq: maxSeq(allExtractedIds, 'arena'),
    pitSeq: 1,
    zoneSeq: 1,
    bridges,
    wallSeq: maxSeq(allExtractedIds, 'wall'),
    bridgeSeq: maxSeq(allExtractedIds, 'bridge'),
    segmentSeq: 1,
    speedLineSeq: 1,
    speedLines: [],
    baseWalls,
    obstacles,
    obstacleSeq: maxSeq(allExtractedIds, 'obstacle'),
    traps,
    trapSeq: maxSeq(allExtractedIds, 'trap'),
    portals,
    portalSeq: maxSeq(allExtractedIds, 'portal'),
    rotations,
    rotationSeq: maxSeq(allExtractedIds, 'rot'),
    footings,
    footingSeq: maxSeq(allExtractedIds, 'footing'),
    jumpLinks: [],
    jumpLinkSeq: 0,
  };
}
