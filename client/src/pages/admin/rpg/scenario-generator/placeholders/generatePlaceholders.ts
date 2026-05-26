import type { ScenarioInput, PlaceholderShape } from "../parser/types";
import { generateTilesetDataUrl } from "./tilesetGenerator";
import { generateSpriteDataUrl } from "./spriteGenerator";
import { generatePortraitDataUrl } from "./portraitGenerator";
import { generateIconDataUrl } from "./iconGenerator";

export interface PlaceholderAssets {
  tilesetDataUrl: string;
  sprites: Record<string, string>;
  portraits: Record<string, string>;
  badgeIcons: Record<string, string>;
  itemIcons: Record<string, string>;
}

const DEFAULT_COLORS = [
  "#e74c3c", "#3498db", "#2ecc71", "#f39c12", "#9b59b6",
  "#1abc9c", "#e67e22", "#e91e63", "#00bcd4", "#8bc34a",
];

function pickColor(index: number, explicit?: string): string {
  return explicit ?? DEFAULT_COLORS[index % DEFAULT_COLORS.length];
}

function pickShape(index: number, explicit?: PlaceholderShape): PlaceholderShape {
  const shapes: PlaceholderShape[] = ["circle", "diamond", "triangle", "square", "star", "hexagon"];
  return explicit ?? shapes[index % shapes.length];
}

export function generatePlaceholders(input: ScenarioInput): PlaceholderAssets {
  const tilesetDataUrl = generateTilesetDataUrl();

  const sprites: Record<string, string> = {};
  const portraits: Record<string, string> = {};
  for (let i = 0; i < (input.characters ?? []).length; i++) {
    const ch = input.characters![i];
    const color = pickColor(i, ch.color);
    const shape = pickShape(i, ch.shape);
    sprites[ch.id] = generateSpriteDataUrl(color, shape, ch.name);
    portraits[ch.id] = generatePortraitDataUrl(color, shape, ch.name);
  }

  const badgeIcons: Record<string, string> = {};
  for (let i = 0; i < (input.badges ?? []).length; i++) {
    const b = input.badges![i];
    const color = pickColor(i + 5, b.color);
    const shape = pickShape(i + 2, b.shape);
    badgeIcons[b.id] = generateIconDataUrl(color, shape);
  }

  const itemIcons: Record<string, string> = {};
  for (let i = 0; i < (input.items ?? []).length; i++) {
    const it = input.items![i];
    const color = pickColor(i + 3, it.color);
    const shape = pickShape(i + 4, it.shape);
    itemIcons[it.id] = generateIconDataUrl(color, shape);
  }

  return { tilesetDataUrl, sprites, portraits, badgeIcons, itemIcons };
}
