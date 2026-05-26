import { useState } from "react";
import { ArenaSystem } from "@/types/arenaSystem";
import { ArenaSystemTopDownView } from "./ArenaSystemTopDownView";
import { ArenaSystemSideView } from "./ArenaSystemSideView";
import { ArenaSystemIsometricView } from "./ArenaSystemIsometricView";
import { ArenaSystemOrbitalView } from "./ArenaSystemOrbitalView";
import { ArenaSystemStatsPanel } from "./ArenaSystemStatsPanel";

interface Props {
  arenaSystem: ArenaSystem;
}

type TabType = "all" | "top-down" | "side" | "isometric" | "orbital" | "stats";

export function ArenaSystemPreview({ arenaSystem }: Props) {
  const [activeTab, setActiveTab] = useState<TabType>("all");

  const tabs: Array<{ id: TabType; label: string }> = [
    { id: "all", label: "All Panels" },
    { id: "top-down", label: "Top-Down" },
    { id: "side", label: "Side" },
    { id: "isometric", label: "Isometric" },
    { id: "orbital", label: "Orbital" },
    { id: "stats", label: "Stats" },
  ];

  return (
    <div>
      {/* Tab bar */}
      <div className="flex gap-1 mb-4 border-b border-border pb-3">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-3 py-2 rounded text-xs font-semibold cursor-pointer transition-all duration-150 ${
              activeTab === tab.id
                ? "bg-blue text-white border-none"
                : "bg-transparent text-muted border border-border"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content */}
      {(activeTab === "all" || activeTab === "top-down") && (
        <div className={activeTab === "all" ? "mb-5" : ""}>
          <h4 className="text-muted text-[11px] mb-2 mt-0 uppercase">
            Top-Down View (Elevation Heatmap)
          </h4>
          <ArenaSystemTopDownView arenaSystem={arenaSystem} />
        </div>
      )}

      {(activeTab === "all" || activeTab === "side") && (
        <div className={activeTab === "all" ? "mb-5" : ""}>
          <h4 className="text-muted text-[11px] mb-2 mt-0 uppercase">
            Side View (Cross-Section Profile)
          </h4>
          <ArenaSystemSideView arenaSystem={arenaSystem} />
        </div>
      )}

      {(activeTab === "all" || activeTab === "isometric") && (
        <div className={activeTab === "all" ? "mb-5" : ""}>
          <h4 className="text-muted text-[11px] mb-2 mt-0 uppercase">
            Isometric View
          </h4>
          <ArenaSystemIsometricView arenaSystem={arenaSystem} />
        </div>
      )}

      {(activeTab === "all" || activeTab === "orbital") && (
        <div className={activeTab === "all" ? "mb-5" : ""}>
          <h4 className="text-muted text-[11px] mb-2 mt-0 uppercase">
            Orbital View (Physics Simulation)
          </h4>
          <ArenaSystemOrbitalView arenaSystem={arenaSystem} />
        </div>
      )}

      {(activeTab === "all" || activeTab === "stats") && (
        <div>
          <h4 className="text-muted text-[11px] mb-2 mt-0 uppercase">
            Computed Stats
          </h4>
          <ArenaSystemStatsPanel arenaSystem={arenaSystem} />
        </div>
      )}
    </div>
  );
}
