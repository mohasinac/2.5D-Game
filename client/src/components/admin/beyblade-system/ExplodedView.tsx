// Exploded-view preview — renders each part of the beyblade stacked vertically
// with a small gap between layers, mimicking the classic packaging-art reveal:
//   bitBeast → attackRing → weightDisk → spinTrack? → casing → core? → tip
// SubParts float beside their parent layer.

import React from "react";
import type { ResolvedBeybladeSystem } from "@/lib/beybladeSystemConverter";
import type {
  ARPart, WDPart, TipPart, CorePart, CasingPart, BitBeastPart, SpinTrackPart, SubPart,
  PartShape,
} from "@/types/beybladeSystem";

interface Props {
  resolved: ResolvedBeybladeSystem | null | undefined;
  width?: number;
}

interface Layer {
  key: string;
  label: string;
  part: { displayName: string; color: string; images?: { topView?: string; sideView?: string; bottomView?: string }; geometry?: PartShape } | undefined;
  // Visual height in px relative to the layer's perceived thickness.
  height: number;
  // Visual width as a fraction of canvas width (0–1) — taller stack items are
  // typically wider in real beys.
  widthScale: number;
  // Companion sub-parts attached to this layer
  subs?: Array<{ part: SubPart; }>;
}

export function ExplodedView({ resolved, width = 320 }: Props) {
  if (!resolved) {
    return (
      <div className="text-theme-faint text-[12px] p-6">
        Select all required parts to see the exploded preview.
      </div>
    );
  }

  // Sub-parts grouped by parent type so each parent layer renders its attachments.
  const subsByParent = new Map<string, Array<{ part: SubPart }>>();
  for (const { attachment, part } of resolved.subParts) {
    const key = attachment.parentPart;
    if (!subsByParent.has(key)) subsByParent.set(key, []);
    subsByParent.get(key)!.push({ part });
  }

  // Build layers top → bottom in real-world stacking order.
  const layers: Layer[] = [];

  // SubPartParent keys ("ar", "wd", "bit_beast", "casing", "core", "tip")
  // come from client/src/types/beybladeSystem.ts. Map each layer to its
  // corresponding parent key — note that there is no parent key for spinTrack
  // (no sub-part can attach to one), so we don't look it up.
  if (resolved.bitBeast) {
    layers.push({
      key: "bitBeast", label: "Bit Beast",
      part: resolved.bitBeast as BitBeastPart,
      height: 56, widthScale: 0.30,
      subs: subsByParent.get("bit_beast"),
    });
  }
  layers.push({
    key: "attackRing", label: "Attack Ring",
    part: resolved.attackRing as ARPart,
    height: 84, widthScale: 0.95,
    subs: subsByParent.get("ar"),
  });
  layers.push({
    key: "weightDisk", label: "Weight Disk",
    part: resolved.weightDisk as WDPart,
    height: 60, widthScale: 0.78,
    subs: subsByParent.get("wd"),
  });
  if (resolved.spinTrack) {
    layers.push({
      key: "spinTrack", label: "Spin Track",
      part: resolved.spinTrack as SpinTrackPart,
      height: 48, widthScale: 0.55,
      // Spin tracks have no SubPartParent key; never carry sub-parts.
    });
  }
  layers.push({
    key: "casing", label: "Casing",
    part: resolved.casing as CasingPart,
    height: 96, widthScale: 0.85,
    subs: subsByParent.get("casing"),
  });
  if (resolved.core) {
    layers.push({
      key: "core", label: "Core",
      part: resolved.core as CorePart,
      height: 48, widthScale: 0.45,
      subs: subsByParent.get("core"),
    });
  }
  layers.push({
    key: "tip", label: "Tip",
    part: resolved.tip as TipPart,
    height: 64, widthScale: 0.32,
    subs: subsByParent.get("tip"),
  });

  return (
    <div
      className="flex flex-col items-center gap-[18px] py-5 px-3 border border-border-c rounded-xl min-h-[600px] bg-[linear-gradient(180deg,var(--bg1)_0%,var(--bg0)_100%)] w-[--ew]"
      style={{ "--ew": `${width}px` } as React.CSSProperties}
    >
      <div className="text-[11px] text-theme-faint mb-1 text-center">
        {resolved.system.displayName}
        <div className="text-[9px] mt-0.5 opacity-60">
          Exploded view — {layers.length} layer{layers.length === 1 ? "" : "s"}
        </div>
      </div>

      {layers.map((layer) => (
        <LayerCell key={layer.key} layer={layer} canvasWidth={width - 24} />
      ))}
    </div>
  );
}

// ─── Single layer — image + label + sub-part companions ────────────────────────

function LayerCell({ layer, canvasWidth }: { layer: Layer; canvasWidth: number }) {
  const part = layer.part;
  if (!part) return null;

  const w = canvasWidth * layer.widthScale;
  const sideImg = part.images?.sideView;
  const hasSubs = layer.subs && layer.subs.length > 0;

  return (
    <div className="flex items-center gap-4 w-[--cw]" style={{ "--cw": `${canvasWidth}px` } as React.CSSProperties}>
      {/* Label gutter (left) */}
      <div
        className="w-[72px] text-[10px] text-theme-faint text-right [font-variant:small-caps] tracking-[0.5px]"
      >
        <div className="font-semibold text-theme-muted">{layer.label}</div>
        <div className="text-[9px] mt-px opacity-70">{part.displayName}</div>
      </div>

      {/* Layer art */}
      <div className="flex-1 flex justify-center relative">
        {sideImg ? (
          <img
            src={sideImg}
            alt={part.displayName}
            className="object-contain [filter:drop-shadow(0_4px_6px_rgba(0,0,0,0.35))] w-[--lw] h-[--lh]"
            style={{ "--lw": `${w}px`, "--lh": `${layer.height}px` } as React.CSSProperties}
          />
        ) : (
          <ProxyShape
            width={w} height={layer.height}
            color={part.color || "#888"}
            layerKey={layer.key}
          />
        )}
      </div>

      {/* Sub-parts (right) */}
      <div className="w-[72px] flex flex-col gap-1">
        {hasSubs ? layer.subs!.map((s, i) => (
          <div
            key={i}
            title={s.part.displayName}
            className="text-[9px] text-theme-faint px-1.5 py-0.5 bg-bg2 border border-border-c rounded-[4px] whitespace-nowrap overflow-hidden text-ellipsis"
          >
            ⊕ {s.part.displayName}
          </div>
        )) : null}
      </div>
    </div>
  );
}

// ─── Fallback shape when sideView image is missing ─────────────────────────────
// Draws a colored ellipse / disc / cone hinting at the layer type so previews
// stay informative even when a part hasn't had its image uploaded.

function ProxyShape({
  width, height, color, layerKey,
}: { width: number; height: number; color: string; layerKey: string }) {
  const stroke = "rgba(255,255,255,0.18)";

  // Bit beast → small square chip
  if (layerKey === "bitBeast") {
    return (
      <svg width={width} height={height} viewBox="0 0 100 100" className="[filter:drop-shadow(0_4px_6px_rgba(0,0,0,0.35))]">
        <rect x="20" y="20" width="60" height="60" rx="8" fill={color} stroke={stroke} strokeWidth="2" />
        <circle cx="50" cy="50" r="14" fill="rgba(255,255,255,0.12)" />
      </svg>
    );
  }
  // Tip → triangle / spike
  if (layerKey === "tip") {
    return (
      <svg width={width} height={height} viewBox="0 0 100 100" className="[filter:drop-shadow(0_4px_6px_rgba(0,0,0,0.35))]">
        <polygon points="50,15 80,75 20,75" fill={color} stroke={stroke} strokeWidth="2" />
      </svg>
    );
  }
  // Default → flat disc seen edge-on (ellipse)
  return (
    <svg width={width} height={height} viewBox="0 0 200 60" className="[filter:drop-shadow(0_4px_6px_rgba(0,0,0,0.35))]">
      <ellipse cx="100" cy="30" rx="92" ry="22" fill={color} stroke={stroke} strokeWidth="2" />
      <ellipse cx="100" cy="22" rx="92" ry="6" fill="rgba(255,255,255,0.08)" />
    </svg>
  );
}
