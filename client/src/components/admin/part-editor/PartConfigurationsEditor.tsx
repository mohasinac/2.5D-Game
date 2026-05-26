/**
 * PartConfigurationsEditor — manages the `configurations` array on any part.
 *
 * Each config has:
 *  • name + description
 *  • overrides: JSON blob (shown as a text editor — part-type-specific field editors
 *    will be wired in Sprint 4 when the full PartEditor is built)
 *  • autoTriggers: list of ConfigTrigger objects
 *  • resetCondition: optional reset condition
 */

import { useState } from "react";
import type { PartConfiguration, ConfigTrigger, ConfigResetCondition } from "@/types/beybladeSystem";
import { SearchableSelect } from "@/components/admin/SearchableSelect";
import { usePartMaterials } from "@/hooks/usePartMaterials";

const TRIGGER_TYPES: ConfigTrigger["type"][] = [
  "spin_threshold",
  "subpart_spin_threshold",
  "impact_threshold",
  "timer",
  "core_activated",
  "external_part_state",
];

const RESET_TYPES: ConfigResetCondition["type"][] = ["spin_recovery", "timer", "impact"];

function defaultTrigger(): ConfigTrigger {
  return { type: "spin_threshold", threshold: 0.5 };
}

function defaultConfig<T>(): PartConfiguration<T> {
  return { name: "", description: "", overrides: {} as T, autoTriggers: [], resetCondition: undefined };
}

// ── Per-type quick-fields (structured override panel) ───────────────────────

const TIP_SHAPES = ["flat","sharp","semi_flat","wide","ball","spike","rubber_flat","hole_flat","rubber_ball","defense","custom"];
const SUBPART_MODES = ["free_spin","partial_slip","fixed","ratchet"];
const CASING_CATS = ["round","wide","flat","custom"];
const CORE_GIMMICKS = ["none","speed_boost","weight_shift","magnetic","engine_gear","clutch_release","spin_injection","counter_rotation"];

// Shared classes for structured field inputs
const FIELD_INPUT = "w-full py-[5px] px-2 bg-bg2 border border-border-c rounded-md text-theme-text text-[11px] box-border";

function StructuredOverridePanel({ partTypeSlug, overrides, onChange }: {
  partTypeSlug: string;
  overrides: Record<string, unknown>;
  onChange: (patch: Record<string, unknown>) => void;
}) {
  const patch = (key: string, value: unknown) => onChange({ ...overrides, [key]: value });
  const { materials } = usePartMaterials();

  if (partTypeSlug === "tips") {
    return (
      <div className="grid gap-2" style={{ gridTemplateColumns: "1fr 1fr 1fr" }}>
        <div className="flex flex-col gap-[3px]">
          <span className="text-[10px] text-theme-muted">Tip Shape</span>
          <select value={(overrides.tipShape as string) ?? ""} onChange={e => patch("tipShape", e.target.value || undefined)} className={FIELD_INPUT}>
            <option value="">(inherit)</option>
            {TIP_SHAPES.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
        <div className="flex flex-col gap-[3px]">
          <span className="text-[10px] text-theme-muted">Material</span>
          <SearchableSelect
            value={(overrides.material as string) ?? ""}
            onChange={val => patch("material", val || undefined)}
            options={[{ value: "", label: "(inherit)" }, ...materials.map(m => ({ value: m.id, label: m.label }))]}
            placeholder="(inherit)"
          />
        </div>
        <div className="flex flex-col gap-[3px]">
          <span className="text-[10px] text-theme-muted">Grip Factor</span>
          <input type="number" min={0} max={1} step={0.05}
            value={(overrides.gripFactor as number) ?? ""}
            placeholder="(inherit)"
            onChange={e => patch("gripFactor", e.target.value ? +e.target.value : undefined)}
            className={FIELD_INPUT} />
        </div>
        <div className="flex flex-col gap-[3px]">
          <span className="text-[10px] text-theme-muted">Aggressiveness</span>
          <input type="number" min={0} max={1} step={0.05}
            value={(overrides.aggressiveness as number) ?? ""}
            placeholder="(inherit)"
            onChange={e => patch("aggressiveness", e.target.value ? +e.target.value : undefined)}
            className={FIELD_INPUT} />
        </div>
        <div className="flex flex-col gap-[3px] justify-end pt-3.5">
          <label className="flex gap-1.5 items-center cursor-pointer">
            <input type="checkbox"
              checked={overrides.freeSpin === true}
              onChange={e => patch("freeSpin", e.target.checked ? true : undefined)} />
            <span className="text-[10px] text-theme-muted">Free spin</span>
          </label>
        </div>
      </div>
    );
  }
  if (partTypeSlug === "sub-parts") {
    return (
      <div className="flex flex-col gap-[3px]">
        <span className="text-[10px] text-theme-muted">Mode</span>
        <select value={(overrides.mode as string) ?? ""} onChange={e => patch("mode", e.target.value || undefined)} className={FIELD_INPUT}>
          <option value="">(inherit)</option>
          {SUBPART_MODES.map(s => <option key={s} value={s}>{s}</option>)}
        </select>
      </div>
    );
  }
  if (partTypeSlug === "casings") {
    return (
      <div className="flex flex-col gap-[3px]">
        <span className="text-[10px] text-theme-muted">Casing Category</span>
        <select value={(overrides.casingCategory as string) ?? ""} onChange={e => patch("casingCategory", e.target.value || undefined)} className={FIELD_INPUT}>
          <option value="">(inherit)</option>
          {CASING_CATS.map(s => <option key={s} value={s}>{s}</option>)}
        </select>
      </div>
    );
  }
  if (partTypeSlug === "cores") {
    return (
      <div className="flex flex-col gap-[3px]">
        <span className="text-[10px] text-theme-muted">Gimmick Type</span>
        <select value={(overrides.gimmick as string) ?? ""} onChange={e => patch("gimmick", e.target.value || undefined)} className={FIELD_INPUT}>
          <option value="">(inherit)</option>
          {CORE_GIMMICKS.map(s => <option key={s} value={s}>{s}</option>)}
        </select>
      </div>
    );
  }
  return null;
}

interface Props<T> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  value: PartConfiguration<any>[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onChange: (configs: PartConfiguration<any>[]) => void;
  partTypeSlug?: string;
}

export function PartConfigurationsEditor<T>({ value, onChange, partTypeSlug }: Props<T>) {
  const [expanded, setExpanded] = useState<number | null>(null);
  const [overrideError, setOverrideError] = useState<Record<number, string>>({});

  const update = (idx: number, patch: Partial<PartConfiguration<T>>) => {
    onChange(value.map((c, i) => i === idx ? { ...c, ...patch } : c));
  };

  const remove = (idx: number) => {
    onChange(value.filter((_, i) => i !== idx));
    if (expanded === idx) setExpanded(null);
    else if (expanded !== null && expanded > idx) setExpanded(expanded - 1);
  };

  const addConfig = () => {
    onChange([...value, defaultConfig<T>()]);
    setExpanded(value.length);
  };

  const updateOverridesJSON = (idx: number, json: string) => {
    try {
      const parsed = JSON.parse(json);
      update(idx, { overrides: parsed });
      setOverrideError((e) => ({ ...e, [idx]: "" }));
    } catch {
      setOverrideError((e) => ({ ...e, [idx]: "Invalid JSON" }));
    }
  };

  const addTrigger = (idx: number) => {
    const triggers = [...(value[idx].autoTriggers ?? []), defaultTrigger()];
    update(idx, { autoTriggers: triggers });
  };

  const updateTrigger = (cfgIdx: number, trigIdx: number, patch: Partial<ConfigTrigger>) => {
    const triggers = (value[cfgIdx].autoTriggers ?? []).map((t, i) => i === trigIdx ? { ...t, ...patch } : t);
    update(cfgIdx, { autoTriggers: triggers });
  };

  const removeTrigger = (cfgIdx: number, trigIdx: number) => {
    const triggers = (value[cfgIdx].autoTriggers ?? []).filter((_, i) => i !== trigIdx);
    update(cfgIdx, { autoTriggers: triggers });
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <div className="text-xs text-theme-muted">Configurations ({value.length})</div>
        <button
          onClick={addConfig}
          className="py-1 px-3 bg-bg3 border border-border-c rounded-md text-[11px] text-theme-muted cursor-pointer"
        >
          + Add Config
        </button>
      </div>

      {value.length === 0 && (
        <div className="text-xs text-theme-faint py-2">
          No configurations. Parts with only one mode don't need configs.
          Add configs for swappable modes like "Flat / Sharp / Semi-Flat" on tip parts.
        </div>
      )}

      <div className="flex flex-col gap-2">
        {value.map((config, idx) => (
          <div
            key={idx}
            className="rounded-[9px] overflow-hidden"
            style={{
              border: `1px solid ${expanded === idx ? "rgba(59,130,246,0.33)" : "var(--border)"}`,
            }}
          >
            {/* Header */}
            <div
              className="flex items-center gap-2.5 px-3.5 py-2.5 cursor-pointer"
              style={{
                background: expanded === idx ? "rgba(59,130,246,0.06)" : "var(--bg2)",
              }}
              onClick={() => setExpanded(expanded === idx ? null : idx)}
            >
              <span className={`flex-1 text-[13px] font-semibold ${config.name ? "text-theme-text" : "text-theme-faint"}`}>
                {config.name || `Config ${idx + 1} (unnamed)`}
              </span>
              {config.autoTriggers?.length ? (
                <span className="text-[10px] text-theme-yellow bg-yellow-500/10 py-[2px] px-1.5 rounded">
                  {config.autoTriggers.length} trigger{config.autoTriggers.length > 1 ? "s" : ""}
                </span>
              ) : null}
              <span className="text-[11px] text-theme-faint">{expanded === idx ? "▾" : "▸"}</span>
              <button
                onClick={(e) => { e.stopPropagation(); remove(idx); }}
                className="bg-transparent border-none text-theme-red text-sm cursor-pointer"
              >×</button>
            </div>

            {/* Body */}
            {expanded === idx && (
              <div className="px-4 py-3.5 bg-bg1 flex flex-col gap-3.5">
                {/* Name */}
                <div>
                  <label className="block text-[11px] text-theme-muted mb-1">Config Name *</label>
                  <input
                    value={config.name}
                    onChange={(e) => update(idx, { name: e.target.value })}
                    placeholder='e.g. "Sharp", "Flat", "Locked"'
                    className="w-full py-[7px] px-2.5 bg-bg2 border border-border-c rounded-md text-theme-text text-[13px] box-border"
                  />
                </div>

                {/* Description */}
                <div>
                  <label className="block text-[11px] text-theme-muted mb-1">Description</label>
                  <input
                    value={config.description}
                    onChange={(e) => update(idx, { description: e.target.value })}
                    placeholder="Short description of this mode"
                    className="w-full py-[7px] px-2.5 bg-bg2 border border-border-c rounded-md text-theme-text text-[13px] box-border"
                  />
                </div>

                {/* Display Name (HUD label) + Player Switchable toggle */}
                <div className="grid gap-2.5 items-end" style={{ gridTemplateColumns: "1fr auto" }}>
                  <div>
                    <label className="block text-[11px] text-theme-muted mb-1">
                      Display Name (shown in in-game PartModesHUD)
                    </label>
                    <input
                      value={config.displayName ?? ""}
                      onChange={(e) => update(idx, { displayName: e.target.value || undefined })}
                      placeholder={config.name || "Defaults to Config Name"}
                      className="w-full py-[7px] px-2.5 bg-bg2 border border-border-c rounded-md text-theme-text text-[13px] box-border"
                    />
                  </div>
                  <label className="flex items-center gap-1.5 text-xs text-theme-muted pb-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={config.playerSwitchable === true}
                      onChange={(e) => update(idx, { playerSwitchable: e.target.checked || undefined })}
                    />
                    Player-switchable
                  </label>
                </div>

                {/* Structured override fields (type-specific quick-access) */}
                {partTypeSlug && (
                  <div>
                    <label className="block text-[11px] text-theme-muted mb-1.5">
                      Override Fields
                    </label>
                    <StructuredOverridePanel
                      partTypeSlug={partTypeSlug}
                      overrides={(config.overrides ?? {}) as Record<string, unknown>}
                      onChange={(patch) => update(idx, { overrides: patch as T })}
                    />
                  </div>
                )}

                {/* Overrides JSON (advanced / fallback) */}
                <div>
                  <label className="block text-[11px] text-theme-muted mb-1">
                    Overrides (JSON — full partial field override)
                  </label>
                  <textarea
                    defaultValue={JSON.stringify(config.overrides, null, 2)}
                    onBlur={(e) => updateOverridesJSON(idx, e.target.value)}
                    rows={5}
                    className="w-full py-2 px-2.5 bg-bg2 rounded-md text-theme-text text-[11px] font-mono resize-y box-border"
                    style={{
                      border: `1px solid ${overrideError[idx] ? "var(--red)" : "var(--border)"}`,
                    }}
                  />
                  {overrideError[idx] && (
                    <div className="text-[11px] text-theme-red mt-[3px]">{overrideError[idx]}</div>
                  )}
                  <div className="text-[10px] text-theme-faint mt-[3px]">
                    Only changed fields are needed. E.g. for a tip: {`{"tipShape":"sharp","gripFactor":0.1}`}
                  </div>
                </div>

                {/* Auto Triggers */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-[11px] text-theme-muted">Auto Triggers</label>
                    <button
                      onClick={() => addTrigger(idx)}
                      className="py-[3px] px-2.5 bg-bg3 border border-border-c rounded-[5px] text-[10px] text-theme-muted cursor-pointer"
                    >
                      + Trigger
                    </button>
                  </div>
                  {(config.autoTriggers ?? []).map((trig, ti) => (
                    <div key={ti} className="bg-bg3 rounded-[7px] py-2 px-2.5 mb-1.5 flex gap-2 items-center flex-wrap">
                      <SearchableSelect
                        value={trig.type}
                        options={TRIGGER_TYPES.map((t) => ({ value: t, label: t }))}
                        onChange={(v) => updateTrigger(idx, ti, { type: v as ConfigTrigger["type"] })}
                        style={{ background: "var(--bg2)", border: "1px solid var(--border)", borderRadius: 5, color: "var(--text)", fontSize: 11 }}
                      />
                      <div className="flex items-center gap-1">
                        <span className="text-[10px] text-theme-muted">threshold</span>
                        <input
                          type="number" step={0.05} min={0} max={100} value={trig.threshold}
                          onChange={(e) => updateTrigger(idx, ti, { threshold: +e.target.value })}
                          className="w-[60px] py-1 px-1.5 bg-bg2 border border-border-c rounded-[5px] text-theme-text text-[11px]"
                        />
                      </div>
                      <button
                        onClick={() => removeTrigger(idx, ti)}
                        className="bg-transparent border-none text-theme-red text-[13px] cursor-pointer ml-auto"
                      >×</button>
                    </div>
                  ))}
                  {!(config.autoTriggers?.length) && (
                    <div className="text-[11px] text-theme-faint">No triggers — manual selection only (pre-match config choice).</div>
                  )}
                </div>

                {/* Reset Condition */}
                <div>
                  <label className="block text-[11px] text-theme-muted mb-1.5">Reset Condition (optional)</label>
                  <div className="flex gap-2 items-center">
                    <SearchableSelect
                      value={config.resetCondition?.type ?? ""}
                      options={RESET_TYPES.map((t) => ({ value: t, label: t }))}
                      onChange={(v) => {
                        if (!v) { update(idx, { resetCondition: undefined }); return; }
                        update(idx, { resetCondition: { type: v as ConfigResetCondition["type"], threshold: 0.5 } });
                      }}
                      emptyLabel="— none —"
                      style={{ background: "var(--bg2)", border: "1px solid var(--border)", borderRadius: 6, color: "var(--text)", fontSize: 11 }}
                    />
                    {config.resetCondition && (
                      <input
                        type="number" step={0.05} min={0} value={config.resetCondition.threshold}
                        onChange={(e) => update(idx, { resetCondition: { ...config.resetCondition!, threshold: +e.target.value } })}
                        className="w-[70px] py-[5px] px-2 bg-bg2 border border-border-c rounded-md text-theme-text text-[11px]"
                        placeholder="threshold"
                      />
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
