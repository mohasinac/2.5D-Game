import React from "react";
import { ArenaFeatureSection } from "./ArenaFeatureSection";
import type { ArenaConfig, WaterBodyConfig, LiquidType, ZoneWaterBodyConfig, MoatWaterBodyConfig } from "@/types/arenaConfigNew";
import { LIQUID_PRESETS } from "@/types/arenaConfigNew";
import { cn } from "@/lib/cn";
import SelfRotationPanel from "./SelfRotationPanel";
import { SearchableSelect } from "@/components/admin/SearchableSelect";
import { useAssetLibrary } from "@/hooks/useAssetLibrary";
import { COLLECTIONS } from "@/lib/firebase";

interface Props {
  config: ArenaConfig;
  onChange: (updated: Partial<ArenaConfig>) => void;
}

function makeId() { return `water_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`; }

const DEFAULT_ZONE: ZoneWaterBodyConfig = {
  id: "", type: "zone", liquidType: "water", shape: "circle",
  position: { x: 0, y: 0 }, radius: 5, opacity: 0.6,
};
const DEFAULT_MOAT: MoatWaterBodyConfig = {
  id: "", type: "moat", liquidType: "water",
  thickness: 3, distanceFromArena: 20, followsArenaShape: true, opacity: 0.6,
};

export default function WaterBodiesTab({ config, onChange }: Props) {
  const bodies = config.waterBodies ?? [];
  const { assets: waterAssets, loading: assetsLoading } = useAssetLibrary(COLLECTIONS.WATER_BODY_ASSETS);
  const assetOpts = waterAssets.map(a => ({ value: a.id, label: a.name ?? a.id, hint: a.tags?.join(", ") }));

  const add = (type: "zone" | "moat") => {
    if (bodies.length >= 3) return;
    const base = type === "moat" ? { ...DEFAULT_MOAT, id: makeId() } : { ...DEFAULT_ZONE, id: makeId() };
    onChange({ waterBodies: [...bodies, base as WaterBodyConfig] });
  };

  const remove = (id: string) => onChange({ waterBodies: bodies.filter(b => b.id !== id) });

  const update = (id: string, field: string, value: unknown) =>
    onChange({ waterBodies: bodies.map(b => b.id === id ? { ...b, [field]: value } : b) });

  const updatePos = (id: string, axis: "x" | "y", value: number) =>
    onChange({
      waterBodies: bodies.map(b =>
        b.id === id && b.type === "zone"
          ? { ...b, position: { ...(b as ZoneWaterBodyConfig).position, [axis]: value } }
          : b
      ),
    });

  return (
    <ArenaFeatureSection
      title="Water Bodies"
      storageKey="arena-water-list"
      items={bodies}
      maxItems={3}
      addVariants={[
        { label: "+ Zone", onClick: () => add("zone") },
        { label: "+ Moat", onClick: () => add("moat") },
      ]}
      onRemove={(id) => remove(id as string)}
      emptyIcon="💧"
      emptyText="No water bodies yet. Add a zone (free-floating) or moat (surrounding wall)."
      renderItemHeader={(wb, idx) => (
        <>Water Body #{idx + 1} — <span className="text-theme-muted capitalize">{wb.type}</span></>
      )}
      renderItemBody={(wb) => {
        const preset = LIQUID_PRESETS[wb.liquidType as LiquidType];
        return (
          <div className="flex flex-col gap-2.5">
            {/* Liquid type */}
            <div>
              <label className="block text-[11px] text-theme-faint mb-1.5">Liquid Type</label>
              <div className="grid grid-cols-4 gap-1.5">
                {(Object.keys(LIQUID_PRESETS) as LiquidType[]).map(lt => (
                  <button
                    key={lt}
                    onClick={() => update(wb.id, "liquidType", lt)}
                    title={LIQUID_PRESETS[lt].description}
                    className={cn("py-1 px-0.5 rounded-md text-[10px] font-medium cursor-pointer border transition-colors",
                      wb.liquidType === lt ? "liquid-btn-active" : "text-theme-muted border-border-c")}
                    style={wb.liquidType === lt ? { "--lc": LIQUID_PRESETS[lt].color } as React.CSSProperties : undefined}
                  >
                    {LIQUID_PRESETS[lt].name}
                  </button>
                ))}
              </div>
              {preset && <p className="text-[11px] text-theme-faint mt-1.5">{preset.description}</p>}
            </div>

            {/* Zone-specific fields */}
            {wb.type === "zone" && (() => {
              const z = wb as ZoneWaterBodyConfig;
              const shape = z.shape ?? "circle";
              return (
                <div className="flex flex-col gap-2.5">
                  <div>
                    <label className="block text-[11px] text-theme-faint mb-1">Zone Shape</label>
                    <div className="flex flex-wrap gap-1.5">
                      {(["circle", "oval", "square", "rectangle"] as const).map(s => (
                        <button key={s} onClick={() => update(wb.id, "shape", s)}
                          className={`flex-1 py-1 px-1 rounded-md text-[11px] font-medium cursor-pointer capitalize border transition-colors min-w-[60px] ${shape === s ? "bg-theme-blue text-white border-theme-blue" : "bg-transparent text-theme-muted border-border-c hover:border-theme-blue"}`}>
                          {s}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-2.5">
                    {(["x", "y"] as const).map(axis => (
                      <div key={axis}>
                        <label className="block text-[11px] text-theme-faint mb-0.5 uppercase">Pos {axis} (em)</label>
                        <input type="number" step={0.5}
                          value={z.position?.[axis] ?? 0}
                          onChange={e => updatePos(wb.id, axis, +e.target.value)}
                          className="w-full bg-bg2 border border-border-c rounded-md py-1 px-2 text-theme-text text-xs"
                        />
                      </div>
                    ))}
                  </div>
                  <div className={`grid gap-2.5 ${shape === "rectangle" || shape === "oval" ? "grid-cols-2" : "grid-cols-1"}`}>
                    {(shape === "circle" || shape === "oval" || shape === "square") && (
                      <div>
                        <label className="block text-[11px] text-theme-faint mb-0.5">Radius (em)</label>
                        <input type="number" min={1} max={20} step={0.5}
                          value={z.radius ?? 5}
                          onChange={e => update(wb.id, "radius", +e.target.value)}
                          className="w-full bg-bg2 border border-border-c rounded-md py-1 px-2 text-theme-text text-xs"
                        />
                      </div>
                    )}
                    {(shape === "rectangle" || shape === "oval") && (
                      <>
                        <div>
                          <label className="block text-[11px] text-theme-faint mb-0.5">Width (em)</label>
                          <input type="number" min={1} max={40} step={0.5}
                            value={z.width ?? 10}
                            onChange={e => update(wb.id, "width", +e.target.value)}
                            className="w-full bg-bg2 border border-border-c rounded-md py-1 px-2 text-theme-text text-xs"
                          />
                        </div>
                        <div>
                          <label className="block text-[11px] text-theme-faint mb-0.5">Height (em)</label>
                          <input type="number" min={1} max={40} step={0.5}
                            value={z.height ?? 6}
                            onChange={e => update(wb.id, "height", +e.target.value)}
                            className="w-full bg-bg2 border border-border-c rounded-md py-1 px-2 text-theme-text text-xs"
                          />
                        </div>
                      </>
                    )}
                  </div>
                  <div>
                    <label className="block text-[11px] text-theme-faint mb-0.5">Rotation (°)</label>
                    <input type="number" min={0} max={359} step={5}
                      value={z.rotation ?? 0}
                      onChange={e => update(wb.id, "rotation", +e.target.value)}
                      className="w-full bg-bg2 border border-border-c rounded-md py-1 px-2 text-theme-text text-xs"
                    />
                  </div>
                </div>
              );
            })()}

            {/* Moat-specific fields */}
            {wb.type === "moat" && (
              <div className="grid grid-cols-2 gap-2.5">
                {(["thickness", "distanceFromArena"] as const).map(field => (
                  <div key={field}>
                    <label className="block text-[11px] text-theme-faint mb-0.5">
                      {field === "distanceFromArena" ? "Inner Radius (em)" : "Thickness (em)"}
                    </label>
                    <input type="number" min={1} max={30} step={0.5}
                      value={(wb as any)[field] ?? 3}
                      onChange={e => update(wb.id, field, +e.target.value)}
                      className="w-full bg-bg2 border border-border-c rounded-md py-1 px-2 text-theme-text text-xs"
                    />
                  </div>
                ))}
              </div>
            )}

            {/* Opacity */}
            <div>
              <div className="flex justify-between text-[11px] text-theme-faint mb-0.5">
                <span>Opacity</span>
                <span className="text-theme-text">{((wb.opacity ?? 0.6) * 100).toFixed(0)}%</span>
              </div>
              <input type="range" min={0.1} max={1} step={0.05}
                value={wb.opacity ?? 0.6}
                onChange={e => update(wb.id, "opacity", +e.target.value)}
                className="w-full"
              />
            </div>

            <div>
              <label className="block text-[11px] text-theme-faint mb-1">Water Texture</label>
              <SearchableSelect
                value={(wb as any).textureId ?? ""}
                options={assetOpts}
                onChange={v => update(wb.id, "textureId", v || undefined)}
                disabled={assetsLoading}
                emptyLabel={assetsLoading ? "Loading…" : "No water body assets found"}
              />
            </div>
            <SelfRotationPanel
              rotation={(wb as any).rotation}
              selfRotation={(wb as any).selfRotation}
              onChangeRotation={v => update(wb.id, "rotation", v)}
              onChangeSelfRotation={v => update(wb.id, "selfRotation", v)}
            />
          </div>
        );
      }}
    />
  );
}
