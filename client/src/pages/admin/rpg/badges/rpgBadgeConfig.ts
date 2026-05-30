import type { RPGListConfig } from "@/components/admin/rpg/RPGListPage";
import type { RPGFormConfig } from "@/components/admin/rpg/RPGFormPage";
import type { BadgeDef } from "@/rpg/data/schemas";
import { COLLECTIONS } from "@/lib/firebase";

export const badgeListConfig: RPGListConfig<BadgeDef> = {
  collectionId: COLLECTIONS.RPG_BADGES,
  title: "RPG Badges",
  subtitle: n => `${n} badges`,
  createPath: "/admin/rpg/badges/create",
  editPath: id => `/admin/rpg/badges/${id}/edit`,
  columns: [
    { key: "order", label: "#", render: b => (b.order ?? "-").toString() },
    { key: "displayName", label: "Name" },
    { key: "category", label: "Category" },
    { key: "regionId", label: "Region", render: b => b.regionId ?? "-" },
    { key: "arcId", label: "Arc", render: b => b.arcId ?? "-" },
  ],
  searchKeys: ["displayName" as keyof BadgeDef],
};

export const badgeFormConfig: RPGFormConfig = {
  collectionId: COLLECTIONS.RPG_BADGES,
  title: "Badge",
  backPath: "/admin/rpg/badges",
  backLabel: "RPG Badges",
  fields: [
    { key: "displayName", label: "Display Name", type: "text", required: true },
    { key: "description", label: "Description", type: "textarea" },
    { key: "iconAssetId", label: "Icon Asset ID", type: "text" },
    { key: "category", label: "Category", type: "text" },
    { key: "regionId", label: "Region ID", type: "text" },
    { key: "arcId", label: "Arc ID", type: "text" },
    { key: "routeExclusiveFor", label: "Route Exclusive For", type: "text" },
    { key: "order", label: "Order", type: "number", defaultValue: 0 },
  ],
};
