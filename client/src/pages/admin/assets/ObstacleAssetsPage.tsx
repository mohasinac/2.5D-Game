// [ADMIN-PAGE] ObstacleAssetsPage — manage obstacle sprites (rocks, pillars, barriers, walls).

import { AssetCrudPage } from "@/components/admin/AssetCrudPage";
import { COLLECTIONS } from "@/lib/firebase";

const OBSTACLE_TYPES = ["rock", "pillar", "barrier", "wall", "crystal", "box", "tire"];

export function ObstacleAssetsPage() {
  return (
    <AssetCrudPage
      collectionName={COLLECTIONS.OBSTACLE_ASSETS}
      title="Obstacle Sprites"
      icon="🪨"
      description="Sprites for arena obstacles. Upload 128×128px PNG with transparent background."
      tags={OBSTACLE_TYPES}
      tagLabel="Obstacle Type"
    />
  );
}
