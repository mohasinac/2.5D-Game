import { COLLECTIONS } from "@/lib/firebase";
import { SimpleDefsCrudPage } from "@/components/admin/SimpleDefsCrudPage";

export function RPGFacingDefsPage() {
  return (
    <SimpleDefsCrudPage
      collectionId={COLLECTIONS.RPG_FACING_DEFS}
      storeKey="rpgFacingDefs"
      title="RPG Facing Defs"
      subtitle="Defines RPG character facing directions. Falls back to built-ins when empty."
      addLabel="Add Facing"
      fields={[
        { key: "label", type: "text", label: "Label", required: true, placeholder: "Up" },
        { key: "description", type: "textarea", label: "Description", placeholder: "Optional description…" },
      ]}
      defaultValues={{ label: "", description: "" }}
      deleteWarning="This cannot be undone. RPG entities using this facing ID will fall back to displaying the raw ID."
    />
  );
}
