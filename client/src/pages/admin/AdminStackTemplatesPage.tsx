import { useEffect, useState } from "react";
import {
  collection,
  getDocs,
  doc,
  setDoc,
  deleteDoc,
  query,
  orderBy,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import type { StackTemplate } from "@/types/beybladeSystem";

const PART_TYPE_HINTS = [
  "tip_parts",
  "core_parts",
  "weight_disk_parts",
  "spin_track_parts",
  "attack_ring_parts",
  "casing_parts",
  "sub_parts",
  "bit_beast_parts",
  "gear_parts",
] as const;

interface EditingTemplate {
  id: string;
  name: string;
  description: string;
  slots: { slotIndex: number; partTypeHint: string; label: string }[];
}

const emptyTemplate = (): EditingTemplate => ({
  id: "",
  name: "",
  description: "",
  slots: [
    { slotIndex: 0, partTypeHint: "tip_parts", label: "Tip / Driver" },
    { slotIndex: 1, partTypeHint: "weight_disk_parts", label: "Weight Disk / Disc" },
    { slotIndex: 2, partTypeHint: "attack_ring_parts", label: "Attack Ring / Layer" },
  ],
});

export default function AdminStackTemplatesPage() {
  const [templates, setTemplates] = useState<(StackTemplate & { _docId: string })[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<EditingTemplate | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    try {
      const q = query(collection(db, "stack_templates"), orderBy("name"));
      const snap = await getDocs(q);
      setTemplates(
        snap.docs.map((d) => ({
          ...(d.data() as StackTemplate),
          _docId: d.id,
        }))
      );
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : String(e));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const openNew = () => setEditing(emptyTemplate());

  const openEdit = (t: StackTemplate & { _docId: string }) => {
    setEditing({
      id: t._docId,
      name: t.name,
      description: t.description,
      slots: t.slots.map((s) => ({ ...s })),
    });
  };

  const addSlot = () => {
    if (!editing) return;
    setEditing({
      ...editing,
      slots: [
        ...editing.slots,
        {
          slotIndex: editing.slots.length,
          partTypeHint: "attack_ring_parts",
          label: `Slot ${editing.slots.length}`,
        },
      ],
    });
  };

  const removeSlot = (idx: number) => {
    if (!editing) return;
    const updated = editing.slots
      .filter((_, i) => i !== idx)
      .map((s, i) => ({ ...s, slotIndex: i }));
    setEditing({ ...editing, slots: updated });
  };

  const updateSlot = (
    idx: number,
    field: keyof EditingTemplate["slots"][0],
    value: string | number
  ) => {
    if (!editing) return;
    const slots = editing.slots.map((s, i) =>
      i === idx ? { ...s, [field]: value } : s
    );
    setEditing({ ...editing, slots });
  };

  const save = async () => {
    if (!editing) return;
    if (!editing.name.trim()) { setError("Template name is required."); return; }
    setSaving(true);
    setError(null);
    try {
      const id = editing.id || `tmpl_${Date.now()}`;
      const data: StackTemplate = {
        id,
        name: editing.name.trim(),
        description: editing.description.trim(),
        slots: editing.slots,
      };
      await setDoc(doc(db, "stack_templates", id), data, { merge: true });
      setEditing(null);
      await load();
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : String(e));
    } finally {
      setSaving(false);
    }
  };

  const deleteTemplate = async (id: string) => {
    try {
      await deleteDoc(doc(db, "stack_templates", id));
      setTemplates((prev) => prev.filter((t) => t._docId !== id));
    } finally {
      setConfirmDelete(null);
    }
  };

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white">Stack Templates</h1>
          <p className="text-gray-400 text-sm mt-1">
            Define generation-specific starting presets for the Stack Builder. Slots are hints only — users can put any part in any slot.
          </p>
        </div>
        <button
          onClick={openNew}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors"
        >
          + New Template
        </button>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-900/40 border border-red-700 rounded-lg text-red-300 text-sm">
          {error}
        </div>
      )}

      {/* Edit form */}
      {editing && (
        <div className="mb-6 p-5 bg-gray-900 border border-blue-700/50 rounded-xl">
          <h2 className="text-lg font-semibold text-white mb-4">
            {editing.id ? "Edit Template" : "New Template"}
          </h2>

          <div className="grid grid-cols-1 gap-4 mb-4">
            <div>
              <label className="block text-xs text-gray-400 mb-1">Template Name *</label>
              <input
                type="text"
                value={editing.name}
                onChange={(e) => setEditing({ ...editing, name: e.target.value })}
                placeholder="e.g. Burst Standard, MFB Classic, Plastic Gen"
                className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white text-sm focus:outline-none focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-xs text-gray-400 mb-1">Description</label>
              <textarea
                value={editing.description}
                onChange={(e) => setEditing({ ...editing, description: e.target.value })}
                placeholder="Describe the template's generation / suggested use"
                rows={2}
                className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white text-sm focus:outline-none focus:border-blue-500 resize-none"
              />
            </div>
          </div>

          <div className="mb-4">
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs text-gray-400">Slot Hints (ordered bottom → top)</label>
              <button
                onClick={addSlot}
                className="text-xs text-blue-400 hover:text-blue-300"
              >
                + Add Slot
              </button>
            </div>
            <div className="space-y-2">
              {editing.slots.map((slot, i) => (
                <div key={i} className="flex items-center gap-2 p-2 bg-gray-800 rounded-lg">
                  <span className="text-gray-500 text-xs w-5 text-center">{i}</span>
                  <select
                    value={slot.partTypeHint}
                    onChange={(e) => updateSlot(i, "partTypeHint", e.target.value)}
                    className="px-2 py-1 bg-gray-700 border border-gray-600 rounded text-white text-xs focus:outline-none"
                  >
                    {PART_TYPE_HINTS.map((h) => (
                      <option key={h} value={h}>{h}</option>
                    ))}
                    <option value="">any</option>
                  </select>
                  <input
                    type="text"
                    value={slot.label}
                    onChange={(e) => updateSlot(i, "label", e.target.value)}
                    placeholder="Slot label hint"
                    className="flex-1 px-2 py-1 bg-gray-700 border border-gray-600 rounded text-white text-xs focus:outline-none"
                  />
                  <button
                    onClick={() => removeSlot(i)}
                    className="text-gray-500 hover:text-red-400 text-xs"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="flex gap-2">
            <button
              onClick={save}
              disabled={saving}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors disabled:opacity-50"
            >
              {saving ? "Saving…" : "Save Template"}
            </button>
            <button
              onClick={() => { setEditing(null); setError(null); }}
              className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg text-sm transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* List */}
      {loading ? (
        <div className="flex items-center justify-center h-32">
          <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : templates.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          No templates yet. Create one to help players start their builds.
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {templates.map((t) => (
            <div
              key={t._docId}
              className="p-4 bg-gray-900 border border-gray-700 rounded-xl"
              data-testid="template-row"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  <h3 className="text-white font-semibold">{t.name}</h3>
                  {t.description && (
                    <p className="text-gray-400 text-sm mt-0.5">{t.description}</p>
                  )}
                  <div className="flex flex-wrap gap-1 mt-2">
                    {t.slots.map((s, i) => (
                      <span
                        key={i}
                        className="px-2 py-0.5 bg-gray-700 text-gray-300 rounded text-xs"
                        title={s.partTypeHint}
                      >
                        {s.label || s.partTypeHint}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="flex items-center gap-2 ml-4 flex-shrink-0">
                  <button
                    onClick={() => openEdit(t)}
                    className="px-3 py-1 text-xs bg-gray-700 hover:bg-gray-600 text-white rounded transition-colors"
                  >
                    Edit
                  </button>
                  {confirmDelete === t._docId ? (
                    <>
                      <button
                        onClick={() => deleteTemplate(t._docId)}
                        className="px-3 py-1 text-xs bg-red-700 hover:bg-red-600 text-white rounded transition-colors"
                      >
                        Confirm
                      </button>
                      <button
                        onClick={() => setConfirmDelete(null)}
                        className="px-3 py-1 text-xs bg-gray-700 hover:bg-gray-600 text-white rounded transition-colors"
                      >
                        Cancel
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={() => setConfirmDelete(t._docId)}
                      className="px-3 py-1 text-xs bg-red-900/60 hover:bg-red-800 text-red-300 rounded transition-colors"
                    >
                      Delete
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
