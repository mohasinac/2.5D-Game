import { registerMechanic } from "../MechanicRegistry";
// HMS Shooter Change Cores — spin-direction pre-selected before launch; bistable lock-in
registerMechanic("bistable_mode_switch", {
  onActivate(ctx, params) {
    const { spinDirectionSelected = "right", modes = [] } = params as any;
    // Bistable: mode locks in at launch and cannot change mid-match
    const mode = (modes as any[]).find((m: any) => m.spinDirection === spinDirectionSelected);
    if (!mode) return;
    (ctx.bey as any).spinDirection = spinDirectionSelected;
    (ctx.bey as any).layerMode = mode.id;
    if (mode.attackTypeId) (ctx.bey as any).activeAttackTypeOverride = mode.attackTypeId;
  },
});
