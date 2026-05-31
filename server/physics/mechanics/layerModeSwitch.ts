import { registerMechanic } from "../MechanicRegistry";
// Spriggan/Fafnir layer rotation — physical layer rotates between modes; spin-direction triggered
registerMechanic("layer_mode_switch", {
  onActivate(ctx, params) {
    const { modes = [], targetModeId = "" } = params as any;
    const mode = (modes as any[]).find((m: any) => m.id === targetModeId);
    if (!mode) return;
    (ctx.bey as any).layerMode = targetModeId;
    if (mode.attackTypeId) (ctx.bey as any).activeAttackTypeOverride = mode.attackTypeId;
    if (mode.spinDirectionLock) (ctx.bey as any).spinDirectionLock = mode.spinDirectionLock;
  },
  tick(ctx, params, state) {
    const { spinDirectionTrigger = false, modes = [] } = params as any;
    if (!spinDirectionTrigger || !(modes as any[]).length) return;
    // Auto-mode based on spin direction: right-spin → mode[0], left-spin → mode[1]
    const spinDir = (ctx.bey as any).spinDirection ?? "right";
    const targetMode = spinDir === "right" ? (modes as any[])[0]?.id : (modes as any[])[1]?.id;
    if (targetMode && targetMode !== (state.currentMode as string)) {
      state.currentMode = targetMode;
      (ctx.bey as any).layerMode = targetMode;
    }
  },
});
