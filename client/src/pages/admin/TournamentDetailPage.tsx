import { useEffect, useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import {
  doc, onSnapshot, collection, query, where,
  updateDoc, addDoc, serverTimestamp, Timestamp, writeBatch, getDocs,
} from "firebase/firestore";
import { db, COLLECTIONS } from "@/lib/firebase";
import { C, pill, btn } from "@/styles/theme";
import type { TournamentDoc, TournamentParticipantDoc, TournamentMatchDoc } from "@/types/game";

const STATUS_COLORS: Record<string, string> = {
  draft: C.faint, registration: C.blue,
  "in-progress": C.green, completed: C.purple, cancelled: C.red,
};

function formatDate(ts: any): string {
  if (!ts) return "—";
  const d = ts.toDate ? ts.toDate() : new Date(ts);
  return d.toLocaleString(undefined, { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" });
}

const ROUND_NAMES: Record<number, string> = { 1: "Round 1", 2: "Semifinals", 3: "Final" };

export function TournamentDetailPage() {
  const { id: tournamentId } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [tournament, setTournament] = useState<TournamentDoc | null>(null);
  const [participants, setParticipants] = useState<TournamentParticipantDoc[]>([]);
  const [matches, setMatches] = useState<TournamentMatchDoc[]>([]);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  // Add AI participant form state
  const [aiUsername, setAiUsername] = useState("Bot");
  const [aiBeybladeId, setAiBeybladeId] = useState("");

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
      setMsg(`Status set to "${status}".`);
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
      setMsg("AI participant added.");
    } finally { setBusy(false); }
  };

  const removeParticipant = async (participantId: string) => {
    setBusy(true);
    try {
      await updateDoc(doc(db, COLLECTIONS.TOURNAMENT_PARTICIPANTS, participantId), { status: "eliminated" });
      setMsg("Participant removed.");
    } finally { setBusy(false); }
  };

  const generateBracket = async () => {
    if (!tournamentId || !tournament) return;
    if (participants.filter((p) => p.status === "registered").length < 2) {
      setMsg("Need at least 2 registered participants.");
      return;
    }
    setBusy(true);
    setMsg("Generating bracket...");
    try {
      // Check if bracket docs already exist
      const existing = await getDocs(query(collection(db, COLLECTIONS.TOURNAMENT_BRACKETS), where("tournamentId", "==", tournamentId)));
      if (!existing.empty) {
        setMsg("Bracket already exists. Delete existing matches to regenerate.");
        return;
      }

      const active = participants.filter((p) => p.status === "registered").sort((a, b) => a.seed - b.seed);
      const maxP = tournament.maxParticipants;
      const startTs = tournament.scheduledStartTime;
      const intervalMs = tournament.roundIntervalMinutes * 60 * 1000;

      // Standard seeding: 1v8, 4v5, 2v7, 3v6 (for 8p); 1v4, 2v3 (for 4p)
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

      // Generate subsequent rounds (slots with TBD participants)
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
      setMsg("Bracket generated and tournament started!");
    } catch (err: any) {
      setMsg(`Error: ${err?.message ?? "unknown"}`);
    } finally { setBusy(false); }
  };

  if (!tournament) {
    return (
      <div style={{ padding: 24, display: "flex", alignItems: "center", justifyContent: "center", minHeight: 200 }}>
        <div className="spin" style={{ width: 32, height: 32, border: `2px solid ${C.border}`, borderTopColor: C.yellow, borderRadius: "50%" }} />
      </div>
    );
  }

  const rounds = [...new Set(matches.map((m) => m.round))].sort();

  return (
    <div style={{ padding: 24, maxWidth: 1000, margin: "0 auto" }}>
      {/* Header */}
      <div style={{ marginBottom: 24 }}>
        <Link to="/admin/tournaments" style={{ color: C.faint, fontSize: 13, textDecoration: "none" }}>← Tournaments</Link>
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginTop: 8 }}>
          <h1 style={{ fontSize: 22, fontWeight: 700, color: C.text }}>{tournament.name}</h1>
          <span style={pill(STATUS_COLORS[tournament.status] ?? C.faint)}>{tournament.status}</span>
        </div>
      </div>

      {msg && (
        <div style={{ background: C.blue + "18", border: `1px solid ${C.blue}44`, borderRadius: 10, padding: "10px 14px", marginBottom: 16, color: C.blue, fontSize: 13 }}>
          {msg}
        </div>
      )}

      <div style={{ display: "grid", gridTemplateColumns: "1fr 300px", gap: 20 }}>
        {/* Left */}
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {/* Actions */}
          <div style={{ background: C.bg1, borderRadius: 12, border: `1px solid ${C.border}`, padding: 16 }}>
            <p style={{ fontSize: 11, color: C.faint, fontWeight: 600, textTransform: "uppercase", marginBottom: 12 }}>Admin Actions</p>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              {tournament.status === "draft" && (
                <button onClick={() => setStatus("registration")} disabled={busy} style={{ ...btn(C.blue), fontSize: 12 }}>Open Registration</button>
              )}
              {tournament.status === "registration" && participants.length >= 2 && (
                <button onClick={generateBracket} disabled={busy} style={{ ...btn(C.green), color: C.bg0, fontSize: 12 }}>Generate Bracket & Start</button>
              )}
              {tournament.status === "in-progress" && (
                <button onClick={() => setStatus("completed")} disabled={busy} style={{ ...btn(C.purple), fontSize: 12 }}>Mark Completed</button>
              )}
              {(tournament.status === "draft" || tournament.status === "registration") && (
                <button onClick={() => setStatus("cancelled")} disabled={busy} style={{ ...btn(C.red), fontSize: 12 }}>Cancel</button>
              )}
              <Link to={`/game/tournament/${tournamentId}`} target="_blank" style={{ ...btn(C.bg3), textDecoration: "none", fontSize: 12 }}>View Lobby ↗</Link>
            </div>
          </div>

          {/* Bracket */}
          {rounds.length > 0 ? (
            <div style={{ background: C.bg1, borderRadius: 12, border: `1px solid ${C.border}`, padding: 16 }}>
              <p style={{ fontSize: 11, color: C.faint, fontWeight: 600, textTransform: "uppercase", marginBottom: 12 }}>Bracket</p>
              <div style={{ display: "flex", gap: 16, overflowX: "auto" }}>
                {rounds.map((round) => (
                  <div key={round} style={{ minWidth: 220 }}>
                    <p style={{ fontSize: 11, fontWeight: 700, color: C.muted, marginBottom: 8, textTransform: "uppercase" }}>
                      {ROUND_NAMES[round] ?? `Round ${round}`}
                    </p>
                    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                      {matches.filter((m) => m.round === round).sort((a, b) => a.matchNumber - b.matchNumber).map((m) => {
                        const p1 = participants.find((p) => p.id === m.participant1Id);
                        const p2 = participants.find((p) => p.id === m.participant2Id);
                        const statusColor = m.status === "in-progress" ? C.green : m.status === "completed" ? C.purple : m.status === "bye" ? C.faint : C.muted;
                        return (
                          <div key={m.id} style={{ background: C.bg2, borderRadius: 8, border: `1px solid ${C.border}`, padding: 10 }}>
                            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                              <span style={{ fontSize: 10, color: statusColor, fontWeight: 600, textTransform: "uppercase" }}>{m.status}</span>
                              {m.colyseusRoomId && <span style={{ fontSize: 10, color: C.faint, fontFamily: "monospace" }}>{m.colyseusRoomId.slice(0, 8)}…</span>}
                            </div>
                            <div style={{ fontSize: 12, color: m.winnerId === m.participant1Id ? C.yellow : C.text }}>
                              {p1?.username ?? (m.participant1Id === "__bye__" ? "BYE" : "TBD")}
                              {p1?.isAI && " (AI)"}{m.winnerId === m.participant1Id && " 🏆"}
                            </div>
                            <div style={{ height: 1, background: C.border, margin: "4px 0" }} />
                            <div style={{ fontSize: 12, color: m.winnerId === m.participant2Id ? C.yellow : C.text }}>
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
            <div style={{ background: C.bg1, borderRadius: 12, border: `1px solid ${C.border}`, padding: 24, textAlign: "center", color: C.faint, fontSize: 13 }}>
              No bracket generated yet.{tournament.status === "registration" && participants.length >= 2 ? " Use \"Generate Bracket\" above." : ""}
            </div>
          )}
        </div>

        {/* Right: participants */}
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          {/* Participants list */}
          <div style={{ background: C.bg1, borderRadius: 12, border: `1px solid ${C.border}`, overflow: "hidden" }}>
            <div style={{ padding: "10px 14px", borderBottom: `1px solid ${C.border}`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontSize: 12, fontWeight: 600, color: C.muted }}>Participants ({participants.length}/{tournament.maxParticipants})</span>
            </div>
            {participants.length === 0 ? (
              <div style={{ padding: 20, textAlign: "center", color: C.faint, fontSize: 12 }}>No participants yet.</div>
            ) : (
              participants.map((p, i) => (
                <div key={p.id} style={{ display: "flex", alignItems: "center", gap: 8, padding: "9px 14px", borderBottom: i < participants.length - 1 ? `1px solid ${C.border}` : "none" }}>
                  <span style={{ fontSize: 11, color: C.faint, width: 18 }}>{p.seed}</span>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: "flex", gap: 5, alignItems: "center" }}>
                      <span style={{ fontSize: 13, color: C.text }}>{p.username}</span>
                      {p.isAI && <span style={pill(C.purple)}>AI</span>}
                    </div>
                    <span style={pill(p.status === "winner" ? C.yellow : p.status === "eliminated" ? C.red : C.green)}>{p.status}</span>
                  </div>
                  {tournament.status === "registration" && (
                    <button
                      onClick={() => removeParticipant(p.id)}
                      disabled={busy}
                      style={{ fontSize: 10, color: C.red, background: "transparent", border: "none", cursor: "pointer", padding: "2px 6px" }}
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
            <div style={{ background: C.bg1, borderRadius: 12, border: `1px solid ${C.border}`, padding: 14 }}>
              <p style={{ fontSize: 11, color: C.faint, fontWeight: 600, textTransform: "uppercase", marginBottom: 10 }}>Add AI Participant</p>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                <input
                  style={{ width: "100%", background: C.bg3, border: `1px solid ${C.border}`, borderRadius: 8, padding: "6px 10px", color: C.text, fontSize: 13, boxSizing: "border-box" }}
                  placeholder="Username (e.g. Tyson Bot)"
                  value={aiUsername}
                  onChange={(e) => setAiUsername(e.target.value)}
                />
                <input
                  style={{ width: "100%", background: C.bg3, border: `1px solid ${C.border}`, borderRadius: 8, padding: "6px 10px", color: C.text, fontSize: 13, boxSizing: "border-box" }}
                  placeholder="Beyblade ID (optional, auto-picked)"
                  value={aiBeybladeId}
                  onChange={(e) => setAiBeybladeId(e.target.value)}
                />
                <button onClick={addAIParticipant} disabled={busy || !aiUsername.trim()} style={{ ...btn(C.purple), fontSize: 12 }}>
                  Add AI
                </button>
              </div>
            </div>
          )}

          {/* Tournament info */}
          <div style={{ background: C.bg1, borderRadius: 12, border: `1px solid ${C.border}`, padding: 14 }}>
            <p style={{ fontSize: 11, color: C.faint, fontWeight: 600, textTransform: "uppercase", marginBottom: 10 }}>Details</p>
            <div style={{ display: "flex", flexDirection: "column", gap: 6, fontSize: 12 }}>
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
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between" }}>
      <span style={{ color: C.faint }}>{label}</span>
      <span style={{ color: C.text, textTransform: "capitalize" }}>{value}</span>
    </div>
  );
}
