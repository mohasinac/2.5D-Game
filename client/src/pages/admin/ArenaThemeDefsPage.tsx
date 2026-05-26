import { COLLECTIONS } from "@/lib/firebase";
import { SimpleDefsCrudPage } from "@/components/admin/SimpleDefsCrudPage";

export function ArenaThemeDefsPage() {
  return (
    <SimpleDefsCrudPage
      collectionId={COLLECTIONS.ARENA_THEME_DEFS}
      storeKey="arenaThemeDefs"
      title="Arena Theme Defs"
      subtitle="Defines visual themes available in the arena editor. Falls back to built-ins when empty."
      addLabel="Add Theme"
      fields={[
        { key: "label", type: "text", label: "Label", required: true, placeholder: "Volcano" },
        { key: "description", type: "textarea", label: "Description", placeholder: "Optional description…" },
        { key: "color", type: "color", label: "Theme Color" },
      ]}
      defaultValues={{ label: "", description: "", color: "#3b82f6" }}
      deleteWarning="This cannot be undone. Arenas using this theme ID will fall back to the default theme."
    />
  );
}
