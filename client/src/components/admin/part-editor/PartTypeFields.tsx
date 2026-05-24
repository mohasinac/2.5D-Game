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
import { SearchableSelect } from "@/components/admin/SearchableSelect";
import { usePartMaterials } from "@/hooks/usePartMaterials";
import { useSpecialMoves } from "@/hooks/useSpecialMoves";
import { useTipShapes } from "@/hooks/useTipShapes";
import { useCoreGimmicks } from "@/hooks/useCoreGimmicks";
import { useStatDefs } from "@/hooks/useStatDefs";
import { useStatEventDefs } from "@/hooks/useStatEventDefs";
import { useTriggerTypeDefs } from "@/hooks/useTriggerTypeDefs";
import { usePartLayerDefs } from "@/hooks/usePartLayerDefs";

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

// Hardcoded fallbacks used when Firebase collections are empty
const FALLBACK_STAT_KEYS = [
  "spin", "maxSpin", "spinDecayRate", "aggressiveness", "gripFactor",
  "recoilFactor", "damageMultiplier", "damageReduction",
  "surfaceFriction", "contactDamageMultiplier",
] as const;

const FALLBACK_STAT_EVENTS = [
  "on_land", "on_hit_opponent", "on_hit_received",
  "on_special_move", "on_button", "on_config_change",
] as const;

const FALLBACK_TRIGGER_TYPES = [
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
  const { items: statDefs } = useStatDefs();
  const { items: statEventDefs } = useStatEventDefs();
  const { items: triggerTypeDefs } = useTriggerTypeDefs();

  const statKeyOptions = statDefs.length > 0
    ? statDefs.map(d => ({ value: d.id, label: d.name || d.id }))
    : FALLBACK_STAT_KEYS.map(k => ({ value: k, label: k }));

  const statEventOptions = statEventDefs.length > 0
    ? statEventDefs.map(e => ({ value: e.id, label: e.label }))
    : FALLBACK_STAT_EVENTS.map(e => ({ value: e, label: e }));

  const triggerTypeOptions = triggerTypeDefs.length > 0
    ? triggerTypeDefs.map(t => ({ value: t.id, label: t.label }))
    : FALLBACK_TRIGGER_TYPES.map(t => ({ value: t, label: t }));

  const update = (mods: StatModifier[]) => onChange({ statModifiers: mods });
  const add = () => update([...mods, { targetStat: statKeyOptions[0]?.value ?? "spin", operation: "add", value: 0 }]);
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
              <SearchableSelect
                value={mod.targetStat}
                options={statKeyOptions}
                onChange={(v) => patch(i, { targetStat: v })}
                style={{ background: C.bg2, border: `1px solid ${C.border}`, borderRadius: 5, color: C.text, fontSize: 11 }}
              />
            </div>
            <div>
              <div style={{ fontSize: 10, color: C.faint, marginBottom: 3 }}>Op</div>
              <SearchableSelect
                value={mod.operation}
                options={[{ value: "add", label: "add" }, { value: "multiply", label: "multiply" }, { value: "set", label: "set" }]}
                onChange={(v) => patch(i, { operation: v as StatModifier["operation"] })}
                style={{ background: C.bg2, border: `1px solid ${C.border}`, borderRadius: 5, color: C.text, fontSize: 11 }}
              />
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
              <SearchableSelect
                value={mod.event ?? ""}
                options={statEventOptions}
                onChange={(v) => patch(i, { event: v || undefined })}
                emptyLabel="(none)"
                style={{ background: C.bg2, border: `1px solid ${C.border}`, borderRadius: 5, color: C.text, fontSize: 11 }}
              />
            </div>
            <div>
              <div style={{ fontSize: 10, color: C.faint, marginBottom: 3 }}>Trigger type (optional)</div>
              <SearchableSelect
                value={mod.trigger?.type ?? ""}
                options={triggerTypeOptions}
                onChange={(v) => {
                  patch(i, { trigger: v ? { type: v, threshold: mod.trigger?.threshold ?? 0 } : undefined });
                }}
                emptyLabel="(none)"
                style={{ background: C.bg2, border: `1px solid ${C.border}`, borderRadius: 5, color: C.text, fontSize: 11 }}
              />
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

const FALLBACK_PART_LAYERS = ["ar", "wd", "tip", "core", "casing", "bit_beast", "spin_track"] as const;
const FALLBACK_RESET_CONDITIONS = ["impact", "timer", "spin_recovery"] as const;

type SwitchTarget = {
  targetLayer: string;
  activateConfig: string;
  trigger: { type: string; threshold: number; direction?: string; togglePrevious?: boolean };
  resetToConfig?: string;
  resetCondition?: { type: string; threshold: number };
};

function SwitchTargetsEditor({ part, onChange }: { part: Part; onChange: OnChange }) {
  const targets: SwitchTarget[] = (part.switchTargets as SwitchTarget[] | undefined) ?? [];
  const { items: partLayerDefs } = usePartLayerDefs();
  const { items: triggerTypeDefs } = useTriggerTypeDefs();

  const layerOptions = partLayerDefs.length > 0
    ? partLayerDefs.map(l => ({ value: l.id, label: l.label }))
    : FALLBACK_PART_LAYERS.map(l => ({ value: l, label: l }));

  const triggerOptions = triggerTypeDefs.length > 0
    ? triggerTypeDefs.map(t => ({ value: t.id, label: t.label }))
    : FALLBACK_TRIGGER_TYPES.map(t => ({ value: t, label: t }));

  const resetOptions = FALLBACK_RESET_CONDITIONS.map(c => ({ value: c, label: c }));

  const defaultLayer = layerOptions[0]?.value ?? "tip";
  const defaultTrigger = triggerOptions.find(t => t.value === "impact_any")?.value ?? triggerOptions[0]?.value ?? "impact_any";

  const update = (t: SwitchTarget[]) => onChange({ switchTargets: t });
  const add = () => update([...targets, { targetLayer: defaultLayer, activateConfig: "", trigger: { type: defaultTrigger, threshold: 10 } }]);
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
              <SearchableSelect
                value={sw.targetLayer}
                options={layerOptions}
                onChange={(v) => patch(i, { targetLayer: v })}
                style={{ background: C.bg2, border: `1px solid ${C.border}`, borderRadius: 5, color: C.text, fontSize: 11 }}
              />
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
              <SearchableSelect
                value={sw.trigger.type}
                options={triggerOptions}
                onChange={(v) => patchTrigger(i, { type: v })}
                style={{ background: C.bg2, border: `1px solid ${C.border}`, borderRadius: 5, color: C.text, fontSize: 11 }}
              />
            </div>
            <div>
              <div style={{ fontSize: 10, color: C.faint, marginBottom: 3 }}>Threshold</div>
              <NumInput value={sw.trigger.threshold} onChange={(v) => patchTrigger(i, { threshold: v })} width={70} min={0} />
            </div>
            {sw.trigger.type === "impact_direction" && (
              <div>
                <div style={{ fontSize: 10, color: C.faint, marginBottom: 3 }}>Direction</div>
                <SearchableSelect
                  value={sw.trigger.direction ?? "any"}
                  options={[{ value: "any", label: "any" }, { value: "clockwise", label: "clockwise" }, { value: "counterclockwise", label: "counterclockwise" }]}
                  onChange={(v) => patchTrigger(i, { direction: v })}
                  style={{ background: C.bg2, border: `1px solid ${C.border}`, borderRadius: 5, color: C.text, fontSize: 11 }}
                />
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
                <SearchableSelect
                  value={sw.resetCondition?.type ?? "impact"}
                  options={resetOptions}
                  onChange={(v) => patchReset(i, { type: v })}
                  style={{ background: C.bg2, border: `1px solid ${C.border}`, borderRadius: 5, color: C.text, fontSize: 11 }}
                />
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
      <SectionHeader>Material</SectionHeader>
      <MaterialField part={part} onChange={onChange} />
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
      <SectionHeader>Material</SectionHeader>
      <MaterialField part={part} onChange={onChange} />
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

const SUB_MODES = ["free_spin", "partial_slip", "fixed", "ratchet"] as const;
const SUB_PLACEMENTS = ["above", "below", "side"] as const;
const DETACH_TYPES = ["projectile", "mini_bey", "fragment"] as const;
const DETACH_TRIGGERS = ["collision", "special_move", "low_spin"] as const;
const ALL_PART_TYPES = ["attack_ring", "weight_disk", "sub_part", "tip", "core", "casing", "bit_beast"] as const;

function SubPartFields({ part, onChange }: { part: Part; onChange: OnChange }) {
  const mode = (part.mode as string | undefined) ?? "free_spin";
  const placement = (part.placement as string | undefined) ?? "below";
  const detachment = part.detachment as Record<string, unknown> | undefined;
  const compatibleParents = (part.compatibleParents as string[] | undefined) ?? [];
  const lockPositions = (part.lockPositions as number[] | undefined) ?? [];
  const [lpInput, setLpInput] = useState("");

  const patchDetach = (p: Record<string, unknown>) =>
    onChange({ detachment: { enabled: true, type: "projectile", triggerCondition: "collision", ...detachment, ...p } });

  return (
    <div>
      <SectionHeader>Material</SectionHeader>
      <MaterialField part={part} onChange={onChange} />
      <SectionHeader>Sub-Part Mode</SectionHeader>
      <Field label="Mode">
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
          {SUB_MODES.map(m => (
            <ToggleBtn key={m} label={m.replace(/_/g, " ")} active={mode === m} onClick={() => onChange({ mode: m })} />
          ))}
        </div>
      </Field>
      <Field label="Placement">
        <div style={{ display: "flex", gap: 6 }}>
          {SUB_PLACEMENTS.map(p => (
            <ToggleBtn key={p} label={p} active={placement === p} onClick={() => onChange({ placement: p })} />
          ))}
        </div>
      </Field>

      {mode === "partial_slip" && (
        <div style={{ background: C.bg1, border: `1px solid ${C.border}`, borderRadius: 8, padding: 12, marginBottom: 12 }}>
          <div style={{ fontSize: 11, fontWeight: 600, color: C.muted, marginBottom: 8 }}>Partial Slip Settings</div>
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            <Field label="Spin Threshold (°)">
              <NumInput value={part.spinThresholdDeg as number | undefined} onChange={v => onChange({ spinThresholdDeg: v })} min={0} max={360} step={5} width={80} />
            </Field>
            <Field label="Lock Direction">
              <div style={{ display: "flex", gap: 5 }}>
                {(["cw", "ccw"] as const).map(d => (
                  <ToggleBtn key={d} label={d} active={part.lockDirection === d} onClick={() => onChange({ lockDirection: d })} />
                ))}
              </div>
            </Field>
            <Field label="Slide Angle (°)">
              <NumInput value={part.slideAngle as number | undefined} onChange={v => onChange({ slideAngle: v })} min={0} max={360} step={5} width={80} />
            </Field>
          </div>
        </div>
      )}

      {mode === "ratchet" && (
        <div style={{ background: C.bg1, border: `1px solid ${C.border}`, borderRadius: 8, padding: 12, marginBottom: 12 }}>
          <div style={{ fontSize: 11, fontWeight: 600, color: C.muted, marginBottom: 8 }}>Lock Positions (°)</div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 5, marginBottom: 6 }}>
            {lockPositions.map((pos, i) => (
              <span key={i} style={{ background: C.bg2, border: `1px solid ${C.border}`, borderRadius: 4, padding: "2px 8px", fontSize: 11, color: C.text, display: "flex", alignItems: "center", gap: 4 }}>
                {pos}°
                <button onClick={() => onChange({ lockPositions: lockPositions.filter((_, j) => j !== i) })} style={{ background: "none", border: "none", color: C.red, cursor: "pointer", fontSize: 10 }}>×</button>
              </span>
            ))}
          </div>
          <div style={{ display: "flex", gap: 6 }}>
            <input type="number" min={0} max={359} value={lpInput} onChange={e => setLpInput(e.target.value)} placeholder="0–359"
              style={{ width: 80, padding: "5px 8px", background: C.bg2, border: `1px solid ${C.border}`, borderRadius: 5, color: C.text, fontSize: 11 }} />
            <button onClick={() => { const v = Number(lpInput); if (!isNaN(v)) { onChange({ lockPositions: [...lockPositions, v] }); setLpInput(""); } }}
              style={{ padding: "5px 10px", background: C.bg3, border: `1px solid ${C.border}`, borderRadius: 5, fontSize: 11, color: C.muted, cursor: "pointer" }}>+ Add</button>
          </div>
        </div>
      )}

      <SectionHeader>Detachment on Trigger</SectionHeader>
      <label style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, color: C.text, cursor: "pointer", marginBottom: 10 }}>
        <input type="checkbox" checked={!!(detachment?.enabled)} onChange={e => patchDetach({ enabled: e.target.checked })} style={{ accentColor: C.blue }} />
        Enable detachment
      </label>
      {!!(detachment?.enabled) && (
        <div style={{ background: C.bg1, border: `1px solid ${C.border}`, borderRadius: 8, padding: 12, marginBottom: 12 }}>
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 8 }}>
            <Field label="Type">
              <div style={{ display: "flex", gap: 5 }}>
                {DETACH_TYPES.map(t => <ToggleBtn key={t} label={t.replace(/_/g, " ")} active={detachment.type === t} onClick={() => patchDetach({ type: t })} />)}
              </div>
            </Field>
            <Field label="Trigger Condition">
              <div style={{ display: "flex", gap: 5 }}>
                {DETACH_TRIGGERS.map(t => <ToggleBtn key={t} label={t.replace(/_/g, " ")} active={detachment.triggerCondition === t} onClick={() => patchDetach({ triggerCondition: t })} />)}
              </div>
            </Field>
          </div>
          {detachment.type === "projectile" && (
            <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
              <Field label="Speed"><NumInput value={detachment.speed as number | undefined} onChange={v => patchDetach({ speed: v })} min={0} step={10} width={80} /></Field>
              <Field label="Damage"><NumInput value={detachment.damage as number | undefined} onChange={v => patchDetach({ damage: v })} min={0} step={1} width={80} /></Field>
              <Field label="Radius (mm)"><NumInput value={detachment.radius as number | undefined} onChange={v => patchDetach({ radius: v })} min={1} step={0.5} width={80} /></Field>
            </div>
          )}
          {detachment.type === "mini_bey" && (
            <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
              <Field label="Duration (ticks)"><NumInput value={detachment.duration as number | undefined} onChange={v => patchDetach({ duration: v })} min={1} step={10} width={90} /></Field>
            </div>
          )}
        </div>
      )}

      <SectionHeader>Compatible Parents</SectionHeader>
      <Field label="Part types this sub-part can attach to">
        <div style={{ display: "flex", flexWrap: "wrap", gap: 5 }}>
          {ALL_PART_TYPES.map(t => {
            const active = compatibleParents.includes(t);
            return <ToggleBtn key={t} label={t.replace(/_/g, " ")} active={active} onClick={() => onChange({ compatibleParents: active ? compatibleParents.filter(p => p !== t) : [...compatibleParents, t] })} />;
          })}
        </div>
      </Field>

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

const FALLBACK_TIP_SHAPES = ["flat","sharp","semi_flat","wide","ball","spike","rubber_flat","hole_flat","rubber_ball","defense","custom"] as const;

function MaterialField({ part, onChange }: { part: Part; onChange: OnChange }) {
  const { materials, loading } = usePartMaterials();
  return (
    <Field label="Material" hint={loading ? "Loading…" : undefined}>
      <SearchableSelect
        value={(part.material as string) ?? ""}
        onChange={val => onChange({ material: val || undefined })}
        options={[
          { value: "", label: "(none)" },
          ...materials.map(m => ({ value: m.id, label: m.description ? `${m.label} — ${m.description}` : m.label })),
        ]}
        placeholder="Select material…"
      />
    </Field>
  );
}

function TipFields({ part, onChange }: { part: Part; onChange: OnChange }) {
  const spinBias = (part.spinBias as { rightSpin: { gripMultiplier: number }; leftSpin: { gripMultiplier: number } } | undefined);
  const leftSpinHop = (part.leftSpinHop as { enabled: boolean; hopImpulse: number; hopChance: number } | undefined);
  const { items: tipShapeDefs } = useTipShapes();
  const tipShapes = tipShapeDefs.length > 0
    ? tipShapeDefs.map(s => ({ id: s.id, label: s.label }))
    : FALLBACK_TIP_SHAPES.map(s => ({ id: s, label: s.replace(/_/g, " ") }));

  return (
    <div>
      <SectionHeader>Tip Shape & Material</SectionHeader>
      <Field label="Tip Shape">
        <div style={{ display: "flex", flexWrap: "wrap", gap: 5 }}>
          {tipShapes.map(s => (
            <ToggleBtn key={s.id} label={s.label} active={part.tipShape === s.id} onClick={() => onChange({ tipShape: part.tipShape === s.id ? undefined : s.id })} />
          ))}
        </div>
      </Field>
      <MaterialField part={part} onChange={onChange} />
      <div style={{ display: "flex", gap: 14, flexWrap: "wrap", marginBottom: 14 }}>
        <Field label="Grip Factor (0–1)" hint="0 = no grip, 1 = full grip (rubber).">
          <NumInput value={part.gripFactor as number | undefined} onChange={v => onChange({ gripFactor: v })} min={0} max={1} step={0.05} />
        </Field>
        <Field label="Aggressiveness (0–1)" hint="Tendency to pursue opponents.">
          <NumInput value={part.aggressiveness as number | undefined} onChange={v => onChange({ aggressiveness: v })} min={0} max={1} step={0.05} />
        </Field>
        <Field label="Suction Cap" hint="Maximum suction attraction force.">
          <NumInput value={part.suctionCap as number | undefined} onChange={v => onChange({ suctionCap: v })} min={0} step={0.1} width={90} />
        </Field>
        <Field label="Climb Assist (0–1)" hint="Helps tip climb ridges (0 = none).">
          <NumInput value={part.climbAssist as number | undefined} onChange={v => onChange({ climbAssist: v })} min={0} max={1} step={0.05} />
        </Field>
      </div>
      <label style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, color: C.text, cursor: "pointer", marginBottom: 16 }}>
        <input type="checkbox" checked={!!(part.freeSpin)} onChange={e => onChange({ freeSpin: e.target.checked || undefined })} style={{ accentColor: C.blue }} />
        freeSpin
        <span style={{ fontSize: 10, color: C.faint }}>(B:D — tip bearing fully decouples spin from movement)</span>
      </label>

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

      <div style={{ marginTop: 16 }}>
        <MaterialBandsEditor part={part} onChange={onChange} />
      </div>
      <div style={{ marginTop: 16 }}>
        <EvolutionStagesEditor part={part} onChange={onChange} />
      </div>
      <div style={{ marginTop: 4 }}>
        <StatModifiersEditor part={part} onChange={onChange} />
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// MaterialBands editor (TipPart.materials[])
// ─────────────────────────────────────────────────────────────────────────────

type WearStep = { atSecond: number; wearLevel: number };
type MaterialBand = { material: string; coverage: number; wearSchedule?: WearStep[] };

function MaterialBandsEditor({ part, onChange }: { part: Part; onChange: OnChange }) {
  const { materials: matOptions, loading } = usePartMaterials();
  const bands: MaterialBand[] = (part.materials as MaterialBand[] | undefined) ?? [];

  const update = (b: MaterialBand[]) => onChange({ materials: b });
  const add = () => update([...bands, { material: "", coverage: 1.0 }]);
  const remove = (i: number) => update(bands.filter((_, idx) => idx !== i));
  const patch = (i: number, p: Partial<MaterialBand>) => update(bands.map((b, idx) => idx === i ? { ...b, ...p } : b));

  const patchStep = (bi: number, si: number, p: Partial<WearStep>) =>
    patch(bi, { wearSchedule: (bands[bi].wearSchedule ?? []).map((s, idx) => idx === si ? { ...s, ...p } : s) });
  const addStep = (bi: number) =>
    patch(bi, { wearSchedule: [...(bands[bi].wearSchedule ?? []), { atSecond: 60, wearLevel: 50 }] });
  const removeStep = (bi: number, si: number) =>
    patch(bi, { wearSchedule: (bands[bi].wearSchedule ?? []).filter((_, idx) => idx !== si) });

  return (
    <div>
      <SectionHeader>Material Bands</SectionHeader>
      <div style={{ fontSize: 11, color: C.faint, marginBottom: 10 }}>
        Each band is a material layer on the tip contact surface. Wear schedules drive the evolution driver trigger.
      </div>
      {bands.map((band, bi) => (
        <div key={bi} style={{ background: C.bg1, border: `1px solid ${C.border}`, borderRadius: 8, padding: 12, marginBottom: 8 }}>
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap", alignItems: "flex-end", marginBottom: 8 }}>
            <div>
              <div style={{ fontSize: 10, color: C.faint, marginBottom: 3 }}>Material</div>
              <SearchableSelect
                value={band.material}
                options={loading ? [] : [{ value: "", label: "(none)" }, ...matOptions.map(m => ({ value: m.id, label: m.label }))]}
                onChange={v => patch(bi, { material: v })}
                placeholder="Select material…"
                style={{ background: C.bg2, border: `1px solid ${C.border}`, borderRadius: 5, color: C.text, fontSize: 11 }}
              />
            </div>
            <div>
              <div style={{ fontSize: 10, color: C.faint, marginBottom: 3 }}>Coverage (0–1)</div>
              <NumInput value={band.coverage} onChange={v => patch(bi, { coverage: v })} min={0} max={1} step={0.05} width={70} />
            </div>
            <button onClick={() => remove(bi)} style={{ padding: "5px 10px", background: alpha(C.red, 0.13), border: `1px solid ${alpha(C.red, 0.27)}`, borderRadius: 5, color: C.red, fontSize: 11, cursor: "pointer" }}>Remove</button>
          </div>
          <div style={{ fontSize: 10, fontWeight: 600, color: C.muted, marginBottom: 6 }}>Wear Schedule</div>
          <div style={{ fontSize: 10, color: C.faint, marginBottom: 6 }}>atSecond = match elapsed seconds; wearLevel 100=new, 0=fully worn.</div>
          {(band.wearSchedule ?? []).map((step, si) => (
            <div key={si} style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 5 }}>
              <div style={{ fontSize: 10, color: C.faint, width: 60 }}>at {step.atSecond}s</div>
              <div>
                <div style={{ fontSize: 9, color: C.faint }}>Second</div>
                <NumInput value={step.atSecond} onChange={v => patchStep(bi, si, { atSecond: v })} min={0} step={5} width={65} />
              </div>
              <div>
                <div style={{ fontSize: 9, color: C.faint }}>Wear (0–100)</div>
                <NumInput value={step.wearLevel} onChange={v => patchStep(bi, si, { wearLevel: v })} min={0} max={100} step={5} width={65} />
              </div>
              <button onClick={() => removeStep(bi, si)} style={{ padding: "3px 8px", background: "none", border: `1px solid ${alpha(C.red, 0.3)}`, borderRadius: 4, color: C.red, fontSize: 10, cursor: "pointer" }}>×</button>
            </div>
          ))}
          <button onClick={() => addStep(bi)} style={{ padding: "4px 10px", background: C.bg2, border: `1px solid ${C.border}`, borderRadius: 5, color: C.muted, fontSize: 10, cursor: "pointer", marginTop: 2 }}>
            + Add Wear Step
          </button>
        </div>
      ))}
      <button onClick={add} style={{ padding: "6px 14px", background: C.bg2, border: `1px solid ${C.border}`, borderRadius: 6, color: C.muted, fontSize: 11, cursor: "pointer" }}>
        + Add Material Band
      </button>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// EvolutionStages editor (TipPart.evolutionStages[])
// ─────────────────────────────────────────────────────────────────────────────

const EVOLUTION_TRIGGER_TYPES = [
  { value: "time",            label: "time (ms elapsed)" },
  { value: "wear_level",      label: "wear_level (material wear ≤ value)" },
  { value: "spin_percent",    label: "spin_percent (spin ratio ≤ value)" },
  { value: "collision_count", label: "collision_count (≥ value)" },
  { value: "damage_taken",    label: "damage_taken (≥ value)" },
] as const;

type EvolutionStage = { label: string; configName: string; trigger?: { type: string; value: number } };

function EvolutionStagesEditor({ part, onChange }: { part: Part; onChange: OnChange }) {
  const stages: EvolutionStage[] = (part.evolutionStages as EvolutionStage[] | undefined) ?? [];

  const update = (s: EvolutionStage[]) => onChange({ evolutionStages: s });
  const add = () => update([...stages, { label: `Stage ${stages.length}`, configName: "" }]);
  const remove = (i: number) => update(stages.filter((_, idx) => idx !== i));
  const patch = (i: number, p: Partial<EvolutionStage>) => update(stages.map((s, idx) => idx === i ? { ...s, ...p } : s));
  const patchTrigger = (i: number, p: Partial<NonNullable<EvolutionStage["trigger"]>>) =>
    patch(i, { trigger: { type: "time", value: 0, ...stages[i].trigger, ...p } });

  const STAGE_COLORS = ["#9ca3af", "#fbbf24", "#f97316", "#ef4444"];

  return (
    <div>
      <SectionHeader>Evolution Stages</SectionHeader>
      <div style={{ fontSize: 11, color: C.faint, marginBottom: 10 }}>
        Stage 0 = default tip. Each subsequent stage fires when its trigger condition is met and automatically switches the active tip config.
      </div>
      {stages.length === 0 && (
        <div style={{ fontSize: 11, color: C.faint, marginBottom: 10 }}>No stages — this tip uses a single fixed config.</div>
      )}
      {stages.map((stage, i) => {
        const dotColor = STAGE_COLORS[Math.min(i, STAGE_COLORS.length - 1)];
        return (
          <div key={i} style={{ background: C.bg1, border: `1px solid ${C.border}`, borderRadius: 8, padding: 12, marginBottom: 8, borderLeft: `3px solid ${dotColor}` }}>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap", alignItems: "flex-end", marginBottom: 8 }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: dotColor, minWidth: 60 }}>Stage {i}</div>
              <div>
                <div style={{ fontSize: 10, color: C.faint, marginBottom: 3 }}>Label</div>
                <input
                  value={stage.label}
                  onChange={e => patch(i, { label: e.target.value })}
                  placeholder="e.g. Worn"
                  style={{ width: 110, padding: "5px 8px", background: C.bg2, border: `1px solid ${C.border}`, borderRadius: 5, color: C.text, fontSize: 11 }}
                />
              </div>
              <div>
                <div style={{ fontSize: 10, color: C.faint, marginBottom: 3 }}>Config name</div>
                <input
                  value={stage.configName}
                  onChange={e => patch(i, { configName: e.target.value })}
                  placeholder="e.g. worn"
                  style={{ width: 110, padding: "5px 8px", background: C.bg2, border: `1px solid ${C.border}`, borderRadius: 5, color: C.text, fontSize: 11 }}
                />
              </div>
              {i > 0 && (
                <button onClick={() => remove(i)} style={{ padding: "5px 10px", background: alpha(C.red, 0.13), border: `1px solid ${alpha(C.red, 0.27)}`, borderRadius: 5, color: C.red, fontSize: 11, cursor: "pointer" }}>Remove</button>
              )}
            </div>
            {i === 0 ? (
              <div style={{ fontSize: 10, color: C.faint }}>Stage 0 is the starting config — no trigger required.</div>
            ) : (
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap", alignItems: "flex-end" }}>
                <div>
                  <div style={{ fontSize: 10, color: C.faint, marginBottom: 3 }}>Trigger type</div>
                  <SearchableSelect
                    value={stage.trigger?.type ?? "time"}
                    options={EVOLUTION_TRIGGER_TYPES.map(t => ({ value: t.value, label: t.label }))}
                    onChange={v => patchTrigger(i, { type: v })}
                    style={{ background: C.bg2, border: `1px solid ${C.border}`, borderRadius: 5, color: C.text, fontSize: 11 }}
                  />
                </div>
                <div>
                  <div style={{ fontSize: 10, color: C.faint, marginBottom: 3 }}>
                    {stage.trigger?.type === "time" ? "Value (ms)" :
                     stage.trigger?.type === "wear_level" ? "Wear ≤ (0–100)" :
                     stage.trigger?.type === "spin_percent" ? "Spin ratio ≤ (0–1)" :
                     stage.trigger?.type === "collision_count" ? "Collision count ≥" :
                     "Damage taken ≥"}
                  </div>
                  <NumInput
                    value={stage.trigger?.value ?? 0}
                    onChange={v => patchTrigger(i, { value: v })}
                    min={0}
                    step={stage.trigger?.type === "time" ? 1000 : stage.trigger?.type === "spin_percent" ? 0.05 : 1}
                    width={90}
                  />
                </div>
              </div>
            )}
          </div>
        );
      })}
      <button onClick={add} style={{ padding: "6px 14px", background: C.bg2, border: `1px solid ${C.border}`, borderRadius: 6, color: C.muted, fontSize: 11, cursor: "pointer" }}>
        + Add Stage
      </button>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Core (6.6 + 6.8)
// ─────────────────────────────────────────────────────────────────────────────

const FALLBACK_CORE_GIMMICKS = ["none","speed_boost","weight_shift","magnetic","engine_gear","clutch_release","spin_injection","counter_rotation"] as const;

function CoreFields({ part, onChange }: { part: Part; onChange: OnChange }) {
  const { items: coreGimmickDefs } = useCoreGimmicks();
  const coreGimmicks = coreGimmickDefs.length > 0
    ? coreGimmickDefs.map(g => ({ id: g.id, label: g.label }))
    : FALLBACK_CORE_GIMMICKS.map(g => ({ id: g, label: g.replace(/_/g, " ") }));
  const gimmick = (part.gimmick as string | undefined) ?? "none";
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
      <SectionHeader>Material</SectionHeader>
      <MaterialField part={part} onChange={onChange} />
      <SectionHeader>Gimmick Type</SectionHeader>
      <Field label="Active gimmick" hint="Gates which specialized block below is visible / active.">
        <div style={{ display: "flex", flexWrap: "wrap", gap: 5 }}>
          {coreGimmicks.map(g => (
            <ToggleBtn key={g.id} label={g.label} active={gimmick === g.id} onClick={() => onChange({ gimmick: g.id })} />
          ))}
        </div>
      </Field>
      {(gimmick === "magnetic" || gimmick === "weight_shift" || gimmick === "speed_boost" || gimmick === "engine_gear" || gimmick === "clutch_release") && (
        <div style={{ background: C.bg1, border: `1px solid ${C.border}`, borderRadius: 8, padding: 12, marginBottom: 14 }}>
          <Field label="Suction Emit (emission force)">
            <NumInput value={part.suctionEmit as number | undefined} onChange={v => onChange({ suctionEmit: v })} min={0} step={0.01} />
          </Field>
        </div>
      )}

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

      {(gimmick === "spin_injection" || gimmick === "none") && <><SectionHeader>Spin Injection</SectionHeader>
      <label style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, color: C.text, cursor: "pointer", marginBottom: 10 }}>
        <input type="checkbox" checked={si?.enabled ?? false} onChange={(e) => updateSI({ enabled: e.target.checked, rateRPM: si?.rateRPM ?? 30, reserveCapacity: si?.reserveCapacity ?? 1800, activationCondition: si?.activationCondition ?? "spin_threshold" })} style={{ accentColor: C.blue }} />
        Enabled
      </label>
      {si?.enabled && (
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 14 }}>
          <Field label="Rate (RPM/s)"><NumInput value={si.rateRPM} onChange={(v) => updateSI({ rateRPM: v })} min={0} step={1} width={80} /></Field>
          <Field label="Reserve capacity (0=unlimited)"><NumInput value={si.reserveCapacity} onChange={(v) => updateSI({ reserveCapacity: v })} min={0} step={100} width={90} /></Field>
          <Field label="Activation condition">
            <SearchableSelect
              value={si.activationCondition}
              options={[{ value: "always", label: "always" }, { value: "casing_trigger", label: "casing_trigger" }, { value: "spin_threshold", label: "spin_threshold" }]}
              onChange={(v) => updateSI({ activationCondition: v })}
              style={{ background: C.bg2, border: `1px solid ${C.border}`, borderRadius: 5, color: C.text, fontSize: 11 }}
            />
          </Field>
          {si.activationCondition === "spin_threshold" && (
            <Field label="Spin threshold (0–1)"><NumInput value={si.spinThreshold} onChange={(v) => updateSI({ spinThreshold: v })} min={0} max={1} /></Field>
          )}
        </div>
      )}

      </>}{/* end spin_injection gate */}

      {(gimmick === "counter_rotation" || gimmick === "none") && <><SectionHeader>Counter-Rotation (Dranzer GT)</SectionHeader>
      <label style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, color: C.text, cursor: "pointer", marginBottom: 10 }}>
        <input type="checkbox" checked={cr?.enabled ?? false} onChange={(e) => updateCR({ enabled: e.target.checked, activationCondition: cr?.activationCondition ?? "casing_trigger", directionSequence: cr?.directionSequence ?? ["right", "left", "right", "left"], stepDurationTicks: cr?.stepDurationTicks ?? 30, spinDecayCostPerStep: cr?.spinDecayCostPerStep ?? 0.03 })} style={{ accentColor: C.blue }} />
        Enabled
      </label>
      {cr?.enabled && (
        <div style={{ marginBottom: 14 }}>
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            <Field label="Activation">
              <SearchableSelect
                value={cr.activationCondition}
                options={[{ value: "casing_trigger", label: "casing_trigger" }, { value: "player_input", label: "player_input" }]}
                onChange={(v) => updateCR({ activationCondition: v })}
                style={{ background: C.bg2, border: `1px solid ${C.border}`, borderRadius: 5, color: C.text, fontSize: 11 }}
              />
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

      </>}{/* end counter_rotation gate */}

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

const CASING_CATEGORIES = ["round", "wide", "flat", "custom"] as const;

function CasingFields({ part, onChange }: { part: Part; onChange: OnChange }) {
  const slots = part.slots as Record<string, unknown> | undefined;
  const tipSlot = slots?.tipSlot as Record<string, unknown> | undefined;
  const coreSlot = slots?.coreSlot as Record<string, unknown> | undefined;
  const patchSlots = (p: Record<string, unknown>) => onChange({ slots: { ...slots, ...p } });
  const patchTipSlot = (p: Record<string, unknown>) => patchSlots({ tipSlot: { x: 0, y: 0, radius: 5, ...tipSlot, ...p } });
  const patchCoreSlot = (p: Record<string, unknown>) => patchSlots({ coreSlot: { enabled: false, radius: 8, depth: 3, ...coreSlot, ...p } });

  return (
    <div>
      <SectionHeader>Material</SectionHeader>
      <MaterialField part={part} onChange={onChange} />
      <SectionHeader>Casing Category</SectionHeader>
      <Field label="Shape category">
        <div style={{ display: "flex", gap: 6 }}>
          {CASING_CATEGORIES.map(c => (
            <ToggleBtn key={c} label={c} active={part.casingCategory === c} onClick={() => onChange({ casingCategory: part.casingCategory === c ? undefined : c })} />
          ))}
        </div>
      </Field>

      <SectionHeader>Slots</SectionHeader>
      <div style={{ background: C.bg1, border: `1px solid ${C.border}`, borderRadius: 8, padding: 12, marginBottom: 10 }}>
        <div style={{ fontSize: 11, fontWeight: 600, color: C.muted, marginBottom: 8 }}>Tip Slot</div>
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          <Field label="Position X (mm)"><NumInput value={tipSlot?.x as number | undefined} onChange={v => patchTipSlot({ x: v })} step={0.5} width={70} /></Field>
          <Field label="Position Y (mm)"><NumInput value={tipSlot?.y as number | undefined} onChange={v => patchTipSlot({ y: v })} step={0.5} width={70} /></Field>
          <Field label="Radius (mm)"><NumInput value={tipSlot?.radius as number | undefined} onChange={v => patchTipSlot({ radius: v })} min={1} step={0.5} width={70} /></Field>
        </div>
      </div>
      <div style={{ background: C.bg1, border: `1px solid ${C.border}`, borderRadius: 8, padding: 12, marginBottom: 14 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
          <label style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, color: C.text, cursor: "pointer" }}>
            <input type="checkbox" checked={!!(coreSlot?.enabled)} onChange={e => patchCoreSlot({ enabled: e.target.checked })} style={{ accentColor: C.blue }} />
            Core Slot enabled
          </label>
        </div>
        {!!(coreSlot?.enabled) && (
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            <Field label="Radius (mm)"><NumInput value={coreSlot.radius as number | undefined} onChange={v => patchCoreSlot({ radius: v })} min={1} step={0.5} width={70} /></Field>
            <Field label="Depth (mm)"><NumInput value={coreSlot.depth as number | undefined} onChange={v => patchCoreSlot({ depth: v })} min={0} step={0.5} width={70} /></Field>
          </div>
        )}
      </div>

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

// SPECIAL_MOVE_OPTIONS is now loaded from Firebase via useSpecialMoves() in BitBeastFields

function BitBeastFields({ part, onChange }: { part: Part; onChange: OnChange }) {
  const { specialMoves } = useSpecialMoves();
  const specialMoveOptions = [
    { value: "none", label: "None" },
    ...specialMoves.map(m => ({ value: m.id, label: m.type ? `${m.name} (${m.type})` : m.name })),
    { value: "custom", label: "Custom…" },
  ];
  const specialMove = (part.specialMove as string | undefined) ?? "none";
  const isCustom = specialMove === "custom";

  return (
    <div>
      <SectionHeader>Material</SectionHeader>
      <MaterialField part={part} onChange={onChange} />
      <SectionHeader>Special Move</SectionHeader>
      <Field label="Special Move" hint="Triggers at full power bar (Space). One per BitBeast.">
        <SearchableSelect
          value={specialMove}
          options={specialMoveOptions}
          onChange={(v) => onChange({ specialMove: v as any, customMoveName: v !== "custom" ? undefined : (part.customMoveName as string | undefined) })}
          style={{ background: C.bg3, border: `1px solid ${C.border}`, borderRadius: 7, color: C.text, fontSize: 13 }}
        />
      </Field>
      {isCustom && (
        <>
          <Field label="Custom Move Name">
            <input
              type="text"
              value={(part.customMoveName as string | undefined) ?? ""}
              onChange={(e) => onChange({ customMoveName: e.target.value.trim() || undefined })}
              placeholder="e.g. Blazing Tornado"
              style={{ padding: "7px 10px", background: C.bg3, border: `1px solid ${C.border}`, borderRadius: 7, color: C.text, fontSize: 13, width: "100%" }}
            />
          </Field>
          <div style={{ background: C.bg1, border: `1px solid ${C.border}`, borderRadius: 8, padding: 12, marginBottom: 14 }}>
            <div style={{ fontSize: 11, fontWeight: 600, color: C.muted, marginBottom: 8 }}>Custom Move Physics</div>
            <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
              <Field label="Power Cost (0–200)">
                <NumInput value={(part.customMovePowerCost as number | undefined)} onChange={v => onChange({ customMovePowerCost: v })} min={0} max={200} step={5} width={80} />
              </Field>
              <Field label="Linear Impulse">
                <NumInput value={(part.customMoveLinearImpulse as number | undefined)} onChange={v => onChange({ customMoveLinearImpulse: v })} min={0} max={10000} step={100} width={90} />
              </Field>
              <Field label="Spin Delta (±)">
                <NumInput value={(part.customMoveSpinDelta as number | undefined)} onChange={v => onChange({ customMoveSpinDelta: v })} min={-500} max={500} step={10} width={80} />
              </Field>
              <Field label="Invuln. (ms)">
                <NumInput value={(part.customMoveInvulnMs as number | undefined)} onChange={v => onChange({ customMoveInvulnMs: v })} min={0} max={3000} step={100} width={80} />
              </Field>
              <Field label="Cancel Condition">
                <SearchableSelect
                  value={(part.customMoveCancelCondition as string | undefined) ?? ""}
                  options={[{ value: "timer", label: "timer" }, { value: "hit", label: "on hit" }, { value: "low_spin", label: "low spin" }]}
                  onChange={v => onChange({ customMoveCancelCondition: v || undefined })}
                  emptyLabel="(none)"
                  style={{ background: C.bg2, border: `1px solid ${C.border}`, borderRadius: 5, color: C.text, fontSize: 11 }}
                />
              </Field>
            </div>
          </div>
        </>
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
      <SectionHeader>Material</SectionHeader>
      <MaterialField part={part} onChange={onChange} />
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
