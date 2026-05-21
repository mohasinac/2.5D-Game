// Combo detection system — tracks input sequences and detects predefined combos

export interface ComboEntry {
  key: string;
  timestamp: number;
}

export interface ComboTracker {
  history: ComboEntry[];
}

export interface ComboResult {
  name: string;
  damageMultiplier: number;
  durationMs: number;
  lockMs: number;
  effect: "damage_boost" | "speed_burst_left" | "speed_burst_right" | "full_invuln";
}

// Defined combo sequences (checked longest-first to avoid partial matches)
interface ComboDefinition {
  name: string;
  keys: string[];
  windowMs: number;
  result: ComboResult;
  sameFrame?: boolean; // for simultaneous key combos like counter_strike
}

const COMBOS: ComboDefinition[] = [
  // Combo 1: storm_assault (longest sequence first)
  {
    name: "storm_assault",
    keys: ["moveLeft", "moveRight", "attack"],
    windowMs: 500,
    result: {
      name: "storm_assault",
      damageMultiplier: 2.2,
      durationMs: 2000,
      lockMs: 2000,
      effect: "damage_boost",
    },
  },
  // Combo 2: gyro_counter
  {
    name: "gyro_counter",
    keys: ["defense", "defense", "dodge"],
    windowMs: 600,
    result: {
      name: "gyro_counter",
      damageMultiplier: 1.0,
      durationMs: 2000,
      lockMs: 0,
      effect: "full_invuln",
    },
  },
  // Combo 3: aerial_smash
  {
    name: "aerial_smash",
    keys: ["jump", "attack"],
    windowMs: 300,
    result: {
      name: "aerial_smash",
      damageMultiplier: 2.0,
      durationMs: 0,
      lockMs: 0,
      effect: "damage_boost",
    },
  },
  // Combo 4: spinning_slash
  {
    name: "spinning_slash",
    keys: ["dodge", "attack"],
    windowMs: 300,
    result: {
      name: "spinning_slash",
      damageMultiplier: 1.8,
      durationMs: 0,
      lockMs: 0,
      effect: "damage_boost",
    },
  },
  // Combo 5: counter_strike (simultaneous defense + attack)
  {
    name: "counter_strike",
    keys: ["defense", "attack"],
    windowMs: 0,
    sameFrame: true,
    result: {
      name: "counter_strike",
      damageMultiplier: 1.5,
      durationMs: 1500,
      lockMs: 0,
      effect: "damage_boost",
    },
  },
  // Combo 6: dash_left (double-tap left)
  {
    name: "dash_left",
    keys: ["moveLeft", "moveLeft"],
    windowMs: 200,
    result: {
      name: "dash_left",
      damageMultiplier: 1.0,
      durationMs: 300,
      lockMs: 0,
      effect: "speed_burst_left",
    },
  },
  // Combo 7: dash_right (double-tap right)
  {
    name: "dash_right",
    keys: ["moveRight", "moveRight"],
    windowMs: 200,
    result: {
      name: "dash_right",
      damageMultiplier: 1.0,
      durationMs: 300,
      lockMs: 0,
      effect: "speed_burst_right",
    },
  },
];

// Prune old entries outside the combo window
export function pruneHistory(tracker: ComboTracker, now: number, maxWindowMs: number = 600): void {
  tracker.history = tracker.history.filter((entry) => now - entry.timestamp <= maxWindowMs);
}

// Detect if the current input matches any combo sequence
export function detectCombo(
  tracker: ComboTracker,
  comboKeys: string[],
  now: number
): ComboResult | null {
  if (!comboKeys || comboKeys.length === 0) return null;

  pruneHistory(tracker, now);

  // Check for simultaneous combos first (counter_strike)
  const sameFrameCombo = COMBOS.find((c) => c.sameFrame && c.keys.length === comboKeys.length);
  if (sameFrameCombo) {
    const hasAllKeys = sameFrameCombo.keys.every((k) => comboKeys.includes(k));
    if (hasAllKeys) {
      tracker.history = [];
      return sameFrameCombo.result;
    }
  }

  // Append new keys to history
  for (const key of comboKeys) {
    tracker.history.push({ key, timestamp: now });
  }

  // Check sequences from longest to shortest (avoid partial matches)
  for (const combo of COMBOS) {
    if (combo.sameFrame) continue; // Already checked above
    if (combo.keys.length > tracker.history.length) continue;

    // Get the last N entries from history
    const recentKeys = tracker.history.slice(-combo.keys.length);

    // Check if keys match AND all are within the window
    const allMatch = recentKeys.every((entry, idx) => entry.key === combo.keys[idx]);
    const firstTimestamp = recentKeys[0]?.timestamp ?? now;
    const allInWindow = now - firstTimestamp <= combo.windowMs;

    if (allMatch && allInWindow) {
      tracker.history = [];
      return combo.result;
    }
  }

  return null;
}
