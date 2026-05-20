// [GAME-CLIENT] usePixiRenderer — manages PixiJS renderer lifecycle inside a React component.
// Creates the BeybladeGameRenderer, drives the animation loop, and handles cleanup.

import { useEffect, useRef, useCallback } from "react";
import { BeybladeGameRenderer } from "@/game/renderer/PixiRenderer";
import type { ServerGameState, ServerBeyblade } from "@/types/game";

export function usePixiRenderer(containerRef: React.RefObject<HTMLDivElement | null>) {
  const rendererRef = useRef<BeybladeGameRenderer | null>(null);
  const initializedRef = useRef(false);

  useEffect(() => {
    const container = containerRef.current;
    if (!container || initializedRef.current) return;

    const renderer = new BeybladeGameRenderer(container);
    rendererRef.current = renderer;
    initializedRef.current = true;

    renderer.init().catch(console.error);

    const handleResize = () => renderer.resize();
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      renderer.destroy();
      rendererRef.current = null;
      initializedRef.current = false;
    };
  }, [containerRef]);

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

  return { render, spawnCollisionParticles, spawnSpinOutParticles, spawnDamageNumber };
}
