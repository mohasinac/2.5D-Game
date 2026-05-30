import type { RPGListConfig } from "@/components/admin/rpg/RPGListPage";
import type { RPGFormConfig } from "@/components/admin/rpg/RPGFormPage";
import type { ArcDef } from "@/rpg/data/schemas";
import { COLLECTIONS } from "@/lib/firebase";

export const arcListConfig: RPGListConfig<ArcDef> = {
  collectionId: COLLECTIONS.RPG_ARCS,
  title: "RPG Arcs",
  subtitle: n => `${n} arcs (generations)`,
  createPath: "/admin/rpg/arcs/create",
  editPath: id => `/admin/rpg/arcs/${id}/edit`,
  columns: [
    { key: "order", label: "Order" },
    { key: "displayName", label: "Name" },
    { key: "routeIds", label: "Routes", render: a => (a.routeIds?.length ?? 0).toString() },
    { key: "startingRegionId", label: "Starting Region" },
    { key: "previousArcId", label: "Prev Arc", render: a => a.previousArcId ?? "-" },
  ],
  searchKeys: ["displayName" as keyof ArcDef],
};

export const arcFormConfig: RPGFormConfig = {
  collectionId: COLLECTIONS.RPG_ARCS,
  title: "Arc",
  backPath: "/admin/rpg/arcs",
  backLabel: "RPG Arcs",
  fields: [
    { key: "displayName", label: "Display Name", type: "text", required: true },
    { key: "order", label: "Order", type: "number", defaultValue: 0 },
    { key: "routeIds", label: "Route IDs (comma separated)", type: "array" },
    { key: "startingRegionId", label: "Starting Region ID", type: "text" },
    { key: "previousArcId", label: "Previous Arc ID", type: "text" },
    { key: "completionFlagId", label: "Completion Flag ID", type: "text" },
    { key: "description", label: "Description", type: "textarea" },
  ],
};
