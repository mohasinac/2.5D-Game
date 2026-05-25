import { useNavigate } from "react-router-dom";
import { doc, deleteDoc } from "firebase/firestore";
import { db, COLLECTIONS } from "@/lib/firebase";
import { useElementTypes, invalidateElementTypesCache } from "@/hooks/useElementTypes";
import type { ElementTypeConfig } from "@/types/elementTypeConfig";
import toast from "react-hot-toast";
import { C } from "@/styles/theme";
import { useState } from "react";

export function ElementTypesListPage() {
  const navigate = useNavigate();
  const { configs, loading, refresh } = useElementTypes();
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<ElementTypeConfig | null>(null);

  const handleDelete = async () => {
    if (!confirmDelete) return;
    setDeletingId(confirmDelete.id);
    try {
      await deleteDoc(doc(db, COLLECTIONS.ELEMENT_TYPE_CONFIGS, confirmDelete.id));
      invalidateElementTypesCache();
      refresh();
      toast.success(`Deleted "${confirmDelete.name}"`);
      setConfirmDelete(null);
    } catch {
      toast.error("Delete failed");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div style={{ padding: 24, width: "100%", boxSizing: "border-box" as const }}>
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 24 }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 700, color: C.text }}>Element Types</h1>
          <p style={{ color: C.faint, fontSize: 13, marginTop: 4 }}>
            {loading ? "Loading…" : `${configs.length} types configured`}
          </p>
        </div>
        <button
          onClick={() => navigate("/admin/element-types/create")}
          style={{ padding: "8px 16px", background: C.blue, color: "#fff", borderRadius: 8, fontSize: 13, fontWeight: 500, border: "none", cursor: "pointer" }}
        >
          + New Type
        </button>
      </div>

      {loading ? (
        <div style={{ color: C.muted, fontSize: 14 }}>Loading element types…</div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {configs.map(cfg => (
            <div
              key={cfg.id}
              style={{
                display: "flex", alignItems: "center", gap: 14,
                background: C.bg1, border: `1px solid ${C.border}`,
                borderRadius: 12, padding: "12px 16px",
              }}
            >
              {/* Color badge + icon */}
              <div style={{
                width: 36, height: 36, borderRadius: 8, flexShrink: 0,
                background: cfg.color + "33", border: `2px solid ${cfg.color}`,
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 18,
              }}>
                {cfg.icon}
              </div>

              {/* Name + slug */}
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <span style={{ fontWeight: 600, color: C.text, fontSize: 14 }}>{cfg.name}</span>
                  <span style={{ fontFamily: "monospace", fontSize: 11, color: C.faint, background: C.bg2, padding: "1px 6px", borderRadius: 4 }}>
                    {cfg.id}
                  </span>
                  {cfg.isDefault && (
                    <span style={{ fontSize: 10, fontWeight: 700, color: C.blue, background: C.blue + "22", padding: "1px 6px", borderRadius: 4, letterSpacing: "0.05em" }}>
                      DEFAULT
                    </span>
                  )}
                </div>
                <div style={{ fontSize: 12, color: C.muted, marginTop: 2 }}>
                  {cfg.zoneImmunities.length > 0
                    ? `Immune to: ${cfg.zoneImmunities.slice(0, 4).join(", ")}${cfg.zoneImmunities.length > 4 ? ` +${cfg.zoneImmunities.length - 4} more` : ""}`
                    : "No zone immunities"}
                  {cfg.zoneBonuses.length > 0 && ` · ${cfg.zoneBonuses.length} zone bonus${cfg.zoneBonuses.length > 1 ? "es" : ""}`}
                </div>
              </div>

              {/* Color swatch */}
              <div style={{ width: 20, height: 20, borderRadius: 4, background: cfg.color, border: `1px solid ${C.border}`, flexShrink: 0 }} />

              {/* Actions */}
              <button
                onClick={() => navigate(`/admin/element-types/${cfg.id}`)}
                style={{ padding: "6px 14px", borderRadius: 7, fontSize: 12, fontWeight: 500, cursor: "pointer", border: `1px solid ${C.border}`, background: "transparent", color: C.muted }}
              >
                Edit
              </button>
              <button
                onClick={() => !cfg.isDefault && setConfirmDelete(cfg)}
                title={cfg.isDefault ? "Default types cannot be deleted" : "Delete"}
                disabled={cfg.isDefault}
                style={{
                  padding: "6px 14px", borderRadius: 7, fontSize: 12, fontWeight: 500,
                  cursor: cfg.isDefault ? "not-allowed" : "pointer",
                  border: `1px solid ${cfg.isDefault ? C.border : C.red + "66"}`,
                  background: "transparent",
                  color: cfg.isDefault ? C.faint : C.red,
                  opacity: cfg.isDefault ? 0.4 : 1,
                }}
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Delete confirm modal */}
      {confirmDelete && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.7)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000 }}>
          <div style={{ background: C.bg1, border: `1px solid ${C.border}`, borderRadius: 16, padding: 28, maxWidth: 400, width: "90%" }}>
            <h3 style={{ fontSize: 16, fontWeight: 700, color: C.text, marginBottom: 10 }}>Delete "{confirmDelete.name}"?</h3>
            <p style={{ color: C.muted, fontSize: 13, marginBottom: 20 }}>
              This will permanently remove the element type config. Beyblades using this type will keep the slug in their data but will show no icon or color.
            </p>
            <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
              <button onClick={() => setConfirmDelete(null)} style={{ padding: "7px 16px", borderRadius: 8, fontSize: 13, border: `1px solid ${C.border}`, background: "transparent", color: C.muted, cursor: "pointer" }}>
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={!!deletingId}
                style={{ padding: "7px 16px", borderRadius: 8, fontSize: 13, border: "none", background: C.red, color: "#fff", cursor: "pointer", opacity: deletingId ? 0.6 : 1 }}
              >
                {deletingId ? "Deleting…" : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
