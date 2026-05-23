import { registerMechanic } from "../MechanicRegistry";
registerMechanic("surface_friction_modifier", {
  passive(ctx, params) {
    const { frictionScale = 0.5 } = params as any;
    ctx.bey.surfaceFriction *= frictionScale;
  },
});
