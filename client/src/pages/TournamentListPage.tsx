import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { collection, onSnapshot, query, orderBy, where } from "firebase/firestore";
import { db, COLLECTIONS } from "@/lib/firebase";
import { useGame } from "@/contexts/GameContext";
import { C, pill } from "@/styles/theme";
import type { TournamentDoc } from "@/types/game";

const STATUS_COLORS: Record<string, string> = {
  draft: C.faint,
  registration: C.blue,
  "in-progress": C.green,
  completed: C.purple,
  cancelled: C.red,
};

const TYPE_LABELS: Record<string, string> = {
  pvp: "PVP",
  "player-gauntlet": "Player Gauntlet",
  mixed: "Mixed",
  "ai-exhibition": "AI Exhibition",
};

function formatDate(ts: any): string {
  if (!ts) return "—";
  const d = ts.toDate ? ts.toDate() : new Date(ts);
  return d.toLocaleString(undefined, { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" });
}

function formatCountdown(ts: any): string {
  if (!ts) return "";
  const target = (ts.toDate ? ts.toDate() : new Date(ts)).getTime();
  const diff = target - Date.now();
  if (diff <= 0) return "Started";
  const mins = Math.floor(diff / 60_000);
  const hours = Math.floor(mins / 60);
  const days = Math.floor(hours / 24);
  if (days > 0) return `in ${days}d ${hours % 24}h`;
  if (hours > 0) return `in ${hours}h ${mins % 60}m`;
  return `in ${mins}m`;
}

export function TournamentListPage() {
  const navigate = useNavigate();
  const { settings } = useGame();
  const [tournaments, setTournaments] = useState<TournamentDoc[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"active" | "all">("active");

  useEffect(() => {
    const q = filter === "active"
      ? query(
          collection(db, COLLECTIONS.TOURNAMENTS),
          where("status", "in", ["registration", "in-progress"]),
          orderBy("scheduledStartTime", "asc"),
        )
      : query(
          collection(db, COLLECTIONS.TOURNAMENTS),
          orderBy("scheduledStartTime", "desc"),
        );

    const unsub = onSnapshot(q, (snap) => {
      setTournaments(snap.docs.map((d) => ({ id: d.id, ...d.data() } as TournamentDoc)));
      setLoading(false);
    }, () => setLoading(false));

    return unsub;
  }, [filter]);

  return (
    <div style={{ minHeight: "100vh", background: C.bg0, padding: 32 }}>
      <div style={{ maxWidth: 860, margin: "0 auto" }}>
        {/* Header */}
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 28 }}>
          <div>
            <Link to="/game" style={{ color: C.faint, fontSize: 13, textDecoration: "none" }}>← Back</Link>
            <h1 style={{ fontSize: 32, fontWeight: 900, color: C.text, marginTop: 8, letterSpacing: "-0.02em" }}>
              Tournaments
            </h1>
            <p style={{ color: C.muted, fontSize: 13, marginTop: 4 }}>
              Join bracket-style competitions against other players and AI opponents.
            </p>
          </div>
        </div>

        {/* Filter tabs */}
        <div style={{ display: "flex", gap: 8, marginBottom: 20 }}>
          {(["active", "all"] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              style={{
                padding: "6px 16px", borderRadius: 8, fontSize: 13, fontWeight: 600,
                cursor: "pointer", border: `1px solid ${filter === f ? C.blue : C.border}`,
                background: filter === f ? C.blue + "22" : "transparent",
                color: filter === f ? C.blue : C.muted,
              }}
            >
              {f === "active" ? "Active" : "All"}
            </button>
          ))}
        </div>

        {/* List */}
        {loading ? (
          <div style={{ textAlign: "center", padding: 60, color: C.faint }}>
            <div className="spin" style={{ width: 36, height: 36, border: `2px solid ${C.border}`, borderTopColor: C.yellow, borderRadius: "50%", margin: "0 auto 16px" }} />
            Loading tournaments...
          </div>
        ) : tournaments.length === 0 ? (
          <div style={{ textAlign: "center", padding: 60, color: C.faint }}>
            <div style={{ fontSize: 48, marginBottom: 12 }}>🏆</div>
            <p>No {filter === "active" ? "active" : ""} tournaments found.</p>
            <p style={{ fontSize: 13, marginTop: 4 }}>Check back soon!</p>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {tournaments.map((t) => (
              <TournamentCard
                key={t.id}
                tournament={t}
                onJoin={() => navigate(`/game/tournament/${t.id}`)}
                userId={settings.userId}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function TournamentCard({
  tournament: t,
  onJoin,
  userId,
}: {
  tournament: TournamentDoc;
  onJoin: () => void;
  userId?: string;
}) {
  const canJoin = t.status === "registration" || t.status === "in-progress";
  const [countdown, setCountdown] = useState(formatCountdown(t.scheduledStartTime));

  useEffect(() => {
    if (t.status !== "registration") return;
    const id = setInterval(() => setCountdown(formatCountdown(t.scheduledStartTime)), 10_000);
    return () => clearInterval(id);
  }, [t.scheduledStartTime, t.status]);

  return (
    <div style={{
      background: C.bg1, borderRadius: 16, border: `1px solid ${C.border}`,
      padding: 20, display: "flex", gap: 16, alignItems: "flex-start",
    }}>
      {/* Icon */}
      <div style={{
        width: 48, height: 48, borderRadius: 12, background: C.bg3,
        display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: 22, flexShrink: 0,
      }}>
        {t.type === "ai-exhibition" ? "🤖" : t.type === "player-gauntlet" ? "⚔️" : "🏆"}
      </div>

      {/* Info */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 4, flexWrap: "wrap" }}>
          <span style={{ fontSize: 16, fontWeight: 700, color: C.text }}>{t.name}</span>
          <span style={pill(STATUS_COLORS[t.status] ?? C.faint)}>{t.status}</span>
          <span style={pill(C.muted)}>{TYPE_LABELS[t.type] ?? t.type}</span>
          <span style={pill(C.yellow)}>BO{t.bestOf}</span>
        </div>

        {t.description && (
          <p style={{ fontSize: 12, color: C.muted, marginBottom: 6 }}>{t.description}</p>
        )}

        <div style={{ display: "flex", gap: 16, fontSize: 12, color: C.faint, flexWrap: "wrap" }}>
          <span>👥 Max {t.maxParticipants}</span>
          <span>📅 {formatDate(t.scheduledStartTime)}</span>
          {t.status === "registration" && countdown && (
            <span style={{ color: C.yellow }}>⏱ {countdown}</span>
          )}
          {t.winnerUsername && (
            <span style={{ color: C.yellow }}>🏆 {t.winnerUsername}</span>
          )}
        </div>
      </div>

      {/* Action */}
      <div style={{ flexShrink: 0 }}>
        {canJoin ? (
          <button
            onClick={onJoin}
            style={{
              padding: "8px 20px", borderRadius: 10, fontSize: 13, fontWeight: 700,
              cursor: "pointer", background: C.yellow, color: C.bg0, border: "none",
            }}
          >
            {t.status === "in-progress" ? "Watch / Join" : "View Lobby"}
          </button>
        ) : (
          <button
            onClick={onJoin}
            style={{
              padding: "8px 20px", borderRadius: 10, fontSize: 13, fontWeight: 600,
              cursor: "pointer", background: "transparent",
              color: C.muted, border: `1px solid ${C.border}`,
            }}
          >
            View
          </button>
        )}
      </div>
    </div>
  );
}
