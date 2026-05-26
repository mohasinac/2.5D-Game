import type { InstinctPattern, AIBeyState } from '../types/AITypes';

interface InstinctOutput {
  bitmask: number;
}

const BIT_LEFT = 1 << 0;
const BIT_RIGHT = 1 << 1;
const BIT_UP = 1 << 2;
const BIT_DOWN = 1 << 3;
const BIT_ATTACK = 1 << 4;
const BIT_DEFENSE = 1 << 5;

export function computeInstinctBitmask(
  pattern: InstinctPattern,
  self: AIBeyState,
  tick: number,
  arenaRadius: number
): InstinctOutput {
  switch (pattern) {
    case 'wild':
      return wildInstinct(self, tick);
    case 'flower':
      return flowerInstinct(self, tick, arenaRadius);
    case 'center_pull':
      return centerPullInstinct(self);
    case 'wall_ride':
      return wallRideInstinct(self, tick, arenaRadius);
    case 'defensive':
      return defensiveInstinct(self);
    case 'balanced':
      return balancedInstinct(self, tick);
    case 'rail_orbit':
      return railOrbitInstinct(self, tick, arenaRadius);
    case 'free':
    default:
      return { bitmask: 0 };
  }
}

function wildInstinct(_self: AIBeyState, tick: number): InstinctOutput {
  const phase = (tick * 0.1) % (Math.PI * 2);
  let bitmask = 0;
  if (Math.sin(phase) > 0.3) bitmask |= BIT_RIGHT;
  else if (Math.sin(phase) < -0.3) bitmask |= BIT_LEFT;
  if (Math.cos(phase * 1.3) > 0.5) bitmask |= BIT_UP;
  else if (Math.cos(phase * 1.3) < -0.5) bitmask |= BIT_DOWN;
  if (tick % 30 < 5) bitmask |= BIT_ATTACK;
  return { bitmask };
}

function flowerInstinct(_self: AIBeyState, tick: number, _arenaRadius: number): InstinctOutput {
  const phase = (tick * 0.05) % (Math.PI * 2);
  let bitmask = 0;
  const r = Math.sin(phase * 3);
  if (r > 0) {
    bitmask |= Math.cos(phase) > 0 ? BIT_RIGHT : BIT_LEFT;
    bitmask |= Math.sin(phase) > 0 ? BIT_DOWN : BIT_UP;
  } else {
    bitmask |= Math.cos(phase) > 0 ? BIT_LEFT : BIT_RIGHT;
    bitmask |= Math.sin(phase) > 0 ? BIT_UP : BIT_DOWN;
  }
  return { bitmask };
}

function centerPullInstinct(self: AIBeyState): InstinctOutput {
  let bitmask = 0;
  if (self.x > 20) bitmask |= BIT_LEFT;
  else if (self.x < -20) bitmask |= BIT_RIGHT;
  if (self.y > 20) bitmask |= BIT_UP;
  else if (self.y < -20) bitmask |= BIT_DOWN;
  bitmask |= BIT_DEFENSE;
  return { bitmask };
}

function wallRideInstinct(self: AIBeyState, tick: number, arenaRadius: number): InstinctOutput {
  const dist = Math.sqrt(self.x * self.x + self.y * self.y);
  let bitmask = 0;
  if (dist < arenaRadius * 0.7) {
    const angle = Math.atan2(self.y, self.x);
    bitmask |= Math.cos(angle) > 0 ? BIT_RIGHT : BIT_LEFT;
    bitmask |= Math.sin(angle) > 0 ? BIT_DOWN : BIT_UP;
  } else {
    const tangent = Math.atan2(self.y, self.x) + Math.PI / 2;
    bitmask |= Math.cos(tangent) > 0 ? BIT_RIGHT : BIT_LEFT;
    bitmask |= Math.sin(tangent) > 0 ? BIT_DOWN : BIT_UP;
  }
  if (tick % 20 < 3) bitmask |= BIT_ATTACK;
  return { bitmask };
}

function defensiveInstinct(self: AIBeyState): InstinctOutput {
  let bitmask = BIT_DEFENSE;
  if (self.x > 30) bitmask |= BIT_LEFT;
  else if (self.x < -30) bitmask |= BIT_RIGHT;
  if (self.y > 30) bitmask |= BIT_UP;
  else if (self.y < -30) bitmask |= BIT_DOWN;
  return { bitmask };
}

function balancedInstinct(self: AIBeyState, tick: number): InstinctOutput {
  let bitmask = 0;
  const phase = (tick * 0.03) % (Math.PI * 2);
  const targetX = Math.cos(phase) * 80;
  const targetY = Math.sin(phase) * 80;
  if (self.x < targetX - 10) bitmask |= BIT_RIGHT;
  else if (self.x > targetX + 10) bitmask |= BIT_LEFT;
  if (self.y < targetY - 10) bitmask |= BIT_DOWN;
  else if (self.y > targetY + 10) bitmask |= BIT_UP;
  return { bitmask };
}

function railOrbitInstinct(self: AIBeyState, tick: number, arenaRadius: number): InstinctOutput {
  const dist = Math.sqrt(self.x * self.x + self.y * self.y);
  const targetRadius = arenaRadius * 0.85;
  let bitmask = 0;
  if (dist < targetRadius - 20) {
    const angle = Math.atan2(self.y, self.x);
    bitmask |= Math.cos(angle) > 0 ? BIT_RIGHT : BIT_LEFT;
    bitmask |= Math.sin(angle) > 0 ? BIT_DOWN : BIT_UP;
  } else {
    const tangent = Math.atan2(self.y, self.x) + Math.PI / 2;
    bitmask |= Math.cos(tangent) > 0 ? BIT_RIGHT : BIT_LEFT;
    bitmask |= Math.sin(tangent) > 0 ? BIT_DOWN : BIT_UP;
  }
  if (tick % 15 < 3) bitmask |= BIT_ATTACK;
  return { bitmask };
}
