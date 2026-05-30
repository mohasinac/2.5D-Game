import type { RPGListConfig } from "@/components/admin/rpg/RPGListPage";
import type { RPGFormConfig } from "@/components/admin/rpg/RPGFormPage";
import type { InventoryItem } from "@/rpg/data/schemas";
import { COLLECTIONS } from "@/lib/firebase";

export const itemListConfig: RPGListConfig<InventoryItem> = {
  collectionId: COLLECTIONS.RPG_ITEMS,
  title: "RPG Items",
  subtitle: n => `${n} items`,
  createPath: "/admin/rpg/items/create",
  editPath: id => `/admin/rpg/items/${id}/edit`,
  columns: [
    { key: "displayName", label: "Display Name" },
    { key: "category", label: "Category" },
    { key: "stackable", label: "Stackable", render: i => (i.stackable ? "Yes" : "No") },
    { key: "usable", label: "Usable", render: i => (i.usable ? "Yes" : "No") },
    { key: "sellPrice", label: "Sell Price", render: i => ((i as any).sellPrice ?? "-").toString() },
  ],
  searchKeys: ["displayName" as keyof InventoryItem],
};

export const itemFormConfig: RPGFormConfig = {
  collectionId: COLLECTIONS.RPG_ITEMS,
  title: "Item",
  backPath: "/admin/rpg/items",
  backLabel: "RPG Items",
  fields: [
    { key: "displayName", label: "Display Name", type: "text", required: true },
    { key: "description", label: "Description", type: "textarea" },
    { key: "category", label: "Category", type: "text" },
    { key: "iconAssetId", label: "Icon Asset ID", type: "text" },
    { key: "stackable", label: "Stackable", type: "boolean", defaultValue: false },
    { key: "maxStack", label: "Max Stack", type: "number", defaultValue: 99 },
    { key: "usable", label: "Usable", type: "boolean", defaultValue: false },
    { key: "questRelated", label: "Quest Related", type: "boolean", defaultValue: false },
    { key: "buyPrice", label: "Buy Price", type: "number", defaultValue: 0 },
    { key: "sellPrice", label: "Sell Price", type: "number", defaultValue: 0 },
  ],
};
