import { registerMechanic } from "../MechanicRegistry";
// LAD (Life After Death) ring — free-spinning outer ring that reduces spin theft on contact
registerMechanic("lad_ring", {
  tick(ctx, params, state) {
    const { bearingMu = 0.04 } = params as any;
    if ((state.omega_lad as number) === undefined) state.omega_lad = ctx.bey.spin * 0.3;
    state.omega_lad = Math.max(0, (state.omega_lad as number) - bearingMu * (state.omega_lad as number) * ctx.dt * 5);
  },
  onCollision(ctx, params) {
    const { ladRadius_cm = 1.8, frictionAbsorb = 0.35 } = params as any;
    // LAD ring absorbs frictionAbsorb fraction of spin-steal on contact
    (ctx.bey as any).spinStealReduction = ((ctx.bey as any).spinStealReduction ?? 0) + frictionAbsorb;
    void ladRadius_cm; // used by contact point resolver for arc geometry
  },
});
