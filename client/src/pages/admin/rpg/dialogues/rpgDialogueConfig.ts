import type { RPGListConfig } from "@/components/admin/rpg/RPGListPage";
import type { RPGFormConfig } from "@/components/admin/rpg/RPGFormPage";
import type { DialogueTree } from "@/rpg/data/schemas";
import { COLLECTIONS } from "@/lib/firebase";

export const dialogueListConfig: RPGListConfig<DialogueTree> = {
  collectionId: COLLECTIONS.RPG_DIALOGUES,
  title: "RPG Dialogues",
  subtitle: n => `${n} dialogue trees`,
  createPath: "/admin/rpg/dialogues/create",
  editPath: id => `/admin/rpg/dialogues/${id}/edit`,
  columns: [
    { key: "startNodeId", label: "Start Node" },
    { key: "nodes", label: "Nodes", render: d => Object.keys(d.nodes ?? {}).length.toString() },
  ],
  searchKeys: ["startNodeId" as keyof DialogueTree],
};

export const dialogueFormConfig: RPGFormConfig = {
  collectionId: COLLECTIONS.RPG_DIALOGUES,
  title: "Dialogue Tree",
  backPath: "/admin/rpg/dialogues",
  backLabel: "RPG Dialogues",
  fields: [
    { key: "startNodeId", label: "Start Node ID", type: "text", required: true },
  ],
};
