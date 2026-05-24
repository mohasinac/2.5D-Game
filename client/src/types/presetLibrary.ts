// Phase 23 — Universal Preset Library type definitions.

export interface ArenaFeatureGroupInstance {
  featureType: string;
  configSnapshot: unknown;
  relativeX_cm: number;
  relativeY_cm: number;
  floorIndex: number;
}

export interface ArenaFeatureGroupTemplate {
  id: string;
  name: string;
  description: string;
  features: ArenaFeatureGroupInstance[];
}

export interface PresetDoc<T = unknown> {
  id: string;
  name: string;
  tags: string[];
  thumbnail?: string;
  description?: string;
  data: T;
  createdAt?: unknown;
  updatedAt?: unknown;
}
