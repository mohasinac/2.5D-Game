// Phase 28 — RendererFactory.
// Creates the correct renderer implementation based on the arena's rendererMode.

import type { RendererMode } from "@/types/game";
import type { IGameRenderer } from "./IGameRenderer";
import { BeybladeGameRenderer } from "./PixiRenderer";
import { ThreeJSRenderer } from "./ThreeJSRenderer";

export function createRenderer(
  mode: RendererMode | string,
  container: HTMLElement,
): IGameRenderer {
  if (mode === "3d") {
    // ThreeJSRenderer requires a canvas element; create one and attach to container.
    const canvas = document.createElement("canvas");
    canvas.style.width  = "100%";
    canvas.style.height = "100%";
    container.appendChild(canvas);
    return new ThreeJSRenderer(canvas);
  }
  // "2d" and "2.5d" both use the PixiJS renderer; tilt perspective is controlled
  // internally by PixiRenderer based on the arenaState.rendererMode field.
  return new BeybladeGameRenderer(container) as unknown as IGameRenderer;
}
