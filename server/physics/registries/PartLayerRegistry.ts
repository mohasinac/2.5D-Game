/**
 * PartLayerRegistry — 12 part layer types from INDEX_A–E case studies.
 * Layer type determines z-stack position and contact point assignment logic.
 *
 * TypeScript constants — never loaded from Firestore.
 */

export interface PartLayerProfile {
  id: string;
  label: string;
  defaultZ_cm: number;       // default z_base position in assembly (cm from floor)
  contactRole: "primary" | "secondary" | "none";
  spinCouplingDefault: "rigid" | "free" | "partial";
  description: string;
}

export const PartLayerRegistry: Record<string, PartLayerProfile> = {
  tip: {
    id: "tip",
    label: "Tip / Driver / Performance Tip",
    defaultZ_cm: 0.0,
    contactRole: "none",       // tip contacts arena floor, NOT opponents
    spinCouplingDefault: "rigid",
    description: "Floor contact point — bottom of all assemblies; no opponent contact",
  },
  core: {
    id: "core",
    label: "Core / Spin Gear / Base",
    defaultZ_cm: 0.3,
    contactRole: "none",
    spinCouplingDefault: "rigid",
    description: "Internal spin mechanism — houses spin gear; structural, no opponent contact",
  },
  casing: {
    id: "casing",
    label: "Casing / Sub-Part",
    defaultZ_cm: 0.5,
    contactRole: "secondary",
    spinCouplingDefault: "rigid",
    description: "Outer protective casing — secondary contact zone at lower z",
  },
  weight_disk: {
    id: "weight_disk",
    label: "Weight Disk / Forge Disc",
    defaultZ_cm: 1.0,
    contactRole: "secondary",
    spinCouplingDefault: "rigid",
    description: "Mass distribution disc — highest I contribution; secondary contact at mid-z",
  },
  disc_frame: {
    id: "disc_frame",
    label: "Disc Frame / Sub-Ring",
    defaultZ_cm: 0.8,
    contactRole: "secondary",
    spinCouplingDefault: "rigid",
    description: "Frame around disc — prongs/fins extend disc contact zone downward",
  },
  spin_track: {
    id: "spin_track",
    label: "Spin Track / Height Part",
    defaultZ_cm: 1.4,
    contactRole: "secondary",
    spinCouplingDefault: "rigid",
    description: "Height-setting track — determines layer z-position; can have wing contact zones",
  },
  attack_ring: {
    id: "attack_ring",
    label: "Attack Ring / Energy Layer",
    defaultZ_cm: 2.0,
    contactRole: "primary",
    spinCouplingDefault: "rigid",
    description: "Primary attack surface — blades, beaks, slopes; main contact zone",
  },
  energy_layer: {
    id: "energy_layer",
    label: "Energy Layer (Burst)",
    defaultZ_cm: 2.0,
    contactRole: "primary",
    spinCouplingDefault: "rigid",
    description: "Burst-era energy layer — click-burst gimmick; primary contact zone",
  },
  sub_ar: {
    id: "sub_ar",
    label: "Sub-Attack Ring (SAR)",
    defaultZ_cm: 2.2,
    contactRole: "primary",
    spinCouplingDefault: "partial",   // SAR free-spin depends on geometry
    description: "Sub-Attack Ring — mounts on AR Core; movement determined by collar geometry",
  },
  guard: {
    id: "guard",
    label: "Guard Ring / Fusion Wheel Guard",
    defaultZ_cm: 1.5,
    contactRole: "secondary",
    spinCouplingDefault: "rigid",
    description: "Protective outer guard — wraps around fusion wheel; secondary defensive contact",
  },
  bit_beast: {
    id: "bit_beast",
    label: "Bit Beast / God Chip / Stone Face",
    defaultZ_cm: 3.0,
    contactRole: "none",
    spinCouplingDefault: "rigid",
    description: "Top cosmetic piece — BeySpirit/special move compat gate; no opponent contact",
  },
  blade: {
    id: "blade",
    label: "Blade Extension (Gimmick)",
    defaultZ_cm: 3.5,
    contactRole: "primary",
    spinCouplingDefault: "partial",   // bistable deployment
    description: "Deployed gimmick blades — Cho-Z/Genesis awakening wings; appear above layer",
  },
};

/**
 * Resolve part layer type by ID. Fallback to 'attack_ring' for unknown types.
 */
export function resolvePartLayer(layerTypeId: string): PartLayerProfile {
  if (PartLayerRegistry[layerTypeId]) return PartLayerRegistry[layerTypeId];
  console.warn(`[PartLayerRegistry] Unknown layerTypeId "${layerTypeId}" — defaulting to attack_ring`);
  return PartLayerRegistry["attack_ring"];
}
