import { registerMechanic } from "../MechanicRegistry";
// OWD-negative mode — disc enters a detrimental configuration when spin crosses threshold
registerMechanic("detrimental_mode_switch", {
  tick(ctx, params, state) {
    const { badModeThreshold_rads = 300, owdPenalty = 0.15 } = params as any;
    const inBadMode = (state.inBadMode as boolean) ?? false;
    if (!inBadMode && ctx.bey.spin <= badModeThreshold_rads) {
      state.inBadMode = true;
      // Detrimental mode: reduce effective I (OWD shifts inward), increases spin decay
      (ctx.bey as any).spinDecayRateBonus = ((ctx.bey as any).spinDecayRateBonus ?? 0) + owdPenalty;
    } else if (inBadMode && ctx.bey.spin > badModeThreshold_rads * 1.2) {
      state.inBadMode = false;
      (ctx.bey as any).spinDecayRateBonus = Math.max(0, ((ctx.bey as any).spinDecayRateBonus ?? 0) - owdPenalty);
    }
  },
});
