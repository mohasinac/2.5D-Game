import { registerMechanic } from "../MechanicRegistry";
// Rubber bumper ARs — soft rebound on contact; lower recoil but sticky grip
registerMechanic("rubber_smash_ar", {
  onCollision(ctx, params) {
    const { softRebound = true, gripFactor = 1.35 } = params as any;
    if (softRebound) {
      // Rubber absorbs recoil — attacker stays closer after hit
      (ctx.bey as any).recoilMultiplier = ((ctx.bey as any).recoilMultiplier ?? 1.0) * 0.55;
    }
    // High friction grip — transfers more spin delta to opponent
    if (ctx.opponent) {
      const spinDelta = ((ctx.bey as any).pendingSpinDelta ?? 0) * (gripFactor - 1.0);
      ctx.opponent.spin = Math.max(0, ctx.opponent.spin - spinDelta);
    }
  },
});
