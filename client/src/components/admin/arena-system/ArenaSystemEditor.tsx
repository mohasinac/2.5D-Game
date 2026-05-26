import { useState } from "react";
import { ArenaSystem } from "@/types/arenaSystem";
import { ArenaSystemPreview } from "./ArenaSystemPreview";
import { SearchableSelect } from "@/components/admin/SearchableSelect";
import { PX_PER_CM_BASE } from "@/constants/units";
import { TabDropdown } from "@/components/ui/TabDropdown";

interface Props {
  arenaSystem: ArenaSystem;
  onChange: (updated: ArenaSystem) => void;
  onSave: () => void;
  isSaving?: boolean;
}

type EditorTab = "overview" | "elevation" | "wall" | "physics" | "features" | "preview";

export function ArenaSystemEditor({ arenaSystem, onChange, onSave, isSaving }: Props) {
  const [activeTab, setActiveTab] = useState<EditorTab>("overview");

  const tabs: Array<{ id: EditorTab; label: string }> = [
    { id: "overview", label: "Overview" },
    { id: "elevation", label: "Elevation Map" },
    { id: "wall", label: "Wall Profile" },
    { id: "physics", label: "Slope Physics" },
    { id: "features", label: "Features" },
    { id: "preview", label: "Preview" },
  ];

  const updateArena = (updates: Partial<ArenaSystem>) => {
    onChange({ ...arenaSystem, ...updates });
  };

  return (
    <div>
      {/* Tab dropdown */}
      <div className="mb-4 border-b border-border pb-3">
        <TabDropdown
          tabs={tabs.map(t => ({ key: t.id, label: t.label }))}
          value={activeTab}
          onChange={(k) => setActiveTab(k as EditorTab)}
        />
      </div>

      {/* Overview Tab */}
      {activeTab === "overview" && (
        <div className="bg-bg1 rounded-lg border border-border p-4">
          <div className="mb-4">
            <label className="text-text text-xs font-semibold block mb-1">
              Display Name
            </label>
            <input
              type="text"
              value={arenaSystem.displayName}
              onChange={(e) => updateArena({ displayName: e.target.value })}
              className="w-full px-3 py-2 bg-bg0 text-text border border-border rounded text-xs"
            />
          </div>

          <div className="mb-4">
            <label className="text-text text-xs font-semibold block mb-1">
              Description
            </label>
            <textarea
              value={arenaSystem.description || ""}
              onChange={(e) => updateArena({ description: e.target.value })}
              className="w-full px-3 py-2 bg-bg0 text-text border border-border rounded text-xs min-h-[60px] font-mono resize-y"
            />
          </div>

          <div className="grid grid-cols-2 gap-3 mb-4">
            <div>
              <label className="text-text text-xs font-semibold block mb-1">
                Shape
              </label>
              <SearchableSelect
                value={arenaSystem.shape}
                options={[{ value: "circle", label: "Circle" }, { value: "hexagon", label: "Hexagon" }, { value: "rectangle", label: "Rectangle" }]}
                onChange={(v) => updateArena({ shape: v as any })}
              />
            </div>

            <div>
              <label className="text-text text-xs font-semibold block mb-1">
                Difficulty
              </label>
              <SearchableSelect
                value={arenaSystem.difficulty || "medium"}
                options={[{ value: "easy", label: "Easy" }, { value: "medium", label: "Medium" }, { value: "hard", label: "Hard" }, { value: "extreme", label: "Extreme" }]}
                onChange={(v) => updateArena({ difficulty: v as any })}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 mb-1">
            <div>
              <label className="text-text text-xs font-semibold block mb-1">
                Width (cm)
              </label>
              <input
                type="number"
                min={10} max={100} step={1}
                value={Math.round(arenaSystem.width / PX_PER_CM_BASE)}
                onChange={(e) => updateArena({ width: Math.round(Math.max(10, parseFloat(e.target.value) || 10) * PX_PER_CM_BASE) })}
                className="w-full px-3 py-2 bg-bg0 text-text border border-border rounded text-xs"
              />
            </div>

            <div>
              <label className="text-text text-xs font-semibold block mb-1">
                Height (cm)
              </label>
              <input
                type="number"
                min={10} max={100} step={1}
                value={Math.round(arenaSystem.height / PX_PER_CM_BASE)}
                onChange={(e) => updateArena({ height: Math.round(Math.max(10, parseFloat(e.target.value) || 10) * PX_PER_CM_BASE) })}
                className="w-full px-3 py-2 bg-bg0 text-text border border-border rounded text-xs"
              />
            </div>
          </div>
          <p className="text-[11px] text-faint mb-4">
            Stored as {arenaSystem.width} × {arenaSystem.height} px internally
          </p>

          <div>
            <label className="text-text text-xs font-semibold block mb-1">
              Theme
            </label>
            <SearchableSelect
              value={arenaSystem.theme}
              options={["volcano","mountains","sea","forest","stone","ice","grass","space"].map(t => ({ value: t, label: t.charAt(0).toUpperCase() + t.slice(1) }))}
              onChange={(v) => updateArena({ theme: v as any })}
            />
          </div>
        </div>
      )}

      {/* Elevation Tab */}
      {activeTab === "elevation" && (
        <div className="bg-bg1 rounded-lg border border-border p-4">
          <div className="mb-4">
            <label className="text-text text-xs font-semibold block mb-1">
              Elevation Type
            </label>
            <SearchableSelect
              value={arenaSystem.elevationMap.type}
              options={[{ value: "flat", label: "Flat" }, { value: "bowl", label: "Bowl" }, { value: "ramp", label: "Ramp" }, { value: "pyramid", label: "Pyramid" }]}
              onChange={(v) => updateArena({ elevationMap: { ...arenaSystem.elevationMap, type: v as any } })}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-text text-xs font-semibold block mb-1">
                Tilt Angle: {arenaSystem.elevationMap.tiltAngle}°
              </label>
              <input
                type="range"
                min="0"
                max="30"
                value={arenaSystem.elevationMap.tiltAngle || 0}
                onChange={(e) =>
                  updateArena({
                    elevationMap: {
                      ...arenaSystem.elevationMap,
                      tiltAngle: parseInt(e.target.value),
                    },
                  })
                }
                className="w-full"
              />
            </div>

            <div>
              <label className="text-text text-xs font-semibold block mb-1">
                Tilt Direction: {arenaSystem.elevationMap.tiltDirection}°
              </label>
              <input
                type="range"
                min="0"
                max="360"
                value={arenaSystem.elevationMap.tiltDirection || 0}
                onChange={(e) =>
                  updateArena({
                    elevationMap: {
                      ...arenaSystem.elevationMap,
                      tiltDirection: parseInt(e.target.value),
                    },
                  })
                }
                className="w-full"
              />
            </div>
          </div>
        </div>
      )}

      {/* Wall Profile Tab */}
      {activeTab === "wall" && (
        <div className="bg-bg1 rounded-lg border border-border p-4">
          <div className="mb-4">
            <label className="text-text text-xs font-semibold block mb-1">
              Base Height (mm): {arenaSystem.wallProfile.baseHeight}
            </label>
            <input
              type="range"
              min="50"
              max="200"
              value={arenaSystem.wallProfile.baseHeight}
              onChange={(e) =>
                updateArena({
                  wallProfile: { ...arenaSystem.wallProfile, baseHeight: parseInt(e.target.value) },
                })
              }
              className="w-full"
            />
          </div>
          <p className="text-muted text-[11px] mt-2">Custom wall height segments coming soon</p>
        </div>
      )}

      {/* Slope Physics Tab */}
      {activeTab === "physics" && (
        <div className="bg-bg1 rounded-lg border border-border p-4">
          <div className="mb-4">
            <label className="text-text text-xs font-semibold block mb-1">
              Gravity Strength: {(arenaSystem.slopePhysics.gravityStrength * 100).toFixed(0)}%
            </label>
            <input
              type="range"
              min="0"
              max="100"
              step="5"
              value={arenaSystem.slopePhysics.gravityStrength * 100}
              onChange={(e) =>
                updateArena({
                  slopePhysics: {
                    ...arenaSystem.slopePhysics,
                    gravityStrength: parseInt(e.target.value) / 100,
                  },
                })
              }
              className="w-full"
            />
          </div>
          <p className="text-muted text-[11px] mt-2">
            Friction zones: {arenaSystem.slopePhysics.frictionMap?.length ?? 0} configured
          </p>
          <p className="text-muted text-[11px] mt-1">Friction zone editor coming soon</p>
        </div>
      )}

      {/* Features Tab */}
      {activeTab === "features" && (
        <div className="bg-bg1 rounded-lg border border-border p-4">
          <p className="text-muted text-[11px] mt-0">
            Obstacles, turrets, water bodies, pits, and portals can be configured here.
          </p>
          <p className="text-muted text-[11px] mt-2">Feature editor coming soon</p>
        </div>
      )}

      {/* Preview Tab */}
      {activeTab === "preview" && (
        <div>
          <ArenaSystemPreview arenaSystem={arenaSystem} />
        </div>
      )}

      {/* Save button */}
      <div className="mt-5 flex gap-2">
        <button
          onClick={onSave}
          disabled={isSaving}
          className="px-6 py-3 bg-blue text-white border-none rounded text-xs font-bold cursor-pointer disabled:opacity-60"
        >
          {isSaving ? "Saving..." : "Save Arena System"}
        </button>
      </div>
    </div>
  );
}
