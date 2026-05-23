import { registerMechanic } from "../MechanicRegistry";
registerMechanic("zero_g_float", {
  onActivate(ctx) {
    ctx.bey.effectiveGravity = 0;
    ctx.bey.isAirborne = true;
  },
  tick(ctx, params) {
    const { gravityRestore = 0.5 } = params as any;
    ctx.bey.effectiveGravity = Math.min(ctx.bey.effectiveGravity + gravityRestore * ctx.dt, 9.8);
  },
});
