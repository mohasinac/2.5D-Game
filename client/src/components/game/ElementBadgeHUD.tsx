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
    <div className="flex gap-[3px] items-center">
      {elementTypes.map(elem => (
        <span
          key={elem}
          title={elem}
          className="inline-flex items-center justify-center rounded-full leading-none select-none border"
          style={{ width: px, height: px, background: `${ELEMENT_COLORS[elem]}33`, borderColor: `${ELEMENT_COLORS[elem]}88`, fontSize: font }}
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
      style={{ position: "absolute", top: "35%", left: "50%", transform: "translateX(-50%)", zIndex: 200 }}
      className={`font-extrabold text-[22px] tracking-[1px] pointer-events-none whitespace-nowrap [animation:fadeSlideUp_1.4s_ease-out_forwards] ${isSuper ? "text-[#facc15] [text-shadow:0_0_12px_#f59e0b]" : "text-[#94a3b8]"}`}
    >
      {isSuper ? "SUPER EFFECTIVE!" : "NOT VERY EFFECTIVE"}
    </div>
  );
}
