import { registerMechanic } from "../MechanicRegistry";
// Rolling sub-wheels — contact force is partially absorbed by roller rotation; spin maintained
registerMechanic("roller_deflect", {
  onCollision(ctx, params) {
    const { spinMaintained = true, rollerAbsorption = 0.25 } = params as any;
    // Rollers convert incoming lateral force to roller spin — reduces transmitted force
    (ctx.bey as any).lastImpactForce = ((ctx.bey as any).lastImpactForce ?? 0) * (1 - rollerAbsorption);
    if (spinMaintained) {
      // Rollers grip opponent — spin is not lost on contact (rolling without sliding)
      (ctx.bey as any).spinDecayOnContact = 0;
    }
  },
});
