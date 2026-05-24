// Phase 28 — ThreeJSRenderer stub.
// Full implementation deferred until CLAUDE.md is amended to permit Three.js.
// Satisfies IGameRenderer so RendererFactory compiles.

import type { IGameRenderer, BitBeastAssetDoc } from "./IGameRenderer";
import type { ServerBeyblade, ServerBeyGhost, ServerArenaState } from "@/types/game";

export class ThreeJSRenderer implements IGameRenderer {
  constructor(_canvas: HTMLCanvasElement) {
    console.warn("[ThreeJSRenderer] 3D renderer is a stub — not yet implemented.");
  }

  updateBey(_id: string, _state: ServerBeyblade | ServerBeyGhost, _tier: 0 | 1 | 2): void {}
  updateArena(_arenaState: ServerArenaState): void {}
  emitParticle(_type: string, _x: number, _y: number): void {}
  setBitBeastVisible(_side: "left" | "right", _asset: BitBeastAssetDoc | null, _visible: boolean): void {}
  destroy(): void {}
}
