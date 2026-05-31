import { registerMechanic } from "../MechanicRegistry";
// Pivot/Expand frame — entire frame free-spins on bearing ring; absorbs angular impulse
registerMechanic("free_spin_frame", {
  tick(ctx, params, state) {
    const { bearingMu = 0.02 } = params as any;
    if ((state.omega_ring as number) === undefined) state.omega_ring = 0;
    const omega = (state.omega_ring as number);
    // Bearing friction decay on ring
    state.omega_ring = Math.max(0, omega - bearingMu * Math.abs(omega) * ctx.dt * 10);
  },
  onCollision(ctx, params) {
    const { spinDecouplingFactor = 0.80 } = params as any;
    // Angular impulse split: spinDecouplingFactor goes to ring, rest to body
    (ctx.bey as any).spinDecouplingFactor = spinDecouplingFactor;
  },
});
