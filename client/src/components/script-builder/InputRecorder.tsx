// Key capture → draft script generation.
// Records input sequences and converts them to movement BehaviorRef steps.

import { useState, useEffect, useRef } from "react";
import { C } from "@/styles/theme";
import type { BehaviorRef } from "@/types/comboTask";

const KEY_MAP: Record<string, string> = {
  ArrowLeft: "movement.dash", ArrowRight: "movement.dash",
  ArrowUp: "movement.dash", ArrowDown: "movement.dash",
  " ": "factor.boost", "a": "movement.dash", "d": "movement.dash",
  "w": "movement.dash", "s": "movement.dash",
};

const KEY_LABEL: Record<string, string> = {
  ArrowLeft: "←", ArrowRight: "→", ArrowUp: "↑", ArrowDown: "↓",
  " ": "SPACE", "a": "A", "d": "D", "w": "W", "s": "S",
};

const KEY_PARAMS: Record<string, Record<string, unknown>> = {
  ArrowLeft: { angle: Math.PI, force: 8 },
  ArrowRight: { angle: 0, force: 8 },
  ArrowUp: { angle: -Math.PI / 2, force: 8 },
  ArrowDown: { angle: Math.PI / 2, force: 8 },
  " ": { stat: "damageMultiplier", multiplier: 1.5, durationTicks: 30 },
  a: { angle: Math.PI, force: 8 },
  d: { angle: 0, force: 8 },
  w: { angle: -Math.PI / 2, force: 8 },
  s: { angle: Math.PI / 2, force: 8 },
};

interface Props {
  onCapture: (steps: BehaviorRef[]) => void;
}

interface RecordedKey { key: string; timestamp: number; }

export function InputRecorder({ onCapture }: Props) {
  const [recording, setRecording] = useState(false);
  const [keys, setKeys] = useState<RecordedKey[]>([]);
  const startTime = useRef(0);

  useEffect(() => {
    if (!recording) return;
    function onKeyDown(e: KeyboardEvent) {
      const mapped = KEY_MAP[e.key];
      if (!mapped) return;
      e.preventDefault();
      const elapsed = Date.now() - startTime.current;
      setKeys(prev => [...prev, { key: e.key, timestamp: elapsed }]);
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [recording]);

  function startRecording() {
    setKeys([]);
    startTime.current = Date.now();
    setRecording(true);
  }

  function stopRecording() {
    setRecording(false);
  }

  function generateScript() {
    let prevTs = 0;
    const steps: BehaviorRef[] = [];
    for (const { key, timestamp } of keys) {
      const behaviorId = KEY_MAP[key];
      if (!behaviorId) continue;
      const delayTicks = Math.round((timestamp - prevTs) / (1000 / 60));
      const step: BehaviorRef = {
        behaviorId,
        params: KEY_PARAMS[key] ?? {},
        ...(delayTicks > 1 ? { delayTicks } : {}),
      };
      steps.push(step);
      prevTs = timestamp;
    }
    onCapture(steps);
  }

  function clear() {
    setKeys([]);
    setRecording(false);
  }

  return (
    <div style={{ padding: 12, display: "flex", flexDirection: "column", gap: 10 }}>
      <div style={{ fontSize: 11, fontWeight: 700, color: C.muted, textTransform: "uppercase", letterSpacing: "0.05em" }}>
        Input Recorder
      </div>
      <p style={{ fontSize: 11, color: C.faint, margin: 0, lineHeight: 1.5 }}>
        Record a key sequence and convert it to BehaviorRef steps.
        Use Arrow keys or WASD / SPACE.
      </p>

      <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
        {!recording ? (
          <button
            type="button"
            onClick={startRecording}
            style={{ padding: "5px 12px", background: C.red + "22", border: `1px solid ${C.red}44`, borderRadius: 8, color: C.red, fontSize: 12, cursor: "pointer", fontWeight: 600 }}
          >
            ● Record
          </button>
        ) : (
          <button
            type="button"
            onClick={stopRecording}
            style={{ padding: "5px 12px", background: C.red + "44", border: `1px solid ${C.red}88`, borderRadius: 8, color: C.red, fontSize: 12, cursor: "pointer", fontWeight: 600, animation: "pulse 1s infinite" }}
          >
            ■ Stop
          </button>
        )}
        <button
          type="button"
          onClick={generateScript}
          disabled={keys.length === 0}
          style={{ padding: "5px 12px", background: C.green + "22", border: `1px solid ${C.green}44`, borderRadius: 8, color: C.green, fontSize: 12, cursor: keys.length === 0 ? "default" : "pointer", fontWeight: 600, opacity: keys.length === 0 ? 0.4 : 1 }}
        >
          → Add to Canvas
        </button>
        <button
          type="button"
          onClick={clear}
          style={{ padding: "5px 12px", background: "transparent", border: `1px solid ${C.border}`, borderRadius: 8, color: C.muted, fontSize: 12, cursor: "pointer" }}
        >
          Clear
        </button>
      </div>

      <div style={{ display: "flex", gap: 4, flexWrap: "wrap", minHeight: 28 }}>
        {recording && keys.length === 0 && (
          <span style={{ fontSize: 11, color: C.faint, fontStyle: "italic" }}>Press keys…</span>
        )}
        {keys.map((k, i) => (
          <span
            key={i}
            style={{
              display: "inline-flex",
              alignItems: "center",
              padding: "2px 7px",
              background: "var(--bg3)",
              border: `1px solid ${C.border}`,
              borderRadius: 6,
              fontSize: 12,
              color: C.text,
              fontFamily: "monospace",
            }}
          >
            {KEY_LABEL[k.key] ?? k.key}
          </span>
        ))}
      </div>

      {recording && (
        <div style={{ fontSize: 11, color: C.red, display: "flex", alignItems: "center", gap: 4 }}>
          <span style={{ display: "inline-block", width: 6, height: 6, borderRadius: "50%", background: C.red }} />
          Recording… {keys.length} keys captured
        </div>
      )}
    </div>
  );
}
