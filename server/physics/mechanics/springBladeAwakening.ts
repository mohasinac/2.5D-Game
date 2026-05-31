import { registerMechanic } from "../MechanicRegistry";
// Spriggan Requiem — spring-latch bistable blade awakening
registerMechanic("spring_blade_awakening", {
  tick(ctx, params, state) {
    const { deployThreshold_rads = 480, bistable = true, springAlpha = 0.38 } = params as any;
    const deployed = (state.deployed as boolean) ?? false;
    if (!deployed && ctx.bey.spin >= deployThreshold_rads) {
      state.deployed = true;
      // Spring latch click — raises burst resistance by springAlpha-based factor
      (ctx.bey as any).burstResistanceBonus = ((ctx.bey as any).burstResistanceBonus ?? 0) + Math.round(springAlpha * 100);
      (ctx.bey as any).dmgMultBonus = ((ctx.bey as any).dmgMultBonus ?? 1.0) * 1.20;
    }
    if (!bistable && deployed && ctx.bey.spin < deployThreshold_rads * 0.65) {
      state.deployed = false;
      (ctx.bey as any).burstResistanceBonus = Math.max(0, ((ctx.bey as any).burstResistanceBonus ?? 38) - 38);
      (ctx.bey as any).dmgMultBonus = ((ctx.bey as any).dmgMultBonus ?? 1.20) / 1.20;
    }
  },
});
