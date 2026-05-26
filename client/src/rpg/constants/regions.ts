// Region ID constants — valid values come from rpg_regions Firestore collection.
export const REGIONS = {
  JAPAN: "japan",
  CHINA: "china",
  RUSSIA: "russia",
  USA: "usa",
  EUROPE: "europe",
  TOURNAMENT_ISLANDS: "tournament-islands",
  HIDDEN_TRAINING: "hidden-training",
} as const;

export type RegionId = (typeof REGIONS)[keyof typeof REGIONS];
