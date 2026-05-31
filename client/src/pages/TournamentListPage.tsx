import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { modeFromPath } from "@/shared/utils/gameMode";
import { collection, onSnapshot, query, orderBy, where } from "firebase/firestore";
import { db, COLLECTIONS } from "@/lib/firebase";
import { useGame } from "@/contexts/GameContext";
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

  const S = {
    page: { height: '100dvh', background: 'radial-gradient(ellipse at 50% 0%, #0d0a1e 0%, #080810 60%, #060810 100%)', display: 'flex', flexDirection: 'column', overflow: 'hidden', boxSizing: 'border-box' } as React.CSSProperties,
    inner: { maxWidth: 'min(860px, 92vw)', margin: '0 auto', width: '100%', display: 'flex', flexDirection: 'column', flex: 1, minHeight: 0, padding: 'clamp(12px,2vmin,20px) clamp(12px,2vmin,20px) 0' } as React.CSSProperties,
    back: { color: 'rgba(255,255,255,0.35)', fontSize: 13, textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 4 } as React.CSSProperties,
    title: { fontSize: 'clamp(20px,4vw,32px)', fontWeight: 900, color: '#fff', margin: '8px 0 4px', letterSpacing: '-0.02em' } as React.CSSProperties,
    sub: { color: 'rgba(255,255,255,0.4)', fontSize: 13, margin: 0 } as React.CSSProperties,
  } as const;

  return (
    <div style={S.page}>
      <div style={S.inner}>
        {/* Header */}
        <div style={{ marginBottom: 28 }}>
          <Link to="/game/battle" style={S.back}>← Battle Mode</Link>
          <h1 style={S.title}>🏆 TOURNAMENTS</h1>
          <p style={S.sub}>Join bracket-style competitions against other players and AI opponents.</p>
        </div>

        {/* Filter tabs */}
        <div style={{ display: 'flex', gap: 8, marginBottom: 20 }}>
          {(["active", "all"] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              style={{
                padding: '6px 18px', borderRadius: 8, fontSize: 13, fontWeight: 600,
                cursor: 'pointer', border: '1px solid',
                borderColor: filter === f ? 'rgba(0,229,255,0.5)' : 'rgba(255,255,255,0.12)',
                background: filter === f ? 'rgba(0,229,255,0.1)' : 'transparent',
                color: filter === f ? '#00e5ff' : 'rgba(255,255,255,0.45)',
              }}
            >
              {f === "active" ? "Active" : "All"}
            </button>
          ))}
        </div>

        {/* List — scrolls within its flex container so page never overflows */}
        <div style={{ flex: 1, overflowY: 'auto', paddingBottom: 20, minHeight: 0 }} data-testid="scroll-body">
        {loading ? (
          <div style={{ textAlign: 'center', padding: '60px 0', color: 'rgba(255,255,255,0.3)' }}>
            <div style={{ width: 36, height: 36, border: '2px solid rgba(255,255,255,0.1)', borderTopColor: '#00e5ff', borderRadius: '50%', margin: '0 auto 16px', animation: 'spin 0.8s linear infinite' }} />
            Loading tournaments...
          </div>
        ) : tournaments.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px 0', color: 'rgba(255,255,255,0.3)' }}>
            <div style={{ fontSize: 'clamp(32px,6vw,48px)', marginBottom: 12 }}>🏆</div>
            <p style={{ margin: 0 }}>No {filter === "active" ? "active " : ""}tournaments found.</p>
            <p style={{ fontSize: 13, marginTop: 4, color: 'rgba(255,255,255,0.2)' }}>Check back soon!</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
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

  const STATUS_COLOR: Record<string, string> = {
    draft: 'rgba(148,163,184,0.7)',
    registration: '#60a5fa',
    'in-progress': '#4ade80',
    completed: '#c084fc',
    cancelled: '#f87171',
  };

  return (
    <div style={{
      background: 'rgba(255,255,255,0.04)',
      borderRadius: 16,
      border: '1px solid rgba(255,255,255,0.09)',
      padding: '18px 20px',
      display: 'flex',
      gap: 16,
      alignItems: 'flex-start',
    }}>
      {/* Icon */}
      <div style={{
        width: 48, height: 48, borderRadius: 12, flexShrink: 0,
        background: 'rgba(255,255,255,0.06)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: 22,
      }}>
        {t.type === "ai-exhibition" ? "🤖" : t.type === "player-gauntlet" ? "⚔️" : "🏆"}
      </div>

      {/* Info */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 4, flexWrap: 'wrap' }}>
          <span style={{ fontSize: 16, fontWeight: 700, color: '#fff' }}>{t.name}</span>
          <span style={{ fontSize: 11, fontWeight: 700, padding: '2px 8px', borderRadius: 99, border: `1px solid ${STATUS_COLOR[t.status] ?? 'rgba(255,255,255,0.2)'}`, color: STATUS_COLOR[t.status] ?? 'rgba(255,255,255,0.5)', background: 'rgba(255,255,255,0.04)' }}>{t.status}</span>
          <span style={{ fontSize: 11, padding: '2px 8px', borderRadius: 99, background: 'rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.5)', border: '1px solid rgba(255,255,255,0.1)' }}>{TYPE_LABELS[t.type] ?? t.type}</span>
          <span style={{ fontSize: 11, padding: '2px 8px', borderRadius: 99, background: 'rgba(251,191,36,0.12)', color: '#fbbf24', border: '1px solid rgba(251,191,36,0.3)' }}>BO{t.bestOf}</span>
        </div>

        {t.description && (
          <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.45)', margin: '0 0 6px' }}>{t.description}</p>
        )}

        <div style={{ display: 'flex', gap: 16, fontSize: 12, color: 'rgba(255,255,255,0.35)', flexWrap: 'wrap' }}>
          <span>👥 Max {t.maxParticipants}</span>
          <span>📅 {formatDate(t.scheduledStartTime)}</span>
          {t.status === "registration" && countdown && (
            <span style={{ color: '#fbbf24' }}>⏱ {countdown}</span>
          )}
          {t.winnerUsername && (
            <span style={{ color: '#fbbf24' }}>🏆 {t.winnerUsername}</span>
          )}
        </div>
      </div>

      {/* Action */}
      <div style={{ flexShrink: 0 }}>
        {canJoin ? (
          <Link
            to={href}
            style={{
              display: 'inline-block', padding: '8px 20px', borderRadius: 10,
              fontSize: 13, fontWeight: 700, textDecoration: 'none',
              background: 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)',
              color: '#0a0a14',
            }}
          >
            {t.status === "in-progress" ? "Watch / Join" : "View Lobby"}
          </Link>
        ) : (
          <Link
            to={href}
            style={{
              display: 'inline-block', padding: '8px 20px', borderRadius: 10,
              fontSize: 13, fontWeight: 600, textDecoration: 'none',
              background: 'transparent',
              color: 'rgba(255,255,255,0.4)',
              border: '1px solid rgba(255,255,255,0.15)',
            }}
          >
            View
          </Link>
        )}
      </div>
    </div>
  );
}
