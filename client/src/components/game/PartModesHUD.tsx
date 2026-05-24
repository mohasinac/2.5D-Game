// PartModesHUD — shows each equipped 2.5D part's currently-active configuration
// and a Cycle button that fires the `mode:switch` Colyseus message. The server
// validates per-part cooldown and the presence of playerSwitchable configs;
// clicks on non-switchable slots are silently rejected.
// Also shows the evolution-driver stage badge on the "tip" row when the bey has
// an evolving driver equipped (tipEvolutionStage > 0 = the tip has evolved at least once).

import { useEffect, useRef, useState } from "react";
import type { Room } from "colyseus.js";
import { C, alpha } from "@/styles/theme";

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
      style={{
        position: "absolute", top: 80, right: 16, zIndex: 11,
        display: "flex", flexDirection: "column", gap: 6,
        pointerEvents: "auto",
      }}
    >
      <div style={{ fontSize: 10, color: C.muted, textTransform: "uppercase", letterSpacing: "0.06em" }}>
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
            style={{
              background: isFlashing
                ? "rgba(251,191,36,0.18)"
                : "rgba(15, 23, 42, 0.88)",
              borderRadius: 10,
              border: `1px solid ${isFlashing ? "#fbbf24" : onCooldown ? C.border : alpha(C.purple, 0.40)}`,
              padding: "8px 10px", minWidth: 180,
              position: "relative", overflow: "hidden",
              transition: "background 0.3s, border-color 0.3s",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
              <span style={{ fontSize: 10, color: C.faint, textTransform: "uppercase", display: "flex", alignItems: "center", gap: 5 }}>
                {labelForLayer(layer)}
                {isEvolving && (
                  <span style={{
                    fontSize: 9, fontWeight: 700, padding: "1px 5px",
                    borderRadius: 4, background: "#fbbf24", color: "#000",
                    letterSpacing: "0.04em",
                  }}>
                    STAGE {tipStage}
                  </span>
                )}
              </span>
              <button
                onClick={() => cycle(layer)}
                disabled={onCooldown}
                style={{
                  fontSize: 10, padding: "2px 8px", borderRadius: 4,
                  background: onCooldown ? C.bg3 : C.purple,
                  color: onCooldown ? C.faint : "#fff",
                  border: "none", cursor: onCooldown ? "not-allowed" : "pointer",
                  fontWeight: 700,
                }}
              >
                Cycle
              </button>
            </div>
            <div style={{ fontSize: 12, color: isFlashing ? "#fbbf24" : C.text, fontWeight: 600, transition: "color 0.3s" }}>
              {String(activeName)}
              {isFlashing && (
                <span style={{ marginLeft: 6, fontSize: 10, color: "#fbbf24", fontWeight: 700 }}>EVOLVED!</span>
              )}
            </div>
            {onCooldown && (
              <div
                style={{
                  position: "absolute", left: 0, bottom: 0, height: 2,
                  width: `${cdPct * 100}%`, background: C.purple,
                  transition: "width 100ms linear",
                }}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}
