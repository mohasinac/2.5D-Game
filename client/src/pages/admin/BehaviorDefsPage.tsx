import { useState, useEffect, useCallback } from "react";
import { collection, getDocs, doc, setDoc, deleteDoc } from "firebase/firestore";
import { db, COLLECTIONS } from "@/lib/firebase";
import { SearchableSelect } from "@/components/admin/SearchableSelect";
import toast from "react-hot-toast";

interface BehaviorDefDoc {
  id: string;
  name: string;
  description: string;
  behaviorType: string;
  parameters?: Record<string, unknown>;
}

const BEHAVIOR_TYPE_OPTIONS = [
  { value: "ai_pattern", label: "AI Pattern", hint: "Defines an AI decision-making pattern" },
  { value: "arena_event", label: "Arena Event", hint: "Triggered event logic for arena features" },
  { value: "trigger_effect", label: "Trigger Effect", hint: "What happens when a trigger fires" },
  { value: "switch_logic", label: "Switch Logic", hint: "Control logic for switch-activated features" },
  { value: "obstacle_behavior", label: "Obstacle Behavior", hint: "Dynamic behavior for moving obstacles" },
];

function slugify(s: string) {
  return s.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "").replace(/-+/g, "-").replace(/^-|-$/g, "");
}

function tryParseJson(s: string): Record<string, unknown> | null {
  try { return JSON.parse(s); } catch { return null; }
}

const EMPTY = { name: "", description: "", behaviorType: "ai_pattern", parametersJson: "{}" };

/** Tailwind class for each behavior type badge */
const TYPE_COLOR_CLS: Record<string, string> = {
  ai_pattern: "bg-theme-green/[.13] text-theme-green",
  arena_event: "bg-theme-yellow/[.13] text-theme-yellow",
  trigger_effect: "bg-orange-400/[.13] text-orange-400",
  switch_logic: "bg-blue-10 text-theme-blue",
  obstacle_behavior: "bg-violet-400/[.13] text-violet-400",
};

export default function BehaviorDefsPage() {
  const [items, setItems] = useState<BehaviorDefDoc[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<BehaviorDefDoc | null>(null);
  const [form, setForm] = useState({ ...EMPTY });
  const [jsonError, setJsonError] = useState("");
  const [confirmDelete, setConfirmDelete] = useState<BehaviorDefDoc | null>(null);
  const [saving, setSaving] = useState(false);
  const [query, setQuery] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const snap = await getDocs(collection(db, COLLECTIONS.BEHAVIOR_DEFS));
      const docs = snap.docs.map(d => ({ id: d.id, ...d.data() } as BehaviorDefDoc));
      docs.sort((a, b) => a.name.localeCompare(b.name));
      setItems(docs);
    } catch { toast.error("Failed to load behavior defs"); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { load(); }, [load]);

  const openCreate = () => { setEditing(null); setForm({ ...EMPTY }); setJsonError(""); setShowModal(true); };
  const openEdit = (item: BehaviorDefDoc) => {
    setEditing(item);
    setForm({
      name: item.name, description: item.description, behaviorType: item.behaviorType,
      parametersJson: item.parameters ? JSON.stringify(item.parameters, null, 2) : "{}",
    });
    setJsonError("");
    setShowModal(true);
  };

  const handleJsonChange = (v: string) => {
    setForm(f => ({ ...f, parametersJson: v }));
    setJsonError(tryParseJson(v) ? "" : "Invalid JSON");
  };

  const handleSave = async () => {
    if (!form.name.trim()) { toast.error("Name is required"); return; }
    const params = tryParseJson(form.parametersJson);
    if (!params) { toast.error("Parameters JSON is invalid"); return; }
    setSaving(true);
    try {
      const data: Omit<BehaviorDefDoc, "id"> = {
        name: form.name.trim(), description: form.description.trim(), behaviorType: form.behaviorType,
        parameters: params,
      };
      const id = editing ? editing.id : slugify(form.name) || `behavior-${Date.now()}`;
      await setDoc(doc(db, COLLECTIONS.BEHAVIOR_DEFS, id), data);
      toast.success(editing ? `Updated "${form.name}"` : `Created "${form.name}"`);
      setShowModal(false);
      load();
    } catch { toast.error("Save failed"); }
    finally { setSaving(false); }
  };

  const handleDelete = async () => {
    if (!confirmDelete) return;
    try {
      await deleteDoc(doc(db, COLLECTIONS.BEHAVIOR_DEFS, confirmDelete.id));
      toast.success(`Deleted "${confirmDelete.name}"`);
      setConfirmDelete(null);
      load();
    } catch { toast.error("Delete failed"); }
  };

  const filtered = query ? items.filter(i => i.name.toLowerCase().includes(query.toLowerCase()) || i.id.includes(query)) : items;

  const inputCls = "w-full px-2.5 py-2 bg-bg0 border border-border-c rounded-lg text-theme-text text-[13px] box-border";

  return (
    <div className="page-shell p-4 sm:p-6">
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-[22px] font-bold text-theme-text">Behavior Definitions</h1>
          <p className="text-theme-faint text-[13px] mt-1">{loading ? "Loading…" : `${items.length} behavior defs`}</p>
        </div>
        <button
          onClick={openCreate}
          className="px-4 py-2 bg-theme-blue text-white rounded-lg text-[13px] font-medium border-none cursor-pointer"
        >
          + New Behavior
        </button>
      </div>

      <input
        value={query}
        onChange={e => setQuery(e.target.value)}
        placeholder="Filter behaviors…"
        className={`${inputCls} mb-3`}
      />

      {loading ? (
        <div className="text-theme-muted">Loading…</div>
      ) : filtered.length === 0 ? (
        <div className="text-theme-muted">No behavior defs found.</div>
      ) : (
        <div className="flex flex-col gap-2">
          {filtered.map(item => {
            const typeCls = TYPE_COLOR_CLS[item.behaviorType] ?? "bg-blue-10 text-theme-blue";
            const paramCount = item.parameters ? Object.keys(item.parameters).length : 0;
            return (
              <div key={item.id} className="flex items-center gap-3.5 bg-bg1 border border-border-c rounded-xl px-4 py-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-semibold text-theme-text text-[14px]">{item.name}</span>
                    <span className="font-mono text-[11px] text-theme-faint bg-bg2 px-1.5 py-px rounded">{item.id}</span>
                    <span className={`text-[11px] px-[7px] py-0.5 rounded ${typeCls}`}>{item.behaviorType}</span>
                    {paramCount > 0 && (
                      <span className="text-[11px] text-theme-muted">{paramCount} param{paramCount !== 1 ? "s" : ""}</span>
                    )}
                  </div>
                  {item.description && (
                    <div className="text-[12px] text-theme-muted mt-[3px]">{item.description}</div>
                  )}
                </div>
                <button
                  onClick={() => openEdit(item)}
                  className="px-3.5 py-1.5 rounded-[7px] text-[12px] cursor-pointer border border-border-c bg-transparent text-theme-muted"
                >Edit</button>
                <button
                  onClick={() => setConfirmDelete(item)}
                  className="px-3.5 py-1.5 rounded-[7px] text-[12px] cursor-pointer border border-theme-red/40 bg-transparent text-theme-red"
                >Delete</button>
              </div>
            );
          })}
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 bg-black/75 flex items-center justify-center z-[1000] p-4">
          <div className="bg-bg1 border border-border-c rounded-2xl p-7 w-full max-w-[560px] max-h-[90vh] overflow-y-auto">
            <h3 className="text-[17px] font-bold text-theme-text mb-5">
              {editing ? "Edit Behavior Def" : "New Behavior Def"}
            </h3>

            <label className="block mb-3.5">
              <span className="text-[12px] text-theme-muted block mb-1">Name</span>
              <input
                value={form.name}
                onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                className={inputCls}
              />
              {!editing && form.name && (
                <span className="text-[11px] text-theme-faint">ID: {slugify(form.name) || "…"}</span>
              )}
            </label>

            <div className="mb-3.5">
              <span className="text-[12px] text-theme-muted block mb-1">Behavior Type</span>
              <SearchableSelect
                value={form.behaviorType}
                onChange={v => setForm(f => ({ ...f, behaviorType: v }))}
                options={BEHAVIOR_TYPE_OPTIONS}
                placeholder="Type…"
              />
            </div>

            <label className="block mb-3.5">
              <span className="text-[12px] text-theme-muted block mb-1">Description</span>
              <textarea
                value={form.description}
                onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                rows={2}
                className={`${inputCls} resize-y`}
              />
            </label>

            <label className="block mb-5">
              <span className="text-[12px] text-theme-muted block mb-1">
                Parameters (JSON)
                {jsonError && <span className="text-theme-red ml-2">{jsonError}</span>}
              </span>
              <textarea
                value={form.parametersJson}
                onChange={e => handleJsonChange(e.target.value)}
                rows={6}
                className={`${inputCls} resize-y font-mono text-[12px] ${jsonError ? "border-theme-red" : "border-border-c"}`}
              />
            </label>

            <div className="flex gap-2.5 justify-end">
              <button
                onClick={() => setShowModal(false)}
                className="px-[18px] py-2 rounded-lg text-[13px] border border-border-c bg-transparent text-theme-muted cursor-pointer"
              >Cancel</button>
              <button
                onClick={handleSave}
                disabled={saving || !!jsonError}
                className="px-[18px] py-2 rounded-lg text-[13px] border-none bg-theme-blue text-white cursor-pointer disabled:opacity-60"
              >
                {saving ? "Saving…" : "Save"}
              </button>
            </div>
          </div>
        </div>
      )}

      {confirmDelete && (
        <div className="fixed inset-0 bg-black/75 flex items-center justify-center z-[1000]">
          <div className="bg-bg1 border border-border-c rounded-2xl p-7 max-w-[400px] w-[90%]">
            <h3 className="text-[16px] font-bold text-theme-text mb-2.5">Delete "{confirmDelete.name}"?</h3>
            <p className="text-theme-muted text-[13px] mb-5">This will permanently remove the behavior definition.</p>
            <div className="flex gap-2.5 justify-end">
              <button
                onClick={() => setConfirmDelete(null)}
                className="px-4 py-[7px] rounded-lg text-[13px] border border-border-c bg-transparent text-theme-muted cursor-pointer"
              >Cancel</button>
              <button
                onClick={handleDelete}
                className="px-4 py-[7px] rounded-lg text-[13px] border-none bg-theme-red text-white cursor-pointer"
              >Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
