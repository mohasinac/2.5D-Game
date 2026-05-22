/**
 * PartTypeFields — per-part-type field renderers.
 *
 * Covers: hidden stats (6.8), SubPart switchTargets (6.4),
 * StatModifiers (6.5), Core gimmicks (6.6), Tip special fields (6.7),
 * BitBeast extras, SpinTrack extras, AR/WD/Casing hidden stats.
 *
 * Usage: pass the returned function as renderTypeFields to PartEditor.
 */

import { useState } from "react";
import { C, alpha } from "@/styles/theme";

type Part = Record<string, unknown>;
type OnChange = (patch: Part) => void;

// ─────────────────────────────────────────────────────────────────────────────
// Entry point — returns the right renderer for each partTypeSlug
// ─────────────────────────────────────────────────────────────────────────────

export function makeTypeFieldRenderer(partTypeSlug: string) {
  return (part: Part, onChange: OnChange) => {
    switch (partTypeSlug) {
      case "attack-rings":  return <ARFields part={part} onChange={onChange} />;
      case "weight-disks":  return <WDFields part={part} onChange={onChange} />;
      case "sub-parts":     return <SubPartFields part={part} onChange={onChange} />;
      case "tips":          return <TipFields part={part} onChange={onChange} />;
      case "cores":         return <CoreFields part={part} onChange={onChange} />;
      case "casings":       return <CasingFields part={part} onChange={onChange} />;
      case "bit-beasts":    return <BitBeastFields part={part} onChange={onChange} />;
      case "spin-tracks":   return <SpinTrackFields part={part} onChange={onChange} />;
      default:              return <StatModifiersEditor part={part} onChange={onChange} />;
    }
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// Shared primitives
// ─────────────────────────────────────────────────────────────────────────────

function Field({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: 14 }}>
      <label style={{ display: "block", fontSize: 11, color: C.muted, marginBottom: 4, fontWeight: 600 }}>{label}</label>
      {hint && <div style={{ fontSize: 10, color: C.faint, marginBottom: 5 }}>{hint}</div>}
      {children}
    </div>
  );
}

function NumInput({ value, onChange, min, max, step, width = 100 }: {
  value: number | undefined; onChange: (n: number) => void;
  min?: number; max?: number; step?: number; width?: number;
}) {
  return (
    <input
      type="number"
      value={value ?? ""}
      onChange={(e) => onChange(Number(e.target.value))}
      min={min} max={max} step={step ?? 0.01}
      style={{ width, padding: "6px 9px", background: C.bg2, border: `1px solid ${C.border}`, borderRadius: 6, color: C.text, fontSize: 12 }}
    />
  );
}

function ToggleBtn({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      style={{
        padding: "4px 10px", fontSize: 11, borderRadius: 5, cursor: "pointer",
        background: active ? alpha(C.blue, 0.13) : C.bg2,
        color: active ? C.blue : C.muted,
        border: `1px solid ${active ? alpha(C.blue, 0.33) : C.border}`,
      }}
    >
      {label}
    </button>
  );
}

function SectionHeader({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ fontSize: 12, fontWeight: 700, color: C.text, borderBottom: `1px solid ${C.border}`, paddingBottom: 6, marginBottom: 12, marginTop: 6 }}>
      {children}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// StatModifiers editor — universal, shown in all part types
// ─────────────────────────────────────────────────────────────────────────────

const STAT_KEYS = [
  "spin", "maxSpin", "spinDecayRate", "aggressiveness", "gripFactor",
  "recoilFactor", "damageMultiplier", "damageReduction",
  "surfaceFriction", "contactDamageMultiplier",
] as const;

const STAT_EVENTS = [
  "on_land", "on_hit_opponent", "on_hit_received",
  "on_special_move", "on_button", "on_config_change",
] as const;

const TRIGGER_TYPES = [
  "spin_threshold", "impact_any", "impact_direction", "tilt_threshold",
  "special_move", "core_activated", "timer",
] as const;

type StatModifier = {
  targetStat: string;
  operation: "add" | "multiply" | "set";
  value: number;
  duration?: number;
  event?: string;
  trigger?: { type: string; threshold: number; direction?: string; togglePrevious?: boolean };
};

function StatModifiersEditor({ part, onChange }: { part: Part; onChange: OnChange }) {
  const mods: StatModifier[] = (part.statModifiers as StatModifier[] | undefined) ?? [];

  const update = (mods: StatModifier[]) => onChange({ statModifiers: mods });
  const add = () => update([...mods, { targetStat: "spin", operation: "add", value: 0 }]);
  const remove = (i: number) => update(mods.filter((_, idx) => idx !== i));
  const patch = (i: number, p: Partial<StatModifier>) => update(mods.map((m, idx) => idx === i ? { ...m, ...p } : m));

  return (
    <div>
      <SectionHeader>Stat Modifiers</SectionHeader>
      <div style={{ fontSize: 11, color: C.faint, marginBottom: 10 }}>
        Modifiers fire on events or triggers and temporarily or permanently adjust bey stats.
      </div>
      {mods.map((mod, i) => (
        <div key={i} style={{ background: C.bg1, border: `1px solid ${C.border}`, borderRadius: 8, padding: 12, marginBottom: 8, display: "flex", flexDirection: "column", gap: 8 }}>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap", alignItems: "flex-end" }}>
            <div>
              <div style={{ fontSize: 10, color: C.faint, marginBottom: 3 }}>Stat</div>
              <select
                value={mod.targetStat}
                onChange={(e) => patch(i, { targetStat: e.target.value })}
                style={{ padding: "5px 8px", background: C.bg2, border: `1px solid ${C.border}`, borderRadius: 5, color: C.text, fontSize: 11 }}
              >
                {STAT_KEYS.map((k) => <option key={k} value={k}>{k}</option>)}
              </select>
            </div>
            <div>
              <div style={{ fontSize: 10, color: C.faint, marginBottom: 3 }}>Op</div>
              <select
                value={mod.operation}
                onChange={(e) => patch(i, { operation: e.target.value as StatModifier["operation"] })}
                style={{ padding: "5px 8px", background: C.bg2, border: `1px solid ${C.border}`, borderRadius: 5, color: C.text, fontSize: 11 }}
              >
                <option value="add">add</option>
                <option value="multiply">multiply</option>
                <option value="set">set</option>
              </select>
            </div>
            <div>
              <div style={{ fontSize: 10, color: C.faint, marginBottom: 3 }}>Value</div>
              <NumInput value={mod.value} onChange={(v) => patch(i, { value: v })} width={80} />
            </div>
            <div>
              <div style={{ fontSize: 10, color: C.faint, marginBottom: 3 }}>Duration (ticks, blank=permanent)</div>
              <input
                type="number" min={0}
                value={mod.duration ?? ""}
                placeholder="∞"
                onChange={(e) => patch(i, { duration: e.target.value === "" ? undefined : Number(e.target.value) })}
                style={{ width: 70, padding: "5px 8px", background: C.bg2, border: `1px solid ${C.border}`, borderRadius: 5, color: C.text, fontSize: 11 }}
              />
            </div>
            <button onClick={() => remove(i)} style={{ padding: "5px 10px", background: alpha(C.red, 0.13), border: `1px solid ${alpha(C.red, 0.27)}`, borderRadius: 5, color: C.red, fontSize: 11, cursor: "pointer" }}>Remove</button>
          </div>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            <div>
              <div style={{ fontSize: 10, color: C.faint, marginBottom: 3 }}>Event (optional)</div>
              <select
                value={mod.event ?? ""}
                onChange={(e) => patch(i, { event: e.target.value || undefined })}
                style={{ padding: "5px 8px", background: C.bg2, border: `1px solid ${C.border}`, borderRadius: 5, color: C.text, fontSize: 11 }}
              >
                <option value="">(none)</option>
                {STAT_EVENTS.map((ev) => <option key={ev} value={ev}>{ev}</option>)}
              </select>
            </div>
            <div>
              <div style={{ fontSize: 10, color: C.faint, marginBottom: 3 }}>Trigger type (optional)</div>
              <select
                value={mod.trigger?.type ?? ""}
                onChange={(e) => {
                  const type = e.target.value;
                  patch(i, { trigger: type ? { type, threshold: mod.trigger?.threshold ?? 0 } : undefined });
                }}
                style={{ padding: "5px 8px", background: C.bg2, border: `1px solid ${C.border}`, borderRadius: 5, color: C.text, fontSize: 11 }}
              >
                <option value="">(none)</option>
                {TRIGGER_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
            {mod.trigger?.type && (
              <div>
                <div style={{ fontSize: 10, color: C.faint, marginBottom: 3 }}>Trigger threshold</div>
                <NumInput
                  value={mod.trigger.threshold}
                  onChange={(v) => patch(i, { trigger: { type: mod.trigger!.type, threshold: v } })}
                  width={70}
                />
              </div>
            )}
          </div>
        </div>
      ))}
      <button
        onClick={add}
        style={{ padding: "6px 14px", background: C.bg2, border: `1px solid ${C.border}`, borderRadius: 6, color: C.muted, fontSize: 11, cursor: "pointer" }}
      >
        + Add Modifier
      </button>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// SwitchTarget editor (SubParts)
// ─────────────────────────────────────────────────────────────────────────────

const PART_LAYERS = ["ar", "wd", "tip", "core", "casing", "bit_beast", "spin_track"] as const;
const RESET_CONDITION_TYPES = ["impact", "timer", "spin_recovery"] as const;

type SwitchTarget = {
  targetLayer: string;
  activateConfig: string;
  trigger: { type: string; threshold: number; direction?: string; togglePrevious?: boolean };
  resetToConfig?: string;
  resetCondition?: { type: string; threshold: number };
};

function SwitchTargetsEditor({ part, onChange }: { part: Part; onChange: OnChange }) {
  const targets: SwitchTarget[] = (part.switchTargets as SwitchTarget[] | undefined) ?? [];

  const update = (t: SwitchTarget[]) => onChange({ switchTargets: t });
  const add = () => update([...targets, { targetLayer: "tip", activateConfig: "", trigger: { type: "impact_any", threshold: 10 } }]);
  const remove = (i: number) => update(targets.filter((_, idx) => idx !== i));
  const patch = (i: number, p: Partial<SwitchTarget>) => update(targets.map((t, idx) => idx === i ? { ...t, ...p } : t));
  const patchTrigger = (i: number, p: Partial<SwitchTarget["trigger"]>) =>
    patch(i, { trigger: { ...targets[i].trigger, ...p } });
  const patchReset = (i: number, p: Partial<NonNullable<SwitchTarget["resetCondition"]>>) =>
    patch(i, { resetCondition: { ...targets[i].resetCondition, type: "impact", threshold: 0, ...p } });

  return (
    <div>
      <SectionHeader>Switch Targets</SectionHeader>
      <div style={{ fontSize: 11, color: C.faint, marginBottom: 10 }}>
        When this SubPart's trigger fires, it switches the target layer to the specified config.
      </div>
      {targets.map((sw, i) => (
        <div key={i} style={{ background: C.bg1, border: `1px solid ${C.border}`, borderRadius: 8, padding: 12, marginBottom: 8 }}>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 8, alignItems: "flex-end" }}>
            <div>
              <div style={{ fontSize: 10, color: C.faint, marginBottom: 3 }}>Target layer</div>
              <select value={sw.targetLayer} onChange={(e) => patch(i, { targetLayer: e.target.value })}
                style={{ padding: "5px 8px", background: C.bg2, border: `1px solid ${C.border}`, borderRadius: 5, color: C.text, fontSize: 11 }}>
                {PART_LAYERS.map((l) => <option key={l} value={l}>{l}</option>)}
              </select>
            </div>
            <div>
              <div style={{ fontSize: 10, color: C.faint, marginBottom: 3 }}>Activate config name</div>
              <input value={sw.activateConfig} onChange={(e) => patch(i, { activateConfig: e.target.value })} placeholder="e.g. HoleFlat"
                style={{ width: 120, padding: "5px 8px", background: C.bg2, border: `1px solid ${C.border}`, borderRadius: 5, color: C.text, fontSize: 11 }} />
            </div>
            <div>
              <div style={{ fontSize: 10, color: C.faint, marginBottom: 3 }}>Reset to config</div>
              <input value={sw.resetToConfig ?? ""} onChange={(e) => patch(i, { resetToConfig: e.target.value || undefined })} placeholder="(none)"
                style={{ width: 120, padding: "5px 8px", background: C.bg2, border: `1px solid ${C.border}`, borderRadius: 5, color: C.text, fontSize: 11 }} />
            </div>
            <button onClick={() => remove(i)} style={{ padding: "5px 10px", background: alpha(C.red, 0.13), border: `1px solid ${alpha(C.red, 0.27)}`, borderRadius: 5, color: C.red, fontSize: 11, cursor: "pointer" }}>Remove</button>
          </div>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 6 }}>
            <div>
              <div style={{ fontSize: 10, color: C.faint, marginBottom: 3 }}>Trigger type</div>
              <select value={sw.trigger.type} onChange={(e) => patchTrigger(i, { type: e.target.value })}
                style={{ padding: "5px 8px", background: C.bg2, border: `1px solid ${C.border}`, borderRadius: 5, color: C.text, fontSize: 11 }}>
                {TRIGGER_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
            <div>
              <div style={{ fontSize: 10, color: C.faint, marginBottom: 3 }}>Threshold</div>
              <NumInput value={sw.trigger.threshold} onChange={(v) => patchTrigger(i, { threshold: v })} width={70} min={0} />
            </div>
            {sw.trigger.type === "impact_direction" && (
              <div>
                <div style={{ fontSize: 10, color: C.faint, marginBottom: 3 }}>Direction</div>
                <select value={sw.trigger.direction ?? "any"} onChange={(e) => patchTrigger(i, { direction: e.target.value })}
                  style={{ padding: "5px 8px", background: C.bg2, border: `1px solid ${C.border}`, borderRadius: 5, color: C.text, fontSize: 11 }}>
                  <option value="any">any</option>
                  <option value="clockwise">clockwise</option>
                  <option value="counterclockwise">counterclockwise</option>
                </select>
              </div>
            )}
            <label style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 10, color: C.faint, cursor: "pointer" }}>
              <input type="checkbox" checked={sw.trigger.togglePrevious ?? false}
                onChange={(e) => patchTrigger(i, { togglePrevious: e.target.checked })}
                style={{ accentColor: C.blue }} />
              togglePrevious (flip-flop)
            </label>
          </div>
          {sw.resetToConfig && (
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              <div>
                <div style={{ fontSize: 10, color: C.faint, marginBottom: 3 }}>Reset condition type</div>
                <select value={sw.resetCondition?.type ?? "impact"} onChange={(e) => patchReset(i, { type: e.target.value })}
                  style={{ padding: "5px 8px", background: C.bg2, border: `1px solid ${C.border}`, borderRadius: 5, color: C.text, fontSize: 11 }}>
                  {RESET_CONDITION_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
              <div>
                <div style={{ fontSize: 10, color: C.faint, marginBottom: 3 }}>Reset threshold</div>
                <NumInput value={sw.resetCondition?.threshold} onChange={(v) => patchReset(i, { threshold: v })} width={70} min={0} />
              </div>
            </div>
          )}
        </div>
      ))}
      <button onClick={add} style={{ padding: "6px 14px", background: C.bg2, border: `1px solid ${C.border}`, borderRadius: 6, color: C.muted, fontSize: 11, cursor: "pointer" }}>
        + Add Switch Target
      </button>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Attack Ring (6.8)
// ─────────────────────────────────────────────────────────────────────────────

function ARFields({ part, onChange }: { part: Part; onChange: OnChange }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
      <SectionHeader>Hidden Stats</SectionHeader>
      <Field label="Recoil Factor" hint="0.1 (rubber, sticks close) → 1.0 (metal, bounces far). Computed from material if blank.">
        <NumInput value={part.recoilFactor as number | undefined} onChange={(v) => onChange({ recoilFactor: v })} min={0} max={1} />
      </Field>
      <Field label="Smash Efficiency" hint="Fraction of kinetic energy transferred to opponent on smash (0–1).">
        <NumInput value={part.smashEfficiency as number | undefined} onChange={(v) => onChange({ smashEfficiency: v })} min={0} max={1} />
      </Field>
      <Field label="Upper Attack Bonus" hint="×multiplier when this AR's CP height is below opponent's WD underside.">
        <NumInput value={part.upperAttackBonus as number | undefined} onChange={(v) => onChange({ upperAttackBonus: v })} min={0} max={5} />
      </Field>
      <Field label="Aerodynamic Profile">
        <div style={{ display: "flex", gap: 6 }}>
          {(["compact", "winged", "spherical"] as const).map((v) => (
            <ToggleBtn key={v} label={v} active={part.aerodynamicProfile === v} onClick={() => onChange({ aerodynamicProfile: part.aerodynamicProfile === v ? undefined : v })} />
          ))}
        </div>
      </Field>
      <StatModifiersEditor part={part} onChange={onChange} />
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Weight Disk (6.8)
// ─────────────────────────────────────────────────────────────────────────────

function WDFields({ part, onChange }: { part: Part; onChange: OnChange }) {
  return (
    <div>
      <SectionHeader>Hidden Stats</SectionHeader>
      <Field label="Moment of Inertia (kg·mm²)" hint="Overrides computed I = Σ(m × r²). Leave blank to auto-compute.">
        <NumInput value={part.momentOfInertia as number | undefined} onChange={(v) => onChange({ momentOfInertia: v })} min={0} step={0.1} width={110} />
      </Field>
      <Field label="Gyroscopic Stability" hint="0.0 (wobble grows fast, falls early) → 1.0 (wobble grows slowly, survives low spin).">
        <NumInput value={part.gyroscopicStability as number | undefined} onChange={(v) => onChange({ gyroscopicStability: v })} min={0} max={1} />
      </Field>
      <Field label="Spin Transfer Efficiency" hint="0–1. Fraction of spin shared in co-axial collisions (opposite-spin opponents).">
        <NumInput value={part.spinTransferEfficiency as number | undefined} onChange={(v) => onChange({ spinTransferEfficiency: v })} min={0} max={1} />
      </Field>
      <StatModifiersEditor part={part} onChange={onChange} />
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// SubPart (6.4)
// ─────────────────────────────────────────────────────────────────────────────

function SubPartFields({ part, onChange }: { part: Part; onChange: OnChange }) {
  return (
    <div>
      <SwitchTargetsEditor part={part} onChange={onChange} />
      <div style={{ marginTop: 20 }}>
        <SectionHeader>Mechanism Wear</SectionHeader>
        <Field label="Mechanism Durability" hint="Max trigger fires before mechanism wears (0 = infinite, never wears out).">
          <NumInput value={part.mechanismDurability as number | undefined} onChange={(v) => onChange({ mechanismDurability: v })} min={0} step={1} width={90} />
        </Field>
        <Field label="Trigger Sensitivity" hint="1.0 = nominal spring. < 1.0 = worn spring (fires at lower impact force).">
          <NumInput value={part.triggerSensitivity as number | undefined} onChange={(v) => onChange({ triggerSensitivity: v })} min={0} max={2} />
        </Field>
      </div>
      <div style={{ marginTop: 20 }}>
        <StatModifiersEditor part={part} onChange={onChange} />
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Tip (6.7 + 6.8)
// ─────────────────────────────────────────────────────────────────────────────

function TipFields({ part, onChange }: { part: Part; onChange: OnChange }) {
  const spinBias = (part.spinBias as { rightSpin: { gripMultiplier: number }; leftSpin: { gripMultiplier: number } } | undefined);
  const leftSpinHop = (part.leftSpinHop as { enabled: boolean; hopImpulse: number; hopChance: number } | undefined);

  return (
    <div>
      <SectionHeader>Structural Flags</SectionHeader>
      <div style={{ display: "flex", gap: 10, marginBottom: 16 }}>
        <label style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, color: C.text, cursor: "pointer" }}>
          <input type="checkbox" checked={!!(part.extendsAboveCasing)} onChange={(e) => onChange({ extendsAboveCasing: e.target.checked || undefined })} style={{ accentColor: C.blue }} />
          extendsAboveCasing
          <span style={{ fontSize: 10, color: C.faint }}>(Rock Bison — tip body reaches casing height zone)</span>
        </label>
        <label style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, color: C.text, cursor: "pointer" }}>
          <input type="checkbox" checked={!!(part.containsCasing)} onChange={(e) => onChange({ containsCasing: e.target.checked || undefined })} style={{ accentColor: C.blue }} />
          containsCasing
          <span style={{ fontSize: 10, color: C.faint }}>(Wolborg G — tip cup is outermost shell)</span>
        </label>
      </div>

      <SectionHeader>Bearing</SectionHeader>
      <Field label="Bearing Friction" hint="0.02 (B:D, near-frictionless) → 1.0 (no bearing). Reduces spin-steal received × bearingFriction.">
        <NumInput value={part.bearingFriction as number | undefined} onChange={(v) => onChange({ bearingFriction: v })} min={0} max={1} />
      </Field>

      <SectionHeader>Spin Bias (R2F)</SectionHeader>
      <div style={{ display: "flex", gap: 12, marginBottom: 14 }}>
        <Field label="Right-spin grip mult">
          <NumInput value={spinBias?.rightSpin.gripMultiplier} onChange={(v) => onChange({ spinBias: { ...spinBias, rightSpin: { gripMultiplier: v }, leftSpin: spinBias?.leftSpin ?? { gripMultiplier: 1.0 } } })} min={0} max={3} />
        </Field>
        <Field label="Left-spin grip mult">
          <NumInput value={spinBias?.leftSpin.gripMultiplier} onChange={(v) => onChange({ spinBias: { ...spinBias, leftSpin: { gripMultiplier: v }, rightSpin: spinBias?.rightSpin ?? { gripMultiplier: 1.0 } } })} min={0} max={3} />
        </Field>
      </div>

      <SectionHeader>Left-Spin Hop (Wyborg)</SectionHeader>
      <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 14 }}>
        <label style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, color: C.text, cursor: "pointer" }}>
          <input type="checkbox" checked={leftSpinHop?.enabled ?? false}
            onChange={(e) => onChange({ leftSpinHop: { ...leftSpinHop, enabled: e.target.checked, hopImpulse: leftSpinHop?.hopImpulse ?? 12, hopChance: leftSpinHop?.hopChance ?? 0.75 } })}
            style={{ accentColor: C.blue }} />
          Enabled
        </label>
        <Field label="Hop Impulse">
          <NumInput value={leftSpinHop?.hopImpulse} onChange={(v) => onChange({ leftSpinHop: { ...leftSpinHop, enabled: leftSpinHop?.enabled ?? false, hopImpulse: v, hopChance: leftSpinHop?.hopChance ?? 0.75 } })} min={0} step={1} width={80} />
        </Field>
        <Field label="Hop Chance (0–1)">
          <NumInput value={leftSpinHop?.hopChance} onChange={(v) => onChange({ leftSpinHop: { ...leftSpinHop, enabled: leftSpinHop?.enabled ?? false, hopImpulse: leftSpinHop?.hopImpulse ?? 12, hopChance: v } })} min={0} max={1} />
        </Field>
      </div>

      <SectionHeader>Hidden Stats</SectionHeader>
      <Field label="Recoil Absorption" hint="0–1. Fraction of push-back absorbed (wide/rubber tips = higher).">
        <NumInput value={part.recoilAbsorption as number | undefined} onChange={(v) => onChange({ recoilAbsorption: v })} min={0} max={1} />
      </Field>
      <Field label="Lateral Stability" hint="Resistance to sideways tilt on impact (wider tip = more stable).">
        <NumInput value={part.lateralStability as number | undefined} onChange={(v) => onChange({ lateralStability: v })} min={0} max={1} />
      </Field>
      <Field label="Surface Friction" hint="Floor contact friction multiplier. If blank, computed from material.">
        <NumInput value={part.surfaceFriction as number | undefined} onChange={(v) => onChange({ surfaceFriction: v })} min={0} max={5} />
      </Field>
      <Field label="Durability Decay" hint="gripFactor reduction per rubber-activation (CS: 0.05). Match-scoped.">
        <NumInput value={part.durabilityDecay as number | undefined} onChange={(v) => onChange({ durabilityDecay: v })} min={0} max={1} />
      </Field>

      <div style={{ marginTop: 4 }}>
        <StatModifiersEditor part={part} onChange={onChange} />
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Core (6.6 + 6.8)
// ─────────────────────────────────────────────────────────────────────────────

function CoreFields({ part, onChange }: { part: Part; onChange: OnChange }) {
  const si = part.spinInjection as {
    enabled: boolean; rateRPM: number; reserveCapacity: number;
    activationCondition: string; spinThreshold?: number;
  } | undefined;

  const cr = part.counterRotation as {
    enabled: boolean; activationCondition: string;
    directionSequence: string[]; stepDurationTicks: number; spinDecayCostPerStep: number;
  } | undefined;

  const mo = part.movementOverride as {
    type: string;
    jumpConfig?: {
      jumpForce: number; jumpPeriodTicks: number; airborneTickDuration: number;
      landingDamage?: { enabled: boolean; damageMultiplier: number; aoeRadius: number; spinBoostOnLand?: number };
    };
  } | undefined;

  const updateSI = (patch: object) => onChange({ spinInjection: { ...si, ...patch } });
  const updateCR = (patch: object) => onChange({ counterRotation: { ...cr, ...patch } });
  const updateMO = (patch: object) => onChange({ movementOverride: { ...mo, type: mo?.type ?? "orbit", ...patch } });
  const updateJump = (patch: object) => updateMO({ jumpConfig: { jumpForce: 4, jumpPeriodTicks: 30, airborneTickDuration: 12, ...mo?.jumpConfig, ...patch } });
  const updateLD = (patch: object) => updateJump({ landingDamage: { enabled: true, damageMultiplier: 1, aoeRadius: 20, ...mo?.jumpConfig?.landingDamage, ...patch } });

  const [seqInput, setSeqInput] = useState("");

  return (
    <div>
      <SectionHeader>Movement Override</SectionHeader>
      <Field label="Movement type" hint="orbit = standard. fixed = hold position. jump = hop-only movement.">
        <div style={{ display: "flex", gap: 6 }}>
          {(["orbit", "jump", "fixed"] as const).map((t) => (
            <ToggleBtn key={t} label={t} active={(mo?.type ?? "orbit") === t} onClick={() => updateMO({ type: t })} />
          ))}
        </div>
      </Field>
      {mo?.type === "jump" && (
        <div style={{ background: C.bg1, border: `1px solid ${C.border}`, borderRadius: 8, padding: 12, marginBottom: 14 }}>
          <div style={{ fontSize: 11, fontWeight: 600, color: C.muted, marginBottom: 8 }}>Jump Config</div>
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            <Field label="Jump Force"><NumInput value={mo.jumpConfig?.jumpForce} onChange={(v) => updateJump({ jumpForce: v })} min={0} step={0.5} width={80} /></Field>
            <Field label="Period (ticks)"><NumInput value={mo.jumpConfig?.jumpPeriodTicks} onChange={(v) => updateJump({ jumpPeriodTicks: v })} min={1} step={1} width={80} /></Field>
            <Field label="Airborne (ticks)"><NumInput value={mo.jumpConfig?.airborneTickDuration} onChange={(v) => updateJump({ airborneTickDuration: v })} min={1} step={1} width={80} /></Field>
          </div>
          <div style={{ fontSize: 11, fontWeight: 600, color: C.muted, margin: "8px 0" }}>Landing Damage</div>
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            <label style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 11, color: C.text, cursor: "pointer" }}>
              <input type="checkbox" checked={mo.jumpConfig?.landingDamage?.enabled ?? false} onChange={(e) => updateLD({ enabled: e.target.checked })} style={{ accentColor: C.blue }} />
              Enabled
            </label>
            <Field label="Damage mult"><NumInput value={mo.jumpConfig?.landingDamage?.damageMultiplier} onChange={(v) => updateLD({ damageMultiplier: v })} min={0} step={0.1} width={70} /></Field>
            <Field label="AOE radius (mm)"><NumInput value={mo.jumpConfig?.landingDamage?.aoeRadius} onChange={(v) => updateLD({ aoeRadius: v })} min={0} step={1} width={70} /></Field>
            <Field label="Spin boost on land"><NumInput value={mo.jumpConfig?.landingDamage?.spinBoostOnLand} onChange={(v) => updateLD({ spinBoostOnLand: v || undefined })} min={0} max={1} width={70} /></Field>
          </div>
        </div>
      )}

      <SectionHeader>Spin Injection</SectionHeader>
      <label style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, color: C.text, cursor: "pointer", marginBottom: 10 }}>
        <input type="checkbox" checked={si?.enabled ?? false} onChange={(e) => updateSI({ enabled: e.target.checked, rateRPM: si?.rateRPM ?? 30, reserveCapacity: si?.reserveCapacity ?? 1800, activationCondition: si?.activationCondition ?? "spin_threshold" })} style={{ accentColor: C.blue }} />
        Enabled
      </label>
      {si?.enabled && (
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 14 }}>
          <Field label="Rate (RPM/s)"><NumInput value={si.rateRPM} onChange={(v) => updateSI({ rateRPM: v })} min={0} step={1} width={80} /></Field>
          <Field label="Reserve capacity (0=unlimited)"><NumInput value={si.reserveCapacity} onChange={(v) => updateSI({ reserveCapacity: v })} min={0} step={100} width={90} /></Field>
          <Field label="Activation condition">
            <select value={si.activationCondition} onChange={(e) => updateSI({ activationCondition: e.target.value })}
              style={{ padding: "5px 8px", background: C.bg2, border: `1px solid ${C.border}`, borderRadius: 5, color: C.text, fontSize: 11 }}>
              <option value="always">always</option>
              <option value="casing_trigger">casing_trigger</option>
              <option value="spin_threshold">spin_threshold</option>
            </select>
          </Field>
          {si.activationCondition === "spin_threshold" && (
            <Field label="Spin threshold (0–1)"><NumInput value={si.spinThreshold} onChange={(v) => updateSI({ spinThreshold: v })} min={0} max={1} /></Field>
          )}
        </div>
      )}

      <SectionHeader>Counter-Rotation (Dranzer GT)</SectionHeader>
      <label style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, color: C.text, cursor: "pointer", marginBottom: 10 }}>
        <input type="checkbox" checked={cr?.enabled ?? false} onChange={(e) => updateCR({ enabled: e.target.checked, activationCondition: cr?.activationCondition ?? "casing_trigger", directionSequence: cr?.directionSequence ?? ["right", "left", "right", "left"], stepDurationTicks: cr?.stepDurationTicks ?? 30, spinDecayCostPerStep: cr?.spinDecayCostPerStep ?? 0.03 })} style={{ accentColor: C.blue }} />
        Enabled
      </label>
      {cr?.enabled && (
        <div style={{ marginBottom: 14 }}>
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            <Field label="Activation">
              <select value={cr.activationCondition} onChange={(e) => updateCR({ activationCondition: e.target.value })}
                style={{ padding: "5px 8px", background: C.bg2, border: `1px solid ${C.border}`, borderRadius: 5, color: C.text, fontSize: 11 }}>
                <option value="casing_trigger">casing_trigger</option>
                <option value="player_input">player_input</option>
              </select>
            </Field>
            <Field label="Step duration (ticks)"><NumInput value={cr.stepDurationTicks} onChange={(v) => updateCR({ stepDurationTicks: v })} min={1} step={1} width={80} /></Field>
            <Field label="Spin cost per step"><NumInput value={cr.spinDecayCostPerStep} onChange={(v) => updateCR({ spinDecayCostPerStep: v })} min={0} max={1} /></Field>
          </div>
          <Field label="Direction sequence (right/left, comma-separated)">
            <div style={{ display: "flex", gap: 6 }}>
              <input value={seqInput || (cr.directionSequence ?? []).join(",")} onChange={(e) => setSeqInput(e.target.value)}
                placeholder="right,left,right,left"
                style={{ flex: 1, padding: "6px 10px", background: C.bg2, border: `1px solid ${C.border}`, borderRadius: 6, color: C.text, fontSize: 11 }} />
              <button onClick={() => {
                const seq = seqInput.split(",").map((s) => s.trim()).filter((s) => s === "right" || s === "left");
                if (seq.length) { updateCR({ directionSequence: seq }); setSeqInput(""); }
              }} style={{ padding: "6px 12px", background: C.bg3, border: `1px solid ${C.border}`, borderRadius: 6, fontSize: 11, color: C.muted, cursor: "pointer" }}>Set</button>
            </div>
            <div style={{ fontSize: 10, color: C.faint, marginTop: 4 }}>Current: [{(cr.directionSequence ?? []).join(", ")}]</div>
          </Field>
        </div>
      )}

      <SectionHeader>Hidden Stats</SectionHeader>
      <Field label="Clutch Strength" hint="0=fully free-spinning (HMS Running Core) → 1=fully locked.">
        <NumInput value={part.clutchStrength as number | undefined} onChange={(v) => onChange({ clutchStrength: v })} min={0} max={1} />
      </Field>
      <Field label="Torque Efficiency" hint="Fraction of spin transmitted WD→tip per tick.">
        <NumInput value={part.torqueEfficiency as number | undefined} onChange={(v) => onChange({ torqueEfficiency: v })} min={0} max={1} />
      </Field>
      <Field label="Internal Friction" hint="Energy lost inside mechanism housing per tick.">
        <NumInput value={part.internalFriction as number | undefined} onChange={(v) => onChange({ internalFriction: v })} min={0} max={1} />
      </Field>
      <div style={{ marginTop: 4 }}>
        <StatModifiersEditor part={part} onChange={onChange} />
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Casing (6.8)
// ─────────────────────────────────────────────────────────────────────────────

function CasingFields({ part, onChange }: { part: Part; onChange: OnChange }) {
  return (
    <div>
      <SectionHeader>Hidden Stats</SectionHeader>
      <Field label="Impact Absorption" hint="0–1. Fraction of hit force absorbed before reaching WD/Core.">
        <NumInput value={part.impactAbsorption as number | undefined} onChange={(v) => onChange({ impactAbsorption: v })} min={0} max={1} />
      </Field>
      <Field label="Lateral Stiffness" hint="0–1. Resistance to being tilted by side hits.">
        <NumInput value={part.lateralStiffness as number | undefined} onChange={(v) => onChange({ lateralStiffness: v })} min={0} max={1} />
      </Field>
      <Field label="Clearance Height (mm)" hint="Floor-to-bottom gap. Affects which opponent CPs can reach under.">
        <NumInput value={part.clearanceHeight as number | undefined} onChange={(v) => onChange({ clearanceHeight: v })} min={0} step={0.5} width={80} />
      </Field>
      <div style={{ marginTop: 4 }}>
        <StatModifiersEditor part={part} onChange={onChange} />
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// BitBeast (6.8)
// ─────────────────────────────────────────────────────────────────────────────

const SPECIAL_MOVE_OPTIONS = [
  { value: "none",           label: "None" },
  { value: "stampede_rush",  label: "Stampede Rush (attack)" },
  { value: "gyro_anchor",    label: "Gyro Anchor (defense)" },
  { value: "spin_recovery",  label: "Spin Recovery (stamina)" },
  { value: "tactical_burst", label: "Tactical Burst (balanced)" },
  { value: "custom",         label: "Custom…" },
];

function BitBeastFields({ part, onChange }: { part: Part; onChange: OnChange }) {
  const specialMove = (part.specialMove as string | undefined) ?? "none";
  const isCustom = specialMove === "custom";

  return (
    <div>
      <SectionHeader>Special Move</SectionHeader>
      <Field label="Special Move" hint="Triggers at full power bar (Space). One per BitBeast.">
        <select
          value={specialMove}
          onChange={(e) => onChange({ specialMove: e.target.value as any, customMoveName: e.target.value !== "custom" ? undefined : (part.customMoveName as string | undefined) })}
          style={{ padding: "7px 10px", background: C.bg3, border: `1px solid ${C.border}`, borderRadius: 7, color: C.text, fontSize: 13, width: "100%" }}
        >
          {SPECIAL_MOVE_OPTIONS.map(o => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </select>
      </Field>
      {isCustom && (
        <Field label="Custom Move Name">
          <input
            type="text"
            value={(part.customMoveName as string | undefined) ?? ""}
            onChange={(e) => onChange({ customMoveName: e.target.value.trim() || undefined })}
            placeholder="e.g. Blazing Tornado"
            style={{ padding: "7px 10px", background: C.bg3, border: `1px solid ${C.border}`, borderRadius: 7, color: C.text, fontSize: 13, width: "100%" }}
          />
        </Field>
      )}

      <SectionHeader>MFB / Energy Ring</SectionHeader>
      <label style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, color: C.text, cursor: "pointer", marginBottom: 14 }}>
        <input type="checkbox" checked={!!(part.isEnergyRing)} onChange={(e) => onChange({ isEnergyRing: e.target.checked || undefined })} style={{ accentColor: C.blue }} />
        Is Energy Ring
        <span style={{ fontSize: 10, color: C.faint }}>(MFB — purely cosmetic + minor weight; no special move)</span>
      </label>

      <SectionHeader>Hidden Stats</SectionHeader>
      <Field label="Spiritual Force" hint="0.5–2.0. Multiplier on special move base power (lore stat, hidden from players).">
        <NumInput value={part.spiritualForce as number | undefined} onChange={(v) => onChange({ spiritualForce: v })} min={0.5} max={2} />
      </Field>
      <Field label="Resonance Bonus" hint="Additive speed bonus when two beys from the same series face each other.">
        <NumInput value={part.resonanceBonus as number | undefined} onChange={(v) => onChange({ resonanceBonus: v })} min={0} max={1} />
      </Field>
      <div style={{ marginTop: 4 }}>
        <StatModifiersEditor part={part} onChange={onChange} />
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Spin Track (6.9)
// ─────────────────────────────────────────────────────────────────────────────

function SpinTrackFields({ part, onChange }: { part: Part; onChange: OnChange }) {
  const sd = part.shieldDisk as { enabled: boolean; diskRadius: number; diskHeight: number } | undefined;
  const wp = part.wingProtrusions as { count: number } | undefined;
  const updateSD = (patch: object) => onChange({ shieldDisk: { enabled: true, diskRadius: 17, diskHeight: 65, ...sd, ...patch } });

  return (
    <div>
      <SectionHeader>Track Dimensions</SectionHeader>
      <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginBottom: 14 }}>
        <Field label="Height (mm)" hint="Track height (e.g. 90, 100, 105, 125, 130, 145, 160, 230).">
          <NumInput value={part.height as number | undefined} onChange={(v) => onChange({ height: v })} min={0} step={5} width={80} />
        </Field>
        <Field label="Weight (g)">
          <NumInput value={part.weight as number | undefined} onChange={(v) => onChange({ weight: v })} min={0} step={0.1} width={80} />
        </Field>
      </div>

      <SectionHeader>Shield Disk (e.g. S130)</SectionHeader>
      <label style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, color: C.text, cursor: "pointer", marginBottom: 10 }}>
        <input type="checkbox" checked={sd?.enabled ?? false} onChange={(e) => updateSD({ enabled: e.target.checked })} style={{ accentColor: C.blue }} />
        Shield disk enabled
      </label>
      {sd?.enabled && (
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 14 }}>
          <Field label="Disk radius (mm)"><NumInput value={sd.diskRadius} onChange={(v) => updateSD({ diskRadius: v })} min={0} step={0.5} width={80} /></Field>
          <Field label="Disk height from floor (mm)"><NumInput value={sd.diskHeight} onChange={(v) => updateSD({ diskHeight: v })} min={0} step={1} width={80} /></Field>
        </div>
      )}

      <SectionHeader>Wing Protrusions</SectionHeader>
      <Field label="Wing count (0 = plain track)">
        <NumInput value={wp?.count} onChange={(v) => onChange({ wingProtrusions: v > 0 ? { ...wp, count: v } : undefined })} min={0} step={1} width={70} />
      </Field>

      <SectionHeader>Hidden Stats</SectionHeader>
      <Field label="Track Rigidity" hint="0=flexible (absorbs some impact) → 1=rigid (no flex, no absorption).">
        <NumInput value={part.trackRigidity as number | undefined} onChange={(v) => onChange({ trackRigidity: v })} min={0} max={1} />
      </Field>
      <div style={{ marginTop: 4 }}>
        <StatModifiersEditor part={part} onChange={onChange} />
      </div>
    </div>
  );
}
