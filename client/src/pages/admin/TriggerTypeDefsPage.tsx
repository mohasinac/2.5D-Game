import { COLLECTIONS } from "@/lib/firebase";
import { SimpleDefsCrudPage } from "@/components/admin/SimpleDefsCrudPage";

export function TriggerTypeDefsPage() {
  return (
    <SimpleDefsCrudPage
      collectionId={COLLECTIONS.TRIGGER_TYPE_DEFS}
      storeKey="triggerTypeDefs"
      title="Trigger Type Defs"
      subtitle="Defines stat modifier trigger conditions. Falls back to built-ins when empty."
      addLabel="Add Trigger Type"
      fields={[
        { key: "label", type: "text", label: "Label", required: true, placeholder: "On Hit" },
        { key: "description", type: "textarea", label: "Description", placeholder: "Optional description…" },
      ]}
      defaultValues={{ label: "", description: "" }}
      deleteWarning="This cannot be undone."
    />
  );
}
