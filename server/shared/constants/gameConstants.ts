// Single source of truth for game timing, launch, and match constants.
// Every room and client page imports from here — no more scattered magic numbers.

export const WARMUP_DURATION_S = 3;
export const LAUNCH_DURATION_S = 10;
export const AI_LAUNCH_DELAY_S = 1.5;
export const MATCH_DURATION_S = 180;

export const LAUNCH_MAX_POWER = 150;
export const LAUNCH_MAX_TILT = 45;
export const LAUNCH_POSITION_MIN = 0;
export const LAUNCH_POSITION_MAX = 1;
export const LAUNCH_GRACE_POWER = 50;

export const LAUNCH_CHARGE_INTERVAL_MS = 200;
export const LAUNCH_CHARGE_PER_INTERVAL = 25;
export const LAUNCH_TILT_RATE = 50;
export const LAUNCH_POSITION_RATE = 0.4;
export const LAUNCH_RIPCORD_CYCLE_MS = 1200;
