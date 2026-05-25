// Phase 22 — Modular Arena Builder: Loop Tracks tab.
// Manages LoopTrackConfig[] — circular speed tracks with bank angle + boost.

import { useState } from "react";
import { C } from "@/styles/theme";
import { CollapsibleSection } from "@/components/admin/CollapsibleSection";
import type { ArenaConfig, LoopTrackConfig } from "@/types/arenaConfigNew";
import { ArenaEditorCanvas } from "@/components/admin/ArenaEditorCanvas";
import type { PlacedFeature } from "@/components/admin/ArenaEditorCanvas";

interface Props {
  config: ArenaConfig;
  onChange: (updated: Partial<ArenaConfig>) => void;
}

function makeId() { return `lt_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 6)}`; }

function trackToFeature(t: LoopTrackConfig): PlacedFeature {
  return {
    id: t.id, type: "loop_track", x_cm: t.centerX_cm, y_cm: t.centerY_cm,
    radiusCm: t.radiusCm, floorIndex: t.floorIndex,
    color: "#ff9944", label: `×${t.speedBoostMultiplier.toFixed(1)}`,
  };
}

function featureToTrack(f: PlacedFeature, existing: LoopTrackConfig): LoopTrackConfig {
  return { ...existing, centerX_cm: f.x_cm, centerY_cm: f.y_cm, radiusCm: f.radiusCm ?? existing.radiusCm, floorIndex: f.floorIndex };
}

const DEFAULT_TRACK: Omit<LoopTrackConfig, "id"> = {
  centerX_cm: 0, centerY_cm: 0, radiusCm: 20, bankAngle: 30, speedBoostMultiplier: 1.5, floorIndex: 0,
};

export default function LoopTracksTab({ config, onChange }: Props) {
  const tracks = config.loopTracks ?? [];
  const maxFloors = config.maxFloors ?? 1;
  const [selectedFloor, setSelectedFloor] = useState(0);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const arenaRadiusCm = Math.round(Math.min(config.width ?? 1080, config.height ?? 1080) * 0.45 / 24);

  const features: PlacedFeature[] = tracks.map(trackToFeature);

  const handleFeaturesChange = (updated: PlacedFeature[]) => {
    const newTracks = updated.map(f => {
      const existing = tracks.find(t => t.id === f.id) ?? { ...DEFAULT_TRACK, id: f.id };
      return featureToTrack(f, existing);
    });
    onChange({ loopTracks: newTracks });
  };

  const addTrack = () => {
    const t: LoopTrackConfig = { ...DEFAULT_TRACK, id: makeId(), floorIndex: selectedFloor };
    onChange({ loopTracks: [...tracks, t] });
  };

  const updateTrack = (id: string, patch: Partial<LoopTrackConfig>) => {
    onChange({ loopTracks: tracks.map(t => t.id === id ? { ...t, ...patch } : t) });
  };

  const removeTrack = (id: string) => {
    onChange({ loopTracks: tracks.filter(t => t.id !== id) });
    if (selectedId === id) setSelectedId(null);
  };

  const selected = selectedId ? tracks.find(t => t.id === selectedId) : null;

  return (
    <CollapsibleSection title="Loop Tracks" badge={tracks.length} storageKey="arena-looptracks-list" defaultOpen={true}>
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span style={{ fontSize: 13, color: C.muted }}>{tracks.length} loop track{tracks.length !== 1 ? "s" : ""}</span>
        <button
          onClick={addTrack}
          style={{ padding: "5px 14px", background: C.orange ?? "#ff9944", color: C.white, border: "none", borderRadius: 6, fontSize: 12, fontWeight: 500, cursor: "pointer" }}
        >
          + Add Loop Track
        </button>
      </div>

      {/* Canvas — loop tracks show as circles */}
      <ArenaEditorCanvas
        arenaRadiusCm={arenaRadiusCm}
        features={features}
        onFeaturesChange={handleFeaturesChange}
        selectedFloor={selectedFloor}
        onFloorChange={setSelectedFloor}
        maxFloors={maxFloors}
      />

      {/* Track list */}
      {tracks.length === 0 ? (
        <div style={{ textAlign: "center", padding: "30px 0", color: C.faint }}>
          <div style={{ fontSize: 28, marginBottom: 6 }}>🔄</div>
          <p style={{ fontSize: 13 }}>No loop tracks yet. Loop tracks give beyblades a speed boost when traversed.</p>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {tracks.map(t => (
            <div
              key={t.id}
              onClick={() => setSelectedId(t.id === selectedId ? null : t.id)}
              style={{
                background: t.id === selectedId ? "rgba(255,153,68,0.1)" : C.bg3,
                border: `1px solid ${t.id === selectedId ? "#ff994455" : C.border}`,
                borderRadius: 10, padding: "10px 14px", cursor: "pointer",
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontSize: 13, fontWeight: 500, color: C.text }}>
                  Loop Track <span style={{ fontSize: 10, color: "#ff9944", marginLeft: 4 }}>×{t.speedBoostMultiplier.toFixed(1)} boost</span>
                  <span style={{ fontSize: 10, color: C.muted, marginLeft: 6 }}>floor {t.floorIndex}</span>
                </span>
                <div style={{ display: "flex", gap: 8, fontSize: 11, color: C.muted }}>
                  <span>r={t.radiusCm}cm @ ({t.centerX_cm},{t.centerY_cm})</span>
                  <button
                    onClick={e => { e.stopPropagation(); removeTrack(t.id); }}
                    style={{ color: C.red, background: "none", border: "none", fontSize: 11, cursor: "pointer", padding: 0 }}
                  >Remove</button>
                </div>
              </div>

              {selected?.id === t.id && (
                <div style={{ marginTop: 12, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }} onClick={e => e.stopPropagation()}>
                  {([
                    ["centerX_cm", "Center X (cm)", -200, 200, 1],
                    ["centerY_cm", "Center Y (cm)", -200, 200, 1],
                    ["radiusCm", "Radius (cm)", 5, 60, 1],
                    ["bankAngle", "Bank Angle (°)", 0, 75, 5],
                    ["speedBoostMultiplier", "Speed Boost ×", 1.0, 3.0, 0.1],
                  ] as [keyof LoopTrackConfig, string, number, number, number][]).map(([field, label, min, max, step]) => (
                    <div key={field}>
                      <label style={{ display: "block", fontSize: 11, color: C.faint, marginBottom: 3 }}>{label}</label>
                      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                        <input
                          type="range" min={min} max={max} step={step}
                          value={t[field] as number}
                          onChange={e => updateTrack(t.id, { [field]: +e.target.value })}
                          style={{ flex: 1, accentColor: "#ff9944" }}
                        />
                        <span style={{ fontSize: 11, color: C.text, fontFamily: "monospace", minWidth: 36, textAlign: "right" }}>
                          {typeof t[field] === "number" ? (t[field] as number).toFixed(step < 1 ? 1 : 0) : t[field]}
                        </span>
                      </div>
                    </div>
                  ))}
                  {maxFloors > 1 && (
                    <div>
                      <label style={{ display: "block", fontSize: 11, color: C.faint, marginBottom: 3 }}>Floor Index</label>
                      <input
                        type="number" min={0} max={maxFloors - 1} step={1} value={t.floorIndex}
                        onChange={e => updateTrack(t.id, { floorIndex: Math.max(0, Math.min(maxFloors - 1, +e.target.value)) })}
                        style={{ width: 80, background: C.bg2, border: `1px solid ${C.border}`, color: C.text, borderRadius: 6, padding: "4px 8px", fontSize: 12 }}
                      />
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
    </CollapsibleSection>
  );
}
