// L2A.5 — Per-bey seeded decision system.
// Uses a seeded PRNG (matchId + beybladeId) so decisions are deterministic and
// replay-safe. Timer fires every [30, 90] ticks; each tick a new decision is
// drawn from an archetype-weighted probability matrix.

import { registerMechanic } from "../MechanicRegistry";
import type { MechanicContext } from "../MechanicRegistry";
import { createPRNG } from "../../utils/prng";
import { hashString } from "../../utils/hashString";
import type { DecisionBias } from "../../shared/physics/NaturalMotion";

export type BeyDecision =
  | "continue_orbit"
  | "seek_opponent"
  | "avoid_wall"
  | "conserve_spin"
  | "counter_attack";

// Probability matrix by archetype [continue_orbit, seek_opponent, avoid_wall, conserve_spin, counter_attack]
const ARCHETYPE_WEIGHTS: Record<string, [number, number, number, number, number]> = {
  attack:   [0.10, 0.45, 0.10, 0.05, 0.30],
  defense:  [0.20, 0.10, 0.35, 0.15, 0.20],
  stamina:  [0.25, 0.10, 0.20, 0.35, 0.10],
  balanced: [0.20, 0.25, 0.20, 0.15, 0.20],
};
const DECISIONS: BeyDecision[] = [
  "continue_orbit", "seek_opponent", "avoid_wall", "conserve_spin", "counter_attack",
];

function pickDecision(rand: () => number, archetype: string): BeyDecision {
  const weights = ARCHETYPE_WEIGHTS[archetype] ?? ARCHETYPE_WEIGHTS.balanced;
  const r = rand();
  let cumulative = 0;
  for (let i = 0; i < weights.length; i++) {
    cumulative += weights[i];
    if (r < cumulative) return DECISIONS[i];
  }
  return "continue_orbit";
}

// Per-bey runtime state (stored in mechanic state JSON)
interface DecisionState {
  decision: BeyDecision;
  ticksRemaining: number;
  // Seeded PRNG sequence counter — we re-seed at each new timer cycle using
  // a combined seed so the sequence remains deterministic across replays.
  cycleIndex: number;
}

registerMechanic("bey_decision", {
  tick(ctx, params, rawState) {
    const s = rawState as unknown as DecisionState;
    // Initialise on first tick
    if (!s.decision) {
      s.decision = "continue_orbit";
      s.ticksRemaining = 30;
      s.cycleIndex = 0;
    }

    s.ticksRemaining--;
    if (s.ticksRemaining > 0) return;

    // Pull matchId + beybladeId from params (injected by gimmickExpander or room at match start)
    const matchId = (params.matchId as string | undefined) ?? "match";
    const beyId   = ctx.bey.beybladeId ?? ctx.bey.id;
    const seed    = hashString(matchId + beyId + String(s.cycleIndex));
    const rand    = createPRNG(seed);

    s.decision = pickDecision(rand, ctx.bey.type ?? "balanced");

    // Next timer: [30, 90] ticks (rand gives 0–1)
    s.ticksRemaining = 30 + Math.floor(rand() * 60);
    s.cycleIndex++;

    // Translate decision into a DecisionBias force and emit it through
    // the mechanic's applyForce / context helpers.
    applyDecision(ctx, s.decision, rand);
  },
});

function applyDecision(
  ctx: MechanicContext,
  decision: BeyDecision,
  rand: () => number,
): void {
  const bey = ctx.bey;
  const pos = ctx.getPosition?.(bey.id);
  if (!pos) return;

  switch (decision) {
    case "seek_opponent": {
      if (!ctx.opponent) return;
      const oppPos = ctx.getPosition?.(ctx.opponent.id);
      if (!oppPos) return;
      const dx = oppPos.x - pos.x;
      const dy = oppPos.y - pos.y;
      const d  = Math.sqrt(dx * dx + dy * dy) || 1;
      ctx.applyForce(bey.id, (dx / d) * 0.0004 * bey.mass, (dy / d) * 0.0004 * bey.mass);
      break;
    }
    case "avoid_wall": {
      // Assume arena centre at (0,0) — push away from boundary
      const rx = pos.x;
      const ry = pos.y;
      const r  = Math.sqrt(rx * rx + ry * ry) || 1;
      ctx.applyForce(bey.id, (-rx / r) * 0.0003 * bey.mass, (-ry / r) * 0.0003 * bey.mass);
      break;
    }
    case "conserve_spin": {
      // Slow down — apply slight braking force opposite to velocity
      const speed = Math.sqrt(bey.velocityX ** 2 + bey.velocityY ** 2) || 1;
      ctx.applyForce(
        bey.id,
        -(bey.velocityX / speed) * 0.0002 * bey.mass,
        -(bey.velocityY / speed) * 0.0002 * bey.mass,
      );
      break;
    }
    case "counter_attack": {
      if (!ctx.opponent) return;
      const oppPos2 = ctx.getPosition?.(ctx.opponent.id);
      if (!oppPos2) return;
      // High-speed burst toward opponent
      const dx2 = oppPos2.x - pos.x;
      const dy2 = oppPos2.y - pos.y;
      const d2  = Math.sqrt(dx2 * dx2 + dy2 * dy2) || 1;
      ctx.applyForce(bey.id, (dx2 / d2) * 0.0008 * bey.mass, (dy2 / d2) * 0.0008 * bey.mass);
      break;
    }
    case "continue_orbit":
    default:
      // No extra force — natural orbit layer handles this
      break;
  }

  void rand; // suppress unused warning — rand consumed for timer above
}

// Re-export so InputHandler can read it for DecisionBias injection
export type { DecisionBias };
