import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db, COLLECTIONS } from "@/lib/firebase";
import { useAuth } from "@/contexts/AuthContext";

interface BeyStats {
  id: string;
  name: string;
  type: string;
  attack: number;
  defense: number;
  stamina: number;
  specialMoveId?: string;
  comboIds?: string[];
}

const TYPE_COLORS: Record<string, string> = {
  attack: "bg-red-600",
  defense: "bg-blue-600",
  stamina: "bg-green-600",
  balanced: "bg-yellow-600",
};

function StatBar({ label, value, max, color }: { label: string; value: number; max: number; color: string }) {
  const pct = Math.min((value / max) * 100, 100);
  return (
    <div className="flex items-center gap-2">
      <span className="text-[11px] text-theme-muted w-14 shrink-0">{label}</span>
      <div className="flex-1 h-2 rounded-full bg-bg0 overflow-hidden">
        <div className={`h-full rounded-full ${color}`} style={{ width: `${pct}%` }} />
      </div>
      <span className="text-[11px] text-theme-faint w-8 text-right">{value}</span>
    </div>
  );
}

export default function MyBeysPage() {
  const { currentUser } = useAuth();
  const [beys, setBeys] = useState<BeyStats[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedId, setSelectedId] = useState<string>(
    () => localStorage.getItem("selectedBeySystemId") ?? ""
  );

  useEffect(() => {
    if (!currentUser) {
      setLoading(false);
      return;
    }

    const q = query(
      collection(db, COLLECTIONS.BEYBLADE_STATS),
      where("userId", "==", currentUser.uid)
    );

    getDocs(q)
      .then((snap) => {
        const list: BeyStats[] = snap.docs.map((d) => ({
          id: d.id,
          ...(d.data() as Omit<BeyStats, "id">),
        }));
        setBeys(list);
      })
      .catch((err) => {
        console.error("Failed to load beyblades:", err);
      })
      .finally(() => setLoading(false));
  }, [currentUser]);

  function handleSelect(id: string) {
    setSelectedId(id);
    localStorage.setItem("selectedBeySystemId", id);
  }

  return (
    <div className="h-dvh overflow-hidden flex flex-col bg-bg0" style={{ boxSizing: 'border-box' }}>
      <div className="max-w-4xl mx-auto w-full flex flex-col" style={{ flex: 1, minHeight: 0, padding: '2rem', overflowY: 'auto' }} data-testid="scroll-body">
        <div className="flex items-center gap-4 mb-8">
          <Link
            to="/"
            className="py-2 px-4 bg-bg2 rounded-xl border border-border-c text-theme-muted text-sm no-underline hover:border-theme-blue transition-colors"
          >
            Back
          </Link>
          <h1 className="text-3xl font-bold text-theme-text">My Beyblades</h1>
        </div>

        {loading && (
          <div className="text-center py-20 text-theme-muted">Loading collection...</div>
        )}

        {!loading && !currentUser && (
          <div className="text-center py-20 text-theme-muted">
            Sign in to view your beyblade collection.
          </div>
        )}

        {!loading && currentUser && beys.length === 0 && (
          <div className="text-center py-20 text-theme-muted">
            No beyblades found. Create one in the admin panel or join a battle to get started.
          </div>
        )}

        {!loading && beys.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {beys.map((bey) => {
              const isActive = selectedId === bey.id;
              return (
                <div
                  key={bey.id}
                  className={`p-5 bg-bg2 rounded-2xl border transition-colors ${
                    isActive ? "border-theme-blue" : "border-border-c"
                  }`}
                >
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="text-lg font-bold text-theme-text">{bey.name}</h3>
                    <span
                      className={`text-[11px] font-semibold uppercase px-2 py-0.5 rounded-full text-white ${
                        TYPE_COLORS[bey.type] ?? "bg-gray-600"
                      }`}
                    >
                      {bey.type}
                    </span>
                  </div>

                  <div className="flex flex-col gap-1.5 mb-4">
                    <StatBar label="Attack" value={bey.attack} max={150} color="bg-red-500" />
                    <StatBar label="Defense" value={bey.defense} max={150} color="bg-blue-500" />
                    <StatBar label="Stamina" value={bey.stamina} max={150} color="bg-green-500" />
                  </div>

                  <button
                    onClick={() => handleSelect(bey.id)}
                    disabled={isActive}
                    className={`w-full py-2 rounded-xl text-sm font-semibold transition-colors ${
                      isActive
                        ? "bg-theme-blue/20 text-theme-blue cursor-default"
                        : "bg-bg0 text-theme-muted border border-border-c hover:border-theme-blue hover:text-theme-blue"
                    }`}
                  >
                    {isActive ? "Active" : "Select as Active"}
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
