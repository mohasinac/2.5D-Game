// Phase 25 — RoyaleBattleRoom: extends BattleRoom with Battle Royale safe zone mechanics.
// Max 20 clients. Safe zone shrinks across 5 phases (60s each). Drain outside zone.

import { BattleRoom } from "./BattleRoom";
import { Client } from "colyseus";

// Safe zone phase config: [radius_fraction_of_arena, drain_spin_per_second]
const SAFE_ZONE_PHASES: Array<{ radiusFraction: number; drainRate: number }> = [
  { radiusFraction: 1.0,  drainRate:  0  }, // Phase 0: full arena, no drain
  { radiusFraction: 0.75, drainRate:  3  }, // Phase 1: 75% radius, light drain
  { radiusFraction: 0.55, drainRate:  6  }, // Phase 2: 55% radius, moderate drain
  { radiusFraction: 0.35, drainRate: 10  }, // Phase 3: 35% radius, heavy drain
  { radiusFraction: 0.15, drainRate: 15  }, // Phase 4: 15% radius, lethal drain
];

const PHASE_DURATION_S = 60;
const MAX_ROYALE_CLIENTS = 20;

export class RoyaleBattleRoom extends BattleRoom {
  private royaleEnabled = false;
  private safeZoneTargetX = 0;
  private safeZoneTargetY = 0;
  private _arenaRadius = 0;

  maxClients = MAX_ROYALE_CLIENTS;

  async onCreate(options: Record<string, unknown>) {
    await super.onCreate(options);
    this.royaleEnabled = true;
    this.initSafeZone();
  }

  private arenaRadius(): number {
    if (this._arenaRadius > 0) return this._arenaRadius;
    const arena = this.state.arena;
    this._arenaRadius = Math.min((arena.width || 1080) * 0.45, (arena.height || 1080) * 0.45);
    return this._arenaRadius;
  }

  private pickNewTarget(): void {
    const r = this.arenaRadius() * 0.3; // target within 30% of center
    const angle = Math.random() * Math.PI * 2;
    this.safeZoneTargetX = Math.cos(angle) * r * Math.random();
    this.safeZoneTargetY = Math.sin(angle) * r * Math.random();
  }

  private initSafeZone() {
    const arena = this.state.arena;
    arena.safeZoneRadius = this.arenaRadius();
    arena.safeZoneX = 0;
    arena.safeZoneY = 0;
    arena.safeZoneTimer = PHASE_DURATION_S;
    arena.safeZonePhase = 0;
    this.safeZoneTargetX = 0;
    this.safeZoneTargetY = 0;
  }

  protected tick(deltaMs: number): void {
    super.tick(deltaMs);
    if (!this.royaleEnabled || this.state.status !== "in-progress") return;
    this.tickSafeZone(deltaMs);
  }

  private tickSafeZone(deltaMs: number): void {
    const arena = this.state.arena;
    const dtS = deltaMs / 1000;

    // Lerp zone center toward target (5px/ms → up to 300px/s)
    const lerpSpeed = 5 * dtS;
    const dxTarget = this.safeZoneTargetX - arena.safeZoneX;
    const dyTarget = this.safeZoneTargetY - arena.safeZoneY;
    const distToTarget = Math.sqrt(dxTarget * dxTarget + dyTarget * dyTarget);
    if (distToTarget > 0.5) {
      const move = Math.min(lerpSpeed, distToTarget);
      arena.safeZoneX += (dxTarget / distToTarget) * move;
      arena.safeZoneY += (dyTarget / distToTarget) * move;
    }

    arena.safeZoneTimer = Math.max(0, arena.safeZoneTimer - dtS);

    if (arena.safeZoneTimer <= 0) {
      const nextPhase = arena.safeZonePhase + 1;
      if (nextPhase < SAFE_ZONE_PHASES.length) {
        arena.safeZonePhase = nextPhase as typeof arena.safeZonePhase;
        arena.safeZoneTimer = PHASE_DURATION_S;
        arena.safeZoneRadius = this.arenaRadius() * SAFE_ZONE_PHASES[nextPhase].radiusFraction;
        // Pick a new drift target on phase transition
        this.pickNewTarget();
        this.broadcast("safe-zone-shrink", {
          phase: nextPhase,
          radius: arena.safeZoneRadius,
          drain: SAFE_ZONE_PHASES[nextPhase].drainRate,
          targetX: this.safeZoneTargetX,
          targetY: this.safeZoneTargetY,
        });
      }
    }

    const phaseConfig = SAFE_ZONE_PHASES[arena.safeZonePhase];
    if (phaseConfig.drainRate <= 0) return;

    const cx = arena.safeZoneX;
    const cy = arena.safeZoneY;
    const currentShrinkRadius = arena.safeZoneRadius;
    const ZONE_BASE_DAMAGE = phaseConfig.drainRate;

    // Compute arena radius for normalisation (same formula as initSafeZone)
    const arenaRadius = Math.min(
      (arena.width || 1080) * 0.45,
      (arena.height || 1080) * 0.45,
    );

    let maxFracThisTick = 0;

    this.state.beyblades.forEach(bey => {
      if (!bey.isActive) return;
      const dx = bey.x - cx;
      const dy = bey.y - cy;
      const dist = Math.sqrt(dx * dx + dy * dy);
      const overlapPx = dist - currentShrinkRadius;
      if (overlapPx > 0) {
        // ── Distance-Scaled Zone Damage (PUBG Blue Zone) ──────────────────────
        // Damage scales from 1× at the ring edge to 4× at the far arena wall.
        const overlapFrac = Math.min(1, overlapPx / arenaRadius);
        const scaledDrain = ZONE_BASE_DAMAGE * (1 + overlapFrac * 3.0) * dtS;
        bey.spin = Math.max(0, bey.spin - scaledDrain);
        if (overlapFrac > maxFracThisTick) maxFracThisTick = overlapFrac;
      }
    });

    // Update zoneDistanceFrac so the client HUD can display a danger meter
    arena.zoneDistanceFrac = maxFracThisTick;
  }
}
