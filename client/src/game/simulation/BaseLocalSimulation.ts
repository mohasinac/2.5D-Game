// BaseLocalSimulation — shared physics core for all local (non-Colyseus) game modes.
// Subclasses (TryoutSimulation, AIBattleSimulation, etc.) set mode-specific config defaults.

import { collection, doc, getDoc, getDocs } from 'firebase/firestore';
import { db, COLLECTIONS } from '../../lib/firebase';
import type { ServerArenaState, ServerBeyblade, ServerGameState } from '../../types/game';
import type { GameRoomConfig } from '../../types/gameRoom';
import type { FullGameInput } from '../hooks/useGameInput';
import { AIController, type BeybladeSnapshot, type AIDifficulty } from '../ai/AIController';
import { PHYSICS_SCALE } from '../../constants/units';

// ─── Physics constants ────────────────────────────────────────────────────────
const FRICTION     = 0.97;
const MOVE_ACCEL   = 5.0;
const MAX_SPEED    = 350;
const SPIN_DECAY   = 7;
const POWER_REGEN  = 0.04;

const DEFAULT_ARENA_W = 1080;
const DEFAULT_ARENA_H = 1080;

// ─── Default arena ────────────────────────────────────────────────────────────
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

// ─── Difficulty helpers ───────────────────────────────────────────────────────

export function tournamentRoundDifficulty(round: number, total: number): AIDifficulty {
  if (total <= 1) return 'hell';
  const progress = round / (total - 1);
  if (progress < 0.34) return 'medium';
  if (progress < 0.67) return 'hard';
  return 'hell';
}

export function royaleRandomDifficulty(base: AIDifficulty): AIDifficulty {
  const r = Math.random();
  if (base === 'medium') return r < 0.45 ? 'medium' : r < 0.80 ? 'hard' : 'hell';
  if (base === 'hard')   return r < 0.15 ? 'medium' : r < 0.65 ? 'hard' : 'hell';
  return r < 0.05 ? 'medium' : r < 0.30 ? 'hard' : 'hell';
}

export function difficultyPowerRange(d: AIDifficulty): [number, number] {
  if (d === 'hell') return [115, 150];
  if (d === 'hard') return [95, 130];
  return [80, 115];
}

// ─── Spawn helper ─────────────────────────────────────────────────────────────
export function makeBeySpaced(
  id: string, username: string, color: string, isAI: boolean,
  cx: number, cy: number, r: number, index: number, total: number,
): ServerBeyblade {
  const angle = (index / total) * Math.PI * 2;
  const spawnR = total > 4 ? r * 0.55 : r * 0.35;
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

export const PLAYER_COLORS = [
  '#ff4444', '#4488ff', '#44ff44', '#ffaa00', '#ff44ff', '#00ffff',
  '#ffff00', '#ff8888', '#aaff44', '#8844ff', '#ff4488', '#44ffaa',
];

// ─── Types ────────────────────────────────────────────────────────────────────

export type SimStatus = 'idle' | 'loading' | 'countdown' | 'launching' | 'in-progress' | 'finished';
export type SimPhase = 'countdown' | 'launching' | 'in-progress';

export interface TournamentBracketInfo {
  round: number;
  totalRounds: number;
  playerWins: number;
  eliminated: boolean;
  champion: boolean;
  opponentDifficulty: AIDifficulty;
}

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
  tournamentBracket?: TournamentBracketInfo;
}

type OnSnapshotFn = (snap: SimSnapshot) => void;

export type SimGameEvent =
  | { type: 'collision'; beyId: string; otherBeyId: string; relativeSpeed: number }
  | { type: 'burst';    beyId: string }
  | { type: 'ring-out'; beyId: string };

type OnGameEventFn = (event: SimGameEvent) => void;

// ─── BaseLocalSimulation ─────────────────────────────────────────────────────

export class BaseLocalSimulation {
  protected config: GameRoomConfig;
  protected onSnapshot: OnSnapshotFn;
  protected onGameEvent: OnGameEventFn | undefined;

  protected beyblades = new Map<string, ServerBeyblade>();
  protected aiControllers = new Map<string, AIController>();
  protected spawnImmunity = new Map<string, number>();
  protected arena: ServerArenaState = defaultArena();
  protected arenaRadius = DEFAULT_ARENA_W * 0.45;
  protected winner = '';

  protected myBeyId = 'player';
  protected status: SimStatus = 'idle';
  protected countdown = 3;
  protected launchTimer = 5;
  protected elapsed = 0;
  protected rafId: number | null = null;
  protected lastTs: number | null = null;
  protected paused = false;
  protected countdownInterval: ReturnType<typeof setInterval> | null = null;
  protected launchInterval: ReturnType<typeof setInterval> | null = null;
  protected roundTransitionTimeout: ReturnType<typeof setTimeout> | null = null;

  protected launchTilt = 0;
  protected launchPosition = 0.5;
  protected launchPower = 0;
  protected launchReady = false;

  // Tournament-AI bracket state
  protected tournamentRound = 0;
  protected tournamentTotalRounds = 0;
  protected tournamentPlayerWins = 0;
  protected tournamentEliminated = false;
  protected tournamentChampion = false;
  protected playerBeyStats: Partial<ServerBeyblade> = {};
  protected botDifficulties = new Map<string, AIDifficulty>();

  constructor(config: GameRoomConfig, onSnapshot: OnSnapshotFn, onGameEvent?: OnGameEventFn) {
    this.config = config;
    this.onSnapshot = onSnapshot;
    this.onGameEvent = onGameEvent;
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
    if (this.roundTransitionTimeout) { clearTimeout(this.roundTransitionTimeout); this.roundTransitionTimeout = null; }
    this.lastTs = null;
    this.paused = false;
  }

  pause() {
    if (this.paused || this.status !== 'in-progress') return;
    this.paused = true;
    if (this.rafId !== null) { cancelAnimationFrame(this.rafId); this.rafId = null; }
    this.lastTs = null;
  }

  resume() {
    if (!this.paused || this.status !== 'in-progress') return;
    this.paused = false;
    this.rafId = requestAnimationFrame(this.tick);
  }

  applyInput(input: FullGameInput) {
    const bey = this.beyblades.get(this.myBeyId);
    if (!bey) return;

    if (this.status === 'launching') {
      if (input.moveLeft)   this.launchTilt = Math.max(-45, this.launchTilt - 1.5);
      if (input.moveRight)  this.launchTilt = Math.min(45, this.launchTilt + 1.5);
      if (input.moveUp)     this.launchPosition = Math.max(0, this.launchPosition - 0.02);
      if (input.moveDown)   this.launchPosition = Math.min(1, this.launchPosition + 0.02);
      if (input.chargeHeld) this.launchPower = Math.min(150, this.launchPower + 1.5);
      if (input.specialTap && this.launchPower > 0) this.launchReady = true;
      return;
    }

    if (this.status !== 'in-progress') return;

    if (input.moveLeft)   bey.velocityX -= MOVE_ACCEL;
    if (input.moveRight)  bey.velocityX += MOVE_ACCEL;
    if (input.moveUp)     bey.velocityY -= MOVE_ACCEL;
    if (input.moveDown)   bey.velocityY += MOVE_ACCEL;
    if (input.attack && bey.spin > bey.maxSpin * 0.1) bey.isDefending = false;
    if (input.defense) bey.isDefending = true;
    if (input.chargeHeld) bey.power = Math.min(150, bey.power + POWER_REGEN * 60);
    if (input.specialTap && bey.power >= 100) {
      bey.power -= 100;
      bey.spin = Math.min(bey.maxSpin, bey.spin + bey.maxSpin * 0.08);
    }
  }

  // ─── Data loading ─────────────────────────────────────────────────────────

  protected async loadData() {
    const { beybladeId = 'default', arenaId = 'default', aiCount = 1, aiDifficulty = 'medium' } = this.config;
    const cx = DEFAULT_ARENA_W / 2, cy = DEFAULT_ARENA_H / 2;
    const roomType = this.config.roomType;

    const aiCountThisRound = roomType === 'tryout' ? 0
      : roomType === 'tournament-ai' ? 1
      : (roomType === 'pvai' || roomType === 'story-battle') ? 1
      : Math.max(2, Math.min(11, aiCount));
    const total = 1 + aiCountThisRound;

    if (roomType === 'tournament-ai' && this.tournamentTotalRounds === 0) {
      this.tournamentTotalRounds = Math.max(1, Math.min(7, aiCount));
    }

    let arenaData: Record<string, unknown> | null = null;
    let resolvedArenaId = arenaId;
    if (arenaId === 'random') {
      try {
        const snap = await getDocs(collection(db, COLLECTIONS.ARENAS));
        if (!snap.empty) {
          const docs = snap.docs;
          const picked = docs[Math.floor(Math.random() * docs.length)];
          resolvedArenaId = picked.id;
          arenaData = picked.data() as Record<string, unknown>;
        }
      } catch { /* fall through to defaults */ }
    } else if (arenaId !== 'default') {
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
        ...defaultArena(resolvedArenaId),
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

    const playerBey = makeBeySpaced('player', 'Player', PLAYER_COLORS[0], false, arCx, arCy, this.arenaRadius, 0, total);
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
    if (!playerBey.maxSpin || playerBey.maxSpin <= 0) playerBey.maxSpin = 2192;
    playerBey.spin = playerBey.maxSpin;
    this.myBeyId = 'player';
    this.beyblades.set('player', playerBey);
    this.playerBeyStats = {
      maxSpin: playerBey.maxSpin, maxStamina: playerBey.maxStamina,
      maxHealth: playerBey.maxHealth, radius: playerBey.radius,
      actualSize: playerBey.actualSize, type: playerBey.type,
      spinDirection: playerBey.spinDirection, color: playerBey.color,
    };

    if (roomType !== 'tryout') {
      for (let i = 0; i < aiCountThisRound; i++) {
        const roundIndex = roomType === 'tournament-ai' ? this.tournamentRound : i;
        const id = roomType === 'tournament-ai' ? `ai_round_${roundIndex}` : `ai_${i}`;
        const botDiff: AIDifficulty = roomType === 'tournament-ai'
          ? tournamentRoundDifficulty(this.tournamentRound, this.tournamentTotalRounds)
          : roomType === 'royale-ai'
            ? royaleRandomDifficulty(aiDifficulty)
            : aiDifficulty;
        this.botDifficulties.set(id, botDiff);
        const label = botDiff === 'hell' ? '🔥' : botDiff === 'hard' ? '⚡' : '●';
        const ai = makeBeySpaced(id, `CPU ${roundIndex + 1} ${label}`, PLAYER_COLORS[(roundIndex + 1) % PLAYER_COLORS.length], true, arCx, arCy, this.arenaRadius, i + 1, total);
        this.beyblades.set(id, ai);
        this.aiControllers.set(id, new AIController(botDiff));
      }
    }
  }

  // ─── Tournament round reset ───────────────────────────────────────────────

  protected resetForNextTournamentRound() {
    const { aiDifficulty = 'medium' } = this.config;
    const arCx = (this.arena.width ?? DEFAULT_ARENA_W) / 2;
    const arCy = (this.arena.height ?? DEFAULT_ARENA_H) / 2;
    const total = 2;

    for (const key of Array.from(this.beyblades.keys())) {
      if (key !== 'player') { this.beyblades.delete(key); this.aiControllers.delete(key); }
    }

    const player = this.beyblades.get('player');
    if (player) {
      const maxSpin = this.playerBeyStats.maxSpin ?? 2192;
      const maxStamina = this.playerBeyStats.maxStamina ?? 1600;
      Object.assign(player, {
        spin: maxSpin, maxSpin,
        health: maxStamina, maxHealth: maxStamina,
        stamina: maxStamina, maxStamina,
        power: 0, isActive: true, isDefending: false,
        velocityX: 0, velocityY: 0,
        x: arCx + Math.cos(0) * this.arenaRadius * 0.35,
        y: arCy + Math.sin(0) * this.arenaRadius * 0.35,
      });
    }

    const roundIndex = this.tournamentRound;
    const id = `ai_round_${roundIndex}`;
    const botDiff = tournamentRoundDifficulty(roundIndex, this.tournamentTotalRounds);
    this.botDifficulties.set(id, botDiff);
    const label = botDiff === 'hell' ? '🔥' : botDiff === 'hard' ? '⚡' : '●';
    const ai = makeBeySpaced(id, `CPU ${roundIndex + 1} ${label}`, PLAYER_COLORS[(roundIndex + 1) % PLAYER_COLORS.length], true, arCx, arCy, this.arenaRadius, 1, total);
    this.beyblades.set(id, ai);
    this.aiControllers.set(id, new AIController(botDiff));
    this.winner = '';
    this.elapsed = 0;
    this.spawnImmunity.clear();

    // suppress unused-var warning
    void aiDifficulty;
  }

  // ─── Lifecycle ────────────────────────────────────────────────────────────

  protected startCountdown() {
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

  protected startLaunch() {
    this.status = 'launching';
    this.launchTimer = 5;
    this.launchTilt = 0;
    this.launchPosition = 0.5;
    this.launchPower = 0;
    this.launchReady = false;
    this.emitSnapshot();

    this.launchInterval = setInterval(() => {
      this.launchTimer = Math.max(0, this.launchTimer - 0.1);
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

  protected applyLaunchParams() {
    const cx = (this.arena.width ?? DEFAULT_ARENA_W) / 2;
    const cy = (this.arena.height ?? DEFAULT_ARENA_H) / 2;
    const { aiDifficulty = 'medium' } = this.config;
    const isRoyale = this.config.roomType === 'royale-ai';
    const beyArr = Array.from(this.beyblades.values());
    const total = beyArr.length;
    const spawnR = total > 4 ? this.arenaRadius * 0.52 : this.arenaRadius * 0.40;

    this.spawnImmunity.clear();
    if (this.config.roomType !== 'tryout') {
      let aiIndex = 0;
      beyArr.forEach(bey => {
        if (bey.id === 'player') {
          this.spawnImmunity.set(bey.id, 5.2);
        } else {
          const extra = isRoyale ? aiIndex * 0.5 : 0;
          this.spawnImmunity.set(bey.id, 5.2 + extra);
          aiIndex++;
        }
      });
    }

    beyArr.forEach((bey, idx) => {
      const isPlayer = bey.id === 'player';
      let spawnAngle: number;
      let power: number;
      let tiltOffset: number;

      if (isPlayer) {
        spawnAngle = isRoyale
          ? (0 / total) * Math.PI * 2
          : (this.launchPosition - 0.5) * Math.PI;
        power = this.launchReady ? Math.max(30, this.launchPower) : 50;
        tiltOffset = (this.launchTilt / 45) * (Math.PI / 5);
      } else {
        if (isRoyale) {
          spawnAngle = (idx / total) * Math.PI * 2;
        } else {
          const playerAngle = (this.launchPosition - 0.5) * Math.PI;
          spawnAngle = playerAngle + Math.PI + (Math.random() - 0.5) * 0.6;
        }
        const botDiff = this.botDifficulties.get(bey.id) ?? aiDifficulty;
        const [minPow, maxPow] = difficultyPowerRange(botDiff);
        power = minPow + Math.random() * (maxPow - minPow);
        const tiltSpread = botDiff === 'hell' ? Math.PI / 6 : botDiff === 'hard' ? Math.PI / 4 : Math.PI / 3;
        tiltOffset = (Math.random() - 0.5) * tiltSpread;
      }

      bey.x = cx + Math.cos(spawnAngle) * spawnR;
      bey.y = cy + Math.sin(spawnAngle) * spawnR;

      const inwardDir = Math.atan2(cy - bey.y, cx - bey.x);
      const launchDir = inwardDir + tiltOffset;
      const launchSpeed = (power / 100) * 4.2;
      bey.velocityX = Math.cos(launchDir) * launchSpeed;
      bey.velocityY = Math.sin(launchDir) * launchSpeed;
      bey.spin = bey.maxSpin * (power / 100);
    });
  }

  protected startPhysics() {
    this.status = 'in-progress';
    this.elapsed = 0;
    this.lastTs = null;
    this.emitSnapshot();
    this.rafId = requestAnimationFrame(this.tick);
  }

  // ─── Physics tick ─────────────────────────────────────────────────────────

  protected tick = (ts: number) => {
    if (this.lastTs === null) this.lastTs = ts;
    const dtMs = Math.min(ts - this.lastTs, 50);
    this.lastTs = ts;
    const dt = dtMs / 1000;
    this.elapsed += dt;

    const cx = (this.arena.width ?? DEFAULT_ARENA_W) / 2;
    const cy = (this.arena.height ?? DEFAULT_ARENA_H) / 2;
    const r = this.arenaRadius;

    for (const [id, bey] of this.beyblades) {
      if (!bey.isActive) continue;
      bey.isInvulnerable = this.elapsed < (this.spawnImmunity.get(id) ?? 0);

      if (bey.isAI) {
        if (bey.isInvulnerable) {
          const rdx = bey.x - cx, rdy = bey.y - cy;
          const rdist = Math.sqrt(rdx * rdx + rdy * rdy) || 1;
          const tx = -rdy / rdist, ty = rdx / rdist;
          bey.velocityX = tx * 2.8 - (rdx / rdist) * 0.15;
          bey.velocityY = ty * 2.8 - (rdy / rdist) * 0.15;
        } else {
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
            if (aiInput.moveLeft)   bey.velocityX -= MOVE_ACCEL;
            if (aiInput.moveRight)  bey.velocityX += MOVE_ACCEL;
            if (aiInput.moveUp)     bey.velocityY -= MOVE_ACCEL;
            if (aiInput.moveDown)   bey.velocityY += MOVE_ACCEL;
            if (aiInput.chargeHeld) bey.power = Math.min(150, bey.power + POWER_REGEN * 60);
            if (aiInput.specialTap && bey.power >= 100) {
              bey.power -= 100;
              bey.spin = Math.min(bey.maxSpin, bey.spin + bey.maxSpin * 0.08);
            }
          }
        }
      }

      bey.velocityX *= FRICTION;
      bey.velocityY *= FRICTION;
      const speed = Math.sqrt(bey.velocityX ** 2 + bey.velocityY ** 2);
      const maxPx = MAX_SPEED / 60;
      if (speed > maxPx) {
        const inv = maxPx / speed;
        bey.velocityX *= inv;
        bey.velocityY *= inv;
      }
      bey.x += bey.velocityX;
      bey.y += bey.velocityY;
      bey.rotation += bey.angularVelocity;
      if (bey.rotation > 360) bey.rotation -= 360;

      const spinFloor = this.config.roomType === 'tryout' ? bey.maxSpin * 0.05 : 0;
      bey.spin = Math.max(spinFloor, bey.spin - SPIN_DECAY * dt);

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

      if (bey.spin <= 0 && this.config.roomType !== 'tryout') {
        bey.isActive = false;
        bey.spin = 0;
        this.onGameEvent?.({ type: 'burst', beyId: id });
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
          const aImmune = this.elapsed < (this.spawnImmunity.get(a.id) ?? 0);
          const bImmune = this.elapsed < (this.spawnImmunity.get(b.id) ?? 0);
          if (!aImmune && !bImmune) {
            const dvx = a.velocityX - b.velocityX, dvy = a.velocityY - b.velocityY;
            const impulse = (dvx * nx + dvy * ny) * 0.9;
            a.velocityX -= impulse * nx; a.velocityY -= impulse * ny;
            b.velocityX += impulse * nx; b.velocityY += impulse * ny;
            const spinDiff = (a.spin - b.spin) * 0.03;
            a.spin -= spinDiff; b.spin += spinDiff;
            const relSpeed = Math.hypot(dvx, dvy);
            this.onGameEvent?.({ type: 'collision', beyId: a.id, otherBeyId: b.id, relativeSpeed: relSpeed });
          }
          a.collisions++; b.collisions++;
        }
      }
    }

    // Win condition
    const rt = this.config.roomType;
    const hasWinCondition = rt === 'pvai' || rt === 'story-battle' || rt === 'royale-ai' || rt === 'tournament-ai';
    if (this.elapsed >= 0.5 && hasWinCondition) {
      const actives = Array.from(this.beyblades.values()).filter(b => b.isActive);
      if (actives.length <= 1) {
        const roundWinner = actives.length === 1 ? actives[0].id : '';

        if (rt === 'tournament-ai') {
          const playerWon = roundWinner === 'player';
          const moreRounds = this.tournamentRound + 1 < this.tournamentTotalRounds;
          if (playerWon && moreRounds) {
            this.tournamentPlayerWins++;
            this.winner = 'player';
            this.status = 'finished';
            this.emitSnapshot();
            if (this.rafId !== null) { cancelAnimationFrame(this.rafId); this.rafId = null; }
            this.roundTransitionTimeout = setTimeout(() => {
              this.roundTransitionTimeout = null;
              this.tournamentRound++;
              this.resetForNextTournamentRound();
              this.startCountdown();
            }, 2500);
          } else {
            if (playerWon) {
              this.tournamentPlayerWins++;
              this.tournamentChampion = true;
            } else {
              this.tournamentEliminated = true;
            }
            this.winner = roundWinner;
            this.status = 'finished';
            this.emitSnapshot();
          }
          return;
        }

        this.status = 'finished';
        this.winner = roundWinner;
        this.emitSnapshot();
        return;
      }
    }

    this.emitSnapshot();
    this.rafId = requestAnimationFrame(this.tick);
  };

  // ─── Snapshot emission ────────────────────────────────────────────────────

  protected emitSnapshot(error: string | null = null) {
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

    const currentOpponentId = `ai_round_${this.tournamentRound}`;
    const tournamentBracket: TournamentBracketInfo | undefined =
      this.config.roomType === 'tournament-ai' ? {
        round: this.tournamentRound + 1,
        totalRounds: this.tournamentTotalRounds,
        playerWins: this.tournamentPlayerWins,
        eliminated: this.tournamentEliminated,
        champion: this.tournamentChampion,
        opponentDifficulty: this.botDifficulties.get(currentOpponentId)
          ?? tournamentRoundDifficulty(this.tournamentRound, this.tournamentTotalRounds),
      } : undefined;

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
      tournamentBracket,
    });
  }
}
