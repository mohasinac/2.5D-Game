import { useState } from "react";
import { Link } from "react-router-dom";
import { SoundManager } from "@/game/audio/SoundManager";

interface Settings {
  masterVolume: number;
  sfxVolume: number;
  musicVolume: number;
  screenShake: boolean;
  particleDensity: "low" | "medium" | "high";
  reduceMotion: boolean;
}

const DEFAULTS: Settings = {
  masterVolume: 80,
  sfxVolume: 80,
  musicVolume: 60,
  screenShake: true,
  particleDensity: "medium",
  reduceMotion: false,
};

function loadSettings(): Settings {
  try {
    const raw = localStorage.getItem("beyblade_settings");
    if (raw) return { ...DEFAULTS, ...JSON.parse(raw) };
  } catch {
    // corrupted — fall back
  }
  return { ...DEFAULTS };
}

function saveSettings(s: Settings) {
  localStorage.setItem("beyblade_settings", JSON.stringify(s));
}

function VolumeSlider({
  label,
  value,
  onChange,
}: {
  label: string;
  value: number;
  onChange: (v: number) => void;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-center justify-between">
        <span className="text-sm text-theme-text font-medium">{label}</span>
        <span className="text-xs text-theme-muted tabular-nums">{value}%</span>
      </div>
      <input
        type="range"
        min={0}
        max={100}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full accent-blue-500 h-2 rounded-full bg-bg0 cursor-pointer"
      />
    </div>
  );
}

export default function SettingsPage() {
  const [settings, setSettings] = useState<Settings>(loadSettings);

  function update(patch: Partial<Settings>) {
    setSettings((prev) => {
      const next = { ...prev, ...patch };
      saveSettings(next);
      // Keep SoundManager in sync with the master volume slider.
      if (patch.masterVolume !== undefined) {
        SoundManager.setVolume(patch.masterVolume / 100);
      }
      return next;
    });
  }

  return (
    <div className="min-h-screen bg-bg0 p-8">
      <div className="max-w-lg mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <Link
            to="/"
            className="py-2 px-4 bg-bg2 rounded-xl border border-border-c text-theme-muted text-sm no-underline hover:border-theme-blue transition-colors"
          >
            Back
          </Link>
          <h1 className="text-3xl font-bold text-theme-text">Settings</h1>
        </div>

        {/* Audio */}
        <section className="mb-8">
          <h2 className="text-lg font-semibold text-theme-text mb-4">Audio</h2>
          <div className="bg-bg2 rounded-2xl border border-border-c p-5 flex flex-col gap-5">
            <VolumeSlider
              label="Master Volume"
              value={settings.masterVolume}
              onChange={(v) => update({ masterVolume: v })}
            />
            <VolumeSlider
              label="SFX Volume"
              value={settings.sfxVolume}
              onChange={(v) => update({ sfxVolume: v })}
            />
            <VolumeSlider
              label="Music Volume"
              value={settings.musicVolume}
              onChange={(v) => update({ musicVolume: v })}
            />
          </div>
        </section>

        {/* Visual */}
        <section className="mb-8">
          <h2 className="text-lg font-semibold text-theme-text mb-4">Visual</h2>
          <div className="bg-bg2 rounded-2xl border border-border-c p-5 flex flex-col gap-5">
            {/* Screen Shake */}
            <div className="flex items-center justify-between">
              <span className="text-sm text-theme-text font-medium">Screen Shake</span>
              <button
                onClick={() => update({ screenShake: !settings.screenShake })}
                className={`relative w-11 h-6 rounded-full transition-colors ${
                  settings.screenShake ? "bg-blue-500" : "bg-bg0 border border-border-c"
                }`}
              >
                <span
                  className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform ${
                    settings.screenShake ? "left-[22px]" : "left-0.5"
                  }`}
                />
              </button>
            </div>

            {/* Particle Density */}
            <div className="flex flex-col gap-2">
              <span className="text-sm text-theme-text font-medium">Particle Density</span>
              <div className="flex gap-2">
                {(["low", "medium", "high"] as const).map((level) => (
                  <button
                    key={level}
                    onClick={() => update({ particleDensity: level })}
                    className={`flex-1 py-2 rounded-xl text-sm font-medium capitalize transition-colors ${
                      settings.particleDensity === level
                        ? "bg-blue-500 text-white"
                        : "bg-bg0 text-theme-muted border border-border-c hover:border-theme-blue"
                    }`}
                  >
                    {level}
                  </button>
                ))}
              </div>
            </div>

            {/* Reduce Motion */}
            <div className="flex items-center justify-between">
              <span className="text-sm text-theme-text font-medium">Reduce Motion</span>
              <button
                onClick={() => update({ reduceMotion: !settings.reduceMotion })}
                className={`relative w-11 h-6 rounded-full transition-colors ${
                  settings.reduceMotion ? "bg-blue-500" : "bg-bg0 border border-border-c"
                }`}
              >
                <span
                  className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform ${
                    settings.reduceMotion ? "left-[22px]" : "left-0.5"
                  }`}
                />
              </button>
            </div>
          </div>
        </section>

        {/* Reset */}
        <button
          onClick={() => {
            const fresh = { ...DEFAULTS };
            setSettings(fresh);
            saveSettings(fresh);
          }}
          className="w-full py-2.5 rounded-xl bg-bg2 text-theme-muted text-sm border border-border-c hover:border-red-500 hover:text-red-400 transition-colors"
        >
          Reset to Defaults
        </button>
      </div>
    </div>
  );
}
