import type { RPGListConfig } from "@/components/admin/rpg/RPGListPage";
import type { RPGFormConfig } from "@/components/admin/rpg/RPGFormPage";
import type { RPGMap } from "@/rpg/data/schemas";
import { COLLECTIONS } from "@/lib/firebase";

export const mapListConfig: RPGListConfig<RPGMap> = {
  collectionId: COLLECTIONS.RPG_MAPS,
  title: "RPG Maps",
  subtitle: n => `${n} maps`,
  createPath: "/admin/rpg/maps/create",
  editPath: id => `/admin/rpg/maps/${id}/edit`,
  columns: [
    { key: "displayName", label: "Display Name" },
    { key: "regionId", label: "Region" },
    { key: "type", label: "Type" },
    { key: "exits", label: "Exits", render: m => (m.exits?.length ?? 0).toString() },
    { key: "npcPlacements", label: "NPCs", render: m => (m.npcPlacements?.length ?? 0).toString() },
  ],
  searchKeys: ["displayName" as keyof RPGMap, "regionId" as keyof RPGMap],
};

export const mapFormConfig: RPGFormConfig = {
  collectionId: COLLECTIONS.RPG_MAPS,
  title: "Map",
  backPath: "/admin/rpg/maps",
  backLabel: "RPG Maps",
  fields: [
    { key: "displayName", label: "Display Name", type: "text", required: true },
    { key: "regionId", label: "Region ID", type: "text" },
    { key: "type", label: "Map Type", type: "text" },
    { key: "width", label: "Width (tiles)", type: "number", defaultValue: 20 },
    { key: "height", label: "Height (tiles)", type: "number", defaultValue: 15 },
    { key: "tilesetId", label: "Tileset ID", type: "text" },
    { key: "bgmTrackId", label: "BGM Track ID", type: "text" },
    { key: "lightingPreset", label: "Lighting Preset", type: "select", options: [
      { value: "day", label: "Day" },
      { value: "evening", label: "Evening" },
      { value: "night", label: "Night" },
      { value: "indoor", label: "Indoor" },
      { value: "cave", label: "Cave" },
    ]},
  ],
};
