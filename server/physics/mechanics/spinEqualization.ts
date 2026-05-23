import { registerMechanic } from "../MechanicRegistry";
registerMechanic("spin_equalization", {
  onCollision(ctx, params) {
    const opp = ctx.opponent;
    if (!opp) return;
    const avg = (ctx.bey.spin + opp.spin) / 2;
    const { rate = 0.3 } = params as any;
    ctx.bey.spin += (avg - ctx.bey.spin) * rate;
    opp.spin += (avg - opp.spin) * rate;
  },
});
