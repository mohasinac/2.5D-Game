import { COLLECTIONS } from "@/lib/firebase";
import { SimpleDefsCrudPage } from "@/components/admin/SimpleDefsCrudPage";

export function StatusConditionDefsPage() {
  return (
    <SimpleDefsCrudPage
      collectionId={COLLECTIONS.STATUS_CONDITION_DEFS}
      storeKey="statusConditionDefs"
      title="Status Condition Defs"
      subtitle="Element-based status effects applied when beyblades pass through hazard zones. Server applies effects referenced by elementTypes[]."
      addLabel="Add Status Condition"
      fields={[
        { key: "name",          type: "text",     label: "Name",            required: true, placeholder: "Burning" },
        { key: "elementTypes",  type: "text",     label: "Element Types (comma-separated)", placeholder: "lava, fire" },
        { key: "durationS",     type: "number",   label: "Duration (seconds)", placeholder: "5" },
        { key: "effectDescription", type: "textarea", label: "Effect Description", placeholder: "Spin decays 20% faster for the duration." },
        { key: "particlePresetId",  type: "text", label: "Particle Preset ID", placeholder: "flame_aura" },
        { key: "iconEmoji",     type: "text",     label: "Icon Emoji",      placeholder: "🔥" },
      ]}
      defaultValues={{
        name: "",
        elementTypes: "",
        durationS: 5,
        effectDescription: "",
        particlePresetId: "",
        iconEmoji: "❓",
      }}
      deleteWarning="Deleting this status def does not affect currently active conditions in running matches."
    />
  );
}
