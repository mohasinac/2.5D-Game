// Shared arena feature collision/effect processing.
// Extracted from the duplicate processArenaFeatures blocks in
// BattleRoom (~108 LOC), TryoutRoom (~111 LOC), AIBattleRoom, TournamentBattleRoom.
//
// Pure function — takes the beyblade, the arena config, dt, and a physics bridge.
// Returns an effect summary the caller broadcasts.

import type { Beyblade, GameState } from "../../rooms/schema/GameState";
import type { ArenaConfig } from "../../types/shared";
import { wallBowlForce } from "../physics/ArenaUtils";

export interface ArenaPhysicsBridge {
  checkLoopCollision(id: string, loops: any[]): {
    inLoop: boolean;
    loopIndex: number;
    loopConfig: { speedBoost: number; spinBoost?: number } | null;
  };
  checkWaterCollision(id: string, water: any): boolean;
  checkPitCollision(id: string, pits: any[]): {
    damagePerSecond: number;
    escapeThreshold?: number;
  } | null;
  checkObstacleCollision(id: string): { colliding: boolean; obstacleId?: string | null; damage: number };
  applyLoopBoost(id: string, boost: number): void;
  applyWaterResistance(id: string, multiplier: number): void;
  applyForce(id: string, fx: number, fy: number): void;
  applyKnockback(id: string, direction: { x: number; y: number }, distance: number): void;
}

export interface ArenaEffectEvents {
  obstacleHit?: { playerId: string; damage: number };
  wallHit?: { playerId: string; damage: number };
}

// Process all per-tick arena interactions for a single beyblade.
// Side-effects: mutates beyblade fields, calls into the physics bridge.
// Returns events the room may want to broadcast.
export function processArenaFeatures(
  beyblade: Beyblade,
  arenaData: ArenaConfig,
  arenaState: GameState["arena"],
  dt: number,
  physics: ArenaPhysicsBridge,
  rand: () => number,
): ArenaEffectEvents {
  const events: ArenaEffectEvents = {};

  // ─── Speed loops ───────────────────────────────────────────────────────────
  if ((arenaData.loops?.length ?? 0) > 0) {
    const loopCheck = physics.checkLoopCollision(beyblade.id, arenaData.loops ?? []);
    if (loopCheck.inLoop && loopCheck.loopConfig) {
      if (!beyblade.inLoop) {
        beyblade.inLoop = true;
        beyblade.loopIndex = loopCheck.loopIndex;
        beyblade.loopEntryTime = Date.now();
        beyblade.loopSpeedBoost = loopCheck.loopConfig.speedBoost;
        beyblade.loopSpinBoost = loopCheck.loopConfig.spinBoost || 0;
        physics.applyLoopBoost(beyblade.id, loopCheck.loopConfig.speedBoost);
      }
      if (beyblade.loopSpinBoost > 0) {
        beyblade.spin = Math.min(beyblade.maxSpin, beyblade.spin + beyblade.loopSpinBoost * dt);
      }
    } else if (beyblade.inLoop) {
      beyblade.inLoop = false;
      beyblade.loopIndex = -1;
      beyblade.loopSpeedBoost = 1.0;
      beyblade.loopSpinBoost = 0;
    }
  }

  // ─── Water bodies ──────────────────────────────────────────────────────────
  const waterBodies = arenaData.waterBodies;
  if ((waterBodies?.length ?? 0) > 0) {
    const inWater = physics.checkWaterCollision(beyblade.id, waterBodies![0]);
    if (inWater) {
      if (!beyblade.inWater) {
        beyblade.inWater = true;
        const wc = waterBodies![0];
        const speedLoss = wc.effects?.speedLoss ?? 0.3;
        beyblade.waterSpeedMultiplier = 1 - speedLoss;
        beyblade.waterSpinDrain = wc.effects?.spinDrainPerSecond ?? 10;
      }
      physics.applyWaterResistance(beyblade.id, beyblade.waterSpeedMultiplier);
      beyblade.spin = Math.max(0, beyblade.spin - beyblade.waterSpinDrain * dt);
    } else if (beyblade.inWater) {
      beyblade.inWater = false;
      beyblade.waterSpeedMultiplier = 1.0;
      beyblade.waterSpinDrain = 0;
    }
  }

  // ─── Pits ──────────────────────────────────────────────────────────────────
  if ((arenaData.pits?.length ?? 0) > 0) {
    const pitConfig = physics.checkPitCollision(beyblade.id, arenaData.pits ?? []);
    if (pitConfig) {
      if (!beyblade.inPit) {
        beyblade.inPit = true;
        beyblade.currentPitId = `pit_${arenaData.pits?.indexOf(pitConfig as any) ?? 0}`;
        beyblade.pitDamageRate = pitConfig.damagePerSecond;
      }
      beyblade.spin = Math.max(0, beyblade.spin - beyblade.pitDamageRate * beyblade.spin * dt / 100);
      const escapeThreshold = pitConfig.escapeThreshold ?? 50;
      const canEscape = beyblade.spin > (beyblade.maxSpin * escapeThreshold / 100);
      if (canEscape && rand() < 0.1 * dt) {
        beyblade.inPit = false;
        beyblade.currentPitId = "";
        beyblade.pitDamageRate = 0;
        physics.applyForce(beyblade.id, 0, -0.05 * beyblade.mass);
      }
    } else if (beyblade.inPit) {
      beyblade.inPit = false;
      beyblade.currentPitId = "";
      beyblade.pitDamageRate = 0;
    }
  }

  // ─── Obstacles ─────────────────────────────────────────────────────────────
  const obstacleCheck = physics.checkObstacleCollision(beyblade.id);
  if (obstacleCheck.colliding) {
    if (!beyblade.collidingWithObstacle || beyblade.lastObstacleId !== obstacleCheck.obstacleId) {
      beyblade.collidingWithObstacle = true;
      beyblade.lastObstacleId = obstacleCheck.obstacleId || "";
      const damage = obstacleCheck.damage * beyblade.damageTaken;
      beyblade.health -= damage;
      beyblade.damageReceived += damage;
      physics.applyKnockback(
        beyblade.id,
        { x: beyblade.velocityX, y: beyblade.velocityY },
        beyblade.knockbackDistance,
      );
      events.obstacleHit = { playerId: beyblade.id, damage };
    }
  } else {
    beyblade.collidingWithObstacle = false;
    beyblade.lastObstacleId = "";
  }

  // ─── Wall ──────────────────────────────────────────────────────────────────
  if (arenaData.wall?.enabled) {
    const dx = beyblade.x - (arenaState.width * 16) / 2;
    const dy = beyblade.y - (arenaState.height * 16) / 2;
    const distance = Math.sqrt(dx * dx + dy * dy);
    const arenaRadius = Math.min(arenaState.width, arenaState.height) * 16 * 0.45;

    if (distance > arenaRadius * 0.95) {
      let wallDamage = arenaData.wall.baseDamage;
      if (arenaData.wall.hasSpikes) wallDamage *= arenaData.wall.spikeDamageMultiplier;
      wallDamage *= beyblade.damageTaken;

      beyblade.health -= wallDamage;
      beyblade.damageReceived += wallDamage;

      const wallForce = wallBowlForce(
        arenaData.wall.recoilDistance * beyblade.knockbackDistance,
        arenaState.wallAngle,
      );
      physics.applyKnockback(beyblade.id, { x: -dx, y: -dy }, wallForce);
      events.wallHit = { playerId: beyblade.id, damage: wallDamage };
    }
  }

  return events;
}
