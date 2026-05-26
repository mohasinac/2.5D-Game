// Character ID constants — these are the npcIds seeded in rpg_npcs.
// New characters are added by adding new rpg_npcs documents; no code change needed.
export const CHARACTERS = {
  TYSON: "tyson",
  KAI: "kai",
  RAY: "ray",
  MAX: "max",
  KENNY: "kenny",
  HILARY: "hilary",
  CARLOS: "carlos",
  BILLY: "billy",
  MARIAM: "mariam",
  JOSEPH: "joseph",
  TALA: "tala",
  BRYAN: "bryan",
  SPENCER: "spencer",
  IAN: "ian",
  BORIS: "boris",
  VOLTAIRE: "voltaire",
  BROOKLYN: "brooklyn",
  MYSTEL: "mystel",
  MING_MING: "ming_ming",
  GARLAND: "garland",
} as const;

export type CharacterId = (typeof CHARACTERS)[keyof typeof CHARACTERS];
