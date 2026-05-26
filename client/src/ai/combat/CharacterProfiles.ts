import { collection, getDocs } from 'firebase/firestore';
import { db, COLLECTIONS } from '../../lib/firebase';
import type { CharacterProfile } from '../types/CharacterTypes';

// Built-in fallbacks — used when Firestore is unavailable or during initial load
const DEFAULT_PROFILES: Record<string, CharacterProfile> = {
  tyson:    { aggression: 0.95, counterBias: 0.30, risk: 0.85, rushBias: 1.00, specialTiming: 'early', supportBias: 0.20 },
  kai:      { aggression: 0.60, counterBias: 0.95, risk: 0.20, rushBias: 0.30, specialTiming: 'late',  supportBias: 0.10 },
  tala:     { aggression: 0.80, counterBias: 0.70, risk: 0.40, rushBias: 0.60, specialTiming: 'mid',   supportBias: 0.15 },
  brooklyn: { aggression: 0.70, counterBias: 0.85, risk: 0.60, rushBias: 0.50, specialTiming: 'late',  supportBias: 0.05 },
  daichi:   { aggression: 1.00, counterBias: 0.10, risk: 1.00, rushBias: 1.00, specialTiming: 'early', supportBias: 0.30 },
  max:      { aggression: 0.40, counterBias: 0.60, risk: 0.20, rushBias: 0.20, specialTiming: 'mid',   supportBias: 0.90 },
  ray:      { aggression: 0.65, counterBias: 0.65, risk: 0.50, rushBias: 0.55, specialTiming: 'mid',   supportBias: 0.60 },
};

let loadedProfiles: Record<string, CharacterProfile> | null = null;

export async function loadCharacterProfiles(): Promise<Record<string, CharacterProfile>> {
  if (loadedProfiles) return loadedProfiles;
  try {
    const snap = await getDocs(collection(db, COLLECTIONS.AI_CHARACTER_PROFILES));
    const profiles: Record<string, CharacterProfile> = { ...DEFAULT_PROFILES };
    for (const doc of snap.docs) {
      const d = doc.data();
      profiles[doc.id] = {
        aggression: d.aggression ?? 0.5,
        counterBias: d.counterBias ?? 0.5,
        risk: d.risk ?? 0.5,
        rushBias: d.rushBias ?? 0.5,
        specialTiming: d.specialTiming ?? 'mid',
        supportBias: d.supportBias ?? 0.3,
      };
    }
    loadedProfiles = profiles;
    return profiles;
  } catch {
    loadedProfiles = DEFAULT_PROFILES;
    return DEFAULT_PROFILES;
  }
}

export function getCharacterProfile(name: string): CharacterProfile {
  const profiles = loadedProfiles ?? DEFAULT_PROFILES;
  return profiles[name.toLowerCase()] ?? profiles.tyson ?? DEFAULT_PROFILES.tyson;
}
