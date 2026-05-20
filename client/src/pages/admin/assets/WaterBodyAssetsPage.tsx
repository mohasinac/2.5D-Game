// [ADMIN-PAGE] WaterBodyAssetsPage — manage water, lava, sand, and ice surface textures.

import { AssetCrudPage } from "@/components/admin/AssetCrudPage";
import { COLLECTIONS } from "@/lib/firebase";

const LIQUID_TYPES = ["water", "lava", "sand", "ice", "acid", "mud", "oil"];

export function WaterBodyAssetsPage() {
  return (
    <AssetCrudPage
      collectionName={COLLECTIONS.WATER_BODY_ASSETS}
      title="Water Body Textures"
      icon="💧"
      description="Surface textures for water bodies (water, lava, sand, ice, etc.). Upload 256×256px seamless tiling PNG."
      tags={LIQUID_TYPES}
      tagLabel="Liquid Type"
    />
  );
}
