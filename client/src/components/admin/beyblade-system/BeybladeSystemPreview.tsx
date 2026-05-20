/**
 * BeybladeSystemPreview — three-panel 2.5D preview container.
 * Composes SideProfileView + TopDownView + IsometricView + ComputedStatsPanel.
 */

import { useState } from "react";
import { C } from "@/styles/theme";
import { SideProfileView } from "./SideProfileView";
import { TopDownView } from "./TopDownView";
import { IsometricView } from "./IsometricView";
import { ComputedStatsPanel } from "./ComputedStatsPanel";
import type { ResolvedBeybladeSystem } from "@/lib/beybladeSystemConverter";

type PreviewTab = "3panel" | "side" | "top" | "iso" | "stats";

const TABS: Array<{ key: PreviewTab; label: string }> = [
  { key: "3panel", label: "All Panels" },
  { key: "side",   label: "Side" },
  { key: "top",    label: "Top-Down" },
  { key: "iso",    label: "Isometric" },
  { key: "stats",  label: "Stats" },
];

interface Props {
  resolved: ResolvedBeybladeSystem | null | undefined;
}

export function BeybladeSystemPreview({ resolved }: Props) {
  const [tab, setTab] = useState<PreviewTab>("3panel");

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 0, height: "100%" }}>
      {/* Tab strip */}
      <div style={{ display: "flex", gap: 2, padding: "6px 12px 0", borderBottom: `1px solid ${C.border}`, background: C.bg1, flexShrink: 0 }}>
        {TABS.map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            style={{
              padding: "5px 10px", fontSize: 11, borderRadius: "5px 5px 0 0", cursor: "pointer",
              background: tab === t.key ? C.bg0 : "transparent",
              color: tab === t.key ? C.text : C.muted,
              border: `1px solid ${tab === t.key ? C.border : "transparent"}`,
              borderBottom: tab === t.key ? `1px solid ${C.bg0}` : "none",
              marginBottom: tab === t.key ? -1 : 0,
            }}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div style={{ flex: 1, overflowY: "auto", padding: 12, background: C.bg0 }}>
        {tab === "3panel" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
              <div>
                <div style={{ fontSize: 10, color: C.faint, marginBottom: 4 }}>Side Profile</div>
                <SideProfileView resolved={resolved} />
              </div>
              <div>
                <TopDownView resolved={resolved} showMovementPath />
              </div>
            </div>
            <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
              <IsometricView resolved={resolved} />
              <div style={{ flex: 1, minWidth: 200, background: C.bg1, border: `1px solid ${C.border}`, borderRadius: 8 }}>
                <div style={{ fontSize: 10, color: C.faint, padding: "8px 14px 0" }}>Computed Stats</div>
                <ComputedStatsPanel resolved={resolved} />
              </div>
            </div>
          </div>
        )}

        {tab === "side"  && <SideProfileView resolved={resolved} width={320} height={380} />}
        {tab === "top"   && <TopDownView resolved={resolved} showMovementPath />}
        {tab === "iso"   && <IsometricView resolved={resolved} />}
        {tab === "stats" && (
          <div style={{ background: C.bg1, border: `1px solid ${C.border}`, borderRadius: 8, maxWidth: 320 }}>
            <ComputedStatsPanel resolved={resolved} />
          </div>
        )}
      </div>
    </div>
  );
}
