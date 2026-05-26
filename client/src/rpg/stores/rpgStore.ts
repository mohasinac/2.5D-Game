import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type {
  TileCoord, FacingDirection, TimeSlot, RouteId, ArcId,
  FlagCondition, GateCondition, QuestStatus, QuestRuntimeState,
  BattleParams, BattleResult, RivalStatus, PlayerLevelState,
  SaveSlotMeta,
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
  money: number;
  addItem: (itemId: string, quantity: number) => void;
  removeItem: (itemId: string, quantity: number) => boolean;
  addBeyblade: (beybladeId: string) => void;
  equipBeyblade: (beybladeId: string) => void;
  hasItem: (itemId: string) => boolean;
  addMoney: (amount: number) => void;
}

// ── Progression Slice ─────────────────────────────────────────────────────────
interface ProgressionSlice {
  reputation: number;
  friendship: Record<string, number>;
  rivalStatus: Record<string, RivalStatus>;
  battleRecords: Array<{ npcId: string; result: "win" | "loss" | "draw"; timestamp: number }>;
  defeatedNPCs: Record<string, boolean>;
  adjustReputation: (delta: number) => void;
  adjustFriendship: (characterId: string, delta: number) => void;
  setRivalStatus: (characterId: string, status: RivalStatus) => void;
  recordBattle: (npcId: string, result: "win" | "loss" | "draw") => void;
  markNPCDefeated: (npcId: string) => void;
}

// ── Leveling Slice ────────────────────────────────────────────────────────────
interface LevelingSlice {
  level: number;
  xp: number;
  beybladeXP: Record<string, number>;
  beybladeLevels: Record<string, number>;
  xpCurve: number[];
  addPlayerXP: (amount: number) => void;
  addBeybladeXP: (beybladeId: string, amount: number) => void;
  setXPCurve: (curve: number[]) => void;
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
    SceneSlice, SaveSlice {
  applyQuestReward: (reward: import("../data/schemas").QuestReward) => void;
  applyBattleResult: (result: BattleResult) => void;
  resetRPGState: () => void;
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
      hasItem: (itemId) => get().items.some((i) => i.itemId === itemId),
      addMoney: (amount) => set((s) => ({ money: Math.max(0, s.money + amount) })),

      // ── Progression ────────────────────────────────────────────────────────
      reputation: 0,
      friendship: {},
      rivalStatus: {},
      battleRecords: [],
      defeatedNPCs: {},
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
        })),
      markNPCDefeated: (npcId) =>
        set((s) => ({ defeatedNPCs: { ...s.defeatedNPCs, [npcId]: true } })),

      // ── Leveling ───────────────────────────────────────────────────────────
      level: 1,
      xp: 0,
      beybladeXP: {},
      beybladeLevels: {},
      xpCurve: [],
      addPlayerXP: (amount) =>
        set((s) => {
          const newXP = s.xp + amount;
          const oldLevel = s.level;
          const newLevel = computeLevel(newXP, s.xpCurve);
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
                      subtitle: `Player Level ${newLevel}`,
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

      resetRPGState: () =>
        set({
          currentMapId: null, currentRegionId: null, routeId: null, arcId: null,
          playerTile: defaultPlayerTile, playerFacing: "down",
          timeSlot: "morning", gameHour: 9, elapsedPlaytimeMs: 0,
          flags: {}, questStates: {}, activeQuestIds: [],
          activeDialogue: null, dialogueHistory: [],
          items: [], beyblades: [], equippedBeybladeId: null, money: 0,
          reputation: 0, friendship: {}, rivalStatus: {}, battleRecords: [], defeatedNPCs: {},
          level: 1, xp: 0, beybladeXP: {}, beybladeLevels: {},
          earnedBadges: [], activeStoryEventId: null, activeCutsceneId: null,
          isTransitioning: false, playerLocked: false,
          pendingBattleResult: null, pendingBattleParams: null,
          notifications: [], currentSaveSlot: null, lastSaveTime: null,
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
        money: state.money,
        reputation: state.reputation,
        friendship: state.friendship,
        rivalStatus: state.rivalStatus,
        battleRecords: state.battleRecords,
        defeatedNPCs: state.defeatedNPCs,
        level: state.level,
        xp: state.xp,
        beybladeXP: state.beybladeXP,
        beybladeLevels: state.beybladeLevels,
        xpCurve: state.xpCurve,
        earnedBadges: state.earnedBadges,
        currentSaveSlot: state.currentSaveSlot,
        elapsedPlaytimeMs: state.elapsedPlaytimeMs,
        lastSaveTime: state.lastSaveTime,
      }),
    }
  )
);
