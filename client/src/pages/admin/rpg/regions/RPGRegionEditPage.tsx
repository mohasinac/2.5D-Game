import { useState, useEffect } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { doc, getDoc, setDoc, deleteDoc } from "firebase/firestore";
import { db, COLLECTIONS } from "@/lib/firebase";
import { LBL, INP, TEXTAREA, BTN_PRIMARY, BTN_DANGER, CARD, safeJsonParse } from "../rpgAdminShared";

export default function RPGRegionEditPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [displayName, setDisplayName] = useState("");
  const [country, setCountry] = useState("");
  const [description, setDescription] = useState("");
  const [mapIds, setMapIds] = useState("");
  const [hubMapId, setHubMapId] = useState("");
  const [connectionsJson, setConnectionsJson] = useState("[]");
  const [unlockGateJson, setUnlockGateJson] = useState("{}");
  const [worldMapX, setWorldMapX] = useState(0);
  const [worldMapY, setWorldMapY] = useState(0);
  const [bgmTrackId, setBgmTrackId] = useState("");
  const [arcIds, setArcIds] = useState("");

  useEffect(() => {
    if (!id) return;
    (async () => {
      try {
        const snap = await getDoc(doc(db, COLLECTIONS.RPG_REGIONS, id));
        if (!snap.exists()) return;
        const d = snap.data();
        setDisplayName(d.displayName ?? "");
        setCountry(d.country ?? "");
        setDescription(d.description ?? "");
        setMapIds((d.mapIds ?? []).join(", "));
        setHubMapId(d.hubMapId ?? "");
        setConnectionsJson(JSON.stringify(d.connections ?? [], null, 2));
        setUnlockGateJson(JSON.stringify(d.unlockGate ?? {}, null, 2));
        setWorldMapX(d.worldMapTile?.x ?? 0);
        setWorldMapY(d.worldMapTile?.y ?? 0);
        setBgmTrackId(d.bgmTrackId ?? "");
        setArcIds((d.arcIds ?? []).join(", "));
      } catch (e) { console.error(e); }
      finally { setLoading(false); }
    })();
  }, [id]);

  const handleSave = async () => {
    if (!id) return;
    setSaving(true);
    try {
      await setDoc(doc(db, COLLECTIONS.RPG_REGIONS, id), {
        displayName, country, description,
        mapIds: mapIds.split(",").map(s => s.trim()).filter(Boolean),
        hubMapId,
        connections: safeJsonParse(connectionsJson, []),
        unlockGate: safeJsonParse(unlockGateJson, undefined),
        worldMapTile: { x: worldMapX, y: worldMapY },
        bgmTrackId,
        arcIds: arcIds.split(",").map(s => s.trim()).filter(Boolean),
      });
      navigate("/admin/rpg/regions");
    } catch (e) { console.error(e); }
    finally { setSaving(false); }
  };

  const handleDelete = async () => {
    if (!id || !confirm(`Delete region "${id}"?`)) return;
    await deleteDoc(doc(db, COLLECTIONS.RPG_REGIONS, id));
    navigate("/admin/rpg/regions");
  };

  if (loading) return <div className="p-6 text-gray-500 text-sm">Loading...</div>;

  return (
    <div className="p-4 sm:p-6 w-full max-w-3xl">
      <div className="mb-5">
        <Link to="/admin/rpg/regions" className="text-blue-400 text-sm hover:underline">&larr; Back to Regions</Link>
        <h1 className="text-[22px] font-bold text-white mt-2">Edit Region: {id}</h1>
      </div>
      <div className={CARD + " space-y-4"}>
        <div><label className={LBL}>Display Name</label><input className={INP} value={displayName} onChange={e => setDisplayName(e.target.value)} /></div>
        <div><label className={LBL}>Country</label><input className={INP} value={country} onChange={e => setCountry(e.target.value)} /></div>
        <div><label className={LBL}>Description</label><textarea className={TEXTAREA} value={description} onChange={e => setDescription(e.target.value)} rows={3} /></div>
        <div><label className={LBL}>Map IDs (comma separated)</label><input className={INP} value={mapIds} onChange={e => setMapIds(e.target.value)} /></div>
        <div><label className={LBL}>Hub Map ID</label><input className={INP} value={hubMapId} onChange={e => setHubMapId(e.target.value)} /></div>
        <div><label className={LBL}>Connections (JSON)</label><textarea className={TEXTAREA} value={connectionsJson} onChange={e => setConnectionsJson(e.target.value)} rows={4} /></div>
        <div><label className={LBL}>Unlock Gate (JSON)</label><textarea className={TEXTAREA} value={unlockGateJson} onChange={e => setUnlockGateJson(e.target.value)} rows={3} /></div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div><label className={LBL}>World Map Tile X</label><input type="number" className={INP} value={worldMapX} onChange={e => setWorldMapX(+e.target.value)} /></div>
          <div><label className={LBL}>World Map Tile Y</label><input type="number" className={INP} value={worldMapY} onChange={e => setWorldMapY(+e.target.value)} /></div>
        </div>
        <div><label className={LBL}>BGM Track ID</label><input className={INP} value={bgmTrackId} onChange={e => setBgmTrackId(e.target.value)} /></div>
        <div><label className={LBL}>Arc IDs (comma separated)</label><input className={INP} value={arcIds} onChange={e => setArcIds(e.target.value)} /></div>
        <div className="flex gap-3">
          <button onClick={handleSave} disabled={saving} className={BTN_PRIMARY}>{saving ? "Saving..." : "Save Changes"}</button>
          <button onClick={handleDelete} className={BTN_DANGER}>Delete</button>
        </div>
      </div>
    </div>
  );
}
