import { registerMechanic } from "../MechanicRegistry";
// Rolling sub-wheels — gyroscopic righting moment when bey tilts; reduces precession
registerMechanic("roller_righting", {
  tick(ctx, params) {
    const { rightingTorque_Nm = 0.0015 } = params as any;
    const tiltAngle = (ctx.bey as any).beyTiltAngle ?? 0;
    if (Math.abs(tiltAngle) > 2) {
      // Apply righting torque proportional to tilt magnitude
      const correction = Math.sign(tiltAngle) * rightingTorque_Nm * Math.abs(tiltAngle) * 0.1;
      (ctx.bey as any).beyTiltAngle = tiltAngle - correction * ctx.dt * 60;
    }
  },
});
