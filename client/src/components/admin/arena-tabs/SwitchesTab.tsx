import { C } from "@/styles/theme";
import { CollapsibleSection } from "@/components/admin/CollapsibleSection";
import type { ArenaConfig, SwitchConfig, SwitchTarget, SwitchAction } from "@/types/arenaConfigNew";
import { PX_PER_CM_BASE } from "@/constants/units";
import RotationBlockEditor from "./RotationBlockEditor";

interface Props {
  config: ArenaConfig;
  onChange: (updated: Partial<ArenaConfig>) => void;
}

function makeId() { return `sw_${Date.now() % 1000000}`; }
function makeTargetId() { return Date.now() % 1000000; }

const TARGET_TYPES: SwitchTarget["targetType"][] = [
  "obstacle", "water", "portal", "pit", "ridge",
  "zone", "trigger-zone", "spin-zone", "speedline",
  "gravity-hole", "turret", "switch",
];

const ACTION_KINDS: SwitchAction["kind"][] = [
  "toggle", "set-on", "set-off", "pulse", "rotation-on", "rotation-off", "chain",
];

function numInput(val: number | undefined, def: number, onChange: (n: number) => void, step = 1) {
  return (
    <input
      type="number"
      value={val ?? def}
      step={step}
      onChange={e => onChange(Number(e.target.value))}
      style={{ width: 90, background: C.bg1, border: `1px solid ${C.border}`, color: C.text, borderRadius: 6, padding: "4px 8px", fontSize: 12 }}
    />
  );
}

function SliderRow({ label, value, min, max, step, onChange }: { label: string; value: number; min: number; max: number; step: number; onChange: (n: number) => void }) {
  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, color: C.faint, marginBottom: 2 }}>
        <span>{label}</span>
        <span style={{ color: C.text, fontFamily: "monospace" }}>{value}</span>
      </div>
      <input type="range" min={min} max={max} step={step} value={value}
        onChange={e => onChange(+e.target.value)}
        style={{ width: "100%", accentColor: C.purple }}
      />
    </div>
  );
}

export default function SwitchesTab({ config, onChange }: Props) {
  const items: SwitchConfig[] = (config as any).switches ?? [];

  const add = () => {
    if (items.length >= 12) return;
    const sw: SwitchConfig = {
      id: makeId(),
      x: 0,
      y: 0,
      iconKey: "switch",
      switch: { targets: [], cooldownMs: 2000 },
    };
    onChange({ switches: [...items, sw] } as any);
  };

  const remove = (id: string) =>
    onChange({ switches: items.filter(s => s.id !== id) } as any);

  const update = (id: string, patch: Partial<SwitchConfig>) =>
    onChange({ switches: items.map(s => s.id === id ? { ...s, ...patch } : s) } as any);

  const updateSwitch = (id: string, patch: Partial<SwitchConfig["switch"]>) =>
    onChange({
      switches: items.map(s => s.id === id ? { ...s, switch: { ...s.switch, ...patch } } : s),
    } as any);

  const addTarget = (sw: SwitchConfig) => {
    const t: SwitchTarget & { _key: number } = {
      _key: makeTargetId(),
      targetType: "obstacle",
      targetId: "",
      action: { kind: "toggle" },
    } as any;
    updateSwitch(sw.id, { targets: [...sw.switch.targets, t] });
  };

  const removeTarget = (sw: SwitchConfig, idx: number) =>
    updateSwitch(sw.id, { targets: sw.switch.targets.filter((_, i) => i !== idx) });

  const patchTarget = (sw: SwitchConfig, idx: number, patch: Partial<SwitchTarget>) =>
    updateSwitch(sw.id, {
      targets: sw.switch.targets.map((t, i) => i === idx ? { ...t, ...patch } : t),
    });

  const patchAction = (sw: SwitchConfig, idx: number, actionPatch: Partial<SwitchAction>) => {
    const targets = sw.switch.targets.map((t, i) => {
      if (i !== idx) return t;
      return { ...t, action: { ...t.action, ...actionPatch } as SwitchAction };
    });
    updateSwitch(sw.id, { targets });
  };

  const setActionKind = (sw: SwitchConfig, idx: number, kind: SwitchAction["kind"]) => {
    const defaults: Record<string, SwitchAction> = {
      toggle: { kind: "toggle" },
      "set-on": { kind: "set-on" },
      "set-off": { kind: "set-off" },
      pulse: { kind: "pulse", durationMs: 1000 },
      "rotation-on": { kind: "rotation-on" },
      "rotation-off": { kind: "rotation-off" },
      chain: { kind: "chain", nextSwitchId: "" },
    };
    patchTarget(sw, idx, { action: defaults[kind] ?? { kind: "toggle" } });
  };

  return (
    <CollapsibleSection title="Switches" badge={items.length} storageKey="arena-switches-list" defaultOpen={true}>
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span style={{ fontSize: 13, color: C.muted }}>{items.length} / 12 switches</span>
        <button
          onClick={add}
          disabled={items.length >= 12}
          style={{ padding: "5px 14px", background: C.purple, color: C.white, border: "none", borderRadius: 6, fontSize: 12, fontWeight: 500, cursor: "pointer", opacity: items.length >= 12 ? 0.4 : 1 }}
        >
          + Add Switch
        </button>
      </div>

      {items.length === 0 && (
        <div style={{ textAlign: "center", padding: "40px 0", color: C.faint }}>
          <div style={{ fontSize: 32, marginBottom: 8 }}>🔀</div>
          <p>No switches yet. Switches toggle other arena features when a beyblade collides with them.</p>
        </div>
      )}

      {items.map((sw, idx) => (
        <div key={sw.id} style={{ background: C.bg3, borderRadius: 12, padding: 16, border: `1px solid ${C.border}` }}>
          {/* Header */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
            <span style={{ fontSize: 13, fontWeight: 500, color: C.text }}>🔀 Switch #{idx + 1}</span>
            <button onClick={() => remove(sw.id)} style={{ color: C.red, background: "none", border: "none", fontSize: 12, cursor: "pointer" }}>Remove</button>
          </div>

          {/* Identity */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 12 }}>
            <div>
              <label style={{ display: "block", fontSize: 11, color: C.faint, marginBottom: 4 }}>Switch ID</label>
              <input
                type="text"
                value={sw.id}
                onChange={e => update(sw.id, { id: e.target.value })}
                placeholder="e.g. sw1"
                style={{ width: "100%", background: C.bg2, border: `1px solid ${C.border}`, color: C.text, borderRadius: 6, padding: "4px 8px", fontSize: 12, boxSizing: "border-box" }}
              />
            </div>
            <div>
              <label style={{ display: "block", fontSize: 11, color: C.faint, marginBottom: 4 }}>Icon Key</label>
              <input
                type="text"
                value={sw.iconKey}
                onChange={e => update(sw.id, { iconKey: e.target.value })}
                placeholder="e.g. switch"
                style={{ width: "100%", background: C.bg2, border: `1px solid ${C.border}`, color: C.text, borderRadius: 6, padding: "4px 8px", fontSize: 12, boxSizing: "border-box" }}
              />
            </div>
          </div>

          {/* Position */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 12 }}>
            <SliderRow label="X (cm from center)" value={Math.round(sw.x / PX_PER_CM_BASE * 10) / 10} min={-21} max={21} step={0.5} onChange={v => update(sw.id, { x: Math.round(v * PX_PER_CM_BASE) })} />
            <SliderRow label="Y (cm from center)" value={Math.round(sw.y / PX_PER_CM_BASE * 10) / 10} min={-21} max={21} step={0.5} onChange={v => update(sw.id, { y: Math.round(v * PX_PER_CM_BASE) })} />
          </div>

          {/* Switch timing */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: 10, marginBottom: 12 }}>
            <div>
              <label style={{ display: "block", fontSize: 11, color: C.faint, marginBottom: 4 }}>Cooldown (ms)</label>
              {numInput(sw.switch.cooldownMs, 2000, v => updateSwitch(sw.id, { cooldownMs: v }), 100)}
            </div>
            <div>
              <label style={{ display: "block", fontSize: 11, color: C.faint, marginBottom: 4 }}>Auto-Reset (ms)</label>
              {numInput(sw.switch.autoReset, 0, v => updateSwitch(sw.id, { autoReset: v || undefined }), 100)}
            </div>
            <div>
              <label style={{ display: "block", fontSize: 11, color: C.faint, marginBottom: 4 }}>Min Spin (%)</label>
              {numInput(sw.switch.requiresMinSpin, 0, v => updateSwitch(sw.id, { requiresMinSpin: v || undefined }), 5)}
            </div>
            <div>
              <label style={{ display: "block", fontSize: 11, color: C.faint, marginBottom: 4 }}>Trigger Count</label>
              {numInput(sw.switch.triggerCountToActivate, 1, v => updateSwitch(sw.id, { triggerCountToActivate: v < 2 ? undefined : v }), 1)}
            </div>
          </div>

          {/* Targets */}
          <div style={{ marginBottom: 12 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
              <label style={{ fontSize: 11, fontWeight: 600, color: C.muted }}>Targets ({sw.switch.targets.length})</label>
              <button
                onClick={() => addTarget(sw)}
                style={{ fontSize: 11, padding: "2px 8px", background: C.purple, color: C.white, border: "none", borderRadius: 5, cursor: "pointer" }}
              >
                + Target
              </button>
            </div>
            {sw.switch.targets.length === 0 && (
              <div style={{ fontSize: 11, color: C.faint, padding: "8px 0" }}>No targets — add one above.</div>
            )}
            {sw.switch.targets.map((t, ti) => (
              <div key={(t as any)._key ?? ti} style={{ background: C.bg2, borderRadius: 8, padding: 10, marginBottom: 6, border: `1px solid ${C.border}` }}>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr auto", gap: 8, alignItems: "end" }}>
                  <div>
                    <label style={{ display: "block", fontSize: 10, color: C.faint, marginBottom: 3 }}>Target Type</label>
                    <select
                      value={t.targetType}
                      onChange={e => patchTarget(sw, ti, { targetType: e.target.value as SwitchTarget["targetType"] })}
                      style={{ width: "100%", background: C.bg1, border: `1px solid ${C.border}`, color: C.text, borderRadius: 5, padding: "4px 6px", fontSize: 11 }}
                    >
                      {TARGET_TYPES.map(tt => (
                        <option key={tt} value={tt}>{tt}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label style={{ display: "block", fontSize: 10, color: C.faint, marginBottom: 3 }}>Target ID</label>
                    <input
                      type="text"
                      value={t.targetId}
                      onChange={e => patchTarget(sw, ti, { targetId: e.target.value })}
                      placeholder="e.g. obs-1"
                      style={{ width: "100%", background: C.bg1, border: `1px solid ${C.border}`, color: C.text, borderRadius: 5, padding: "4px 6px", fontSize: 11, boxSizing: "border-box" }}
                    />
                  </div>
                  <button onClick={() => removeTarget(sw, ti)} style={{ color: C.red, background: "none", border: "none", fontSize: 11, cursor: "pointer", paddingBottom: 2 }}>✕</button>
                </div>
                {/* Action */}
                <div style={{ marginTop: 8, display: "flex", gap: 6, flexWrap: "wrap", alignItems: "center" }}>
                  <label style={{ fontSize: 10, color: C.faint, minWidth: 40 }}>Action</label>
                  <div style={{ display: "flex", gap: 3, flexWrap: "wrap" }}>
                    {ACTION_KINDS.map(k => (
                      <button key={k} onClick={() => setActionKind(sw, ti, k)}
                        style={{ padding: "2px 7px", borderRadius: 5, fontSize: 10, cursor: "pointer",
                          background: t.action.kind === k ? C.purple : "transparent",
                          color: t.action.kind === k ? C.white : C.muted,
                          border: `1px solid ${t.action.kind === k ? C.purple : C.border}` }}>
                        {k}
                      </button>
                    ))}
                  </div>
                  {t.action.kind === "pulse" && (
                    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                      <label style={{ fontSize: 10, color: C.faint }}>Duration (ms)</label>
                      {numInput((t.action as any).durationMs, 1000, v => patchAction(sw, ti, { durationMs: v } as any), 100)}
                    </div>
                  )}
                  {t.action.kind === "chain" && (
                    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                      <label style={{ fontSize: 10, color: C.faint }}>Next Switch ID</label>
                      <input
                        type="text"
                        value={(t.action as any).nextSwitchId ?? ""}
                        onChange={e => patchAction(sw, ti, { nextSwitchId: e.target.value } as any)}
                        placeholder="sw2"
                        style={{ width: 80, background: C.bg1, border: `1px solid ${C.border}`, color: C.text, borderRadius: 5, padding: "3px 6px", fontSize: 10 }}
                      />
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Shape (optional) */}
          <div style={{ marginBottom: 4 }}>
            <label style={{ display: "block", fontSize: 11, color: C.faint, marginBottom: 4 }}>
              Shape (optional)
              <span style={{ color: C.muted, fontWeight: 400, marginLeft: 6 }}>
                {sw.shape ? `— ${sw.shape.kind}` : "— default (square touch area)"}
              </span>
            </label>
            <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
              {[undefined, "circle", "rectangle"] .map(k => (
                <button key={k ?? "none"} onClick={() => {
                  if (k === undefined) { update(sw.id, { shape: undefined }); return; }
                  if (k === "circle") update(sw.id, { shape: { kind: "circle", radiusCm: 10 } });
                  if (k === "rectangle") update(sw.id, { shape: { kind: "rectangle", widthCm: 20, heightCm: 20 } });
                }}
                  style={{ padding: "2px 8px", borderRadius: 5, fontSize: 11, cursor: "pointer",
                    background: (sw.shape?.kind ?? "none") === (k ?? "none") ? C.blue : "transparent",
                    color: (sw.shape?.kind ?? "none") === (k ?? "none") ? C.white : C.muted,
                    border: `1px solid ${(sw.shape?.kind ?? "none") === (k ?? "none") ? C.blue : C.border}` }}>
                  {k ?? "none"}
                </button>
              ))}
            </div>
            {sw.shape?.kind === "circle" && (
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 8 }}>
                <label style={{ fontSize: 11, color: C.faint, minWidth: 70 }}>Radius (cm)</label>
                {numInput((sw.shape as any).radiusCm, 10, v => update(sw.id, { shape: { kind: "circle", radiusCm: v } }), 1)}
              </div>
            )}
            {sw.shape?.kind === "rectangle" && (
              <div style={{ display: "flex", gap: 16, marginTop: 8 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <label style={{ fontSize: 11, color: C.faint, minWidth: 55 }}>Width (cm)</label>
                  {numInput((sw.shape as any).widthCm, 20, v => update(sw.id, { shape: { ...(sw.shape as any), widthCm: v } }), 1)}
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <label style={{ fontSize: 11, color: C.faint, minWidth: 58 }}>Height (cm)</label>
                  {numInput((sw.shape as any).heightCm, 20, v => update(sw.id, { shape: { ...(sw.shape as any), heightCm: v } }), 1)}
                </div>
              </div>
            )}
          </div>

          {/* Rotation */}
          <RotationBlockEditor
            value={sw.rotation}
            onChange={v => update(sw.id, { rotation: v })}
            label="Rotation"
          />
        </div>
      ))}
    </div>
    </CollapsibleSection>
  );
}
