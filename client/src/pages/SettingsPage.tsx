import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { SoundManager } from "@/game/audio/SoundManager";
import { useAuth } from "@/contexts/AuthContext";
import { KeyBindingsPanel } from "@/components/game/KeyBindingsPanel";

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

function Toggle({ on, onChange }: { on: boolean; onChange: () => void }) {
  return (
    <button
      onClick={onChange}
      className={`relative w-11 h-6 rounded-full transition-colors ${
        on ? "bg-blue-500" : "bg-bg0 border border-border-c"
      }`}
    >
      <span
        className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform ${
          on ? "left-[22px]" : "left-0.5"
        }`}
      />
    </button>
  );
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

// ── Overlay theme ────────────────────────────────────────────────────────────
const OVERLAY_THEMES: { id: string; label: string; bg: string }[] = [
  { id: 'dark',     label: 'Dark',          bg: 'linear-gradient(155deg,#1f1f2e,#111)' },
  { id: 'ocean',    label: 'Ocean Blue',    bg: 'linear-gradient(155deg,#0d2d5e,#071a38)' },
  { id: 'fire',     label: 'Fire Red',      bg: 'linear-gradient(155deg,#5e1a0d,#380707)' },
  { id: 'forest',   label: 'Forest Green',  bg: 'linear-gradient(155deg,#0d3a1a,#071c0d)' },
  { id: 'gold',     label: 'Gold',          bg: 'linear-gradient(155deg,#5e4a0d,#38280a)' },
  { id: 'midnight', label: 'Midnight Black',bg: 'linear-gradient(155deg,#0a0a0f,#000)' },
  { id: 'neon',     label: 'Neon Pink',     bg: 'linear-gradient(155deg,#5e0d3a,#38071e)' },
  { id: 'space',    label: 'Space Gray',    bg: 'linear-gradient(155deg,#1a1a2e,#0a0a14)' },
  { id: 'purple',   label: 'Default',       bg: 'linear-gradient(155deg,#8b5cf6,#5b21b6)' },
];

function loadOverlayTheme() { try { return localStorage.getItem('bey.overlayTheme') ?? 'purple'; } catch { return 'purple'; } }
function saveOverlayTheme(id: string) { try { localStorage.setItem('bey.overlayTheme', id); } catch {} }
function loadCustomBg() { try { return localStorage.getItem('bey.overlayTheme.customBg') ?? ''; } catch { return ''; } }
function saveCustomBg(v: string) { try { localStorage.setItem('bey.overlayTheme.customBg', v); } catch {} }

export default function SettingsPage() {
  const [settings, setSettings] = useState<Settings>(loadSettings);
  const [overlayTheme, setOverlayTheme] = useState(loadOverlayTheme);
  const [customColor, setCustomColor] = useState(() => { try { return localStorage.getItem('bey.overlayTheme.customColor') ?? '#1a1a2e'; } catch { return '#1a1a2e'; } });
  const [customBgPreview, setCustomBgPreview] = useState(loadCustomBg);
  const [showControls, setShowControls] = useState(false);
  const { currentUser, signOutUser } = useAuth();
  const navigate = useNavigate();

  function update(patch: Partial<Settings>) {
    setSettings((prev) => {
      const next = { ...prev, ...patch };
      saveSettings(next);
      if (patch.masterVolume !== undefined) {
        SoundManager.setVolume(patch.masterVolume / 100);
      }
      return next;
    });
  }

  async function handleSignOut() {
    await signOutUser();
    navigate("/login");
  }

  const initials = currentUser?.email?.[0]?.toUpperCase() ?? "?";
  const email    = currentUser?.email ?? "Not signed in";

  return (
    <div className="min-h-screen bg-bg0 p-8">
      <div className="max-w-lg mx-auto">

        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Link
            to="/"
            className="py-2 px-4 bg-bg2 rounded-xl border border-border-c text-theme-muted text-sm no-underline hover:border-theme-blue transition-colors"
          >
            Back
          </Link>
          <h1 className="text-3xl font-bold text-theme-text">Settings</h1>
        </div>

        {/* Profile */}
        <section className="mb-8">
          <h2 className="text-lg font-semibold text-theme-text mb-4">Profile</h2>
          <div className="bg-bg2 rounded-2xl border border-border-c p-5">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-theme-purple/20 border border-theme-purple/40 flex items-center justify-center text-xl font-bold text-theme-purple">
                {initials}
              </div>
              <div>
                <p className="text-sm font-semibold text-theme-text">{email}</p>
                <p className="text-xs text-theme-muted mt-0.5">Player account</p>
              </div>
            </div>
          </div>
        </section>

        {/* Controls */}
        <section className="mb-8">
          <h2 className="text-lg font-semibold text-theme-text mb-4">Controls</h2>
          <div className="bg-bg2 rounded-2xl border border-border-c p-5 flex flex-col gap-4">
            <p className="text-sm text-theme-muted">
              Remap keyboard bindings for movement, attack, defense, dodge, and charge. Arrow keys are always active as movement fallbacks.
            </p>
            <button
              onClick={() => setShowControls(true)}
              className="py-2.5 px-5 bg-theme-purple text-white rounded-xl text-sm font-semibold hover:opacity-90 transition-opacity self-start"
            >
              Configure Key Bindings
            </button>
          </div>
        </section>

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

            <div className="flex items-center justify-between">
              <span className="text-sm text-theme-text font-medium">Screen Shake</span>
              <Toggle on={settings.screenShake} onChange={() => update({ screenShake: !settings.screenShake })} />
            </div>

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

            <div className="flex items-center justify-between">
              <span className="text-sm text-theme-text font-medium">Reduce Motion</span>
              <Toggle on={settings.reduceMotion} onChange={() => update({ reduceMotion: !settings.reduceMotion })} />
            </div>

          </div>
        </section>

        {/* Overlay Theme */}
        <section className="mb-8">
          <h2 className="text-lg font-semibold text-theme-text mb-4">Controller Overlay Theme</h2>
          <div className="bg-bg2 rounded-2xl border border-border-c p-5 flex flex-col gap-4">
            <div className="flex flex-wrap gap-2">
              {OVERLAY_THEMES.map(t => (
                <button
                  key={t.id}
                  title={t.label}
                  onClick={() => { setOverlayTheme(t.id); saveOverlayTheme(t.id); }}
                  style={{ background: t.bg, outline: overlayTheme === t.id ? '2px solid #00e5ff' : '2px solid transparent', outlineOffset: 2 }}
                  className="w-10 h-10 rounded-lg cursor-pointer transition-all border-0"
                />
              ))}
            </div>
            <div className="text-xs text-theme-muted">{OVERLAY_THEMES.find(t => t.id === overlayTheme)?.label ?? 'Default'}</div>

            {/* Custom color */}
            <div className="flex items-center gap-3">
              <span className="text-sm text-theme-text">Custom Color</span>
              <input
                type="color"
                value={customColor}
                onChange={e => {
                  const v = e.target.value;
                  setCustomColor(v);
                  try { localStorage.setItem('bey.overlayTheme.customColor', v); } catch {}
                  setOverlayTheme('custom');
                  saveOverlayTheme('custom');
                }}
                className="w-10 h-8 rounded border border-border-c cursor-pointer"
              />
            </div>

            {/* Custom image */}
            <div className="flex flex-col gap-2">
              <span className="text-sm text-theme-text">Custom Background Image</span>
              <input
                type="file"
                accept="image/*"
                onChange={e => {
                  const file = e.target.files?.[0];
                  if (!file) return;
                  const reader = new FileReader();
                  reader.onload = ev => {
                    const dataUrl = ev.target?.result as string;
                    if (dataUrl) { setCustomBgPreview(dataUrl); saveCustomBg(dataUrl); setOverlayTheme('custom-image'); saveOverlayTheme('custom-image'); }
                  };
                  reader.readAsDataURL(file);
                }}
                className="text-xs text-theme-muted cursor-pointer"
              />
              {customBgPreview && (
                <div style={{ height: 40, backgroundImage: `url(${customBgPreview})`, backgroundSize: 'cover', backgroundPosition: 'center', filter: 'blur(1px) brightness(0.4)', borderRadius: 8 }} />
              )}
            </div>
          </div>
        </section>

        {/* Account */}
        <section className="mb-8">
          <h2 className="text-lg font-semibold text-theme-text mb-4">Account</h2>
          <div className="bg-bg2 rounded-2xl border border-border-c p-5">
            {currentUser ? (
              <button
                onClick={handleSignOut}
                className="w-full py-2.5 rounded-xl bg-bg0 text-red-400 text-sm font-semibold border border-border-c hover:border-red-500 hover:bg-red-500/10 transition-colors"
              >
                Sign Out
              </button>
            ) : (
              <Link
                to="/login"
                className="block text-center py-2.5 rounded-xl bg-theme-purple text-white text-sm font-semibold no-underline hover:opacity-90 transition-opacity"
              >
                Sign In
              </Link>
            )}
          </div>
        </section>

        {/* Reset to Defaults */}
        <button
          onClick={() => {
            const fresh = { ...DEFAULTS };
            setSettings(fresh);
            saveSettings(fresh);
          }}
          className="w-full py-2.5 rounded-xl bg-bg2 text-theme-muted text-sm border border-border-c hover:border-red-500 hover:text-red-400 transition-colors"
        >
          Reset Visual &amp; Audio to Defaults
        </button>

      </div>

      {/* Key bindings modal */}
      {showControls && <KeyBindingsPanel onClose={() => setShowControls(false)} />}
    </div>
  );
}
