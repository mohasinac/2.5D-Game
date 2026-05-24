// [ADMIN-PAGE] BitBeastAssetsPage — manage BitBeast overlay GIFs/PNGs per beyblade type.

import { AssetCrudPage } from "@/components/admin/AssetCrudPage";
import { COLLECTIONS } from "@/lib/firebase";

const BEY_TYPES = ["attack", "defense", "stamina", "balanced", "universal"];

export function BitBeastAssetsPage() {
  return (
    <AssetCrudPage
      collectionName={COLLECTIONS.BITBEAST_ASSETS}
      title="BitBeast Assets"
      icon="🐉"
      description="BitBeast overlay GIFs and PNGs shown on special-move activation. GIF uploads preserve animation. Tag by beyblade type."
      tags={BEY_TYPES}
      tagLabel="Type"
      acceptTypes="image/png,image/jpeg,image/gif,image/webp"
    />
  );
}
