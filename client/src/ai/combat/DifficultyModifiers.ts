import { collection, getDocs } from 'firebase/firestore';
import { db, COLLECTIONS } from '../../lib/firebase';
import type { AIDifficulty, DifficultyProfile } from '../types/AITypes';
import { DIFFICULTY_PROFILES } from '../types/AITypes';

let loadedProfiles: Record<string, DifficultyProfile> | null = null;

export async function loadDifficultyProfiles(): Promise<Record<string, DifficultyProfile>> {
  if (loadedProfiles) return loadedProfiles;
  try {
    const snap = await getDocs(collection(db, COLLECTIONS.AI_DIFFICULTY_PROFILES));
    const profiles: Record<string, DifficultyProfile> = { ...DIFFICULTY_PROFILES };
    for (const doc of snap.docs) {
      const d = doc.data();
      profiles[doc.id as AIDifficulty] = {
        tickIntervalMs: d.tickIntervalMs ?? 300,
        reactionDelayMs: d.reactionDelayMs ?? 200,
        errorRate: d.errorRate ?? 0.1,
        predictionTicks: d.predictionTicks ?? 3,
        usesPatternLearning: d.usesPatternLearning ?? false,
      };
    }
    loadedProfiles = profiles;
    return profiles;
  } catch {
    loadedProfiles = DIFFICULTY_PROFILES;
    return DIFFICULTY_PROFILES;
  }
}

export function getDifficultyProfile(difficulty: AIDifficulty): DifficultyProfile {
  const profiles = loadedProfiles ?? DIFFICULTY_PROFILES;
  return profiles[difficulty] ?? profiles.medium ?? DIFFICULTY_PROFILES.medium;
}

export function shouldMakeError(errorRate: number): boolean {
  return Math.random() < errorRate;
}

export function applyReactionDelay(callback: () => void, delayMs: number): void {
  if (delayMs <= 0) {
    callback();
    return;
  }
  setTimeout(callback, delayMs);
}

export function predictPosition(
  x: number, y: number,
  vx: number, vy: number,
  ticks: number,
  tickMs: number = 16.67
): { x: number; y: number } {
  const dt = (ticks * tickMs) / 1000;
  return { x: x + vx * dt, y: y + vy * dt };
}
