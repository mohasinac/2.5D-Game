import type Phaser from 'phaser';
import { svgAssetStore } from '../stores/SVGAssetStore.ts';

const SVG_SCALE = 2;

function toDataUrl(base64: string): string {
  return `data:image/svg+xml;base64,${base64}`;
}

export class SVGAssetLoader {
  static loadAll(scene: Phaser.Scene): void {
    svgAssetStore.getAllSprites().forEach(sprite => {
      if (!sprite.svgBase64) return;
      scene.load.svg(sprite.id, toDataUrl(sprite.svgBase64), { scale: SVG_SCALE });
    });

    svgAssetStore.getAllTilesets().forEach(tileset => {
      if (!tileset.svgBase64) return;
      scene.load.svg(tileset.id, toDataUrl(tileset.svgBase64), { scale: SVG_SCALE });
    });
  }

  static getSpriteFrameConfig(spriteId: string): Phaser.Types.Loader.FileTypes.SVGFileConfig | null {
    const sprite = svgAssetStore.getSprite(spriteId);
    if (!sprite) return null;
    return { key: sprite.id, url: toDataUrl(sprite.svgBase64), svgConfig: { scale: SVG_SCALE } };
  }
}
