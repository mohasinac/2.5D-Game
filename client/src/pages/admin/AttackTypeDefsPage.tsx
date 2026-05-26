import { COLLECTIONS } from "@/lib/firebase";
import { SimpleDefsCrudPage } from "@/components/admin/SimpleDefsCrudPage";

export function AttackTypeDefsPage() {
  return (
    <SimpleDefsCrudPage
      collectionId={COLLECTIONS.ATTACK_TYPE_DEFS}
      storeKey="attackTypeDefs"
      title="Attack Type Defs"
      subtitle="Defines attack types for contact points. Falls back to built-ins when empty."
      addLabel="Add Attack Type"
      fields={[
        { key: "label", type: "text", label: "Label", required: true, placeholder: "Smash Attack" },
        { key: "description", type: "textarea", label: "Description", placeholder: "Optional description…" },
        { key: "multiplier", type: "number", label: "Damage Multiplier", min: 0, max: 5, step: 0.05, placeholder: "1.0" },
        { key: "color", type: "color", label: "Color" },
      ]}
      defaultValues={{ label: "", description: "", multiplier: 1.0, color: "#3b82f6" }}
      deleteWarning="This cannot be undone. Parts using this attack type ID will fall back to displaying the raw ID."
      renderItemMeta={(item) => item.multiplier != null ? (
        <span className="text-[11px] text-theme-muted font-normal">×{Number(item.multiplier).toFixed(2)}</span>
      ) : null}
    />
  );
}
