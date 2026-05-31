import { registerMechanic } from "../MechanicRegistry";
// Angled AR contacts — sloped contact faces deliver upward tilt increment per hit
registerMechanic("destabilize_slope", {
  onCollision(ctx, params) {
    const { tiltIncrement_deg = 2.5, slopeAngle_deg = 25 } = params as any;
    const impactForce = (ctx.bey as any).lastImpactForce ?? 4.0;
    // F_upper = F_N × sin(slopeAngle)
    const fUpper = impactForce * Math.sin((slopeAngle_deg * Math.PI) / 180);
    // Convert upward force to tilt increment
    const actualTilt = tiltIncrement_deg * (fUpper / impactForce);
    if (ctx.opponent) {
      (ctx.opponent as any).beyTiltAngle = ((ctx.opponent as any).beyTiltAngle ?? 0) + actualTilt;
    }
  },
});
