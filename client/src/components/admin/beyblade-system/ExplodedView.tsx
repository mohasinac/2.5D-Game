// Exploded-view preview — renders each part of the beyblade stacked vertically
// with a small gap between layers, mimicking the classic packaging-art reveal:
//   bitBeast → attackRing → weightDisk → spinTrack? → casing → core? → tip
// SubParts float beside their parent layer.

import { C } from "@/styles/theme";
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
      <div style={{ color: C.faint, fontSize: 12, padding: 24 }}>
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
      style={{
        display: "flex", flexDirection: "column", alignItems: "center",
        gap: 18, padding: "20px 12px",
        background: `linear-gradient(180deg, ${C.bg1} 0%, ${C.bg0} 100%)`,
        border: `1px solid ${C.border}`, borderRadius: 12,
        width, minHeight: 600,
      }}
    >
      <div style={{ fontSize: 11, color: C.faint, marginBottom: 4, textAlign: "center" }}>
        {resolved.system.displayName}
        <div style={{ fontSize: 9, marginTop: 2, opacity: 0.6 }}>
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
    <div style={{ display: "flex", alignItems: "center", gap: 16, width: canvasWidth }}>
      {/* Label gutter (left) */}
      <div
        style={{
          width: 72, fontSize: 10, color: C.faint, textAlign: "right",
          fontVariant: "small-caps", letterSpacing: 0.5,
        }}
      >
        <div style={{ fontWeight: 600, color: C.muted }}>{layer.label}</div>
        <div style={{ fontSize: 9, marginTop: 1, opacity: 0.7 }}>{part.displayName}</div>
      </div>

      {/* Layer art */}
      <div style={{ flex: 1, display: "flex", justifyContent: "center", position: "relative" }}>
        {sideImg ? (
          <img
            src={sideImg}
            alt={part.displayName}
            style={{
              width: w, height: layer.height, objectFit: "contain",
              filter: "drop-shadow(0 4px 6px rgba(0,0,0,0.35))",
            }}
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
      <div style={{ width: 72, display: "flex", flexDirection: "column", gap: 4 }}>
        {hasSubs ? layer.subs!.map((s, i) => (
          <div
            key={i}
            title={s.part.displayName}
            style={{
              fontSize: 9, color: C.faint, padding: "2px 6px",
              background: C.bg2, border: `1px solid ${C.border}`,
              borderRadius: 4, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
            }}
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
  const dropShadow = "drop-shadow(0 4px 6px rgba(0,0,0,0.35))";

  // Bit beast → small square chip
  if (layerKey === "bitBeast") {
    return (
      <svg width={width} height={height} viewBox="0 0 100 100" style={{ filter: dropShadow }}>
        <rect x="20" y="20" width="60" height="60" rx="8" fill={color} stroke={stroke} strokeWidth="2" />
        <circle cx="50" cy="50" r="14" fill="rgba(255,255,255,0.12)" />
      </svg>
    );
  }
  // Tip → triangle / spike
  if (layerKey === "tip") {
    return (
      <svg width={width} height={height} viewBox="0 0 100 100" style={{ filter: dropShadow }}>
        <polygon points="50,15 80,75 20,75" fill={color} stroke={stroke} strokeWidth="2" />
      </svg>
    );
  }
  // Default → flat disc seen edge-on (ellipse)
  return (
    <svg width={width} height={height} viewBox="0 0 200 60" style={{ filter: dropShadow }}>
      <ellipse cx="100" cy="30" rx="92" ry="22" fill={color} stroke={stroke} strokeWidth="2" />
      <ellipse cx="100" cy="22" rx="92" ry="6" fill="rgba(255,255,255,0.08)" />
    </svg>
  );
}
