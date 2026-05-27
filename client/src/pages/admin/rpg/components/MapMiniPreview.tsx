/**
 * MapMiniPreview — animated GBA-style map canvas for admin CRUD pages.
 *
 * Features:
 * - Optional `bgImageUrl` — drawn first (stretched to fill); tiles/NPC/exits
 *   are then drawn on top. When a background is supplied, the "void/floor" base
 *   tiles (ids 0 and 5) are drawn transparent so the image shows through.
 * - Animated tile IDs: water (10), lava (14), ice (15), fan (16), torch (17),
 *   portal (18) — rendered each frame via requestAnimationFrame.
 * - Emoji tile overlays (tile id ≥ 100) — drawn as UTF-8 glyphs.
 * - Static tiles cached to an offscreen canvas; animated tiles composited on top.
 * - NPC placements (red), exits (amber), event triggers (cyan) overlaid.
 */

import { useRef, useEffect, useMemo } from "react";
import type { RPGMap, MapEventTrigger } from "@/rpg/data/schemas";

// ── Tile colour palette ───────────────────────────────────────────────────────

export const TILE_COLORS: Record<number, string> = {
  0:  "transparent", // void / empty — shows bg image through
  1:  "#4a7c4f",     // grass
  2:  "#6b6b6b",     // wall
  3:  "#2d5a2d",     // tree
  4:  "#7a5c3a",     // building
  5:  "transparent", // path / floor — shows bg image through
  6:  "#4a7a9b",     // arena
  7:  "#8b6f47",     // door
  8:  "#6e4a82",     // shop
  9:  "#888888",     // rock
  10: "#3b6fa0",     // water  (animated)
  11: "#d4a44c",     // sand
  12: "#c0c0c0",     // metal
  13: "#5a3a1a",     // wood
  14: "#e06060",     // lava   (animated)
  15: "#60d0e0",     // ice    (animated)
  16: "#888888",     // fan    (animated)
  17: "#d08830",     // torch  (animated)
  18: "#9060d0",     // portal (animated)
};

// Fallback solid colours for void/floor when no bg image
const TILE_COLORS_SOLID: Record<number, string> = {
  ...TILE_COLORS,
  0: "#111111",
  5: "#c4a96a",
};

export const TILE_LABELS: Record<number, string> = {
  0:"void",  1:"grass", 2:"wall",   3:"tree",   4:"building",
  5:"floor", 6:"arena", 7:"door",   8:"shop",   9:"rock",
  10:"water",11:"sand", 12:"metal", 13:"wood",  14:"lava",
  15:"ice",  16:"fan",  17:"torch", 18:"portal",
};

// Emoji tile IDs ≥ 100 — rendered as glyphs
export const EMOJI_TILES: Record<number, string> = {
  100: "🌳", 101: "🌲", 102: "🌊", 103: "🔥", 104: "❄️",
  105: "⭐", 106: "💎", 107: "🏠", 108: "🏟️", 109: "🗿",
  110: "🌸", 111: "🍀", 112: "⚡", 113: "💀", 114: "🚪",
};

const ANIMATED_IDS = new Set([10, 14, 15, 16, 17, 18]);

// ── Animated tile rendering ────────────────────────────────────────────────────

function drawAnimatedTile(
  ctx: CanvasRenderingContext2D,
  id: number, x: number, y: number, s: number, t: number,
) {
  switch (id) {
    case 10: {
      ctx.fillStyle = "#3b6fa0";
      ctx.fillRect(x, y, s, s);
      const w1 = Math.sin(t * 2.0 + x * 0.8) * 0.35 + 0.35;
      ctx.fillStyle = `rgba(100,180,255,${w1 * 0.45})`;
      ctx.fillRect(x, y + s * 0.3, s, s * 0.22);
      const w2 = Math.sin(t * 2.6 + x * 0.6 + 1.2) * 0.3 + 0.3;
      ctx.fillStyle = `rgba(150,210,255,${w2 * 0.3})`;
      ctx.fillRect(x, y + s * 0.6, s, s * 0.18);
      break;
    }
    case 14: {
      const p = Math.sin(t * 3.0 + x * 0.5 + y * 0.5) * 0.5 + 0.5;
      ctx.fillStyle = `rgb(${Math.round(180+75*p)},${Math.round(40+40*p)},10)`;
      ctx.fillRect(x, y, s, s);
      ctx.fillStyle = `rgba(255,200,80,${0.2 + 0.3 * p})`;
      ctx.fillRect(x + s * 0.1, y + s * 0.4, s * 0.8, s * 0.15);
      ctx.fillRect(x + s * 0.3, y + s * 0.2, s * 0.15, s * 0.6);
      break;
    }
    case 15: {
      ctx.fillStyle = "#60d0e0";
      ctx.fillRect(x, y, s, s);
      const g = Math.max(0, Math.sin(t * 2.8 + x * 1.1 + y * 0.7));
      ctx.fillStyle = `rgba(255,255,255,${g * 0.6})`;
      ctx.fillRect(x + s * 0.1, y + s * 0.1, s * 0.3, s * 0.3);
      ctx.fillRect(x + s * 0.6, y + s * 0.6, s * 0.2, s * 0.2);
      break;
    }
    case 16: {
      ctx.fillStyle = "#555";
      ctx.fillRect(x, y, s, s);
      const ang = t * 6.0;
      const cx = x + s/2, cy = y + s/2, bl = s * 0.44;
      ctx.save(); ctx.translate(cx, cy); ctx.rotate(ang);
      ctx.fillStyle = "#ccc";
      ctx.fillRect(-s*0.05, -bl, s*0.1, bl*2);
      ctx.fillRect(-bl, -s*0.05, bl*2, s*0.1);
      ctx.restore();
      ctx.fillStyle = "#aaa";
      ctx.beginPath(); ctx.arc(cx, cy, s*0.07, 0, Math.PI*2); ctx.fill();
      break;
    }
    case 17: {
      ctx.fillStyle = "#4a2010";
      ctx.fillRect(x, y, s, s);
      const fl = Math.sin(t*12+x)*0.3 + 0.7 + Math.sin(t*7.3)*0.15;
      const rg = ctx.createRadialGradient(x+s/2, y+s*0.3, 0, x+s/2, y+s*0.3, s*0.55);
      rg.addColorStop(0, `rgba(255,220,80,${Math.min(1,fl*0.9)})`);
      rg.addColorStop(0.4, `rgba(255,120,20,${Math.min(1,fl*0.6)})`);
      rg.addColorStop(1, "rgba(0,0,0,0)");
      ctx.fillStyle = rg; ctx.fillRect(x, y, s, s);
      ctx.fillStyle = `rgba(255,255,180,${Math.max(0,Math.sin(t*15+y))*0.9})`;
      ctx.beginPath(); ctx.ellipse(x+s/2, y+s*0.25, s*0.08, s*0.18, 0, 0, Math.PI*2); ctx.fill();
      break;
    }
    case 18: {
      ctx.fillStyle = "#1a0a2a"; ctx.fillRect(x, y, s, s);
      const a2 = t * 2.5;
      const cx2 = x+s/2, cy2 = y+s/2, r2 = s*0.42;
      for (let i=0;i<6;i++) {
        const a = a2 + (Math.PI*2/6)*i;
        const hue = ((i*60+t*80)%360);
        ctx.fillStyle = `hsla(${hue},100%,65%,0.8)`;
        ctx.beginPath(); ctx.arc(cx2+Math.cos(a)*r2*0.7, cy2+Math.sin(a)*r2*0.7, s*0.07, 0, Math.PI*2); ctx.fill();
      }
      const gw = ctx.createRadialGradient(cx2,cy2,0,cx2,cy2,r2*0.5);
      gw.addColorStop(0,"rgba(200,150,255,0.7)"); gw.addColorStop(1,"rgba(0,0,0,0)");
      ctx.fillStyle=gw; ctx.fillRect(x,y,s,s);
      break;
    }
  }
}

// ── Static layer cache builder ─────────────────────────────────────────────────

function drawStaticLayer(
  off: HTMLCanvasElement, map: RPGMap, scale: number, hasBg: boolean,
) {
  const ctx = off.getContext("2d")!;
  ctx.clearRect(0, 0, off.width, off.height);
  ctx.imageSmoothingEnabled = false;

  const colorMap = hasBg ? TILE_COLORS : TILE_COLORS_SOLID;
  const groundLayer = map.layers.find((l) => l.name === "ground");
  const decoLayer   = map.layers.find((l) => l.name === "decoration");

  if (!groundLayer) {
    ctx.fillStyle = hasBg ? "rgba(0,0,0,0.15)" : "#1a1a1a";
    ctx.fillRect(0, 0, off.width, off.height);
    ctx.strokeStyle = "#33333388"; ctx.lineWidth = 0.5;
    for (let x=0; x<=map.width; x++) { ctx.beginPath(); ctx.moveTo(x*scale,0); ctx.lineTo(x*scale,off.height); ctx.stroke(); }
    for (let y=0; y<=map.height; y++) { ctx.beginPath(); ctx.moveTo(0,y*scale); ctx.lineTo(off.width,y*scale); ctx.stroke(); }
    return;
  }

  for (let row=0; row<map.height; row++) {
    for (let col=0; col<map.width; col++) {
      const idx = row * map.width + col;
      const gT  = groundLayer.data[idx]  ?? 0;
      const dT  = decoLayer?.data[idx]   ?? 0;
      const px  = col * scale, py = row * scale;

      // Ground tile
      if (!ANIMATED_IDS.has(gT)) {
        const c = colorMap[gT];
        if (c && c !== "transparent") { ctx.fillStyle = c; ctx.fillRect(px, py, scale, scale); }
      }

      // Emoji tile overlay (id ≥ 100)
      if (gT >= 100 && EMOJI_TILES[gT]) {
        ctx.font = `${Math.round(scale * 0.9)}px serif`;
        ctx.textAlign = "center"; ctx.textBaseline = "middle";
        ctx.fillText(EMOJI_TILES[gT], px + scale/2, py + scale/2);
      }

      // Decoration tile
      if (dT > 0 && !ANIMATED_IDS.has(dT)) {
        if (dT >= 100 && EMOJI_TILES[dT]) {
          ctx.font = `${Math.round(scale * 0.9)}px serif`;
          ctx.textAlign = "center"; ctx.textBaseline = "middle";
          ctx.fillText(EMOJI_TILES[dT], px + scale/2, py + scale/2);
        } else {
          const c = colorMap[dT];
          if (c && c !== "transparent") { ctx.fillStyle = c; ctx.fillRect(px, py, scale, scale); }
        }
      }
    }
  }
}

// ── Props ──────────────────────────────────────────────────────────────────────

interface Props {
  map:          RPGMap;
  maxWidth?:    number;
  showLegend?:  boolean;
  /** URL of a background image. Drawn behind tiles; void/floor tiles are transparent. */
  bgImageUrl?:  string | null;
}

// ── Component ─────────────────────────────────────────────────────────────────

export function MapMiniPreview({
  map, maxWidth = 300, showLegend = false, bgImageUrl = null,
}: Props) {
  const canvasRef  = useRef<HTMLCanvasElement>(null);
  const offRef     = useRef<HTMLCanvasElement | null>(null);
  const bgImgRef   = useRef<HTMLImageElement | null>(null);
  const rafRef     = useRef<number>(0);
  const t0Ref      = useRef<number>(0);
  const cacheKeyRef = useRef<string>("");

  const scale  = Math.max(2, Math.min(4, Math.floor(maxWidth / (map.width  || 20))));
  const cW     = (map.width  || 20) * scale;
  const cH     = (map.height || 15) * scale;

  // Load bg image when url changes
  useEffect(() => {
    if (!bgImageUrl) { bgImgRef.current = null; return; }
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.src = bgImageUrl;
    img.onload = () => { bgImgRef.current = img; };
  }, [bgImageUrl]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    canvas.width  = cW;
    canvas.height = cH;

    // Rebuild static cache when map changes
    const cacheKey = JSON.stringify({ layers: map.layers, w: map.width, h: map.height, hasBg: !!bgImageUrl });
    if (cacheKeyRef.current !== cacheKey) {
      cacheKeyRef.current = cacheKey;
      const off = document.createElement("canvas");
      off.width = cW; off.height = cH;
      drawStaticLayer(off, map, scale, !!bgImageUrl);
      offRef.current = off;
    }

    t0Ref.current = performance.now();

    const groundLayer = map.layers.find((l) => l.name === "ground");
    const decoLayer   = map.layers.find((l) => l.name === "decoration");
    const hasAnimated = map.layers.some((l) => l.data.some((t) => ANIMATED_IDS.has(t)));

    const render = (ts: number) => {
      const ctx = canvas.getContext("2d")!;
      ctx.imageSmoothingEnabled = false;
      ctx.clearRect(0, 0, cW, cH);

      // 1. Background image (stretched to fill)
      if (bgImgRef.current) {
        ctx.drawImage(bgImgRef.current, 0, 0, cW, cH);
      }

      // 2. Static tile cache
      if (offRef.current) ctx.drawImage(offRef.current, 0, 0);

      // 3. Animated tiles
      const elapsed = (ts - t0Ref.current) / 1000;
      if (hasAnimated && groundLayer) {
        for (let row=0; row<map.height; row++) {
          for (let col=0; col<map.width; col++) {
            const idx = row * map.width + col;
            const gT  = groundLayer.data[idx] ?? 0;
            const dT  = decoLayer?.data[idx]  ?? 0;
            const px  = col * scale, py = row * scale;
            if (ANIMATED_IDS.has(gT)) drawAnimatedTile(ctx, gT, px, py, scale, elapsed);
            if (dT > 0 && ANIMATED_IDS.has(dT)) drawAnimatedTile(ctx, dT, px, py, scale, elapsed);
          }
        }
      }

      // 4. NPC placements
      for (const npc of map.npcPlacements ?? []) {
        ctx.fillStyle = "#ff4444";
        ctx.fillRect(npc.spawnTile.x*scale+1, npc.spawnTile.y*scale+1, scale-2, scale-2);
      }

      // 5. Exits
      for (const ex of map.exits ?? []) {
        ctx.fillStyle = "rgba(255,200,0,0.55)";
        ctx.fillRect(ex.triggerRect.x*scale, ex.triggerRect.y*scale, ex.triggerRect.width*scale, ex.triggerRect.height*scale);
      }

      // 6. Event triggers
      for (const ev of (map.eventTriggers ?? []) as MapEventTrigger[]) {
        if (ev.triggerRect) {
          ctx.fillStyle = "rgba(80,220,220,0.35)";
          ctx.fillRect(ev.triggerRect.x*scale, ev.triggerRect.y*scale, ev.triggerRect.width*scale, ev.triggerRect.height*scale);
        }
      }

      rafRef.current = requestAnimationFrame(render);
    };

    rafRef.current = requestAnimationFrame(render);
    return () => cancelAnimationFrame(rafRef.current);
  }, [map, scale, cW, cH, bgImageUrl]);

  // Legend
  const usedTileIds = useMemo(() => {
    if (!showLegend) return [];
    const ids = new Set<number>();
    for (const layer of map.layers) for (const t of layer.data) if (t > 0) ids.add(t);
    return [...ids].sort((a,b) => a-b);
  }, [map, showLegend]);

  return (
    <div className="flex flex-col gap-1.5">
      <canvas
        ref={canvasRef}
        className="border border-gray-700 rounded"
        style={{ imageRendering: "pixelated", display: "block" }}
      />

      <div className="flex flex-wrap gap-2 text-[10px] text-gray-500">
        <span>{map.width}×{map.height} tiles</span>
        {bgImageUrl && <span className="text-green-400">🖼 bg</span>}
        {(map.npcPlacements?.length ?? 0) > 0 && (
          <span className="text-red-400">● {map.npcPlacements.length} NPC</span>
        )}
        {(map.exits?.length ?? 0) > 0 && (
          <span className="text-amber-400">▶ {map.exits.length} exit</span>
        )}
      </div>

      {showLegend && usedTileIds.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mt-1">
          {usedTileIds.map((id) => (
            <span key={id} className="flex items-center gap-1 text-[9px] text-gray-400">
              {id >= 100
                ? <span>{EMOJI_TILES[id] ?? `t${id}`}</span>
                : <>
                    <span className="inline-block w-2.5 h-2.5 rounded-sm border border-gray-700"
                      style={{ background: TILE_COLORS_SOLID[id] ?? "#111" }} />
                    {TILE_LABELS[id] ?? `t${id}`}
                    {ANIMATED_IDS.has(id) && <span className="text-amber-400">✦</span>}
                  </>
              }
            </span>
          ))}
          <span className="flex items-center gap-1 text-[9px] text-red-400">
            <span className="inline-block w-2.5 h-2.5 rounded-sm bg-red-500" />npc
          </span>
          <span className="flex items-center gap-1 text-[9px] text-amber-400">
            <span className="inline-block w-2.5 h-2.5 rounded-sm bg-amber-400/60" />exit
          </span>
          <span className="flex items-center gap-1 text-[9px] text-cyan-400">
            <span className="inline-block w-2.5 h-2.5 rounded-sm bg-cyan-400/40" />trigger
          </span>
        </div>
      )}
    </div>
  );
}
