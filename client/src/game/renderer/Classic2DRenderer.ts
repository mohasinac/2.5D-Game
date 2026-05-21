// [GAME-CLIENT] Classic 2D renderer — flat top-down beyblade view.
// Extends the existing BeybladeGameRenderer; relies on the fact that
// 2.5D-only features (split body, detached bodies, airborne arc) are
// gated by optional fields on the ServerBeyblade that are absent in
// classic 2D games. So this subclass adds an explicit mode tag and a
// guard rail: it never renders detached-body sprites even if the
// server (mistakenly) sends them.

import * as PIXI from "pixi.js";
import { BeybladeGameRenderer } from "./PixiRenderer";
import type { ServerGameState, ServerBeyblade } from "@/types/game";

export class Classic2DRenderer extends BeybladeGameRenderer {
  readonly mode = "2d" as const;

  render(gameState: ServerGameState | null, beyblades: Map<string, ServerBeyblade>): void {
    if (!gameState) {
      super.render(gameState, beyblades);
      return;
    }
    // Defensive: classic 2D never has detached bodies — strip if present.
    const cleanState = gameState.detachedBodies && gameState.detachedBodies.size > 0
      ? { ...gameState, detachedBodies: new Map() as ServerGameState["detachedBodies"] }
      : gameState;
    super.render(cleanState, beyblades);
  }
}
