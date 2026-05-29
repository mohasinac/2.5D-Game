// LocalGameSimulation — client-side physics loop.
// Used for: tryout (solo), pvai (1-human vs AI), story-battle.
// No Colyseus connection required — produces ServerGameState snapshots each tick.

import { doc, getDoc } from 'firebase/firestore';
import { db, COLLECTIONS } from '../../lib/firebase';
import type { ServerArenaState, ServerBeyblade, ServerGameState } from '../../types/game';
import type { GameRoomConfig } from '../../types/gameRoom';
import type { FullGameInput } from '../hooks/useGameInput';
import { AIController, type BeybladeSnapshot } from '../ai/AIController';
import { PHYSICS_SCALE } from '../../constants/units';

// ─── Physics constants (mirror TryoutGamePage) ────────────────────────────────
const FRICTION     = 0.97;
const MOVE_ACCEL   = 5.0;
const MAX_SPEED    = 350;
const SPIN_DECAY   = 7;
const POWER_REGEN  = 0.04;   // per frame at 60fps

const DEFAULT_ARENA_W = 1080;
const DEFAULT_ARENA_H = 1080;

// ─── Default arena config ─────────────────────────────────────────────────────
function defaultArena(id = 'default'): ServerArenaState {
  return {
    id, name: 'Standard Arena',
    width: DEFAULT_ARENA_W, height: DEFAULT_ARENA_H,
    shape: 'circle',
    theme: 'default',
    rotation: 0,
    autoRotate: false, rotationSpeed: 0,
    rotationDirection: 'clockwise',
    wallEnabled: true, wallAngle: 0,
    worldBgType: 'none',
    worldBgColor: '', worldBgImageUrl: '',
    worldBgOpacity: 1.0, worldBgFit: 'cover', worldBgBlurPx: 0,
  };
}

// ─── Create a default beyblade snapshot ──────────────────────────────────────
function makeBey(
  id: string, username: string, color: string, isAI: boolean,
  cx: number, cy: number, r: number, index: number, total: number,
): ServerBeyblade {
  const angle = (index / total) * Math.PI * 2;
  const spawnR = r * 0.35;
  return {
    id, userId: id, username,
    x: cx + Math.cos(angle) * spawnR,
    y: cy + Math.sin(angle) * spawnR,
    rotation: 0, velocityX: 0, velocityY: 0, angularVelocity: 15,
    health: 1600, maxHealth: 1600,
    stamina: 1600, maxStamina: 1600,
    spin: 2192, maxSpin: 2192,
    isActive: true, isAI, isInvulnerable: false,
    type: 'balanced', radius: 4, actualSize: 96,
    spinDirection: 'right', color,
    power: 0, isAirborne: false, airborneTimer: 0,
    isDefending: false, attackBuffTimer: 0, dodgeBuffTimer: 0,
    stunTimer: 0, comboExecuting: false,
    damageDealt: 0, damageReceived: 0, collisions: 0,
  };
}

const PLAYER_COLORS = ['#2288ff', '#ff4466', '#44dd88', '#ffaa22', '#aa44ff'];

// ─── LocalGameSimulation class ────────────────────────────────────────────────

export type SimStatus = 'idle' | 'loading' | 'countdown' | 'launching' | 'in-progress' | 'finished';
export type SimPhase = 'countdown' | 'launching' | 'in-progress';

export interface SimSnapshot {
  gameState: ServerGameState;
  beyblades: Map<string, ServerBeyblade>;
  myBeyId: string;
  status: SimStatus;
  countdown: number;
  launchTimer: number;
  launchTilt: number;
  launchPosition: number;
  launchPower: number;
  loadingError: string | null;
}

type OnSnapshotFn = (snap: SimSnapshot) => void;

export class LocalGameSimulation {
  private config: GameRoomConfig;
  private onSnapshot: OnSnapshotFn;

  private beyblades = new Map<string, ServerBeyblade>();
  private aiControllers = new Map<string, AIController>();
  private arena: ServerArenaState = defaultArena();
  private arenaRadius = DEFAULT_ARENA_W * 0.45;
  private winner = '';

  private myBeyId = 'player';
  private status: SimStatus = 'idle';
  private countdown = 3;
  private launchTimer = 5;
  private elapsed = 0;
  private rafId: number | null = null;
  private lastTs: number | null = null;
  private countdownInterval: ReturnType<typeof setInterval> | null = null;
  private launchInterval: ReturnType<typeof setInterval> | null = null;

  private launchTilt = 0;
  private launchPosition = 0.5;
  private launchPower = 0;
  private launchReady = false;

  constructor(config: GameRoomConfig, onSnapshot: OnSnapshotFn) {
    this.config = config;
    this.onSnapshot = onSnapshot;
  }

  async start() {
    this.status = 'loading';
    this.emitSnapshot();

    try {
      await this.loadData();
    } catch (e) {
      this.emitSnapshot(String(e));
      return;
    }

    this.startCountdown();
  }

  stop() {
    if (this.rafId !== null) { cancelAnimationFrame(this.rafId); this.rafId = null; }
    if (this.countdownInterval) { clearInterval(this.countdownInterval); this.countdownInterval = null; }
    if (this.launchInterval) { clearInterval(this.launchInterval); this.launchInterval = null; }
    this.lastTs = null;
  }

  // ─── Apply player input (called from useGameInput) ────────────────────────
  applyInput(input: FullGameInput) {
    const bey = this.beyblades.get(this.myBeyId);
    if (!bey) return;

    if (this.status === 'launching') {
      // Launch phase input
      if (input.moveLeft) this.launchTilt = Math.max(-45, this.launchTilt - 1.5);
      if (input.moveRight) this.launchTilt = Math.min(45, this.launchTilt + 1.5);
      if (input.moveUp) this.launchPosition = Math.max(0, this.launchPosition - 0.02);
      if (input.moveDown) this.launchPosition = Math.min(1, this.launchPosition + 0.02);
      if (input.chargeHeld) this.launchPower = Math.min(150, this.launchPower + 1.5);
      if (input.specialTap && this.launchPower > 0) this.launchReady = true;
      return;
    }

    if (this.status !== 'in-progress') return;

    const dt = 1 / 60;
    // Movement
    if (input.moveLeft)  bey.velocityX -= MOVE_ACCEL;
    if (input.moveRight) bey.velocityX += MOVE_ACCEL;
    if (input.moveUp)    bey.velocityY -= MOVE_ACCEL;
    if (input.moveDown)  bey.velocityY += MOVE_ACCEL;

    // Actions
    if (input.attack && bey.spin > bey.maxSpin * 0.1) {
      bey.isDefending = false;
    }
    if (input.defense) bey.isDefending = true;
    if (input.chargeHeld) bey.power = Math.min(150, bey.power + POWER_REGEN * 60);

    // Special
    if (input.specialTap && bey.power >= 100) {
      bey.power -= 100;
      bey.spin = Math.min(bey.maxSpin, bey.spin + bey.maxSpin * 0.08);
    }
  }

  // ─── Load beyblade and arena data from Firestore ──────────────────────────
  private async loadData() {
    const { beybladeId = 'default', arenaId = 'default', aiCount = 1, aiDifficulty = 'medium' } = this.config;
    const cx = DEFAULT_ARENA_W / 2, cy = DEFAULT_ARENA_H / 2;
    const total = this.config.roomType === 'tryout' ? 1 : 1 + (aiCount);

    // Load arena
    let arenaData: Record<string, unknown> | null = null;
    if (arenaId !== 'default') {
      try {
        const snap = await getDoc(doc(db, COLLECTIONS.ARENAS, arenaId));
        if (snap.exists()) arenaData = snap.data() as Record<string, unknown>;
      } catch { /* use defaults */ }
    }

    if (arenaData) {
      const w = (arenaData.width as number) ?? DEFAULT_ARENA_W;
      const h = (arenaData.height as number) ?? DEFAULT_ARENA_H;
      this.arenaRadius = Math.min(w, h) * 0.45;
      const wb = arenaData.worldBackground as Record<string, unknown> | undefined;
      this.arena = {
        ...defaultArena(arenaId),
        name: (arenaData.name as string) ?? 'Arena',
        width: w, height: h,
        shape: (arenaData.shape as 'circle' | 'rectangle') ?? 'circle',
        theme: (arenaData.theme as string) ?? 'default',
        wallAngle: (arenaData.wallAngle as number) ?? 0,
        worldBgType: (wb?.type as 'none' | 'color' | 'image') ?? 'none',
        worldBgColor: (wb?.color as string) ?? '',
        worldBgImageUrl: (wb?.imageUrl as string) ?? '',
      };
    }

    const arCx = (this.arena.width ?? DEFAULT_ARENA_W) / 2;
    const arCy = (this.arena.height ?? DEFAULT_ARENA_H) / 2;

    // Load player beyblade
    const playerBey = makeBey('player', 'Player', PLAYER_COLORS[0], false, arCx, arCy, this.arenaRadius, 0, total);
    if (beybladeId !== 'default') {
      try {
        const snap = await getDoc(doc(db, COLLECTIONS.BEYBLADE_STATS, beybladeId));
        if (snap.exists()) {
          const d = snap.data() as Record<string, unknown>;
          const staminaPts = ((d.typeDistribution as Record<string, number>)?.stamina) ?? 120;
          const maxSpin = (d.maxSpin as number) ?? 2000 * (1 + staminaPts * 0.0008);
          Object.assign(playerBey, {
            type: (d.type as string) ?? 'balanced',
            spinDirection: (d.spinDirection as string) ?? 'right',
            radius: (d.radius as number) ?? 4,
            actualSize: (d.actualSize as number) ?? ((d.radius as number) ?? 4) * 24,
            maxSpin, spin: maxSpin,
            maxStamina: (d.maxStamina as number) ?? 1600,
            stamina: (d.maxStamina as number) ?? 1600,
            health: (d.maxStamina as number) ?? 1600,
            maxHealth: (d.maxStamina as number) ?? 1600,
            color: (d.color as string) ?? PLAYER_COLORS[0],
            specialMove: (d.specialMoveId as string) ?? '',
            comboIds: (d.comboIds as string[]) ?? [],
            beybladeId,
          });
        }
      } catch { /* use player defaults */ }
    }
    // Ensure valid spin values regardless of Firestore data quality
    if (!playerBey.maxSpin || playerBey.maxSpin <= 0) playerBey.maxSpin = 2192;
    playerBey.spin = playerBey.maxSpin;
    this.myBeyId = 'player';
    this.beyblades.set('player', playerBey);

    // Create AI opponents
    if (this.config.roomType !== 'tryout') {
      const count = Math.max(1, Math.min(7, aiCount));
      for (let i = 0; i < count; i++) {
        const id = `ai_${i}`;
        const ai = makeBey(id, `CPU ${i + 1}`, PLAYER_COLORS[(i + 1) % PLAYER_COLORS.length], true, arCx, arCy, this.arenaRadius, i + 1, total);
        this.beyblades.set(id, ai);
        this.aiControllers.set(id, new AIController(aiDifficulty));
      }
    }
  }

  // ─── Countdown → Launch → Playing ────────────────────────────────────────
  private startCountdown() {
    this.status = 'countdown';
    this.countdown = 3;
    this.emitSnapshot();
    this.countdownInterval = setInterval(() => {
      this.countdown--;
      if (this.countdown <= 0) {
        clearInterval(this.countdownInterval!);
        this.countdownInterval = null;
        this.startLaunch();
      } else {
        this.emitSnapshot();
      }
    }, 1000);
  }

  private startLaunch() {
    this.status = 'launching';
    this.launchTimer = 5;
    this.launchTilt = 0;
    this.launchPosition = 0.5;
    this.launchPower = 0;
    this.launchReady = false;
    this.emitSnapshot();

    this.launchInterval = setInterval(() => {
      this.launchTimer = Math.max(0, this.launchTimer - 0.1);
      // Check if player launched or time ran out
      if (this.launchReady || this.launchTimer <= 0) {
        clearInterval(this.launchInterval!);
        this.launchInterval = null;
        this.applyLaunchParams();
        this.startPhysics();
      } else {
        this.emitSnapshot();
      }
    }, 100);
  }

  private applyLaunchParams() {
    const bey = this.beyblades.get('player');
    if (!bey) return;
    const power = this.launchReady ? Math.max(30, this.launchPower) : 50;
    bey.spin = bey.maxSpin * (power / 100);
    // Spawn position offset
    const angle = (this.launchPosition - 0.5) * Math.PI;
    const cx = (this.arena.width ?? DEFAULT_ARENA_W) / 2;
    const cy = (this.arena.height ?? DEFAULT_ARENA_H) / 2;
    bey.x = cx + Math.cos(angle) * this.arenaRadius * 0.3;
    bey.y = cy + Math.sin(angle) * this.arenaRadius * 0.3;
  }

  private startPhysics() {
    this.status = 'in-progress';
    this.elapsed = 0;
    this.lastTs = null;
    this.emitSnapshot();
    this.rafId = requestAnimationFrame(this.tick);
  }

  // ─── Physics tick ─────────────────────────────────────────────────────────
  private tick = (ts: number) => {
    if (this.lastTs === null) this.lastTs = ts;
    const dtMs = Math.min(ts - this.lastTs, 50); // cap at 50ms
    this.lastTs = ts;
    const dt = dtMs / 1000;
    this.elapsed += dt;

    const cx = (this.arena.width ?? DEFAULT_ARENA_W) / 2;
    const cy = (this.arena.height ?? DEFAULT_ARENA_H) / 2;
    const r = this.arenaRadius;

    // Process each beyblade
    for (const [id, bey] of this.beyblades) {
      if (!bey.isActive) continue;

      // AI input
      if (bey.isAI) {
        const controller = this.aiControllers.get(id);
        if (controller) {
          const snapshot: BeybladeSnapshot = {
            id, x: bey.x, y: bey.y,
            velocityX: bey.velocityX, velocityY: bey.velocityY,
            rotation: bey.rotation, spin: bey.spin, maxSpin: bey.maxSpin,
            isAirborne: bey.isAirborne, inPit: false,
            power: bey.power, spinDirection: bey.spinDirection, type: bey.type,
          };
          const others = Array.from(this.beyblades.values())
            .filter(b => b.id !== id && b.isActive)
            .map(b => ({
              id: b.id, x: b.x, y: b.y,
              velocityX: b.velocityX, velocityY: b.velocityY,
              rotation: b.rotation, spin: b.spin, maxSpin: b.maxSpin,
              isAirborne: b.isAirborne, inPit: false,
              power: b.power, spinDirection: b.spinDirection, type: b.type,
            }));
          const aiInput = controller.computeInput(snapshot, others, cx, cy, r);
          // Apply AI input
          if (aiInput.moveLeft)  bey.velocityX -= MOVE_ACCEL;
          if (aiInput.moveRight) bey.velocityX += MOVE_ACCEL;
          if (aiInput.moveUp)    bey.velocityY -= MOVE_ACCEL;
          if (aiInput.moveDown)  bey.velocityY += MOVE_ACCEL;
          if (aiInput.chargeHeld) bey.power = Math.min(150, bey.power + POWER_REGEN * 60);
          if (aiInput.specialTap && bey.power >= 100) {
            bey.power -= 100;
            bey.spin = Math.min(bey.maxSpin, bey.spin + bey.maxSpin * 0.08);
          }
        }
      }

      // Integrate velocity
      bey.velocityX *= FRICTION;
      bey.velocityY *= FRICTION;
      const speed = Math.sqrt(bey.velocityX ** 2 + bey.velocityY ** 2);
      const maxPx = (MAX_SPEED / 60);
      if (speed > maxPx) {
        const inv = maxPx / speed;
        bey.velocityX *= inv;
        bey.velocityY *= inv;
      }
      bey.x += bey.velocityX;
      bey.y += bey.velocityY;
      bey.rotation += bey.angularVelocity;
      if (bey.rotation > 360) bey.rotation -= 360;

      // Spin decay
      bey.spin = Math.max(
        this.config.roomType === 'tryout' ? bey.maxSpin * 0.05 : 0,
        bey.spin - SPIN_DECAY * dt,
      );

      // Arena boundary
      const dx = bey.x - cx, dy = bey.y - cy;
      const d = Math.sqrt(dx * dx + dy * dy);
      const beyR = bey.actualSize / 2;
      if (d + beyR > r) {
        const overlap = d + beyR - r;
        const nx = dx / d, ny = dy / d;
        bey.x -= nx * overlap;
        bey.y -= ny * overlap;
        bey.velocityX -= nx * Math.abs(bey.velocityX * nx + bey.velocityY * ny) * 1.3;
        bey.velocityY -= ny * Math.abs(bey.velocityX * nx + bey.velocityY * ny) * 1.3;
      }

      // Knock out when spin reaches zero (applies to all beys, including AI)
      if (bey.spin <= 0 && this.config.roomType !== 'tryout') {
        bey.isActive = false;
        bey.spin = 0;
      }
    }

    // Bey-to-bey collisions
    const beyArr = Array.from(this.beyblades.values()).filter(b => b.isActive);
    for (let i = 0; i < beyArr.length; i++) {
      for (let j = i + 1; j < beyArr.length; j++) {
        const a = beyArr[i], b = beyArr[j];
        const dx = b.x - a.x, dy = b.y - a.y;
        const d = Math.sqrt(dx * dx + dy * dy);
        const minD = (a.actualSize + b.actualSize) / 2;
        if (d < minD && d > 0) {
          const overlap = (minD - d) / 2;
          const nx = dx / d, ny = dy / d;
          a.x -= nx * overlap; a.y -= ny * overlap;
          b.x += nx * overlap; b.y += ny * overlap;
          const dvx = a.velocityX - b.velocityX, dvy = a.velocityY - b.velocityY;
          const impulse = (dvx * nx + dvy * ny) * 0.9;
          a.velocityX -= impulse * nx; a.velocityY -= impulse * ny;
          b.velocityX += impulse * nx; b.velocityY += impulse * ny;
          // Spin transfer
          const spinDiff = (a.spin - b.spin) * 0.03;
          a.spin -= spinDiff; b.spin += spinDiff;
          a.collisions++; b.collisions++;
        }
      }
    }

    // Check win condition (pvai / story-battle) — require at least 0.5s elapsed to prevent false start wins
    if (this.elapsed >= 0.5 && (this.config.roomType === 'pvai' || this.config.roomType === 'story-battle')) {
      const actives = Array.from(this.beyblades.values()).filter(b => b.isActive);
      if (actives.length <= 1) {
        this.status = 'finished';
        this.winner = actives.length === 1 ? actives[0].id : '';
        this.emitSnapshot();
        return;
      }
    }

    this.emitSnapshot();
    this.rafId = requestAnimationFrame(this.tick);
  };

  // ─── Emit state snapshot ──────────────────────────────────────────────────
  private emitSnapshot(error: string | null = null) {
    // Renderer expects server physics-space coords (arena_px * PHYSICS_SCALE).
    // LocalGameSimulation physics runs in plain arena-pixel space, so scale on output.
    const scaledBeyblades = new Map<string, ServerBeyblade>();
    for (const [id, bey] of this.beyblades) {
      scaledBeyblades.set(id, {
        ...bey,
        x: bey.x * PHYSICS_SCALE,
        y: bey.y * PHYSICS_SCALE,
        velocityX: (bey.velocityX ?? 0) * PHYSICS_SCALE,
        velocityY: (bey.velocityY ?? 0) * PHYSICS_SCALE,
      });
    }

    const gameState: ServerGameState = {
      status: this.status === 'in-progress' ? 'in-progress'
        : this.status === 'finished' ? 'finished'
        : this.status === 'countdown' ? 'warmup'
        : this.status === 'launching' ? 'launching'
        : 'waiting',
      mode: this.config.roomType === 'tryout' ? 'tryout' : 'ai-battle',
      timer: this.elapsed,
      startTime: 0,
      winner: this.winner,
      matchId: 'local',
      arena: this.arena as ReturnType<typeof defaultArena>,
      beyblades: scaledBeyblades,
      launchTimer: this.launchTimer,
    };

    this.onSnapshot({
      gameState,
      beyblades: scaledBeyblades,
      myBeyId: this.myBeyId,
      status: this.status,
      countdown: this.countdown,
      launchTimer: this.launchTimer,
      launchTilt: this.launchTilt,
      launchPosition: this.launchPosition,
      launchPower: this.launchPower,
      loadingError: error,
    });
  }
}
