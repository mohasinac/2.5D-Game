import { registerMechanic } from "../MechanicRegistry";
registerMechanic("mode_switch", {
  onActivate(ctx, params) {
    const { targetMode = "attack" } = params as any;
    ctx.bey.type = targetMode;
  },
});
