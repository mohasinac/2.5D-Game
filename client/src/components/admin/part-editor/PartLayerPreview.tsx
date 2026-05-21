// Per-part preview matching the BeybladeSystemPreview > ExplodedView aesthetic.
// Composes the part's three uploaded views (top / side / bottom) on a dark
// gradient with drop shadows, falling back to a typed SVG proxy when an image
// hasn't been uploaded yet. The "side" view is the same image used in the
// exploded stack, so part authors can sanity-check how their upload will look
// in context before saving.

import { C } from "@/styles/theme";
import type { PartImages, PartDimensions } from "@/types/beybladeSystem";

interface Props {
  images: PartImages;
  partKind: PartKind;
  displayName: string;
  color?: string;
  dimensions?: PartDimensions;
}

export type PartKind =
  | "bitBeast"
  | "attackRing"
  | "weightDisk"
  | "spinTrack"
  | "casing"
  | "core"
  | "tip"
  | "subPart";

interface SlotSpec {
  key: keyof PartImages;
  label: string;
  hint: string;
  // Height ratio (vs canvas) — gives each view a sensible aspect.
  heightFrac: number;
}

const SLOTS: SlotSpec[] = [
  { key: "topView",    label: "Top View",    hint: "plan / silhouette", heightFrac: 0.34 },
  { key: "sideView",   label: "Side View",   hint: "height profile",    heightFrac: 0.36 },
  { key: "bottomView", label: "Bottom View", hint: "floor contact",     heightFrac: 0.30 },
];

export function PartLayerPreview({ images, partKind, displayName, color, dimensions }: Props) {
  const safeColor = color || "#7a7a7a";

  return (
    <div
      style={{
        display: "flex", flexDirection: "column", gap: 16,
        padding: "20px 16px",
        background: `linear-gradient(180deg, ${C.bg1} 0%, ${C.bg0} 100%)`,
        border: `1px solid ${C.border}`, borderRadius: 12,
        minHeight: 520,
      }}
    >
      <div style={{ textAlign: "center" }}>
        <div style={{ fontSize: 12, color: C.text, fontWeight: 600 }}>{displayName}</div>
        <div style={{ fontSize: 10, color: C.faint, marginTop: 2, textTransform: "uppercase", letterSpacing: 0.6 }}>
          {labelForKind(partKind)}
          {dimensions ? (
            <span style={{ marginLeft: 8 }}>
              · ⌀ {(dimensions.outerRadius * 2).toFixed(0)}mm · ↕ {dimensions.height.toFixed(0)}mm
            </span>
          ) : null}
        </div>
      </div>

      {SLOTS.map((slot) => (
        <SlotRow
          key={slot.key}
          slot={slot}
          url={images[slot.key]}
          partKind={partKind}
          color={safeColor}
        />
      ))}
    </div>
  );
}

function SlotRow({
  slot, url, partKind, color,
}: {
  slot: SlotSpec; url: string | undefined; partKind: PartKind; color: string;
}) {
  const hasImage = !!url;

  return (
    <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
      {/* Label gutter */}
      <div
        style={{
          width: 80, flexShrink: 0, fontSize: 10, color: C.muted, textAlign: "right",
          fontVariant: "small-caps", letterSpacing: 0.5,
        }}
      >
        <div style={{ fontWeight: 600, color: hasImage ? C.text : C.muted }}>{slot.label}</div>
        <div style={{ fontSize: 9, marginTop: 2, opacity: 0.7 }}>{slot.hint}</div>
        {!hasImage && (
          <div style={{ fontSize: 8, marginTop: 4, color: C.yellow, opacity: 0.8 }}>
            no image · using proxy
          </div>
        )}
      </div>

      {/* Image / proxy */}
      <div style={{ flex: 1, display: "flex", justifyContent: "center", minHeight: 80 }}>
        {hasImage ? (
          <img
            src={url}
            alt={slot.label}
            style={{
              maxWidth: 240, maxHeight: 140, width: "auto", height: "auto", objectFit: "contain",
              filter: "drop-shadow(0 4px 8px rgba(0,0,0,0.45))",
            }}
          />
        ) : (
          <ProxyShape partKind={partKind} slot={slot.key} color={color} />
        )}
      </div>
    </div>
  );
}

function labelForKind(k: PartKind): string {
  switch (k) {
    case "bitBeast":   return "Bit Beast";
    case "attackRing": return "Attack Ring";
    case "weightDisk": return "Weight Disk";
    case "spinTrack":  return "Spin Track";
    case "casing":     return "Casing";
    case "core":       return "Core";
    case "tip":        return "Tip";
    case "subPart":    return "Sub-Part";
  }
}

// ─── Proxy shapes — silhouettes used when an image hasn't been uploaded ───────
// Geometry roughly matches the part type's intuitive form, so the editor
// preview is still informative mid-build.

function ProxyShape({
  partKind, slot, color,
}: { partKind: PartKind; slot: keyof PartImages; color: string }) {
  const stroke = "rgba(255,255,255,0.18)";
  const dropShadow = "drop-shadow(0 4px 8px rgba(0,0,0,0.45))";
  const w = 200;
  const h = 110;

  // Bit-beast chip — same in all 3 slots.
  if (partKind === "bitBeast") {
    return (
      <svg width={w} height={h} viewBox="0 0 200 110" style={{ filter: dropShadow }}>
        <rect x="60" y="20" width="80" height="70" rx="10" fill={color} stroke={stroke} strokeWidth="2" />
        <circle cx="100" cy="55" r="20" fill="rgba(255,255,255,0.12)" />
      </svg>
    );
  }

  // Tip — pointer / spike for side, circle for top/bottom.
  if (partKind === "tip") {
    if (slot === "sideView") {
      return (
        <svg width={w} height={h} viewBox="0 0 200 110" style={{ filter: dropShadow }}>
          <polygon points="100,15 130,90 70,90" fill={color} stroke={stroke} strokeWidth="2" />
        </svg>
      );
    }
    return (
      <svg width={w} height={h} viewBox="0 0 200 110" style={{ filter: dropShadow }}>
        <circle cx="100" cy="55" r="14" fill={color} stroke={stroke} strokeWidth="2" />
        <circle cx="100" cy="55" r="5" fill="rgba(255,255,255,0.4)" />
      </svg>
    );
  }

  // Sub-part — small generic blob.
  if (partKind === "subPart") {
    return (
      <svg width={w} height={h} viewBox="0 0 200 110" style={{ filter: dropShadow }}>
        <rect x="70" y="35" width="60" height="40" rx="14" fill={color} stroke={stroke} strokeWidth="2" />
      </svg>
    );
  }

  // Rings / disks / casings — top view is a torus, side view is an edge-on ellipse.
  if (slot === "sideView") {
    return (
      <svg width={w} height={h} viewBox="0 0 200 110" style={{ filter: dropShadow }}>
        <ellipse cx="100" cy="55" rx="92" ry="20" fill={color} stroke={stroke} strokeWidth="2" />
        <ellipse cx="100" cy="48" rx="92" ry="6" fill="rgba(255,255,255,0.08)" />
      </svg>
    );
  }
  // top or bottom view — concentric ring
  return (
    <svg width={w} height={h} viewBox="0 0 200 110" style={{ filter: dropShadow }}>
      <circle cx="100" cy="55" r="48" fill={color} stroke={stroke} strokeWidth="2" />
      <circle cx="100" cy="55" r="22" fill={C.bg0} />
    </svg>
  );
}

// Helper: map a beyblade part to its PartKind for callers that have a part type tag.
// (Caller passes whichever it has — we accept either via the partKind prop directly.)
