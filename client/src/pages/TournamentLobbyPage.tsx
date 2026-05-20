import { useEffect, useState, useCallback } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { doc, onSnapshot, collection, query, where } from "firebase/firestore";
import { db, COLLECTIONS } from "@/lib/firebase";
import { useGame } from "@/contexts/GameContext";
import { C, pill } from "@/styles/theme";
import type { TournamentDoc, TournamentParticipantDoc, TournamentMatchDoc } from "@/types/game";

function formatCountdown(target: Date): string {
  const diff = target.getTime() - Date.now();
  if (diff <= 0) return "Now";
  const totalSecs = Math.floor(diff / 1000);
  const h = Math.floor(totalSecs / 3600);
  const m = Math.floor((totalSecs % 3600) / 60);
  const s = totalSecs % 60;
  if (h > 0) return `${h}h ${m}m`;
  if (m > 0) return `${m}m ${s}s`;
  return `${s}s`;
}

type MatchStatus = TournamentMatchDoc["status"];

const ROUND_NAMES: Record<number, string> = { 1: "Round 1", 2: "Semifinals", 3: "Final" };

export function TournamentLobbyPage() {
  const { id: tournamentId } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { settings } = useGame();

  const [tournament, setTournament] = useState<TournamentDoc | null>(null);
  const [participants, setParticipants] = useState<TournamentParticipantDoc[]>([]);
  const [matches, setMatches] = useState<TournamentMatchDoc[]>([]);
  const [countdown, setCountdown] = useState("");
  const [myMatch, setMyMatch] = useState<TournamentMatchDoc | null>(null);

  // Load tournament doc
  useEffect(() => {
    if (!tournamentId) return;
    const unsub = onSnapshot(doc(db, COLLECTIONS.TOURNAMENTS, tournamentId), (snap) => {
      if (snap.exists()) setTournament({ id: snap.id, ...snap.data() } as TournamentDoc);
    });
    return unsub;
  }, [tournamentId]);

  // Load participants
  useEffect(() => {
    if (!tournamentId) return;
    const unsub = onSnapshot(
      query(collection(db, COLLECTIONS.TOURNAMENT_PARTICIPANTS), where("tournamentId", "==", tournamentId)),
      (snap) => {
        setParticipants(snap.docs.map((d) => ({ id: d.id, ...d.data() } as TournamentParticipantDoc)));
      },
    );
    return unsub;
  }, [tournamentId]);

  // Load bracket matches
  useEffect(() => {
    if (!tournamentId) return;
    const unsub = onSnapshot(
      query(collection(db, COLLECTIONS.TOURNAMENT_BRACKETS), where("tournamentId", "==", tournamentId)),
      (snap) => {
        setMatches(snap.docs.map((d) => ({ id: d.id, ...d.data() } as TournamentMatchDoc)));
      },
    );
    return unsub;
  }, [tournamentId]);

  // Countdown tick
  useEffect(() => {
    if (!tournament?.scheduledStartTime) return;
    const target = tournament.scheduledStartTime.toDate
      ? tournament.scheduledStartTime.toDate()
      : new Date(tournament.scheduledStartTime);

    const tick = () => setCountdown(formatCountdown(target));
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [tournament?.scheduledStartTime]);

  // Find the current user's participant doc, then their active match
  useEffect(() => {
    if (!settings.userId || participants.length === 0 || matches.length === 0) return;
    const myParticipant = participants.find((p) => p.userId === settings.userId);
    if (!myParticipant) return;

    const active = matches.find(
      (m) =>
        (m.participant1Id === myParticipant.id || m.participant2Id === myParticipant.id) &&
        (m.status === "room-opening" || m.status === "in-progress"),
    );
    setMyMatch(active ?? null);
  }, [participants, matches, settings.userId]);

  // Auto-navigate when colyseusRoomId is set on my match
  useEffect(() => {
    if (!myMatch?.colyseusRoomId) return;
    navigate(`/game/tournament/battle/${tournamentId}/${myMatch.id}`);
  }, [myMatch?.colyseusRoomId, tournamentId, navigate, myMatch?.id]);

  if (!tournament) {
    return (
      <div style={{ minHeight: "100vh", background: C.bg0, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div className="spin" style={{ width: 40, height: 40, border: `2px solid ${C.border}`, borderTopColor: C.yellow, borderRadius: "50%" }} />
      </div>
    );
  }

  const myParticipant = participants.find((p) => p.userId === settings.userId);
  const isParticipant = Boolean(myParticipant);
  const rounds = [...new Set(matches.map((m) => m.round))].sort();

  return (
    <div style={{ minHeight: "100vh", background: C.bg0, padding: 32 }}>
      <div style={{ maxWidth: 860, margin: "0 auto" }}>
        {/* Header */}
        <div style={{ marginBottom: 28 }}>
          <Link to="/game/tournament" style={{ color: C.faint, fontSize: 13, textDecoration: "none" }}>← Tournaments</Link>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginTop: 8 }}>
            <h1 style={{ fontSize: 28, fontWeight: 900, color: C.text, letterSpacing: "-0.02em" }}>
              {tournament.name}
            </h1>
            <span style={pill(tournament.status === "in-progress" ? C.green : tournament.status === "registration" ? C.blue : C.faint)}>
              {tournament.status}
            </span>
          </div>
          {tournament.description && (
            <p style={{ color: C.muted, fontSize: 13, marginTop: 4 }}>{tournament.description}</p>
          )}
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 320px", gap: 20 }}>
          {/* Left: bracket */}
          <div>
            {/* Info bar */}
            <div style={{ background: C.bg2, borderRadius: 12, border: `1px solid ${C.border}`, padding: 16, marginBottom: 16, display: "flex", gap: 24, flexWrap: "wrap" }}>
              <Stat label="Type" value={tournament.type.replace("-", " ")} />
              <Stat label="Format" value={`Best of ${tournament.bestOf}`} />
              <Stat label="Max Players" value={`${tournament.maxParticipants}`} />
              <Stat label="Participants" value={`${participants.length}`} />
            </div>

            {/* Countdown */}
            {tournament.status === "registration" && (
              <div style={{
                background: C.yellow + "15", border: `1px solid ${C.yellow}44`,
                borderRadius: 12, padding: "16px 20px", marginBottom: 16,
                display: "flex", alignItems: "center", gap: 12,
              }}>
                <span style={{ fontSize: 28 }}>⏱</span>
                <div>
                  <p style={{ color: C.yellow, fontWeight: 700, fontSize: 20 }}>{countdown}</p>
                  <p style={{ color: C.muted, fontSize: 12 }}>until tournament starts</p>
                </div>
              </div>
            )}

            {/* My match indicator */}
            {myMatch && (
              <div style={{
                background: C.green + "15", border: `1px solid ${C.green}44`,
                borderRadius: 12, padding: "14px 18px", marginBottom: 16,
              }}>
                <p style={{ color: C.green, fontWeight: 700, fontSize: 14 }}>
                  Your match is ready!
                </p>
                <p style={{ color: C.muted, fontSize: 12, marginTop: 4 }}>
                  {myMatch.status === "in-progress"
                    ? "The battle is live — navigating you now..."
                    : "Room is opening, hold tight..."}
                </p>
              </div>
            )}

            {/* Bracket */}
            {rounds.length > 0 && (
              <div style={{ background: C.bg1, borderRadius: 14, border: `1px solid ${C.border}`, padding: 16 }}>
                <p style={{ fontSize: 11, color: C.faint, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 12 }}>
                  Bracket
                </p>
                <div style={{ display: "flex", gap: 16, overflowX: "auto" }}>
                  {rounds.map((round) => (
                    <div key={round} style={{ minWidth: 200 }}>
                      <p style={{ fontSize: 11, fontWeight: 700, color: C.muted, marginBottom: 8, textTransform: "uppercase" }}>
                        {ROUND_NAMES[round] ?? `Round ${round}`}
                      </p>
                      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                        {matches
                          .filter((m) => m.round === round)
                          .sort((a, b) => a.matchNumber - b.matchNumber)
                          .map((m) => (
                            <BracketMatch
                              key={m.id}
                              match={m}
                              participants={participants}
                              myParticipantId={myParticipant?.id}
                              onSpectate={() => navigate(`/game/tournament/battle/${tournamentId}/${m.id}?spectate=true`)}
                            />
                          ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right: participants */}
          <div>
            <div style={{ background: C.bg1, borderRadius: 14, border: `1px solid ${C.border}`, overflow: "hidden" }}>
              <div style={{ padding: "10px 14px", borderBottom: `1px solid ${C.border}` }}>
                <span style={{ fontSize: 12, fontWeight: 600, color: C.muted }}>
                  Participants ({participants.length}/{tournament.maxParticipants})
                </span>
              </div>
              {participants.length === 0 ? (
                <div style={{ padding: 24, textAlign: "center", color: C.faint, fontSize: 13 }}>
                  No participants yet.
                </div>
              ) : (
                participants.map((p, i) => (
                  <div key={p.id} style={{
                    display: "flex", alignItems: "center", gap: 10, padding: "10px 14px",
                    borderBottom: i < participants.length - 1 ? `1px solid ${C.border}` : "none",
                    background: p.userId === settings.userId ? C.blue + "10" : "transparent",
                  }}>
                    <div style={{
                      width: 28, height: 28, borderRadius: "50%", background: C.bg3,
                      display: "flex", alignItems: "center", justifyContent: "center",
                      fontSize: 11, fontWeight: 700, color: C.muted, flexShrink: 0,
                    }}>
                      {i + 1}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                        <span style={{ fontSize: 13, color: C.text, fontWeight: 500 }}>{p.username}</span>
                        {p.isAI && <span style={pill(C.purple)}>AI</span>}
                        {p.userId === settings.userId && <span style={{ fontSize: 11, color: C.faint }}>(you)</span>}
                      </div>
                      <div style={{ display: "flex", gap: 4, marginTop: 2 }}>
                        <span style={pill(
                          p.status === "winner" ? C.yellow : p.status === "eliminated" ? C.red : C.green,
                        )}>
                          {p.status}
                        </span>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Winner banner */}
            {tournament.winnerUsername && (
              <div style={{
                marginTop: 12, background: C.yellow + "15", border: `1px solid ${C.yellow}44`,
                borderRadius: 12, padding: "14px 16px", textAlign: "center",
              }}>
                <p style={{ fontSize: 11, color: C.yellow, fontWeight: 600 }}>TOURNAMENT WINNER</p>
                <p style={{ fontSize: 18, fontWeight: 900, color: C.text, marginTop: 4 }}>
                  🏆 {tournament.winnerUsername}
                </p>
              </div>
            )}

            {/* Status message */}
            {!isParticipant && tournament.status === "registration" && (
              <div style={{
                marginTop: 12, background: C.bg2, borderRadius: 12,
                border: `1px solid ${C.border}`, padding: 14, fontSize: 12, color: C.muted, textAlign: "center",
              }}>
                Registration is managed by the admin. Check back to spectate once matches begin.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p style={{ fontSize: 10, color: C.faint, textTransform: "uppercase", letterSpacing: "0.07em", fontWeight: 600 }}>{label}</p>
      <p style={{ fontSize: 14, color: C.text, fontWeight: 700, textTransform: "capitalize" }}>{value}</p>
    </div>
  );
}

function BracketMatch({
  match: m,
  participants,
  myParticipantId,
  onSpectate,
}: {
  match: TournamentMatchDoc;
  participants: TournamentParticipantDoc[];
  myParticipantId?: string;
  onSpectate: () => void;
}) {
  const p1 = participants.find((p) => p.id === m.participant1Id);
  const p2 = participants.find((p) => p.id === m.participant2Id);
  const isMine = myParticipantId && (m.participant1Id === myParticipantId || m.participant2Id === myParticipantId);

  const statusColor =
    m.status === "in-progress" ? C.green :
    m.status === "completed" ? C.purple :
    m.status === "bye" ? C.faint : C.muted;

  return (
    <div style={{
      background: C.bg2, borderRadius: 10, border: `1px solid ${isMine ? C.yellow + "55" : C.border}`,
      padding: 10, position: "relative",
    }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
        <span style={{ fontSize: 10, color: statusColor, fontWeight: 600, textTransform: "uppercase" }}>
          {m.status}
        </span>
        {m.status === "in-progress" && (
          <button
            onClick={onSpectate}
            style={{
              fontSize: 10, color: C.green, background: C.green + "20",
              border: `1px solid ${C.green}44`, borderRadius: 4, padding: "1px 6px", cursor: "pointer", fontWeight: 600,
            }}
          >
            Watch
          </button>
        )}
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
        <PlayerRow
          label={p1?.username ?? (m.participant1Id === "__bye__" ? "BYE" : "TBD")}
          isAI={p1?.isAI}
          isWinner={m.winnerId === m.participant1Id || (m.status === "bye" && m.participant2Id === "__bye__")}
        />
        <div style={{ height: 1, background: C.border }} />
        <PlayerRow
          label={p2?.username ?? (m.participant2Id === "__bye__" ? "BYE" : "TBD")}
          isAI={p2?.isAI}
          isWinner={m.winnerId === m.participant2Id || (m.status === "bye" && m.participant1Id === "__bye__")}
        />
      </div>
    </div>
  );
}

function PlayerRow({ label, isAI, isWinner }: { label: string; isAI?: boolean; isWinner?: boolean }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
      <span style={{ fontSize: 12, color: isWinner ? C.yellow : C.text, fontWeight: isWinner ? 700 : 400, flex: 1 }}>
        {label}
      </span>
      {isAI && <span style={{ fontSize: 9, color: C.purple }}>AI</span>}
      {isWinner && <span style={{ fontSize: 12 }}>🏆</span>}
    </div>
  );
}
