import { drawShape, type ShapeName } from "./shapeDrawers";

export function generateIconDataUrl(
  color: string,
  shape: ShapeName,
): string {
  const size = 16;
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d")!;

  ctx.fillStyle = "#222";
  ctx.fillRect(0, 0, size, size);

  drawShape(ctx, shape, size / 2, size / 2, 12, color);

  return canvas.toDataURL("image/png");
}
