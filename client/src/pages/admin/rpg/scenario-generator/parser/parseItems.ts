import type { InventoryItem } from "@/rpg/data/schemas";
import type { ScenarioItem, ScenarioMeta } from "./types";
import { prefixId } from "./idUtils";

export function parseItems(
  items: ScenarioItem[],
  meta: ScenarioMeta,
): { items: InventoryItem[]; warnings: string[] } {
  const result: InventoryItem[] = [];
  const warnings: string[] = [];
  const slug = meta.id;

  for (const it of items) {
    const itemId = prefixId(slug, it.id);

    const item: InventoryItem = {
      id: itemId,
      displayName: it.name,
      description: it.description ?? `Item: ${it.name}`,
      category: it.category ?? "consumable",
      iconAssetId: `${itemId}-icon`,
      stackable: it.stackable ?? true,
      maxStack: it.maxStack,
      usable: it.usable ?? false,
      sellPrice: it.sellPrice,
      buyPrice: it.buyPrice,
      questRelated: it.questRelated ?? false,
    };

    result.push(item);
  }

  return { items: result, warnings };
}
