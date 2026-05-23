import { registerMechanic } from "../MechanicRegistry";
registerMechanic("smash_impact", {
  onCollision(ctx, params) {
    const opp = ctx.opponent;
    if (!opp) return;
    const { extraDamage = 20 } = params as any;
    if (!opp.invulnerable) {
      opp.health -= extraDamage * opp.damageTaken;
      opp.damageReceived += extraDamage;
    }
  },
});
