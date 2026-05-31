import { registerMechanic } from "../MechanicRegistry";
// Genesis/Cho-Z Wings — bistable burst-stopper deployment; requires manual reset between matches
registerMechanic("centrifugal_barrier_blades", {
  tick(ctx, params, state) {
    const { deployThreshold_rads = 500, bistable = true } = params as any;
    const deployed = (state.deployed as boolean) ?? false;
    if (!deployed && ctx.bey.spin >= deployThreshold_rads) {
      state.deployed = true;
      // Deployed wings extend Burst Stopper tabs — severely raise burst threshold
      (ctx.bey as any).burstResistanceBonus = ((ctx.bey as any).burstResistanceBonus ?? 0) + 45;
      // Blade gaps partially covered — contact probability halved
      (ctx.bey as any).contactCoverFactor = 0.5;
    }
    // bistable: wings stay deployed for the entire match; no auto-retract when spin drops
    if (!bistable && deployed && ctx.bey.spin < deployThreshold_rads * 0.6) {
      state.deployed = false;
      (ctx.bey as any).burstResistanceBonus = Math.max(0, ((ctx.bey as any).burstResistanceBonus ?? 0) - 45);
      (ctx.bey as any).contactCoverFactor = 1.0;
    }
  },
  onActivate(ctx, params) {
    // Manual reset — called by room between games (requiresManualReset=true)
    const { reset = false } = params as any;
    if (reset) {
      (ctx.bey as any).burstResistanceBonus = Math.max(0, ((ctx.bey as any).burstResistanceBonus ?? 45) - 45);
      (ctx.bey as any).contactCoverFactor = 1.0;
    }
  },
});
