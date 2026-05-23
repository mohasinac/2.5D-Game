import { registerMechanic } from "../MechanicRegistry";
registerMechanic("spring_recoil", {
  onCollision(ctx, params) {
    const { recoilMultiplier = 1.5 } = params as any;
    // Flag physics engine to apply extra restitution on next collision resolve
    (ctx.bey as any)._springRecoilMultiplier = recoilMultiplier;
  },
});
