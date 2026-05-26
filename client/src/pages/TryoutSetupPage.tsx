import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { collection, getDocs, getDoc, doc } from "firebase/firestore";
import { db, COLLECTIONS } from "@/lib/firebase";
import { useGame } from "@/contexts/GameContext";
import { SearchableSelect } from "@/components/admin/SearchableSelect";
import { C } from "@/styles/theme";

interface BeyOption { value: string; label: string; hint?: string; }
interface ArenaOption { value: string; label: string; hint?: string; }

const FALLBACK_BEY:   BeyOption   = { value: "default", label: "Default Beyblade (built-in)", hint: "balanced" };
const FALLBACK_ARENA: ArenaOption = { value: "default", label: "Default Arena (built-in)", hint: "circle" };

export function TryoutSetupPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { settings, setBeyblade, setArena } = useGame();

  // Derive the "play" route from whichever setup route we're on
  // e.g. /game/2d/tryout/setup → /game/2d/tryout/play
  const playPath = location.pathname.replace(/\/setup$/, "/play")
    .replace(/\/game\/tryout$/, "/game/tryout/play");

  const [beyOptions, setBeyOptions] = useState<BeyOption[]>([FALLBACK_BEY]);
  const [arenaOptions, setArenaOptions] = useState<ArenaOption[]>([FALLBACK_ARENA]);
  const [selectedBey, setSelectedBey] = useState(settings.beybladeId ?? "default");
  const [selectedArena, setSelectedArena] = useState(settings.arenaId ?? "default");
  const [loading, setLoading] = useState(true);
  const [modeDisabled, setModeDisabled] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const [beySnap, arenaSnap, settingsSnap] = await Promise.all([
          getDocs(collection(db, COLLECTIONS.BEYBLADE_STATS)),
          getDocs(collection(db, COLLECTIONS.ARENAS)),
          getDoc(doc(db, "settings", "game")),
        ]);
        if (settingsSnap.exists() && settingsSnap.data().enableTryout === false) {
          setModeDisabled(true);
        }
        const loadedBeys = beySnap.docs.map(d => {
          const data = d.data();
          return { value: d.id, label: (data.displayName ?? data.name ?? d.id) as string, hint: (data.type ?? "") as string };
        });
        const loadedArenas = arenaSnap.docs.map(d => {
          const data = d.data();
          return { value: d.id, label: (data.name ?? d.id) as string, hint: (data.shape ?? "") as string };
        });
        setBeyOptions([FALLBACK_BEY, ...loadedBeys]);
        setArenaOptions([FALLBACK_ARENA, ...loadedArenas]);
        // Auto-select first real entry if still on fallback
        if ((!settings.beybladeId || settings.beybladeId === "default") && loadedBeys.length)
          setSelectedBey(loadedBeys[0].value);
        if ((!settings.arenaId || settings.arenaId === "default") && loadedArenas.length)
          setSelectedArena(loadedArenas[0].value);
      } catch { /* silently fail — fallback options remain */ }
      finally { setLoading(false); }
    })();
  }, []);

  const canStart = !!selectedBey && !!selectedArena && !modeDisabled;

  const handleStart = () => {
    setBeyblade(selectedBey);
    setArena(selectedArena);
    navigate(playPath);
  };

  return (
    <div className="min-h-screen bg-bg0 flex items-center justify-center p-6">
      <div className="bg-bg1 border border-border-c rounded-2xl p-8 w-full max-w-[480px]">
        <h1 className="text-[22px] font-bold text-theme-text mb-1.5">Tryout Mode</h1>
        <p className="text-theme-faint text-[13px] mb-7">
          Practice solo with any beyblade and arena. No ranking impact.
        </p>

        {modeDisabled && (
          <div className="bg-yellow-10 border border-yellow-40 rounded-lg px-3.5 py-2.5 mb-4 text-[12px] text-theme-yellow">
            Tryout mode is currently disabled by the administrator.
          </div>
        )}

        <div className="mb-5">
          <label className="block text-[12px] text-theme-muted font-semibold mb-1.5">
            Beyblade
          </label>
          <SearchableSelect
            value={selectedBey}
            options={beyOptions}
            onChange={setSelectedBey}
            placeholder={loading ? "Loading…" : "Select a beyblade…"}
            disabled={loading}
            style={{ width: "100%", background: C.bg2, border: `1px solid ${C.border}`, borderRadius: 8, color: C.text, fontSize: 13 }}
          />
        </div>

        <div className="mb-7">
          <label className="block text-[12px] text-theme-muted font-semibold mb-1.5">
            Arena
          </label>
          <SearchableSelect
            value={selectedArena}
            options={arenaOptions}
            onChange={setSelectedArena}
            placeholder={loading ? "Loading…" : "Select an arena…"}
            disabled={loading}
            style={{ width: "100%", background: C.bg2, border: `1px solid ${C.border}`, borderRadius: 8, color: C.text, fontSize: 13 }}
          />
        </div>

        <div className="flex gap-2.5 justify-end">
          <button onClick={() => navigate(-1)}
            className="px-5 py-2.5 rounded-lg text-[13px] border border-border-c bg-transparent text-theme-muted cursor-pointer">
            Back
          </button>
          <button onClick={handleStart} disabled={!canStart}
            className="px-6 py-2.5 rounded-lg text-[13px] font-semibold border-none"
            style={{
              background: canStart ? C.blue : C.bg3,
              color: canStart ? "#fff" : C.faint,
              cursor: canStart ? "pointer" : "not-allowed",
            }}>
            Start Tryout
          </button>
        </div>
      </div>
    </div>
  );
}
