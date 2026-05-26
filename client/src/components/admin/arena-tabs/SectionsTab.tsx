// Phase 22 — Modular Arena Builder: Arena Sections tab.
// Manages ModularSectionConfig[] on the arena — visual drag-place + data form.

import { useState } from "react";
import { C } from "@/styles/theme";
import { CollapsibleSection } from "@/components/admin/CollapsibleSection";
import type { ArenaConfig, ModularSectionConfig } from "@/types/arenaConfigNew";
import { ArenaEditorCanvas } from "@/components/admin/ArenaEditorCanvas";
import type { PlacedFeature } from "@/components/admin/ArenaEditorCanvas";

interface Props {
  config: ArenaConfig;
  onChange: (updated: Partial<ArenaConfig>) => void;
}

const SECTION_TYPES = ["platform", "ramp", "pit_cover", "bridge", "wall_block", "custom"];

function makeId() { return `sec_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 6)}`; }

function sectionToFeature(s: ModularSectionConfig): PlacedFeature {
  return {
    id: s.id, type: s.type, x_cm: s.centerX_cm, y_cm: s.centerY_cm,
    width_cm: s.width_cm, height_cm: s.height_cm, floorIndex: s.floorIndex,
    color: "#44aaff", label: s.name || s.type,
  };
}

function featureToSection(f: PlacedFeature, existing: ModularSectionConfig): ModularSectionConfig {
  return { ...existing, centerX_cm: f.x_cm, centerY_cm: f.y_cm, width_cm: f.width_cm ?? existing.width_cm, height_cm: f.height_cm ?? existing.height_cm, floorIndex: f.floorIndex };
}

const DEFAULT_SECTION: Omit<ModularSectionConfig, "id"> = {
  name: "New Section", type: "platform",
  centerX_cm: 0, centerY_cm: 0, width_cm: 20, height_cm: 10, floorIndex: 0,
};

export default function SectionsTab({ config, onChange }: Props) {
  const sections = config.modularSections ?? [];
  const maxFloors = config.maxFloors ?? 1;
  const [selectedFloor, setSelectedFloor] = useState(0);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const arenaRadiusCm = Math.round(Math.min(config.width ?? 1080, config.height ?? 1080) * 0.45 / 24);

  const features: PlacedFeature[] = sections.map(sectionToFeature);

  const handleFeaturesChange = (updated: PlacedFeature[]) => {
    const newSections = updated.map(f => {
      const existing = sections.find(s => s.id === f.id) ?? { ...DEFAULT_SECTION, id: f.id };
      return featureToSection(f, existing);
    });
    onChange({ modularSections: newSections });
  };

  const addSection = () => {
    const newSec: ModularSectionConfig = { ...DEFAULT_SECTION, id: makeId(), floorIndex: selectedFloor };
    onChange({ modularSections: [...sections, newSec] });
  };

  const updateSection = (id: string, patch: Partial<ModularSectionConfig>) => {
    onChange({ modularSections: sections.map(s => s.id === id ? { ...s, ...patch } : s) });
  };

  const removeSection = (id: string) => {
    onChange({ modularSections: sections.filter(s => s.id !== id) });
    if (selectedId === id) setSelectedId(null);
  };

  const selected = selectedId ? sections.find(s => s.id === selectedId) : null;

  return (
    <CollapsibleSection title="Sections" badge={sections.length} storageKey="arena-sections-list" defaultOpen={true}>
    <div className="flex flex-col gap-4">
      <div className="flex justify-between items-center">
        <span className="text-[13px] text-muted">{sections.length} modular section{sections.length !== 1 ? "s" : ""}</span>
        <button
          onClick={addSection}
          className="py-[5px] px-[14px] bg-blue text-white border-none rounded-md text-xs font-medium cursor-pointer"
        >
          + Add Section
        </button>
      </div>

      {/* Canvas */}
      <ArenaEditorCanvas
        arenaRadiusCm={arenaRadiusCm}
        features={features}
        onFeaturesChange={handleFeaturesChange}
        selectedFloor={selectedFloor}
        onFloorChange={setSelectedFloor}
        maxFloors={maxFloors}
      />

      {/* Section list */}
      {sections.length === 0 ? (
        <div className="text-center py-[30px] text-faint">
          <div className="text-[28px] mb-1.5">🧩</div>
          <p className="text-[13px]">No sections yet. Click the canvas or use Add Section.</p>
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          {sections.map(s => (
            <div
              key={s.id}
              onClick={() => setSelectedId(s.id === selectedId ? null : s.id)}
              className="rounded-[10px] py-[10px] px-[14px] cursor-pointer border"
              style={{
                background: s.id === selectedId ? "rgba(68,170,255,0.12)" : C.bg3,
                borderColor: s.id === selectedId ? "#44aaff55" : C.border,
              }}
            >
              <div className="flex justify-between items-center">
                <span className="text-[13px] font-medium text-text">
                  {s.name || s.type} <span className="text-[10px] text-muted ml-1">floor {s.floorIndex}</span>
                </span>
                <div className="flex gap-2 text-[11px] text-muted">
                  <span>{s.width_cm}×{s.height_cm} cm</span>
                  <span>({s.centerX_cm},{s.centerY_cm})</span>
                  <button
                    onClick={e => { e.stopPropagation(); removeSection(s.id); }}
                    className="text-red bg-transparent border-none text-[11px] cursor-pointer p-0"
                  >Remove</button>
                </div>
              </div>

              {selected?.id === s.id && (
                <div className="mt-3 grid grid-cols-2 gap-2.5" onClick={e => e.stopPropagation()}>
                  <div>
                    <label className="block text-[11px] text-faint mb-0.5">Name</label>
                    <input
                      type="text" value={s.name}
                      onChange={e => updateSection(s.id, { name: e.target.value })}
                      className="w-full bg-bg2 border border-border text-text rounded-md py-1 px-2 text-xs box-border"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] text-faint mb-0.5">Type</label>
                    <select
                      value={s.type}
                      onChange={e => updateSection(s.id, { type: e.target.value })}
                      className="w-full bg-bg2 border border-border text-text rounded-md py-1 px-2 text-xs"
                    >
                      {SECTION_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                    </select>
                  </div>
                  {(["centerX_cm", "centerY_cm", "width_cm", "height_cm"] as const).map(field => (
                    <div key={field}>
                      <label className="block text-[11px] text-faint mb-0.5">
                        {field.replace(/_cm$/, " (cm)").replace(/([A-Z])/g, " $1").trim()}
                      </label>
                      <input
                        type="number" step={1} value={s[field]}
                        onChange={e => updateSection(s.id, { [field]: +e.target.value })}
                        className="w-full bg-bg2 border border-border text-text rounded-md py-1 px-2 text-xs box-border"
                      />
                    </div>
                  ))}
                  {maxFloors > 1 && (
                    <div>
                      <label className="block text-[11px] text-faint mb-0.5">Floor Index</label>
                      <input
                        type="number" min={0} max={maxFloors - 1} step={1} value={s.floorIndex}
                        onChange={e => updateSection(s.id, { floorIndex: Math.max(0, Math.min(maxFloors - 1, +e.target.value)) })}
                        className="w-20 bg-bg2 border border-border text-text rounded-md py-1 px-2 text-xs"
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
