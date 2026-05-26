import { COLLECTIONS } from "@/lib/firebase";
import { SimpleDefsCrudPage } from "@/components/admin/SimpleDefsCrudPage";

export function ArenaShapeDefsPage() {
  return (
    <SimpleDefsCrudPage
      collectionId={COLLECTIONS.ARENA_SHAPE_DEFS}
      storeKey="arenaShapeDefs"
      title="Arena Shape Defs"
      subtitle="Defines arena boundary shapes. Falls back to built-ins when empty."
      addLabel="Add Shape"
      fields={[
        { key: "label", type: "text", label: "Label", required: true, placeholder: "Circle" },
        { key: "vertexCount", type: "number", label: "Vertex Count (optional, blank = curved)", min: 3, max: 64, placeholder: "e.g. 6 for hexagon" },
        { key: "description", type: "textarea", label: "Description", placeholder: "Optional description…" },
      ]}
      defaultValues={{ label: "", description: "" }}
      deleteWarning="This cannot be undone. Arenas using this shape ID will fall back to the default shape."
      renderItemMeta={(item) => item.vertexCount != null ? (
        <span className="text-xs text-theme-muted font-normal">{Number(item.vertexCount)} vertices</span>
      ) : null}
    />
  );
}
