import { registerMechanic } from "../MechanicRegistry";
registerMechanic("bearing_drift", {
  tick(ctx, params) {
    const { driftSpeed = 0.15 } = params as any;
    ctx.bey.velocityX *= (1 - driftSpeed * ctx.dt);
    ctx.bey.velocityY *= (1 - driftSpeed * ctx.dt);
  },
});
