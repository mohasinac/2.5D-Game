// PartModesHUD — shows each equipped 2.5D part's currently-active configuration
// and a Cycle button that fires the `mode:switch` Colyseus message. The server
// validates per-part cooldown and the presence of playerSwitchable configs;
// clicks on non-switchable slots are silently rejected.
// Also shows the evolution-driver stage badge on the "tip" row when the bey has
// an evolving driver equipped (tipEvolutionStage > 0 = the tip has evolved at least once).

import React, { useEffect, useRef, useState } from "react";
import type { Room } from "colyseus.js";

const PART_LABELS: Record<string, string> = {
  bit_beast: "Bit Beast",
  ar: "Attack Ring",
  attack_ring: "Attack Ring",
  wd: "Weight Disk",
  weight_disk: "Weight Disk",
  spin_track: "Spin Track",
  casing: "Casing",
  core: "Core",
  tip: "Tip",
};

function labelForLayer(layer: string): string {
  const sub = /^sub_part_(\d+)$/.exec(layer);
  if (sub) return `Sub-Part ${Number(sub[1]) + 1}`;
  return PART_LABELS[layer] ?? layer.replace(/_/g, " ");
}

// Mirror of MODE_SWITCH_COOLDOWN_MS on the server (kept in sync manually).
const CLIENT_COOLDOWN_MS = 2_000;

interface PartModesHUDProps {
  /** The local player's beyblade — used to read activePartConfigs + configLastSwitchAt. */
  myBeyblade: {
    activePartConfigs?: Map<string, string> | Record<string, string>;
    configLastSwitchAt?: Map<string, number> | Record<string, number>;
    /** Current evolution stage index (0 = default, 1+ = evolved). Synced by Colyseus. */
    tipEvolutionStage?: number;
  } | null | undefined;
  /** Colyseus room used to dispatch the mode:switch message. */
  room: Room | null | undefined;
}

function mapEntries(
  src: Map<string, any> | Record<string, any> | undefined
): Array<[string, any]> {
  if (!src) return [];
  if (src instanceof Map) return Array.from(src.entries());
  const proto = (src as any).forEach && (src as any).entries;
  if (typeof proto === "function" || ("forEach" in (src as any) && typeof (src as any).forEach === "function")) {
    const out: Array<[string, any]> = [];
    (src as any).forEach((v: any, k: string) => out.push([k, v]));
    return out;
  }
  return Object.entries(src as Record<string, any>);
}

export function PartModesHUD({ myBeyblade, room }: PartModesHUDProps) {
  const [now, setNow] = useState(Date.now());
  // Flash "EVOLVED!" when tipEvolutionStage increments
  const [evolutionFlash, setEvolutionFlash] = useState(false);
  const prevStageRef = useRef<number>(myBeyblade?.tipEvolutionStage ?? 0);

  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 100);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    const stage = myBeyblade?.tipEvolutionStage ?? 0;
    if (stage > prevStageRef.current) {
      prevStageRef.current = stage;
      setEvolutionFlash(true);
      const t = setTimeout(() => setEvolutionFlash(false), 1800);
      return () => clearTimeout(t);
    }
    prevStageRef.current = stage;
  }, [myBeyblade?.tipEvolutionStage]);

  if (!myBeyblade || !room) return null;
  const entries = mapEntries(myBeyblade.activePartConfigs).filter(([, v]) => v && v !== "detached");
  if (entries.length === 0) return null;

  const tipStage = myBeyblade.tipEvolutionStage ?? 0;

  const lastSwitchMap = new Map<string, number>(
    mapEntries(myBeyblade.configLastSwitchAt).map(([k, v]) => [k, Number(v) || 0])
  );

  const cycle = (layer: string) => {
    try {
      room.send("mode:switch", { partLayer: layer });
    } catch {
      // ignore — room may have disconnected
    }
  };

  return (
    <div
      className="absolute flex flex-col gap-[6px] pointer-events-auto z-[11]"
      style={{ top: 80, right: 16 }}
    >
      <div className="text-[10px] text-theme-muted uppercase tracking-[0.06em]">
        Modes
      </div>
      {entries.map(([layer, activeName]) => {
        const lastAt = lastSwitchMap.get(layer) ?? 0;
        const elapsed = now - lastAt;
        const onCooldown = elapsed < CLIENT_COOLDOWN_MS;
        const cdPct = onCooldown ? Math.min(1, elapsed / CLIENT_COOLDOWN_MS) : 1;
        const isEvolving = layer === "tip" && tipStage > 0;
        const isFlashing = layer === "tip" && evolutionFlash;
        return (
          <div
            key={layer}
            className={`rounded-[10px] px-[10px] py-2 min-w-[180px] relative overflow-hidden border [transition:background_0.3s,border-color_0.3s] ${isFlashing ? "bg-[rgba(251,191,36,0.18)] border-[#fbbf24]" : onCooldown ? "bg-[rgba(15,23,42,0.88)] border-border-c" : "bg-[rgba(15,23,42,0.88)] border-[rgba(168,85,247,0.4)]"}`}
          >
            <div className="flex justify-between items-center mb-1">
              <span className="text-[10px] text-theme-faint uppercase flex items-center gap-[5px]">
                {labelForLayer(layer)}
                {isEvolving && (
                  <span className="text-[9px] font-bold px-[5px] py-[1px] rounded bg-[#fbbf24] text-black tracking-[0.04em]">
                    STAGE {tipStage}
                  </span>
                )}
              </span>
              <button
                onClick={() => cycle(layer)}
                disabled={onCooldown}
                className={`text-[10px] px-2 py-[2px] rounded font-bold border-none ${onCooldown ? "bg-bg3 text-theme-faint cursor-not-allowed" : "bg-[var(--purple)] text-white cursor-pointer"}`}
              >
                Cycle
              </button>
            </div>
            <div className={`text-[12px] font-semibold [transition:color_0.3s] ${isFlashing ? "text-[#fbbf24]" : "text-theme-text"}`}>
              {String(activeName)}
              {isFlashing && (
                <span className="ml-[6px] text-[10px] text-[#fbbf24] font-bold">EVOLVED!</span>
              )}
            </div>
            {onCooldown && (
              <div
                className="absolute left-0 bottom-0 h-[2px] bg-[var(--purple)] [transition:width_100ms_linear] w-[--cdw]"
                style={{ "--cdw": `${cdPct * 100}%` } as React.CSSProperties}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}
