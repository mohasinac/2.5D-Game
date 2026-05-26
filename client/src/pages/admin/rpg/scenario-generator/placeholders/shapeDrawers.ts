export type ShapeName = "circle" | "diamond" | "triangle" | "square" | "star" | "hexagon";

export function drawShape(
  ctx: CanvasRenderingContext2D,
  shape: ShapeName,
  cx: number,
  cy: number,
  size: number,
  color: string,
): void {
  ctx.fillStyle = color;
  ctx.beginPath();

  const r = size / 2;

  switch (shape) {
    case "circle":
      ctx.arc(cx, cy, r, 0, Math.PI * 2);
      break;

    case "diamond":
      ctx.moveTo(cx, cy - r);
      ctx.lineTo(cx + r, cy);
      ctx.lineTo(cx, cy + r);
      ctx.lineTo(cx - r, cy);
      break;

    case "triangle":
      ctx.moveTo(cx, cy - r);
      ctx.lineTo(cx + r, cy + r);
      ctx.lineTo(cx - r, cy + r);
      break;

    case "square":
      ctx.rect(cx - r, cy - r, size, size);
      break;

    case "star": {
      const outerR = r;
      const innerR = r * 0.4;
      for (let i = 0; i < 5; i++) {
        const outerAngle = (Math.PI * 2 * i) / 5 - Math.PI / 2;
        const innerAngle = outerAngle + Math.PI / 5;
        if (i === 0) ctx.moveTo(cx + outerR * Math.cos(outerAngle), cy + outerR * Math.sin(outerAngle));
        else ctx.lineTo(cx + outerR * Math.cos(outerAngle), cy + outerR * Math.sin(outerAngle));
        ctx.lineTo(cx + innerR * Math.cos(innerAngle), cy + innerR * Math.sin(innerAngle));
      }
      break;
    }

    case "hexagon":
      for (let i = 0; i < 6; i++) {
        const angle = (Math.PI * 2 * i) / 6 - Math.PI / 2;
        const px = cx + r * Math.cos(angle);
        const py = cy + r * Math.sin(angle);
        if (i === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      }
      break;
  }

  ctx.closePath();
  ctx.fill();
}
