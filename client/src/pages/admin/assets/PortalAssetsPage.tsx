// [ADMIN-PAGE] PortalAssetsPage — manage portal ring and teleport effect sprites.

import { AssetCrudPage } from "@/components/admin/AssetCrudPage";
import { COLLECTIONS } from "@/lib/firebase";

const PORTAL_TAGS = ["portal-ring", "portal-entrance", "portal-exit", "teleport-effect", "switch"];

export function PortalAssetsPage() {
  return (
    <AssetCrudPage
      collectionName={COLLECTIONS.PORTAL_ASSETS}
      title="Portal Sprites"
      icon="🌀"
      description="Portal ring and teleport effect sprites. Upload 128×128px PNG with transparent background."
      tags={PORTAL_TAGS}
      tagLabel="Portal Element"
    />
  );
}
