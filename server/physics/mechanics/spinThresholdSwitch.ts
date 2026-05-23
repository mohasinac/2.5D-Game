import { registerMechanic } from "../MechanicRegistry";
registerMechanic("spin_threshold_switch", {
  tick(ctx, params) {
    const { threshold = 0.4, boostOnLow = 0.5 } = params as any;
    const stability = ctx.bey.spin / ctx.bey.maxSpin;
    if (stability < threshold) {
      ctx.bey.damageMultiplier += boostOnLow * ctx.dt;
    }
  },
});
