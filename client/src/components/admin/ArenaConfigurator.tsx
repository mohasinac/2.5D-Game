import { useState } from "react";
import { useTabFromUrl } from "@/hooks/useTabFromUrl";
import { C } from "@/styles/theme";
import type { ArenaConfig } from "@/types/arenaConfigNew";
import ArenaPreview from "./ArenaPreview";
import BasicsTab from "./arena-tabs/BasicsTab";
import WaterBodiesTab from "./arena-tabs/WaterBodiesTab";
import ObstaclesTab from "./arena-tabs/ObstaclesTab";
import TurretsTab from "./arena-tabs/TurretsTab";
import PortalsTab from "./arena-tabs/PortalsTab";
import SpeedPathsTab from "./arena-tabs/SpeedPathsTab";
import PitsTab from "./arena-tabs/PitsTab";
import WallsTab from "./arena-tabs/WallsTab";
import FeaturesTab from "./arena-tabs/FeaturesTab";
import BoundaryTab from "./arena-tabs/BoundaryTab";

interface Props {
  arena: ArenaConfig;
  onChange: (updated: Partial<ArenaConfig>) => void;
  onSave: () => void;
  saving?: boolean;
}

type TabId = "basics" | "walls" | "water" | "obstacles" | "turrets" | "portals" | "speedpaths" | "pits" | "features" | "boundary";

const TABS: { id: TabId; label: string; icon: string; count?: (a: ArenaConfig) => number }[] = [
  { id: "basics",     label: "Basics",      icon: "⚙️" },
  { id: "walls",      label: "Walls",       icon: "🧱" },
  { id: "water",      label: "Water",       icon: "💧", count: a => a.waterBodies?.length ?? 0 },
  { id: "obstacles",  label: "Obstacles",   icon: "🪨", count: a => a.obstacles?.length ?? 0 },
  { id: "turrets",    label: "Turrets",     icon: "🔫", count: a => a.turrets?.length ?? 0 },
  { id: "portals",    label: "Portals",     icon: "🌀", count: a => a.portals?.length ?? 0 },
  { id: "speedpaths", label: "Speed Paths", icon: "⚡", count: a => a.speedPaths?.length ?? 0 },
  { id: "pits",       label: "Pits",        icon: "🕳️", count: a => a.pits?.length ?? 0 },
  { id: "features",   label: "Features",    icon: "✨",  count: a => (a.floorHazardZones?.length ?? 0) + (a.elevationZones?.length ?? 0) + ((a as any).effectZones?.length ?? 0) },
  { id: "boundary",   label: "Boundary",    icon: "⭕",  count: a => a.shrink ? 1 : 0 },
];

export default function ArenaConfigurator({ arena, onChange, onSave, saving }: Props) {
  const [tab, setTab] = useTabFromUrl("basics") as [TabId, (t: TabId) => void];

  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 420px", gap: 20, alignItems: "start" }}>
      {/* Left: tab editor */}
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {/* Tab bar */}
        <div style={{ display: "flex", gap: 4, background: C.bg2, borderRadius: 12, padding: 4, border: `1px solid ${C.border}`, overflowX: "auto" }}>
          {TABS.map(t => {
            const count = t.count?.(arena);
            return (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                style={{
                  display: "flex", alignItems: "center", gap: 5, padding: "7px 12px",
                  borderRadius: 8, fontSize: 12, fontWeight: 500, cursor: "pointer", whiteSpace: "nowrap", border: "none",
                  background: tab === t.id ? C.purple : "transparent",
                  color: tab === t.id ? C.white : C.muted,
                  position: "relative",
                }}
              >
                <span>{t.icon}</span>
                <span>{t.label}</span>
                {count != null && count > 0 && (
                  <span style={{
                    background: tab === t.id ? "rgba(255,255,255,0.3)" : C.purple,
                    color: C.white, borderRadius: 8, fontSize: 10, fontWeight: 700,
                    padding: "0 5px", lineHeight: "16px",
                  }}>
                    {count}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Tab content */}
        <div style={{ background: C.bg2, border: `1px solid ${C.border}`, borderRadius: 16, padding: 20, minHeight: 300 }}>
          {tab === "basics"     && <BasicsTab config={arena} onChange={onChange} />}
          {tab === "walls"      && <WallsTab config={arena} onChange={onChange} />}
          {tab === "water"      && <WaterBodiesTab config={arena} onChange={onChange} />}
          {tab === "obstacles"  && <ObstaclesTab config={arena} onChange={onChange} />}
          {tab === "turrets"    && <TurretsTab config={arena} onChange={onChange} />}
          {tab === "portals"    && <PortalsTab config={arena} onChange={onChange} />}
          {tab === "speedpaths" && <SpeedPathsTab config={arena} onChange={onChange} />}
          {tab === "pits"       && <PitsTab config={arena} onChange={onChange} />}
          {tab === "features"   && <FeaturesTab config={arena} onChange={onChange} />}
          {tab === "boundary"   && <BoundaryTab config={arena} onChange={onChange} />}
        </div>

        {/* Save button */}
        <div style={{ display: "flex", justifyContent: "flex-end" }}>
          <button
            onClick={onSave}
            disabled={saving}
            style={{
              padding: "9px 24px", background: C.purple, color: C.white, borderRadius: 8,
              fontSize: 13, fontWeight: 600, border: "none", cursor: "pointer",
              opacity: saving ? 0.5 : 1,
            }}
          >
            {saving ? "Saving…" : "Save Arena"}
          </button>
        </div>
      </div>

      {/* Right: live preview */}
      <div style={{ position: "sticky", top: 80 }}>
        <ArenaPreview arena={arena} width={400} />
      </div>
    </div>
  );
}
