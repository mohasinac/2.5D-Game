import type { RPGListConfig } from "@/components/admin/rpg/RPGListPage";
import type { RPGFormConfig } from "@/components/admin/rpg/RPGFormPage";
import type { Quest } from "@/rpg/data/schemas";
import { COLLECTIONS } from "@/lib/firebase";

export const questListConfig: RPGListConfig<Quest> = {
  collectionId: COLLECTIONS.RPG_QUESTS,
  title: "RPG Quests",
  subtitle: n => `${n} quests`,
  createPath: "/admin/rpg/quests/create",
  editPath: id => `/admin/rpg/quests/${id}/edit`,
  columns: [
    { key: "title", label: "Title" },
    { key: "category", label: "Category" },
    { key: "arcId", label: "Arc" },
    { key: "objectives", label: "Objectives", render: q => (q.objectives?.length ?? 0).toString() },
  ],
  searchKeys: ["title" as keyof Quest, "category" as keyof Quest],
};

export const questFormConfig: RPGFormConfig = {
  collectionId: COLLECTIONS.RPG_QUESTS,
  title: "Quest",
  backPath: "/admin/rpg/quests",
  backLabel: "RPG Quests",
  fields: [
    { key: "title", label: "Title", type: "text", required: true },
    { key: "description", label: "Description", type: "textarea" },
    { key: "arcId", label: "Arc ID", type: "text" },
    { key: "category", label: "Category", type: "text", defaultValue: "main" },
    { key: "routeExclusiveFor", label: "Route Exclusive For", type: "text" },
    { key: "prerequisites", label: "Prerequisites (comma separated quest IDs)", type: "array" },
  ],
};
