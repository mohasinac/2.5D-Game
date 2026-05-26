import { COLLECTIONS } from "@/lib/firebase";
import { SimpleDefsCrudPage } from "@/components/admin/SimpleDefsCrudPage";

export function PortalColorDefsPage() {
  return (
    <SimpleDefsCrudPage
      collectionId={COLLECTIONS.PORTAL_COLOR_DEFS}
      storeKey="portalColorDefs"
      title="Portal Color Defs"
      subtitle="Defines portal color presets for arena portals. Falls back to built-ins when empty."
      addLabel="Add Portal Color"
      fields={[
        { key: "label", type: "text", label: "Label", required: true, placeholder: "Purple" },
        { key: "color", type: "color", label: "Color" },
        { key: "sortOrder", type: "number", label: "Sort Order", min: 0, max: 99, step: 1, placeholder: "0" },
        { key: "description", type: "textarea", label: "Description", placeholder: "Optional description…" },
      ]}
      defaultValues={{ label: "", color: "#a855f7", sortOrder: 0, description: "" }}
      deleteWarning="This cannot be undone. Portals using this color ID will fall back to displaying the raw ID."
      renderItemMeta={(item) => item.color ? (
        <span className="inline-block w-3 h-3 rounded-full" style={{ backgroundColor: String(item.color) }} />
      ) : null}
    />
  );
}
