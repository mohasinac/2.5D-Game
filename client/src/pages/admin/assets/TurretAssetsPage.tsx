// [ADMIN-PAGE] TurretAssetsPage — manage turret and projectile sprites.

import { AssetCrudPage } from "@/components/admin/AssetCrudPage";
import { COLLECTIONS } from "@/lib/firebase";

const TURRET_TAGS = ["turret-bullet", "turret-laser", "turret-boomerang", "projectile-bullet", "projectile-laser", "projectile-boomerang"];

export function TurretAssetsPage() {
  return (
    <AssetCrudPage
      collectionName={COLLECTIONS.TURRET_ASSETS}
      title="Turret Sprites"
      icon="🔫"
      description="Turret body and projectile sprites. Upload 64×64px PNG with transparent background."
      tags={TURRET_TAGS}
      tagLabel="Turret/Projectile Type"
    />
  );
}
