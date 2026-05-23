import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { collection, getDocs } from "firebase/firestore";
import { db, COLLECTIONS } from "@/lib/firebase";
import { useGame } from "@/contexts/GameContext";
import { SearchableSelect } from "@/components/admin/SearchableSelect";
import { C } from "@/styles/theme";

interface BeyOption { value: string; label: string; hint?: string; }
interface ArenaOption { value: string; label: string; hint?: string; }

export function TryoutSetupPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { settings, setBeyblade, setArena } = useGame();

  // Derive the "play" route from whichever setup route we're on
  // e.g. /game/2d/tryout/setup → /game/2d/tryout/play
  const playPath = location.pathname.replace(/\/setup$/, "/play")
    .replace(/\/game\/tryout$/, "/game/tryout/play");

  const [beyOptions, setBeyOptions] = useState<BeyOption[]>([]);
  const [arenaOptions, setArenaOptions] = useState<ArenaOption[]>([]);
  const [selectedBey, setSelectedBey] = useState(settings.beybladeId ?? "");
  const [selectedArena, setSelectedArena] = useState(settings.arenaId ?? "");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const [beySnap, arenaSnap] = await Promise.all([
          getDocs(collection(db, COLLECTIONS.BEYBLADE_STATS)),
          getDocs(collection(db, COLLECTIONS.ARENAS)),
        ]);
        setBeyOptions(
          beySnap.docs.map(d => {
            const data = d.data();
            return { value: d.id, label: data.name ?? d.id, hint: data.type ?? "" };
          })
        );
        setArenaOptions(
          arenaSnap.docs.map(d => {
            const data = d.data();
            return { value: d.id, label: data.name ?? d.id, hint: data.shape ?? "" };
          })
        );
      } catch { /* silently fail — options stay empty */ }
      finally { setLoading(false); }
    })();
  }, []);

  const canStart = selectedBey && selectedArena;

  const handleStart = () => {
    setBeyblade(selectedBey);
    setArena(selectedArena);
    navigate(playPath);
  };

  return (
    <div style={{ minHeight: "100vh", background: C.bg0, display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}>
      <div style={{ background: C.bg1, border: `1px solid ${C.border}`, borderRadius: 16, padding: 32, width: "100%", maxWidth: 480 }}>
        <h1 style={{ fontSize: 22, fontWeight: 700, color: C.text, marginBottom: 6 }}>Tryout Mode</h1>
        <p style={{ color: C.faint, fontSize: 13, marginBottom: 28 }}>
          Practice solo with any beyblade and arena. No ranking impact.
        </p>

        <div style={{ marginBottom: 20 }}>
          <label style={{ display: "block", fontSize: 12, color: C.muted, fontWeight: 600, marginBottom: 6 }}>
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

        <div style={{ marginBottom: 28 }}>
          <label style={{ display: "block", fontSize: 12, color: C.muted, fontWeight: 600, marginBottom: 6 }}>
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

        <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
          <button onClick={() => navigate(-1)}
            style={{ padding: "10px 20px", borderRadius: 8, fontSize: 13, border: `1px solid ${C.border}`, background: "transparent", color: C.muted, cursor: "pointer" }}>
            Back
          </button>
          <button onClick={handleStart} disabled={!canStart}
            style={{ padding: "10px 24px", borderRadius: 8, fontSize: 13, fontWeight: 600, border: "none",
              background: canStart ? C.blue : C.bg3, color: canStart ? "#fff" : C.faint,
              cursor: canStart ? "pointer" : "not-allowed" }}>
            Start Tryout
          </button>
        </div>
      </div>
    </div>
  );
}
