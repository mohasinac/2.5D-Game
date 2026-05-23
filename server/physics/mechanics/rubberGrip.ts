import { registerMechanic } from "../MechanicRegistry";
registerMechanic("rubber_grip", {
  onCollision(ctx, params) {
    const opp = ctx.opponent;
    if (!opp) return;
    const { extraSpinSteal = 0.1 } = params as any;
    const steal = opp.spin * extraSpinSteal;
    opp.spin -= steal;
    ctx.bey.spin = Math.min(ctx.bey.spin + steal, ctx.bey.maxSpin);
  },
});
