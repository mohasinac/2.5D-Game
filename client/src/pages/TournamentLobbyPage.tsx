import { useEffect, useState, useCallback, useMemo } from "react";
import { Link, useParams, useNavigate, useLocation } from "react-router-dom";
import { modeFromPath } from "@/shared/utils/gameMode";
import {
  doc, onSnapshot, collection, query, where, setDoc, serverTimestamp, addDoc, getDocs,
} from "firebase/firestore";
import { db, COLLECTIONS } from "@/lib/firebase";
import { useGame } from "@/contexts/GameContext";
import { useAuth } from "@/contexts/AuthContext";
import { cn } from "@/lib/cn";

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
      <div className="min-h-screen bg-bg0 flex items-center justify-center">
        <div className="spin w-10 h-10 border-2 border-border-c border-t-theme-yellow rounded-full" />
      </div>
    );
  }

  const myParticipant = participants.find((p) => p.userId === settings.userId);
  const isParticipant = Boolean(myParticipant);
  const rounds = [...new Set(matches.map((m) => m.round))].sort();

  // Lazy-load beyblade options the first time we display the registration card.
  // Filters out beyblades the tournament has explicitly disabled or that aren't
  // in its allowed list. Falls back to the full collection when no allow-list set.
  // eslint-disable-next-line react-hooks/rules-of-hooks
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

  // eslint-disable-next-line react-hooks/rules-of-hooks
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

  // eslint-disable-next-line react-hooks/rules-of-hooks
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

  // eslint-disable-next-line react-hooks/rules-of-hooks
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

  // eslint-disable-next-line react-hooks/rules-of-hooks
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

  // eslint-disable-next-line react-hooks/rules-of-hooks
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
    <div className="min-h-screen bg-bg0 p-4 sm:p-8">
      <div className="max-w-[860px] mx-auto">
        {/* Header */}
        <div className="mb-7">
          <Link to="/game/tournament" className="text-theme-faint text-[13px] no-underline">← Tournaments</Link>
          <div className="flex items-center gap-3 mt-2">
            <h1 className="text-[28px] font-black text-theme-text tracking-[-0.02em]">
              {tournament.name}
            </h1>
            <span className={`${PILL_BASE} ${STATUS_PILL[tournament.status] ?? STATUS_PILL.draft}`}>
              {tournament.status}
            </span>
          </div>
          {tournament.description && (
            <p className="text-theme-muted text-[13px] mt-1">{tournament.description}</p>
          )}
        </div>

        <div className="grid gap-5 grid-cols-[1fr_320px]">
          {/* Left: bracket */}
          <div>
            {/* Info bar */}
            <div className="bg-bg2 rounded-xl border border-border-c p-4 mb-4 flex gap-6 flex-wrap">
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
              <div className={cn(
                "rounded-xl border p-[14px_18px] mb-4 flex items-center gap-3",
                gauntletEliminatedAtRound !== null
                  ? "bg-red-10 border-red-30"
                  : "bg-green-10 border-green-30"
              )}>
                <span className="text-[28px]">
                  {gauntletEliminatedAtRound !== null ? "💀" : gauntletRoundsWon > 0 ? "🏅" : "⚔️"}
                </span>
                <div>
                  {gauntletEliminatedAtRound !== null ? (
                    <>
                      <p className="text-theme-red font-bold text-[16px]">
                        Eliminated — You reached Round {gauntletEliminatedAtRound}
                      </p>
                      <p className="text-theme-muted text-[12px] mt-0.5">
                        You won {gauntletRoundsWon} round{gauntletRoundsWon !== 1 ? "s" : ""} before falling. Well fought!
                      </p>
                    </>
                  ) : gauntletRoundsWon > 0 ? (
                    <>
                      <p className="text-theme-green font-bold text-[16px]">
                        Round {gauntletRoundsWon} complete — advancing!
                      </p>
                      <p className="text-theme-muted text-[12px] mt-0.5">
                        Next: Round {gauntletRoundsWon + 1}
                      </p>
                    </>
                  ) : (
                    <>
                      <p className="text-theme-yellow font-bold text-[16px]">
                        Gauntlet — Round 1
                      </p>
                      <p className="text-theme-muted text-[12px] mt-0.5">
                        How far can you go?
                      </p>
                    </>
                  )}
                </div>
              </div>
            )}

            {/* Countdown */}
            {tournament.status === "registration" && (
              <div className="bg-yellow-10 border border-yellow-20 rounded-xl p-[16px_20px] mb-4 flex items-center gap-3">
                <span className="text-[28px]">⏱</span>
                <div>
                  <p className="text-theme-yellow font-bold text-[20px]">{countdown}</p>
                  <p className="text-theme-muted text-[12px]">until tournament starts</p>
                </div>
              </div>
            )}

            {/* My match indicator */}
            {myMatch && (
              <div className="bg-green-10 border border-green-30 rounded-xl p-[14px_18px] mb-4">
                <p className="text-theme-green font-bold text-[14px]">
                  Your match is ready!
                </p>
                <p className="text-theme-muted text-[12px] mt-1">
                  {myMatch.status === "in-progress"
                    ? "The battle is live — navigating you now..."
                    : "Room is opening, hold tight..."}
                </p>
              </div>
            )}

            {/* Next-match Ready / Quit panel (only shown when a pending match exists for me) */}
            {!myMatch && myNextMatch && myParticipant && myParticipant.status !== "quit" && (
              <div className="bg-bg1 border border-border-c rounded-xl p-[14px_18px] mb-4 flex items-center justify-between gap-3 flex-wrap">
                <div className="min-w-0">
                  <p className="text-[13px] text-theme-text font-bold">
                    Next match — vs {opponent?.username ?? "TBD"} {opponent?.isAI && "(AI)"}
                  </p>
                  <p className="text-theme-muted text-[12px] mt-0.5">
                    {myReady && oppReady
                      ? "Both ready — match will start in the next poll cycle."
                      : myReady
                      ? "You are ready. Waiting on opponent."
                      : oppReady
                      ? "Opponent is ready — tap Ready to start now."
                      : "5-min gap between matches; tap Ready to start sooner."}
                  </p>
                  <p className="text-theme-faint text-[11px] mt-0.5">
                    Match cap: 3 min. Score 2 pts for win, 1 for draw, 0 for loss.
                  </p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={onToggleReady}
                    className={cn(
                      "py-2 px-3.5 rounded-lg cursor-pointer font-bold text-[13px] border",
                      myReady
                        ? "bg-theme-green text-bg0 border-theme-green"
                        : "bg-bg2 text-theme-text border-border-c"
                    )}
                  >
                    {myReady ? "✓ Ready" : "Ready up"}
                  </button>
                  <button
                    onClick={onQuitTournament}
                    className="py-2 px-3.5 rounded-lg cursor-pointer font-bold text-[13px] bg-transparent text-theme-red border border-red-30"
                  >
                    Quit tournament
                  </button>
                </div>
              </div>
            )}

            {/* Bracket */}
            {rounds.length > 0 && (
              <div className="bg-bg1 rounded-[14px] border border-border-c p-4">
                <p className="text-[11px] text-theme-faint font-semibold uppercase tracking-[0.08em] mb-3">
                  Bracket
                </p>
                <div className="flex gap-4 overflow-x-auto">
                  {rounds.map((round) => (
                    <div key={round} className="min-w-[200px]">
                      <p className="text-[11px] font-bold text-theme-muted mb-2 uppercase">
                        {ROUND_NAMES[round] ?? `Round ${round}`}
                      </p>
                      <div className="flex flex-col gap-2">
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
            <div className="bg-bg1 rounded-[14px] border border-border-c overflow-hidden">
              <div className="px-3.5 py-[10px] border-b border-border-c">
                <span className="text-[12px] font-semibold text-theme-muted">
                  Participants ({participants.length}/{tournament.maxParticipants})
                </span>
              </div>
              {participants.length === 0 ? (
                <div className="p-6 text-center text-theme-faint text-[13px]">
                  No participants yet.
                </div>
              ) : (
                participants.map((p, i) => (
                  <div key={p.id} className={cn(
                    "flex items-center gap-2.5 px-3.5 py-[10px]",
                    i < participants.length - 1 ? "border-b border-border-c" : "",
                    p.userId === settings.userId ? "bg-blue-10" : "bg-transparent"
                  )}>
                    <div className="w-7 h-7 rounded-full bg-bg3 flex items-center justify-center text-[11px] font-bold text-theme-muted shrink-0">
                      {i + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span className="text-[13px] text-theme-text font-medium">{p.username}</span>
                        {p.isAI && <span className={`${PILL_BASE} bg-purple/[.13] text-purple border-purple/[.27]`}>AI</span>}
                        {p.userId === settings.userId && <span className="text-[11px] text-theme-faint">(you)</span>}
                      </div>
                      <div className="flex gap-1 mt-0.5">
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
              <div className="mt-3 bg-yellow-10 border border-yellow-20 rounded-xl p-[14px_16px] text-center">
                <p className="text-[11px] text-theme-yellow font-semibold">TOURNAMENT WINNER</p>
                <p className="text-[18px] font-black text-theme-text mt-1">
                  🏆 {tournament.winnerUsername}
                </p>
              </div>
            )}

            {/* Tournament-level Ready toggle (only for registered humans during registration). */}
            {isParticipant && tournament.status === "registration" && myParticipant?.status !== "quit" && (
              <div className="mt-3 bg-bg1 border border-border-c rounded-xl p-3.5">
                <p className="text-[11px] text-theme-faint font-semibold uppercase mb-1.5">
                  Tournament Ready
                </p>
                <p className="text-[12px] text-theme-muted mb-2.5">
                  When every player flips Ready, the bracket starts immediately — no need to wait for the deadline.
                </p>
                <button
                  onClick={onToggleTournamentReady}
                  disabled={readyBusy}
                  className={cn(
                    "w-full py-[9px] px-3.5 rounded-lg cursor-pointer font-bold text-[13px] border",
                    myTournamentReady
                      ? "bg-theme-green text-bg0 border-theme-green"
                      : "bg-bg2 text-theme-text border-border-c",
                    readyBusy && "opacity-60"
                  )}
                >
                  {myTournamentReady ? `✓ Ready (${tournamentReadyCount}/${participants.length})` : `Ready up (${tournamentReadyCount}/${participants.length})`}
                </button>
              </div>
            )}

            {/* Self-serve registration card (visible when not yet registered). */}
            {!isParticipant && tournament.status === "registration" && (
              <div className="mt-3 bg-bg1 border border-border-c rounded-xl p-3.5">
                <p className="text-[11px] text-theme-faint font-semibold uppercase mb-1.5">
                  Register to Play
                </p>
                {!currentUser ? (
                  <p className="text-[12px] text-theme-muted">
                    <Link to="/login" className="text-theme-blue">Sign in</Link> to register for this tournament.
                  </p>
                ) : deadlinePassed ? (
                  <p className="text-[12px] text-theme-muted">
                    Registration closed at the deadline.
                  </p>
                ) : isFull ? (
                  <p className="text-[12px] text-theme-muted">
                    Tournament is full ({participants.length}/{tournament.maxParticipants}).
                  </p>
                ) : (
                  <>
                    <label className="text-[11px] text-theme-faint block mb-1">
                      Pick your beyblade
                    </label>
                    <select
                      value={pickedBeyId}
                      onChange={(e) => setPickedBeyId(e.target.value)}
                      className="w-full px-2.5 py-1.5 rounded-lg bg-bg3 text-theme-text border border-border-c text-[13px] mb-2.5 box-border"
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
                      className={cn(
                        "w-full py-[9px] px-3.5 rounded-lg cursor-pointer font-bold text-[13px] bg-theme-blue text-bg0 border border-theme-blue",
                        (registering || !pickedBeyId) && "opacity-60"
                      )}
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
      <p className="text-[10px] text-theme-faint uppercase tracking-[0.07em] font-semibold">{label}</p>
      <p className="text-[14px] text-theme-text font-bold capitalize">{value}</p>
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

  const statusColorClass =
    m.status === "in-progress" ? "text-theme-green" :
    m.status === "completed" ? "text-theme-purple" :
    m.status === "bye" ? "text-theme-faint" : "text-theme-muted";

  return (
    <div className={cn(
      "bg-bg2 rounded-[10px] border p-2.5 relative",
      isMine ? "border-yellow-40" : "border-border-c"
    )}>
      <div className="flex justify-between items-center mb-1.5">
        <span className={cn("text-[10px] font-semibold uppercase", statusColorClass)}>
          {m.status}
        </span>
        {m.status === "in-progress" && (
          <button
            onClick={onSpectate}
            className="text-[10px] text-theme-green bg-green-13 border border-green-30 rounded px-1.5 py-px cursor-pointer font-semibold"
          >
            Watch
          </button>
        )}
      </div>

      <div className="flex flex-col gap-1">
        <PlayerRow
          label={p1?.username ?? (m.participant1Id === "__bye__" ? "BYE" : "TBD")}
          isAI={p1?.isAI}
          isWinner={m.winnerId === m.participant1Id || (m.status === "bye" && m.participant2Id === "__bye__")}
        />
        <div className="h-px bg-border-c" />
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
    <div className="flex items-center gap-1.5">
      <span className={cn("text-[12px] flex-1", isWinner ? "text-theme-yellow font-bold" : "text-theme-text font-normal")}>
        {label}
      </span>
      {isAI && <span className="text-[9px] text-theme-purple">AI</span>}
      {isWinner && <span className="text-[12px]">🏆</span>}
    </div>
  );
}
