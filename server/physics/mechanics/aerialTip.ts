import { registerMechanic } from "../MechanicRegistry";
// Air Knight tip — no floor friction; full force on slopes/walls; floats on flat surfaces
registerMechanic("aerial_tip", {
  tick(ctx, params) {
    const { floorForceMult = 0.0, slopeForceMult = 1.0 } = params as any;
    const onSlope = (ctx.bey as any).onSlope ?? false;
    if (onSlope) {
      (ctx.bey as any).tipFrictionMultiplier = slopeForceMult;
    } else {
      // On flat floor: near-zero friction — bey glides freely
      (ctx.bey as any).tipFrictionMultiplier = floorForceMult;
    }
  },
});
