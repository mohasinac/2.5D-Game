import { registerMechanic } from "../MechanicRegistry";
registerMechanic("revival_spin", {
  tick(ctx, params) {
    const { threshold = 0.2, recoveryRate = 10 } = params as any;
    const stability = ctx.bey.spin / ctx.bey.maxSpin;
    if (stability < threshold) {
      ctx.bey.spin = Math.min(ctx.bey.spin + recoveryRate * ctx.dt, ctx.bey.maxSpin);
    }
  },
});
