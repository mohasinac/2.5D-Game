import { registerMechanic } from "../MechanicRegistry";
registerMechanic("defense_stance", {
  onActivate(ctx, params) {
    const { durationMs = 1500 } = params as any;
    ctx.bey.invulnerable = true;
    ctx.bey.invulnerabilityTimer = durationMs / 1000;
  },
});
