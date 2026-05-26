import React from "react";
import { useNavigate } from "react-router-dom";
import { doc, deleteDoc } from "firebase/firestore";
import { db, COLLECTIONS } from "@/lib/firebase";
import { useElementTypes, invalidateElementTypesCache } from "@/hooks/useElementTypes";
import type { ElementTypeConfig } from "@/types/elementTypeConfig";
import { Button } from "@/components/ui/Button";
import toast from "react-hot-toast";
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
    <div className="p-6 w-full box-border">
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-[22px] font-bold text-text">Element Types</h1>
          <p className="text-faint text-[13px] mt-1">
            {loading ? "Loading…" : `${configs.length} types configured`}
          </p>
        </div>
        <Button variant="primary" size="sm" onClick={() => navigate("/admin/element-types/create")}>
          + New Type
        </Button>
      </div>

      {loading ? (
        <div className="text-muted text-sm">Loading element types…</div>
      ) : (
        <div className="flex flex-col gap-2">
          {configs.map(cfg => (
            <div
              key={cfg.id}
              className="flex items-center gap-3.5 bg-bg1 border border-border rounded-xl px-4 py-3"
            >
              {/* Color badge + icon */}
              <div
                className="w-9 h-9 rounded-lg shrink-0 flex items-center justify-center text-lg border-2 [background:color-mix(in_srgb,var(--el-color)_20%,transparent)] [border-color:var(--el-color)]"
                style={{ "--el-color": cfg.color } as React.CSSProperties}
              >
                {cfg.icon}
              </div>

              {/* Name + slug */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-text text-sm">{cfg.name}</span>
                  <span className="font-mono text-[11px] text-faint bg-bg2 px-1.5 py-px rounded">{cfg.id}</span>
                  {cfg.isDefault && (
                    <span className="text-[10px] font-bold text-blue bg-blue/10 px-1.5 py-px rounded tracking-wide">DEFAULT</span>
                  )}
                </div>
                <div className="text-xs text-muted mt-0.5">
                  {cfg.zoneImmunities.length > 0
                    ? `Immune to: ${cfg.zoneImmunities.slice(0, 4).join(", ")}${cfg.zoneImmunities.length > 4 ? ` +${cfg.zoneImmunities.length - 4} more` : ""}`
                    : "No zone immunities"}
                  {cfg.zoneBonuses.length > 0 && ` · ${cfg.zoneBonuses.length} zone bonus${cfg.zoneBonuses.length > 1 ? "es" : ""}`}
                </div>
              </div>

              {/* Color swatch */}
              <div className="w-5 h-5 rounded shrink-0 border border-border [background:var(--swatch-color)]" style={{ "--swatch-color": cfg.color } as React.CSSProperties} />

              {/* Actions */}
              <Button variant="outline" size="sm" onClick={() => navigate(`/admin/element-types/${cfg.id}`)}>
                Edit
              </Button>
              <Button
                variant="danger"
                size="sm"
                onClick={() => !cfg.isDefault && setConfirmDelete(cfg)}
                title={cfg.isDefault ? "Default types cannot be deleted" : "Delete"}
                disabled={cfg.isDefault}
                className={cfg.isDefault ? "opacity-40 cursor-not-allowed" : ""}
              >
                Delete
              </Button>
            </div>
          ))}
        </div>
      )}

      {confirmDelete && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-[1000]">
          <div className="bg-bg1 border border-border rounded-2xl p-7 max-w-[400px] w-[90%]">
            <h3 className="text-base font-bold text-text mb-2.5">Delete "{confirmDelete.name}"?</h3>
            <p className="text-muted text-[13px] mb-5">
              This will permanently remove the element type config. Beyblades using this type will keep the slug in their data but will show no icon or color.
            </p>
            <div className="flex gap-2.5 justify-end">
              <Button variant="outline" size="sm" onClick={() => setConfirmDelete(null)}>Cancel</Button>
              <Button variant="danger" size="sm" onClick={handleDelete} disabled={!!deletingId}>
                {deletingId ? "Deleting…" : "Delete"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
