import { COLLECTIONS } from "@/lib/firebase";
import { SimpleDefsCrudPage } from "@/components/admin/SimpleDefsCrudPage";

export function TipShapeDefsPage() {
  return (
    <SimpleDefsCrudPage
      collectionId={COLLECTIONS.TIP_SHAPE_DEFS}
      storeKey="tipShapes"
      title="Tip Shape Defs"
      subtitle="Defines tip shapes available in the part editor. Falls back to built-ins when empty."
      addLabel="Add Shape"
      fields={[
        { key: "label", type: "text", label: "Label", required: true, placeholder: "Rubber Flat" },
        { key: "description", type: "textarea", label: "Description", placeholder: "Optional description…" },
      ]}
      defaultValues={{ label: "", description: "" }}
      deleteWarning="This cannot be undone. Parts using this shape ID will fall back to displaying the raw ID."
    />
  );
}
