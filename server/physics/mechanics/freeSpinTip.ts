import { registerMechanic } from "../MechanicRegistry";
// Bearing/Eternal/Nothing/Orbit tips — free-spinning tip decoupled from body spin
registerMechanic("free_spin_tip", {
  tick(ctx, params, state) {
    const { bearingMu = 0.02, tipDecayRate = 0.5 } = params as any;
    // Track separate tip spin; decay at bearing friction rate
    if ((state.omega_tip as number) === undefined) state.omega_tip = ctx.bey.spin;
    const omega_tip = (state.omega_tip as number);
    state.omega_tip = Math.max(0, omega_tip - bearingMu * omega_tip * ctx.dt);
    // Body spin decay uses bearing friction instead of tip material friction
    // Override spinDecayRate for this tick to near-zero
    (ctx.bey as any).tipSpinDecayOverride = bearingMu * tipDecayRate;
  },
  onCollision(ctx, params) {
    // Angular impulse from collision goes to tip ring, not body
    const { spinDecouplingFactor = 0.85 } = params as any;
    // Signal to collision resolver: only (1 - spinDecouplingFactor) of angular impulse reaches body
    (ctx.bey as any).spinDecouplingFactor = spinDecouplingFactor;
  },
});
