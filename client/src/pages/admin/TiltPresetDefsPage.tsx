import { COLLECTIONS } from "@/lib/firebase";
import { SimpleDefsCrudPage } from "@/components/admin/SimpleDefsCrudPage";

export function TiltPresetDefsPage() {
  return (
    <SimpleDefsCrudPage
      collectionId={COLLECTIONS.TILT_PRESET_DEFS}
      storeKey="tiltPresetDefs"
      title="Tilt Preset Defs"
      subtitle="Defines tilt angle presets for arena configuration. Falls back to built-ins when empty."
      addLabel="Add Tilt Preset"
      fields={[
        { key: "label", type: "text", label: "Label", required: true, placeholder: "Flat" },
        { key: "angle", type: "number", label: "Angle", min: 0, max: 360, step: 1, placeholder: "0" },
        { key: "description", type: "textarea", label: "Description", placeholder: "Optional description…" },
      ]}
      defaultValues={{ label: "", angle: 0, description: "" }}
      deleteWarning="This cannot be undone. Arenas using this tilt preset ID will fall back to displaying the raw ID."
    />
  );
}
