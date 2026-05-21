// [GAME-CLIENT] PreviewAdapter — drives the in-game PixiJS renderer from
// admin editor preview panels. Replaces the per-editor custom canvas
// renderers (SideProfileView / TopDownView / IsometricView for beyblade
// systems, and the four arena-system view canvases) with a single code
// path that matches what players actually see.
//
// Usage:
//   <PreviewAdapter
//     mode="2.5d"
//     gameState={previewState}
//     beyblades={previewBeys}
//     width={400} height={400}
//   />
//
// Editors construct a synthetic ServerGameState + ServerBeyblade map
// representing the part composition / arena layout being edited and pass
// it here. The component reuses Parts25DRenderer (or Classic2DRenderer
// for classic 2D arenas) so the preview is pixel-identical to gameplay.

import { useEffect, useRef } from "react";
import { usePixiRenderer, type GameRenderMode } from "@/game/hooks/usePixiRenderer";
import type { ServerGameState, ServerBeyblade } from "@/types/game";

interface PreviewAdapterProps {
  mode: GameRenderMode;
  gameState: ServerGameState | null;
  beyblades: Map<string, ServerBeyblade>;
  width?: number;
  height?: number;
  className?: string;
}

export function PreviewAdapter({
  mode,
  gameState,
  beyblades,
  width,
  height,
  className,
}: PreviewAdapterProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { render } = usePixiRenderer(containerRef, mode);

  // Static render — no rAF loop; previews update only when props change.
  useEffect(() => {
    render(gameState, beyblades);
  }, [render, gameState, beyblades]);

  return (
    <div
      ref={containerRef}
      className={className}
      style={{
        width: width ?? "100%",
        height: height ?? "100%",
        overflow: "hidden",
      }}
    />
  );
}
