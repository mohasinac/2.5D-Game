import { registerMechanic } from "../MechanicRegistry";
registerMechanic("centrifugal_deploy_bow", {
  tick(ctx, params, state) {
    const { deployThreshold_rads = 300, bowExtension_cm = 0.4 } = params as any;
    const deployed = (state.deployed as boolean) ?? false;
    if (!deployed && ctx.bey.spin >= deployThreshold_rads) {
      state.deployed = true;
      // Increase outer contact radius by bowExtension_cm (converted to game units)
      (ctx.bey as any).contactRadiusBonus = ((ctx.bey as any).contactRadiusBonus ?? 0) + bowExtension_cm;
    }
  },
});
