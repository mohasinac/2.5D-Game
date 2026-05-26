import { COLLECTIONS } from "@/lib/firebase";
import { SimpleDefsCrudPage } from "@/components/admin/SimpleDefsCrudPage";

export function RPGTriggerModeDefsPage() {
  return (
    <SimpleDefsCrudPage
      collectionId={COLLECTIONS.RPG_TRIGGER_MODE_DEFS}
      storeKey="rpgTriggerModeDefs"
      title="RPG Trigger Mode Defs"
      subtitle="Defines RPG event trigger modes. Falls back to built-ins when empty."
      addLabel="Add Trigger Mode"
      fields={[
        { key: "label", type: "text", label: "Label", required: true, placeholder: "Enter" },
        { key: "description", type: "textarea", label: "Description", placeholder: "Optional description…" },
      ]}
      defaultValues={{ label: "", description: "" }}
      deleteWarning="This cannot be undone. RPG events using this trigger mode ID will fall back to displaying the raw ID."
    />
  );
}
