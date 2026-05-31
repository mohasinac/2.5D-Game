import { registerMechanic } from "../MechanicRegistry";
// SAR free-spin deflection — Sub Attack Ring absorbs impact via rotation
registerMechanic("sub_ar_deflect", {
  onCollision(ctx, params) {
    const { fullOrPartial = "partial", deflectFactor = 0.35 } = params as any;
    const reduction = fullOrPartial === "full" ? 0.60 : deflectFactor;
    // Reduce incoming damage proportional to deflection
    (ctx.bey as any).lastImpactForce = ((ctx.bey as any).lastImpactForce ?? 0) * (1 - reduction);
    // Deflected force is lost (SAR absorbs it as rotational energy)
  },
});
