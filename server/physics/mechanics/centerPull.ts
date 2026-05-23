import { registerMechanic } from "../MechanicRegistry";
registerMechanic("center_pull", {
  tick(ctx, params) {
    const { strength = 0.002 } = params as any;
    const dx = -ctx.bey.x, dy = -ctx.bey.y;
    const d = Math.sqrt(dx * dx + dy * dy) || 1;
    ctx.applyForce(ctx.bey.id, (dx / d) * strength, (dy / d) * strength);
  },
});
