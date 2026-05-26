import { COLLECTIONS } from "@/lib/firebase";
import { SimpleDefsCrudPage } from "@/components/admin/SimpleDefsCrudPage";

export function FeatureAnimationDefsPage() {
  return (
    <SimpleDefsCrudPage
      collectionId={COLLECTIONS.FEATURE_ANIMATION_DEFS}
      storeKey="featureAnimationDefs"
      title="Feature Animation Defs"
      subtitle="Defines feature animation presets. Falls back to built-ins when empty."
      addLabel="Add Animation"
      fields={[
        { key: "label", type: "text", label: "Label", required: true, placeholder: "Pulse" },
        { key: "description", type: "textarea", label: "Description", placeholder: "Optional description…" },
      ]}
      defaultValues={{ label: "", description: "" }}
      deleteWarning="This cannot be undone. Features using this animation ID will fall back to displaying the raw ID."
    />
  );
}
