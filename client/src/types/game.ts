// [GAME-CLIENT] Shared game types for the Vite client.
// Mirrors lib/game/types/index.ts (root) and src/types/shared.ts (server).
// Keep in sync with ServerGameState and ServerBeyblade schemas.

export interface ServerArenaState {
  id: string;
  name: string;
  width: number;
  height: number;
  shape: "circle" | "rectangle";
  theme: string;
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
}

export interface ServerGameState {
  status: "waiting" | "countdown" | "playing" | "finished";
  mode: "tryout" | "pvp" | "ai";
  timer: number;
  startTime: number;
  winner: string;
  matchId: string;
  arena: ServerArenaState | null;
  beyblades: Map<string, ServerBeyblade>;
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
