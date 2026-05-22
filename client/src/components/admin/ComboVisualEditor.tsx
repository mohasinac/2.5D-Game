// Reusable editor for ComboVisual — used by ComboEffectEditor, SpecialMoveEditor, etc.

import type { ComboVisual } from "@/types/comboVisual";
import { C } from "@/styles/theme";

interface Props {
  value: ComboVisual;
  onChange: (next: ComboVisual) => void;
  label?: string;
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
      <label style={{ fontSize: 11, color: C.muted, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em" }}>
        {label}
      </label>
      {children}
    </div>
  );
}

const inputStyle = {
  background: "var(--bg3)",
  border: `1px solid ${C.border}`,
  borderRadius: 8,
  padding: "6px 10px",
  color: C.text,
  fontSize: 13,
  width: "100%",
  boxSizing: "border-box" as const,
};

const selectStyle = { ...inputStyle };

export function ComboVisualEditor({ value, onChange, label = "Visual Override" }: Props) {
  function set<K extends keyof ComboVisual>(key: K, val: ComboVisual[K]) {
    onChange({ ...value, [key]: val === "" ? undefined : val });
  }

  return (
    <div style={{ background: "var(--bg2)", border: `1px solid ${C.border}`, borderRadius: 12, padding: 16 }}>
      <div style={{ fontSize: 12, fontWeight: 700, color: C.muted, marginBottom: 14, textTransform: "uppercase", letterSpacing: "0.06em" }}>
        {label}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>

        <Field label="Sprite URL">
          <input
            style={inputStyle}
            type="url"
            placeholder="https://…/sprite.png"
            value={value.spriteUrl ?? ""}
            onChange={e => set("spriteUrl", e.target.value || undefined)}
          />
        </Field>

        <Field label="Sprite Layer">
          <select style={selectStyle} value={value.spriteLayer ?? ""} onChange={e => set("spriteLayer", (e.target.value || undefined) as ComboVisual["spriteLayer"])}>
            <option value="">— none —</option>
            <option value="base">base</option>
            <option value="overlay">overlay</option>
            <option value="replace">replace</option>
          </select>
        </Field>

        <Field label="Animation ID">
          <input
            style={inputStyle}
            placeholder="e.g. spin_burst"
            value={value.animationId ?? ""}
            onChange={e => set("animationId", e.target.value || undefined)}
          />
        </Field>

        <Field label="Particle Preset ID">
          <input
            style={inputStyle}
            placeholder="Firestore particle_presets doc id"
            value={value.particlePresetId ?? ""}
            onChange={e => set("particlePresetId", e.target.value || undefined)}
          />
        </Field>

        <Field label="Sound ID">
          <input
            style={inputStyle}
            placeholder="Firestore sound_assets doc id"
            value={value.soundId ?? ""}
            onChange={e => set("soundId", e.target.value || undefined)}
          />
        </Field>

        <Field label="Screen Flash Color (hex)">
          <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
            <input
              type="color"
              value={value.screenFlashColor ?? "#ff4400"}
              onChange={e => set("screenFlashColor", e.target.value)}
              style={{ width: 36, height: 32, border: "none", borderRadius: 6, cursor: "pointer", background: "transparent" }}
            />
            <input
              style={{ ...inputStyle, flex: 1 }}
              placeholder="#FF4400"
              value={value.screenFlashColor ?? ""}
              onChange={e => set("screenFlashColor", e.target.value || undefined)}
            />
          </div>
        </Field>

        <Field label="Flash Alpha (0–1)">
          <input
            style={inputStyle}
            type="number"
            min={0} max={1} step={0.05}
            value={value.screenFlashAlpha ?? ""}
            placeholder="0.5"
            onChange={e => set("screenFlashAlpha", e.target.value === "" ? undefined : parseFloat(e.target.value))}
          />
        </Field>

        <Field label="Slow-Motion Factor (0–1)">
          <input
            style={inputStyle}
            type="number"
            min={0} max={1} step={0.05}
            value={value.slowMotionFactor ?? ""}
            placeholder="0.4"
            onChange={e => set("slowMotionFactor", e.target.value === "" ? undefined : parseFloat(e.target.value))}
          />
        </Field>

        <Field label="Slow-Motion Duration (ticks)">
          <input
            style={inputStyle}
            type="number"
            min={1} step={1}
            value={value.slowMotionDurationTicks ?? ""}
            placeholder="30"
            onChange={e => set("slowMotionDurationTicks", e.target.value === "" ? undefined : parseInt(e.target.value, 10))}
          />
        </Field>

        <div style={{ gridColumn: "1 / -1" }}>
          <div style={{ fontSize: 11, color: C.muted, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 8 }}>
            Camera Shake
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
            <Field label="Intensity">
              <input
                style={inputStyle}
                type="number"
                min={0} step={0.5}
                placeholder="5"
                value={value.cameraShake?.intensity ?? ""}
                onChange={e => {
                  const intensity = e.target.value === "" ? undefined : parseFloat(e.target.value);
                  if (intensity === undefined) {
                    const { cameraShake: _, ...rest } = value;
                    onChange(rest);
                  } else {
                    set("cameraShake", { intensity, durationTicks: value.cameraShake?.durationTicks ?? 10 });
                  }
                }}
              />
            </Field>
            <Field label="Duration (ticks)">
              <input
                style={inputStyle}
                type="number"
                min={1} step={1}
                placeholder="10"
                value={value.cameraShake?.durationTicks ?? ""}
                onChange={e => {
                  const durationTicks = e.target.value === "" ? undefined : parseInt(e.target.value, 10);
                  if (durationTicks === undefined) {
                    const { cameraShake: _, ...rest } = value;
                    onChange(rest);
                  } else {
                    set("cameraShake", { intensity: value.cameraShake?.intensity ?? 5, durationTicks });
                  }
                }}
              />
            </Field>
          </div>
        </div>

      </div>
    </div>
  );
}
