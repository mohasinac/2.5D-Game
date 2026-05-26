// [ADMIN-PAGE] WaterBodyAssetsPage — manage water, lava, sand, and ice surface textures.

import { AssetCrudPage } from "@/components/admin/AssetCrudPage";
import { COLLECTIONS } from "@/lib/firebase";
import { useDefsDocs } from "@/hooks/useDefsDocs";

const FALLBACK_LIQUID_TYPES = ["water", "lava", "sand", "ice", "acid", "mud", "oil", "switch"];

export function WaterBodyAssetsPage() {
  const liquidTypeDocs = useDefsDocs(COLLECTIONS.LIQUID_TYPE_DEFS);
  const liquidTypes = liquidTypeDocs.length > 0 ? liquidTypeDocs.map(d => d.id) : FALLBACK_LIQUID_TYPES;

  return (
    <AssetCrudPage
      collectionName={COLLECTIONS.WATER_BODY_ASSETS}
      title="Water Body Textures"
      icon="💧"
      description="Surface textures for water bodies (water, lava, sand, ice, etc.). Upload 256×256px seamless tiling PNG."
      tags={liquidTypes}
      tagLabel="Liquid Type"
    />
  );
}
