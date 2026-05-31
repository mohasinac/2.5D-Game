import { registerMechanic } from "../MechanicRegistry";
// Hive conical bearing tip — free-spin on cone pivot; wobbles instead of losing spin on contact
registerMechanic("free_spin_conical_tip", {
  tick(ctx, params, state) {
    const { coneAngle_deg = 35, bearingMu = 0.03 } = params as any;
    // Conical bearing: near-zero spin decay; wobble increases instead of spin loss
    (ctx.bey as any).tipSpinDecayOverride = bearingMu * 0.5;
    // As tip precesses on cone, add small wobble perturbation
    const stability = ctx.bey.spin / ((ctx.bey as any).maxSpin || 700);
    if (stability < 0.5) {
      const wobbleAmp = (0.5 - stability) * coneAngle_deg * 0.01;
      const angle = ((state.wobblePhase as number) ?? 0) + ctx.dt * 3.0;
      state.wobblePhase = angle;
      ctx.applyForce(ctx.bey.id, Math.cos(angle) * wobbleAmp, Math.sin(angle) * wobbleAmp);
    }
  },
  onCollision(ctx, params) {
    const { spinDecouplingFactor = 0.90 } = params as any;
    (ctx.bey as any).spinDecouplingFactor = spinDecouplingFactor;
  },
});
