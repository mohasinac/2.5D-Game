import { COLLECTIONS } from "@/lib/firebase";
import { SimpleDefsCrudPage } from "@/components/admin/SimpleDefsCrudPage";

export function PartLayerDefsPage() {
  return (
    <SimpleDefsCrudPage
      collectionId={COLLECTIONS.PART_LAYER_DEFS}
      storeKey="partLayerDefs"
      title="Part Layer Defs"
      subtitle="Defines part layer types for contact point assignments. Falls back to built-ins when empty."
      addLabel="Add Layer Type"
      fields={[
        { key: "label", type: "text", label: "Label", required: true, placeholder: "Upper Blade" },
        { key: "description", type: "textarea", label: "Description", placeholder: "Optional description…" },
      ]}
      defaultValues={{ label: "", description: "" }}
      deleteWarning="This cannot be undone. Contact points using this layer ID will fall back to displaying the raw ID."
    />
  );
}
