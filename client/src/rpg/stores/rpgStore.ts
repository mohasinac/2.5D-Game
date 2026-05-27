import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type {
  TileCoord, FacingDirection, TimeSlot, RouteId, ArcId,
  FlagCondition, GateCondition, QuestStatus, QuestRuntimeState,
  BattleParams, BattleResult, RivalStatus, PlayerLevelState,
  SaveSlotMeta, ActiveMiniGame, MiniGameResult,
} from "../data/schemas";
import { evaluateFlagCondition, evaluateGateCondition } from "../utils/flagUtils";
import { MAX_PLAYER_LEVEL, MAX_BEYBLADE_LEVEL } from "../constants/rpgConstants";

// ── Notification helper ───────────────────────────────────────────────────────
export interface RPGNotification {
  id: string;
  type: "quest-start" | "quest-complete" | "quest-update" | "badge-earned" | "level-up" | "bey-level-up" | "item-received";
  title: string;
  subtitle?: string;
  iconAssetId?: string;
  timestamp: number;
}

// ── World Slice ───────────────────────────────────────────────────────────────
interface WorldSlice {
  currentMapId: string | null;
  currentRegionId: string | null;
  routeId: RouteId | null;
  arcId: ArcId | null;
  playerTile: TileCoord;
  playerFacing: FacingDirection;
  timeSlot: TimeSlot;
  gameHour: number;
  elapsedPlaytimeMs: number;
  setCurrentMap: (mapId: string) => void;
  setCurrentRegion: (regionId: string) => void;
  setRouteId: (r: RouteId) => void;
  setArcId: (a: ArcId) => void;
  setPlayerTile: (t: TileCoord) => void;
  setPlayerFacing: (f: FacingDirection) => void;
  setTimeSlot: (s: TimeSlot) => void;
  setGameHour: (h: number) => void;
  addPlaytime: (ms: number) => void;
}

// ── Flag Slice ────────────────────────────────────────────────────────────────
interface FlagSlice {
  flags: Record<string, boolean>;
  setFlag: (key: string, value: boolean) => void;
  setFlags: (flags: Record<string, boolean>) => void;
  getFlag: (key: string) => boolean;
  evaluateCondition: (cond: FlagCondition) => boolean;
}

// ── Quest Slice ───────────────────────────────────────────────────────────────
interface QuestSlice {
  questStates: Record<string, QuestRuntimeState>;
  activeQuestIds: string[];
  startQuest: (questId: string) => void;
  advanceObjective: (questId: string, objectiveId: string, amount?: number) => void;
  completeQuest: (questId: string) => void;
  failQuest: (questId: string) => void;
  getQuestStatus: (questId: string) => QuestStatus;
}

// ── Dialogue Slice ────────────────────────────────────────────────────────────
interface DialogueSlice {
  activeDialogue: { treeId: string; currentNodeId: string } | null;
  dialogueHistory: string[];
  openDialogue: (treeId: string, startNodeId: string) => void;
  setDialogueNode: (nodeId: string) => void;
  closeDialogue: () => void;
  isDialogueOpen: () => boolean;
  addDialogueHistory: (nodeId: string) => void;
}

// ── Inventory Slice ───────────────────────────────────────────────────────────
interface InventorySlice {
  items: Array<{ itemId: string; quantity: number }>;
  beyblades: string[];
  equippedBeybladeId: string | null;
  /** Currently equipped launcher item id (ripcord / performance launcher). */
  equippedLauncherId: string | null;
  /** Per-item current durability; only tracked for items with maxDurability. */
  itemDurability: Record<string, number>;
  /** Installed launcher upgrade item ids (stack their launchBoost values). */
  installedUpgradeIds: string[];
  money: number;
  addItem: (itemId: string, quantity: number) => void;
  removeItem: (itemId: string, quantity: number) => boolean;
  addBeyblade: (beybladeId: string) => void;
  equipBeyblade: (beybladeId: string) => void;
  /** Pass `itemDef` to enforce left-launcher purchase rule. */
  equipLauncher: (itemId: string, maxDurability: number, itemDef?: unknown) => void;
  unequipLauncher: () => void;
  installUpgrade: (itemId: string) => void;
  uninstallUpgrade: (itemId: string) => void;
  /**
   * Wear the item by `amount` durability points.
   * Returns true if the item is now broken (durability reached 0).
   */
  wearItem: (itemId: string, amount: number) => boolean;
  hasItem: (itemId: string) => boolean;
  addMoney: (amount: number) => void;
  /** Sum of launchBoost from equipped launcher + all installed upgrades. */
  getLaunchBoostTotal: (itemDefs: Record<string, { launchBoost?: number }>) => number;
  /**
   * Consume one unit of a single-use item.
   * Removes 1 from inventory. Returns false if not owned.
   * Does NOT apply the useEffect — the caller (EventSystem / UI) handles that.
   */
  useConsumable: (itemId: string) => boolean;
}

// ── Progression Slice ─────────────────────────────────────────────────────────
interface ProgressionSlice {
  reputation: number;
  friendship: Record<string, number>;
  rivalStatus: Record<string, RivalStatus>;
  battleRecords: Array<{ npcId: string; result: "win" | "loss" | "draw"; timestamp: number }>;
  defeatedNPCs: Record<string, boolean>;
  /** Total battles fought this session — used to tick down rematch cooldowns. */
  totalBattleCount: number;
  /**
   * Per-NPC rematch cooldown counter.
   * Value = number of OTHER battles the player must finish before a rematch.
   * Decremented by 1 after every battle. When it reaches 0, rematch is open.
   */
  npcRematchCooldowns: Record<string, number>;
  /** Arc 2+ team score (resets at the start of each team tournament round). */
  teamPoints: number;
  adjustReputation: (delta: number) => void;
  adjustFriendship: (characterId: string, delta: number) => void;
  setRivalStatus: (characterId: string, status: RivalStatus) => void;
  recordBattle: (npcId: string, result: "win" | "loss" | "draw") => void;
  markNPCDefeated: (npcId: string) => void;
  /** Set a count-based rematch cooldown for an NPC after the player beats them. */
  setNPCRematchCooldown: (npcId: string, battles: number) => void;
  /** Call after every battle to tick all active cooldowns down by 1. */
  tickRematchCooldowns: () => void;
  /** Returns true if a rematch against this NPC is currently available. */
  canRematch: (npcId: string) => boolean;
  addTeamPoints: (amount: number) => void;
  resetTeamPoints: () => void;
}

// ── Leveling Slice ────────────────────────────────────────────────────────────
interface LevelingSlice {
  level: number;
  xp: number;
  beybladeXP: Record<string, number>;
  beybladeLevels: Record<string, number>;
  xpCurve: number[];
  /**
   * Active arc level cap. Level-up notifications and gate checks respect this
   * ceiling; raw XP still accumulates so the player doesn't lose progress when
   * the cap is lifted at the start of the next arc.
   * null = no cap (use MAX_PLAYER_LEVEL).
   */
  arcLevelCap: number | null;
  addPlayerXP: (amount: number) => void;
  addBeybladeXP: (beybladeId: string, amount: number) => void;
  setXPCurve: (curve: number[]) => void;
  setArcLevelCap: (cap: number | null) => void;
  /** Effective level — min(computed level, arcLevelCap ?? MAX_PLAYER_LEVEL). */
  effectiveLevel: () => number;
}

// ── Badge Slice ───────────────────────────────────────────────────────────────
interface BadgeSlice {
  earnedBadges: string[];
  awardBadge: (badgeId: string) => void;
  hasBadge: (badgeId: string) => boolean;
  hasBadges: (badgeIds: string[]) => boolean;
  evaluateGate: (gate: GateCondition) => { passed: boolean; reason?: string };
}

// ── Scene Slice ───────────────────────────────────────────────────────────────
interface SceneSlice {
  activeStoryEventId: string | null;
  activeCutsceneId: string | null;
  isTransitioning: boolean;
  playerLocked: boolean;
  pendingBattleResult: BattleResult | null;
  pendingBattleParams: BattleParams | null;
  notifications: RPGNotification[];
  setStoryEvent: (id: string | null) => void;
  setCutscene: (id: string | null) => void;
  setTransitioning: (v: boolean) => void;
  setPlayerLocked: (v: boolean) => void;
  setPendingBattleResult: (result: BattleResult | null) => void;
  setPendingBattleParams: (params: BattleParams | null) => void;
  pushNotification: (n: Omit<RPGNotification, "id" | "timestamp">) => void;
  dismissNotification: (id: string) => void;
}

// ── Mini-Game Slice ───────────────────────────────────────────────────────────
interface MiniGameSlice {
  activeMiniGame: ActiveMiniGame | null;
  miniGameResult: MiniGameResult | null;
  launchMiniGame: (game: ActiveMiniGame) => void;
  completeMiniGame: (result: MiniGameResult) => void;
  clearMiniGame: () => void;
}

// ── Save Slice ────────────────────────────────────────────────────────────────
interface SaveSlice {
  currentSaveSlot: 0 | 1 | 2 | null;
  saveSlotMetas: SaveSlotMeta[];
  isSaving: boolean;
  isLoading: boolean;
  lastSaveTime: number | null;
  setCurrentSaveSlot: (slot: 0 | 1 | 2) => void;
  setSaving: (v: boolean) => void;
  setLoading: (v: boolean) => void;
  setLastSaveTime: (t: number) => void;
  setSaveSlotMetas: (metas: SaveSlotMeta[]) => void;
}

// ── Full Store ────────────────────────────────────────────────────────────────
export interface RPGStore
  extends WorldSlice, FlagSlice, QuestSlice, DialogueSlice,
    InventorySlice, ProgressionSlice, LevelingSlice, BadgeSlice,
    SceneSlice, MiniGameSlice, SaveSlice {
  applyQuestReward: (reward: import("../data/schemas").QuestReward) => void;
  applyBattleResult: (result: BattleResult) => void;
  resetRPGState: () => void;
  /** Convenience — checks rematch gate + cooldown for a given NPC. */
  isRematchAllowed: (npcId: string, canRematchConfig: boolean) => boolean;
}

const defaultPlayerTile: TileCoord = { x: 5, y: 5 };

function computeLevel(xp: number, curve: number[]): number {
  let level = 1;
  for (let i = 0; i < curve.length; i++) {
    if (xp >= curve[i]) level = i + 2;
    else break;
  }
  return Math.min(level, MAX_PLAYER_LEVEL);
}

function computeBeyLevel(xp: number, curve: number[]): number {
  let level = 1;
  for (let i = 0; i < curve.length; i++) {
    if (xp >= curve[i]) level = i + 2;
    else break;
  }
  return Math.min(level, MAX_BEYBLADE_LEVEL);
}

export const useRPGStore = create<RPGStore>()(
  persist(
    (set, get) => ({
      // ── World ──────────────────────────────────────────────────────────────
      currentMapId: null,
      currentRegionId: null,
      routeId: null,
      arcId: null,
      playerTile: defaultPlayerTile,
      playerFacing: "down",
      timeSlot: "morning",
      gameHour: 9,
      elapsedPlaytimeMs: 0,
      setCurrentMap: (mapId) => set({ currentMapId: mapId }),
      setCurrentRegion: (regionId) => set({ currentRegionId: regionId }),
      setRouteId: (r) => set({ routeId: r }),
      setArcId: (a) => set({ arcId: a }),
      setPlayerTile: (t) => set({ playerTile: t }),
      setPlayerFacing: (f) => set({ playerFacing: f }),
      setTimeSlot: (s) => set({ timeSlot: s }),
      setGameHour: (h) => set({ gameHour: h }),
      addPlaytime: (ms) => set((s) => ({ elapsedPlaytimeMs: s.elapsedPlaytimeMs + ms })),

      // ── Flags ──────────────────────────────────────────────────────────────
      flags: {},
      setFlag: (key, value) => set((s) => ({ flags: { ...s.flags, [key]: value } })),
      setFlags: (flags) => set((s) => ({ flags: { ...s.flags, ...flags } })),
      getFlag: (key) => !!get().flags[key],
      evaluateCondition: (cond) => evaluateFlagCondition(cond, get().flags),

      // ── Quests ─────────────────────────────────────────────────────────────
      questStates: {},
      activeQuestIds: [],
      startQuest: (questId) =>
        set((s) => {
          if (s.questStates[questId]?.status === "active") return {};
          return {
            questStates: {
              ...s.questStates,
              [questId]: { status: "active", objectiveProgress: {} },
            },
            activeQuestIds: [...s.activeQuestIds.filter((id) => id !== questId), questId],
          };
        }),
      advanceObjective: (questId, objectiveId, amount = 1) =>
        set((s) => {
          const qs = s.questStates[questId];
          if (!qs) return {};
          const prev = qs.objectiveProgress[objectiveId] ?? 0;
          return {
            questStates: {
              ...s.questStates,
              [questId]: {
                ...qs,
                objectiveProgress: { ...qs.objectiveProgress, [objectiveId]: prev + amount },
              },
            },
          };
        }),
      completeQuest: (questId) =>
        set((s) => ({
          questStates: {
            ...s.questStates,
            [questId]: {
              ...(s.questStates[questId] ?? { objectiveProgress: {} }),
              status: "completed",
              completedAt: Date.now(),
            },
          },
          activeQuestIds: s.activeQuestIds.filter((id) => id !== questId),
        })),
      failQuest: (questId) =>
        set((s) => ({
          questStates: {
            ...s.questStates,
            [questId]: {
              ...(s.questStates[questId] ?? { objectiveProgress: {} }),
              status: "failed",
            },
          },
          activeQuestIds: s.activeQuestIds.filter((id) => id !== questId),
        })),
      getQuestStatus: (questId) => get().questStates[questId]?.status ?? "locked",

      // ── Dialogue ───────────────────────────────────────────────────────────
      activeDialogue: null,
      dialogueHistory: [],
      openDialogue: (treeId, startNodeId) =>
        set({ activeDialogue: { treeId, currentNodeId: startNodeId } }),
      setDialogueNode: (nodeId) =>
        set((s) => ({
          activeDialogue: s.activeDialogue ? { ...s.activeDialogue, currentNodeId: nodeId } : null,
        })),
      closeDialogue: () => set({ activeDialogue: null }),
      isDialogueOpen: () => get().activeDialogue !== null,
      addDialogueHistory: (nodeId) =>
        set((s) => ({ dialogueHistory: [...s.dialogueHistory, nodeId] })),

      // ── Inventory ──────────────────────────────────────────────────────────
      items: [],
      beyblades: [],
      equippedBeybladeId: null,
      equippedLauncherId: null,
      itemDurability: {},
      installedUpgradeIds: [],
      money: 0,
      addItem: (itemId, quantity) =>
        set((s) => {
          const existing = s.items.find((i) => i.itemId === itemId);
          if (existing) {
            return {
              items: s.items.map((i) =>
                i.itemId === itemId ? { ...i, quantity: i.quantity + quantity } : i
              ),
            };
          }
          return { items: [...s.items, { itemId, quantity }] };
        }),
      removeItem: (itemId, quantity) => {
        const existing = get().items.find((i) => i.itemId === itemId);
        if (!existing || existing.quantity < quantity) return false;
        set((s) => ({
          items:
            existing.quantity === quantity
              ? s.items.filter((i) => i.itemId !== itemId)
              : s.items.map((i) =>
                  i.itemId === itemId ? { ...i, quantity: i.quantity - quantity } : i
                ),
        }));
        return true;
      },
      addBeyblade: (beybladeId) =>
        set((s) =>
          s.beyblades.includes(beybladeId)
            ? {}
            : { beyblades: [...s.beyblades, beybladeId] }
        ),
      equipBeyblade: (beybladeId) => set({ equippedBeybladeId: beybladeId }),
      equipLauncher: (itemId, maxDurability, itemDef?) => {
        // Left-spin launchers must be present in the player's inventory (purchased).
        // They are NEVER granted for free — the store enforces this.
        if (itemDef && (itemDef as { launchSide?: string }).launchSide === "left") {
          const owned = get().items.some((i) => i.itemId === itemId);
          if (!owned) {
            console.warn(`[RPGStore] equipLauncher: left-spin launcher "${itemId}" not in inventory — blocked.`);
            return;
          }
        }
        set((s) => ({
          equippedLauncherId: itemId,
          itemDurability: {
            ...s.itemDurability,
            // Initialise durability only if not already tracked (preserve wear)
            [itemId]: s.itemDurability[itemId] ?? maxDurability,
          },
        }));
      },
      unequipLauncher: () => set({ equippedLauncherId: null }),
      installUpgrade: (itemId) =>
        set((s) =>
          s.installedUpgradeIds.includes(itemId)
            ? {}
            : { installedUpgradeIds: [...s.installedUpgradeIds, itemId] }
        ),
      uninstallUpgrade: (itemId) =>
        set((s) => ({
          installedUpgradeIds: s.installedUpgradeIds.filter((id) => id !== itemId),
        })),
      wearItem: (itemId, amount) => {
        const current = get().itemDurability[itemId];
        if (current === undefined) return false; // indestructible
        const next = Math.max(0, current - amount);
        set((s) => ({ itemDurability: { ...s.itemDurability, [itemId]: next } }));
        if (next === 0) {
          // Auto-notify if it's the launcher
          const isLauncher = get().equippedLauncherId === itemId;
          if (isLauncher) {
            set((s) => ({
              equippedLauncherId: null,
              notifications: [
                ...s.notifications,
                {
                  id: crypto.randomUUID(),
                  type: "item-received" as const,
                  title: "Launcher Broke!",
                  subtitle: "Visit the shop to get a new one.",
                  timestamp: Date.now(),
                },
              ],
            }));
          }
          return true;
        }
        return false;
      },
      hasItem: (itemId) => get().items.some((i) => i.itemId === itemId),
      addMoney: (amount) => set((s) => ({ money: Math.max(0, s.money + amount) })),
      useConsumable: (itemId) => {
        const owned = get().items.some((i) => i.itemId === itemId && i.quantity > 0);
        if (!owned) return false;
        get().removeItem(itemId, 1);
        return true;
      },
      getLaunchBoostTotal: (itemDefs) => {
        const s = get();
        let boost = 0;
        if (s.equippedLauncherId) {
          const dur = s.itemDurability[s.equippedLauncherId] ?? 1;
          if (dur > 0) boost += itemDefs[s.equippedLauncherId]?.launchBoost ?? 0;
        }
        for (const upgradeId of s.installedUpgradeIds) {
          boost += itemDefs[upgradeId]?.launchBoost ?? 0;
        }
        return boost;
      },

      // ── Progression ────────────────────────────────────────────────────────
      reputation: 0,
      friendship: {},
      rivalStatus: {},
      battleRecords: [],
      defeatedNPCs: {},
      totalBattleCount: 0,
      npcRematchCooldowns: {},
      teamPoints: 0,
      adjustReputation: (delta) =>
        set((s) => ({ reputation: Math.max(-100, Math.min(100, s.reputation + delta)) })),
      adjustFriendship: (characterId, delta) =>
        set((s) => ({
          friendship: {
            ...s.friendship,
            [characterId]: Math.max(0, Math.min(100, (s.friendship[characterId] ?? 0) + delta)),
          },
        })),
      setRivalStatus: (characterId, status) =>
        set((s) => ({ rivalStatus: { ...s.rivalStatus, [characterId]: status } })),
      recordBattle: (npcId, result) =>
        set((s) => ({
          battleRecords: [...s.battleRecords, { npcId, result, timestamp: Date.now() }],
          totalBattleCount: s.totalBattleCount + 1,
        })),
      markNPCDefeated: (npcId) =>
        set((s) => ({ defeatedNPCs: { ...s.defeatedNPCs, [npcId]: true } })),
      setNPCRematchCooldown: (npcId, battles) =>
        set((s) => ({
          npcRematchCooldowns: { ...s.npcRematchCooldowns, [npcId]: battles },
        })),
      tickRematchCooldowns: () =>
        set((s) => {
          const updated: Record<string, number> = {};
          for (const [id, count] of Object.entries(s.npcRematchCooldowns)) {
            updated[id] = Math.max(0, count - 1);
          }
          return { npcRematchCooldowns: updated };
        }),
      canRematch: (npcId) => (get().npcRematchCooldowns[npcId] ?? 0) === 0,
      addTeamPoints: (amount) =>
        set((s) => ({ teamPoints: s.teamPoints + amount })),
      resetTeamPoints: () => set({ teamPoints: 0 }),

      // ── Leveling ───────────────────────────────────────────────────────────
      level: 1,
      xp: 0,
      beybladeXP: {},
      beybladeLevels: {},
      xpCurve: [],
      arcLevelCap: null,
      addPlayerXP: (amount) =>
        set((s) => {
          const newXP = s.xp + amount;
          const rawLevel = computeLevel(newXP, s.xpCurve);
          // Apply arc cap — XP accumulates but displayed/effective level is clamped
          const cap = s.arcLevelCap ?? MAX_PLAYER_LEVEL;
          const newLevel = Math.min(rawLevel, cap);
          const oldLevel = s.level;
          const leveledUp = newLevel > oldLevel;
          return {
            xp: newXP,
            level: newLevel,
            ...(leveledUp
              ? {
                  notifications: [
                    ...s.notifications,
                    {
                      id: crypto.randomUUID(),
                      type: "level-up" as const,
                      title: `Level Up!`,
                      subtitle: `Player Level ${newLevel}${s.arcLevelCap && newLevel >= s.arcLevelCap ? " (Arc Cap)" : ""}`,
                      timestamp: Date.now(),
                    },
                  ],
                }
              : {}),
          };
        }),
      addBeybladeXP: (beybladeId, amount) =>
        set((s) => {
          const prev = s.beybladeXP[beybladeId] ?? 0;
          const newXP = prev + amount;
          const oldLevel = s.beybladeLevels[beybladeId] ?? 1;
          const newLevel = computeBeyLevel(newXP, s.xpCurve);
          const leveledUp = newLevel > oldLevel;
          return {
            beybladeXP: { ...s.beybladeXP, [beybladeId]: newXP },
            beybladeLevels: { ...s.beybladeLevels, [beybladeId]: newLevel },
            ...(leveledUp
              ? {
                  notifications: [
                    ...s.notifications,
                    {
                      id: crypto.randomUUID(),
                      type: "bey-level-up" as const,
                      title: `Mastery Up!`,
                      subtitle: `${beybladeId} Level ${newLevel}`,
                      timestamp: Date.now(),
                    },
                  ],
                }
              : {}),
          };
        }),
      setXPCurve: (curve) => set({ xpCurve: curve }),
      setArcLevelCap: (cap) => set({ arcLevelCap: cap }),
      effectiveLevel: () => {
        const s = get();
        return s.arcLevelCap != null ? Math.min(s.level, s.arcLevelCap) : s.level;
      },

      // ── Badges ─────────────────────────────────────────────────────────────
      earnedBadges: [],
      awardBadge: (badgeId) =>
        set((s) =>
          s.earnedBadges.includes(badgeId)
            ? {}
            : {
                earnedBadges: [...s.earnedBadges, badgeId],
                notifications: [
                  ...s.notifications,
                  {
                    id: crypto.randomUUID(),
                    type: "badge-earned" as const,
                    title: "Badge Earned!",
                    subtitle: badgeId,
                    timestamp: Date.now(),
                  },
                ],
              }
        ),
      hasBadge: (badgeId) => get().earnedBadges.includes(badgeId),
      hasBadges: (badgeIds) => badgeIds.every((b) => get().earnedBadges.includes(b)),
      evaluateGate: (gate: GateCondition) => {
        const s = get();
        return evaluateGateCondition(
          gate,
          s.flags,
          s.level,
          s.beybladeLevels,
          s.earnedBadges,
          s.defeatedNPCs
        );
      },

      // ── Scene ──────────────────────────────────────────────────────────────
      activeStoryEventId: null,
      activeCutsceneId: null,
      isTransitioning: false,
      playerLocked: false,
      pendingBattleResult: null,
      pendingBattleParams: null,
      notifications: [],
      setStoryEvent: (id) => set({ activeStoryEventId: id }),
      setCutscene: (id) => set({ activeCutsceneId: id }),
      setTransitioning: (v) => set({ isTransitioning: v }),
      setPlayerLocked: (v) => set({ playerLocked: v }),
      setPendingBattleResult: (result) => set({ pendingBattleResult: result }),
      setPendingBattleParams: (params) => set({ pendingBattleParams: params }),
      pushNotification: (n) =>
        set((s) => ({
          notifications: [
            ...s.notifications,
            { ...n, id: crypto.randomUUID(), timestamp: Date.now() },
          ],
        })),
      dismissNotification: (id) =>
        set((s) => ({ notifications: s.notifications.filter((n) => n.id !== id) })),

      // ── Mini-Game ──────────────────────────────────────────────────────────
      activeMiniGame: null,
      miniGameResult: null,
      launchMiniGame: (game) => set({ activeMiniGame: game, miniGameResult: null }),
      completeMiniGame: (result) => set({ miniGameResult: result }),
      clearMiniGame: () => set({ activeMiniGame: null, miniGameResult: null }),

      // ── Save ───────────────────────────────────────────────────────────────
      currentSaveSlot: null,
      saveSlotMetas: [],
      isSaving: false,
      isLoading: false,
      lastSaveTime: null,
      setCurrentSaveSlot: (slot) => set({ currentSaveSlot: slot }),
      setSaving: (v) => set({ isSaving: v }),
      setLoading: (v) => set({ isLoading: v }),
      setLastSaveTime: (t) => set({ lastSaveTime: t }),
      setSaveSlotMetas: (metas) => set({ saveSlotMetas: metas }),

      // ── Cross-slice helpers ─────────────────────────────────────────────────
      applyQuestReward: (reward) => {
        const s = get();
        if (reward.reputation) s.adjustReputation(reward.reputation);
        if (reward.friendship) {
          Object.entries(reward.friendship).forEach(([id, delta]) =>
            s.adjustFriendship(id, delta)
          );
        }
        if (reward.items) {
          reward.items.forEach(({ itemId, quantity }) => s.addItem(itemId, quantity));
        }
        if (reward.beybladeId) s.addBeyblade(reward.beybladeId);
        if (reward.setFlags) s.setFlags(reward.setFlags);
        if (reward.xp) {
          if (reward.xp.playerXP) s.addPlayerXP(reward.xp.playerXP);
          if (reward.xp.beybladeXP) {
            const target = reward.xp.beybladeXPTarget ?? s.equippedBeybladeId;
            if (target) s.addBeybladeXP(target, reward.xp.beybladeXP);
          }
        }
        if (reward.badgeId) s.awardBadge(reward.badgeId);
      },

      applyBattleResult: (result) => {
        const s = get();
        s.recordBattle(result.npcId, result.outcome);
        if (result.outcome === "win") {
          s.markNPCDefeated(result.npcId);
          s.adjustReputation(result.rpgContext.isBossEncounter ? 25 : 15);
        } else if (result.outcome === "loss") {
          s.adjustReputation(-5);
        }
      },

      isRematchAllowed: (npcId, canRematchConfig) => {
        if (!canRematchConfig) return false;
        return get().canRematch(npcId);
      },

      resetRPGState: () =>
        set({
          currentMapId: null, currentRegionId: null, routeId: null, arcId: null,
          playerTile: defaultPlayerTile, playerFacing: "down",
          timeSlot: "morning", gameHour: 9, elapsedPlaytimeMs: 0,
          flags: {}, questStates: {}, activeQuestIds: [],
          activeDialogue: null, dialogueHistory: [],
          items: [], beyblades: [], equippedBeybladeId: null,
          equippedLauncherId: null, itemDurability: {}, installedUpgradeIds: [],
          money: 0,
          reputation: 0, friendship: {}, rivalStatus: {},
          battleRecords: [], defeatedNPCs: {},
          totalBattleCount: 0, npcRematchCooldowns: {},
          teamPoints: 0,
          level: 1, xp: 0, beybladeXP: {}, beybladeLevels: {},
          arcLevelCap: null,
          earnedBadges: [], activeStoryEventId: null, activeCutsceneId: null,
          isTransitioning: false, playerLocked: false,
          pendingBattleResult: null, pendingBattleParams: null,
          notifications: [], currentSaveSlot: null, lastSaveTime: null,
          activeMiniGame: null, miniGameResult: null,
        }),
    }),
    {
      name: "beyblade-rpg-state",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        currentMapId: state.currentMapId,
        currentRegionId: state.currentRegionId,
        routeId: state.routeId,
        arcId: state.arcId,
        playerTile: state.playerTile,
        playerFacing: state.playerFacing,
        gameHour: state.gameHour,
        timeSlot: state.timeSlot,
        flags: state.flags,
        questStates: state.questStates,
        activeQuestIds: state.activeQuestIds,
        items: state.items,
        beyblades: state.beyblades,
        equippedBeybladeId: state.equippedBeybladeId,
        equippedLauncherId: state.equippedLauncherId,
        itemDurability: state.itemDurability,
        installedUpgradeIds: state.installedUpgradeIds,
        money: state.money,
        reputation: state.reputation,
        friendship: state.friendship,
        rivalStatus: state.rivalStatus,
        battleRecords: state.battleRecords,
        defeatedNPCs: state.defeatedNPCs,
        totalBattleCount: state.totalBattleCount,
        npcRematchCooldowns: state.npcRematchCooldowns,
        teamPoints: state.teamPoints,
        level: state.level,
        xp: state.xp,
        beybladeXP: state.beybladeXP,
        beybladeLevels: state.beybladeLevels,
        xpCurve: state.xpCurve,
        arcLevelCap: state.arcLevelCap,
        earnedBadges: state.earnedBadges,
        currentSaveSlot: state.currentSaveSlot,
        elapsedPlaytimeMs: state.elapsedPlaytimeMs,
        lastSaveTime: state.lastSaveTime,
      }),
    }
  )
);
