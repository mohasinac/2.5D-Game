// [GAME-CLIENT] usePixiRenderer — manages PixiJS renderer lifecycle inside a React component.
// Creates the appropriate renderer for the requested mode (2d → Classic2DRenderer,
// 2.5d → Parts25DRenderer), drives the animation loop, and handles cleanup.

import { useEffect, useRef, useCallback } from "react";
import { BeybladeGameRenderer } from "@/game/renderer/PixiRenderer";
import { Classic2DRenderer } from "@/game/renderer/Classic2DRenderer";
import { Parts25DRenderer } from "@/game/renderer/Parts25DRenderer";
import type { ServerGameState, ServerBeyblade } from "@/types/game";

export type GameRenderMode = "2d" | "2.5d";

export function usePixiRenderer(
  containerRef: React.RefObject<HTMLDivElement | null>,
  mode: GameRenderMode = "2.5d",
) {
  const rendererRef = useRef<BeybladeGameRenderer | null>(null);
  const initializedRef = useRef(false);

  useEffect(() => {
    const container = containerRef.current;
    if (!container || initializedRef.current) return;

    initializedRef.current = true;
    let aborted = false;

    const renderer: BeybladeGameRenderer =
      mode === "2d" ? new Classic2DRenderer(container) : new Parts25DRenderer(container);
    rendererRef.current = renderer;

    renderer.init().then(() => {
      // If cleanup already ran before init resolved, destroy immediately.
      if (aborted) renderer.destroy();
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
  }, [containerRef, mode]);

  const render = useCallback(
    (gameState: ServerGameState | null, beyblades: Map<string, ServerBeyblade>) => {
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

  return {
    render,
    spawnCollisionParticles,
    spawnSpinOutParticles,
    spawnDamageNumber,
    physicsToScreen,
    playSpecialMoveEffect,
    playComboEffect,
    setControlledBeyblade,
    cameraZoomIn,
    cameraZoomOut,
    cameraZoomReset,
    getViewportCm,
  };
}
