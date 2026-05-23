import { C } from "@/styles/theme";
import type { ArenaConfig, ObstacleConfig } from "@/types/arenaConfigNew";
import { OBSTACLE_ICONS } from "@/types/arenaConfigNew";
import SelfRotationPanel from "./SelfRotationPanel";
import { SearchableSelect } from "@/components/admin/SearchableSelect";
import { useAssetLibrary } from "@/hooks/useAssetLibrary";
import { COLLECTIONS } from "@/lib/firebase";

interface Props {
  config: ArenaConfig;
  onChange: (updated: Partial<ArenaConfig>) => void;
}

function makeId() { return Math.floor(Date.now() % 1000000); }

const DEFAULT: Omit<ObstacleConfig, "id"> = {
  x: 0, y: 0, radius: 25, health: 3, damage: 15, recoilDistance: 40,
};

const SLIDER_FIELDS: { field: keyof ObstacleConfig; label: string; min: number; max: number; step: number }[] = [
  { field: "x", label: "X (px from center)", min: -500, max: 500, step: 10 },
  { field: "y", label: "Y (px from center)", min: -500, max: 500, step: 10 },
  { field: "radius", label: "Radius (px)", min: 10, max: 80, step: 5 },
  { field: "health", label: "Health (hits)", min: 1, max: 10, step: 1 },
  { field: "damage", label: "Collision Damage", min: 5, max: 50, step: 5 },
  { field: "recoilDistance", label: "Recoil Distance (px)", min: 0, max: 150, step: 10 },
];

export default function ObstaclesTab({ config, onChange }: Props) {
  const items = config.obstacles ?? [];
  const themeIcon = OBSTACLE_ICONS[config.theme as keyof typeof OBSTACLE_ICONS] ?? "🪨";
  const { assets: obstacleAssets, loading: assetsLoading } = useAssetLibrary(COLLECTIONS.OBSTACLE_ASSETS);
  const assetOpts = obstacleAssets.map(a => ({ value: a.id, label: a.name ?? a.id, hint: a.tags?.join(", ") }));

  const add = () => {
    if (items.length >= 10) return;
    onChange({ obstacles: [...items, { ...DEFAULT, id: makeId() }] });
  };

  const remove = (id: number | undefined) =>
    onChange({ obstacles: items.filter(o => o.id !== id) });

  const update = (id: number | undefined, field: keyof ObstacleConfig, value: any) =>
    onChange({ obstacles: items.map(o => o.id === id ? { ...o, [field]: value } : o) });

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span style={{ fontSize: 13, color: C.muted }}>{items.length} / 10 obstacles — theme icon: {themeIcon}</span>
        <button onClick={add} disabled={items.length >= 10} style={{ padding: "5px 14px", background: C.blue, color: C.white, border: "none", borderRadius: 6, fontSize: 12, fontWeight: 500, cursor: "pointer", opacity: items.length >= 10 ? 0.4 : 1 }}>
          + Add Obstacle
        </button>
      </div>

      {items.length === 0 && (
        <div style={{ textAlign: "center", padding: "40px 0", color: C.faint }}>
          <div style={{ fontSize: 32, marginBottom: 8 }}>{themeIcon}</div>
          <p>No obstacles yet. Obstacles damage beyblades on collision.</p>
        </div>
      )}

      {items.map((obs, idx) => (
        <div key={obs.id ?? idx} style={{ background: C.bg3, borderRadius: 12, padding: 16, border: `1px solid ${C.border}` }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ fontSize: 13, fontWeight: 500, color: C.text }}>{themeIcon} Obstacle #{idx + 1}</span>
              {obs.behaviorId && (
                <span style={{ fontSize: 10, fontWeight: 600, padding: "2px 7px", borderRadius: 99, background: "rgba(168,85,247,0.15)", color: "#a855f7", border: "1px solid rgba(168,85,247,0.3)" }}>
                  Behavior: {obs.behaviorId}
                </span>
              )}
            </div>
            <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
              <label style={{ display: "flex", gap: 6, alignItems: "center", fontSize: 11, color: C.muted, cursor: "pointer" }}>
                <input type="checkbox" checked={obs.indestructible ?? false} onChange={e => update(obs.id, "indestructible", e.target.checked)} />
                Indestructible
              </label>
              <button onClick={() => remove(obs.id)} style={{ color: C.red, background: "none", border: "none", fontSize: 12, cursor: "pointer" }}>Remove</button>
            </div>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10 }}>
            {SLIDER_FIELDS.map(({ field, label, min, max, step }) => (
              <div key={field}>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, color: C.faint, marginBottom: 2 }}>
                  <span>{label}</span>
                  <span style={{ color: C.text, fontFamily: "monospace" }}>{(obs as any)[field] ?? 0}</span>
                </div>
                <input type="range" min={min} max={max} step={step}
                  value={(obs as any)[field] ?? 0}
                  onChange={e => update(obs.id, field, +e.target.value)}
                  style={{ width: "100%", accentColor: C.blue }}
                />
              </div>
            ))}
          </div>
          {/* Sprite picker */}
          <div style={{ marginTop: 12, marginBottom: 12 }}>
            <label style={{ display: "block", fontSize: 11, color: C.faint, marginBottom: 4 }}>Obstacle Sprite</label>
            <SearchableSelect
              value={(obs as any).spriteId ?? ""}
              options={assetOpts}
              onChange={v => update(obs.id, "spriteId" as any, v || undefined)}
              disabled={assetsLoading}
              emptyLabel={assetsLoading ? "Loading…" : "No obstacle assets found"}
              style={{ width: "100%", background: C.bg2, border: `1px solid ${C.border}`, borderRadius: 6, color: C.text, fontSize: 11 }}
            />
          </div>

          {/* I6: Behavior override */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
            <div>
              <label style={{ display: "block", fontSize: 11, color: C.faint, marginBottom: 4 }}>Behavior ID (optional)</label>
              <input
                type="text"
                data-testid={`obstacle-behavior-id-${idx}`}
                value={obs.behaviorId ?? ""}
                onChange={e => update(obs.id, "behaviorId", e.target.value || undefined)}
                placeholder="e.g. movement.orbit"
                style={{ width: "100%", background: C.bg2, border: `1px solid ${C.border}`, color: C.text, borderRadius: 6, padding: "4px 8px", fontSize: 12, boxSizing: "border-box" }}
              />
            </div>
            <div>
              <label style={{ display: "block", fontSize: 11, color: C.faint, marginBottom: 4 }}>Behavior Params (JSON)</label>
              <textarea
                value={obs.behaviorParams ? JSON.stringify(obs.behaviorParams, null, 2) : ""}
                onChange={e => {
                  try {
                    const parsed = e.target.value ? JSON.parse(e.target.value) : undefined;
                    update(obs.id, "behaviorParams", parsed);
                  } catch { /* invalid JSON, ignore */ }
                }}
                placeholder='{ "strength": 0.5 }'
                rows={2}
                style={{ width: "100%", background: C.bg2, border: `1px solid ${C.border}`, color: C.text, borderRadius: 6, padding: "4px 8px", fontSize: 11, fontFamily: "monospace", resize: "vertical", boxSizing: "border-box" }}
              />
            </div>
          </div>
          <SelfRotationPanel
            rotation={obs.rotation?.initialAngleDeg}
            selfRotation={obs.selfRotation}
            onChangeRotation={v => update(obs.id, "rotation", v !== undefined ? { ...(obs.rotation ?? { mode: "static" as const }), initialAngleDeg: v } : undefined)}
            onChangeSelfRotation={v => update(obs.id, "selfRotation", v)}
          />
        </div>
      ))}
    </div>
  );
}
