import { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { doc, getDoc, setDoc, deleteDoc } from "firebase/firestore";
import toast from "react-hot-toast";
import { db } from "@/lib/firebase";
import { AdminBreadcrumbs } from "@/components/admin/AdminBreadcrumbs";
import { DeleteConfirmModal } from "@/components/admin/DeleteConfirmModal";
import type { RPGFieldDef } from "@/hooks/useFormState";
import { useFormState, formValuesToData, dataToFormValues } from "@/hooks/useFormState";
import { slugify } from "@/pages/admin/rpg/rpgAdminShared";

export interface RPGFormConfig {
  collectionId: string;
  title: string;
  backPath: string;
  backLabel: string;
  fields: RPGFieldDef[];
  /** Called after save to navigate. Defaults to backPath. */
  afterSavePath?: string;
}

interface Props {
  config: RPGFormConfig;
  mode: "create" | "edit";
}

const INP = "w-full bg-bg2 border border-border-c rounded-lg px-3 py-2 text-sm text-theme-text placeholder:text-theme-muted focus:outline-none focus:border-accent";
const TEXTAREA_CLS = `${INP} font-mono min-h-[100px]`;
const LBL = "block text-xs font-semibold text-theme-muted uppercase tracking-wide mb-1.5";

function FieldInput({ field, value, onChange }: { field: RPGFieldDef; value: unknown; onChange: (v: unknown) => void }) {
  const strVal = String(value ?? "");
  const numVal = Number(value) || 0;
  const boolVal = Boolean(value);

  if (field.type === "textarea") {
    return <textarea className={TEXTAREA_CLS} value={strVal} onChange={e => onChange(e.target.value)} rows={3} />;
  }
  if (field.type === "number") {
    return <input type="number" className={INP} value={numVal} onChange={e => onChange(+e.target.value)} />;
  }
  if (field.type === "boolean") {
    return (
      <div className="flex items-center gap-2 mt-1">
        <input type="checkbox" id={field.key} checked={boolVal} onChange={e => onChange(e.target.checked)}
          className="w-4 h-4 accent-accent" />
        <label htmlFor={field.key} className="text-theme-muted text-sm">{field.hint ?? field.label}</label>
      </div>
    );
  }
  if (field.type === "select" && field.options) {
    return (
      <select className={INP} value={strVal} onChange={e => onChange(e.target.value)}>
        <option value="">— Select —</option>
        {field.options.map(opt => (
          <option key={opt.value} value={opt.value}>{opt.label}</option>
        ))}
      </select>
    );
  }
  // text or array (stored as comma-sep string in form)
  return <input className={INP} value={strVal} onChange={e => onChange(e.target.value)}
    placeholder={field.type === "array" ? "comma, separated, values" : ""} />;
}

export function RPGFormPage({ config, mode }: Props) {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(mode === "edit");
  const [saving, setSaving] = useState(false);
  const [docId, setDocId] = useState("");
  const [confirmDelete, setConfirmDelete] = useState(false);

  const { values, setValue, setValues, validate, errors } = useFormState(config.fields);

  useEffect(() => {
    if (mode !== "edit" || !id) return;
    (async () => {
      try {
        const snap = await getDoc(doc(db, config.collectionId, id));
        if (!snap.exists()) { toast.error("Not found"); navigate(config.backPath); return; }
        setValues(dataToFormValues(config.fields, snap.data() as Record<string, unknown>));
      } catch (e) { console.error(e); toast.error("Failed to load"); }
      finally { setLoading(false); }
    })();
  }, [mode, id]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleSave = async () => {
    if (!validate()) return;
    const finalId = mode === "create" ? (docId || slugify(String(values["displayName"] ?? values["title"] ?? values["name"] ?? ""))) : id;
    if (!finalId) { toast.error("ID required"); return; }
    setSaving(true);
    try {
      const data = formValuesToData(config.fields, values);
      await setDoc(doc(db, config.collectionId, finalId), data);
      toast.success(mode === "create" ? "Created" : "Saved");
      navigate(config.afterSavePath ?? config.backPath);
    } catch (e) { console.error(e); toast.error("Failed to save"); }
    finally { setSaving(false); }
  };

  const handleDelete = async () => {
    if (!id) return;
    try {
      await deleteDoc(doc(db, config.collectionId, id));
      toast.success("Deleted");
      navigate(config.backPath);
    } catch (e) { console.error(e); toast.error("Failed to delete"); }
  };

  const crumbs = [
    { label: "Admin", path: "/admin" },
    { label: config.backLabel, path: config.backPath },
    { label: mode === "create" ? `Create ${config.title}` : `Edit: ${id}` },
  ];

  if (loading) return <div className="p-6 text-theme-muted text-sm">Loading…</div>;

  return (
    <div className="p-6 w-full max-w-3xl">
      <AdminBreadcrumbs crumbs={crumbs} />
      <h1 className="text-[22px] font-bold text-theme-text mb-5">
        {mode === "create" ? `Create ${config.title}` : `Edit ${config.title}: ${id}`}
      </h1>

      <div className="bg-bg1 border border-border-c rounded-xl p-5 space-y-4">
        {/* ID field for create mode */}
        {mode === "create" && (
          <div>
            <label className={LBL}>ID (auto-generated if empty)</label>
            <input className={INP} value={docId} onChange={e => setDocId(e.target.value)} placeholder="auto" />
          </div>
        )}

        {config.fields.map(field => (
          <div key={field.key}>
            {field.type !== "boolean" && <label className={LBL}>{field.label}{field.required && " *"}</label>}
            <FieldInput field={field} value={values[field.key]} onChange={v => setValue(field.key, v)} />
            {field.hint && field.type !== "boolean" && (
              <p className="text-theme-muted text-xs mt-1">{field.hint}</p>
            )}
            {errors[field.key] && (
              <p className="text-red-400 text-xs mt-1">{errors[field.key]}</p>
            )}
          </div>
        ))}

        <div className="flex gap-3 pt-2">
          <button onClick={handleSave} disabled={saving}
            className="px-4 py-2 bg-accent hover:opacity-90 text-white rounded-lg text-sm font-medium transition-opacity disabled:opacity-60">
            {saving ? "Saving…" : mode === "create" ? "Create" : "Save Changes"}
          </button>
          {mode === "edit" && (
            <button onClick={() => setConfirmDelete(true)}
              className="px-4 py-2 bg-red-600/20 hover:bg-red-600/40 text-red-400 border border-red-600/30 rounded-lg text-sm font-medium transition-colors">
              Delete
            </button>
          )}
          <Link to={config.backPath} className="px-4 py-2 bg-bg2 border border-border-c text-theme-muted rounded-lg text-sm font-medium hover:text-theme-text transition-colors">
            Cancel
          </Link>
        </div>
      </div>

      <DeleteConfirmModal
        isOpen={confirmDelete}
        itemName={id ?? ""}
        onConfirm={handleDelete}
        onCancel={() => setConfirmDelete(false)}
      />
    </div>
  );
}
