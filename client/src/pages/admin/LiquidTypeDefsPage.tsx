import { COLLECTIONS } from "@/lib/firebase";
import { SimpleDefsCrudPage } from "@/components/admin/SimpleDefsCrudPage";

export function LiquidTypeDefsPage() {
  return (
    <SimpleDefsCrudPage
      collectionId={COLLECTIONS.LIQUID_TYPE_DEFS}
      storeKey="liquidTypeDefs"
      title="Liquid Type Defs"
      subtitle="Defines liquid/water body type presets with effects. Effects field is JSON. Falls back to built-ins when empty."
      addLabel="Add Liquid Type"
      fields={[
        { key: "label", type: "text", label: "Label", required: true, placeholder: "Water" },
        { key: "color", type: "color", label: "Color" },
        { key: "opacity", type: "number", label: "Opacity", min: 0, max: 1, step: 0.05, placeholder: "0.5" },
        { key: "description", type: "textarea", label: "Description", placeholder: "Optional description…" },
        { key: "effects", type: "textarea", label: "Effects (JSON)", placeholder: '{"speedLoss":0.3,"frictionMultiplier":1.5}' },
      ]}
      defaultValues={{ label: "", color: "#3b82f6", opacity: 0.5, description: "", effects: "{}" }}
      deleteWarning="This cannot be undone. Water bodies using this liquid type ID will fall back to displaying the raw ID."
    />
  );
}
