// [GAME-CLIENT] Shared game types for the Vite client.
// Mirrors lib/game/types/index.ts (root) and src/types/shared.ts (server).
// Keep in sync with ServerGameState and ServerBeyblade schemas.

// Phase 28 renderer mode
export type RendererMode = "2d" | "2.5d" | "3d";

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
  /** Phase 28: renderer mode driven by arena config and synced at 60Hz */
  rendererMode?: RendererMode | string;
  /** Phase 25: safe zone fields (Battle Royale only) */
  safeZoneRadius?: number;
  safeZoneX?: number;
  safeZoneY?: number;
  safeZoneTimer?: number;
  safeZonePhase?: number;
  /** Classic Stadium zone radii in arena-px (0 = not set, draw generic) */
  arenaPixelRadius?: number;
  pinkWallRadius?:   number;
  ridgeRadius?:      number;
  flatZoneRadius?:   number;
  /** World background — rendered behind the arena, synced once on join */
  worldBgType?: "none" | "color" | "image";
  worldBgColor?: string;
  worldBgImageUrl?: string;
  worldBgOpacity?: number;
  worldBgFit?: "cover" | "contain" | "stretch";
  worldBgBlurPx?: number;
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
  radius?: number;
  length?: number;
  width?: number;
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
  // Material wear level (0–100). Synced from server; used for visual tinting.
  materialWearLevel?: number;
  // Evolution driver stage index (0 = default; 1+ = evolved). Colyseus-synced at 60 Hz.
  tipEvolutionStage?: number;
  // Match-elapsed ms since first tick (monotonic, never resets). Used to compute wear level client-side.
  tipEvolutionTimer?: number;
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
  // Per-beyblade rendering color (hex, e.g. "#00d4ff"). Synced from BeybladeStats.
  color?: string;
  // Firestore beyblade_stats document ID — stable across matches.
  beybladeId?: string;
  // Launch phase fields (synced from server during status="launching")
  launchTilt?: number;
  launchPosition?: number;
  launchPower?: number;
  launchChargingStarted?: boolean;
  launchReady?: boolean;
  launchFailed?: boolean;
  // Phase 24 semi-autonomous control
  controlAuthority?: number;   // 0–100 uint8
  clashQTEActive?: boolean;
  clashQTETimer?: number;
  // Phase 29: Collision QTE Power Meter
  collisionQTEActive?: boolean;
  collisionQTEPower?: number;   // 0–150
  // Phase 29: Airborne Z-axis
  beyHeight?: number;           // px above arena floor
  beyVerticalVel?: number;      // upward velocity px/ms
  beyAirborne?: boolean;        // true while beyHeight > 0
  // Phase 29: Multi-phase special move tracking
  specialPhaseIndex?: number;
  specialPhaseElapsed?: number;
  specialPhaseSubState?: "windup" | "active" | "winddown" | string;
  // Phase 29: special move is actively executing phases (not just animation lock)
  specialMoveActive?: boolean;
  specialMoveEndTime?: number;
}

// ─── Phase 29: Collision QTE message payloads ──────────────────────────────

export interface CollisionQTEStartData {
  player1Id: string;
  player2Id: string;
  windowMs: number;
}

export interface CollisionQTESpecialPromptData {
  qteMultiplier: number;
  currentSP: number;
}

export interface CollisionQTEResultData {
  player1Id: string;
  player2Id: string;
  player1Multiplier: number;
  player2Multiplier: number;
}

export interface SplitScreenCinematicData {
  participants: {
    beyId: string;
    specialMove: string;
    displayName: string;
  }[];
}

export interface AerialClashData {
  bey1Id: string;
  bey2Id: string;
  contactPoint3D: { x: number; y: number; z: number };
}

export interface SpecialInteractionResultData {
  key: string;
  attAtPeak: boolean;
  defAtPeak: boolean;
  attackerScale: number;
  defenderScale: number;
}

export interface FloorGrindData {
  beyId: string;
  contactPoint: { x: number; y: number };
  force: number;
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

// Phase 27 Tiered AoI — lightweight ghost state for beyblades in outer zone (60–100cm).
export interface ServerBeyGhost {
  id: string;
  x_cm: number;
  y_cm: number;
  floorIndex: number;
  teamId: string;
  /** 2=full (≤60cm), 1=shadow (60–100cm), 0=dot only (>100cm) */
  tier: 0 | 1 | 2;
  vx_cm: number;
  vy_cm: number;
  tiltAngle: number;
  spin_pct: number;  // 0–100
  beyType: string;
  username: string;
}

export interface ServerGameState {
  status: "waiting" | "warmup" | "launching" | "in-progress" | "finished" | "series-finished" | "tournament";
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
  // Host session ID — set by server on first player join
  hostId?: string;
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
  // Launch phase countdown (seconds remaining during status="launching")
  launchTimer?: number;
  // Phase 27 Tiered AoI — ghost state for outer-zone beyblades (60–100cm)
  beyGhosts?: Map<string, ServerBeyGhost>;
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
