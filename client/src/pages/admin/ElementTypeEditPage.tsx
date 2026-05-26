import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { db, COLLECTIONS } from "@/lib/firebase";
import { useElementTypes, invalidateElementTypesCache } from "@/hooks/useElementTypes";
import type { ElementTypeConfig, ZoneBonus } from "@/types/elementTypeConfig";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import toast from "react-hot-toast";
import { SearchableSelect } from "@/components/admin/SearchableSelect";
import { useDefsDocs } from "@/hooks/useDefsDocs";

const FALLBACK_HAZARD_SUGGESTIONS = [
  "lava", "ice", "mud", "electric", "emp", "fire", "water", "void",
  "time_slow", "repulsion", "size_shrink", "size_grow",
  "trampoline", "combo_boost", "drain", "healing", "magnet", "antigravity",
  "sticky", "elevation",
];

const FALLBACK_STAT_SUGGESTIONS = [
  "spinDecayRate", "damageMultiplier", "speed", "surfaceFriction",
  "powerGainRate", "spinBoost", "damageReduction", "recoilFactor",
  "spinStealFactor", "maxSpin",
];

function multiplierColor(v: number): string {
  if (v >= 2.0) return "#22c55e";
  if (v >= 1.5) return "#eab308";
  if (v <= 0.5) return "#ef4444";
  return "#64748b";
}

const EMPTY_CONFIG: Omit<ElementTypeConfig, "id"> = {
  name: "",
  icon: "✦",
  color: "#6366f1",
  isDefault: false,
  zoneImmunities: [],
  zoneBonuses: [],
  attackAdvantages: {},
};

export function ElementTypeEditPage() {
  const { id } = useParams<{ id: string }>();
  const isCreate = id === "create";
  const navigate = useNavigate();

  const { configs, loading: typesLoading } = useElementTypes();

  const hazardDocs = useDefsDocs(COLLECTIONS.HAZARD_TYPE_DEFS);
  const statSugDocs = useDefsDocs(COLLECTIONS.ELEMENT_STAT_DEFS);
  const hazardSuggestions = hazardDocs.length > 0 ? hazardDocs.map(d => d.id) : FALLBACK_HAZARD_SUGGESTIONS;
  const statSuggestions = statSugDocs.length > 0 ? statSugDocs.map(d => d.id) : FALLBACK_STAT_SUGGESTIONS;

  const [slug, setSlug] = useState("");
  const [form, setForm] = useState<Omit<ElementTypeConfig, "id">>(EMPTY_CONFIG);
  const [loading, setLoading] = useState(!isCreate);
  const [saving, setSaving] = useState(false);
  const [immunityInput, setImmunityInput] = useState("");

  useEffect(() => {
    if (isCreate) { setLoading(false); return; }
    (async () => {
      setLoading(true);
      try {
        const snap = await getDoc(doc(db, COLLECTIONS.ELEMENT_TYPE_CONFIGS, id!));
        if (!snap.exists()) { toast.error("Type not found"); navigate("/admin/element-types"); return; }
        const data = snap.data() as ElementTypeConfig;
        setSlug(data.id);
        setForm({
          name: data.name,
          icon: data.icon,
          color: data.color,
          isDefault: data.isDefault ?? false,
          zoneImmunities: data.zoneImmunities ?? [],
          zoneBonuses: data.zoneBonuses ?? [],
          attackAdvantages: data.attackAdvantages ?? {},
        });
      } catch { toast.error("Failed to load type"); }
      finally { setLoading(false); }
    })();
  }, [id, isCreate, navigate]);

  useEffect(() => {
    if (typesLoading || configs.length === 0) return;
    setForm(prev => {
      const merged = { ...prev.attackAdvantages };
      for (const cfg of configs) {
        if (!(cfg.id in merged)) merged[cfg.id] = 1.0;
      }
      return { ...prev, attackAdvantages: merged };
    });
  }, [configs, typesLoading]);

  const set = <K extends keyof typeof form>(k: K, v: typeof form[K]) =>
    setForm(f => ({ ...f, [k]: v }));

  const addBonus = () =>
    set("zoneBonuses", [...form.zoneBonuses, { hazardType: "", stat: "", value: 1.0, mode: "mult" }]);

  const updateBonus = (i: number, patch: Partial<ZoneBonus>) =>
    set("zoneBonuses", form.zoneBonuses.map((b, idx) => idx === i ? { ...b, ...patch } : b));

  const removeBonus = (i: number) =>
    set("zoneBonuses", form.zoneBonuses.filter((_, idx) => idx !== i));

  const addImmunity = () => {
    const val = immunityInput.trim().toLowerCase().replace(/\s+/g, "_");
    if (!val || form.zoneImmunities.includes(val)) return;
    set("zoneImmunities", [...form.zoneImmunities, val]);
    setImmunityInput("");
  };

  const removeImmunity = (tag: string) =>
    set("zoneImmunities", form.zoneImmunities.filter(t => t !== tag));

  const handleSave = async () => {
    const finalSlug = isCreate ? slug.trim().toLowerCase().replace(/\s+/g, "-") : id!;
    if (!finalSlug) { toast.error("Slug is required"); return; }
    if (!form.name.trim()) { toast.error("Name is required"); return; }
    if (isCreate) {
      const exists = configs.some(c => c.id === finalSlug);
      if (exists) { toast.error(`Slug "${finalSlug}" already exists`); return; }
    }

    setSaving(true);
    try {
      const payload: ElementTypeConfig = {
        id: finalSlug,
        ...form,
        updatedAt: new Date().toISOString(),
        ...(isCreate ? { createdAt: new Date().toISOString() } : {}),
      };
      const ref = doc(db, COLLECTIONS.ELEMENT_TYPE_CONFIGS, finalSlug);
      if (isCreate) {
        await setDoc(ref, payload);
      } else {
        await updateDoc(ref, { ...payload });
      }
      invalidateElementTypesCache();
      toast.success(isCreate ? "Created!" : "Saved!");
      navigate("/admin/element-types");
    } catch {
      toast.error("Save failed");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="p-6 text-muted">Loading…</div>;

  return (
    <div className="p-6 max-w-[900px] mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-[20px] font-bold text-text">
            {isCreate ? "New Element Type" : `Edit: ${form.name || id}`}
          </h1>
          <p className="text-faint text-xs mt-1">
            {isCreate ? "Create a custom element type with custom advantages and effects." : "Edit type advantages, zone immunities, and bonus effects."}
          </p>
        </div>
        <div className="flex gap-2.5">
          <Button variant="outline" size="sm" onClick={() => navigate("/admin/element-types")}>Cancel</Button>
          <Button variant="primary" size="sm" onClick={handleSave} disabled={saving}>
            {saving ? "Saving…" : "Save"}
          </Button>
        </div>
      </div>

      <div className="flex flex-col gap-5">

        {/* Section A: Metadata */}
        <section className="bg-bg1 border border-border rounded-2xl p-5">
          <div className="text-sm font-bold text-text mb-4">A — Metadata</div>
          <div className="grid grid-cols-4 gap-4">
            <div>
              <Label>Slug (ID)</Label>
              {isCreate ? (
                <Input
                  value={slug}
                  onChange={e => setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-_]/g, ""))}
                  placeholder="e.g. plasma"
                />
              ) : (
                <code className="text-[13px] text-faint bg-bg2 px-3 py-2 rounded-lg block">{id}</code>
              )}
            </div>
            <div>
              <Label>Name</Label>
              <Input value={form.name} onChange={e => set("name", e.target.value)} placeholder="Plasma" />
            </div>
            <div>
              <Label>Icon (emoji)</Label>
              <Input value={form.icon} onChange={e => set("icon", e.target.value)} maxLength={4} className="text-[22px] text-center" />
            </div>
            <div>
              <Label>Color</Label>
              <div className="flex gap-2 items-center">
                <input type="color" value={form.color} onChange={e => set("color", e.target.value)}
                  className="w-10 h-9 border-none rounded-md cursor-pointer bg-transparent p-0" />
                <Input value={form.color} onChange={e => set("color", e.target.value)} maxLength={7} className="font-mono w-28" />
              </div>
            </div>
          </div>

          {/* Preview badge */}
          <div className="mt-4 flex items-center gap-2">
            <span className="text-[11px] text-faint">Preview:</span>
            <span
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[13px] text-text border [background:color-mix(in_srgb,var(--el-color)_20%,transparent)] [border-color:var(--el-color)]"
              style={{ "--el-color": form.color } as React.CSSProperties}
            >
              {form.icon} {form.name || "My Type"}
            </span>
            {form.isDefault && (
              <span className="text-[11px] text-blue bg-blue/10 px-1.5 py-px rounded font-bold">DEFAULT</span>
            )}
          </div>
        </section>

        {/* Section B: Zone Immunities */}
        <section className="bg-bg1 border border-border rounded-2xl p-5">
          <div className="text-sm font-bold text-text mb-1">B — Zone Immunities</div>
          <p className="text-faint text-xs mb-3.5">
            Beyblades of this type take no effect from these floor/zone hazard types.
          </p>

          <div className="flex flex-wrap gap-1.5 mb-3">
            {form.zoneImmunities.map(tag => (
              <span key={tag} className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs bg-bg3 border border-border text-text">
                {tag}
                <button onClick={() => removeImmunity(tag)} className="bg-transparent border-none text-muted cursor-pointer text-sm leading-none p-0 ml-0.5">×</button>
              </span>
            ))}
            {form.zoneImmunities.length === 0 && (
              <span className="text-faint text-xs">No immunities set</span>
            )}
          </div>

          <div className="flex gap-2 items-center flex-wrap">
            <input
              className="w-[180px] bg-bg2 border border-border rounded-lg px-3 py-2 text-text text-[13px] focus:outline-none focus:border-blue"
              value={immunityInput}
              onChange={e => setImmunityInput(e.target.value)}
              onKeyDown={e => e.key === "Enter" && (e.preventDefault(), addImmunity())}
              placeholder="hazard type id"
              list="hazard-suggestions"
            />
            <datalist id="hazard-suggestions">
              {hazardSuggestions.map(h => <option key={h} value={h} />)}
            </datalist>
            <Button variant="outline" size="sm" onClick={addImmunity}>+ Add</Button>
          </div>
        </section>

        {/* Section C: Zone Bonuses */}
        <section className="bg-bg1 border border-border rounded-2xl p-5">
          <div className="text-sm font-bold text-text mb-1">C — Zone Bonus Effects</div>
          <p className="text-faint text-xs mb-3.5">
            Beyblades of this type receive a bonus stat while inside a matching zone.
          </p>

          <div className="flex flex-col gap-2 mb-3">
            {form.zoneBonuses.length === 0 && (
              <div className="text-faint text-xs">No zone bonuses configured.</div>
            )}
            {form.zoneBonuses.map((bonus, i) => (
              <div key={i} className="grid gap-2 items-end grid-cols-[1fr_1fr_90px_90px_36px]">
                <div>
                  <Label className="text-[11px] mb-0.5">Hazard Type</Label>
                  <input className="w-full bg-bg2 border border-border rounded-lg px-3 py-2 text-text text-[13px] focus:outline-none focus:border-blue"
                    value={bonus.hazardType} onChange={e => updateBonus(i, { hazardType: e.target.value })}
                    placeholder="e.g. fire" list="hazard-suggestions-bonus" />
                  <datalist id="hazard-suggestions-bonus">
                    {hazardSuggestions.map(h => <option key={h} value={h} />)}
                  </datalist>
                </div>
                <div>
                  <Label className="text-[11px] mb-0.5">Stat</Label>
                  <input className="w-full bg-bg2 border border-border rounded-lg px-3 py-2 text-text text-[13px] focus:outline-none focus:border-blue"
                    value={bonus.stat} onChange={e => updateBonus(i, { stat: e.target.value })}
                    placeholder="spinDecayRate" list="stat-suggestions" />
                  <datalist id="stat-suggestions">
                    {statSuggestions.map(s => <option key={s} value={s} />)}
                  </datalist>
                </div>
                <div>
                  <Label className="text-[11px] mb-0.5">Value</Label>
                  <Input type="number" value={bonus.value} step={0.1}
                    onChange={e => updateBonus(i, { value: parseFloat(e.target.value) || 0 })} />
                </div>
                <div>
                  <Label className="text-[11px] mb-0.5">Mode</Label>
                  <SearchableSelect
                    value={bonus.mode}
                    options={[{ value: "mult", label: "mult ×" }, { value: "flat", label: "flat =" }]}
                    onChange={v => updateBonus(i, { mode: v as "mult" | "flat" })}
                  />
                </div>
                <button onClick={() => removeBonus(i)}
                  className="mt-[18px] w-8 h-8 rounded-md border border-border bg-transparent text-muted cursor-pointer text-base flex items-center justify-center hover:border-red hover:text-red">
                  ×
                </button>
              </div>
            ))}
          </div>

          <Button variant="outline" size="sm" onClick={addBonus}>+ Add Zone Bonus</Button>
        </section>

        {/* Section D: Attack Advantages */}
        <section className="bg-bg1 border border-border rounded-2xl p-5">
          <div className="text-sm font-bold text-text mb-1">D — Attack Advantages</div>
          <p className="text-faint text-xs mb-4">
            Multiplier applied to damage + spin steal when <strong className="text-text">{form.name || "this type"}</strong> attacks each defender type.
            {" "}0.5 = resisted · 1.0 = neutral · 1.5 = effective · 2.0 = super effective
          </p>

          {typesLoading ? (
            <div className="text-muted text-[13px]">Loading types…</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="border-collapse min-w-full">
                <thead>
                  <tr>
                    <th className="px-2.5 py-1.5 text-[11px] text-faint text-left whitespace-nowrap">Attacker → Defender</th>
                    {configs.map(cfg => (
                      <th key={cfg.id} className="px-1.5 py-1 text-[11px] text-muted text-center min-w-[56px]">
                        <div>{cfg.icon}</div>
                        <div className="text-[10px] text-faint">{cfg.name}</div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  <tr className="bg-bg2">
                    <td className="px-2.5 py-2 text-xs text-text font-semibold whitespace-nowrap">
                      <span className="inline-flex items-center gap-1">
                        <span className="px-2 py-0.5 rounded-xl text-[11px] border [background:color-mix(in_srgb,var(--el-color)_20%,transparent)] [border-color:var(--el-color)]" style={{ "--el-color": form.color } as React.CSSProperties}>
                          {form.icon} {form.name || "this type"}
                        </span>
                        <span className="text-faint text-[10px]">attacks →</span>
                      </span>
                    </td>
                    {configs.map(cfg => {
                      const val = form.attackAdvantages[cfg.id] ?? 1.0;
                      return (
                        <td key={cfg.id} className="px-1 py-1 text-center">
                          <input
                            type="number"
                            min={0} max={4} step={0.25}
                            value={val}
                            onChange={e => set("attackAdvantages", { ...form.attackAdvantages, [cfg.id]: parseFloat(e.target.value) || 0 })}
                            className="w-[52px] text-center py-[5px] px-1 bg-bg3 rounded-[6px] text-[13px] font-semibold font-mono hud-type-text hud-type-border border"
                            style={{ "--tc": multiplierColor(val) } as React.CSSProperties}
                          />
                        </td>
                      );
                    })}
                  </tr>
                </tbody>
              </table>
            </div>
          )}

          {/* Defensive (incoming) view */}
          {!typesLoading && configs.length > 0 && !isCreate && (
            <>
              <div className="mt-6 mb-2.5 text-[13px] font-semibold text-text">
                Defensive View <span className="font-normal text-faint text-xs">(read-only — edit from the attacker's type page)</span>
              </div>
              <div className="overflow-x-auto">
                <table className="border-collapse min-w-full">
                  <thead>
                    <tr>
                      <th className="px-2.5 py-1.5 text-[11px] text-faint text-left whitespace-nowrap">Attacker → {form.name || id}</th>
                      <th className="px-2 py-1 text-[11px] text-muted text-center">Multiplier</th>
                    </tr>
                  </thead>
                  <tbody>
                    {configs.filter(cfg => cfg.id !== id).map(cfg => {
                      const val = cfg.attackAdvantages?.[id!] ?? 1.0;
                      return (
                        <tr key={cfg.id} className="border-t border-border">
                          <td className="px-2.5 py-1.5">
                            <span className="inline-flex items-center gap-1.5 text-xs">
                              <span className="px-2 py-px rounded-xl text-[11px] border [background:color-mix(in_srgb,var(--el-color)_20%,transparent)] [border-color:var(--el-color)]" style={{ "--el-color": cfg.color } as React.CSSProperties}>
                                {cfg.icon} {cfg.name}
                              </span>
                            </span>
                          </td>
                          <td className="px-2.5 py-1.5 text-center font-mono font-bold text-[13px] hud-type-text" style={{ "--tc": multiplierColor(val) } as React.CSSProperties}>
                            {val.toFixed(2)}×
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </section>

      </div>

      {/* Bottom save bar */}
      <div className="mt-6 flex justify-end gap-2.5 pb-10">
        <Button variant="outline" size="sm" onClick={() => navigate("/admin/element-types")}>Cancel</Button>
        <Button variant="primary" size="sm" onClick={handleSave} disabled={saving}>
          {saving ? "Saving…" : isCreate ? "Create Type" : "Save Changes"}
        </Button>
      </div>
    </div>
  );
}
