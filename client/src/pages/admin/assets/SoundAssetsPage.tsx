// [ADMIN-PAGE] SoundAssetsPage — manage sound effects and music.

import { AssetCrudPage } from "@/components/admin/AssetCrudPage";
import { COLLECTIONS } from "@/lib/firebase";

const SOUND_TAGS = [
  "hit-light", "hit-heavy", "spin-out", "special-attack", "special-defense", "special-stamina",
  "water-splash", "arena-ambient", "ui-select", "ui-confirm", "countdown", "victory", "defeat",
];

export function SoundAssetsPage() {
  return (
    <AssetCrudPage
      collectionName={COLLECTIONS.SOUND_ASSETS}
      title="Sound Effects"
      icon="🔊"
      description="Sound effects and music for the game. Upload MP3 or OGG files."
      acceptTypes="audio/*"
      isAudio={true}
      tags={SOUND_TAGS}
      tagLabel="Sound Category"
    />
  );
}
