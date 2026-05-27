import { COLLECTIONS } from "@/lib/firebase";
import { SimpleDefsCrudPage } from "@/components/admin/SimpleDefsCrudPage";

export function GimmickSynergiesPage() {
  return (
    <SimpleDefsCrudPage
      collectionId={COLLECTIONS.GIMMICK_SYNERGIES}
      storeKey="gimmickSynergies"
      title="Gimmick × Part Material Synergies"
      subtitle="Synergy bonuses applied when a specific gimmick mechanic is active on a bey with a matching tip/part material. Force multiplier stacks with the base gimmick effect."
      addLabel="Add Synergy"
      fields={[
        { key: "gimmickId",    type: "text",     label: "Gimmick ID",    required: true,  placeholder: "magnacore_attract" },
        { key: "materialId",   type: "text",     label: "Material ID",   required: true,  placeholder: "rubber" },
        { key: "modifierType", type: "text", label: "Modifier Type", required: true, placeholder: "force_multiplier | spin_bonus | cooldown_reduction" },
        { key: "value",        type: "number",   label: "Value",         placeholder: "1.5 (multiplier or additive bonus)" },
        { key: "description",  type: "textarea", label: "Description",   placeholder: "What this synergy does in plain language…" },
      ]}
      defaultValues={{
        gimmickId: "",
        materialId: "",
        modifierType: "force_multiplier",
        value: 1.0,
        description: "",
      }}
      deleteWarning="Deleting this synergy removes the bonus immediately for any active matches (on next onCreate)."
    />
  );
}
