import { useState } from "react";
import { ArenaSystem } from "@/types/arenaSystem";
import { C } from "@/styles/theme";
import { ArenaSystemPreview } from "./ArenaSystemPreview";
import { SearchableSelect } from "@/components/admin/SearchableSelect";

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
      {/* Tab bar */}
      <div style={{ display: "flex", gap: 4, marginBottom: 16, borderBottom: `1px solid ${C.border}`, paddingBottom: 12 }}>
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            style={{
              padding: "8px 12px",
              background: activeTab === tab.id ? C.blue : "transparent",
              color: activeTab === tab.id ? C.white : C.muted,
              border: activeTab === tab.id ? "none" : `1px solid ${C.border}`,
              borderRadius: 4,
              fontSize: 12,
              fontWeight: 600,
              cursor: "pointer",
              transition: "all 150ms",
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Overview Tab */}
      {activeTab === "overview" && (
        <div style={{ background: C.bg1, borderRadius: 8, border: `1px solid ${C.border}`, padding: 16 }}>
          <div style={{ marginBottom: 16 }}>
            <label style={{ color: C.text, fontSize: 12, fontWeight: 600, display: "block", marginBottom: 4 }}>
              Display Name
            </label>
            <input
              type="text"
              value={arenaSystem.displayName}
              onChange={(e) => updateArena({ displayName: e.target.value })}
              style={{
                width: "100%",
                padding: "8px 12px",
                background: C.bg0,
                color: C.text,
                border: `1px solid ${C.border}`,
                borderRadius: 4,
                fontSize: 12,
              }}
            />
          </div>

          <div style={{ marginBottom: 16 }}>
            <label style={{ color: C.text, fontSize: 12, fontWeight: 600, display: "block", marginBottom: 4 }}>
              Description
            </label>
            <textarea
              value={arenaSystem.description || ""}
              onChange={(e) => updateArena({ description: e.target.value })}
              style={{
                width: "100%",
                padding: "8px 12px",
                background: C.bg0,
                color: C.text,
                border: `1px solid ${C.border}`,
                borderRadius: 4,
                fontSize: 12,
                minHeight: 60,
                fontFamily: "monospace",
              }}
            />
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 16 }}>
            <div>
              <label style={{ color: C.text, fontSize: 12, fontWeight: 600, display: "block", marginBottom: 4 }}>
                Shape
              </label>
              <SearchableSelect
                value={arenaSystem.shape}
                options={[{ value: "circle", label: "Circle" }, { value: "hexagon", label: "Hexagon" }, { value: "rectangle", label: "Rectangle" }]}
                onChange={(v) => updateArena({ shape: v as any })}
                style={{ width: "100%", background: C.bg0, color: C.text, border: `1px solid ${C.border}`, borderRadius: 4, fontSize: 12 }}
              />
            </div>

            <div>
              <label style={{ color: C.text, fontSize: 12, fontWeight: 600, display: "block", marginBottom: 4 }}>
                Difficulty
              </label>
              <SearchableSelect
                value={arenaSystem.difficulty || "medium"}
                options={[{ value: "easy", label: "Easy" }, { value: "medium", label: "Medium" }, { value: "hard", label: "Hard" }, { value: "extreme", label: "Extreme" }]}
                onChange={(v) => updateArena({ difficulty: v as any })}
                style={{ width: "100%", background: C.bg0, color: C.text, border: `1px solid ${C.border}`, borderRadius: 4, fontSize: 12 }}
              />
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 16 }}>
            <div>
              <label style={{ color: C.text, fontSize: 12, fontWeight: 600, display: "block", marginBottom: 4 }}>
                Width (px)
              </label>
              <input
                type="number"
                value={arenaSystem.width}
                onChange={(e) => updateArena({ width: parseInt(e.target.value) })}
                style={{
                  width: "100%",
                  padding: "8px 12px",
                  background: C.bg0,
                  color: C.text,
                  border: `1px solid ${C.border}`,
                  borderRadius: 4,
                  fontSize: 12,
                }}
              />
            </div>

            <div>
              <label style={{ color: C.text, fontSize: 12, fontWeight: 600, display: "block", marginBottom: 4 }}>
                Height (px)
              </label>
              <input
                type="number"
                value={arenaSystem.height}
                onChange={(e) => updateArena({ height: parseInt(e.target.value) })}
                style={{
                  width: "100%",
                  padding: "8px 12px",
                  background: C.bg0,
                  color: C.text,
                  border: `1px solid ${C.border}`,
                  borderRadius: 4,
                  fontSize: 12,
                }}
              />
            </div>
          </div>

          <div>
            <label style={{ color: C.text, fontSize: 12, fontWeight: 600, display: "block", marginBottom: 4 }}>
              Theme
            </label>
            <SearchableSelect
              value={arenaSystem.theme}
              options={["volcano","mountains","sea","forest","stone","ice","grass","space"].map(t => ({ value: t, label: t.charAt(0).toUpperCase() + t.slice(1) }))}
              onChange={(v) => updateArena({ theme: v as any })}
              style={{ width: "100%", background: C.bg0, color: C.text, border: `1px solid ${C.border}`, borderRadius: 4, fontSize: 12 }}
            />
          </div>
        </div>
      )}

      {/* Elevation Tab */}
      {activeTab === "elevation" && (
        <div style={{ background: C.bg1, borderRadius: 8, border: `1px solid ${C.border}`, padding: 16 }}>
          <div style={{ marginBottom: 16 }}>
            <label style={{ color: C.text, fontSize: 12, fontWeight: 600, display: "block", marginBottom: 4 }}>
              Elevation Type
            </label>
            <SearchableSelect
              value={arenaSystem.elevationMap.type}
              options={[{ value: "flat", label: "Flat" }, { value: "bowl", label: "Bowl" }, { value: "ramp", label: "Ramp" }, { value: "pyramid", label: "Pyramid" }]}
              onChange={(v) => updateArena({ elevationMap: { ...arenaSystem.elevationMap, type: v as any } })}
              style={{ width: "100%", background: C.bg0, color: C.text, border: `1px solid ${C.border}`, borderRadius: 4, fontSize: 12 }}
            />
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <div>
              <label style={{ color: C.text, fontSize: 12, fontWeight: 600, display: "block", marginBottom: 4 }}>
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
                style={{ width: "100%" }}
              />
            </div>

            <div>
              <label style={{ color: C.text, fontSize: 12, fontWeight: 600, display: "block", marginBottom: 4 }}>
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
                style={{ width: "100%" }}
              />
            </div>
          </div>
        </div>
      )}

      {/* Wall Profile Tab */}
      {activeTab === "wall" && (
        <div style={{ background: C.bg1, borderRadius: 8, border: `1px solid ${C.border}`, padding: 16 }}>
          <div style={{ marginBottom: 16 }}>
            <label style={{ color: C.text, fontSize: 12, fontWeight: 600, display: "block", marginBottom: 4 }}>
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
              style={{ width: "100%" }}
            />
          </div>
          <p style={{ color: C.muted, fontSize: 11, marginTop: 8 }}>Custom wall height segments coming soon</p>
        </div>
      )}

      {/* Slope Physics Tab */}
      {activeTab === "physics" && (
        <div style={{ background: C.bg1, borderRadius: 8, border: `1px solid ${C.border}`, padding: 16 }}>
          <div style={{ marginBottom: 16 }}>
            <label style={{ color: C.text, fontSize: 12, fontWeight: 600, display: "block", marginBottom: 4 }}>
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
              style={{ width: "100%" }}
            />
          </div>
          <p style={{ color: C.muted, fontSize: 11, marginTop: 8 }}>
            Friction zones: {arenaSystem.slopePhysics.frictionMap?.length ?? 0} configured
          </p>
          <p style={{ color: C.muted, fontSize: 11, marginTop: 4 }}>Friction zone editor coming soon</p>
        </div>
      )}

      {/* Features Tab */}
      {activeTab === "features" && (
        <div style={{ background: C.bg1, borderRadius: 8, border: `1px solid ${C.border}`, padding: 16 }}>
          <p style={{ color: C.muted, fontSize: 11, marginTop: 0 }}>
            Obstacles, turrets, water bodies, pits, and portals can be configured here.
          </p>
          <p style={{ color: C.muted, fontSize: 11, marginTop: 8 }}>Feature editor coming soon</p>
        </div>
      )}

      {/* Preview Tab */}
      {activeTab === "preview" && (
        <div>
          <ArenaSystemPreview arenaSystem={arenaSystem} />
        </div>
      )}

      {/* Save button */}
      <div style={{ marginTop: 20, display: "flex", gap: 8 }}>
        <button
          onClick={onSave}
          disabled={isSaving}
          style={{
            padding: "12px 24px",
            background: C.blue,
            color: C.white,
            border: "none",
            borderRadius: 6,
            fontSize: 12,
            fontWeight: 700,
            cursor: "pointer",
            opacity: isSaving ? 0.6 : 1,
          }}
        >
          {isSaving ? "Saving..." : "Save Arena System"}
        </button>
      </div>
    </div>
  );
}
