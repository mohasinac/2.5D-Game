// Z10a: Features tab — Elevation Zones, Floor Hazard Zones, Effect Zones,
//        Background Particles, Environmental Effect sections.
// I6: Added SpinZone, GravityHole, Bump sections with behaviorId/behaviorParams editors.

import { useState } from "react";
import { C } from "@/styles/theme";
import { CollapsibleSection } from "@/components/admin/CollapsibleSection";
import type { ArenaConfig, FloorHazardType, EffectZoneType, BackgroundParticleType, ArenaEnvironmentalEffectPreset, SpinZoneConfig, GravityHoleConfig, BumpConfig, TriggerZoneConfig, TriggerZoneKind, TriggerZoneActivation, ArenaBeySawnConfig, DirectionalZoneConfig, DirectionalZoneType } from "@/types/arenaConfigNew";
import type { ElementType } from "@/types/elementTypes";
import FeatureAnimationPanel from "./FeatureAnimationPanel";
import SelfRotationPanel from "./SelfRotationPanel";
import { SearchableSelect } from "@/components/admin/SearchableSelect";
import { useElementTypes } from "@/hooks/useElementTypes";
import { useArenaFeatureConfigs } from "@/hooks/useArenaFeatureConfigs";

interface Props {
  config: ArenaConfig;
  onChange: (patch: Partial<ArenaConfig>) => void;
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  const [open, setOpen] = useState(true);
  return (
    <div style={{ borderBottom: `1px solid ${C.border}`, paddingBottom: 16, marginBottom: 16 }}>
      <button
        onClick={() => setOpen(o => !o)}
        style={{ display: "flex", alignItems: "center", gap: 8, background: "none", border: "none", cursor: "pointer", color: C.text, fontWeight: 600, fontSize: 13, padding: 0, marginBottom: open ? 12 : 0 }}
      >
        <span>{open ? "▼" : "▶"}</span>
        <span>{title}</span>
      </button>
      {open && children}
    </div>
  );
}

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
      <label style={{ fontSize: 12, color: C.muted, minWidth: 130 }}>{label}</label>
      {children}
    </div>
  );
}

function numInput(val: number | undefined, def: number, onChange: (n: number) => void, step = 1) {
  return (
    <input
      type="number"
      value={val ?? def}
      step={step}
      onChange={e => onChange(Number(e.target.value))}
      style={{ width: 80, background: C.bg1, border: `1px solid ${C.border}`, color: C.text, borderRadius: 6, padding: "4px 8px", fontSize: 12 }}
    />
  );
}

/** I6: Reusable behavior override panel for features that support behaviorId/behaviorParams. */
function BehaviorOverridePanel({ behaviorId, behaviorParams, onChangeBehaviorId, onChangeBehaviorParams }: {
  behaviorId?: string;
  behaviorParams?: Record<string, unknown>;
  onChangeBehaviorId: (id: string | undefined) => void;
  onChangeBehaviorParams: (params: Record<string, unknown> | undefined) => void;
}) {
  return (
    <div style={{ marginTop: 10, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
      <div>
        <label style={{ display: "block", fontSize: 11, color: C.faint, marginBottom: 4 }}>Behavior ID (optional)</label>
        <input
          type="text"
          data-testid="behavior-id-input"
          value={behaviorId ?? ""}
          onChange={e => onChangeBehaviorId(e.target.value || undefined)}
          placeholder="e.g. movement.orbit"
          style={{ width: "100%", background: C.bg1, border: `1px solid ${C.border}`, color: C.text, borderRadius: 6, padding: "4px 8px", fontSize: 12, boxSizing: "border-box" }}
        />
      </div>
      <div>
        <label style={{ display: "block", fontSize: 11, color: C.faint, marginBottom: 4 }}>Behavior Params (JSON)</label>
        <textarea
          value={behaviorParams ? JSON.stringify(behaviorParams, null, 2) : ""}
          onChange={e => {
            try {
              const parsed = e.target.value ? JSON.parse(e.target.value) : undefined;
              onChangeBehaviorParams(parsed);
            } catch { /* invalid JSON, ignore */ }
          }}
          placeholder='{ "strength": 0.5 }'
          rows={2}
          style={{ width: "100%", background: C.bg1, border: `1px solid ${C.border}`, color: C.text, borderRadius: 6, padding: "4px 8px", fontSize: 11, fontFamily: "monospace", resize: "vertical", boxSizing: "border-box" }}
        />
      </div>
    </div>
  );
}

/** I6: Small badge shown next to cards that have a behaviorId set. */
function BehaviorBadge({ behaviorId }: { behaviorId?: string }) {
  if (!behaviorId) return null;
  return (
    <span style={{ fontSize: 10, fontWeight: 600, padding: "2px 7px", borderRadius: 99, background: "rgba(168,85,247,0.15)", color: "#a855f7", border: "1px solid rgba(168,85,247,0.3)" }}>
      Behavior: {behaviorId}
    </span>
  );
}

/** L2C.7: Read-only authority badge per feature card. Shows effective player-control multiplier. */
type AuthorityZone = "spinZone" | "gravityWell" | "bump" | "obstacle" | "pit" | "railTrack";
function AuthorityBadge({ config, zone }: { config: ArenaConfig; zone: AuthorityZone }) {
  const cfg = config.playerAuthorityConfig;
  if (!cfg) return null;
  const base = cfg.globalMultiplier ?? 1.0;
  const override = cfg.featureOverrides?.[zone];
  const effective = override !== undefined ? base * override : base;
  if (Math.abs(effective - 1.0) < 0.01) return null; // hide when at default
  const color = effective < 1.0 ? "#ff9900" : "#44dd88";
  return (
    <span style={{ fontSize: 10, fontWeight: 600, padding: "2px 7px", borderRadius: 99, background: color + "22", color, border: `1px solid ${color}55` }}>
      Authority ×{effective.toFixed(2)}
    </span>
  );
}

export default function FeaturesTab({ config, onChange }: Props) {
  // ── Firebase catalog data ─────────────────────────────────────────────────
  const { configs: elementTypeConfigs, loading: elemLoading } = useElementTypes();
  const { byCategory, loading: featLoading } = useArenaFeatureConfigs();

  const elemOpts = elementTypeConfigs.map(cfg => ({ value: cfg.id, label: `${cfg.icon ?? ""} ${cfg.name}` }));
  const hazardOpts = byCategory.hazard.map(t => ({ value: t.id, label: `${t.icon ?? ""} ${t.label}`, hint: t.description }));
  const effectOpts = byCategory.effect_zone.map(t => ({ value: t.id, label: `${t.icon ?? ""} ${t.label}`, hint: t.description }));
  const particleOpts = byCategory.particle.map(t => ({ value: t.id, label: `${t.icon ?? ""} ${t.label}`, hint: t.description }));
  const envOpts = byCategory.env_preset.map(t => ({ value: t.id, label: `${t.icon ?? ""} ${t.label}`, hint: t.description }));

  // ── Background Particles ──────────────────────────────────────────────────
  const bp = config.backgroundParticles;
  const env = config.environmentalEffect;

  // ── Floor Hazard Zones ────────────────────────────────────────────────────
  const fhz = config.floorHazardZones ?? [];
  function addHazard() {
    const id = `hz${Date.now()}`;
    onChange({ floorHazardZones: [...fhz, { id, x_cm: 0, y_cm: 0, radius_cm: 5, hazardType: "lava", intensity: 1.0 }] });
  }
  function updateHazard(i: number, patch: object) {
    const next = fhz.map((z, idx) => idx === i ? { ...z, ...patch } : z);
    onChange({ floorHazardZones: next });
  }
  function removeHazard(i: number) {
    onChange({ floorHazardZones: fhz.filter((_, idx) => idx !== i) });
  }

  // ── Effect Zones ──────────────────────────────────────────────────────────
  const ez = (config as any).effectZones ?? [];
  function addEffect() {
    const id = `ez${Date.now()}`;
    onChange({ effectZones: [...ez, { id, x_cm: 0, y_cm: 0, radius_cm: 5, effectType: "safe_zone" }] } as any);
  }
  function updateEffect(i: number, patch: object) {
    const next = ez.map((z: any, idx: number) => idx === i ? { ...z, ...patch } : z);
    onChange({ effectZones: next } as any);
  }
  function removeEffect(i: number) {
    onChange({ effectZones: ez.filter((_: any, idx: number) => idx !== i) } as any);
  }

  // ── Elevation Zones ───────────────────────────────────────────────────────
  const elev = config.elevationZones ?? [];
  function addElev() {
    const id = `elev${Date.now()}`;
    onChange({ elevationZones: [...elev, { id, x_cm: 0, y_cm: 0, radius_cm: 6, heightCm: 4 }] });
  }
  function updateElev(i: number, patch: object) {
    const next = elev.map((z, idx) => idx === i ? { ...z, ...patch } : z);
    onChange({ elevationZones: next });
  }
  function removeElev(i: number) {
    onChange({ elevationZones: elev.filter((_, idx) => idx !== i) });
  }

  // ── Spin Zones (I6) ───────────────────────────────────────────────────────
  const spinZones: SpinZoneConfig[] = config.spinZones ?? [];
  function addSpinZone() {
    const id = `sz${Date.now()}`;
    const next: SpinZoneConfig = { id, x_cm: 0, y_cm: 0, radius_cm: 8, direction: "cw", intensityRadPerSec: 2, applyTo: "both" };
    onChange({ spinZones: [...spinZones, next] });
  }
  function updateSpinZone(i: number, patch: object) {
    const next = spinZones.map((z, idx) => idx === i ? { ...z, ...patch } : z);
    onChange({ spinZones: next });
  }
  function removeSpinZone(i: number) {
    onChange({ spinZones: spinZones.filter((_, idx) => idx !== i) });
  }

  // ── Gravity Holes (I6) ────────────────────────────────────────────────────
  const gravityHoles: GravityHoleConfig[] = config.gravityHoles ?? [];
  function addGravityHole() {
    const id = `gh${Date.now()}`;
    const next: GravityHoleConfig = { id, x_cm: 0, y_cm: 0, forceN: 0.005, effectiveRadiusCm: 10, activeMs: 2000, intervalMs: 5000, warningMs: 800, visibility: "warning-only" };
    onChange({ gravityHoles: [...gravityHoles, next] });
  }
  function updateGravityHole(i: number, patch: object) {
    const next = gravityHoles.map((z, idx) => idx === i ? { ...z, ...patch } : z);
    onChange({ gravityHoles: next });
  }
  function removeGravityHole(i: number) {
    onChange({ gravityHoles: gravityHoles.filter((_, idx) => idx !== i) });
  }

  // ── Trigger Zones ────────────────────────────────────────────────────────
  const triggerZones: TriggerZoneConfig[] = (config as any).triggerZones ?? [];
  function addTriggerZone() {
    const id = `tz${Date.now()}`;
    const next: TriggerZoneConfig = {
      id, x_cm: 0, y_cm: 0,
      shape: { kind: "circle", radiusCm: 5 },
      kind: { type: "safe" },
      activation: { type: "always-on" },
    };
    onChange({ triggerZones: [...triggerZones, next] } as any);
  }
  function updateTriggerZone(i: number, patch: object) {
    const next = triggerZones.map((z, idx) => idx === i ? { ...z, ...patch } : z);
    onChange({ triggerZones: next } as any);
  }
  function removeTriggerZone(i: number) {
    onChange({ triggerZones: triggerZones.filter((_, idx) => idx !== i) } as any);
  }

  // ── Bumps (I6) ────────────────────────────────────────────────────────────
  const bumps: BumpConfig[] = config.bumps ?? [];
  function addBump() {
    const id = `bump${Date.now()}`;
    const next: BumpConfig = { id, x_cm: 0, y_cm: 0, radius_cm: 3, popHeight_cm: 2, recoil: 0.3 };
    onChange({ bumps: [...bumps, next] });
  }
  function updateBump(i: number, patch: object) {
    const next = bumps.map((z, idx) => idx === i ? { ...z, ...patch } : z);
    onChange({ bumps: next });
  }
  function removeBump(i: number) {
    onChange({ bumps: bumps.filter((_, idx) => idx !== i) });
  }

  // ── Directional Zones (Phase ZP) ─────────────────────────────────────────
  const directionalZones: DirectionalZoneConfig[] = (config as any).directionalZones ?? [];
  function addDirectionalZone() {
    const id = `dz${Date.now()}`;
    const next: DirectionalZoneConfig = { id, type: "wind_corridor", x_cm: 0, y_cm: 0, radius_cm: 8, width_cm: 8, length_cm: 20, angleDeg: 0, force: 0.005 };
    onChange({ directionalZones: [...directionalZones, next] } as any);
  }
  function updateDirectionalZone(i: number, patch: object) {
    const next = directionalZones.map((z, idx) => idx === i ? { ...z, ...patch } : z);
    onChange({ directionalZones: next } as any);
  }
  function removeDirectionalZone(i: number) {
    onChange({ directionalZones: directionalZones.filter((_, idx) => idx !== i) } as any);
  }

  const DIRECTIONAL_ZONE_TYPES: { value: DirectionalZoneType; label: string; hint: string }[] = [
    { value: "wind_corridor", label: "Wind Corridor", hint: "Rectangular channel — constant directional push" },
    { value: "tornado",       label: "Tornado",       hint: "Rotating inward spiral — orbit + pull toward eye" },
    { value: "vortex",        label: "Vortex",        hint: "Strong inward spiral — quadratic pull near center" },
    { value: "updraft",       label: "Updraft",       hint: "Upward lift — reduces spin loss + counters outward drift" },
    { value: "downdraft",     label: "Downdraft",     hint: "Downward press — pins beys + extra spin drain" },
    { value: "slipstream",    label: "Slipstream",    hint: "Drag-reducing lane — speed boost along stream direction" },
    { value: "dust_devil",    label: "Dust Devil",    hint: "Small fast-spinning column — erratic orbit + wobble" },
  ];

  return (
    <CollapsibleSection title="Features" storageKey="arena-features-main" defaultOpen={true}>
    <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>

      {/* Background Particles */}
      <Section title="Background Particles">
        <div data-testid="arena-background-particles" style={{ display: "contents" }}></div>
        <Row label="Enabled">
          <input type="checkbox" checked={!!bp} onChange={e => onChange({ backgroundParticles: e.target.checked ? { type: "snow", density: 20 } : undefined })} />
        </Row>
        {bp && (
          <>
            <Row label="Type">
              <SearchableSelect
                value={bp.type}
                disabled={featLoading}
                emptyLabel={featLoading ? "Loading…" : "Select type"}
                options={particleOpts}
                onChange={v => onChange({ backgroundParticles: { ...bp, type: v as BackgroundParticleType } })}
                style={{ background: C.bg1, border: `1px solid ${C.border}`, color: C.text, borderRadius: 6, padding: "4px 8px", fontSize: 12 }}
              />
            </Row>
            <Row label="Density (p/s)">{numInput(bp.density, 20, v => onChange({ backgroundParticles: { ...bp, density: v } }))}</Row>
            <Row label="Direction (°)">{numInput(bp.direction, 0, v => onChange({ backgroundParticles: { ...bp, direction: v } }))}</Row>
            <Row label="Speed">
              <input type="range" min={0.1} max={3} step={0.1} value={bp.speed ?? 1} onChange={e => onChange({ backgroundParticles: { ...bp, speed: Number(e.target.value) } })} style={{ width: 100 }} />
              <span style={{ fontSize: 11, color: C.muted }}>{(bp.speed ?? 1).toFixed(1)}×</span>
            </Row>
            <Row label="Color">
              <input type="color" value={bp.color ?? "#ffffff"} onChange={e => onChange({ backgroundParticles: { ...bp, color: e.target.value } })}
                style={{ width: 40, height: 28, border: `1px solid ${C.border}`, borderRadius: 4 }} />
            </Row>
            <Row label="Affected by rotation">
              <input type="checkbox" checked={bp.affectedByArenaRotation ?? true} onChange={e => onChange({ backgroundParticles: { ...bp, affectedByArenaRotation: e.target.checked } })} />
            </Row>
          </>
        )}
      </Section>

      {/* Environmental Effect */}
      <Section title="Environmental Effect">
        <div data-testid="arena-env-effect" style={{ display: "contents" }}></div>
        <Row label="Enabled">
          <input type="checkbox" checked={!!env} onChange={e => onChange({ environmentalEffect: e.target.checked ? { preset: "storm", intensity: 0.5 } : undefined })} />
        </Row>
        {env && (
          <>
            <Row label="Preset">
              <SearchableSelect
                value={env.preset}
                disabled={featLoading}
                emptyLabel={featLoading ? "Loading…" : "Select preset"}
                options={envOpts}
                onChange={v => onChange({ environmentalEffect: { ...env, preset: v as ArenaEnvironmentalEffectPreset } })}
                style={{ background: C.bg1, border: `1px solid ${C.border}`, color: C.text, borderRadius: 6, padding: "4px 8px", fontSize: 12 }}
              />
            </Row>
            <Row label="Intensity">
              <input type="range" min={0} max={1} step={0.05} value={env.intensity ?? 0.5} onChange={e => onChange({ environmentalEffect: { ...env, intensity: Number(e.target.value) } })} style={{ width: 100 }} />
              <span style={{ fontSize: 11, color: C.muted }}>{(env.intensity ?? 0.5).toFixed(2)}</span>
            </Row>
            <Row label="Interval (ms)">{numInput(env.intervalMs, 4000, v => onChange({ environmentalEffect: { ...env, intervalMs: v } }), 500)}</Row>
          </>
        )}
      </Section>

      {/* Floor Hazard Zones */}
      <Section title={`Floor Hazard Zones (${fhz.length})`}>
        {fhz.map((z, i) => (
          <div key={z.id} data-testid={`effect-zone-${z.id}`} style={{ background: C.bg1, border: `1px solid ${C.border}`, borderRadius: 10, padding: 12, marginBottom: 10 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
              <span style={{ fontSize: 12, fontWeight: 600, color: C.text }}>{z.id}</span>
              <button onClick={() => removeHazard(i)} style={{ background: "none", border: "none", color: C.muted, cursor: "pointer", fontSize: 14 }}>✕</button>
            </div>
            <Row label="Type">
              <SearchableSelect
                value={z.hazardType}
                disabled={featLoading}
                emptyLabel={featLoading ? "Loading…" : "Select hazard"}
                options={hazardOpts}
                onChange={v => updateHazard(i, { hazardType: v as FloorHazardType })}
                style={{ background: C.bg1, border: `1px solid ${C.border}`, color: C.text, borderRadius: 6, fontSize: 12 }}
              />
            </Row>
            <Row label="Element Type">
              <SearchableSelect
                value={(z as any).elementType ?? ""}
                disabled={elemLoading}
                emptyLabel={elemLoading ? "Loading…" : "— none —"}
                options={elemOpts}
                onChange={v => updateHazard(i, { elementType: (v as ElementType) || undefined })}
                style={{ background: C.bg1, border: `1px solid ${C.border}`, color: C.text, borderRadius: 6, fontSize: 12 }}
              />
            </Row>
            <Row label="X (cm)">{numInput(z.x_cm, 0, v => updateHazard(i, { x_cm: v }))}</Row>
            <Row label="Y (cm)">{numInput(z.y_cm, 0, v => updateHazard(i, { y_cm: v }))}</Row>
            <Row label="Radius (cm)">{numInput(z.radius_cm, 5, v => updateHazard(i, { radius_cm: v }), 0.5)}</Row>
            <Row label="Intensity">{numInput(z.intensity, 1, v => updateHazard(i, { intensity: v }), 0.1)}</Row>
            {z.hazardType === "electric" && (
              <Row label="Disable ticks">{numInput(z.disableTicks, 90, v => updateHazard(i, { disableTicks: v }))}</Row>
            )}
            {z.hazardType === "lava" && (
              <>
                <Row label="Damage/tick">{numInput(z.damagePerTick, 5, v => updateHazard(i, { damagePerTick: v }))}</Row>
                <Row label="Spin decay mult">{numInput(z.spinDecayMult, 1.5, v => updateHazard(i, { spinDecayMult: v }), 0.1)}</Row>
              </>
            )}
            <FeatureAnimationPanel
              featureId={z.id}
              value={(z as any).featureAnimation}
              onChange={v => updateHazard(i, { featureAnimation: v })}
            />
            <SelfRotationPanel
              rotation={(z as any).rotation}
              selfRotation={(z as any).selfRotation}
              onChangeRotation={v => updateHazard(i, { rotation: v } as any)}
              onChangeSelfRotation={v => updateHazard(i, { selfRotation: v } as any)}
            />
          </div>
        ))}
        <button onClick={addHazard} style={{ padding: "6px 14px", background: C.purple, color: C.white, border: "none", borderRadius: 8, fontSize: 12, cursor: "pointer" }}>
          + Add Hazard Zone
        </button>
      </Section>

      {/* Effect Zones */}
      <Section title={`Effect Zones (${ez.length})`}>
        {ez.map((z: any, i: number) => (
          <div key={z.id} data-testid={`effect-zone-${z.id}`} style={{ background: C.bg1, border: `1px solid ${C.border}`, borderRadius: 10, padding: 12, marginBottom: 10 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
              <span style={{ fontSize: 12, fontWeight: 600, color: C.text }}>{z.id}</span>
              <button onClick={() => removeEffect(i)} style={{ background: "none", border: "none", color: C.muted, cursor: "pointer", fontSize: 14 }}>✕</button>
            </div>
            <Row label="Effect Type">
              <SearchableSelect
                value={z.effectType}
                disabled={featLoading}
                emptyLabel={featLoading ? "Loading…" : "Select effect"}
                options={effectOpts}
                onChange={v => updateEffect(i, { effectType: v as EffectZoneType })}
                style={{ background: C.bg1, border: `1px solid ${C.border}`, color: C.text, borderRadius: 6, fontSize: 12 }}
              />
            </Row>
            <Row label="Element Type">
              <SearchableSelect
                value={z.elementType ?? ""}
                disabled={elemLoading}
                emptyLabel={elemLoading ? "Loading…" : "— none —"}
                options={elemOpts}
                onChange={v => updateEffect(i, { elementType: (v as ElementType) || undefined })}
                style={{ background: C.bg1, border: `1px solid ${C.border}`, color: C.text, borderRadius: 6, fontSize: 12 }}
              />
            </Row>
            <Row label="X (cm)">{numInput(z.x_cm, 0, v => updateEffect(i, { x_cm: v }))}</Row>
            <Row label="Y (cm)">{numInput(z.y_cm, 0, v => updateEffect(i, { y_cm: v }))}</Row>
            <Row label="Radius (cm)">{numInput(z.radius_cm, 5, v => updateEffect(i, { radius_cm: v }), 0.5)}</Row>
            <FeatureAnimationPanel
              featureId={z.id}
              value={z.featureAnimation}
              onChange={v => updateEffect(i, { featureAnimation: v })}
            />
            <SelfRotationPanel
              rotation={(z as any).rotation}
              selfRotation={(z as any).selfRotation}
              onChangeRotation={v => updateEffect(i, { rotation: v } as any)}
              onChangeSelfRotation={v => updateEffect(i, { selfRotation: v } as any)}
            />
          </div>
        ))}
        <button onClick={addEffect} style={{ padding: "6px 14px", background: C.purple, color: C.white, border: "none", borderRadius: 8, fontSize: 12, cursor: "pointer" }}>
          + Add Effect Zone
        </button>
      </Section>

      {/* Elevation Zones */}
      <Section title={`Elevation Zones (${elev.length})`}>
        {elev.map((z, i) => (
          <div key={z.id} style={{ background: C.bg1, border: `1px solid ${C.border}`, borderRadius: 10, padding: 12, marginBottom: 10 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
              <span style={{ fontSize: 12, fontWeight: 600, color: C.text }}>{z.id}</span>
              <button onClick={() => removeElev(i)} style={{ background: "none", border: "none", color: C.muted, cursor: "pointer", fontSize: 14 }}>✕</button>
            </div>
            <Row label="X (cm)">{numInput(z.x_cm, 0, v => updateElev(i, { x_cm: v }))}</Row>
            <Row label="Y (cm)">{numInput(z.y_cm, 0, v => updateElev(i, { y_cm: v }))}</Row>
            <Row label="Radius (cm)">{numInput(z.radius_cm, 6, v => updateElev(i, { radius_cm: v }), 0.5)}</Row>
            <Row label="Height (cm)">{numInput(z.heightCm, 4, v => updateElev(i, { heightCm: v }), 0.5)}</Row>
            <Row label="Spin boost on platform">{numInput(z.spinBoostOnPlatform, 0, v => updateElev(i, { spinBoostOnPlatform: v }), 5)}</Row>
            <FeatureAnimationPanel
              featureId={z.id}
              value={(z as any).featureAnimation}
              onChange={v => updateElev(i, { featureAnimation: v })}
            />
            <SelfRotationPanel
              rotation={(z as any).rotation}
              selfRotation={(z as any).selfRotation}
              onChangeRotation={v => updateElev(i, { rotation: v } as any)}
              onChangeSelfRotation={v => updateElev(i, { selfRotation: v } as any)}
            />
          </div>
        ))}
        <button onClick={addElev} style={{ padding: "6px 14px", background: C.purple, color: C.white, border: "none", borderRadius: 8, fontSize: 12, cursor: "pointer" }}>
          + Add Elevation Zone
        </button>
      </Section>

      {/* Spin Zones (I6) */}
      <Section title={`Spin Zones (${spinZones.length})`}>
        {spinZones.map((z, i) => (
          <div key={z.id} data-testid={`spin-zone-${z.id}`} style={{ background: C.bg1, border: `1px solid ${C.border}`, borderRadius: 10, padding: 12, marginBottom: 10 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span style={{ fontSize: 12, fontWeight: 600, color: C.text }}>{z.id}</span>
                <BehaviorBadge behaviorId={z.behaviorId} />
                <AuthorityBadge config={config} zone="spinZone" />
              </div>
              <button onClick={() => removeSpinZone(i)} style={{ background: "none", border: "none", color: C.muted, cursor: "pointer", fontSize: 14 }}>✕</button>
            </div>
            <Row label="X (cm)">{numInput(z.x_cm, 0, v => updateSpinZone(i, { x_cm: v }))}</Row>
            <Row label="Y (cm)">{numInput(z.y_cm, 0, v => updateSpinZone(i, { y_cm: v }))}</Row>
            <Row label="Radius (cm)">{numInput(z.radius_cm, 8, v => updateSpinZone(i, { radius_cm: v }), 0.5)}</Row>
            <Row label="Intensity (rad/s)">{numInput(z.intensityRadPerSec, 2, v => updateSpinZone(i, { intensityRadPerSec: v }), 0.5)}</Row>
            <Row label="Direction">
              <SearchableSelect
                value={z.direction}
                options={[{ value: "cw", label: "Clockwise" }, { value: "ccw", label: "Counter-clockwise" }]}
                onChange={v => updateSpinZone(i, { direction: v as "cw" | "ccw" })}
                style={{ background: C.bg1, border: `1px solid ${C.border}`, color: C.text, borderRadius: 6, fontSize: 12 }}
              />
            </Row>
            <Row label="Apply To">
              <SearchableSelect
                value={z.applyTo}
                options={[{ value: "linear", label: "Linear (orbit)" }, { value: "spin", label: "Spin top-up" }, { value: "both", label: "Both" }]}
                onChange={v => updateSpinZone(i, { applyTo: v as "linear" | "spin" | "both" })}
                style={{ background: C.bg1, border: `1px solid ${C.border}`, color: C.text, borderRadius: 6, fontSize: 12 }}
              />
            </Row>
            <Row label="Element Type">
              <SearchableSelect
                value={(z as any).elementType ?? ""}
                disabled={elemLoading}
                emptyLabel={elemLoading ? "Loading…" : "— none —"}
                options={elemOpts}
                onChange={v => updateSpinZone(i, { elementType: (v as ElementType) || undefined })}
                style={{ background: C.bg1, border: `1px solid ${C.border}`, color: C.text, borderRadius: 6, fontSize: 12 }}
              />
            </Row>
            {/* I6: Behavior override */}
            <BehaviorOverridePanel
              behaviorId={z.behaviorId}
              behaviorParams={z.behaviorParams}
              onChangeBehaviorId={id => updateSpinZone(i, { behaviorId: id })}
              onChangeBehaviorParams={params => updateSpinZone(i, { behaviorParams: params })}
            />
            <Row label="Controlled By Switch">
              <input
                type="text"
                value={z.controlledBySwitchId ?? ""}
                onChange={e => updateSpinZone(i, { controlledBySwitchId: e.target.value || undefined })}
                placeholder="e.g. sw1"
                style={{ width: "100%", background: C.bg1, border: `1px solid ${C.border}`, color: C.text, borderRadius: 6, padding: "4px 8px", fontSize: 12, boxSizing: "border-box" as const }}
              />
            </Row>
            <SelfRotationPanel
              rotation={(z as any).rotation}
              selfRotation={(z as any).selfRotation}
              onChangeRotation={v => updateSpinZone(i, { rotation: v } as any)}
              onChangeSelfRotation={v => updateSpinZone(i, { selfRotation: v } as any)}
            />
          </div>
        ))}
        <button onClick={addSpinZone} style={{ padding: "6px 14px", background: C.blue, color: C.white, border: "none", borderRadius: 8, fontSize: 12, cursor: "pointer" }}>
          + Add Spin Zone
        </button>
      </Section>

      {/* Gravity Holes (I6) */}
      <Section title={`Gravity Holes (${gravityHoles.length})`}>
        {gravityHoles.map((z, i) => (
          <div key={z.id} data-testid={`gravity-hole-${z.id}`} style={{ background: C.bg1, border: `1px solid ${C.border}`, borderRadius: 10, padding: 12, marginBottom: 10 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span style={{ fontSize: 12, fontWeight: 600, color: C.text }}>{z.id}</span>
                <BehaviorBadge behaviorId={z.behaviorId} />
                <AuthorityBadge config={config} zone="gravityWell" />
              </div>
              <button onClick={() => removeGravityHole(i)} style={{ background: "none", border: "none", color: C.muted, cursor: "pointer", fontSize: 14 }}>✕</button>
            </div>
            <Row label="X (cm)">{numInput(z.x_cm, 0, v => updateGravityHole(i, { x_cm: v }))}</Row>
            <Row label="Y (cm)">{numInput(z.y_cm, 0, v => updateGravityHole(i, { y_cm: v }))}</Row>
            <Row label="Force (N)">{numInput(z.forceN, 0.005, v => updateGravityHole(i, { forceN: v }), 0.001)}</Row>
            <Row label="Radius (cm)">{numInput(z.effectiveRadiusCm, 10, v => updateGravityHole(i, { effectiveRadiusCm: v }), 0.5)}</Row>
            <Row label="Active (ms)">{numInput(z.activeMs, 2000, v => updateGravityHole(i, { activeMs: v }), 250)}</Row>
            <Row label="Interval (ms)">{numInput(z.intervalMs, 5000, v => updateGravityHole(i, { intervalMs: v }), 500)}</Row>
            <Row label="Warning (ms)">{numInput(z.warningMs, 800, v => updateGravityHole(i, { warningMs: v }), 100)}</Row>
            <Row label="Visibility">
              <SearchableSelect
                value={z.visibility}
                options={[{ value: "always-hidden", label: "Always hidden" }, { value: "warning-only", label: "Warning only" }, { value: "visible", label: "Visible" }]}
                onChange={v => updateGravityHole(i, { visibility: v as "always-hidden" | "warning-only" | "visible" })}
                style={{ background: C.bg1, border: `1px solid ${C.border}`, color: C.text, borderRadius: 6, fontSize: 12 }}
              />
            </Row>
            <Row label="Element Type">
              <SearchableSelect
                value={(z as any).elementType ?? ""}
                disabled={elemLoading}
                emptyLabel={elemLoading ? "Loading…" : "— none —"}
                options={elemOpts}
                onChange={v => updateGravityHole(i, { elementType: (v as ElementType) || undefined })}
                style={{ background: C.bg1, border: `1px solid ${C.border}`, color: C.text, borderRadius: 6, fontSize: 12 }}
              />
            </Row>
            {/* I6: Behavior override */}
            <BehaviorOverridePanel
              behaviorId={z.behaviorId}
              behaviorParams={z.behaviorParams}
              onChangeBehaviorId={id => updateGravityHole(i, { behaviorId: id })}
              onChangeBehaviorParams={params => updateGravityHole(i, { behaviorParams: params })}
            />
            <Row label="Controlled By Switch">
              <input
                type="text"
                value={z.controlledBySwitchId ?? ""}
                onChange={e => updateGravityHole(i, { controlledBySwitchId: e.target.value || undefined })}
                placeholder="e.g. sw1"
                style={{ width: "100%", background: C.bg1, border: `1px solid ${C.border}`, color: C.text, borderRadius: 6, padding: "4px 8px", fontSize: 12, boxSizing: "border-box" as const }}
              />
            </Row>
            <SelfRotationPanel
              rotation={(z as any).rotation}
              selfRotation={(z as any).selfRotation}
              onChangeRotation={v => updateGravityHole(i, { rotation: v } as any)}
              onChangeSelfRotation={v => updateGravityHole(i, { selfRotation: v } as any)}
            />
          </div>
        ))}
        <button onClick={addGravityHole} style={{ padding: "6px 14px", background: C.blue, color: C.white, border: "none", borderRadius: 8, fontSize: 12, cursor: "pointer" }}>
          + Add Gravity Hole
        </button>
      </Section>

      {/* Bumps (I6) */}
      <Section title={`Bumps (${bumps.length})`}>
        {bumps.map((z, i) => (
          <div key={z.id} data-testid={`bump-${z.id}`} style={{ background: C.bg1, border: `1px solid ${C.border}`, borderRadius: 10, padding: 12, marginBottom: 10 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span style={{ fontSize: 12, fontWeight: 600, color: C.text }}>{z.id}</span>
                <BehaviorBadge behaviorId={z.behaviorId} />
                <AuthorityBadge config={config} zone="bump" />
              </div>
              <button onClick={() => removeBump(i)} style={{ background: "none", border: "none", color: C.muted, cursor: "pointer", fontSize: 14 }}>✕</button>
            </div>
            <Row label="X (cm)">{numInput(z.x_cm, 0, v => updateBump(i, { x_cm: v }))}</Row>
            <Row label="Y (cm)">{numInput(z.y_cm, 0, v => updateBump(i, { y_cm: v }))}</Row>
            <Row label="Radius (cm)">{numInput(z.radius_cm, 3, v => updateBump(i, { radius_cm: v }), 0.5)}</Row>
            <Row label="Pop Height (cm)">{numInput(z.popHeight_cm, 2, v => updateBump(i, { popHeight_cm: v }), 0.5)}</Row>
            <Row label="Recoil">{numInput(z.recoil, 0.3, v => updateBump(i, { recoil: v }), 0.05)}</Row>
            <Row label="Element Type">
              <SearchableSelect
                value={(z as any).elementType ?? ""}
                disabled={elemLoading}
                emptyLabel={elemLoading ? "Loading…" : "— none —"}
                options={elemOpts}
                onChange={v => updateBump(i, { elementType: (v as ElementType) || undefined })}
                style={{ background: C.bg1, border: `1px solid ${C.border}`, color: C.text, borderRadius: 6, fontSize: 12 }}
              />
            </Row>
            {/* I6: Behavior override */}
            <BehaviorOverridePanel
              behaviorId={z.behaviorId}
              behaviorParams={z.behaviorParams}
              onChangeBehaviorId={id => updateBump(i, { behaviorId: id })}
              onChangeBehaviorParams={params => updateBump(i, { behaviorParams: params })}
            />
            <Row label="Controlled By Switch">
              <input
                type="text"
                value={z.controlledBySwitchId ?? ""}
                onChange={e => updateBump(i, { controlledBySwitchId: e.target.value || undefined })}
                placeholder="e.g. sw1"
                style={{ width: "100%", background: C.bg1, border: `1px solid ${C.border}`, color: C.text, borderRadius: 6, padding: "4px 8px", fontSize: 12, boxSizing: "border-box" as const }}
              />
            </Row>
            <SelfRotationPanel
              rotation={(z as any).rotation}
              selfRotation={(z as any).selfRotation}
              onChangeRotation={v => updateBump(i, { rotation: v } as any)}
              onChangeSelfRotation={v => updateBump(i, { selfRotation: v } as any)}
            />
          </div>
        ))}
        <button onClick={addBump} style={{ padding: "6px 14px", background: C.blue, color: C.white, border: "none", borderRadius: 8, fontSize: 12, cursor: "pointer" }}>
          + Add Bump
        </button>
      </Section>

      {/* Directional Zones (Phase ZP) */}
      <Section title={`Directional Zones (${directionalZones.length})`}>
        {directionalZones.length === 0 && (
          <p style={{ fontSize: 12, color: C.faint, marginBottom: 10 }}>
            Zones that apply sustained directional forces — wind corridors, tornadoes, vortices, updrafts, and more.
          </p>
        )}
        {directionalZones.map((z, i) => (
          <div key={z.id} data-testid={`directional-zone-${z.id}`} style={{ background: C.bg1, border: `1px solid ${C.border}`, borderRadius: 10, padding: 12, marginBottom: 10 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span style={{ fontSize: 12, fontWeight: 600, color: C.text }}>{z.id}</span>
                <span style={{ fontSize: 10, padding: "1px 6px", borderRadius: 99, background: "rgba(68,180,255,0.15)", color: "#44b4ff", border: "1px solid rgba(68,180,255,0.3)" }}>
                  {z.type}
                </span>
                {z.behaviorId && <BehaviorBadge behaviorId={z.behaviorId} />}
              </div>
              <button onClick={() => removeDirectionalZone(i)} style={{ background: "none", border: "none", color: C.muted, cursor: "pointer", fontSize: 14 }}>✕</button>
            </div>

            {/* Zone type */}
            <Row label="Type">
              <SearchableSelect
                value={z.type}
                options={DIRECTIONAL_ZONE_TYPES}
                onChange={v => updateDirectionalZone(i, { type: v as DirectionalZoneType })}
                style={{ background: C.bg1, border: `1px solid ${C.border}`, color: C.text, borderRadius: 6, fontSize: 12 }}
              />
            </Row>

            {/* Position */}
            <Row label="X (cm)">{numInput(z.x_cm, 0, v => updateDirectionalZone(i, { x_cm: v }))}</Row>
            <Row label="Y (cm)">{numInput(z.y_cm, 0, v => updateDirectionalZone(i, { y_cm: v }))}</Row>

            {/* Shape — circular types use radius, rectangular use width+length */}
            {(z.type === "wind_corridor" || z.type === "slipstream") ? (
              <>
                <Row label="Width (cm)">{numInput(z.width_cm, 8, v => updateDirectionalZone(i, { width_cm: v }), 0.5)}</Row>
                <Row label="Length (cm)">{numInput(z.length_cm, 20, v => updateDirectionalZone(i, { length_cm: v }), 0.5)}</Row>
                <Row label="Angle (°)">{numInput(z.angleDeg, 0, v => updateDirectionalZone(i, { angleDeg: v }), 5)}</Row>
              </>
            ) : (
              <Row label="Radius (cm)">{numInput(z.radius_cm, 8, v => updateDirectionalZone(i, { radius_cm: v }), 0.5)}</Row>
            )}

            {/* Force */}
            <Row label="Force (N)">{numInput(z.force, 0.005, v => updateDirectionalZone(i, { force: v }), 0.001)}</Row>

            {/* Tornado / vortex / dust_devil rotation */}
            {(z.type === "tornado" || z.type === "vortex" || z.type === "dust_devil") && (
              <>
                <Row label="Spin Direction">
                  <div style={{ display: "flex", gap: 6 }}>
                    {(["cw", "ccw"] as const).map(d => (
                      <button key={d} onClick={() => updateDirectionalZone(i, { spinDirection: d })}
                        style={{ padding: "2px 10px", borderRadius: 5, fontSize: 11, cursor: "pointer",
                          background: (z.spinDirection ?? "cw") === d ? "#44b4ff" : "transparent",
                          color: (z.spinDirection ?? "cw") === d ? "#fff" : C.muted,
                          border: `1px solid ${(z.spinDirection ?? "cw") === d ? "#44b4ff" : C.border}` }}>
                        {d.toUpperCase()}
                      </button>
                    ))}
                  </div>
                </Row>
                <Row label="Rotation Factor">{numInput(z.rotationFactor, 1.0, v => updateDirectionalZone(i, { rotationFactor: v }), 0.1)}</Row>
                <Row label="Center Pull (N)">{numInput(z.centerPullForce, z.force * 0.5, v => updateDirectionalZone(i, { centerPullForce: v }), 0.001)}</Row>
              </>
            )}

            {/* Updraft extras */}
            {z.type === "updraft" && (
              <Row label="Spin Recovery/s">{numInput(z.spinRecoveryPerSec, 30, v => updateDirectionalZone(i, { spinRecoveryPerSec: v }), 5)}</Row>
            )}

            {/* Downdraft extras */}
            {z.type === "downdraft" && (
              <Row label="Spin Drain Mult">{numInput(z.spinDrainMult, 1.5, v => updateDirectionalZone(i, { spinDrainMult: v }), 0.1)}</Row>
            )}

            {/* Pulse */}
            <Row label="Pulse">
              <input type="checkbox" checked={!!z.pulse}
                onChange={e => updateDirectionalZone(i, { pulse: e.target.checked ? { activeMs: 2000, pauseMs: 2000 } : undefined })} />
            </Row>
            {z.pulse && (
              <>
                <Row label="Active (ms)">{numInput(z.pulse.activeMs, 2000, v => updateDirectionalZone(i, { pulse: { ...z.pulse!, activeMs: v } }), 100)}</Row>
                <Row label="Pause (ms)">{numInput(z.pulse.pauseMs, 2000, v => updateDirectionalZone(i, { pulse: { ...z.pulse!, pauseMs: v } }), 100)}</Row>
              </>
            )}

            {/* Element Type */}
            <Row label="Element Type">
              <SearchableSelect
                value={(z as any).elementType ?? ""}
                disabled={elemLoading}
                emptyLabel={elemLoading ? "Loading…" : "— none —"}
                options={elemOpts}
                onChange={v => updateDirectionalZone(i, { elementType: (v as any) || undefined })}
                style={{ background: C.bg1, border: `1px solid ${C.border}`, color: C.text, borderRadius: 6, fontSize: 12 }}
              />
            </Row>

            <BehaviorOverridePanel
              behaviorId={z.behaviorId}
              behaviorParams={z.behaviorParams}
              onChangeBehaviorId={id => updateDirectionalZone(i, { behaviorId: id })}
              onChangeBehaviorParams={params => updateDirectionalZone(i, { behaviorParams: params })}
            />
            <Row label="Controlled By Switch">
              <input
                type="text"
                value={(z as any).controlledBySwitchId ?? ""}
                onChange={e => updateDirectionalZone(i, { controlledBySwitchId: e.target.value || undefined } as any)}
                placeholder="e.g. sw1"
                style={{ width: "100%", background: C.bg1, border: `1px solid ${C.border}`, color: C.text, borderRadius: 6, padding: "4px 8px", fontSize: 12, boxSizing: "border-box" as const }}
              />
            </Row>
            <SelfRotationPanel
              rotation={(z as any).rotation as any}
              selfRotation={z.selfRotation as any}
              onChangeRotation={v => updateDirectionalZone(i, { rotation: v } as any)}
              onChangeSelfRotation={v => updateDirectionalZone(i, { selfRotation: v } as any)}
            />
          </div>
        ))}
        <button onClick={addDirectionalZone} style={{ padding: "6px 14px", background: "#44b4ff", color: "#fff", border: "none", borderRadius: 8, fontSize: 12, cursor: "pointer" }}>
          + Add Directional Zone
        </button>
      </Section>

      {/* Trigger Zones */}
      <Section title={`Trigger Zones (${triggerZones.length})`}>
        {triggerZones.map((z, i) => {
          const kind = z.kind as TriggerZoneKind;
          const activation = z.activation as TriggerZoneActivation;
          return (
            <div key={z.id} data-testid={`trigger-zone-${z.id}`} style={{ background: C.bg1, border: `1px solid ${C.border}`, borderRadius: 10, padding: 12, marginBottom: 10 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                <span style={{ fontSize: 12, fontWeight: 600, color: C.text }}>{z.id}</span>
                <button onClick={() => removeTriggerZone(i)} style={{ background: "none", border: "none", color: C.muted, cursor: "pointer", fontSize: 14 }}>✕</button>
              </div>

              {/* Position */}
              <Row label="X (cm)">{numInput(z.x_cm, 0, v => updateTriggerZone(i, { x_cm: v }))}</Row>
              <Row label="Y (cm)">{numInput(z.y_cm, 0, v => updateTriggerZone(i, { y_cm: v }))}</Row>

              {/* Shape — circle or rectangle only for simplicity */}
              <Row label="Shape">
                <SearchableSelect
                  value={(z.shape as any).kind ?? "circle"}
                  options={[{ value: "circle", label: "Circle" }, { value: "ring", label: "Ring" }, { value: "rectangle", label: "Rectangle" }]}
                  onChange={k => {
                    const shape = k === "rectangle"
                      ? { kind: "rectangle", widthCm: 8, heightCm: 8 }
                      : k === "ring"
                      ? { kind: "ring", innerRadiusCm: 3, outerRadiusCm: 6 }
                      : { kind: "circle", radiusCm: 5 };
                    updateTriggerZone(i, { shape });
                  }}
                  style={{ background: C.bg1, border: `1px solid ${C.border}`, color: C.text, borderRadius: 6, fontSize: 12 }}
                />
              </Row>
              {(z.shape as any).kind === "circle" && (
                <Row label="Radius (cm)">{numInput((z.shape as any).radiusCm, 5, v => updateTriggerZone(i, { shape: { ...(z.shape as any), radiusCm: v } }), 0.5)}</Row>
              )}
              {(z.shape as any).kind === "ring" && (
                <>
                  <Row label="Inner radius (cm)">{numInput((z.shape as any).innerRadiusCm, 3, v => updateTriggerZone(i, { shape: { ...(z.shape as any), innerRadiusCm: v } }), 0.5)}</Row>
                  <Row label="Outer radius (cm)">{numInput((z.shape as any).outerRadiusCm, 6, v => updateTriggerZone(i, { shape: { ...(z.shape as any), outerRadiusCm: v } }), 0.5)}</Row>
                </>
              )}
              {(z.shape as any).kind === "rectangle" && (
                <>
                  <Row label="Width (cm)">{numInput((z.shape as any).widthCm, 8, v => updateTriggerZone(i, { shape: { ...(z.shape as any), widthCm: v } }), 0.5)}</Row>
                  <Row label="Height (cm)">{numInput((z.shape as any).heightCm, 8, v => updateTriggerZone(i, { shape: { ...(z.shape as any), heightCm: v } }), 0.5)}</Row>
                </>
              )}

              {/* Kind */}
              <Row label="Effect">
                <SearchableSelect
                  value={kind.type}
                  options={[
                    { value: "safe", label: "Safe zone" },
                    { value: "damage", label: "Damage" },
                    { value: "heal", label: "Heal" },
                    { value: "knockout", label: "Knockout hold" },
                    { value: "spin-boost", label: "Spin boost" },
                    { value: "expel", label: "Expel" },
                    { value: "speed-scale", label: "Speed scale" },
                  ]}
                  onChange={t => {
                    const kindType = t as TriggerZoneKind["type"];
                    const defaults: Record<string, TriggerZoneKind> = {
                      "safe": { type: "safe" },
                      "damage": { type: "damage", perSecond: 10 },
                      "heal": { type: "heal", perSecond: 10 },
                      "knockout": { type: "knockout", soloHoldMs: 3000 },
                      "spin-boost": { type: "spin-boost", spinDirection: "cw", perSecond: 50 },
                      "expel": { type: "expel", impulseCm: 5 },
                      "speed-scale": { type: "speed-scale", multiplier: 1.5 },
                    };
                    updateTriggerZone(i, { kind: defaults[kindType] ?? { type: "safe" } });
                  }}
                  style={{ background: C.bg1, border: `1px solid ${C.border}`, color: C.text, borderRadius: 6, fontSize: 12 }}
                />
              </Row>
              {kind.type === "damage" && <Row label="Damage/s">{numInput(kind.perSecond, 10, v => updateTriggerZone(i, { kind: { ...kind, perSecond: v } }))}</Row>}
              {kind.type === "heal" && <Row label="Heal/s">{numInput(kind.perSecond, 10, v => updateTriggerZone(i, { kind: { ...kind, perSecond: v } }))}</Row>}
              {kind.type === "knockout" && <Row label="Hold time (ms)">{numInput(kind.soloHoldMs, 3000, v => updateTriggerZone(i, { kind: { ...kind, soloHoldMs: v } }), 250)}</Row>}
              {kind.type === "spin-boost" && (
                <>
                  <Row label="Spin direction">
                    <SearchableSelect
                      value={kind.spinDirection}
                      options={[{ value: "cw", label: "CW" }, { value: "ccw", label: "CCW" }, { value: "match", label: "Match bey" }, { value: "alternate", label: "Alternate" }]}
                      onChange={v => updateTriggerZone(i, { kind: { ...kind, spinDirection: v as any } })}
                      style={{ background: C.bg1, border: `1px solid ${C.border}`, color: C.text, borderRadius: 6, fontSize: 12 }}
                    />
                  </Row>
                  <Row label="Spin/s">{numInput(kind.perSecond, 50, v => updateTriggerZone(i, { kind: { ...kind, perSecond: v } }), 10)}</Row>
                </>
              )}
              {kind.type === "expel" && <Row label="Impulse (cm)">{numInput(kind.impulseCm, 5, v => updateTriggerZone(i, { kind: { ...kind, impulseCm: v } }), 0.5)}</Row>}
              {kind.type === "speed-scale" && <Row label="Speed multiplier">{numInput(kind.multiplier, 1.5, v => updateTriggerZone(i, { kind: { ...kind, multiplier: v } }), 0.1)}</Row>}

              {/* Activation */}
              <Row label="Activation">
                <SearchableSelect
                  value={activation.type}
                  options={[{ value: "always-on", label: "Always on" }, { value: "intervaled", label: "Intervaled" }, { value: "switch-controlled", label: "Switch-controlled" }]}
                  onChange={t => {
                    const actType = t as TriggerZoneActivation["type"];
                    const defaults: Record<string, TriggerZoneActivation> = {
                      "always-on": { type: "always-on" },
                      "intervaled": { type: "intervaled", activeMs: 2000, pauseMs: 3000 },
                      "switch-controlled": { type: "switch-controlled", defaultState: "on" },
                    };
                    updateTriggerZone(i, { activation: defaults[actType] });
                  }}
                  style={{ background: C.bg1, border: `1px solid ${C.border}`, color: C.text, borderRadius: 6, fontSize: 12 }}
                />
              </Row>
              {activation.type === "intervaled" && (
                <>
                  <Row label="Active (ms)">{numInput(activation.activeMs, 2000, v => updateTriggerZone(i, { activation: { ...activation, activeMs: v } }), 250)}</Row>
                  <Row label="Pause (ms)">{numInput(activation.pauseMs, 3000, v => updateTriggerZone(i, { activation: { ...activation, pauseMs: v } }), 250)}</Row>
                </>
              )}
              {activation.type === "switch-controlled" && (
                <Row label="Default state">
                  <SearchableSelect
                    value={activation.defaultState}
                    options={[{ value: "on", label: "On" }, { value: "off", label: "Off" }]}
                    onChange={v => updateTriggerZone(i, { activation: { ...activation, defaultState: v as "on" | "off" } })}
                    style={{ background: C.bg1, border: `1px solid ${C.border}`, color: C.text, borderRadius: 6, fontSize: 12 }}
                  />
                </Row>
              )}

              <Row label="Controlled By Switch">
                <input
                  type="text"
                  value={z.controlledBySwitchId ?? ""}
                  onChange={e => updateTriggerZone(i, { controlledBySwitchId: e.target.value || undefined })}
                  placeholder="e.g. sw1"
                  style={{ width: "100%", background: C.bg1, border: `1px solid ${C.border}`, color: C.text, borderRadius: 6, padding: "4px 8px", fontSize: 12, boxSizing: "border-box" as const }}
                />
              </Row>
              <SelfRotationPanel
                rotation={(z as any).rotation}
                selfRotation={z.selfRotation}
                onChangeRotation={v => updateTriggerZone(i, { rotation: v } as any)}
                onChangeSelfRotation={v => updateTriggerZone(i, { selfRotation: v })}
              />
            </div>
          );
        })}
        <button onClick={addTriggerZone} style={{ padding: "6px 14px", background: C.blue, color: C.white, border: "none", borderRadius: 8, fontSize: 12, cursor: "pointer" }}>
          + Add Trigger Zone
        </button>
      </Section>

      {/* Bey Spawn */}
      <Section title="Bey Spawn (Mid-Match Neutral Beyblades)">
        {(() => {
          const bs: ArenaBeySawnConfig | undefined = (config as any).beySpawn;
          const updateBS = (patch: Partial<ArenaBeySawnConfig>) =>
            onChange({ beySpawn: { ...(bs ?? { enabled: false, spawnIntervalSec: 15, maxSpawnedBeys: 2, despawnCondition: "knockout", beyPool: [] }), ...patch } } as any);

          return (
            <div data-testid="bey-spawn-section">
              <Row label="Enabled">
                <input type="checkbox" checked={bs?.enabled ?? false}
                  onChange={e => updateBS({ enabled: e.target.checked })} />
              </Row>
              {bs?.enabled && (
                <>
                  <Row label="Spawn Interval (s)">
                    {numInput(bs.spawnIntervalSec, 15, v => updateBS({ spawnIntervalSec: v }), 1)}
                  </Row>
                  <Row label="Max Active Beys">
                    {numInput(bs.maxSpawnedBeys, 2, v => updateBS({ maxSpawnedBeys: Math.max(1, Math.round(v)) }), 1)}
                  </Row>
                  <Row label="Despawn Condition">
                    <SearchableSelect
                      value={bs.despawnCondition ?? "knockout"}
                      options={[
                        { value: "knockout", label: "Knockout" },
                        { value: "timeout", label: "Timeout" },
                        { value: "never", label: "Never" },
                      ]}
                      onChange={v => updateBS({ despawnCondition: v as ArenaBeySawnConfig["despawnCondition"] })}
                      style={{ background: C.bg1, border: `1px solid ${C.border}`, color: C.text, borderRadius: 6, fontSize: 12 }}
                    />
                  </Row>
                  {bs.despawnCondition === "timeout" && (
                    <Row label="Despawn After (ticks)">
                      {numInput(bs.despawnAfterTicks, 600, v => updateBS({ despawnAfterTicks: Math.round(v) }), 60)}
                    </Row>
                  )}
                  <Row label="Spawn Condition">
                    <SearchableSelect
                      value={bs.spawnOnCondition?.type ?? "none"}
                      options={[
                        { value: "none", label: "None (always)" },
                        { value: "time_elapsed", label: "Time Elapsed" },
                        { value: "bey_count_below", label: "Bey Count Below" },
                        { value: "player_spin_below", label: "Player Spin Below" },
                      ]}
                      onChange={v => updateBS({ spawnOnCondition: v === "none" ? undefined : { type: v as any, threshold: 60 } })}
                      style={{ background: C.bg1, border: `1px solid ${C.border}`, color: C.text, borderRadius: 6, fontSize: 12 }}
                    />
                  </Row>
                  {bs.spawnOnCondition && (
                    <Row label="Condition Threshold">
                      {numInput(bs.spawnOnCondition.threshold, 60, v => updateBS({ spawnOnCondition: { ...bs.spawnOnCondition!, threshold: v } }), 1)}
                    </Row>
                  )}

                  {/* Bey Pool */}
                  <div style={{ marginTop: 10 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                      <span style={{ fontSize: 12, fontWeight: 600, color: C.muted }}>Bey Pool ({bs.beyPool?.length ?? 0})</span>
                      <button onClick={() => updateBS({ beyPool: [...(bs.beyPool ?? []), { beyId: "", aiDifficulty: "medium", controlMode: "ai", statsMultiplier: 1.0 }] })}
                        style={{ fontSize: 11, padding: "2px 8px", background: C.purple, color: C.white, border: "none", borderRadius: 5, cursor: "pointer" }}>
                        + Bey Entry
                      </button>
                    </div>
                    {(bs.beyPool ?? []).map((entry, ei) => (
                      <div key={ei} style={{ background: C.bg2, borderRadius: 8, padding: 10, marginBottom: 6 }}>
                        <Row label="Bey ID">
                          <input type="text" value={entry.beyId}
                            onChange={e => { const p = [...(bs.beyPool ?? [])]; p[ei] = { ...entry, beyId: e.target.value }; updateBS({ beyPool: p }); }}
                            placeholder="beyblade_stats doc ID"
                            style={{ flex: 1, background: C.bg1, border: `1px solid ${C.border}`, color: C.text, borderRadius: 6, padding: "3px 6px", fontSize: 11 }} />
                        </Row>
                        <Row label="AI Difficulty">
                          <div style={{ display: "flex", gap: 4 }}>
                            {(["medium", "hard", "hell"] as const).map(d => (
                              <button key={d} onClick={() => { const p = [...(bs.beyPool ?? [])]; p[ei] = { ...entry, aiDifficulty: d }; updateBS({ beyPool: p }); }}
                                style={{ padding: "2px 7px", borderRadius: 5, fontSize: 10, cursor: "pointer",
                                  background: entry.aiDifficulty === d ? C.red : "transparent",
                                  color: entry.aiDifficulty === d ? C.white : C.muted,
                                  border: `1px solid ${entry.aiDifficulty === d ? C.red : C.border}` }}>
                                {d}
                              </button>
                            ))}
                          </div>
                        </Row>
                        <Row label="Control Mode">
                          <div style={{ display: "flex", gap: 4 }}>
                            {(["ai", "friendly"] as const).map(m => (
                              <button key={m} onClick={() => { const p = [...(bs.beyPool ?? [])]; p[ei] = { ...entry, controlMode: m }; updateBS({ beyPool: p }); }}
                                style={{ padding: "2px 7px", borderRadius: 5, fontSize: 10, cursor: "pointer",
                                  background: entry.controlMode === m ? C.blue : "transparent",
                                  color: entry.controlMode === m ? C.white : C.muted,
                                  border: `1px solid ${entry.controlMode === m ? C.blue : C.border}` }}>
                                {m}
                              </button>
                            ))}
                          </div>
                        </Row>
                        <Row label="Stats Multiplier">
                          {numInput(entry.statsMultiplier, 1.0, v => { const p = [...(bs.beyPool ?? [])]; p[ei] = { ...entry, statsMultiplier: v }; updateBS({ beyPool: p }); }, 0.1)}
                        </Row>
                        <Row label="Max Spawns">
                          {numInput(entry.maxFromThisEntry, 0, v => { const p = [...(bs.beyPool ?? [])]; p[ei] = { ...entry, maxFromThisEntry: v < 1 ? undefined : Math.round(v) }; updateBS({ beyPool: p }); }, 1)}
                        </Row>
                        <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 4 }}>
                          <button onClick={() => updateBS({ beyPool: (bs.beyPool ?? []).filter((_, j) => j !== ei) })}
                            style={{ color: C.red, background: "none", border: "none", fontSize: 11, cursor: "pointer" }}>
                            Remove Entry
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>
          );
        })()}
      </Section>
    </div>
    </CollapsibleSection>
  );
}
