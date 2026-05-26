// JSON editor + horizontal swimlane timeline for BehaviorRef[] steps.

import { useState, useEffect } from "react";
import { C } from "@/styles/theme";
import type { BehaviorRef } from "@/types/comboTask";

const ACTION_COLORS: Record<string, string> = {
  factor: "#f97316",
  movement: "#3b82f6",
  arena: "#06b6d4",
  spin: "#f97316",
  timing: "#eab308",
  flow: "#14b8a6",
};

function colorFor(behaviorId: string): string {
  const prefix = behaviorId.split(".")[0];
  return ACTION_COLORS[prefix] ?? C.muted;
}

interface Props {
  steps: BehaviorRef[];
  onChange: (steps: BehaviorRef[]) => void;
}

export function RawScriptPanel({ steps, onChange }: Props) {
  const [tab, setTab] = useState<"json" | "timeline">("json");
  const [raw, setRaw] = useState(() => JSON.stringify(steps, null, 2));
  const [jsonError, setJsonError] = useState<string | null>(null);

  // Sync raw when steps change externally (from BlockCanvas)
  useEffect(() => {
    setRaw(JSON.stringify(steps, null, 2));
    setJsonError(null);
  }, [steps]);

  function handleChange(text: string) {
    setRaw(text);
    try {
      const parsed = JSON.parse(text);
      if (!Array.isArray(parsed)) throw new Error("Must be an array");
      setJsonError(null);
      onChange(parsed as BehaviorRef[]);
    } catch (e: unknown) {
      setJsonError((e as Error).message);
    }
  }

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <div className="flex border-b border-border-c">
        {(["json", "timeline"] as const).map(t => (
          <button
            key={t}
            type="button"
            onClick={() => setTab(t)}
            className={[
              "px-4 py-2 text-[12px] bg-transparent border-none border-b-2 cursor-pointer uppercase tracking-[0.04em]",
              tab === t
                ? "font-bold border-b-theme-blue text-theme-text"
                : "font-normal border-b-transparent text-theme-faint",
            ].join(" ")}
            style={{ borderBottom: tab === t ? "2px solid var(--blue)" : "2px solid transparent" }}
          >
            {t === "json" ? "Raw JSON" : "Timeline"}
          </button>
        ))}
        {jsonError && (
          <span className="ml-auto px-3 py-2 text-[11px] text-theme-red">{jsonError}</span>
        )}
      </div>

      {tab === "json" && (
        <textarea
          className={[
            "flex-1 bg-bg3 border-none font-mono text-[12px] p-3 resize-none outline-none",
            jsonError ? "text-[#fca5a5]" : "text-theme-text",
          ].join(" ")}
          value={raw}
          onChange={e => handleChange(e.target.value)}
          spellCheck={false}
        />
      )}

      {tab === "timeline" && (
        <div className="flex-1 overflow-y-auto p-3">
          {steps.length === 0 && (
            <div className="text-theme-faint text-[12px]">No steps yet.</div>
          )}
          <div className="flex flex-col gap-[6px]">
            {steps.map((step, i) => {
              const color = colorFor(step.behaviorId);
              const durationTicks = (step.params as Record<string, unknown>)?.durationTicks as number | undefined;
              const widthPx = Math.max(80, Math.min(240, (durationTicks ?? 30) * 3));
              return (
                <div key={i} className="flex items-center gap-2">
                  <span className="w-6 text-[11px] text-theme-faint text-right">{i + 1}</span>
                  <div
                    style={{
                      width: widthPx,
                      background: color + "33",
                      border: `1px solid ${color}66`,
                      borderRadius: 6,
                      padding: "4px 8px",
                      fontSize: 11,
                      color,
                    }}
                    className="font-mono whitespace-nowrap overflow-hidden text-ellipsis"
                    title={step.behaviorId}
                  >
                    {step.parallel && <span className="mr-1 opacity-70">∥</span>}
                    {step.behaviorId.split(".").pop()}
                    {durationTicks !== undefined && <span className="opacity-60 ml-1">{durationTicks}t</span>}
                  </div>
                  {step.delayTicks && step.delayTicks > 0 && (
                    <span className="text-[10px] text-theme-faint">after {step.delayTicks}t</span>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
