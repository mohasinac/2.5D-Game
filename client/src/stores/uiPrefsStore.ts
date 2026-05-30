import { create } from "zustand";
import { persist } from "zustand/middleware";

export type ControlScheme = "default" | "swap-ab" | "gyro";
export type HudLayout = "standard" | "compact" | "minimal";
export type AppTheme = "dark" | "light" | "system";

interface UIPrefsState {
  cameraZoom: number;
  minimapVisible: boolean;
  hideControlsLegend: boolean;
  controlScheme: ControlScheme;
  hudLayout: HudLayout;
  theme: AppTheme;
  accentColor: string;
  soundVolume: number;
  musicVolume: number;
  hapticEnabled: boolean;
  touchStickLeft: { x: number; y: number };
  touchStickRight: { x: number; y: number };
  lastTab: "play" | "tournament" | "story" | "profile";

  set: (updates: Partial<Omit<UIPrefsState, "set" | "reset">>) => void;
  reset: () => void;
}

const DEFAULTS: Omit<UIPrefsState, "set" | "reset"> = {
  cameraZoom: 1.0,
  minimapVisible: true,
  hideControlsLegend: false,
  controlScheme: "default",
  hudLayout: "standard",
  theme: "dark",
  accentColor: "#4D9FFF",
  soundVolume: 0.7,
  musicVolume: 0.4,
  hapticEnabled: true,
  touchStickLeft: { x: 80, y: -80 },
  touchStickRight: { x: -80, y: -80 },
  lastTab: "play",
};

export const useUIPrefsStore = create<UIPrefsState>()(
  persist(
    (set) => ({
      ...DEFAULTS,
      set: (updates) => set(updates),
      reset: () => set(DEFAULTS),
    }),
    { name: "bey-ui-prefs-v1" }
  )
);
