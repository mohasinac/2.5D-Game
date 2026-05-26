import React, { useState, useEffect, useCallback } from "react";
import { collection, getDocs, doc, setDoc, deleteDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useGameDataStore } from "@/stores/gameDataStore";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Modal } from "@/components/ui/Modal";
import toast from "react-hot-toast";

type BaseDoc = { id: string; label: string; [key: string]: unknown };

export type FieldDef =
  | { key: string; type: "text"; label: string; required?: boolean; disabledOnEdit?: boolean; placeholder?: string }
  | { key: string; type: "textarea"; label: string; placeholder?: string }
  | { key: string; type: "number"; label: string; min?: number; max?: number; step?: number; placeholder?: string }
  | { key: string; type: "range"; label: string; min: number; max: number; step?: number; unit?: string }
  | { key: string; type: "color"; label: string }
  | { key: string; type: "checkbox"; label: string; description?: string };

interface SimpleDefsCrudPageProps {
  collectionId: string;
  storeKey: string;
  title: string;
  subtitle?: string;
  addLabel?: string;
  fields: FieldDef[];
  defaultValues: Record<string, unknown>;
  deleteWarning?: string;
  renderItemMeta?: (item: BaseDoc) => React.ReactNode;
}

export function SimpleDefsCrudPage({
  collectionId,
  storeKey,
  title,
  subtitle,
  addLabel = "Add",
  fields,
  defaultValues,
  deleteWarning = "This cannot be undone.",
  renderItemMeta,
}: SimpleDefsCrudPageProps) {
  const [items, setItems] = useState<BaseDoc[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<BaseDoc | null>(null);
  const [form, setForm] = useState<BaseDoc>({ id: "", label: "", ...defaultValues });
  const [confirmDelete, setConfirmDelete] = useState<BaseDoc | null>(null);
  const [saving, setSaving] = useState(false);
  const [query, setQuery] = useState("");
  const invalidate = useGameDataStore(s => s.invalidate);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const snap = await getDocs(collection(db, collectionId));
      const docs = snap.docs.map(d => ({ id: d.id, ...d.data() } as BaseDoc));
      docs.sort((a, b) => a.label.localeCompare(b.label));
      setItems(docs);
    } catch { toast.error(`Failed to load ${title.toLowerCase()}`); }
    finally { setLoading(false); }
  }, [collectionId, title]);

  useEffect(() => { load(); }, [load]);

  const openCreate = () => {
    setEditing(null);
    setForm({ id: "", label: "", ...defaultValues });
    setShowModal(true);
  };

  const openEdit = (item: BaseDoc) => {
    setEditing(item);
    setForm({ ...item });
    setShowModal(true);
  };

  const setField = (key: string, value: unknown) => {
    setForm(f => ({ ...f, [key]: value }));
  };

  const handleSave = async () => {
    const id = String(form.id ?? "").trim();
    if (!id) { toast.error("ID is required"); return; }
    if (!String(form.label ?? "").trim()) { toast.error("Label is required"); return; }
    setSaving(true);
    try {
      const { id: _id, ...data } = form;
      const payload: Record<string, unknown> = { ...data, updatedAt: new Date().toISOString() };
      // Remove undefined optional number fields so Firestore doesn't get null
      for (const f of fields) {
        if ((f.type === "number" || f.type === "range") && payload[f.key] == null) {
          delete payload[f.key];
        }
      }
      await setDoc(doc(db, collectionId, id), payload, { merge: true });
      toast.success(editing ? "Updated" : "Created");
      invalidate(storeKey as Parameters<typeof invalidate>[0]);
      setShowModal(false);
      load();
    } catch { toast.error("Save failed"); }
    finally { setSaving(false); }
  };

  const handleDelete = async () => {
    if (!confirmDelete) return;
    try {
      await deleteDoc(doc(db, collectionId, confirmDelete.id));
      toast.success("Deleted");
      invalidate(storeKey as Parameters<typeof invalidate>[0]);
      setConfirmDelete(null);
      load();
    } catch { toast.error("Delete failed"); }
  };

  const filtered = items.filter(i =>
    String(i.label).toLowerCase().includes(query.toLowerCase()) ||
    i.id.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="p-6 page-shell">
      <div className="max-w-[800px]">
        <div className="flex flex-wrap items-start justify-between gap-3 mb-5">
          <div>
            <h1 className="text-xl font-bold text-theme-text">{title}</h1>
            {subtitle && <p className="text-sm text-theme-muted mt-1">{subtitle}</p>}
          </div>
          <Button variant="primary" size="sm" onClick={openCreate}>+ {addLabel}</Button>
        </div>

        <Input
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder="Search…"
          className="mb-4 max-w-xs"
        />

        {loading ? (
          <div className="text-theme-muted text-sm">Loading…</div>
        ) : filtered.length === 0 ? (
          <div className="text-theme-muted text-sm">No items found. Add one above.</div>
        ) : (
          <div className="flex flex-col gap-2">
            {filtered.map(item => (
              <div key={item.id} className="flex flex-wrap items-center gap-3 bg-bg1 border border-border-c rounded-xl px-4 py-3">
                {typeof item.color === "string" && item.color && (
                  <span className="w-4 h-4 rounded-full shrink-0 border border-border-c bg-[color:var(--ic)]" style={{ "--ic": item.color as string } as React.CSSProperties} />
                )}
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-semibold text-theme-text flex flex-wrap items-center gap-2">
                    {item.label as string}
                    {renderItemMeta?.(item)}
                  </div>
                  <div className="text-[11px] text-theme-faint mt-0.5 truncate">
                    ID: {item.id}
                    {item.description ? ` — ${item.description as string}` : ""}
                  </div>
                </div>
                <Button variant="outline" size="xs" onClick={() => openEdit(item)}>Edit</Button>
                <Button variant="danger" size="xs" onClick={() => setConfirmDelete(item)}>Delete</Button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Create / Edit modal */}
      <Modal
        open={showModal}
        onClose={() => setShowModal(false)}
        title={`${editing ? "Edit" : "Add"} ${title.replace(/ Defs?$/, "")}`}
        size="sm"
      >
        <div className="p-5 flex flex-col gap-3">
          {/* ID field — always first */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs text-theme-muted font-medium">ID (slug) *</label>
            <input
              value={String(form.id ?? "")}
              onChange={e => setField("id", e.target.value)}
              disabled={!!editing}
              placeholder="my_id"
              className="w-full bg-bg3 border border-border-c rounded-md px-3 py-2 text-sm text-theme-text placeholder:text-theme-faint focus:outline-none focus:border-theme-blue transition-colors disabled:opacity-50"
            />
          </div>

          {/* Dynamic fields */}
          {fields.map(f => {
            const val = form[f.key];
            if (f.type === "text") return (
              <Input
                key={f.key}
                label={f.label + (f.required ? " *" : "")}
                value={String(val ?? "")}
                onChange={e => setField(f.key, e.target.value)}
                disabled={f.disabledOnEdit && !!editing}
                placeholder={f.placeholder ?? ""}
              />
            );
            if (f.type === "textarea") return (
              <div key={f.key} className="flex flex-col gap-1.5">
                <label className="text-xs text-theme-muted font-medium">{f.label}</label>
                <textarea
                  value={String(val ?? "")}
                  onChange={e => setField(f.key, e.target.value || undefined)}
                  placeholder={f.placeholder ?? "Optional…"}
                  className="w-full bg-bg3 border border-border-c rounded-md px-3 py-2 text-sm text-theme-text placeholder:text-theme-faint focus:outline-none focus:border-theme-blue transition-colors resize-y min-h-[70px]"
                />
              </div>
            );
            if (f.type === "number") return (
              <Input
                key={f.key}
                label={f.label}
                type="number"
                min={f.min}
                max={f.max}
                step={f.step ?? 1}
                value={val != null ? String(val) : ""}
                onChange={e => setField(f.key, e.target.value ? parseFloat(e.target.value) : undefined)}
                placeholder={f.placeholder ?? ""}
              />
            );
            if (f.type === "range") return (
              <div key={f.key} className="flex flex-col gap-1.5">
                <label className="text-xs text-theme-muted font-medium">{f.label}</label>
                <div className="flex items-center gap-3">
                  <input
                    type="range"
                    min={f.min}
                    max={f.max}
                    step={f.step ?? 1}
                    value={Number(val ?? f.min)}
                    onChange={e => setField(f.key, parseInt(e.target.value))}
                    className="flex-1"
                  />
                  <span className="text-sm text-theme-text min-w-[48px] text-right">
                    {Number(val ?? f.min)}{f.unit ?? ""}
                  </span>
                </div>
              </div>
            );
            if (f.type === "color") return (
              <div key={f.key} className="flex flex-col gap-1.5">
                <label className="text-xs text-theme-muted font-medium">{f.label}</label>
                <div className="flex gap-2.5 items-center">
                  <input
                    type="color"
                    value={String(val ?? "#3b82f6")}
                    onChange={e => setField(f.key, e.target.value)}
                    className="w-12 h-9 border border-border-c rounded-lg bg-bg0 cursor-pointer p-0.5 shrink-0"
                  />
                  <input
                    value={String(val ?? "#3b82f6")}
                    onChange={e => setField(f.key, e.target.value)}
                    className="flex-1 bg-bg3 border border-border-c rounded-md px-3 py-2 text-sm text-theme-text focus:outline-none focus:border-theme-blue transition-colors"
                    placeholder="#3b82f6"
                  />
                </div>
              </div>
            );
            if (f.type === "checkbox") return (
              <label key={f.key} className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={!!val}
                  onChange={e => setField(f.key, e.target.checked)}
                  className="w-4 h-4 rounded"
                />
                <span className="text-sm text-theme-text">{f.label}</span>
                {f.description && <span className="text-xs text-theme-faint">({f.description})</span>}
              </label>
            );
            return null;
          })}

          <div className="flex gap-2 justify-end pt-2">
            <Button variant="outline" size="sm" onClick={() => setShowModal(false)}>Cancel</Button>
            <Button variant="primary" size="sm" onClick={handleSave} disabled={saving}>
              {saving ? "Saving…" : "Save"}
            </Button>
          </div>
        </div>
      </Modal>

      {/* Delete confirm modal */}
      <Modal
        open={!!confirmDelete}
        onClose={() => setConfirmDelete(null)}
        size="sm"
      >
        <div className="p-5 text-center flex flex-col gap-4">
          <div className="text-base font-semibold text-theme-text">
            Delete "{confirmDelete?.label as string}"?
          </div>
          <div className="text-sm text-theme-muted">{deleteWarning}</div>
          <div className="flex gap-2 justify-center">
            <Button variant="outline" size="sm" onClick={() => setConfirmDelete(null)}>Cancel</Button>
            <Button variant="danger" size="sm" onClick={handleDelete}>Delete</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
