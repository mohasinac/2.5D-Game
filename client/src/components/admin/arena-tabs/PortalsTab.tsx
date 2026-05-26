import { CollapsibleSection } from "@/components/admin/CollapsibleSection";
import type { ArenaConfig, PortalConfig } from "@/types/arenaConfigNew";
import SelfRotationPanel from "./SelfRotationPanel";
import { SearchableSelect } from "@/components/admin/SearchableSelect";
import { useAssetLibrary } from "@/hooks/useAssetLibrary";
import { COLLECTIONS } from "@/lib/firebase";

interface Props {
  config: ArenaConfig;
  onChange: (updated: Partial<ArenaConfig>) => void;
}

const PORTAL_COLORS = ["#a855f7", "#06b6d4", "#10b981", "#f97316"];
const PORTAL_LABELS = ["Purple", "Cyan", "Green", "Orange"];

function makeId() { return `portal_${Date.now()}_${Math.random().toString(36).slice(2, 5)}`; }

const DEFAULTS: Omit<PortalConfig, "id">[] = [
  { position: { x: -10, y: 0 }, radius: 3, cooldown: 2, color: PORTAL_COLORS[0] },
  { position: { x: 10,  y: 0 }, radius: 3, cooldown: 2, color: PORTAL_COLORS[1] },
  { position: { x: 0, y: -10 }, radius: 3, cooldown: 2, color: PORTAL_COLORS[2] },
  { position: { x: 0,  y: 10 }, radius: 3, cooldown: 2, color: PORTAL_COLORS[3] },
];

export default function PortalsTab({ config, onChange }: Props) {
  const portals = config.portals ?? [];
  const { assets: portalAssets, loading: assetsLoading } = useAssetLibrary(COLLECTIONS.PORTAL_ASSETS);
  const assetOpts = portalAssets.map(a => ({ value: a.id, label: a.name ?? a.id, hint: a.tags?.join(", ") }));

  const add = () => {
    if (portals.length >= 4) return;
    const idx = portals.length;
    onChange({ portals: [...portals, { ...DEFAULTS[idx], id: makeId() }] });
  };

  const remove = (id: string) =>
    onChange({ portals: portals.filter(p => p.id !== id) });

  const update = (id: string, field: keyof PortalConfig, value: any) =>
    onChange({ portals: portals.map(p => p.id === id ? { ...p, [field]: value } : p) });

  const updatePos = (id: string, axis: "x" | "y", value: number) =>
    onChange({ portals: portals.map(p => p.id === id ? { ...p, position: { ...p.position, [axis]: value } } : p) });

  return (
    <CollapsibleSection title="Portals" badge={portals.length} storageKey="arena-portals-list" defaultOpen={true}>
    <div className="flex flex-col gap-4">
      <div className="flex justify-between items-center">
        <span className="text-[13px] text-muted">{portals.length} / 4 portals — all portals are interconnected</span>
        <button onClick={add} disabled={portals.length >= 4}
          className="py-[5px] px-[14px] text-white border-none rounded-md text-xs font-medium cursor-pointer"
          style={{ background: "var(--purple)", opacity: portals.length >= 4 ? 0.4 : 1 }}>
          + Add Portal
        </button>
      </div>

      {portals.length === 0 && (
        <div className="text-center py-10 text-faint">
          <div className="text-[32px] mb-2">🌀</div>
          <p>No portals yet. Portals teleport beyblades to linked portals.</p>
        </div>
      )}

      {portals.map((portal, idx) => {
        const color = PORTAL_COLORS[idx % 4];
        return (
          <div key={portal.id} className="bg-bg3 rounded-xl p-4"
            style={{ border: `2px solid ${color}44` }}>
            <div className="flex justify-between items-center mb-3">
              <span className="text-[13px] font-medium" style={{ color }}>
                🌀 Portal #{idx + 1} ({PORTAL_LABELS[idx % 4]})
              </span>
              <button onClick={() => remove(portal.id)} className="text-red bg-transparent border-none text-xs cursor-pointer">Remove</button>
            </div>

            <div className="grid grid-cols-3 gap-2.5">
              {(["x", "y"] as const).map(axis => (
                <div key={axis}>
                  <div className="flex justify-between text-[11px] text-faint mb-0.5">
                    <span>Pos {axis.toUpperCase()} (em)</span>
                    <span className="text-text font-mono">{portal.position?.[axis] ?? 0}</span>
                  </div>
                  <input type="range" min={-20} max={20} step={0.5}
                    value={portal.position?.[axis] ?? 0}
                    onChange={e => updatePos(portal.id, axis, +e.target.value)}
                    className="w-full"
                    style={{ accentColor: color }}
                  />
                </div>
              ))}
              <div>
                <div className="flex justify-between text-[11px] text-faint mb-0.5">
                  <span>Radius (em)</span>
                  <span className="text-text font-mono">{portal.radius ?? 3}</span>
                </div>
                <input type="range" min={1} max={8} step={0.5}
                  value={portal.radius ?? 3}
                  onChange={e => update(portal.id, "radius", +e.target.value)}
                  className="w-full"
                  style={{ accentColor: color }}
                />
              </div>
              <div>
                <div className="flex justify-between text-[11px] text-faint mb-0.5">
                  <span>Cooldown (s)</span>
                  <span className="text-text font-mono">{portal.cooldown ?? 2}</span>
                </div>
                <input type="range" min={0} max={10} step={0.5}
                  value={portal.cooldown ?? 2}
                  onChange={e => update(portal.id, "cooldown", +e.target.value)}
                  className="w-full"
                  style={{ accentColor: color }}
                />
              </div>
            </div>
            {/* Sprite picker */}
            <div className="mt-3">
              <label className="block text-[11px] text-faint mb-1">Portal Sprite</label>
              <SearchableSelect
                value={(portal as any).spriteId ?? ""}
                options={assetOpts}
                onChange={v => update(portal.id, "spriteId" as any, v || undefined)}
                disabled={assetsLoading}
                emptyLabel={assetsLoading ? "Loading…" : "No portal assets found"}
                style={{ width: "100%" }}
              />
            </div>
            <SelfRotationPanel
              rotation={(portal as any).rotation}
              selfRotation={(portal as any).selfRotation}
              onChangeRotation={v => update(portal.id, "rotation" as any, v)}
              onChangeSelfRotation={v => update(portal.id, "selfRotation" as any, v)}
            />
          </div>
        );
      })}

      {portals.length >= 2 && (
        <div className="bg-bg3 rounded-lg p-2.5 text-[11px] text-faint">
          All {portals.length} portals are connected. Entering any portal can teleport to any other portal.
        </div>
      )}
    </div>
    </CollapsibleSection>
  );
}
