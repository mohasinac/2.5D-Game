// [ADMIN-PAGE] ParticlePresetsPage — CRUD for particle_presets collection.
// Each preset stores a PixiJS particle emitter JSON config + optional preview GIF.

import { useState, useEffect, useRef } from "react";
import {
  collection, getDocs, addDoc, updateDoc, deleteDoc, doc,
} from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL, deleteObject } from "firebase/storage";
import { db, storage } from "@/lib/firebase";
import { C } from "@/styles/theme";
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

const btnStyle = (color: string) => ({
  background: color + "22",
  border: `1px solid ${color}44`,
  borderRadius: 8,
  padding: "6px 14px",
  color,
  fontSize: 13,
  cursor: "pointer",
  fontWeight: 600,
} as const);

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
    <div style={{ padding: 24, width: "100%", boxSizing: "border-box" as const }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24 }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 700, color: C.text }}>Particle Presets</h1>
          <p style={{ color: C.faint, fontSize: 13, marginTop: 4 }}>
            PixiJS particle emitter configs for combo visual effects. Reference by <code style={{ color: C.blue }}>particlePresetId</code>.
          </p>
        </div>
        <button style={btnStyle(C.green)} onClick={() => setEditing(emptyEdit())}>+ New Preset</button>
      </div>

      {loading ? (
        <p style={{ color: C.faint }}>Loading…</p>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 14 }}>
          {presets.map(p => (
            <div key={p.id} style={{ background: "var(--bg2)", border: `1px solid ${C.border}`, borderRadius: 14, padding: 16, display: "flex", flexDirection: "column", gap: 10 }}>
              {p.previewGifUrl && (
                <img src={p.previewGifUrl} alt="preview" style={{ width: "100%", height: 120, objectFit: "contain", borderRadius: 8, background: "#000" }} />
              )}
              <div style={{ fontWeight: 600, color: C.text, fontSize: 14 }}>{p.name}</div>
              <div style={{ fontFamily: "monospace", fontSize: 11, color: C.faint }}>{p.id}</div>
              <div style={{ fontSize: 11, color: C.muted }}>
                {Object.keys(p.emitterConfig ?? {}).length} config keys
              </div>
              <div style={{ display: "flex", gap: 8 }}>
                <button style={{ ...btnStyle(C.blue), flex: 1 }} onClick={() => setEditing({
                  id: p.id,
                  name: p.name,
                  emitterConfig: JSON.stringify(p.emitterConfig, null, 2),
                  previewGifUrl: p.previewGifUrl ?? "",
                })}>Edit</button>
                <button style={{ ...btnStyle(C.red), flex: 1 }} onClick={() => handleDelete(p)}>Delete</button>
              </div>
            </div>
          ))}
          {presets.length === 0 && (
            <p style={{ color: C.faint, gridColumn: "1/-1" }}>No presets yet. Create your first one.</p>
          )}
        </div>
      )}

      {/* ── Edit drawer ───────────────────────────────────────────────────────── */}
      {editing && (
        <div style={{
          position: "fixed", inset: 0, background: "#000a", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000,
        }} onClick={e => { if (e.target === e.currentTarget) setEditing(null); }}>
          <div style={{ background: "var(--bg1)", border: `1px solid ${C.border}`, borderRadius: 18, padding: 28, width: 640, maxHeight: "90vh", overflowY: "auto", display: "flex", flexDirection: "column", gap: 18 }}>
            <h2 style={{ fontSize: 18, fontWeight: 700, color: C.text }}>{editing.id ? "Edit Preset" : "New Preset"}</h2>

            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              <label style={{ fontSize: 11, color: C.muted, fontWeight: 600, textTransform: "uppercase" }}>Name</label>
              <input
                style={inputStyle}
                placeholder="e.g. Fire Burst"
                value={editing.name}
                onChange={e => setEditing(v => v ? { ...v, name: e.target.value } : v)}
              />
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <label style={{ fontSize: 11, color: C.muted, fontWeight: 600, textTransform: "uppercase" }}>Emitter Config (JSON)</label>
                {jsonError && <span style={{ fontSize: 11, color: C.red }}>{jsonError}</span>}
              </div>
              <textarea
                style={{ ...inputStyle, fontFamily: "monospace", fontSize: 12, height: 300, resize: "vertical" }}
                value={editing.emitterConfig}
                onChange={e => {
                  setEditing(v => v ? { ...v, emitterConfig: e.target.value } : v);
                  validateJson(e.target.value);
                }}
                spellCheck={false}
              />
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              <label style={{ fontSize: 11, color: C.muted, fontWeight: 600, textTransform: "uppercase" }}>Preview GIF</label>
              {editing.previewGifUrl && (
                <img src={editing.previewGifUrl} alt="preview" style={{ width: 160, height: 120, objectFit: "contain", borderRadius: 8, background: "#000", marginBottom: 6 }} />
              )}
              <div style={{ display: "flex", gap: 8 }}>
                <button
                  style={btnStyle(C.purple)}
                  onClick={() => fileRef.current?.click()}
                  disabled={uploading}
                >
                  {uploading ? "Uploading…" : "Upload GIF"}
                </button>
                {editing.previewGifUrl && (
                  <button style={btnStyle(C.muted)} onClick={() => setEditing(v => v ? { ...v, previewGifUrl: "" } : v)}>
                    Remove
                  </button>
                )}
              </div>
              <input ref={fileRef} type="file" accept="image/gif,image/png,image/webp" style={{ display: "none" }}
                onChange={e => { const f = e.target.files?.[0]; if (f) handleGifUpload(f); }} />
            </div>

            <div style={{ display: "flex", gap: 10 }}>
              <button style={{ ...btnStyle(C.green), flex: 1 }} onClick={handleSave} disabled={saving || !editing.name.trim()}>
                {saving ? "Saving…" : "Save"}
              </button>
              <button style={{ ...btnStyle(C.muted), flex: 1 }} onClick={() => setEditing(null)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
