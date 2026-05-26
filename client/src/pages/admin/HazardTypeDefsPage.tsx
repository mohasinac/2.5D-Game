import { COLLECTIONS } from "@/lib/firebase";
import { SimpleDefsCrudPage } from "@/components/admin/SimpleDefsCrudPage";

export function HazardTypeDefsPage() {
  return (
    <SimpleDefsCrudPage
      collectionId={COLLECTIONS.HAZARD_TYPE_DEFS}
      storeKey="hazardTypeDefs"
      title="Hazard Type Defs"
      subtitle="Defines element hazard type suggestions. Falls back to built-ins when empty."
      addLabel="Add Hazard Type"
      fields={[
        { key: "label", type: "text", label: "Label", required: true, placeholder: "Lava" },
        { key: "description", type: "textarea", label: "Description", placeholder: "Optional description…" },
      ]}
      defaultValues={{ label: "", description: "" }}
      deleteWarning="This cannot be undone. Elements using this hazard type ID will fall back to displaying the raw ID."
    />
  );
}
