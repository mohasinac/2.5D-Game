// [ADMIN-PAGE] ParticlePresetsPage — CRUD for particle_presets collection.
// Each preset stores a PixiJS particle emitter JSON config + optional preview GIF.

import { useState, useEffect, useRef } from "react";
import {
  collection, getDocs, addDoc, updateDoc, deleteDoc, doc,
} from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL, deleteObject } from "firebase/storage";
import { db, storage } from "@/lib/firebase";
import { cn } from "@/lib/cn";
import type { ParticlePresetDoc } from "@/types/comboVisual";

const COLLECTION = "particle_presets";

const DEFAULT_EMITTER: Record<string, unknown> = {
  alpha: { start: 1, end: 0 },
  scale: { start: 0.5, end: 0.1, minimumScaleMultiplier: 1 },
  color: { start: "#ff4400", end: "#ffcc00" },
  speed: { start: 200, end: 100, minimumSpeedMultiplier: 1 },
  acceleration: { x: 0, y: 0 },
  maxSpeed: 0,
  startRotation: { min: 0, max: 360 },
  noRotation: false,
  rotationSpeed: { min: 0, max: 0 },
  lifetime: { min: 0.5, max: 1.5 },
  blendMode: "normal",
  frequency: 0.008,
  emitterLifetime: -1,
  maxParticles: 200,
  pos: { x: 0, y: 0 },
  addAtBack: false,
  spawnType: "circle",
  spawnCircle: { x: 0, y: 0, r: 10 },
};

const INP = "w-full px-2.5 py-[6px] bg-[var(--bg3)] border border-border-c rounded-lg text-theme-text text-[13px] box-border";

interface EditState {
  id?: string;
  name: string;
  emitterConfig: string;   // JSON string
  previewGifUrl: string;
}

function emptyEdit(): EditState {
  return { name: "", emitterConfig: JSON.stringify(DEFAULT_EMITTER, null, 2), previewGifUrl: "" };
}

export function ParticlePresetsPage() {
  const [presets, setPresets] = useState<ParticlePresetDoc[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<EditState | null>(null);
  const [saving, setSaving] = useState(false);
  const [jsonError, setJsonError] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  async function load() {
    setLoading(true);
    const snap = await getDocs(collection(db, COLLECTION));
    setPresets(snap.docs.map(d => ({ id: d.id, ...d.data() } as ParticlePresetDoc)));
    setLoading(false);
  }

  useEffect(() => { load(); }, []);

  function validateJson(raw: string): Record<string, unknown> | null {
    try {
      const parsed = JSON.parse(raw);
      if (typeof parsed !== "object" || Array.isArray(parsed)) throw new Error("Must be a JSON object");
      setJsonError(null);
      return parsed;
    } catch (e: unknown) {
      setJsonError((e as Error).message);
      return null;
    }
  }

  async function handleSave() {
    if (!editing) return;
    const config = validateJson(editing.emitterConfig);
    if (!config) return;
    setSaving(true);
    try {
      const payload = {
        name: editing.name.trim(),
        emitterConfig: config,
        previewGifUrl: editing.previewGifUrl || null,
      };
      if (editing.id) {
        await updateDoc(doc(db, COLLECTION, editing.id), payload);
      } else {
        await addDoc(collection(db, COLLECTION), payload);
      }
      await load();
      setEditing(null);
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(preset: ParticlePresetDoc) {
    if (!confirm(`Delete preset "${preset.name}"?`)) return;
    if (preset.previewGifUrl) {
      try { await deleteObject(ref(storage, preset.previewGifUrl)); } catch {}
    }
    await deleteDoc(doc(db, COLLECTION, preset.id));
    await load();
  }

  async function handleGifUpload(file: File) {
    if (!editing) return;
    setUploading(true);
    try {
      const path = `particle_presets/${Date.now()}_${file.name}`;
      const storageRef = ref(storage, path);
      await uploadBytes(storageRef, file);
      const url = await getDownloadURL(storageRef);
      setEditing(e => e ? { ...e, previewGifUrl: url } : e);
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className="page-shell p-4 sm:p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-[22px] font-bold text-theme-text">Particle Presets</h1>
          <p className="text-theme-faint text-[13px] mt-1">
            PixiJS particle emitter configs for combo visual effects. Reference by <code className="text-theme-blue">particlePresetId</code>.
          </p>
        </div>
        <button
          className="px-3.5 py-1.5 bg-theme-green/[.13] border border-theme-green/25 rounded-lg text-[13px] font-semibold text-theme-green cursor-pointer"
          onClick={() => setEditing(emptyEdit())}
        >
          + New Preset
        </button>
      </div>

      {loading ? (
        <p className="text-theme-faint">Loading…</p>
      ) : (
        <div className="card-grid">
          {presets.map(p => (
            <div key={p.id} className="bg-[var(--bg2)] border border-border-c rounded-[14px] p-4 flex flex-col gap-2.5">
              {p.previewGifUrl && (
                <img src={p.previewGifUrl} alt="preview" className="w-full h-[120px] object-contain rounded-lg bg-black" />
              )}
              <div className="font-semibold text-theme-text text-sm">{p.name}</div>
              <div className="font-mono text-[11px] text-theme-faint">{p.id}</div>
              <div className="text-[11px] text-theme-muted">
                {Object.keys(p.emitterConfig ?? {}).length} config keys
              </div>
              <div className="flex gap-2">
                <button
                  className="flex-1 px-3.5 py-1.5 bg-theme-blue/[.13] border border-theme-blue/25 rounded-lg text-[13px] font-semibold text-theme-blue cursor-pointer"
                  onClick={() => setEditing({
                    id: p.id,
                    name: p.name,
                    emitterConfig: JSON.stringify(p.emitterConfig, null, 2),
                    previewGifUrl: p.previewGifUrl ?? "",
                  })}
                >
                  Edit
                </button>
                <button
                  className="flex-1 px-3.5 py-1.5 bg-theme-red/[.13] border border-theme-red/25 rounded-lg text-[13px] font-semibold text-theme-red cursor-pointer"
                  onClick={() => handleDelete(p)}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
          {presets.length === 0 && (
            <p className="text-theme-faint col-span-full">No presets yet. Create your first one.</p>
          )}
        </div>
      )}

      {/* ── Edit drawer ───────────────────────────────────────────────────────── */}
      {editing && (
        <div
          className="fixed inset-0 bg-black/60 flex items-center justify-center z-[1000]"
          onClick={e => { if (e.target === e.currentTarget) setEditing(null); }}
        >
          <div className="bg-[var(--bg1)] border border-border-c rounded-[18px] p-7 w-[640px] max-h-[90vh] overflow-y-auto flex flex-col gap-[18px]">
            <h2 className="text-[18px] font-bold text-theme-text">{editing.id ? "Edit Preset" : "New Preset"}</h2>

            <div className="flex flex-col gap-1.5">
              <label className="text-[11px] text-theme-muted font-semibold uppercase">Name</label>
              <input
                className={INP}
                placeholder="e.g. Fire Burst"
                value={editing.name}
                onChange={e => setEditing(v => v ? { ...v, name: e.target.value } : v)}
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <div className="flex items-center justify-between">
                <label className="text-[11px] text-theme-muted font-semibold uppercase">Emitter Config (JSON)</label>
                {jsonError && <span className="text-[11px] text-theme-red">{jsonError}</span>}
              </div>
              <textarea
                className={cn(INP, "font-mono text-[12px] h-[300px] resize-y")}
                value={editing.emitterConfig}
                onChange={e => {
                  setEditing(v => v ? { ...v, emitterConfig: e.target.value } : v);
                  validateJson(e.target.value);
                }}
                spellCheck={false}
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-[11px] text-theme-muted font-semibold uppercase">Preview GIF</label>
              {editing.previewGifUrl && (
                <img src={editing.previewGifUrl} alt="preview" className="w-40 h-[120px] object-contain rounded-lg bg-black mb-1.5" />
              )}
              <div className="flex gap-2">
                <button
                  className="px-3.5 py-1.5 bg-theme-purple/[.13] border border-theme-purple/25 rounded-lg text-[13px] font-semibold text-theme-purple cursor-pointer disabled:opacity-50"
                  onClick={() => fileRef.current?.click()}
                  disabled={uploading}
                >
                  {uploading ? "Uploading…" : "Upload GIF"}
                </button>
                {editing.previewGifUrl && (
                  <button
                    className="px-3.5 py-1.5 bg-theme-muted/10 border border-theme-muted/25 rounded-lg text-[13px] font-semibold text-theme-muted cursor-pointer"
                    onClick={() => setEditing(v => v ? { ...v, previewGifUrl: "" } : v)}
                  >
                    Remove
                  </button>
                )}
              </div>
              <input ref={fileRef} type="file" accept="image/gif,image/png,image/webp" className="hidden"
                onChange={e => { const f = e.target.files?.[0]; if (f) handleGifUpload(f); }} />
            </div>

            <div className="flex gap-2.5">
              <button
                className="flex-1 px-3.5 py-1.5 bg-theme-green/[.13] border border-theme-green/25 rounded-lg text-[13px] font-semibold text-theme-green cursor-pointer disabled:opacity-50"
                onClick={handleSave}
                disabled={saving || !editing.name.trim()}
              >
                {saving ? "Saving…" : "Save"}
              </button>
              <button
                className="flex-1 px-3.5 py-1.5 bg-theme-muted/10 border border-theme-muted/25 rounded-lg text-[13px] font-semibold text-theme-muted cursor-pointer"
                onClick={() => setEditing(null)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
