import { registerMechanic } from "../MechanicRegistry";
registerMechanic("magnetic_pull", {
  tick(ctx, params) {
    const opp = ctx.opponent;
    if (!opp) return;
    const { strength = 0.003 } = params as any;
    const dx = opp.x - ctx.bey.x, dy = opp.y - ctx.bey.y;
    const d = Math.sqrt(dx * dx + dy * dy) || 1;
    ctx.applyForce(opp.id, -(dx / d) * strength, -(dy / d) * strength);
  },
});
