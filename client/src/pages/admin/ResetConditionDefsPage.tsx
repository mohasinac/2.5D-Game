import { COLLECTIONS } from "@/lib/firebase";
import { SimpleDefsCrudPage } from "@/components/admin/SimpleDefsCrudPage";

export function ResetConditionDefsPage() {
  return (
    <SimpleDefsCrudPage
      collectionId={COLLECTIONS.RESET_CONDITION_DEFS}
      storeKey="resetConditionDefs"
      title="Reset Condition Defs"
      subtitle="Defines stat modifier reset conditions. Falls back to built-ins when empty."
      addLabel="Add Condition"
      fields={[
        { key: "label", type: "text", label: "Label", required: true, placeholder: "Impact" },
        { key: "description", type: "textarea", label: "Description", placeholder: "Optional description…" },
      ]}
      defaultValues={{ label: "", description: "" }}
      deleteWarning="This cannot be undone. Stat modifiers using this reset condition ID will fall back to displaying the raw ID."
    />
  );
}
