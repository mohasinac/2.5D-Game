import { ArenaFeatureSection } from "./ArenaFeatureSection";
import type { ArenaConfig, SwitchConfig, SwitchTarget, SwitchAction } from "@/types/arenaConfigNew";
import { PX_PER_CM_BASE } from "@/constants/units";
import RotationBlockEditor from "./RotationBlockEditor";
import { cn } from "@/lib/cn";

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
      className="w-[90px] bg-bg1 border border-border-c text-theme-text rounded-md py-1 px-2 text-xs"
    />
  );
}

function SliderRow({ label, value, min, max, step, onChange }: { label: string; value: number; min: number; max: number; step: number; onChange: (n: number) => void }) {
  return (
    <div>
      <div className="flex justify-between text-[11px] text-theme-faint mb-0.5">
        <span>{label}</span>
        <span className="text-theme-text font-mono">{value}</span>
      </div>
      <input type="range" min={min} max={max} step={step} value={value}
        onChange={e => onChange(+e.target.value)}
        className="w-full"
      />
    </div>
  );
}

export default function SwitchesTab({ config, onChange }: Props) {
  const items: SwitchConfig[] = (config as any).switches ?? [];

  const add = () => {
    if (items.length >= 12) return;
    const sw: SwitchConfig = {
      id: makeId(), x: 0, y: 0, iconKey: "switch",
      switch: { targets: [], cooldownMs: 2000 },
    };
    onChange({ switches: [...items, sw] } as any);
  };

  const remove = (id: string) => onChange({ switches: items.filter(s => s.id !== id) } as any);

  const update = (id: string, patch: Partial<SwitchConfig>) =>
    onChange({ switches: items.map(s => s.id === id ? { ...s, ...patch } : s) } as any);

  const updateSwitch = (id: string, patch: Partial<SwitchConfig["switch"]>) =>
    onChange({ switches: items.map(s => s.id === id ? { ...s, switch: { ...s.switch, ...patch } } : s) } as any);

  const addTarget = (sw: SwitchConfig) => {
    const t: SwitchTarget & { _key: number } = {
      _key: makeTargetId(), targetType: "obstacle", targetId: "", action: { kind: "toggle" },
    } as any;
    updateSwitch(sw.id, { targets: [...sw.switch.targets, t] });
  };

  const removeTarget = (sw: SwitchConfig, idx: number) =>
    updateSwitch(sw.id, { targets: sw.switch.targets.filter((_, i) => i !== idx) });

  const patchTarget = (sw: SwitchConfig, idx: number, patch: Partial<SwitchTarget>) =>
    updateSwitch(sw.id, { targets: sw.switch.targets.map((t, i) => i === idx ? { ...t, ...patch } : t) });

  const patchAction = (sw: SwitchConfig, idx: number, actionPatch: Partial<SwitchAction>) => {
    const targets = sw.switch.targets.map((t, i) => {
      if (i !== idx) return t;
      return { ...t, action: { ...t.action, ...actionPatch } as SwitchAction };
    });
    updateSwitch(sw.id, { targets });
  };

  const setActionKind = (sw: SwitchConfig, idx: number, kind: SwitchAction["kind"]) => {
    const defaults: Record<string, SwitchAction> = {
      toggle: { kind: "toggle" }, "set-on": { kind: "set-on" }, "set-off": { kind: "set-off" },
      pulse: { kind: "pulse", durationMs: 1000 }, "rotation-on": { kind: "rotation-on" },
      "rotation-off": { kind: "rotation-off" }, chain: { kind: "chain", nextSwitchId: "" },
    };
    patchTarget(sw, idx, { action: defaults[kind] ?? { kind: "toggle" } });
  };

  return (
    <ArenaFeatureSection
      title="Switches"
      storageKey="arena-switches-list"
      items={items}
      maxItems={12}
      onAdd={add}
      addLabel="Add Switch"
      onRemove={(id) => remove(id as string)}
      emptyIcon="🔀"
      emptyText="No switches yet. Switches toggle other arena features when a beyblade collides with them."
      renderItemHeader={(_sw, idx) => <>🔀 Switch #{idx + 1}</>}
      renderItemBody={(sw) => (
        <div className="flex flex-col gap-2.5">
          {/* Identity */}
          <div className="grid grid-cols-2 gap-2.5">
            <div>
              <label className="block text-[11px] text-theme-faint mb-1">Switch ID</label>
              <input type="text" value={sw.id}
                onChange={e => update(sw.id, { id: e.target.value })}
                placeholder="e.g. sw1"
                className="w-full bg-bg2 border border-border-c text-theme-text rounded-md py-1 px-2 text-xs"
              />
            </div>
            <div>
              <label className="block text-[11px] text-theme-faint mb-1">Icon Key</label>
              <input type="text" value={sw.iconKey}
                onChange={e => update(sw.id, { iconKey: e.target.value })}
                placeholder="e.g. switch"
                className="w-full bg-bg2 border border-border-c text-theme-text rounded-md py-1 px-2 text-xs"
              />
            </div>
          </div>

          {/* Position */}
          <div className="grid grid-cols-2 gap-2.5">
            <SliderRow label="X (cm)" value={Math.round(sw.x / PX_PER_CM_BASE * 10) / 10} min={-21} max={21} step={0.5} onChange={v => update(sw.id, { x: Math.round(v * PX_PER_CM_BASE) })} />
            <SliderRow label="Y (cm)" value={Math.round(sw.y / PX_PER_CM_BASE * 10) / 10} min={-21} max={21} step={0.5} onChange={v => update(sw.id, { y: Math.round(v * PX_PER_CM_BASE) })} />
          </div>

          {/* Timing */}
          <div className="grid grid-cols-4 gap-2.5">
            <div>
              <label className="block text-[11px] text-theme-faint mb-1">Cooldown (ms)</label>
              {numInput(sw.switch.cooldownMs, 2000, v => updateSwitch(sw.id, { cooldownMs: v }), 100)}
            </div>
            <div>
              <label className="block text-[11px] text-theme-faint mb-1">Auto-Reset (ms)</label>
              {numInput(sw.switch.autoReset, 0, v => updateSwitch(sw.id, { autoReset: v || undefined }), 100)}
            </div>
            <div>
              <label className="block text-[11px] text-theme-faint mb-1">Min Spin (%)</label>
              {numInput(sw.switch.requiresMinSpin, 0, v => updateSwitch(sw.id, { requiresMinSpin: v || undefined }), 5)}
            </div>
            <div>
              <label className="block text-[11px] text-theme-faint mb-1">Trigger Count</label>
              {numInput(sw.switch.triggerCountToActivate, 1, v => updateSwitch(sw.id, { triggerCountToActivate: v < 2 ? undefined : v }), 1)}
            </div>
          </div>

          {/* Targets */}
          <div>
            <div className="flex justify-between items-center mb-1.5">
              <label className="text-[11px] font-semibold text-theme-muted">Targets ({sw.switch.targets.length})</label>
              <button
                onClick={() => addTarget(sw)}
                className="text-[11px] py-0.5 px-2 bg-theme-purple text-white border-none rounded cursor-pointer"
              >
                + Target
              </button>
            </div>
            {sw.switch.targets.length === 0 && (
              <div className="text-[11px] text-theme-faint py-2">No targets — add one above.</div>
            )}
            {sw.switch.targets.map((t, ti) => (
              <div key={(t as any)._key ?? ti} className="bg-bg2 rounded-lg p-2.5 mb-1.5 border border-border-c">
                <div className="grid gap-2 items-end grid-cols-[1fr_1fr_auto]">
                  <div>
                    <label className="block text-[10px] text-theme-faint mb-0.5">Target Type</label>
                    <select value={t.targetType}
                      onChange={e => patchTarget(sw, ti, { targetType: e.target.value as SwitchTarget["targetType"] })}
                      className="w-full bg-bg1 border border-border-c text-theme-text rounded py-1 px-1.5 text-[11px]"
                    >
                      {TARGET_TYPES.map(tt => <option key={tt} value={tt}>{tt}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-[10px] text-theme-faint mb-0.5">Target ID</label>
                    <input type="text" value={t.targetId}
                      onChange={e => patchTarget(sw, ti, { targetId: e.target.value })}
                      placeholder="e.g. obs-1"
                      className="w-full bg-bg1 border border-border-c text-theme-text rounded py-1 px-1.5 text-[11px]"
                    />
                  </div>
                  <button onClick={() => removeTarget(sw, ti)} className="text-theme-red bg-transparent border-none text-[11px] cursor-pointer pb-0.5">✕</button>
                </div>
                <div className="mt-2 flex gap-1.5 flex-wrap items-center">
                  <label className="text-[10px] text-theme-faint min-w-[40px]">Action</label>
                  <div className="flex gap-[3px] flex-wrap">
                    {ACTION_KINDS.map(k => (
                      <button key={k} onClick={() => setActionKind(sw, ti, k)}
                        className={cn(
                          "py-0.5 px-1.5 rounded text-[10px] cursor-pointer border transition-colors",
                          t.action.kind === k
                            ? "bg-theme-purple text-white border-theme-purple"
                            : "bg-transparent text-theme-muted border-border-c hover:border-theme-purple",
                        )}>
                        {k}
                      </button>
                    ))}
                  </div>
                  {t.action.kind === "pulse" && (
                    <div className="flex items-center gap-1.5">
                      <label className="text-[10px] text-theme-faint">Duration (ms)</label>
                      {numInput((t.action as any).durationMs, 1000, v => patchAction(sw, ti, { durationMs: v } as any), 100)}
                    </div>
                  )}
                  {t.action.kind === "chain" && (
                    <div className="flex items-center gap-1.5">
                      <label className="text-[10px] text-theme-faint">Next Switch ID</label>
                      <input type="text" value={(t.action as any).nextSwitchId ?? ""}
                        onChange={e => patchAction(sw, ti, { nextSwitchId: e.target.value } as any)}
                        placeholder="sw2"
                        className="w-20 bg-bg1 border border-border-c text-theme-text rounded py-0.5 px-1.5 text-[10px]"
                      />
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Shape */}
          <div>
            <label className="block text-[11px] text-theme-faint mb-1">
              Shape <span className="text-theme-muted font-normal ml-1.5">{sw.shape ? `— ${sw.shape.kind}` : "— default"}</span>
            </label>
            <div className="flex gap-1 flex-wrap">
              {[undefined, "circle", "rectangle"].map(k => (
                <button key={k ?? "none"} onClick={() => {
                  if (k === undefined) { update(sw.id, { shape: undefined }); return; }
                  if (k === "circle") update(sw.id, { shape: { kind: "circle", radiusCm: 10 } });
                  if (k === "rectangle") update(sw.id, { shape: { kind: "rectangle", widthCm: 20, heightCm: 20 } });
                }}
                  className={cn(
                    "py-0.5 px-2 rounded text-[11px] cursor-pointer border transition-colors",
                    (sw.shape?.kind ?? "none") === (k ?? "none")
                      ? "bg-theme-blue text-white border-theme-blue"
                      : "bg-transparent text-theme-muted border-border-c hover:border-theme-blue",
                  )}>
                  {k ?? "none"}
                </button>
              ))}
            </div>
            {sw.shape?.kind === "circle" && (
              <div className="flex items-center gap-2 mt-2">
                <label className="text-[11px] text-theme-faint min-w-[70px]">Radius (cm)</label>
                {numInput((sw.shape as any).radiusCm, 10, v => update(sw.id, { shape: { kind: "circle", radiusCm: v } }), 1)}
              </div>
            )}
            {sw.shape?.kind === "rectangle" && (
              <div className="flex gap-4 mt-2">
                <div className="flex items-center gap-2">
                  <label className="text-[11px] text-theme-faint min-w-[55px]">Width (cm)</label>
                  {numInput((sw.shape as any).widthCm, 20, v => update(sw.id, { shape: { ...(sw.shape as any), widthCm: v } }), 1)}
                </div>
                <div className="flex items-center gap-2">
                  <label className="text-[11px] text-theme-faint min-w-[58px]">Height (cm)</label>
                  {numInput((sw.shape as any).heightCm, 20, v => update(sw.id, { shape: { ...(sw.shape as any), heightCm: v } }), 1)}
                </div>
              </div>
            )}
          </div>

          <RotationBlockEditor
            value={sw.rotation}
            onChange={v => update(sw.id, { rotation: v })}
            label="Rotation"
          />
        </div>
      )}
    />
  );
}
