export interface ZoneBonus {
  hazardType: string;
  stat: string;
  value: number;
  mode: "mult" | "flat";
}

export interface ElementTypeConfig {
  id: string;
  name: string;
  icon: string;
  color: string;
  isDefault: boolean;
  zoneImmunities: string[];
  zoneBonuses: ZoneBonus[];
  attackAdvantages: Record<string, number>;
  createdAt?: string;
  updatedAt?: string;
}
