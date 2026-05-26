// Reusable editor for ComboVisual — used by ComboEffectEditor, SpecialMoveEditor, etc.

import type { ComboVisual } from "@/types/comboVisual";
import { SearchableSelect } from "@/components/admin/SearchableSelect";

interface Props {
  value: ComboVisual;
  onChange: (next: ComboVisual) => void;
  label?: string;
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-[11px] text-theme-muted font-semibold uppercase tracking-[0.05em]">
        {label}
      </label>
      {children}
    </div>
  );
}

const inputCls = "bg-bg3 border border-border-c rounded-lg px-[10px] py-[6px] text-theme-text text-[13px] w-full box-border";

export function ComboVisualEditor({ value, onChange, label = "Visual Override" }: Props) {
  function set<K extends keyof ComboVisual>(key: K, val: ComboVisual[K]) {
    onChange({ ...value, [key]: val === "" ? undefined : val });
  }

  return (
    <div className="bg-bg2 border border-border-c rounded-xl p-4">
      <div className="text-[12px] font-bold text-theme-muted mb-[14px] uppercase tracking-[0.06em]">
        {label}
      </div>

      <div className="grid gap-3 [grid-template-columns:1fr_1fr]">

        <Field label="Sprite URL">
          <input
            className={inputCls}
            type="url"
            placeholder="https://…/sprite.png"
            value={value.spriteUrl ?? ""}
            onChange={e => set("spriteUrl", e.target.value || undefined)}
          />
        </Field>

        <Field label="Sprite Layer">
          <SearchableSelect
            value={value.spriteLayer ?? ""}
            options={[{ value: "base", label: "base" }, { value: "overlay", label: "overlay" }, { value: "replace", label: "replace" }]}
            onChange={v => set("spriteLayer", (v || undefined) as ComboVisual["spriteLayer"])}
            emptyLabel="— none —"
            className={inputCls}
          />
        </Field>

        <Field label="Animation ID">
          <input
            className={inputCls}
            placeholder="e.g. spin_burst"
            value={value.animationId ?? ""}
            onChange={e => set("animationId", e.target.value || undefined)}
          />
        </Field>

        <Field label="Particle Preset ID">
          <input
            className={inputCls}
            placeholder="Firestore particle_presets doc id"
            value={value.particlePresetId ?? ""}
            onChange={e => set("particlePresetId", e.target.value || undefined)}
          />
        </Field>

        <Field label="Sound ID">
          <input
            className={inputCls}
            placeholder="Firestore sound_assets doc id"
            value={value.soundId ?? ""}
            onChange={e => set("soundId", e.target.value || undefined)}
          />
        </Field>

        <Field label="Screen Flash Color (hex)">
          <div className="flex gap-[6px] items-center">
            <input
              type="color"
              value={value.screenFlashColor ?? "#ff4400"}
              onChange={e => set("screenFlashColor", e.target.value)}
              className="w-9 h-8 border-none rounded-md cursor-pointer bg-transparent"
            />
            <input
              className={`${inputCls} flex-1`}
              placeholder="#FF4400"
              value={value.screenFlashColor ?? ""}
              onChange={e => set("screenFlashColor", e.target.value || undefined)}
            />
          </div>
        </Field>

        <Field label="Flash Alpha (0–1)">
          <input
            className={inputCls}
            type="number"
            min={0} max={1} step={0.05}
            value={value.screenFlashAlpha ?? ""}
            placeholder="0.5"
            onChange={e => set("screenFlashAlpha", e.target.value === "" ? undefined : parseFloat(e.target.value))}
          />
        </Field>

        <Field label="Slow-Motion Factor (0–1)">
          <input
            className={inputCls}
            type="number"
            min={0} max={1} step={0.05}
            value={value.slowMotionFactor ?? ""}
            placeholder="0.4"
            onChange={e => set("slowMotionFactor", e.target.value === "" ? undefined : parseFloat(e.target.value))}
          />
        </Field>

        <Field label="Slow-Motion Duration (ticks)">
          <input
            className={inputCls}
            type="number"
            min={1} step={1}
            value={value.slowMotionDurationTicks ?? ""}
            placeholder="30"
            onChange={e => set("slowMotionDurationTicks", e.target.value === "" ? undefined : parseInt(e.target.value, 10))}
          />
        </Field>

        <div className="[grid-column:1_/_-1]">
          <div className="text-[11px] text-theme-muted font-semibold uppercase tracking-[0.05em] mb-2">
            Camera Shake
          </div>
          <div className="grid gap-2 [grid-template-columns:1fr_1fr]">
            <Field label="Intensity">
              <input
                className={inputCls}
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
                className={inputCls}
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
