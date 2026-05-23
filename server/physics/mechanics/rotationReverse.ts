import { registerMechanic } from "../MechanicRegistry";
registerMechanic("rotation_reverse", {
  onActivate(ctx) {
    ctx.bey.spinDirection = ctx.bey.spinDirection === "right" ? "left" : "right";
  },
});
