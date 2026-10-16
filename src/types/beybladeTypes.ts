import { PresentConfig, defaultPresentConfig, ParticleConfig, defaultParticleConfig } from './sharedTypes';
export type { PresentConfig, ParticleConfig };
export { defaultPresentConfig, defaultParticleConfig };

export type BeyMaterial = 'plastic' | 'metal' | 'rubber' | 'resin' | 'custom';
export type SpinDir = 'left' | 'right';
export type ViewMode = 'hitbox' | 'both' | 'present';

/* GIMMICKS ARE DEFINED BY THE SIMULATION NOW, not here.
   The union used to be declared on this line, which meant the physics had to
   import the editor's data model to know what a gimmick is — backwards, and
   it is part of why nothing ever dispatched on it. `sim/step/gimmick.ts` owns
   the vocabulary because it owns the behaviour; this re-export keeps
   `PartData.gimmickType` typed and the builder's dropdown unchanged. */
export type { GimmickType } from '../sim/step/gimmick';
export { GIMMICK_TYPES, GIMMICK_LABELS } from '../sim/step/gimmick';
import type { GimmickType } from '../sim/step/gimmick';

// The spin axis is always a straight line.
// pivotOffset = cm above the ground contact point where the tilt pivot is fixed.
export interface AxisData {
  tiltAngle: number;    // 0–45°
  pivotOffset: number;  // cm
  spinDir: SpinDir;
}

export interface SectorData {
  id: string;
  name: string;
  startAngle: number;       // degrees
  endAngle: number;         // degrees; arc = endAngle − startAngle (max 360)
  height: number;           // cm
  topRadiusX: number;       // cm
  topRadiusZ: number;       // cm
  bottomRadiusX: number;    // cm
  bottomRadiusZ: number;    // cm
  isHollow: boolean;
  innerTopRadiusX: number;
  innerTopRadiusZ: number;
  innerBottomRadiusX: number;
  innerBottomRadiusZ: number;
  material: BeyMaterial;
  weight: number;           // grams; Σ all sectors of a part must equal part.weight
  color: number;            // 0xRRGGBB
}

export interface PartData {
  id: string;
  name: string;
  isHollow: boolean;
  freeSpin: boolean;        // does not rotate with axis during spin animation
  axisOffsetY: number;      // cm — base Y of this part along the spin axis
  height: number;           // cm
  topRadiusX: number;
  topRadiusZ: number;
  bottomRadiusX: number;
  bottomRadiusZ: number;
  innerTopRadiusX: number;
  innerTopRadiusZ: number;
  innerBottomRadiusX: number;
  innerBottomRadiusZ: number;
  sectorIds: string[];      // empty → render as single full frustum; else render sectors
  material: BeyMaterial;
  weight: number;           // grams
  color: number;
  present: PresentConfig;
  particleConfig: ParticleConfig;
  // NFS-style stats (0–100 each)
  attack:          number;
  defense:         number;
  stamina:         number;
  speed:           number;
  gimmickType:     GimmickType;
  gimmickStrength: number;  // 0–100; scales gimmick effect magnitude
}

export interface LayerData {
  id:               string;
  name:             string;
  heightFromBottom: number;  // cm — Y position of this layer's bottom edge
  partIds:          string[];
}

export interface GroupData {
  id: string;
  name: string;
  childIds: string[];       // part IDs or nested group IDs
}

export interface BeybladeBuildConfig {
  v?: number;
  axis: AxisData;
  rootChildIds: string[];
  groups: GroupData[];
  parts: PartData[];
  sectors: SectorData[];
  partSeq: number;
  sectorSeq: number;
  groupSeq: number;
  layers?: LayerData[];
  layerSeq?: number;
}
