// AI vs AI test lab — admin-only. Pick two beyblades, an arena, and two
// difficulties; the page navigates to AIBattleGamePage with aiVsAi=true so
// the room spawns both contestants on the server and the admin spectates.

import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { modeFromPath } from "@/shared/utils/gameMode";
import { collection, getDocs } from "firebase/firestore";
import { db, COLLECTIONS } from "@/lib/firebase";
import { C, S, btn } from "@/styles/theme";
import toast from "react-hot-toast";

type Difficulty = "medium" | "hard" | "hell";
type BestOf = 1 | 3 | 5;

interface BeybladeRow {
  id: string;
  displayName: string;
  type?: string;
}
interface ArenaRow {
  id: string;
  name: string;
}

const DIFF_LABEL: Record<Difficulty, string> = {
  medium: "Medium — chase + defend",
  hard: "Hard — predict + circle-strafe",
  hell: "Hell — frame-perfect + combos",
};

export function AIVsAITestPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const mode = modeFromPath(location.pathname);

  const [beys, setBeys] = useState<BeybladeRow[]>([]);
  const [arenas, setArenas] = useState<ArenaRow[]>([]);
  const [loading, setLoading] = useState(true);

  const [p1BeyId, setP1BeyId] = useState("");
  const [p2BeyId, setP2BeyId] = useState("");
  const [arenaId, setArenaId] = useState("");
  const [p1Diff, setP1Diff] = useState<Difficulty>("medium");
  const [p2Diff, setP2Diff] = useState<Difficulty>("medium");
  const [bestOf, setBestOf] = useState<BestOf>(1);
  const [seed, setSeed] = useState<string>("");

  useEffect(() => {
    (async () => {
      try {
        const [bSnap, aSnap] = await Promise.all([
          getDocs(collection(db, COLLECTIONS.BEYBLADE_STATS)),
          getDocs(collection(db, COLLECTIONS.ARENAS)),
        ]);
        const bs = bSnap.docs.map((d) => {
          const raw = d.data() as any;
          return { id: d.id, displayName: raw.displayName ?? d.id, type: raw.type } as BeybladeRow;
        });
        const as = aSnap.docs.map((d) => {
          const raw = d.data() as any;
          return { id: d.id, name: raw.name ?? d.id } as ArenaRow;
        });
        setBeys(bs);
        setArenas(as);
        if (bs.length > 0) {
          setP1BeyId(bs[0].id);
          setP2BeyId(bs.length > 1 ? bs[1].id : bs[0].id);
        }
        if (as.length > 0) setArenaId(as[0].id);
      } catch {
        toast.error("Failed to load beyblades/arenas");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const canStart = useMemo(
    () => Boolean(p1BeyId && p2BeyId && arenaId && !loading),
    [p1BeyId, p2BeyId, arenaId, loading]
  );

  const onStart = () => {
    if (!canStart) {
      toast.error("Pick both beyblades and an arena first");
      return;
    }
    const matchId = seed.trim() || `aivsai_${Date.now()}`;
    navigate(`/game/${mode}/ai-battle/play?spectate=true`, {
      state: {
        aiVsAi: true,
        arenaId,
        // Used by AIBattleRoom to spawn two AI contestants in onCreate.
        aiP1BeybladeId: p1BeyId,
        aiP2BeybladeId: p2BeyId,
        aiP1Difficulty: p1Diff,
        aiP2Difficulty: p2Diff,
        bestOf,
        matchId,
      },
    });
  };

  return (
    <div style={{ padding: 24, maxWidth: 760, margin: "0 auto" }}>
      <div style={{ marginBottom: 24 }}>
        <Link to="/admin" style={{ color: C.faint, fontSize: 13, textDecoration: "none" }}>← Dashboard</Link>
        <h1 style={{ fontSize: 22, fontWeight: 700, color: C.text, marginTop: 8 }}>AI vs AI Lab</h1>
        <p style={{ color: C.faint, fontSize: 13, marginTop: 4 }}>
          Pit two AI controllers against each other to validate beyblade and arena interactions.
          You join the resulting room as a spectator.
        </p>
      </div>

      <Section title="Contestants">
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
          <Field label="Player 1 Beyblade">
            <select style={S.input} value={p1BeyId} onChange={(e) => setP1BeyId(e.target.value)}>
              {beys.map((b) => (
                <option key={b.id} value={b.id}>{b.displayName}{b.type ? ` (${b.type})` : ""}</option>
              ))}
            </select>
          </Field>
          <Field label="Player 2 Beyblade">
            <select style={S.input} value={p2BeyId} onChange={(e) => setP2BeyId(e.target.value)}>
              {beys.map((b) => (
                <option key={b.id} value={b.id}>{b.displayName}{b.type ? ` (${b.type})` : ""}</option>
              ))}
            </select>
          </Field>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
          <Field label="Player 1 Difficulty">
            <select style={S.input} value={p1Diff} onChange={(e) => setP1Diff(e.target.value as Difficulty)}>
              {(Object.keys(DIFF_LABEL) as Difficulty[]).map((d) => (
                <option key={d} value={d}>{DIFF_LABEL[d]}</option>
              ))}
            </select>
          </Field>
          <Field label="Player 2 Difficulty">
            <select style={S.input} value={p2Diff} onChange={(e) => setP2Diff(e.target.value as Difficulty)}>
              {(Object.keys(DIFF_LABEL) as Difficulty[]).map((d) => (
                <option key={d} value={d}>{DIFF_LABEL[d]}</option>
              ))}
            </select>
          </Field>
        </div>
      </Section>

      <Section title="Arena & Format">
        <Field label="Arena">
          <select style={S.input} value={arenaId} onChange={(e) => setArenaId(e.target.value)}>
            {arenas.map((a) => (
              <option key={a.id} value={a.id}>{a.name}</option>
            ))}
          </select>
        </Field>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
          <Field label="Best Of">
            <select style={S.input} value={bestOf} onChange={(e) => setBestOf(Number(e.target.value) as BestOf)}>
              <option value={1}>BO1</option>
              <option value={3}>BO3</option>
              <option value={5}>BO5</option>
            </select>
          </Field>
          <Field label="Deterministic seed (optional)">
            <input
              style={S.input}
              type="text"
              value={seed}
              onChange={(e) => setSeed(e.target.value)}
              placeholder="leave blank for random"
            />
          </Field>
        </div>
      </Section>

      <div style={{ display: "flex", gap: 12, justifyContent: "flex-end", marginTop: 20 }}>
        <Link to="/admin" style={{ ...btn(C.bg3), textDecoration: "none", display: "inline-block" }}>
          Cancel
        </Link>
        <button onClick={onStart} disabled={!canStart} style={{ ...btn(C.yellow), color: C.bg0, opacity: canStart ? 1 : 0.6 }}>
          Start AI vs AI
        </button>
      </div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{ background: C.bg1, borderRadius: 12, border: `1px solid ${C.border}`, padding: 18, marginBottom: 16 }}>
      <p style={{ fontSize: 11, fontWeight: 700, color: C.muted, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 14 }}>{title}</p>
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>{children}</div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label style={S.label}>{label}</label>
      {children}
    </div>
  );
}
