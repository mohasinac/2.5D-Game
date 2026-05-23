import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { collection, onSnapshot, query, orderBy, doc, updateDoc, serverTimestamp } from "firebase/firestore";
import { db, COLLECTIONS } from "@/lib/firebase";
import { C, pill, btn, alpha } from "@/styles/theme";
import type { TournamentDoc } from "@/types/game";
import toast from "react-hot-toast";

const STATUS_COLORS: Record<string, string> = {
  draft: C.faint,
  registration: C.blue,
  "in-progress": C.green,
  completed: C.purple,
  cancelled: C.red,
};

function formatDate(ts: any): string {
  if (!ts) return "—";
  const d = ts.toDate ? ts.toDate() : new Date(ts);
  return d.toLocaleString(undefined, { month: "short", day: "numeric", year: "numeric", hour: "2-digit", minute: "2-digit" });
}

const STATUS_ORDER = ["draft", "registration", "in-progress", "completed", "cancelled"];

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
      return 0; // "created" — already ordered by Firestore
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
    <div style={{ padding: 24, maxWidth: 1100, margin: "0 auto" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 700, color: C.text }}>Tournaments</h1>
          <p style={{ color: C.faint, fontSize: 13, marginTop: 4 }}>Create and manage bracket tournaments.</p>
        </div>
        <Link to="/admin/tournaments/create" style={{ ...btn(C.yellow), color: C.bg0, textDecoration: "none", display: "inline-block" }}>
          + Create Tournament
        </Link>
      </div>

      {/* Search & filter bar */}
      <div style={{ display: "flex", gap: 8, marginBottom: 16, flexWrap: "wrap", alignItems: "center" }}>
        <input
          value={search} onChange={e => setSearch(e.target.value)}
          placeholder="Search by name…"
          style={{ padding: "7px 12px", borderRadius: 8, border: `1px solid ${C.border}`, background: C.bg1, color: C.text, fontSize: 13, flex: "1 1 200px", minWidth: 160 }}
        />
        <div style={{ display: "flex", gap: 4 }}>
          {(["all", "draft", "registration", "in-progress", "completed", "cancelled"] as const).map(s => (
            <button key={s} onClick={() => setStatusFilter(s)}
              style={{ padding: "5px 10px", borderRadius: 6, fontSize: 12, fontWeight: 500, border: `1px solid ${statusFilter === s ? (STATUS_COLORS[s] ?? C.border) : C.border}`, background: statusFilter === s ? (STATUS_COLORS[s] ?? C.blue) + "22" : "transparent", color: statusFilter === s ? (STATUS_COLORS[s] ?? C.text) : C.muted, cursor: "pointer" }}>
              {s === "all" ? "All" : s}
            </button>
          ))}
        </div>
        <select value={sortBy} onChange={e => setSortBy(e.target.value as any)}
          style={{ padding: "6px 10px", borderRadius: 8, border: `1px solid ${C.border}`, background: C.bg1, color: C.muted, fontSize: 12, cursor: "pointer" }}>
          <option value="created">Sort: Created</option>
          <option value="scheduled">Sort: Scheduled</option>
          <option value="participants">Sort: Max Participants</option>
        </select>
      </div>

      {loading ? (
        <div style={{ textAlign: "center", padding: 60, color: C.faint }}>
          <div className="spin" style={{ width: 32, height: 32, border: `2px solid ${C.border}`, borderTopColor: C.yellow, borderRadius: "50%", margin: "0 auto 12px" }} />
          Loading...
        </div>
      ) : filtered.length === 0 ? (
        <div style={{ textAlign: "center", padding: 60, color: C.faint }}>
          {tournaments.length === 0 ? (
            <></>
          ) : null}
          {tournaments.length === 0
            ? <><span>No tournaments yet. </span><Link to="/admin/tournaments/create" style={{ color: C.blue }}>Create one</Link>.</>
            : <span>No tournaments match the current filter.</span>
          }
        </div>
      ) : (
        <div style={{ background: C.bg1, borderRadius: 14, border: `1px solid ${C.border}`, overflow: "hidden" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
            <thead>
              <tr style={{ borderBottom: `1px solid ${C.border}` }}>
                {["Name", "Type", "Status", "Participants", "Scheduled", "Actions"].map((h) => (
                  <th key={h} style={{ padding: "10px 14px", textAlign: "left", fontSize: 11, color: C.faint, fontWeight: 600, textTransform: "uppercase" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((t, i) => (
                <tr key={t.id} style={{ borderBottom: i < filtered.length - 1 ? `1px solid ${C.border}` : "none" }}>
                  <td style={{ padding: "12px 14px", color: C.text, fontWeight: 500 }}>
                    <Link to={`/admin/tournaments/${t.id}`} style={{ color: C.text, textDecoration: "none" }}>{t.name}</Link>
                    {t.description && <p style={{ color: C.faint, fontSize: 11, marginTop: 2 }}>{t.description.slice(0, 50)}{t.description.length > 50 ? "..." : ""}</p>}
                  </td>
                  <td style={{ padding: "12px 14px" }}>
                    <span style={pill(C.muted)}>{t.type}</span>
                  </td>
                  <td style={{ padding: "12px 14px" }}>
                    <span style={pill(STATUS_COLORS[t.status] ?? C.faint)}>{t.status}</span>
                  </td>
                  <td style={{ padding: "12px 14px", color: C.muted }}>Max {t.maxParticipants}</td>
                  <td style={{ padding: "12px 14px", color: C.muted, fontSize: 12 }}>{formatDate(t.scheduledStartTime)}</td>
                  <td style={{ padding: "12px 14px" }}>
                    <div style={{ display: "flex", gap: 6 }}>
                      <Link
                        to={`/admin/tournaments/${t.id}`}
                        style={{ padding: "4px 10px", borderRadius: 6, fontSize: 12, fontWeight: 600, cursor: "pointer", background: C.bg3, color: C.text, textDecoration: "none", border: `1px solid ${C.border}` }}
                      >
                        Manage
                      </Link>
                      {(t.status === "draft" || t.status === "registration") && (
                        <Link
                          to={`/admin/tournaments/${t.id}/edit`}
                          style={{ padding: "4px 10px", borderRadius: 6, fontSize: 12, fontWeight: 600, cursor: "pointer", background: alpha(C.blue, 0.1), color: C.blue, textDecoration: "none", border: `1px solid ${alpha(C.blue, 0.25)}` }}
                        >
                          Edit
                        </Link>
                      )}
                      {t.status === "draft" && (
                        <button
                          onClick={() => setStatus(t.id, "registration")}
                          disabled={updating === t.id}
                          style={{ padding: "4px 10px", borderRadius: 6, fontSize: 12, fontWeight: 600, cursor: "pointer", background: alpha(C.blue, 0.13), color: C.blue, border: `1px solid ${alpha(C.blue, 0.27)}` }}
                        >
                          Open Reg.
                        </button>
                      )}
                      {(t.status === "registration" || t.status === "draft") && (
                        <button
                          onClick={() => setStatus(t.id, "cancelled")}
                          disabled={updating === t.id}
                          style={{ padding: "4px 10px", borderRadius: 6, fontSize: 12, fontWeight: 600, cursor: "pointer", background: alpha(C.red, 0.13), color: C.red, border: `1px solid ${alpha(C.red, 0.27)}` }}
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
