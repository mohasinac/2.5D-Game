import { COLLECTIONS } from "@/lib/firebase";
import { SimpleDefsCrudPage } from "@/components/admin/SimpleDefsCrudPage";

export function BeyTypeDefsPage() {
  return (
    <SimpleDefsCrudPage
      collectionId={COLLECTIONS.BEY_TYPE_DEFS}
      storeKey="beyTypeDefs"
      title="Beyblade Type Defs"
      subtitle="Defines beyblade type classifications with colors. Falls back to built-ins when empty."
      addLabel="Add Type"
      fields={[
        { key: "label", type: "text", label: "Label", required: true, placeholder: "Attack" },
        { key: "color", type: "color", label: "Color" },
        { key: "description", type: "textarea", label: "Description", placeholder: "Optional description…" },
      ]}
      defaultValues={{ label: "", color: "#3b82f6", description: "" }}
      deleteWarning="This cannot be undone. Beyblades using this type ID will fall back to displaying the raw ID."
      renderItemMeta={(item) => item.color ? (
        <span className="inline-block w-3 h-3 rounded-full" style={{ backgroundColor: String(item.color) }} />
      ) : null}
    />
  );
}
