import type { RPGListConfig } from "@/components/admin/rpg/RPGListPage";
import type { RPGFormConfig } from "@/components/admin/rpg/RPGFormPage";
import type { RouteDef } from "@/rpg/data/schemas";
import { COLLECTIONS } from "@/lib/firebase";

export const routeListConfig: RPGListConfig<RouteDef> = {
  collectionId: COLLECTIONS.RPG_ROUTES,
  title: "RPG Routes",
  subtitle: n => `${n} routes`,
  createPath: "/admin/rpg/routes/create",
  editPath: id => `/admin/rpg/routes/${id}/edit`,
  columns: [
    { key: "displayName", label: "Name" },
    { key: "protagonistNpcId", label: "Protagonist NPC" },
    { key: "startingMapId", label: "Starting Map" },
    { key: "availableInArcs", label: "Arcs", render: r => (r.availableInArcs?.length ?? 0).toString() },
  ],
  searchKeys: ["displayName" as keyof RouteDef],
};

export const routeFormConfig: RPGFormConfig = {
  collectionId: COLLECTIONS.RPG_ROUTES,
  title: "Route",
  backPath: "/admin/rpg/routes",
  backLabel: "RPG Routes",
  fields: [
    { key: "displayName", label: "Display Name", type: "text", required: true },
    { key: "protagonistNpcId", label: "Protagonist NPC ID", type: "text" },
    { key: "description", label: "Description", type: "textarea" },
    { key: "startingMapId", label: "Starting Map ID", type: "text" },
    { key: "startingBeybladeId", label: "Starting Beyblade ID", type: "text" },
    { key: "cardImageAssetId", label: "Card Image Asset ID", type: "text" },
    { key: "availableInArcs", label: "Available In Arcs (comma separated)", type: "array" },
  ],
};
