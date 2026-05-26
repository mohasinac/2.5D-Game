import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { collection, getDocs, doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useRPGStore } from "../stores/rpgStore";
import { RouteCard } from "../components/route-select/RouteCard";
import { RoutePreview } from "../components/route-select/RoutePreview";
import type { RouteDef, WorldConfig } from "../data/schemas";
import { motion } from "framer-motion";

export default function RPGRouteSelectPage() {
  const navigate = useNavigate();
  const setRouteId = useRPGStore((s) => s.setRouteId);
  const setArcId = useRPGStore((s) => s.setArcId);
  const setCurrentMap = useRPGStore((s) => s.setCurrentMap);
  const setPlayerTile = useRPGStore((s) => s.setPlayerTile);
  const setPlayerFacing = useRPGStore((s) => s.setPlayerFacing);

  const [routes, setRoutes] = useState<RouteDef[]>([]);
  const [selectedRouteId, setSelectedRouteId] = useState<string | null>(null);
  const [worldConfig, setWorldConfig] = useState<WorldConfig | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const configSnap = await getDoc(doc(db, "rpg_config", "world"));
        const config = configSnap.exists() ? (configSnap.data() as WorldConfig) : null;
        setWorldConfig(config);

        const routesSnap = await getDocs(collection(db, "rpg_routes"));
        const routeDefs: RouteDef[] = [];
        routesSnap.forEach((d) => routeDefs.push(d.data() as RouteDef));
        setRoutes(routeDefs);

        if (routeDefs.length > 0) setSelectedRouteId(routeDefs[0].id);
      } catch (err) {
        console.error("[RPGRouteSelectPage] Failed to load routes:", err);
      }
      setLoading(false);
    }
    loadData();
  }, []);

  const selectedRoute = routes.find((r) => r.id === selectedRouteId) ?? null;

  const handleConfirm = () => {
    if (!selectedRoute) return;
    setRouteId(selectedRoute.id);
    setArcId(worldConfig?.startArcId ?? "season1");
    setCurrentMap(selectedRoute.startingMapId);
    setPlayerTile(selectedRoute.startingTile);
    setPlayerFacing(selectedRoute.startingFacing);
    navigate("/rpg/game");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-amber-400 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-950 via-gray-900 to-gray-950 flex flex-col items-center justify-center p-8">
      <motion.h1
        initial={{ y: -30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="text-amber-400 text-3xl font-bold mb-2 tracking-wider"
      >
        Choose Your Route
      </motion.h1>
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="text-gray-400 text-sm mb-8"
      >
        Your journey begins here. Select a protagonist.
      </motion.p>

      <div className="flex gap-8 mb-8 flex-wrap justify-center">
        {routes.map((route) => (
          <RouteCard
            key={route.id}
            route={route}
            selected={route.id === selectedRouteId}
            onSelect={() => setSelectedRouteId(route.id)}
          />
        ))}
      </div>

      <RoutePreview route={selectedRoute} onConfirm={handleConfirm} />
    </div>
  );
}
