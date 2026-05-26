import React, { useState, useEffect, useCallback } from "react";
import { collection, getDocs, doc, setDoc, deleteDoc } from "firebase/firestore";
import { db, COLLECTIONS } from "@/lib/firebase";
import { SearchableSelect } from "@/components/admin/SearchableSelect";
import { cn } from "@/lib/cn";
import toast from "react-hot-toast";

interface AnimationPresetDoc {
  id: string;
  name: string;
  description: string;
  animationType: string;
  durationMs: number;
  easing: string;
  color?: string;
  spriteUrl?: string;
}

const ANIMATION_TYPE_OPTIONS = [
  { value: "hit_flash", label: "Hit Flash", hint: "Screen flash on hit" },
  { value: "combo_burst", label: "Combo Burst", hint: "Burst particle effect on combo activate" },
  { value: "special_surge", label: "Special Surge", hint: "Power surge on special move" },
  { value: "ring_out", label: "Ring Out", hint: "Ring-out explosion" },
  { value: "spin_aura", label: "Spin Aura", hint: "Spinning aura around beyblade" },
  { value: "trail", label: "Trail", hint: "Motion trail behind beyblade" },
  { value: "impact_ring", label: "Impact Ring", hint: "Shockwave ring on collision" },
  { value: "screen_shake", label: "Screen Shake", hint: "Camera shake effect" },
];

const EASING_OPTIONS = [
  { value: "linear", label: "Linear" },
  { value: "ease-in", label: "Ease In" },
  { value: "ease-out", label: "Ease Out" },
  { value: "ease-in-out", label: "Ease In-Out" },
  { value: "bounce", label: "Bounce" },
  { value: "elastic", label: "Elastic" },
];

function slugify(s: string) {
  return s.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "").replace(/-+/g, "-").replace(/^-|-$/g, "");
}

const INP = "w-full px-2.5 py-2 bg-bg0 border border-border-c rounded-lg text-theme-text text-sm";

const EMPTY = { name: "", description: "", animationType: "hit_flash", durationMs: 300, easing: "ease-out", color: "#ffffff", spriteUrl: "" };

export default function AnimationPresetsPage() {
  const [items, setItems] = useState<AnimationPresetDoc[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<AnimationPresetDoc | null>(null);
  const [form, setForm] = useState({ ...EMPTY });
  const [confirmDelete, setConfirmDelete] = useState<AnimationPresetDoc | null>(null);
  const [saving, setSaving] = useState(false);
  const [query, setQuery] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const snap = await getDocs(collection(db, COLLECTIONS.ANIMATION_PRESETS));
      const docs = snap.docs.map(d => ({ id: d.id, ...d.data() } as AnimationPresetDoc));
      docs.sort((a, b) => a.name.localeCompare(b.name));
      setItems(docs);
    } catch { toast.error("Failed to load animation presets"); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { load(); }, [load]);

  const openCreate = () => { setEditing(null); setForm({ ...EMPTY }); setShowModal(true); };
  const openEdit = (item: AnimationPresetDoc) => {
    setEditing(item);
    setForm({ name: item.name, description: item.description, animationType: item.animationType, durationMs: item.durationMs, easing: item.easing, color: item.color ?? "#ffffff", spriteUrl: item.spriteUrl ?? "" });
    setShowModal(true);
  };

  const handleSave = async () => {
    if (!form.name.trim()) { toast.error("Name is required"); return; }
    setSaving(true);
    try {
      const data: Omit<AnimationPresetDoc, "id"> = {
        name: form.name.trim(), description: form.description.trim(), animationType: form.animationType,
        durationMs: form.durationMs, easing: form.easing,
        ...(form.color ? { color: form.color } : {}),
        ...(form.spriteUrl.trim() ? { spriteUrl: form.spriteUrl.trim() } : {}),
      };
      const id = editing ? editing.id : slugify(form.name) || `anim-${Date.now()}`;
      await setDoc(doc(db, COLLECTIONS.ANIMATION_PRESETS, id), data);
      toast.success(editing ? `Updated "${form.name}"` : `Created "${form.name}"`);
      setShowModal(false);
      load();
    } catch { toast.error("Save failed"); }
    finally { setSaving(false); }
  };

  const handleDelete = async () => {
    if (!confirmDelete) return;
    try {
      await deleteDoc(doc(db, COLLECTIONS.ANIMATION_PRESETS, confirmDelete.id));
      toast.success(`Deleted "${confirmDelete.name}"`);
      setConfirmDelete(null);
      load();
    } catch { toast.error("Delete failed"); }
  };

  const filtered = query ? items.filter(i => i.name.toLowerCase().includes(query.toLowerCase()) || i.id.includes(query)) : items;

  // type badge classes: bg-*-10 / text-theme-* for theme colors; fallback to inline style for off-theme hex
  const TYPE_BADGE_CLS: Record<string, string> = {
    hit_flash:    "bg-[#f87171]/10 text-[#f87171]",
    combo_burst:  "bg-[#a78bfa]/10 text-[#a78bfa]",
    special_surge:"bg-yellow-10 text-theme-yellow",
    ring_out:     "bg-theme-red/10 text-theme-red",
    spin_aura:    "bg-green-10 text-theme-green",
    trail:        "bg-blue-10 text-theme-blue",
    impact_ring:  "bg-[#fb923c]/10 text-[#fb923c]",
    screen_shake: "bg-[#94a3b8]/10 text-[#94a3b8]",
  };

  return (
    <div className="page-shell p-6">
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-[22px] font-bold text-theme-text">Animation Presets</h1>
          <p className="text-theme-faint text-sm mt-1">{loading ? "Loading…" : `${items.length} presets`}</p>
        </div>
        <button onClick={openCreate} className="px-4 py-2 bg-theme-blue text-white rounded-lg text-sm font-medium border-none cursor-pointer">
          + New Preset
        </button>
      </div>

      <input value={query} onChange={e => setQuery(e.target.value)} placeholder="Filter presets…"
        className={`${INP} mb-3`} />

      {loading ? <div className="text-theme-muted">Loading…</div> : filtered.length === 0 ? <div className="text-theme-muted">No presets found.</div> : (
        <div className="flex flex-col gap-2">
          {filtered.map(item => (
            <div key={item.id} className="flex items-center gap-3.5 bg-bg1 border border-border-c rounded-xl px-4 py-3">
              {item.color && (
                <div className="w-5 h-9 rounded shrink-0 border border-border-c [background:var(--swatch-color)]" style={{ "--swatch-color": item.color } as React.CSSProperties} />
              )}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-semibold text-theme-text text-sm">{item.name}</span>
                  <span className="font-mono text-[11px] text-theme-faint bg-bg2 px-1.5 py-px rounded">{item.id}</span>
                  <span className={cn("text-[11px] px-[7px] py-0.5 rounded", TYPE_BADGE_CLS[item.animationType] ?? "bg-blue-10 text-theme-blue")}>{item.animationType}</span>
                  <span className="text-[11px] text-theme-muted">{item.durationMs}ms · {item.easing}</span>
                </div>
                {item.description && <div className="text-xs text-theme-muted mt-[3px]">{item.description}</div>}
                {item.spriteUrl && (
                  <div className="flex items-center gap-2 mt-1.5">
                    <img src={item.spriteUrl} alt="sprite" className="h-8 rounded border border-border-c bg-bg2" onError={e => { (e.target as HTMLImageElement).style.display = "none"; }} />
                    <span className="text-[11px] text-theme-faint font-mono max-w-[300px] overflow-hidden text-ellipsis whitespace-nowrap">{item.spriteUrl}</span>
                  </div>
                )}
              </div>
              <button onClick={() => openEdit(item)} className="px-3.5 py-1.5 rounded-[7px] text-xs cursor-pointer border border-border-c bg-transparent text-theme-muted">Edit</button>
              <button onClick={() => setConfirmDelete(item)} className="px-3.5 py-1.5 rounded-[7px] text-xs cursor-pointer border border-theme-red/40 bg-transparent text-theme-red">Delete</button>
            </div>
          ))}
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 bg-black/75 flex items-center justify-center z-[1000] p-4">
          <div className="bg-bg1 border border-border-c rounded-2xl p-7 w-full max-w-[560px] max-h-[90vh] overflow-y-auto">
            <h3 className="text-[17px] font-bold text-theme-text mb-5">{editing ? "Edit Animation Preset" : "New Animation Preset"}</h3>

            <label className="block mb-3.5">
              <span className="text-xs text-theme-muted block mb-1">Name</span>
              <input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} className={INP} />
              {!editing && form.name && <span className="text-[11px] text-theme-faint">ID: {slugify(form.name) || "…"}</span>}
            </label>

            <div className="mb-3.5">
              <span className="text-xs text-theme-muted block mb-1">Animation Type</span>
              <SearchableSelect value={form.animationType} onChange={v => setForm(f => ({ ...f, animationType: v }))} options={ANIMATION_TYPE_OPTIONS} placeholder="Type…" />
            </div>

            <div className="grid grid-cols-2 gap-3 mb-3.5">
              <label>
                <span className="text-xs text-theme-muted block mb-1">Duration (ms)</span>
                <input type="number" min={0} value={form.durationMs} onChange={e => setForm(f => ({ ...f, durationMs: Number(e.target.value) }))} className={INP} />
              </label>
              <div>
                <span className="text-xs text-theme-muted block mb-1">Easing</span>
                <SearchableSelect value={form.easing} onChange={v => setForm(f => ({ ...f, easing: v }))} options={EASING_OPTIONS} placeholder="Easing…" />
              </div>
            </div>

            <label className="block mb-3.5">
              <span className="text-xs text-theme-muted block mb-1">Color (hex)</span>
              <div className="flex gap-2 items-center">
                <input type="color" value={form.color || "#ffffff"} onChange={e => setForm(f => ({ ...f, color: e.target.value }))}
                  className="w-10 h-9 border border-border-c rounded-md cursor-pointer p-0.5" />
                <input value={form.color} onChange={e => setForm(f => ({ ...f, color: e.target.value }))}
                  className={`${INP} flex-1 w-auto`} placeholder="#ffffff" />
              </div>
            </label>

            <label className="block mb-3.5">
              <span className="text-xs text-theme-muted block mb-1">Sprite URL <span className="text-theme-faint">(optional — paste asset URL or Firebase Storage link)</span></span>
              <input value={form.spriteUrl} onChange={e => setForm(f => ({ ...f, spriteUrl: e.target.value }))}
                className={INP} placeholder="https://…/sprite.png or gs://…" />
              {form.spriteUrl && (
                <div className="mt-2">
                  <img src={form.spriteUrl} alt="preview" className="h-12 rounded-md border border-border-c bg-bg2"
                    onError={e => { (e.target as HTMLImageElement).style.opacity = "0.3"; }} />
                </div>
              )}
            </label>

            <label className="block mb-5">
              <span className="text-xs text-theme-muted block mb-1">Description</span>
              <textarea value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} rows={2}
                className={`${INP} resize-y`} />
            </label>

            <div className="flex gap-2.5 justify-end">
              <button onClick={() => setShowModal(false)} className="px-[18px] py-2 rounded-lg text-sm border border-border-c bg-transparent text-theme-muted cursor-pointer">Cancel</button>
              <button onClick={handleSave} disabled={saving} className="px-[18px] py-2 rounded-lg text-sm border-none bg-theme-blue text-white cursor-pointer disabled:opacity-60">
                {saving ? "Saving…" : "Save"}
              </button>
            </div>
          </div>
        </div>
      )}

      {confirmDelete && (
        <div className="fixed inset-0 bg-black/75 flex items-center justify-center z-[1000]">
          <div className="bg-bg1 border border-border-c rounded-2xl p-7 max-w-[400px] w-[90%]">
            <h3 className="text-base font-bold text-theme-text mb-2.5">Delete "{confirmDelete.name}"?</h3>
            <p className="text-theme-muted text-sm mb-5">This will permanently remove the animation preset.</p>
            <div className="flex gap-2.5 justify-end">
              <button onClick={() => setConfirmDelete(null)} className="px-4 py-[7px] rounded-lg text-sm border border-border-c bg-transparent text-theme-muted cursor-pointer">Cancel</button>
              <button onClick={handleDelete} className="px-4 py-[7px] rounded-lg text-sm border-none bg-theme-red text-white cursor-pointer">Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
