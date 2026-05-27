import { COLLECTIONS } from "@/lib/firebase";
import { SimpleDefsCrudPage } from "@/components/admin/SimpleDefsCrudPage";

export function BoostPadDefsPage() {
  return (
    <SimpleDefsCrudPage
      collectionId={COLLECTIONS.BOOST_PAD_DEFS}
      storeKey="boostPadDefs"
      title="Boost Pad Defs"
      subtitle="F-Zero GBA style directional speed strips. Place these in an arena config's boostPads[] array to activate them."
      addLabel="Add Boost Pad"
      fields={[
        { key: "name",          type: "text",   label: "Name",            required: true, placeholder: "Speed Strip Alpha" },
        { key: "angleDeg",      type: "range",  label: "Direction (°)",   min: 0, max: 359, step: 1, unit: "°" },
        { key: "forceMagnitude",type: "number", label: "Force Magnitude", placeholder: "0.015" },
        { key: "width_cm",      type: "number", label: "Width (cm)",      placeholder: "15" },
        { key: "height_cm",     type: "number", label: "Height (cm)",     placeholder: "6" },
        { key: "cooldownMs",    type: "number", label: "Cooldown (ms)",   placeholder: "500" },
        { key: "description",   type: "textarea", label: "Description",   placeholder: "Optional description…" },
      ]}
      defaultValues={{
        name: "",
        angleDeg: 0,
        forceMagnitude: 0.015,
        width_cm: 15,
        height_cm: 6,
        cooldownMs: 500,
        description: "",
      }}
      deleteWarning="This removes the boost pad definition. Update any arena configs that reference it."
    />
  );
}
