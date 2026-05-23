import { registerMechanic } from "../MechanicRegistry";
registerMechanic("contact_height_gate", {
  onCollision(ctx, params) {
    const opp = ctx.opponent;
    if (!opp) return;
    const { heightThreshold = 0.5, damageScale = 0.5 } = params as any;
    if (ctx.bey.beyTiltAngle < heightThreshold && !opp.invulnerable) {
      opp.health -= 10 * damageScale;
    }
  },
});
