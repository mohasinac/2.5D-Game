/**
 * BowlProfileRegistry — 8 bowl wall-angle profiles from INDEX_E arena case studies.
 * Bowl profile controls how steeply the bowl walls redirect beyblades inward.
 *
 * NOTE: Bowl profile is surface-level curvature, NOT arena tilt.
 * Arena tilt (tiltAngle) rotates the entire arena plane — separate system.
 *
 * TypeScript constants — never loaded from Firestore.
 */

export interface BowlProfile {
  id: string;
  label: string;
  wallAngle_deg: number;   // angle of bowl wall from vertical (0° = vertical wall, 90° = flat floor)
  redirectStrength: number; // fraction of wall-contact velocity redirected inward (0–1)
  wallRestitution: number;  // e (COR) of wall contact
  description: string;
}

export const BowlProfileRegistry: Record<string, BowlProfile> = {
  flat: {
    id: "flat",
    label: "Flat (0°)",
    wallAngle_deg: 0,
    redirectStrength: 0.0,
    wallRestitution: 0.72,
    description: "Flat vertical wall — no inward slope; wall acts as pure rebound surface",
  },
  gentle: {
    id: "gentle",
    label: "Gentle (15°)",
    wallAngle_deg: 15,
    redirectStrength: 0.15,
    wallRestitution: 0.72,
    description: "Gentle slope — subtle inward redirect; beys near wall drift slightly inward",
  },
  classic: {
    id: "classic",
    label: "Classic (25°)",
    wallAngle_deg: 25,
    redirectStrength: 0.30,
    wallRestitution: 0.72,
    description: "Classic BBA stadium slope — standard inward redirect; beys naturally return to center",
  },
  standard: {
    id: "standard",
    label: "Standard (35°)",
    wallAngle_deg: 35,
    redirectStrength: 0.45,
    wallRestitution: 0.68,
    description: "Standard tournament bowl — moderate slope; most common arena profile",
  },
  steep: {
    id: "steep",
    label: "Steep (45°)",
    wallAngle_deg: 45,
    redirectStrength: 0.60,
    wallRestitution: 0.65,
    description: "Steep bowl — strong inward redirect; beys must fight to reach the wall",
  },
  aggressive: {
    id: "aggressive",
    label: "Aggressive (55°)",
    wallAngle_deg: 55,
    redirectStrength: 0.75,
    wallRestitution: 0.60,
    description: "Aggressive slope — heavy inward force; very difficult to achieve ring-out",
  },
  extreme: {
    id: "extreme",
    label: "Extreme (65°)",
    wallAngle_deg: 65,
    redirectStrength: 0.87,
    wallRestitution: 0.55,
    description: "Extreme slope — near-funnel shape; beyblades constantly pulled toward center",
  },
  funnel: {
    id: "funnel",
    label: "Funnel (75°)",
    wallAngle_deg: 75,
    redirectStrength: 0.96,
    wallRestitution: 0.50,
    description: "Full funnel — maximum inward redirect; ring-out nearly impossible; endurance-focused",
  },
};

/**
 * Resolve bowl profile by ID. Fallback to 'classic' for unknown profiles.
 */
export function resolveBowlProfile(profileId: string): BowlProfile {
  if (BowlProfileRegistry[profileId]) return BowlProfileRegistry[profileId];
  console.warn(`[BowlProfileRegistry] Unknown profileId "${profileId}" — defaulting to classic`);
  return BowlProfileRegistry["classic"];
}

/**
 * Compute lateral inward force from bowl slope at a given radial position.
 * g_lat = g × sin(wallAngle_deg) × (r / arenaRadius)
 */
export function computeBowlLateralForce(
  profileId: string,
  mass_kg: number,
  r_cm: number,
  arenaRadius_cm: number
): number {
  const profile = resolveBowlProfile(profileId);
  const g = 981; // cm/s²
  const sinAngle = Math.sin((profile.wallAngle_deg * Math.PI) / 180);
  const radialFraction = Math.min(1, r_cm / arenaRadius_cm);
  return mass_kg * g * sinAngle * radialFraction;
}
