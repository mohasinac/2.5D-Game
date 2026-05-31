// [GAME-CLIENT] usePixiRenderer — manages PixiJS renderer lifecycle inside a React component.
// Always uses Parts25DRenderer — 2D mode has been removed.

import { useEffect, useRef, useCallback } from "react";
import { BeybladeGameRenderer } from "@/game/renderer/PixiRenderer";
import { Parts25DRenderer } from "@/game/renderer/Parts25DRenderer";
import type { ServerGameState, ServerBeyblade } from "@/types/game";
import type { VisualEventQueue, VisualEvent } from "@/game/visual/VisualEventQueue";

function dispatchVisualEvent(renderer: BeybladeGameRenderer, ev: VisualEvent): void {
  switch (ev.type) {
    case "combo-visual":
      renderer.handleComboVisual?.(ev.payload as Parameters<BeybladeGameRenderer["handleComboVisual"]>[0]);
      break;
    case "special-move-camera":
      renderer.handleSpecialMoveCamera?.(ev.payload as Parameters<BeybladeGameRenderer["handleSpecialMoveCamera"]>[0]);
      break;
    case "meteor-strike-hang":
      renderer.onMeteorStrikeHang?.(ev.payload as Parameters<BeybladeGameRenderer["onMeteorStrikeHang"]>[0]);
      break;
    // "burst" particles are handled by game-page room.onMessage handlers
    // (which have physicsToScreen access). Queue tracks burst as CRITICAL for future use.
  }
}

export function usePixiRenderer(
  containerRef: React.RefObject<HTMLDivElement | null>,
) {
  const rendererRef = useRef<BeybladeGameRenderer | null>(null);
  const initializedRef = useRef(false);

  useEffect(() => {
    const container = containerRef.current;
    if (!container || initializedRef.current) return;

    initializedRef.current = true;
    let aborted = false;

    const renderer: BeybladeGameRenderer = new Parts25DRenderer(container);
    rendererRef.current = renderer;

    renderer.init().then(() => {
      // If cleanup already ran before init resolved, the cleanup function
      // already called renderer.destroy() — do not call it again here.
      // The initialized=false guard in destroy() prevents double-destroy.
      if (aborted) return;
    }).catch(console.error);

    const handleResize = () => renderer.resize();
    window.addEventListener("resize", handleResize);

    return () => {
      aborted = true;
      window.removeEventListener("resize", handleResize);
      renderer.destroy();
      rendererRef.current = null;
      initializedRef.current = false;
    };
  }, [containerRef]);

  const render = useCallback(
    (gameState: ServerGameState | null, beyblades: Map<string, ServerBeyblade>, visualQueue?: VisualEventQueue) => {
      if (visualQueue && rendererRef.current) {
        const renderer = rendererRef.current;
        for (const ev of visualQueue.drain(Date.now())) {
          dispatchVisualEvent(renderer, ev);
        }
      }
      rendererRef.current?.render(gameState, beyblades);
    },
    []
  );

  const spawnCollisionParticles = useCallback(
    (x: number, y: number, color1: number, color2: number) => {
      rendererRef.current?.spawnCollisionParticles(x, y, color1, color2);
    },
    []
  );

  const spawnSpinOutParticles = useCallback(
    (x: number, y: number, color: number) => {
      rendererRef.current?.spawnSpinOutParticles(x, y, color);
    },
    []
  );

  const spawnBurstParticles = useCallback(
    (x: number, y: number) => {
      rendererRef.current?.spawnBurstParticles(x, y);
    },
    []
  );

  const spawnDamageNumber = useCallback(
    (x: number, y: number, damage: number, color?: number) => {
      rendererRef.current?.spawnDamageNumber(x, y, damage, color);
    },
    []
  );

  // Convert a physics-space position to screen-space pixels.
  // Call this before spawning particles at positions received from the server.
  const physicsToScreen = useCallback(
    (px: number, py: number): { x: number; y: number } => {
      return rendererRef.current?.physicsToScreen(px, py) ?? { x: px, y: py };
    },
    []
  );

  const playSpecialMoveEffect = useCallback(
    (playerId: string, type: string, x: number, y: number, facing: number) => {
      rendererRef.current?.playSpecialMoveEffect?.(playerId, type, x, y, facing);
    },
    []
  );

  const playComboEffect = useCallback(
    (playerId: string, comboName: string) => {
      rendererRef.current?.playComboEffect?.(playerId, comboName);
    },
    []
  );

  // Camera controls — wired to on-screen buttons + keyboard shortcuts.
  const setControlledBeyblade = useCallback((id: string | null) => {
    rendererRef.current?.setControlledBeyblade(id);
  }, []);
  const cameraZoomIn = useCallback(() => { rendererRef.current?.cameraZoomIn(); }, []);
  const cameraZoomOut = useCallback(() => { rendererRef.current?.cameraZoomOut(); }, []);
  const cameraZoomReset = useCallback(() => { rendererRef.current?.cameraZoomReset(); }, []);
  const getViewportCm = useCallback(() => rendererRef.current?.getViewportCm() ?? null, []);

  const triggerScreenShake = useCallback((magnitude?: number, durationMs?: number) => {
    rendererRef.current?.triggerScreenShake(magnitude, durationMs);
  }, []);

  const triggerHitFlash = useCallback((beyId: string) => {
    rendererRef.current?.triggerHitFlash(beyId);
  }, []);

  return {
    render,
    spawnCollisionParticles,
    spawnSpinOutParticles,
    spawnBurstParticles,
    spawnDamageNumber,
    physicsToScreen,
    playSpecialMoveEffect,
    playComboEffect,
    setControlledBeyblade,
    cameraZoomIn,
    cameraZoomOut,
    cameraZoomReset,
    getViewportCm,
    triggerScreenShake,
    triggerHitFlash,
  };
}
