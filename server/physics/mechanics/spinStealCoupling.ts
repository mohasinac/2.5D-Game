import { registerMechanic } from "../MechanicRegistry";
registerMechanic("spin_steal_coupling", {
  onCollision(ctx, params) {
    const opp = ctx.opponent;
    if (!opp) return;
    const { stealFactor = 0.2 } = params as any;
    const stolen = opp.spin * stealFactor;
    opp.spin -= stolen;
    ctx.bey.spin = Math.min(ctx.bey.spin + stolen * 0.8, ctx.bey.maxSpin);
  },
});
