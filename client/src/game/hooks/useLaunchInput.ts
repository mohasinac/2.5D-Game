// useLaunchInput — handles pre-match launch phase input.
// A/D → tilt (-45..+45 deg), W/S → position (0..1), Space hold → charge power, release → launch.
// Once Space is held, position and tilt are locked.
// Sends "launch-input" to the room on every frame while status="launching".
//
// Charge: 25% per 0.2s hold → 100% at 0.8s, max 150% at 1.2s.
// Launch fires when Space is released (launchPower > 0).
// If timer expires without launch, the server auto-fails the player.

import { useEffect, useRef, useState, useCallback } from "react";
import type { Room } from "colyseus.js";

const TILT_RATE = 50;        // degrees per second while key held
const POSITION_RATE = 0.4;   // units per second while key held
const MAX_TILT = 45;
const CHARGE_INTERVAL_MS = 200;  // every 0.2s
const CHARGE_PER_INTERVAL = 25;  // +25% per interval
const MAX_POWER = 150;

export interface LaunchState {
  tilt: number;           // -45 to +45
  position: number;       // 0=forward, 1=backward
  power: number;          // 0 to 150
  charging: boolean;      // Space currently held
  chargingStarted: boolean; // Space ever held → lock pos/tilt
  launched: boolean;      // Space released after charging started
}

export function useLaunchInput(
  room: Room | null,
  status: string,
): LaunchState {
  const keysRef = useRef<Set<string>>(new Set());
  const stateRef = useRef<LaunchState>({
    tilt: 0,
    position: 0.5,
    power: 0,
    charging: false,
    chargingStarted: false,
    launched: false,
  });
  const chargeStartRef = useRef<number>(0);
  const chargeTickRef = useRef<number>(0);
  const animFrameRef = useRef<number>(0);
  const lastDtRef = useRef<number>(performance.now());

  const [launchState, setLaunchState] = useState<LaunchState>(stateRef.current);

  const syncState = useCallback(() => {
    setLaunchState({ ...stateRef.current });
  }, []);

  useEffect(() => {
    if (status !== "launching") return;

    const s = stateRef.current;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.code === "Space") {
        if (!s.chargingStarted) {
          s.charging = true;
          s.chargingStarted = true;
          chargeStartRef.current = performance.now();
          chargeTickRef.current = 0;
        }
        e.preventDefault();
        return;
      }
      keysRef.current.add(e.code);
      if (["KeyW","KeyA","KeyS","KeyD","ArrowUp","ArrowDown","ArrowLeft","ArrowRight"].includes(e.code)) {
        e.preventDefault();
      }
    };

    const onKeyUp = (e: KeyboardEvent) => {
      if (e.code === "Space") {
        if (s.chargingStarted && !s.launched && s.power > 0) {
          s.launched = true;
          s.charging = false;
          // Send final launch
          room?.send("launch-input", {
            tilt: s.tilt,
            position: s.position,
            power: s.power,
            charging: false,
            launched: true,
          });
          syncState();
        }
        return;
      }
      keysRef.current.delete(e.code);
    };

    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("keyup", onKeyUp);

    const loop = () => {
      const now = performance.now();
      const dt = Math.min((now - lastDtRef.current) / 1000, 0.05);
      lastDtRef.current = now;

      if (!s.launched) {
        // A/D adjust tilt (only when not charging-locked)
        if (!s.chargingStarted) {
          const keys = keysRef.current;
          if (keys.has("KeyA") || keys.has("ArrowLeft"))  s.tilt = Math.max(-MAX_TILT, s.tilt - TILT_RATE * dt);
          if (keys.has("KeyD") || keys.has("ArrowRight")) s.tilt = Math.min(MAX_TILT, s.tilt + TILT_RATE * dt);

          // W/S adjust position
          if (keys.has("KeyW") || keys.has("ArrowUp"))   s.position = Math.max(0, s.position - POSITION_RATE * dt);
          if (keys.has("KeyS") || keys.has("ArrowDown")) s.position = Math.min(1, s.position + POSITION_RATE * dt);
        }

        // Charge power while Space held
        if (s.charging && s.chargingStarted) {
          const elapsed = now - chargeStartRef.current;
          const newTick = Math.floor(elapsed / CHARGE_INTERVAL_MS);
          if (newTick > chargeTickRef.current) {
            const intervals = newTick - chargeTickRef.current;
            s.power = Math.min(MAX_POWER, s.power + intervals * CHARGE_PER_INTERVAL);
            chargeTickRef.current = newTick;
          }
        }

        // Send current state to server every frame
        room?.send("launch-input", {
          tilt: s.tilt,
          position: s.position,
          power: s.power,
          charging: s.charging,
          launched: false,
        });

        syncState();
        animFrameRef.current = requestAnimationFrame(loop);
      } else {
        // Loop stops after launch — final sync already sent via onKeyUp
        syncState();
      }
    };

    lastDtRef.current = performance.now();
    animFrameRef.current = requestAnimationFrame(loop);

    return () => {
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("keyup", onKeyUp);
      cancelAnimationFrame(animFrameRef.current);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status, room]);

  // Reset when status leaves launching
  useEffect(() => {
    if (status !== "launching") {
      stateRef.current = {
        tilt: 0,
        position: 0.5,
        power: 0,
        charging: false,
        chargingStarted: false,
        launched: false,
      };
      chargeStartRef.current = 0;
      chargeTickRef.current = 0;
      keysRef.current.clear();
    }
  }, [status]);

  return launchState;
}
