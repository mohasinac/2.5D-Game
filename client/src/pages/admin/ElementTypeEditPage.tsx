import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { db, COLLECTIONS } from "@/lib/firebase";
import { useElementTypes, invalidateElementTypesCache } from "@/hooks/useElementTypes";
import type { ElementTypeConfig, ZoneBonus } from "@/types/elementTypeConfig";
import toast from "react-hot-toast";
import { C } from "@/styles/theme";
import { SearchableSelect } from "@/components/admin/SearchableSelect";

const HAZARD_SUGGESTIONS = [
  "lava", "ice", "mud", "electric", "emp", "fire", "water", "void",
  "time_slow", "repulsion", "size_shrink", "size_grow",
  "trampoline", "combo_boost", "drain", "healing", "magnet", "antigravity",
  "sticky", "elevation",
];

const STAT_SUGGESTIONS = [
  "spinDecayRate", "damageMultiplier", "speed", "surfaceFriction",
  "powerGainRate", "spinBoost", "damageReduction", "recoilFactor",
  "spinStealFactor", "maxSpin",
];

const MULTIPLIER_COLORS: Record<number, string> = {
  0.5: "#ef4444",
  1.0: "#64748b",
  1.5: "#eab308",
  2.0: "#22c55e",
};

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

  const [slug, setSlug] = useState("");
  const [form, setForm] = useState<Omit<ElementTypeConfig, "id">>(EMPTY_CONFIG);
  const [loading, setLoading] = useState(!isCreate);
  const [saving, setSaving] = useState(false);
  const [immunityInput, setImmunityInput] = useState("");

  // Load existing doc when editing
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

  // When all types load, initialise any missing attackAdvantages keys to 1.0
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

  // Zone bonus helpers
  const addBonus = () =>
    set("zoneBonuses", [...form.zoneBonuses, { hazardType: "", stat: "", value: 1.0, mode: "mult" }]);

  const updateBonus = (i: number, patch: Partial<ZoneBonus>) =>
    set("zoneBonuses", form.zoneBonuses.map((b, idx) => idx === i ? { ...b, ...patch } : b));

  const removeBonus = (i: number) =>
    set("zoneBonuses", form.zoneBonuses.filter((_, idx) => idx !== i));

  // Immunity helpers
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
    } catch (e) {
      toast.error("Save failed");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div style={{ padding: 24, color: C.muted }}>Loading…</div>;

  const inputStyle: React.CSSProperties = {
    background: C.bg2, border: `1px solid ${C.border}`, borderRadius: 8,
    color: C.text, padding: "8px 12px", fontSize: 13, width: "100%", boxSizing: "border-box",
  };

  const labelStyle: React.CSSProperties = { fontSize: 12, fontWeight: 600, color: C.muted, marginBottom: 4, display: "block" };

  return (
    <div style={{ padding: 24, maxWidth: 900, margin: "0 auto" }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24 }}>
        <div>
          <h1 style={{ fontSize: 20, fontWeight: 700, color: C.text }}>
            {isCreate ? "New Element Type" : `Edit: ${form.name || id}`}
          </h1>
          <p style={{ color: C.faint, fontSize: 12, marginTop: 4 }}>
            {isCreate ? "Create a custom element type with custom advantages and effects." : "Edit type advantages, zone immunities, and bonus effects."}
          </p>
        </div>
        <div style={{ display: "flex", gap: 10 }}>
          <button
            onClick={() => navigate("/admin/element-types")}
            style={{ padding: "8px 16px", borderRadius: 8, fontSize: 13, border: `1px solid ${C.border}`, background: "transparent", color: C.muted, cursor: "pointer" }}
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            style={{ padding: "8px 20px", borderRadius: 8, fontSize: 13, border: "none", background: C.blue, color: "#fff", cursor: "pointer", opacity: saving ? 0.6 : 1, fontWeight: 600 }}
          >
            {saving ? "Saving…" : "Save"}
          </button>
        </div>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>

        {/* ── Section A: Metadata ── */}
        <section style={{ background: C.bg1, border: `1px solid ${C.border}`, borderRadius: 16, padding: 20 }}>
          <div style={{ fontSize: 14, fontWeight: 700, color: C.text, marginBottom: 16 }}>A — Metadata</div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: 16 }}>

            {/* Slug — editable only in create mode */}
            <div>
              <label style={labelStyle}>Slug (ID)</label>
              {isCreate ? (
                <input
                  style={inputStyle}
                  value={slug}
                  onChange={e => setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-_]/g, ""))}
                  placeholder="e.g. plasma"
                />
              ) : (
                <code style={{ fontSize: 13, color: C.faint, background: C.bg2, padding: "8px 12px", borderRadius: 8, display: "block" }}>{id}</code>
              )}
            </div>

            {/* Name */}
            <div>
              <label style={labelStyle}>Name</label>
              <input style={inputStyle} value={form.name} onChange={e => set("name", e.target.value)} placeholder="Plasma" />
            </div>

            {/* Icon */}
            <div>
              <label style={labelStyle}>Icon (emoji)</label>
              <input style={{ ...inputStyle, fontSize: 22, textAlign: "center" }} value={form.icon} onChange={e => set("icon", e.target.value)} maxLength={4} />
            </div>

            {/* Color */}
            <div>
              <label style={labelStyle}>Color</label>
              <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                <input type="color" value={form.color} onChange={e => set("color", e.target.value)}
                  style={{ width: 40, height: 36, border: "none", borderRadius: 6, cursor: "pointer", background: "none", padding: 0 }} />
                <input style={{ ...inputStyle, fontFamily: "monospace", width: 110 }} value={form.color} onChange={e => set("color", e.target.value)} maxLength={7} />
              </div>
            </div>
          </div>

          {/* Preview badge */}
          <div style={{ marginTop: 16, display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ fontSize: 11, color: C.faint }}>Preview:</span>
            <span style={{
              display: "inline-flex", alignItems: "center", gap: 6,
              padding: "4px 12px", borderRadius: 20,
              background: form.color + "33", border: `1px solid ${form.color}`,
              fontSize: 13, color: C.text,
            }}>
              {form.icon} {form.name || "My Type"}
            </span>
            {form.isDefault && (
              <span style={{ fontSize: 11, color: C.blue, background: C.blue + "22", padding: "2px 7px", borderRadius: 4, fontWeight: 700 }}>DEFAULT</span>
            )}
          </div>
        </section>

        {/* ── Section B: Zone Immunities ── */}
        <section style={{ background: C.bg1, border: `1px solid ${C.border}`, borderRadius: 16, padding: 20 }}>
          <div style={{ fontSize: 14, fontWeight: 700, color: C.text, marginBottom: 4 }}>B — Zone Immunities</div>
          <p style={{ color: C.faint, fontSize: 12, marginBottom: 14 }}>
            Beyblades of this type take no effect from these floor/zone hazard types.
          </p>

          {/* Existing tags */}
          <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 12 }}>
            {form.zoneImmunities.map(tag => (
              <span key={tag} style={{
                display: "inline-flex", alignItems: "center", gap: 4,
                padding: "3px 10px", borderRadius: 20, fontSize: 12,
                background: C.bg3, border: `1px solid ${C.border}`, color: C.text,
              }}>
                {tag}
                <button onClick={() => removeImmunity(tag)} style={{ background: "none", border: "none", color: C.muted, cursor: "pointer", fontSize: 14, lineHeight: 1, padding: 0 }}>×</button>
              </span>
            ))}
            {form.zoneImmunities.length === 0 && (
              <span style={{ color: C.faint, fontSize: 12 }}>No immunities set</span>
            )}
          </div>

          {/* Add input */}
          <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
            <input
              style={{ ...inputStyle, width: 180 }}
              value={immunityInput}
              onChange={e => setImmunityInput(e.target.value)}
              onKeyDown={e => e.key === "Enter" && (e.preventDefault(), addImmunity())}
              placeholder="hazard type id"
              list="hazard-suggestions"
            />
            <datalist id="hazard-suggestions">
              {HAZARD_SUGGESTIONS.map(h => <option key={h} value={h} />)}
            </datalist>
            <button onClick={addImmunity} style={{ padding: "8px 14px", borderRadius: 8, fontSize: 12, border: `1px solid ${C.border}`, background: C.bg2, color: C.text, cursor: "pointer" }}>
              + Add
            </button>
          </div>
        </section>

        {/* ── Section C: Zone Bonuses ── */}
        <section style={{ background: C.bg1, border: `1px solid ${C.border}`, borderRadius: 16, padding: 20 }}>
          <div style={{ fontSize: 14, fontWeight: 700, color: C.text, marginBottom: 4 }}>C — Zone Bonus Effects</div>
          <p style={{ color: C.faint, fontSize: 12, marginBottom: 14 }}>
            Beyblades of this type receive a bonus stat while inside a matching zone.
          </p>

          {/* Rows */}
          <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 12 }}>
            {form.zoneBonuses.length === 0 && (
              <div style={{ color: C.faint, fontSize: 12 }}>No zone bonuses configured.</div>
            )}
            {form.zoneBonuses.map((bonus, i) => (
              <div key={i} style={{ display: "grid", gridTemplateColumns: "1fr 1fr 90px 90px 36px", gap: 8, alignItems: "center" }}>
                <div>
                  <label style={{ ...labelStyle, marginBottom: 2 }}>Hazard Type</label>
                  <input style={inputStyle} value={bonus.hazardType} onChange={e => updateBonus(i, { hazardType: e.target.value })}
                    placeholder="e.g. fire" list="hazard-suggestions-bonus" />
                  <datalist id="hazard-suggestions-bonus">
                    {HAZARD_SUGGESTIONS.map(h => <option key={h} value={h} />)}
                  </datalist>
                </div>
                <div>
                  <label style={{ ...labelStyle, marginBottom: 2 }}>Stat</label>
                  <input style={inputStyle} value={bonus.stat} onChange={e => updateBonus(i, { stat: e.target.value })}
                    placeholder="spinDecayRate" list="stat-suggestions" />
                  <datalist id="stat-suggestions">
                    {STAT_SUGGESTIONS.map(s => <option key={s} value={s} />)}
                  </datalist>
                </div>
                <div>
                  <label style={{ ...labelStyle, marginBottom: 2 }}>Value</label>
                  <input type="number" style={inputStyle} value={bonus.value} step={0.1}
                    onChange={e => updateBonus(i, { value: parseFloat(e.target.value) || 0 })} />
                </div>
                <div>
                  <label style={{ ...labelStyle, marginBottom: 2 }}>Mode</label>
                  <SearchableSelect
                    value={bonus.mode}
                    options={[{ value: "mult", label: "mult ×" }, { value: "flat", label: "flat =" }]}
                    onChange={v => updateBonus(i, { mode: v as "mult" | "flat" })}
                    style={inputStyle}
                  />
                </div>
                <button onClick={() => removeBonus(i)} style={{ marginTop: 18, width: 32, height: 32, borderRadius: 6, border: `1px solid ${C.border}`, background: "transparent", color: C.muted, cursor: "pointer", fontSize: 16, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  ×
                </button>
              </div>
            ))}
          </div>

          <button onClick={addBonus} style={{ padding: "7px 14px", borderRadius: 8, fontSize: 12, border: `1px solid ${C.border}`, background: C.bg2, color: C.text, cursor: "pointer" }}>
            + Add Zone Bonus
          </button>
        </section>

        {/* ── Section D: Attack Advantages Grid ── */}
        <section style={{ background: C.bg1, border: `1px solid ${C.border}`, borderRadius: 16, padding: 20 }}>
          <div style={{ fontSize: 14, fontWeight: 700, color: C.text, marginBottom: 4 }}>D — Attack Advantages</div>
          <p style={{ color: C.faint, fontSize: 12, marginBottom: 16 }}>
            Multiplier applied to damage + spin steal when <strong style={{ color: C.text }}>{form.name || "this type"}</strong> attacks each defender type.
            {" "}0.5 = resisted · 1.0 = neutral · 1.5 = effective · 2.0 = super effective
          </p>

          {typesLoading ? (
            <div style={{ color: C.muted, fontSize: 13 }}>Loading types…</div>
          ) : (
            <div style={{ overflowX: "auto" }}>
              <table style={{ borderCollapse: "collapse", minWidth: "100%" }}>
                <thead>
                  <tr>
                    <th style={{ padding: "6px 10px", fontSize: 11, color: C.faint, textAlign: "left", whiteSpace: "nowrap" }}>Attacker → Defender</th>
                    {configs.map(cfg => (
                      <th key={cfg.id} style={{ padding: "4px 6px", fontSize: 11, color: C.muted, textAlign: "center", minWidth: 56 }}>
                        <div>{cfg.icon}</div>
                        <div style={{ fontSize: 10, color: C.faint }}>{cfg.name}</div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  <tr style={{ background: C.bg2 }}>
                    <td style={{ padding: "8px 10px", fontSize: 12, color: C.text, fontWeight: 600, whiteSpace: "nowrap" }}>
                      <span style={{ display: "inline-flex", alignItems: "center", gap: 4 }}>
                        <span style={{ background: form.color + "33", border: `1px solid ${form.color}`, borderRadius: 12, padding: "2px 8px", fontSize: 11 }}>
                          {form.icon} {form.name || "this type"}
                        </span>
                        <span style={{ color: C.faint, fontSize: 10 }}>attacks →</span>
                      </span>
                    </td>
                    {configs.map(cfg => {
                      const val = form.attackAdvantages[cfg.id] ?? 1.0;
                      return (
                        <td key={cfg.id} style={{ padding: "4px 4px", textAlign: "center" }}>
                          <input
                            type="number"
                            min={0} max={4} step={0.25}
                            value={val}
                            onChange={e => set("attackAdvantages", { ...form.attackAdvantages, [cfg.id]: parseFloat(e.target.value) || 0 })}
                            style={{
                              width: 52, textAlign: "center", padding: "5px 4px",
                              background: C.bg3, border: `1px solid ${multiplierColor(val)}44`,
                              borderRadius: 6, color: multiplierColor(val),
                              fontSize: 13, fontWeight: 600, fontFamily: "monospace",
                            }}
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
              <div style={{ marginTop: 24, marginBottom: 10, fontSize: 13, fontWeight: 600, color: C.text }}>
                Defensive View <span style={{ fontWeight: 400, color: C.faint, fontSize: 12 }}>(read-only — edit from the attacker's type page)</span>
              </div>
              <div style={{ overflowX: "auto" }}>
                <table style={{ borderCollapse: "collapse", minWidth: "100%" }}>
                  <thead>
                    <tr>
                      <th style={{ padding: "6px 10px", fontSize: 11, color: C.faint, textAlign: "left", whiteSpace: "nowrap" }}>Attacker → {form.name || id}</th>
                      <th style={{ padding: "4px 8px", fontSize: 11, color: C.muted, textAlign: "center" }}>Multiplier</th>
                    </tr>
                  </thead>
                  <tbody>
                    {configs.filter(cfg => cfg.id !== id).map(cfg => {
                      const val = cfg.attackAdvantages?.[id!] ?? 1.0;
                      return (
                        <tr key={cfg.id} style={{ borderTop: `1px solid ${C.border}` }}>
                          <td style={{ padding: "6px 10px" }}>
                            <span style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 12 }}>
                              <span style={{ background: cfg.color + "33", border: `1px solid ${cfg.color}`, borderRadius: 12, padding: "1px 8px" }}>
                                {cfg.icon} {cfg.name}
                              </span>
                            </span>
                          </td>
                          <td style={{ padding: "6px 10px", textAlign: "center", fontFamily: "monospace", fontWeight: 700, fontSize: 13, color: multiplierColor(val) }}>
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

      {/* Sticky bottom save bar */}
      <div style={{ marginTop: 24, display: "flex", justifyContent: "flex-end", gap: 10, paddingBottom: 40 }}>
        <button onClick={() => navigate("/admin/element-types")} style={{ padding: "9px 20px", borderRadius: 9, fontSize: 13, border: `1px solid ${C.border}`, background: "transparent", color: C.muted, cursor: "pointer" }}>
          Cancel
        </button>
        <button onClick={handleSave} disabled={saving} style={{ padding: "9px 24px", borderRadius: 9, fontSize: 13, border: "none", background: C.blue, color: "#fff", cursor: "pointer", opacity: saving ? 0.6 : 1, fontWeight: 600 }}>
          {saving ? "Saving…" : isCreate ? "Create Type" : "Save Changes"}
        </button>
      </div>
    </div>
  );
}
