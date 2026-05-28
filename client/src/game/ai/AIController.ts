// Client-side AIController — ported from server/ai/AIController.ts.
// No Colyseus / server dependencies — runs in-browser for local pvai/story-battle modes.

export type AIDifficulty = 'medium' | 'hard' | 'hell';

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

export interface AIComboSlot {
  sequence: string[];
  effectId: string;
  cost?: number;
  condition?: {
    maxRange?: number;
    minPower?: number;
    spinDirectionRequired?: 'left' | 'right';
    minSpin?: number;
    maxSpin?: number;
  };
}

export interface BeybladeSnapshot {
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
  comboSlots?: AIComboSlot[];
  beyTiltAngle?: number;
  specialMoveActive?: boolean;
  obstacles?: Array<{ x: number; y: number; radius: number }>;
  pits?: Array<{ x: number; y: number; radius: number }>;
}

export class AIController {
  private difficulty: AIDifficulty;
  private tickCounter = 0;
  private pendingComboKeys: string[] = [];
  private pendingComboTick = 0;
  private lastComboEvalTick = 0;
  private specialMoveFired = false;
  private slotCooldowns = new Map<string, number>();

  constructor(difficulty: AIDifficulty | string) {
    const d = (difficulty === 'easy' ? 'medium' : difficulty) as AIDifficulty;
    this.difficulty = (d === 'medium' || d === 'hard' || d === 'hell') ? d : 'medium';
  }

  computeInput(
    ai: BeybladeSnapshot,
    opponents: BeybladeSnapshot[],
    arenaCenterX: number,
    arenaCenterY: number,
    arenaRadius: number,
  ): AIPlayerInput {
    this.tickCounter++;
    if (ai.power <= 5 && this.specialMoveFired) this.specialMoveFired = false;
    const active = opponents.filter(o => o.spin > 0);
    const nearest = this.getNearestOpponent(ai, active);
    switch (this.difficulty) {
      case 'medium': return this.mediumInput(ai, nearest, arenaCenterX, arenaCenterY, arenaRadius);
      case 'hard':   return this.hardInput(ai, nearest, arenaCenterX, arenaCenterY, arenaRadius);
      case 'hell':   return this.hellInput(ai, nearest, arenaCenterX, arenaCenterY, arenaRadius);
    }
  }

  private evaluateComboSlots(
    ai: BeybladeSnapshot,
    nearest: BeybladeSnapshot | null,
    level: 'simple' | 'full',
    approachDirX = 0,
    approachDirY = 0,
  ): AIComboSlot | null {
    const slots = ai.comboSlots;
    if (!slots || !slots.length) return null;
    const dist = nearest ? Math.sqrt((ai.x - nearest.x) ** 2 + (ai.y - nearest.y) ** 2) : Infinity;
    const spinRatio = ai.maxSpin > 0 ? ai.spin / ai.maxSpin : 0;
    const eligible = slots.filter(s => {
      const cost = s.cost ?? 0;
      if (ai.power < cost) return false;
      if ((this.slotCooldowns.get(s.effectId) ?? 0) > this.tickCounter) return false;
      const c = s.condition;
      if (!c) return true;
      if (c.maxRange !== undefined && dist > c.maxRange) return false;
      if (c.minPower !== undefined && ai.power < c.minPower) return false;
      if (c.minSpin !== undefined && spinRatio * 100 < c.minSpin) return false;
      if (c.maxSpin !== undefined && spinRatio * 100 > c.maxSpin) return false;
      return true;
    });
    if (!eligible.length) return null;
    if (level === 'simple') return eligible[0];
    const spin = eligible.filter(s => !s.condition?.spinDirectionRequired || s.condition.spinDirectionRequired === ai.spinDirection);
    const safe = (spin.length ? spin : eligible).filter(s => {
      if (nearest?.specialMoveActive) {
        return !(s.effectId.includes('thrust') || s.effectId.includes('strike') || s.effectId.includes('rush'));
      }
      return true;
    });
    const pool = safe.length ? safe : eligible;
    pool.sort((a, b) => {
      const score = (seq: string[]) => {
        if (!seq.length || (!approachDirX && !approachDirY)) return 0;
        const f = seq[0];
        if (approachDirX > 0.5 && f === 'moveRight') return 2;
        if (approachDirX < -0.5 && f === 'moveLeft') return 2;
        if (approachDirY < -0.5 && f === 'moveUp') return 1;
        if (approachDirY > 0.5 && f === 'moveDown') return 1;
        return 0;
      };
      return (score(b.sequence) + (b.cost ?? 0) * 0.01) - (score(a.sequence) + (a.cost ?? 0) * 0.01);
    });
    return pool[0];
  }

  private stageCombo(slot: AIComboSlot) {
    this.pendingComboKeys = [...slot.sequence];
    this.pendingComboTick = 0;
    this.slotCooldowns.set(slot.effectId, this.tickCounter + 180);
  }

  private dequeuePendingCombo(input: AIPlayerInput): boolean {
    if (!this.pendingComboKeys.length) return false;
    const key = this.pendingComboKeys.shift()!;
    (input as Record<string, boolean>)[key] = true;
    return true;
  }

  private mediumInput(
    ai: BeybladeSnapshot, nearest: BeybladeSnapshot | null,
    cx: number, cy: number, r: number,
  ): AIPlayerInput {
    const input: AIPlayerInput = {};
    if (nearest) {
      const dx = nearest.x - ai.x, dy = nearest.y - ai.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist > 0) this.applyMoveDir(input, dx / dist, dy / dist);
      if (dist < 3200) input.attack = true;
      if (dist < 2400 && ai.spin / ai.maxSpin < 0.5) input.defense = true;
    }
    const dx = ai.x - cx, dy = ai.y - cy;
    const d = Math.sqrt(dx * dx + dy * dy);
    if (d > r * 0.8) this.applyMoveDir(input, -dx / d, -dy / d);
    if (ai.spin / ai.maxSpin < 0.4 && ai.power >= 50) input.specialTap = true;
    if (ai.power < 50) input.chargeHeld = true;
    if (this.pendingComboKeys.length) this.dequeuePendingCombo(input);
    else if (this.tickCounter - this.lastComboEvalTick >= 180) {
      const slot = this.evaluateComboSlots(ai, nearest, 'simple');
      if (slot) { this.stageCombo(slot); this.dequeuePendingCombo(input); }
      this.lastComboEvalTick = this.tickCounter;
    }
    return input;
  }

  private hardInput(
    ai: BeybladeSnapshot, nearest: BeybladeSnapshot | null,
    cx: number, cy: number, r: number,
  ): AIPlayerInput {
    const input: AIPlayerInput = {};
    if (nearest) {
      const px = nearest.x + nearest.velocityX * 5;
      const py = nearest.y + nearest.velocityY * 5;
      const dx = px - ai.x, dy = py - ai.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist > 0) {
        const nx = dx / dist, ny = dy / dist;
        if (dist > 1920) {
          const d = this.avoidObstacles(ai, nx, ny);
          this.applyMoveDir(input, d.x, d.y);
        } else {
          this.applyMoveDir(input, -ny, nx);
        }
      }
      if (dist < 2880) input.attack = true;
      const rv = (nearest.velocityX - ai.velocityX) * (nearest.x - ai.x) + (nearest.velocityY - ai.velocityY) * (nearest.y - ai.y);
      const cs = -rv / Math.max(dist, 1);
      if (cs > 3 && dist < 3200 && ai.power >= 10) input.dodge = true;
      if (Math.sqrt((ai.x - cx) ** 2 + (ai.y - cy) ** 2) > r * 0.75 && dist < 3200) input.defense = true;
      if (ai.power >= 50 && dist < 4000 && !this.specialMoveFired) {
        input.specialTap = true; this.specialMoveFired = true;
      }
      if (this.pendingComboKeys.length) this.dequeuePendingCombo(input);
      else if (this.tickCounter - this.lastComboEvalTick >= 60 && dist < 4800) {
        const slot = this.evaluateComboSlots(ai, nearest, 'simple');
        if (slot) { this.stageCombo(slot); this.dequeuePendingCombo(input); }
        this.lastComboEvalTick = this.tickCounter;
      }
    }
    const ex = ai.x - cx, ey = ai.y - cy;
    const ed = Math.sqrt(ex * ex + ey * ey);
    if (ed > r * 0.82) this.applyMoveDir(input, -ex / ed, -ey / ed);
    if (ai.power < 80 && !input.dodge) input.chargeHeld = true;
    if (this.tickCounter % 300 === 0 && !ai.isAirborne) input.jump = true;
    return input;
  }

  private hellInput(
    ai: BeybladeSnapshot, nearest: BeybladeSnapshot | null,
    cx: number, cy: number, r: number,
  ): AIPlayerInput {
    const input: AIPlayerInput = {};
    if (nearest) {
      const px = nearest.x + nearest.velocityX * 10;
      const py = nearest.y + nearest.velocityY * 10;
      const dx = px - ai.x, dy = py - ai.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      const odx = nearest.x - cx, ody = nearest.y - cy;
      const od = Math.sqrt(odx * odx + ody * ody);
      if (dist > 0) {
        const nx = dx / dist, ny = dy / dist;
        if (dist > 2240) {
          let px2 = nx, py2 = ny;
          if (od > r * 0.45) {
            const pn = od || 1;
            const ax = nearest.x - (odx / pn) * 1280 - ai.x;
            const ay = nearest.y - (ody / pn) * 1280 - ai.y;
            const al = Math.sqrt(ax * ax + ay * ay) || 1;
            px2 = ax / al; py2 = ay / al;
          }
          const d = this.avoidObstacles(ai, px2, py2);
          this.applyMoveDir(input, d.x, d.y);
        } else {
          this.applyMoveDir(input, -ny * 1.2, nx * 1.2);
        }
      }
      if (dist < 3520) input.attack = true;
      const rv = (nearest.velocityX - ai.velocityX) * (nearest.x - ai.x) + (nearest.velocityY - ai.velocityY) * (nearest.y - ai.y);
      const cs = -rv / Math.max(dist, 1);
      if (cs > 2 && dist < 3840 && ai.power >= 8) input.dodge = true;
      if (Math.sqrt((ai.x - cx) ** 2 + (ai.y - cy) ** 2) > r * 0.85 && dist < 2880) input.defense = true;
      if (ai.power >= 50 && !this.specialMoveFired) { input.specialTap = true; this.specialMoveFired = true; }
      if (this.pendingComboKeys.length) this.dequeuePendingCombo(input);
      else if (this.tickCounter - this.lastComboEvalTick >= 30) {
        const adx = dist > 0 ? (nearest.x - ai.x) / dist : 0;
        const ady = dist > 0 ? (nearest.y - ai.y) / dist : 0;
        let slot: AIComboSlot | null = null;
        const tilt = ai.beyTiltAngle ?? 0;
        if (tilt > 30) slot = this.evaluateComboSlots(ai, nearest, 'full', adx, ady);
        else if ((nearest.beyTiltAngle ?? 0) > 35 && dist < 4800) slot = this.evaluateComboSlots(ai, nearest, 'full', adx, ady);
        else if (dist < 4480) slot = this.evaluateComboSlots(ai, nearest, 'full', adx, ady);
        if (slot) { this.stageCombo(slot); this.dequeuePendingCombo(input); }
        this.lastComboEvalTick = this.tickCounter;
      }
    }
    const ex = ai.x - cx, ey = ai.y - cy;
    const ed = Math.sqrt(ex * ex + ey * ey);
    if (ed > r * 0.78) this.applyMoveDir(input, -ex / ed, -ey / ed);
    if (ai.power < 95 && !input.dodge) input.chargeHeld = true;
    if (this.tickCounter % 180 === 0 && !ai.isAirborne) input.jump = true;
    return input;
  }

  private scanAhead(ai: BeybladeSnapshot, dx: number, dy: number, dist = 2240): boolean {
    const obstacles = [...(ai.obstacles ?? []), ...(ai.pits ?? [])];
    if (!obstacles.length) return false;
    const R = 384;
    for (const obs of obstacles) {
      const tx = obs.x - ai.x, ty = obs.y - ai.y;
      const t = Math.max(0, Math.min(dist, tx * dx + ty * dy));
      const cx2 = dx * t, cy2 = dy * t;
      const ddx = tx - cx2, ddy = ty - cy2;
      if (ddx * ddx + ddy * ddy < (obs.radius + R) ** 2) return true;
    }
    return false;
  }

  private avoidObstacles(ai: BeybladeSnapshot, px: number, py: number, dist = 2240): { x: number; y: number } {
    if (!this.scanAhead(ai, px, py, dist)) return { x: px, y: py };
    const base = Math.atan2(py, px);
    for (let s = 1; s <= 4; s++) {
      const a1 = base + (s * Math.PI) / 4;
      const t1x = Math.cos(a1), t1y = Math.sin(a1);
      if (!this.scanAhead(ai, t1x, t1y, dist)) return { x: t1x, y: t1y };
      const a2 = base - (s * Math.PI) / 4;
      const t2x = Math.cos(a2), t2y = Math.sin(a2);
      if (!this.scanAhead(ai, t2x, t2y, dist)) return { x: t2x, y: t2y };
    }
    return { x: px, y: py };
  }

  private getNearestOpponent(ai: BeybladeSnapshot, opponents: BeybladeSnapshot[]): BeybladeSnapshot | null {
    if (!opponents.length) return null;
    return opponents.reduce((best, opp) => {
      const d = (ai.x - opp.x) ** 2 + (ai.y - opp.y) ** 2;
      const bd = (ai.x - best.x) ** 2 + (ai.y - best.y) ** 2;
      return d < bd ? opp : best;
    });
  }

  private applyMoveDir(input: AIPlayerInput, nx: number, ny: number) {
    if (Math.abs(nx) > 0.3) { if (nx > 0) input.moveRight = true; else input.moveLeft = true; }
    if (Math.abs(ny) > 0.3) { if (ny > 0) input.moveDown = true; else input.moveUp = true; }
  }
}
