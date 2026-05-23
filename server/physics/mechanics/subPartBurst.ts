import { registerMechanic } from "../MechanicRegistry";
registerMechanic("sub_part_burst", {
  onActivate(ctx, params) {
    // Fires a sub-part as a projectile — actual spawning handled by PartPhysics.ts
    const { subPartIndex = 0 } = params as any;
    (ctx.bey as any)._pendingSubPartBurst = subPartIndex;
  },
});
