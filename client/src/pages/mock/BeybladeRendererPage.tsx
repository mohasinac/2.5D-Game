// @refresh reset
import { useEffect, useRef, useState, useCallback } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

// ── Units ─────────────────────────────────────────────────────────────────────
const CM = 1;
const MM = 0.1;
const GRID = 8 * CM;
const u = (mm: number) => mm * MM; // mm → THREE.js

// ── Shape list ────────────────────────────────────────────────────────────────
const SHAPES = [
  // ── Solid ──────────────────────────────────────────────────
  { id: "cylinder",        label: "Cylinder" },
  { id: "disc",            label: "Disc" },
  { id: "cone",            label: "Cone" },
  { id: "frustum",         label: "Frustum" },
  { id: "sphere",          label: "Sphere" },
  { id: "hemisphere",      label: "Hemisphere" },
  { id: "ring",            label: "Ring (Torus)" },
  { id: "torus_knot",      label: "Torus Knot" },
  { id: "box",             label: "Box" },
  { id: "capsule",         label: "Capsule" },
  { id: "prism_hex",       label: "Hex Prism" },
  { id: "prism_oct",       label: "Oct Prism" },
  { id: "pyramid",         label: "Pyramid" },
  { id: "lathe_bowl",      label: "Lathe — Bowl" },
  { id: "lathe_vase",      label: "Lathe — Vase" },
  { id: "lathe_disc",      label: "Lathe — Disc" },
  { id: "lathe_tip",       label: "Lathe — Tip" },
  { id: "dodecahedron",    label: "Dodecahedron" },
  { id: "icosahedron",     label: "Icosahedron" },
  { id: "octahedron",      label: "Octahedron" },
  { id: "tetrahedron",     label: "Tetrahedron" },
  // ── Hollow ─────────────────────────────────────────────────
  { id: "hollow_cylinder", label: "Hollow — Cylinder (Tube)" },
  { id: "hollow_disc",     label: "Hollow — Disc (Annulus)" },
  { id: "hollow_box",      label: "Hollow — Box" },
  { id: "hollow_hex",      label: "Hollow — Hex Prism" },
  { id: "hollow_frustum",  label: "Hollow — Frustum (Shell)" },
  // ── Extruded 2-D ───────────────────────────────────────────
  { id: "extrude_triangle",   label: "Extrude — Triangle" },
  { id: "extrude_trapezoid",  label: "Extrude — Trapezoid" },
  { id: "extrude_ngon",       label: "Extrude — N-Gon" },
  { id: "extrude_star",       label: "Extrude — Star" },
  { id: "extrude_wedge",      label: "Extrude — Wedge (right-angle)" },
  { id: "extrude_lshape",     label: "Extrude — L-Shape" },
  { id: "extrude_ellipse",    label: "Extrude — Ellipse (Oval disc)" },
  // ── Oval / Ellipsoidal ─────────────────────────────────────
  { id: "ellipsoid",          label: "Ellipsoid (3-D oval)" },
  // ── Image-traced ───────────────────────────────────────────
  { id: "silhouette",         label: "Silhouette (traced from image)" },
] as const;
type ShapeId = typeof SHAPES[number]["id"];

interface ParamDef {
  key: string; label: string; min: number; max: number; step: number; unit: string; default: number;
}
const ROT_PARAMS: ParamDef[] = [
  { key: "rotX", label: "Rotation X", min: -180, max: 180, step: 1, unit: "°", default: 0 },
  { key: "rotY", label: "Rotation Y", min: -180, max: 180, step: 1, unit: "°", default: 0 },
  { key: "rotZ", label: "Rotation Z", min: -180, max: 180, step: 1, unit: "°", default: 0 },
];
const POS_PARAMS: ParamDef[] = [
  { key: "posX", label: "X  (left / right)",    min: -40, max: 40, step: 0.5, unit: "mm", default: 0 },
  { key: "posY", label: "Y  (front / back)",    min: -40, max: 40, step: 0.5, unit: "mm", default: 0 },
  { key: "posZ", label: "Z  height (spin axis)", min: 0,  max: 80, step: 0.5, unit: "mm", default: 0 },
];
const SHAPE_PARAMS: Record<ShapeId, ParamDef[]> = {
  cylinder:     [
    { key: "radiusTop",    label: "Radius Top",    min: 1, max: 40, step: 0.5, unit: "mm", default: 15 },
    { key: "radiusBottom", label: "Radius Bottom", min: 1, max: 40, step: 0.5, unit: "mm", default: 15 },
    { key: "height",       label: "Height",        min: 1, max: 80, step: 0.5, unit: "mm", default: 25 },
  ],
  disc: [
    { key: "radius",    label: "Radius",    min: 1, max: 40, step: 0.5, unit: "mm", default: 30 },
    { key: "thickness", label: "Thickness", min: 0.5, max: 20, step: 0.5, unit: "mm", default: 4 },
  ],
  cone: [
    { key: "radius", label: "Radius", min: 1, max: 40, step: 0.5, unit: "mm", default: 15 },
    { key: "height", label: "Height", min: 1, max: 80, step: 0.5, unit: "mm", default: 30 },
  ],
  frustum: [
    { key: "radiusTop",    label: "Radius Top",    min: 0.5, max: 40, step: 0.5, unit: "mm", default: 8 },
    { key: "radiusBottom", label: "Radius Bottom", min: 1,   max: 40, step: 0.5, unit: "mm", default: 15 },
    { key: "height",       label: "Height",        min: 1,   max: 80, step: 0.5, unit: "mm", default: 25 },
  ],
  sphere:       [{ key: "radius", label: "Radius", min: 1, max: 40, step: 0.5, unit: "mm", default: 15 }],
  hemisphere:   [{ key: "radius", label: "Radius", min: 1, max: 40, step: 0.5, unit: "mm", default: 15 }],
  ring: [
    { key: "torusRadius", label: "Torus Radius", min: 2, max: 35, step: 0.5, unit: "mm", default: 20 },
    { key: "tubeRadius",  label: "Tube Radius",  min: 1, max: 15, step: 0.5, unit: "mm", default: 5 },
  ],
  torus_knot: [
    { key: "radius", label: "Radius", min: 2,   max: 30, step: 0.5, unit: "mm", default: 15 },
    { key: "tube",   label: "Tube",   min: 0.5, max: 10, step: 0.5, unit: "mm", default: 3 },
    { key: "p",      label: "P",      min: 1,   max: 10, step: 1,   unit: "",   default: 2 },
    { key: "q",      label: "Q",      min: 1,   max: 10, step: 1,   unit: "",   default: 3 },
  ],
  box: [
    { key: "width",  label: "Width",  min: 1, max: 80, step: 0.5, unit: "mm", default: 25 },
    { key: "height", label: "Height", min: 1, max: 80, step: 0.5, unit: "mm", default: 25 },
    { key: "depth",  label: "Depth",  min: 1, max: 80, step: 0.5, unit: "mm", default: 25 },
  ],
  capsule: [
    { key: "radius", label: "Radius", min: 1, max: 30, step: 0.5, unit: "mm", default: 10 },
    { key: "length", label: "Length", min: 1, max: 60, step: 0.5, unit: "mm", default: 20 },
  ],
  prism_hex:    [
    { key: "radius", label: "Radius", min: 1, max: 40, step: 0.5, unit: "mm", default: 15 },
    { key: "height", label: "Height", min: 1, max: 80, step: 0.5, unit: "mm", default: 25 },
  ],
  prism_oct:    [
    { key: "radius", label: "Radius", min: 1, max: 40, step: 0.5, unit: "mm", default: 15 },
    { key: "height", label: "Height", min: 1, max: 80, step: 0.5, unit: "mm", default: 25 },
  ],
  pyramid:      [
    { key: "radius", label: "Radius", min: 1, max: 40, step: 0.5, unit: "mm", default: 15 },
    { key: "height", label: "Height", min: 1, max: 80, step: 0.5, unit: "mm", default: 30 },
  ],
  lathe_bowl:   [
    { key: "radius", label: "Radius", min: 5, max: 40, step: 0.5, unit: "mm", default: 20 },
    { key: "height", label: "Height", min: 5, max: 60, step: 0.5, unit: "mm", default: 25 },
  ],
  lathe_vase:   [
    { key: "radius", label: "Radius", min: 5, max: 40, step: 0.5, unit: "mm", default: 20 },
    { key: "height", label: "Height", min: 5, max: 60, step: 0.5, unit: "mm", default: 30 },
  ],
  lathe_disc:   [
    { key: "radius",    label: "Radius",    min: 5,   max: 40, step: 0.5, unit: "mm", default: 28 },
    { key: "thickness", label: "Thickness", min: 0.5, max: 15, step: 0.5, unit: "mm", default: 5 },
  ],
  lathe_tip:    [
    { key: "radius", label: "Radius", min: 1, max: 20, step: 0.5, unit: "mm", default: 8 },
    { key: "height", label: "Height", min: 2, max: 40, step: 0.5, unit: "mm", default: 15 },
  ],
  dodecahedron:    [{ key: "radius", label: "Radius", min: 1, max: 40, step: 0.5, unit: "mm", default: 15 }],
  icosahedron:     [{ key: "radius", label: "Radius", min: 1, max: 40, step: 0.5, unit: "mm", default: 15 }],
  octahedron:      [{ key: "radius", label: "Radius", min: 1, max: 40, step: 0.5, unit: "mm", default: 15 }],
  tetrahedron:     [{ key: "radius", label: "Radius", min: 1, max: 40, step: 0.5, unit: "mm", default: 15 }],
  // ── Hollow ──
  hollow_cylinder: [
    { key: "outerRadius", label: "Outer Radius", min: 2, max: 40, step: 0.5, unit: "mm", default: 20 },
    { key: "innerRadius", label: "Inner Radius", min: 1, max: 38, step: 0.5, unit: "mm", default: 14 },
    { key: "height",      label: "Height",       min: 1, max: 80, step: 0.5, unit: "mm", default: 25 },
  ],
  hollow_disc: [
    { key: "outerRadius", label: "Outer Radius", min: 2,   max: 40, step: 0.5, unit: "mm", default: 28 },
    { key: "innerRadius", label: "Inner Radius", min: 1,   max: 38, step: 0.5, unit: "mm", default: 18 },
    { key: "thickness",   label: "Thickness",    min: 0.5, max: 20, step: 0.5, unit: "mm", default: 5  },
  ],
  hollow_box: [
    { key: "width",         label: "Width",          min: 4, max: 80, step: 0.5, unit: "mm", default: 30 },
    { key: "depth",         label: "Depth",          min: 4, max: 80, step: 0.5, unit: "mm", default: 30 },
    { key: "height",        label: "Height",         min: 4, max: 80, step: 0.5, unit: "mm", default: 20 },
    { key: "wallThickness", label: "Wall Thickness", min: 1, max: 20, step: 0.5, unit: "mm", default: 3  },
  ],
  hollow_hex: [
    { key: "outerRadius", label: "Outer Radius", min: 2, max: 40, step: 0.5, unit: "mm", default: 20 },
    { key: "innerRadius", label: "Inner Radius", min: 1, max: 38, step: 0.5, unit: "mm", default: 13 },
    { key: "height",      label: "Height",       min: 1, max: 80, step: 0.5, unit: "mm", default: 20 },
  ],
  hollow_frustum: [
    { key: "outerRadiusBottom", label: "Outer R — Bottom", min: 2, max: 40, step: 0.5, unit: "mm", default: 20 },
    { key: "outerRadiusTop",    label: "Outer R — Top",    min: 1, max: 40, step: 0.5, unit: "mm", default: 12 },
    { key: "wallThickness",     label: "Wall Thickness",   min: 1, max: 15, step: 0.5, unit: "mm", default: 3  },
    { key: "height",            label: "Height",           min: 1, max: 80, step: 0.5, unit: "mm", default: 25 },
  ],
  // ── Extruded 2-D ──
  extrude_triangle: [
    { key: "base",   label: "Base Width",  min: 1, max: 80, step: 0.5, unit: "mm", default: 20 },
    { key: "depth",  label: "Depth",       min: 1, max: 80, step: 0.5, unit: "mm", default: 20 },
    { key: "height", label: "Height",      min: 1, max: 80, step: 0.5, unit: "mm", default: 8  },
  ],
  extrude_trapezoid: [
    { key: "bottomW", label: "Bottom Width", min: 1, max: 80, step: 0.5, unit: "mm", default: 20 },
    { key: "topW",    label: "Top Width",    min: 1, max: 80, step: 0.5, unit: "mm", default: 10 },
    { key: "depth",   label: "Depth",        min: 1, max: 80, step: 0.5, unit: "mm", default: 12 },
    { key: "height",  label: "Height",       min: 1, max: 80, step: 0.5, unit: "mm", default: 8  },
  ],
  extrude_ngon: [
    { key: "sides",  label: "Sides",  min: 3,  max: 16, step: 1,   unit: "",   default: 5  },
    { key: "radius", label: "Radius", min: 1,  max: 40, step: 0.5, unit: "mm", default: 15 },
    { key: "height", label: "Height", min: 1,  max: 80, step: 0.5, unit: "mm", default: 8  },
  ],
  extrude_star: [
    { key: "points",  label: "Points",       min: 3,   max: 12, step: 1,   unit: "",   default: 5  },
    { key: "outerR",  label: "Outer Radius", min: 2,   max: 40, step: 0.5, unit: "mm", default: 18 },
    { key: "innerR",  label: "Inner Radius", min: 1,   max: 38, step: 0.5, unit: "mm", default: 8  },
    { key: "height",  label: "Height",       min: 1,   max: 80, step: 0.5, unit: "mm", default: 8  },
  ],
  extrude_wedge: [
    { key: "width",  label: "Width",  min: 1, max: 80, step: 0.5, unit: "mm", default: 20 },
    { key: "depth",  label: "Depth",  min: 1, max: 80, step: 0.5, unit: "mm", default: 15 },
    { key: "height", label: "Height", min: 1, max: 80, step: 0.5, unit: "mm", default: 10 },
  ],
  extrude_lshape: [
    { key: "armW",  label: "Arm Width",   min: 1, max: 40, step: 0.5, unit: "mm", default: 8  },
    { key: "armL",  label: "Arm Length",  min: 2, max: 80, step: 0.5, unit: "mm", default: 20 },
    { key: "stemL", label: "Stem Length", min: 2, max: 80, step: 0.5, unit: "mm", default: 15 },
    { key: "height", label: "Height",     min: 1, max: 80, step: 0.5, unit: "mm", default: 8  },
  ],
  extrude_ellipse: [
    { key: "radiusX", label: "Radius X (width)",  min: 1, max: 40, step: 0.5, unit: "mm", default: 20 },
    { key: "radiusY", label: "Radius Y (depth)",  min: 1, max: 40, step: 0.5, unit: "mm", default: 12 },
    { key: "height",  label: "Height",             min: 1, max: 80, step: 0.5, unit: "mm", default: 6  },
  ],
  ellipsoid: [
    { key: "radiusX", label: "Radius X (width)",  min: 1, max: 40, step: 0.5, unit: "mm", default: 15 },
    { key: "radiusY", label: "Radius Y (depth)",  min: 1, max: 40, step: 0.5, unit: "mm", default: 10 },
    { key: "radiusZ", label: "Radius Z (height)", min: 1, max: 40, step: 0.5, unit: "mm", default: 12 },
  ],
  silhouette: [
    { key: "diameter_mm", label: "Outer diameter", min: 5, max: 80, step: 0.5, unit: "mm", default: 40 },
    { key: "thickness",   label: "Thickness",      min: 0.5, max: 20, step: 0.5, unit: "mm", default: 3  },
  ],
};

function defaultShapeParams(id: ShapeId): Record<string, number> {
  const p: Record<string, number> = {};
  SHAPE_PARAMS[id].forEach(d => { p[d.key] = d.default; });
  return p;
}

function buildGeometry(id: ShapeId, p: Record<string, number>): THREE.BufferGeometry {
  switch (id) {
    case "cylinder":    return new THREE.CylinderGeometry(u(p.radiusTop), u(p.radiusBottom), u(p.height), 64);
    case "disc":        return new THREE.CylinderGeometry(u(p.radius), u(p.radius), u(p.thickness), 64);
    case "cone":        return new THREE.ConeGeometry(u(p.radius), u(p.height), 64);
    case "frustum":     return new THREE.CylinderGeometry(u(p.radiusTop), u(p.radiusBottom), u(p.height), 64);
    case "sphere":      return new THREE.SphereGeometry(u(p.radius), 64, 32);
    case "hemisphere":  return new THREE.SphereGeometry(u(p.radius), 64, 32, 0, Math.PI * 2, 0, Math.PI / 2);
    case "ring":        return new THREE.TorusGeometry(u(p.torusRadius), u(p.tubeRadius), 32, 128);
    case "torus_knot":  return new THREE.TorusKnotGeometry(u(p.radius), u(p.tube), 128, 16, p.p, p.q);
    case "box":         return new THREE.BoxGeometry(u(p.width), u(p.height), u(p.depth));
    case "capsule":     return new THREE.CapsuleGeometry(u(p.radius), u(p.length), 16, 32);
    case "prism_hex":   return new THREE.CylinderGeometry(u(p.radius), u(p.radius), u(p.height), 6);
    case "prism_oct":   return new THREE.CylinderGeometry(u(p.radius), u(p.radius), u(p.height), 8);
    case "pyramid":     return new THREE.ConeGeometry(u(p.radius), u(p.height), 4);
    case "lathe_bowl": {
      const R = u(p.radius), H = u(p.height);
      return new THREE.LatheGeometry([
        new THREE.Vector2(0,0), new THREE.Vector2(R*.3,H*.05), new THREE.Vector2(R*.7,H*.2),
        new THREE.Vector2(R,H*.5), new THREE.Vector2(R*1.05,H*.8), new THREE.Vector2(R*.9,H), new THREE.Vector2(0,H),
      ], 64);
    }
    case "lathe_vase": {
      const R = u(p.radius), H = u(p.height);
      return new THREE.LatheGeometry([
        new THREE.Vector2(0,0), new THREE.Vector2(R*.4,H*.1), new THREE.Vector2(R*1.2,H*.3),
        new THREE.Vector2(R*.7,H*.6), new THREE.Vector2(R*.9,H*.85), new THREE.Vector2(R*.6,H),
      ], 64);
    }
    case "lathe_disc": {
      const R = u(p.radius), T = u(p.thickness);
      return new THREE.LatheGeometry([
        new THREE.Vector2(0,0), new THREE.Vector2(R*.5,0), new THREE.Vector2(R,T*.3),
        new THREE.Vector2(R*1.1,T*.5), new THREE.Vector2(R,T*.8), new THREE.Vector2(R*.5,T), new THREE.Vector2(0,T),
      ], 64);
    }
    case "lathe_tip": {
      const R = u(p.radius), H = u(p.height);
      return new THREE.LatheGeometry([
        new THREE.Vector2(u(.5),0), new THREE.Vector2(u(1.5),H*.1), new THREE.Vector2(R*.4,H*.35),
        new THREE.Vector2(R*.6,H*.65), new THREE.Vector2(R*.5,H),
      ], 64);
    }
    case "dodecahedron": return new THREE.DodecahedronGeometry(u(p.radius));
    case "icosahedron":  return new THREE.IcosahedronGeometry(u(p.radius));
    case "octahedron":   return new THREE.OctahedronGeometry(u(p.radius));
    case "tetrahedron":  return new THREE.TetrahedronGeometry(u(p.radius));

    // ── Hollow shapes via ExtrudeGeometry + Shape hole ──────────────────────
    case "hollow_cylinder": {
      const shape = new THREE.Shape();
      shape.absarc(0, 0, u(p.outerRadius), 0, Math.PI * 2, false);
      const hole = new THREE.Path();
      hole.absarc(0, 0, u(Math.min(p.innerRadius, p.outerRadius - 0.5)), 0, Math.PI * 2, true);
      shape.holes.push(hole);
      const geo = new THREE.ExtrudeGeometry(shape, { depth: u(p.height), bevelEnabled: false, curveSegments: 64 });
      geo.rotateX(Math.PI / 2);
      geo.translate(0, -u(p.height) / 2, 0);
      return geo;
    }
    case "hollow_disc": {
      const shape = new THREE.Shape();
      shape.absarc(0, 0, u(p.outerRadius), 0, Math.PI * 2, false);
      const hole = new THREE.Path();
      hole.absarc(0, 0, u(Math.min(p.innerRadius, p.outerRadius - 0.5)), 0, Math.PI * 2, true);
      shape.holes.push(hole);
      const geo = new THREE.ExtrudeGeometry(shape, { depth: u(p.thickness), bevelEnabled: false, curveSegments: 64 });
      geo.rotateX(Math.PI / 2);
      geo.translate(0, -u(p.thickness) / 2, 0);
      return geo;
    }
    case "hollow_box": {
      const hw = u(p.width) / 2, hd = u(p.depth) / 2, wt = u(p.wallThickness);
      const shape = new THREE.Shape();
      shape.moveTo(-hw, -hd); shape.lineTo(hw, -hd);
      shape.lineTo(hw, hd);   shape.lineTo(-hw, hd); shape.closePath();
      const hole = new THREE.Path();
      hole.moveTo(-hw + wt, -hd + wt); hole.lineTo(hw - wt, -hd + wt);
      hole.lineTo(hw - wt, hd - wt);   hole.lineTo(-hw + wt, hd - wt); hole.closePath();
      shape.holes.push(hole);
      const geo = new THREE.ExtrudeGeometry(shape, { depth: u(p.height), bevelEnabled: false });
      geo.rotateX(Math.PI / 2);
      geo.translate(0, -u(p.height) / 2, 0);
      return geo;
    }
    case "hollow_hex": {
      const shape = new THREE.Shape();
      shape.absarc(0, 0, u(p.outerRadius), 0, Math.PI * 2, false);
      const hole = new THREE.Path();
      hole.absarc(0, 0, u(Math.min(p.innerRadius, p.outerRadius - 0.5)), 0, Math.PI * 2, true);
      shape.holes.push(hole);
      const geo = new THREE.ExtrudeGeometry(shape, { depth: u(p.height), bevelEnabled: false, curveSegments: 6 });
      geo.rotateX(Math.PI / 2);
      geo.translate(0, -u(p.height) / 2, 0);
      return geo;
    }
    case "hollow_frustum": {
      const rBot = u(p.outerRadiusBottom), rTop = u(p.outerRadiusTop);
      const wt = u(p.wallThickness), H = u(p.height);
      const points = [
        new THREE.Vector2(rBot - wt, 0),
        new THREE.Vector2(rBot, 0),
        new THREE.Vector2(rTop, H),
        new THREE.Vector2(Math.max(0, rTop - wt), H),
      ];
      const geo = new THREE.LatheGeometry(points, 64);
      geo.translate(0, -H / 2, 0);
      return geo;
    }

    // ── Extruded 2-D shapes ──────────────────────────────────────────────────
    case "extrude_triangle": {
      const hw = u(p.base) / 2, d = u(p.depth) / 2;
      const shape = new THREE.Shape();
      shape.moveTo(-hw, -d); shape.lineTo(hw, -d); shape.lineTo(0, d); shape.closePath();
      const geo = new THREE.ExtrudeGeometry(shape, { depth: u(p.height), bevelEnabled: false });
      geo.rotateX(Math.PI / 2);
      geo.translate(0, -u(p.height) / 2, 0);
      return geo;
    }
    case "extrude_trapezoid": {
      const hb = u(p.bottomW) / 2, ht = u(p.topW) / 2, d = u(p.depth) / 2;
      const shape = new THREE.Shape();
      shape.moveTo(-hb, -d); shape.lineTo(hb, -d);
      shape.lineTo(ht, d);   shape.lineTo(-ht, d); shape.closePath();
      const geo = new THREE.ExtrudeGeometry(shape, { depth: u(p.height), bevelEnabled: false });
      geo.rotateX(Math.PI / 2);
      geo.translate(0, -u(p.height) / 2, 0);
      return geo;
    }
    case "extrude_ngon": {
      const sides = Math.round(p.sides), r = u(p.radius);
      const shape = new THREE.Shape();
      for (let i = 0; i <= sides; i++) {
        const a = (i / sides) * Math.PI * 2;
        const x = r * Math.cos(a), y = r * Math.sin(a);
        i === 0 ? shape.moveTo(x, y) : shape.lineTo(x, y);
      }
      const geo = new THREE.ExtrudeGeometry(shape, { depth: u(p.height), bevelEnabled: false });
      geo.rotateX(Math.PI / 2);
      geo.translate(0, -u(p.height) / 2, 0);
      return geo;
    }
    case "extrude_star": {
      const pts = Math.round(p.points), ro = u(p.outerR), ri = u(Math.min(p.innerR, p.outerR - 0.5));
      const shape = new THREE.Shape();
      for (let i = 0; i < pts * 2; i++) {
        const a = (i / (pts * 2)) * Math.PI * 2 - Math.PI / 2;
        const r = i % 2 === 0 ? ro : ri;
        const x = r * Math.cos(a), y = r * Math.sin(a);
        i === 0 ? shape.moveTo(x, y) : shape.lineTo(x, y);
      }
      shape.closePath();
      const geo = new THREE.ExtrudeGeometry(shape, { depth: u(p.height), bevelEnabled: false });
      geo.rotateX(Math.PI / 2);
      geo.translate(0, -u(p.height) / 2, 0);
      return geo;
    }
    case "extrude_wedge": {
      const hw = u(p.width) / 2, d = u(p.depth);
      // right-angle wedge: full width at base, zero at top-back edge
      const shape = new THREE.Shape();
      shape.moveTo(-hw, 0); shape.lineTo(hw, 0);
      shape.lineTo(hw, d);  shape.closePath();
      const geo = new THREE.ExtrudeGeometry(shape, { depth: u(p.height), bevelEnabled: false });
      geo.rotateX(Math.PI / 2);
      geo.translate(0, -u(p.height) / 2, 0);
      return geo;
    }
    case "extrude_lshape": {
      const aw = u(p.armW), al = u(p.armL), sl = u(p.stemL);
      const shape = new THREE.Shape();
      shape.moveTo(0, 0);   shape.lineTo(al, 0);
      shape.lineTo(al, aw); shape.lineTo(aw, aw);
      shape.lineTo(aw, sl); shape.lineTo(0, sl); shape.closePath();
      const geo = new THREE.ExtrudeGeometry(shape, { depth: u(p.height), bevelEnabled: false });
      geo.rotateX(Math.PI / 2);
      geo.translate(-al / 2, -u(p.height) / 2, -sl / 2);
      return geo;
    }
    case "extrude_ellipse": {
      const shape = new THREE.Shape();
      shape.absellipse(0, 0, u(p.radiusX), u(p.radiusY), 0, Math.PI * 2, false, 0);
      const geo = new THREE.ExtrudeGeometry(shape, { depth: u(p.height), bevelEnabled: false, curveSegments: 64 });
      geo.rotateX(Math.PI / 2);
      geo.translate(0, -u(p.height) / 2, 0);
      return geo;
    }
    case "ellipsoid": {
      // Unit sphere scaled per axis: X=width, Y=Three.js Y=user Z=height, Z=Three.js Z=user Y=depth
      const geo = new THREE.SphereGeometry(1, 64, 32);
      geo.scale(u(p.radiusX), u(p.radiusZ), u(p.radiusY));
      return geo;
    }
    // Silhouette geometry is built by buildSilhouetteGeometry; this fallback should rarely be hit
    case "silhouette":
      return new THREE.CylinderGeometry(u(20), u(20), u(3), 64);
  }
}

// ── Silhouette helpers ────────────────────────────────────────────────────────

type SilhouetteData = { outline: [number,number][]; holes: [number,number][][] };

function extractSilhouettePoints(img: HTMLImageElement, numAngles = 720): SilhouetteData {
  const W = img.naturalWidth, H = img.naturalHeight;
  if (!W || !H) return { outline: [], holes: [] };
  const canvas = document.createElement("canvas");
  canvas.width = W; canvas.height = H;
  const ctx = canvas.getContext("2d")!;
  ctx.drawImage(img, 0, 0);
  const { data } = ctx.getImageData(0, 0, W, H);

  // Bilinear alpha sample for sub-pixel accuracy
  const sampleAlpha = (x: number, y: number): number => {
    const x0 = Math.floor(x), y0 = Math.floor(y);
    const x1 = x0 + 1, y1 = y0 + 1;
    const fx = x - x0, fy = y - y0;
    const get = (xi: number, yi: number) => {
      if (xi < 0 || xi >= W || yi < 0 || yi >= H) return 0;
      return data[(yi * W + xi) * 4 + 3];
    };
    return (1 - fx) * (1 - fy) * get(x0, y0) +
           fx       * (1 - fy) * get(x1, y0) +
           (1 - fx) * fy       * get(x0, y1) +
           fx       * fy       * get(x1, y1);
  };
  const isOpaque = (x: number, y: number): boolean => {
    const xi = x | 0, yi = y | 0;
    if (xi < 0 || xi >= W || yi < 0 || yi >= H) return false;
    return data[(yi * W + xi) * 4 + 3] > 32;
  };

  // ── Centre of mass of opaque pixels ──────────────────────────────────────────
  let sx = 0, sy = 0, cnt = 0;
  for (let y = 0; y < H; y++)
    for (let x = 0; x < W; x++)
      if (isOpaque(x, y)) { sx += x; sy += y; cnt++; }
  if (cnt === 0) return { outline: [], holes: [] };
  const cx0 = sx / cnt, cy0 = sy / cnt;

  // ── Outer contour — scan INWARD from image edge along each ray ───────────
  // Scanning inward finds the outermost opaque boundary even for concave shapes.
  const maxR = Math.sqrt(W * W + H * H);
  const outline: [number, number][] = [];
  for (let i = 0; i < numAngles; i++) {
    const angle = (i / numAngles) * Math.PI * 2;
    const dx = Math.cos(angle), dy = Math.sin(angle);
    // Walk from image boundary inward; first opaque pixel IS the outer boundary
    let foundR = 0;
    for (let r = maxR; r >= 1; r -= 0.5) {
      const px = cx0 + dx * r, py = cy0 + dy * r;
      if (px < 0 || px >= W || py < 0 || py >= H) continue;
      if (sampleAlpha(px, py) > 32) { foundR = r; break; }
    }
    if (foundR > 0) outline.push([dx * foundR, dy * foundR]);
  }

  // ── Flood-fill "outside" transparent pixels from every border pixel ───────
  const N = W * H;
  const outside = new Uint8Array(N);
  const queue: number[] = [];
  const tryEnqueue = (x: number, y: number) => {
    if (x < 0 || x >= W || y < 0 || y >= H) return;
    const idx = y * W + x;
    if (outside[idx] || isOpaque(x, y)) return;
    outside[idx] = 1;
    queue.push(idx);
  };
  for (let x = 0; x < W; x++) { tryEnqueue(x, 0); tryEnqueue(x, H - 1); }
  for (let y = 0; y < H; y++) { tryEnqueue(0, y); tryEnqueue(W - 1, y); }
  let qi = 0;
  while (qi < queue.length) {
    const idx = queue[qi++];
    const x = idx % W, y = (idx / W) | 0;
    tryEnqueue(x - 1, y); tryEnqueue(x + 1, y);
    tryEnqueue(x, y - 1); tryEnqueue(x, y + 1);
  }

  // ── Find hole regions: connected transparent pixels not reached by flood-fill
  const visited = new Uint8Array(N);
  const holes: [number, number][][] = [];
  for (let y = 0; y < H; y++) {
    for (let x = 0; x < W; x++) {
      const idx = y * W + x;
      if (visited[idx] || isOpaque(x, y) || outside[idx]) continue;

      // BFS — collect all pixels of this hole
      const holePixels: [number, number][] = [];
      const hq: number[] = [idx];
      visited[idx] = 1;
      let hqi = 0;
      while (hqi < hq.length) {
        const hidx = hq[hqi++];
        const hx = hidx % W, hy = (hidx / W) | 0;
        holePixels.push([hx, hy]);
        for (const [dx, dy] of [[-1,0],[1,0],[0,-1],[0,1]] as [number,number][]) {
          const nx = hx + dx, ny = hy + dy;
          if (nx < 0 || nx >= W || ny < 0 || ny >= H) continue;
          const nidx = ny * W + nx;
          if (visited[nidx] || isOpaque(nx, ny)) continue;
          visited[nidx] = 1;
          hq.push(nidx);
        }
      }
      if (holePixels.length < 40) continue; // skip noise / tiny gaps

      // ── True centroid of all hole pixels (better than boundary centroid) ──────
      let hcx = 0, hcy = 0;
      for (const [hx, hy] of holePixels) { hcx += hx; hcy += hy; }
      hcx /= holePixels.length; hcy /= holePixels.length;

      // ── Bounding-box diagonal gives a safe max scan radius ───────────────────
      let hxMin = Infinity, hxMax = -Infinity, hyMin = Infinity, hyMax = -Infinity;
      for (const [hx, hy] of holePixels) {
        if (hx < hxMin) hxMin = hx; if (hx > hxMax) hxMax = hx;
        if (hy < hyMin) hyMin = hy; if (hy > hyMax) hyMax = hy;
      }
      const hMaxR = Math.sqrt(
        Math.pow(hxMax - hxMin, 2) + Math.pow(hyMax - hyMin, 2)
      ) / 2 + 4;

      // ── Ray-cast from hole centroid outward — same technique as outer outline ─
      // Scan outward; the boundary is the last transparent pixel before hitting opaque.
      const HOLE_ANGLES = 720;
      const holePts: [number, number][] = [];
      for (let a = 0; a < HOLE_ANGLES; a++) {
        const ang = (a / HOLE_ANGLES) * Math.PI * 2;
        const dx = Math.cos(ang), dy = Math.sin(ang);
        let foundR = 0;
        for (let r = 1; r <= hMaxR; r += 0.5) {
          const px = hcx + dx * r, py = hcy + dy * r;
          if (px < 0 || px >= W || py < 0 || py >= H) break;
          if (sampleAlpha(px, py) > 32) break; // opaque — boundary was one step back
          foundR = r;
        }
        if (foundR > 0) holePts.push([hcx + dx * foundR - cx0, hcy + dy * foundR - cy0]);
      }

      if (holePts.length >= 6) holes.push(holePts);
    }
  }

  return { outline, holes };
}

// Build the THREE.Shape (outline + holes) in XY — shared by the extrusion and the top-face decal.
function buildSilhouetteShape(
  outline: [number,number][],
  holes: [number,number][][],
  params: Record<string, number>,
): THREE.Shape | null {
  if (outline.length < 3) return null;
  const diameterMm = params.diameter_mm ?? 40;
  const maxR = Math.max(...outline.map(([x, y]) => Math.sqrt(x * x + y * y)));
  const scale = maxR > 0 ? u(diameterMm / 2) / maxR : 1;

  const shape = new THREE.Shape();
  outline.forEach(([px, py], i) => {
    const x = px * scale, y = -py * scale; // flip image-Y → Three.js Y
    if (i === 0) shape.moveTo(x, y); else shape.lineTo(x, y);
  });
  shape.closePath();

  for (const holePts of holes) {
    const hole = new THREE.Path();
    [...holePts].reverse().forEach(([px, py], i) => {
      const x = px * scale, y = -py * scale;
      if (i === 0) hole.moveTo(x, y); else hole.lineTo(x, y);
    });
    hole.closePath();
    shape.holes.push(hole);
  }
  return shape;
}

function buildSilhouetteGeometry(
  outline: [number,number][],
  holes: [number,number][][],
  params: Record<string, number>,
): THREE.BufferGeometry {
  const shape = buildSilhouetteShape(outline, holes, params);
  if (!shape) return new THREE.CylinderGeometry(u(20), u(20), u(3), 64);
  const thickness = params.thickness ?? 3;
  const geo = new THREE.ExtrudeGeometry(shape, { depth: u(thickness), bevelEnabled: false });
  geo.rotateX(Math.PI / 2);
  geo.translate(0, -u(thickness) / 2, 0);
  return geo;
}

// ── Material profiles ─────────────────────────────────────────────────────────
const MATERIALS = {
  abs_hard:        { label: "ABS — Hard",          metalness: 0.05, roughness: 0.60, color: 0xdde0e8 },
  rubber_soft:     { label: "Rubber — Soft",        metalness: 0.00, roughness: 0.95, color: 0x1e1e24 },
  rubber_hard:     { label: "Rubber — Hard",        metalness: 0.00, roughness: 0.80, color: 0x2e2e3a },
  metal_zinc:      { label: "Metal — Zinc Alloy",   metalness: 0.85, roughness: 0.25, color: 0xa0a4b8 },
  metal_steel:     { label: "Metal — Steel",        metalness: 0.92, roughness: 0.15, color: 0xc8ccd8 },
  bearing_steel:   { label: "Bearing Steel",        metalness: 0.98, roughness: 0.05, color: 0xe0e4f4 },
  iron_powder_abs: { label: "Iron-Powder ABS",      metalness: 0.35, roughness: 0.50, color: 0x888898 },
  nylon:           { label: "Nylon",                metalness: 0.00, roughness: 0.55, color: 0xf0ede0 },
  polycarbonate:   { label: "Polycarbonate (PC)",   metalness: 0.00, roughness: 0.20, color: 0xe8f4fc },
  pom:             { label: "POM — Delrin",         metalness: 0.08, roughness: 0.35, color: 0xf5f5f8 },
} as const;
type MaterialId = keyof typeof MATERIALS;
const DEFAULT_MAT: MaterialId = "abs_hard";

// ── Rapier collider builder (outside component — uses module-level buildGeometry + u) ──
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function buildRapierCollider(RAPIER: any, part: PartNode): any {
  const p = part.shapeParams;
  switch (part.shape) {
    case "cylinder":
      return RAPIER.ColliderDesc.cylinder(u(p.height) / 2, u(p.radiusTop ?? 15));
    case "disc":
      return RAPIER.ColliderDesc.cylinder(u(p.thickness) / 2, u(p.radius));
    case "cone":
      return RAPIER.ColliderDesc.cone(u(p.height) / 2, u(p.radius));
    case "frustum":
      return RAPIER.ColliderDesc.cone(u(p.height) / 2, u(p.radiusBottom));
    case "sphere":
    case "hemisphere":
      return RAPIER.ColliderDesc.ball(u(p.radius));
    case "ellipsoid":
      return RAPIER.ColliderDesc.ball(u(Math.max(p.radiusX, p.radiusY, p.radiusZ)));
    case "box":
      return RAPIER.ColliderDesc.cuboid(u(p.width) / 2, u(p.height) / 2, u(p.depth) / 2);
    case "capsule":
      return RAPIER.ColliderDesc.capsule(u(p.length) / 2, u(p.radius));
    case "prism_hex":
    case "prism_oct":
      return RAPIER.ColliderDesc.cylinder(u(p.height) / 2, u(p.radius));
    default: {
      // Complex / extruded shapes — extract vertices and use convex hull
      try {
        const geo = buildGeometry(part.shape, part.shapeParams);
        const posAttr = geo.getAttribute("position") as THREE.BufferAttribute;
        const pts = new Float32Array(posAttr.count * 3);
        for (let i = 0; i < posAttr.count; i++) {
          pts[i * 3] = posAttr.getX(i); pts[i * 3 + 1] = posAttr.getY(i); pts[i * 3 + 2] = posAttr.getZ(i);
        }
        geo.dispose();
        return RAPIER.ColliderDesc.convexHull(pts) ?? RAPIER.ColliderDesc.cylinder(u(15) / 2, u(15));
      } catch {
        return RAPIER.ColliderDesc.cylinder(u(15) / 2, u(15));
      }
    }
  }
}

// ── Part data model ───────────────────────────────────────────────────────────
const PART_COLORS = [0x007fff,0xff8800,0x00cc66,0xcc44ff,0xffcc00,0xff44aa,0x00ddff,0xff4444,0x88ff44,0xff6600];

const PART_ROLES = [
  "Spin Axis", "Attack Ring (AR)", "Sub Attack Ring (SAR)", "Weight Disk (WD)",
  "Casing / BB", "Tip", "Bit Chip / Face Bolt", "Blade Base",
  "Engine Gear", "Free Spin Ring", "Ornament / Decoration", "Other",
] as const;
type PartRole = typeof PART_ROLES[number];

interface PartNode {
  id: string; label: string;
  shape: ShapeId; shapeParams: Record<string, number>;
  posX: number; posY: number; posZ: number;
  rotX: number; rotY: number; rotZ: number;
  rotationMode: "inherit" | "own";
  ownRotSpeed: number;
  ownRotAxis: "x" | "y" | "z";
  freeSpin: boolean;
  parentId: string | null;
  colorIndex: number;  // kept for legacy — color field takes precedence
  color: string;       // "#rrggbb" hex — controls both list dot and 3-D mesh
  visible: boolean;    // show/hide in 3D viewport
  materialId: MaterialId;
  weight: number;
  partRole: PartRole;
  silhouettePoints:   [number, number][]; // outer outline — pixel-offsets from centre of mass
  silhouetteHoles:    [number, number][][]; // inner holes in same coordinate space
  silhouetteImageUrl: string; // original data-URL painted on the top face
}

type SavedGroup = { id: string; name: string; parts: PartNode[] };

// Sanitise a raw object from localStorage so every field has a valid default.
function sanitizePart(raw: Record<string, unknown>): PartNode {
  const colorIdx = typeof raw.colorIndex === "number" ? raw.colorIndex % PART_COLORS.length : 0;
  const fallbackHex = "#" + PART_COLORS[colorIdx].toString(16).padStart(6, "0");
  return {
    id:           typeof raw.id === "string"     ? raw.id     : `part_${Date.now()}_${Math.random().toString(36).slice(2)}`,
    label:        typeof raw.label === "string"  ? raw.label  : "Part",
    shape:        SHAPES.some(s => s.id === raw.shape) ? raw.shape as ShapeId : "cylinder",
    shapeParams:  (raw.shapeParams && typeof raw.shapeParams === "object") ? raw.shapeParams as Record<string,number> : {},
    posX:  typeof raw.posX === "number"  ? raw.posX  : 0,
    posY:  typeof raw.posY === "number"  ? raw.posY  : 0,
    posZ:  typeof raw.posZ === "number"  ? raw.posZ  : 0,
    rotX:  typeof raw.rotX === "number"  ? raw.rotX  : 0,
    rotY:  typeof raw.rotY === "number"  ? raw.rotY  : 0,
    rotZ:  typeof raw.rotZ === "number"  ? raw.rotZ  : 0,
    rotationMode: raw.rotationMode === "own" ? "own" : "inherit",
    ownRotSpeed:  typeof raw.ownRotSpeed === "number" ? raw.ownRotSpeed : 2,
    ownRotAxis:   (raw.ownRotAxis === "x" || raw.ownRotAxis === "y") ? raw.ownRotAxis : "z",
    freeSpin:     raw.freeSpin === true,
    parentId:     typeof raw.parentId === "string" ? raw.parentId : null,
    colorIndex:   colorIdx,
    color:        typeof raw.color === "string" && raw.color.startsWith("#") ? raw.color : fallbackHex,
    visible:      raw.visible !== false,  // default true; only false when explicitly set
    materialId:   (raw.materialId as MaterialId) in MATERIALS ? raw.materialId as MaterialId : "abs_hard",
    weight:       typeof raw.weight === "number" ? raw.weight : 0,
    partRole:          PART_ROLES.includes(raw.partRole as PartRole) ? raw.partRole as PartRole : "Other",
    silhouettePoints:   Array.isArray(raw.silhouettePoints) ? raw.silhouettePoints as [number,number][] : [],
    silhouetteHoles:    Array.isArray(raw.silhouetteHoles)  ? raw.silhouetteHoles  as [number,number][][] : [],
    silhouetteImageUrl: typeof raw.silhouetteImageUrl === "string" ? raw.silhouetteImageUrl : "",
  };
}

function makeAxisPart(): PartNode {
  return {
    id: "axis_rod", label: "Spin Axis Rod",
    shape: "cylinder",
    shapeParams: { radiusTop: 1, radiusBottom: 1, height: 80 },
    posX: 0, posY: 0, posZ: 40,
    rotX: 0, rotY: 0, rotZ: 0,
    rotationMode: "inherit", ownRotSpeed: 2, ownRotAxis: "z",
    freeSpin: false, parentId: null, colorIndex: 0,
    color: "#007fff", visible: true,
    materialId: "abs_hard",
    weight: 0, partRole: "Spin Axis", silhouettePoints: [], silhouetteHoles: [], silhouetteImageUrl: "",
  };
}

function makePartNode(id: string, label: string, parentId: string | null, colorIndex: number): PartNode {
  const hex = "#" + PART_COLORS[colorIndex % PART_COLORS.length].toString(16).padStart(6, "0");
  return {
    id, label, shape: "cylinder",
    shapeParams: defaultShapeParams("cylinder"),
    posX: 0, posY: 0, posZ: 12.5,
    rotX: 0, rotY: 0, rotZ: 0,
    rotationMode: "inherit", ownRotSpeed: 2, ownRotAxis: "z",
    freeSpin: false,
    parentId, colorIndex, color: hex, visible: true,
    materialId: DEFAULT_MAT,
    weight: 0, partRole: "Other", silhouettePoints: [], silhouetteHoles: [], silhouetteImageUrl: "",
  };
}

// Map user-space axis ("x"|"y"|"z") to Three.js rotation key.
// User Z (height/spin) = Three.js Y. User Y (depth) = Three.js Z.
const mapRotAxis = (a: "x" | "y" | "z"): "x" | "y" | "z" =>
  a === "z" ? "y" : a === "y" ? "z" : "x";

// ── Helpers ───────────────────────────────────────────────────────────────────
function makeLabel(text: string, color = "#88aaff", size = 128): THREE.Sprite {
  const canvas = document.createElement("canvas");
  canvas.width = size; canvas.height = size / 2;
  const ctx = canvas.getContext("2d")!;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.font = `bold ${size / 4}px monospace`; ctx.fillStyle = color;
  ctx.textAlign = "center"; ctx.textBaseline = "middle";
  ctx.fillText(text, canvas.width / 2, canvas.height / 2);
  const mat = new THREE.SpriteMaterial({ map: new THREE.CanvasTexture(canvas), transparent: true, depthTest: false });
  const s = new THREE.Sprite(mat); s.scale.set(0.6, 0.3, 1); return s;
}

// ── UI sub-components ─────────────────────────────────────────────────────────
const panelBg = "rgba(6,6,18,0.93)";
const border   = "1px solid #1a2244";

function Slider({ def, value, onChange }: { def: ParamDef; value: number; onChange: (v: number) => void }) {
  const [raw, setRaw] = useState(String(value));
  // keep raw in sync when value changes from outside (e.g. preset buttons)
  useEffect(() => { setRaw(String(value)); }, [value]);

  const commit = (s: string) => {
    const n = parseFloat(s);
    if (!isNaN(n)) {
      const clamped = Math.min(def.max, Math.max(def.min, n));
      onChange(clamped);
      setRaw(String(clamped));
    } else {
      setRaw(String(value));
    }
  };

  return (
    <div style={{ marginBottom: 8 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 2 }}>
        <span style={{ color: "#8899bb", fontSize: 10 }}>{def.label}</span>
        <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
          <input
            type="number"
            min={def.min} max={def.max} step={def.step}
            value={raw}
            onChange={e => setRaw(e.target.value)}
            onBlur={e => commit(e.target.value)}
            onKeyDown={e => { if (e.key === "Enter") commit((e.target as HTMLInputElement).value); }}
            style={{
              width: 54, background: "#0a0a1a", border: "1px solid #2244aa",
              color: "#55bbff", fontFamily: "monospace", fontSize: 10,
              borderRadius: 3, padding: "1px 4px", outline: "none", textAlign: "right",
            }}
          />
          <span style={{ color: "#445577", fontSize: 9 }}>{def.unit}</span>
        </div>
      </div>
      <input type="range" min={def.min} max={def.max} step={def.step} value={value}
        onChange={e => { const v = parseFloat(e.target.value); onChange(v); setRaw(String(v)); }}
        style={{ width: "100%", accentColor: "#3366cc", cursor: "pointer" }} />
    </div>
  );
}

function SectionTitle({ children }: { children: string }) {
  return (
    <div style={{ fontSize: 9, color: "#3355aa", letterSpacing: 2, textTransform: "uppercase", marginBottom: 8, marginTop: 6 }}>
      {children}
    </div>
  );
}

function Tab({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  return (
    <button onClick={onClick} style={{
      flex: 1, padding: "5px 0", fontSize: 10, fontFamily: "monospace",
      background: active ? "#1a3366" : "transparent",
      color: active ? "#aaddff" : "#445566",
      border: "none", borderBottom: active ? "1px solid #3366cc" : "1px solid #1a2244",
      cursor: "pointer",
    }}>{label}</button>
  );
}

// ── Tower item (recursive) ────────────────────────────────────────────────────
function TowerItem({
  part, parts, depth, selectedId, groupSel, onSelect, onToggleGroup, onAddChild, onDelete, onToggleVisible,
}: {
  part: PartNode; parts: PartNode[]; depth: number;
  selectedId: string | null; groupSel: Set<string>;
  onSelect: (id: string) => void;
  onToggleGroup: (id: string) => void;
  onAddChild: (parentId: string) => void;
  onDelete: (id: string) => void;
  onToggleVisible: (id: string) => void;
}) {
  const children = parts.filter(p => p.parentId === part.id);
  const isSelected = part.id === selectedId;
  const isChecked = groupSel.has(part.id);
  const isVisible = part.visible !== false;
  const dotColor = part.color ?? "#" + PART_COLORS[part.colorIndex ?? 0].toString(16).padStart(6, "0");

  return (
    <div>
      <div
        onClick={() => onSelect(part.id)}
        style={{
          display: "flex", alignItems: "center", gap: 4,
          padding: "4px 6px", paddingLeft: 6 + depth * 14,
          cursor: "pointer", borderRadius: 4,
          background: isSelected ? "rgba(30,60,120,0.5)" : "transparent",
          border: isSelected ? "1px solid #2244aa" : "1px solid transparent",
          marginBottom: 2,
        }}
      >
        <input type="checkbox" checked={isChecked}
          onClick={e => e.stopPropagation()}
          onChange={() => onToggleGroup(part.id)}
          style={{ accentColor: "#55aaff", cursor: "pointer", flexShrink: 0, width: 12, height: 12 }} />
        <span style={{ color: dotColor, fontSize: 13, lineHeight: 1, flexShrink: 0 }}>●</span>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ color: "#ccddeeff", fontSize: 11, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{part.label}</div>
          <div style={{ color: "#445566", fontSize: 9 }}>
            {SHAPES.find(s => s.id === part.shape)?.label} · {MATERIALS[part.materialId]?.label ?? "ABS"}
            {part.freeSpin && <span style={{ color:"#4488cc", marginLeft:4 }}>⟳ free</span>}
          </div>
        </div>
        <div style={{ display: "flex", gap: 3, flexShrink: 0 }}>
          <button onClick={e => { e.stopPropagation(); onToggleVisible(part.id); }}
            title={isVisible ? "Hide in scene" : "Show in scene"}
            style={{ background: isVisible ? "#1a3355" : "#0a0a18", border: "none", color: isVisible ? "#55aaff" : "#334455", cursor: "pointer", borderRadius: 3, padding: "1px 5px", fontSize: 11 }}>
            {isVisible ? "👁" : "🚫"}
          </button>
          <button onClick={e => { e.stopPropagation(); onAddChild(part.id); }}
            title="Add child part"
            style={{ background: "#1a3355", border: "none", color: "#4488cc", cursor: "pointer", borderRadius: 3, padding: "1px 5px", fontSize: 12 }}>+</button>
          <button onClick={e => { e.stopPropagation(); onDelete(part.id); }}
            title="Delete part"
            style={{ background: "#331a1a", border: "none", color: "#cc4444", cursor: "pointer", borderRadius: 3, padding: "1px 5px", fontSize: 12 }}>×</button>
        </div>
      </div>
      {children.map(child => (
        <TowerItem key={child.id} part={child} parts={parts} depth={depth + 1}
          selectedId={selectedId} groupSel={groupSel}
          onSelect={onSelect} onToggleGroup={onToggleGroup}
          onAddChild={onAddChild} onDelete={onDelete} onToggleVisible={onToggleVisible} />
      ))}
    </div>
  );
}

// ── Main component ────────────────────────────────────────────────────────────
export function BeybladeRendererPage() {
  const mountRef        = useRef<HTMLDivElement>(null);
  const canvasRef       = useRef<HTMLCanvasElement>(null);
  const sceneRef        = useRef<THREE.Scene | null>(null);
  const axisRootRef     = useRef<THREE.Group | null>(null);
  const freeSpinRootRef = useRef<THREE.Group | null>(null);
  const threeObjs       = useRef<Map<string, { group: THREE.Group; mesh: THREE.Mesh }>>(new Map());
  const texCache        = useRef<Map<string, THREE.Texture>>(new Map());
  // Holds the latest mesh-rebuild closure so scene setup can call it directly
  const rebuildMeshesRef = useRef<() => void>(() => {});
  const partsRef        = useRef<PartNode[]>([]);
  const spinningRef     = useRef(false);

  // ── Rapier physics refs ───────────────────────────────────────────────────
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const rapierRef       = useRef<any>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const worldRef        = useRef<any>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const axisBodyRef2    = useRef<any>(null);   // Rapier kinematic axis body
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const freeBodiesRef   = useRef<Map<string, any>>(new Map());
  const physicsEnabledRef = useRef(false);

  const LS_KEY = "beyblade_mock_parts";

  const [parts,      setParts]      = useState<PartNode[]>(() => {
    try {
      const raw = JSON.parse(localStorage.getItem(LS_KEY) ?? "[]");
      if (Array.isArray(raw) && raw.length > 0) {
        return (raw as Record<string, unknown>[]).map(sanitizePart);
      }
    } catch { /* corrupt data — fall through */ }
    return [makeAxisPart()];
  });
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [spinning,   setSpinning]   = useState(false);
  const [nextColor,  setNextColor]  = useState(() => {
    try { return (JSON.parse(localStorage.getItem(LS_KEY) ?? "[]") as PartNode[]).length; } catch { return 0; }
  });
  const [tab,        setTab]        = useState<"shape" | "material" | "position" | "rotation" | "spin" | "specs">("shape");
  const [physicsEnabled, setPhysicsEnabled] = useState(false);
  const [spinRPM,  setSpinRPM]  = useState(300);
  const [spinDir,  setSpinDir]  = useState<"cw" | "ccw">("cw");

  const GRP_KEY = "beyblade_mock_groups";
  const [groupSel,    setGroupSel]    = useState<Set<string>>(new Set());
  const [groupName,   setGroupName]   = useState("");
  const [savedGroups, setSavedGroups] = useState<SavedGroup[]>(() => {
    try { return JSON.parse(localStorage.getItem(GRP_KEY) ?? "[]"); } catch { return []; }
  });

  // keep refs in sync with state for use inside tick loop
  useEffect(() => { partsRef.current = parts; },    [parts]);
  useEffect(() => { spinningRef.current = spinning; }, [spinning]);
  useEffect(() => { physicsEnabledRef.current = physicsEnabled; }, [physicsEnabled]);

  // ── Rapier: load WASM once ────────────────────────────────────────────────
  useEffect(() => {
    import("@dimforge/rapier3d-compat").then(async RAPIER => {
      await RAPIER.init();
      rapierRef.current = RAPIER;
    });
  }, []);

  // ── Rapier: rebuild physics world whenever enabled or settings change ─────
  useEffect(() => {
    // Tear down previous world
    if (worldRef.current) { worldRef.current.free?.(); worldRef.current = null; }
    axisBodyRef2.current = null;
    freeBodiesRef.current.clear();

    const RAPIER = rapierRef.current;
    if (!physicsEnabled || !RAPIER) return;

    const world = new RAPIER.World({ x: 0, y: 0, z: 0 }); // no gravity — design tool
    worldRef.current = world;

    // Kinematic axis body — we drive its angular velocity; collisions affect
    // free-spin bodies but never slow the axis (motor always wins).
    const axisDesc = RAPIER.RigidBodyDesc.kinematicVelocityBased();
    const axisBody = world.createRigidBody(axisDesc);
    axisBodyRef2.current = axisBody;

    const omega = (spinRPM / 60) * Math.PI * 2;
    axisBody.setAngvel({ x: 0, y: spinDir === "cw" ? omega : -omega, z: 0 }, true);

    // Add one compound collider per non-free-spin part on the axis body
    const toRP = (px: number, py: number, pz: number) =>
      ({ x: u(px), y: u(pz), z: u(py) }); // same swap as toThree

    partsRef.current.forEach(part => {
      if (part.freeSpin) return;
      const cd = buildRapierCollider(RAPIER, part);
      if (!cd) return;
      const pos = toRP(part.posX, part.posY, part.posZ);
      cd.setTranslation(pos.x, pos.y, pos.z);
      // Apply part orientation as quaternion
      const eq = new THREE.Quaternion().setFromEuler(new THREE.Euler(
        THREE.MathUtils.degToRad(part.rotX),
        THREE.MathUtils.degToRad(part.rotY),
        THREE.MathUtils.degToRad(part.rotZ),
      ));
      cd.setRotation({ x: eq.x, y: eq.y, z: eq.z, w: eq.w });
      world.createCollider(cd, axisBody);
    });

    // One dynamic body per free-spin part, linked by revolute joint (Y axis)
    partsRef.current.forEach(part => {
      if (!part.freeSpin) return;
      const pos = toRP(part.posX, part.posY, part.posZ);
      const bodyDesc = RAPIER.RigidBodyDesc.dynamic()
        .setTranslation(pos.x, pos.y, pos.z)
        .setAngularDamping(0.4); // low friction — bearing-like
      const body = world.createRigidBody(bodyDesc);

      const cd = buildRapierCollider(RAPIER, part);
      if (cd) world.createCollider(cd, body);

      // Revolute joint constrains body to spin only around Y (spin axis)
      const jointData = RAPIER.JointData.revolute(
        pos,                 // anchor on axis body (= world pos of part)
        { x: 0, y: 0, z: 0 }, // anchor on free body (its center)
        { x: 0, y: 1, z: 0 }, // revolute axis = Y
      );
      world.createImpulseJoint(jointData, axisBody, body, true);
      freeBodiesRef.current.set(part.id, body);
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [physicsEnabled, spinRPM, spinDir]);

  // persist to localStorage whenever parts / groups change
  useEffect(() => { localStorage.setItem(LS_KEY, JSON.stringify(parts)); }, [parts]);
  useEffect(() => { localStorage.setItem(GRP_KEY, JSON.stringify(savedGroups)); }, [savedGroups]);

  // ── Part helpers ────────────────────────────────────────────────────────────
  const addPart = useCallback((parentId: string | null) => {
    const id = `part_${Date.now()}`;
    const colorIndex = nextColor % PART_COLORS.length;
    const count = partsRef.current.length + 1;
    setParts(prev => [...prev, makePartNode(id, `Part ${count}`, parentId, colorIndex)]);
    setSelectedId(id);
    setNextColor(c => c + 1);
    setTab("shape");
  }, [nextColor]);

  const deletePart = useCallback((id: string) => {
    const getDescendants = (pid: string, all: PartNode[]): string[] => {
      const kids = all.filter(p => p.parentId === pid).map(p => p.id);
      return [...kids, ...kids.flatMap(k => getDescendants(k, all))];
    };
    setParts(prev => {
      const toDelete = new Set([id, ...getDescendants(id, prev)]);
      return prev.filter(p => !toDelete.has(p.id));
    });
    setSelectedId(null);
  }, []);

  const toggleVisible = useCallback((id: string) => {
    setParts(prev => prev.map(p => p.id === id ? { ...p, visible: p.visible === false } : p));
  }, []);

  const updatePart = useCallback((id: string, changes: Partial<PartNode>) => {
    setParts(prev => prev.map(p => p.id === id ? { ...p, ...changes } : p));
  }, []);

  const toggleGroupSel = useCallback((id: string) => {
    setGroupSel(prev => { const s = new Set(prev); s.has(id) ? s.delete(id) : s.add(id); return s; });
  }, []);

  const saveGroup = useCallback(() => {
    const name = groupName.trim();
    if (!name || groupSel.size === 0) return;
    const groupParts = partsRef.current.filter(p => groupSel.has(p.id));
    setSavedGroups(prev => [...prev, { id: `g_${Date.now()}`, name, parts: groupParts }]);
    setGroupSel(new Set());
    setGroupName("");
  }, [groupName, groupSel]);

  const [loadScale, setLoadScale] = useState(1.0);
  const [loadOffX,  setLoadOffX]  = useState(0);
  const [loadOffY,  setLoadOffY]  = useState(0);
  const [loadOffZ,  setLoadOffZ]  = useState(0);

  const loadGroup = useCallback((group: SavedGroup) => {
    const idMap = new Map<string, string>();
    const ts = Date.now();
    const sc = loadScale;
    const newParts: PartNode[] = group.parts.map((p, i) => {
      const newId = `part_${ts}_${i}`;
      idMap.set(p.id, newId);
      const scaledParams: Record<string, number> = {};
      Object.entries(p.shapeParams).forEach(([k, v]) => { scaledParams[k] = v * sc; });
      return {
        ...p, id: newId,
        shapeParams: scaledParams,
        posX: p.posX * sc + loadOffX,
        posY: p.posY * sc + loadOffY,
        posZ: p.posZ * sc + loadOffZ,
      };
    });
    newParts.forEach(p => { if (p.parentId) p.parentId = idMap.get(p.parentId) ?? null; });
    setParts(prev => [...prev, ...newParts]);
    setNextColor(c => c + newParts.length);
  }, [loadScale, loadOffX, loadOffY, loadOffZ]);

  const deleteGroup = useCallback((id: string) => {
    setSavedGroups(prev => prev.filter(g => g.id !== id));
  }, []);

  const exportGroups = useCallback(() => {
    const json = JSON.stringify(savedGroups, null, 2);
    const blob = new Blob([json], { type: "application/json" });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement("a");
    a.href     = url;
    a.download = `beyblade-presets-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }, [savedGroups]);

  const importGroups = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = ev => {
      try {
        const imported = JSON.parse(ev.target?.result as string) as SavedGroup[];
        if (!Array.isArray(imported)) return;
        // merge — skip any group whose name already exists
        setSavedGroups(prev => {
          const existing = new Set(prev.map(g => g.name));
          const fresh = imported
            .filter(g => g.name && Array.isArray(g.parts))
            .map(g => ({ ...g, id: existing.has(g.name) ? `g_${Date.now()}_${Math.random().toString(36).slice(2)}` : g.id, name: existing.has(g.name) ? `${g.name} (imported)` : g.name }));
          return [...prev, ...fresh];
        });
      } catch { /* invalid JSON — ignore */ }
    };
    reader.readAsText(file);
    e.target.value = ""; // reset so same file can be re-imported
  }, []);

  // ── Sync Three.js scene graph whenever parts change ─────────────────────────
  useEffect(() => {
    // Store the rebuild closure in a ref so scene-setup can call it directly
    // after creating the scene roots — avoiding any state-update race.
    const snapshot = parts; // capture for closure
    rebuildMeshesRef.current = () => {
      const axisRoot     = axisRootRef.current;
      const freeSpinRoot = freeSpinRootRef.current;
      if (!axisRoot || !freeSpinRoot) return;

      // dispose and remove all existing part objects
      threeObjs.current.forEach(({ group }) => {
        group.parent?.remove(group);
        group.traverse(obj => {
          if (obj instanceof THREE.Mesh) {
            obj.geometry.dispose();
            (obj.material as THREE.Material).dispose();
          }
        });
      });
      threeObjs.current.clear();

      // create meshes
      snapshot.forEach(part => {
        const geo = part.shape === "silhouette"
          ? buildSilhouetteGeometry(part.silhouettePoints, part.silhouetteHoles, part.shapeParams)
          : buildGeometry(part.shape, part.shapeParams);
        const mp = MATERIALS[part.materialId ?? DEFAULT_MAT];
        const mat = new THREE.MeshStandardMaterial({
          color: part.color ?? mp.color,
          metalness: mp.metalness,
          roughness: mp.roughness,
        });
        const mesh = new THREE.Mesh(geo, mat);
        mesh.castShadow = true;
        const group = new THREE.Group();
        group.add(mesh);

        // Image decal on top face of silhouette shapes — clipped to exact outline+holes
        if (part.shape === "silhouette" && part.silhouetteImageUrl) {
          const tMm = part.shapeParams.thickness ?? 3;
          const silShape = buildSilhouetteShape(
            part.silhouettePoints, part.silhouetteHoles, part.shapeParams,
          );
          if (silShape) {
            // ShapeGeometry lies in XY plane. rotateX(π/2) makes it lie in XZ (facing +Y),
            // matching the orientation of the extruded geometry's top face exactly.
            const faceGeo = new THREE.ShapeGeometry(silShape);
            faceGeo.rotateX(Math.PI / 2);
            const faceMat = new THREE.MeshBasicMaterial({
              transparent: true, alphaTest: 0.05, side: THREE.DoubleSide,
              depthWrite: false, polygonOffset: true, polygonOffsetFactor: -1, polygonOffsetUnits: -1,
            });
            const faceMesh = new THREE.Mesh(faceGeo, faceMat);
            // ExtrudeGeometry top face sits at y = u(tMm)/2 (after geo.translate(0, -u(tMm)/2, 0))
            faceMesh.position.y = u(tMm) / 2 + 0.0002;
            group.add(faceMesh);

            const applyTex = (url: string, m: THREE.MeshBasicMaterial) => {
              const cached = texCache.current.get(url);
              if (cached) { m.map = cached; m.needsUpdate = true; return; }
              const img = new Image();
              img.onload = () => {
                const tex = new THREE.Texture(img);
                tex.colorSpace = THREE.SRGBColorSpace;
                tex.needsUpdate = true;
                texCache.current.set(url, tex);
                m.map = tex; m.needsUpdate = true;
              };
              img.src = url;
            };
            applyTex(part.silhouetteImageUrl, faceMat);
          }
        }

        threeObjs.current.set(part.id, { group, mesh });
      });

      const toThree = (px: number, py: number, pz: number): [number, number, number] =>
        [u(px), u(pz), u(py)];

      snapshot.forEach(part => {
        const { group } = threeObjs.current.get(part.id)!;
        if (part.freeSpin) {
          group.position.set(...toThree(part.posX, part.posY, part.posZ));
          freeSpinRoot.add(group);
        } else if (part.parentId === null) {
          group.position.set(...toThree(part.posX, part.posY, part.posZ));
          axisRoot.add(group);
        } else {
          const parentPart = snapshot.find(p => p.id === part.parentId);
          if (parentPart) {
            group.position.set(...toThree(
              part.posX - parentPart.posX,
              part.posY - parentPart.posY,
              part.posZ - parentPart.posZ,
            ));
            (threeObjs.current.get(part.parentId)?.group ?? axisRoot).add(group);
          } else {
            group.position.set(...toThree(part.posX, part.posY, part.posZ));
            axisRoot.add(group);
          }
        }
        group.rotation.set(
          THREE.MathUtils.degToRad(part.rotX),
          THREE.MathUtils.degToRad(part.rotY),
          THREE.MathUtils.degToRad(part.rotZ),
        );
        group.visible = part.visible !== false;
      });
    };
    // Try immediately — succeeds only after scene setup has run
    rebuildMeshesRef.current();
  }, [parts]);

  // ── Highlight selected part ─────────────────────────────────────────────────
  useEffect(() => {
    threeObjs.current.forEach(({ mesh }, id) => {
      const mat = mesh.material as THREE.MeshStandardMaterial;
      mat.emissive.setHex(id === selectedId ? 0x3366ff : 0x000000);
      mat.emissiveIntensity = id === selectedId ? 0.4 : 0;
    });
  }, [selectedId, parts]);

  // ── Scene setup (once) ─────────────────────────────────────────────────────
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const w = window.innerWidth, h = window.innerHeight;

    // Use the JSX-declared canvas so React manages the DOM node.
    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
    renderer.setSize(w, h); renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true; renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x111118);
    sceneRef.current = scene;

    // Camera looks from -Y (front) with Z up — shows the full height profile of the beyblade
    const camera = new THREE.PerspectiveCamera(55, w / h, 0.01, 100);
    camera.position.set(0, 3, -9); camera.lookAt(0, 2, 0);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true; controls.dampingFactor = 0.06;
    controls.minDistance = 0.5; controls.maxDistance = 30;
    controls.target.set(0, 2, 0); controls.update();

    scene.add(new THREE.AmbientLight(0xffffff, 0.4));
    const sun = new THREE.DirectionalLight(0xffffff, 1.6);
    sun.position.set(6, 12, 5); sun.castShadow = true;
    sun.shadow.mapSize.set(2048, 2048);
    sun.shadow.camera.near = 0.1; sun.shadow.camera.far = 40;
    sun.shadow.camera.left = -8; sun.shadow.camera.right = 8;
    sun.shadow.camera.top = 8; sun.shadow.camera.bottom = -8;
    scene.add(sun);
    const fill = new THREE.DirectionalLight(0x4488ff, 0.4);
    fill.position.set(-4, 3, -3); scene.add(fill);

    // Grid
    const gMinor = new THREE.GridHelper(GRID, 80, 0x1a1a2e, 0x1a1a2e);
    (gMinor.material as THREE.LineBasicMaterial).transparent = true;
    (gMinor.material as THREE.LineBasicMaterial).opacity = 0.55;
    scene.add(gMinor);
    const gMajor = new THREE.GridHelper(GRID, 8, 0x2244aa, 0x2244aa);
    (gMajor.material as THREE.LineBasicMaterial).transparent = true;
    (gMajor.material as THREE.LineBasicMaterial).opacity = 0.9;
    scene.add(gMajor);

    const line = (a: THREE.Vector3, b: THREE.Vector3, color: number) =>
      new THREE.Line(new THREE.BufferGeometry().setFromPoints([a, b]),
        new THREE.LineBasicMaterial({ color, depthTest: false }));
    const half = GRID / 2;
    // X axis (blue) — user X, left/right
    scene.add(line(new THREE.Vector3(-half,.002,0), new THREE.Vector3(half,.002,0), 0x4466ff));
    // Three.js Z axis (green) — user Y, front/back depth
    scene.add(line(new THREE.Vector3(0,.002,-half), new THREE.Vector3(0,.002,half), 0x44bb88));
    // Three.js Y axis (red) — user Z, height / spin axis
    scene.add(line(new THREE.Vector3(0,0,0), new THREE.Vector3(0,8*CM,0), 0xff5555));

    // X axis tick labels (blue)
    for (let x = -4; x <= 4; x++) {
      if (!x) continue;
      const l = makeLabel(`X${x}`, "#5577ff"); l.position.set(x*CM,.01,half+.6); scene.add(l);
      scene.add(line(new THREE.Vector3(x*CM,.002,-.08), new THREE.Vector3(x*CM,.002,.08), 0x4466ff));
    }
    // Y-depth axis tick labels (green, along Three.js Z)
    for (let y = -4; y <= 4; y++) {
      if (!y) continue;
      const l = makeLabel(`Y${y}`, "#44cc99"); l.position.set(-(half+.7),.01,y*CM); scene.add(l);
      scene.add(line(new THREE.Vector3(-.08,.002,y*CM), new THREE.Vector3(.08,.002,y*CM), 0x44bb88));
    }
    const orig = makeLabel("0","#888"); orig.position.set(-(half+.7),.01,half+.6); scene.add(orig);
    // Z height tick marks (red, along Three.js Y)
    for (let mm = 5; mm <= 80; mm += 5) {
      const thY = mm*MM, isCm = mm%10===0;
      scene.add(line(new THREE.Vector3(-.12,thY,0),new THREE.Vector3(.12,thY,0), isCm?0xff5555:0x883333));
      if (isCm) { const l = makeLabel(`Z${mm/10}`,"#ff8888"); l.position.set(-.75,thY,0); scene.add(l); }
    }

    // Spin axis root (all parts are children of this)
    const axisRoot = new THREE.Group();
    scene.add(axisRoot);
    axisRootRef.current = axisRoot;

    // Free-spin root — sibling of axisRoot, never rotates
    const freeSpinRoot = new THREE.Group();
    scene.add(freeSpinRoot);
    freeSpinRootRef.current = freeSpinRoot;

    // Parts-sync may have already run (it fires before scene-setup in effect order).
    // Call it directly now that the roots exist — guaranteed to build all meshes.
    rebuildMeshesRef.current();

    // Axis overlay (always on top)
    const axisOverlay = new THREE.Line(
      new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(0,0,0), new THREE.Vector3(0,8*CM,0)]),
      new THREE.LineBasicMaterial({ color: 0xff3333, depthTest: false, transparent: true, opacity: 0.35 })
    );
    scene.add(axisOverlay);

    const onResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener("resize", onResize);

    let rafId: number;
    const tick = () => {
      rafId = requestAnimationFrame(tick);

      if (physicsEnabledRef.current && worldRef.current) {
        // Step Rapier physics world
        worldRef.current.step();
        // Sync axis rotation from kinematic body → Three.js axisRoot
        const ab = axisBodyRef2.current;
        if (ab) {
          const r = ab.rotation();
          axisRoot.quaternion.set(r.x, r.y, r.z, r.w);
        }
        // Sync each free-spin body → its Three.js group
        freeBodiesRef.current.forEach((body, partId) => {
          const obj = threeObjs.current.get(partId);
          if (obj) {
            const r = body.rotation();
            obj.group.quaternion.set(r.x, r.y, r.z, r.w);
          }
        });
      } else if (spinningRef.current) {
        // Fallback visual spin (no physics)
        axisRoot.rotation.y += 0.015;
      }
      // own-rotation parts — map user axis to Three.js axis
      partsRef.current.forEach(part => {
        if (part.rotationMode === "own") {
          const obj = threeObjs.current.get(part.id);
          if (obj) obj.group.rotation[mapRotAxis(part.ownRotAxis)] += THREE.MathUtils.degToRad(part.ownRotSpeed) / 60;
        }
      });
      controls.update();
      renderer.render(scene, camera);
    };
    tick();

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("resize", onResize);
      controls.dispose();
      renderer.dispose();
      axisRootRef.current = null; freeSpinRootRef.current = null; sceneRef.current = null;
      rebuildMeshesRef.current = () => {}; // scene gone — next mount will reset this
      // Canvas is owned by React (canvasRef) — do NOT remove it from the DOM
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── Derived ─────────────────────────────────────────────────────────────────
  const selectedPart = parts.find(p => p.id === selectedId) ?? null;
  const rootParts    = parts.filter(p => p.parentId === null);

  return (
    <>
      <div ref={mountRef} style={{ position:"relative", width:"100vw", height:"100vh", overflow:"hidden", background:"#111118" }}>
        <canvas ref={canvasRef} style={{ position:"absolute", top:0, left:0, display:"block" }} />
      </div>

      {/* ── Toolbar ── */}
      <div style={{
        position:"fixed", top:0, left:220, right:260, height:44,
        display:"flex", alignItems:"center", justifyContent:"center", gap:12,
        background:"rgba(6,6,18,0.9)", borderBottom:border,
        fontFamily:"monospace", fontSize:12, zIndex:20,
      }}>
        <span style={{ color:"#334466", fontSize:11 }}>XY = floor · Z = height (spin axis) · grid 8×8 cm · 1 mm minor</span>
        <div style={{ width:1, height:20, background:"#1a2244" }} />
        <button onClick={() => setSpinning(s => !s)} style={{
          background: spinning ? "#1a3355" : "#0a0a18",
          color: spinning ? "#55aaff" : "#445566",
          border: spinning ? "1px solid #3366cc" : border,
          borderRadius:5, padding:"4px 12px", fontFamily:"monospace", fontSize:11, cursor:"pointer",
        }}>
          {spinning ? "⏸ Stop Spin" : "▶ Spin Axis"}
        </button>

        <div style={{ width:1, height:20, background:"#1a2244" }} />

        {/* ── Physics controls ── */}
        <button
          onClick={() => setPhysicsEnabled(e => !e)}
          title={physicsEnabled ? "Disable Rapier physics" : "Enable Rapier physics — collision detection active"}
          style={{
            background: physicsEnabled ? "#1a3322" : "#0a0a18",
            color: physicsEnabled ? "#44dd88" : "#445566",
            border: physicsEnabled ? "1px solid #33aa66" : border,
            borderRadius:5, padding:"4px 12px", fontFamily:"monospace", fontSize:11, cursor:"pointer",
          }}>
          {physicsEnabled ? "⚡ Physics ON" : "⚡ Physics OFF"}
        </button>

        {physicsEnabled && (
          <>
            {/* Left / Right spin */}
            <div style={{ display:"flex", gap:2 }}>
              {(["cw","ccw"] as const).map(d => (
                <button key={d} onClick={() => setSpinDir(d)} style={{
                  background: spinDir === d ? "#1a2244" : "transparent",
                  color: spinDir === d ? "#aaccff" : "#445566",
                  border: spinDir === d ? "1px solid #3366cc" : border,
                  borderRadius:4, padding:"4px 8px", fontFamily:"monospace", fontSize:11, cursor:"pointer",
                }}>
                  {d === "cw" ? "↻ CW" : "↺ CCW"}
                </button>
              ))}
            </div>

            {/* RPM control */}
            <div style={{ display:"flex", alignItems:"center", gap:5 }}>
              <span style={{ color:"#445566", fontSize:10 }}>RPM</span>
              <input type="range" min={60} max={1200} step={30} value={spinRPM}
                onChange={e => setSpinRPM(Number(e.target.value))}
                style={{ width:80, accentColor:"#33aa66", cursor:"pointer" }} />
              <input type="number" min={60} max={1200} step={30} value={spinRPM}
                onChange={e => setSpinRPM(Number(e.target.value))}
                style={{
                  width:46, background:"#0a0a1a", border:"1px solid #2244aa",
                  color:"#55bbff", fontFamily:"monospace", fontSize:10,
                  borderRadius:3, padding:"1px 4px", outline:"none", textAlign:"right",
                }} />
            </div>
          </>
        )}
      </div>

      {/* ── Tower panel (left) ── */}
      <div style={{
        position:"fixed", top:44, left:0, bottom:0, width:220,
        background:panelBg, borderRight:border,
        fontFamily:"monospace", color:"#ccddeeff",
        display:"flex", flexDirection:"column", zIndex:10,
      }}>
        {/* header */}
        <div style={{ padding:"10px 10px 6px", borderBottom:border, display:"flex", alignItems:"center", justifyContent:"space-between" }}>
          <span style={{ fontSize:10, color:"#3355aa", letterSpacing:2, textTransform:"uppercase" }}>Parts</span>
          <div style={{ display:"flex", gap:5 }}>
            <button onClick={() => { if (confirm("Clear all parts?")) { setParts([makeAxisPart()]); setSelectedId(null); setNextColor(1); } }}
              title="Clear all"
              style={{
                background:"#1a0a0a", border:"1px solid #442222", color:"#cc4444",
                borderRadius:4, padding:"2px 7px", fontFamily:"monospace", fontSize:11, cursor:"pointer",
              }}>✕</button>
            <button onClick={() => addPart(null)} style={{
              background:"#0d2240", border:"1px solid #2244aa", color:"#55aaff",
              borderRadius:4, padding:"2px 8px", fontFamily:"monospace", fontSize:11, cursor:"pointer",
            }}>+ Axis</button>
          </div>
        </div>

        {/* Axis root label */}
        <div style={{ padding:"6px 10px", borderBottom:border, color:"#ff5555", fontSize:10, opacity:0.6 }}>
          ◉ Spin Axis (root)
        </div>

        {/* Tree */}
        <div style={{ flex:1, overflowY:"auto", padding:"6px 6px" }}>
          {rootParts.length === 0 && (
            <div style={{ color:"#334455", fontSize:10, padding:"10px 6px", textAlign:"center" }}>
              No parts yet.<br />Click "+ Axis" to add one.
            </div>
          )}
          {rootParts.map(part => (
            <TowerItem key={part.id} part={part} parts={parts} depth={0}
              selectedId={selectedId} groupSel={groupSel}
              onSelect={setSelectedId} onToggleGroup={toggleGroupSel}
              onAddChild={addPart} onDelete={deletePart} onToggleVisible={toggleVisible} />
          ))}
        </div>

        {/* Group save bar — shown when any checkboxes are ticked */}
        {groupSel.size > 0 && (
          <div style={{ borderTop:border, padding:"8px 8px", background:"rgba(10,20,40,0.95)" }}>
            <div style={{ fontSize:9, color:"#3355aa", letterSpacing:2, textTransform:"uppercase", marginBottom:5 }}>
              Save {groupSel.size} part{groupSel.size > 1 ? "s" : ""} as group
            </div>
            <div style={{ display:"flex", gap:5 }}>
              <input
                value={groupName}
                onChange={e => setGroupName(e.target.value)}
                onKeyDown={e => { if (e.key === "Enter") saveGroup(); }}
                placeholder="Group name…"
                style={{
                  flex:1, background:"#080818", border:"1px solid #2244aa", color:"#aaccff",
                  fontFamily:"monospace", fontSize:11, borderRadius:4, padding:"3px 6px", outline:"none",
                }}
              />
              <button onClick={saveGroup} disabled={!groupName.trim()}
                style={{
                  background: groupName.trim() ? "#0d3366" : "#0a0a18",
                  border:"1px solid #2244aa", color: groupName.trim() ? "#55aaff" : "#334455",
                  borderRadius:4, padding:"3px 8px", fontFamily:"monospace", fontSize:11, cursor:"pointer",
                }}>Save</button>
              <button onClick={() => setGroupSel(new Set())}
                style={{
                  background:"#1a0a0a", border:"1px solid #442222", color:"#cc4444",
                  borderRadius:4, padding:"3px 6px", fontFamily:"monospace", fontSize:11, cursor:"pointer",
                }}>✕</button>
            </div>
          </div>
        )}

        {/* Saved groups — always visible if any exist, plus import button */}
        <div style={{ borderTop:border }}>
          {/* Header row: title + export + import */}
          <div style={{ display:"flex", alignItems:"center", padding:"5px 8px", gap:4 }}>
            <span style={{ flex:1, fontSize:9, color:"#3355aa", letterSpacing:2, textTransform:"uppercase" }}>
              Presets {savedGroups.length > 0 && <span style={{ color:"#445566" }}>({savedGroups.length})</span>}
            </span>
            {savedGroups.length > 0 && (
              <button onClick={exportGroups} title="Export presets to JSON file"
                style={{ background:"#0d2240", border:"1px solid #1a4488", color:"#55aaff", borderRadius:3, padding:"1px 6px", fontSize:9, cursor:"pointer" }}>
                ↓ Export
              </button>
            )}
            <label title="Import presets from JSON file" style={{
              background:"#0a1a10", border:"1px solid #1a4422", color:"#44aa66",
              borderRadius:3, padding:"1px 6px", fontSize:9, cursor:"pointer",
            }}>
              ↑ Import
              <input type="file" accept=".json" onChange={importGroups} style={{ display:"none" }} />
            </label>
          </div>

          {/* Load options: scale + position offset applied to any group on load */}
          <div style={{ padding:"4px 8px 6px", background:"rgba(8,10,24,0.8)", borderBottom:border }}>
            <div style={{ fontSize:9, color:"#445566", marginBottom:4 }}>Load options (applied on ⤵)</div>
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"3px 8px" }}>
              {([
                { label:"Scale ×", val:loadScale,  set:setLoadScale, min:0.1, max:5,   step:0.05 },
                { label:"Offset X", val:loadOffX,  set:setLoadOffX,  min:-80, max:80,  step:1    },
                { label:"Offset Y", val:loadOffY,  set:setLoadOffY,  min:-80, max:80,  step:1    },
                { label:"Offset Z", val:loadOffZ,  set:setLoadOffZ,  min:-80, max:80,  step:1    },
              ] as const).map(({ label, val, set, min, max, step }) => (
                <div key={label} style={{ display:"flex", alignItems:"center", gap:3 }}>
                  <span style={{ color:"#556677", fontSize:9, whiteSpace:"nowrap" }}>{label}</span>
                  <input type="number" min={min} max={max} step={step} value={val}
                    onChange={e => set(parseFloat(e.target.value) || 0)}
                    style={{
                      width:44, background:"#080818", border:"1px solid #1a2244",
                      color:"#55bbff", fontFamily:"monospace", fontSize:9,
                      borderRadius:3, padding:"1px 3px", outline:"none", textAlign:"right",
                    }} />
                </div>
              ))}
            </div>
          </div>

          {/* Group list */}
          {savedGroups.length === 0 ? (
            <div style={{ padding:"8px 10px", color:"#334455", fontSize:9, textAlign:"center" }}>
              No presets yet — save a group above.
            </div>
          ) : (
            <div style={{ maxHeight:140, overflowY:"auto" }}>
              {savedGroups.map(g => (
                <div key={g.id} style={{
                  display:"flex", alignItems:"center", gap:5,
                  padding:"4px 8px", borderBottom:"1px solid #0e1428",
                }}>
                  <span style={{ flex:1, color:"#8899cc", fontSize:10, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>
                    {g.name} <span style={{ color:"#445566" }}>({g.parts.length})</span>
                  </span>
                  <button onClick={() => loadGroup(g)} title="Load into scene"
                    style={{ background:"#0d2240", border:"1px solid #1a4488", color:"#55aaff", borderRadius:3, padding:"1px 6px", fontSize:10, cursor:"pointer" }}>⤵</button>
                  <button onClick={() => deleteGroup(g.id)} title="Delete preset"
                    style={{ background:"#1a0a0a", border:"1px solid #442222", color:"#cc4444", borderRadius:3, padding:"1px 5px", fontSize:10, cursor:"pointer" }}>×</button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ── Properties panel (right) ── */}
      <div style={{
        position:"fixed", top:44, right:0, bottom:0, width:260,
        background:panelBg, borderLeft:border,
        fontFamily:"monospace", color:"#ccddeeff",
        display:"flex", flexDirection:"column", zIndex:10,
      }}>
        {!selectedPart ? (
          <div style={{ flex:1, display:"flex", alignItems:"center", justifyContent:"center", color:"#334455", fontSize:11, textAlign:"center", padding:20 }}>
            Select a part<br />from the tower
          </div>
        ) : (
          <>
            {/* Part name */}
            <div style={{ padding:"8px 12px", borderBottom:border, display:"flex", alignItems:"center", gap:8 }}>
              <span style={{ color: selectedPart.color ?? "#"+PART_COLORS[selectedPart.colorIndex??0].toString(16).padStart(6,"0"), fontSize:16 }}>●</span>
              <input
                value={selectedPart.label}
                onChange={e => updatePart(selectedPart.id, { label: e.target.value })}
                style={{
                  flex:1, background:"transparent", border:"none", borderBottom:"1px solid #2244aa",
                  color:"#aaccff", fontFamily:"monospace", fontSize:12, outline:"none", padding:"2px 0",
                }}
              />
            </div>

            {/* Tabs */}
            <div style={{ display:"flex", borderBottom:border }}>
              {(["shape","material","position","rotation","spin","specs"] as const).map(t => (
                <Tab key={t} label={t === "material" ? "Mat" : t.charAt(0).toUpperCase()+t.slice(1)} active={tab===t} onClick={() => setTab(t)} />
              ))}
            </div>

            {/* Tab content */}
            <div style={{ flex:1, overflowY:"auto", padding:"10px 12px" }}>

              {/* ── Shape tab ── */}
              {tab === "shape" && (
                <>
                  <SectionTitle>Shape</SectionTitle>
                  <select value={selectedPart.shape}
                    onChange={e => updatePart(selectedPart.id, {
                      shape: e.target.value as ShapeId,
                      shapeParams: defaultShapeParams(e.target.value as ShapeId),
                    })}
                    style={{
                      width:"100%", background:"#0a0a18", color:"#aaccff",
                      border:"1px solid #334488", borderRadius:5,
                      padding:"4px 8px", fontFamily:"monospace", fontSize:11,
                      marginBottom:12, cursor:"pointer", outline:"none",
                    }}>
                    {SHAPES.map(s => <option key={s.id} value={s.id}>{s.label}</option>)}
                  </select>
                  <SectionTitle>Dimensions</SectionTitle>
                  {SHAPE_PARAMS[selectedPart.shape].map(def => (
                    <Slider key={def.key} def={def}
                      value={selectedPart.shapeParams[def.key] ?? def.default}
                      onChange={v => updatePart(selectedPart.id, {
                        shapeParams: { ...selectedPart.shapeParams, [def.key]: v },
                      })} />
                  ))}

                  {/* ── Silhouette trace upload ── */}
                  <SectionTitle>Trace from Image</SectionTitle>
                  {selectedPart.shape === "silhouette" ? (
                    <div style={{ marginBottom:8 }}>
                      <div style={{ display:"flex", gap:6, marginBottom:6 }}>
                        {/* Re-upload button */}
                        <label style={{ flex:1, cursor:"pointer" }}>
                          <div style={{
                            background:"#0d1e36", border:"1px solid #2a4a7a", color:"#5588cc",
                            borderRadius:4, padding:"5px 0", fontFamily:"monospace", fontSize:10,
                            textAlign:"center",
                          }}>↑ Re-trace</div>
                          <input type="file" accept="image/png,image/jpeg,image/webp" style={{ display:"none" }}
                            onChange={e => {
                              const file = e.target.files?.[0];
                              if (!file) return;
                              const reader = new FileReader();
                              reader.onload = ev => {
                                const url = ev.target?.result as string;
                                if (!url) return;
                                const img = new Image();
                                img.onload = () => {
                                  const { outline, holes } = extractSilhouettePoints(img);
                                  if (outline.length > 2) updatePart(selectedPart.id, {
                                    silhouettePoints: outline,
                                    silhouetteHoles: holes,
                                    silhouetteImageUrl: url,
                                  });
                                };
                                img.src = url;
                              };
                              reader.readAsDataURL(file);
                              e.target.value = "";
                            }} />
                        </label>
                        {/* Reset to disc */}
                        <button
                          onClick={() => updatePart(selectedPart.id, {
                            shape: "disc",
                            shapeParams: defaultShapeParams("disc"),
                            silhouettePoints: [],
                            silhouetteHoles: [],
                            silhouetteImageUrl: "",
                          })}
                          style={{
                            flex:1, background:"#1a1a0d", border:"1px solid #4a4a22",
                            color:"#aaaa55", borderRadius:4, padding:"5px 0",
                            fontFamily:"monospace", fontSize:10, cursor:"pointer",
                          }}>
                          ↩ Reset shape
                        </button>
                      </div>
                      <div style={{ color:"#334455", fontSize:9 }}>
                        {selectedPart.silhouettePoints.length} outline pts
                        {selectedPart.silhouetteHoles.length > 0 &&
                          ` · ${selectedPart.silhouetteHoles.length} hole${selectedPart.silhouetteHoles.length > 1 ? "s" : ""} detected`}
                      </div>
                    </div>
                  ) : (
                    <div style={{ marginBottom:8 }}>
                      <label style={{ display:"block", cursor:"pointer", marginBottom:6 }}>
                        <div style={{
                          background:"#0d1e36", border:"1px dashed #2a4a7a", color:"#4488bb",
                          borderRadius:5, padding:"10px 0", fontFamily:"monospace", fontSize:11,
                          textAlign:"center",
                        }}>
                          ↑ Upload PNG → trace silhouette
                        </div>
                        <input type="file" accept="image/png,image/jpeg,image/webp" style={{ display:"none" }}
                          onChange={e => {
                            const file = e.target.files?.[0];
                            if (!file) return;
                            const reader = new FileReader();
                            reader.onload = ev => {
                              const url = ev.target?.result as string;
                              if (!url) return;
                              const img = new Image();
                              img.onload = () => {
                                const { outline, holes } = extractSilhouettePoints(img);
                                if (outline.length > 2) {
                                  updatePart(selectedPart.id, {
                                    shape: "silhouette",
                                    silhouettePoints: outline,
                                    silhouetteHoles: holes,
                                    silhouetteImageUrl: url,
                                    shapeParams: defaultShapeParams("silhouette"),
                                  });
                                }
                              };
                              img.src = url;
                            };
                            reader.readAsDataURL(file);
                            e.target.value = "";
                          }} />
                      </label>
                      <div style={{ color:"#334455", fontSize:9, lineHeight:1.6 }}>
                        PNG with transparent background works best. Shape uses the part color.
                      </div>
                    </div>
                  )}
                </>
              )}

              {/* ── Material tab ── */}
              {tab === "material" && (
                <>
                  <SectionTitle>Color</SectionTitle>
                  <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:8 }}>
                    <input type="color"
                      value={selectedPart.color ?? "#007fff"}
                      onChange={e => updatePart(selectedPart.id, { color: e.target.value })}
                      style={{ width:40, height:32, border:"1px solid #334488", borderRadius:5, cursor:"pointer", background:"none", padding:2 }}
                    />
                    <input type="text"
                      value={selectedPart.color ?? "#007fff"}
                      onChange={e => {
                        const v = e.target.value.trim();
                        if (/^#[0-9a-fA-F]{6}$/.test(v)) updatePart(selectedPart.id, { color: v });
                      }}
                      maxLength={7}
                      style={{
                        width:80, background:"#0a0a18", border:"1px solid #334488",
                        color:"#aaccff", fontFamily:"monospace", fontSize:11,
                        borderRadius:4, padding:"3px 6px", outline:"none",
                      }}
                    />
                    <span style={{ color:"#445566", fontSize:9 }}>hex</span>
                  </div>
                  <div style={{ display:"flex", flexWrap:"wrap", gap:5, marginBottom:14 }}>
                    {PART_COLORS.map((c, i) => {
                      const hex = "#" + c.toString(16).padStart(6,"0");
                      return (
                        <div key={i} onClick={() => updatePart(selectedPart.id, { color: hex, colorIndex: i })}
                          title={hex}
                          style={{
                            width:20, height:20, borderRadius:3, cursor:"pointer",
                            background: hex,
                            border: (selectedPart.color === hex) ? "2px solid #fff" : "1px solid #ffffff22",
                            boxShadow: (selectedPart.color === hex) ? `0 0 6px ${hex}` : "none",
                          }}
                        />
                      );
                    })}
                  </div>

                  <SectionTitle>Visible in Scene</SectionTitle>
                  <label style={{ display:"flex", alignItems:"center", gap:8, marginBottom:14, cursor:"pointer" }}>
                    <input type="checkbox"
                      checked={selectedPart.visible !== false}
                      onChange={e => updatePart(selectedPart.id, { visible: e.target.checked })}
                      style={{ accentColor:"#55aaff", width:14, height:14 }} />
                    <span style={{ color:"#aaccff", fontSize:11 }}>Show in 3D viewport</span>
                  </label>

                  <SectionTitle>Material Profile</SectionTitle>
                  {(Object.entries(MATERIALS) as [MaterialId, typeof MATERIALS[MaterialId]][]).map(([id, mat]) => {
                    const active = selectedPart.materialId === id;
                    const swatch = "#" + mat.color.toString(16).padStart(6, "0");
                    return (
                      <div key={id} onClick={() => updatePart(selectedPart.id, { materialId: id })}
                        style={{
                          display:"flex", alignItems:"center", gap:8,
                          padding:"6px 8px", marginBottom:4, borderRadius:5, cursor:"pointer",
                          background: active ? "rgba(20,50,100,0.6)" : "rgba(10,12,24,0.6)",
                          border: active ? "1px solid #3366cc" : "1px solid #1a2244",
                        }}>
                        <div style={{
                          width:18, height:18, borderRadius:3, flexShrink:0,
                          background: swatch,
                          boxShadow: mat.metalness > 0.5 ? `0 0 6px ${swatch}88` : "none",
                          border:"1px solid #ffffff22",
                        }} />
                        <div style={{ flex:1 }}>
                          <div style={{ color: active ? "#aaddff" : "#8899bb", fontSize:11 }}>{mat.label}</div>
                          <div style={{ color:"#445566", fontSize:9, marginTop:1 }}>
                            metalness {mat.metalness.toFixed(2)} · roughness {mat.roughness.toFixed(2)}
                          </div>
                        </div>
                        {active && <span style={{ color:"#55aaff", fontSize:12 }}>✓</span>}
                      </div>
                    );
                  })}
                </>
              )}

              {/* ── Position tab ── */}
              {tab === "position" && (
                <>
                  <SectionTitle>Position from axis center</SectionTitle>
                  {POS_PARAMS.map(def => (
                    <Slider key={def.key} def={def}
                      value={(selectedPart as unknown as Record<string,number>)[def.key] ?? 0}
                      onChange={v => updatePart(selectedPart.id, { [def.key]: v } as Partial<PartNode>)} />
                  ))}
                  <div style={{ marginTop:8, padding:"6px 8px", background:"rgba(20,30,50,0.6)", borderRadius:4, fontSize:10, color:"#445577", lineHeight:1.7 }}>
                    <span style={{ color:"#55aaff" }}>⊙ Radial: {Math.sqrt(selectedPart.posX**2 + selectedPart.posY**2).toFixed(1)} mm</span> from spin axis<br />
                    Position is always from axis center — parent only groups rotation.
                  </div>
                  <SectionTitle>Parent</SectionTitle>
                  <select value={selectedPart.parentId ?? "__axis__"}
                    onChange={e => updatePart(selectedPart.id, {
                      parentId: e.target.value === "__axis__" ? null : e.target.value,
                    })}
                    style={{
                      width:"100%", background:"#0a0a18", color:"#aaccff",
                      border:"1px solid #334488", borderRadius:5,
                      padding:"4px 8px", fontFamily:"monospace", fontSize:11,
                      cursor:"pointer", outline:"none",
                    }}>
                    <option value="__axis__">◉ Spin Axis (root)</option>
                    {parts.filter(p => p.id !== selectedPart.id).map(p => (
                      <option key={p.id} value={p.id}>{p.label}</option>
                    ))}
                  </select>
                </>
              )}

              {/* ── Rotation tab ── */}
              {tab === "rotation" && (
                <>
                  <SectionTitle>Orientation</SectionTitle>
                  {ROT_PARAMS.map(def => (
                    <Slider key={def.key} def={def}
                      value={(selectedPart as unknown as Record<string,number>)[def.key] ?? 0}
                      onChange={v => updatePart(selectedPart.id, { [def.key]: v } as Partial<PartNode>)} />
                  ))}
                  <SectionTitle>Quick Presets</SectionTitle>
                  {[
                    { label: "Default (upright)",   rotX:0,   rotY:0, rotZ:0   },
                    { label: "Lay Flat (X +90°)",   rotX:90,  rotY:0, rotZ:0   },
                    { label: "Lay Flat (X −90°)",   rotX:-90, rotY:0, rotZ:0   },
                    { label: "Flip Upside Down",    rotX:180, rotY:0, rotZ:0   },
                    { label: "Tilt 45°",            rotX:45,  rotY:0, rotZ:0   },
                    { label: "Roll 90° (Z)",        rotX:0,   rotY:0, rotZ:90  },
                  ].map(preset => (
                    <button key={preset.label} onClick={() => updatePart(selectedPart.id, { rotX:preset.rotX, rotY:preset.rotY, rotZ:preset.rotZ })}
                      style={{
                        display:"block", width:"100%", marginBottom:5,
                        background:"#0d1a2e", border:"1px solid #1a3355", color:"#6699cc",
                        borderRadius:4, padding:"4px 8px", fontFamily:"monospace",
                        fontSize:10, cursor:"pointer", textAlign:"left",
                      }}>
                      {preset.label}
                    </button>
                  ))}
                </>
              )}

              {/* ── Spin tab ── */}
              {tab === "spin" && (
                <>
                  <SectionTitle>Free Spin</SectionTitle>
                  <label style={{ display:"flex", alignItems:"flex-start", gap:8, marginBottom:12, cursor:"pointer" }}>
                    <input type="checkbox"
                      checked={selectedPart.freeSpin}
                      onChange={e => updatePart(selectedPart.id, { freeSpin: e.target.checked })}
                      style={{ accentColor:"#55aaff", marginTop:2 }} />
                    <div>
                      <div style={{ color:"#aaccff", fontSize:11 }}>Free spin (bearing / LAD)</div>
                      <div style={{ color:"#445566", fontSize:9, marginTop:2, lineHeight:1.5 }}>
                        Part does not rotate with the spin axis — stays stationary while everything else spins. Use for bearing tips, free-spin rings, and inner races.
                      </div>
                    </div>
                  </label>
                  {selectedPart.freeSpin && (
                    <div style={{ padding:"5px 8px", background:"rgba(0,80,160,0.15)", border:"1px solid #1a4488", borderRadius:4, fontSize:9, color:"#4488cc", marginBottom:10 }}>
                      Position is in axis-space. Own spin below runs independently of the main axis.
                    </div>
                  )}

                  <SectionTitle>Rotation Mode</SectionTitle>
                  {(["inherit","own"] as const).map(mode => (
                    <label key={mode} style={{ display:"flex", alignItems:"center", gap:8, marginBottom:10, cursor:"pointer" }}>
                      <input type="radio" name="rotMode" value={mode}
                        checked={selectedPart.rotationMode === mode}
                        onChange={() => updatePart(selectedPart.id, { rotationMode: mode })}
                        style={{ accentColor:"#3366cc" }} />
                      <div>
                        <div style={{ color:"#aaccff", fontSize:11 }}>
                          {mode === "inherit" ? "Inherit (rotates with parent)" : "Own axis (independent spin)"}
                        </div>
                        <div style={{ color:"#445566", fontSize:9, marginTop:1 }}>
                          {mode === "inherit" ? "Locked to parent — follows spin axis" : "Spins independently, e.g. bearing tip, free-spin ring"}
                        </div>
                      </div>
                    </label>
                  ))}

                  {selectedPart.rotationMode === "own" && (
                    <>
                      <SectionTitle>Own Spin</SectionTitle>
                      <Slider
                        def={{ key:"ownRotSpeed", label:"Speed", min:-10, max:10, step:0.1, unit:"°/f", default:2 }}
                        value={selectedPart.ownRotSpeed}
                        onChange={v => updatePart(selectedPart.id, { ownRotSpeed: v })} />
                      <SectionTitle>Spin Axis</SectionTitle>
                      {([
                        { axis: "x", desc: "X  (left / right)" },
                        { axis: "y", desc: "Y  (front / back)" },
                        { axis: "z", desc: "Z  (spin — height axis)" },
                      ] as const).map(({ axis, desc }) => (
                        <label key={axis} style={{ display:"flex", alignItems:"center", gap:8, marginBottom:8, cursor:"pointer" }}>
                          <input type="radio" name="ownAxis" value={axis}
                            checked={selectedPart.ownRotAxis === axis}
                            onChange={() => updatePart(selectedPart.id, { ownRotAxis: axis })}
                            style={{ accentColor:"#3366cc" }} />
                          <span style={{ color:"#aaccff", fontSize:11 }}>{desc}</span>
                        </label>
                      ))}
                    </>
                  )}
                </>
              )}

              {/* ── Specs tab ── */}
              {tab === "specs" && (() => {
                const p = selectedPart.shapeParams;
                // Derive key dimensions per shape
                const dims: { label: string; value: number }[] = (() => {
                  switch (selectedPart.shape) {
                    case "cylinder": return [{ label:"Outer Radius (mm)", value: p.radiusTop??0 },{ label:"Height (mm)", value: p.height??0 }];
                    case "disc":     return [{ label:"Radius (mm)", value: p.radius??0 },{ label:"Thickness (mm)", value: p.thickness??0 }];
                    case "cone":     return [{ label:"Base Radius (mm)", value: p.radius??0 },{ label:"Height (mm)", value: p.height??0 }];
                    case "frustum":  return [{ label:"Top Radius (mm)", value: p.radiusTop??0 },{ label:"Bottom Radius (mm)", value: p.radiusBottom??0 },{ label:"Height (mm)", value: p.height??0 }];
                    case "sphere":   return [{ label:"Radius (mm)", value: p.radius??0 },{ label:"Diameter (mm)", value: (p.radius??0)*2 }];
                    case "box":      return [{ label:"Width (mm)", value: p.width??0 },{ label:"Depth (mm)", value: p.depth??0 },{ label:"Height (mm)", value: p.height??0 }];
                    case "hollow_cylinder": return [{ label:"Outer Radius (mm)", value: p.outerRadius??0 },{ label:"Inner Radius (mm)", value: p.innerRadius??0 },{ label:"Height (mm)", value: p.height??0 },{ label:"Wall (mm)", value: (p.outerRadius??0)-(p.innerRadius??0) }];
                    case "hollow_disc":     return [{ label:"Outer Radius (mm)", value: p.outerRadius??0 },{ label:"Inner Radius (mm)", value: p.innerRadius??0 },{ label:"Thickness (mm)", value: p.thickness??0 }];
                    case "hollow_frustum":  return [{ label:"Outer R Bottom (mm)", value: p.outerRadiusBottom??0 },{ label:"Outer R Top (mm)", value: p.outerRadiusTop??0 },{ label:"Wall (mm)", value: p.wallThickness??0 },{ label:"Height (mm)", value: p.height??0 }];
                    case "extrude_triangle":  return [{ label:"Base Width (mm)", value: p.base??0 },{ label:"Depth (mm)", value: p.depth??0 },{ label:"Height (mm)", value: p.height??0 }];
                    case "extrude_trapezoid": return [{ label:"Bottom Width (mm)", value: p.bottomW??0 },{ label:"Top Width (mm)", value: p.topW??0 },{ label:"Depth (mm)", value: p.depth??0 },{ label:"Height (mm)", value: p.height??0 }];
                    case "ellipsoid":         return [{ label:"Radius X (mm)", value: p.radiusX??0 },{ label:"Radius Y (mm)", value: p.radiusY??0 },{ label:"Radius Z (mm)", value: p.radiusZ??0 }];
                    default: return SHAPE_PARAMS[selectedPart.shape].map(d => ({ label:`${d.label} (${d.unit})`, value: p[d.key]??0 }));
                  }
                })();

                return (
                  <>
                    <SectionTitle>Part Role</SectionTitle>
                    <select value={selectedPart.partRole}
                      onChange={e => updatePart(selectedPart.id, { partRole: e.target.value as PartRole })}
                      style={{
                        width:"100%", background:"#0a0a18", color:"#aaccff",
                        border:"1px solid #334488", borderRadius:5,
                        padding:"4px 8px", fontFamily:"monospace", fontSize:11,
                        marginBottom:12, cursor:"pointer", outline:"none",
                      }}>
                      {PART_ROLES.map(r => <option key={r} value={r}>{r}</option>)}
                    </select>

                    <SectionTitle>Weight</SectionTitle>
                    <div style={{ display:"flex", alignItems:"center", gap:6, marginBottom:14 }}>
                      <input type="number" min={0} max={200} step={0.1}
                        value={selectedPart.weight}
                        onChange={e => updatePart(selectedPart.id, { weight: parseFloat(e.target.value) || 0 })}
                        style={{
                          width:70, background:"#0a0a1a", border:"1px solid #2244aa",
                          color:"#ffdd88", fontFamily:"monospace", fontSize:13, fontWeight:"bold",
                          borderRadius:4, padding:"3px 6px", outline:"none", textAlign:"right",
                        }} />
                      <span style={{ color:"#886633", fontSize:12 }}>g</span>
                      <span style={{ color:"#334455", fontSize:9, marginLeft:4 }}>grams</span>
                    </div>

                    <SectionTitle>Dimensions (from shape params)</SectionTitle>
                    <div style={{ display:"grid", gridTemplateColumns:"1fr auto", gap:"4px 10px", alignItems:"center" }}>
                      {dims.map(d => (
                        <>
                          <span key={d.label + "l"} style={{ color:"#8899bb", fontSize:10 }}>{d.label}</span>
                          <span key={d.label + "v"} style={{ color:"#aaddff", fontSize:11, fontWeight:"bold", textAlign:"right", fontFamily:"monospace" }}>
                            {d.value.toFixed(1)}
                          </span>
                        </>
                      ))}
                    </div>

                    <div style={{ marginTop:12, padding:"6px 8px", background:"rgba(10,20,40,0.7)", borderRadius:4, fontSize:9, color:"#445577", lineHeight:1.7 }}>
                      Radial distance from axis: <span style={{ color:"#55aaff" }}>{Math.sqrt(selectedPart.posX**2 + selectedPart.posY**2).toFixed(1)} mm</span><br/>
                      Height above floor: <span style={{ color:"#ff8855" }}>{selectedPart.posZ.toFixed(1)} mm</span>
                    </div>
                  </>
                );
              })()}
            </div>
          </>
        )}
      </div>

      {/* ── Assembly weight footer (always visible) ── */}
      {parts.length > 0 && (() => {
        const total = parts.reduce((s, p) => s + (p.weight ?? 0), 0);
        const byRole = parts.reduce<Record<string, number>>((acc, p) => {
          const r = p.partRole ?? "Other";
          acc[r] = (acc[r] ?? 0) + (p.weight ?? 0);
          return acc;
        }, {});
        const heaviest = Object.entries(byRole).sort((a, b) => b[1] - a[1]).slice(0, 3);
        return (
          <div style={{
            position:"fixed", bottom:0, left:220, right:260, height:38,
            background:"rgba(6,8,20,0.95)", borderTop:"1px solid #1a2244",
            display:"flex", alignItems:"center", justifyContent:"center", gap:18,
            fontFamily:"monospace", fontSize:11, zIndex:20,
          }}>
            <span style={{ color:"#445566" }}>Total</span>
            <span style={{ color: total > 0 ? "#ffdd88" : "#334455", fontSize:14, fontWeight:"bold" }}>
              {total.toFixed(1)} g
            </span>
            {heaviest.filter(([, w]) => w > 0).map(([role, w]) => (
              <span key={role} style={{ color:"#445577", fontSize:10 }}>
                {role.replace(/\s*\(.*\)/, "")}: <span style={{ color:"#aabb88" }}>{w.toFixed(1)}g</span>
              </span>
            ))}
            <span style={{ color:"#334455", fontSize:9 }}>{parts.length} parts</span>
          </div>
        );
      })()}
    </>
  );
}
