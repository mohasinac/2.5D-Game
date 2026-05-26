// [ADMIN-PAGE] BitBeastAssetsPage — manage BitBeast overlay GIFs/PNGs per beyblade type.

import { AssetCrudPage } from "@/components/admin/AssetCrudPage";
import { COLLECTIONS } from "@/lib/firebase";
import { useDefsDocs } from "@/hooks/useDefsDocs";

const FALLBACK_BEY_TYPES = ["attack", "defense", "stamina", "balanced", "universal"];

export function BitBeastAssetsPage() {
  const beyTypeDocs = useDefsDocs(COLLECTIONS.BEY_TYPE_DEFS);
  const beyTypes = beyTypeDocs.length > 0 ? beyTypeDocs.map(d => d.id) : FALLBACK_BEY_TYPES;

  return (
    <AssetCrudPage
      collectionName={COLLECTIONS.BITBEAST_ASSETS}
      title="BitBeast Assets"
      icon="🐉"
      description="BitBeast overlay GIFs and PNGs shown on special-move activation. GIF uploads preserve animation. Tag by beyblade type."
      tags={beyTypes}
      tagLabel="Type"
      acceptTypes="image/png,image/jpeg,image/gif,image/webp"
    />
  );
}
