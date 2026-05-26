import { COLLECTIONS } from "@/lib/firebase";
import { SimpleDefsCrudPage } from "@/components/admin/SimpleDefsCrudPage";

export function BowlProfileDefsPage() {
  return (
    <SimpleDefsCrudPage
      collectionId={COLLECTIONS.BOWL_PROFILE_DEFS}
      storeKey="bowlProfileDefs"
      title="Bowl Profile Defs"
      subtitle="Defines bowl wall-angle profiles for arenas. Falls back to built-ins when empty."
      addLabel="Add Profile"
      fields={[
        { key: "label", type: "text", label: "Label", required: true, placeholder: "Standard Bowl" },
        { key: "wallAngle", type: "range", label: "Wall Angle", min: 0, max: 75, step: 1, unit: "°" },
        { key: "description", type: "textarea", label: "Description", placeholder: "Optional description…" },
      ]}
      defaultValues={{ label: "", wallAngle: 30, description: "" }}
      deleteWarning="This cannot be undone. Arenas using this bowl profile ID will fall back to the default."
      renderItemMeta={(item) => (
        <>
          <span className="text-xs text-theme-muted font-normal">{Number(item.wallAngle ?? 0)}°</span>
        </>
      )}
    />
  );
}
