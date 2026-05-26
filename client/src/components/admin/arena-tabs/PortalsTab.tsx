import { ArenaFeatureSection } from "./ArenaFeatureSection";
import type { ArenaConfig, PortalConfig } from "@/types/arenaConfigNew";
import SelfRotationPanel from "./SelfRotationPanel";
import { SearchableSelect } from "@/components/admin/SearchableSelect";
import { useAssetLibrary } from "@/hooks/useAssetLibrary";
import { useDefsDocs } from "@/hooks/useDefsDocs";
import { COLLECTIONS } from "@/lib/firebase";

interface Props {
  config: ArenaConfig;
  onChange: (updated: Partial<ArenaConfig>) => void;
}

const FALLBACK_PORTAL_COLORS = ["#a855f7", "#06b6d4", "#10b981", "#f97316"];
const FALLBACK_PORTAL_LABELS = ["Purple", "Cyan", "Green", "Orange"];
// Fallback Tailwind classes — only used when DB colors are not available.
// When DB colors are loaded, inline style={{ color/accentColor }} is used instead.
const FALLBACK_PORTAL_TEXT_CLASSES = ["text-purple-400", "text-cyan-400", "text-green-400", "text-orange-400"];
const FALLBACK_PORTAL_ACCENT_CLASSES = ["accent-[#a855f7]", "accent-[#06b6d4]", "accent-[#10b981]", "accent-[#f97316]"];

function makeId() { return `portal_${Date.now()}_${Math.random().toString(36).slice(2, 5)}`; }

const DEFAULTS: Omit<PortalConfig, "id">[] = [
  { position: { x: -10, y: 0 }, radius: 3, cooldown: 2, color: FALLBACK_PORTAL_COLORS[0] },
  { position: { x: 10,  y: 0 }, radius: 3, cooldown: 2, color: FALLBACK_PORTAL_COLORS[1] },
  { position: { x: 0, y: -10 }, radius: 3, cooldown: 2, color: FALLBACK_PORTAL_COLORS[2] },
  { position: { x: 0,  y: 10 }, radius: 3, cooldown: 2, color: FALLBACK_PORTAL_COLORS[3] },
];

export default function PortalsTab({ config, onChange }: Props) {
  const portals = config.portals ?? [];
  const { assets: portalAssets, loading: assetsLoading } = useAssetLibrary(COLLECTIONS.PORTAL_ASSETS);
  const assetOpts = portalAssets.map(a => ({ value: a.id, label: a.name ?? a.id, hint: a.tags?.join(", ") }));

  const portalColorDocs = useDefsDocs(COLLECTIONS.PORTAL_COLOR_DEFS);
  const usingDb = portalColorDocs.length > 0;
  const portalColors = usingDb ? portalColorDocs.map(d => String(d.color ?? "#888")) : FALLBACK_PORTAL_COLORS;
  const portalLabels = usingDb ? portalColorDocs.map(d => String(d.label ?? "Color")) : FALLBACK_PORTAL_LABELS;

  const add = () => {
    if (portals.length >= 4) return;
    const idx = portals.length;
    onChange({ portals: [...portals, { ...DEFAULTS[idx], id: makeId() }] });
  };

  const remove = (id: string) => onChange({ portals: portals.filter(p => p.id !== id) });

  const update = (id: string, field: keyof PortalConfig, value: unknown) =>
    onChange({ portals: portals.map(p => p.id === id ? { ...p, [field]: value } : p) });

  const updatePos = (id: string, axis: "x" | "y", value: number) =>
    onChange({ portals: portals.map(p => p.id === id ? { ...p, position: { ...p.position, [axis]: value } } : p) });

  return (
    <>
      <ArenaFeatureSection
        title="Portals"
        storageKey="arena-portals-list"
        items={portals}
        maxItems={4}
        onAdd={add}
        addLabel="Add Portal"
        onRemove={(id) => remove(id as string)}
        emptyIcon="🌀"
        emptyText="No portals yet. Portals teleport beyblades to linked portals."
        renderItemHeader={(portal, idx) => (
          <span
            className={!usingDb ? FALLBACK_PORTAL_TEXT_CLASSES[idx % FALLBACK_PORTAL_TEXT_CLASSES.length] : undefined}
            style={usingDb ? { color: portalColors[idx % portalColors.length] } : undefined}
          >
            🌀 Portal #{idx + 1} ({portalLabels[idx % portalLabels.length]})
          </span>
        )}
        renderItemBody={(portal, idx) => {
          const accentClass = !usingDb ? FALLBACK_PORTAL_ACCENT_CLASSES[idx % FALLBACK_PORTAL_ACCENT_CLASSES.length] : "";
          const accentStyle = usingDb ? { accentColor: portalColors[idx % portalColors.length] } : undefined;
          return (
            <div className="flex flex-col gap-2.5">
              <div className="grid grid-cols-3 gap-2.5">
                {(["x", "y"] as const).map(axis => (
                  <div key={axis}>
                    <div className="flex justify-between text-[11px] text-theme-faint mb-0.5">
                      <span>Pos {axis.toUpperCase()} (em)</span>
                      <span className="text-theme-text font-mono">{portal.position?.[axis] ?? 0}</span>
                    </div>
                    <input type="range" min={-20} max={20} step={0.5}
                      value={portal.position?.[axis] ?? 0}
                      onChange={e => updatePos(portal.id, axis, +e.target.value)}
                      className={`w-full ${accentClass}`}
                      style={accentStyle}
                    />
                  </div>
                ))}
                <div>
                  <div className="flex justify-between text-[11px] text-theme-faint mb-0.5">
                    <span>Radius (em)</span>
                    <span className="text-theme-text font-mono">{portal.radius ?? 3}</span>
                  </div>
                  <input type="range" min={1} max={8} step={0.5}
                    value={portal.radius ?? 3}
                    onChange={e => update(portal.id, "radius", +e.target.value)}
                    className={`w-full ${accentClass}`}
                    style={accentStyle}
                  />
                </div>
                <div>
                  <div className="flex justify-between text-[11px] text-theme-faint mb-0.5">
                    <span>Cooldown (s)</span>
                    <span className="text-theme-text font-mono">{portal.cooldown ?? 2}</span>
                  </div>
                  <input type="range" min={0} max={10} step={0.5}
                    value={portal.cooldown ?? 2}
                    onChange={e => update(portal.id, "cooldown", +e.target.value)}
                    className={`w-full ${accentClass}`}
                    style={accentStyle}
                  />
                </div>
              </div>
              <div>
                <label className="block text-[11px] text-theme-faint mb-1">Portal Sprite</label>
                <SearchableSelect
                  value={(portal as any).spriteId ?? ""}
                  options={assetOpts}
                  onChange={v => update(portal.id, "spriteId" as keyof PortalConfig, v || undefined)}
                  disabled={assetsLoading}
                  emptyLabel={assetsLoading ? "Loading…" : "No portal assets found"}
                />
              </div>
              <SelfRotationPanel
                rotation={(portal as any).rotation}
                selfRotation={(portal as any).selfRotation}
                onChangeRotation={v => update(portal.id, "rotation" as keyof PortalConfig, v)}
                onChangeSelfRotation={v => update(portal.id, "selfRotation" as keyof PortalConfig, v)}
              />
            </div>
          );
        }}
      />
      {portals.length >= 2 && (
        <div className="bg-bg3 rounded-lg p-2.5 text-[11px] text-theme-faint mt-2">
          All {portals.length} portals are connected. Entering any portal can teleport to any other portal.
        </div>
      )}
    </>
  );
}
