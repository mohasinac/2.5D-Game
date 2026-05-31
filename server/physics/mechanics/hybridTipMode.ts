import { registerMechanic } from "../MechanicRegistry";
// Zeta'/Variable drivers — multi-mode tips with distinct physics per mode
registerMechanic("hybrid_tip_mode", {
  onActivate(ctx, params) {
    const { modes = [], activeModeId = "" } = params as any;
    const mode = (modes as any[]).find((m: any) => m.id === activeModeId);
    if (!mode) return;
    // Apply mode-specific tip material properties
    if (mode.mu_k !== undefined) (ctx.bey as any).tipMuOverride = mode.mu_k;
    if (mode.contactRadius_cm !== undefined) (ctx.bey as any).tipRadiusOverride = mode.contactRadius_cm;
    (ctx.bey as any).activeTipMode = activeModeId;
  },
  tick(ctx, params, state) {
    const activeModeId = (state.activeModeId as string) ?? (params as any).activeModeId ?? "";
    if (activeModeId !== (ctx.bey as any).activeTipMode) {
      state.activeModeId = (ctx.bey as any).activeTipMode;
    }
  },
});
