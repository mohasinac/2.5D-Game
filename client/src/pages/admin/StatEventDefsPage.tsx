import { COLLECTIONS } from "@/lib/firebase";
import { SimpleDefsCrudPage } from "@/components/admin/SimpleDefsCrudPage";

export function StatEventDefsPage() {
  return (
    <SimpleDefsCrudPage
      collectionId={COLLECTIONS.STAT_EVENT_DEFS}
      storeKey="statEventDefs"
      title="Stat Event Defs"
      subtitle="Defines stat tracking events. Falls back to built-ins when empty."
      addLabel="Add Stat Event"
      fields={[
        { key: "label", type: "text", label: "Label", required: true, placeholder: "Collision" },
        { key: "description", type: "textarea", label: "Description", placeholder: "Optional description…" },
      ]}
      defaultValues={{ label: "", description: "" }}
      deleteWarning="This cannot be undone."
    />
  );
}
