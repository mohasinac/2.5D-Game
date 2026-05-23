import { registerMechanic } from "../MechanicRegistry";
registerMechanic("free_spin", {
  tick(ctx, params) {
    const { decayReduction = 0.5 } = params as any;
    ctx.bey.spinDecayRate *= (1 - decayReduction);
  },
});
