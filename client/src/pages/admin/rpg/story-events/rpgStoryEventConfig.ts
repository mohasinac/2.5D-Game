import type { RPGListConfig } from "@/components/admin/rpg/RPGListPage";
import type { RPGFormConfig } from "@/components/admin/rpg/RPGFormPage";
import type { StoryEvent } from "@/rpg/data/schemas";
import { COLLECTIONS } from "@/lib/firebase";

export const storyEventListConfig: RPGListConfig<StoryEvent> = {
  collectionId: COLLECTIONS.RPG_STORY_EVENTS,
  title: "RPG Story Events",
  subtitle: n => `${n} story events`,
  createPath: "/admin/rpg/story-events/create",
  editPath: id => `/admin/rpg/story-events/${id}/edit`,
  columns: [
    { key: "displayName", label: "Display Name" },
    { key: "arcId", label: "Arc" },
    { key: "category", label: "Category" },
    { key: "routeExclusiveFor", label: "Route Exclusive", render: e => e.routeExclusiveFor ?? "-" },
    { key: "triggerOnce", label: "Trigger Once", render: e => (e.triggerOnce ? "Yes" : "No") },
  ],
  searchKeys: ["displayName" as keyof StoryEvent, "arcId" as keyof StoryEvent],
};

export const storyEventFormConfig: RPGFormConfig = {
  collectionId: COLLECTIONS.RPG_STORY_EVENTS,
  title: "Story Event",
  backPath: "/admin/rpg/story-events",
  backLabel: "RPG Story Events",
  fields: [
    { key: "displayName", label: "Display Name", type: "text", required: true },
    { key: "arcId", label: "Arc ID", type: "text" },
    { key: "routeExclusiveFor", label: "Route Exclusive For", type: "text" },
    { key: "category", label: "Category", type: "text", defaultValue: "shared" },
    { key: "triggerOnce", label: "Trigger Once", type: "boolean", defaultValue: true },
    { key: "blocksPlayerInput", label: "Blocks Player Input", type: "boolean", defaultValue: true },
  ],
};
