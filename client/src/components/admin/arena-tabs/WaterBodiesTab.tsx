import { C } from "@/styles/theme";
import { CollapsibleSection } from "@/components/admin/CollapsibleSection";
import type { ArenaConfig, WaterBodyConfig, LiquidType, ZoneWaterBodyConfig, MoatWaterBodyConfig } from "@/types/arenaConfigNew";
import { LIQUID_PRESETS } from "@/types/arenaConfigNew";
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
    const base = type === "moat"
      ? { ...DEFAULT_MOAT, id: makeId() }
      : { ...DEFAULT_ZONE, id: makeId() };
    onChange({ waterBodies: [...bodies, base as WaterBodyConfig] });
  };

  const remove = (id: string) =>
    onChange({ waterBodies: bodies.filter(b => b.id !== id) });

  const update = (id: string, field: string, value: any) =>
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
    <CollapsibleSection title="Water Bodies" badge={bodies.length} storageKey="arena-water-list" defaultOpen={true}>
    <div className="flex flex-col gap-4">
      <div className="flex justify-between items-center">
        <span className="text-[13px] text-muted">{bodies.length} / 3 water bodies</span>
        <div className="flex gap-2">
          <button onClick={() => add("zone")} disabled={bodies.length >= 3}
            className="py-[5px] px-3 bg-blue text-white border-none rounded-md text-xs font-medium cursor-pointer"
            style={{ opacity: bodies.length >= 3 ? 0.4 : 1 }}>
            + Zone
          </button>
          <button onClick={() => add("moat")} disabled={bodies.length >= 3}
            className="py-[5px] px-3 bg-blue text-white border-none rounded-md text-xs font-medium cursor-pointer"
            style={{ opacity: bodies.length >= 3 ? 0.4 : 1 }}>
            + Moat
          </button>
        </div>
      </div>

      {bodies.length === 0 && (
        <div className="text-center py-10 text-faint">
          <p>No water bodies yet.</p>
          <p className="text-xs mt-1">Add a zone (free-floating) or moat (surrounding wall).</p>
        </div>
      )}

      {bodies.map((wb, idx) => {
        const preset = LIQUID_PRESETS[wb.liquidType as LiquidType];
        return (
          <div key={wb.id} className="bg-bg3 rounded-xl p-4 border border-border">
            <div className="flex justify-between items-center mb-3">
              <span className="text-[13px] font-medium text-text">
                Water Body #{idx + 1} — <span className="text-muted capitalize">{wb.type}</span>
              </span>
              <button onClick={() => remove(wb.id)} className="text-red bg-transparent border-none text-xs cursor-pointer">Remove</button>
            </div>

            {/* Liquid type */}
            <div className="mb-3">
              <label className="block text-[11px] text-faint mb-1.5">Liquid Type</label>
              <div className="grid grid-cols-4 gap-1.5">
                {(Object.keys(LIQUID_PRESETS) as LiquidType[]).map(lt => (
                  <button
                    key={lt}
                    onClick={() => update(wb.id, "liquidType", lt)}
                    title={LIQUID_PRESETS[lt].description}
                    className="py-1 px-0.5 rounded-md text-[10px] font-medium cursor-pointer border"
                    style={{
                      background: wb.liquidType === lt ? `${LIQUID_PRESETS[lt].color}33` : C.bg2,
                      color: wb.liquidType === lt ? LIQUID_PRESETS[lt].color : C.faint,
                      borderColor: wb.liquidType === lt ? LIQUID_PRESETS[lt].color : C.border,
                    }}
                  >
                    {LIQUID_PRESETS[lt].name}
                  </button>
                ))}
              </div>
              {preset && <p className="text-[11px] text-faint mt-1.5">{preset.description}</p>}
            </div>

            {/* Zone-specific fields */}
            {wb.type === "zone" && (() => {
              const z = wb as ZoneWaterBodyConfig;
              const shape = z.shape ?? "circle";
              return (
                <div className="flex flex-col gap-2.5">
                  {/* Shape selector */}
                  <div>
                    <label className="block text-[11px] text-faint mb-1">Zone Shape</label>
                    <div className="flex gap-1.5">
                      {(["circle", "oval", "square", "rectangle"] as const).map(s => (
                        <button key={s} onClick={() => update(wb.id, "shape", s)}
                          className="flex-1 py-[5px] px-1 rounded-md text-[11px] font-medium cursor-pointer capitalize border"
                          style={{
                            background: shape === s ? C.blue : "transparent",
                            color: shape === s ? C.white : C.muted,
                            borderColor: shape === s ? C.blue : C.border,
                          }}>
                          {s}
                        </button>
                      ))}
                    </div>
                  </div>
                  {/* Position */}
                  <div className="grid grid-cols-2 gap-2.5">
                    {(["x", "y"] as const).map(axis => (
                      <div key={axis}>
                        <label className="block text-[11px] text-faint mb-0.5 uppercase">Pos {axis} (em)</label>
                        <input type="number" step={0.5}
                          value={z.position?.[axis] ?? 0}
                          onChange={e => updatePos(wb.id, axis, +e.target.value)}
                          className="w-full bg-bg2 border border-border rounded-md py-1 px-2 text-text text-xs box-border"
                        />
                      </div>
                    ))}
                  </div>
                  {/* Dimensions based on shape */}
                  <div className={`grid gap-2.5 ${shape === "rectangle" || shape === "oval" ? "grid-cols-2" : "grid-cols-1"}`}>
                    {(shape === "circle" || shape === "oval" || shape === "square") && (
                      <div>
                        <label className="block text-[11px] text-faint mb-0.5">Radius (em)</label>
                        <input type="number" min={1} max={20} step={0.5}
                          value={z.radius ?? 5}
                          onChange={e => update(wb.id, "radius", +e.target.value)}
                          className="w-full bg-bg2 border border-border rounded-md py-1 px-2 text-text text-xs box-border"
                        />
                      </div>
                    )}
                    {(shape === "rectangle" || shape === "oval") && (
                      <>
                        <div>
                          <label className="block text-[11px] text-faint mb-0.5">Width (em)</label>
                          <input type="number" min={1} max={40} step={0.5}
                            value={z.width ?? 10}
                            onChange={e => update(wb.id, "width", +e.target.value)}
                            className="w-full bg-bg2 border border-border rounded-md py-1 px-2 text-text text-xs box-border"
                          />
                        </div>
                        <div>
                          <label className="block text-[11px] text-faint mb-0.5">Height (em)</label>
                          <input type="number" min={1} max={40} step={0.5}
                            value={z.height ?? 6}
                            onChange={e => update(wb.id, "height", +e.target.value)}
                            className="w-full bg-bg2 border border-border rounded-md py-1 px-2 text-text text-xs box-border"
                          />
                        </div>
                      </>
                    )}
                  </div>
                  {/* Rotation */}
                  <div>
                    <label className="block text-[11px] text-faint mb-0.5">Rotation (°)</label>
                    <input type="number" min={0} max={359} step={5}
                      value={z.rotation ?? 0}
                      onChange={e => update(wb.id, "rotation", +e.target.value)}
                      className="w-full bg-bg2 border border-border rounded-md py-1 px-2 text-text text-xs box-border"
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
                    <label className="block text-[11px] text-faint mb-0.5 capitalize">
                      {field === "distanceFromArena" ? "Inner Radius (em)" : "Thickness (em)"}
                    </label>
                    <input type="number" min={1} max={30} step={0.5}
                      value={(wb as any)[field] ?? 3}
                      onChange={e => update(wb.id, field, +e.target.value)}
                      className="w-full bg-bg2 border border-border rounded-md py-1 px-2 text-text text-xs box-border"
                    />
                  </div>
                ))}
              </div>
            )}

            {/* Opacity slider */}
            <div className="mt-3">
              <div className="flex justify-between text-[11px] text-faint mb-0.5">
                <span>Opacity</span>
                <span className="text-text">{((wb.opacity ?? 0.6) * 100).toFixed(0)}%</span>
              </div>
              <input type="range" min={0.1} max={1} step={0.05}
                value={wb.opacity ?? 0.6}
                onChange={e => update(wb.id, "opacity", +e.target.value)}
                className="w-full"
                style={{ accentColor: C.blue }}
              />
            </div>
            {/* Texture picker */}
            <div className="mt-3">
              <label className="block text-[11px] text-faint mb-1">Water Texture</label>
              <SearchableSelect
                value={(wb as any).textureId ?? ""}
                options={assetOpts}
                onChange={v => update(wb.id, "textureId", v || undefined)}
                disabled={assetsLoading}
                emptyLabel={assetsLoading ? "Loading…" : "No water body assets found"}
                style={{ width: "100%" }}
              />
            </div>
            {(wb.type === "zone" || wb.type === "moat") && (
              <SelfRotationPanel
                rotation={(wb as any).rotation}
                selfRotation={(wb as any).selfRotation}
                onChangeRotation={v => update(wb.id, "rotation", v)}
                onChangeSelfRotation={v => update(wb.id, "selfRotation", v)}
              />
            )}
          </div>
        );
      })}
    </div>
    </CollapsibleSection>
  );
}
