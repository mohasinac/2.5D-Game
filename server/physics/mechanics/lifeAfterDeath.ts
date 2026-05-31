import { registerMechanic } from "../MechanicRegistry";
// Burst Fafnir — spin equalization via opposite-spin contact; gains spin from opponents
registerMechanic("life_after_death", {
  onCollision(ctx, params) {
    const { spinGainPerContact = 8, absorbWindow_ms = 200 } = params as any;
    if (!ctx.opponent) return;
    const oppSpinDir = (ctx.opponent as any).spinDirection ?? "right";
    const ownSpinDir = (ctx.bey as any).spinDirection ?? "left";
    // LAD activates when beys spin in opposite directions
    if (oppSpinDir !== ownSpinDir) {
      ctx.bey.spin = Math.min((ctx.bey as any).maxSpin ?? 700, ctx.bey.spin + spinGainPerContact);
      if (ctx.opponent) {
        ctx.opponent.spin = Math.max(0, ctx.opponent.spin - spinGainPerContact * 0.5);
      }
    }
    void absorbWindow_ms; // window enforced at call site
  },
});
