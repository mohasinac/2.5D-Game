import { useState } from "react";
import { useTabFromUrl } from "@/hooks/useTabFromUrl";
import type { ArenaConfig } from "@/types/arenaConfigNew";
import ArenaPreview from "./ArenaPreview";
import { PreviewModal } from "@/components/ui/PreviewModal";
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
import TimelineTab from "./arena-tabs/TimelineTab";
import LinksTab from "./arena-tabs/LinksTab";
import SwitchesTab from "./arena-tabs/SwitchesTab";
import SectionsTab from "./arena-tabs/SectionsTab";
import LoopTracksTab from "./arena-tabs/LoopTracksTab";

interface Props {
  arena: ArenaConfig;
  onChange: (updated: Partial<ArenaConfig>) => void;
  onSave: () => void;
  saving?: boolean;
}

type TabId = "basics" | "walls" | "water" | "obstacles" | "turrets" | "portals" | "speedpaths" | "pits" | "features" | "boundary" | "timeline" | "links" | "switches" | "sections" | "looptracks";

const TABS: { id: TabId; label: string; icon: string; count?: (a: ArenaConfig) => number }[] = [
  { id: "basics",     label: "Basics",      icon: "⚙️" },
  { id: "walls",      label: "Walls",       icon: "🧱" },
  { id: "water",      label: "Water",       icon: "💧", count: a => a.waterBodies?.length ?? 0 },
  { id: "obstacles",  label: "Obstacles",   icon: "🪨", count: a => a.obstacles?.length ?? 0 },
  { id: "turrets",    label: "Turrets",     icon: "🔫", count: a => a.turrets?.length ?? 0 },
  { id: "portals",    label: "Portals",     icon: "🌀", count: a => a.portals?.length ?? 0 },
  { id: "speedpaths", label: "Speed Paths", icon: "⚡", count: a => a.speedPaths?.length ?? 0 },
  { id: "pits",       label: "Pits",        icon: "🕳️", count: a => a.pits?.length ?? 0 },
  { id: "features",   label: "Features",    icon: "✨",  count: a =>
      (a.floorHazardZones?.length ?? 0) + (a.elevationZones?.length ?? 0) +
      ((a as any).effectZones?.length ?? 0) + (a.spinZones?.length ?? 0) +
      (a.gravityHoles?.length ?? 0) + (a.bumps?.length ?? 0) +
      ((a as any).directionalZones?.length ?? 0) + ((a as any).triggerZones?.length ?? 0) },
  { id: "boundary",   label: "Boundary",    icon: "⭕",  count: a => a.shrink ? 1 : 0 },
  { id: "timeline",   label: "Timeline",    icon: "⏱",  count: a => a.arenaTimeline?.length ?? 0 },
  { id: "links",      label: "Links",       icon: "🔗",  count: a => (a as any).links?.length ?? 0 },
  { id: "switches",   label: "Switches",    icon: "🔀",  count: a => (a as any).switches?.length ?? 0 },
  { id: "sections",   label: "Sections",    icon: "🧩",  count: a => a.modularSections?.length ?? 0 },
  { id: "looptracks", label: "Loop Tracks", icon: "🔄",  count: a => a.loopTracks?.length ?? 0 },
];

export default function ArenaConfigurator({ arena, onChange, onSave, saving }: Props) {
  const [tab, setTab] = useTabFromUrl("basics") as [TabId, (t: TabId) => void];

  return (
    <div className="flex flex-col gap-3">
      {/* Tab bar + Preview button */}
      <div className="flex items-center gap-2">
        <div className="flex-1 flex gap-1 bg-bg2 rounded-xl p-1 border border-border-c overflow-x-auto">
          {TABS.map(t => {
            const count = t.count?.(arena);
            const isActive = tab === t.id;
            return (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                className={`flex items-center gap-[5px] px-3 py-[7px] rounded-lg text-[12px] font-medium cursor-pointer whitespace-nowrap border-none relative ${isActive ? "bg-[var(--purple)] text-white" : "bg-transparent text-theme-muted"}`}
              >
                <span>{t.icon}</span>
                <span>{t.label}</span>
                {count != null && count > 0 && (
                  <span
                    className={`rounded-lg text-[10px] font-bold px-[5px] leading-4 ${isActive ? "text-white bg-white/30" : "text-white bg-[var(--purple)]"}`}
                  >
                    {count}
                  </span>
                )}
              </button>
            );
          })}
        </div>
        <PreviewModal title="Arena Preview" size="xl" label="Preview">
          <ArenaPreview arena={arena} />
        </PreviewModal>
      </div>

      {/* Tab content */}
      <div className="bg-bg2 border border-border-c rounded-2xl p-5 min-h-[300px]">
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
        {tab === "timeline"   && <TimelineTab config={arena} onChange={onChange} />}
        {tab === "links"      && <LinksTab config={arena} onChange={onChange} />}
        {tab === "switches"   && <SwitchesTab config={arena} onChange={onChange} />}
        {tab === "sections"   && <SectionsTab config={arena} onChange={onChange} />}
        {tab === "looptracks" && <LoopTracksTab config={arena} onChange={onChange} />}
      </div>

      {/* Save button */}
      <div className="flex justify-end">
        <button
          onClick={onSave}
          disabled={saving}
          className={`px-6 py-[9px] rounded-lg text-[13px] font-semibold border-none cursor-pointer bg-[var(--purple)] text-white ${saving ? "opacity-50" : "opacity-100"}`}
        >
          {saving ? "Saving…" : "Save Arena"}
        </button>
      </div>
    </div>
  );
}
