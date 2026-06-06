import type { SaveSlot, SaveSlotMeta } from '../../types/rpgTypes.ts';
import { LS_SAVE_PFX, SAVE_VERSION, MAX_SAVE_SLOTS } from '../config/rpgConstants.ts';
import { gameStateStore } from './GameStateStore.ts';
import { inventoryStore } from './InventoryStore.ts';

interface PersistedSave extends SaveSlot { _version: number; }

export class SaveSystem {
  static hasAnySlot(): boolean {
    for (let i = 0; i < MAX_SAVE_SLOTS; i++) {
      if (localStorage.getItem(`${LS_SAVE_PFX}${i}`)) return true;
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
    localStorage.setItem(`${LS_SAVE_PFX}${slot}`, JSON.stringify(s));
  }

  static load(slot: 0 | 1 | 2): boolean {
    const raw = localStorage.getItem(`${LS_SAVE_PFX}${slot}`);
    if (!raw) return false;
    try {
      const s = JSON.parse(raw) as PersistedSave;
      if ((s._version ?? 0) !== SAVE_VERSION) {
        localStorage.removeItem(`${LS_SAVE_PFX}${slot}`); return false;
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
      const raw = localStorage.getItem(`${LS_SAVE_PFX}${i}`);
      if (!raw) { result.push(null); continue; }
      try {
        const s = JSON.parse(raw) as PersistedSave;
        result.push({ slot: s.slot, timestamp: s.timestamp, playerName: s.playerName, mapId: s.mapId });
      } catch { result.push(null); }
    }
    return result;
  }

  static deleteSlot(slot: 0 | 1 | 2): void {
    localStorage.removeItem(`${LS_SAVE_PFX}${slot}`);
  }
}
