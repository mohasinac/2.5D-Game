import { drawShape, type ShapeName } from "./shapeDrawers";

export function generateSpriteDataUrl(
  color: string,
  shape: ShapeName,
  label: string,
): string {
  const frameW = 16;
  const frameH = 16;
  const cols = 3;
  const rows = 4;
  const canvas = document.createElement("canvas");
  canvas.width = frameW * cols;
  canvas.height = frameH * rows;
  const ctx = canvas.getContext("2d")!;

  const directions = ["down", "left", "right", "up"];

  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      const x = col * frameW;
      const y = row * frameH;
      const cx = x + frameW / 2;
      const cy = y + frameH / 2;

      const walkOffset = col === 1 ? -1 : col === 2 ? 1 : 0;

      drawShape(ctx, shape, cx + walkOffset, cy, 12, color);

      ctx.fillStyle = "rgba(255,255,255,0.8)";
      ctx.font = "bold 5px monospace";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(label.slice(0, 2).toUpperCase(), cx + walkOffset, cy);

      const dir = directions[row];
      ctx.fillStyle = "white";
      switch (dir) {
        case "down":
          ctx.fillRect(cx - 1 + walkOffset, cy + 4, 2, 2);
          break;
        case "up":
          ctx.fillRect(cx - 1 + walkOffset, cy - 6, 2, 2);
          break;
        case "left":
          ctx.fillRect(cx - 6 + walkOffset, cy - 1, 2, 2);
          break;
        case "right":
          ctx.fillRect(cx + 4 + walkOffset, cy - 1, 2, 2);
          break;
      }
    }
  }

  return canvas.toDataURL("image/png");
}
