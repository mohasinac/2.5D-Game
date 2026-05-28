import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { collection, getDocs, deleteDoc, doc, query, where, orderBy, setDoc } from "firebase/firestore";
import { db, COLLECTIONS } from "@/lib/firebase";
import type { BeybladeStats } from "@/types/beybladeStats";
import toast from "react-hot-toast";

const TYPE_ACCENT_CLS: Record<string, string> = {
  attack: "text-theme-red",
  defense: "text-theme-blue",
  stamina: "text-theme-green",
  balanced: "text-theme-yellow",
};

function StatBar({ value, max = 150, colorClass }: { value: number; max?: number; colorClass: string }) {
  return (
    <div className="w-full h-1 bg-bg3 rounded-sm overflow-hidden">
      <div
        className={`h-full rounded-sm ${colorClass}`}
        style={{ "--pct": `${(value / max) * 100}%` } as React.CSSProperties}
      />
    </div>
  );
}

const STAT_ROWS = [
  { key: "attack",  label: "Attack",  colorClass: "bg-theme-red",   textClass: "text-theme-red" },
  { key: "defense", label: "Defense", colorClass: "bg-theme-blue",  textClass: "text-theme-blue" },
  { key: "stamina", label: "Stamina", colorClass: "bg-theme-green", textClass: "text-theme-green" },
] as const;

export function BeybladesListPage() {
  const navigate = useNavigate();
  const [beyblades, setBeyblades] = useState<BeybladeStats[]>([]);
  const [filter, setFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [cloningId, setCloningId] = useState<string | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<BeybladeStats | null>(null);

  const fetchBeyblades = async () => {
    setLoading(true);
    try {
      const ref = collection(db, COLLECTIONS.BEYBLADE_STATS);
      const q = filter === "all"
        ? query(ref, orderBy("displayName"))
        : query(ref, where("type", "==", filter), orderBy("displayName"));
      const snap = await getDocs(q);
      setBeyblades(snap.docs.map(d => ({ id: d.id, ...d.data() } as BeybladeStats)));
    } catch { toast.error("Failed to load beyblades"); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchBeyblades(); }, [filter]);

  const handleClone = async (b: BeybladeStats) => {
    const newId = `${b.id}_copy_${Date.now()}`;
    setCloningId(b.id);
    try {
      const { id: _id, ...rest } = b;
      await setDoc(doc(db, COLLECTIONS.BEYBLADE_STATS, newId), {
        ...rest,
        displayName: `${b.displayName} (Copy)`,
        templateId: b.id,
      });
      toast.success(`Cloned as ${newId}`);
      navigate(`/admin/beyblades/edit/${newId}`);
    } catch { toast.error("Clone failed"); }
    finally { setCloningId(null); }
  };

  const handleDelete = async () => {
    if (!confirmDelete) return;
    setDeletingId(confirmDelete.id);
    try {
      await deleteDoc(doc(db, COLLECTIONS.BEYBLADE_STATS, confirmDelete.id));
      setBeyblades(prev => prev.filter(b => b.id !== confirmDelete.id));
      toast.success(`Deleted ${confirmDelete.displayName}`);
      setConfirmDelete(null);
    } catch { toast.error("Delete failed"); }
    finally { setDeletingId(null); }
  };

  return (
    <div className="page-shell p-4 sm:p-6">
      <div className="flex items-start justify-between mb-5">
        <div>
          <h1 className="text-[22px] font-bold text-theme-text">Beyblades</h1>
          <p className="text-theme-faint text-[13px] mt-1">{beyblades.length} configured</p>
        </div>
        <Link
          to="/admin/beyblades/create"
          className="px-4 py-2 bg-theme-blue text-white rounded-lg text-[13px] font-medium no-underline"
        >
          + New Beyblade
        </Link>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-2 mb-5 flex-wrap">
        {["all", "attack", "defense", "stamina", "balanced"].map(t => (
          <button
            key={t}
            onClick={() => setFilter(t)}
            className={`px-3.5 py-1.5 rounded-lg text-[13px] font-medium cursor-pointer capitalize border transition-colors
              ${filter === t
                ? "bg-theme-text text-bg0 border-theme-text"
                : "bg-transparent text-theme-muted border-border-c"
              }`}
          >{t}</button>
        ))}
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="bg-bg2 rounded-2xl border border-border-c h-[200px] pulse" />
          ))}
        </div>
      ) : beyblades.length === 0 ? (
        <div className="text-center pt-20 text-theme-faint">
          <div className="text-[40px] mb-3">🌀</div>
          <p>No beyblades found. Create your first one!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
          {beyblades.map(b => (
            <div key={b.id} className="bg-bg2 border border-border-c rounded-2xl overflow-hidden">
              <div className="flex items-center gap-3 p-3.5 border-b border-border-c">
                {b.imageUrl ? (
                  <img
                    src={b.imageUrl}
                    alt={b.displayName}
                    className="w-12 h-12 rounded-full object-contain bg-bg1"
                  />
                ) : (
                  <div className="w-12 h-12 rounded-full bg-bg3 flex items-center justify-center text-[20px] font-bold text-theme-muted">
                    {b.displayName[0]}
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <h3 className="text-theme-text font-semibold overflow-hidden text-ellipsis whitespace-nowrap">{b.displayName}</h3>
                  <div className="flex items-center gap-2 mt-1">
                    <span className={`text-[11px] font-semibold capitalize ${TYPE_ACCENT_CLS[b.type] ?? "text-theme-muted"}`}>{b.type}</span>
                    <span className="text-theme-faint text-[11px]">{b.spinDirection} spin</span>
                  </div>
                </div>
              </div>

              <div className="p-3.5">
                <div className="grid grid-cols-2 gap-1.5 text-[12px] text-theme-muted mb-2.5">
                  <span>Mass: <span className="text-theme-text">{b.mass}g</span></span>
                  <span>Radius: <span className="text-theme-text">{b.radius}cm</span></span>
                </div>
                <div className="flex flex-col gap-1.5">
                  {STAT_ROWS.map(({ key, label, colorClass, textClass }) => (
                    <div key={key}>
                      <div className="flex justify-between text-[11px] mb-[3px]">
                        <span className={textClass}>{label}</span>
                        <span className="text-theme-muted">{b.typeDistribution[key]}</span>
                      </div>
                      <StatBar value={b.typeDistribution[key]} colorClass={colorClass} />
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex border-t border-border-c">
                <Link
                  to={`/admin/beyblades/edit/${b.id}`}
                  className="flex-1 py-2.5 text-center text-[13px] text-theme-blue no-underline"
                >
                  Edit
                </Link>
                <button
                  onClick={() => handleClone(b)}
                  disabled={cloningId === b.id}
                  title="Clone as template"
                  className="flex-1 py-2.5 text-center text-[13px] text-theme-purple bg-transparent border-none border-l border-border-c cursor-pointer disabled:opacity-50"
                >
                  {cloningId === b.id ? "…" : "Clone"}
                </button>
                <button
                  onClick={() => setConfirmDelete(b)}
                  className="flex-1 py-2.5 text-center text-[13px] text-theme-red bg-transparent border-none border-l border-border-c cursor-pointer"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Delete modal */}
      {confirmDelete && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-bg2 border border-border-c rounded-[20px] p-6 w-full max-w-[min(360px,calc(100vw-2rem))]">
            <h3 className="text-[18px] font-bold text-theme-text mb-2">Delete Beyblade</h3>
            <p className="text-theme-muted text-[14px] mb-6">
              Delete <strong className="text-theme-text">{confirmDelete.displayName}</strong>? This cannot be undone.
            </p>
            <div className="flex gap-2.5">
              <button
                onClick={() => setConfirmDelete(null)}
                className="flex-1 py-2 text-[13px] border border-border-c text-theme-muted bg-transparent rounded-lg cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={deletingId !== null}
                className="flex-1 py-2 text-[13px] bg-theme-red text-white rounded-lg border-none cursor-pointer disabled:opacity-50"
              >
                {deletingId ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
