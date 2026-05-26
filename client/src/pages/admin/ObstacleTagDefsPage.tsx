import { COLLECTIONS } from "@/lib/firebase";
import { SimpleDefsCrudPage } from "@/components/admin/SimpleDefsCrudPage";

export function ObstacleTagDefsPage() {
  return (
    <SimpleDefsCrudPage
      collectionId={COLLECTIONS.OBSTACLE_TAG_DEFS}
      storeKey="obstacleTagDefs"
      title="Obstacle Tag Defs"
      subtitle="Defines obstacle asset type tags. Falls back to built-ins when empty."
      addLabel="Add Tag"
      fields={[
        { key: "label", type: "text", label: "Label", required: true, placeholder: "Rock" },
        { key: "description", type: "textarea", label: "Description", placeholder: "Optional description…" },
      ]}
      defaultValues={{ label: "", description: "" }}
      deleteWarning="This cannot be undone. Obstacles using this tag ID will fall back to displaying the raw ID."
    />
  );
}
