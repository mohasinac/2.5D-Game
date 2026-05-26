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
import { cn } from "@/lib/cn";
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
      case "gears":         return <GearFields part={part} onChange={onChange} />;
      default:              return <StatModifiersEditor part={part} onChange={onChange} />;
    }
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// Shared primitives
// ─────────────────────────────────────────────────────────────────────────────

function Field({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <div className="mb-[14px]">
      <label className="block text-[11px] text-theme-muted mb-1 font-semibold">{label}</label>
      {hint && <div className="text-[10px] text-theme-faint mb-[5px]">{hint}</div>}
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
      className="px-[9px] py-[6px] bg-bg2 border border-border-c rounded-md text-theme-text text-xs [width:var(--ni-w)]"
      style={{ "--ni-w": `${width}px` } as React.CSSProperties}
    />
  );
}

function ToggleBtn({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "px-[10px] py-1 text-[11px] rounded-[5px] cursor-pointer border",
        active
          ? "bg-theme-blue/[.13] text-theme-blue border-theme-blue/[.33]"
          : "bg-bg2 text-theme-muted border-border-c"
      )}
    >
      {label}
    </button>
  );
}

function SectionHeader({ children }: { children: React.ReactNode }) {
  return (
    <div className="text-xs font-bold text-theme-text border-b border-border-c pb-[6px] mb-3 mt-[6px]">
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
      <div className="text-[11px] text-theme-faint mb-[10px]">
        Modifiers fire on events or triggers and temporarily or permanently adjust bey stats.
      </div>
      {mods.map((mod, i) => (
        <div key={i} className="bg-bg1 border border-border-c rounded-lg p-3 mb-2 flex flex-col gap-2">
          <div className="flex gap-2 flex-wrap items-end">
            <div>
              <div className="text-[10px] text-theme-faint mb-[3px]">Stat</div>
              <SearchableSelect
                value={mod.targetStat}
                options={statKeyOptions}
                onChange={(v) => patch(i, { targetStat: v })}
                className="bg-bg2 border border-border-c rounded-[5px] text-theme-text text-[11px]"
              />
            </div>
            <div>
              <div className="text-[10px] text-theme-faint mb-[3px]">Op</div>
              <SearchableSelect
                value={mod.operation}
                options={[{ value: "add", label: "add" }, { value: "multiply", label: "multiply" }, { value: "set", label: "set" }]}
                onChange={(v) => patch(i, { operation: v as StatModifier["operation"] })}
                className="bg-bg2 border border-border-c rounded-[5px] text-theme-text text-[11px]"
              />
            </div>
            <div>
              <div className="text-[10px] text-theme-faint mb-[3px]">Value</div>
              <NumInput value={mod.value} onChange={(v) => patch(i, { value: v })} width={80} />
            </div>
            <div>
              <div className="text-[10px] text-theme-faint mb-[3px]">Duration (ticks, blank=permanent)</div>
              <input
                type="number" min={0}
                value={mod.duration ?? ""}
                placeholder="∞"
                onChange={(e) => patch(i, { duration: e.target.value === "" ? undefined : Number(e.target.value) })}
                className="w-[70px] px-2 py-[5px] bg-bg2 border border-border-c rounded-[5px] text-theme-text text-[11px]"
              />
            </div>
            <button onClick={() => remove(i)} className="px-[10px] py-[5px] bg-theme-red/[.13] border border-theme-red/[.27] rounded-[5px] text-theme-red text-[11px] cursor-pointer">Remove</button>
          </div>
          <div className="flex gap-2 flex-wrap">
            <div>
              <div className="text-[10px] text-theme-faint mb-[3px]">Event (optional)</div>
              <SearchableSelect
                value={mod.event ?? ""}
                options={statEventOptions}
                onChange={(v) => patch(i, { event: v || undefined })}
                emptyLabel="(none)"
                className="bg-bg2 border border-border-c rounded-[5px] text-theme-text text-[11px]"
              />
            </div>
            <div>
              <div className="text-[10px] text-theme-faint mb-[3px]">Trigger type (optional)</div>
              <SearchableSelect
                value={mod.trigger?.type ?? ""}
                options={triggerTypeOptions}
                onChange={(v) => {
                  patch(i, { trigger: v ? { type: v, threshold: mod.trigger?.threshold ?? 0 } : undefined });
                }}
                emptyLabel="(none)"
                className="bg-bg2 border border-border-c rounded-[5px] text-theme-text text-[11px]"
              />
            </div>
            {mod.trigger?.type && (
              <div>
                <div className="text-[10px] text-theme-faint mb-[3px]">Trigger threshold</div>
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
        className="px-[14px] py-[6px] bg-bg2 border border-border-c rounded-md text-theme-muted text-[11px] cursor-pointer"
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
      <div className="text-[11px] text-theme-faint mb-[10px]">
        When this SubPart's trigger fires, it switches the target layer to the specified config.
      </div>
      {targets.map((sw, i) => (
        <div key={i} className="bg-bg1 border border-border-c rounded-lg p-3 mb-2">
          <div className="flex gap-2 flex-wrap mb-2 items-end">
            <div>
              <div className="text-[10px] text-theme-faint mb-[3px]">Target layer</div>
              <SearchableSelect
                value={sw.targetLayer}
                options={layerOptions}
                onChange={(v) => patch(i, { targetLayer: v })}
                className="bg-bg2 border border-border-c rounded-[5px] text-theme-text text-[11px]"
              />
            </div>
            <div>
              <div className="text-[10px] text-theme-faint mb-[3px]">Activate config name</div>
              <input value={sw.activateConfig} onChange={(e) => patch(i, { activateConfig: e.target.value })} placeholder="e.g. HoleFlat"
                className="w-[120px] px-2 py-[5px] bg-bg2 border border-border-c rounded-[5px] text-theme-text text-[11px]" />
            </div>
            <div>
              <div className="text-[10px] text-theme-faint mb-[3px]">Reset to config</div>
              <input value={sw.resetToConfig ?? ""} onChange={(e) => patch(i, { resetToConfig: e.target.value || undefined })} placeholder="(none)"
                className="w-[120px] px-2 py-[5px] bg-bg2 border border-border-c rounded-[5px] text-theme-text text-[11px]" />
            </div>
            <button onClick={() => remove(i)} className="px-[10px] py-[5px] bg-theme-red/[.13] border border-theme-red/[.27] rounded-[5px] text-theme-red text-[11px] cursor-pointer">Remove</button>
          </div>
          <div className="flex gap-2 flex-wrap mb-[6px]">
            <div>
              <div className="text-[10px] text-theme-faint mb-[3px]">Trigger type</div>
              <SearchableSelect
                value={sw.trigger.type}
                options={triggerOptions}
                onChange={(v) => patchTrigger(i, { type: v })}
                className="bg-bg2 border border-border-c rounded-[5px] text-theme-text text-[11px]"
              />
            </div>
            <div>
              <div className="text-[10px] text-theme-faint mb-[3px]">Threshold</div>
              <NumInput value={sw.trigger.threshold} onChange={(v) => patchTrigger(i, { threshold: v })} width={70} min={0} />
            </div>
            {sw.trigger.type === "impact_direction" && (
              <div>
                <div className="text-[10px] text-theme-faint mb-[3px]">Direction</div>
                <SearchableSelect
                  value={sw.trigger.direction ?? "any"}
                  options={[{ value: "any", label: "any" }, { value: "clockwise", label: "clockwise" }, { value: "counterclockwise", label: "counterclockwise" }]}
                  onChange={(v) => patchTrigger(i, { direction: v })}
                  className="bg-bg2 border border-border-c rounded-[5px] text-theme-text text-[11px]"
                />
              </div>
            )}
            <label className="flex items-center gap-[5px] text-[10px] text-theme-faint cursor-pointer">
              <input type="checkbox" checked={sw.trigger.togglePrevious ?? false}
                onChange={(e) => patchTrigger(i, { togglePrevious: e.target.checked })}
                className="accent-theme-blue" />
              togglePrevious (flip-flop)
            </label>
          </div>
          {sw.resetToConfig && (
            <div className="flex gap-2 flex-wrap">
              <div>
                <div className="text-[10px] text-theme-faint mb-[3px]">Reset condition type</div>
                <SearchableSelect
                  value={sw.resetCondition?.type ?? "impact"}
                  options={resetOptions}
                  onChange={(v) => patchReset(i, { type: v })}
                  className="bg-bg2 border border-border-c rounded-[5px] text-theme-text text-[11px]"
                />
              </div>
              <div>
                <div className="text-[10px] text-theme-faint mb-[3px]">Reset threshold</div>
                <NumInput value={sw.resetCondition?.threshold} onChange={(v) => patchReset(i, { threshold: v })} width={70} min={0} />
              </div>
            </div>
          )}
        </div>
      ))}
      <button onClick={add} className="px-[14px] py-[6px] bg-bg2 border border-border-c rounded-md text-theme-muted text-[11px] cursor-pointer">
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
    <div className="flex flex-col gap-0">
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
        <div className="flex gap-[6px]">
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
        <div className="flex gap-[6px] flex-wrap">
          {SUB_MODES.map(m => (
            <ToggleBtn key={m} label={m.replace(/_/g, " ")} active={mode === m} onClick={() => onChange({ mode: m })} />
          ))}
        </div>
      </Field>
      <Field label="Placement">
        <div className="flex gap-[6px]">
          {SUB_PLACEMENTS.map(p => (
            <ToggleBtn key={p} label={p} active={placement === p} onClick={() => onChange({ placement: p })} />
          ))}
        </div>
      </Field>

      {mode === "partial_slip" && (
        <div className="bg-bg1 border border-border-c rounded-lg p-3 mb-3">
          <div className="text-[11px] font-semibold text-theme-muted mb-2">Partial Slip Settings</div>
          <div className="flex gap-[10px] flex-wrap">
            <Field label="Spin Threshold (°)">
              <NumInput value={part.spinThresholdDeg as number | undefined} onChange={v => onChange({ spinThresholdDeg: v })} min={0} max={360} step={5} width={80} />
            </Field>
            <Field label="Lock Direction">
              <div className="flex gap-[5px]">
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
        <div className="bg-bg1 border border-border-c rounded-lg p-3 mb-3">
          <div className="text-[11px] font-semibold text-theme-muted mb-2">Lock Positions (°)</div>
          <div className="flex flex-wrap gap-[5px] mb-[6px]">
            {lockPositions.map((pos, i) => (
              <span key={i} className="bg-bg2 border border-border-c rounded text-[11px] text-theme-text flex items-center gap-1 px-2 py-[2px]">
                {pos}°
                <button onClick={() => onChange({ lockPositions: lockPositions.filter((_, j) => j !== i) })} className="bg-transparent border-none text-theme-red cursor-pointer text-[10px]">×</button>
              </span>
            ))}
          </div>
          <div className="flex gap-[6px]">
            <input type="number" min={0} max={359} value={lpInput} onChange={e => setLpInput(e.target.value)} placeholder="0–359"
              className="w-[80px] px-2 py-[5px] bg-bg2 border border-border-c rounded-[5px] text-theme-text text-[11px]" />
            <button onClick={() => { const v = Number(lpInput); if (!isNaN(v)) { onChange({ lockPositions: [...lockPositions, v] }); setLpInput(""); } }}
              className="px-[10px] py-[5px] bg-bg3 border border-border-c rounded-[5px] text-[11px] text-theme-muted cursor-pointer">+ Add</button>
          </div>
        </div>
      )}

      <SectionHeader>Detachment on Trigger</SectionHeader>
      <label className="flex items-center gap-[6px] text-xs text-theme-text cursor-pointer mb-[10px]">
        <input type="checkbox" checked={!!(detachment?.enabled)} onChange={e => patchDetach({ enabled: e.target.checked })} className="accent-theme-blue" />
        Enable detachment
      </label>
      {!!(detachment?.enabled) && (
        <div className="bg-bg1 border border-border-c rounded-lg p-3 mb-3">
          <div className="flex gap-[10px] flex-wrap mb-2">
            <Field label="Type">
              <div className="flex gap-[5px]">
                {DETACH_TYPES.map(t => <ToggleBtn key={t} label={t.replace(/_/g, " ")} active={detachment.type === t} onClick={() => patchDetach({ type: t })} />)}
              </div>
            </Field>
            <Field label="Trigger Condition">
              <div className="flex gap-[5px]">
                {DETACH_TRIGGERS.map(t => <ToggleBtn key={t} label={t.replace(/_/g, " ")} active={detachment.triggerCondition === t} onClick={() => patchDetach({ triggerCondition: t })} />)}
              </div>
            </Field>
          </div>
          {detachment.type === "projectile" && (
            <div className="flex gap-[10px] flex-wrap">
              <Field label="Speed"><NumInput value={detachment.speed as number | undefined} onChange={v => patchDetach({ speed: v })} min={0} step={10} width={80} /></Field>
              <Field label="Damage"><NumInput value={detachment.damage as number | undefined} onChange={v => patchDetach({ damage: v })} min={0} step={1} width={80} /></Field>
              <Field label="Radius (mm)"><NumInput value={detachment.radius as number | undefined} onChange={v => patchDetach({ radius: v })} min={1} step={0.5} width={80} /></Field>
            </div>
          )}
          {detachment.type === "mini_bey" && (
            <div className="flex gap-[10px] flex-wrap">
              <Field label="Duration (ticks)"><NumInput value={detachment.duration as number | undefined} onChange={v => patchDetach({ duration: v })} min={1} step={10} width={90} /></Field>
            </div>
          )}
        </div>
      )}

      <SectionHeader>Compatible Parents</SectionHeader>
      <Field label="Part types this sub-part can attach to">
        <div className="flex flex-wrap gap-[5px]">
          {ALL_PART_TYPES.map(t => {
            const active = compatibleParents.includes(t);
            return <ToggleBtn key={t} label={t.replace(/_/g, " ")} active={active} onClick={() => onChange({ compatibleParents: active ? compatibleParents.filter(p => p !== t) : [...compatibleParents, t] })} />;
          })}
        </div>
      </Field>

      <SwitchTargetsEditor part={part} onChange={onChange} />
      <div className="mt-5">
        <SectionHeader>Mechanism Wear</SectionHeader>
        <Field label="Mechanism Durability" hint="Max trigger fires before mechanism wears (0 = infinite, never wears out).">
          <NumInput value={part.mechanismDurability as number | undefined} onChange={(v) => onChange({ mechanismDurability: v })} min={0} step={1} width={90} />
        </Field>
        <Field label="Trigger Sensitivity" hint="1.0 = nominal spring. < 1.0 = worn spring (fires at lower impact force).">
          <NumInput value={part.triggerSensitivity as number | undefined} onChange={(v) => onChange({ triggerSensitivity: v })} min={0} max={2} />
        </Field>
      </div>

      <SectionHeader>Flip Behaviour</SectionHeader>
      <label className="flex items-center gap-[6px] text-xs text-theme-text cursor-pointer mb-3">
        <input type="checkbox" checked={!!(part.canFlip)} onChange={e => onChange({ canFlip: e.target.checked || undefined })} className="accent-theme-blue" />
        canFlip
        <span className="text-[10px] text-theme-faint">(sub-part can be flipped to reverse its contact-point orientation in the launcher)</span>
      </label>

      <div className="mt-5">
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
        <div className="flex flex-wrap gap-[5px]">
          {tipShapes.map(s => (
            <ToggleBtn key={s.id} label={s.label} active={part.tipShape === s.id} onClick={() => onChange({ tipShape: part.tipShape === s.id ? undefined : s.id })} />
          ))}
        </div>
      </Field>
      <MaterialField part={part} onChange={onChange} />
      <div className="flex gap-[14px] flex-wrap mb-[14px]">
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
      <label className="flex items-center gap-[6px] text-xs text-theme-text cursor-pointer mb-2">
        <input type="checkbox" checked={!!(part.freeSpin)} onChange={e => onChange({ freeSpin: e.target.checked || undefined })} className="accent-theme-blue" />
        freeSpin
        <span className="text-[10px] text-theme-faint">(B:D — tip bearing fully decouples spin from movement)</span>
      </label>
      <label className="flex items-center gap-[6px] text-xs text-theme-text cursor-pointer mb-4">
        <input type="checkbox" checked={!!(part.freeSpinOnCore)} onChange={e => onChange({ freeSpinOnCore: e.target.checked || undefined })} className="accent-theme-blue" />
        freeSpinOnCore
        <span className="text-[10px] text-theme-faint">(tip spins independently from the core — EG/CEW style)</span>
      </label>

      <SectionHeader>Default Sub-Tip</SectionHeader>
      <div className="bg-bg1 border border-border-c rounded-lg p-3 mb-[14px]">
        <div className="text-[11px] text-theme-faint mb-2">Optional inner sub-tip (e.g. SG Flat base inside a Wide Tip shell).</div>
        <div className="flex gap-[10px] flex-wrap">
          <Field label="Sub-tip Shape">
            <div className="flex flex-wrap gap-1">
              {["flat","sharp","semi_flat","ball","rubber_flat","bearing"].map(s => (
                <ToggleBtn key={s} label={s.replace(/_/g," ")}
                  active={(part.defaultSubTip as Record<string,unknown> | undefined)?.tipShape === s}
                  onClick={() => onChange({ defaultSubTip: { ...((part.defaultSubTip as Record<string,unknown>) ?? {}), tipShape: s } })}
                />
              ))}
            </div>
          </Field>
          <Field label="Sub-tip Friction" hint="0.0–1.0">
            <NumInput value={(part.defaultSubTip as Record<string,unknown> | undefined)?.friction as number | undefined}
              onChange={(v) => onChange({ defaultSubTip: { ...((part.defaultSubTip as Record<string,unknown>) ?? {}), friction: v } })}
              min={0} max={1} step={0.05} />
          </Field>
        </div>
      </div>

      <SectionHeader>Structural Flags</SectionHeader>
      <div className="flex gap-[10px] mb-4">
        <label className="flex items-center gap-[6px] text-xs text-theme-text cursor-pointer">
          <input type="checkbox" checked={!!(part.extendsAboveCasing)} onChange={(e) => onChange({ extendsAboveCasing: e.target.checked || undefined })} className="accent-theme-blue" />
          extendsAboveCasing
          <span className="text-[10px] text-theme-faint">(Rock Bison — tip body reaches casing height zone)</span>
        </label>
        <label className="flex items-center gap-[6px] text-xs text-theme-text cursor-pointer">
          <input type="checkbox" checked={!!(part.containsCasing)} onChange={(e) => onChange({ containsCasing: e.target.checked || undefined })} className="accent-theme-blue" />
          containsCasing
          <span className="text-[10px] text-theme-faint">(Wolborg G — tip cup is outermost shell)</span>
        </label>
      </div>

      <SectionHeader>Bearing</SectionHeader>
      <Field label="Bearing Friction" hint="0.02 (B:D, near-frictionless) → 1.0 (no bearing). Reduces spin-steal received × bearingFriction.">
        <NumInput value={part.bearingFriction as number | undefined} onChange={(v) => onChange({ bearingFriction: v })} min={0} max={1} />
      </Field>

      <SectionHeader>Spin Bias (R2F)</SectionHeader>
      <div className="flex gap-3 mb-[14px]">
        <Field label="Right-spin grip mult">
          <NumInput value={spinBias?.rightSpin.gripMultiplier} onChange={(v) => onChange({ spinBias: { ...spinBias, rightSpin: { gripMultiplier: v }, leftSpin: spinBias?.leftSpin ?? { gripMultiplier: 1.0 } } })} min={0} max={3} />
        </Field>
        <Field label="Left-spin grip mult">
          <NumInput value={spinBias?.leftSpin.gripMultiplier} onChange={(v) => onChange({ spinBias: { ...spinBias, leftSpin: { gripMultiplier: v }, rightSpin: spinBias?.rightSpin ?? { gripMultiplier: 1.0 } } })} min={0} max={3} />
        </Field>
      </div>

      <SectionHeader>Left-Spin Hop (Wyborg)</SectionHeader>
      <div className="flex gap-[10px] flex-wrap mb-[14px]">
        <label className="flex items-center gap-[6px] text-xs text-theme-text cursor-pointer">
          <input type="checkbox" checked={leftSpinHop?.enabled ?? false}
            onChange={(e) => onChange({ leftSpinHop: { ...leftSpinHop, enabled: e.target.checked, hopImpulse: leftSpinHop?.hopImpulse ?? 12, hopChance: leftSpinHop?.hopChance ?? 0.75 } })}
            className="accent-theme-blue" />
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

      <div className="mt-4">
        <MaterialBandsEditor part={part} onChange={onChange} />
      </div>
      <div className="mt-4">
        <EvolutionStagesEditor part={part} onChange={onChange} />
      </div>
      <div className="mt-1">
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
      <div className="text-[11px] text-theme-faint mb-[10px]">
        Each band is a material layer on the tip contact surface. Wear schedules drive the evolution driver trigger.
      </div>
      {bands.map((band, bi) => (
        <div key={bi} className="bg-bg1 border border-border-c rounded-lg p-3 mb-2">
          <div className="flex gap-[10px] flex-wrap items-end mb-2">
            <div>
              <div className="text-[10px] text-theme-faint mb-[3px]">Material</div>
              <SearchableSelect
                value={band.material}
                options={loading ? [] : [{ value: "", label: "(none)" }, ...matOptions.map(m => ({ value: m.id, label: m.label }))]}
                onChange={v => patch(bi, { material: v })}
                placeholder="Select material…"
                className="bg-bg2 border border-border-c rounded-[5px] text-theme-text text-[11px]"
              />
            </div>
            <div>
              <div className="text-[10px] text-theme-faint mb-[3px]">Coverage (0–1)</div>
              <NumInput value={band.coverage} onChange={v => patch(bi, { coverage: v })} min={0} max={1} step={0.05} width={70} />
            </div>
            <button onClick={() => remove(bi)} className="px-[10px] py-[5px] bg-theme-red/[.13] border border-theme-red/[.27] rounded-[5px] text-theme-red text-[11px] cursor-pointer">Remove</button>
          </div>
          <div className="text-[10px] font-semibold text-theme-muted mb-[6px]">Wear Schedule</div>
          <div className="text-[10px] text-theme-faint mb-[6px]">atSecond = match elapsed seconds; wearLevel 100=new, 0=fully worn.</div>
          {(band.wearSchedule ?? []).map((step, si) => (
            <div key={si} className="flex gap-2 items-center mb-[5px]">
              <div className="text-[10px] text-theme-faint w-[60px]">at {step.atSecond}s</div>
              <div>
                <div className="text-[9px] text-theme-faint">Second</div>
                <NumInput value={step.atSecond} onChange={v => patchStep(bi, si, { atSecond: v })} min={0} step={5} width={65} />
              </div>
              <div>
                <div className="text-[9px] text-theme-faint">Wear (0–100)</div>
                <NumInput value={step.wearLevel} onChange={v => patchStep(bi, si, { wearLevel: v })} min={0} max={100} step={5} width={65} />
              </div>
              <button onClick={() => removeStep(bi, si)} className="px-2 py-[3px] bg-transparent border border-theme-red/30 rounded text-theme-red text-[10px] cursor-pointer">×</button>
            </div>
          ))}
          <button onClick={() => addStep(bi)} className="px-[10px] py-1 bg-bg2 border border-border-c rounded-[5px] text-theme-muted text-[10px] cursor-pointer mt-[2px]">
            + Add Wear Step
          </button>
        </div>
      ))}
      <button onClick={add} className="px-[14px] py-[6px] bg-bg2 border border-border-c rounded-md text-theme-muted text-[11px] cursor-pointer">
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

// Static lookup for data-driven stage dot colors
const STAGE_COLOR_CLASSES: Record<number, { text: string; border: string }> = {
  0: { text: "text-[#9ca3af]", border: "border-l-[#9ca3af]" },
  1: { text: "text-[#fbbf24]", border: "border-l-[#fbbf24]" },
  2: { text: "text-[#f97316]", border: "border-l-[#f97316]" },
  3: { text: "text-[#ef4444]", border: "border-l-[#ef4444]" },
};

function EvolutionStagesEditor({ part, onChange }: { part: Part; onChange: OnChange }) {
  const stages: EvolutionStage[] = (part.evolutionStages as EvolutionStage[] | undefined) ?? [];

  const update = (s: EvolutionStage[]) => onChange({ evolutionStages: s });
  const add = () => update([...stages, { label: `Stage ${stages.length}`, configName: "" }]);
  const remove = (i: number) => update(stages.filter((_, idx) => idx !== i));
  const patch = (i: number, p: Partial<EvolutionStage>) => update(stages.map((s, idx) => idx === i ? { ...s, ...p } : s));
  const patchTrigger = (i: number, p: Partial<NonNullable<EvolutionStage["trigger"]>>) =>
    patch(i, { trigger: { type: "time", value: 0, ...stages[i].trigger, ...p } });

  return (
    <div>
      <SectionHeader>Evolution Stages</SectionHeader>
      <div className="text-[11px] text-theme-faint mb-[10px]">
        Stage 0 = default tip. Each subsequent stage fires when its trigger condition is met and automatically switches the active tip config.
      </div>
      {stages.length === 0 && (
        <div className="text-[11px] text-theme-faint mb-[10px]">No stages — this tip uses a single fixed config.</div>
      )}
      {stages.map((stage, i) => {
        const colorIdx = Math.min(i, 3);
        const colorCls = STAGE_COLOR_CLASSES[colorIdx];
        return (
          <div key={i} className={cn("bg-bg1 border border-border-c rounded-lg p-3 mb-2 border-l-[3px]", colorCls.border)}>
            <div className="flex gap-2 flex-wrap items-end mb-2">
              <div className={cn("text-[11px] font-bold min-w-[60px]", colorCls.text)}>Stage {i}</div>
              <div>
                <div className="text-[10px] text-theme-faint mb-[3px]">Label</div>
                <input
                  value={stage.label}
                  onChange={e => patch(i, { label: e.target.value })}
                  placeholder="e.g. Worn"
                  className="w-[110px] px-2 py-[5px] bg-bg2 border border-border-c rounded-[5px] text-theme-text text-[11px]"
                />
              </div>
              <div>
                <div className="text-[10px] text-theme-faint mb-[3px]">Config name</div>
                <input
                  value={stage.configName}
                  onChange={e => patch(i, { configName: e.target.value })}
                  placeholder="e.g. worn"
                  className="w-[110px] px-2 py-[5px] bg-bg2 border border-border-c rounded-[5px] text-theme-text text-[11px]"
                />
              </div>
              {i > 0 && (
                <button onClick={() => remove(i)} className="px-[10px] py-[5px] bg-theme-red/[.13] border border-theme-red/[.27] rounded-[5px] text-theme-red text-[11px] cursor-pointer">Remove</button>
              )}
            </div>
            {i === 0 ? (
              <div className="text-[10px] text-theme-faint">Stage 0 is the starting config — no trigger required.</div>
            ) : (
              <div className="flex gap-2 flex-wrap items-end">
                <div>
                  <div className="text-[10px] text-theme-faint mb-[3px]">Trigger type</div>
                  <SearchableSelect
                    value={stage.trigger?.type ?? "time"}
                    options={EVOLUTION_TRIGGER_TYPES.map(t => ({ value: t.value, label: t.label }))}
                    onChange={v => patchTrigger(i, { type: v })}
                    className="bg-bg2 border border-border-c rounded-[5px] text-theme-text text-[11px]"
                  />
                </div>
                <div>
                  <div className="text-[10px] text-theme-faint mb-[3px]">
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
      <button onClick={add} className="px-[14px] py-[6px] bg-bg2 border border-border-c rounded-md text-theme-muted text-[11px] cursor-pointer">
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
        <div className="flex flex-wrap gap-[5px]">
          {coreGimmicks.map(g => (
            <ToggleBtn key={g.id} label={g.label} active={gimmick === g.id} onClick={() => onChange({ gimmick: g.id })} />
          ))}
        </div>
      </Field>
      {(gimmick === "magnetic" || gimmick === "weight_shift" || gimmick === "speed_boost" || gimmick === "engine_gear" || gimmick === "clutch_release") && (
        <div className="bg-bg1 border border-border-c rounded-lg p-3 mb-[14px]">
          <Field label="Suction Emit (emission force)">
            <NumInput value={part.suctionEmit as number | undefined} onChange={v => onChange({ suctionEmit: v })} min={0} step={0.01} />
          </Field>
        </div>
      )}

      <SectionHeader>Movement Override</SectionHeader>
      <Field label="Movement type" hint="orbit = standard. fixed = hold position. jump = hop-only movement.">
        <div className="flex gap-[6px]">
          {(["orbit", "jump", "fixed"] as const).map((t) => (
            <ToggleBtn key={t} label={t} active={(mo?.type ?? "orbit") === t} onClick={() => updateMO({ type: t })} />
          ))}
        </div>
      </Field>
      {mo?.type === "jump" && (
        <div className="bg-bg1 border border-border-c rounded-lg p-3 mb-[14px]">
          <div className="text-[11px] font-semibold text-theme-muted mb-2">Jump Config</div>
          <div className="flex gap-[10px] flex-wrap">
            <Field label="Jump Force"><NumInput value={mo.jumpConfig?.jumpForce} onChange={(v) => updateJump({ jumpForce: v })} min={0} step={0.5} width={80} /></Field>
            <Field label="Period (ticks)"><NumInput value={mo.jumpConfig?.jumpPeriodTicks} onChange={(v) => updateJump({ jumpPeriodTicks: v })} min={1} step={1} width={80} /></Field>
            <Field label="Airborne (ticks)"><NumInput value={mo.jumpConfig?.airborneTickDuration} onChange={(v) => updateJump({ airborneTickDuration: v })} min={1} step={1} width={80} /></Field>
          </div>
          <div className="text-[11px] font-semibold text-theme-muted my-2">Landing Damage</div>
          <div className="flex gap-[10px] flex-wrap">
            <label className="flex items-center gap-[5px] text-[11px] text-theme-text cursor-pointer">
              <input type="checkbox" checked={mo.jumpConfig?.landingDamage?.enabled ?? false} onChange={(e) => updateLD({ enabled: e.target.checked })} className="accent-theme-blue" />
              Enabled
            </label>
            <Field label="Damage mult"><NumInput value={mo.jumpConfig?.landingDamage?.damageMultiplier} onChange={(v) => updateLD({ damageMultiplier: v })} min={0} step={0.1} width={70} /></Field>
            <Field label="AOE radius (mm)"><NumInput value={mo.jumpConfig?.landingDamage?.aoeRadius} onChange={(v) => updateLD({ aoeRadius: v })} min={0} step={1} width={70} /></Field>
            <Field label="Spin boost on land"><NumInput value={mo.jumpConfig?.landingDamage?.spinBoostOnLand} onChange={(v) => updateLD({ spinBoostOnLand: v || undefined })} min={0} max={1} width={70} /></Field>
          </div>
        </div>
      )}

      {(gimmick === "spin_injection" || gimmick === "none") && <><SectionHeader>Spin Injection</SectionHeader>
      <label className="flex items-center gap-[6px] text-xs text-theme-text cursor-pointer mb-[10px]">
        <input type="checkbox" checked={si?.enabled ?? false} onChange={(e) => updateSI({ enabled: e.target.checked, rateRPM: si?.rateRPM ?? 30, reserveCapacity: si?.reserveCapacity ?? 1800, activationCondition: si?.activationCondition ?? "spin_threshold" })} className="accent-theme-blue" />
        Enabled
      </label>
      {si?.enabled && (
        <div className="flex gap-[10px] flex-wrap mb-[14px]">
          <Field label="Rate (RPM/s)"><NumInput value={si.rateRPM} onChange={(v) => updateSI({ rateRPM: v })} min={0} step={1} width={80} /></Field>
          <Field label="Reserve capacity (0=unlimited)"><NumInput value={si.reserveCapacity} onChange={(v) => updateSI({ reserveCapacity: v })} min={0} step={100} width={90} /></Field>
          <Field label="Activation condition">
            <SearchableSelect
              value={si.activationCondition}
              options={[{ value: "always", label: "always" }, { value: "casing_trigger", label: "casing_trigger" }, { value: "spin_threshold", label: "spin_threshold" }]}
              onChange={(v) => updateSI({ activationCondition: v })}
              className="bg-bg2 border border-border-c rounded-[5px] text-theme-text text-[11px]"
            />
          </Field>
          {si.activationCondition === "spin_threshold" && (
            <Field label="Spin threshold (0–1)"><NumInput value={si.spinThreshold} onChange={(v) => updateSI({ spinThreshold: v })} min={0} max={1} /></Field>
          )}
        </div>
      )}

      </>}{/* end spin_injection gate */}

      {(gimmick === "counter_rotation" || gimmick === "none") && <><SectionHeader>Counter-Rotation (Dranzer GT)</SectionHeader>
      <label className="flex items-center gap-[6px] text-xs text-theme-text cursor-pointer mb-[10px]">
        <input type="checkbox" checked={cr?.enabled ?? false} onChange={(e) => updateCR({ enabled: e.target.checked, activationCondition: cr?.activationCondition ?? "casing_trigger", directionSequence: cr?.directionSequence ?? ["right", "left", "right", "left"], stepDurationTicks: cr?.stepDurationTicks ?? 30, spinDecayCostPerStep: cr?.spinDecayCostPerStep ?? 0.03 })} className="accent-theme-blue" />
        Enabled
      </label>
      {cr?.enabled && (
        <div className="mb-[14px]">
          <div className="flex gap-[10px] flex-wrap">
            <Field label="Activation">
              <SearchableSelect
                value={cr.activationCondition}
                options={[{ value: "casing_trigger", label: "casing_trigger" }, { value: "player_input", label: "player_input" }]}
                onChange={(v) => updateCR({ activationCondition: v })}
                className="bg-bg2 border border-border-c rounded-[5px] text-theme-text text-[11px]"
              />
            </Field>
            <Field label="Step duration (ticks)"><NumInput value={cr.stepDurationTicks} onChange={(v) => updateCR({ stepDurationTicks: v })} min={1} step={1} width={80} /></Field>
            <Field label="Spin cost per step"><NumInput value={cr.spinDecayCostPerStep} onChange={(v) => updateCR({ spinDecayCostPerStep: v })} min={0} max={1} /></Field>
          </div>
          <Field label="Direction sequence (right/left, comma-separated)">
            <div className="flex gap-[6px]">
              <input value={seqInput || (cr.directionSequence ?? []).join(",")} onChange={(e) => setSeqInput(e.target.value)}
                placeholder="right,left,right,left"
                className="flex-1 px-[10px] py-[6px] bg-bg2 border border-border-c rounded-md text-theme-text text-[11px]" />
              <button onClick={() => {
                const seq = seqInput.split(",").map((s) => s.trim()).filter((s) => s === "right" || s === "left");
                if (seq.length) { updateCR({ directionSequence: seq }); setSeqInput(""); }
              }} className="px-3 py-[6px] bg-bg3 border border-border-c rounded-md text-[11px] text-theme-muted cursor-pointer">Set</button>
            </div>
            <div className="text-[10px] text-theme-faint mt-1">Current: [{(cr.directionSequence ?? []).join(", ")}]</div>
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
      <div className="mt-1">
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
        <div className="flex gap-[6px]">
          {CASING_CATEGORIES.map(c => (
            <ToggleBtn key={c} label={c} active={part.casingCategory === c} onClick={() => onChange({ casingCategory: part.casingCategory === c ? undefined : c })} />
          ))}
        </div>
      </Field>

      <SectionHeader>Slots</SectionHeader>
      <div className="bg-bg1 border border-border-c rounded-lg p-3 mb-[10px]">
        <div className="text-[11px] font-semibold text-theme-muted mb-2">Tip Slot</div>
        <div className="flex gap-[10px] flex-wrap">
          <Field label="Position X (mm)"><NumInput value={tipSlot?.x as number | undefined} onChange={v => patchTipSlot({ x: v })} step={0.5} width={70} /></Field>
          <Field label="Position Y (mm)"><NumInput value={tipSlot?.y as number | undefined} onChange={v => patchTipSlot({ y: v })} step={0.5} width={70} /></Field>
          <Field label="Radius (mm)"><NumInput value={tipSlot?.radius as number | undefined} onChange={v => patchTipSlot({ radius: v })} min={1} step={0.5} width={70} /></Field>
        </div>
      </div>
      <div className="bg-bg1 border border-border-c rounded-lg p-3 mb-[14px]">
        <div className="flex items-center gap-2 mb-2">
          <label className="flex items-center gap-[6px] text-xs text-theme-text cursor-pointer">
            <input type="checkbox" checked={!!(coreSlot?.enabled)} onChange={e => patchCoreSlot({ enabled: e.target.checked })} className="accent-theme-blue" />
            Core Slot enabled
          </label>
        </div>
        {!!(coreSlot?.enabled) && (
          <div className="flex gap-[10px] flex-wrap">
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
      <div className="mt-1">
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
          className="bg-bg3 border border-border-c rounded-[7px] text-theme-text text-[13px]"
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
              className="px-[10px] py-[7px] bg-bg3 border border-border-c rounded-[7px] text-theme-text text-[13px] w-full"
            />
          </Field>
          <div className="bg-bg1 border border-border-c rounded-lg p-3 mb-[14px]">
            <div className="text-[11px] font-semibold text-theme-muted mb-2">Custom Move Physics</div>
            <div className="flex gap-[10px] flex-wrap">
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
                  className="bg-bg2 border border-border-c rounded-[5px] text-theme-text text-[11px]"
                />
              </Field>
            </div>
          </div>
        </>
      )}

      <SectionHeader>MFB / Energy Ring</SectionHeader>
      <label className="flex items-center gap-[6px] text-xs text-theme-text cursor-pointer mb-[14px]">
        <input type="checkbox" checked={!!(part.isEnergyRing)} onChange={(e) => onChange({ isEnergyRing: e.target.checked || undefined })} className="accent-theme-blue" />
        Is Energy Ring
        <span className="text-[10px] text-theme-faint">(MFB — purely cosmetic + minor weight; no special move)</span>
      </label>

      <SectionHeader>Hidden Stats</SectionHeader>
      <Field label="Spiritual Force" hint="0.5–2.0. Multiplier on special move base power (lore stat, hidden from players).">
        <NumInput value={part.spiritualForce as number | undefined} onChange={(v) => onChange({ spiritualForce: v })} min={0.5} max={2} />
      </Field>
      <Field label="Resonance Bonus" hint="Additive speed bonus when two beys from the same series face each other.">
        <NumInput value={part.resonanceBonus as number | undefined} onChange={(v) => onChange({ resonanceBonus: v })} min={0} max={1} />
      </Field>
      <div className="mt-1">
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
      <div className="flex gap-3 flex-wrap mb-[14px]">
        <Field label="Height (mm)" hint="Track height (e.g. 90, 100, 105, 125, 130, 145, 160, 230).">
          <NumInput value={part.height as number | undefined} onChange={(v) => onChange({ height: v })} min={0} step={5} width={80} />
        </Field>
        <Field label="Weight (g)">
          <NumInput value={part.weight as number | undefined} onChange={(v) => onChange({ weight: v })} min={0} step={0.1} width={80} />
        </Field>
      </div>

      <SectionHeader>Shield Disk (e.g. S130)</SectionHeader>
      <label className="flex items-center gap-[6px] text-xs text-theme-text cursor-pointer mb-[10px]">
        <input type="checkbox" checked={sd?.enabled ?? false} onChange={(e) => updateSD({ enabled: e.target.checked })} className="accent-theme-blue" />
        Shield disk enabled
      </label>
      {sd?.enabled && (
        <div className="flex gap-[10px] flex-wrap mb-[14px]">
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
      <div className="mt-1">
        <StatModifiersEditor part={part} onChange={onChange} />
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Gear Parts
// ─────────────────────────────────────────────────────────────────────────────

const GEAR_SHAPES = ["sword","shield","hammer","wing","lance","fortress","ring","anchor","custom"] as const;
const GEAR_ARCHETYPES = ["attack","defense","stamina","balance"] as const;
const CLUTCH_MODES = ["none","first","final","always-on"] as const;

function GearFields({ part, onChange }: { part: Part; onChange: OnChange }) {
  return (
    <div>
      <SectionHeader>Material</SectionHeader>
      <MaterialField part={part} onChange={onChange} />

      <SectionHeader>Gear Shape &amp; Archetype</SectionHeader>
      <Field label="Gear Shape">
        <div className="flex flex-wrap gap-[5px]">
          {GEAR_SHAPES.map(s => (
            <ToggleBtn key={s} label={s} active={part.gearShape === s} onClick={() => onChange({ gearShape: s })} />
          ))}
        </div>
      </Field>
      <Field label="Archetype">
        <div className="flex gap-[5px]">
          {GEAR_ARCHETYPES.map(a => (
            <ToggleBtn key={a} label={a} active={part.archetype === a} onClick={() => onChange({ archetype: a })} />
          ))}
        </div>
      </Field>

      <SectionHeader>Gear Mechanics</SectionHeader>
      <div className="flex gap-[14px] flex-wrap mb-[14px]">
        <Field label="Gear Teeth" hint="Number of teeth on the gear ring.">
          <NumInput value={part.gearTeeth as number | undefined} onChange={(v) => onChange({ gearTeeth: v })} min={0} step={1} width={80} />
        </Field>
        <Field label="Gear Ratio" hint="Output/input speed ratio (e.g. 1.5 = 1.5× speed).">
          <NumInput value={part.gearRatio as number | undefined} onChange={(v) => onChange({ gearRatio: v })} min={0} max={10} step={0.1} width={80} />
        </Field>
        <Field label="Spring Stiffness" hint="Spring force constant for spring-wound gears (N/m).">
          <NumInput value={part.springStiffness as number | undefined} onChange={(v) => onChange({ springStiffness: v })} min={0} step={10} width={90} />
        </Field>
        <Field label="Lock Angle (°)" hint="Angle at which the ratchet locks.">
          <NumInput value={part.lockAngle as number | undefined} onChange={(v) => onChange({ lockAngle: v })} min={0} max={360} step={5} width={80} />
        </Field>
        <Field label="Release Force" hint="Impact force threshold that releases the clutch (N).">
          <NumInput value={part.releaseForce as number | undefined} onChange={(v) => onChange({ releaseForce: v })} min={0} step={10} width={90} />
        </Field>
      </div>

      <Field label="Clutch Mode">
        <div className="flex gap-[5px]">
          {CLUTCH_MODES.map(m => (
            <ToggleBtn key={m} label={m} active={(part.clutchMode ?? "none") === m} onClick={() => onChange({ clutchMode: m })} />
          ))}
        </div>
      </Field>

      <div className="mt-1">
        <StatModifiersEditor part={part} onChange={onChange} />
      </div>
    </div>
  );
}
