// [SERVER-AI] AIController — server-side AI input generation for AIBattleRoom.
// Computes a PlayerInput each tick based on difficulty level.
// All logic is synchronous — no async calls.

import type { PlayerInput } from "../shared/utils/bitmask";

// Difficulty was previously easy|medium|hard. Easy was removed; Hell added.
// Defensive: legacy "easy" reads collapse to "medium" at the call site.
export type AIDifficulty = "medium" | "hard" | "hell";

interface Vec2 { x: number; y: number; }

// Minimal combo slot representation the AI needs to evaluate
export interface AIComboSlot {
  sequence: string[];     // e.g. ["moveRight","moveRight","attack"]
  effectId: string;
  cost?: number;          // power cost (default 0)
  condition?: {
    maxRange?: number;
    minPower?: number;
    spinDirectionRequired?: "left" | "right";
    minSpin?: number;     // % of maxSpin
    maxSpin?: number;     // % of maxSpin
  };
}

interface BeybladeSnapshot {
  id: string;
  x: number; y: number;
  velocityX: number; velocityY: number;
  rotation: number;
  spin: number; maxSpin: number;
  isAirborne: boolean;
  inPit: boolean;
  power: number;
  spinDirection: string;
  type: string;
  // Phase S additions
  comboSlots?: AIComboSlot[];
  beyTiltAngle?: number;       // degrees 0–360: 0=vertical, 90=on-side, 180=on-back, 270=on-head, 360=full rotation
  specialMoveActive?: boolean; // true while opponent's special is executing
}

export interface AIPlayerInput {
  moveLeft?: boolean;
  moveRight?: boolean;
  moveUp?: boolean;
  moveDown?: boolean;
  jump?: boolean;
  attack?: boolean;
  defense?: boolean;
  dodge?: boolean;
  chargeHeld?: boolean;
  specialTap?: boolean;
  comboKeys?: string[];
}

export class AIController {
  private difficulty: AIDifficulty;
  private tickCounter: number = 0;
  private currentTargetId: string = "";

  // Phase S: per-instance combo state
  private pendingComboKeys: string[] = [];
  private pendingComboTick: number = 0;
  private lastComboEvalTick: number = 0;
  private specialMoveFired: boolean = false;
  private slotCooldowns: Map<string, number> = new Map(); // effectId → tickWhenAvailable

  constructor(difficulty: AIDifficulty | string) {
    // Defensive: collapse legacy "easy" reads to "medium".
    const d = (difficulty === "easy" ? "medium" : difficulty) as AIDifficulty;
    this.difficulty = (d === "medium" || d === "hard" || d === "hell") ? d : "medium";
  }

  computeInput(
    ai: BeybladeSnapshot,
    opponents: BeybladeSnapshot[],
    arenaCenterX: number,
    arenaCenterY: number,
    arenaRadius: number
  ): AIPlayerInput {
    this.tickCounter++;

    // Reset specialMoveFired when power bar drops back to 0 after a fire
    if (ai.power <= 5 && this.specialMoveFired) {
      this.specialMoveFired = false;
    }

    const activeOpponents = opponents.filter(o => o.spin > 0);
    const nearest = this.getNearestOpponent(ai, activeOpponents);

    switch (this.difficulty) {
      case "medium": return this.mediumInput(ai, nearest, arenaCenterX, arenaCenterY, arenaRadius);
      case "hard":   return this.hardInput(ai, nearest, arenaCenterX, arenaCenterY, arenaRadius);
      case "hell":   return this.hellInput(ai, nearest, arenaCenterX, arenaCenterY, arenaRadius);
    }
  }

  // ── Phase S: evaluate combo slots and pick the best one ─────────────────────

  /**
   * Returns the best eligible combo slot for the AI to fire, or null.
   * Hell AI uses full intelligence; Medium/Hard use simplified filtering.
   * @param approachDirX - normalized X component of approach direction (Hell only)
   * @param approachDirY - normalized Y component of approach direction (Hell only)
   */
  private evaluateComboSlots(
    ai: BeybladeSnapshot,
    nearest: BeybladeSnapshot | null,
    intelligenceLevel: "simple" | "full",
    approachDirX = 0,
    approachDirY = 0,
  ): AIComboSlot | null {
    const slots = ai.comboSlots;
    if (!slots || slots.length === 0) return null;

    const distToNearest = nearest
      ? Math.sqrt((ai.x - nearest.x) ** 2 + (ai.y - nearest.y) ** 2)
      : Infinity;
    const spinRatio = ai.maxSpin > 0 ? ai.spin / ai.maxSpin : 0;

    // Filter: basic eligibility
    const eligible = slots.filter(slot => {
      const cost = slot.cost ?? 0;
      if (ai.power < cost) return false;
      const cd = this.slotCooldowns.get(slot.effectId) ?? 0;
      if (this.tickCounter < cd) return false;
      const cond = slot.condition;
      if (!cond) return true;
      if (cond.maxRange !== undefined && distToNearest > cond.maxRange) return false;
      if (cond.minPower !== undefined && ai.power < cond.minPower) return false;
      if (cond.minSpin !== undefined && spinRatio * 100 < cond.minSpin) return false;
      if (cond.maxSpin !== undefined && spinRatio * 100 > cond.maxSpin) return false;
      return true;
    });

    if (eligible.length === 0) return null;

    if (intelligenceLevel === "simple") {
      // Simple: just pick the first eligible slot
      return eligible[0];
    }

    // Full (Hell): prefer spin-direction-aligned combos; skip damage combos vs invulnerable opponents
    const spinAligned = eligible.filter(s => {
      const req = s.condition?.spinDirectionRequired;
      return !req || req === ai.spinDirection;
    });

    const safe = (spinAligned.length ? spinAligned : eligible).filter(s => {
      // Skip combos that are purely offensive while opponent has special move active
      if (nearest?.specialMoveActive) {
        const isDamageFocused = s.effectId.includes("thrust") ||
          s.effectId.includes("strike") || s.effectId.includes("rush");
        return !isDamageFocused;
      }
      return true;
    });

    const pool = safe.length ? safe : eligible;

    // Direction alignment: prefer combos whose first key matches approach direction.
    // e.g. charging from the left → first key moveRight scores higher.
    const dirKeyScore = (seq: string[]): number => {
      if (!seq.length || (approachDirX === 0 && approachDirY === 0)) return 0;
      const first = seq[0];
      if (approachDirX > 0.5 && first === "moveRight") return 2;
      if (approachDirX < -0.5 && first === "moveLeft") return 2;
      if (approachDirY < -0.5 && first === "moveUp") return 1;
      if (approachDirY > 0.5 && first === "moveDown") return 1;
      return 0;
    };

    // Score = direction alignment (0–2) + cost weight (0.01/unit to break ties)
    pool.sort((a, b) => {
      const scoreA = dirKeyScore(a.sequence) + (a.cost ?? 0) * 0.01;
      const scoreB = dirKeyScore(b.sequence) + (b.cost ?? 0) * 0.01;
      return scoreB - scoreA;
    });
    return pool[0];
  }

  /** Fire a chosen combo slot: stage its sequence key-by-key over next N ticks. */
  private stageCombo(slot: AIComboSlot): void {
    this.pendingComboKeys = [...slot.sequence];
    this.pendingComboTick = 0;
    // Apply a cooldown so the same slot doesn't re-fire too quickly (180t = 3s)
    this.slotCooldowns.set(slot.effectId, this.tickCounter + 180);
  }

  /** Consume the next pending combo key if one is staged. Returns true if a key was emitted. */
  private dequeuePendingCombo(input: AIPlayerInput): boolean {
    if (this.pendingComboKeys.length === 0) return false;
    const key = this.pendingComboKeys.shift()!;
    // Map key name to input field
    (input as any)[key] = true;
    return true;
  }

  // ── Medium: chase opponent, avoid pits, use special when spin < 40% ────────

  private mediumInput(
    ai: BeybladeSnapshot,
    nearest: BeybladeSnapshot | null,
    cx: number, cy: number, r: number
  ): AIPlayerInput {
    const input: AIPlayerInput = {};

    if (nearest) {
      const dx = nearest.x - ai.x;
      const dy = nearest.y - ai.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist > 0) {
        this.applyMoveDir(input, dx / dist, dy / dist);
      }

      if (dist < 200) input.attack = true;

      const spinRatio = ai.spin / ai.maxSpin;
      if (dist < 150 && spinRatio < 0.5) input.defense = true;
    }

    const dx = ai.x - cx;
    const dy = ai.y - cy;
    const distFromCenter = Math.sqrt(dx * dx + dy * dy);
    if (distFromCenter > r * 0.8) {
      this.applyMoveDir(input, -dx / distFromCenter, -dy / distFromCenter);
    }

    if (ai.spin / ai.maxSpin < 0.4 && ai.power >= 50) {
      input.specialTap = true;
    }

    if (ai.power < 50) input.chargeHeld = true;

    // Phase S: Medium AI — fire first eligible combo slot every 3s (180t)
    if (this.pendingComboKeys.length > 0) {
      this.dequeuePendingCombo(input);
    } else if (this.tickCounter - this.lastComboEvalTick >= 180) {
      const slot = this.evaluateComboSlots(ai, nearest, "simple");
      if (slot) {
        this.stageCombo(slot);
        this.dequeuePendingCombo(input);
      }
      this.lastComboEvalTick = this.tickCounter;
    }

    return input;
  }

  // ── Hard: predict opponent, circle-strafe, optimal special timing ───────────

  private hardInput(
    ai: BeybladeSnapshot,
    nearest: BeybladeSnapshot | null,
    cx: number, cy: number, r: number
  ): AIPlayerInput {
    const input: AIPlayerInput = {};

    if (nearest) {
      const predictedX = nearest.x + nearest.velocityX * 5;
      const predictedY = nearest.y + nearest.velocityY * 5;

      const dx = predictedX - ai.x;
      const dy = predictedY - ai.y;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist > 0) {
        const normX = dx / dist;
        const normY = dy / dist;

        if (dist > 120) {
          this.applyMoveDir(input, normX, normY);
        } else {
          const perpX = -normY;
          const perpY = normX;
          this.applyMoveDir(input, perpX, perpY);
        }
      }

      if (dist < 180) input.attack = true;

      const relVelX = nearest.velocityX - ai.velocityX;
      const relVelY = nearest.velocityY - ai.velocityY;
      const closingSpeed = -(relVelX * (nearest.x - ai.x) + relVelY * (nearest.y - ai.y)) / Math.max(dist, 1);
      if (closingSpeed > 3 && dist < 200 && ai.power >= 10) {
        input.dodge = true;
      }

      const distFromCenter = Math.sqrt((ai.x - cx) ** 2 + (ai.y - cy) ** 2);
      if (distFromCenter > r * 0.75 && dist < 200) {
        input.defense = true;
      }

      const spinRatio = ai.spin / ai.maxSpin;
      if (ai.power >= 50 && dist < 250 && !this.specialMoveFired) {
        input.specialTap = true;
        this.specialMoveFired = true;
      }

      // Phase S: Hard AI — fire best eligible combo every 1s (60t) when in range
      if (this.pendingComboKeys.length > 0) {
        this.dequeuePendingCombo(input);
      } else if (this.tickCounter - this.lastComboEvalTick >= 60 && dist < 300) {
        const slot = this.evaluateComboSlots(ai, nearest, "simple");
        if (slot) {
          this.stageCombo(slot);
          input.comboKeys = [...slot.sequence]; // Signal the full sequence to the room
          this.dequeuePendingCombo(input);
        }
        this.lastComboEvalTick = this.tickCounter;
      }
    }

    const edgeDx = ai.x - cx;
    const edgeDy = ai.y - cy;
    const distFromCenter = Math.sqrt(edgeDx * edgeDx + edgeDy * edgeDy);
    if (distFromCenter > r * 0.82) {
      this.applyMoveDir(input, -edgeDx / distFromCenter, -edgeDy / distFromCenter);
    }

    if (ai.power < 80 && !input.dodge) input.chargeHeld = true;

    if (this.tickCounter % 300 === 0 && !ai.isAirborne) {
      input.jump = true;
    }

    return input;
  }

  // ── Hell: frame-perfect dodges, longer prediction window, ring-out aware,
  //          full combo intelligence, opportunistic edge pushes. ──────────────

  private hellInput(
    ai: BeybladeSnapshot,
    nearest: BeybladeSnapshot | null,
    cx: number, cy: number, r: number
  ): AIPlayerInput {
    const input: AIPlayerInput = {};

    if (nearest) {
      // Look 10 ticks ahead (vs 5 in hard) — anticipate further.
      const predictedX = nearest.x + nearest.velocityX * 10;
      const predictedY = nearest.y + nearest.velocityY * 10;

      const dx = predictedX - ai.x;
      const dy = predictedY - ai.y;
      const dist = Math.sqrt(dx * dx + dy * dy);

      // Vector from arena center to opponent (push direction for ring-out).
      const oppDx = nearest.x - cx;
      const oppDy = nearest.y - cy;
      const oppDistFromCenter = Math.sqrt(oppDx * oppDx + oppDy * oppDy);

      if (dist > 0) {
        const normX = dx / dist;
        const normY = dy / dist;

        if (dist > 140) {
          // Approach from the side that pushes opponent toward the wall.
          if (oppDistFromCenter > r * 0.45) {
            const pushNormX = oppDx / Math.max(oppDistFromCenter, 1);
            const pushNormY = oppDy / Math.max(oppDistFromCenter, 1);
            const approachX = nearest.x - pushNormX * 80 - ai.x;
            const approachY = nearest.y - pushNormY * 80 - ai.y;
            const aLen = Math.sqrt(approachX * approachX + approachY * approachY) || 1;
            this.applyMoveDir(input, approachX / aLen, approachY / aLen);
          } else {
            this.applyMoveDir(input, normX, normY);
          }
        } else {
          // Tight circle-strafe.
          const perpX = -normY;
          const perpY = normX;
          this.applyMoveDir(input, perpX * 1.2, perpY * 1.2);
        }
      }

      // Attack inside a wider window than hard.
      if (dist < 220) input.attack = true;

      // Frame-perfect dodge: react to any incoming closing speed > 2.
      const relVelX = nearest.velocityX - ai.velocityX;
      const relVelY = nearest.velocityY - ai.velocityY;
      const closingSpeed = -(relVelX * (nearest.x - ai.x) + relVelY * (nearest.y - ai.y)) / Math.max(dist, 1);
      if (closingSpeed > 2 && dist < 240 && ai.power >= 8) {
        input.dodge = true;
      }

      // Defense only when truly cornered; otherwise prefer offensive trade.
      const distFromCenter = Math.sqrt((ai.x - cx) ** 2 + (ai.y - cy) ** 2);
      if (distFromCenter > r * 0.85 && dist < 180) {
        input.defense = true;
      }

      // Fire special as soon as it's chargeable (>= 50 power).
      if (ai.power >= 50 && !this.specialMoveFired) {
        input.specialTap = true;
        this.specialMoveFired = true;
      }

      // Phase S: Hell AI — evaluate combo slots with full intelligence every ~30t
      if (this.pendingComboKeys.length > 0) {
        this.dequeuePendingCombo(input);
      } else if (this.tickCounter - this.lastComboEvalTick >= 30) {
        // Tilt awareness: if self is tilted > 30°, prefer stabilization combos
        const selfTilt = ai.beyTiltAngle ?? 0;
        // Approach direction normalized toward opponent (for direction-aligned combo picks)
        const approachDirX = nearest && dist > 0 ? (nearest.x - ai.x) / dist : 0;
        const approachDirY = nearest && dist > 0 ? (nearest.y - ai.y) / dist : 0;
        let slot: AIComboSlot | null = null;

        if (selfTilt > 30) {
          // Look for a stabilization/defense combo first
          slot = this.evaluateComboSlots(ai, nearest, "full", approachDirX, approachDirY);
        } else if (nearest && (nearest.beyTiltAngle ?? 0) > 35) {
          // Opponent is tilted — rush in for burst chance
          if (dist < 300) {
            slot = this.evaluateComboSlots(ai, nearest, "full", approachDirX, approachDirY);
          }
        } else if (dist < 280) {
          slot = this.evaluateComboSlots(ai, nearest, "full", approachDirX, approachDirY);
        }

        if (slot) {
          this.stageCombo(slot);
          input.comboKeys = [...slot.sequence]; // Signal the full sequence to the room
          this.dequeuePendingCombo(input);
        }
        this.lastComboEvalTick = this.tickCounter;
      }
    }

    // Stay slightly closer to center than hard — better positioning.
    const edgeDx = ai.x - cx;
    const edgeDy = ai.y - cy;
    const distFromCenter = Math.sqrt(edgeDx * edgeDx + edgeDy * edgeDy);
    if (distFromCenter > r * 0.78) {
      this.applyMoveDir(input, -edgeDx / distFromCenter, -edgeDy / distFromCenter);
    }

    // Charge aggressively; recover power quickly between strikes.
    if (ai.power < 95 && !input.dodge) input.chargeHeld = true;

    // Jump on a faster cadence (~3s) to break tracked motion.
    if (this.tickCounter % 180 === 0 && !ai.isAirborne) {
      input.jump = true;
    }

    return input;
  }

  // ── Helpers ─────────────────────────────────────────────────────────────────

  private getNearestOpponent(ai: BeybladeSnapshot, opponents: BeybladeSnapshot[]): BeybladeSnapshot | null {
    if (opponents.length === 0) return null;
    let nearest = opponents[0];
    let minDist = this.distanceTo(ai, opponents[0]);
    for (const opp of opponents) {
      const d = this.distanceTo(ai, opp);
      if (d < minDist) { minDist = d; nearest = opp; }
    }
    return nearest;
  }

  private distanceTo(a: BeybladeSnapshot, b: BeybladeSnapshot): number {
    return Math.sqrt((a.x - b.x) ** 2 + (a.y - b.y) ** 2);
  }

  private applyMoveDir(input: AIPlayerInput, normX: number, normY: number): void {
    if (Math.abs(normX) > 0.3) {
      if (normX > 0) input.moveRight = true; else input.moveLeft = true;
    }
    if (Math.abs(normY) > 0.3) {
      if (normY > 0) input.moveDown = true; else input.moveUp = true;
    }
  }

  // ─── Client-side AI override ─────────────────────────────────────────────
  private clientOverrides: Map<string, PlayerInput> = new Map();

  overrideInput(beyId: string, input: PlayerInput): void {
    this.clientOverrides.set(beyId, input);
  }

  consumeOverride(beyId: string): PlayerInput | null {
    const override = this.clientOverrides.get(beyId);
    if (override) {
      this.clientOverrides.delete(beyId);
      return override;
    }
    return null;
  }
}
