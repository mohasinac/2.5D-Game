import { registerMechanic } from "../MechanicRegistry";
registerMechanic("contact_deflect", {
  onCollision(ctx, params) {
    const opp = ctx.opponent;
    if (!opp || !ctx.getPosition || !ctx.applyKnockback) return;
    const { deflectForce = 0.04 } = params as any;
    const pos = ctx.getPosition(ctx.bey.id);
    const oppPos = ctx.getPosition(opp.id);
    if (!pos || !oppPos) return;
    const dx = oppPos.x - pos.x, dy = oppPos.y - pos.y;
    const d = Math.sqrt(dx * dx + dy * dy) || 1;
    ctx.applyKnockback(opp.id, { x: dx / d, y: dy / d }, deflectForce * 1000);
  },
});
