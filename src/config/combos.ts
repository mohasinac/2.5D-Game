import type { ComboDef } from '../systems/ComboDetector';

/* ══════════════════════════════════════════════════════════════════════════
   THE COMBO TABLE  —  CS12's eight base combos

   THIS DID NOT EXIST. `ComboDetector` shipped a complete thirteen-step gate
   chain, a sliding-three history, cooldowns, power gating and four hard
   ceilings — and `attach()` had no caller anywhere in `src/`, so `attached`
   stayed `[]` and `tryFire` returned `no_match` on every frame of every
   battle. There was also no combo data anywhere in the repository: no table,
   no JSON, nothing to attach even if someone had called it.

   Both halves of that are fixed here and at the one call site.

   TOKENS ARE SEMANTIC (`inputSources.ComboToken`), not physical key codes.
   Authoring these against `'KeyA'` would make every combo desktop-only and
   silently unreachable on touch and for every AI opponent.

   THE CEILINGS ARE THE POINT, from CS12 Case 614: a combo is PLAYER SKILL
   INSIDE THE PHYSICAL LAYER. It never receives `[M]` BeySpirit amplification,
   never exceeds `damageMultiplier` 1.5, never locks for more than 300 ms and
   never grants invulnerability. That separation is what keeps the anime layer
   from leaking into skill expression — `clampComboDef` enforces it on attach
   rather than trusting these literals, so a bad edit here is corrected, not
   obeyed.

   COST TIERS, also CS12: 0 free movement · 15 riposte · 25 power thrust ·
   35 spin leech. They are paid from the ACTIVE gauge, which fills with time;
   specials are paid from XTREME, which is earned by landing hits. A combo you
   can wait for and an ultimate you must fight for.
   ══════════════════════════════════════════════════════════════════════════ */

export const BASE_COMBOS: readonly ComboDef[] = [
  {
    id: 'dash_feint',
    name: 'Dash Feint',
    /* Double-tap away, then hop — the classic bait. Free, because movement
       the opponent can read should never cost resource. */
    sequence: ['LEFT', 'LEFT', 'JUMP'],
    cost: 0,
    cooldownMs: 1200,
    windowMs: 450,
    allowedTypes: [],
    damageMultiplier: 1.0,
    lockMs: 0,
  },
  {
    id: 'triple_strike',
    name: 'Triple Strike',
    sequence: ['TRIGGER', 'TRIGGER', 'TRIGGER'],
    cost: 25,
    cooldownMs: 2600,
    windowMs: 400,
    allowedTypes: ['attack', 'balance'],
    damageMultiplier: 1.5,          // the ceiling exactly
    lockMs: 220,
  },
  {
    id: 'cross_cut',
    name: 'Cross Cut',
    sequence: ['LEFT', 'RIGHT', 'TRIGGER'],
    cost: 25,
    cooldownMs: 2200,
    windowMs: 450,
    allowedTypes: ['attack'],
    damageMultiplier: 1.4,
    lockMs: 180,
  },
  {
    id: 'rising_smash',
    name: 'Rising Smash',
    /* Two hits then a hop: an upper attack, which is the one that matters
       once contact height decides what strikes what. */
    sequence: ['TRIGGER', 'TRIGGER', 'JUMP'],
    cost: 25,
    cooldownMs: 2800,
    windowMs: 400,
    allowedTypes: ['attack', 'balance'],
    damageMultiplier: 1.45,
    lockMs: 240,
  },
  {
    id: 'weave',
    name: 'Weave',
    sequence: ['LEFT', 'RIGHT', 'JUMP'],
    cost: 0,
    cooldownMs: 1400,
    windowMs: 500,
    allowedTypes: [],
    damageMultiplier: 1.0,
    lockMs: 0,
  },
  {
    id: 'hop_chain',
    name: 'Hop Chain',
    sequence: ['JUMP', 'JUMP', 'JUMP'],
    cost: 15,
    cooldownMs: 3000,
    windowMs: 500,
    allowedTypes: [],
    damageMultiplier: 1.1,
    lockMs: 0,
  },
  {
    id: 'flank_turn',
    name: 'Flank Turn',
    sequence: ['LEFT', 'JUMP', 'RIGHT'],
    cost: 15,
    cooldownMs: 2000,
    windowMs: 450,
    allowedTypes: ['defense', 'stamina', 'balance'],
    damageMultiplier: 1.0,
    lockMs: 0,
  },
  {
    id: 'spin_leech',
    name: 'Spin Leech',
    /* The expensive one, and deliberately a DEFENSIVE input: guard twice,
       then strike. Spin-stealing is a stamina tactic, so it reads as one. */
    sequence: ['GUARD', 'GUARD', 'TRIGGER'],
    cost: 35,
    cooldownMs: 4000,
    windowMs: 500,
    allowedTypes: ['stamina', 'defense'],
    damageMultiplier: 1.2,
    lockMs: 300,                    // the ceiling exactly
  },
];

/**
 * The combos a bey of this type may hold.
 *
 * `ComboDetector` caps attachment at `COMBO_SLOTS`, so this filters rather
 * than hands over everything — a stamina bey holding the attack table would
 * have the slots but not the business.
 */
export function combosFor(beyType: string): readonly ComboDef[] {
  return BASE_COMBOS.filter(
    c => c.allowedTypes.length === 0 || (c.allowedTypes as readonly string[]).includes(beyType),
  );
}
