// [CLIENT] Combo registry — mirrors src/constants/combos.ts. Keep in sync.
// Server is the source of truth for detection / cost / effect. The client uses
// this only for HUD rendering + picker preview.

export type ComboKey =
  | "moveLeft" | "moveRight" | "moveUp" | "moveDown"
  | "attack"   | "defense"   | "dodge"
  | "jump";

export type ComboType = "attack" | "defense" | "stamina" | "balanced" | "universal";

export interface ComboDisplay {
  id: string;
  name: string;
  sequence: [ComboKey, ComboKey, ComboKey];
  cost: 0 | 15 | 25 | 35;
  type: ComboType;
  description: string;
  cooldownMs: number;
}

export const COMBO_REGISTRY: ComboDisplay[] = [
  { id: "quick-dash-l", name: "Quick Dash Left",  sequence: ["moveLeft","moveLeft","attack"],   cost: 0,  type: "universal", description: "Short leftward dash with a contact pop. Free.",        cooldownMs: 800 },
  { id: "quick-dash-r", name: "Quick Dash Right", sequence: ["moveRight","moveRight","attack"], cost: 0,  type: "universal", description: "Short rightward dash with a contact pop. Free.",       cooldownMs: 800 },
  { id: "guard-tap",    name: "Guard Tap",        sequence: ["defense","defense","defense"],    cost: 0,  type: "universal", description: "Quick triple-tap guard. Free; no offensive bonus.",    cooldownMs: 1000 },
  { id: "feint",        name: "Feint",            sequence: ["moveLeft","moveRight","defense"], cost: 0,  type: "universal", description: "Side-step then brace. Free; opens counter-windows.",   cooldownMs: 1200 },
  { id: "riposte",      name: "Riposte",          sequence: ["defense","defense","attack"],     cost: 15, type: "defense",   description: "Defensive parry into a 1.3x counter. Costs 15.",       cooldownMs: 2500 },
  { id: "pivot-strike", name: "Pivot Strike",     sequence: ["moveLeft","moveRight","attack"],  cost: 15, type: "balanced",  description: "Quick pivot into a 1.25x strike. Costs 15.",            cooldownMs: 2500 },
  { id: "power-thrust", name: "Power Thrust",     sequence: ["attack","attack","attack"],       cost: 25, type: "universal", description: "Three-tap commit attack — 1.5x for 0.8s. Costs 25.",     cooldownMs: 3500 },
  { id: "spin-leech-jab", name: "Spin-Leech Jab", sequence: ["moveLeft","attack","moveRight"],  cost: 35, type: "stamina",   description: "Stamina-only. Light hit + 8% spin steal. Costs 35.",   cooldownMs: 4500 },
];

const BY_ID = new Map<string, ComboDisplay>(COMBO_REGISTRY.map(c => [c.id, c]));

export function getComboDisplay(id: string): ComboDisplay | undefined {
  return BY_ID.get(id);
}

// Friendly key labels for HUD chips.
export const KEY_LABEL: Record<ComboKey, string> = {
  moveLeft:  "←",
  moveRight: "→",
  moveUp:    "↑",
  moveDown:  "↓",
  attack:    "J",
  defense:   "K",
  dodge:     "L",
  jump:      "I",
};

export function costIcon(cost: number): string {
  if (cost === 0) return "⚡";
  return `🔋${cost}`;
}
