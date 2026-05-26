import { ArenaFeatureSection } from "./ArenaFeatureSection";
import type { ArenaConfig, PitConfig, PitType } from "@/types/arenaConfigNew";
import SelfRotationPanel from "./SelfRotationPanel";
import { SearchableSelect } from "@/components/admin/SearchableSelect";
import { useAssetLibrary } from "@/hooks/useAssetLibrary";
import { COLLECTIONS } from "@/lib/firebase";

interface Props {
  config: ArenaConfig;
  onChange: (updated: Partial<ArenaConfig>) => void;
}

function makeId() { return `pit_${Date.now()}_${Math.random().toString(36).slice(2, 5)}`; }

const DEFAULT_CRATER: Omit<PitConfig, "id"> = {
  type: "crater", position: { x: 0, y: 0 }, radius: 2.5,
  depth: 5, spinDamagePerSecond: 20, escapeChance: 0.5,
};
const DEFAULT_EDGE: Omit<PitConfig, "id"> = {
  type: "edge", position: { x: 0, y: 0 }, radius: 2,
  depth: 5, spinDamagePerSecond: 15, escapeChance: 0.6, edgeOffset: 1, angle: 0,
};

const STAT_FIELDS: { field: keyof PitConfig; label: string; min: number; max: number; step: number }[] = [
  { field: "radius", label: "Radius (em)", min: 0.5, max: 8, step: 0.5 },
  { field: "depth", label: "Visual Depth", min: 1, max: 10, step: 1 },
  { field: "spinDamagePerSecond", label: "Spin Damage/s", min: 5, max: 60, step: 5 },
  { field: "escapeChance", label: "Escape Chance", min: 0.1, max: 0.9, step: 0.1 },
];

export default function PitsTab({ config, onChange }: Props) {
  const pits = config.pits ?? [];
  const { assets: pitAssets, loading: assetsLoading } = useAssetLibrary(COLLECTIONS.OBSTACLE_ASSETS);
  const assetOpts = pitAssets.map(a => ({ value: a.id, label: a.name ?? a.id, hint: a.tags?.join(", ") }));

  const add = (type: PitType) => {
    if (pits.length >= 3) return;
    const base = type === "edge" ? DEFAULT_EDGE : DEFAULT_CRATER;
    onChange({ pits: [...pits, { ...base, id: makeId() }] });
  };

  const remove = (id: string) => onChange({ pits: pits.filter(p => p.id !== id) });

  const update = (id: string, field: keyof PitConfig, value: unknown) =>
    onChange({ pits: pits.map(p => p.id === id ? { ...p, [field]: value } : p) });

  const updatePos = (id: string, axis: "x" | "y", value: number) =>
    onChange({ pits: pits.map(p => p.id === id ? { ...p, position: { ...p.position, [axis]: value } } : p) });

  return (
    <ArenaFeatureSection
      title="Pits"
      storageKey="arena-pits-list"
      items={pits}
      maxItems={3}
      addVariants={[
        { label: "+ Crater", onClick: () => add("crater") },
        { label: "+ Edge Pit", onClick: () => add("edge") },
      ]}
      onRemove={(id) => remove(id as string)}
      emptyIcon="🕳️"
      emptyText="No pits yet. Pits trap beyblades, dealing spin damage until they escape."
      renderItemHeader={(pit, idx) => (
        <>🕳️ Pit #{idx + 1} — <span className="text-theme-muted capitalize">{pit.type}</span></>
      )}
      renderItemBody={(pit) => (
        <div className="flex flex-col gap-2.5">
          {/* Position */}
          <div className="grid grid-cols-2 gap-2.5">
            {(["x", "y"] as const).map(axis => (
              <div key={axis}>
                <div className="flex justify-between text-[11px] text-theme-faint mb-0.5">
                  <span>Pos {axis.toUpperCase()} (em)</span>
                  <span className="text-theme-text font-mono">{pit.position?.[axis] ?? 0}</span>
                </div>
                <input type="range" min={-20} max={20} step={0.5}
                  value={pit.position?.[axis] ?? 0}
                  onChange={e => updatePos(pit.id, axis, +e.target.value)}
                  className="w-full"
                />
              </div>
            ))}
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 gap-2.5">
            {STAT_FIELDS.map(({ field, label, min, max, step }) => (
              <div key={field}>
                <div className="flex justify-between text-[11px] text-theme-faint mb-0.5">
                  <span>{label}</span>
                  <span className="text-theme-text font-mono">
                    {field === "escapeChance"
                      ? `${((pit as any)[field] ?? 0.5) * 100}%`
                      : (pit as any)[field] ?? min}
                  </span>
                </div>
                <input type="range" min={min} max={max} step={step}
                  value={(pit as any)[field] ?? min}
                  onChange={e => update(pit.id, field, +e.target.value)}
                  className="w-full"
                />
              </div>
            ))}
          </div>

          {/* Sprite picker */}
          <div>
            <label className="block text-[11px] text-theme-faint mb-1">Pit Sprite</label>
            <SearchableSelect
              value={(pit as any).spriteId ?? ""}
              options={assetOpts}
              onChange={v => update(pit.id, "spriteId" as keyof PitConfig, v || undefined)}
              disabled={assetsLoading}
              emptyLabel={assetsLoading ? "Loading…" : "No assets found"}
            />
          </div>

          {/* Edge pit angle */}
          {pit.type === "edge" && (
            <div>
              <div className="flex justify-between text-[11px] text-theme-faint mb-0.5">
                <span>Edge Angle (°)</span>
                <span className="text-theme-text font-mono">{pit.angle ?? 0}°</span>
              </div>
              <input type="range" min={0} max={359} step={5}
                value={pit.angle ?? 0}
                onChange={e => update(pit.id, "angle", +e.target.value)}
                className="w-full"
              />
            </div>
          )}
          <SelfRotationPanel
            rotation={pit.rotation}
            selfRotation={pit.selfRotation}
            onChangeRotation={v => update(pit.id, "rotation" as keyof PitConfig, v)}
            onChangeSelfRotation={v => update(pit.id, "selfRotation" as keyof PitConfig, v)}
          />
        </div>
      )}
    />
  );
}
