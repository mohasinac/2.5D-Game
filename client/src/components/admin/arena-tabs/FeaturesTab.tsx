// Z10a: Features tab — Elevation Zones, Floor Hazard Zones, Effect Zones,
//        Background Particles, Environmental Effect sections.

import { useState } from "react";
import { C } from "@/styles/theme";
import type { ArenaConfig, FloorHazardType, EffectZoneType, BackgroundParticleType, ArenaEnvironmentalEffectPreset } from "@/types/arenaConfigNew";
import type { ElementType } from "@/types/elementTypes";
import { ELEMENT_ICONS } from "@/types/elementTypes";
import FeatureAnimationPanel from "./FeatureAnimationPanel";

const ELEMENT_TYPES: ElementType[] = ["fire","water","earth","lightning","wind","ice","shadow","light","metal","nature","thunder","void"];

interface Props {
  config: ArenaConfig;
  onChange: (patch: Partial<ArenaConfig>) => void;
}

const HAZARD_TYPES: FloorHazardType[] = ["lava", "ice", "mud", "electric", "time_slow", "repulsion", "size_shrink", "size_grow", "trampoline", "combo_boost", "drain", "void"];
const EFFECT_TYPES: EffectZoneType[] = ["power_charge", "spin_recovery", "combo_boost", "stat_aura", "safe_zone", "turbo_zone", "respawn_point"];
const PARTICLE_TYPES: BackgroundParticleType[] = ["snow", "rain", "embers", "leaves", "bubbles", "sparks", "pollen", "ash", "stars", "glitch_pixels"];
const ENV_PRESETS: ArenaEnvironmentalEffectPreset[] = ["storm", "blizzard", "volcanic", "underwater", "cyber", "earthquake"];

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

export default function FeaturesTab({ config, onChange }: Props) {
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

  return (
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
              <select value={bp.type} onChange={e => onChange({ backgroundParticles: { ...bp, type: e.target.value as BackgroundParticleType } })}
                style={{ background: C.bg1, border: `1px solid ${C.border}`, color: C.text, borderRadius: 6, padding: "4px 8px", fontSize: 12 }}>
                {PARTICLE_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
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
              <select value={env.preset} onChange={e => onChange({ environmentalEffect: { ...env, preset: e.target.value as ArenaEnvironmentalEffectPreset } })}
                style={{ background: C.bg1, border: `1px solid ${C.border}`, color: C.text, borderRadius: 6, padding: "4px 8px", fontSize: 12 }}>
                {ENV_PRESETS.map(p => <option key={p} value={p}>{p}</option>)}
              </select>
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
              <select value={z.hazardType} onChange={e => updateHazard(i, { hazardType: e.target.value })}
                style={{ background: C.bg1, border: `1px solid ${C.border}`, color: C.text, borderRadius: 6, padding: "4px 8px", fontSize: 12 }}>
                {HAZARD_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </Row>
            <Row label="Element Type">
              <select value={(z as any).elementType ?? ""} onChange={e => updateHazard(i, { elementType: e.target.value || undefined })}
                style={{ background: C.bg1, border: `1px solid ${C.border}`, color: C.text, borderRadius: 6, padding: "4px 8px", fontSize: 12 }}>
                <option value="">— none —</option>
                {ELEMENT_TYPES.map(t => <option key={t} value={t}>{ELEMENT_ICONS[t]} {t}</option>)}
              </select>
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
              <select value={z.effectType} onChange={e => updateEffect(i, { effectType: e.target.value })}
                style={{ background: C.bg1, border: `1px solid ${C.border}`, color: C.text, borderRadius: 6, padding: "4px 8px", fontSize: 12 }}>
                {EFFECT_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </Row>
            <Row label="Element Type">
              <select value={z.elementType ?? ""} onChange={e => updateEffect(i, { elementType: e.target.value || undefined })}
                style={{ background: C.bg1, border: `1px solid ${C.border}`, color: C.text, borderRadius: 6, padding: "4px 8px", fontSize: 12 }}>
                <option value="">— none —</option>
                {ELEMENT_TYPES.map(t => <option key={t} value={t}>{ELEMENT_ICONS[t]} {t}</option>)}
              </select>
            </Row>
            <Row label="X (cm)">{numInput(z.x_cm, 0, v => updateEffect(i, { x_cm: v }))}</Row>
            <Row label="Y (cm)">{numInput(z.y_cm, 0, v => updateEffect(i, { y_cm: v }))}</Row>
            <Row label="Radius (cm)">{numInput(z.radius_cm, 5, v => updateEffect(i, { radius_cm: v }), 0.5)}</Row>
            <FeatureAnimationPanel
              featureId={z.id}
              value={z.featureAnimation}
              onChange={v => updateEffect(i, { featureAnimation: v })}
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
          </div>
        ))}
        <button onClick={addElev} style={{ padding: "6px 14px", background: C.purple, color: C.white, border: "none", borderRadius: 8, fontSize: 12, cursor: "pointer" }}>
          + Add Elevation Zone
        </button>
      </Section>
    </div>
  );
}
