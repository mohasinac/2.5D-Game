import type { SaveSlot, SaveSlotMeta } from '../../types/rpgTypes.ts';
import { SAVE_VERSION, MAX_SAVE_SLOTS } from '../config/rpgConstants.ts';
import { gameStateStore } from './GameStateStore.ts';
import { inventoryStore } from './InventoryStore.ts';
import { rpgSaveStore } from '../../stores/rpg/rpgSaveStore.ts';

interface PersistedSave extends SaveSlot { _version: number; }

export class SaveSystem {
  static hasAnySlot(): boolean {
    const blobs = rpgSaveStore.getState().slotBlobs;
    for (let i = 0; i < MAX_SAVE_SLOTS; i++) {
      if (blobs[i]) return true;
    }
    return false;
  }

  static save(slot: 0 | 1 | 2, playerName: string): void {
    const pos = gameStateStore.getPlayerPos();
    const inv = inventoryStore.toData();
    const state = gameStateStore.toData();
    const s: PersistedSave = {
      _version:    SAVE_VERSION,
      slot,
      timestamp:   Date.now(),
      playerName,
      mapId:       gameStateStore.getCurrentMap(),
      playerTileX: pos.tileX,
      playerTileY: pos.tileY,
      gold:        inv.gold,
      items:       inv.items,
      equipment:   inv.equipment,
      flags:       state.flags,
      quests:      state.quests,
      playtimeMs:  gameStateStore.getPlaytime(),
    };
    rpgSaveStore.getState().setSlot(slot, JSON.stringify(s));
  }

  static load(slot: 0 | 1 | 2): boolean {
    const raw = rpgSaveStore.getState().getSlot(slot);
    if (!raw) return false;
    try {
      const s = JSON.parse(raw) as PersistedSave;
      if ((s._version ?? 0) !== SAVE_VERSION) {
        rpgSaveStore.getState().deleteSlot(slot); return false;
      }
      gameStateStore.fromData({
        flags:       s.flags,
        mapId:       s.mapId,
        playerTileX: s.playerTileX,
        playerTileY: s.playerTileY,
        playtimeMs:  s.playtimeMs,
        quests:      s.quests,
      });
      inventoryStore.fromData({ items: s.items, gold: s.gold, equipment: s.equipment });
      return true;
    } catch { return false; }
  }

  static getSlotsMetadata(): (SaveSlotMeta | null)[] {
    const result: (SaveSlotMeta | null)[] = [];
    for (let i = 0; i < MAX_SAVE_SLOTS; i++) {
      const raw = rpgSaveStore.getState().getSlot(i);
      if (!raw) { result.push(null); continue; }
      try {
        const s = JSON.parse(raw) as PersistedSave;
        result.push({ slot: s.slot, timestamp: s.timestamp, playerName: s.playerName, mapId: s.mapId });
      } catch { result.push(null); }
    }
    return result;
  }

  static deleteSlot(slot: 0 | 1 | 2): void {
    rpgSaveStore.getState().deleteSlot(slot);
  }
}
