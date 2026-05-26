import { COLLECTIONS } from "@/lib/firebase";
import { SimpleDefsCrudPage } from "@/components/admin/SimpleDefsCrudPage";

export function ElementStatDefsPage() {
  return (
    <SimpleDefsCrudPage
      collectionId={COLLECTIONS.ELEMENT_STAT_DEFS}
      storeKey="elementStatDefs"
      title="Element Stat Defs"
      subtitle="Defines element stat modifier suggestions. Falls back to built-ins when empty."
      addLabel="Add Stat"
      fields={[
        { key: "label", type: "text", label: "Label", required: true, placeholder: "Spin Decay Rate" },
        { key: "category", type: "text", label: "Category", placeholder: "beyblade / arena / combat" },
        { key: "description", type: "textarea", label: "Description", placeholder: "Optional description…" },
      ]}
      defaultValues={{ label: "", category: "", description: "" }}
      deleteWarning="This cannot be undone. Elements using this stat ID will fall back to displaying the raw ID."
    />
  );
}
