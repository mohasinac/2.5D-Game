import type { RPGListConfig } from "@/components/admin/rpg/RPGListPage";
import type { RPGFormConfig } from "@/components/admin/rpg/RPGFormPage";
import type { NPC } from "@/rpg/data/schemas";
import { COLLECTIONS } from "@/lib/firebase";

export const npcListConfig: RPGListConfig<NPC> = {
  collectionId: COLLECTIONS.RPG_NPCS,
  title: "RPG NPCs",
  subtitle: n => `${n} NPCs`,
  createPath: "/admin/rpg/npcs/create",
  editPath: id => `/admin/rpg/npcs/${id}/edit`,
  columns: [
    { key: "displayName", label: "Display Name" },
    { key: "type", label: "Type" },
    { key: "regionId", label: "Region" },
    { key: "spriteSheetId", label: "Sprite", render: n => (n.spriteSheetId ? "✓" : "-") },
    { key: "battleConfig", label: "Battle", render: n => (n.battleConfig ? "Yes" : "No") },
  ],
  searchKeys: ["displayName" as keyof NPC, "type" as keyof NPC],
};

export const npcFormConfig: RPGFormConfig = {
  collectionId: COLLECTIONS.RPG_NPCS,
  title: "NPC",
  backPath: "/admin/rpg/npcs",
  backLabel: "RPG NPCs",
  fields: [
    { key: "displayName", label: "Display Name", type: "text", required: true },
    { key: "type", label: "NPC Type", type: "text" },
    { key: "regionId", label: "Region ID", type: "text" },
    { key: "spriteSheetId", label: "Sprite Sheet ID", type: "text" },
    { key: "defaultDialogueId", label: "Default Dialogue ID", type: "text" },
    { key: "defaultMapId", label: "Default Map ID", type: "text" },
    { key: "description", label: "Description", type: "textarea" },
  ],
};
