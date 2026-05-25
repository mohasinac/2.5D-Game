// Populates the runtime feature state maps (waterBodies, pits, portals,
// turrets, obstacles, loops) from a Firestore ArenaConfig so the Colyseus
// schema actually carries arena features. Without this the client has empty
// maps and nothing renders. See plan: Phase 8 / Part 12 must-have.

import {
  ArenaState,
  WaterBodyState,
  PitState,
  PortalState,
  TurretState,
  ObstacleState,
  LoopState,
  GameState,
} from "../../rooms/schema/GameState";

interface AnyArenaConfig {
  waterBodies?: Array<any>;
  pits?: Array<any>;
  portals?: Array<any>;
  turrets?: Array<any>;
  obstacles?: Array<any>;
  speedPaths?: Array<any>;
  loops?: Array<any>;
}

interface FeatureFlags {
  featureTurrets?: boolean;
  featurePortals?: boolean;
  featureWaterBodies?: boolean;
  featureSpecialMoves?: boolean;
  featurePits?: boolean;
  featureLoops?: boolean;
}

export function populateArenaFeatures(state: GameState, arena: AnyArenaConfig, flags?: FeatureFlags | null): void {
  if (!state) return;

  const ff = flags ?? {};

  // Water bodies — preserve all gameplay fields the client renderer expects.
  state.waterBodies.clear();
  const waterBodiesSrc = ff.featureWaterBodies === false ? [] : (arena.waterBodies ?? []);
  waterBodiesSrc.forEach((w: any, i: number) => {
    const ws = new WaterBodyState();
    ws.waterBodyId = w.id ?? `water_${i}`;
    ws.waterBodyIndex = i;
    ws.type = w.type ?? "moat";
    ws.liquidType = w.liquidType ?? "water";
    ws.spinDrainRate = Number(w.spinDrainRate ?? 10);
    ws.speedMultiplier = Number(w.speedMultiplier ?? 0.7);
    ws.causesSlip = Boolean(w.causesSlip);
    ws.damage = Number(w.damage ?? 0);
    state.waterBodies.set(ws.waterBodyId, ws);
  });

  // Pits
  state.pits.clear();
  const pitsSrc = ff.featurePits === false ? [] : (arena.pits ?? []);
  pitsSrc.forEach((p: any, i: number) => {
    const ps = new PitState();
    ps.pitId = p.id ?? `pit_${i}`;
    ps.pitIndex = i;
    ps.x = Number(p.x ?? 0);
    ps.y = Number(p.y ?? 0);
    ps.radius = Number(p.radius ?? 2);
    ps.damagePerSecond = Number(p.damagePerSecond ?? 10);
    ps.escapeChance = Number(p.escapeChance ?? 0.5);
    state.pits.set(ps.pitId, ps);
  });

  // Portals
  state.portals.clear();
  const portalsSrc = ff.featurePortals === false ? [] : (arena.portals ?? []);
  portalsSrc.forEach((p: any, i: number) => {
    const ps = new PortalState();
    ps.portalId = p.id ?? `portal_${i}`;
    ps.portalIndex = i;
    ps.inPointX = Number(p.inPointX ?? p.x ?? 0);
    ps.inPointY = Number(p.inPointY ?? p.y ?? 0);
    ps.outPointX = Number(p.outPointX ?? p.targetX ?? 0);
    ps.outPointY = Number(p.outPointY ?? p.targetY ?? 0);
    ps.radius = Number(p.radius ?? 2);
    ps.cooldown = Number(p.cooldown ?? 0);
    ps.bidirectional = p.bidirectional !== false;
    state.portals.set(ps.portalId, ps);
  });

  // Turrets
  state.turrets.clear();
  const turretsSrc = ff.featureTurrets === false ? [] : (arena.turrets ?? []);
  turretsSrc.forEach((t: any, i: number) => {
    const ts = new TurretState();
    ts.turretId = t.id ?? `turret_${i}`;
    ts.turretIndex = i;
    ts.attackType = t.attackType ?? "random";
    ts.x = Number(t.x ?? 0);
    ts.y = Number(t.y ?? 0);
    ts.damage = Number(t.damage ?? 10);
    ts.range = Number(t.range ?? 20);
    ts.cooldown = Number(t.cooldown ?? 2);
    ts.warmupTime = Number(t.warmupTime ?? 1);
    ts.bulletSpeed = Number(t.bulletSpeed ?? 10);
    ts.beamWidth = Number(t.beamWidth ?? 2);
    ts.beamDuration = Number(t.beamDuration ?? 1);
    ts.explosionRadius = Number(t.explosionRadius ?? 5);
    ts.returnSpeed = Number(t.returnSpeed ?? 8);
    ts.destructible = Boolean(t.destructible);
    ts.health = Number(t.health ?? 100);
    ts.maxHealth = Number(t.maxHealth ?? 100);
    state.turrets.set(ts.turretId, ts);
  });

  // Obstacles
  state.obstacles.clear();
  (arena.obstacles ?? []).forEach((o: any, i: number) => {
    const os = new ObstacleState();
    os.obstacleId = (o.id ?? `obstacle_${i}`).toString();
    os.obstacleIndex = i;
    os.type = o.type ?? "rock";
    os.x = Number(o.x ?? 0);
    os.y = Number(o.y ?? 0);
    os.radius = Number(o.radius ?? 1);
    os.destructible = !o.indestructible;
    os.health = Number(o.health ?? 100);
    os.maxHealth = Number(o.health ?? 100);
    os.damage = Number(o.damage ?? 10);
    os.recoil = Number(o.recoilDistance ?? 5);
    state.obstacles.set(os.obstacleId, os);
  });

  // Loops / speed paths
  state.loops.clear();
  const paths = ff.featureLoops === false ? [] : (arena.speedPaths ?? arena.loops ?? []);
  paths.forEach((l: any, i: number) => {
    const ls = new LoopState();
    ls.loopIndex = i;
    ls.radius = Number(l.radius ?? 5);
    ls.shape = l.shape ?? "circle";
    ls.speedBoost = Number(l.speedBoost ?? 1);
    ls.spinBoost = Number(l.spinBoost ?? 0);
    ls.frictionMultiplier = Number(l.frictionMultiplier ?? 1);
    state.loops.set(`loop_${i}`, ls);
  });
}

// Suppress unused warning on ArenaState import (kept for re-export ergonomics).
export type _ArenaStateExport = ArenaState;
