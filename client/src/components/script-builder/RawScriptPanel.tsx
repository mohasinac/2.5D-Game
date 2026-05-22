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
    <div style={{ display: "flex", flexDirection: "column", height: "100%", overflow: "hidden" }}>
      <div style={{ display: "flex", borderBottom: `1px solid ${C.border}` }}>
        {(["json", "timeline"] as const).map(t => (
          <button
            key={t}
            type="button"
            onClick={() => setTab(t)}
            style={{
              padding: "8px 16px",
              fontSize: 12,
              fontWeight: tab === t ? 700 : 400,
              background: "transparent",
              border: "none",
              borderBottom: tab === t ? `2px solid ${C.blue}` : "2px solid transparent",
              color: tab === t ? C.text : C.faint,
              cursor: "pointer",
              textTransform: "uppercase",
              letterSpacing: "0.04em",
            }}
          >
            {t === "json" ? "Raw JSON" : "Timeline"}
          </button>
        ))}
        {jsonError && (
          <span style={{ marginLeft: "auto", padding: "8px 12px", fontSize: 11, color: C.red }}>{jsonError}</span>
        )}
      </div>

      {tab === "json" && (
        <textarea
          style={{
            flex: 1,
            background: "var(--bg3)",
            border: "none",
            color: jsonError ? "#fca5a5" : C.text,
            fontFamily: "monospace",
            fontSize: 12,
            padding: 12,
            resize: "none",
            outline: "none",
          }}
          value={raw}
          onChange={e => handleChange(e.target.value)}
          spellCheck={false}
        />
      )}

      {tab === "timeline" && (
        <div style={{ flex: 1, overflowY: "auto", padding: 12 }}>
          {steps.length === 0 && (
            <div style={{ color: C.faint, fontSize: 12 }}>No steps yet.</div>
          )}
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            {steps.map((step, i) => {
              const color = colorFor(step.behaviorId);
              const durationTicks = (step.params as Record<string, unknown>)?.durationTicks as number | undefined;
              const widthPx = Math.max(80, Math.min(240, (durationTicks ?? 30) * 3));
              return (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <span style={{ width: 24, fontSize: 11, color: C.faint, textAlign: "right" }}>{i + 1}</span>
                  <div
                    style={{
                      width: widthPx,
                      background: color + "33",
                      border: `1px solid ${color}66`,
                      borderRadius: 6,
                      padding: "4px 8px",
                      fontSize: 11,
                      color,
                      fontFamily: "monospace",
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}
                    title={step.behaviorId}
                  >
                    {step.parallel && <span style={{ marginRight: 4, opacity: 0.7 }}>∥</span>}
                    {step.behaviorId.split(".").pop()}
                    {durationTicks !== undefined && <span style={{ opacity: 0.6, marginLeft: 4 }}>{durationTicks}t</span>}
                  </div>
                  {step.delayTicks && step.delayTicks > 0 && (
                    <span style={{ fontSize: 10, color: C.faint }}>after {step.delayTicks}t</span>
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
