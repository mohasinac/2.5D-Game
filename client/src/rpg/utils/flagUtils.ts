import type { FlagCondition, GateCondition, GateCheckResult } from "../data/schemas";

export function evaluateFlagCondition(
  cond: FlagCondition,
  flags: Record<string, boolean>
): boolean {
  if (cond.all) {
    for (const [key, expected] of Object.entries(cond.all)) {
      if (!!flags[key] !== expected) return false;
    }
  }
  if (cond.any) {
    const entries = Object.entries(cond.any);
    if (entries.length > 0) {
      const anyMatch = entries.some(([key, expected]) => !!flags[key] === expected);
      if (!anyMatch) return false;
    }
  }
  if (cond.none) {
    for (const [key, expected] of Object.entries(cond.none)) {
      if (!!flags[key] === expected) return false;
    }
  }
  return true;
}

export function evaluateGateCondition(
  gate: GateCondition,
  flags: Record<string, boolean>,
  playerLevel: number,
  beybladeLevels: Record<string, number>,
  earnedBadges: string[],
  defeatedNPCs: Record<string, boolean>
): GateCheckResult {
  if (gate.flags && !evaluateFlagCondition(gate.flags, flags)) {
    return { passed: false, reason: "Story conditions not met." };
  }
  if (gate.minPlayerLevel !== undefined && playerLevel < gate.minPlayerLevel) {
    return { passed: false, reason: `Reach Player Level ${gate.minPlayerLevel} first.` };
  }
  if (gate.minBeybladeLevel) {
    const { beybladeId, level } = gate.minBeybladeLevel;
    const current = beybladeLevels[beybladeId] ?? 1;
    if (current < level) {
      return { passed: false, reason: `Your ${beybladeId} needs to reach Mastery Level ${level}.` };
    }
  }
  if (gate.requiredBadges && gate.requiredBadges.length > 0) {
    const missing = gate.requiredBadges.filter((b) => !earnedBadges.includes(b));
    if (missing.length > 0) {
      return { passed: false, reason: `Missing required badges.` };
    }
  }
  if (gate.anyBadgeFrom && gate.anyBadgeFrom.length > 0) {
    const hasAny = gate.anyBadgeFrom.some((b) => earnedBadges.includes(b));
    if (!hasAny) {
      return { passed: false, reason: "Earn a qualifying badge first." };
    }
  }
  if (gate.defeatedNPCs && gate.defeatedNPCs.length > 0) {
    const notDefeated = gate.defeatedNPCs.filter((id) => !defeatedNPCs[id]);
    if (notDefeated.length > 0) {
      return { passed: false, reason: `Defeat required opponents first.` };
    }
  }
  return { passed: true };
}
