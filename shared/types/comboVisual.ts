// Shared visual override type used by:
//   - ComboTask visualOverride fields (all 4 action types)
//   - ComboEffectDef entryAnimation / exitAnimation
//   - SpecialMoveConfig introAnimation / outroAnimation
//   - Transformation keepVisualAppearance + visualOverride

export interface ComboVisual {
  spriteUrl?: string;              // Full URL (PNG/GIF/WebP) — replaces bey or feature sprite
  spriteLayer?: "base" | "overlay" | "replace";
  animationId?: string;            // Named PixiJS/CSS animation (references animation_presets)
  particlePresetId?: string;       // Firestore particle_presets doc id
  soundId?: string;                // Firestore sound_assets doc id
  cameraShake?: { intensity: number; durationTicks: number };
  screenFlashColor?: string;       // CSS hex e.g. "#FF4400"
  screenFlashAlpha?: number;       // 0–1 opacity of flash
  slowMotionFactor?: number;       // 0–1 — client-only time scale
  slowMotionDurationTicks?: number;
}

export interface ParticlePresetDoc {
  id: string;
  name: string;
  emitterConfig: Record<string, unknown>;  // PixiJS particle emitter JSON
  previewGifUrl?: string;
}
