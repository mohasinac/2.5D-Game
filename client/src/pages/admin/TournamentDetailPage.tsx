import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  doc, onSnapshot, collection, query, where,
  updateDoc, addDoc, serverTimestamp, Timestamp, writeBatch, getDocs, deleteDoc,
} from "firebase/firestore";
import { db, COLLECTIONS } from "@/lib/firebase";
import { SearchableSelect } from "@/components/admin/SearchableSelect";
import type { TournamentDoc, TournamentParticipantDoc, TournamentMatchDoc } from "@/types/game";
import toast from "react-hot-toast";

const STATUS_TEXT_CLASS: Record<string, string> = {
  draft: "text-theme-faint", registration: "text-theme-blue",
  "in-progress": "text-theme-green", completed: "text-theme-purple", cancelled: "text-theme-red",
};

function formatDate(ts: any): string {
  if (!ts) return "—";
  const d = ts.toDate ? ts.toDate() : new Date(ts);
  return d.toLocaleString(undefined, { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" });
}

const ROUND_NAMES: Record<number, string> = { 1: "Round 1", 2: "Semifinals", 3: "Final" };

const STATUS_PILL_CLASS: Record<string, string> = {
  draft: "inline-block px-2 py-0.5 rounded-full text-[11px] font-semibold bg-bg3 text-theme-faint border border-border-c",
  registration: "inline-block px-2 py-0.5 rounded-full text-[11px] font-semibold bg-blue-13 text-theme-blue border border-blue-30",
  "in-progress": "inline-block px-2 py-0.5 rounded-full text-[11px] font-semibold bg-green-13 text-theme-green border border-green-30",
  completed: "inline-block px-2 py-0.5 rounded-full text-[11px] font-semibold bg-purple-10 text-theme-purple border border-purple-33",
  cancelled: "inline-block px-2 py-0.5 rounded-full text-[11px] font-semibold bg-red-13 text-theme-red border border-red-30",
  winner: "inline-block px-2 py-0.5 rounded-full text-[11px] font-semibold bg-yellow-10 text-theme-yellow border border-yellow-40",
  eliminated: "inline-block px-2 py-0.5 rounded-full text-[11px] font-semibold bg-red-13 text-theme-red border border-red-30",
};
const DEFAULT_PILL_CLASS = "inline-block px-2 py-0.5 rounded-full text-[11px] font-semibold bg-green-13 text-theme-green border border-green-30";

function statusPillClass(status: string): string {
  return STATUS_PILL_CLASS[status] ?? DEFAULT_PILL_CLASS;
}

export function TournamentDetailPage() {
  const { id: tournamentId } = useParams<{ id: string }>();

  const [tournament, setTournament] = useState<TournamentDoc | null>(null);
  const [participants, setParticipants] = useState<TournamentParticipantDoc[]>([]);
  const [matches, setMatches] = useState<TournamentMatchDoc[]>([]);
  const [busy, setBusy] = useState(false);

  const [aiUsername, setAiUsername] = useState("Bot");
  const [aiBeybladeId, setAiBeybladeId] = useState("");

  const [selectedMatch, setSelectedMatch] = useState<TournamentMatchDoc | null>(null);
  const [setWinnerValue, setSetWinnerValue] = useState("");
  const [rescheduleTime, setRescheduleTime] = useState("");
  const [resetBracketConfirm, setResetBracketConfirm] = useState(false);

  useEffect(() => {
    if (!tournamentId) return;
    const u1 = onSnapshot(doc(db, COLLECTIONS.TOURNAMENTS, tournamentId), (s) => {
      if (s.exists()) setTournament({ id: s.id, ...s.data() } as TournamentDoc);
    });
    const u2 = onSnapshot(query(collection(db, COLLECTIONS.TOURNAMENT_PARTICIPANTS), where("tournamentId", "==", tournamentId)), (s) => {
      setParticipants(s.docs.map((d) => ({ id: d.id, ...d.data() } as TournamentParticipantDoc)));
    });
    const u3 = onSnapshot(query(collection(db, COLLECTIONS.TOURNAMENT_BRACKETS), where("tournamentId", "==", tournamentId)), (s) => {
      setMatches(s.docs.map((d) => ({ id: d.id, ...d.data() } as TournamentMatchDoc)));
    });
    return () => { u1(); u2(); u3(); };
  }, [tournamentId]);

  const setStatus = async (status: TournamentDoc["status"]) => {
    if (!tournamentId) return;
    setBusy(true);
    try {
      await updateDoc(doc(db, COLLECTIONS.TOURNAMENTS, tournamentId), { status, updatedAt: serverTimestamp() });
      toast.success(`Status set to "${status}".`);
    } catch (err: any) {
      toast.error(`Failed to update status: ${err?.message ?? "unknown error"}`);
    } finally { setBusy(false); }
  };

  const addAIParticipant = async () => {
    if (!tournamentId || !aiUsername.trim()) return;
    setBusy(true);
    try {
      const seed = participants.length + 1;
      await addDoc(collection(db, COLLECTIONS.TOURNAMENT_PARTICIPANTS), {
        tournamentId,
        userId: `__ai__${seed}`,
        username: aiUsername.trim(),
        beybladeId: aiBeybladeId.trim() || "",
        isAI: true,
        seed,
        registeredAt: serverTimestamp(),
        status: "registered",
      });
      setAiUsername("Bot");
      setAiBeybladeId("");
      toast.success("AI participant added.");
    } catch (err: any) {
      toast.error(`Failed to add AI: ${err?.message ?? "unknown error"}`);
    } finally { setBusy(false); }
  };

  const removeParticipant = async (participantId: string) => {
    setBusy(true);
    try {
      await updateDoc(doc(db, COLLECTIONS.TOURNAMENT_PARTICIPANTS, participantId), { status: "eliminated" });
      toast.success("Participant removed.");
    } catch (err: any) {
      toast.error(`Failed to remove participant: ${err?.message ?? "unknown error"}`);
    } finally { setBusy(false); }
  };

  const generateBracket = async () => {
    if (!tournamentId || !tournament) return;
    if (participants.filter((p) => p.status === "registered").length < 2) {
      toast.error("Need at least 2 registered participants.");
      return;
    }
    setBusy(true);
    const generatingToast = toast.loading("Generating bracket...");
    try {
      const existing = await getDocs(query(collection(db, COLLECTIONS.TOURNAMENT_BRACKETS), where("tournamentId", "==", tournamentId)));
      if (!existing.empty) {
        toast.dismiss(generatingToast);
        toast.error("Bracket already exists. Delete existing matches to regenerate.");
        setBusy(false);
        return;
      }

      const active = participants.filter((p) => p.status === "registered").sort((a, b) => a.seed - b.seed);
      const maxP = tournament.maxParticipants;
      const startTs = tournament.scheduledStartTime;
      const intervalMs = tournament.roundIntervalMinutes * 60 * 1000;

      const pairings: Array<[string, string]> = [];
      const n = maxP;
      for (let i = 0; i < n / 2; i++) {
        const s1 = i + 1;
        const s2 = n - i;
        const p1 = active.find((p) => p.seed === s1) ?? null;
        const p2 = active.find((p) => p.seed === s2) ?? null;
        pairings.push([p1?.id ?? "__bye__", p2?.id ?? "__bye__"]);
      }

      const batch = writeBatch(db);
      const startDate = startTs.toDate ? startTs.toDate() : new Date(startTs);
      const r1Time = Timestamp.fromDate(startDate);

      pairings.forEach((pair, i) => {
        const isBye = pair[0] === "__bye__" || pair[1] === "__bye__";
        const winnerId = pair[0] === "__bye__" ? pair[1] : pair[1] === "__bye__" ? pair[0] : null;
        const ref = doc(collection(db, COLLECTIONS.TOURNAMENT_BRACKETS));
        batch.set(ref, {
          tournamentId,
          round: 1,
          matchNumber: i + 1,
          scheduledTime: r1Time,
          status: isBye ? "bye" : "pending",
          participant1Id: pair[0],
          participant2Id: pair[1],
          participant1BeybladeId: "",
          participant2BeybladeId: "",
          winnerId,
          colyseusRoomId: "",
          arenaId: tournament.allowedArenaIds?.[0] ?? "default",
          matchFirestoreId: "",
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        });
      });

      const numRounds = Math.ceil(Math.log2(maxP));
      for (let round = 2; round <= numRounds; round++) {
        const matchCount = maxP / Math.pow(2, round);
        const roundTimeMs = startDate.getTime() + (round - 1) * intervalMs;
        const roundTs = Timestamp.fromMillis(roundTimeMs);
        for (let m = 1; m <= matchCount; m++) {
          const ref = doc(collection(db, COLLECTIONS.TOURNAMENT_BRACKETS));
          batch.set(ref, {
            tournamentId, round, matchNumber: m,
            scheduledTime: roundTs,
            status: "pending",
            participant1Id: "", participant2Id: "",
            participant1BeybladeId: "", participant2BeybladeId: "",
            winnerId: null, colyseusRoomId: "",
            arenaId: tournament.allowedArenaIds?.[0] ?? "default",
            matchFirestoreId: "",
            createdAt: serverTimestamp(), updatedAt: serverTimestamp(),
          });
        }
      }

      await batch.commit();
      await updateDoc(doc(db, COLLECTIONS.TOURNAMENTS, tournamentId), { status: "in-progress", updatedAt: serverTimestamp() });
      toast.dismiss(generatingToast);
      toast.success("Bracket generated and tournament started!");
    } catch (err: any) {
      toast.dismiss(generatingToast);
      toast.error(`Failed to generate bracket: ${err?.message ?? "unknown"}`);
    } finally { setBusy(false); }
  };

  const handleSetWinner = async () => {
    if (!selectedMatch || !setWinnerValue) return;
    setBusy(true);
    try {
      await updateDoc(doc(db, COLLECTIONS.TOURNAMENT_BRACKETS, selectedMatch.id), {
        winnerId: setWinnerValue, status: "completed", updatedAt: serverTimestamp(),
      });
      const loser = setWinnerValue === selectedMatch.participant1Id ? selectedMatch.participant2Id : selectedMatch.participant1Id;
      if (loser && loser !== "__bye__") {
        const loserSnap = await getDocs(query(collection(db, COLLECTIONS.TOURNAMENT_PARTICIPANTS), where("id", "==", loser)));
        if (!loserSnap.empty) {
          await updateDoc(doc(db, COLLECTIONS.TOURNAMENT_PARTICIPANTS, loserSnap.docs[0].id), { status: "eliminated", updatedAt: serverTimestamp() });
        }
      }
      toast.success("Winner set.");
      setSelectedMatch(null);
      setSetWinnerValue("");
    } catch (err: any) { toast.error(err?.message ?? "Failed"); }
    finally { setBusy(false); }
  };

  const handleReschedule = async () => {
    if (!selectedMatch || !rescheduleTime) return;
    setBusy(true);
    try {
      await updateDoc(doc(db, COLLECTIONS.TOURNAMENT_BRACKETS, selectedMatch.id), {
        scheduledTime: Timestamp.fromDate(new Date(rescheduleTime)), updatedAt: serverTimestamp(),
      });
      toast.success("Match rescheduled.");
      setSelectedMatch(null);
      setRescheduleTime("");
    } catch (err: any) { toast.error(err?.message ?? "Failed"); }
    finally { setBusy(false); }
  };

  const handleResetBracket = async () => {
    if (!tournamentId) return;
    setBusy(true);
    setResetBracketConfirm(false);
    try {
      const snap = await getDocs(query(collection(db, COLLECTIONS.TOURNAMENT_BRACKETS), where("tournamentId", "==", tournamentId)));
      const batch = writeBatch(db);
      snap.docs.forEach(d => batch.delete(d.ref));
      await batch.commit();
      await updateDoc(doc(db, COLLECTIONS.TOURNAMENTS, tournamentId), { status: "registration", updatedAt: serverTimestamp() });
      toast.success("Bracket reset — tournament returned to registration.");
    } catch (err: any) { toast.error(err?.message ?? "Reset failed"); }
    finally { setBusy(false); }
  };

  const handleForceFillAI = async () => {
    if (!tournamentId || !tournament) return;
    setBusy(true);
    try {
      const pendingSlots = matches.filter(m => m.status === "pending" && (!m.participant1Id || !m.participant2Id));
      if (pendingSlots.length === 0) { toast.error("No pending empty slots found."); setBusy(false); return; }
      const batch = writeBatch(db);
      let count = 0;
      for (const slot of pendingSlots) {
        const updates: any = { updatedAt: serverTimestamp() };
        if (!slot.participant1Id || slot.participant1Id === "__bye__") {
          const aiRef = await addDoc(collection(db, COLLECTIONS.TOURNAMENT_PARTICIPANTS), {
            tournamentId, userId: `__ai__${Date.now()}_${count}`, username: `AI Bot ${count + 1}`,
            beybladeId: "", isAI: true, seed: participants.length + count + 1,
            registeredAt: serverTimestamp(), status: "registered",
          });
          updates.participant1Id = aiRef.id;
          count++;
        }
        if (!slot.participant2Id || slot.participant2Id === "__bye__") {
          const aiRef = await addDoc(collection(db, COLLECTIONS.TOURNAMENT_PARTICIPANTS), {
            tournamentId, userId: `__ai__${Date.now()}_${count}`, username: `AI Bot ${count + 1}`,
            beybladeId: "", isAI: true, seed: participants.length + count + 1,
            registeredAt: serverTimestamp(), status: "registered",
          });
          updates.participant2Id = aiRef.id;
          count++;
        }
        batch.update(doc(db, COLLECTIONS.TOURNAMENT_BRACKETS, slot.id), updates);
      }
      await batch.commit();
      toast.success(`Force-filled ${count} AI slot${count !== 1 ? "s" : ""}.`);
    } catch (err: any) { toast.error(err?.message ?? "Failed"); }
    finally { setBusy(false); }
  };

  if (!tournament) {
    return (
      <div className="p-6 flex items-center justify-center min-h-[200px]">
        <div className="spin w-8 h-8 border-2 border-border border-t-yellow rounded-full" />
      </div>
    );
  }

  const rounds = [...new Set(matches.map((m) => m.round))].sort();

  return (
    <div className="p-6 max-w-[1000px] mx-auto">
      {/* Header */}
      <div className="mb-6">
        <Link to="/admin/tournaments" className="text-faint text-[13px] no-underline">← Tournaments</Link>
        <div className="flex items-center gap-3 mt-2 flex-wrap">
          <h1 className="text-[22px] font-bold text-text">{tournament.name}</h1>
          <span className={statusPillClass(tournament.status)}>{tournament.status}</span>
          {(tournament.status === "draft" || tournament.status === "registration") && (
            <Link to={`/admin/tournaments/${tournamentId}/edit`}
              className="px-3 py-1 text-xs rounded-md no-underline bg-blue/[.10] text-blue border border-blue/[.25]">
              Edit
            </Link>
          )}
        </div>
      </div>

      <div className="grid gap-5" style={{ gridTemplateColumns: "1fr 300px" }}>
        {/* Left */}
        <div className="flex flex-col gap-4">
          {/* Actions */}
          <div className="bg-bg1 rounded-xl border border-border p-4">
            <p className="text-[11px] text-faint font-semibold uppercase mb-3">Admin Actions</p>
            <div className="flex gap-2 flex-wrap">
              {tournament.status === "draft" && (
                <button onClick={() => setStatus("registration")} disabled={busy} className="px-4 py-2 bg-blue text-white rounded-lg text-xs font-semibold">Open Registration</button>
              )}
              {tournament.status === "registration" && participants.length >= 2 && (
                <button onClick={generateBracket} disabled={busy} className="px-4 py-2 bg-green text-bg0 rounded-lg text-xs font-semibold">Generate Bracket &amp; Start</button>
              )}
              {tournament.status === "in-progress" && (
                <button onClick={() => setStatus("completed")} disabled={busy} className="px-4 py-2 bg-purple text-white rounded-lg text-xs font-semibold">Mark Completed</button>
              )}
              {tournament.status === "in-progress" && (
                <button onClick={() => setResetBracketConfirm(true)} disabled={busy} className="px-4 py-2 bg-red text-white rounded-lg text-xs font-semibold">Reset Bracket</button>
              )}
              {tournament.status === "in-progress" && (
                <button onClick={handleForceFillAI} disabled={busy} className="px-4 py-2 bg-yellow text-bg0 rounded-lg text-xs font-semibold">Force-Fill AI</button>
              )}
              {(tournament.status === "draft" || tournament.status === "registration") && (
                <button onClick={() => setStatus("cancelled")} disabled={busy} className="px-4 py-2 bg-red text-white rounded-lg text-xs font-semibold">Cancel</button>
              )}
              <Link to={`/game/tournament/${tournamentId}`} target="_blank" className="px-4 py-2 bg-bg3 text-text rounded-lg text-xs font-semibold border border-border no-underline">View Lobby ↗</Link>
            </div>
          </div>

          {/* Bracket */}
          {rounds.length > 0 ? (
            <div className="bg-bg1 rounded-xl border border-border p-4">
              <p className="text-[11px] text-faint font-semibold uppercase mb-3">Bracket</p>
              <div className="flex gap-4 overflow-x-auto">
                {rounds.map((round) => (
                  <div key={round} className="min-w-[220px]">
                    <p className="text-[11px] font-bold text-muted mb-2 uppercase">
                      {ROUND_NAMES[round] ?? `Round ${round}`}
                    </p>
                    <div className="flex flex-col gap-2">
                      {matches.filter((m) => m.round === round).sort((a, b) => a.matchNumber - b.matchNumber).map((m) => {
                        const p1 = participants.find((p) => p.id === m.participant1Id);
                        const p2 = participants.find((p) => p.id === m.participant2Id);
                        const statusTextClass = STATUS_TEXT_CLASS[m.status] ?? "text-theme-muted";
                        return (
                          <div key={m.id}
                            onClick={() => { setSelectedMatch(m); setSetWinnerValue(m.winnerId ?? ""); setRescheduleTime(""); }}
                            className="bg-bg2 rounded-lg border border-border p-2.5 cursor-pointer">
                            <div className="flex justify-between mb-1.5">
                              <span className={`text-[10px] font-semibold uppercase ${statusTextClass}`}>{m.status}</span>
                              {m.colyseusRoomId && <span className="text-[10px] text-faint font-mono">{m.colyseusRoomId.slice(0, 8)}…</span>}
                            </div>
                            <div className={`text-[12px] ${m.winnerId === m.participant1Id ? "text-theme-yellow" : "text-theme-text"}`}>
                              {p1?.username ?? (m.participant1Id === "__bye__" ? "BYE" : "TBD")}
                              {p1?.isAI && " (AI)"}{m.winnerId === m.participant1Id && " 🏆"}
                            </div>
                            <div className="h-px bg-border my-1" />
                            <div className={`text-[12px] ${m.winnerId === m.participant2Id ? "text-theme-yellow" : "text-theme-text"}`}>
                              {p2?.username ?? (m.participant2Id === "__bye__" ? "BYE" : "TBD")}
                              {p2?.isAI && " (AI)"}{m.winnerId === m.participant2Id && " 🏆"}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="bg-bg1 rounded-xl border border-border p-6 text-center text-faint text-[13px]">
              No bracket generated yet.{tournament.status === "registration" && participants.length >= 2 ? " Use \"Generate Bracket\" above." : ""}
            </div>
          )}
        </div>

        {/* Right: participants */}
        <div className="flex flex-col gap-3.5">
          {/* Participants list */}
          <div className="bg-bg1 rounded-xl border border-border overflow-hidden">
            <div className="px-3.5 py-2.5 border-b border-border flex justify-between items-center">
              <span className="text-xs font-semibold text-muted">Participants ({participants.length}/{tournament.maxParticipants})</span>
            </div>
            {participants.length === 0 ? (
              <div className="p-5 text-center text-faint text-xs">No participants yet.</div>
            ) : (
              participants.map((p, i) => (
                <div key={p.id} className={`flex items-center gap-2 px-3.5 py-2.5${i < participants.length - 1 ? " border-b border-border" : ""}`}>
                  <span className="text-[11px] text-faint w-[18px]">{p.seed}</span>
                  <div className="flex-1">
                    <div className="flex gap-1.5 items-center">
                      <span className="text-[13px] text-text">{p.username}</span>
                      {p.isAI && <span className="inline-block px-2 py-0.5 rounded-full text-[11px] font-semibold bg-purple/[.13] text-purple border border-purple/[.27]">AI</span>}
                    </div>
                    <span className={statusPillClass(p.status)}>{p.status}</span>
                  </div>
                  {tournament.status === "registration" && (
                    <button
                      onClick={() => removeParticipant(p.id)}
                      disabled={busy}
                      className="text-[10px] text-red bg-transparent border-none cursor-pointer px-1.5 py-0.5"
                    >
                      ✕
                    </button>
                  )}
                </div>
              ))
            )}
          </div>

          {/* Add AI participant */}
          {tournament.status === "registration" && participants.length < tournament.maxParticipants && (
            <div className="bg-bg1 rounded-xl border border-border p-3.5">
              <p className="text-[11px] text-faint font-semibold uppercase mb-2.5">Add AI Participant</p>
              <div className="flex flex-col gap-2">
                <input
                  className="w-full px-3 py-1.5 bg-bg3 border border-border rounded-lg text-text text-sm box-border"
                  placeholder="Username (e.g. Tyson Bot)"
                  value={aiUsername}
                  onChange={(e) => setAiUsername(e.target.value)}
                />
                <input
                  className="w-full px-3 py-1.5 bg-bg3 border border-border rounded-lg text-text text-sm box-border"
                  placeholder="Beyblade ID (optional, auto-picked)"
                  value={aiBeybladeId}
                  onChange={(e) => setAiBeybladeId(e.target.value)}
                />
                <button onClick={addAIParticipant} disabled={busy || !aiUsername.trim()} className="px-4 py-2 bg-purple text-white rounded-lg text-xs font-semibold">
                  Add AI
                </button>
              </div>
            </div>
          )}

          {/* Tournament info */}
          <div className="bg-bg1 rounded-xl border border-border p-3.5">
            <p className="text-[11px] text-faint font-semibold uppercase mb-2.5">Details</p>
            <div className="flex flex-col gap-1.5 text-xs">
              <Row label="Type" value={tournament.type} />
              <Row label="Format" value={`Best of ${tournament.bestOf}`} />
              <Row label="AI Difficulty" value={tournament.aiDifficulty} />
              <Row label="Auto-fill AI" value={tournament.autoFillWithAI ? "Yes" : "No"} />
              <Row label="Start" value={formatDate(tournament.scheduledStartTime)} />
              <Row label="Round Gap" value={`${tournament.roundIntervalMinutes}m`} />
              {tournament.winnerUsername && <Row label="Winner" value={`🏆 ${tournament.winnerUsername}`} />}
            </div>
          </div>
        </div>
      </div>

      {/* Match detail modal */}
      {selectedMatch && (
        <MatchDetailModal
          match={selectedMatch}
          participants={participants}
          onClose={() => { setSelectedMatch(null); setSetWinnerValue(""); setRescheduleTime(""); }}
          onSetWinner={handleSetWinner}
          onReschedule={handleReschedule}
          busy={busy}
        />
      )}

      {/* Reset bracket confirmation */}
      {resetBracketConfirm && (
        <div className="fixed inset-0 bg-black/75 flex items-center justify-center z-[1000]">
          <div className="bg-bg1 border border-border rounded-2xl p-7 max-w-[400px] w-[90%]">
            <h3 className="text-base font-bold text-text mb-2.5">Reset Bracket?</h3>
            <p className="text-muted text-[13px] mb-5">All match documents will be deleted and the tournament will return to registration status. This cannot be undone.</p>
            <div className="flex gap-2.5 justify-end">
              <button onClick={() => setResetBracketConfirm(false)} className="px-4 py-1.5 rounded-lg text-[13px] border border-border bg-transparent text-muted cursor-pointer">Cancel</button>
              <button onClick={handleResetBracket} disabled={busy} className="px-4 py-1.5 rounded-lg text-[13px] border-none bg-red text-white cursor-pointer">Reset</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function MatchDetailModal({ match, participants, onClose, onSetWinner, onReschedule, busy }: {
  match: TournamentMatchDoc; participants: TournamentParticipantDoc[];
  onClose: () => void;
  onSetWinner: (winnerId: string) => void;
  onReschedule: (time: string) => void;
  busy: boolean;
}) {
  const [winnerSel, setWinnerSel] = useState(match.winnerId ?? "");
  const [reschedSel, setReschedSel] = useState("");
  const p1 = participants.find(p => p.id === match.participant1Id);
  const p2 = participants.find(p => p.id === match.participant2Id);

  const participantOpts = [
    ...(p1 ? [{ value: p1.id, label: p1.username + (p1.isAI ? " (AI)" : "") }] : []),
    ...(p2 ? [{ value: p2.id, label: p2.username + (p2.isAI ? " (AI)" : "") }] : []),
  ];

  return (
    <div className="fixed inset-0 bg-black/75 flex items-center justify-center z-[1000] p-4">
      <div className="bg-bg1 border border-border rounded-2xl p-6 w-full max-w-[440px]">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-base font-bold text-text">Match Detail — R{match.round} M{match.matchNumber}</h3>
          <button onClick={onClose} className="bg-none border-none text-faint cursor-pointer text-lg">×</button>
        </div>
        <div className="flex flex-col gap-2.5 text-[13px] mb-4">
          <div className="flex justify-between"><span className="text-faint">Status</span><span className="text-text capitalize">{match.status}</span></div>
          <div className="flex justify-between"><span className="text-faint">Scheduled</span><span className="text-text">{match.scheduledTime?.toDate ? match.scheduledTime.toDate().toLocaleString() : "—"}</span></div>
          {match.colyseusRoomId && <div className="flex justify-between"><span className="text-faint">Room ID</span><span className="text-text font-mono text-[11px]">{match.colyseusRoomId}</span></div>}
          <div className="flex justify-between"><span className="text-faint">P1</span><span className="text-text">{p1?.username ?? match.participant1Id}</span></div>
          <div className="flex justify-between"><span className="text-faint">P2</span><span className="text-text">{p2?.username ?? match.participant2Id}</span></div>
          {match.winnerId && <div className="flex justify-between"><span className="text-faint">Winner</span><span className="text-yellow">🏆 {participants.find(p => p.id === match.winnerId)?.username ?? match.winnerId}</span></div>}
        </div>

        <div className="border-t border-border pt-3.5 flex flex-col gap-3">
          <div>
            <p className="text-[11px] text-faint mb-1.5">Set Winner</p>
            <div className="flex gap-1.5">
              <SearchableSelect value={winnerSel} options={participantOpts} onChange={setWinnerSel} placeholder="Select winner…" className="flex-1" />
              <button onClick={() => onSetWinner(winnerSel)} disabled={!winnerSel || busy}
                className={`px-3 py-1.5 bg-theme-yellow text-bg0 border-none rounded-[7px] text-[12px] font-semibold cursor-pointer ${winnerSel && !busy ? "" : "opacity-40"}`}>
                Set
              </button>
            </div>
          </div>
          <div>
            <p className="text-[11px] text-faint mb-1.5">Reschedule</p>
            <div className="flex gap-1.5">
              <input type="datetime-local" value={reschedSel} onChange={e => setReschedSel(e.target.value)}
                className="flex-1 px-2.5 py-1.5 rounded-lg border border-border bg-bg0 text-text text-xs" />
              <button onClick={() => onReschedule(reschedSel)} disabled={!reschedSel || busy}
                className={`px-3 py-1.5 bg-theme-blue text-white border-none rounded-[7px] text-[12px] cursor-pointer ${reschedSel && !busy ? "" : "opacity-40"}`}>
                Save
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between">
      <span className="text-faint">{label}</span>
      <span className="text-text capitalize">{value}</span>
    </div>
  );
}
