import { registerMechanic } from "../MechanicRegistry";
// GT Gatinko chip detachment — Layer chip ejects on Burst; removes chip contribution from assembly
registerMechanic("chip_separation", {
  onCollision(ctx, params) {
    const { ejectionOnBurst = true, chipMassReduction_g = 6.5 } = params as any;
    if (!ejectionOnBurst) return;
    // Check if burst is imminent (burstPressure near threshold)
    const burstPressure = (ctx.bey as any).burstPressure ?? 0;
    const burstResistance = (ctx.bey as any).burstResistance ?? 50;
    const burstRisk = burstPressure / Math.max(1, 100 - burstResistance);
    if (burstRisk >= 0.8) {
      // Chip about to eject — reduce effective mass and I_total
      (ctx.bey as any).chipEjected = true;
      (ctx.bey as any).effectiveMassReduction_g = ((ctx.bey as any).effectiveMassReduction_g ?? 0) + chipMassReduction_g;
    }
  },
  tick(ctx, params, state) {
    const ejected = (state.chipEjected as boolean) ?? false;
    if (!ejected && (ctx.bey as any).chipEjected) {
      state.chipEjected = true;
      // Chip ejected: re-derive spinDecayRate with lower mass (applied next tick)
      (ctx.bey as any).needsPhysicsRecalc = true;
    }
  },
});
