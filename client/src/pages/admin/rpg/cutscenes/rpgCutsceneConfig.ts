import type { RPGListConfig } from "@/components/admin/rpg/RPGListPage";
import type { RPGFormConfig } from "@/components/admin/rpg/RPGFormPage";
import type { Cutscene } from "@/rpg/data/schemas";
import { COLLECTIONS } from "@/lib/firebase";

export const cutsceneListConfig: RPGListConfig<Cutscene> = {
  collectionId: COLLECTIONS.RPG_CUTSCENES,
  title: "RPG Cutscenes",
  subtitle: n => `${n} cutscenes`,
  createPath: "/admin/rpg/cutscenes/create",
  editPath: id => `/admin/rpg/cutscenes/${id}/edit`,
  columns: [
    { key: "displayName", label: "Display Name" },
    { key: "teardown", label: "Teardown" },
    { key: "setupActors", label: "Setup Actors", render: c => (c.setupActors?.length ?? 0).toString() },
  ],
  searchKeys: ["displayName" as keyof Cutscene],
};

export const cutsceneFormConfig: RPGFormConfig = {
  collectionId: COLLECTIONS.RPG_CUTSCENES,
  title: "Cutscene",
  backPath: "/admin/rpg/cutscenes",
  backLabel: "RPG Cutscenes",
  fields: [
    { key: "displayName", label: "Display Name", type: "text", required: true },
    { key: "teardown", label: "Teardown", type: "text" },
  ],
};
