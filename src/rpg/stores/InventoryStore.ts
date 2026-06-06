import type { ItemId, ItemInstance, EquipSlot } from '../../types/rpgTypes.ts';
import { MAX_INVENTORY_SLOTS } from '../config/rpgConstants.ts';

interface InventoryData {
  items:     ItemInstance[];
  gold:      number;
  equipment: Partial<Record<EquipSlot, ItemId>>;
}

class InventoryStore {
  private items     = new Map<ItemId, ItemInstance>();
  private gold      = 0;
  private equipment: Partial<Record<EquipSlot, ItemId>> = {};

  // ── Gold ───────────────────────────────────────────────────────
  getGold(): number { return this.gold; }
  addGold(n: number): void { this.gold = Math.max(0, this.gold + n); }
  spendGold(n: number): boolean {
    if (this.gold < n) return false;
    this.gold -= n; return true;
  }

  // ── Items ──────────────────────────────────────────────────────
  add(itemId: ItemId, qty: number = 1): boolean {
    const existing = this.items.get(itemId);
    if (existing) { existing.qty += qty; return true; }
    if (this.items.size >= MAX_INVENTORY_SLOTS) return false;
    this.items.set(itemId, { itemId, qty }); return true;
  }

  remove(itemId: ItemId, qty: number = 1): boolean {
    const existing = this.items.get(itemId);
    if (!existing || existing.qty < qty) return false;
    existing.qty -= qty;
    if (existing.qty <= 0) this.items.delete(itemId);
    return true;
  }

  has(itemId: ItemId, qty: number = 1): boolean {
    return (this.items.get(itemId)?.qty ?? 0) >= qty;
  }

  getAll(): ItemInstance[] { return [...this.items.values()]; }
  getCount(itemId: ItemId): number { return this.items.get(itemId)?.qty ?? 0; }

  // ── Equipment ─────────────────────────────────────────────────
  equip(slot: EquipSlot, itemId: ItemId): void { this.equipment[slot] = itemId; }
  unequip(slot: EquipSlot): void { delete this.equipment[slot]; }
  getEquipped(slot: EquipSlot): ItemId | undefined { return this.equipment[slot]; }
  getAllEquipment(): Partial<Record<EquipSlot, ItemId>> { return { ...this.equipment }; }

  // ── Serialization ──────────────────────────────────────────────
  toData(): InventoryData {
    return { items: this.getAll(), gold: this.gold, equipment: { ...this.equipment } };
  }

  fromData(d: InventoryData): void {
    this.items.clear();
    (d.items ?? []).forEach(i => this.items.set(i.itemId, { ...i }));
    this.gold = d.gold ?? 0;
    this.equipment = { ...(d.equipment ?? {}) };
  }

  reset(): void { this.items.clear(); this.gold = 0; this.equipment = {}; }
}

export const inventoryStore = new InventoryStore();
