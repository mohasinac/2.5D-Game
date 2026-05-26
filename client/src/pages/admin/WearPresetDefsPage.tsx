import { COLLECTIONS } from "@/lib/firebase";
import { SimpleDefsCrudPage } from "@/components/admin/SimpleDefsCrudPage";

export function WearPresetDefsPage() {
  return (
    <SimpleDefsCrudPage
      collectionId={COLLECTIONS.WEAR_PRESET_DEFS}
      storeKey="wearPresetDefs"
      title="Wear Preset Defs"
      subtitle="Defines material wear curve presets. Steps field is JSON: [{atSecond, wearLevel}, ...]. Falls back to built-ins when empty."
      addLabel="Add Wear Preset"
      fields={[
        { key: "label", type: "text", label: "Label", required: true, placeholder: "No wear" },
        { key: "description", type: "textarea", label: "Description", placeholder: "Optional description…" },
        { key: "steps", type: "textarea", label: "Steps (JSON)", placeholder: '[{"atSecond":0,"wearLevel":100},{"atSecond":180,"wearLevel":50}]' },
      ]}
      defaultValues={{ label: "", description: "", steps: "[]" }}
      deleteWarning="This cannot be undone. Parts using this wear preset ID will fall back to displaying the raw ID."
    />
  );
}
