import { registerMechanic } from "../MechanicRegistry";
// Level Chip / Bearing Drift — suction pad tip; centripetal pull toward arena center
registerMechanic("suction_tip", {
  tick(ctx, params) {
    const { suctionForce_N = 0.8, activeRadius_cm = 25.0 } = params as any;
    const pos = ctx.getPosition?.(ctx.bey.id);
    if (!pos) return;
    const dist = Math.sqrt(pos.x * pos.x + pos.y * pos.y);
    if (dist < activeRadius_cm) {
      // Pull toward center proportional to distance from center
      const factor = (activeRadius_cm - dist) / activeRadius_cm;
      const fx = -(pos.x / (dist || 1)) * suctionForce_N * factor;
      const fy = -(pos.y / (dist || 1)) * suctionForce_N * factor;
      ctx.applyForce(ctx.bey.id, fx, fy);
    }
  },
});
