// [SERVER-AI] AIController — server-side AI input generation for AIBattleRoom.
// Computes a PlayerInput each tick based on difficulty level.
// All logic is synchronous — no async calls.

export type AIDifficulty = "easy" | "medium" | "hard";

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
  private randomDirTimer: number = 0;
  private randomDirX: number = 0;
  private randomDirY: number = 0;

  constructor(difficulty: AIDifficulty) {
    this.difficulty = difficulty;
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
      case "easy":   return this.easyInput(ai, nearest, arenaCenterX, arenaCenterY, arenaRadius);
      case "medium": return this.mediumInput(ai, nearest, arenaCenterX, arenaCenterY, arenaRadius);
      case "hard":   return this.hardInput(ai, nearest, arenaCenterX, arenaCenterY, arenaRadius);
    }
  }

  // ── Easy: random direction changes, attack only when close ─────────────────

  private easyInput(
    ai: BeybladeSnapshot,
    nearest: BeybladeSnapshot | null,
    cx: number, cy: number, r: number
  ): AIPlayerInput {
    const input: AIPlayerInput = {};

    // Random direction change every ~90 ticks (1.5s)
    if (this.randomDirTimer <= 0) {
      const angle = Math.random() * Math.PI * 2;
      this.randomDirX = Math.cos(angle);
      this.randomDirY = Math.sin(angle);
      this.randomDirTimer = 60 + Math.random() * 60;
    }
    this.randomDirTimer--;

    this.applyMoveDir(input, this.randomDirX, this.randomDirY);

    // Attack if opponent within 300px
    if (nearest) {
      const dist = this.distanceTo(ai, nearest);
      if (dist < 300) {
        input.attack = true;
      }
    }

    // Avoid being too close to arena edge
    const dx = ai.x - cx;
    const dy = ai.y - cy;
    const distFromCenter = Math.sqrt(dx * dx + dy * dy);
    if (distFromCenter > r * 0.8) {
      this.applyMoveDir(input, -dx / distFromCenter, -dy / distFromCenter);
    }

    return input;
  }

  // ── Medium: chase opponent, avoid pits, use special when spin < 40% ────────

  private mediumInput(
    ai: BeybladeSnapshot,
    nearest: BeybladeSnapshot | null,
    cx: number, cy: number, r: number
  ): AIPlayerInput {
    const input: AIPlayerInput = {};

    // Move toward nearest opponent
    if (nearest) {
      const dx = nearest.x - ai.x;
      const dy = nearest.y - ai.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist > 0) {
        this.applyMoveDir(input, dx / dist, dy / dist);
      }

      // Attack when close
      if (dist < 200) input.attack = true;

      // Defense when very close and low spin
      const spinRatio = ai.spin / ai.maxSpin;
      if (dist < 150 && spinRatio < 0.5) input.defense = true;
    }

    // Avoid arena edge
    const dx = ai.x - cx;
    const dy = ai.y - cy;
    const distFromCenter = Math.sqrt(dx * dx + dy * dy);
    if (distFromCenter > r * 0.8) {
      this.applyMoveDir(input, -dx / distFromCenter, -dy / distFromCenter);
    }

    // Use special when spin < 40%
    if (ai.spin / ai.maxSpin < 0.4 && ai.power >= 50) {
      input.specialTap = true;
    }

    // Charge power passively
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
      // Predict opponent position 5 ticks ahead
      const predictedX = nearest.x + nearest.velocityX * 5;
      const predictedY = nearest.y + nearest.velocityY * 5;

      const dx = predictedX - ai.x;
      const dy = predictedY - ai.y;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist > 0) {
        const normX = dx / dist;
        const normY = dy / dist;

        if (dist > 120) {
          // Chase predicted position
          this.applyMoveDir(input, normX, normY);
        } else {
          // Circle-strafe: perpendicular to opponent
          const perpX = -normY;
          const perpY = normX;
          this.applyMoveDir(input, perpX, perpY);
        }
      }

      // Attack when within range
      if (dist < 180) input.attack = true;

      // Dodge if opponent is charging directly at AI
      const relVelX = nearest.velocityX - ai.velocityX;
      const relVelY = nearest.velocityY - ai.velocityY;
      const closingSpeed = -(relVelX * (nearest.x - ai.x) + relVelY * (nearest.y - ai.y)) / Math.max(dist, 1);
      if (closingSpeed > 3 && dist < 200 && ai.power >= 10) {
        input.dodge = true;
      }

      // Defense when cornered (near edge AND opponent close)
      const distFromCenter = Math.sqrt((ai.x - cx) ** 2 + (ai.y - cy) ** 2);
      if (distFromCenter > r * 0.75 && dist < 200) {
        input.defense = true;
      }

      // Use special move at optimal timing: opponent close + power full
      const spinRatio = ai.spin / ai.maxSpin;
      if (ai.power >= 50 && dist < 250 && spinRatio < 0.6) {
        input.specialTap = true;
      }
    }

    // Avoid arena edge
    const edgeDx = ai.x - cx;
    const edgeDy = ai.y - cy;
    const distFromCenter = Math.sqrt(edgeDx * edgeDx + edgeDy * edgeDy);
    if (distFromCenter > r * 0.82) {
      this.applyMoveDir(input, -edgeDx / distFromCenter, -edgeDy / distFromCenter);
    }

    // Charge power
    if (ai.power < 80 && !input.dodge) input.chargeHeld = true;

    // Jump occasionally when airborne hasn't been used recently
    if (this.tickCounter % 300 === 0 && !ai.isAirborne) {
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
    // Convert world direction to WASD — apply the dominant axis as both
    if (Math.abs(normX) > 0.3) {
      if (normX > 0) input.moveRight = true; else input.moveLeft = true;
    }
    if (Math.abs(normY) > 0.3) {
      if (normY > 0) input.moveDown = true; else input.moveUp = true;
    }
  }
}
