import { C } from "@/styles/theme";
import type { ArenaConfig, TurretConfig, TurretAttackType, TurretFirePattern } from "@/types/arenaConfigNew";
import SelfRotationPanel from "./SelfRotationPanel";
import RotationBlockEditor from "./RotationBlockEditor";
import FeatureAnimationPanel from "./FeatureAnimationPanel";
import { SearchableSelect } from "@/components/admin/SearchableSelect";
import { useTurretAttackTypes } from "@/hooks/useTurretAttackTypes";
import { useAssetLibrary } from "@/hooks/useAssetLibrary";
import { useElementTypes } from "@/hooks/useElementTypes";
import { COLLECTIONS } from "@/lib/firebase";

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

const COMMON_FIELDS: { field: keyof TurretConfig; label: string; min: number; max: number; step: number }[] = [
  { field: "x", label: "X (px from center)", min: -500, max: 500, step: 10 },
  { field: "y", label: "Y (px from center)", min: -500, max: 500, step: 10 },
  { field: "radius", label: "Turret Size (px)", min: 15, max: 50, step: 5 },
  { field: "health", label: "Health", min: 100, max: 2000, step: 100 },
  { field: "attackDamage", label: "Damage Per Hit", min: 5, max: 75, step: 5 },
  { field: "attackRange", label: "Attack Range (px)", min: 100, max: 500, step: 25 },
  { field: "attackCooldown", label: "Cooldown (s)", min: 0.5, max: 10, step: 0.5 },
];

const FIRE_PATTERNS: { value: TurretFirePattern; label: string }[] = [
  { value: "nearest",     label: "Nearest" },
  { value: "furthest",    label: "Furthest" },
  { value: "random",      label: "Random" },
  { value: "round_robin", label: "Round Robin" },
  { value: "lowest_spin", label: "Lowest Spin" },
  { value: "highest_spin",label: "Highest Spin" },
  { value: "center",      label: "Center" },
  { value: "sweep_cw",    label: "Sweep CW" },
];

function numInput(val: number | undefined, def: number, onChange: (n: number) => void, step = 1, width = 80) {
  return (
    <input
      type="number" value={val ?? def} step={step}
      onChange={e => onChange(Number(e.target.value))}
      style={{ width, background: C.bg1, border: `1px solid ${C.border}`, color: C.text, borderRadius: 6, padding: "4px 8px", fontSize: 12 }}
    />
  );
}

function TypeSpecificParams({ turret, update }: { turret: TurretConfig; update: (field: keyof TurretConfig, value: any) => void }) {
  const t = turret.attackType;
  if (t === "periodic" || t === "random") return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
      <div>
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, color: C.faint, marginBottom: 2 }}>
          <span>Bullet Speed (px/s)</span>
          <span style={{ color: C.text, fontFamily: "monospace" }}>{turret.bulletSpeed ?? 200}</span>
        </div>
        <input type="range" min={50} max={800} step={25} value={turret.bulletSpeed ?? 200}
          onChange={e => update("bulletSpeed", +e.target.value)} style={{ width: "100%", accentColor: C.red }} />
      </div>
      <div>
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, color: C.faint, marginBottom: 2 }}>
          <span>Bullets / Shot</span>
          <span style={{ color: C.text, fontFamily: "monospace" }}>{turret.bulletCount ?? 1}</span>
        </div>
        <input type="range" min={1} max={10} step={1} value={turret.bulletCount ?? 1}
          onChange={e => update("bulletCount", +e.target.value)} style={{ width: "100%", accentColor: C.red }} />
      </div>
    </div>
  );
  if (t === "beam") return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <label style={{ fontSize: 11, color: C.faint, minWidth: 90 }}>Beam Duration (s)</label>
        {numInput(turret.beamDuration, 3, v => update("beamDuration", v), 0.5)}
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <label style={{ fontSize: 11, color: C.faint, minWidth: 90 }}>Charge Period (s)</label>
        {numInput(turret.beamChargePeriod, 1.5, v => update("beamChargePeriod", v), 0.5)}
      </div>
    </div>
  );
  if (t === "aoe") return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <label style={{ fontSize: 11, color: C.faint, minWidth: 80 }}>AoE Radius (px)</label>
        {numInput(turret.aoeRadius, 80, v => update("aoeRadius", v), 10)}
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <label style={{ fontSize: 11, color: C.faint, minWidth: 80 }}>Damage Radius (px)</label>
        {numInput(turret.aoeDamageRadius, 50, v => update("aoeDamageRadius", v), 10)}
      </div>
    </div>
  );
  if (t === "boomerang") return (
    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
      <label style={{ fontSize: 11, color: C.faint, minWidth: 110 }}>Return Time (s)</label>
      {numInput(turret.boomerangReturnTime, 3, v => update("boomerangReturnTime", v), 0.5)}
    </div>
  );
  if (t === "laser_sweep") return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <label style={{ fontSize: 11, color: C.faint, minWidth: 75 }}>Sweep Arc (°)</label>
        {numInput(turret.laserSweepArcDeg, 180, v => update("laserSweepArcDeg", v), 10)}
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <label style={{ fontSize: 11, color: C.faint, minWidth: 80 }}>Sweep Speed (°/s)</label>
        {numInput(turret.laserSweepSpeedDeg, 90, v => update("laserSweepSpeedDeg", v), 10)}
      </div>
    </div>
  );
  if (t === "sniper") return (
    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
      <label style={{ fontSize: 11, color: C.faint, minWidth: 110 }}>Charge Time (s)</label>
      {numInput(turret.sniperChargeSec, 2, v => update("sniperChargeSec", v), 0.5)}
    </div>
  );
  if (t === "shotgun") return (
    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
      <label style={{ fontSize: 11, color: C.faint, minWidth: 110 }}>Cone Half-Angle (°)</label>
      {numInput(turret.shotgunConeHalfDeg, 30, v => update("shotgunConeHalfDeg", v), 5)}
    </div>
  );
  if (t === "mine_layer") return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <label style={{ fontSize: 11, color: C.faint, minWidth: 85 }}>Trigger Radius (px)</label>
        {numInput(turret.mineTriggerRadius, 50, v => update("mineTriggerRadius", v), 5)}
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <label style={{ fontSize: 11, color: C.faint, minWidth: 85 }}>Lifetime (s, 0=∞)</label>
        {numInput(turret.mineLifetimeSec, 10, v => update("mineLifetimeSec", v), 1)}
      </div>
    </div>
  );
  if (t === "gravity_cannon") return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <label style={{ fontSize: 11, color: C.faint, minWidth: 70 }}>Force (N)</label>
        {numInput(turret.gravityCannonForce, 0.01, v => update("gravityCannonForce", v), 0.001)}
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <label style={{ fontSize: 11, color: C.faint, minWidth: 70 }}>Duration (s)</label>
        {numInput(turret.gravityCannonDurationSec, 4, v => update("gravityCannonDurationSec", v), 0.5)}
      </div>
    </div>
  );
  if (t === "emp") return (
    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
      <label style={{ fontSize: 11, color: C.faint, minWidth: 110 }}>Disable Ticks</label>
      {numInput(turret.empDisableTicks, 120, v => update("empDisableTicks", Math.round(v)), 10)}
    </div>
  );
  if (t === "tracking_missile") return (
    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
      <label style={{ fontSize: 11, color: C.faint, minWidth: 110 }}>Tracking (°/s)</label>
      {numInput(turret.missileTrackingDeg, 180, v => update("missileTrackingDeg", v), 10)}
    </div>
  );
  if (t === "burst_fire") return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <label style={{ fontSize: 11, color: C.faint, minWidth: 55 }}>Burst Count</label>
        {numInput(turret.burstCount, 4, v => update("burstCount", Math.round(v)), 1)}
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <label style={{ fontSize: 11, color: C.faint, minWidth: 60 }}>Interval (s)</label>
        {numInput(turret.burstIntervalSec, 0.15, v => update("burstIntervalSec", v), 0.05)}
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <label style={{ fontSize: 11, color: C.faint, minWidth: 60 }}>Reload (s)</label>
        {numInput(turret.burstReloadSec, 2, v => update("burstReloadSec", v), 0.25)}
      </div>
    </div>
  );
  if (t === "plasma_ring") return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <label style={{ fontSize: 11, color: C.faint, minWidth: 80 }}>Expand Speed (px/s)</label>
        {numInput(turret.plasmaRingExpandSpeed, 150, v => update("plasmaRingExpandSpeed", v), 10)}
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <label style={{ fontSize: 11, color: C.faint, minWidth: 80 }}>Max Radius (px)</label>
        {numInput(turret.plasmaRingMaxRadius, 200, v => update("plasmaRingMaxRadius", v), 10)}
      </div>
    </div>
  );
  if (t === "tractor_beam") return (
    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
      <label style={{ fontSize: 11, color: C.faint, minWidth: 110 }}>Pull Force (N)</label>
      {numInput(turret.tractorBeamForce, 0.01, v => update("tractorBeamForce", v), 0.001)}
    </div>
  );
  return null;
}

export default function TurretsTab({ config, onChange }: Props) {
  const items = config.turrets ?? [];
  const { types: attackTypes, loading: typesLoading } = useTurretAttackTypes();
  const { assets: turretAssets, loading: assetsLoading } = useAssetLibrary(COLLECTIONS.TURRET_ASSETS);
  const { configs: elementTypes, loading: elemLoading } = useElementTypes();
  const assetOpts = turretAssets.map(a => ({ value: a.id, label: a.name ?? a.id, hint: a.tags?.join(", ") }));
  const attackTypeOpts = attackTypes.map(t => ({ value: t.id, label: t.label, hint: t.description }));
  const elemOpts = elementTypes.map(e => ({ value: e.id, label: e.name ?? e.id }));

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
          {/* Header */}
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
            <SearchableSelect
              value={turret.attackType ?? "periodic"}
              options={attackTypeOpts}
              onChange={v => update(turret.id, "attackType", v as TurretAttackType)}
              disabled={typesLoading}
              emptyLabel={typesLoading ? "Loading…" : "No attack types found"}
              style={{ width: "100%", background: C.bg2, border: `1px solid ${C.border}`, borderRadius: 6, color: C.text, fontSize: 11 }}
            />
          </div>

          {/* Type-specific config */}
          <div style={{ background: C.bg2, borderRadius: 8, padding: 10, marginBottom: 12 }}>
            <div style={{ fontSize: 11, color: C.faint, marginBottom: 6 }}>Attack Type Config</div>
            <TypeSpecificParams turret={turret} update={(field, val) => update(turret.id, field, val)} />
          </div>

          {/* Fire pattern */}
          <div style={{ marginBottom: 12 }}>
            <label style={{ display: "block", fontSize: 11, color: C.faint, marginBottom: 4 }}>Fire Pattern</label>
            <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
              {FIRE_PATTERNS.map(p => (
                <button key={p.value} onClick={() => update(turret.id, "firePattern", p.value)}
                  style={{ padding: "2px 8px", borderRadius: 5, fontSize: 10, cursor: "pointer",
                    background: (turret.firePattern ?? "nearest") === p.value ? C.red : "transparent",
                    color: (turret.firePattern ?? "nearest") === p.value ? C.white : C.muted,
                    border: `1px solid ${(turret.firePattern ?? "nearest") === p.value ? C.red : C.border}` }}>
                  {p.label}
                </button>
              ))}
            </div>
          </div>

          {/* Sprite pickers */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 12 }}>
            <div>
              <label style={{ display: "block", fontSize: 11, color: C.faint, marginBottom: 4 }}>Turret Sprite</label>
              <SearchableSelect
                value={turret.spriteId ?? ""}
                options={assetOpts}
                onChange={v => update(turret.id, "spriteId" as any, v || undefined)}
                disabled={assetsLoading}
                emptyLabel={assetsLoading ? "Loading…" : "No turret assets found"}
                style={{ width: "100%", background: C.bg2, border: `1px solid ${C.border}`, borderRadius: 6, color: C.text, fontSize: 11 }}
              />
            </div>
            <div>
              <label style={{ display: "block", fontSize: 11, color: C.faint, marginBottom: 4 }}>Projectile Sprite</label>
              <SearchableSelect
                value={(turret as any).projectileSpriteId ?? ""}
                options={assetOpts}
                onChange={v => update(turret.id, "projectileSpriteId" as any, v || undefined)}
                disabled={assetsLoading}
                emptyLabel={assetsLoading ? "Loading…" : "No turret assets found"}
                style={{ width: "100%", background: C.bg2, border: `1px solid ${C.border}`, borderRadius: 6, color: C.text, fontSize: 11 }}
              />
            </div>
          </div>

          {/* Element type */}
          <div style={{ marginBottom: 12 }}>
            <label style={{ display: "block", fontSize: 11, color: C.faint, marginBottom: 4 }}>Element Type</label>
            <SearchableSelect
              value={(turret.elementType as any) ?? ""}
              options={elemOpts}
              onChange={v => update(turret.id, "elementType" as any, v || undefined)}
              disabled={elemLoading}
              emptyLabel={elemLoading ? "Loading…" : "No element types"}
              style={{ width: "100%", background: C.bg2, border: `1px solid ${C.border}`, borderRadius: 6, color: C.text, fontSize: 11 }}
            />
          </div>

          {/* Common sliders */}
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

          {/* Behavior override */}
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

          {/* Feature Animation */}
          <div style={{ marginTop: 12, background: C.bg2, borderRadius: 8, padding: 10 }}>
            <FeatureAnimationPanel
              value={turret.featureAnimation}
              onChange={v => update(turret.id, "featureAnimation", v)}
              featureId={String(turret.id ?? idx)}
            />
          </div>

          {/* Rotation + Self-rotation */}
          <RotationBlockEditor
            value={turret.rotation}
            onChange={v => update(turret.id, "rotation", v)}
            label="Base Rotation"
          />
          <SelfRotationPanel
            rotation={turret.rotation?.initialAngleDeg}
            selfRotation={turret.selfRotation}
            onChangeRotation={v => update(turret.id, "rotation" as any, v !== undefined ? { ...(turret.rotation ?? { mode: "static" as const }), initialAngleDeg: v } : undefined)}
            onChangeSelfRotation={v => update(turret.id, "selfRotation" as any, v)}
          />
        </div>
      ))}
    </div>
  );
}
