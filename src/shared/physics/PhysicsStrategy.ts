// Pluggable physics strategy. The 2D and 2.5D pipelines each provide an
// implementation; BaseRoom holds one and delegates per-tick work to it.

import type { Beyblade, GameState } from "../../rooms/schema/GameState";
import type { ArenaConfig } from "../../types/shared";

export interface CollisionEvent {
  aId: string;
  bId: string;
  damage: number;
  attacker: "a" | "b" | "none";
}

export interface PhysicsStrategy {
  // ── Lifecycle ───────────────────────────────────────────────────────────
  init(arenaData: ArenaConfig, arenaState: GameState["arena"]): void;
  reset(): void;
  dispose(): void;

  // ── Beyblade entity management ──────────────────────────────────────────
  registerBeyblade(beyblade: Beyblade, spawn: { x: number; y: number }): void;
  removeBeyblade(id: string): void;

  // ── Per-tick step ───────────────────────────────────────────────────────
  // Runs the underlying engine, applies arena features, returns collisions.
  tick(dt: number, state: GameState, arenaData: ArenaConfig): CollisionEvent[];

  // ── Direct controls (used by InputHandler + special moves) ──────────────
  applyForce(id: string, fx: number, fy: number): void;
  applyLateralForce(id: string, spinDirection: "left" | "right", magnitude: number): void;
  setPosition(id: string, x: number, y: number): void;
  setLinearVelocity(id: string, vx: number, vy: number): void;
  setAngularVelocity(id: string, omega: number): void;

  // ── Optional 2.5D hooks (no-op for classic 2D strategy) ─────────────────
  onButtonPressed?(beybladeId: string): void;
  computeLandingAOE?(beybladeId: string): number;
}
