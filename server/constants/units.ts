// Canonical unit system shared by server + client.
// World unit is centimeters. Physics engine runs at a fixed scale above px.
// See plan: Part 1 — Unified-cm Coordinates.

export const PX_PER_CM_BASE = 24;        // canonical render scale at zoom 1 / 16px root
export const PHYSICS_SCALE = 16;          // physics units per arena px (matches PhysicsEngine)
export const MM_PER_CM = 10;
export const CM_PER_M = 100;

export const cmToPx = (cm: number): number => cm * PX_PER_CM_BASE;
export const pxToCm = (px: number): number => px / PX_PER_CM_BASE;
export const cmToPhysics = (cm: number): number => cm * PX_PER_CM_BASE * PHYSICS_SCALE;
export const physicsToCm = (p: number): number => p / (PX_PER_CM_BASE * PHYSICS_SCALE);
export const mmToCm = (mm: number): number => mm / MM_PER_CM;
export const cmToMm = (cm: number): number => cm * MM_PER_CM;
