import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useRPGStore } from "../stores/rpgStore";

/**
 * Persists the current RPG state to Firestore `rpg_saves/{userId}`.
 * Called on: room exit, battle start (pre-battle checkpoint), battle return, menu close.
 */
export async function saveRPGState(userId: string): Promise<void> {
  if (!userId) return;
  const s = useRPGStore.getState();

  // Derive completedQuestIds from questStates
  const completedQuestIds = Object.entries(s.questStates ?? {})
    .filter(([, qs]) => (qs as { status?: string }).status === "completed")
    .map(([id]) => id);

  // Merge friendship + rivalStatus into npcRelationships
  const npcRelationships: Record<string, "met" | "friend" | "rival"> = {};
  for (const [npcId, level] of Object.entries(s.friendship ?? {})) {
    npcRelationships[npcId] = (level as number) >= 3 ? "friend" : "met";
  }
  for (const [npcId] of Object.entries(s.rivalStatus ?? {})) {
    npcRelationships[npcId] = "rival";
  }

  const payload = {
    routeId:           s.routeId ?? null,
    arcId:             s.arcId ?? null,
    currentMap:        s.currentMapId ?? null,
    playerTile:        s.playerTile ?? null,
    playerFacing:      s.playerFacing ?? null,
    activeQuestIds:    s.activeQuestIds ?? [],
    completedQuestIds,
    inventory:         s.items ?? [],
    badges:            s.earnedBadges ?? [],
    npcRelationships,
    // extra context fields
    level:             s.level ?? 1,
    xp:                s.xp ?? 0,
    money:             s.money ?? 0,
    reputation:        s.reputation ?? 0,
    flags:             s.flags ?? {},
    defeatedNPCs:      s.defeatedNPCs ?? {},
    totalBattleCount:  s.totalBattleCount ?? 0,
    savedAt:           serverTimestamp(),
  };

  await setDoc(doc(db, "rpg_saves", userId), payload, { merge: true });
}
