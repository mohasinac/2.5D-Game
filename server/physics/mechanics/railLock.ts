import { registerMechanic } from "../MechanicRegistry";
registerMechanic("rail_lock", {
  tick(ctx) {
    // Locks bey to the nearest gear rail when within proximity.
    // Actual rail tracking is handled by ArenaFeatureProcessor.processGearRails().
    // This mechanic enables the gearCompatibleBit flag so rail-entry detection fires.
    ctx.bey.gearCompatibleBit = true;
  },
});
