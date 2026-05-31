import { registerMechanic } from "../MechanicRegistry";
// Ignition' driver — spring-click Dash clutch; raises burst resistance + snap on contact
registerMechanic("spring_clutch", {
  onCollision(ctx, params) {
    const { snapThreshold_N = 3.0, burstBonus = 18 } = params as any;
    const impactForce = (ctx.bey as any).lastImpactForce ?? 0;
    if (impactForce >= snapThreshold_N) {
      // Clutch snaps closed — temporarily boost burst resistance
      (ctx.bey as any).burstResistanceBonus = ((ctx.bey as any).burstResistanceBonus ?? 0) + burstBonus;
      (ctx.bey as any).springClutchCooldown = 500; // ms cooldown before next snap
    }
  },
  tick(ctx, params, state) {
    const cooldown = (state.cooldown as number) ?? 0;
    if (cooldown > 0) {
      state.cooldown = Math.max(0, cooldown - ctx.dt * 1000);
    }
  },
});
