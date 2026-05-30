import type { RPGListConfig } from "@/components/admin/rpg/RPGListPage";
import type { RPGFormConfig } from "@/components/admin/rpg/RPGFormPage";
import type { RegionDef } from "@/rpg/data/schemas";
import { COLLECTIONS } from "@/lib/firebase";

export const regionListConfig: RPGListConfig<RegionDef> = {
  collectionId: COLLECTIONS.RPG_REGIONS,
  title: "RPG Regions",
  subtitle: n => `${n} regions`,
  createPath: "/admin/rpg/regions/create",
  editPath: id => `/admin/rpg/regions/${id}/edit`,
  columns: [
    { key: "displayName", label: "Name" },
    { key: "country", label: "Country" },
    { key: "mapIds", label: "Maps", render: r => (r.mapIds?.length ?? 0).toString() },
    { key: "arcIds", label: "Arcs", render: r => (r.arcIds?.length ?? 0).toString() },
  ],
  searchKeys: ["displayName" as keyof RegionDef, "country" as keyof RegionDef],
};

export const regionFormConfig: RPGFormConfig = {
  collectionId: COLLECTIONS.RPG_REGIONS,
  title: "Region",
  backPath: "/admin/rpg/regions",
  backLabel: "RPG Regions",
  fields: [
    { key: "displayName", label: "Display Name", type: "text", required: true },
    { key: "country", label: "Country", type: "text" },
    { key: "description", label: "Description", type: "textarea" },
    { key: "mapIds", label: "Map IDs (comma separated)", type: "array" },
    { key: "hubMapId", label: "Hub Map ID", type: "text" },
    { key: "bgmTrackId", label: "BGM Track ID", type: "text" },
    { key: "arcIds", label: "Arc IDs (comma separated)", type: "array" },
  ],
};
