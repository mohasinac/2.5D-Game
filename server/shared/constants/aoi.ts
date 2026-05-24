// Phase 27 Tiered AoI constants.
// Shared by server (ghost population tick) and client (tier computation + renderer culling).

export const AoI = {
  VIEWPORT_HALF_CM:   50,
  INNER_RADIUS_CM:    60,
  OUTER_RADIUS_CM:   100,
  TIER2_EXIT_CM:      65,  // hysteresis: leave Tier 2 at this distance (>INNER)
  TIER1_EXIT_CM:     105,  // hysteresis: leave Tier 1 at this distance (>OUTER)
  ELEVATOR_BONUS_CM:  10,  // extend radius when beyblade just changed floor
  GHOST_HZ:           10,  // beyGhosts sync rate
  SHADOW_HZ:          20,
  FULL_HZ:            60,
  TIER1_OPACITY:       0.3,
  TIER_FADE_MS:      200,
  TIER_GHOST_FADE_MS: 100,
} as const;
