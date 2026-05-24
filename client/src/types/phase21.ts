// Phase 21 Unified Foundation — shared type definitions.
// Imported by admin pages, game hooks, and server physics (cross-boundary import).

// ── Geometry Pillar ──���───────────────────────────────────────────────────────

export type GeometryType =
  | "circle"
  | "ring"
  | "polygon"
  | "arc_segment"
  | "bezier"
  | "fourier"
  | "composite"
  | "point";

export interface GeometryDef {
  id: string;
  name: string;
  type: GeometryType;
  description?: string;
  boundingRadius: number;
  offsetX?: number;
  offsetY?: number;
  rotation?: number;
  // Per-shape discriminated data stored in `shape`:
  shape?: {
    radius?: number;                           // circle
    innerRadius?: number;                      // ring
    outerRadius?: number;                      // ring
    vertices?: { x: number; y: number }[];    // polygon
    arcStart?: number;                         // arc_segment (degrees)
    arcEnd?: number;                           // arc_segment
    radiusInner?: number;                      // arc_segment
    radiusOuter?: number;                      // arc_segment
    lineThickness?: number;                    // arc_segment
    controlPoints?: { x: number; y: number }[];// bezier
    resolution?: number;                       // bezier
    harmonics?: number[];                      // fourier
    phases?: number[];                         // fourier
    children?: GeometryRef[];                  // composite
  };
}

export interface GeometryRef {
  geometryId: string;
  offsetX?: number;
  offsetY?: number;
  rotation?: number;
  scale?: number;
}

// ── Stat Pillar ─────────────────────────��────────────────────────────────────

export type StatCategory = "beyblade" | "arena" | "part" | "match" | "modifier";
export type StatValueType = "float" | "int" | "bool";

export interface StatDef {
  id: string;           // dot-namespaced: "bey.attack", "arena.stamina_drain_mult"
  name: string;
  category: StatCategory;
  type: StatValueType;
  min: number;
  max: number;
  default: number;
  step?: number;
  unit?: string;        // "rpm" | "px/s" | "multiplier" | "degrees" | "cm" | "%"
  formula?: string;
  description: string;
  affectsPhysics: boolean;
}

export type StatOperation = "add" | "multiply" | "set" | "clamp";

export interface StatModifier {
  statDefId: string;
  operation: StatOperation;
  value: number;
  condition?: string;
  duration?: number;   // ms; undefined = permanent
  priority?: number;
  sourceLabel?: string;
}

// ── Behavior / Mechanic Pillar ──────────────────��─────────────────────────────

export interface MechanicInstance {
  mechanicId: string;
  params?: Record<string, unknown>;
  condition?: string;
  duration?: number;
  priority?: number;
  sourceLabel?: string;
}

export interface BehaviorDefDoc {
  id: string;
  name: string;
  description: string;
  behaviorType: string;
  parameters?: Record<string, unknown>;
}
