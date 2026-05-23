import { registerMechanic } from "../MechanicRegistry";
registerMechanic("barrage_hit", {
  onCollision(ctx, params) {
    const opp = ctx.opponent;
    if (!opp) return;
    const { hits = 3, damagePerHit = 8 } = params as any;
    if (!opp.invulnerable) {
      const total = hits * damagePerHit * opp.damageTaken;
      opp.health -= total;
      opp.damageReceived += total;
    }
  },
});
