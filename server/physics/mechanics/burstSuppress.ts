import { registerMechanic } from "../MechanicRegistry";
registerMechanic("burst_suppress", {
  onCollision(ctx, params) {
    const { pressureReduction = 0.5 } = params as any;
    ctx.bey.burstPressure = Math.max(0, ctx.bey.burstPressure - pressureReduction);
  },
});
