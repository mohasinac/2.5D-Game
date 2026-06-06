import type { FlagKey, MapId, QuestId, QuestStatus } from '../../types/rpgTypes.ts';

interface GameStateData {
  flags:       Record<FlagKey, boolean>;
  mapId:       MapId;
  playerTileX: number;
  playerTileY: number;
  playtimeMs:  number;
  quests:      Record<QuestId, QuestStatus>;
}

class GameStateStore {
  private flags       = new Map<FlagKey, boolean>();
  private mapId: MapId = 'city_park';
  private playerTileX = 5;
  private playerTileY = 5;
  private playtimeMs  = 0;
  private quests      = new Map<QuestId, QuestStatus>();

  // ── Flags ──────────────────────────────────────────────────────
  getFlag(key: FlagKey): boolean { return this.flags.get(key) ?? false; }
  setFlag(key: FlagKey, value: boolean): void { this.flags.set(key, value); }
  getAllFlags(): ReadonlyMap<FlagKey, boolean> { return this.flags; }

  // ── Map & Player position ──────────────────────────────────────
  getCurrentMap(): MapId { return this.mapId; }
  setCurrentMap(id: MapId): void { this.mapId = id; }
  getPlayerPos(): { tileX: number; tileY: number } {
    return { tileX: this.playerTileX, tileY: this.playerTileY };
  }
  setPlayerPos(tileX: number, tileY: number): void {
    this.playerTileX = tileX; this.playerTileY = tileY;
  }

  // ── Playtime ───────────────────────────────────────────────────
  addPlaytime(ms: number): void { this.playtimeMs += ms; }
  getPlaytime(): number { return this.playtimeMs; }

  // ── Quests ─────────────────────────────────────────────────────
  getQuestStatus(id: QuestId): QuestStatus { return this.quests.get(id) ?? 'inactive'; }
  setQuestStatus(id: QuestId, s: QuestStatus): void { this.quests.set(id, s); }
  getAllQuests(): ReadonlyMap<QuestId, QuestStatus> { return this.quests; }

  // ── Serialization ──────────────────────────────────────────────
  toData(): GameStateData {
    const flags: Record<string, boolean> = {};
    this.flags.forEach((v, k) => { flags[k] = v; });
    const quests: Record<string, QuestStatus> = {};
    this.quests.forEach((v, k) => { quests[k] = v; });
    return {
      flags, mapId: this.mapId,
      playerTileX: this.playerTileX, playerTileY: this.playerTileY,
      playtimeMs: this.playtimeMs, quests,
    };
  }

  fromData(d: GameStateData): void {
    this.flags.clear();
    Object.entries(d.flags ?? {}).forEach(([k, v]) => this.flags.set(k, v));
    this.quests.clear();
    Object.entries(d.quests ?? {}).forEach(([k, v]) => this.quests.set(k, v as QuestStatus));
    this.mapId = d.mapId ?? 'city_park';
    this.playerTileX = d.playerTileX ?? 5;
    this.playerTileY = d.playerTileY ?? 5;
    this.playtimeMs = d.playtimeMs ?? 0;
  }

  reset(): void {
    this.flags.clear(); this.quests.clear();
    this.mapId = 'city_park'; this.playerTileX = 5; this.playerTileY = 5;
    this.playtimeMs = 0;
  }
}

export const gameStateStore = new GameStateStore();
