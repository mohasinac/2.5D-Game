import {
  doc, getDoc, setDoc, deleteDoc, collection, getDocs
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import type { RPGSaveState, SaveSlotMeta } from "../data/schemas";
import type { RPGStore } from "../stores/rpgStore";
import { RPG_SAVE_COLLECTION } from "../constants/rpgConstants";

export class SaveSystem {
  async loadSaveSlotMetas(userId: string): Promise<SaveSlotMeta[]> {
    const metas: SaveSlotMeta[] = [];
    for (let i = 0; i < 3; i++) {
      const ref = doc(db, RPG_SAVE_COLLECTION, userId, "slots", String(i));
      const snap = await getDoc(ref);
      if (snap.exists()) {
        const data = snap.data() as RPGSaveState;
        metas.push(data.meta);
      }
    }
    return metas;
  }

  async loadSave(userId: string, slotIndex: 0 | 1 | 2): Promise<RPGSaveState | null> {
    const ref = doc(db, RPG_SAVE_COLLECTION, userId, "slots", String(slotIndex));
    const snap = await getDoc(ref);
    if (!snap.exists()) return null;
    return snap.data() as RPGSaveState;
  }

  async writeSave(userId: string, state: RPGSaveState): Promise<void> {
    const ref = doc(db, RPG_SAVE_COLLECTION, userId, "slots", String(state.meta.slotIndex));
    await setDoc(ref, state);
  }

  async deleteSave(userId: string, slotIndex: 0 | 1 | 2): Promise<void> {
    const ref = doc(db, RPG_SAVE_COLLECTION, userId, "slots", String(slotIndex));
    await deleteDoc(ref);
  }

  serializeState(store: RPGStore, slotIndex: 0 | 1 | 2): RPGSaveState {
    const now = Date.now();
    return {
      meta: {
        slotIndex,
        createdAt: now,
        updatedAt: now,
        playerName: "Player",
        routeId: store.routeId ?? "",
        arcId: store.arcId ?? "",
        currentMapId: store.currentMapId ?? "",
        currentRegionId: store.currentRegionId ?? "",
        playtimeMs: store.elapsedPlaytimeMs,
      },
      player: {
        tile: store.playerTile,
        facing: store.playerFacing,
        reputation: store.reputation,
        friendship: { ...store.friendship },
        rivalStatus: { ...store.rivalStatus },
        unlockedMaps: [],
        unlockedScenesViewed: [],
      },
      flags: { ...store.flags },
      questStates: { ...store.questStates },
      inventory: {
        items: [...store.items],
        beyblades: [...store.beyblades],
        equippedBeybladeId: store.equippedBeybladeId,
        money: store.money,
      },
      battleRecords: [...store.battleRecords],
      defeatedNPCs: { ...store.defeatedNPCs },
      leveling: {
        level: store.level,
        xp: store.xp,
        beybladeXP: { ...store.beybladeXP },
        beybladeLevels: { ...store.beybladeLevels },
      },
      earnedBadges: [...store.earnedBadges],
      currentMapId: store.currentMapId ?? "",
      currentRegionId: store.currentRegionId ?? "",
    };
  }

  applyToStore(save: RPGSaveState, store: RPGStore): void {
    store.setCurrentMap(save.currentMapId);
    store.setCurrentRegion(save.currentRegionId);
    store.setRouteId(save.meta.routeId);
    store.setArcId(save.meta.arcId);
    store.setPlayerTile(save.player.tile);
    store.setPlayerFacing(save.player.facing);
    store.setFlags(save.flags);
    // Restore quest states
    Object.entries(save.questStates).forEach(([questId, qs]) => {
      if (qs.status === "active") store.startQuest(questId);
      if (qs.status === "completed") store.completeQuest(questId);
    });
    // Restore inventory
    save.inventory.items.forEach(({ itemId, quantity }) => store.addItem(itemId, quantity));
    save.inventory.beyblades.forEach((id) => store.addBeyblade(id));
    if (save.inventory.equippedBeybladeId) store.equipBeyblade(save.inventory.equippedBeybladeId);
    store.addMoney(save.inventory.money);
    // Restore progression
    store.adjustReputation(save.player.reputation);
    Object.entries(save.player.friendship).forEach(([id, v]) => store.adjustFriendship(id, v));
    Object.entries(save.player.rivalStatus).forEach(([id, v]) => store.setRivalStatus(id, v));
    save.battleRecords.forEach(({ npcId, result }) => store.recordBattle(npcId, result));
    Object.keys(save.defeatedNPCs).forEach((id) => store.markNPCDefeated(id));
    // Restore leveling
    store.addPlayerXP(save.leveling.xp);
    Object.entries(save.leveling.beybladeXP).forEach(([id, xp]) => store.addBeybladeXP(id, xp));
    // Restore badges
    save.earnedBadges.forEach((b) => store.awardBadge(b));
    store.setCurrentSaveSlot(save.meta.slotIndex);
  }
}
