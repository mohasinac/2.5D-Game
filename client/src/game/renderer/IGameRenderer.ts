// Phase 28 — IGameRenderer interface.
// All renderer implementations (PixiRenderer, ThreeJSRenderer) must satisfy this contract.
// The game loop calls only these methods; renderer internals stay encapsulated.

import type { ServerBeyblade, ServerBeyGhost, ServerArenaState } from "@/types/game";

// BitBeastAssetDoc — matches the Firestore bitbeast_assets collection doc shape.
export interface BitBeastAssetDoc {
  id: string;
  name: string;
  imageUrl: string;    // GIF or PNG URL
  beyType?: string;    // "attack" | "defense" | "stamina" | "balanced" | "universal"
  description?: string;
}

export interface IGameRenderer {
  /**
   * Update a single beyblade's visual representation.
   * @param id      Session ID key (matches beyblades / beyGhosts map key)
   * @param state   Full beyblade OR lightweight ghost state
   * @param tier    AoI tier: 2=full, 1=shadow (0.3 opacity), 0=minimap-dot-only
   */
  updateBey(id: string, state: ServerBeyblade | ServerBeyGhost, tier: 0 | 1 | 2): void;

  /**
   * Apply latest arena-state tick (tilt, rotation, shrink radius, rendererMode, etc.)
   */
  updateArena(arenaState: ServerArenaState): void;

  /**
   * Emit a one-shot particle at physics-space (cm) coordinates.
   * @param type  "hit" | "burst" | "ring_out" | "spin_out" | "clash"
   */
  emitParticle(type: string, x: number, y: number): void;

  /**
   * Show or hide the BitBeast overlay for a given side.
   * @param side    "left" = player 1, "right" = player 2
   * @param asset   Asset doc to display, or null to hide
   * @param visible When false, immediately hides the overlay
   */
  setBitBeastVisible(
    side: "left" | "right",
    asset: BitBeastAssetDoc | null,
    visible: boolean,
  ): void;

  /** Clean up all PixiJS / Three.js resources when the component unmounts. */
  destroy(): void;
}
