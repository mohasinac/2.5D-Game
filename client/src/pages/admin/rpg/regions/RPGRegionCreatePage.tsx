import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { doc, setDoc } from "firebase/firestore";
import { db, COLLECTIONS } from "@/lib/firebase";
import { LBL, INP, TEXTAREA, BTN_PRIMARY, CARD, slugify, safeJsonParse } from "../rpgAdminShared";

export default function RPGRegionCreatePage() {
  const navigate = useNavigate();
  const [saving, setSaving] = useState(false);
  const [id, setId] = useState("");
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

  const handleSave = async () => {
    const docId = id || slugify(displayName);
    if (!docId) return;
    setSaving(true);
    try {
      await setDoc(doc(db, COLLECTIONS.RPG_REGIONS, docId), {
        displayName,
        country,
        description,
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

  return (
    <div className="p-6 w-full max-w-3xl">
      <div className="mb-5">
        <Link to="/admin/rpg/regions" className="text-blue-400 text-sm hover:underline">&larr; Back to Regions</Link>
        <h1 className="text-[22px] font-bold text-white mt-2">Create Region</h1>
      </div>
      <div className={CARD + " space-y-4"}>
        <div><label className={LBL}>ID (auto from name if empty)</label><input className={INP} value={id} onChange={e => setId(e.target.value)} placeholder="e.g. kanto" /></div>
        <div><label className={LBL}>Display Name</label><input className={INP} value={displayName} onChange={e => setDisplayName(e.target.value)} /></div>
        <div><label className={LBL}>Country</label><input className={INP} value={country} onChange={e => setCountry(e.target.value)} /></div>
        <div><label className={LBL}>Description</label><textarea className={TEXTAREA} value={description} onChange={e => setDescription(e.target.value)} rows={3} /></div>
        <div><label className={LBL}>Map IDs (comma separated)</label><input className={INP} value={mapIds} onChange={e => setMapIds(e.target.value)} /></div>
        <div><label className={LBL}>Hub Map ID</label><input className={INP} value={hubMapId} onChange={e => setHubMapId(e.target.value)} /></div>
        <div><label className={LBL}>Connections (JSON)</label><textarea className={TEXTAREA} value={connectionsJson} onChange={e => setConnectionsJson(e.target.value)} rows={4} /></div>
        <div><label className={LBL}>Unlock Gate (JSON)</label><textarea className={TEXTAREA} value={unlockGateJson} onChange={e => setUnlockGateJson(e.target.value)} rows={3} /></div>
        <div className="grid grid-cols-2 gap-4">
          <div><label className={LBL}>World Map Tile X</label><input type="number" className={INP} value={worldMapX} onChange={e => setWorldMapX(+e.target.value)} /></div>
          <div><label className={LBL}>World Map Tile Y</label><input type="number" className={INP} value={worldMapY} onChange={e => setWorldMapY(+e.target.value)} /></div>
        </div>
        <div><label className={LBL}>BGM Track ID</label><input className={INP} value={bgmTrackId} onChange={e => setBgmTrackId(e.target.value)} /></div>
        <div><label className={LBL}>Arc IDs (comma separated)</label><input className={INP} value={arcIds} onChange={e => setArcIds(e.target.value)} /></div>
        <button onClick={handleSave} disabled={saving} className={BTN_PRIMARY}>{saving ? "Saving..." : "Create Region"}</button>
      </div>
    </div>
  );
}
