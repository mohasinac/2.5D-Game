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
import { C, alpha } from "@/styles/theme";
import type { PartConfiguration, ConfigTrigger, ConfigResetCondition } from "@/types/beybladeSystem";
import { SearchableSelect } from "@/components/admin/SearchableSelect";

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

interface Props<T> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  value: PartConfiguration<any>[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onChange: (configs: PartConfiguration<any>[]) => void;
}

export function PartConfigurationsEditor<T>({ value, onChange }: Props<T>) {
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
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
        <div style={{ fontSize: 12, color: C.muted }}>Configurations ({value.length})</div>
        <button
          onClick={addConfig}
          style={{
            padding: "4px 12px", background: C.bg3, border: `1px solid ${C.border}`,
            borderRadius: 6, fontSize: 11, color: C.muted, cursor: "pointer",
          }}
        >
          + Add Config
        </button>
      </div>

      {value.length === 0 && (
        <div style={{ fontSize: 12, color: C.faint, padding: "8px 0" }}>
          No configurations. Parts with only one mode don't need configs.
          Add configs for swappable modes like "Flat / Sharp / Semi-Flat" on tip parts.
        </div>
      )}

      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {value.map((config, idx) => (
          <div
            key={idx}
            style={{
              border: `1px solid ${expanded === idx ? alpha(C.blue, 0.33) : C.border}`,
              borderRadius: 9, overflow: "hidden",
            }}
          >
            {/* Header */}
            <div
              style={{
                display: "flex", alignItems: "center", gap: 10, padding: "10px 14px",
                background: expanded === idx ? alpha(C.blue, 0.06) : C.bg2, cursor: "pointer",
              }}
              onClick={() => setExpanded(expanded === idx ? null : idx)}
            >
              <span style={{ flex: 1, fontSize: 13, fontWeight: 600, color: config.name ? C.text : C.faint }}>
                {config.name || `Config ${idx + 1} (unnamed)`}
              </span>
              {config.autoTriggers?.length ? (
                <span style={{ fontSize: 10, color: C.yellow, background: alpha(C.yellow, 0.09), padding: "2px 6px", borderRadius: 4 }}>
                  {config.autoTriggers.length} trigger{config.autoTriggers.length > 1 ? "s" : ""}
                </span>
              ) : null}
              <span style={{ fontSize: 11, color: C.faint }}>{expanded === idx ? "▾" : "▸"}</span>
              <button
                onClick={(e) => { e.stopPropagation(); remove(idx); }}
                style={{ background: "none", border: "none", color: C.red, fontSize: 14, cursor: "pointer" }}
              >×</button>
            </div>

            {/* Body */}
            {expanded === idx && (
              <div style={{ padding: "14px 16px", background: C.bg1, display: "flex", flexDirection: "column", gap: 14 }}>
                {/* Name */}
                <div>
                  <label style={{ display: "block", fontSize: 11, color: C.muted, marginBottom: 4 }}>Config Name *</label>
                  <input
                    value={config.name}
                    onChange={(e) => update(idx, { name: e.target.value })}
                    placeholder='e.g. "Sharp", "Flat", "Locked"'
                    style={{ width: "100%", padding: "7px 10px", background: C.bg2, border: `1px solid ${C.border}`, borderRadius: 6, color: C.text, fontSize: 13, boxSizing: "border-box" }}
                  />
                </div>

                {/* Description */}
                <div>
                  <label style={{ display: "block", fontSize: 11, color: C.muted, marginBottom: 4 }}>Description</label>
                  <input
                    value={config.description}
                    onChange={(e) => update(idx, { description: e.target.value })}
                    placeholder="Short description of this mode"
                    style={{ width: "100%", padding: "7px 10px", background: C.bg2, border: `1px solid ${C.border}`, borderRadius: 6, color: C.text, fontSize: 13, boxSizing: "border-box" }}
                  />
                </div>

                {/* Display Name (HUD label) + Player Switchable toggle */}
                <div style={{ display: "grid", gridTemplateColumns: "1fr auto", gap: 10, alignItems: "end" }}>
                  <div>
                    <label style={{ display: "block", fontSize: 11, color: C.muted, marginBottom: 4 }}>
                      Display Name (shown in in-game PartModesHUD)
                    </label>
                    <input
                      value={config.displayName ?? ""}
                      onChange={(e) => update(idx, { displayName: e.target.value || undefined })}
                      placeholder={config.name || "Defaults to Config Name"}
                      style={{ width: "100%", padding: "7px 10px", background: C.bg2, border: `1px solid ${C.border}`, borderRadius: 6, color: C.text, fontSize: 13, boxSizing: "border-box" }}
                    />
                  </div>
                  <label style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, color: C.muted, paddingBottom: 8 }}>
                    <input
                      type="checkbox"
                      checked={config.playerSwitchable === true}
                      onChange={(e) => update(idx, { playerSwitchable: e.target.checked || undefined })}
                    />
                    Player-switchable
                  </label>
                </div>

                {/* Overrides JSON */}
                <div>
                  <label style={{ display: "block", fontSize: 11, color: C.muted, marginBottom: 4 }}>
                    Overrides (JSON — partial part fields)
                  </label>
                  <textarea
                    defaultValue={JSON.stringify(config.overrides, null, 2)}
                    onBlur={(e) => updateOverridesJSON(idx, e.target.value)}
                    rows={5}
                    style={{
                      width: "100%", padding: "8px 10px", background: C.bg2,
                      border: `1px solid ${overrideError[idx] ? C.red : C.border}`,
                      borderRadius: 6, color: C.text, fontSize: 11,
                      fontFamily: "monospace", resize: "vertical", boxSizing: "border-box",
                    }}
                  />
                  {overrideError[idx] && (
                    <div style={{ fontSize: 11, color: C.red, marginTop: 3 }}>{overrideError[idx]}</div>
                  )}
                  <div style={{ fontSize: 10, color: C.faint, marginTop: 3 }}>
                    Only changed fields are needed. E.g. for a tip: {`{"tipShape":"sharp","gripFactor":0.1}`}
                  </div>
                </div>

                {/* Auto Triggers */}
                <div>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 6 }}>
                    <label style={{ fontSize: 11, color: C.muted }}>Auto Triggers</label>
                    <button
                      onClick={() => addTrigger(idx)}
                      style={{ padding: "3px 10px", background: C.bg3, border: `1px solid ${C.border}`, borderRadius: 5, fontSize: 10, color: C.muted, cursor: "pointer" }}
                    >
                      + Trigger
                    </button>
                  </div>
                  {(config.autoTriggers ?? []).map((trig, ti) => (
                    <div key={ti} style={{ background: C.bg3, borderRadius: 7, padding: "8px 10px", marginBottom: 6, display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
                      <SearchableSelect
                        value={trig.type}
                        options={TRIGGER_TYPES.map((t) => ({ value: t, label: t }))}
                        onChange={(v) => updateTrigger(idx, ti, { type: v as ConfigTrigger["type"] })}
                        style={{ background: C.bg2, border: `1px solid ${C.border}`, borderRadius: 5, color: C.text, fontSize: 11 }}
                      />
                      <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                        <span style={{ fontSize: 10, color: C.muted }}>threshold</span>
                        <input
                          type="number" step={0.05} min={0} max={100} value={trig.threshold}
                          onChange={(e) => updateTrigger(idx, ti, { threshold: +e.target.value })}
                          style={{ width: 60, padding: "4px 6px", background: C.bg2, border: `1px solid ${C.border}`, borderRadius: 5, color: C.text, fontSize: 11 }}
                        />
                      </div>
                      <button
                        onClick={() => removeTrigger(idx, ti)}
                        style={{ background: "none", border: "none", color: C.red, fontSize: 13, cursor: "pointer", marginLeft: "auto" }}
                      >×</button>
                    </div>
                  ))}
                  {!(config.autoTriggers?.length) && (
                    <div style={{ fontSize: 11, color: C.faint }}>No triggers — manual selection only (pre-match config choice).</div>
                  )}
                </div>

                {/* Reset Condition */}
                <div>
                  <label style={{ display: "block", fontSize: 11, color: C.muted, marginBottom: 6 }}>Reset Condition (optional)</label>
                  <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                    <SearchableSelect
                      value={config.resetCondition?.type ?? ""}
                      options={RESET_TYPES.map((t) => ({ value: t, label: t }))}
                      onChange={(v) => {
                        if (!v) { update(idx, { resetCondition: undefined }); return; }
                        update(idx, { resetCondition: { type: v as ConfigResetCondition["type"], threshold: 0.5 } });
                      }}
                      emptyLabel="— none —"
                      style={{ background: C.bg2, border: `1px solid ${C.border}`, borderRadius: 6, color: C.text, fontSize: 11 }}
                    />
                    {config.resetCondition && (
                      <input
                        type="number" step={0.05} min={0} value={config.resetCondition.threshold}
                        onChange={(e) => update(idx, { resetCondition: { ...config.resetCondition!, threshold: +e.target.value } })}
                        style={{ width: 70, padding: "5px 8px", background: C.bg2, border: `1px solid ${C.border}`, borderRadius: 6, color: C.text, fontSize: 11 }}
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
