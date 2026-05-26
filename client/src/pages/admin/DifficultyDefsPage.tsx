import { COLLECTIONS } from "@/lib/firebase";
import { SimpleDefsCrudPage } from "@/components/admin/SimpleDefsCrudPage";

export function DifficultyDefsPage() {
  return (
    <SimpleDefsCrudPage
      collectionId={COLLECTIONS.DIFFICULTY_DEFS}
      storeKey="difficultyDefs"
      title="Difficulty Defs"
      subtitle="Defines difficulty levels with colors. Falls back to built-ins when empty."
      addLabel="Add Difficulty"
      fields={[
        { key: "label", type: "text", label: "Label", required: true, placeholder: "Medium" },
        { key: "color", type: "color", label: "Color" },
        { key: "sortOrder", type: "number", label: "Sort Order", min: 0, max: 99, step: 1, placeholder: "0" },
        { key: "description", type: "textarea", label: "Description", placeholder: "Optional description…" },
      ]}
      defaultValues={{ label: "", color: "#3b82f6", sortOrder: 0, description: "" }}
      deleteWarning="This cannot be undone. References to this difficulty ID will fall back to displaying the raw ID."
      renderItemMeta={(item) => item.color ? (
        <span className="inline-block w-3 h-3 rounded-full" style={{ backgroundColor: String(item.color) }} />
      ) : null}
    />
  );
}
