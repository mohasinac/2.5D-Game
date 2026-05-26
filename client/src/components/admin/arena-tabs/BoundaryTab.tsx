// Z10a: Boundary tab — Shrink Config panel (arena battle-royale ring).
// V6: Added shrinkRateCmPerSec + minRadiusCm alternative input fields.

import { C } from "@/styles/theme";
import { CollapsibleSection } from "@/components/admin/CollapsibleSection";
import type { ArenaConfig } from "@/types/arenaConfigNew";

interface Props {
  config: ArenaConfig;
  onChange: (patch: Partial<ArenaConfig>) => void;
}

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-2 mb-2">
      <label className="text-xs text-muted min-w-[160px]">{label}</label>
      {children}
    </div>
  );
}

export default function BoundaryTab({ config, onChange }: Props) {
  const shrink = config.shrink;

  return (
    <CollapsibleSection title="Boundary" storageKey="arena-boundary-main" defaultOpen={true}>
    <div className="flex flex-col gap-4">
      {/* Shrink Config */}
      <div className="bg-bg1 border border-border rounded-xl p-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="m-0 text-sm font-semibold text-text">Shrinking Ring</h3>
          <input
            type="checkbox"
            checked={!!shrink}
            onChange={e => onChange({ shrink: e.target.checked ? { startMs: 60000, endMs: 180000, minRadiusFraction: 0.4, damageRatePerTick: 2 } : undefined })}
          />
        </div>

        {shrink && (
          <>
            <Row label="Enable shrink">
              <input
                type="checkbox"
                checked={shrink.enabled ?? true}
                onChange={e => onChange({ shrink: { ...shrink, enabled: e.target.checked } })}
              />
            </Row>
            <Row label="Shrink rate (cm/s)">
              <input
                type="number"
                placeholder="e.g. 0.5"
                value={shrink.shrinkRateCmPerSec ?? ""}
                min={0.01}
                step={0.1}
                onChange={e => onChange({ shrink: { ...shrink, shrinkRateCmPerSec: e.target.value ? Number(e.target.value) : undefined } })}
                className="w-[100px] bg-bg2 border border-border text-text rounded-md py-1 px-2 text-xs"
              />
              <span className="text-[11px] text-muted">cm/s</span>
            </Row>
            <Row label="Min radius (cm)">
              <input
                type="number"
                placeholder="e.g. 100"
                value={shrink.minRadiusCm ?? ""}
                min={10}
                step={5}
                onChange={e => onChange({ shrink: { ...shrink, minRadiusCm: e.target.value ? Number(e.target.value) : undefined } })}
                className="w-[100px] bg-bg2 border border-border text-text rounded-md py-1 px-2 text-xs"
              />
              <span className="text-[11px] text-muted">cm (overrides fraction)</span>
            </Row>
            <Row label="Start (ms after match)">
              <input
                type="number"
                value={shrink.startMs}
                min={0}
                step={5000}
                onChange={e => onChange({ shrink: { ...shrink, startMs: Number(e.target.value) } })}
                className="w-[100px] bg-bg2 border border-border text-text rounded-md py-1 px-2 text-xs"
              />
              <span className="text-[11px] text-muted">{(shrink.startMs / 1000).toFixed(0)}s</span>
            </Row>

            <Row label="End (ms)">
              <input
                type="number"
                value={shrink.endMs}
                min={shrink.startMs + 5000}
                step={5000}
                onChange={e => onChange({ shrink: { ...shrink, endMs: Number(e.target.value) } })}
                className="w-[100px] bg-bg2 border border-border text-text rounded-md py-1 px-2 text-xs"
              />
              <span className="text-[11px] text-muted">{(shrink.endMs / 1000).toFixed(0)}s</span>
            </Row>

            <Row label="Min radius fraction">
              <input
                type="range"
                min={0.1}
                max={0.9}
                step={0.05}
                value={shrink.minRadiusFraction}
                onChange={e => onChange({ shrink: { ...shrink, minRadiusFraction: Number(e.target.value) } })}
                className="w-[120px]"
              />
              <span className="text-[11px] text-muted">{(shrink.minRadiusFraction * 100).toFixed(0)}%</span>
            </Row>

            <Row label="Damage per tick">
              <input
                type="number"
                value={shrink.damageRatePerTick ?? 2}
                min={0}
                max={20}
                step={0.5}
                onChange={e => onChange({ shrink: { ...shrink, damageRatePerTick: Number(e.target.value) } })}
                className="w-20 bg-bg2 border border-border text-text rounded-md py-1 px-2 text-xs"
              />
            </Row>

            <div className="bg-bg2 border border-border rounded-lg p-2.5 text-[11px] text-muted mt-2">
              Ring starts shrinking at <strong className="text-text">{(shrink.startMs / 1000).toFixed(0)}s</strong>,
              reaches {(shrink.minRadiusFraction * 100).toFixed(0)}% size by <strong className="text-text">{(shrink.endMs / 1000).toFixed(0)}s</strong>.
              Beys outside take <strong className="text-text">{shrink.damageRatePerTick ?? 2} HP/tick</strong>.
            </div>
          </>
        )}
      </div>
    </div>
    </CollapsibleSection>
  );
}
