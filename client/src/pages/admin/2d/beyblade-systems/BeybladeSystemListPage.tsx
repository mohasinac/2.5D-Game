import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { collection, getDocs, deleteDoc, doc, orderBy, query } from "firebase/firestore";
import { db, COLLECTIONS } from "@/lib/firebase";
import type { BeybladeSystem } from "@/types/beybladeSystem";
import toast from "react-hot-toast";
import { EmptyState } from "@/components/ui/EmptyState";
import { Layers } from "lucide-react";

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
    <div className="p-4 sm:p-8 max-w-[900px]">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-[22px] font-bold text-theme-text m-0">Beyblade Systems</h1>
          <p className="text-theme-muted text-[13px] mt-1">
            Modular part compositions — each system references parts by ID.
          </p>
        </div>
        <Link
          to="/admin/2d/beyblade-systems/create"
          className="px-[18px] py-[9px] bg-theme-blue text-white rounded-lg no-underline text-[13px] font-semibold"
        >
          + New System
        </Link>
      </div>

      {loading ? (
        <div className="text-theme-muted text-[13px]">Loading…</div>
      ) : systems.length === 0 ? (
        <EmptyState
          icon={<Layers size={40} />}
          title="No Beyblade systems yet"
          description="Create a system by assembling parts from the part library."
          action={
            <Link
              to="/admin/2d/beyblade-systems/create"
              className="px-[18px] py-[9px] bg-theme-blue text-white rounded-lg no-underline text-[13px] font-semibold"
            >
              Create First System
            </Link>
          }
        />
      ) : (
        <div className="flex flex-col gap-2">
          {systems.map((sys) => (
            <div
              key={sys.id}
              className="bg-bg1 border border-border-c rounded-[10px] px-[18px] py-3.5 flex items-center gap-4"
            >
              <div className="w-9 h-9 rounded-full bg-bg3 flex items-center justify-center text-[18px] shrink-0">
                {sys.spinDirection === "left" ? "↺" : "↻"}
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-semibold text-theme-text text-[14px]">{sys.displayName}</div>
                <div className="text-[11px] text-theme-muted mt-0.5">
                  {sys.spinDirection}-spin
                  {sys.linkedStatsId && (
                    <span className="ml-2 text-theme-green">· linked to stats</span>
                  )}
                </div>
              </div>
              <div className="flex gap-2 shrink-0">
                <Link
                  to={`/admin/2d/beyblade-systems/edit/${sys.id}`}
                  className="px-3.5 py-1.5 bg-bg2 text-theme-text rounded-[6px] no-underline text-[12px] border border-border-c"
                >
                  Edit
                </Link>
                <button
                  onClick={() => setConfirmDelete(sys)}
                  className="px-3.5 py-1.5 bg-transparent text-theme-red border border-theme-red/[.27] rounded-[6px] text-[12px] cursor-pointer"
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
        <div className="fixed inset-0 bg-black/[.55] flex items-center justify-center z-[1000]">
          <div className="bg-bg1 border border-border-c rounded-xl p-7 max-w-[360px] w-full">
            <div className="font-bold text-theme-text text-[16px] mb-2.5">Delete System?</div>
            <div className="text-theme-muted text-[13px] mb-5">
              Delete <strong className="text-theme-text">{confirmDelete.displayName}</strong>? This cannot be undone.
            </div>
            <div className="flex gap-2.5">
              <button
                onClick={handleDelete}
                className="flex-1 py-[9px] bg-theme-red text-white border-none rounded-lg text-[13px] cursor-pointer"
              >
                Delete
              </button>
              <button
                onClick={() => setConfirmDelete(null)}
                className="flex-1 py-[9px] bg-bg2 text-theme-muted border border-border-c rounded-lg text-[13px] cursor-pointer"
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
