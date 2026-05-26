// [ADMIN-PAGE] ObstacleAssetsPage — manage obstacle sprites (rocks, pillars, barriers, walls).

import { AssetCrudPage } from "@/components/admin/AssetCrudPage";
import { COLLECTIONS } from "@/lib/firebase";
import { useDefsDocs } from "@/hooks/useDefsDocs";

const FALLBACK_OBSTACLE_TYPES = ["rock", "pillar", "barrier", "wall", "crystal", "box", "tire", "switch", "bump", "spin-zone", "gravity-well"];

export function ObstacleAssetsPage() {
  const obstacleTagDocs = useDefsDocs(COLLECTIONS.OBSTACLE_TAG_DEFS);
  const obstacleTypes = obstacleTagDocs.length > 0 ? obstacleTagDocs.map(d => d.id) : FALLBACK_OBSTACLE_TYPES;

  return (
    <AssetCrudPage
      collectionName={COLLECTIONS.OBSTACLE_ASSETS}
      title="Obstacle Sprites"
      icon="🪨"
      description="Sprites for arena obstacles. Upload 128×128px PNG with transparent background."
      tags={obstacleTypes}
      tagLabel="Obstacle Type"
    />
  );
}
