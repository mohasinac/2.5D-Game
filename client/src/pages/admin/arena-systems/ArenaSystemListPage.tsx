import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { collection, getDocs } from "firebase/firestore";
import { db, COLLECTIONS } from "@/lib/firebase";
import { ArenaSystem } from "@/types/arenaSystem";
import { C } from "@/styles/theme";

export function ArenaSystemListPage() {
  const navigate = useNavigate();
  const [systems, setSystems] = useState<ArenaSystem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadSystems = async () => {
      try {
        const snapshot = await getDocs(collection(db, COLLECTIONS.ARENA_SYSTEMS));
        const data = snapshot.docs.map((doc) => doc.data() as ArenaSystem);
        setSystems(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadSystems();
  }, []);

  if (loading) {
    return (
      <div style={{ padding: "40px 20px", textAlign: "center", color: C.muted }}>
        Loading arena systems...
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ padding: "40px 20px", textAlign: "center", color: C.red }}>
        Error: {error}
      </div>
    );
  }

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
        <h2 style={{ color: C.text, fontSize: 20, fontWeight: 700, margin: 0 }}>
          Arena Systems (2.5D)
        </h2>
        <button
          onClick={() => navigate("/admin/arena-systems/create")}
          style={{
            padding: "8px 16px",
            background: C.blue,
            color: C.white,
            border: "none",
            borderRadius: 6,
            fontSize: 12,
            fontWeight: 700,
            cursor: "pointer",
          }}
        >
          + Create Arena System
        </button>
      </div>

      {systems.length === 0 ? (
        <div style={{ padding: "60px 20px", textAlign: "center", color: C.muted }}>
          <p>No arena systems yet.</p>
          <Link
            to="/admin/arena-systems/create"
            style={{ color: C.blue, textDecoration: "none", fontSize: 12 }}
          >
            Create one
          </Link>
        </div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 16 }}>
          {systems.map((system) => (
            <div
              key={system.id}
              style={{
                background: C.bg1,
                borderRadius: 8,
                border: `1px solid ${C.border}`,
                padding: 16,
                cursor: "pointer",
                transition: "all 150ms",
              }}
              onClick={() => navigate(`/admin/arena-systems/${system.id}`)}
            >
              <h3 style={{ color: C.text, fontSize: 14, fontWeight: 700, marginBottom: 4, marginTop: 0 }}>
                {system.displayName}
              </h3>
              <div style={{ display: "flex", gap: 8, marginBottom: 8 }}>
                <span
                  style={{
                    fontSize: 10,
                    background: C.blue + "22",
                    color: C.blue,
                    padding: "2px 8px",
                    borderRadius: 4,
                    textTransform: "capitalize",
                  }}
                >
                  {system.elevationMap.type}
                </span>
                <span
                  style={{
                    fontSize: 10,
                    background: C.purple + "22",
                    color: C.purple,
                    padding: "2px 8px",
                    borderRadius: 4,
                    textTransform: "capitalize",
                  }}
                >
                  {system.difficulty || "medium"}
                </span>
              </div>
              <p style={{ color: C.muted, fontSize: 11, marginBottom: 8, marginTop: 0, lineHeight: 1.4 }}>
                {system.description || "No description"}
              </p>
              <div style={{ fontSize: 10, color: C.muted, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 4 }}>
                <div>Shape: {system.shape}</div>
                <div>Theme: {system.theme}</div>
                <div>Wall: {system.wallProfile.baseHeight}mm</div>
                <div>Gravity: {(system.slopePhysics.gravityStrength * 100).toFixed(0)}%</div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
