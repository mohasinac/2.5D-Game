import { registerMechanic } from "../MechanicRegistry";
registerMechanic("weight_shift", {
  passive(ctx, params) {
    const { massBonus = 5 } = params as any;
    ctx.bey.mass += massBonus;
  },
});
