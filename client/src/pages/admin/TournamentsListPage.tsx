import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { collection, onSnapshot, query, orderBy, doc, updateDoc, serverTimestamp } from "firebase/firestore";
import { db, COLLECTIONS } from "@/lib/firebase";
import type { TournamentDoc } from "@/types/game";
import toast from "react-hot-toast";

const STATUS_PILL: Record<string, string> = {
  draft:         "inline-block px-2 py-0.5 rounded-full text-[11px] font-semibold bg-bg3 text-muted border border-border",
  registration:  "inline-block px-2 py-0.5 rounded-full text-[11px] font-semibold bg-blue/[.13] text-blue border border-blue/[.27]",
  "in-progress": "inline-block px-2 py-0.5 rounded-full text-[11px] font-semibold bg-green/[.13] text-green border border-green/[.27]",
  completed:     "inline-block px-2 py-0.5 rounded-full text-[11px] font-semibold bg-purple/[.13] text-purple border border-purple/[.27]",
  cancelled:     "inline-block px-2 py-0.5 rounded-full text-[11px] font-semibold bg-red/[.13] text-red border border-red/[.27]",
};

const STATUS_ACTIVE_CLS: Record<string, string> = {
  all:           "bg-bg3 text-theme-muted border-border-c",
  draft:         "bg-bg3 text-theme-muted border-border-c",
  registration:  "bg-blue-13 text-theme-blue border-blue-30",
  "in-progress": "bg-green-13 text-theme-green border-green-30",
  completed:     "bg-purple-10 text-theme-purple border-purple-33",
  cancelled:     "bg-red-13 text-theme-red border-red-30",
};

function formatDate(ts: any): string {
  if (!ts) return "—";
  const d = ts.toDate ? ts.toDate() : new Date(ts);
  return d.toLocaleString(undefined, { month: "short", day: "numeric", year: "numeric", hour: "2-digit", minute: "2-digit" });
}

export function TournamentsListPage() {
  const [tournaments, setTournaments] = useState<TournamentDoc[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [sortBy, setSortBy] = useState<"created" | "scheduled" | "participants">("created");

  useEffect(() => {
    const unsub = onSnapshot(
      query(collection(db, COLLECTIONS.TOURNAMENTS), orderBy("createdAt", "desc")),
      (snap) => {
        setTournaments(snap.docs.map((d) => ({ id: d.id, ...d.data() } as TournamentDoc)));
        setLoading(false);
      },
      () => setLoading(false),
    );
    return unsub;
  }, []);

  const filtered = tournaments
    .filter(t => {
      const matchesSearch = !search || t.name.toLowerCase().includes(search.toLowerCase());
      const matchesStatus = statusFilter === "all" || t.status === statusFilter;
      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => {
      if (sortBy === "scheduled") {
        const at = a.scheduledStartTime?.toDate?.()?.getTime() ?? 0;
        const bt = b.scheduledStartTime?.toDate?.()?.getTime() ?? 0;
        return bt - at;
      }
      if (sortBy === "participants") return (b.maxParticipants ?? 0) - (a.maxParticipants ?? 0);
      return 0;
    });

  const setStatus = async (id: string, status: TournamentDoc["status"]) => {
    setUpdating(id);
    try {
      await updateDoc(doc(db, COLLECTIONS.TOURNAMENTS, id), { status, updatedAt: serverTimestamp() });
      toast.success(`Status updated to "${status}".`);
    } catch (err: any) {
      toast.error(`Failed to update status: ${err?.message ?? "unknown error"}`);
    } finally {
      setUpdating(null);
    }
  };

  return (
    <div className="p-6 w-full box-border">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-[22px] font-bold text-text">Tournaments</h1>
          <p className="text-faint text-[13px] mt-1">Create and manage bracket tournaments.</p>
        </div>
        <Link to="/admin/tournaments/create" className="px-4 py-2 bg-yellow text-bg0 rounded-lg text-sm font-semibold no-underline inline-block">
          + Create Tournament
        </Link>
      </div>

      {/* Search & filter bar */}
      <div className="flex gap-2 mb-4 flex-wrap items-center">
        <input
          value={search} onChange={e => setSearch(e.target.value)}
          placeholder="Search by name…"
          className="flex-1 min-w-40 px-3 py-1.5 rounded-lg border border-border bg-bg1 text-text text-[13px]"
        />
        <div className="flex gap-1">
          {(["all", "draft", "registration", "in-progress", "completed", "cancelled"] as const).map(s => (
            <button key={s} onClick={() => setStatusFilter(s)}
              className={`py-[5px] px-[10px] rounded-[6px] text-[12px] font-medium cursor-pointer border ${statusFilter === s ? STATUS_ACTIVE_CLS[s] : "bg-transparent text-theme-muted border-border-c"}`}>
              {s === "all" ? "All" : s}
            </button>
          ))}
        </div>
        <select value={sortBy} onChange={e => setSortBy(e.target.value as any)}
          className="px-2.5 py-1.5 rounded-lg border border-border bg-bg1 text-muted text-xs cursor-pointer">
          <option value="created">Sort: Created</option>
          <option value="scheduled">Sort: Scheduled</option>
          <option value="participants">Sort: Max Participants</option>
        </select>
      </div>

      {loading ? (
        <div className="text-center py-16 text-faint">
          <div className="spin w-8 h-8 border-2 border-border border-t-yellow rounded-full mx-auto mb-3" />
          Loading...
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16 text-faint">
          {tournaments.length === 0
            ? <><span>No tournaments yet. </span><Link to="/admin/tournaments/create" className="text-blue">Create one</Link>.</>
            : <span>No tournaments match the current filter.</span>
          }
        </div>
      ) : (
        <div className="bg-bg1 rounded-[14px] border border-border overflow-hidden overflow-x-auto">
          <table className="w-full border-collapse text-[13px] min-w-[640px]">
            <thead>
              <tr className="border-b border-border">
                {["Name", "Type", "Status", "Participants", "Scheduled", "Actions"].map((h) => (
                  <th key={h} className="px-3.5 py-2.5 text-left text-[11px] text-faint font-semibold uppercase">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((t, i) => (
                <tr key={t.id} className={i < filtered.length - 1 ? "border-b border-border-c" : ""}>
                  <td className="px-3.5 py-3 text-text font-medium">
                    <Link to={`/admin/tournaments/${t.id}`} className="text-text no-underline">{t.name}</Link>
                    {t.description && <p className="text-faint text-[11px] mt-0.5">{t.description.slice(0, 50)}{t.description.length > 50 ? "..." : ""}</p>}
                  </td>
                  <td className="px-3.5 py-3">
                    <span className="inline-block px-2 py-0.5 rounded-full text-[11px] font-semibold bg-bg3 text-muted border border-border">{t.type}</span>
                  </td>
                  <td className="px-3.5 py-3">
                    <span className={STATUS_PILL[t.status] ?? STATUS_PILL.draft}>{t.status}</span>
                  </td>
                  <td className="px-3.5 py-3 text-muted">Max {t.maxParticipants}</td>
                  <td className="px-3.5 py-3 text-muted text-xs">{formatDate(t.scheduledStartTime)}</td>
                  <td className="px-3.5 py-3">
                    <div className="flex gap-1.5">
                      <Link
                        to={`/admin/tournaments/${t.id}`}
                        className="px-2.5 py-1 rounded-md text-xs font-semibold bg-bg3 text-text no-underline border border-border"
                      >
                        Manage
                      </Link>
                      {(t.status === "draft" || t.status === "registration") && (
                        <Link
                          to={`/admin/tournaments/${t.id}/edit`}
                          className="px-2.5 py-1 rounded-md text-xs font-semibold no-underline bg-blue/[.10] text-blue border border-blue/[.25]"
                        >
                          Edit
                        </Link>
                      )}
                      {t.status === "draft" && (
                        <button
                          onClick={() => setStatus(t.id, "registration")}
                          disabled={updating === t.id}
                          className="px-2.5 py-1 rounded-md text-xs font-semibold bg-blue/[.13] text-blue border border-blue/[.27]"
                        >
                          Open Reg.
                        </button>
                      )}
                      {(t.status === "registration" || t.status === "draft") && (
                        <button
                          onClick={() => setStatus(t.id, "cancelled")}
                          disabled={updating === t.id}
                          className="px-2.5 py-1 rounded-md text-xs font-semibold bg-red/[.13] text-red border border-red/[.27]"
                        >
                          Cancel
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
