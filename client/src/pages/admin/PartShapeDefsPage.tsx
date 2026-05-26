import { COLLECTIONS } from "@/lib/firebase";
import { SimpleDefsCrudPage } from "@/components/admin/SimpleDefsCrudPage";

export function PartShapeDefsPage() {
  return (
    <SimpleDefsCrudPage
      collectionId={COLLECTIONS.PART_SHAPE_DEFS}
      storeKey="partShapeDefs"
      title="Part Shape Defs"
      subtitle="Defines part outline shape presets. Falls back to built-ins when empty."
      addLabel="Add Shape"
      fields={[
        { key: "label", type: "text", label: "Label", required: true, placeholder: "Circle" },
        { key: "icon", type: "text", label: "Icon", placeholder: "Icon character" },
        { key: "description", type: "textarea", label: "Description", placeholder: "Optional description…" },
      ]}
      defaultValues={{ label: "", icon: "", description: "" }}
      deleteWarning="This cannot be undone. Parts using this shape ID will fall back to displaying the raw ID."
      renderItemMeta={(item) => item.icon ? (
        <span className="text-lg">{String(item.icon)}</span>
      ) : null}
    />
  );
}
