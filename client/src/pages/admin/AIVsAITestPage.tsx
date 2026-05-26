// AI vs AI test lab — admin-only. Pick two beyblades, an arena, and two
// difficulties; the page navigates to AIBattleGamePage with aiVsAi=true so
// the room spawns both contestants on the server and the admin spectates.

import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { modeFromPath } from "@/shared/utils/gameMode";
import { collection, getDocs } from "firebase/firestore";
import { db, COLLECTIONS } from "@/lib/firebase";
import toast from "react-hot-toast";
import { SearchableSelect } from "@/components/admin/SearchableSelect";

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
    <div className="p-6 max-w-[760px] mx-auto">
      <div className="mb-6">
        <Link to="/admin" className="text-faint text-[13px] no-underline">← Dashboard</Link>
        <h1 className="text-[22px] font-bold text-text mt-2">AI vs AI Lab</h1>
        <p className="text-faint text-[13px] mt-1">
          Pit two AI controllers against each other to validate beyblade and arena interactions.
          You join the resulting room as a spectator.
        </p>
      </div>

      <Section title="Contestants">
        <div className="grid grid-cols-2 gap-3.5">
          <Field label="Player 1 Beyblade">
            <SearchableSelect
              value={p1BeyId}
              options={beys.map((b) => ({ value: b.id, label: `${b.displayName}${b.type ? ` (${b.type})` : ""}` }))}
              onChange={setP1BeyId}
              className="w-full"
            />
          </Field>
          <Field label="Player 2 Beyblade">
            <SearchableSelect
              value={p2BeyId}
              options={beys.map((b) => ({ value: b.id, label: `${b.displayName}${b.type ? ` (${b.type})` : ""}` }))}
              onChange={setP2BeyId}
              className="w-full"
            />
          </Field>
        </div>
        <div className="grid grid-cols-2 gap-3.5">
          <Field label="Player 1 Difficulty">
            <SearchableSelect
              value={p1Diff}
              options={(Object.keys(DIFF_LABEL) as Difficulty[]).map((d) => ({ value: d, label: DIFF_LABEL[d] }))}
              onChange={(v) => setP1Diff(v as Difficulty)}
              className="w-full"
            />
          </Field>
          <Field label="Player 2 Difficulty">
            <SearchableSelect
              value={p2Diff}
              options={(Object.keys(DIFF_LABEL) as Difficulty[]).map((d) => ({ value: d, label: DIFF_LABEL[d] }))}
              onChange={(v) => setP2Diff(v as Difficulty)}
              className="w-full"
            />
          </Field>
        </div>
      </Section>

      <Section title="Arena & Format">
        <Field label="Arena">
          <SearchableSelect
            value={arenaId}
            options={arenas.map((a) => ({ value: a.id, label: a.name }))}
            onChange={setArenaId}
            className="w-full"
          />
        </Field>
        <div className="grid grid-cols-2 gap-3.5">
          <Field label="Best Of">
            <SearchableSelect
              value={String(bestOf)}
              options={[{ value: "1", label: "BO1" }, { value: "3", label: "BO3" }, { value: "5", label: "BO5" }]}
              onChange={(v) => setBestOf(Number(v) as BestOf)}
              className="w-full"
            />
          </Field>
          <Field label="Deterministic seed (optional)">
            <input
              className="w-full px-3 py-2 bg-bg3 border border-border rounded-lg text-text text-sm"
              type="text"
              value={seed}
              onChange={(e) => setSeed(e.target.value)}
              placeholder="leave blank for random"
            />
          </Field>
        </div>
      </Section>

      <div className="flex gap-3 justify-end mt-5">
        <Link to="/admin" className="px-4 py-2 bg-bg3 text-text rounded-lg text-sm font-semibold border border-border no-underline inline-block">
          Cancel
        </Link>
        <button onClick={onStart} disabled={!canStart} className={`px-4 py-2 bg-yellow text-bg0 rounded-lg text-sm font-semibold ${canStart ? "" : "opacity-60"}`}>
          Start AI vs AI
        </button>
      </div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-bg1 rounded-xl border border-border p-[18px] mb-4">
      <p className="text-[11px] font-bold text-muted uppercase tracking-[0.08em] mb-3.5">{title}</p>
      <div className="flex flex-col gap-3">{children}</div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-xs text-muted mb-1.5">{label}</label>
      {children}
    </div>
  );
}
