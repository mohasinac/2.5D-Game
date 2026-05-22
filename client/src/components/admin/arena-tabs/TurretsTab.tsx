import { C } from "@/styles/theme";
import type { ArenaConfig, TurretConfig, TurretAttackType } from "@/types/arenaConfigNew";

interface Props {
  config: ArenaConfig;
  onChange: (updated: Partial<ArenaConfig>) => void;
}

function makeId() { return Math.floor(Date.now() % 1000000); }

const DEFAULT: Omit<TurretConfig, "id"> = {
  x: 0, y: 0, radius: 25, health: 500,
  attackType: "periodic", attackDamage: 15, attackRange: 250, attackCooldown: 3,
  bulletSpeed: 200, bulletCount: 1,
};

const ATTACK_TYPES: { value: TurretAttackType; label: string; desc: string }[] = [
  { value: "periodic", label: "Periodic", desc: "Regular bullet bursts" },
  { value: "beam", label: "Beam", desc: "Continuous laser beam" },
  { value: "aoe", label: "AOE Blast", desc: "Area-of-effect missile" },
  { value: "boomerang", label: "Boomerang", desc: "Returning projectile" },
  { value: "random", label: "Random", desc: "Unpredictable shots" },
];

const COMMON_FIELDS: { field: keyof TurretConfig; label: string; min: number; max: number; step: number }[] = [
  { field: "x", label: "X (px from center)", min: -500, max: 500, step: 10 },
  { field: "y", label: "Y (px from center)", min: -500, max: 500, step: 10 },
  { field: "radius", label: "Turret Size (px)", min: 15, max: 50, step: 5 },
  { field: "health", label: "Health", min: 100, max: 2000, step: 100 },
  { field: "attackDamage", label: "Damage Per Hit", min: 5, max: 75, step: 5 },
  { field: "attackRange", label: "Attack Range (px)", min: 100, max: 500, step: 25 },
  { field: "attackCooldown", label: "Cooldown (s)", min: 0.5, max: 10, step: 0.5 },
];

export default function TurretsTab({ config, onChange }: Props) {
  const items = config.turrets ?? [];

  const add = () => {
    if (items.length >= 8) return;
    onChange({ turrets: [...items, { ...DEFAULT, id: makeId() }] });
  };

  const remove = (id: number | undefined) =>
    onChange({ turrets: items.filter(t => t.id !== id) });

  const update = (id: number | undefined, field: keyof TurretConfig, value: any) =>
    onChange({ turrets: items.map(t => t.id === id ? { ...t, [field]: value } : t) });

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span style={{ fontSize: 13, color: C.muted }}>{items.length} / 8 turrets</span>
        <button onClick={add} disabled={items.length >= 8} style={{ padding: "5px 14px", background: C.red, color: C.white, border: "none", borderRadius: 6, fontSize: 12, fontWeight: 500, cursor: "pointer", opacity: items.length >= 8 ? 0.4 : 1 }}>
          + Add Turret
        </button>
      </div>

      {items.length === 0 && (
        <div style={{ textAlign: "center", padding: "40px 0", color: C.faint }}>
          <div style={{ fontSize: 32, marginBottom: 8 }}>🔫</div>
          <p>No turrets yet. Turrets fire at beyblades that enter their range.</p>
        </div>
      )}

      {items.map((turret, idx) => (
        <div key={turret.id ?? idx} style={{ background: C.bg3, borderRadius: 12, padding: 16, border: `1px solid ${C.border}` }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ fontSize: 13, fontWeight: 500, color: C.text }}>🔫 Turret #{idx + 1}</span>
              {turret.behaviorId && (
                <span style={{ fontSize: 10, fontWeight: 600, padding: "2px 7px", borderRadius: 99, background: "rgba(168,85,247,0.15)", color: "#a855f7", border: "1px solid rgba(168,85,247,0.3)" }}>
                  Behavior: {turret.behaviorId}
                </span>
              )}
            </div>
            <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
              <label style={{ display: "flex", gap: 6, alignItems: "center", fontSize: 11, color: C.muted, cursor: "pointer" }}>
                <input type="checkbox" checked={turret.indestructible ?? false} onChange={e => update(turret.id, "indestructible", e.target.checked)} />
                Indestructible
              </label>
              <button onClick={() => remove(turret.id)} style={{ color: C.red, background: "none", border: "none", fontSize: 12, cursor: "pointer" }}>Remove</button>
            </div>
          </div>

          {/* Attack type */}
          <div style={{ marginBottom: 12 }}>
            <label style={{ display: "block", fontSize: 11, color: C.faint, marginBottom: 6 }}>Attack Type</label>
            <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
              {ATTACK_TYPES.map(at => (
                <button
                  key={at.value}
                  onClick={() => update(turret.id, "attackType", at.value)}
                  title={at.desc}
                  style={{
                    padding: "4px 10px", borderRadius: 6, fontSize: 11, fontWeight: 500, cursor: "pointer",
                    background: turret.attackType === at.value ? C.red : C.bg2,
                    color: turret.attackType === at.value ? C.white : C.muted,
                    border: `1px solid ${turret.attackType === at.value ? C.red : C.border}`,
                  }}
                >
                  {at.label}
                </button>
              ))}
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
            {COMMON_FIELDS.map(({ field, label, min, max, step }) => (
              <div key={field}>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, color: C.faint, marginBottom: 2 }}>
                  <span>{label}</span>
                  <span style={{ color: C.text, fontFamily: "monospace" }}>{(turret as any)[field] ?? 0}</span>
                </div>
                <input type="range" min={min} max={max} step={step}
                  value={(turret as any)[field] ?? min}
                  onChange={e => update(turret.id, field, +e.target.value)}
                  style={{ width: "100%", accentColor: C.red }}
                />
              </div>
            ))}
          </div>
          {/* I6: Behavior override */}
          <div style={{ marginTop: 12, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
            <div>
              <label style={{ display: "block", fontSize: 11, color: C.faint, marginBottom: 4 }}>Behavior ID (optional)</label>
              <input
                type="text"
                value={turret.behaviorId ?? ""}
                onChange={e => update(turret.id, "behaviorId", e.target.value || undefined)}
                placeholder="e.g. movement.orbit"
                style={{ width: "100%", background: C.bg2, border: `1px solid ${C.border}`, color: C.text, borderRadius: 6, padding: "4px 8px", fontSize: 12, boxSizing: "border-box" }}
              />
            </div>
            <div>
              <label style={{ display: "block", fontSize: 11, color: C.faint, marginBottom: 4 }}>Behavior Params (JSON)</label>
              <textarea
                value={turret.behaviorParams ? JSON.stringify(turret.behaviorParams, null, 2) : ""}
                onChange={e => {
                  try {
                    const parsed = e.target.value ? JSON.parse(e.target.value) : undefined;
                    update(turret.id, "behaviorParams", parsed);
                  } catch { /* invalid JSON, ignore */ }
                }}
                placeholder='{ "strength": 0.5 }'
                rows={2}
                style={{ width: "100%", background: C.bg2, border: `1px solid ${C.border}`, color: C.text, borderRadius: 6, padding: "4px 8px", fontSize: 11, fontFamily: "monospace", resize: "vertical", boxSizing: "border-box" }}
              />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
