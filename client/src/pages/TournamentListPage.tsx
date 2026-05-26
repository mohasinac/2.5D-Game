import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { modeFromPath } from "@/shared/utils/gameMode";
import { collection, onSnapshot, query, orderBy, where } from "firebase/firestore";
import { db, COLLECTIONS } from "@/lib/firebase";
import { useGame } from "@/contexts/GameContext";
import { C } from "@/styles/theme";
import type { TournamentDoc } from "@/types/game";

const STATUS_PILL: Record<string, string> = {
  draft:          "bg-faint/[.13] text-faint border-faint/[.27]",
  registration:   "bg-blue/[.13] text-blue border-blue/[.27]",
  "in-progress":  "bg-green/[.13] text-green border-green/[.27]",
  completed:      "bg-purple/[.13] text-purple border-purple/[.27]",
  cancelled:      "bg-red/[.13] text-red border-red/[.27]",
};
const PILL_BASE = "inline-block px-2 py-0.5 rounded-full text-[11px] font-semibold border";

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
  const location = useLocation();
  const mode = modeFromPath(location.pathname);
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
    <div className="min-h-screen bg-bg0 p-8">
      <div className="max-w-[860px] mx-auto">
        {/* Header */}
        <div className="flex items-start justify-between mb-7">
          <div>
            <Link to="/game" className="text-theme-faint text-[13px] no-underline">← Back</Link>
            <h1 className="text-[32px] font-black text-theme-text mt-2 tracking-[-0.02em]">
              Tournaments
            </h1>
            <p className="text-theme-muted text-[13px] mt-1">
              Join bracket-style competitions against other players and AI opponents.
            </p>
          </div>
        </div>

        {/* Filter tabs */}
        <div className="flex gap-2 mb-5">
          {(["active", "all"] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-1.5 rounded-lg text-[13px] font-semibold cursor-pointer border ${filter === f ? "border-theme-blue bg-blue-13 text-theme-blue" : "border-border-c bg-transparent text-theme-muted"}`}
            >
              {f === "active" ? "Active" : "All"}
            </button>
          ))}
        </div>

        {/* List */}
        {loading ? (
          <div className="text-center py-[60px] text-theme-faint">
            <div className="spin w-9 h-9 border-2 border-border-c border-t-yellow rounded-full mx-auto mb-4" />
            Loading tournaments...
          </div>
        ) : tournaments.length === 0 ? (
          <div className="text-center py-[60px] text-theme-faint">
            <div className="text-[48px] mb-3">🏆</div>
            <p>No {filter === "active" ? "active" : ""} tournaments found.</p>
            <p className="text-[13px] mt-1">Check back soon!</p>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {tournaments.map((t) => (
              <TournamentCard
                key={t.id}
                tournament={t}
                href={`/game/${mode}/tournament/${t.id}`}
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
  href,
  userId,
}: {
  tournament: TournamentDoc;
  href: string;
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
    <div className="bg-bg1 rounded-2xl border border-border-c p-5 flex gap-4 items-start">
      {/* Icon */}
      <div className="w-12 h-12 rounded-xl bg-bg3 flex items-center justify-center text-[22px] shrink-0">
        {t.type === "ai-exhibition" ? "🤖" : t.type === "player-gauntlet" ? "⚔️" : "🏆"}
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <div className="flex gap-2 items-center mb-1 flex-wrap">
          <span className="text-[16px] font-bold text-theme-text">{t.name}</span>
          <span className={`${PILL_BASE} ${STATUS_PILL[t.status] ?? STATUS_PILL.draft}`}>{t.status}</span>
          <span className={`${PILL_BASE} bg-bg3 text-muted border-border`}>{TYPE_LABELS[t.type] ?? t.type}</span>
          <span className={`${PILL_BASE} bg-yellow/[.13] text-yellow border-yellow/[.27]`}>BO{t.bestOf}</span>
        </div>

        {t.description && (
          <p className="text-[12px] text-theme-muted mb-1.5">{t.description}</p>
        )}

        <div className="flex gap-4 text-[12px] text-theme-faint flex-wrap">
          <span>👥 Max {t.maxParticipants}</span>
          <span>📅 {formatDate(t.scheduledStartTime)}</span>
          {t.status === "registration" && countdown && (
            <span className="text-theme-yellow">⏱ {countdown}</span>
          )}
          {t.winnerUsername && (
            <span className="text-theme-yellow">🏆 {t.winnerUsername}</span>
          )}
        </div>
      </div>

      {/* Action */}
      <div className="shrink-0">
        {canJoin ? (
          <Link
            to={href}
            className="inline-block px-5 py-2 rounded-[10px] text-[13px] font-bold bg-theme-yellow text-bg0 no-underline"
          >
            {t.status === "in-progress" ? "Watch / Join" : "View Lobby"}
          </Link>
        ) : (
          <Link
            to={href}
            className="inline-block px-5 py-2 rounded-[10px] text-[13px] font-semibold bg-transparent text-theme-muted border border-border-c no-underline"
          >
            View
          </Link>
        )}
      </div>
    </div>
  );
}
