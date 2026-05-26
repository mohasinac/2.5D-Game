import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { collection, getDocs } from "firebase/firestore";
import { db, COLLECTIONS } from "@/lib/firebase";
import { ArenaSystem } from "@/types/arenaSystem";

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
      <div className="py-10 px-5 text-center text-theme-muted">
        Loading arena systems...
      </div>
    );
  }

  if (error) {
    return (
      <div className="py-10 px-5 text-center text-theme-red">
        Error: {error}
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-5">
        <h2 className="text-theme-text text-[20px] font-bold m-0">
          Arena Systems (2.5D)
        </h2>
        <button
          onClick={() => navigate("/admin/arena-systems/create")}
          className="px-4 py-2 bg-theme-blue text-white border-none rounded-md text-[12px] font-bold cursor-pointer"
        >
          + Create Arena System
        </button>
      </div>

      {systems.length === 0 ? (
        <div className="py-[60px] px-5 text-center text-theme-muted">
          <p>No arena systems yet.</p>
          <Link
            to="/admin/arena-systems/create"
            className="text-theme-blue no-underline text-[12px]"
          >
            Create one
          </Link>
        </div>
      ) : (
        <div className="grid gap-4 grid-cols-[repeat(auto-fill,minmax(280px,1fr))]">
          {systems.map((system) => (
            <div
              key={system.id}
              className="bg-bg1 rounded-lg border border-border-c p-4 cursor-pointer transition-all duration-150"
              onClick={() => navigate(`/admin/arena-systems/${system.id}`)}
            >
              <h3 className="text-theme-text text-[14px] font-bold mb-1 mt-0">
                {system.displayName}
              </h3>
              <div className="flex gap-2 mb-2">
                <span className="text-[10px] px-2 py-0.5 rounded capitalize bg-blue-13 text-theme-blue">
                  {system.elevationMap.type}
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded capitalize bg-purple-10 text-theme-purple">
                  {system.difficulty || "medium"}
                </span>
              </div>
              <p className="text-theme-muted text-[11px] mb-2 mt-0 leading-[1.4]">
                {system.description || "No description"}
              </p>
              <div className="text-[10px] text-theme-muted grid grid-cols-2 gap-1">
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
