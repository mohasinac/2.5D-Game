import { registerMechanic } from "../MechanicRegistry";
// Auto mode tips — tip shape changes automatically based on spin speed thresholds
registerMechanic("centrifugal_mode_change", {
  tick(ctx, params, state) {
    const {
      thresholds = { low: 200, high: 500 },
      modeAtLow = "stamina",
      modeAtHigh = "attack",
    } = params as any;
    const prevMode = (state.currentMode as string) ?? modeAtLow;
    let nextMode = prevMode;
    if (ctx.bey.spin >= (thresholds as any).high) {
      nextMode = modeAtHigh;
    } else if (ctx.bey.spin <= (thresholds as any).low) {
      nextMode = modeAtLow;
    }
    if (nextMode !== prevMode) {
      state.currentMode = nextMode;
      (ctx.bey as any).activeTipMode = nextMode;
    }
  },
});
