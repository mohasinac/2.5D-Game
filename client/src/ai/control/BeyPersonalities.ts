import { collection, getDocs } from 'firebase/firestore';
import { db, COLLECTIONS } from '../../lib/firebase';
import type { BeyPersonalityData } from '../types/CharacterTypes';
import type { InstinctPattern } from '../types/AITypes';

// Built-in fallbacks — used when Firestore is unavailable or during initial load
const DEFAULT_PERSONALITIES: Record<string, BeyPersonalityData> = {
  dragoon:  { aggression: 95, obedience: 75, rushBias: 100, specialBias: 80,  centerControl: 20, instinct: 'wild',      bondBehaviors: [{ minBond: 0.8, behavior: 'storm_surge', effect: 'rush_speed_x1.3' }] },
  dranzer:  { aggression: 70, obedience: 85, rushBias: 50,  specialBias: 100, centerControl: 40, instinct: 'free',      bondBehaviors: [{ minBond: 0.7, behavior: 'aerial_spiral', effect: 'air_movement' }] },
  driger:   { aggression: 60, obedience: 90, rushBias: 60,  specialBias: 70,  centerControl: 65, instinct: 'balanced',  bondBehaviors: [{ minBond: 0.6, behavior: 'precision_strike', effect: 'accuracy_plus' }] },
  wolborg:  { aggression: 20, obedience: 95, rushBias: 10,  specialBias: 60,  centerControl: 90, instinct: 'defensive', bondBehaviors: [{ minBond: 0.5, behavior: 'ice_stall', effect: 'center_camp' }] },
  seaborg:  { aggression: 30, obedience: 85, rushBias: 20,  specialBias: 50,  centerControl: 70, instinct: 'defensive', bondBehaviors: [{ minBond: 0.6, behavior: 'wall_barrier', effect: 'rebound_plus' }] },
  draciel:  { aggression: 25, obedience: 90, rushBias: 15,  specialBias: 60,  centerControl: 85, instinct: 'defensive', bondBehaviors: [{ minBond: 0.7, behavior: 'shell_guard', effect: 'defense_plus' }] },
  strata:   { aggression: 50, obedience: 80, rushBias: 40,  specialBias: 65,  centerControl: 55, instinct: 'balanced',  bondBehaviors: [{ minBond: 0.6, behavior: 'earth_anchor', effect: 'stability_plus' }] },
  pegasus:  { aggression: 85, obedience: 80, rushBias: 90,  specialBias: 85,  centerControl: 30, instinct: 'wild',      bondBehaviors: [{ minBond: 0.7, behavior: 'star_blast', effect: 'smash_plus' }] },
  leone:    { aggression: 55, obedience: 85, rushBias: 35,  specialBias: 55,  centerControl: 75, instinct: 'balanced',  bondBehaviors: [{ minBond: 0.6, behavior: 'wind_shield', effect: 'counter_plus' }] },
  ldrago:   { aggression: 80, obedience: 60, rushBias: 70,  specialBias: 90,  centerControl: 35, instinct: 'wild',      bondBehaviors: [{ minBond: 0.8, behavior: 'dark_spin', effect: 'spin_steal_plus' }] },
};

let loadedPersonalities: Record<string, BeyPersonalityData> | null = null;

export async function loadBeyPersonalities(): Promise<Record<string, BeyPersonalityData>> {
  if (loadedPersonalities) return loadedPersonalities;
  try {
    const snap = await getDocs(collection(db, COLLECTIONS.AI_BEY_PERSONALITIES));
    const personalities: Record<string, BeyPersonalityData> = { ...DEFAULT_PERSONALITIES };
    for (const doc of snap.docs) {
      const d = doc.data();
      personalities[doc.id] = {
        aggression: d.aggression ?? 50,
        obedience: d.obedience ?? 80,
        rushBias: d.rushBias ?? 50,
        specialBias: d.specialBias ?? 50,
        centerControl: d.centerControl ?? 50,
        instinct: (d.instinct ?? 'balanced') as InstinctPattern,
        bondBehaviors: d.bondBehaviors ?? [],
      };
    }
    loadedPersonalities = personalities;
    return personalities;
  } catch {
    loadedPersonalities = DEFAULT_PERSONALITIES;
    return DEFAULT_PERSONALITIES;
  }
}

export function getBeyPersonality(name: string): BeyPersonalityData {
  const personalities = loadedPersonalities ?? DEFAULT_PERSONALITIES;
  const key = name.toLowerCase().replace(/[\s-]/g, '');
  return personalities[key] ?? personalities.dragoon ?? DEFAULT_PERSONALITIES.dragoon;
}
