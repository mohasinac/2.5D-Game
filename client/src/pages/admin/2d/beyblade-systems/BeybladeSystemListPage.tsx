import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { collection, getDocs, deleteDoc, doc, orderBy, query } from "firebase/firestore";
import { db, COLLECTIONS } from "@/lib/firebase";
import type { BeybladeSystem } from "@/types/beybladeSystem";
import toast from "react-hot-toast";
import { C, alpha } from "@/styles/theme";

export function BeybladeSystemListPage() {
  const [systems, setSystems] = useState<BeybladeSystem[]>([]);
  const [loading, setLoading] = useState(true);
  const [confirmDelete, setConfirmDelete] = useState<BeybladeSystem | null>(null);

  const fetchSystems = async () => {
    setLoading(true);
    try {
      const snap = await getDocs(
        query(collection(db, COLLECTIONS.BEYBLADE_SYSTEMS), orderBy("displayName"))
      );
      setSystems(snap.docs.map((d) => ({ id: d.id, ...d.data() } as BeybladeSystem)));
    } catch {
      toast.error("Failed to load Beyblade systems");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchSystems(); }, []);

  const handleDelete = async () => {
    if (!confirmDelete) return;
    try {
      await deleteDoc(doc(db, COLLECTIONS.BEYBLADE_SYSTEMS, confirmDelete.id));
      setSystems((prev) => prev.filter((s) => s.id !== confirmDelete.id));
      toast.success(`Deleted ${confirmDelete.displayName}`);
      setConfirmDelete(null);
    } catch {
      toast.error("Failed to delete");
    }
  };

  return (
    <div style={{ padding: 32, maxWidth: 900 }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24 }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 700, color: C.text, margin: 0 }}>Beyblade Systems</h1>
          <p style={{ color: C.muted, fontSize: 13, marginTop: 4 }}>
            Modular part compositions — each system references parts by ID.
          </p>
        </div>
        <Link
          to="/admin/2d/beyblade-systems/create"
          style={{
            padding: "9px 18px", background: C.blue, color: "#fff",
            borderRadius: 8, textDecoration: "none", fontSize: 13, fontWeight: 600,
          }}
        >
          + New System
        </Link>
      </div>

      {loading ? (
        <div style={{ color: C.muted, fontSize: 13 }}>Loading…</div>
      ) : systems.length === 0 ? (
        <div style={{ background: C.bg1, border: `1px solid ${C.border}`, borderRadius: 10, padding: 40, textAlign: "center" }}>
          <div style={{ fontSize: 32, marginBottom: 12 }}>🌀</div>
          <div style={{ fontSize: 15, fontWeight: 600, color: C.text, marginBottom: 8 }}>No Beyblade systems yet</div>
          <div style={{ fontSize: 13, color: C.muted, marginBottom: 20 }}>
            Create a system by assembling parts from the part library.
          </div>
          <Link
            to="/admin/2d/beyblade-systems/create"
            style={{
              padding: "9px 18px", background: C.blue, color: "#fff",
              borderRadius: 8, textDecoration: "none", fontSize: 13, fontWeight: 600,
            }}
          >
            Create First System
          </Link>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {systems.map((sys) => (
            <div
              key={sys.id}
              style={{
                background: C.bg1, border: `1px solid ${C.border}`, borderRadius: 10,
                padding: "14px 18px", display: "flex", alignItems: "center", gap: 16,
              }}
            >
              <div
                style={{
                  width: 36, height: 36, borderRadius: "50%", background: C.bg3,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 18, flexShrink: 0,
                }}
              >
                {sys.spinDirection === "left" ? "↺" : "↻"}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontWeight: 600, color: C.text, fontSize: 14 }}>{sys.displayName}</div>
                <div style={{ fontSize: 11, color: C.muted, marginTop: 2 }}>
                  {sys.spinDirection}-spin
                  {sys.linkedStatsId && (
                    <span style={{ marginLeft: 8, color: C.green }}>· linked to stats</span>
                  )}
                </div>
              </div>
              <div style={{ display: "flex", gap: 8, flexShrink: 0 }}>
                <Link
                  to={`/admin/2d/beyblade-systems/edit/${sys.id}`}
                  style={{
                    padding: "6px 14px", background: C.bg2, color: C.text,
                    borderRadius: 6, textDecoration: "none", fontSize: 12,
                    border: `1px solid ${C.border}`,
                  }}
                >
                  Edit
                </Link>
                <button
                  onClick={() => setConfirmDelete(sys)}
                  style={{
                    padding: "6px 14px", background: "none", color: C.red,
                    border: `1px solid ${alpha(C.red, 0.27)}`, borderRadius: 6, fontSize: 12, cursor: "pointer",
                  }}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Delete confirmation */}
      {confirmDelete && (
        <div style={{
          position: "fixed", inset: 0, background: "#0009", display: "flex",
          alignItems: "center", justifyContent: "center", zIndex: 1000,
        }}>
          <div style={{ background: C.bg1, border: `1px solid ${C.border}`, borderRadius: 12, padding: 28, maxWidth: 360, width: "100%" }}>
            <div style={{ fontWeight: 700, color: C.text, fontSize: 16, marginBottom: 10 }}>Delete System?</div>
            <div style={{ color: C.muted, fontSize: 13, marginBottom: 20 }}>
              Delete <strong style={{ color: C.text }}>{confirmDelete.displayName}</strong>? This cannot be undone.
            </div>
            <div style={{ display: "flex", gap: 10 }}>
              <button
                onClick={handleDelete}
                style={{ flex: 1, padding: "9px 0", background: C.red, color: "#fff", border: "none", borderRadius: 8, fontSize: 13, cursor: "pointer" }}
              >
                Delete
              </button>
              <button
                onClick={() => setConfirmDelete(null)}
                style={{ flex: 1, padding: "9px 0", background: C.bg2, color: C.muted, border: `1px solid ${C.border}`, borderRadius: 8, fontSize: 13, cursor: "pointer" }}
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
