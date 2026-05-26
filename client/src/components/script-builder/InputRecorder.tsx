// Key capture → draft script generation.
// Records input sequences and converts them to movement BehaviorRef steps.

import { useState, useEffect, useRef } from "react";
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
    <div className="p-3 flex flex-col gap-[10px]">
      <div className="text-[11px] font-bold text-theme-muted uppercase tracking-[0.05em]">
        Input Recorder
      </div>
      <p className="text-[11px] text-theme-faint m-0 leading-[1.5]">
        Record a key sequence and convert it to BehaviorRef steps.
        Use Arrow keys or WASD / SPACE.
      </p>

      <div className="flex gap-[6px] flex-wrap">
        {!recording ? (
          <button
            type="button"
            onClick={startRecording}
            className="py-[5px] px-3 rounded-lg text-[12px] cursor-pointer font-semibold bg-red-10 border border-[rgba(239,68,68,0.27)] text-theme-red"
          >
            ● Record
          </button>
        ) : (
          <button
            type="button"
            onClick={stopRecording}
            className="py-[5px] px-3 rounded-lg text-[12px] cursor-pointer font-semibold bg-red-13 border border-[rgba(239,68,68,0.53)] text-theme-red [animation:pulse_1s_infinite]"
          >
            ■ Stop
          </button>
        )}
        <button
          type="button"
          onClick={generateScript}
          disabled={keys.length === 0}
          className={`py-[5px] px-3 rounded-lg text-[12px] font-semibold bg-green-10 border border-[rgba(34,197,94,0.27)] text-theme-green ${keys.length === 0 ? "opacity-40" : ""}`}
        >
          → Add to Canvas
        </button>
        <button
          type="button"
          onClick={clear}
          className="py-[5px] px-3 bg-transparent border border-border-c rounded-lg text-theme-muted text-[12px] cursor-pointer"
        >
          Clear
        </button>
      </div>

      <div className="flex gap-1 flex-wrap min-h-[28px]">
        {recording && keys.length === 0 && (
          <span className="text-[11px] text-theme-faint italic">Press keys…</span>
        )}
        {keys.map((k, i) => (
          <span
            key={i}
            className="inline-flex items-center px-[7px] py-[2px] bg-bg3 border border-border-c rounded-md text-[12px] text-theme-text font-mono"
          >
            {KEY_LABEL[k.key] ?? k.key}
          </span>
        ))}
      </div>

      {recording && (
        <div className="text-[11px] text-theme-red flex items-center gap-1">
          <span className="inline-block w-[6px] h-[6px] rounded-full bg-theme-red" />
          Recording… {keys.length} keys captured
        </div>
      )}
    </div>
  );
}
