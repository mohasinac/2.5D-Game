import { registerMechanic } from "../MechanicRegistry";
registerMechanic("attack_amplifier", {
  passive(ctx, params) {
    const { multiplier = 1.25 } = params as any;
    ctx.bey.damageMultiplier *= multiplier;
  },
});
