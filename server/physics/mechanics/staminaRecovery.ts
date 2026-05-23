import { registerMechanic } from "../MechanicRegistry";
registerMechanic("stamina_recovery", {
  tick(ctx, params) {
    const { recoveryRate = 5 } = params as any;
    ctx.bey.spin = Math.min(ctx.bey.spin + recoveryRate * ctx.dt, ctx.bey.maxSpin);
  },
});
