import { COLLECTIONS } from "@/lib/firebase";
import { SimpleDefsCrudPage } from "@/components/admin/SimpleDefsCrudPage";

export function CoreGimmickDefsPage() {
  return (
    <SimpleDefsCrudPage
      collectionId={COLLECTIONS.CORE_GIMMICK_DEFS}
      storeKey="coreGimmicks"
      title="Core Gimmick Defs"
      subtitle="Defines gimmick modes available for Core parts. Falls back to built-ins when empty."
      addLabel="Add Gimmick"
      fields={[
        { key: "label", type: "text", label: "Label", required: true, placeholder: "Mode Change" },
        { key: "description", type: "textarea", label: "Description", placeholder: "Optional description…" },
        { key: "hasPhysicsImpl", type: "checkbox", label: "Has physics implementation", description: "enables in-game physics behavior" },
      ]}
      defaultValues={{ label: "", description: "", hasPhysicsImpl: false }}
      deleteWarning="This cannot be undone. Parts using this gimmick ID will fall back to displaying the raw ID."
      renderItemMeta={(item) => item.hasPhysicsImpl ? (
        <span className="text-[10px] px-1.5 py-0.5 bg-blue-13 text-theme-blue border border-blue-30 rounded font-medium">Physics</span>
      ) : null}
    />
  );
}
