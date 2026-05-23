import { registerMechanic } from "../MechanicRegistry";
registerMechanic("energy_reserve", {
  tick(ctx, params, state) {
    const { rechargeRate = 0.5, maxReserve = 100 } = params as any;
    const s = state as any;
    s.reserve = Math.min((s.reserve ?? 0) + rechargeRate * ctx.dt, maxReserve);
  },
  onActivate(ctx, params) {
    const { spinBoost = 200 } = params as any;
    ctx.bey.spin = Math.min(ctx.bey.spin + spinBoost, ctx.bey.maxSpin);
  },
});
