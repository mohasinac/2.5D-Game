// [GAME-CLIENT] 2.5D parts renderer — full feature set:
//   - airborne perspective arc + drop shadow
//   - spin-direction flash burst
//   - split-body partner draw
//   - detached-body sprites (mini-beys / fragments)
//
// Extends BeybladeGameRenderer; today's renderer already supports all of
// these via optional fields on ServerBeyblade/ServerGameState, so this
// subclass just marks the mode. A future iteration can move the
// 2.5D-only draw paths out of the base renderer into this subclass to
// keep Classic2D's WebGL pipeline lighter.

import { BeybladeGameRenderer } from "./PixiRenderer";

export class Parts25DRenderer extends BeybladeGameRenderer {
  readonly mode = "2.5d" as const;
  /** Show a 28° perspective by default when the arena hasn't set a tilt angle. */
  protected override get defaultTiltAngle(): number { return 28; }
}
