import { registerMechanic } from "../MechanicRegistry";
registerMechanic("spin_direction_bonus", {
  onCollision(ctx, params) {
    const opp = ctx.opponent;
    if (!opp) return;
    const { bonusDamage = 15 } = params as any;
    if (ctx.bey.spinDirection === opp.spinDirection && !opp.invulnerable) {
      opp.health -= bonusDamage * opp.damageTaken;
    }
  },
});
