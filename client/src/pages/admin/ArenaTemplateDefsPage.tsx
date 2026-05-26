import { COLLECTIONS } from "@/lib/firebase";
import { SimpleDefsCrudPage } from "@/components/admin/SimpleDefsCrudPage";

export function ArenaTemplateDefsPage() {
  return (
    <SimpleDefsCrudPage
      collectionId={COLLECTIONS.ARENA_TEMPLATE_DEFS}
      storeKey="arenaTemplateDefs"
      title="Arena Template Defs"
      subtitle="Defines full arena configuration templates. Config field is JSON. Falls back to built-ins when empty."
      addLabel="Add Template"
      fields={[
        { key: "label", type: "text", label: "Label", required: true, placeholder: "Classic" },
        { key: "description", type: "textarea", label: "Description", placeholder: "Optional description…" },
        { key: "config", type: "textarea", label: "Config (JSON)", placeholder: '{"shape":"circle","width":1080,"height":1080}' },
      ]}
      defaultValues={{ label: "", description: "", config: "{}" }}
      deleteWarning="This cannot be undone. References to this template ID will fall back to displaying the raw ID."
    />
  );
}
