import { registerMechanic } from "../MechanicRegistry";
registerMechanic("spin_transfer", {
  onCollision(ctx, params) {
    const opp = ctx.opponent;
    if (!opp) return;
    const { transferRate = 0.15 } = params as any;
    const transfer = opp.spin * transferRate;
    opp.spin -= transfer;
    ctx.bey.spin = Math.min(ctx.bey.spin + transfer, ctx.bey.maxSpin);
  },
});
