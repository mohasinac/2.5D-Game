import { registerMechanic } from "../MechanicRegistry";
// Burst Limit Break rubber segments — bistable centrifugal deployment
registerMechanic("limit_break_deploy", {
  tick(ctx, params, state) {
    const { deployThreshold_rads = 450, bistable = true } = params as any;
    const deployed = (state.deployed as boolean) ?? false;
    if (!deployed && ctx.bey.spin >= deployThreshold_rads) {
      state.deployed = true;
      // Rubber segments extend: higher friction coefficient on contact edges
      (ctx.bey as any).contactFrictionBonus = ((ctx.bey as any).contactFrictionBonus ?? 0) + 0.30;
      (ctx.bey as any).dmgMultBonus = ((ctx.bey as any).dmgMultBonus ?? 1.0) * 1.15;
    }
    // bistable: stays deployed; does NOT retract when spin drops
    if (!bistable && deployed && ctx.bey.spin < deployThreshold_rads * 0.7) {
      state.deployed = false;
      (ctx.bey as any).contactFrictionBonus = Math.max(0, ((ctx.bey as any).contactFrictionBonus ?? 0) - 0.30);
      (ctx.bey as any).dmgMultBonus = ((ctx.bey as any).dmgMultBonus ?? 1.15) / 1.15;
    }
  },
});
