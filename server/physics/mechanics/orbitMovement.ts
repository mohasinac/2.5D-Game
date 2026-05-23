import { registerMechanic } from "../MechanicRegistry";
registerMechanic("orbit_movement", {
  tick(ctx, params) {
    const { centerX = 0, centerY = 0, intensity = 0.002, direction = "cw" } = params as any;
    const dir = direction === "ccw" ? -1 : 1;
    const dx = ctx.bey.x - centerX;
    const dy = ctx.bey.y - centerY;
    const d = Math.sqrt(dx * dx + dy * dy) || 1;
    const tx = (-dy / d) * dir;
    const ty = (dx / d) * dir;
    ctx.applyForce(ctx.bey.id, tx * intensity, ty * intensity);
  },
});
