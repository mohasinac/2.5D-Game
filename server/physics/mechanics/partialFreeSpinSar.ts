import { registerMechanic } from "../MechanicRegistry";
// SAR/AR Core geometry — partial free-spin based on collar interface arc
registerMechanic("partial_free_spin_sar", {
  tick(ctx, params, state) {
    const { maxRotation_deg = 45, returnTimeMs = 400 } = params as any;
    const sarAngle = (state.sarAngle as number) ?? 0;
    const returning = (state.returning as boolean) ?? false;
    if (returning && sarAngle > 0) {
      const retractRate = maxRotation_deg / (returnTimeMs / 1000);
      state.sarAngle = Math.max(0, sarAngle - retractRate * ctx.dt);
      if ((state.sarAngle as number) <= 0) state.returning = false;
    }
  },
  onCollision(ctx, params) {
    const { maxRotation_deg = 45, returnTimeMs = 400 } = params as any;
    const sarAngle = (ctx.bey as any).sarAngle ?? 0;
    if (sarAngle < maxRotation_deg) {
      // SAR deflects on contact — partial rotation absorbs some impact
      const newAngle = Math.min(maxRotation_deg, sarAngle + 20);
      (ctx.bey as any).sarAngle = newAngle;
      // Partial deflection reduces transmitted force proportional to rotation achieved
      const deflectFraction = newAngle / maxRotation_deg;
      (ctx.bey as any).lastImpactForce = ((ctx.bey as any).lastImpactForce ?? 0) * (1 - deflectFraction * 0.4);
      (ctx.bey as any).sarReturning = true;
      void returnTimeMs;
    }
  },
});
