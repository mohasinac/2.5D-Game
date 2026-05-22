// [ADMIN-PAGE] ArenaThemeAssetsPage — manage background textures per arena theme.

import { AssetCrudPage } from "@/components/admin/AssetCrudPage";
import { COLLECTIONS } from "@/lib/firebase";

const THEMES = ["metrocity", "forest", "mountains", "grasslands", "desert", "sea", "futuristic", "prehistoric", "safari", "riverbank", "switch"];

export function ArenaThemeAssetsPage() {
  return (
    <AssetCrudPage
      collectionName={COLLECTIONS.ARENA_THEME_ASSETS}
      title="Arena Theme Textures"
      icon="🎨"
      description="Background floor textures for each arena theme. Upload 1080×1080px PNG or JPG images."
      tags={THEMES}
      tagLabel="Theme"
    />
  );
}
