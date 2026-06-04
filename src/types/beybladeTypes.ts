export type BeyMaterial = 'plastic' | 'metal' | 'rubber' | 'resin' | 'custom';
export type SpinDir = 'left' | 'right';
export type ViewMode = 'hitbox' | 'both' | 'present';

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
  presentationSTLb64?: string;
  presentationColor: number;
}

export interface GroupData {
  id: string;
  name: string;
  childIds: string[];       // part IDs or nested group IDs
}

export interface BeybladeBuildConfig {
  version: 1;
  axis: AxisData;
  rootChildIds: string[];
  groups: GroupData[];
  parts: PartData[];
  sectors: SectorData[];
  partSeq: number;
  sectorSeq: number;
  groupSeq: number;
}
