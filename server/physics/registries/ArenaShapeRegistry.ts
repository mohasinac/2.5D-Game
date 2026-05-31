/**
 * ArenaShapeRegistry — 10 arena boundary shapes from INDEX_E arena case studies.
 * Shape defines the collision boundary polygon for arena containment.
 *
 * TypeScript constants — never loaded from Firestore.
 */

export interface ArenaShapeProfile {
  id: string;
  label: string;
  vertexCount: number;        // number of polygon vertices (0 = circle)
  symmetryFolds: number;      // rotational symmetry (circle=∞, hexagon=6, etc.)
  ringOutFactor: number;      // multiplier on ring-out threshold distance (relative to radius)
  description: string;
}

export const ArenaShapeRegistry: Record<string, ArenaShapeProfile> = {
  circle: {
    id: "circle",
    label: "Circle",
    vertexCount: 0,       // 0 = continuous circle
    symmetryFolds: 0,     // 0 = infinite symmetry
    ringOutFactor: 1.0,
    description: "Standard circular arena — most common BBA/BX stadium shape",
  },
  hexagon: {
    id: "hexagon",
    label: "Hexagon",
    vertexCount: 6,
    symmetryFolds: 6,
    ringOutFactor: 0.93,  // corners slightly closer to center
    description: "6-sided hexagonal arena — angled walls create corner pockets",
  },
  octagon: {
    id: "octagon",
    label: "Octagon",
    vertexCount: 8,
    symmetryFolds: 8,
    ringOutFactor: 0.96,
    description: "8-sided arena — near-circular; subtle corner effects",
  },
  square: {
    id: "square",
    label: "Square",
    vertexCount: 4,
    symmetryFolds: 4,
    ringOutFactor: 0.87,  // corners are significantly closer
    description: "Square arena — sharp 90° corners; high-recoil corner traps",
  },
  pentagon: {
    id: "pentagon",
    label: "Pentagon",
    vertexCount: 5,
    symmetryFolds: 5,
    ringOutFactor: 0.91,
    description: "5-sided arena — asymmetric feel; no direct opposite walls",
  },
  star: {
    id: "star",
    label: "Star",
    vertexCount: 10,     // 5 outer + 5 inner vertices
    symmetryFolds: 5,
    ringOutFactor: 0.80, // inner valleys create ring-out traps
    description: "Star-shaped arena — outer points create ring-out traps; inner valleys create hazard zones",
  },
  stadium_bba: {
    id: "stadium_bba",
    label: "BBA Stadium",
    vertexCount: 0,
    symmetryFolds: 0,
    ringOutFactor: 1.0,
    description: "Classic BBA tournament stadium — standard circle with pocket at center",
  },
  stadium_bx: {
    id: "stadium_bx",
    label: "BX Xtreme Stadium",
    vertexCount: 0,
    symmetryFolds: 0,
    ringOutFactor: 1.0,
    description: "BX Xtreme Stadium — circle with X-Line gear rails built into the floor",
  },
  triangle: {
    id: "triangle",
    label: "Triangle",
    vertexCount: 3,
    symmetryFolds: 3,
    ringOutFactor: 0.82,
    description: "Triangular arena — most extreme corner traps; high-chaos environment",
  },
  oval: {
    id: "oval",
    label: "Oval",
    vertexCount: 0,      // ellipse (parameterized, not polygon)
    symmetryFolds: 2,
    ringOutFactor: 1.0,
    description: "Oval/ellipse arena — elongated field; directional momentum asymmetry",
  },
};

/**
 * Resolve arena shape by ID. Fallback to 'circle' for unknown shapes.
 */
export function resolveArenaShape(shapeId: string): ArenaShapeProfile {
  if (ArenaShapeRegistry[shapeId]) return ArenaShapeRegistry[shapeId];
  console.warn(`[ArenaShapeRegistry] Unknown shapeId "${shapeId}" — defaulting to circle`);
  return ArenaShapeRegistry["circle"];
}
