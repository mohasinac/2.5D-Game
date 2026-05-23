import { registerMechanic } from "../MechanicRegistry";
registerMechanic("upper_launch", {
  onCollision(ctx, params) {
    const opp = ctx.opponent;
    if (!opp) return;
    const { upForce = 0.06 } = params as any;
    opp.isAirborne = true;
    opp.airborneTimer = 0.5;
    ctx.applyForce(opp.id, 0, -upForce);
  },
});
