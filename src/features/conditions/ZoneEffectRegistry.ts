/**
 * Data table mapping ZoneFill types → physics effect parameters.
 * SpawnManager reads this instead of a hardcoded switch statement.
 *
 * Pure data — no geometry, no scene logic.
 */

import type { ZoneFill } from '../../types/arenaTypes';
import type { BaseStatModifiers } from '../../types/sharedTypes';

export interface ZoneEffect {
  frictionPerSec: number;             // velocity multiplier per second (1.0 = no friction)
  healthDrainSec: number;             // HP/sec (negative = drain)
  velDragMult:    number;             // velocity scale per tick (1.0 = no drag)
  statMods:       Partial<BaseStatModifiers> | null;
}

export const ZONE_EFFECTS: Record<ZoneFill | 'none', ZoneEffect> = {
  none:    { frictionPerSec: 1.0,   healthDrainSec:   0, velDragMult: 1.0,  statMods: null },
  ice:     { frictionPerSec: 0.998, healthDrainSec:   0, velDragMult: 1.0,  statMods: { spinRateMult: 1.05 } },
  lava:    { frictionPerSec: 1.0,   healthDrainSec: -15, velDragMult: 1.0,  statMods: null },
  water:   { frictionPerSec: 1.0,   healthDrainSec:   0, velDragMult: 0.85, statMods: null },
  sand:    { frictionPerSec: 1.0,   healthDrainSec:   0, velDragMult: 0.92, statMods: null },
  poison:  { frictionPerSec: 1.0,   healthDrainSec:  -5, velDragMult: 0.93, statMods: null },
  swamp:   { frictionPerSec: 1.0,   healthDrainSec:  -5, velDragMult: 0.93, statMods: null },
  void:    { frictionPerSec: 1.0,   healthDrainSec: -30, velDragMult: 1.0,  statMods: null },
  custom:  { frictionPerSec: 1.0,   healthDrainSec:   0, velDragMult: 1.0,  statMods: null },
};
