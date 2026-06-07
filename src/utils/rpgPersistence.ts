import { svgAssetStore } from '../rpg/stores/SVGAssetStore.ts';

export function saveAllRPGAssets(): void {
  svgAssetStore.save();
}

export function loadAllRPGAssets(): boolean {
  svgAssetStore.load();
  return true;
}

export function clearAllRPGAssets(): void {
  svgAssetStore.clear();
  svgAssetStore.save();
}

export function exportRPGAssets(): string {
  return svgAssetStore.serialize();
}

export function importRPGAssets(json: string): boolean {
  try {
    svgAssetStore.deserialize(json);
    svgAssetStore.save();
    return true;
  } catch { return false; }
}
