// [SERVER-AI] AIController — server-side AI input generation for AIBattleRoom.
// Computes a PlayerInput each tick based on difficulty level.
// All logic is synchronous — no async calls.

// Difficulty was previously easy|medium|hard. Easy was removed; Hell added.
// Defensive: legacy "easy" reads collapse to "medium" at the call site.
export type AIDifficulty = "medium" | "hard" | "hell";

interface Vec2 { x: number; y: number; }

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

    const activeOpponents = opponents.filter(o => o.spin > 0);
    const nearest = this.getNearestOpponent(ai, activeOpponents);

    switch (this.difficulty) {
      case "medium": return this.mediumInput(ai, nearest, arenaCenterX, arenaCenterY, arenaRadius);
      case "hard":   return this.hardInput(ai, nearest, arenaCenterX, arenaCenterY, arenaRadius);
      case "hell":   return this.hellInput(ai, nearest, arenaCenterX, arenaCenterY, arenaRadius);
    }
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
      if (ai.power >= 50 && dist < 250 && spinRatio < 0.6) {
        input.specialTap = true;
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
  //          aggressive special + combo cadence, opportunistic edge pushes. ──

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
            // Aim a point opposite the wall — so contact knocks opponent outward.
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

      // Use special the moment it's chargeable and opponent is in kill range.
      if (ai.power >= 50 && dist < 260) {
        input.specialTap = true;
      }

      // Combo cadence: fire a 3-key combo every ~120 ticks (~2s) when in range.
      // Picks based on relative angle so combos line up with strike direction.
      if (this.tickCounter % 120 === 0 && dist < 220 && ai.power >= 25) {
        const angle = Math.atan2(dy, dx);
        if (angle > -Math.PI / 4 && angle < Math.PI / 4) {
          input.comboKeys = ["moveRight", "moveRight", "attack"];      // quick-dash-r
        } else if (angle > 3 * Math.PI / 4 || angle < -3 * Math.PI / 4) {
          input.comboKeys = ["moveLeft", "moveLeft", "attack"];        // quick-dash-l
        } else {
          input.comboKeys = ["attack", "attack", "attack"];            // power-thrust
        }
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
}
