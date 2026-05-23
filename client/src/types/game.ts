// [GAME-CLIENT] Shared game types for the Vite client.
// Mirrors lib/game/types/index.ts (root) and src/types/shared.ts (server).
// Keep in sync with ServerGameState and ServerBeyblade schemas.

export interface ServerArenaState {
  id: string;
  name: string;
  width: number;            // arena px (1cm = 24px)
  height: number;
  shape: "circle" | "rectangle";
  theme: string;
  rotation?: number;        // current arena angle (radians) — server-authoritative if set
  autoRotate?: boolean;
  rotationSpeed?: number;   // degrees per second
  rotationDirection?: "clockwise" | "counterclockwise" | string;
  wallEnabled?: boolean;
  wallAngle?: number;       // bowl profile, 0=flat .. 75=steep
}

// ─── Arena feature schemas (Phase 2) ──────────────────────────────────────
// Positions/radii are in cm (server uses "em units" === cm in this codebase).

export interface ServerObstacle {
  obstacleId: string;
  obstacleIndex: number;
  type: string;             // rock | pillar | barrier | wall | crystal | box | tire | ...
  x: number; y: number;     // cm, arena-local (origin at arena center)
  radius: number;
  destructible: boolean;
  isDestroyed: boolean;
  health: number;
  maxHealth: number;
  damage: number;
  recoil: number;
}

export interface ServerPit {
  pitId: string;
  pitIndex: number;
  x: number; y: number;
  radius: number;
  damagePerSecond: number;
  escapeChance: number;
  trappedBeybladeId: string;
}

export interface ServerTurret {
  turretId: string;
  turretIndex: number;
  attackType: "random" | "beam" | "periodic" | "aoe" | "boomerang" | string;
  x: number; y: number;
  currentAngle: number;     // degrees
  targetAngle: number;
  damage: number;
  range: number;
  cooldown: number;
  warmupTime: number;
  beamWidth: number;
  beamDuration: number;
  bulletSpeed: number;
  explosionRadius: number;
  returnSpeed: number;
  destructible: boolean;
  isDestroyed: boolean;
  health: number;
  maxHealth: number;
  isActive: boolean;
  isWarming: boolean;
  isFiring: boolean;
}

export interface ServerProjectile {
  id: string;
  type: "bullet" | "missile" | "boomerang" | "beam" | string;
  turretId: string;
  x: number; y: number;
  velocityX: number;
  velocityY: number;
  angle: number;
  damage: number;
  isActive: boolean;
  isReturning?: boolean;
  beamWidth?: number;
  beamEndX?: number;
  beamEndY?: number;
  explosionRadius?: number;
  hasExploded?: boolean;
}

export interface ServerWaterBody {
  waterBodyId: string;
  waterBodyIndex: number;
  type: "moat" | "zone" | "wall-based" | string;
  liquidType: "water" | "lava" | "ice" | "acid" | "oil" | "blood" | "healing" | "speedBoost" | "quicksand" | "poison" | string;
  spinDrainRate: number;
  speedMultiplier: number;
  causesSlip: boolean;
  damage: number;
  // Optional geometry (server may carry these for zone/moat rendering)
  x?: number; y?: number;
  radius?: number;
  width?: number; height?: number;
  innerRadius?: number; outerRadius?: number;
  shape?: "circle" | "square" | "rectangle" | "oval" | "annulus" | string;
  rotation?: number;
}

export interface ServerPortal {
  portalId: string;
  portalIndex: number;
  inPointX: number; inPointY: number;
  outPointX: number; outPointY: number;
  radius: number;
  cooldown: number;
  bidirectional: boolean;
  isOnCooldown: boolean;
  cooldownEndTime: number;
}

export interface ServerLoop {
  loopIndex: number;
  radius: number;
  shape: string;
  speedBoost: number;
  spinBoost: number;
  frictionMultiplier: number;
  // Optional geometry — server may carry these
  x?: number; y?: number;
}

export interface ServerBeyblade {
  id: string;
  userId: string;
  username: string;
  x: number;
  y: number;
  rotation: number;
  velocityX: number;
  velocityY: number;
  angularVelocity: number;
  health: number;
  maxHealth: number;
  stamina: number;
  maxStamina: number;
  spin: number;
  maxSpin: number;
  isActive: boolean;
  isAI: boolean;
  type: "attack" | "defense" | "stamina" | "balanced";
  radius: number;
  actualSize: number;
  isInvulnerable: boolean;
  damageDealt: number;
  damageReceived: number;
  collisions: number;
  spinDirection: "left" | "right";
  imageUrl?: string;
  // Phase C action state flags (synced from Colyseus schema)
  power: number;
  isAirborne: boolean;
  airborneTimer: number;
  isDefending: boolean;
  attackBuffTimer: number;
  dodgeBuffTimer: number;
  stunTimer: number;
  comboExecuting: boolean;
  // 2.5D Part System fields (optional — only present when PartSystemManager is active)
  isSplit?: boolean;
  splitBodyX?: number;
  splitBodyY?: number;
  splitBodySpin?: number;
  counterRotActive?: boolean;
  jumpFacingAngle?: number;
  // Loss of control (Phase 5 — Part 7c). When `controlLockedUntilMs > Date.now()`,
  // movement/action inputs are ignored server-side.
  controlLockedUntilMs?: number;
  controlLockSource?: "special" | "combo" | "" | string;
  // Optional special move id (empty string = none).
  specialMove?: string;
  // Optional combos attached to this beyblade (max 3 ids matching COMBO_REGISTRY).
  comboIds?: string[];
  // Per-combo cooldown end timestamps (epoch ms), keyed by combo id.
  comboCooldowns?: Map<string, number> | Record<string, number>;
  // Active configuration name per part slot ("ar", "tip", "core", "sub_part_0", ...).
  // Driven by both auto-triggers (existing) and the player-initiated mode:switch
  // message (new). Renders in PartModesHUD.
  activePartConfigs?: Map<string, string> | Record<string, string>;
  // Last epoch-ms a player-initiated config switch fired on a given part slot.
  // Used to throttle re-clicks in PartModesHUD (mirror of MODE_SWITCH_COOLDOWN_MS).
  configLastSwitchAt?: Map<string, number> | Record<string, number>;
}

export interface ServerDetachedBody {
  id: string;
  bodyType: "projectile" | "mini_bey" | "fragment";
  state: "projectile" | "obstacle" | "removed";
  ownerSessionId: string;
  x: number;
  y: number;
  velocityX: number;
  velocityY: number;
  angle: number;
  radius: number;
  mass: number;
  spin: number;
  maxSpin: number;
}

export interface ServerGameState {
  status: "waiting" | "warmup" | "in-progress" | "finished" | "series-finished" | "tournament";
  mode: "tryout" | "ai-battle" | "single-battle-pvp" | "single-battle-pvp-ranked" | "tournament";
  timer: number;
  startTime: number;
  winner: string;
  matchId: string;
  arena: ServerArenaState | null;
  beyblades: Map<string, ServerBeyblade>;
  // 2.5D detached bodies (projectile / mini_bey / fragment) — absent in standard 2D matches
  detachedBodies?: Map<string, ServerDetachedBody>;
  // Arena features (Phase 2 — Part 3)
  obstacles?: Map<string, ServerObstacle>;
  pits?: Map<string, ServerPit>;
  turrets?: Map<string, ServerTurret>;
  projectiles?: Map<string, ServerProjectile>;
  waterBodies?: Map<string, ServerWaterBody>;
  portals?: Map<string, ServerPortal>;
  loops?: Map<string, ServerLoop>;
  // Tournament metadata (optional — absent in non-tournament modes)
  tournamentId?: string;
  tournamentName?: string;
  roundNumber?: number;
  tournamentMatchId?: string;
  // Spectator tracking
  spectatorCount?: number;
  // Series format (BO1 / BO3 / BO5)
  currentGame?: number;
  targetWins?: number;
  seriesWins?: Map<string, number>;
  seriesLeader?: string;
  // Round modifiers (Phase X)
  activeModifierIds?: string[];
  // Arena shrink (Phase V)
  effectiveRadius?: number;
  // BX scoring (Xtreme/Over/Pocket points mode)
  scoringMode?: string;
  pointsTarget?: number;
  playerPoints?: Map<string, number>;
}

// ─── Tournament types ─────────────────────────────────────────────────────────

export interface TournamentDoc {
  id: string;
  name: string;
  description?: string;
  type: "pvp" | "player-gauntlet" | "mixed" | "ai-exhibition";
  status: "draft" | "registration" | "in-progress" | "completed" | "cancelled";
  maxParticipants: 2 | 4 | 8;
  scheduledStartTime: any; // Firestore Timestamp (client uses toDate())
  registrationDeadline: any;
  roundIntervalMinutes: number;
  bestOf: 1 | 3 | 5;
  aiDifficulty: "medium" | "hard" | "hell";
  autoFillWithAI: boolean;
  allowedBeybladeIds: string[];
  disabledBeybladeIds: string[];
  allowedArenaIds: string[];
  /** Below this at registrationDeadline → tournament auto-cancels. Defaults to 2. */
  minParticipants?: number;
  createdBy: string;
  createdAt: any;
  updatedAt: any;
  winnerId: string | null;
  winnerUsername: string | null;
  /** Cancellation reason, set by scheduler when auto-cancelling. */
  cancelReason?: string;
}

export interface TournamentParticipantDoc {
  id: string;
  tournamentId: string;
  userId: string;
  username: string;
  beybladeId: string;
  isAI: boolean;
  seed: number;
  registeredAt: any;
  status: "registered" | "eliminated" | "winner" | "quit";
  /** Tournament-level ready (distinct from per-match readyState). Drives auto-start. */
  ready?: boolean;
}

export interface TournamentMatchDoc {
  id: string;
  tournamentId: string;
  round: number;
  matchNumber: number;
  scheduledTime: any;
  status: "pending" | "room-opening" | "in-progress" | "completed" | "bye";
  participant1Id: string;
  participant2Id: string;
  participant1BeybladeId: string;
  participant2BeybladeId: string;
  winnerId: string | null;
  colyseusRoomId: string;
  arenaId: string;
  matchFirestoreId: string;
  createdAt: any;
  updatedAt: any;
  /** Both-ready early-start flags, keyed by userId or participantId. */
  readyState?: Record<string, boolean>;
  /** Set when the room-cap path produced a draw. */
  isDraw?: boolean;
}

export type ConnectionState = "disconnected" | "connecting" | "connected" | "reconnecting" | "error";

export interface CollisionEvent {
  p1: string;
  p2: string;
  damage1: number;
  damage2: number;
  spinSteal1: number;
  spinSteal2: number;
  contactPoint: { x: number; y: number };
}

/** Convert a Colyseus MapSchema (or plain Record) into a plain Record. */
export function mapToRecord<T>(m: Map<string, T> | Record<string, T> | undefined): Record<string, T> {
  if (!m) return {};
  if (m instanceof Map || typeof (m as any).forEach === "function" && typeof (m as any).entries === "function" && !Array.isArray(m)) {
    const out: Record<string, T> = {};
    (m as Map<string, T>).forEach((v, k) => { out[k] = v; });
    return out;
  }
  return m as Record<string, T>;
}

export function getBeybladeStability(beyblade: ServerBeyblade): number {
  if (beyblade.maxSpin <= 0) return 0;
  return Math.min(1, beyblade.spin / beyblade.maxSpin);
}

export const TYPE_COLORS: Record<string, number> = {
  attack: 0xff4444,
  defense: 0x4488ff,
  stamina: 0x44ff88,
  balanced: 0xffcc44,
};
