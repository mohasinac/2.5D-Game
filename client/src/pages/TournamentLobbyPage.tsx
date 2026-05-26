import { useEffect, useState, useCallback, useMemo } from "react";
import { Link, useParams, useNavigate, useLocation } from "react-router-dom";
import { modeFromPath } from "@/shared/utils/gameMode";
import {
  doc, onSnapshot, collection, query, where, setDoc, serverTimestamp, addDoc, getDocs,
} from "firebase/firestore";
import { db, COLLECTIONS } from "@/lib/firebase";
import { useGame } from "@/contexts/GameContext";
import { useAuth } from "@/contexts/AuthContext";
import { C, alpha } from "@/styles/theme";

const PILL_BASE = "inline-block px-2 py-0.5 rounded-full text-[11px] font-semibold border";
const STATUS_PILL: Record<string, string> = {
  draft:          "bg-faint/[.13] text-faint border-faint/[.27]",
  registration:   "bg-blue/[.13] text-blue border-blue/[.27]",
  "in-progress":  "bg-green/[.13] text-green border-green/[.27]",
  completed:      "bg-purple/[.13] text-purple border-purple/[.27]",
  cancelled:      "bg-red/[.13] text-red border-red/[.27]",
};
import toast from "react-hot-toast";
import type { TournamentDoc, TournamentParticipantDoc, TournamentMatchDoc } from "@/types/game";

interface BeybladePickerOption {
  id: string;
  displayName: string;
  type?: string;
}

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
  const location = useLocation();
  const mode = modeFromPath(location.pathname);
  const { settings } = useGame();
  const { currentUser } = useAuth();

  const [tournament, setTournament] = useState<TournamentDoc | null>(null);
  const [participants, setParticipants] = useState<TournamentParticipantDoc[]>([]);
  const [matches, setMatches] = useState<TournamentMatchDoc[]>([]);
  const [countdown, setCountdown] = useState("");
  const [myMatch, setMyMatch] = useState<TournamentMatchDoc | null>(null);
  const [beyOptions, setBeyOptions] = useState<BeybladePickerOption[]>([]);
  const [pickedBeyId, setPickedBeyId] = useState<string>("");
  const [registering, setRegistering] = useState(false);
  const [readyBusy, setReadyBusy] = useState(false);

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
    navigate(`/game/${mode}/tournament/battle/${tournamentId}/${myMatch.id}`);
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

  // Lazy-load beyblade options the first time we display the registration card.
  // Filters out beyblades the tournament has explicitly disabled or that aren't
  // in its allowed list. Falls back to the full collection when no allow-list set.
  useEffect(() => {
    if (!tournament) return;
    if (isParticipant) return;
    if (tournament.status !== "registration") return;
    if (beyOptions.length > 0) return;
    let cancelled = false;
    (async () => {
      try {
        const snap = await getDocs(collection(db, COLLECTIONS.BEYBLADE_STATS));
        const all: BeybladePickerOption[] = snap.docs.map((d) => {
          const raw = d.data() as any;
          return { id: d.id, displayName: raw.displayName ?? d.id, type: raw.type };
        });
        const disabled = new Set(tournament.disabledBeybladeIds ?? []);
        const allowed = (tournament.allowedBeybladeIds ?? []).filter((id) => !!id);
        const filtered = all.filter((b) => {
          if (disabled.has(b.id)) return false;
          if (allowed.length > 0 && !allowed.includes(b.id)) return false;
          return true;
        });
        if (!cancelled) {
          setBeyOptions(filtered);
          if (filtered.length > 0 && !pickedBeyId) setPickedBeyId(filtered[0].id);
        }
      } catch {
        if (!cancelled) toast.error("Failed to load beyblade list");
      }
    })();
    return () => { cancelled = true; };
  }, [tournament, isParticipant, beyOptions.length, pickedBeyId]);

  const deadlineMs = useMemo(
    () => tournament?.registrationDeadline?.toDate?.()?.getTime() ?? Infinity,
    [tournament?.registrationDeadline]
  );
  const deadlinePassed = Date.now() >= deadlineMs;
  const isFull = participants.length >= (tournament?.maxParticipants ?? 0);
  const canRegister =
    tournament?.status === "registration" && !deadlinePassed && !isFull && Boolean(currentUser);

  // Tournament-level ready aggregation. AI is always counted as ready.
  const tournamentReadyCount = participants.filter((p) => p.ready === true || p.isAI).length;
  const myTournamentReady = Boolean(myParticipant?.ready);

  const onRegister = useCallback(async () => {
    if (!tournamentId || !tournament || !currentUser || !pickedBeyId) {
      toast.error("Pick a beyblade first");
      return;
    }
    if (!canRegister) return;
    setRegistering(true);
    try {
      // Assign the next free seed slot.
      const usedSeeds = new Set(participants.map((p) => p.seed));
      let seed = 1;
      while (usedSeeds.has(seed)) seed++;
      await addDoc(collection(db, COLLECTIONS.TOURNAMENT_PARTICIPANTS), {
        tournamentId,
        userId: currentUser.uid,
        username: currentUser.displayName || currentUser.email?.split("@")[0] || "Player",
        beybladeId: pickedBeyId,
        isAI: false,
        seed,
        registeredAt: serverTimestamp(),
        status: "registered",
        ready: false,
      });
      toast.success("Registered — toggle Ready to start the tournament early.");
    } catch (e: any) {
      toast.error(`Failed to register: ${e?.message ?? "unknown error"}`);
    } finally {
      setRegistering(false);
    }
  }, [tournamentId, tournament, currentUser, pickedBeyId, canRegister, participants]);

  const onToggleTournamentReady = useCallback(async () => {
    if (!myParticipant) return;
    setReadyBusy(true);
    try {
      await setDoc(
        doc(db, COLLECTIONS.TOURNAMENT_PARTICIPANTS, myParticipant.id),
        { ready: !myTournamentReady, updatedAt: serverTimestamp() },
        { merge: true }
      );
    } catch {
      toast.error("Failed to update tournament-ready state");
    } finally {
      setReadyBusy(false);
    }
  }, [myParticipant, myTournamentReady]);

  // ── Gauntlet: calculate round progress and "reached round" for eliminated player ──
  const isGauntlet = tournament?.type === "player-gauntlet";
  const gauntletRoundsWon: number = isGauntlet && myParticipant
    ? matches.filter((m) =>
        m.winnerId === myParticipant.id &&
        (m.participant1Id === myParticipant.id || m.participant2Id === myParticipant.id)
      ).length
    : 0;
  const gauntletEliminatedAtRound: number | null = isGauntlet && myParticipant
    ? (matches.find((m) =>
        m.winnerId !== null &&
        m.winnerId !== myParticipant.id &&
        (m.participant1Id === myParticipant.id || m.participant2Id === myParticipant.id)
      )?.round ?? null)
    : null;

  // Find the next PENDING match this user is in. Used to drive Ready/Quit UI.
  const myNextMatch: TournamentMatchDoc | undefined = myParticipant
    ? matches
        .filter((m) =>
          m.status === "pending" &&
          (m.participant1Id === myParticipant.id || m.participant2Id === myParticipant.id),
        )
        .sort((a, b) => (a.scheduledTime?.toMillis?.() ?? 0) - (b.scheduledTime?.toMillis?.() ?? 0))[0]
    : undefined;

  const opponentParticipantId = myNextMatch && myParticipant
    ? (myNextMatch.participant1Id === myParticipant.id ? myNextMatch.participant2Id : myNextMatch.participant1Id)
    : "";
  const opponent = participants.find((p) => p.id === opponentParticipantId);

  const myReady = Boolean(myParticipant && myNextMatch?.readyState?.[myParticipant.id]);
  const oppReady = Boolean(opponent && (myNextMatch?.readyState?.[opponent.id] || opponent.isAI));

  const onToggleReady = useCallback(async () => {
    if (!myNextMatch || !myParticipant) return;
    try {
      await setDoc(
        doc(db, COLLECTIONS.TOURNAMENT_BRACKETS, myNextMatch.id),
        {
          readyState: { [myParticipant.id]: !myReady },
          updatedAt: serverTimestamp(),
        },
        { merge: true },
      );
    } catch (e) {
      toast.error("Failed to update ready status");
    }
  }, [myNextMatch, myParticipant, myReady]);

  const onQuitTournament = useCallback(async () => {
    if (!myParticipant) return;
    if (!confirm("Quit the tournament? Your opponent will advance by walkover. This cannot be undone.")) return;
    try {
      await setDoc(
        doc(db, COLLECTIONS.TOURNAMENT_PARTICIPANTS, myParticipant.id),
        { status: "quit", updatedAt: serverTimestamp() },
        { merge: true },
      );
      toast.success("You have quit the tournament");
    } catch (e) {
      toast.error("Failed to quit tournament");
    }
  }, [myParticipant]);

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
            <span className={`${PILL_BASE} ${STATUS_PILL[tournament.status] ?? STATUS_PILL.draft}`}>
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
              {tournament.status === "registration" && (
                <Stat
                  label="Ready"
                  value={`${tournamentReadyCount} / ${participants.length}`}
                />
              )}
            </div>

            {/* Gauntlet: Round Progress + "You reached Round N" */}
            {isGauntlet && isParticipant && (
              <div style={{
                background: gauntletEliminatedAtRound !== null
                  ? alpha(C.red, 0.08) : alpha(C.green, 0.08),
                border: `1px solid ${gauntletEliminatedAtRound !== null ? alpha(C.red, 0.27) : alpha(C.green, 0.27)}`,
                borderRadius: 12, padding: "14px 18px", marginBottom: 16,
                display: "flex", alignItems: "center", gap: 12,
              }}>
                <span style={{ fontSize: 28 }}>
                  {gauntletEliminatedAtRound !== null ? "💀" : gauntletRoundsWon > 0 ? "🏅" : "⚔️"}
                </span>
                <div>
                  {gauntletEliminatedAtRound !== null ? (
                    <>
                      <p style={{ color: C.red, fontWeight: 700, fontSize: 16 }}>
                        Eliminated — You reached Round {gauntletEliminatedAtRound}
                      </p>
                      <p style={{ color: C.muted, fontSize: 12, marginTop: 2 }}>
                        You won {gauntletRoundsWon} round{gauntletRoundsWon !== 1 ? "s" : ""} before falling. Well fought!
                      </p>
                    </>
                  ) : gauntletRoundsWon > 0 ? (
                    <>
                      <p style={{ color: C.green, fontWeight: 700, fontSize: 16 }}>
                        Round {gauntletRoundsWon} complete — advancing!
                      </p>
                      <p style={{ color: C.muted, fontSize: 12, marginTop: 2 }}>
                        Next: Round {gauntletRoundsWon + 1}
                      </p>
                    </>
                  ) : (
                    <>
                      <p style={{ color: C.yellow, fontWeight: 700, fontSize: 16 }}>
                        Gauntlet — Round 1
                      </p>
                      <p style={{ color: C.muted, fontSize: 12, marginTop: 2 }}>
                        How far can you go?
                      </p>
                    </>
                  )}
                </div>
              </div>
            )}

            {/* Countdown */}
            {tournament.status === "registration" && (
              <div style={{
                background: alpha(C.yellow, 0.08), border: `1px solid ${alpha(C.yellow, 0.27)}`,
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
                background: alpha(C.green, 0.08), border: `1px solid ${alpha(C.green, 0.27)}`,
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

            {/* Next-match Ready / Quit panel (only shown when a pending match exists for me) */}
            {!myMatch && myNextMatch && myParticipant && myParticipant.status !== "quit" && (
              <div style={{
                background: C.bg1, border: `1px solid ${C.border}`,
                borderRadius: 12, padding: "14px 18px", marginBottom: 16,
                display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, flexWrap: "wrap",
              }}>
                <div style={{ minWidth: 0 }}>
                  <p style={{ fontSize: 13, color: C.text, fontWeight: 700 }}>
                    Next match — vs {opponent?.username ?? "TBD"} {opponent?.isAI && "(AI)"}
                  </p>
                  <p style={{ color: C.muted, fontSize: 12, marginTop: 2 }}>
                    {myReady && oppReady
                      ? "Both ready — match will start in the next poll cycle."
                      : myReady
                      ? "You are ready. Waiting on opponent."
                      : oppReady
                      ? "Opponent is ready — tap Ready to start now."
                      : "5-min gap between matches; tap Ready to start sooner."}
                  </p>
                  <p style={{ color: C.faint, fontSize: 11, marginTop: 2 }}>
                    Match cap: 3 min. Score 2 pts for win, 1 for draw, 0 for loss.
                  </p>
                </div>
                <div style={{ display: "flex", gap: 8 }}>
                  <button
                    onClick={onToggleReady}
                    style={{
                      padding: "8px 14px", borderRadius: 8, cursor: "pointer", fontWeight: 700, fontSize: 13,
                      background: myReady ? C.green : C.bg2,
                      color: myReady ? C.bg0 : C.text,
                      border: `1px solid ${myReady ? C.green : C.border}`,
                    }}
                  >
                    {myReady ? "✓ Ready" : "Ready up"}
                  </button>
                  <button
                    onClick={onQuitTournament}
                    style={{
                      padding: "8px 14px", borderRadius: 8, cursor: "pointer", fontWeight: 700, fontSize: 13,
                      background: "transparent", color: C.red,
                      border: `1px solid ${alpha(C.red, 0.40)}`,
                    }}
                  >
                    Quit tournament
                  </button>
                </div>
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
                              onSpectate={() => navigate(`/game/${mode}/tournament/battle/${tournamentId}/${m.id}?spectate=true`)}
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
                    background: p.userId === settings.userId ? alpha(C.blue, 0.06) : "transparent",
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
                        {p.isAI && <span className={`${PILL_BASE} bg-purple/[.13] text-purple border-purple/[.27]`}>AI</span>}
                        {p.userId === settings.userId && <span style={{ fontSize: 11, color: C.faint }}>(you)</span>}
                      </div>
                      <div style={{ display: "flex", gap: 4, marginTop: 2 }}>
                        <span className={`${PILL_BASE} ${
                          p.status === "winner"     ? "bg-yellow/[.13] text-yellow border-yellow/[.27]"
                          : p.status === "eliminated" ? "bg-red/[.13] text-red border-red/[.27]"
                          : p.status === "quit"       ? "bg-faint/[.13] text-faint border-faint/[.27]"
                          : "bg-green/[.13] text-green border-green/[.27]"
                        }`}>
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
                marginTop: 12, background: alpha(C.yellow, 0.08), border: `1px solid ${alpha(C.yellow, 0.27)}`,
                borderRadius: 12, padding: "14px 16px", textAlign: "center",
              }}>
                <p style={{ fontSize: 11, color: C.yellow, fontWeight: 600 }}>TOURNAMENT WINNER</p>
                <p style={{ fontSize: 18, fontWeight: 900, color: C.text, marginTop: 4 }}>
                  🏆 {tournament.winnerUsername}
                </p>
              </div>
            )}

            {/* Tournament-level Ready toggle (only for registered humans during registration). */}
            {isParticipant && tournament.status === "registration" && myParticipant?.status !== "quit" && (
              <div style={{
                marginTop: 12, background: C.bg1, border: `1px solid ${C.border}`,
                borderRadius: 12, padding: 14,
              }}>
                <p style={{ fontSize: 11, color: C.faint, fontWeight: 600, textTransform: "uppercase", marginBottom: 6 }}>
                  Tournament Ready
                </p>
                <p style={{ fontSize: 12, color: C.muted, marginBottom: 10 }}>
                  When every player flips Ready, the bracket starts immediately — no need to wait for the deadline.
                </p>
                <button
                  onClick={onToggleTournamentReady}
                  disabled={readyBusy}
                  style={{
                    width: "100%", padding: "9px 14px", borderRadius: 8, cursor: "pointer",
                    fontWeight: 700, fontSize: 13,
                    background: myTournamentReady ? C.green : C.bg2,
                    color: myTournamentReady ? C.bg0 : C.text,
                    border: `1px solid ${myTournamentReady ? C.green : C.border}`,
                    opacity: readyBusy ? 0.6 : 1,
                  }}
                >
                  {myTournamentReady ? `✓ Ready (${tournamentReadyCount}/${participants.length})` : `Ready up (${tournamentReadyCount}/${participants.length})`}
                </button>
              </div>
            )}

            {/* Self-serve registration card (visible when not yet registered). */}
            {!isParticipant && tournament.status === "registration" && (
              <div style={{
                marginTop: 12, background: C.bg1, border: `1px solid ${C.border}`,
                borderRadius: 12, padding: 14,
              }}>
                <p style={{ fontSize: 11, color: C.faint, fontWeight: 600, textTransform: "uppercase", marginBottom: 6 }}>
                  Register to Play
                </p>
                {!currentUser ? (
                  <p style={{ fontSize: 12, color: C.muted }}>
                    <Link to="/login" style={{ color: C.blue }}>Sign in</Link> to register for this tournament.
                  </p>
                ) : deadlinePassed ? (
                  <p style={{ fontSize: 12, color: C.muted }}>
                    Registration closed at the deadline.
                  </p>
                ) : isFull ? (
                  <p style={{ fontSize: 12, color: C.muted }}>
                    Tournament is full ({participants.length}/{tournament.maxParticipants}).
                  </p>
                ) : (
                  <>
                    <label style={{ fontSize: 11, color: C.faint, display: "block", marginBottom: 4 }}>
                      Pick your beyblade
                    </label>
                    <select
                      value={pickedBeyId}
                      onChange={(e) => setPickedBeyId(e.target.value)}
                      style={{
                        width: "100%", padding: "6px 10px", borderRadius: 8,
                        background: C.bg3, color: C.text, border: `1px solid ${C.border}`,
                        fontSize: 13, marginBottom: 10, boxSizing: "border-box",
                      }}
                    >
                      {beyOptions.length === 0 && <option value="">Loading…</option>}
                      {beyOptions.map((b) => (
                        <option key={b.id} value={b.id}>
                          {b.displayName}{b.type ? ` (${b.type})` : ""}
                        </option>
                      ))}
                    </select>
                    <button
                      onClick={onRegister}
                      disabled={registering || !pickedBeyId || !canRegister}
                      style={{
                        width: "100%", padding: "9px 14px", borderRadius: 8, cursor: "pointer",
                        fontWeight: 700, fontSize: 13,
                        background: C.blue, color: C.bg0,
                        border: `1px solid ${C.blue}`,
                        opacity: registering || !pickedBeyId ? 0.6 : 1,
                      }}
                    >
                      {registering ? "Registering…" : "Register"}
                    </button>
                  </>
                )}
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
      background: C.bg2, borderRadius: 10, border: `1px solid ${isMine ? alpha(C.yellow, 0.33) : C.border}`,
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
              fontSize: 10, color: C.green, background: alpha(C.green, 0.13),
              border: `1px solid ${alpha(C.green, 0.27)}`, borderRadius: 4, padding: "1px 6px", cursor: "pointer", fontWeight: 600,
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
