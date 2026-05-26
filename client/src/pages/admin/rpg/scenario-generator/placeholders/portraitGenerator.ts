import { drawShape, type ShapeName } from "./shapeDrawers";

export function generatePortraitDataUrl(
  color: string,
  shape: ShapeName,
  name: string,
): string {
  const size = 64;
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d")!;

  ctx.fillStyle = "#1a1a2e";
  ctx.fillRect(0, 0, size, size);

  drawShape(ctx, shape, size / 2, size / 2, 44, color);

  ctx.fillStyle = "white";
  ctx.font = "bold 16px monospace";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(name.slice(0, 2).toUpperCase(), size / 2, size / 2);

  ctx.strokeStyle = "rgba(255,255,255,0.3)";
  ctx.lineWidth = 2;
  ctx.strokeRect(1, 1, size - 2, size - 2);

  return canvas.toDataURL("image/png");
}
