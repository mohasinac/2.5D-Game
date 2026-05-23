import { registerMechanic } from "../MechanicRegistry";
registerMechanic("velocity_burst", {
  onActivate(ctx, params) {
    const { forceX = 0.05, forceY = 0 } = params as any;
    ctx.applyForce(ctx.bey.id, forceX, forceY);
    ctx.bey.spin = Math.min(ctx.bey.spin + 100, ctx.bey.maxSpin);
  },
});
