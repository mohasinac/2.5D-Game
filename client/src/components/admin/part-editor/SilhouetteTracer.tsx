/**
 * SilhouetteTracer — extracts a closed polygon from a no-background PNG.
 *
 * Pipeline (all client-side, hidden canvas):
 *   1. Decode PNG into RGBA pixel data
 *   2. Threshold alpha channel → binary mask
 *   3. Marching squares → raw contour polygon
 *   4. Ramer–Douglas–Peucker simplification → simplified polygon
 *   5. Basic Bezier fit → BezierPath (cubic segments)
 *   6. Writes polygonCache (the simplified polygon) and segments into the output
 */

import type { BezierPath, BezierPathSegment } from "@/types/beybladeSystem";

// ── Step 1+2: rasterise image → binary mask ──────────────────────────────────
function imageToMask(
  imageUrl: string,
  maxDim = 256,
  alphaThreshold = 32,
): Promise<{ mask: Uint8Array; w: number; h: number }> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      const scale = Math.min(1, maxDim / Math.max(img.width, img.height));
      const w = Math.round(img.width * scale);
      const h = Math.round(img.height * scale);
      const canvas = document.createElement("canvas");
      canvas.width = w;
      canvas.height = h;
      const ctx = canvas.getContext("2d")!;
      ctx.drawImage(img, 0, 0, w, h);
      const data = ctx.getImageData(0, 0, w, h).data;
      const mask = new Uint8Array(w * h);
      for (let i = 0; i < w * h; i++) mask[i] = data[i * 4 + 3] >= alphaThreshold ? 1 : 0;
      resolve({ mask, w, h });
    };
    img.onerror = reject;
    img.src = imageUrl;
  });
}

// ── Step 3: marching squares → raw contour ────────────────────────────────────
function marchingSquares(mask: Uint8Array, w: number, h: number): Array<{ x: number; y: number }> {
  // Find a starting edge pixel
  let startX = -1, startY = -1;
  outer:
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      if (mask[y * w + x] === 1) { startX = x; startY = y; break outer; }
    }
  }
  if (startX === -1) return [];

  const contour: Array<{ x: number; y: number }> = [];
  const visited = new Set<string>();
  let cx = startX, cy = startY;

  // Simple boundary tracing (Moore neighbourhood)
  const dirs = [[1,0],[1,1],[0,1],[-1,1],[-1,0],[-1,-1],[0,-1],[1,-1]];
  let lastDir = 6; // start looking left-up

  for (let iter = 0; iter < w * h * 4; iter++) {
    contour.push({ x: cx, y: cy });
    const key = `${cx},${cy}`;
    if (visited.has(key) && iter > 2) break;
    visited.add(key);

    // Search for next boundary pixel starting from backtrack direction
    let found = false;
    for (let d = 0; d < 8; d++) {
      const di = (lastDir + 6 + d) % 8;
      const nx = cx + dirs[di][0];
      const ny = cy + dirs[di][1];
      if (nx >= 0 && ny >= 0 && nx < w && ny < h && mask[ny * w + nx] === 1) {
        lastDir = di;
        cx = nx; cy = ny;
        found = true;
        break;
      }
    }
    if (!found) break;
    if (cx === startX && cy === startY && iter > 3) break;
  }
  return contour;
}

// ── Step 4: Ramer–Douglas–Peucker simplification ─────────────────────────────
function rdp(points: Array<{ x: number; y: number }>, tolerance: number): Array<{ x: number; y: number }> {
  if (points.length <= 2) return points;
  const p0 = points[0], pn = points[points.length - 1];
  let maxDist = 0, maxIdx = 0;

  for (let i = 1; i < points.length - 1; i++) {
    const d = pointToSegmentDistance(points[i], p0, pn);
    if (d > maxDist) { maxDist = d; maxIdx = i; }
  }

  if (maxDist <= tolerance) return [p0, pn];
  return [...rdp(points.slice(0, maxIdx + 1), tolerance), ...rdp(points.slice(maxIdx), tolerance).slice(1)];
}

function pointToSegmentDistance(p: { x: number; y: number }, a: { x: number; y: number }, b: { x: number; y: number }): number {
  const dx = b.x - a.x, dy = b.y - a.y;
  if (dx === 0 && dy === 0) return Math.hypot(p.x - a.x, p.y - a.y);
  const t = Math.max(0, Math.min(1, ((p.x - a.x) * dx + (p.y - a.y) * dy) / (dx * dx + dy * dy)));
  return Math.hypot(p.x - (a.x + t * dx), p.y - (a.y + t * dy));
}

// ── Step 5: simple Bezier fit — straight line segments only ──────────────────
// (Control points left for BezierEditor to refine)
function polygonToBezierPath(polygon: Array<{ x: number; y: number }>, scale: number): BezierPath {
  const segments: BezierPathSegment[] = polygon.map((p) => ({
    type: "L" as const,
    x: p.x * scale,
    y: p.y * scale,
  }));
  return {
    segments,
    polygonCache: polygon.map((p) => ({ x: p.x * scale, y: p.y * scale })),
    polygonTolerance: 1.0,
  };
}

// ── Public API ─────────────────────────────────────────────────────────────────

export interface TraceResult {
  bezierPath: BezierPath;
  pixelWidth: number;
  pixelHeight: number;
}

/**
 * Trace a no-background PNG into a BezierPath (polygon approximation).
 *
 * @param imageUrl       Data URL or Firebase Storage URL of the PNG
 * @param tolerance      RDP simplification tolerance in pixels (default 2.0)
 * @param mmPerPx        Scale factor: how many mm one pixel represents (default 0.1)
 * @param alphaThreshold Pixels with alpha < this are background (default 32)
 * @param maxDim         Max raster dimension — higher = more detail (default 256)
 */
export async function traceSilhouette(
  imageUrl: string,
  tolerance = 2.0,
  mmPerPx = 0.1,
  alphaThreshold = 32,
  maxDim = 256,
): Promise<TraceResult> {
  const { mask, w, h } = await imageToMask(imageUrl, maxDim, alphaThreshold);
  const raw = marchingSquares(mask, w, h);
  if (raw.length < 3) throw new Error("No foreground shape found in image");

  // Centre the polygon (coords relative to image centre)
  const cx = w / 2, cy = h / 2;
  const centred = raw.map((p) => ({ x: p.x - cx, y: p.y - cy }));

  const simplified = rdp(centred, tolerance);
  return {
    bezierPath: polygonToBezierPath(simplified, mmPerPx),
    pixelWidth: w,
    pixelHeight: h,
  };
}
