import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { collection, getDocs, deleteDoc, doc, orderBy, query } from "firebase/firestore";
import { db, COLLECTIONS } from "@/lib/firebase";
import { cn } from "@/lib/cn";
import toast from "react-hot-toast";

const THEME_ACCENT_CLS: Record<string, string> = {
  metrocity: "border-theme-blue",
  forest: "border-theme-green",
  mountains: "border-theme-purple",
  desert: "border-theme-yellow",
  sea: "border-[#06b6d4]",
  futuristic: "border-theme-purple",
  prehistoric: "border-theme-orange",
};

const THEME_BG_CLS: Record<string, string> = {
  metrocity: "bg-theme-blue/[.07]",
  forest: "bg-theme-green/[.07]",
  mountains: "bg-theme-purple/[.07]",
  desert: "bg-theme-yellow/[.07]",
  sea: "bg-[#06b6d4]/[.07]",
  futuristic: "bg-theme-purple/[.07]",
  prehistoric: "bg-theme-orange/[.07]",
};

export function ArenasListPage() {
  const [arenas, setArenas] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [confirmDelete, setConfirmDelete] = useState<any | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [tagFilter, setTagFilter] = useState<string>("all");

  useEffect(() => {
    (async () => {
      try {
        const snap = await getDocs(query(collection(db, COLLECTIONS.ARENAS), orderBy("name")));
        setArenas(snap.docs.map(d => ({ id: d.id, ...d.data() })));
      } catch { toast.error("Failed to load arenas"); }
      finally { setLoading(false); }
    })();
  }, []);

  const handleDelete = async () => {
    if (!confirmDelete) return;
    setDeleting(true);
    try {
      await deleteDoc(doc(db, COLLECTIONS.ARENAS, confirmDelete.id));
      setArenas(prev => prev.filter(a => a.id !== confirmDelete.id));
      toast.success(`Deleted ${confirmDelete.name}`);
      setConfirmDelete(null);
    } catch { toast.error("Delete failed"); }
    finally { setDeleting(false); }
  };

  return (
    <div className="page-shell p-6">
      <div className="flex items-start justify-between mb-5">
        <div>
          <h1 className="text-[22px] font-bold text-theme-text">Arenas</h1>
          <p className="text-theme-faint text-[13px] mt-1">{arenas.length} configured</p>
        </div>
        <Link to="/admin/arenas/create" className="px-4 py-2 bg-theme-purple text-white rounded-lg text-[13px] font-medium no-underline">
          + New Arena
        </Link>
      </div>

      {/* Tag filter bar */}
      {!loading && arenas.length > 0 && (() => {
        const allTags = Array.from(new Set(arenas.flatMap(a => (a.tags ?? [a.theme]).filter(Boolean))));
        const filtered = tagFilter === "all" ? arenas : arenas.filter(a => (a.tags ?? [a.theme]).includes(tagFilter));
        return (
          <>
            <div className="flex gap-1.5 flex-wrap mb-3.5">
              {["all", ...allTags].map(tag => (
                <button key={tag} onClick={() => setTagFilter(tag)}
                  className={cn(
                    "px-3 py-1 rounded-[20px] text-[11px] cursor-pointer font-medium capitalize border",
                    tagFilter === tag
                      ? "bg-theme-purple text-white border-theme-purple"
                      : "bg-transparent text-theme-muted border-border-c"
                  )}>
                  {tag}
                </button>
              ))}
            </div>
            <div className="grid grid-cols-3 gap-3.5">
              {filtered.map(arena => {
                const accentBorder = THEME_ACCENT_CLS[arena.theme] ?? "border-border-c";
                const accentBg = THEME_BG_CLS[arena.theme] ?? "bg-bg2";
                return (
                  <div key={arena.id} className="bg-bg2 border border-border-c rounded-[14px] overflow-hidden">
                    <div className={cn("h-[110px] flex items-center justify-center relative", accentBg)}>
                      <div className={cn(
                        "w-20 h-20 border-2 flex items-center justify-center text-2xl",
                        accentBorder,
                        arena.shape === "circle" ? "rounded-full" : "rounded"
                      )}>
                        {arena.shape === "circle" ? "⭕" : "▬"}
                      </div>
                      <span className="absolute top-2 right-2 text-[11px] text-theme-muted bg-black/40 px-2 py-0.5 rounded capitalize">
                        {arena.theme}
                      </span>
                      {arena.tags?.length > 0 && (
                        <span className="absolute bottom-2 left-2 text-[10px] text-[#88aacc] bg-black/40 px-1.5 py-0.5 rounded">
                          {arena.tags[0]}
                        </span>
                      )}
                    </div>
                    <div className="p-3.5">
                      <h3 className="text-theme-text font-semibold">{arena.name}</h3>
                      <div className="flex gap-3 mt-1 text-xs text-theme-muted">
                        <span className="capitalize">{arena.shape}</span>
                        <span>{arena.width ?? "—"}×{arena.height ?? "—"}</span>
                      </div>
                    </div>
                    <div className="flex border-t border-border-c">
                      <a href={`/admin/arenas/edit/${arena.id}`} className="flex-1 py-2.5 text-center text-[13px] text-theme-purple no-underline">Edit</a>
                      <button onClick={() => setConfirmDelete(arena)} className="flex-1 py-2.5 text-[13px] text-theme-red bg-transparent border-none border-l border-border-c cursor-pointer">Delete</button>
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        );
      })()}

      {loading && (
        <div className="grid grid-cols-3 gap-3.5">
          {Array.from({ length: 4 }).map((_, i) => <div key={i} className="bg-bg2 rounded-[14px] border border-border-c h-40 pulse" />)}
        </div>
      )}
      {!loading && arenas.length === 0 && (
        <div className="text-center pt-20 text-theme-faint">
          <div className="text-[40px] mb-3">🏟️</div>
          <p>No arenas yet. Create your first arena!</p>
        </div>
      )}

      {confirmDelete && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-bg2 border border-border-c rounded-[20px] p-6 max-w-[360px] w-full">
            <h3 className="text-[18px] font-bold text-theme-text mb-2">Delete Arena</h3>
            <p className="text-theme-muted text-sm mb-6">Delete <strong className="text-theme-text">{confirmDelete.name}</strong>? This cannot be undone.</p>
            <div className="flex gap-2.5">
              <button onClick={() => setConfirmDelete(null)} className="flex-1 py-2 border border-border-c text-theme-muted bg-transparent rounded-lg cursor-pointer">Cancel</button>
              <button onClick={handleDelete} disabled={deleting} className={cn("flex-1 py-2 bg-theme-red text-white rounded-lg border-none cursor-pointer", deleting && "opacity-50")}>
                {deleting ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
