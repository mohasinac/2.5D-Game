import { svgAssetStore } from '../rpg/stores/SVGAssetStore.ts';
import { LS_ASSETS } from '../rpg/config/rpgConstants.ts';

export function saveAllRPGAssets(): void {
  svgAssetStore.save();
}

export function loadAllRPGAssets(): boolean {
  const raw = localStorage.getItem(LS_ASSETS);
  if (!raw) return false;
  svgAssetStore.deserialize(raw);
  return true;
}

export function clearAllRPGAssets(): void {
  svgAssetStore.clear();
  localStorage.removeItem(LS_ASSETS);
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
