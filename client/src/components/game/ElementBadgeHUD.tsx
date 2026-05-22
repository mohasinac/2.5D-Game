// Phase AB: Element type badge chips shown on the in-match HUD next to the bey name.
// Also renders a "SUPER EFFECTIVE!" / "NOT VERY EFFECTIVE" flash for type matchup contacts.

import { useState, useEffect } from "react";
import { ELEMENT_ICONS, ELEMENT_COLORS } from "@/types/elementTypes";
import type { ElementType } from "@/types/elementTypes";

interface ElementBadgesProps {
  elementTypes: ElementType[];
  size?: "sm" | "md";
}

export function ElementBadges({ elementTypes, size = "md" }: ElementBadgesProps) {
  if (!elementTypes || elementTypes.length === 0) return null;
  const px = size === "sm" ? 14 : 18;
  const font = size === "sm" ? 10 : 12;

  return (
    <div style={{ display: "flex", gap: 3, alignItems: "center" }}>
      {elementTypes.map(elem => (
        <span
          key={elem}
          title={elem}
          style={{
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            width: px,
            height: px,
            borderRadius: "50%",
            background: ELEMENT_COLORS[elem] + "33",
            border: `1px solid ${ELEMENT_COLORS[elem]}88`,
            fontSize: font,
            lineHeight: 1,
            userSelect: "none",
          }}
        >
          {ELEMENT_ICONS[elem]}
        </span>
      ))}
    </div>
  );
}

type EffectivenessLabel = "super" | "resisted" | null;

interface TypeEffectivenessFlashProps {
  /** Set to "super" or "resisted" to trigger the flash; null to hide. */
  label: EffectivenessLabel;
}

export function TypeEffectivenessFlash({ label }: TypeEffectivenessFlashProps) {
  const [visible, setVisible] = useState(false);
  const [current, setCurrent] = useState<EffectivenessLabel>(null);

  useEffect(() => {
    if (!label) return;
    setCurrent(label);
    setVisible(true);
    const t = setTimeout(() => setVisible(false), 1400);
    return () => clearTimeout(t);
  }, [label]);

  if (!visible || !current) return null;

  const isSuper = current === "super";
  return (
    <div
      style={{
        position: "absolute",
        top: "35%",
        left: "50%",
        transform: "translateX(-50%)",
        fontWeight: 800,
        fontSize: 22,
        letterSpacing: 1,
        color: isSuper ? "#facc15" : "#94a3b8",
        textShadow: isSuper ? "0 0 12px #f59e0b" : "none",
        animation: "fadeSlideUp 1.4s ease-out forwards",
        pointerEvents: "none",
        zIndex: 200,
        whiteSpace: "nowrap",
      }}
    >
      {isSuper ? "SUPER EFFECTIVE!" : "NOT VERY EFFECTIVE"}
    </div>
  );
}
